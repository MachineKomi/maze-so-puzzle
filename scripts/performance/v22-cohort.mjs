/** V22 production-only performance cohort. Run with node; Playwright is ephemeral. */
import { chromium } from "playwright";
import { createServer } from "node:http";
import { mkdir, readFile, writeFile, stat, readdir } from "node:fs/promises";
import { resolve, relative, extname, isAbsolute } from "node:path";
import { createHash } from "node:crypto";
import { execFileSync } from "node:child_process";
import { cpus, freemem, totalmem, release } from "node:os";
import { deriveNormalFixtures } from "./v22-fixtures.mjs";
import { buildInstrumented } from "./v22-instrumented-build.mjs";

const args = Object.fromEntries(process.argv.slice(2).map(arg => {
  const [name, ...value] = arg.replace(/^--/, "").split("="); return [name, value.join("=") || "true"];
}));
const root = process.cwd();
const phase = args.phase ?? "candidate";
const output = resolve(args.out ?? `C:/GameDev/maze-game-qa/performance/v22-perf-01/${phase}-cohort`);
const dist = resolve(args.dist ?? "dist");
const frozen = args.source ? resolve(args.source) : undefined;
const duration = Number(args["row-ms"] ?? 12_000);
const repetitions = Number(args.repetitions ?? 3);
const soakMs = Number(args["soak-ms"] ?? 600_000);
const soakQuality = args["soak-quality"] ?? "full";
if (!["full", "lite"].includes(soakQuality)) throw new Error("Soak quality must be full or lite.");
const keys = { up: "ArrowUp", right: "ArrowRight", down: "ArrowDown", left: "ArrowLeft" };
const opposite = { up: "down", down: "up", right: "left", left: "right" };
const delta = { up: [0, -1], down: [0, 1], right: [1, 0], left: [-1, 0] };
const classification = "contaminated-report-only: active development host; no clean-host, thermal or physical-iPad attestation";
const insideRepo = relative(root, output);
if (!insideRepo.startsWith("..") && !isAbsolute(insideRepo)) throw new Error("Raw evidence must be outside the repository.");
await mkdir(output, { recursive: true });
const hash = data => createHash("sha256").update(data).digest("hex");
async function treeManifest(directory) {
  const files = [];
  const visit = async path => {
    for (const entry of await readdir(path, { withFileTypes: true })) {
      const file = resolve(path, entry.name);
      if (entry.isDirectory()) await visit(file);
      else if (entry.isFile()) { const bytes = await readFile(file); files.push({ path: relative(directory, file).replaceAll("\\", "/"), bytes: bytes.length, sha256: hash(bytes) }); }
    }
  };
  await visit(directory); files.sort((a, b) => a.path.localeCompare(b.path));
  return { directory, files, bytes: files.reduce((sum, file) => sum + file.bytes, 0), sha256: hash(JSON.stringify(files)) };
}
const fixturePack = await deriveNormalFixtures(root, frozen);
await writeFile(resolve(output, "fixtures.json"), JSON.stringify(fixturePack, null, 2));
const fixtureHash = hash(JSON.stringify(fixturePack));
const inventory = { phase, classification, startedAt: new Date().toISOString(),
  schema: "maze-v22-cohort/v1", cpuThrottlingRate: 1, networkThrottling: "none; local static production delivery",
  cacheState: "fresh context per short row, complete load plus one route-cycle warmup before sampling; same context for soak",
  commandArguments: process.argv.slice(2),
  commit: execFileSync("git", ["rev-parse", "HEAD"], { encoding: "utf8" }).trim(),
  workingTree: execFileSync("git", ["status", "--short"], { encoding: "utf8" }).trim(),
  sourceDirectory: frozen ?? root, dist, fixtureHash, os: release(),
  cpu: cpus()[0]?.model, logicalCpus: cpus().length, totalRam: totalmem(), freeRamStart: freemem(),
  viewport: { width: 1194, height: 834 }, dpr: 2,
  packageLockSha256: hash(await readFile(resolve(root, "package-lock.json"))),
  htmlSha256: hash(await readFile(resolve(dist, "index.html"))),
  instrumented: args.instrumented === "true", duration, repetitions, soakMs, soakQuality,
  tracing: args.trace === "true",
};
inventory.harnessSha256 = Object.fromEntries(await Promise.all([
  "v22-cohort.mjs", "v22-fixtures.mjs", "v22-instrumented-build.mjs",
].map(async name => [name, hash(await readFile(resolve(root, "scripts/performance", name)))])));
if (args.instrumented === "true") {
  await buildInstrumented(root, resolve(output, "instrumented"), frozen);
}
const delivery = args.instrumented === "true" ? resolve(output, "instrumented/dist") : dist;
const deliveryManifest = await treeManifest(delivery);
const sourceManifest = await treeManifest(frozen ?? resolve(root, "src"));
await writeFile(resolve(output, "delivery-manifest.json"), JSON.stringify(deliveryManifest, null, 2));
await writeFile(resolve(output, "source-manifest.json"), JSON.stringify(sourceManifest, null, 2));
inventory.deliveryManifestSha256 = deliveryManifest.sha256;
inventory.sourceManifestSha256 = sourceManifest.sha256;
const mime = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css", ".png": "image/png", ".webp": "image/webp", ".svg": "image/svg+xml", ".mp3": "audio/mpeg", ".woff2": "font/woff2", ".json": "application/json" };
const server = createServer(async (request, response) => {
  try {
    let pathname = decodeURIComponent(new URL(request.url, "http://local").pathname);
    let file = resolve(delivery, `.${pathname}`);
    const rel = relative(delivery, file);
    if (rel.startsWith("..") || isAbsolute(rel)) { response.writeHead(403); response.end(); return; }
    try { if (!(await stat(file)).isFile()) file = resolve(delivery, "index.html"); }
    catch { if (extname(pathname)) { response.writeHead(404); response.end(); return; } file = resolve(delivery, "index.html"); }
    response.setHeader("Content-Type", mime[extname(file)] ?? "application/octet-stream");
    response.setHeader("Cache-Control", "public, max-age=3600");
    response.end(await readFile(file));
  } catch { response.writeHead(500); response.end(); }
});
await new Promise(done => server.listen(0, "127.0.0.1", done));
const base = `http://127.0.0.1:${server.address().port}`;
const browser = await chromium.launch({ channel: "msedge", headless: true });
inventory.browser = browser.version();
const rows = [];

