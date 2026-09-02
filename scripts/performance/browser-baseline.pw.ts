import { createHash } from "node:crypto";
import { execFileSync } from "node:child_process";
import { mkdir, readFile, stat, writeFile } from "node:fs/promises";
import { cpus, freemem, hostname, platform, release, tmpdir, totalmem, type as osType } from "node:os";
import { basename, isAbsolute, relative, resolve, sep } from "node:path";
import { createRequire } from "node:module";
import { expect, test, type Browser, type BrowserContext, type Page } from "@playwright/test";
import fixtures from "./fixtures/scenarios.json" with { type: "json" };
import { readBuildProvenance } from "./build-provenance.mjs";
import { createInitialGameState, movePlayer } from "../../src/game/engine";
import { getCuratedLevel } from "../../src/game/levels";
import { solveLevel } from "../../src/game/solver";
import type { Direction, GameState, LevelDefinition, MoveResult, Point } from "../../src/game/types";

const repoRoot = resolve(import.meta.dirname, "../..");
const evidenceRoot = resolve(
  process.env.MAZE_PERF_EVIDENCE_DIR
    ?? resolve(tmpdir(), "maze-so-puzzle-performance", `direct-browser-${new Date().toISOString().replaceAll(":", "-")}-${process.pid}`),
);
const runCount = Number.parseInt(process.env.MAZE_PERF_RUNS ?? "5", 10);
if (!Number.isSafeInteger(runCount) || runCount < 5 || runCount > 100) {
  throw new Error(`MAZE_PERF_RUNS must be an integer from 5 to 100; received ${process.env.MAZE_PERF_RUNS ?? "5"}`);
}
const profileInput = process.env.MAZE_PERF_PROFILE ?? "reference";
if (!new Set(["reference", "low"]).has(profileInput)) {
  throw new Error(`MAZE_PERF_PROFILE must be reference or low; received ${profileInput}`);
}
const profile = profileInput === "low" ? "defined-low-end" : "reference-unthrottled";
const hostGate = process.env.MAZE_PERF_HOST_GATE ?? "not-attested";
if (!new Set(["clean", "not-attested", "contaminated"]).has(hostGate)) {
  throw new Error(`MAZE_PERF_HOST_GATE must be clean, not-attested, or contaminated; received ${hostGate}`);
}
const viewportText = process.env.MAZE_PERF_VIEWPORT ?? "1280x720";
const viewportMatch = /^(\d+)x(\d+)$/.exec(viewportText);
if (!viewportMatch) throw new Error(`Invalid MAZE_PERF_VIEWPORT: ${viewportText}`);
const viewport = { width: Number(viewportMatch[1]), height: Number(viewportMatch[2]) };
const sha256 = (value: string | Buffer) => createHash("sha256").update(value).digest("hex");
const git = (...args: string[]) => execFileSync("git", args, { cwd: repoRoot, encoding: "utf8" }).trim();
const require = createRequire(import.meta.url);

const evidenceRelativeToRepo = relative(repoRoot, evidenceRoot);
if (
  evidenceRelativeToRepo === ""
  || (evidenceRelativeToRepo !== ".." && !evidenceRelativeToRepo.startsWith(`..${sep}`) && !isAbsolute(evidenceRelativeToRepo))
) {
  throw new Error(`Raw performance evidence must be written outside the repository: ${evidenceRoot}`);
}

interface BrowserSample {
  capturedAtUtc: string;
  semanticReadyMs: number;
  domContentLoadedMs: number;
  loadEventMs: number;
  firstContentfulPaintMs: number | null;
  largestContentfulPaintMs: number | null;
  cumulativeLayoutShift: number;
  longTaskCount: number;
  longTaskTotalMs: number;
  longestTaskMs: number;
  frameP95Ms: number | null;
  longestFrameMs: number | null;
  resourceCount: number;
  transferBytes: number;
  encodedBodyBytes: number;
  usedJsHeapBytes: number | null;
  checkpoint?: Record<string, unknown>;
}

function percentile(values: number[], percentileValue: number): number | null {
  if (values.length === 0) return null;
  const sorted = [...values].sort((left, right) => left - right);
  const index = Math.min(sorted.length - 1, Math.max(0, Math.ceil(percentileValue * sorted.length) - 1));
  return Number(sorted[index]!.toFixed(3));
}

