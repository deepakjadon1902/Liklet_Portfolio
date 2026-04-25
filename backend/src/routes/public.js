const express = require("express");
const { Service } = require("../models/Service");
const { Package } = require("../models/Package");

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

module.exports = { publicRouter };

