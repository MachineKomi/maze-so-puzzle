/**
 * Synthetic MOVE-01 clock comparison. Run directly with Node; no app/browser.
 * This is a mathematical recipe comparison, not old-production evidence,
 * device frame timing, player input latency, or a Human comfort measurement.
 * The actual candidate is type-stripped from one captured source snapshot. The
 * alternative clocks reuse that candidate's legal-polyline geometry through
 * its public API so their differences concern timing, not a second runtime.
 */
import { createHash } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { stripTypeScriptTypes } from "node:module";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("../../", import.meta.url));
const output = join(tmpdir(), "maze-move01-recipes", new Date().toISOString().replace(/[:.]/g, "-"));
await mkdir(output, { recursive: true });
const sources = {};
async function snapshotModule(relativePath) {
  const source = await readFile(join(root, relativePath), "utf8");
  const sha256 = createHash("sha256").update(source).digest("hex");
  sources[relativePath] = { sha256, bytes: Buffer.byteLength(source) };
  await writeFile(join(output, relativePath.split("/").at(-1)), source);
  // This standalone harness needs Node's type stripper (Node 22.13+), and
  // records the exact executing version. It does not invoke the app build.
  const js = stripTypeScriptTypes(source, { mode: "strip" });
  return import(`data:text/javascript;base64,${Buffer.from(js).toString("base64")}`);
}
const { TileTraveller, travelCamera, MAX_TRAVEL_LAG_MS } = await snapshotModule("src/tileTravel.ts");
const { heldMoveRepeatDelay } = await snapshotModule("src/movementControls.ts");
const copy = (p) => ({ x: p.x, y: p.y });
const distance = (a, b) => Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
const smoothstep = (v) => v * v * (3 - 2 * v);
const EPSILON = 1e-9;
const SNAP_TILES = 0.001;

// A reference timing adapter only. Virtual time walks the actual candidate's
// public polyline API by an explicitly selected arc length. It does not own
// collision, input, camera, followers, DOM transforms, saves, or gameplay.
class ReferenceClock {
  constructor(point, mode, parameter) {
    this.path = new TileTraveller(copy(point), 0);
    this.mode = mode;
    this.parameter = parameter;
    this.now = 0;
    this.virtualTime = 0;
    this.started = 0;
    this.duration = 112;
    this.startDistance = 0;
    this.previousProgress = 0;
    this.deadline = 0;
  }
  get point() { return this.path.point; }
  get target() { return this.path.target; }
  get moving() { return this.path.moving; }
  get pendingDistance() { return this.path.pendingDistance; }
  get remainingMs() { return this.moving ? Math.max(0, this.deadline - this.now) : 0; }
  advanceArc(amount) {
    const remaining = this.path.pendingDistance;
    if (remaining < EPSILON) return;
    this.virtualTime += Math.min(1, amount / remaining) * this.path.remainingMs;
    this.path.sample(this.virtualTime);
  }
  sample(now) {
    if (this.moving && now >= this.deadline) {
      this.path.settle(undefined, this.virtualTime);
    } else if (this.moving && this.mode === "damped") {
      // Exact elapsed-time exponential, not a frame-dependent fixed alpha.
      this.advanceArc(this.pendingDistance * -Math.expm1(-(now - this.now) / this.parameter));
    } else if (this.moving) {
      const progress = smoothstep(Math.min(1, Math.max(0, (now - this.started) / this.duration)));
      this.advanceArc(this.startDistance * (progress - this.previousProgress));
      this.previousProgress = progress;
    }
    this.now = now;
    return this.point;
  }
  retarget(target, now, duration) {
    this.sample(now);
    if (distance(target, this.target) < EPSILON) return;
    this.path.retarget(copy(target), this.virtualTime, 112);
    this.started = now;
    this.startDistance = this.pendingDistance;
    this.previousProgress = 0;
    this.duration = this.mode === "fixed" ? this.parameter : duration;
    const lag = this.mode === "damped"
      ? this.parameter * Math.max(0, Math.log(this.startDistance / SNAP_TILES))
      : this.duration;
    this.deadline = now + lag;
  }
}

// Diagnostic rejection: direct XY retargeting has no committed corner queue.
class DirectXYClock {
  constructor(point) { this.point = copy(point); this.target = copy(point); this.from = copy(point); this.now = 0; this.started = 0; }
  get pendingDistance() { return distance(this.point, this.target); }
  get moving() { return this.pendingDistance > EPSILON; }
  get remainingMs() { return this.moving ? Math.max(0, this.started + 112 - this.now) : 0; }
  sample(now) {
    const fraction = smoothstep(Math.min(1, Math.max(0, (now - this.started) / 112)));
    this.point = { x: this.from.x + (this.target.x - this.from.x) * fraction, y: this.from.y + (this.target.y - this.from.y) * fraction };
    this.now = now;
    return this.point;
  }
  retarget(target, now) { this.sample(now); this.from = copy(this.point); this.target = copy(target); this.started = now; }
}