function metricSummary(samples: BrowserSample[]) {
  const names = Object.keys(samples[0] ?? {}).filter((name) => (
    name !== "checkpoint" && samples.some((sample) => typeof sample[name as keyof BrowserSample] === "number")
  ));
  return Object.fromEntries(names.map((name) => {
    const values = samples
      .map((sample) => sample[name as keyof BrowserSample])
      .filter((value): value is number => typeof value === "number" && Number.isFinite(value));
    return [name, {
      median: percentile(values, 0.5),
      p95: percentile(values, 0.95),
      worst: values.length === 0 ? null : Number(Math.max(...values).toFixed(3)),
      values: values.map((value) => Number(value.toFixed(3))),
    }];
  }));
}

async function installObservers(context: BrowserContext): Promise<void> {
  await context.addInitScript(() => {
    const state = {
      lcp: 0,
      cls: 0,
      longTasks: [] as number[],
      frameDeltas: [] as number[],
    };
    (window as unknown as { __mazePerformanceState: typeof state }).__mazePerformanceState = state;
    try {
      new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) state.lcp = Math.max(state.lcp, entry.startTime);
      }).observe({ type: "largest-contentful-paint", buffered: true });
    } catch { /* unsupported metrics remain explicit null/zero */ }
    try {
      new PerformanceObserver((list) => {
        for (const entry of list.getEntries() as PerformanceEntryList & Array<{ value?: number; hadRecentInput?: boolean }>) {
          if (!entry.hadRecentInput) state.cls += entry.value ?? 0;
        }
      }).observe({ type: "layout-shift", buffered: true });
    } catch { /* unsupported metrics remain explicit null/zero */ }
    try {
      new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) state.longTasks.push(entry.duration);
      }).observe({ type: "longtask", buffered: true });
    } catch { /* unsupported metrics remain explicit null/zero */ }
    let previous: number | null = null;
    const frame = (now: number) => {
      if (previous !== null && state.frameDeltas.length < 20_000) state.frameDeltas.push(now - previous);
      previous = now;
      requestAnimationFrame(frame);
    };
    requestAnimationFrame(frame);
  });
}

async function configureCdp(context: BrowserContext, page: Page, cacheDisabled: boolean) {
  const cdp = await context.newCDPSession(page);
  await cdp.send("Network.enable");
  await cdp.send("Network.setCacheDisabled", { cacheDisabled });
  if (profile === "defined-low-end") {
    await cdp.send("Emulation.setCPUThrottlingRate", { rate: 4 });
    await cdp.send("Network.emulateNetworkConditions", {
      offline: false,
      latency: 150,
      downloadThroughput: (1.6 * 1024 * 1024) / 8,
      uploadThroughput: (0.75 * 1024 * 1024) / 8,
      connectionType: "cellular3g",
    });
  }
  return cdp;
}

async function resetMotionWindow(page: Page): Promise<void> {
  await page.evaluate(() => {
    const state = (window as unknown as { __mazePerformanceState: {
      longTasks: number[];
      frameDeltas: number[];
    } }).__mazePerformanceState;
    state.longTasks = [];
    state.frameDeltas = [];
  });
}

async function collectSample(
  page: Page,
  semanticReadyMs: number,
  checkpoint?: Record<string, unknown>,
): Promise<BrowserSample> {
  await page.waitForTimeout(1_200);
  return page.evaluate(({ ready, checkpointValue, capturedAtUtc }) => {
    const state = (window as unknown as { __mazePerformanceState: {
      lcp: number;
      cls: number;
      longTasks: number[];
      frameDeltas: number[];
    } }).__mazePerformanceState;
    const navigation = performance.getEntriesByType("navigation")[0] as PerformanceNavigationTiming | undefined;
    const paints = performance.getEntriesByType("paint");
    const fcp = paints.find((entry) => entry.name === "first-contentful-paint")?.startTime ?? null;
    const resources = performance.getEntriesByType("resource") as PerformanceResourceTiming[];
    const sortedFrames = [...state.frameDeltas].sort((left, right) => left - right);
    const frameP95Index = Math.min(sortedFrames.length - 1, Math.max(0, Math.ceil(sortedFrames.length * 0.95) - 1));
    const memory = performance as Performance & { memory?: { usedJSHeapSize?: number } };
    return {
      capturedAtUtc,
      semanticReadyMs: ready,
      domContentLoadedMs: navigation?.domContentLoadedEventEnd ?? 0,
      loadEventMs: navigation?.loadEventEnd ?? 0,
      firstContentfulPaintMs: fcp,
      largestContentfulPaintMs: state.lcp || null,
      cumulativeLayoutShift: state.cls,
      longTaskCount: state.longTasks.length,
      longTaskTotalMs: state.longTasks.reduce((sum, duration) => sum + duration, 0),
      longestTaskMs: state.longTasks.length > 0 ? Math.max(...state.longTasks) : 0,
      frameP95Ms: sortedFrames.length > 0 ? sortedFrames[frameP95Index] ?? null : null,
      longestFrameMs: sortedFrames.length > 0 ? Math.max(...sortedFrames) : null,
      resourceCount: resources.length,
      transferBytes: resources.reduce((sum, entry) => sum + entry.transferSize, 0),
      encodedBodyBytes: resources.reduce((sum, entry) => sum + entry.encodedBodySize, 0),
      usedJsHeapBytes: memory.memory?.usedJSHeapSize ?? null,
      checkpoint: checkpointValue,
    };
  }, { ready: semanticReadyMs, checkpointValue: checkpoint, capturedAtUtc: new Date().toISOString() });
}

