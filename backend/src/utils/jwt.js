const jwt = require("jsonwebtoken");

function getJwtSecret() {
  const secret = process.env.JWT_SECRET;
  if (secret && String(secret).trim()) return secret;

  const env = String(process.env.NODE_ENV || "development").toLowerCase();
  if (env === "production") {
    throw new Error("Missing JWT_SECRET");
  }

  // eslint-disable-next-line no-console
  console.warn("[backend] JWT_SECRET not set; using insecure dev secret (set JWT_SECRET in backend/.env)");
  return "dev-insecure-secret-change-me";
}

function signJwt(payload, options) {
  return jwt.sign(payload, getJwtSecret(), options);
}

function verifyJwt(token) {
  return jwt.verify(token, getJwtSecret());
}

module.exports = { getJwtSecret, signJwt, verifyJwt };

