const express = require("express");
const cors = require("cors");

const { authRouter } = require("./routes/auth");
const { publicRouter } = require("./routes/public");
const { publicContactRouter } = require("./routes/publicContact");
const { paymentsRouter } = require("./routes/payments");
const { adminRouter } = require("./routes/admin");
const { requireDb } = require("./middleware/requireDb");
const { requireAuth } = require("./middleware/auth");

function createApp({ dbReady = false } = {}) {
  const app = express();
  app.locals.dbReady = Boolean(dbReady);

  app.use(
    cors({
      origin: process.env.CORS_ORIGIN ? process.env.CORS_ORIGIN.split(",") : true,
      credentials: true,
    })
  );
  app.use(express.json({ limit: "1mb" }));

  app.get("/health", (_req, res) => {
    res.json({ ok: true });
  });

  // Public routes that don't require the database.
  app.use("/api/public", publicContactRouter);

  app.use("/api/public", requireDb(), publicRouter);
  app.use("/api/auth", requireDb(), authRouter);
  app.use("/api/payments", requireDb(), requireAuth(), paymentsRouter);
  app.use("/api/admin", adminRouter);

  // eslint-disable-next-line no-unused-vars
  app.use((err, _req, res, _next) => {
    // eslint-disable-next-line no-console
    console.error("[backend] error", err);
    res.status(500).json({ error: "Internal Server Error" });
  });

  return app;
}

module.exports = { createApp };