async function newMeasuredContext(browser: Browser, cacheDisabled: boolean) {
  const context = await browser.newContext({
    viewport,
    serviceWorkers: "block",
    reducedMotion: "no-preference",
  });
  await installObservers(context);
  const page = await context.newPage();
  const cdp = await configureCdp(context, page, cacheDisabled);
  return { context, page, cdp };
}

async function titleSample(page: Page): Promise<BrowserSample> {
  await page.goto("/?performance-cohort=title", { waitUntil: "domcontentloaded" });
  const button = page.getByRole("button", { name: /Begin adventure/i });
  await expect(button).toBeVisible();
  const ready = await page.evaluate(() => performance.now());
  return collectSample(page, ready, { role: "button", name: "Begin adventure" });
}

async function selectTesterLevel(page: Page, level: LevelDefinition): Promise<void> {
  await page.goto("/?debug=mazes&performance-cohort=tester", { waitUntil: "domcontentloaded" });
  const escapedName = level.name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const pickerButton = page.getByRole("button", {
    name: new RegExp(`^Test story maze \\d+: ${escapedName}, ${level.width} by ${level.height}$`),
  });
  await expect(pickerButton).toBeVisible();
  await pickerButton.click();
  await expect(page.getByRole("region", { name: `${level.name} maze` })).toBeVisible();
}

const keyForDirection: Readonly<Record<Direction, string>> = {
  up: "ArrowUp",
  down: "ArrowDown",
  left: "ArrowLeft",
  right: "ArrowRight",
};

interface DerivedRouteStep {
  readonly direction: Direction;
  readonly before: GameState;
  readonly result: MoveResult;
}

function deriveRoute(level: LevelDefinition, directions: readonly Direction[]): readonly DerivedRouteStep[] {
  let state = createInitialGameState(level);
  return directions.map((direction) => {
    const before = state;
    const result = movePlayer(level, state, direction);
    state = result.state;
    return { direction, before, result };
  });
}

function heldSegment(level: LevelDefinition, route: readonly DerivedRouteStep[]) {
  let best: {
    start: number;
    length: number;
    direction: Direction;
    before: GameState;
    after: GameState;
  } | null = null;
  for (let start = 0; start < Math.min(route.length, 80);) {
    const first = route[start]!;
    const pureMove = first.result.moved
      && first.result.events.length === 1
      && first.result.events[0]?.type === "moved";
    if (!pureMove) {
      start += 1;
      continue;
    }
    let end = start + 1;
    while (
      end < route.length
      && route[end]!.direction === first.direction
      && route[end]!.result.moved
      && route[end]!.result.events.length === 1
      && route[end]!.result.events[0]?.type === "moved"
    ) end += 1;
    const after = route[end - 1]!.result.state;
    const stopProbe = movePlayer(level, after, first.direction);
    const stopsAtOrdinaryBoundary = !stopProbe.moved && stopProbe.events.some((event) => (
      event.type === "blocked" && (event.reason === "wall" || event.reason === "out-of-bounds")
    ));
    if (stopsAtOrdinaryBoundary && (best === null || end - start > best.length)) {
      best = {
        start,
        length: end - start,
        direction: first.direction,
        before: first.before,
        after,
      };
    }
    start = end;
  }
  if (best === null) throw new Error("No safe solver-derived held-movement segment was found.");
  return best;
}

interface UiRouteState {
  readonly steps: number;
  readonly position: Point;
}

