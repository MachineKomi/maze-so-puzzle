/** V22-PERF-01 physical-intent regressions. Timing is lifecycle evidence, not a device performance qualification. */
import { test, expect, type Page, type TestInfo } from "@playwright/test";
import { mkdir, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { tmpdir } from "node:os";
import { createHash } from "node:crypto";
import { movePlayer } from "../../src/game/engine";
import { CURATED_LEVELS } from "../../src/game/levels";
import { advanceFollowerProcession, createFollowerProcession, followerTargets } from "../../src/game/followerTrail";
import { DIRECTIONS, DIRECTION_DELTAS, type Direction, type GameState } from "../../src/game/types";
import { applyLevelCompletion, createDefaultPlayerProgress, PLAYER_PROGRESS_STORAGE_KEY } from "../../src/progress";
import { ACTIVE_RUN_STORAGE_KEY } from "../../src/session";
import { HELD_MOVE_INITIAL_DELAY_MS } from "../../src/movementControls";
import { PRESENTATION_PREFERENCES_KEY, type PresentationPreferences } from "../../src/motion";
import { deriveRoute, expectUiRouteState, keyForDirection, readUiRouteState, replayRouteStep, selectTesterLevel } from "./gameplay-browser";
import { SUCCESS_EVENTS, continuationDirections, deliberateBlockerFixture, finalMazeFixture, findInputFixture, isOrdinaryMove, savedFixture, successFixture, type InputFixture } from "./v22-input-fixtures";

const output = resolve(process.env.MAZE_PERF_EVIDENCE_DIR ?? resolve(tmpdir(), "maze-v22-input"), "v22-input");
const busySelector = ".battle-presentation,.rescue-presentation,.jump-presentation,.portal-presentation,.door-opening-presentation";
type Source = "keyboard" | "fixed-pad" | "board-drag";
type Sample = { at: number; steps: number; presentation: string[]; dialog: string | null };
type InputTrace = { samples: Sample[]; pointerId: number | null; observer: MutationObserver; stop: () => void };
type TraceWindow = Window & { __v22Input?: InputTrace };
type Driver = { start: (direction: Direction) => Promise<void>; steer: (direction: Direction) => Promise<void>; neutral: () => Promise<void>; release: () => Promise<void> };

async function record(page: Page) {
  await page.evaluate(selector => {
    const state = { samples: [] as Sample[], pointerId: null as number | null } as InputTrace;
    const observe = () => {
      const stepText = document.querySelector(".step-pill")?.getAttribute("aria-label") ?? "";
      const sample: Sample = { at: performance.now(), steps: Number(/^(\d+)/.exec(stepText)?.[1] ?? -1),
        presentation: [...document.querySelectorAll(selector)].map(node => node.className),
        dialog: document.querySelector('[role="dialog"]')?.getAttribute("aria-labelledby") ?? null };
      const previous = state.samples.at(-1);
      if (!previous || previous.steps !== sample.steps || previous.presentation.join() !== sample.presentation.join() || previous.dialog !== sample.dialog) state.samples.push(sample);
    };
    const pointer = (event: PointerEvent) => { if (event.isPrimary) state.pointerId = event.pointerId; };
    state.observer = new MutationObserver(observe);
    state.observer.observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ["aria-label"] });
    document.addEventListener("pointerdown", pointer, true);
    state.stop = () => { state.observer.disconnect(); document.removeEventListener("pointerdown", pointer, true); };
    (window as TraceWindow).__v22Input = state;
    observe();
  }, busySelector);
}

async function trace(page: Page): Promise<Sample[]> {
  return page.evaluate(() => (window as TraceWindow).__v22Input?.samples ?? []);
}

async function saveEvidence(page: Page, info: TestInfo, fixture?: InputFixture) {
  const samples = await trace(page);
  const prefix = fixture ? JSON.stringify(fixture.prefix) : "";
  const report = { test: info.title, verdict: "See playwright-results.json; captured before the runner assigns final status", viewport: page.viewportSize(), inputObservation: "production browser; DOM presentation and semantic step mutations",
    visibilityProbe: info.title.endsWith("after hidden") ? "Synthetic visibility getters and event exercise the bound cancellation handlers; physical backgrounding remains a device gate." : undefined,
    fixture: fixture ? { levelId: fixture.level.id, contentRevision: fixture.level.contentRevision, gameplayFingerprint: fixture.level.gameplayFingerprint,
      prefix: fixture.prefix, prefixSha256: createHash("sha256").update(prefix).digest("hex"), before: fixture.before, direction: fixture.direction,
      expectedInteraction: fixture.result, snapshotKind: "normal; current engine replay and current snapshot normalizer" } : null, samples };
  const path = resolve(output, `${info.title.replace(/[^a-zA-Z0-9-]+/g, "-")}.json`);
  await writeFile(path, JSON.stringify(report, null, 2));
  await info.attach("input-lifecycle", { path, contentType: "application/json" });
  await page.evaluate(() => (window as TraceWindow).__v22Input?.stop());
}

