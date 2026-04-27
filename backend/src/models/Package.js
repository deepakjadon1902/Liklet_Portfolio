const mongoose = require("mongoose");

const packageSchema = new mongoose.Schema(
  {
    serviceId: { type: mongoose.Schema.Types.ObjectId, ref: "Service", required: true, index: true },
    name: { type: String, required: true, trim: true },
    priceInr: { type: Number, required: true, min: 0 },
    priceUsd: { type: Number, min: 0 },
    interval: { type: String, default: "mo" },
    description: { type: String, trim: true },
    features: { type: [String], default: [] },
    isPopular: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const Package = mongoose.model("Package", packageSchema);

module.exports = { Package };
