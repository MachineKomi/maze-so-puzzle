import { test, expect } from "@playwright/test";
import { mkdir, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { CURATED_LEVELS } from "../../src/game/levels";
import { solveLevel } from "../../src/game/solver";
import { getCameraWindow, getVisibleTileKeys } from "../../src/game/exploration";
import { createActiveRunSnapshot, ACTIVE_RUN_STORAGE_KEY } from "../../src/session";
import { createDefaultPlayerProgress, PLAYER_PROGRESS_STORAGE_KEY } from "../../src/progress";
import { DEFAULT_PRESENTATION_PREFERENCES, PRESENTATION_PREFERENCES_KEY } from "../../src/motion";
import { deriveRoute, replayRouteStep, expectUiRouteState } from "./gameplay-browser";

const out = resolve(process.env.MAZE_PERF_EVIDENCE_DIR!, "hazards");
const progress = { ...createDefaultPlayerProgress(), unlockedLevelIds: CURATED_LEVELS.map(l => l.id), unlockedLevelCount: 16 };
const keys = { run: ACTIVE_RUN_STORAGE_KEY, progress: PLAYER_PROGRESS_STORAGE_KEY, preferences: PRESENTATION_PREFERENCES_KEY };
const routes = CURATED_LEVELS.map(level => ({ level, route: deriveRoute(level, solveLevel(level, { requireAllAnimals: true }).directions) }));
const count = (level: typeof CURATED_LEVELS[number], at: { x: number; y: number }, kind: string) => {
  const c = getCameraWindow(level, at); let n = 0;
  for (let y = c.top; y <= c.bottom; y++) for (let x = c.left; x <= c.right; x++) if (level.terrain[y]?.[x] === kind) n++;
  return n;
};
function fixture(kind: string) {
  const candidates = routes.flatMap(({ level, route }) => route.slice(0, -3).map((s, start) => ({ level, route, start, area: count(level, s.before.position, kind) })));
  return candidates.sort((a, b) => b.area - a.area)[0]!;
}
const scenes = ["water", "lava", "poison"].map(kind => ({ kind, ...fixture(kind) }));
function snapshot(f: typeof scenes[number]) {
  return createActiveRunSnapshot({ level: f.level, game: f.route[f.start]!.before, mode: "normal", runId: `run-hazard-${f.level.id}`,
    revealedTiles: new Set(f.route.slice(0, f.start + 1).flatMap(s => getVisibleTileKeys(f.level, s.before.position))) });
}
test.beforeAll(async () => {
  await mkdir(out, { recursive: true });
  // Four ordinary rightward steps and their reverse are identical in both builds.
  const possibilities = routes.flatMap(({ level, route }) => route.slice(0, -5).flatMap((step, start) => {
    const leg = route.slice(start, start + 4);
    return leg.every(s => s.direction === "right" && s.result.moved && s.result.events.length === 1 && s.result.events[0]?.type === "moved")
      ? [{ kind: "performance", level, route, start, area: ["water", "lava", "poison"].reduce((n, k) => n + count(level, step.before.position, k), 0) }] : [];
  })).sort((a, b) => b.area - a.area);
  const selected = possibilities[0]!; expect(selected.area).toBeGreaterThan(0);
  await writeFile(resolve(out, "fixtures.json"), JSON.stringify({ keys, progress, preferences: { ...DEFAULT_PRESENTATION_PREFERENCES, muted: true }, fixtures: [{ id: "hazard-moving", level: selected.level, snapshot: snapshot(selected), direction: "right", count: 4, visibleHazardCells: selected.area }] }, null, 2));
});
for (const [width, height] of [[780, 312], [1194, 834]]) for (const mode of ["full", "lite", "static", "reduced"]) {
  test(`HAZARD02 actual surfaces ${width} ${mode}`, async ({ browser }) => {
    const rows = [];
    for (const f of scenes) {
      const context = await browser.newContext({ viewport: { width, height }, deviceScaleFactor: 2 });
      try {
        const page = await context.newPage(), errors: string[] = []; page.on("pageerror", e => errors.push(e.message));
        await page.addInitScript(({ run, progress, keys, preferences }) => {
          localStorage.setItem(keys.run, JSON.stringify(run)); localStorage.setItem(keys.progress, JSON.stringify(progress)); localStorage.setItem(keys.preferences, JSON.stringify(preferences));
        }, { run: snapshot(f), progress, keys, preferences: { ...DEFAULT_PRESENTATION_PREFERENCES, muted: true, motion: mode === "reduced" ? "reduced" : "full", quality: ["lite", "static"].includes(mode) ? mode : "full" } });
        await page.goto("/"); await page.getByRole("button", { name: "Play", exact: true }).click(); await page.getByRole("button", { name: /^Continue/ }).click();
        await expectUiRouteState(page, f.route[f.start]!.before);
        const svg = page.locator(".maze-terrain-svg"); await expect(svg).toHaveAttribute("data-hazard-surface", "02-crisp-local");
        await page.evaluate(async () => { await document.fonts.ready; await Promise.all([...document.images].map(i => i.decode().catch(() => {}))); });
        const initial = await svg.innerHTML();
        const proof = await page.evaluate(({ kind, mode }) => {
          const svg = document.querySelector<SVGSVGElement>(".maze-terrain-svg")!;
          const base = svg.querySelector(`.terrain-${kind}`)!, fx = svg.querySelector(`.terrain-${kind}-fx`)!;
          const clip = base.getAttribute("clip-path")!, id = clip.slice(5, -1);
          const exactClip = [...svg.querySelectorAll('clipPath')].find(c => c.id === id)?.querySelector('path')?.getAttribute('d') === base.getAttribute('d');
          const animations = svg.getAnimations({ subtree: true });
          const samples = [];
          if (mode === "full") for (const t of [0, 400, 900, 1800, 2900, 4100, 5400, 6700]) {
            animations.forEach(a => { a.pause(); a.currentTime = t; });
            samples.push([...svg.querySelectorAll('.poison-bubble')].map(e => {
              const m = new DOMMatrix(getComputedStyle(e).transform); return { x: m.e, y: m.f, opacity: getComputedStyle(e).opacity };
            }));
          }
          animations.forEach(a => a.play());
          return { exactClip, sameFxClip: fx.getAttribute('clip-path') === clip, filter: getComputedStyle(base).filter, fxDisplay: getComputedStyle(fx).display,
            animationCount: animations.length, samples, morphology: svg.querySelectorAll('feMorphology').length, errors: [...document.images].filter(i => !i.complete || !i.naturalWidth).length };
        }, { kind: f.kind, mode });
        expect(proof.exactClip).toBe(true); expect(proof.sameFxClip).toBe(true); expect(proof.filter).toBe("none"); expect(proof.morphology).toBe(0); expect(proof.errors).toBe(0);
        if (mode === "full") { expect(proof.animationCount).toBeGreaterThan(0); for (const phase of proof.samples) for (const bubble of phase) { expect(Math.abs(bubble.x)).toBeLessThan(.3); expect(Math.abs(bubble.y)).toBeLessThan(.4); } }
        else expect(proof.animationCount).toBe(0);
        if (mode === "lite") expect(proof.fxDisplay).toBe("none");
        if (mode === "full" || (f.kind === "poison" && mode === "static")) await page.screenshot({ path: resolve(out, `${width}-${f.kind}-${mode}.png`) });
        if (mode === "full" && f.kind === "poison") {
          await page.waitForTimeout(2800); await page.screenshot({ path: resolve(out, `${width}-poison-later.png`) });
          await page.addStyleTag({ content: '.maze-board { filter: grayscale(1) !important; }' });
          await page.screenshot({ path: resolve(out, `${width}-poison-grayscale.png`) });
        }
        for (const step of f.route.slice(f.start, f.start + 2)) await replayRouteStep(page, step);
        expect(await svg.innerHTML()).toBe(initial); expect(errors).toEqual([]);
        rows.push({ kind: f.kind, level: f.level.id, start: f.start, visibleCells: f.area, proof, errors });
      } finally { await context.close(); }
    }
    await writeFile(resolve(out, `${width}-${mode}.json`), JSON.stringify(rows, null, 2));
  });
}