async function loadSaved(page: Page, fixture: InputFixture, suffix: string, progress = createDefaultPlayerProgress(CURATED_LEVELS.length), preferences?: PresentationPreferences) {
  const snapshot = savedFixture(fixture, suffix);
  await page.addInitScript(({ runKey, progressKey, snapshot, progress, preferencesKey, preferences }) => {
    localStorage.clear();
    localStorage.setItem(runKey, JSON.stringify(snapshot));
    localStorage.setItem(progressKey, JSON.stringify(progress));
    if (preferences) localStorage.setItem(preferencesKey, JSON.stringify(preferences));
  }, { runKey: ACTIVE_RUN_STORAGE_KEY, progressKey: PLAYER_PROGRESS_STORAGE_KEY, snapshot, progress, preferencesKey: PRESENTATION_PREFERENCES_KEY, preferences });
  await page.goto("/", { waitUntil: "domcontentloaded" });
  await page.locator(".front-door-play").click();
  await page.locator(".title-play-button").click();
  await expect(page.getByRole("region", { name: `${fixture.level.name} maze` })).toBeVisible();
  await expect(page.locator(".level-kicker")).not.toContainText(/Preview|Test/);
  await expectUiRouteState(page, fixture.before);
  await expect(page.locator(busySelector)).toHaveCount(0);
  await page.evaluate(async () => { await document.fonts.ready; await new Promise<void>(resolveFrame => requestAnimationFrame(() => requestAnimationFrame(() => resolveFrame()))); });
  await expect(page.locator(".maze-board")).toHaveAttribute("data-travel-state", "settled");
  await page.locator(".maze-board").focus();
  await record(page);
}

async function driver(page: Page, source: Source): Promise<Driver> {
  let held: Direction | null = null;
  let down = false;
  const pad = page.locator(".thumb-pad");
  const board = page.locator(".maze-board");
  const anchor = source === "board-drag" ? await page.locator(".player-layer").evaluate(node => {
    const box = node.getBoundingClientRect();
    return { x: box.x + box.width / 2, y: box.y + box.height / 2 };
  }) : await pad.evaluate(node => { const box = node.getBoundingClientRect(); return { x: box.x + box.width / 2, y: box.y + box.height / 2 }; });
  const dragDistance = source === "board-drag" ? await board.evaluate(node => Math.max(12, Math.min(42, node.clientWidth / Number((node as HTMLElement).style.getPropertyValue("--grid-size")) * .6))) : 0;
  const steer = async (direction: Direction) => {
    if (source === "keyboard") {
      const previous = held;
      if (previous === direction) return;
      await page.keyboard.down(keyForDirection[direction]);
      held = direction;
      if (previous) await page.keyboard.up(keyForDirection[previous]);
    } else if (source === "fixed-pad") {
      const box = (await page.getByRole("button", { name: `Move ${direction}`, exact: true }).boundingBox())!;
      await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
      held = direction;
    } else {
      const delta = DIRECTION_DELTAS[direction];
      await page.mouse.move(anchor.x + delta.x * dragDistance, anchor.y + delta.y * dragDistance);
      held = direction;
    }
  };
  const release = async () => {
    if (source === "keyboard") { if (held) await page.keyboard.up(keyForDirection[held]); }
    else if (down) await page.mouse.up();
    held = null; down = false;
  };
  return {
    start: async direction => {
      if (source === "keyboard") await steer(direction);
      else if (source === "fixed-pad") { await steer(direction); await page.mouse.down(); down = true; }
      else { await page.mouse.move(anchor.x, anchor.y); await page.mouse.down(); down = true; await steer(direction); }
    },
    steer,
    neutral: async () => {
      if (source === "keyboard") await release();
      else { await page.mouse.move(anchor.x, anchor.y); held = null; }
    }, release,
  };
}

async function waitForPresentation(page: Page) {
  await page.waitForFunction(() => (window as TraceWindow).__v22Input?.samples.some(sample => sample.presentation.length > 0), undefined, { timeout: 3000 });
  await expect(page.locator(busySelector).first()).toBeVisible();
}

async function expectStill(page: Page, expected: GameState, delay = HELD_MOVE_INITIAL_DELAY_MS * 3) {
  await page.waitForTimeout(delay);
  await expectUiRouteState(page, expected);
}

async function waitForStep(page: Page, steps: number) {
  // Poll in the page so the real release reaches the source before another 160ms cadence.
  await page.waitForFunction(expected => Number(/^(\d+)/.exec(document.querySelector(".step-pill")?.getAttribute("aria-label") ?? "")?.[1]) >= expected,
    steps, { polling: "raf", timeout: 10_000 });
}