function installMetrics({ fixture, fixturePack, quality, motion, storageBypass, instrumented }) {
  localStorage.clear();
  localStorage.setItem(fixturePack.storage.active, JSON.stringify(fixture.snapshot));
  localStorage.setItem(fixturePack.storage.progress, JSON.stringify(fixturePack.progress));
  localStorage.setItem(fixturePack.storage.presentation, JSON.stringify({ quality, motion }));
  const metrics = { active: false, frames: [], longTasks: [], inputPaint: [], eventTiming: [],
    counts: {}, times: {}, hiddenEvents: [], segments: [], storageBypass, startedAt: 0 };
  window.__v22Metrics = metrics;
  window.__v22Record = (name, value = 1) => {
    if (!metrics.active) return;
    if (name.endsWith("Ms")) (metrics.times[name] ??= []).push(value);
    else metrics.counts[name] = (metrics.counts[name] ?? 0) + value;
  };
  if (instrumented) {
    for (const method of ["querySelector", "querySelectorAll"]) {
      const original = Element.prototype[method];
      Element.prototype[method] = function(selector) {
        if (this.classList?.contains("maze-board")) window.__v22Record(`board:${method}:${selector}`);
        return original.call(this, selector);
      };
    }
  }
  const setItem = Storage.prototype.setItem;
  const removeItem = Storage.prototype.removeItem;
  Storage.prototype.setItem = function(key, value) {
    const began = performance.now();
    try { if (!(storageBypass && key === fixturePack.storage.active)) return setItem.call(this, key, value); }
    finally { if (key === fixturePack.storage.active) window.__v22Record("activeRunStorageMs", performance.now() - began); }
  };
  Storage.prototype.removeItem = function(key) {
    const began = performance.now();
    try { return removeItem.call(this, key); }
    finally { if (key.startsWith("maze-so-puzzle-active-run")) window.__v22Record("activeRunRemoveMs", performance.now() - began); }
  };
  for (const type of ["longtask", "event"]) try {
    new PerformanceObserver(list => {
      if (!metrics.active) return;
      for (const event of list.getEntries()) (type === "longtask" ? metrics.longTasks : metrics.eventTiming)
        .push({ name: event.name, startTime: event.startTime, duration: event.duration });
    }).observe({ type, buffered: false, ...(type === "event" ? { durationThreshold: 16 } : {}) });
  } catch { metrics.counts[`unsupported:${type}`] = 1; }
  let previous = null;
  const frame = now => {
    if (metrics.active && previous !== null) metrics.frames.push({ at: now, dt: now - previous });
    previous = metrics.active ? now : null;
    requestAnimationFrame(frame);
  };
  requestAnimationFrame(frame);
  document.addEventListener("visibilitychange", () => metrics.hiddenEvents.push({ at: performance.now(), hidden: document.hidden }));
  for (const type of ["keydown", "pointerdown", "pointerup"]) document.addEventListener(type, event => {
    if (!metrics.active) return;
    const started = performance.now();
    requestAnimationFrame(first => requestAnimationFrame(second => {
      if (metrics.active) metrics.inputPaint.push({ type, key: event.key, firstRafMs: first - started, secondRafMs: second - started });
    }));
  }, { capture: true, passive: true });
}

