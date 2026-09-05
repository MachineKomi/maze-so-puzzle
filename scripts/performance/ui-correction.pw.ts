/** Human UI-03 corrections. Frame probes are diagnostics, not a hardware performance claim. */
import { test, expect, type Page, type Locator } from "@playwright/test";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { execFileSync } from "node:child_process";
import { resolve } from "node:path";
import { CURATED_LEVELS } from "../../src/game/levels";
import { solveLevel } from "../../src/game/solver";
import { createInitialGameState, movePlayer } from "../../src/game/engine";
import { enemyDiscoveriesForView } from "../../src/game/discovery";
import { DIRECTIONS, ENEMY_STYLE_IDS, type Direction, type LevelDefinition } from "../../src/game/types";
import { resolveEnemyArt } from "../../src/artCatalog";
import { createDefaultPlayerProgress, PLAYER_PROGRESS_STORAGE_KEY } from "../../src/progress";
import { ACTIVE_RUN_STORAGE_KEY, createActiveRunSnapshot } from "../../src/session";
import { storyForLevel } from "../../src/story";
import { deriveRoute, heldSegment, selectTesterLevel, expectUiRouteState, readUiRouteState, keyForDirection, type DerivedRouteStep } from "./gameplay-browser";

const output = resolve(process.env.MAZE_PERF_EVIDENCE_DIR!, "ui-correction");
type Rectangle = { x: number; y: number; width: number; height: number };
type Frame = { at: number; sampledAt: number; frameTime?:number; position: { x: number; y: number }; camera: { x: number; y: number }; logical: {x:number;y:number}; logicalCamera:{x:number;y:number}; worldTranslate:{x:number;y:number}; playerTranslate:{x:number;y:number}; travelState:string|undefined; board: Rectangle; hud: Rectangle; steps: string | null };
type Recording = { running: boolean; probe: "geometry"|"inline-styles"; diagnostics:boolean; frames: Frame[]; rafTimes:number[]; inputs: { at: number; key: string }[]; longTasks: {at:number;duration:number}[] };
type RecordedWindow = Window & { __uiCorrection?: Recording };
let pageErrors: string[] = [];

async function action(page: Page, id: string) {
  const control = page.locator(`button[data-focus-id="${id}"]:visible`);
  if (!await control.count()) await page.locator('[data-focus-id="more"]').click();
  await control.click();
}

async function evidence(page: Page, name: string, data?: unknown) {
  await page.screenshot({ path: resolve(output, `${name}.png`) });
  if (data !== undefined) await writeFile(resolve(output, `${name}.json`), JSON.stringify(data, null, 2));
}

async function beginMotionTrace(page: Page) {
  const session = await page.context().newCDPSession(page);
  await session.send("Tracing.start", { categories: "devtools.timeline,blink.user_timing,cc,gpu", transferMode: "ReturnAsStream" });
  return async () => {
    const completed = new Promise<{stream:string}>(resolveTrace => session.once("Tracing.tracingComplete", resolveTrace));
    await session.send("Tracing.end");
    const {stream} = await completed;
    const chunks: Buffer[] = [];
    while (true) {
      const chunk = await session.send("IO.read", {handle:stream});
      chunks.push(Buffer.from(chunk.data, chunk.base64Encoded ? "base64" : "utf8"));
      if (chunk.eof) break;
    }
    await session.send("IO.close", {handle:stream});
    await writeFile(resolve(output, "first-motion-browser-trace.json"), Buffer.concat(chunks));
    await session.detach();
  };
}

async function startRecording(page: Page, lightweight = false) {
  await page.evaluate(({light, diagnostics}) => {
    const record: Recording = { running: true, probe: light ? "inline-styles" : "geometry", diagnostics, frames: [], rafTimes:[], inputs: [], longTasks: [] };
    (window as RecordedWindow).__uiCorrection = record;
    const onKey = (event: KeyboardEvent) => record.inputs.push({ at: performance.now(), key: event.key });
    window.addEventListener("keydown", onKey, {capture:true});
    const observer = diagnostics ? new PerformanceObserver(list => {
      record.longTasks.push(...list.getEntries().map(entry => ({at:entry.startTime,duration:entry.duration})));
    }) : undefined;
    observer?.observe({entryTypes:["longtask"]});
    const rect = (element: HTMLElement): Rectangle => {
      const box = element.getBoundingClientRect();
      return { x: box.x, y: box.y, width: box.width, height: box.height };
    };
    const translate = (element: HTMLElement) => {
      const values = (light ? element.style.translate : getComputedStyle(element).translate).split(" ");
      return { x: parseFloat(values[0]!) || 0, y: parseFloat(values[1]!) || 0 };
    };
    let fixed: {size:number;board:Rectangle;hud:Rectangle}|undefined;
    const sample = (frameTime?: number) => {
      const board = document.querySelector<HTMLElement>(".maze-board");
      const hud = document.querySelector<HTMLElement>(".adventure-hud");
      const world = board?.querySelector<HTMLElement>(".camera-world");
      const player = board?.querySelector<HTMLElement>(".player-layer");
      if (board && hud && world && player) {
        const cols = Number(board.style.getPropertyValue("--grid-size"));
        fixed ??= {size:(parseFloat(getComputedStyle(board).width)-board.clientLeft*2)/cols,board:rect(board),hud:rect(hud)};
        const size = light ? fixed.size : (parseFloat(getComputedStyle(board).width) - board.clientLeft * 2) / cols;
        const w = translate(world), p = translate(player);
        const logicalCamera = { x: -parseFloat(world.style.left) * cols / 100, y: -parseFloat(world.style.top) * cols / 100 };
        const logical = { x: parseFloat(player.style.left) * cols / 100 + logicalCamera.x, y: parseFloat(player.style.top) * cols / 100 + logicalCamera.y };
        const at = performance.now();
        record.frames.push({ at, sampledAt: at, frameTime, logical, logicalCamera, worldTranslate:w, playerTranslate:p, travelState:board.dataset.travelState, board: light ? fixed.board : rect(board), hud: light ? fixed.hud : rect(hud),
          position: { x: logical.x + (p.x - w.x) / size, y: logical.y + (p.y - w.y) / size },
          camera: { x: logicalCamera.x - w.x / size, y: logicalCamera.y - w.y / size },
          steps: document.querySelector(".step-pill")?.getAttribute("aria-label") ?? null,
        });
      }
    };
    // The probe rAF is registered before movement starts. Reading there while
    // moving observes the previous scene paint and attributes a delayed frame
    // to the following short frame. Observe the completed style transaction
    // instead; its timestamp belongs to the coordinates we actually read.
    const paints = new MutationObserver(changes => {
      if (record.running && changes.some(change => change.target instanceof HTMLElement &&
        change.target.matches(".camera-world,.player-layer"))) sample();
    });
    paints.observe(document.querySelector(".maze-board")!, {attributes:true,attributeFilter:["style"],subtree:true});
    const frame = (at: number) => {
      record.rafTimes.push(performance.now());
      if (document.querySelector<HTMLElement>(".maze-board")?.dataset.travelState !== "moving") sample(at);
      if (record.running) requestAnimationFrame(frame);
      else { window.removeEventListener("keydown", onKey, {capture:true}); observer?.disconnect(); paints.disconnect(); }
    };
    requestAnimationFrame(frame);
  }, {light:lightweight,diagnostics:process.env.MAZE_MOTION_DIAGNOSTICS === "1"});
  await expect.poll(() => page.evaluate(() => (window as RecordedWindow).__uiCorrection?.frames.length ?? 0)).toBeGreaterThanOrEqual(3);
}