function assertFreshResume(samples: readonly Sample[], interactionSteps: number) {
  const firstBusy = samples.findIndex(sample => sample.presentation.length > 0);
  expect(firstBusy).toBeGreaterThanOrEqual(0);
  const firstContinuation = samples.find(sample => sample.steps > interactionSteps);
  expect(firstContinuation, "A held live intent must eventually continue").toBeTruthy();
  const lastBusy = samples.filter(sample => sample.at < firstContinuation!.at && sample.presentation.length > 0).at(-1)!;
  const ended = samples.find(sample => sample.at > lastBusy.at && sample.presentation.length === 0)!;
  expect(firstContinuation!.presentation, "No action may slip through a chained presentation").toHaveLength(0);
  // Removal is observed after the callback. The 20ms tolerance accommodates a
  // delayed observer delivery; upper-bound latency is recorded, not hardware-qualified.
  expect(firstContinuation!.at - ended.at, "Resume must restart the normal first-step cadence").toBeGreaterThanOrEqual(HELD_MOVE_INITIAL_DELAY_MS - 20);
  for (const sample of samples.filter(candidate => candidate.presentation.length > 0)) expect(sample.steps).toBe(interactionSteps);
}

test.beforeAll(async () => { await mkdir(output, { recursive: true }); });
test.use({ viewport: { width: 1194, height: 834 } });
test.beforeEach(async ({ page }) => { await page.emulateMedia({ reducedMotion: "no-preference" }); });

for (const takeover of ["held", "released"] as const) {
  test(`V22 input keyboard to ${takeover} pad during success keeps only the new physical source`, async ({ page }, info) => {
    const fixture = successFixture("door-opened", true);
    await loadSaved(page, fixture, `takeover-${takeover}`);
    const keyboard = await driver(page, "keyboard"), pad = await driver(page, "fixed-pad");
    const direction = continuationDirections(fixture).find(candidate => candidate !== fixture.direction)!;
    try {
      await keyboard.start(fixture.direction);
      await waitForPresentation(page);
      // The old physical key stays depressed through source takeover.
      await pad.start(direction);
      if (takeover === "released") {
        await pad.release();
        await expect(page.locator(busySelector)).toHaveCount(0, { timeout: 10_000 });
        await expectStill(page, fixture.result.state);
        await keyboard.release();
        await expectStill(page, fixture.result.state);
      } else {
        const next = movePlayer(fixture.level, fixture.result.state, direction);
        await waitForStep(page, next.state.steps);
        // Releasing the displaced key must not enqueue a fallback action.
        await keyboard.release();
        await pad.release();
        await expectStill(page, next.state);
        assertFreshResume(await trace(page), fixture.result.state.steps);
      }
    } finally { await keyboard.release(); await pad.release(); await saveEvidence(page, info, fixture); }
  });
}

for (const preferences of [
  { motion: "reduced", quality: "full" },
  { motion: "full", quality: "lite" },
  { motion: "full", quality: "static" },
] as const) {
  test(`V22 input ${preferences.quality} quality ${preferences.motion} motion success keeps normal held cadence`, async ({ page }, info) => {
    const fixture = successFixture("door-opened");
    await loadSaved(page, fixture, `comfort-${preferences.quality}-${preferences.motion}`, undefined, preferences);
    await expect(page.locator("html")).toHaveAttribute("data-quality", preferences.quality);
    await expect(page.locator("html")).toHaveAttribute("data-motion", preferences.motion);
    const controls = await driver(page, "fixed-pad");
    try {
      await controls.start(fixture.direction);
      // Record insertion before sending input: Reduced/Static art can complete
      // before the cross-process visibility expectation reaches the page.
      await page.waitForFunction(() => (window as TraceWindow).__v22Input?.samples.some(sample => sample.presentation.length > 0));
      const next = movePlayer(fixture.level, fixture.result.state, fixture.direction);
      await waitForStep(page, next.state.steps);
      await controls.release();
      await expectStill(page, next.state);
      assertFreshResume(await trace(page), fixture.result.state.steps);
    } finally { await controls.release(); await saveEvidence(page, info, fixture); }
  });
}

