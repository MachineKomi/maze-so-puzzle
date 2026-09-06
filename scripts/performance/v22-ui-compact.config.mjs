import { defineConfig } from "@playwright/test";
import { isAbsolute, relative, resolve, sep } from "node:path";
import { tmpdir } from "node:os";

const root = resolve(import.meta.dirname, "../..");
const port = Number(process.env.MAZE_PERF_PORT ?? 4198);
if (!Number.isInteger(port) || port < 1024 || port > 65535) throw new Error("Invalid MAZE_PERF_PORT");
const evidence = resolve(process.env.MAZE_UI_EVIDENCE_DIR ?? resolve(tmpdir(), "maze-so-puzzle-ui-compact", `${Date.now()}-${process.pid}`));
const local = relative(root, evidence);
if (local === "" || (local !== ".." && !local.startsWith(`..${sep}`) && !isAbsolute(local))) {
  throw new Error(`Raw compact UI evidence must be written outside the repository: ${evidence}`);
}
process.env.MAZE_UI_EVIDENCE_DIR = evidence;

export default defineConfig({
  testDir: import.meta.dirname,
  testMatch: "v22-ui-compact.pw.ts",
  workers: 1,
  fullyParallel: false,
  retries: 0,
  timeout: 120_000,
  expect: { timeout: 15_000 },
  outputDir: resolve(evidence, "playwright-artifacts"),
  reporter: [["line"], ["json", { outputFile: resolve(evidence, "playwright-results.json") }]],
  use: {
    baseURL: `http://127.0.0.1:${port}`,
    browserName: "chromium",
    channel: "msedge",
    headless: true,
    serviceWorkers: "block",
    reducedMotion: "reduce",
    trace: "off",
  },
  webServer: {
    command: `npm run preview -- --host 127.0.0.1 --port ${port} --strictPort`,
    url: `http://127.0.0.1:${port}`,
    reuseExistingServer: false,
    timeout: 30_000,
  },
});