async function finishRecording(page: Page): Promise<Recording> {
  return page.evaluate(() => {
    const record = (window as RecordedWindow).__uiCorrection!;
    record.running = false;
    return record;
  });
}

function assertStableRect(frames: readonly Frame[], property: "board" | "hud") {
  expect(frames.length).toBeGreaterThan(3);
  for (const dimension of ["x", "y", "width", "height"] as const) {
    const values = frames.map(frame => frame[property][dimension]);
    expect(Math.max(...values) - Math.min(...values), `${property} ${dimension} must not jump during feedback`).toBeLessThanOrEqual(1);
  }
}

async function assertNoScroll(locator: Locator) {
  const overflow = await locator.evaluateAll(elements => elements.map(element => ({
    horizontal: element.scrollWidth - element.clientWidth,
    vertical: element.scrollHeight - element.clientHeight,
  })));
  expect(overflow.length).toBeGreaterThan(0);
  for (const box of overflow) {
    expect(box.horizontal).toBeLessThanOrEqual(1);
    expect(box.vertical).toBeLessThanOrEqual(1);
  }
}

async function ordinaryHome(page: Page) {
  await page.goto("/", { waitUntil: "domcontentloaded" });
  const front = page.locator(".front-door-play");
  if (await front.isVisible()) await front.click();
  await expect(page.locator(".title-play-button")).toBeVisible();
}

// Observe the presentation before input: reduced rescue art can legitimately
// finish while the slower semantic-state polling is still crossing processes.
// The observer proves it appeared; the final absence proves it completed.
async function replayRouteStep(page: Page, step: DerivedRouteStep) {
  const selectors = ".battle-presentation,.rescue-presentation,.jump-presentation,.portal-presentation,.door-opening-presentation";
  const blocking = step.result.events.some(event => ["enemy-defeated", "animal-rescued", "hole-jumped", "portal-warped", "door-opened"].includes(event.type));
  await expectUiRouteState(page, step.before);
  if (blocking) await page.evaluate(selector => {
    const state = { seen: false, observer: null as MutationObserver | null };
    const observe = () => { if (document.querySelector(selector)) state.seen = true; };
    state.observer = new MutationObserver(observe);
    state.observer.observe(document.body, { childList: true, subtree: true });
    (window as Window & { __uiPresentation?: typeof state }).__uiPresentation = state;
    observe();
  }, selectors);
  try {
    await page.keyboard.press(keyForDirection[step.direction]);
    await expectUiRouteState(page, step.result.state);
    if (blocking) {
      await expect.poll(() => page.evaluate(() => (window as Window & {__uiPresentation?:{seen:boolean}}).__uiPresentation?.seen)).toBe(true);
      await expect(page.locator(selectors)).toHaveCount(0, { timeout: 8000 });
    }
    await page.waitForTimeout(90);
    await expectUiRouteState(page, step.result.state);
  } finally {
    if (blocking) await page.evaluate(() => {
      const host = window as Window & { __uiPresentation?: { observer: MutationObserver | null } };
      host.__uiPresentation?.observer?.disconnect();
      delete host.__uiPresentation;
    });
  }
}

async function prepareRoute(page: Page, level: LevelDefinition, count: number) {
  const route = deriveRoute(level, solveLevel(level, { requireAllAnimals: true }).directions);
  await selectTesterLevel(page, level);
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.locator(".maze-board").focus();
  for (const step of route.slice(0, count)) await replayRouteStep(page, step);
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.waitForTimeout(220);
  return route;
}

test.beforeAll(async () => {
  await mkdir(output, { recursive: true });
  await writeFile(resolve(output, "source-build.json"), JSON.stringify({
    capturedAt: new Date().toISOString(),
    head: execFileSync("git", ["rev-parse", "HEAD"], { encoding: "utf8" }).trim(),
    workingTree: execFileSync("git", ["status", "--short"], { encoding: "utf8" }),
    build: JSON.parse(await readFile("node_modules/.cache/maze-performance/build-provenance.json", "utf8")),
    classification: "Candidate regression evidence; frame probes add overhead; no physical-device or Human acceptance implied.",
  }, null, 2));
});
test.beforeEach(({ page }) => {
  pageErrors = [];
  page.on("pageerror", error => pageErrors.push(error.message));
});
test.afterEach(async ({}, info) => {
  await writeFile(resolve(output, `errors-${info.title.replace(/[^a-z0-9]+/gi, "-")}.json`), JSON.stringify(pageErrors, null, 2));
  expect(pageErrors).toEqual([]);
});