test.describe("V22 live touch joystick production styles", () => {
  test.use({ hasTouch: true });

  for (const quality of ["full", "lite"] as const) {
    test(`${quality} keeps a visible neutral touch and computes the intended backdrop`, async ({ page, context }, info) => {
      const fixture = successFixture("door-opened");
      await loadSaved(page, fixture, `live-touch-${quality}`, undefined, { motion: "full", quality });
      await expect(page.locator("html")).toHaveAttribute("data-quality", quality);
      await expect(page.locator(".game-stage")).toHaveAttribute("data-quality", quality);
      const point = await page.locator(".player-layer").evaluate(node => {
        const box = node.getBoundingClientRect();
        return { x: box.x + box.width / 2, y: box.y + box.height / 2 };
      });
      const touch = await context.newCDPSession(page);
      let held = false;
      try {
        // CDP dispatches actual browser touch/pointer events, not a hidden-node
        // style probe or JavaScript-created PointerEvent. One-pixel jitter stays neutral.
        await touch.send("Input.dispatchTouchEvent", { type: "touchStart", touchPoints: [{ ...point, id: 1, radiusX: 1, radiusY: 1, force: 1 }] });
        held = true;
        await expect(page.locator(".touch-joystick")).toBeVisible();
        await touch.send("Input.dispatchTouchEvent", { type: "touchMove", touchPoints: [{ x: point.x + 1, y: point.y + 1, id: 1, radiusX: 1, radiusY: 1, force: 1 }] });
        await expect(page.locator(".touch-joystick-origin")).toBeVisible();
        const computed = await page.locator(".touch-joystick-origin").evaluate(node => ({
          backdropFilter: getComputedStyle(node).backdropFilter,
          joystickHidden: (node.parentElement as HTMLElement).hidden,
          playerFilter: getComputedStyle(document.querySelector(".player-sprite")!).filter,
        }));
        await info.attach("live-touch-computed-styles", { body: JSON.stringify({ quality, computed }), contentType: "application/json" });
        expect(computed.joystickHidden).toBe(false);
        expect(computed.backdropFilter).toBe(quality === "lite" ? "none" : "blur(2px)");
        if (quality === "lite") expect(computed.playerFilter).toBe("none");
        else expect(computed.playerFilter).toContain("drop-shadow(");
        await expectStill(page, fixture.before);
        await touch.send("Input.dispatchTouchEvent", { type: "touchEnd", touchPoints: [] });
        held = false;
        await expect(page.locator(".touch-joystick")).toBeHidden();
        await expectStill(page, fixture.before);
      } finally {
        if (held) await touch.send("Input.dispatchTouchEvent", { type: "touchEnd", touchPoints: [] });
        await touch.detach();
        await saveEvidence(page, info, fixture);
      }
    });
  }
});

test("V22 Static mounts and reenters with working first board taps and exact settled geometry", async ({ page }, info) => {
  const fixture = successFixture("door-opened");
  await loadSaved(page, fixture, "static-first-tap", undefined, { motion: "full", quality: "static" });
  const tap = async (direction: Direction) => {
    const point = await page.locator(".player-layer").evaluate((node, delta) => {
      const box = node.getBoundingClientRect();
      return { x: box.x + box.width * (.5 + delta.x * .7), y: box.y + box.height * (.5 + delta.y * .7) };
    }, DIRECTION_DELTAS[direction]);
    await page.mouse.click(point.x, point.y);
  };
  const direction = DIRECTIONS.find(candidate => isOrdinaryMove(movePlayer(fixture.level, fixture.before, candidate)))!;
  expect(direction).toBeTruthy();
  const moved = movePlayer(fixture.level, fixture.before, direction).state;
  await tap(direction);
  await expectStill(page, moved);
  await expect(page.locator(".maze-board")).toHaveAttribute("data-travel-state", "settled");
  await page.locator('[data-focus-id="home"]:visible').focus();
  await page.keyboard.press("Enter");
  await expect(page.locator(".title-play-button")).toBeVisible();
  await page.locator(".title-play-button").click();
  await expectUiRouteState(page, moved);
  await expect(page.locator(".maze-board")).toHaveAttribute("data-travel-state", "settled");
  const opposite: Record<Direction, Direction> = { up: "down", down: "up", left: "right", right: "left" };
  await tap(opposite[direction]);
  const returned = movePlayer(fixture.level, moved, opposite[direction]).state;
  await expectStill(page, returned);
  await expect(page.locator(".maze-board")).toHaveAttribute("data-travel-state", "settled");
  await saveEvidence(page, info, fixture);
});

for (const kind of SUCCESS_EVENTS) for (const source of ["keyboard", "fixed-pad", "board-drag"] as const) {
  for (const action of ["hold", "steer", "release"] as const) {
    test(`V22 input ${source} ${action} through ${kind}`, async ({ page }, info) => {
      const fixture = successFixture(kind, action === "steer");
      await loadSaved(page, fixture, `${kind}-${source}-${action}`);
      const controls = await driver(page, source);
      try {
        await controls.start(fixture.direction);
        await waitForPresentation(page);
        await expectUiRouteState(page, fixture.result.state);
        if (action === "release") {
          await controls.release();
          await expect(page.locator(busySelector)).toHaveCount(0, { timeout: 10_000 });
          await expectStill(page, fixture.result.state);
        } else {
          const nextDirection = action === "steer" ? continuationDirections(fixture).find(direction => direction !== fixture.direction)! : fixture.direction;
          if (action === "steer") await controls.steer(nextDirection);
          const next = movePlayer(fixture.level, fixture.result.state, nextDirection);
          expect(isOrdinaryMove(next)).toBe(true);
          await waitForStep(page, next.state.steps);
          await controls.release();
          await expectStill(page, next.state);
          assertFreshResume(await trace(page), fixture.result.state.steps);
        }
      } finally { await controls.release(); await saveEvidence(page, info, fixture); }
    });
  }
}

