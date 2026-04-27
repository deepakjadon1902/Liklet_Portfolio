const express = require("express");
const { Service } = require("../models/Service");
const { Package } = require("../models/Package");
const { Order } = require("../models/Order");
const crypto = require("crypto");

const publicRouter = express.Router();

publicRouter.get("/services", async (req, res) => {
  const type = req.query.type;
  const query = { isActive: true };
  if (type) query.type = type;
  const services = await Service.find(query).sort({ createdAt: 1 }).lean();
  res.json({ services });
});

publicRouter.get("/services/:slug", async (req, res) => {
  const { slug } = req.params;
  const service = await Service.findOne({ slug, isActive: true }).lean();
  if (!service) return res.status(404).json({ error: "Not found" });
  const packages = await Package.find({ serviceId: service._id, isActive: true })
    .sort({ isPopular: -1, priceInr: 1 })
    .lean();
  res.json({ service, packages });
});

publicRouter.get("/packages/:id", async (req, res) => {
  const { id } = req.params;
  const pkg = await Package.findById(id).lean();
  if (!pkg || !pkg.isActive) return res.status(404).json({ error: "Not found" });

  const service = await Service.findById(pkg.serviceId).lean();
  if (!service || !service.isActive) return res.status(404).json({ error: "Not found" });

  res.json({ service: { _id: service._id, slug: service.slug, name: service.name }, package: pkg });
});

publicRouter.post("/orders/lookup", async (req, res) => {
  const items = (req.body && (req.body.orders || req.body.items)) || [];
  if (!Array.isArray(items) || items.length === 0) return res.json({ ok: true, orders: [] });

  const byId = new Map();
  for (const entry of items) {
    if (!entry || typeof entry !== "object") continue;
    const id = entry.id;
    const token = entry.token;
    if (typeof id === "string" && typeof token === "string") byId.set(id, token);
  }

  const ids = Array.from(byId.keys()).slice(0, 25);
  if (!ids.length) return res.json({ ok: true, orders: [] });

  const orders = await Order.find({ _id: { $in: ids } })
    .sort({ createdAt: -1 })
    .select({
      status: 1,
      createdAt: 1,
      publicTokenHash: 1,
      serviceName: 1,
      packageName: 1,
      amount: 1,
      currency: 1,
    })
    .lean();

  const out = [];
  for (const o of orders) {
    const expected = byId.get(o._id.toString());
    if (!expected) continue;
    const hash = crypto.createHash("sha256").update(expected).digest("hex");
    if (hash !== o.publicTokenHash) continue;
    out.push({
      _id: o._id.toString(),
      status: o.status,
      createdAt: o.createdAt,
      serviceName: o.serviceName,
      packageName: o.packageName,
      amount: o.amount,
      currency: o.currency,
    });
  }

  res.json({ ok: true, orders: out });
});

module.exports = { publicRouter };
