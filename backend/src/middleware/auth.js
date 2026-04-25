const { User } = require("../models/User");
const { verifyJwt } = require("../utils/jwt");

function getBearerToken(req) {
  const header = req.headers.authorization || "";
  return header.startsWith("Bearer ") ? header.slice(7) : null;
}

function requireAuth() {
  return async (req, res, next) => {
    try {
      const token = getBearerToken(req);
      if (!token) return res.status(401).json({ error: "Unauthorized" });

      const payload = verifyJwt(token);
      const user = await User.findById(payload.sub).lean();
      if (!user) return res.status(401).json({ error: "Unauthorized" });

      req.user = user;
      next();
    } catch (err) {
      return res.status(401).json({ error: "Unauthorized" });
    }
  };
}

function requireAdmin() {
  return async (req, res, next) => {
    try {
      const token = getBearerToken(req);
      if (!token) return res.status(401).json({ error: "Unauthorized" });

      const payload = verifyJwt(token);

      // Allow the static admin token without requiring a DB user record.
      if (payload && payload.sub === "admin:static" && payload.role === "admin") {
        req.user = { _id: "admin:static", role: "admin", email: payload.email || "" };
        return next();
      }

      const user = await User.findById(payload.sub).lean();
      if (!user) return res.status(401).json({ error: "Unauthorized" });
      if (user.role !== "admin") return res.status(403).json({ error: "Forbidden" });

      req.user = user;
      next();
    } catch (err) {
      return res.status(401).json({ error: "Unauthorized" });
    }
  };
}

module.exports = { requireAuth, requireAdmin };