async function readUiRouteState(page: Page): Promise<UiRouteState> {
  const stepLabel = await page.locator(".step-pill").getAttribute("aria-label");
  const positionText = await page.locator(".maze-map-card .sr-only").first().textContent();
  const stepMatch = /^(\d+) steps?$/.exec(stepLabel?.trim() ?? "");
  const positionMatch = /Ame is at column (\d+), row (\d+)/.exec(positionText ?? "");
  if (!stepMatch || !positionMatch) {
    throw new Error(`Could not read semantic route state: steps=${stepLabel}; position=${positionText}`);
  }
  return {
    steps: Number(stepMatch[1]),
    position: { x: Number(positionMatch[1]) - 1, y: Number(positionMatch[2]) - 1 },
  };
}

async function expectUiRouteState(page: Page, expected: GameState): Promise<void> {
  await expect.poll(async () => readUiRouteState(page), { timeout: 8_000 }).toEqual({
    steps: expected.steps,
    position: expected.position,
  });
}

const blockingPresentationSelector = [
  ".battle-presentation",
  ".rescue-presentation",
  ".jump-presentation",
  ".portal-presentation",
  ".door-opening-presentation",
].join(", ");
const blockingEventTypes = new Set(["enemy-defeated", "animal-rescued", "hole-jumped", "portal-warped", "door-opened"]);

async function replayRouteStep(page: Page, step: DerivedRouteStep): Promise<void> {
  await expectUiRouteState(page, step.before);
  await page.keyboard.press(keyForDirection[step.direction]);
  await expectUiRouteState(page, step.result.state);
  if (step.result.events.some((event) => blockingEventTypes.has(event.type))) {
    const presentation = page.locator(blockingPresentationSelector);
    await expect.poll(async () => presentation.count(), { timeout: 1_500 }).toBeGreaterThan(0);
    await expect.poll(async () => presentation.count(), { timeout: 8_000 }).toBe(0);
  }
  await page.waitForTimeout(90);
  await expectUiRouteState(page, step.result.state);
}