for (const source of ["fixed-pad", "board-drag"] as const) {
  test(`V22 input ${source} neutral during success and deliberately steer again`, async ({ page }, info) => {
    const fixture = successFixture("door-opened");
    await loadSaved(page, fixture, `neutral-${source}`);
    const controls = await driver(page, source);
    try {
      await controls.start(fixture.direction);
      await waitForPresentation(page);
      await controls.neutral();
      await expect(page.locator(busySelector)).toHaveCount(0, { timeout: 10_000 });
      await expectStill(page, fixture.result.state);
      await controls.steer(fixture.direction);
      const next = movePlayer(fixture.level, fixture.result.state, fixture.direction);
      await waitForStep(page, next.state.steps);
      await controls.release();
      await expectStill(page, next.state);
    } finally { await controls.release(); await saveEvidence(page, info, fixture); }
  });
}

for (const cancel of ["blur", "hidden", "modal", "resize", "pointercancel", "lostpointercapture"] as const) {
  test(`V22 input successful presentation cannot resurrect after ${cancel}`, async ({ page }, info) => {
    const fixture = successFixture("door-opened");
    await loadSaved(page, fixture, `cancel-${cancel}`);
    const controls = await driver(page, "fixed-pad");
    try {
      await controls.start(fixture.direction);
      await waitForPresentation(page);
      if (cancel === "blur") await page.evaluate(() => window.dispatchEvent(new Event("blur")));
      else if (cancel === "hidden") await page.evaluate(() => {
        Object.defineProperty(document, "visibilityState", { configurable: true, get: () => "hidden" });
        Object.defineProperty(document, "hidden", { configurable: true, get: () => true });
        document.dispatchEvent(new Event("visibilitychange"));
      });
      else if (cancel === "resize") await page.setViewportSize({ width: 1184, height: 824 });
      else if (cancel === "modal") {
        await page.locator('[data-focus-id="hint"]:visible').focus();
        await page.keyboard.press("Enter");
        await expect(page.getByRole("dialog")).toBeVisible();
        await page.keyboard.press("Escape");
      } else await page.locator(".thumb-pad").evaluate((node, type) => node.dispatchEvent(new PointerEvent(type, {
        bubbles: true, pointerId: (window as TraceWindow).__v22Input!.pointerId!, pointerType: "mouse", isPrimary: true,
      })), cancel);
      if (cancel === "hidden") await page.evaluate(() => {
        delete (document as unknown as Record<string, unknown>).visibilityState;
        delete (document as unknown as Record<string, unknown>).hidden;
        document.dispatchEvent(new Event("visibilitychange"));
      });
      await expect(page.locator(busySelector)).toHaveCount(0, { timeout: 10_000 });
      await expectStill(page, fixture.result.state);
    } finally { await controls.release(); await saveEvidence(page, info, fixture); }
  });
}

for (const blocked of ["power", "capability"] as const) for (const source of ["keyboard", "fixed-pad", "board-drag"] as const) {
  test(`V22 input fresh ${source} ${blocked} attempts explain once per gesture`, async ({ page }, info) => {
    const fixture = deliberateBlockerFixture(blocked);
    expect(fixture, "The blocker must come from a real legal saved route").toBeTruthy();
    await loadSaved(page, fixture!, `${blocked}-${source}`);
    const controls = await driver(page, source);
    try {
      for (let attempt = 0; attempt < 3; attempt++) {
        await controls.start(fixture!.direction);
        await expect(page.getByRole("dialog", { name: blocked === "power" ? "Too strong!" : "You need something!" })).toBeVisible();
        await page.waitForTimeout(HELD_MOVE_INITIAL_DELAY_MS * 3);
        await expectUiRouteState(page, fixture!.result.state);
        await page.keyboard.press("Escape");
        await expect(page.getByRole("dialog")).toHaveCount(0);
        await expectStill(page, fixture!.result.state);
        await expect(page.getByRole("dialog")).toHaveCount(0);
        await controls.release();
      }
    } finally { await controls.release(); await saveEvidence(page, info, fixture!); }
  });
}

for (const chained of ["door-opened", "enemy-defeated", "animal-rescued"] as const) {
  test(`V22 input chained jump and ${chained} has no intermediate unlock`, async ({ page }, info) => {
    const fixture = findInputFixture(events => events.some(event => event.type === "hole-jumped") && events.some(event => event.type === chained), { differentDirectionContinuation: true });
    test.skip(!fixture, `No current authored perfect-route prefix reaches a combined hole-jumped + ${chained} transition; no synthetic save is substituted.`);
    await loadSaved(page, fixture!, `chain-${chained}`);
    const controls = await driver(page, "keyboard");
    try {
      await controls.start(fixture!.direction);
      await waitForPresentation(page);
      const direction = continuationDirections(fixture!).find(candidate => candidate !== fixture!.direction)!;
      await controls.steer(direction);
      const next = movePlayer(fixture!.level, fixture!.result.state, direction);
      await waitForStep(page, next.state.steps);
      await controls.release();
      await expectStill(page, next.state);
      const samples = await trace(page);
      expect(samples.some(sample => sample.presentation.some(name => name.includes("jump-presentation")))).toBe(true);
      const second = { "door-opened": "door-opening-presentation", "enemy-defeated": "battle-presentation", "animal-rescued": "rescue-presentation" }[chained];
      expect(samples.some(sample => sample.presentation.some(name => name.includes(second)))).toBe(true);
      assertFreshResume(samples, fixture!.result.state.steps);
    } finally { await controls.release(); await saveEvidence(page, info, fixture!); }
  });
}