const models = [
  { id: "candidate", description: "Actual source: piecewise constant speed on committed polyline; bounded catch-up; camera from same point.", make: (p) => new TileTraveller(copy(p), 0) },
  { id: "smoothstep-fixed112", description: "Comparison: corner-safe coordinated smoothstep over remaining polyline; 112ms reset from painted point on each accepted target.", make: (p) => new ReferenceClock(p, "fixed", 112) },
  { id: "smoothstep-cadence", description: "Comparison: same corner-safe smoothstep, duration matched to each supplied travel request. Accepted target intervals include 64/112/260/160ms.", make: (p) => new ReferenceClock(p, "cadence") },
  { id: "damped80", description: "Comparison: corner-safe exponential distance following, tau=80ms; exact endpoint snap after remaining distance reaches 0.001 tile.", make: (p) => new ReferenceClock(p, "damped", 80) },
  { id: "damped32", description: "Sensitivity comparison: tau=32ms with the same 0.001-tile snap. Shorter lag, stronger front-loaded speed.", make: (p) => new ReferenceClock(p, "damped", 32) },
  { id: "direct-xy112-reject", description: "Diagnostic only: coordinated 112ms XY smoothstep to newest tile. Shows wall-cutting when targets arrive before a corner completes.", make: (p) => new DirectXYClock(p) },
];
const steps = { R: [1, 0], L: [-1, 0], D: [0, 1], U: [0, -1] };
function route(id, directions, interval, duration, options = {}) {
  const start = options.start ?? { x: 3, y: 3 };
  let point = copy(start);
  const events = [...directions].map((direction, index) => {
    const [dx, dy] = steps[direction];
    point = { x: point.x + dx, y: point.y + dy };
    return { at: index * interval, target: copy(point), duration };
  });
  return { id, start, grid: options.grid ?? { width: 1024, height: 1024 }, events, note: options.note ?? "Synthetic accepted cardinal targets; not a replay of actual input dispatch." };
}
const fixtures = [
  route("single-tap", "R", 112, 112),
  route("rapid64-taps", "R".repeat(24), 64, 112),
  route("112-spaced-taps", "R".repeat(20), 112, 112),
  route("slow260-repeat", "R".repeat(20), 260, 260),
  route("cruise160-repeat", "R".repeat(24), 160, 160),
  route("rapid64-corners", "RD".repeat(16), 64, 112),
  route("early64-reversals", "RLDU".repeat(8), 64, 112),
  route("loop64-corners", "RRDDLLUU".repeat(4), 64, 112),
  route("mixed-source-stress64-duration260", "RD".repeat(32), 64, 260, { note: "Synthetic legal one-tile targets at 64ms carrying a 260ms requested duration. Stress envelope only; does not prove actual scheduler admits this cohort." }),
  route("small-static-camera", "RRDDLLUU".repeat(3), 160, 160, { start: { x: 1, y: 1 }, grid: { width: 5, height: 5 } }),
  route("camera-edge-clamps", `${"R".repeat(14)}${"L".repeat(14)}`, 160, 160, { start: { x: 0, y: 2 }, grid: { width: 15, height: 15 } }),
];
const startup = route("hold-startup-and-acceleration", "R".repeat(22), 160, 160);
let acceptedAt = 320;
startup.events[0] = { ...startup.events[0], at: 0, duration: 112 };
for (let index = 1; index < startup.events.length; index++) {
  const duration = heldMoveRepeatDelay(index - 1);
  startup.events[index] = { ...startup.events[index], at: acceptedAt, duration };
  acceptedAt += duration;
}
startup.note = "Synthetic accepted uninterrupted hold: first move at zero, next at 320ms, then exact current heldMoveRepeatDelay values (260ms towards 160ms).";
fixtures.push(startup);