for (const viewport of [{ width: 1920, height: 1080 }, { width: 1194, height: 834 }, { width: 1024, height: 768 }, { width: 960, height: 540 }, { width: 844, height: 390 }, { width: 568, height: 320 }]) {
  test(`UI03 landscape maximizes a stable square board at ${viewport.width}x${viewport.height}`, async ({ page }) => {
    await page.setViewportSize(viewport);
    await selectTesterLevel(page, CURATED_LEVELS.find(level => level.id === "clover-comeback-carnival")!);
    await expect(page.locator(".play-shell")).toHaveAttribute("data-mode", "maximized");
    await expect(page.getByRole("button", { name: /^(Big maze|Normal)$/i })).toHaveCount(0);
    await expect(page.locator('[data-focus-id="big-maze"]')).toHaveCount(0);
    await expect(page.locator(".object-layer .item-amount, .object-layer .treasure-amount")).toHaveCount(0);
    await expect(page.locator(".inventory-slot .item-state, .rescue-friend .item-state")).toHaveCount(0);
    const geometry = await page.evaluate(() => {
      const box = (selector: string) => {
        const element = document.querySelector<HTMLElement>(selector)!;
        const rect = element.getBoundingClientRect();
        return { x: rect.x, y: rect.y, width: rect.width, height: rect.height, scroll: element.scrollHeight - element.clientHeight };
      };
      return { board: box(".maze-board"), hud: box(".adventure-hud"), pad: box(".thumb-pad"), map: box(".maze-map-card"), body: { x: document.documentElement.scrollWidth, y: document.documentElement.scrollHeight } };
    });
    expect(Math.abs(geometry.board.width - geometry.board.height)).toBeLessThanOrEqual(1);
    expect(geometry.board.x + geometry.board.width).toBeLessThanOrEqual(geometry.hud.x + 1);
    expect(geometry.hud.y).toBeGreaterThanOrEqual(0);
    expect(geometry.hud.y + geometry.hud.height).toBeLessThanOrEqual(viewport.height + 1);
    expect(geometry.hud.scroll).toBeLessThanOrEqual(1);
    expect(geometry.pad.x + geometry.pad.width / 2).toBeGreaterThan(viewport.width * .65);
    expect(geometry.pad.y + geometry.pad.height).toBeLessThanOrEqual(viewport.height + 1);
    expect(geometry.body.x).toBeLessThanOrEqual(viewport.width);
    expect(geometry.body.y).toBeLessThanOrEqual(viewport.height);
    await evidence(page, `landscape-${viewport.width}-${viewport.height}`, geometry);
    if (viewport.height < 600) {
      await expect(page.locator(".play-shell")).toHaveAttribute("data-layout", "compact-landscape");
      await page.locator('[data-focus-id="more"]').click();
      for (const id of ["home", "mazes", "book", "help", "sound", "restart", "story"]) {
        await expect(page.getByRole("dialog").locator(`[data-focus-id="${id}"]`)).toBeVisible();
      }
      await page.keyboard.press("Escape");
    } else {
      await expect(page.locator(".play-shell")).toHaveAttribute("data-layout", "primary-landscape");
    }
  });
}

test("UI03 first tap and held first tile animate instead of flashing or pausing before repeat", async ({ page }) => {
  const finishTrace = process.env.MAZE_MOTION_DIAGNOSTICS === "1" ? await beginMotionTrace(page) : async () => {};
  try {
  const level = CURATED_LEVELS.find(candidate => candidate.id === "lanternlight-labyrinth")!;
  const route = deriveRoute(level, solveLevel(level, { requireAllAnimals: true }).directions);
  const segment = heldSegment(level, route);
  expect(segment.length).toBeGreaterThanOrEqual(2);
  await page.setViewportSize({ width: 1280, height: 720 });
  const records: Record<string, Recording> = {};
  const axis = segment.direction === "left" || segment.direction === "right" ? "x" : "y";
  const sign = segment.direction === "left" || segment.direction === "up" ? -1 : 1;
  for (const mode of ["tap", "hold"] as const) {
    await prepareRoute(page, level, segment.start);
    await startRecording(page, process.env.MAZE_MOTION_GEOMETRY_PROBE !== "1");
    await page.keyboard.down(keyForDirection[segment.direction]);
    if (mode === "tap") await page.keyboard.up(keyForDirection[segment.direction]);
    const expected = mode === "tap" ? route[segment.start]!.result.state : segment.after;
    try { await expectUiRouteState(page, expected); }
    finally { await page.keyboard.up(keyForDirection[segment.direction]); }
    await expect(page.locator(".maze-board")).toHaveAttribute("data-travel-state", "settled");
    await page.waitForTimeout(60);
    const recording = await finishRecording(page);
    records[mode] = recording;
    // Keep failed-motion evidence as well as passing proof.
    const ticks = recording.rafTimes.filter(at => at >= recording.inputs[0]!.at);
    const intervals = ticks.slice(1).map((at,index) => at-ticks[index]!).sort((a,b)=>a-b);
    const timing = {classification:"Headless callback diagnostics, not a physical-device performance qualification", intervals, over50ms:intervals.filter(ms=>ms>50).length,
      maximumMs:Math.max(0,...intervals),p95Ms:intervals[Math.floor(intervals.length*.95)]??0};
    await writeFile(resolve(output, `first-${mode}-frames.json`), JSON.stringify({ level: level.id, segment, timing, recording }, null, 2));
    const progress = recording.frames.map(frame => ({ ...frame, distance: (frame.position[axis] - segment.before.position[axis]) * sign }));
    const intermediatePositions = new Set(progress.filter(frame => frame.distance > .08 && frame.distance < .92).map(frame => frame.distance.toFixed(3)));
    expect(intermediatePositions.size, `${mode} needs distinct intermediate positions on its first tile`).toBeGreaterThanOrEqual(2);
    for (let index = 1; index < progress.length; index++) {
      const before = progress[index - 1]!, after = progress[index]!;
      if (after.at - before.at > 50) continue;
      expect(after.distance - before.distance, `${mode} cannot jump an entire tile in one normal frame`).toBeLessThan(.66);
      expect(Math.abs(after.camera[axis] - before.camera[axis]), `${mode} camera cannot snap a whole tile`).toBeLessThan(.66);
    }
    if (mode === "hold") {
      const firstArrival = progress.find(frame => frame.distance >= .99)!;
      const nextTravel = progress.find(frame => frame.distance > 1.08)!;
      expect(nextTravel.at - firstArrival.at, "No old 320ms keyboard-style startup gap after the first tile").toBeLessThan(90);
    }
    if (recording.probe === "geometry") assertStableRect(recording.frames, "board");
  }
  await evidence(page, "first-tap-and-hold", { classification: "instrumented diagnostic; real-device comfort still requires play", level: level.id, segment, records });
  } finally { await finishTrace(); }
});