async function semantic(page) {
  return page.evaluate(() => {
    const text = document.querySelector(".maze-map-card .sr-only")?.textContent ?? "";
    const point = /Ame is at column (\d+), row (\d+)/.exec(text);
    const steps = /^(\d+)/.exec(document.querySelector(".step-pill")?.getAttribute("aria-label") ?? "");
    if (!point || !steps) throw new Error("Missing gameplay semantic state.");
    return { x: Number(point[1]) - 1, y: Number(point[2]) - 1, steps: Number(steps[1]),
      followers: document.querySelectorAll("[data-follower-id]").length };
  });
}
async function targetPoint(page, input, direction) {
  return page.evaluate(({ input, direction }) => {
    if (input === "pad") {
      const rect = document.querySelector(`.thumb-pad button[data-direction="${direction}"]`).getBoundingClientRect();
      return { x: rect.x + rect.width / 2, y: rect.y + rect.height / 2 };
    }
    const board = document.querySelector(".maze-board").getBoundingClientRect();
    return { x: direction === "left" ? board.left + 8 : direction === "right" ? board.right - 8 : board.left + board.width / 2,
      y: direction === "up" ? board.top + 8 : direction === "down" ? board.bottom - 8 : board.top + board.height / 2 };
  }, { input, direction });
}
async function segment(page, cdp, input, direction, length, observeLive = false) {
  const before = await semantic(page);
  if (input === "keyboard") await page.keyboard.down(keys[direction]);
  else {
    const point = await targetPoint(page, input, direction);
    if (input === "board") {
      const actor = await page.locator(".player-layer").boundingBox();
      await cdp.send("Input.dispatchTouchEvent", { type: "touchStart", touchPoints: [{ x: actor.x + actor.width / 2, y: actor.y + actor.height / 2, id: 1 }] });
      await cdp.send("Input.dispatchTouchEvent", { type: "touchMove", touchPoints: [{ ...point, id: 1 }] });
    } else await cdp.send("Input.dispatchTouchEvent", { type: "touchStart", touchPoints: [{ ...point, id: 1 }] });
  }
  if (observeLive) await page.evaluate(() => new Promise(done => requestAnimationFrame(() => {
    const origin = document.querySelector(".touch-joystick-origin");
    window.__v22LiveCosts = { originPresent: !!origin,
      joystickBlur: origin ? getComputedStyle(origin).backdropFilter : null,
      joystickWebkitBlur: origin ? getComputedStyle(origin).webkitBackdropFilter : null,
      quality: document.documentElement.dataset.quality, motion: document.documentElement.dataset.motion };
    done();
  })));
  try {
    await page.waitForFunction(expected => Number(/^\d+/.exec(document.querySelector(".step-pill")?.getAttribute("aria-label") ?? "")?.[0]) >= expected,
      before.steps + length, { polling: "raf", timeout: 10_000 });
  } finally {
    if (input === "keyboard") await page.keyboard.up(keys[direction]);
    else await cdp.send("Input.dispatchTouchEvent", { type: "touchEnd", touchPoints: [] });
  }
  await page.waitForFunction(() => document.querySelector(".maze-board")?.getAttribute("data-travel-state") === "settled", null, { timeout: 3000 });
  const after = await semantic(page);
  const vector = delta[direction];
  if (after.steps !== before.steps + length || after.x !== before.x + vector[0] * length || after.y !== before.y + vector[1] * length) {
    throw new Error(`Semantic route mismatch: ${JSON.stringify({ input, direction, before, after, length })}`);
  }
  return after;
}
const isolations = {
  "terrain-filters": ".maze-terrain-svg [filter],.maze-terrain-svg [style*=filter]{filter:none!important}",
  "sprite-filters": ".maze-board img,.object-kind-enemy::before,.pet-follower::before,.player-layer::before{filter:none!important}",
  "followers-paint": ".pet-followers{visibility:hidden!important}",
  "joystick-blur": ".touch-joystick-origin{backdrop-filter:none!important;-webkit-backdrop-filter:none!important}",
};
const percentile = (values, p) => {
  if (!values.length) return null;
  const sorted = [...values].sort((a, b) => a - b);
  return sorted[Math.min(sorted.length - 1, Math.ceil(sorted.length * p) - 1)];
};
function summarize(metrics) {
  const frames = metrics.frames.map(frame => frame.dt);
  return { frameCount: frames.length, frameP50: percentile(frames, .5), frameP95: percentile(frames, .95),
    frameP99: percentile(frames, .99), longestFrame: Math.max(0, ...frames),
    framesOver33: frames.filter(value => value > 33.34).length,
    framesOver50: frames.filter(value => value > 50).length,
    longTaskCount: metrics.longTasks.length, longTasksOver50: metrics.longTasks.filter(task => task.duration > 50),
    counters: metrics.counts, timeCosts: Object.fromEntries(Object.entries(metrics.times).map(([name, values]) =>
      [name, { count: values.length, total: values.reduce((a, b) => a + b, 0), p95: percentile(values, .95), max: Math.max(...values) }])),
    inputToFirstRafP95: percentile(metrics.inputPaint.map(event => event.firstRafMs), .95),
    inputToSecondRafP95: percentile(metrics.inputPaint.map(event => event.secondRafMs), .95),
    timingCaveat: "rAF proxies are not proof of displayed pixels; CDP/native input timings include test driving overhead.",
    hiddenEvents: metrics.hiddenEvents };
}

