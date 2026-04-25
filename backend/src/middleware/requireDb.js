function requireDb() {
  return (req, res, next) => {
    if (req.app?.locals?.dbReady) return next();
    return res.status(503).json({
      error: "Database not configured. Set MONGODB_URI in backend/.env and restart the backend.",
    });
  };
}

module.exports = { requireDb };

