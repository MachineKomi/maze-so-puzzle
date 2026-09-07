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
import { createHash } from "node:crypto";

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

for (const theme of ["sunny-stone", "ember-keep"]) test(`HAZARD03 connected shapes, eight lights and texture phases ${theme}`, async ({ page }) => {
  await page.setViewportSize({ width: 1660, height: 980 });
  const errors: string[] = []; page.on("pageerror", e => errors.push(e.message));
  const rows = [];
  for (const light of ["top", "top-right", "right", "bottom-right", "bottom", "bottom-left", "left", "top-left"]) {
    await page.goto(`http://127.0.0.1:1421/scripts/performance/hazard-rack.html?theme=${theme}&light=${light}&tile=40`);
    await expect(page.locator("section")).toHaveCount(28);
    await page.evaluate(async () => {
      await Promise.all([...document.querySelectorAll("svg image")].map(e => new Promise<void>((resolve, reject) => {
        const image = new Image(); image.onload = () => resolve(); image.onerror = reject; image.src = e.getAttribute("href")!;
      })));
      document.getAnimations().forEach(a => { a.pause(); a.currentTime = 4000; });
    });
    const geometry = await page.locator('[data-shape="receiver"] .maze-terrain-svg').evaluateAll(elements => elements.map(svg => {
      const cast = svg.querySelector(".terrain-wall-cast")!, contact = svg.querySelector(".terrain-wall-contact")!;
      const id = cast.getAttribute("clip-path")!.slice(5, -1);
      const clip = [...svg.querySelectorAll("clipPath")].find(p => p.id === id)!.querySelector("path")!;
      const canvas = document.createElement("canvas"), ctx = canvas.getContext("2d")!;
      const path = new Path2D(clip.getAttribute("d")!);
      const contains = (x: number, y: number) => ctx.isPointInPath(path, x, y, "evenodd");
      const castPath = new Path2D(cast.getAttribute("d")!);
      const points = [[2.9, 1.99], [2.9, 2.02], [2.9, 2.055], [2.9, 2.15]];
      return { sameContact: contact.getAttribute("clip-path") === cast.getAttribute("clip-path"),
        receivers: points.map(([x, y]) => contains(x!, y!)),
        castAtBoundary: points.map(([x, y]) => ctx.isPointInPath(castPath, x!, y!)),
        pitExcluded: !contains(5.5, 2.5), wallExcluded: !contains(1.5, 1.75),
        lipBeforeCast: [...svg.children].findIndex(e => e.classList.contains("terrain-hazard-lip")) < [...svg.children].indexOf(cast),
      };
    }));
    for (const result of geometry) {
      expect(result.sameContact).toBe(true); expect(result.receivers).toEqual([true, true, true, true]);
      expect(result.pitExcluded).toBe(true); expect(result.wallExcluded).toBe(true); expect(result.lipBeforeCast).toBe(true);
      if (light === "top-left") expect(result.castAtBoundary).toEqual([true, true, true, true]);
    }
    await page.screenshot({ path: resolve(out, `shapes-${theme}-${light}.png`), fullPage: true });
    rows.push({ light, geometry });
  }
  // Capture actual pattern pixels at quarter-loop phases, with every other
  // ambient effect frozen at one phase. No fallback gap or loop reset is hidden
  // by a moving actor. A full period must return to the exact first image.
  const phases = [];
  const shoreInterfaces = await page.locator('[data-shape="mixed"] .maze-terrain-svg').evaluate(svg => {
    const path = new Path2D(svg.querySelector('.terrain-hazard-lip path')!.getAttribute('d')!);
    const ctx = document.createElement('canvas').getContext('2d')!; ctx.lineWidth = .14;
    return { material: ctx.isPointInStroke(path, 2, 2.5), wall: ctx.isPointInStroke(path, 2, 2),
      pit: ctx.isPointInStroke(path, 5, 2.5), floor: ctx.isPointInStroke(path, 1.02, 3.5) };
  });
  expect(shoreInterfaces).toEqual({ material: false, wall: false, pit: false, floor: true });
  for (const kind of ["water", "lava", "poison"]) {
    const target = page.locator(`section[data-shape="ring"][data-kind="${kind}"] .rack-board`);
    const hashes = [];
    for (const progress of [0, .25, .5, .75, 1]) {
      await target.evaluate((node, progress) => {
        const current = node.querySelector(".hazard-current")!;
        for (const a of current.getAnimations()) { a.pause(); a.currentTime = Number(a.effect!.getTiming().duration) * progress; }
      }, progress);
      const png = await target.screenshot({ path: resolve(out, `phase-${theme}-${kind}-${progress}.png`) });
      hashes.push(createHash("sha256").update(png).digest("hex"));
    }
    expect(new Set(hashes.slice(0, 4)).size).toBe(4); expect(hashes[4]).toBe(hashes[0]);
    phases.push({ kind, hashes });
  }
  expect(errors).toEqual([]);
  await writeFile(resolve(out, `shapes-${theme}.json`), JSON.stringify({ rows, phases, shoreInterfaces, errors }, null, 2));
});
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
  test(`HAZARD03 actual surfaces ${width} ${mode}`, async ({ browser }) => {
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
        const svg = page.locator(".maze-terrain-svg"); await expect(svg).toHaveAttribute("data-hazard-surface", "03-living-connected");
        await page.evaluate(async () => { await document.fonts.ready; await Promise.all([...document.images].map(i => i.decode().catch(() => {}))); });
        const stableGeometry = () => page.locator(".maze-terrain-svg path,.maze-liquid-svg path").evaluateAll(paths=>paths.map(p=>p.getAttribute("d")));
        const initial = await stableGeometry();
        const proof = await page.evaluate(({ kind, mode }) => {
          const svg = document.querySelector<SVGSVGElement>(".maze-terrain-svg")!;
          const liquid = document.querySelector<SVGSVGElement>(".maze-liquid-svg")!;
          const base = liquid.querySelector(`.terrain-${kind}`)!, fx = liquid.querySelector(`.terrain-${kind}-fx`)!;
          const clip = base.getAttribute("clip-path")!, id = clip.slice(5, -1);
          const exactClip = [...liquid.querySelectorAll('clipPath')].find(c => c.id === id)?.querySelector('path')?.getAttribute('d') === base.getAttribute('d');
          const animations = liquid.getAnimations({ subtree: true });
          const current = liquid.querySelector(`.hazard-current-${kind}`)!;
          const currentAnimation = current.getAnimations()[0];
          const cadence: number[] = [];
          if (mode === "full") for (const t of [0, 25, 50, 75, 100]) {
            currentAnimation!.pause(); currentAnimation!.currentTime = t;
            cadence.push(new DOMMatrix(getComputedStyle(current).transform).e);
          }
          const samples = [];
          if (mode === "full") for (const t of [0, 400, 900, 1800, 2900, 4100, 5400, 6700]) {
            animations.forEach(a => { a.pause(); a.currentTime = t; });
            samples.push([...liquid.querySelectorAll('.poison-bubble')].map(e => {
              const m = new DOMMatrix(getComputedStyle(e).transform); return { x: m.e, y: m.f, opacity: getComputedStyle(e).opacity };
            }));
          }
          animations.forEach(a => a.play());
          return { exactClip, sameFxClip: fx.getAttribute('clip-path') === clip, filter: getComputedStyle(base).filter, fxDisplay: getComputedStyle(fx).display,
            animationCount: animations.length, samples, cadence, morphology: svg.querySelectorAll('feMorphology').length, errors: [...document.images].filter(i => !i.complete || !i.naturalWidth).length };
        }, { kind: f.kind, mode });
        expect(proof.exactClip).toBe(true); expect(proof.sameFxClip).toBe(true); expect(proof.filter).toBe("none"); expect(proof.morphology).toBe(0); expect(proof.errors).toBe(0);
        if (mode === "full") {
          expect(proof.animationCount).toBeGreaterThan(0);
          expect(proof.cadence[0]).toBe(proof.cadence[1]); expect(proof.cadence[2]).toBe(proof.cadence[3]);
          expect(proof.cadence[2]).toBeGreaterThan(proof.cadence[0]!);
          expect(proof.cadence[2]! - proof.cadence[0]!).toBeLessThanOrEqual(.003751);
          for (const phase of proof.samples) for (const bubble of phase) { expect(Math.abs(bubble.x)).toBeLessThan(.3); expect(Math.abs(bubble.y)).toBeLessThan(.4); }
        }
        else expect(proof.animationCount).toBe(0);
        if (mode === "lite") expect(proof.fxDisplay).toBe("none");
        if (mode === "full" || (f.kind === "poison" && mode === "static")) await page.screenshot({ path: resolve(out, `${width}-${f.kind}-${mode}.png`) });
        if (mode === "full" && f.kind === "poison") {
          await page.waitForTimeout(2800); await page.screenshot({ path: resolve(out, `${width}-poison-later.png`) });
          await page.addStyleTag({ content: '.maze-board { filter: grayscale(1) !important; }' });
          await page.screenshot({ path: resolve(out, `${width}-poison-grayscale.png`) });
        }
        for (const step of f.route.slice(f.start, f.start + 2)) await replayRouteStep(page, step);
        expect(await stableGeometry()).toEqual(initial); expect(errors).toEqual([]);
        rows.push({ kind: f.kind, level: f.level.id, start: f.start, visibleCells: f.area, proof, errors });
      } finally { await context.close(); }
    }
    await writeFile(resolve(out, `${width}-${mode}.json`), JSON.stringify(rows, null, 2));
  });
}