for (const kind of ["potion-collected", "enemy-defeated"] as const) {
  test(`UI03 board and HUD stay still through ${kind}`, async ({ page }) => {
    const candidates = CURATED_LEVELS.slice(0, 6).flatMap(level => {
      const route = deriveRoute(level, solveLevel(level, { requireAllAnimals: true }).directions);
      const index = route.findIndex(step => step.result.events.some(event => event.type === kind));
      return index < 0 ? [] : [{ level, route, index }];
    }).sort((a, b) => a.index - b.index);
    const fixture = candidates[0]!;
    expect(fixture).toBeTruthy();
    await page.setViewportSize({ width: 1280, height: 720 });
    await prepareRoute(page, fixture.level, fixture.index);
    await startRecording(page);
    await page.keyboard.press(keyForDirection[fixture.route[fixture.index]!.direction]);
    await expectUiRouteState(page, fixture.route[fixture.index]!.result.state);
    if (kind === "enemy-defeated") {
      await expect(page.locator(".battle-presentation")).toBeVisible();
      await expect(page.locator(".battle-presentation")).toHaveCount(0, { timeout: 8000 });
    } else {
      await expect(page.locator(".deck-feedback")).toContainText(/Power|Potion|\+/i);
      await page.waitForTimeout(250);
      const next = fixture.route[fixture.index + 1]!;
      await replayRouteStep(page, next);
    }
    await page.waitForTimeout(220);
    const recording = await finishRecording(page);
    assertStableRect(recording.frames, "board");
    assertStableRect(recording.frames, "hud");
    await evidence(page, `stable-${kind}`, { level: fixture.level.id, step: fixture.index, recording });
  });
}

test("UI03 blocked bumps leave the board and reserved feedback area fixed", async ({ page }) => {
  const level = CURATED_LEVELS[0]!, state = createInitialGameState(level);
  const direction = DIRECTIONS.find(candidate => movePlayer(level, state, candidate).events.some(event => event.type === "blocked" && ["wall", "out-of-bounds"].includes(event.reason)))!;
  await selectTesterLevel(page, level);
  await page.locator(".maze-board").focus();
  await page.waitForTimeout(180);
  await startRecording(page);
  await page.keyboard.press(keyForDirection[direction]);
  await page.waitForTimeout(450);
  await expectUiRouteState(page, state);
  const recording = await finishRecording(page);
  assertStableRect(recording.frames, "board");
  assertStableRect(recording.frames, "hud");
  await evidence(page, "stable-blocked-bump", recording);
});

test("UI03 thumb pad has a directional cross and cancels drag/hold on release, modal and resize", async ({ page }) => {
  const level = CURATED_LEVELS.find(candidate => candidate.id === "lanternlight-labyrinth")!;
  await page.setViewportSize({ width: 1194, height: 834 });
  await selectTesterLevel(page, level);
  const pad = page.locator(".thumb-pad");
  const positions = await pad.locator("button").evaluateAll(buttons => Object.fromEntries(buttons.map(button => {
    const box = button.getBoundingClientRect();
    return [(button as HTMLElement).dataset.direction, { x: box.x + box.width / 2, y: box.y + box.height / 2 }];
  })) as Record<Direction, { x: number; y: number }>);
  expect(positions.up.y).toBeLessThan(positions.left.y);
  expect(positions.down.y).toBeGreaterThan(positions.right.y);
  expect(positions.left.x).toBeLessThan(positions.up.x);
  expect(positions.right.x).toBeGreaterThan(positions.down.x);
  let state = createInitialGameState(level);
  const direction = DIRECTIONS.find(candidate => {
    const result = movePlayer(level, state, candidate);
    return result.moved && result.events.every(event => event.type === "moved");
  })!;
  await page.getByRole("button", { name: `Move ${direction}`, exact: true }).click();
  state = movePlayer(level, state, direction).state;
  await expectUiRouteState(page, state);
  await page.waitForTimeout(350);
  await expectUiRouteState(page, state);

  // Press the neutral centre, then steer to an arrow while retaining capture.
  const box = (await pad.boundingBox())!;
  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
  await page.mouse.down();
  const reverse: Record<Direction, Direction> = { up: "down", down: "up", left: "right", right: "left" };
  const back = reverse[direction];
  await page.mouse.move(positions[back].x, positions[back].y);
  await expect(pad).toHaveAttribute("data-steering", "true");
  await expectUiRouteState(page, movePlayer(level, state, back).state);
  await page.mouse.up();
  state = movePlayer(level, state, back).state;
  await page.waitForTimeout(350);
  await expectUiRouteState(page, state);
  await expect(pad).not.toHaveAttribute("data-direction", /.+/);

  // A keyboard-opened modal during pointer capture must cancel the hold.
  await page.mouse.move(positions[direction].x, positions[direction].y);
  await page.mouse.down();
  await page.locator('[data-focus-id="hint"]').focus();
  await page.keyboard.press("Enter");
  await expect(page.getByRole("dialog")).toBeVisible();
  const modalState = await readUiRouteState(page);
  await page.waitForTimeout(380);
  expect(await readUiRouteState(page)).toEqual(modalState);
  await page.mouse.up();
  await page.keyboard.press("Escape");

  const refreshedArrow = (await page.getByRole("button", { name: `Move ${back}`, exact: true }).boundingBox())!;
  await page.mouse.move(refreshedArrow.x + refreshedArrow.width / 2, refreshedArrow.y + refreshedArrow.height / 2);
  await page.mouse.down();
  await page.setViewportSize({ width: 1184, height: 834 });
  await expect(page.locator(".maze-board")).toHaveAttribute("data-travel-state", "settled");
  const resizedState = await readUiRouteState(page);
  await page.waitForTimeout(380);
  expect(await readUiRouteState(page)).toEqual(resizedState);
  await page.mouse.up();
  await evidence(page, "thumb-pad-cancellation", { positions, modalState, resizedState });

  const route = deriveRoute(level, solveLevel(level, { requireAllAnimals: true }).directions);
  const segment = heldSegment(level, route);
  await prepareRoute(page, level, segment.start);
  const heldArrow = (await page.getByRole("button", { name: `Move ${segment.direction}`, exact: true }).boundingBox())!;
  expect(heldArrow.y + heldArrow.height, "The complete held sector must be on screen before testing input").toBeLessThanOrEqual(page.viewportSize()!.height);
  await page.mouse.move(heldArrow.x + heldArrow.width / 2, heldArrow.y + heldArrow.height / 2);
  await page.mouse.down();
  try { await expectUiRouteState(page, segment.after); }
  finally { await page.mouse.up(); }
  await page.waitForTimeout(350);
  await expectUiRouteState(page, segment.after);
});

