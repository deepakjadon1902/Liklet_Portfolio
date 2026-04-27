const path = require("path");
require("dotenv").config({ path: path.join(__dirname, ".env") });

const http = require("http");
const { createApp } = require("./src/app");
const { connectToDatabase } = require("./src/db");

const PORT = process.env.PORT ? Number(process.env.PORT) : 5000;

async function main() {
  const dbReady = await connectToDatabase();

  const app = createApp({ dbReady });
  const server = http.createServer(app);

  server.on("error", (err) => {
    if (err && err.code === "EADDRINUSE") {
      // eslint-disable-next-line no-console
      console.error(`[backend] port ${PORT} already in use. Stop the other process or set PORT in backend/.env.`);
      process.exit(1);
    }
    // eslint-disable-next-line no-console
    console.error("[backend] server error", err);
    process.exit(1);
  });

  server.listen(PORT, () => {
    // eslint-disable-next-line no-console
    console.log(`[backend] listening on http://localhost:${PORT}`);
  });
}

main().catch((err) => {
  // eslint-disable-next-line no-console
  console.error("[backend] fatal error", err);
  process.exit(1);
});
