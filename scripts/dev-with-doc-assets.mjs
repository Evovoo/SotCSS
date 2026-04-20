import fs from "node:fs";
import path from "node:path";
import { spawn } from "node:child_process";

const ROOT = process.cwd();
const GENERATOR_PATH = path.join(ROOT, "scripts", "generate-doc-assets.mjs");
const NEXT_BIN_PATH = path.join(ROOT, "node_modules", "next", "dist", "bin", "next");
const WATCH_ROOTS = ["langs", "cs", "tools"].map((dir) => path.join(ROOT, dir));
const POLL_INTERVAL_MS = 1000;
const REBUILD_DEBOUNCE_MS = 250;

let lastSignature = "";
let rebuildTimer = null;
let rebuildInFlight = false;
let rebuildQueued = false;

function log(message) {
  process.stdout.write(`[docs-data] ${message}\n`);
}

function isMarkdownFile(fileName) {
  return fileName.endsWith(".md");
}

function walkMarkdownFiles(targetPath, files = []) {
  if (!fs.existsSync(targetPath)) {
    return files;
  }

  const stats = fs.statSync(targetPath);
  if (!stats.isDirectory()) {
    if (isMarkdownFile(targetPath)) {
      files.push(targetPath);
    }
    return files;
  }

  for (const entry of fs.readdirSync(targetPath, { withFileTypes: true })) {
    const entryPath = path.join(targetPath, entry.name);
    if (entry.isDirectory()) {
      walkMarkdownFiles(entryPath, files);
      continue;
    }

    if (entry.isFile() && isMarkdownFile(entry.name)) {
      files.push(entryPath);
    }
  }

  return files;
}

function getContentSignature() {
  const files = WATCH_ROOTS.flatMap((root) => walkMarkdownFiles(root)).sort();

  return files
    .map((filePath) => {
      const stats = fs.statSync(filePath);
      return `${path.relative(ROOT, filePath)}:${stats.size}:${stats.mtimeMs}`;
    })
    .join("|");
}

function runGenerator() {
  return new Promise((resolve, reject) => {
    const child = spawn(process.execPath, [GENERATOR_PATH], {
      cwd: ROOT,
      stdio: "inherit"
    });

    child.on("exit", (code) => {
      if (code === 0) {
        resolve();
        return;
      }

      reject(new Error(`docs-data generation failed with exit code ${code ?? "unknown"}.`));
    });

    child.on("error", reject);
  });
}

async function rebuildDocsData(reason) {
  if (rebuildInFlight) {
    rebuildQueued = true;
    return;
  }

  rebuildInFlight = true;
  log(`rebuilding (${reason})`);

  try {
    await runGenerator();
    lastSignature = getContentSignature();
    log("updated");
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    log(`failed: ${message}`);
  } finally {
    rebuildInFlight = false;

    if (rebuildQueued) {
      rebuildQueued = false;
      await rebuildDocsData("queued change");
    }
  }
}

function scheduleRebuild(reason) {
  if (rebuildTimer) {
    clearTimeout(rebuildTimer);
  }

  rebuildTimer = setTimeout(() => {
    rebuildTimer = null;
    rebuildDocsData(reason);
  }, REBUILD_DEBOUNCE_MS);
}

function startPollingWatcher() {
  lastSignature = getContentSignature();

  return setInterval(() => {
    const nextSignature = getContentSignature();
    if (nextSignature !== lastSignature) {
      scheduleRebuild("content change");
    }
  }, POLL_INTERVAL_MS);
}

async function main() {
  await rebuildDocsData("startup");

  const poller = startPollingWatcher();
  const nextArgs = [NEXT_BIN_PATH, "dev", ...process.argv.slice(2)];
  const nextProcess = spawn(process.execPath, nextArgs, {
    cwd: ROOT,
    stdio: "inherit",
    env: process.env
  });

  const shutdown = (signal) => {
    clearInterval(poller);
    if (rebuildTimer) {
      clearTimeout(rebuildTimer);
      rebuildTimer = null;
    }

    if (!nextProcess.killed) {
      nextProcess.kill(signal);
    }
  };

  process.on("SIGINT", () => shutdown("SIGINT"));
  process.on("SIGTERM", () => shutdown("SIGTERM"));

  nextProcess.on("exit", (code, signal) => {
    clearInterval(poller);
    if (rebuildTimer) {
      clearTimeout(rebuildTimer);
    }

    if (signal) {
      process.kill(process.pid, signal);
      return;
    }

    process.exit(code ?? 0);
  });
}

main().catch((error) => {
  const message = error instanceof Error ? error.message : String(error);
  log(`startup failed: ${message}`);
  process.exit(1);
});
