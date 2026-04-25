const express = require("express");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const { OAuth2Client } = require("google-auth-library");
const { User } = require("../models/User");
const { signJwt } = require("../utils/jwt");

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
  const from = process.env.EMAIL_FROM || "support@liklet.com";

  if (!host || !user || !pass) {
    // eslint-disable-next-line no-console
    console.log(`[backend] EMAIL VERIFICATION CODE for ${to}: ${code}`);
    return;
  }

  const transporter = nodemailer.createTransport({
    host,
    port,
    secure: false,
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

module.exports = { authRouter };