async function runRow(row, milliseconds, index) {
  row = { ...row, scenarioReferences: row.soak ? ["S04", "S05", "S09"]
    : row.isolation ? ["S05", "S06"] : ["S04", "S05"] };
  const fixture = fixturePack.fixtures.find(candidate => candidate.count === row.followers);
  const context = await browser.newContext({ viewport: inventory.viewport, deviceScaleFactor: 2,
    hasTouch: true, reducedMotion: row.motion === "reduced" ? "reduce" : "no-preference", serviceWorkers: "block" });
  await context.addInitScript(installMetrics, { fixture, fixturePack, quality: row.quality,
    motion: row.motion, storageBypass: row.isolation === "storage-write", instrumented: inventory.instrumented });
  const page = await context.newPage();
  const cdp = await context.newCDPSession(page);
  await cdp.send("Performance.enable");
  const errors = []; page.on("pageerror", error => errors.push(error.message));
  const name = `${index}-${row.input}-${row.followers}-${row.quality}-${row.motion}-${row.isolation ?? "normal"}`;
  try {
    await page.goto(base, { waitUntil: "networkidle" });
    await page.getByRole("button", { name: "Play", exact: true }).click();
    await page.getByRole("button", { name: /^Continue/ }).click();
    await page.locator(".maze-board").waitFor({ state: "visible" });
    if ((await semantic(page)).followers !== row.followers) throw new Error("Follower DOM count differs from normal saved state.");
    if (await page.getByText("Tester run", { exact: true }).count()) throw new Error("Fixture entered tester mode.");
    await page.locator(".maze-board").focus();
    if (isolations[row.isolation]) await page.addStyleTag({ content: isolations[row.isolation] });
    // Resume gathers followers. A complete identical corridor cycle unspools them.
    await segment(page, cdp, row.input, fixturePack.route.direction, fixturePack.route.length, true);
    await segment(page, cdp, "keyboard", opposite[fixturePack.route.direction], fixturePack.route.length);
    if (row.isolation === "ambient-animation") await page.evaluate(() => {
      for (const animation of document.getAnimations()) {
        const target = animation.effect?.target;
        if (target instanceof Element && target.closest(".maze-board") && animation.effect.getTiming().iterations === Infinity) animation.pause();
      }
    });
    await page.waitForTimeout(700);
    const before = await semantic(page);
    let probeOrigin = null;
    if (row.cursorProbe) {
      const actor = await page.locator(".player-layer").boundingBox();
      probeOrigin = { x: actor.x + actor.width / 2, y: actor.y + actor.height / 2 };
      await cdp.send("Input.dispatchTouchEvent", { type: "touchStart", touchPoints: [{ ...probeOrigin, id: 1 }] });
      await page.waitForTimeout(100);
    }
    const cdpBefore = await cdp.send("Performance.getMetrics");
    if (inventory.tracing) await cdp.send("Tracing.start", { categories: "devtools.timeline,disabled-by-default-devtools.timeline,cc", transferMode: "ReturnAsStream" });
    await page.evaluate(() => { const metrics = window.__v22Metrics; metrics.active = true; metrics.startedAt = performance.now(); });
    const started = Date.now(); let cycles = 0; let nextResourceAt = 60_000; const resourceWindows = [];
    if (row.cursorProbe) {
      // Same neutral direction, trusted physical pointer; no engine move expected.
      for (let move = 0; move < 30; move++) await cdp.send("Input.dispatchTouchEvent", {
        type: "touchMove", touchPoints: [{ x: probeOrigin.x + (move % 3) - 1,
          y: probeOrigin.y + ((move + 1) % 3) - 1, id: 1 }],
      });
      await page.waitForTimeout(50);
    }
    if (row.hudProbe) {
      for (let toggle = 0; toggle < 2; toggle++) {
        await page.locator('[data-focus-id="sound"]:visible').click();
        await page.getByRole("dialog").waitFor({ state: "visible" });
        await page.keyboard.press("Escape");
        await page.getByRole("dialog").waitFor({ state: "hidden" });
      }
    }
    while (!row.cursorProbe && !row.hudProbe && Date.now() - started < milliseconds) {
      await segment(page, cdp, row.input, fixturePack.route.direction, fixturePack.route.length);
      await segment(page, cdp, row.input, opposite[fixturePack.route.direction], fixturePack.route.length);
      cycles++;
      if (Date.now() - started >= nextResourceAt) {
        resourceWindows.push(await page.evaluate(() => ({ at: performance.now(),
          usedJsHeapBytes: performance.memory?.usedJSHeapSize ?? null,
          resources: performance.getEntriesByType("resource").length,
          domNodes: document.getElementsByTagName("*").length,
          followers: document.querySelectorAll("[data-follower-id]").length,
          hidden: document.hidden })));
        nextResourceAt += 60_000;
        process.stdout.write(`${name}: ${Math.round((Date.now() - started) / 1000)}s\n`);
      }
    }
    const metrics = await page.evaluate(() => { window.__v22Metrics.active = false; return window.__v22Metrics; });
    if (row.cursorProbe) await cdp.send("Input.dispatchTouchEvent", { type: "touchEnd", touchPoints: [] });
    const cdpAfter = await cdp.send("Performance.getMetrics");
    let traceSummary = null;
    if (inventory.tracing) {
      const complete = new Promise(done => cdp.once("Tracing.tracingComplete", done));
      await cdp.send("Tracing.end"); const { stream } = await complete;
      let trace = "";
      while (true) { const chunk = await cdp.send("IO.read", { handle: stream }); trace += chunk.data; if (chunk.eof) break; }
      await cdp.send("IO.close", { handle: stream });
      const traceFile = resolve(output, `${name}-trace.json`); await writeFile(traceFile, trace);
      const events = JSON.parse(trace).traceEvents;
      traceSummary = { artifact: traceFile, sha256: hash(trace),
        caveat: "Tracing adds overhead; cumulative duration sums may span parallel renderer threads, not elapsed frame time.",
        events: Object.fromEntries(["Paint", "PrePaint", "RasterTask", "CompositeLayers", "UpdateLayerTree", "Layout", "UpdateLayoutTree", "RunTask"].map(name => {
          const matches = events.filter(event => event.name === name && typeof event.dur === "number");
          return [name, { count: matches.length, totalMs: matches.reduce((sum, event) => sum + event.dur, 0) / 1000 }];
        })) };
    }
    const cdpDeltas = Object.fromEntries(cdpAfter.metrics.filter(metric => ["TaskDuration", "ScriptDuration", "LayoutDuration", "RecalcStyleDuration", "LayoutCount", "RecalcStyleCount"].includes(metric.name))
      .map(metric => [metric.name, metric.value - (cdpBefore.metrics.find(before => before.name === metric.name)?.value ?? 0)]));
    const after = await semantic(page);
    if (after.x !== before.x || after.y !== before.y || after.steps !== before.steps + cycles * fixturePack.route.cycle.length) {
      throw new Error("Final route state is not the identical reversible journey.");
    }
    if (row.isolation !== "storage-write") await page.waitForFunction(({ key, steps }) =>
      JSON.parse(localStorage.getItem(key) ?? "null")?.game.steps === steps,
      { key: fixturePack.storage.active, steps: after.steps }, { timeout: 2000 });
    const savedState = await page.evaluate(key => {
      const saved = JSON.parse(localStorage.getItem(key) ?? "null");
      return saved ? { schema: saved.schemaVersion, runId: saved.runId,
        steps: saved.game.steps, position: saved.game.position, followers: saved.game.rescuedAnimalIds.length } : null;
    }, fixturePack.storage.active);
    const activeEffects = await page.evaluate(() => {
      const board = document.querySelector(".maze-board");
      const images = [...board.querySelectorAll("img")];
      return { filteredImages: images.filter(image => getComputedStyle(image).filter !== "none").length,
        boardAnimations: document.getAnimations().filter(animation => animation.effect?.target instanceof Element && animation.effect.target.closest(".maze-board") && animation.playState === "running").length,
        joystickBlur: board.querySelector(".touch-joystick-origin") ? getComputedStyle(board.querySelector(".touch-joystick-origin")).backdropFilter : null,
        liveInput: window.__v22LiveCosts,
        quality: document.documentElement.dataset.quality, motion: document.documentElement.dataset.motion };
    });
    const raw = { ...row, phase, classification, fixtureHash, elapsedMs: Date.now() - started, before, after, cycles,
      metrics, resources: resourceWindows, activeEffects, cdpDeltas, traceSummary, savedState, errors };
    const file = resolve(output, `${name}.json`); await writeFile(file, JSON.stringify(raw));
    const result = { ...row, name, elapsedMs: raw.elapsedMs, before, after, cycles, activeEffects,
      ...summarize(metrics), cdpDeltas, traceSummary, savedState, resourceWindows, errors, artifact: file, artifactSha256: hash(await readFile(file)) };
    if (args.screenshots === "true") await page.screenshot({ path: resolve(output, `${name}.png`) });
    rows.push(result); process.stdout.write(`${name}: ${result.frameCount} frames; p95 ${result.frameP95?.toFixed(2)}ms; p99 ${result.frameP99?.toFixed(2)}ms; ${result.longTaskCount} tasks\n`);
  } finally { await context.close(); }
}

