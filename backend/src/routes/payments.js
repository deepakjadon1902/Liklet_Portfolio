const express = require("express");
const crypto = require("crypto");
const Razorpay = require("razorpay");

const { requireAuth } = require("../middleware/auth");
const { Service } = require("../models/Service");
const { Package } = require("../models/Package");
const { Order } = require("../models/Order");
const { Payment } = require("../models/Payment");

const paymentsRouter = express.Router();

function getRazorpayClient() {
  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;
  if (!keyId || !keySecret) throw new Error("Missing Razorpay keys");
  return new Razorpay({ key_id: keyId, key_secret: keySecret });
}

paymentsRouter.post("/create", requireAuth(), async (req, res) => {
  const { packageId, platformDetails } = req.body || {};
  if (!packageId) return res.status(400).json({ error: "Missing packageId" });

  const pkg = await Package.findById(packageId).lean();
  if (!pkg || !pkg.isActive) return res.status(404).json({ error: "Package not found" });
  const service = await Service.findById(pkg.serviceId).lean();
  if (!service || !service.isActive) return res.status(404).json({ error: "Service not found" });

  const order = await Order.create({
    userId: req.user._id,
    serviceId: service._id,
    packageId: pkg._id,
    platformDetails: platformDetails || {},
    status: "pending",
  });

  const amountPaise = Math.round(Number(pkg.priceInr) * 100);
  const currency = "INR";

  const razorpay = getRazorpayClient();
  const rpOrder = await razorpay.orders.create({
    amount: amountPaise,
    currency,
    receipt: `order_${order._id.toString()}`,
    notes: {
      service: service.slug,
      package: pkg.name,
      orderId: order._id.toString(),
    },
  });

  const payment = await Payment.create({
    userId: req.user._id,
    orderId: order._id,
    amountInr: pkg.priceInr,
    currency,
    status: "created",
    razorpayOrderId: rpOrder.id,
  });

  res.json({
    ok: true,
    keyId: process.env.RAZORPAY_KEY_ID,
    razorpayOrderId: rpOrder.id,
    amountPaise,
    currency,
    orderId: order._id.toString(),
    paymentId: payment._id.toString(),
  });
});

paymentsRouter.post("/verify", requireAuth(), async (req, res) => {
  const { orderId, razorpayOrderId, razorpayPaymentId, razorpaySignature } = req.body || {};
  if (!orderId || !razorpayOrderId || !razorpayPaymentId || !razorpaySignature) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const keySecret = process.env.RAZORPAY_KEY_SECRET;
  if (!keySecret) return res.status(500).json({ error: "Missing Razorpay secret" });

  const expected = crypto
    .createHmac("sha256", keySecret)
    .update(`${razorpayOrderId}|${razorpayPaymentId}`)
    .digest("hex");

  if (expected !== razorpaySignature) {
    return res.status(400).json({ error: "Invalid signature" });
  }

  const payment = await Payment.findOne({ orderId, userId: req.user._id });
  if (!payment) return res.status(404).json({ error: "Payment not found" });

  payment.status = "paid";
  payment.razorpayOrderId = razorpayOrderId;
  payment.razorpayPaymentId = razorpayPaymentId;
  payment.razorpaySignature = razorpaySignature;
  await payment.save();

  const order = await Order.findOne({ _id: orderId, userId: req.user._id });
  if (order) {
    order.status = "processing";
    await order.save();
  }

  res.json({ ok: true });
});

module.exports = { paymentsRouter };