test("UI03 focused pad Enter repeats cannot queue an extra step after release", async ({ page }) => {
  const level = CURATED_LEVELS[0]!, initial = createInitialGameState(level);
  const first = movePlayer(level, initial, "up"), returned = movePlayer(level, first.state, "down");
  expect(first.moved && returned.moved).toBe(true);
  expect(first.events.every(event => event.type === "moved")).toBe(true);
  await page.setViewportSize({ width:1194, height:834 });
  await selectTesterLevel(page, level);
  await page.getByRole("button", { name:"Move up", exact:true }).focus();
  await startRecording(page, true);
  await page.keyboard.down("Enter");
  try {
    // These are real native repeated keydowns, rather than synthetic clicks.
    // Without the guard they enqueue an apparently deliberate extra tap.
    for (let repeat = 0; repeat < 4; repeat++) await page.keyboard.down("Enter");
  } finally { await page.keyboard.up("Enter"); }
  await page.waitForTimeout(350);
  const recording = await finishRecording(page);
  await writeFile(resolve(output, "pad-enter-repeat-frames.json"), JSON.stringify(recording, null, 2));
  await expectUiRouteState(page, first.state);
  const intermediate = new Set(recording.frames.map(frame => initial.position.y - frame.position.y)
    .filter(distance => distance > .08 && distance < .92).map(distance => distance.toFixed(3)));
  expect(intermediate.size, "A deliberate Enter animates the same one-square travel as a tap").toBeGreaterThanOrEqual(2);
  await expect(page.locator(".maze-board")).toHaveAttribute("data-travel-state", "settled");
  await page.getByRole("button", { name:"Move down", exact:true }).focus();
  await page.keyboard.press("Enter");
  await expectUiRouteState(page, returned.state);
  await expect(page.locator(".maze-board")).toHaveAttribute("data-travel-state", "settled");
  await page.getByRole("button", { name:"Move up", exact:true }).focus();
  await page.keyboard.press("Space");
  const afterSpace = movePlayer(level, returned.state, "up").state;
  await expectUiRouteState(page, afterSpace);
  await page.waitForTimeout(350);
  await expectUiRouteState(page, afterSpace);
  await evidence(page, "pad-enter-repeat-release", { first:first.state.position, returned:returned.state.position, afterSpace:afterSpace.position });
});

test("UI03 Book has five real pages, readable grey locked keepsakes and no undiscovered enemy images", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 720 });
  await ordinaryHome(page);
  await page.getByRole("button", { name: "Ame's adventure book", exact: true }).click();
  await expect(page.getByRole("tab")).toHaveCount(5);
  for (const name of ["Mazes", "Friends", "Bestiary", "Stats", "Achievements"]) {
    await expect(page.getByRole("tab", { name, exact: true })).toBeVisible();
  }
  await page.getByRole("tab", { name: "Achievements", exact: true }).click();
  await expect(page.getByRole("tabpanel")).toHaveAttribute("data-book-page", "achievements");
  await expect(page.locator(".badge-card.locked")).toHaveCount(15);
  await expect(page.locator(".badge-card.locked img")).toHaveCount(15);
  await expect.poll(() => page.locator(".badge-card.locked img").first().evaluate(image => (image as HTMLImageElement).naturalWidth)).toBeGreaterThan(0);
  const locked = await page.locator(".badge-card.locked img").first().evaluate(image => ({ filter: getComputedStyle(image).filter, src: (image as HTMLImageElement).currentSrc, width: image.getBoundingClientRect().width }));
  expect(locked.filter).toContain("grayscale(1)");
  expect(locked.src).toMatch(/\.png|\.webp/);
  expect(locked.width).toBeGreaterThanOrEqual(80);
  await evidence(page, "book-locked-keepsakes", locked);
  const requests: string[] = [];
  page.on("request", request => requests.push(request.url()));
  await page.getByRole("tab", { name: "Bestiary", exact: true }).click();
  await expect(page.locator(".book-unknown-card")).toHaveCount(ENEMY_STYLE_IDS.length);
  await expect(page.locator(".bestiary-grid img, .bestiary-grid source")).toHaveCount(0);
  const enemyPaths = ENEMY_STYLE_IDS.map(id => resolveEnemyArt(id).src.replace(/\.[^.]+$/, ""));
  expect(requests.filter(url => enemyPaths.some(path => url.includes(path)))).toEqual([]);
  await evidence(page, "book-undiscovered-bestiary");
  await page.getByRole("tab", { name: "Friends", exact: true }).click();
  const friend = page.locator(".book-friend-card").first();
  await friend.click();
  await expect(page.getByRole("dialog")).toBeVisible();
  const artBox = (await page.getByRole("dialog").locator(".presentation-art").boundingBox())!;
  expect(Math.min(artBox.width, artBox.height)).toBeGreaterThanOrEqual(192);
  await page.keyboard.press("Escape");
  await expect(page.getByRole("tab", { name: "Friends", exact: true })).toHaveAttribute("aria-selected", "true");
  await expect(friend).toBeFocused();
  await page.getByRole("tab", { name: "Friends", exact: true }).focus();
  await page.keyboard.press("ArrowRight");
  await expect(page.getByRole("tab", { name: "Bestiary", exact: true })).toBeFocused();
});

