const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true, unique: true },
    phone: { type: String, trim: true },
    company: { type: String, trim: true, default: "" },
    website: { type: String, trim: true, default: "" },
    city: { type: String, trim: true, default: "" },
    country: { type: String, trim: true, default: "" },
    bio: { type: String, trim: true, default: "" },
    passwordHash: { type: String },
    googleSub: { type: String },
    role: { type: String, enum: ["user", "admin"], default: "user" },
    isEmailVerified: { type: Boolean, default: false },
    emailVerificationCodeHash: { type: String },
    emailVerificationExpiresAt: { type: Date },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

module.exports = { User };
