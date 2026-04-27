const express = require("express");
const nodemailer = require("nodemailer");

const publicContactRouter = express.Router();

function getContactRecipients() {
  const raw = process.env.CONTACT_EMAILS || process.env.ADMIN_EMAILS || "";
  const list = raw
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  if (list.length) return list;

  const fallback = (process.env.EMAIL_FROM || "mail.liklet@gmail.com").trim();
  return fallback ? [fallback] : [];
}

async function sendContactEmail({ subject, text }) {
  const host = process.env.SMTP_HOST;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const port = process.env.SMTP_PORT ? Number(process.env.SMTP_PORT) : 587;
  const from = process.env.EMAIL_FROM || "mail.liklet@gmail.com";

  const to = getContactRecipients();
  if (!to.length) return;

  if (!host || !user || !pass) {
    // eslint-disable-next-line no-console
    console.log(`[backend] CONTACT EMAIL (no SMTP configured): ${subject}\n${text}`);
    return;
  }

  const transporter = nodemailer.createTransport({
    host,
    port,
    secure: false,
    auth: { user, pass },
  });

  await transporter.sendMail({ from, to, subject, text });
}

publicContactRouter.post("/contact", async (req, res) => {
  const { name, email, phone, subject, message, pageTitle, company, address } = req.body || {};
  if (!name || !email || !message) return res.status(400).json({ error: "Missing required fields" });

  const subj = subject ? String(subject).trim() : "Contact Form";
  const title = pageTitle ? String(pageTitle).trim() : "Liklet";

  const text = [
    `Page: ${title}`,
    `Name: ${String(name).trim()}`,
    `Email: ${String(email).trim()}`,
    phone ? `Phone: ${String(phone).trim()}` : "",
    company ? `Company: ${String(company).trim()}` : "",
    address ? `Address: ${String(address).trim()}` : "",
    `Subject: ${subj}`,
    "",
    "Message:",
    String(message).trim(),
  ]
    .filter(Boolean)
    .join("\n");

  try {
    await sendContactEmail({ subject: `Liklet Contact: ${subj}`, text });
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error("[backend] contact email error", err);
  }

  res.json({ ok: true });
});

module.exports = { publicContactRouter };