test("UI03 iPad DPR2 touch taps and captured steering stop cleanly", async ({ browser }, info) => {
  const context = await browser.newContext({
    baseURL: info.project.use.baseURL,
    viewport: { width: 1194, height: 834 }, deviceScaleFactor: 2, hasTouch: true,
  });
  try {
    const page = await context.newPage();
    page.on("pageerror", error => pageErrors.push(error.message));
    const level = CURATED_LEVELS[0]!, initial = createInitialGameState(level);
    await selectTesterLevel(page, level);
    const up = (await page.getByRole("button", { name: "Move up", exact: true }).boundingBox())!;
    await page.touchscreen.tap(up.x + up.width / 2, up.y + up.height / 2);
    const moved = movePlayer(level, initial, "up").state;
    await expectUiRouteState(page, moved);
    await page.waitForTimeout(300);
    await expectUiRouteState(page, moved);
    const pad = (await page.locator(".thumb-pad").boundingBox())!;
    const down = (await page.getByRole("button", { name: "Move down", exact: true }).boundingBox())!;
    const cdp = await context.newCDPSession(page);
    await cdp.send("Input.dispatchTouchEvent", { type: "touchStart", touchPoints: [{ x: pad.x + pad.width / 2, y: pad.y + pad.height / 2 }] });
    await cdp.send("Input.dispatchTouchEvent", { type: "touchMove", touchPoints: [{ x: down.x + down.width / 2, y: down.y + down.height / 2 }] });
    await cdp.send("Input.dispatchTouchEvent", { type: "touchEnd", touchPoints: [] });
    const returned = movePlayer(level, moved, "down").state;
    await expectUiRouteState(page, returned);
    await page.waitForTimeout(350);
    await expectUiRouteState(page, returned);
    await expect(page.locator(".thumb-pad")).not.toHaveAttribute("data-direction", /.+/);
    // Establish two real contacts. Only the secondary cancel is dispatched
    // directly: CDP touchCancel would cancel every active contact together.
    await page.locator(".thumb-pad").evaluate(element => {
      const contacts: { id:number; primary:boolean }[] = [];
      (window as Window & { __padContacts?: typeof contacts }).__padContacts = contacts;
      element.addEventListener("pointerdown", event => {
        const pointer = event as PointerEvent;
        contacts.push({ id:pointer.pointerId, primary:pointer.isPrimary });
      }, { capture:true });
    });
    const primary = { id:11, x:pad.x + pad.width / 2, y:pad.y + pad.height / 2 };
    const secondary = { id:22, x:down.x + down.width / 2, y:down.y + down.height / 2 };
    await cdp.send("Input.dispatchTouchEvent", { type:"touchStart", touchPoints:[primary] });
    await cdp.send("Input.dispatchTouchEvent", { type:"touchStart", touchPoints:[primary, secondary] });
    const contacts = await page.evaluate(() => (window as Window & { __padContacts?: {id:number;primary:boolean}[] }).__padContacts!);
    expect(contacts.some(contact => contact.primary)).toBe(true);
    const secondaryId = contacts.find(contact => !contact.primary)?.id;
    expect(secondaryId).toBeDefined();
    await page.locator(".thumb-pad").evaluate((element, pointerId) => {
      for (const type of ["pointercancel", "lostpointercapture"]) {
        element.dispatchEvent(new PointerEvent(type, { bubbles:true, pointerId, pointerType:"touch", isPrimary:false }));
      }
    }, secondaryId!);
    await cdp.send("Input.dispatchTouchEvent", { type:"touchMove", touchPoints:[{ ...primary, x:up.x + up.width / 2, y:up.y + up.height / 2 }, secondary] });
    await cdp.send("Input.dispatchTouchEvent", { type:"touchEnd", touchPoints:[] });
    const afterSecondaryCancel = movePlayer(level, returned, "up").state;
    await expectUiRouteState(page, afterSecondaryCancel);
    await page.waitForTimeout(350);
    await expectUiRouteState(page, afterSecondaryCancel);
    await expect(page.locator(".thumb-pad")).not.toHaveAttribute("data-direction", /.+/);
    await evidence(page, "ipad-dpr2-touch-pad", { moved:moved.position, returned:returned.position, contacts, afterSecondaryCancel:afterSecondaryCancel.position });
    await cdp.detach();
  } finally { await context.close(); }
});

