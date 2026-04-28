const express = require("express");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const { OAuth2Client } = require("google-auth-library");
const { User } = require("../models/User");
const { signJwt, verifyJwt } = require("../utils/jwt");

const authRouter = express.Router();

function signToken(user) {
  return signJwt(
    { sub: user._id.toString(), role: user.role },
    { expiresIn: "30d" }
  );
}

function getAdminEmails() {
  const raw = process.env.ADMIN_EMAILS || "";
  return raw
    .split(",")
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);
}

function hashCode(code) {
  return crypto.createHash("sha256").update(code).digest("hex");
}

async function sendVerificationEmail({ to, code }) {
  const host = process.env.SMTP_HOST;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const port = process.env.SMTP_PORT ? Number(process.env.SMTP_PORT) : 587;
  const from = process.env.EMAIL_FROM || user || "mail.liklet@gmail.com";

  if (!host || !user || !pass) {
    // eslint-disable-next-line no-console
    console.log(`[backend] EMAIL VERIFICATION CODE for ${to}: ${code}`);
    return;
  }

  const transporter = nodemailer.createTransport({
    host,
    port,
    secure: false,
    requireTLS: true,
    auth: { user, pass },
  });

  await transporter.sendMail({
    from,
    to,
    subject: "Verify your email - Liklet",
    text: `Your verification code is: ${code}`,
  });
}

authRouter.post("/register", async (req, res) => {
  const { name, email, phone, password } = req.body || {};
  if (!name || !email || !password) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const normalizedEmail = String(email).toLowerCase().trim();
  const existing = await User.findOne({ email: normalizedEmail }).lean();
  if (existing) return res.status(409).json({ error: "Email already in use" });

  const passwordHash = await bcrypt.hash(String(password), 10);

  const code = String(Math.floor(100000 + Math.random() * 900000));
  const expiresAt = new Date(Date.now() + 30 * 60 * 1000);

  const role = getAdminEmails().includes(normalizedEmail) ? "admin" : "user";

  const user = await User.create({
    name: String(name).trim(),
    email: normalizedEmail,
    phone: phone ? String(phone).trim() : "",
    passwordHash,
    role,
    isEmailVerified: false,
    emailVerificationCodeHash: hashCode(code),
    emailVerificationExpiresAt: expiresAt,
  });

  await sendVerificationEmail({ to: normalizedEmail, code });

  res.json({
    ok: true,
    message: "Registered. Please verify your email.",
    user: { id: user._id.toString(), email: user.email, name: user.name, isEmailVerified: user.isEmailVerified },
  });
});

authRouter.post("/verify-email", async (req, res) => {
  const { email, code } = req.body || {};
  if (!email || !code) return res.status(400).json({ error: "Missing required fields" });

  const normalizedEmail = String(email).toLowerCase().trim();
  const user = await User.findOne({ email: normalizedEmail });
  if (!user) return res.status(404).json({ error: "Not found" });
  if (user.isEmailVerified) return res.json({ ok: true });

  if (!user.emailVerificationCodeHash || !user.emailVerificationExpiresAt) {
    return res.status(400).json({ error: "No verification in progress" });
  }
  if (user.emailVerificationExpiresAt.getTime() < Date.now()) {
    return res.status(400).json({ error: "Code expired" });
  }

  if (hashCode(String(code).trim()) !== user.emailVerificationCodeHash) {
    return res.status(400).json({ error: "Invalid code" });
  }

  user.isEmailVerified = true;
  user.emailVerificationCodeHash = undefined;
  user.emailVerificationExpiresAt = undefined;
  await user.save();

  const token = signToken(user);
  res.json({
    ok: true,
    token,
    user: { id: user._id.toString(), email: user.email, name: user.name, role: user.role },
  });
});

authRouter.post("/login", async (req, res) => {
  const { email, password } = req.body || {};
  if (!email || !password) return res.status(400).json({ error: "Missing required fields" });

  const normalizedEmail = String(email).toLowerCase().trim();
  const user = await User.findOne({ email: normalizedEmail });
  if (!user || !user.passwordHash) return res.status(401).json({ error: "Invalid credentials" });

  const ok = await bcrypt.compare(String(password), user.passwordHash);
  if (!ok) return res.status(401).json({ error: "Invalid credentials" });

  if (!user.isEmailVerified) {
    return res.status(403).json({ error: "Email not verified" });
  }

  const token = signToken(user);
  res.json({
    ok: true,
    token,
    user: { id: user._id.toString(), email: user.email, name: user.name, role: user.role },
  });
});

authRouter.post("/google", async (req, res) => {
  const { idToken } = req.body || {};
  if (!idToken) return res.status(400).json({ error: "Missing idToken" });

  const clientId = process.env.GOOGLE_CLIENT_ID;
  if (!clientId) return res.status(500).json({ error: "Missing GOOGLE_CLIENT_ID" });

  const client = new OAuth2Client(clientId);
  const ticket = await client.verifyIdToken({ idToken, audience: clientId });
  const payload = ticket.getPayload();
  if (!payload || !payload.email || !payload.sub) {
    return res.status(401).json({ error: "Invalid Google token" });
  }

  const normalizedEmail = payload.email.toLowerCase().trim();
  const role = getAdminEmails().includes(normalizedEmail) ? "admin" : "user";

  const user = await User.findOneAndUpdate(
    { email: normalizedEmail },
    {
      $set: {
        name: payload.name || normalizedEmail.split("@")[0],
        googleSub: payload.sub,
        role,
        isEmailVerified: true,
        emailVerificationCodeHash: undefined,
        emailVerificationExpiresAt: undefined,
      },
      $setOnInsert: { phone: "" },
    },
    { upsert: true, new: true }
  );

  const token = signToken(user);
  res.json({
    ok: true,
    token,
    user: { id: user._id.toString(), email: user.email, name: user.name, role: user.role },
  });
});

