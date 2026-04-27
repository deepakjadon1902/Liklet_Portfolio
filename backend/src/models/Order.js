const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: false, index: true },
    serviceId: { type: mongoose.Schema.Types.ObjectId, ref: "Service", required: true, index: true },
    packageId: { type: mongoose.Schema.Types.ObjectId, ref: "Package", required: true },
    serviceName: { type: String, default: "" },
    packageName: { type: String, default: "" },
    currency: { type: String, default: "INR" },
    amount: { type: Number, default: 0 },
    customerName: { type: String, default: "" },
    customerEmail: { type: String, default: "" },
    customerPhone: { type: String, default: "" },
    publicTokenHash: { type: String, default: "", index: true },
    platformDetails: { type: Object, default: {} },
    status: {
      type: String,
      enum: ["pending", "processing", "completed", "cancelled"],
      default: "pending",
      index: true,
    },
  },
  { timestamps: true }
);

const Order = mongoose.model("Order", orderSchema);

module.exports = { Order };
