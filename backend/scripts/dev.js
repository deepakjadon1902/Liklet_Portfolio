const { spawn } = require("child_process");
const path = require("path");

if (process.env.RENDER || process.env.NODE_ENV === "production") {
  require("../server");
} else {
  const nodemonBin = path.join(__dirname, "..", "node_modules", "nodemon", "bin", "nodemon.js");
  const child = spawn(
    process.execPath,
    [nodemonBin, "--watch", "src", "--watch", "server.js", "--watch", ".env", "server.js"],
    {
      cwd: path.join(__dirname, ".."),
      stdio: "inherit",
    }
  );

  child.on("exit", (code, signal) => {
    if (signal) {
      process.kill(process.pid, signal);
      return;
    }
    process.exit(code || 0);
  });
}