function getFrontendBaseUrl() {
  const env = (process.env.FRONTEND_URL || "").trim();
  if (env) return env.replace(/\/+$/, "");

  const cors = (process.env.CORS_ORIGIN || "").split(",").map((s) => s.trim()).filter(Boolean);
  if (cors.length) return cors[0].replace(/\/+$/, "");

  return "http://localhost:8080";
}

function getBackendBaseUrl() {
  const explicit = (process.env.PUBLIC_BASE_URL || "").trim();
  if (explicit) return explicit.replace(/\/+$/, "");

  const render = (process.env.RENDER_EXTERNAL_URL || "").trim();
  if (render) return render.replace(/\/+$/, "");

  const port = process.env.PORT ? Number(process.env.PORT) : 5000;
  return `http://localhost:${port}`;
}

function getGoogleRedirectUri() {
  return `${getBackendBaseUrl()}/api/auth/google/callback`;
}

async function exchangeGoogleAuthCodeForTokens({ code, redirectUri }) {
  if (typeof fetch !== "function") throw new Error("fetch is not available in this Node runtime");

  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  if (!clientId) throw new Error("Missing GOOGLE_CLIENT_ID");
  if (!clientSecret) throw new Error("Missing GOOGLE_CLIENT_SECRET");

  const body = new URLSearchParams();
  body.set("code", code);
  body.set("client_id", clientId);
  body.set("client_secret", clientSecret);
  body.set("redirect_uri", redirectUri);
  body.set("grant_type", "authorization_code");

  const resp = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    body: body.toString(),
  });

  const text = await resp.text();
  let data;
  try {
    data = JSON.parse(text);
  } catch {
    data = null;
  }

  if (!resp.ok) {
    const message = data && typeof data === "object" && data.error_description ? data.error_description : text || "Token exchange failed";
    throw new Error(message);
  }

  return data;
}

authRouter.get("/google/start", async (req, res) => {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  if (!clientId) return res.status(500).send("Missing GOOGLE_CLIENT_ID");

  const redirect = typeof req.query.redirect === "string" && req.query.redirect.startsWith("/") ? req.query.redirect : "/";
  const state = signJwt({ typ: "google_oauth_state", redirect }, { expiresIn: "10m" });

  const redirectUri = getGoogleRedirectUri();
  const url = new URL("https://accounts.google.com/o/oauth2/v2/auth");
  url.searchParams.set("client_id", clientId);
  url.searchParams.set("redirect_uri", redirectUri);
  url.searchParams.set("response_type", "code");
  url.searchParams.set("scope", "openid email profile");
  url.searchParams.set("include_granted_scopes", "true");
  url.searchParams.set("prompt", "select_account");
  url.searchParams.set("state", state);

  return res.redirect(url.toString());
});

authRouter.get("/google/callback", async (req, res) => {
  const frontendBase = getFrontendBaseUrl();

  const error = typeof req.query.error === "string" ? req.query.error : "";
  if (error) return res.redirect(`${frontendBase}/auth#error=${encodeURIComponent(error)}`);

  const code = typeof req.query.code === "string" ? req.query.code : "";
  const state = typeof req.query.state === "string" ? req.query.state : "";
  if (!code || !state) return res.redirect(`${frontendBase}/auth#error=${encodeURIComponent("missing_code")}`);

  let redirectPath = "/";
  try {
    const payload = verifyJwt(state);
    if (!payload || payload.typ !== "google_oauth_state") throw new Error("Invalid state");
    if (typeof payload.redirect === "string" && payload.redirect.startsWith("/")) {
      redirectPath = payload.redirect;
    }
  } catch {
    return res.redirect(`${frontendBase}/auth#error=${encodeURIComponent("invalid_state")}`);
  }

  try {
    const redirectUri = getGoogleRedirectUri();
    const tokens = await exchangeGoogleAuthCodeForTokens({ code, redirectUri });
    const idToken = tokens && typeof tokens === "object" ? tokens.id_token : null;
    if (!idToken || typeof idToken !== "string") throw new Error("Missing id_token");

    const clientId = process.env.GOOGLE_CLIENT_ID;
    if (!clientId) throw new Error("Missing GOOGLE_CLIENT_ID");

    const client = new OAuth2Client(clientId);
    const ticket = await client.verifyIdToken({ idToken, audience: clientId });
    const googlePayload = ticket.getPayload();
    if (!googlePayload || !googlePayload.email || !googlePayload.sub) throw new Error("Invalid Google token");

    const normalizedEmail = googlePayload.email.toLowerCase().trim();
    const role = getAdminEmails().includes(normalizedEmail) ? "admin" : "user";

    const user = await User.findOneAndUpdate(
      { email: normalizedEmail },
      {
        $set: {
          name: googlePayload.name || normalizedEmail.split("@")[0],
          googleSub: googlePayload.sub,
          role,
          isEmailVerified: true,
          emailVerificationCodeHash: undefined,
          emailVerificationExpiresAt: undefined,
        },
        $setOnInsert: { phone: "" },
      },
      { upsert: true, new: true }
    );

    const token = signToken(user);
    return res.redirect(
      `${frontendBase}/auth#token=${encodeURIComponent(token)}&redirect=${encodeURIComponent(redirectPath)}`
    );
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error("[backend] google oauth callback error", err);
    return res.redirect(`${frontendBase}/auth#error=${encodeURIComponent("google_auth_failed")}`);
  }
});

module.exports = { authRouter };
