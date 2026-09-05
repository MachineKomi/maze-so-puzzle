import { defineConfig } from "@playwright/test";
import { isAbsolute, relative, resolve } from "node:path";

const root = resolve(import.meta.dirname, "../..");
const port = Number(process.env.MAZE_PERF_PORT ?? 4174);
if (!Number.isInteger(port) || port < 1024 || port > 65535) throw new Error("Invalid MAZE_PERF_PORT");
const baseURL = `http://127.0.0.1:${port}`;
const evidence = resolve(process.env.MAZE_PERF_EVIDENCE_DIR ?? "C:/GameDev/maze-game-qa/performance/v22-perf-01/input");
const local = relative(root, evidence);
if (!local.startsWith("..") && !isAbsolute(local)) throw new Error("Keep raw browser evidence outside the repository.");

export default defineConfig({
  testDir: import.meta.dirname,
  testMatch: "v22-input.pw.ts",
  workers: 1,
  retries: 0,
  timeout: 180_000,
  expect: { timeout: 15_000 },
  outputDir: resolve(evidence, "test-output"),
  reporter: [["line"], ["json", {outputFile:resolve(evidence,"playwright-results.json")}]],
  use: { baseURL, browserName:"chromium", channel:"msedge",
    headless:true, serviceWorkers:"block", reducedMotion:"no-preference", trace:"off" },
  webServer: { command:`npm run preview -- --host 127.0.0.1 --port ${port} --strictPort`,
    url:baseURL, reuseExistingServer:false, timeout:30_000 },
});