test("production-preview browser baseline cohort", async ({ browser, browserName }) => {
  test.skip(browserName !== "chromium", "The baseline contract uses Edge/Chromium CDP.");
  for (const name of ["browser-cohort.json", "artifact-manifest.json"]) {
    try {
      await stat(resolve(evidenceRoot, name));
      throw new Error(`Evidence output already exists; use a fresh MAZE_PERF_EVIDENCE_DIR: ${resolve(evidenceRoot, name)}`);
    } catch (error) {
      if (!(error instanceof Error && "code" in error && error.code === "ENOENT")) throw error;
    }
  }
  await mkdir(evidenceRoot, { recursive: true });
  const rows: Array<Record<string, unknown>> = [];
  const browserVersion = browser.version();
  const runtimeStatus = git("status", "--short", "--", "src", "public", "index.html", "vite.config.ts", "tsconfig.app.json", "src-tauri");
  const buildIdentity = await readBuildProvenance();
  const sharedRejectionReasons = [
    ...(hostGate === "clean" ? [] : [`host-gate:${hostGate}`]),
    ...(runtimeStatus.length === 0 ? [] : ["runtime-inputs-dirty"]),
    ...(buildIdentity.runtimeInputsMatch ? [] : ["build-provenance-runtime-input-mismatch"]),
    ...(buildIdentity.distMatches ? [] : ["build-provenance-dist-mismatch"]),
  ];
  const rowAcceptance = sharedRejectionReasons.length === 0 ? "accepted-host-gated" : "contaminated-report-only";

  const coldSamples: BrowserSample[] = [];
  for (let iteration = 0; iteration < runCount; iteration += 1) {
    const { context, page } = await newMeasuredContext(browser, true);
    coldSamples.push(await titleSample(page));
    await context.close();
  }
  rows.push({
    scenarioId: "S01",
    cacheState: "cold-context-cache-disabled",
    runCount,
    acceptance: rowAcceptance,
    rejectionReasons: sharedRejectionReasons,
    metrics: metricSummary(coldSamples),
    samples: coldSamples,
  });

  const warmSamples: BrowserSample[] = [];
  {
    const { context, page, cdp } = await newMeasuredContext(browser, false);
    await titleSample(page);
    await cdp.send("Network.setCacheDisabled", { cacheDisabled: false });
    for (let iteration = 0; iteration < runCount; iteration += 1) {
      await page.reload({ waitUntil: "domcontentloaded" });
      const button = page.getByRole("button", { name: /Begin adventure/i });
      await expect(button).toBeVisible();
      const ready = await page.evaluate(() => performance.now());
      warmSamples.push(await collectSample(page, ready, { role: "button", name: "Begin adventure" }));
    }
    await context.close();
  }
  rows.push({
    scenarioId: "S02",
    cacheState: "warm-shared-browser-context",
    runCount,
    acceptance: rowAcceptance,
    rejectionReasons: sharedRejectionReasons,
    metrics: metricSummary(warmSamples),
    samples: warmSamples,
  });

  const entrySamples: BrowserSample[] = [];
  for (let iteration = 0; iteration < runCount; iteration += 1) {
    const { context, page } = await newMeasuredContext(browser, false);
    await page.goto("/?performance-cohort=entry", { waitUntil: "domcontentloaded" });
    const button = page.getByRole("button", { name: /Begin adventure/i });
    await expect(button).toBeVisible();
    const start = performance.now();
    await button.click();
    const startMaze = page.getByRole("button", { name: /Start the maze/i });
    await expect(startMaze).toBeVisible();
    await startMaze.click();
    await expect(page.getByRole("region", { name: "Little Star Trail maze" })).toBeVisible();
    const ready = performance.now() - start;
    entrySamples.push(await collectSample(page, ready, { levelId: "little-star-trail", state: "playable" }));
    await context.close();
  }
  rows.push({
    scenarioId: "S03",
    cacheState: "fresh-context-after-title",
    runCount,
    acceptance: rowAcceptance,
    rejectionReasons: sharedRejectionReasons,
    metrics: metricSummary(entrySamples),
    samples: entrySamples,
  });

  const movementLevel = getCuratedLevel("lanternlight-labyrinth")!;
  const solution = solveLevel(movementLevel).directions;
  const route = deriveRoute(movementLevel, solution);
  const segment = heldSegment(movementLevel, route);
  expect(segment.length).toBeGreaterThanOrEqual(2);
  const movementSamples: BrowserSample[] = [];
  for (let iteration = 0; iteration < runCount; iteration += 1) {
    const { context, page } = await newMeasuredContext(browser, false);
    await selectTesterLevel(page, movementLevel);
    await expectUiRouteState(page, createInitialGameState(movementLevel));
    for (const step of route.slice(0, segment.start)) await replayRouteStep(page, step);
    await expectUiRouteState(page, segment.before);
    const before = await readUiRouteState(page);
    const minimapTileCount = await page.locator(".minimap-tile").count();
    expect(minimapTileCount).toBe(movementLevel.width * movementLevel.height);
    await resetMotionWindow(page);
    const start = performance.now();
    try {
      await page.keyboard.down(keyForDirection[segment.direction]);
      await expectUiRouteState(page, segment.after);
    } finally {
      await page.keyboard.up(keyForDirection[segment.direction]);
    }
    const heldDurationMs = performance.now() - start;
    await page.waitForTimeout(90);
    await expectUiRouteState(page, segment.after);
    const after = await readUiRouteState(page);
    expect(after.steps - before.steps).toBe(segment.length);
    movementSamples.push(await collectSample(page, heldDurationMs, {
      levelId: movementLevel.id,
      routePolicy: fixtures.routePolicy,
      solverVisitedDirections: solution.length,
      heldSegment: { start: segment.start, length: segment.length, direction: segment.direction },
      stepsBefore: before,
      stepsAfter: after,
      expectedStart: { steps: segment.before.steps, position: segment.before.position },
      expectedEnd: { steps: segment.after.steps, position: segment.after.position },
      minimapTileCount,
    }));
    await context.close();
  }
  rows.push({
    scenarioId: "S04",
    cacheState: "fresh-context-tester-level",
    runCount,
    acceptance: rowAcceptance,
    rejectionReasons: sharedRejectionReasons,
    metrics: metricSummary(movementSamples),
    samples: movementSamples,
  });

  const largeMazeSamples: BrowserSample[] = [];
  const largeMazeLevel = getCuratedLevel("moonlit-friendship-quest")!;
  for (let iteration = 0; iteration < runCount; iteration += 1) {
    const { context, page } = await newMeasuredContext(browser, false);
    const start = performance.now();
    await selectTesterLevel(page, largeMazeLevel);
    const ready = performance.now() - start;
    await resetMotionWindow(page);
    const minimapTileCount = await page.locator(".minimap-tile").count();
    expect(minimapTileCount).toBe(largeMazeLevel.width * largeMazeLevel.height);
    largeMazeSamples.push(await collectSample(page, ready, {
      levelId: largeMazeLevel.id,
      grid: `${largeMazeLevel.width}x${largeMazeLevel.height}`,
      minimapTileCount,
    }));
    await context.close();
  }
  rows.push({
    scenarioId: "S05",
    cacheState: "fresh-context-tester-level",
    runCount,
    acceptance: rowAcceptance,
    rejectionReasons: sharedRejectionReasons,
    metrics: metricSummary(largeMazeSamples),
    samples: largeMazeSamples,
  });

  const bookSamples: BrowserSample[] = [];
  for (let iteration = 0; iteration < runCount; iteration += 1) {
    const { context, page } = await newMeasuredContext(browser, false);
    await page.goto("/?performance-cohort=book", { waitUntil: "domcontentloaded" });
    const open = page.getByRole("button", { name: /Ame's adventure book/i });
    await expect(open).toBeVisible();
    const start = performance.now();
    await open.click();
    await expect(page.getByRole("heading", { name: "Adventure Book" })).toBeVisible();
    await page.mouse.wheel(0, 2_000);
    const ready = performance.now() - start;
    bookSamples.push(await collectSample(page, ready, { heading: "Adventure Book", action: "open-and-scroll" }));
    await context.close();
  }
  rows.push({
    scenarioId: "S08",
    cacheState: "fresh-context-after-title",
    runCount,
    acceptance: rowAcceptance,
    rejectionReasons: sharedRejectionReasons,
    metrics: metricSummary(bookSamples),
    samples: bookSamples,
  });

  const powerMode = (() => {
    try {
      return execFileSync("powercfg", ["/getactivescheme"], { encoding: "utf8" }).trim();
    } catch {
      return "unavailable";
    }
  })();
  const hardware = {
    hostname: hostname(),
    cpu: cpus()[0]?.model ?? "unknown",
    logicalProcessors: cpus().length,
    totalMemoryBytes: totalmem(),
    freeMemoryBytesAtReport: freemem(),
  };
  const report = {
    schema: "maze-performance-browser-cohort/v1",
    generatedAtUtc: new Date().toISOString(),
    acceptance: rowAcceptance,
    evidenceClass: "newly-measured-production-preview",
    buildMode: "vite-production-preview",
    timingPolicy: "report-only",
    scenarioFixtureSha256: sha256(await readFile(resolve(repoRoot, "scripts/performance/fixtures/scenarios.json"))),
    provenance: {
      commit: git("rev-parse", "HEAD"),
      workingTreeStatus: git("status", "--short").split(/\r?\n/).filter(Boolean),
      runtimeInputStatus: runtimeStatus.split(/\r?\n/).filter(Boolean),
      packageLockSha256: sha256(await readFile(resolve(repoRoot, "package-lock.json"))),
      cargoLockSha256: sha256(await readFile(resolve(repoRoot, "src-tauri/Cargo.lock"))),
      distFingerprintSha256: buildIdentity.currentDistFingerprintSha256,
      buildProvenance: buildIdentity.marker,
    },
    environment: {
      os: `${osType()} ${release()}`,
      platform: platform(),
      architecture: process.arch,
      hardware,
      browserName: "Microsoft Edge",
      browserVersion,
      playwrightVersion: require("@playwright/test/package.json").version,
      viewport,
      deviceScaleFactor: 1,
      throttling: profile === "defined-low-end"
        ? { cpuRate: 4, latencyMs: 150, downloadMbit: 1.6, uploadMbit: 0.75 }
        : { cpuRate: 1, network: "none" },
      powerMode,
      thermalState: "unavailable-on-host",
      hostGate,
      headless: true,
    },
    rows,
    unavailable: [
      "field Core Web Vitals",
      "clean physical low-end device cohort",
      "Edge WebView2/Tauri frame and startup cohort",
      "ten-minute retained-heap qualification",
    ],
  };
  const cohortPath = resolve(evidenceRoot, "browser-cohort.json");
  await writeFile(cohortPath, `${JSON.stringify(report, null, 2)}\n`, "utf8");
  const cohortBuffer = await readFile(cohortPath);
  const manifest = {
    schema: "maze-performance-artifact-manifest/v1",
    generatedAtUtc: new Date().toISOString(),
    evidenceRoot,
    files: [{
      name: basename(cohortPath),
      bytes: (await stat(cohortPath)).size,
      sha256: sha256(cohortBuffer),
      mediaType: "application/json",
    }],
    retention: "Keep compact cohort and manifest; store any future heavy trace outside runtime delivery.",
  };
  await writeFile(resolve(evidenceRoot, "artifact-manifest.json"), `${JSON.stringify(manifest, null, 2)}\n`, "utf8");
});
