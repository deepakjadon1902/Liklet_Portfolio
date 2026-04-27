const express = require("express");
const crypto = require("crypto");
const Razorpay = require("razorpay");

const { Service } = require("../models/Service");
const { Package } = require("../models/Package");
const { Order } = require("../models/Order");
const { Payment } = require("../models/Payment");
const { User } = require("../models/User");

const paymentsRouter = express.Router();

function getRazorpayClient() {
  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;
  if (!keyId || !keySecret) throw new Error("Missing Razorpay keys");
  return new Razorpay({ key_id: keyId, key_secret: keySecret });
}

function getFxInrToUsd() {
  const raw = process.env.FX_INR_TO_USD || process.env.INR_TO_USD || "";
  const n = Number(raw);
  return Number.isFinite(n) && n > 0 ? n : 0.012;
}

function sha256Hex(input) {
  return crypto.createHash("sha256").update(String(input)).digest("hex");
}

paymentsRouter.post("/create", async (req, res) => {
  const userId = req.user?._id;
  if (!userId) return res.status(401).json({ error: "Unauthorized" });

  const { packageId, platformDetails, currency, customer } = req.body || {};
  if (!packageId) return res.status(400).json({ error: "Missing packageId" });

  const normalizedCurrency = String(currency || "INR").toUpperCase();
  if (!["INR", "USD"].includes(normalizedCurrency)) return res.status(400).json({ error: "Invalid currency" });

  const name = customer && customer.name ? String(customer.name).trim() : "";
  const email = customer && customer.email ? String(customer.email).trim() : "";
  const phone = customer && customer.phone ? String(customer.phone).trim() : "";
  if (!name || !email || !phone) return res.status(400).json({ error: "Missing customer details" });

  // Save the booking phone number to the user profile (so it appears in Admin -> Users).
  if (phone) {
    await User.updateOne(
      { _id: userId, $or: [{ phone: { $exists: false } }, { phone: "" }, { phone: null }] },
      { $set: { phone } }
    );
  }

  const pkg = await Package.findById(packageId).lean();
  if (!pkg || !pkg.isActive) return res.status(404).json({ error: "Package not found" });
  const service = await Service.findById(pkg.serviceId).lean();
  if (!service || !service.isActive) return res.status(404).json({ error: "Service not found" });

  const amountInr = Number(pkg.priceInr || 0);
  const amountUsd = Number(pkg.priceUsd != null ? pkg.priceUsd : amountInr * getFxInrToUsd());

  const amount = normalizedCurrency === "USD" ? amountUsd : amountInr;
  const amountMinor = Math.round(Number(amount) * 100);
  if (!Number.isFinite(amountMinor) || amountMinor <= 0) return res.status(400).json({ error: "Invalid amount" });

  const orderToken = crypto.randomBytes(24).toString("hex");
  const publicTokenHash = sha256Hex(orderToken);

  const order = await Order.create({
    userId,
    serviceId: service._id,
    packageId: pkg._id,
    serviceName: service.name || service.slug,
    packageName: pkg.name,
    currency: normalizedCurrency,
    amount,
    customerName: name,
    customerEmail: email,
    customerPhone: phone,
    publicTokenHash,
    platformDetails: platformDetails || {},
    status: "pending",
  });

  let rpOrder;
  try {
    const razorpay = getRazorpayClient();
    rpOrder = await razorpay.orders.create({
      amount: amountMinor,
      currency: normalizedCurrency,
      receipt: `order_${order._id.toString()}`,
      notes: {
        service: service.slug,
        package: pkg.name,
        orderId: order._id.toString(),
      },
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Payment gateway error";
    if (msg.toLowerCase().includes("missing razorpay keys")) {
      return res.status(503).json({ error: "Payment gateway is not configured. Set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET." });
    }
    // eslint-disable-next-line no-console
    console.error("[backend] razorpay create order error", err);
    return res.status(502).json({ error: "Unable to start payment. Please try again." });
  }

  const payment = await Payment.create({
    userId,
    orderId: order._id,
    amount,
    amountInr,
    currency: normalizedCurrency,
    status: "created",
    razorpayOrderId: rpOrder.id,
  });

  res.json({
    ok: true,
    keyId: process.env.RAZORPAY_KEY_ID,
    razorpayOrderId: rpOrder.id,
    amountMinor,
    currency: normalizedCurrency,
    orderId: order._id.toString(),
    paymentId: payment._id.toString(),
    orderToken,
  });
});

paymentsRouter.post("/verify", async (req, res) => {
  const userId = req.user?._id;
  if (!userId) return res.status(401).json({ error: "Unauthorized" });

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

  const payment = await Payment.findOne({ orderId, userId });
  if (!payment) return res.status(404).json({ error: "Payment not found" });
  if (payment.razorpayOrderId && payment.razorpayOrderId !== razorpayOrderId) {
    return res.status(400).json({ error: "Order mismatch" });
  }

  payment.status = "paid";
  payment.razorpayOrderId = razorpayOrderId;
  payment.razorpayPaymentId = razorpayPaymentId;
  payment.razorpaySignature = razorpaySignature;
  await payment.save();

  const order = await Order.findOne({ _id: orderId, userId });
  if (order) {
    order.status = "processing";
    await order.save();
  }

  res.json({ ok: true });
});

module.exports = { paymentsRouter };
