const express = require("express");
const { User } = require("../models/User");
const { Order } = require("../models/Order");

const accountRouter = express.Router();

function toProfile(user) {
  return {
    id: user._id.toString(),
    name: user.name || "",
    email: user.email || "",
    phone: user.phone || "",
    company: user.company || "",
    website: user.website || "",
    city: user.city || "",
    country: user.country || "",
    bio: user.bio || "",
    role: user.role || "user",
    isEmailVerified: Boolean(user.isEmailVerified),
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
}

function cleanText(value, maxLength) {
  if (value == null) return "";
  return String(value).trim().slice(0, maxLength);
}

accountRouter.get("/profile", async (req, res) => {
  const user = await User.findById(req.user._id).lean();
  if (!user) return res.status(404).json({ error: "User not found" });
  res.json({ ok: true, profile: toProfile(user) });
});

accountRouter.patch("/profile", async (req, res) => {
  const body = req.body || {};
  const name = cleanText(body.name, 120);
  if (!name) return res.status(400).json({ error: "Name is required" });

  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      $set: {
        name,
        phone: cleanText(body.phone, 40),
        company: cleanText(body.company, 120),
        website: cleanText(body.website, 180),
        city: cleanText(body.city, 80),
        country: cleanText(body.country, 80),
        bio: cleanText(body.bio, 600),
      },
    },
    { new: true }
  ).lean();

  if (!user) return res.status(404).json({ error: "User not found" });
  res.json({ ok: true, profile: toProfile(user) });
});

accountRouter.get("/orders", async (req, res) => {
  const orders = await Order.find({ userId: req.user._id })
    .sort({ createdAt: -1 })
    .select({
      serviceName: 1,
      packageName: 1,
      currency: 1,
      amount: 1,
      customerName: 1,
      customerEmail: 1,
      customerPhone: 1,
      platformDetails: 1,
      status: 1,
      createdAt: 1,
      updatedAt: 1,
    })
    .lean();

  res.json({
    ok: true,
    orders: orders.map((order) => ({
      _id: order._id.toString(),
      serviceName: order.serviceName || "",
      packageName: order.packageName || "",
      currency: order.currency || "INR",
      amount: order.amount || 0,
      customerName: order.customerName || "",
      customerEmail: order.customerEmail || "",
      customerPhone: order.customerPhone || "",
      platformDetails: order.platformDetails || {},
      status: order.status || "pending",
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
    })),
  });
});

module.exports = { accountRouter };