try {
  const matrix = [];
  for (const followers of [0, 2, 5]) for (const quality of ["full", "lite"]) matrix.push({ followers, quality, motion: "full", input: "board" });
  for (const input of ["keyboard", "pad"]) for (const quality of ["full", "lite"]) matrix.push({ followers: 5, quality, motion: "full", input });
  for (const quality of ["full", "lite"]) matrix.push({ followers: 5, quality, motion: "reduced", input: "board" });
  for (const isolation of [...Object.keys(isolations), "ambient-animation", "storage-write"]) matrix.push({ followers: 5, quality: "full", motion: "full", input: "board", isolation });
  const selection = args.only === "smoke" ? [matrix[0], matrix[4], matrix[8]]
    : args.only === "matrix" ? matrix.slice(0, 12)
    : args.only === "isolation" ? [matrix[4], ...matrix.slice(12)]
    : args.only === "counters" ? [matrix[4], matrix[6], matrix[8],
      { followers: 5, quality: "full", motion: "full", input: "board", cursorProbe: true },
      { followers: 5, quality: "full", motion: "full", input: "keyboard", hudProbe: true }]
    : args.only === "soak" ? [] : matrix;
  let index = 0;
  for (let repetition = 0; repetition < repetitions; repetition++) for (const row of selection) {
    await runRow({ ...row, repetition }, duration, index++);
  }
  if (soakMs > 0 && (args.only === "soak" || !args.only)) {
    await runRow({ followers: 5, quality: soakQuality, motion: "full", input: "board", soak: true }, soakMs, index++);
  }
} catch (error) {
  inventory.failure = { message: error.message, stack: error.stack }; process.exitCode = 1;
} finally {
  inventory.finishedAt = new Date().toISOString(); inventory.freeRamEnd = freemem();
  await writeFile(resolve(output, "summary.json"), JSON.stringify({ inventory, level: fixturePack.level,
    route: fixturePack.route, rows, limitation: "A 0/2/5 comparison changes legally resolved world state too. Factor-isolation rows test presentation independently; none proves physical-iPad behavior." }, null, 2));
  await browser.close(); await new Promise(done => server.close(done));
}
if (inventory.failure) throw new Error(inventory.failure.message);
