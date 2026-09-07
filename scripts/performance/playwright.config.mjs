import { defineConfig } from "@playwright/test";
import { execFileSync } from "node:child_process";
import { isAbsolute, relative, resolve, sep } from "node:path";
import { tmpdir } from "node:os";

const runId = `browser-${new Date().toISOString().replaceAll(":", "-")}-${process.pid}`;
const repoRoot = resolve(import.meta.dirname, "../..");
const commit = execFileSync("git", ["rev-parse", "HEAD"], { cwd: repoRoot, encoding: "utf8" }).trim().slice(0, 12);
const browserName = process.env.MAZE_PERF_BROWSER ?? "chromium";
if (!["chromium", "webkit", "firefox"].includes(browserName)) throw Error("Unsupported performance browser");
// Optional published jump verification reuses actual engine routes in fresh
// contexts after byte identity is verified separately. No local servers needed.
const publicJumpOrigin = process.env.MAZE_PUBLIC_JUMP_ORIGIN;
if (publicJumpOrigin && !["https://mazesopuzzle.com", "https://maze-so-puzzle.vercel.app"].includes(publicJumpOrigin)) {
  throw Error("Unsupported published jump origin");
}
const evidenceRoot = resolve(
  process.env.MAZE_PERF_EVIDENCE_DIR
    ?? resolve(tmpdir(), "maze-so-puzzle-performance", commit, runId),
);
const relativeToRepo = relative(repoRoot, evidenceRoot);
if (relativeToRepo === "" || (relativeToRepo !== ".." && !relativeToRepo.startsWith(`..${sep}`) && !isAbsolute(relativeToRepo))) {
  throw new Error(`Raw performance evidence must be written outside the repository: ${evidenceRoot}`);
}
process.env.MAZE_PERF_EVIDENCE_DIR = evidenceRoot;

export default defineConfig({
  testDir: import.meta.dirname,
  testMatch: ["scene-depth.pw.ts", "adventure-xp.pw.ts", "chests.pw.ts", "camera-window.pw.ts", "browser-baseline.pw.ts", "ui-overhaul.pw.ts", "ui-review-follow-up.pw.ts", "movement-review.pw.ts", "ui-correction.pw.ts", "phone-book.pw.ts", "book-completion.pw.ts", "jump-camera.pw.ts", "tall-walls.pw.ts", "hazard-surfaces.pw.ts", "wall-sprites.pw.ts", "reward-sprites.pw.ts", "physical-loot.pw.ts", "reward-numbers.pw.ts", "enemy-loot.pw.ts"],
  fullyParallel: false,
  workers: 1,
  retries: 0,
  timeout: 180_000,
  expect: { timeout: 15_000 },
  outputDir: resolve(evidenceRoot, "playwright-artifacts"),
  reporter: [
    ["line"],
    ["json", { outputFile: resolve(evidenceRoot, "playwright-report.json") }],
  ],
  use: {
    baseURL: publicJumpOrigin ?? "http://127.0.0.1:4173",
    browserName,
    launchOptions: browserName === "chromium" ? {
      channel: "msedge",
      executablePath: process.env.MAZE_PERF_EDGE_PATH,
    } : {},
    headless: true,
    actionTimeout: 15_000,
    navigationTimeout: 30_000,
    serviceWorkers: "block",
    reducedMotion: "no-preference",
    trace: "off",
    screenshot: "only-on-failure",
    video: "off",
  },
  webServer: publicJumpOrigin ? undefined : [{
    command: "npm run preview -- --host 127.0.0.1 --port 4173 --strictPort",
    url: "http://127.0.0.1:4173",
    reuseExistingServer: false,
    timeout: 30_000,
  }, {
    command: "npm run dev -- --host 127.0.0.1 --port 1421 --strictPort",
    url: "http://127.0.0.1:1421",
    reuseExistingServer: false,
    timeout: 30_000,
  }],
});
