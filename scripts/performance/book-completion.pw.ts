/** Actual Book launch, completion and save-boundary regression journeys. */
import { test, expect, type Page } from "@playwright/test";
import { mkdir, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { CURATED_LEVELS } from "../../src/game/levels";
import { solveLevel } from "../../src/game/solver";
import { movePlayer, stayAfterPendingCompletion } from "../../src/game/engine";
import { createDefaultPlayerProgress, PLAYER_PROGRESS_STORAGE_KEY } from "../../src/progress";
import { ACTIVE_RUN_STORAGE_KEY, createActiveRunSnapshot } from "../../src/session";
import { DEFAULT_PRESENTATION_PREFERENCES, PRESENTATION_PREFERENCES_KEY } from "../../src/motion";
import type { Direction } from "../../src/game/types";
import { deriveRoute, replayRouteStep, readUiRouteState, selectTesterLevel } from "./gameplay-browser";

const output = resolve(process.env.MAZE_PERF_EVIDENCE_DIR!, "book-completion");
test.beforeAll(() => mkdir(output, { recursive: true }));
const faults = new WeakMap<Page, string[]>();
test.beforeEach(async ({ page }) => {
  const errors: string[] = []; faults.set(page, errors); page.on("pageerror", e => errors.push(e.message));
  await page.emulateMedia({ reducedMotion: "reduce" });
});
test.afterEach(async ({ page }, info) => {
  await writeFile(resolve(output, `${info.title.replace(/[^a-z0-9]+/gi, "-")}.json`), JSON.stringify({ title: info.title, errors: faults.get(page), url: page.url(), storage: await storage(page).catch(() => null) }, null, 2));
  expect(faults.get(page)).toEqual([]);
});
const storage = (page: Page) => page.evaluate(({ progressKey, runKey }) => ({
  progress: localStorage.getItem(progressKey), run: localStorage.getItem(runKey),
}), { progressKey: PLAYER_PROGRESS_STORAGE_KEY, runKey: ACTIVE_RUN_STORAGE_KEY });
const progressOf = async (page: Page) => JSON.parse((await storage(page)).progress!);
const routeFor = (index: number, perfect = false) => {
  const level = CURATED_LEVELS[index]!;
  const solution = solveLevel(level, perfect ? { requireAllAnimals: true } : { avoidAnimals: true });
  if (!solution.solvable) throw Error(`No ${perfect ? "perfect" : "partial"} route for ${level.id}`);
  const route = deriveRoute(level, solution.directions);
  const rescued = route.at(-1)!.result.state.rescuedAnimalIds.length;
  const total = level.objects.filter(o => o.kind === "animal").length;
  if (perfect) expect(rescued).toBe(total);
  else expect(rescued).toBeLessThan(total);
  return route;
};
async function seedProgress(page: Page) {
  await page.addInitScript(({ key, value }) => { if (!localStorage.getItem(key)) localStorage.setItem(key, JSON.stringify(value)); },
    { key: PLAYER_PROGRESS_STORAGE_KEY, value: createDefaultPlayerProgress(CURATED_LEVELS.length) });
}
async function book(page: Page) {
  await page.goto("/"); await page.getByRole("button", { name: "Play", exact: true }).click();
  await page.getByRole("button", { name: "Ame's adventure book", exact: true }).click();
}
async function beginStory(page: Page) {
  for (let turn = 0; turn < 5 && await page.locator(".dialog-story").isVisible(); turn++) {
    await page.locator(".dialog-story .primary-button").click();
  }
  await expect(page.locator(".dialog-story")).toHaveCount(0);
  await expect(page.locator(".maze-board")).toBeVisible();
}
async function selectBook(page: Page, index: number) {
  await book(page);
  await page.locator(".maze-record-card").nth(index).click();
  await expect(page.locator(".dialog-story")).toBeVisible();
  await beginStory(page);
  await expect(page.locator(".level-kicker")).toHaveText(`Story maze ${index + 1} of ${CURATED_LEVELS.length}`);
}
async function finish(page: Page, index: number, perfect = false) {
  const route = routeFor(index, perfect);
  for (const step of route) await replayRouteStep(page, step);
  await expect(page.locator(".dialog-celebration")).toBeVisible();
  return route.at(-1)!.result.state;
}
async function capture(page: Page, stem: string) {
  await page.evaluate(() => document.fonts.ready);
  await page.screenshot({ path: resolve(output, `${stem}.png`) });
}

for (const perfect of [false, true]) for (const activation of ["Enter", "click"] as const) {
  test(`BOOK03 middle ${perfect ? "perfect" : "partial"} ${activation} advances and records once`, async ({ page }) => {
    await page.setViewportSize({ width: activation === "Enter" ? 780 : 1194, height: activation === "Enter" ? 312 : 834 });
    await seedProgress(page); await selectBook(page, 1);
    const end = await finish(page, 1, perfect);
    await capture(page, `middle-${perfect}-${activation}`);
    await expect(page.getByRole("button", { name: /^Next maze/ })).toBeFocused();
    const before = await progressOf(page); expect(before.totalCompletions).toBe(0);
    if (activation === "Enter") {
      await page.keyboard.down("Enter");
      await expect(page.locator(".dialog-story")).toBeVisible();
      await page.keyboard.down("Enter"); // A held repeat must not advance the new chapter.
      await expect(page.locator(".dialog-story")).toBeVisible();
      await page.keyboard.up("Enter");
    }
    else await page.getByRole("button", { name: /^Next maze/ }).evaluate((b: HTMLButtonElement) => { b.click(); b.click(); });
    await expect(page.locator(".dialog-story")).toBeVisible(); await beginStory(page);
    await expect(page.locator(".level-kicker")).toHaveText(`Story maze 3 of ${CURATED_LEVELS.length}`);
    const after = await progressOf(page);
    expect(after.totalCompletions).toBe(1); expect(after.completionReceipts).toHaveLength(1);
    expect(after.bestResultsByLevel[CURATED_LEVELS[1]!.id].bestRescuedCount).toBe(end.rescuedAnimalIds.length);
    expect(after.gold).toBeGreaterThan(before.gold);
    await page.keyboard.down("Enter"); await page.waitForTimeout(350); await page.keyboard.up("Enter");
    expect(await progressOf(page)).toEqual(after);
  });
}

test("BOOK03 explicit Stay preserves the pending run then re-entry records once", async ({ page }) => {
  await seedProgress(page); await selectBook(page, 0);
  const level = CURATED_LEVELS[0]!, end = await finish(page, 0);
  const before = await progressOf(page);
  await page.getByRole("button", { name: "Stay here", exact: true }).click();
  await expect(page.locator(".dialog-celebration")).toHaveCount(0);
  expect(await progressOf(page)).toEqual(before);
  const standing = stayAfterPendingCompletion(level, end);
  const direction = (["up", "right", "down", "left"] as const).find(d => movePlayer(level, standing, d).moved) as Direction;
  const away = movePlayer(level, standing, direction);
  await replayRouteStep(page, { before: standing, direction, result: away });
  const reverse = ({ up: "down", down: "up", left: "right", right: "left" } as const)[direction];
  await replayRouteStep(page, { before: away.state, direction: reverse, result: movePlayer(level, away.state, reverse) });
  await expect(page.locator(".dialog-celebration")).toBeVisible();
  await page.keyboard.press("Enter"); await beginStory(page);
  expect((await progressOf(page)).totalCompletions).toBe(1);
});

test("BOOK03 tester same-ID Book selection starts a fresh normal chapter", async ({ page }) => {
  await seedProgress(page); await selectTesterLevel(page, CURATED_LEVELS[0]!);
  const before = await storage(page);
  await page.locator('[data-focus-id="book"]').click();
  await expect(page.locator(".maze-record-card.active-run")).toHaveCount(0);
  expect((await storage(page)).progress).toBe(before.progress);
  await page.locator(".maze-record-card").first().click();
  await expect(page.locator(".dialog-story")).toBeVisible(); await beginStory(page);
  await expect(page.locator(".level-kicker")).toHaveText(`Story maze 1 of ${CURATED_LEVELS.length}`);
  const now = await storage(page);
  const { discoveredFriendIds: priorDiscoveries, ...priorRewards } = JSON.parse(before.progress!);
  const { discoveredFriendIds: normalDiscoveries, ...normalRewards } = JSON.parse(now.progress!);
  expect(normalRewards).toEqual(priorRewards);
  expect(priorDiscoveries).toEqual([]);
  expect(normalDiscoveries).toEqual(["rainbow-horn-unicorn"]);
  expect(JSON.parse(now.run!).levelId).toBe(CURATED_LEVELS[0]!.id);
  expect(JSON.parse(now.run!).runId).toMatch(/^run-/);
  expect((await readUiRouteState(page)).steps).toBe(0);
});

for (const perfect of [false, true]) {
  test(`BOOK03 final ${perfect ? "perfect" : "partial"} restored approach records once into Surprise`, async ({ page }) => {
    const index = CURATED_LEVELS.length - 1, level = CURATED_LEVELS[index]!;
    await seedProgress(page); await selectBook(page, index);
    const route = routeFor(index, perfect), last = route.at(-1)!;
    // First enter this chapter through the real Book, then restore a current,
    // engine-derived late-run snapshot. This tests routing, not a full final-maze replay.
    const snapshot = createActiveRunSnapshot({ runId: `run-book-final-${perfect}`, mode: "normal", level,
      game: last.before, revealedTiles: [] });
    expect(snapshot).not.toBeNull();
    await page.evaluate(({ key, snapshot }) => localStorage.setItem(key, JSON.stringify(snapshot)), { key: ACTIVE_RUN_STORAGE_KEY, snapshot });
    await book(page); await page.locator(".maze-record-card.active-run").click();
    await replayRouteStep(page, last);
    await expect(page.getByRole("button", { name: /^Surprise maze/ })).toBeFocused();
    await capture(page, `final-${perfect}`); await page.keyboard.press("Enter");
    await expect(page.locator(".level-kicker")).toHaveText("Surprise maze");
    const progress = await progressOf(page);
    expect(progress.totalCompletions).toBe(1); expect(progress.completionReceipts).toHaveLength(1);
    expect(progress.bestResultsByLevel[level.id].bestRescuedCount).toBe(last.result.state.rescuedAnimalIds.length);
    expect((await storage(page)).run).toBeNull();
  });
}

test("BOOK03 current-schema write denial keeps the exit and retry records once", async ({ page }) => {
  await seedProgress(page); await selectBook(page, 0); await finish(page, 0);
  await expect.poll(async () => JSON.parse((await storage(page)).run!).game.status).toBe("won");
  const before = await storage(page);
  await page.evaluate(key => {
    const original = Storage.prototype.setItem;
    (window as Window & { denyBookSave?: boolean }).denyBookSave = true;
    Storage.prototype.setItem = function (name, value) {
      if (name === key && (window as Window & { denyBookSave?: boolean }).denyBookSave) throw new DOMException("Book save denied", "QuotaExceededError");
      original.call(this, name, value);
    };
  }, PLAYER_PROGRESS_STORAGE_KEY);
  await page.keyboard.press("Enter"); await expect(page.locator(".save-warning")).toBeVisible();
  await expect(page.locator(".dialog-celebration")).toBeVisible(); expect(await storage(page)).toEqual(before);
  await capture(page, "write-denial");
  await page.evaluate(() => { (window as Window & { denyBookSave?: boolean }).denyBookSave = false; });
  await page.getByRole("button", { name: /^Next maze/ }).click(); await beginStory(page);
  expect((await progressOf(page)).totalCompletions).toBe(1);
  expect((await progressOf(page)).completionReceipts).toHaveLength(1);
});

test("BOOK03 newer profile stays byte-exact while the temporary session advances", async ({ page }) => {
  const future = JSON.stringify({ ...createDefaultPlayerProgress(), schemaVersion: 999, futureKeepsake: "preserve exactly" });
  await page.addInitScript(({ key, future }) => localStorage.setItem(key, future), { key: PLAYER_PROGRESS_STORAGE_KEY, future });
  await selectBook(page, 0); await finish(page, 0);
  expect((await storage(page)).progress).toBe(future);
  await expect(page.locator(".dialog-celebration")).toContainText("This adventure is temporary.");
  await capture(page, "future-profile");
  await page.keyboard.press("Enter"); await beginStory(page);
  await expect(page.locator(".level-kicker")).toHaveText(`Story maze 2 of ${CURATED_LEVELS.length}`);
  expect((await storage(page)).progress).toBe(future); expect((await storage(page)).run).toBeNull();
});

test("LOOT03 denied won-journal write holds Next without banking and allows a safe retry",async({page})=>{
  await seedProgress(page);await selectBook(page,0);await finish(page,0);
  const before=await storage(page);
  await page.evaluate(key=>{
    const original=Storage.prototype.setItem;(window as any).denyRunSave=true;
    Storage.prototype.setItem=function(name,value){if(name===key&&(window as any).denyRunSave)throw Error('journal denied');original.call(this,name,value);};
  },ACTIVE_RUN_STORAGE_KEY);
  await page.getByRole('button',{name:/^Next maze/}).click();
  await expect(page.locator('.dialog-celebration')).toBeVisible();await expect(page.locator('.save-warning')).toBeVisible();
  expect(await storage(page)).toEqual(before);
  await page.evaluate(()=>{(window as any).denyRunSave=false;});await page.getByRole('button',{name:/^Next maze/}).click();await beginStory(page);
  expect((await progressOf(page)).totalCompletions).toBe(1);expect((await progressOf(page)).completionReceipts).toHaveLength(1);
});

for (const mode of ["full", "lite", "static", "reduced"]) test(`MOVE02 ${mode} movement has no yellow corner sparkle and keeps a steady ground shadow`, async ({ page }) => {
  await page.setViewportSize({ width: 1194, height: 834 });
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.addInitScript(({ key, preferences }) => localStorage.setItem(key, JSON.stringify(preferences)), {
    key: PRESENTATION_PREFERENCES_KEY, preferences: { ...DEFAULT_PRESENTATION_PREFERENCES, muted: true,
      motion: mode === "reduced" ? "reduced" : "full", quality: ["lite", "static"].includes(mode) ? mode : "full" },
  });
  await selectTesterLevel(page, CURATED_LEVELS[0]!);
  await page.waitForTimeout(600);
  const inspect = () => page.locator(".player-layer").evaluate(e => {
    const after = getComputedStyle(e, "::after"), before = getComputedStyle(e, "::before");
    return { sparkle: { content: after.content, opacity: after.opacity, color: after.color, shadow: after.textShadow, animation: after.animationName },
      ground: { opacity: before.opacity, animation: before.animationName, transform: before.transform, backgroundColor: before.backgroundColor, backgroundImage: before.backgroundImage } };
  });
  const idle = await inspect();
  await page.keyboard.press("ArrowUp"); await page.waitForTimeout(65);
  const moving = await inspect();
  // Freeze only a legacy sparkle animation, if present, for a legible diagnostic.
  // Candidate has no such animation. This still is not a performance sample.
  await page.locator(".player-layer").evaluate(e => e.getAnimations({ subtree: true }).forEach(a => {
    if (a instanceof CSSAnimation && a.animationName.startsWith("step-spark")) { a.pause(); a.currentTime = 100; }
  }));
  await capture(page, `moving-corner-${mode}`);
  await page.waitForTimeout(600);
  const rested = await inspect();
  await writeFile(resolve(output, `moving-pseudos-${mode}.json`), JSON.stringify({ idle, moving, rested }, null, 2));
  expect(["none", "normal"]).toContain(moving.sparkle.content);
  expect(moving.ground.animation).toBe("none");
  expect(Number(idle.ground.opacity)).toBe(1); expect(Number(moving.ground.opacity)).toBe(1);
  expect(moving.ground).toEqual(idle.ground); expect(rested.ground).toEqual(idle.ground);
  // Lite deliberately uses a gradient; the other modes use the solid ellipse.
  const colors = `${moving.ground.backgroundColor} ${moving.ground.backgroundImage}`.match(/rgba?\([^)]+\)/g) ?? [];
  expect(colors.some(c => {
    const channels = c.match(/[\d.]+/g)!.map(Number);
    return (channels.length === 4 ? channels[3]! : 1) > 0;
  })).toBe(true);
});
