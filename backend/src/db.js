const mongoose = require("mongoose");
const { ensureDefaultSocialMediaServices } = require("./seed/defaultServices");

let isConnected = false;

async function connectToDatabase() {
  if (isConnected) return true;

  const uri = process.env.MONGODB_URI || process.env.MONGO_URI;
  if (!uri) {
    // eslint-disable-next-line no-console
    console.warn("[backend] MONGODB_URI not set; starting without database");
    return false;
  }

  mongoose.set("strictQuery", true);
  try {
    await mongoose.connect(uri);
    isConnected = true;
    // eslint-disable-next-line no-console
    console.log("[backend] connected to MongoDB");

    const shouldSeed = String(process.env.SEED_DEFAULTS || "true").toLowerCase() !== "false";
    if (shouldSeed) {
      await ensureDefaultSocialMediaServices();
      // eslint-disable-next-line no-console
      console.log("[backend] ensured default social-media services/packages");
    }

    return true;
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error("[backend] failed to connect to MongoDB; starting without database", err);
    return false;
  }
}

module.exports = { connectToDatabase };
