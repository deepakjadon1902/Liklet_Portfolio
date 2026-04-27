const express = require("express");
const { requireAdmin } = require("../middleware/auth");
const { requireDb } = require("../middleware/requireDb");
const { User } = require("../models/User");
const { Service } = require("../models/Service");
const { Package } = require("../models/Package");
const { Order } = require("../models/Order");
const { Payment } = require("../models/Payment");
const { signJwt } = require("../utils/jwt");

const adminRouter = express.Router();

function getStaticAdminCreds() {
  return {
    email: (process.env.ADMIN_STATIC_EMAIL || "liket108admin@gmail.com").toLowerCase().trim(),
    password: process.env.ADMIN_STATIC_PASSWORD || "liket108admin@",
  };
}

adminRouter.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body || {};
    if (!email || !password) return res.status(400).json({ error: "Missing required fields" });

    const creds = getStaticAdminCreds();
    const normalizedEmail = String(email).toLowerCase().trim();
    if (normalizedEmail !== creds.email || String(password) !== creds.password) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = signJwt(
      { sub: "admin:static", role: "admin", email: creds.email },
      { expiresIn: "3650d" }
    );

    res.json({ ok: true, token, user: { email: creds.email, role: "admin" } });
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error("[backend] admin login error", err);
    return res.status(500).json({ error: "Admin login failed" });
  }
});

adminRouter.use(requireDb());
adminRouter.use(requireAdmin());

adminRouter.get("/dashboard", async (_req, res) => {
  const [users, services, orders, payments] = await Promise.all([
    User.countDocuments({}),
    Service.countDocuments({}),
    Order.countDocuments({}),
    Payment.countDocuments({}),
  ]);
  res.json({ ok: true, stats: { users, services, orders, payments } });
});

adminRouter.get("/users", async (_req, res) => {
  const users = await User.find({})
    .sort({ createdAt: -1 })
    .select({ name: 1, email: 1, phone: 1, role: 1, isEmailVerified: 1, createdAt: 1 })
    .lean();
  res.json({ users });
});

adminRouter.get("/services", async (_req, res) => {
  const services = await Service.find({}).sort({ createdAt: -1 }).lean();
  res.json({ services });
});

adminRouter.post("/services", async (req, res) => {
  const { type, slug, name, tagline, logoUrl, features, isActive } = req.body || {};
  if (!type || !slug || !name) return res.status(400).json({ error: "Missing required fields" });
  const service = await Service.create({
    type,
    slug: String(slug).toLowerCase().trim(),
    name: String(name).trim(),
    tagline: tagline ? String(tagline).trim() : "",
    logoUrl: logoUrl ? String(logoUrl).trim() : "",
    features: Array.isArray(features) ? features : [],
    isActive: isActive !== false,
  });
  res.json({ ok: true, service });
});

adminRouter.patch("/services/:id", async (req, res) => {
  const { id } = req.params;
  const service = await Service.findByIdAndUpdate(id, req.body || {}, { new: true });
  if (!service) return res.status(404).json({ error: "Not found" });
  res.json({ ok: true, service });
});

adminRouter.delete("/services/:id", async (req, res) => {
  const { id } = req.params;
  await Service.findByIdAndDelete(id);
  await Package.deleteMany({ serviceId: id });
  res.json({ ok: true });
});

adminRouter.get("/packages", async (req, res) => {
  const serviceId = req.query.serviceId;
  const query = serviceId ? { serviceId } : {};
  const packages = await Package.find(query).sort({ createdAt: -1 }).lean();
  res.json({ packages });
});

adminRouter.post("/packages", async (req, res) => {
  const { serviceId, name, priceInr, priceUsd, interval, description, features, isPopular, isActive } = req.body || {};
  if (!serviceId || !name || priceInr == null) return res.status(400).json({ error: "Missing required fields" });
  const pkg = await Package.create({
    serviceId,
    name: String(name).trim(),
    priceInr: Number(priceInr),
    priceUsd: priceUsd == null ? undefined : Number(priceUsd),
    interval: interval ? String(interval) : "mo",
    description: description ? String(description) : "",
    features: Array.isArray(features) ? features : [],
    isPopular: Boolean(isPopular),
    isActive: isActive !== false,
  });
  res.json({ ok: true, package: pkg });
});

adminRouter.patch("/packages/:id", async (req, res) => {
  const { id } = req.params;
  const pkg = await Package.findByIdAndUpdate(id, req.body || {}, { new: true });
  if (!pkg) return res.status(404).json({ error: "Not found" });
  res.json({ ok: true, package: pkg });
});

adminRouter.delete("/packages/:id", async (req, res) => {
  const { id } = req.params;
  await Package.findByIdAndDelete(id);
  res.json({ ok: true });
});

adminRouter.get("/orders", async (_req, res) => {
  const orders = await Order.find({})
    .sort({ createdAt: -1 })
    .populate("userId", "name email phone")
    .populate("serviceId", "name slug type")
    .populate("packageId", "name priceInr")
    .lean();
  res.json({ orders });
});

adminRouter.patch("/orders/:id", async (req, res) => {
  const { id } = req.params;
  const order = await Order.findByIdAndUpdate(id, req.body || {}, { new: true });
  if (!order) return res.status(404).json({ error: "Not found" });
  res.json({ ok: true, order });
});

adminRouter.get("/payments", async (_req, res) => {
  const payments = await Payment.find({})
    .sort({ createdAt: -1 })
    .populate("userId", "name email")
    .populate("orderId", "status")
    .lean();
  res.json({ payments });
});

module.exports = { adminRouter };