function cameraAt(fixture, point) {
  const width = Math.min(6, fixture.grid.width), height = Math.min(6, fixture.grid.height);
  return travelCamera(fixture.grid, point, { left: 0, top: 0, right: width - 1, bottom: height - 1, width, height });
}
function offCommittedPath(point, segments) {
  return Math.min(...segments.map(([a, b]) => {
    const x = Math.min(Math.max(point.x, Math.min(a.x, b.x)), Math.max(a.x, b.x));
    const y = Math.min(Math.max(point.y, Math.min(a.y, b.y)), Math.max(a.y, b.y));
    return Math.hypot(point.x - x, point.y - y);
  }));
}
function summarize(fixture, model) {
  const traveller = model.make(fixture.start);
  const lastAt = fixture.events.at(-1).at;
  const end = lastAt + 1800;
  const events = new Map(fixture.events.map((event) => [event.at, event]));
  let target = copy(fixture.start), previous = copy(fixture.start), settledAt = null, firstVisibleAt = null;
  let maxLagMs = 0, maxLagTiles = 0, maxOffPath = 0, maxCameraBoundsError = 0, maxFirstHoldPauseDisplacement = 0;
  const segments = [[copy(fixture.start), copy(fixture.start)]], velocities = [], trace = [], eventMetrics = [];
  for (let at = 0; at <= end; at++) {
    traveller.sample(at);
    const event = events.get(at);
    if (event) {
      if (distance(target, event.target) !== 1) throw new Error(`${fixture.id}: non-cardinal target`);
      segments.push([copy(target), copy(event.target)]);
      target = copy(event.target);
      traveller.retarget(target, at, event.duration);
      const lagMs = traveller.remainingMs, lagTiles = traveller.pendingDistance;
      maxLagMs = Math.max(maxLagMs, lagMs); maxLagTiles = Math.max(maxLagTiles, lagTiles);
      eventMetrics.push({ at, requestedDurationMs: event.duration, lagMs, lagTiles });
    }
    const point = copy(traveller.point), camera = cameraAt(fixture, point);
    if (at > 0) velocities.push({ at, speed: distance(previous, point) * 1000 });
    if (firstVisibleAt === null && distance(fixture.start, point) >= 0.01) firstVisibleAt = at;
    maxOffPath = Math.max(maxOffPath, offCommittedPath(point, segments));
    maxCameraBoundsError = Math.max(maxCameraBoundsError, -camera.left, -camera.top, camera.right - (fixture.grid.width - 1), camera.bottom - (fixture.grid.height - 1));
    if (at >= lastAt && !traveller.moving && distance(point, target) === 0 && settledAt === null) settledAt = at;
    if (fixture.id === "hold-startup-and-acceleration" && at >= 112 && at < 320) {
      maxFirstHoldPauseDisplacement = Math.max(maxFirstHoldPauseDisplacement, distance(point, fixture.events[0].target));
    }
    if (at % 16 === 0 || event || at === settledAt) trace.push({ at, x: point.x, y: point.y, cameraX: camera.left, cameraY: camera.top, targetX: target.x, targetY: target.y });
    previous = point;
  }
  // Interior command windows exclude the first three startup targets and tail.
  const interiorFrom = fixture.events[3]?.at ?? 0;
  const interiorUntil = fixture.events.at(-1).at;
  const steady = velocities.filter((v) => v.at > interiorFrom && v.at <= interiorUntil).map((v) => v.speed);
  const mean = steady.length ? steady.reduce((sum, v) => sum + v, 0) / steady.length : null;
  const variance = mean ? steady.reduce((sum, v) => sum + (v - mean) ** 2, 0) / steady.length : null;
  const aroundBoundary = fixture.events.slice(4, -1).flatMap((event) => velocities.filter((v) => v.at > event.at - 5 && v.at <= event.at + 5).map((v) => v.speed));
  return {
    fixture: fixture.id, model: model.id, acceptedTargetCount: fixture.events.length,
    maxLagAfterAcceptedTargetMs: maxLagMs, maxLagAfterAcceptedTargetTiles: maxLagTiles,
    lastTargetExactSettleMs: settledAt === null ? null : settledAt - lastAt,
    firstPointDisplacementAtLeast001TileMs: firstVisibleAt,
    maxDistanceFromCommittedSegmentsTiles: maxOffPath,
    maxCameraBoundsErrorTiles: maxCameraBoundsError,
    interiorMeanSpeedTilesPerSecond: mean,
    interiorSpeedCoefficientOfVariation: variance === null ? null : Math.sqrt(variance) / mean,
    interiorStationaryPercent: steady.length ? 100 * steady.filter((v) => v < 1e-7).length / steady.length : null,
    interiorSpeedBelowQuarterMeanPercent: mean ? 100 * steady.filter((v) => v < mean / 4).length / steady.length : null,
    boundaryMeanSpeedRelativeToInterior: mean && aroundBoundary.length ? aroundBoundary.reduce((sum, v) => sum + v, 0) / aroundBoundary.length / mean : null,
    peakSpeedTilesPerSecond: Math.max(...velocities.map((v) => v.speed)),
    startupPauseDistanceFromFirstTargetTiles: fixture.id === "hold-startup-and-acceleration" ? maxFirstHoldPauseDisplacement : null,
    eventMetrics, trace,
  };
}