test("UI03 ordinary story, celebration and bestiary discovery survive reload without tester banking", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 720 });
  await ordinaryHome(page);
  await page.locator(".title-play-button").click();
  await expect(page.locator(".dialog-story")).toBeVisible();
  await expect(page.locator('.dialog-story [data-focus-id="story-skip"], .dialog-story .modal-close')).toHaveCount(0);
  await page.locator(".dialog-story .dialog-body").focus();
  await page.setViewportSize({ width: 720, height: 1280 });
  await expect(page.locator(".modal-backdrop")).toHaveAttribute("inert", "");
  await expect(page.locator(".modal-backdrop")).toHaveAttribute("aria-hidden", "true");
  await page.keyboard.press("Enter");
  await page.keyboard.press("ArrowUp");
  await expect(page.locator(".dialog-story")).toHaveCount(1);
  await page.setViewportSize({ width: 1280, height: 720 });
  await expect(page.locator(".modal-backdrop")).not.toHaveAttribute("inert");
  await expect(page.locator(".dialog-story .dialog-body")).toBeFocused();
  await page.locator(".dialog-story .dialog-body").evaluate(body => {
    const selection = document.getSelection()!, range = document.createRange();
    range.selectNodeContents(body.querySelector("p")!);
    selection.removeAllRanges(); selection.addRange(range);
    body.dispatchEvent(new MouseEvent("click", {bubbles:true}));
  });
  await expect(page.locator(".dialog-story")).toHaveCount(1);
  await page.evaluate(() => document.getSelection()?.removeAllRanges());
  await page.keyboard.press("Enter");
  await expect(page.locator(".dialog-story")).toHaveCount(0);
  const first = CURATED_LEVELS[0]!;
  await action(page, "story");
  await expect(page.locator(".dialog-story")).toBeVisible();
  await page.locator(".dialog-story .dialog-header h2").click();
  await expect(page.locator(".dialog-story")).toHaveCount(0);
  await expectUiRouteState(page, createInitialGameState(first));
  const firstRoute = deriveRoute(first, solveLevel(first, { requireAllAnimals: true }).directions);
  await page.locator(".maze-board").focus();
  await page.emulateMedia({ reducedMotion: "reduce" });
  for (const step of firstRoute.slice(0, -1)) await replayRouteStep(page, step);
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.keyboard.press(keyForDirection[firstRoute.at(-1)!.direction]);
  await expect(page.locator(".dialog-celebration .win-summary")).toBeVisible();
  await assertNoScroll(page.locator(".dialog-celebration, .dialog-celebration .dialog-body"));
  await expect(page.locator(".confetti-piece")).toHaveCount(12);
  expect(await page.locator(".collection-pop").count(), "First completion exercises several newly earned keepsakes as well as the reward panel").toBeGreaterThanOrEqual(2);
  const animations = await page.locator(".rescued-result.rescued img").evaluateAll(images => images.map(image => getComputedStyle(image).animationName));
  expect(animations.length).toBeGreaterThan(0);
  expect(animations.every(name => name.startsWith("win-"))).toBe(true);
  await evidence(page, "ordinary-victory-full", { animations });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(page.locator("html")).toHaveAttribute("data-motion", "reduced");
  expect(await page.locator(".rescued-result.rescued img, .confetti-piece").evaluateAll(images => images.every(image => getComputedStyle(image).animationName === "none"))).toBe(true);
  await assertNoScroll(page.locator(".dialog-celebration, .dialog-celebration .dialog-body"));
  await evidence(page, "ordinary-victory-reduced");
  // Losing button focus must not strand the simple continuation action.
  await page.locator(".dialog-celebration .dialog-body").focus();
  await page.keyboard.down("Enter");
  try {
    await expect(page.locator(".dialog-story")).toBeVisible();
    await expect(page.locator('.dialog-story [data-focus-id="story-advance"]')).toBeFocused();
    // A held Enter becomes a repeat on the newly focused Start button. It
    // must not skip the next story before the player releases the key.
    await page.keyboard.down("Enter");
    await expect(page.locator(".dialog-story")).toBeVisible();
  } finally { await page.keyboard.up("Enter"); }
  await page.locator(".dialog-story .story-copy").click();
  await expect(page.locator(".dialog-story")).toHaveCount(0);
  const second = CURATED_LEVELS[1]!;
  let expected = createInitialGameState(second);
  const route = deriveRoute(second, solveLevel(second, { requireAllAnimals: true }).directions);
  const encounterIndex = route.findIndex(step => enemyDiscoveriesForView(second, step.result.state.position, step.result.state.defeatedEnemyIds).length > 0);
  const initialDiscoveries = enemyDiscoveriesForView(second, expected.position, expected.defeatedEnemyIds);
  if (initialDiscoveries.length === 0) {
    expect(encounterIndex).toBeGreaterThanOrEqual(0);
    await page.locator(".maze-board").focus();
    for (const step of route.slice(0, encounterIndex + 1)) { await replayRouteStep(page, step); expected = step.result.state; }
  }
  const seen = enemyDiscoveriesForView(second, expected.position, expected.defeatedEnemyIds);
  expect(seen.length).toBeGreaterThan(0);
  await action(page, "book");
  await page.getByRole("tab", { name: "Bestiary", exact: true }).click();
  for (const id of seen) await expect(page.locator(`[data-focus-id="book-guardian:${id}"]`)).toBeVisible();
  const beforeTester = await page.evaluate(key => JSON.parse(localStorage.getItem(key)!), PLAYER_PROGRESS_STORAGE_KEY);
  expect(beforeTester.totalCompletions).toBe(1);
  expect(beforeTester.discoveredEnemyIds).toEqual(expect.arrayContaining(seen));
  await page.reload();
  const restored = await page.evaluate(key => JSON.parse(localStorage.getItem(key)!), PLAYER_PROGRESS_STORAGE_KEY);
  expect(restored).toEqual(beforeTester);
  await selectTesterLevel(page, CURATED_LEVELS.find(candidate => candidate.id === "rainbow-power-parade")!);
  await page.waitForTimeout(220);
  expect(await page.evaluate(key => JSON.parse(localStorage.getItem(key)!), PLAYER_PROGRESS_STORAGE_KEY)).toEqual(beforeTester);
  await evidence(page, "discovery-save-and-tester-isolation", { seen, beforeTester, restored });
});