for (const motion of ["full", "reduced"] as const) for (const action of ["held", "released", "hidden"] as const) {
  test(`R1 stalled jump-rescue ${motion} ${action} waits for the actual final phase`, async ({ page }, info) => {
    const fixture = findInputFixture(events => events.some(event => event.type === "hole-jumped") && events.some(event => event.type === "animal-rescued"), { differentDirectionContinuation: true });
    expect(fixture, "The delayed-handoff regression requires a real authored jump-rescue route").toBeTruthy();
    await loadSaved(page, fixture!, `r1-stalled-${motion}-${action}`, undefined, { motion, quality: "full" });
    const time = new Date("2026-09-05T12:00:00Z");
    await page.clock.install({ time });
    await page.clock.pauseAt(time);
    await page.evaluate(() => (window as TraceWindow).__v22Input?.stop());
    await record(page);
    const controls = await driver(page, "keyboard");
    const direction = continuationDirections(fixture!).find(candidate => candidate !== fixture!.direction)!;
    try {
      await controls.start(fixture!.direction);
      await expect(page.locator(".jump-presentation")).toHaveCount(1);
      await controls.steer(direction);
      // Clock.fastForward fires overdue callbacks once at the advanced time,
      // reproducing a blocked event loop across both original phase deadlines.
      // Phase two must receive its full duration from its actual late start.
      await page.clock.fastForward(5000);
      await expect(page.locator(".rescue-presentation")).toHaveCount(1);
      await expectUiRouteState(page, fixture!.result.state);
      if (action === "released") await controls.release();
      if (action === "hidden") await page.evaluate(() => {
        Object.defineProperty(document, "visibilityState", { configurable: true, get: () => "hidden" });
        Object.defineProperty(document, "hidden", { configurable: true, get: () => true });
        document.dispatchEvent(new Event("visibilitychange"));
      });
      await page.clock.runFor(HELD_MOVE_INITIAL_DELAY_MS);
      await expectUiRouteState(page, fixture!.result.state);
      const duration = motion === "reduced" ? 180 : 900;
      await page.clock.runFor(duration - HELD_MOVE_INITIAL_DELAY_MS);
      await expect(page.locator(busySelector)).toHaveCount(0);
      await page.clock.runFor(HELD_MOVE_INITIAL_DELAY_MS - 1);
      await expectUiRouteState(page, fixture!.result.state);
      await page.clock.runFor(1);
      const next = action === "held" ? movePlayer(fixture!.level, fixture!.result.state, direction).state : fixture!.result.state;
      await expectUiRouteState(page, next);
      await controls.release();
      await page.clock.runFor(HELD_MOVE_INITIAL_DELAY_MS * 3);
      await expectUiRouteState(page, next);
      if (action === "held") assertFreshResume(await trace(page), fixture!.result.state.steps);
    } finally { await controls.release(); await saveEvidence(page, info, fixture!); }
  });
}

test.describe("R1 reverse ThumbPad takeover", () => {
  test.use({ hasTouch: true });
  for (const source of ["keyboard", "board-drag"] as const) for (const termination of ["touchEnd", "touchCancel"] as const) {
    test(`${source} releases the old pad capture and visible gesture before ${termination}`, async ({ page, context }, info) => {
      const fixture = successFixture("door-opened", true);
      await loadSaved(page, fixture, `r1-reverse-${source}`);
      const pad = page.locator(".thumb-pad");
      const box = (await page.getByRole("button", { name: `Move ${fixture.direction}`, exact: true }).boundingBox())!;
      const touch = await context.newCDPSession(page);
      const controls = await driver(page, source);
      let touching = false;
      try {
        await touch.send("Input.dispatchTouchEvent", { type: "touchStart", touchPoints: [{ x: box.x + box.width / 2, y: box.y + box.height / 2, id: 1, radiusX: 1, radiusY: 1, force: 1 }] });
        touching = true;
        await waitForPresentation(page);
        await touch.send("Input.dispatchTouchEvent", { type: "touchMove", touchPoints: [{ x: box.x + box.width / 2 + 8, y: box.y + box.height / 2, id: 1, radiusX: 1, radiusY: 1, force: 1 }] });
        const pointerId = await page.evaluate(() => (window as TraceWindow).__v22Input!.pointerId!);
        await expect(pad).toHaveAttribute("data-direction", fixture.direction);
        await expect(pad).toHaveAttribute("data-steering", "true");
        expect(await pad.evaluate((node, id) => node.hasPointerCapture(id), pointerId)).toBe(true);
        const direction = continuationDirections(fixture).find(candidate => candidate !== fixture.direction)!;
        await controls.start(direction);
        await expect(pad).not.toHaveAttribute("data-direction");
        await expect(pad).not.toHaveAttribute("data-steering");
        expect(await pad.evaluate((node, id) => node.hasPointerCapture(id), pointerId)).toBe(false);
        // The displaced physical thumb is still down; its eventual end must not
        // clear the new source or create an old-source fallback move.
        await touch.send("Input.dispatchTouchEvent", { type: termination, touchPoints: [] });
        touching = false;
        const next = movePlayer(fixture.level, fixture.result.state, direction);
        await waitForStep(page, next.state.steps);
        await controls.release();
        await expectStill(page, next.state);
        assertFreshResume(await trace(page), fixture.result.state.steps);
      } finally {
        if (touching) await touch.send("Input.dispatchTouchEvent", { type: "touchEnd", touchPoints: [] });
        await controls.release(); await touch.detach(); await saveEvidence(page, info, fixture);
      }
    });
  }
});