// Each clock schedule processes identical accepted-target timestamps and exact
// common probes. Extra sample calls test numerical invariance, not a browser FPS.
function sampleSchedule(fixture, model, pattern) {
  const probes = [...new Set([17, 50, 100, 159, 200, 333, 777, fixture.events.at(-1).at + 280, fixture.events.at(-1).at + 900])].sort((a, b) => a - b);
  const times = new Set([...probes, ...fixture.events.map((e) => e.at)]);
  for (let at = 0, index = 0; at < probes.at(-1); index++) { times.add(at); at += pattern[index % pattern.length]; }
  const events = new Map(fixture.events.map((e) => [e.at, e]));
  const traveller = model.make(fixture.start), result = [];
  for (const at of [...times].sort((a, b) => a - b)) {
    traveller.sample(at);
    const event = events.get(at);
    if (event) traveller.retarget(event.target, at, event.duration);
    if (probes.includes(at)) result.push({ at, ...copy(traveller.point) });
  }
  return result;
}
const results = fixtures.flatMap((fixture) => models.map((model) => summarize(fixture, model)));
const frameChecks = models.map((model) => {
  let maxDifference = 0;
  for (const fixture of fixtures) {
    const base = sampleSchedule(fixture, model, [1]);
    for (const schedule of [[1000 / 30], [1000 / 60], [1000 / 120], [7, 11, 31, 4, 25, 2, 48]]) {
      const trial = sampleSchedule(fixture, model, schedule);
      trial.forEach((point, index) => { maxDifference = Math.max(maxDifference, distance(point, base[index])); });
    }
  }
  const traveller = model.make({ x: 3, y: 3 });
  traveller.retarget({ x: 4, y: 3 }, 0, 112);
  traveller.sample(16); traveller.sample(32);
  const beforeStall = copy(traveller.point), afterStall = copy(traveller.sample(1048));
  return { model: model.id, maxCommonProbeDifferenceTiles: maxDifference, stall: { lastSampleMs: 32, resumedSampleMs: 1048, acceptedTargets: 1, beforeStall, afterStall, exactSettled: !traveller.moving && afterStall.x === 4 && afterStall.y === 3 } };
});
const candidateRows = results.filter((r) => r.model === "candidate");
const invariants = {
  candidateLagAtMost280Ms: candidateRows.every((r) => r.maxLagAfterAcceptedTargetMs <= MAX_TRAVEL_LAG_MS + EPSILON),
  candidateAllExactSettlesAtMost280Ms: candidateRows.every((r) => r.lastTargetExactSettleMs !== null && r.lastTargetExactSettleMs <= MAX_TRAVEL_LAG_MS),
  candidateNoPathCutting: candidateRows.every((r) => r.maxDistanceFromCommittedSegmentsTiles < EPSILON),
  candidateCameraAlwaysInBounds: candidateRows.every((r) => r.maxCameraBoundsErrorTiles < EPSILON),
  allClockModelsFrameScheduleInvariant: frameChecks.every((r) => r.maxCommonProbeDifferenceTiles < 1e-7),
  allClockModelsResumeOneTargetExactlyWithoutNewSteps: frameChecks.every((r) => r.stall.exactSettled),
};
const report = {
  classification: "SYNTHETIC mathematical clock model; NOT an old-production comparison, browser/device benchmark, actual input-latency capture, or Human comfort measurement.",
  recordedAt: new Date().toISOString(), output, node: process.version, sources,
  modelDefinitions: models.map(({ id, description }) => ({ id, description })), fixtures,
  method: {
    camera: "All models use actual travelCamera on exactly the actor's sampled point. No independent follow lag, lookahead, dead zone, FOV change, or reveal logic is introduced.",
    geometry: "Primary timing comparisons use the actual public TileTraveller polyline via a virtual arc-length clock. This keeps its early-reversal/corner rules identical. direct-xy112-reject deliberately omits this geometry for a diagnostic contrast.",
    clocks: "1ms diagnostic grid for comparative metrics; 30/60/120Hz and variable extra samples tested against shared probes. These schedules do not measure browser frame cost.",
    damping: "Exact exponential remaining-distance decay. Pure damping never settles exactly; these comparison variants explicitly snap the final 0.001 tile. Tau values are sensitivity examples, not an exhaustive tuning optimum.",
    visibilityThreshold: "0.01 tile is a mathematical displacement threshold, not an empirically established visible-pixel or comfort threshold.",
    lag: "remainingMs immediately after retarget is a no-further-input arrival bound. New targets may extend it again. Tile lag is measured separately; a 280ms temporal bound does not imply a three-tile spatial bound.",
    limitations: "No collision, solver, fog, follower rendering, input dispatch, compositor, pixel crispness, special-effect handoff, reduced-motion preference, browser visibility lifecycle, save/resume, CPU/GPU cost, old-build baseline, or family comfort is qualified here. Union-of-committed-segments checks complement rather than replace actual wall geometry evidence.",
  }, invariants, frameChecks, results,
};
await writeFile(join(output, "comparison.json"), `${JSON.stringify(report, null, 2)}\n`);
const fixed = (number, digits = 3) => number === null ? "—" : number.toFixed(digits);
const selectedFixtures = ["single-tap", "slow260-repeat", "cruise160-repeat", "rapid64-corners", "mixed-source-stress64-duration260"];
const table = results.filter((r) => selectedFixtures.includes(r.fixture)).map((r) =>
  `| ${r.fixture} | ${r.model} | ${fixed(r.maxLagAfterAcceptedTargetMs, 1)} | ${fixed(r.maxLagAfterAcceptedTargetTiles)} | ${r.lastTargetExactSettleMs ?? "never"} | ${fixed(r.interiorSpeedCoefficientOfVariation)} | ${fixed(r.interiorStationaryPercent, 1)} | ${fixed(r.maxDistanceFromCommittedSegmentsTiles)} |`);
