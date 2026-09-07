import { test, expect } from "@playwright/test";
import { mkdir, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { CURATED_LEVELS } from "../../src/game/levels";
import { solveLevel } from "../../src/game/solver";
import { movePlayer } from "../../src/game/engine";
import { getCameraWindow, getVisibleTileKeys } from "../../src/game/exploration";
import { ACTIVE_RUN_STORAGE_KEY, createActiveRunSnapshot } from "../../src/session";
import { PLAYER_PROGRESS_STORAGE_KEY, createDefaultPlayerProgress } from "../../src/progress";
import { DEFAULT_PRESENTATION_PREFERENCES, PRESENTATION_PREFERENCES_KEY } from "../../src/motion";
import { deriveRoute, expectUiRouteState, keyForDirection, replayRouteStep } from "./gameplay-browser";
import type { Direction } from "../../src/game/types";

const out = resolve(process.env.MAZE_PERF_EVIDENCE_DIR!, "camera-window");
const keys = { run: ACTIVE_RUN_STORAGE_KEY, progress: PLAYER_PROGRESS_STORAGE_KEY, preferences: PRESENTATION_PREFERENCES_KEY };
const progress = { ...createDefaultPlayerProgress(), unlockedLevelCount: 16, unlockedLevelIds: CURATED_LEVELS.map(l => l.id) };
const reverse: Record<Direction, Direction> = { up: "down", down: "up", left: "right", right: "left" };
const fixtures = [CURATED_LEVELS[1]!, CURATED_LEVELS[9]!, CURATED_LEVELS[11]!].map(level => {
  const route = deriveRoute(level, solveLevel(level, { requireAllAnimals: true }).directions);
  const options = route.flatMap((step, start) => {
    const leg = route.slice(start, start + 4);
    if (leg.length !== 4 || !leg.every(s => s.direction === step.direction && s.result.moved && s.result.events.every(e => e.type === "moved"))) return [];
    const from = getCameraWindow(level, step.before.position), to = getCameraWindow(level, leg.at(-1)!.result.state.position);
    let state = leg.at(-1)!.result.state;
    for (let i = 0; i < 4; i++) { const r = movePlayer(level, state, reverse[step.direction]); if (!r.moved || r.events.some(e => e.type !== "moved")) return []; state = r.state; }
    return [{ start, direction: step.direction, delta: Math.abs(from.left - to.left) + Math.abs(from.top - to.top) }];
  }).sort((a, b) => b.delta - a.delta);
  const choice = options[0]; if (!choice || choice.delta < 2) throw Error(`No moving-camera route: ${level.id}`);
  const before = route[choice.start]!.before;
  return { id: level.id, level, direction: choice.direction, count: 4, before,
    snapshot: createActiveRunSnapshot({ level, game: before, mode: "normal", runId: `run-camera17-${level.id}`,
      revealedTiles: new Set(route.slice(0, choice.start + 1).flatMap(s => getVisibleTileKeys(level, s.before.position))) }) };
});
test.beforeAll(async () => {
  await mkdir(out, { recursive: true });
  await writeFile(resolve(out, "fixtures.json"), JSON.stringify({ keys, progress, preferences: DEFAULT_PRESENTATION_PREFERENCES, fixtures }, null, 2));
});

for (const profile of [{ width: 844, height: 390, dpr: 3 }, { width: 1080, height: 810, dpr: 2 }]) {
  for (const f of fixtures) test(`CAMERA17 continuous bounded world and map ${f.id} ${profile.width}`, async ({ browser }) => {
    const context = await browser.newContext({ viewport: profile, deviceScaleFactor: profile.dpr });
    try {
      const page = await context.newPage(), errors: string[] = [];
      page.on("pageerror", e => errors.push(e.message));
      await page.addInitScript(({ keys, progress, preferences, snapshot }) => {
        localStorage.setItem(keys.run, JSON.stringify(snapshot)); localStorage.setItem(keys.progress, JSON.stringify(progress));
        localStorage.setItem(keys.preferences, JSON.stringify({ ...preferences, quality: "full", motion: "full", muted: true }));
      }, { keys, progress, preferences: DEFAULT_PRESENTATION_PREFERENCES, snapshot: f.snapshot });
      await page.goto("/"); await page.getByRole("button", { name: "Play", exact: true }).click();
      await page.getByRole("button", { name: /^Continue/ }).click(); await expectUiRouteState(page, f.before);
      await page.evaluate(async () => { await document.fonts.ready; await Promise.all([...document.images].map(i => i.decode().catch(() => {}))); });
      const geometry = await page.locator(".maze-board").evaluate(board => {
        const staticSvg = board.querySelector<SVGSVGElement>(".maze-terrain-svg")!;
        return { staticAnimations: staticSvg.getAnimations({ subtree: true }).length,
          masks: staticSvg.querySelectorAll('mask[maskUnits="userSpaceOnUse"]').length,
          liquid: board.querySelectorAll(".maze-liquid-svg").length,
          mapNodes: document.querySelector(".maze-minimap")!.querySelectorAll("*").length,
          tileNodes: document.querySelectorAll(".minimap-tile").length,
          contained: getComputedStyle(board.querySelector(".camera-world")!).contain };
      });
      expect(geometry.staticAnimations).toBe(0); expect(geometry.masks).toBeGreaterThan(0);
      expect(geometry.tileNodes).toBe(0); expect(geometry.mapNodes).toBeLessThan(90); expect(geometry.contained).toContain("paint");
      if (!f.level.terrain.flat().some(t => ["water", "lava", "poison"].includes(t))) expect(geometry.liquid).toBe(0);
      await page.evaluate(() => {
        const board = document.querySelector<HTMLElement>(".maze-board")!, world = board.querySelector<HTMLElement>(".camera-world")!;
        const result = { rows: [] as any[], active: true }; (window as any).camera17 = result;
        const sample = (time: number) => {
          const svg = board.querySelector<SVGSVGElement>(".maze-terrain-svg")!, box = svg.viewBox.baseVal;
          const values = world.style.translate.split(" ").map(parseFloat), columns = Number(board.style.getPropertyValue("--grid-size"));
          const camera = { x: box.x - (values[0] || 0) * box.width / 100, y: box.y - (values[1] || 0) * box.height / 100 };
          const foreground = board.querySelector<SVGSVGElement>(".maze-foreground")!;
          const b = board.getBoundingClientRect(), w = world.getBoundingClientRect(), front = foreground.getBoundingClientRect();
          const player = board.querySelector<HTMLElement>(".player-layer")!.getBoundingClientRect();
          const cell = (b.width - 2 * board.clientLeft * b.width / board.offsetWidth) / columns;
          result.rows.push({ time, camera, window: [box.x, box.y, box.width, box.height],
            sameForeground: svg.getAttribute("viewBox") === foreground.getAttribute("viewBox"),
            sameLiquid: !board.querySelector(".maze-liquid-svg") || svg.getAttribute("viewBox") === board.querySelector(".maze-liquid-svg")!.getAttribute("viewBox"),
            frontError: Math.max(Math.abs(w.x - front.x), Math.abs(w.y - front.y)),
            actor: { x: (player.x - b.x - board.clientLeft * b.width / board.offsetWidth) / cell + camera.x,
              y: (player.y - b.y - board.clientTop * b.height / board.offsetHeight) / cell + camera.y },
            state: board.dataset.travelState });
          if (result.active) requestAnimationFrame(sample);
        }; requestAnimationFrame(sample);
      });
      let state = f.before;
      for (const direction of [f.direction, reverse[f.direction], f.direction, reverse[f.direction]]) for (let n = 0; n < 4; n++) {
        const result = movePlayer(f.level, state, direction); await replayRouteStep(page, { before: state, direction, result }); state = result.state;
      }
      await expect(page.locator(".maze-board")).toHaveAttribute("data-travel-state", "settled");
      const rows = await page.evaluate(() => { (window as any).camera17.active = false; return (window as any).camera17.rows as any[]; });
      expect(rows.length).toBeGreaterThan(40);
      for (const row of rows) {
        expect(row.window[2]).toBeLessThanOrEqual(10); expect(row.window[3]).toBeLessThanOrEqual(10);
        expect(row.sameForeground && row.sameLiquid).toBe(true); expect(row.frontError).toBeLessThan(.1);
        expect(row.camera.x).toBeGreaterThanOrEqual(row.window[0] - .001); expect(row.camera.y).toBeGreaterThanOrEqual(row.window[1] - .001);
        expect(row.camera.x + 6).toBeLessThanOrEqual(row.window[0] + row.window[2] + .001);
        expect(row.camera.y + 6).toBeLessThanOrEqual(row.window[1] + row.window[3] + .001);
      }
      const end = rows.at(-1)!, expectedCamera = getCameraWindow(f.level, state.position);
      expect(end.camera.x).toBeCloseTo(expectedCamera.left, 4); expect(end.camera.y).toBeCloseTo(expectedCamera.top, 4);
      expect(end.actor.x).toBeCloseTo(state.position.x, 3); expect(end.actor.y).toBeCloseTo(state.position.y, 3);
      const map = await page.locator(".maze-minimap").evaluate(el => {
        const dot = el.querySelector<HTMLElement>(".minimap-player-cell")!;
        return { left: parseFloat(dot.style.left), top: parseFloat(dot.style.top), markers: el.querySelectorAll(".map-marker").length };
      });
      expect(map.left).toBeCloseTo(state.position.x / f.level.width * 100, 4); expect(map.top).toBeCloseTo(state.position.y / f.level.height * 100, 4);
      await page.screenshot({ path: resolve(out, `${f.id}-${profile.width}.png`) });
      await writeFile(resolve(out, `${f.id}-${profile.width}.json`), JSON.stringify({ geometry, rows, map, errors }, null, 2));
      expect(errors).toEqual([]); await expectUiRouteState(page, state);
      // Resize/rotation-equivalent geometry must settle all shared surfaces.
      await page.setViewportSize({ width: profile.width - 30, height: profile.height + 10 });
      await expect(page.locator(".maze-board")).toHaveAttribute("data-travel-state", "settled");
      await page.keyboard.press(keyForDirection[f.direction]); await page.waitForTimeout(350);
      await expectUiRouteState(page, movePlayer(f.level, state, f.direction).state);
    } finally { await context.close(); }
  });
}