for (const replay of [false, true]) {
  test(`V22 input final normal ${replay ? "replay" : "first completion"} truthfully starts Surprise`, async ({ page }, info) => {
    const fixture = finalMazeFixture();
    let progress = createDefaultPlayerProgress(CURATED_LEVELS.length);
    if (replay) progress = applyLevelCompletion(progress, {
      completionId: "v22-prior-final-completion", levelId: fixture.level.id, source: "curated", campaignIndex: CURATED_LEVELS.length - 1,
      rescuedCount: fixture.result.state.rescuedAnimalIds.length, totalRescueCount: fixture.level.objects.filter(object => object.kind === "animal").length,
      steps: fixture.result.state.steps, power: fixture.result.state.power, contentRevision: fixture.level.contentRevision, gameplayFingerprint: fixture.level.gameplayFingerprint,
    });
    await loadSaved(page, fixture, replay ? "final-replay" : "final-first", progress);
    await page.keyboard.down(keyForDirection[fixture.direction]);
    try {
      await expect(page.locator(".dialog-celebration")).toBeVisible();
      await expectStill(page, fixture.result.state);
      await page.getByRole("button", { name: /^Surprise maze/ }).click();
      await expect(page.locator(".level-kicker")).toContainText("Surprise maze");
      await expect(page.getByRole("region", { name: `${CURATED_LEVELS[0]!.name} maze` })).toHaveCount(0);
      const state = await readUiRouteState(page);
      await page.waitForTimeout(HELD_MOVE_INITIAL_DELAY_MS * 3);
      expect(await readUiRouteState(page)).toEqual(state);
    } finally { await page.keyboard.up(keyForDirection[fixture.direction]); await saveEvidence(page, info, fixture); }
  });
}

test("V22 input final tester starts Surprise test without saving rewards or active run", async ({ page }, info) => {
  const fixture = finalMazeFixture();
  const normal = successFixture("door-opened");
  const snapshot = savedFixture(normal, "tester-protected-normal");
  const progress = createDefaultPlayerProgress(CURATED_LEVELS.length);
  await page.addInitScript(({ runKey, progressKey, snapshot, progress }) => {
    localStorage.setItem(runKey, JSON.stringify(snapshot)); localStorage.setItem(progressKey, JSON.stringify(progress));
  }, { runKey: ACTIVE_RUN_STORAGE_KEY, progressKey: PLAYER_PROGRESS_STORAGE_KEY, snapshot, progress });
  await selectTesterLevel(page, fixture.level);
  const readStorage = () => page.evaluate(({ runKey, progressKey }) => ({ run: localStorage.getItem(runKey), progress: localStorage.getItem(progressKey) }),
    { runKey: ACTIVE_RUN_STORAGE_KEY, progressKey: PLAYER_PROGRESS_STORAGE_KEY });
  const protectedStorage = await readStorage();
  await record(page);
  await page.emulateMedia({ reducedMotion: "reduce" });
  const route = deriveRoute(fixture.level, [...fixture.prefix, fixture.direction]);
  for (const step of route) await replayRouteStep(page, step);
  await expect(page.locator(".dialog-celebration")).toBeVisible();
  await page.getByRole("button", { name: /^Surprise test maze/ }).click();
  await expect(page.locator(".level-kicker")).toContainText(/Test|Preview/);
  await expect(page.locator(".level-kicker")).toContainText("Surprise");
  expect(await readStorage()).toEqual(protectedStorage);
  await saveEvidence(page, info, fixture);
});