const summary = [
  "# MOVE-01 recipe comparison — synthetic mathematical evidence", "",
  report.classification, "",
  `Recorded: ${report.recordedAt}. Source SHA-256: \`${sources["src/tileTravel.ts"].sha256}\`.`, "",
  "The primary alternatives share the actual candidate's committed polyline and camera geometry. The comparison varies only the clock. Direct XY is a deliberately unsafe geometry diagnostic. No alternative is installed in the app.", "",
  "| Fixture | Model | Max lag ms | Max lag tiles | Final settle ms | Interior speed CV | Stationary % | Off-path tiles |",
  "|---|---|---:|---:|---:|---:|---:|---:|", ...table, "",
  "## Interpretation and scope", "",
  "- Candidate: retain the source's coordinated, bounded velocity recipe if real-maze evidence and family review agree. It preserves exact endpoints and corners, avoids repeat-boundary ease-to-zero, and bounds time-to-arrival after every accepted target. Its speed changes at acceleration/catch-up, and its velocity direction changes at exact corners; it is not a globally acceleration-continuous curve.",
  "- Fixed smoothstep: coordinated geometry alone solves actor/camera disagreement, but fixed 112ms travel leaves deliberate idle time between 160/260ms repeated inputs. Matching duration to cadence removes those idle gaps but still brakes and accelerates on every tile. Restarting it on early inputs also resets velocity.",
  "- Gentle damping: the 80ms example has a long settling tail. A 32ms example reduces lag by front-loading motion more sharply. Exact stopping requires an explicit epsilon snap. These examples do not prove every possible damped design inferior; they show why damping is not a free improvement under this acceptance contract.",
  "- Direct XY retargeting: reject where its measured path leaves the already committed cardinal segments. Camera coordination cannot fix wall-cutting in the actor trajectory.",
  "- Bounds: rapid legal-target stress can require more than three tiles of pending path. Render culling must use the swept bounds contract; a time bound alone does not establish a fixed spatial gutter.",
  "- The 320ms first-hold gap is intentional input policy. No recipe may invent another step to hide it. A resumed sample after a long no-input stall lands at its single committed target; this is elapsed-time correctness, not proof that a stalled display is pleasant.", "",
  `Invariant checks: \`${JSON.stringify(invariants)}\`.`, "",
  "Full model definitions, immutable source snapshots, exact target times, traces, sensitivity results, and frame-clock checks are in comparison.json. Real app acceptance still needs browser integration, correct lifecycle and effects, profile-preserving release checks, and Human comfort/device playtesting.", "",
];
await writeFile(join(output, "comparison.md"), summary.join("\n"));
console.log(JSON.stringify({ output, sources, invariants, frameChecks, selected: results.filter((r) => selectedFixtures.includes(r.fixture)).map(({ trace, eventMetrics, ...metrics }) => metrics) }, null, 2));
if (Object.values(invariants).some((passed) => !passed)) process.exitCode = 1;
