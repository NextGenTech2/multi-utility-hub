const { spawn } = require("child_process");
const path = require("path");

const workspaceRoot = "d:\\Users\\nirakumar\\Desktop\\Niraj\\AI\\Agy\\multi-utility-hub";

console.log("\n[Workspace Launcher] Starting Next.js Dev Server & Downloader Helper Server...");

// Spawn Next.js Dev Server
const nextDev = spawn("npx", ["next", "dev"], {
  cwd: workspaceRoot,
  shell: true,
  env: { ...process.env, PORT: "3000" }
});

// Spawn Downloader Server
const downloadServer = spawn("node", ["scripts/server.js"], {
  cwd: workspaceRoot,
  shell: true
});

// Pipe Next.js output
nextDev.stdout.on("data", (data) => {
  process.stdout.write(`[Next.js] ${data}`);
});
nextDev.stderr.on("data", (data) => {
  process.stderr.write(`[Next.js ERROR] ${data}`);
});

// Pipe Downloader output
downloadServer.stdout.on("data", (data) => {
  process.stdout.write(`[Downloader] ${data}`);
});
downloadServer.stderr.on("data", (data) => {
  process.stderr.write(`[Downloader ERROR] ${data}`);
});

// Handle termination
const cleanExit = () => {
  nextDev.kill();
  downloadServer.kill();
  process.exit();
};

process.on("SIGINT", cleanExit);
process.on("SIGTERM", cleanExit);
process.on("exit", cleanExit);