test("V22 input gameplay chrome cannot select text or drag images and Book text remains scrollable", async ({ page }, info) => {
  const fixture = successFixture("door-opened");
  await loadSaved(page, fixture, "selection");
  const chrome = page.locator(".adventure-hud");
  const styles = await chrome.evaluate(node => {
    const target = node.querySelector(".deck-feedback") ?? node;
    const style = getComputedStyle(target);
    return { userSelect: style.userSelect, touchCallout: style.getPropertyValue("-webkit-touch-callout") };
  });
  expect(styles.userSelect).toBe("none");
  const box = (await chrome.boundingBox())!;
  await page.mouse.move(box.x + 8, box.y + box.height - 12);
  await page.mouse.down();
  await page.mouse.move(box.x + box.width - 8, box.y + 12, { steps: 15 });
  await page.mouse.up();
  expect(await page.evaluate(() => window.getSelection()?.toString())).toBe("");
  expect(await page.locator(".maze-board img").evaluateAll(images => images.every(image => !(image as HTMLImageElement).draggable))).toBe(true);
  await page.locator('[data-focus-id="book"]:visible').focus();
  await page.keyboard.press("Enter");
  await expect(page.locator(".achievements-screen")).toBeVisible();
  expect(await page.locator(".achievements-screen").evaluate(node => node.closest("[inert]") !== null)).toBe(false);
  const scroll = page.locator(".book-scroll");
  expect(await scroll.evaluate(node => getComputedStyle(node).touchAction)).toBe("pan-y");
  await scroll.hover();
  await page.mouse.wheel(0, 550);
  await expect.poll(() => scroll.evaluate(node => node.scrollTop)).toBeGreaterThan(0);
  await saveEvidence(page, info, fixture);
});

for (const kind of SUCCESS_EVENTS) {
  test(`V22 geometry ${kind} restores actor and follower binding at exact settled targets`, async ({ page }, info) => {
    const fixture = successFixture(kind);
    const restored = savedFixture(fixture, `geometry-${kind}`).game;
    await loadSaved(page, fixture, `geometry-${kind}`);
    let procession = createFollowerProcession(restored.position, restored.rescuedAnimalIds);
    let state = restored;
    const observations: unknown[] = [];
    const check = async () => {
      await expect(page.locator(".maze-board")).toHaveAttribute("data-travel-state", "settled");
      await expect(page.locator('[data-travel-actor="replacement"]')).toHaveCount(0);
      const actual = await page.locator(".maze-board").evaluate((board, grid) => {
        const world = board.querySelector<HTMLElement>(".camera-world")!;
        const player = board.querySelector<HTMLElement>(".player-layer")!;
        const cols = Number((board as HTMLElement).style.getPropertyValue("--grid-size"));
        const camera = { x: -parseFloat(world.style.left) * cols / 100, y: -parseFloat(world.style.top) * cols / 100 };
        const translation = (node: HTMLElement) => (node.style.translate || "0px 0px").split(" ").map(value => parseFloat(value) || 0);
        return {
          camera,
          player: { x: parseFloat(player.style.left) * cols / 100 + camera.x, y: parseFloat(player.style.top) * cols / 100 + camera.y },
          followers: [...board.querySelectorAll<HTMLElement>("[data-follower-id]")].map(node => ({
            id: node.dataset.followerId!, point: { x: parseFloat(node.style.left) * grid.width / 100, y: parseFloat(node.style.top) * grid.height / 100 },
          })),
          translations: [world, player, ...board.querySelectorAll<HTMLElement>("[data-follower-id]")].map(translation),
        };
      }, { width: fixture.level.width, height: fixture.level.height });
      // Browser CSSOM serializes percentage values to finite significant digits.
      // 0.0001 tile is below 0.02px here; game coordinates remain exact integers.
      expect(Math.abs(actual.player.x - state.position.x)).toBeLessThanOrEqual(.0001);
      expect(Math.abs(actual.player.y - state.position.y)).toBeLessThanOrEqual(.0001);
      const expected = followerTargets(procession);
      expect(actual.followers.map(follower => follower.id)).toEqual(expected.map(follower => follower.id));
      for (let index = 0; index < expected.length; index++) {
        expect(Math.abs(actual.followers[index]!.point.x - expected[index]!.point.x)).toBeLessThanOrEqual(.0001);
        expect(Math.abs(actual.followers[index]!.point.y - expected[index]!.point.y)).toBeLessThanOrEqual(.0001);
      }
      for (const values of actual.translations) for (const value of values) expect(Math.abs(value)).toBeLessThanOrEqual(.001);
      observations.push(actual);
    };
    const advance = (result: ReturnType<typeof movePlayer>) => {
      if (result.moved) procession = advanceFollowerProcession(procession, result.state.position, result.state.rescuedAnimalIds,
        result.events.some(event => event.type === "hole-jumped" || event.type === "portal-warped"));
      state = result.state;
    };
    await check();
    await page.keyboard.press(keyForDirection[fixture.direction]);
    await waitForPresentation(page);
    advance(movePlayer(fixture.level, state, fixture.direction));
    await expect(page.locator(busySelector)).toHaveCount(0, { timeout: 10_000 });
    await expectStill(page, state);
    await check();
    // A real ordinary move after node replacement/insertion must retarget the
    // recovered actor and every correctly ordered follower, not stale nodes.
    await page.keyboard.press(keyForDirection[fixture.direction]);
    advance(movePlayer(fixture.level, state, fixture.direction));
    await expectStill(page, state);
    await check();
    await info.attach("settled-geometry", { body: JSON.stringify(observations, null, 2), contentType: "application/json" });
    await saveEvidence(page, info, fixture);
  });
}