test("UI03 a newer profile preserves its progress and active run through startup and temporary play", async ({ page }) => {
  const level = CURATED_LEVELS[0]!, initial = createInitialGameState(level);
  const snapshot = createActiveRunSnapshot({
    runId:"run-future-profile-review", mode:"normal", level, game:initial, revealedTiles:[],
  });
  expect(snapshot).not.toBeNull();
  const progressRaw = JSON.stringify({ ...createDefaultPlayerProgress(), schemaVersion:7, gold:987, futureMarker:{ preserve:"newer-profile" } });
  const runRaw = JSON.stringify({ ...snapshot, schemaVersion:99, futureMarker:{ preserve:"newer-active-run" } });
  const stored = { progressKey:PLAYER_PROGRESS_STORAGE_KEY, runKey:ACTIVE_RUN_STORAGE_KEY, progressRaw, runRaw };
  await page.addInitScript(values => {
    localStorage.setItem(values.progressKey, values.progressRaw);
    localStorage.setItem(values.runKey, values.runRaw);
  }, stored);
  const readRaw = () => page.evaluate(({ progressKey, runKey }) => ({
    progressRaw:localStorage.getItem(progressKey), runRaw:localStorage.getItem(runKey),
  }), stored);
  await page.setViewportSize({ width:1280, height:720 });
  await ordinaryHome(page);
  await expect(page.locator(".save-warning")).toContainText("saved by a newer version");
  expect(await readRaw()).toEqual({ progressRaw, runRaw });
  await page.locator(".title-play-button").click();
  await expect(page.locator(".dialog-story")).toBeVisible();
  await page.locator(".dialog-story .dialog-body").focus();
  await page.keyboard.press("Enter");
  await expect(page.locator(".dialog-story")).toHaveCount(0);
  const direction = DIRECTIONS.find(candidate => movePlayer(level, initial, candidate).moved)!;
  expect(direction).toBeTruthy();
  await page.locator(".maze-board").focus();
  await page.keyboard.press(keyForDirection[direction]);
  await expectUiRouteState(page, movePlayer(level, initial, direction).state);
  await page.waitForTimeout(300);
  expect(await readRaw()).toEqual({ progressRaw, runRaw });
  await expect(page.locator(".save-warning")).toContainText("saved by a newer version");
  await evidence(page, "future-profile-read-only", { untouched:await readRaw(), moved:direction });
});

test("UI03 five-friend normal victory with the longest outro and newly earned rewards fits every landscape", async ({ page }) => {
  test.setTimeout(300_000);
  const level = CURATED_LEVELS.filter(candidate => candidate.objects.filter(object => object.kind === "animal").length === 5)
    .sort((a, b) => (storyForLevel(b.id)?.outro.length ?? 0) - (storyForLevel(a.id)?.outro.length ?? 0))[0]!;
  expect(level).toBeTruthy();
  // Only campaign access is seeded. The route, rescues, discoveries, Power,
  // completion and all new rewards come from the current engine's real play.
  await page.addInitScript(({ key, progress }) => localStorage.setItem(key, JSON.stringify(progress)), {
    key: PLAYER_PROGRESS_STORAGE_KEY, progress: createDefaultPlayerProgress(CURATED_LEVELS.length),
  });
  await page.setViewportSize({ width: 1280, height: 720 });
  await ordinaryHome(page);
  await page.getByRole("button", { name: "Choose a maze", exact: true }).click();
  await page.locator(".level-picker-list button").filter({ hasText: level.name }).click();
  await page.locator('[data-focus-id="story-advance"]').click();
  await expect(page.locator(".level-kicker")).not.toContainText(/Preview|Test/);
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.locator(".maze-board").focus();
  const route = deriveRoute(level, solveLevel(level, { requireAllAnimals: true }).directions);
  for (const step of route.slice(0, -1)) await replayRouteStep(page, step);
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.keyboard.press(keyForDirection[route.at(-1)!.direction]);
  await expect(page.locator(".dialog-celebration .win-summary")).toBeVisible();
  await expect(page.locator(".rescued-result.rescued")).toHaveCount(5);
  await expect(page.locator(".reward-panel")).toBeVisible();
  expect(await page.locator(".collection-pop").count()).toBeGreaterThanOrEqual(2);
  const animations = await page.locator(".rescued-result.rescued img").evaluateAll(images => images.map(image => getComputedStyle(image).animationName));
  expect(new Set(animations).size, "Different friends keep their own little celebration dances").toBeGreaterThan(1);
  for (const viewport of [{ width: 1920, height: 1080 }, { width: 1194, height: 834 }, { width: 1024, height: 768 }, { width: 960, height: 540 }, { width: 844, height: 390 }, { width: 568, height: 320 }]) {
    await page.setViewportSize(viewport);
    await assertNoScroll(page.locator(".dialog-celebration, .dialog-celebration .dialog-body"));
    const footer = (await page.locator(".dialog-celebration .dialog-footer").boundingBox())!;
    expect(footer.y + footer.height).toBeLessThanOrEqual(viewport.height);
    await evidence(page, `five-friend-victory-${viewport.width}-${viewport.height}`, {
      level: level.id, routeLength: route.length, seeded: "campaign access only; no pre-earned rewards",
      story: storyForLevel(level.id)?.outro, animations, footer,
    });
  }
});

for (const viewport of [{ width: 1194, height: 834 }, { width: 844, height: 390 }]) {
  test(`UI03 joyful victory fits without scrolling at ${viewport.width}x${viewport.height}`, async ({ page }) => {
    const level = CURATED_LEVELS[0]!;
    const route = deriveRoute(level, solveLevel(level, { requireAllAnimals: true }).directions);
    await page.setViewportSize(viewport);
    await prepareRoute(page, level, route.length - 1);
    await page.keyboard.press(keyForDirection[route.at(-1)!.direction]);
    await expect(page.locator(".dialog-celebration .win-summary")).toBeVisible();
    await assertNoScroll(page.locator(".dialog-celebration, .dialog-celebration .dialog-body"));
    await evidence(page, `victory-${viewport.width}-${viewport.height}`);
  });
}
