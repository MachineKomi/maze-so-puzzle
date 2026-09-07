import { test, expect } from "@playwright/test";
import { mkdir, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { CURATED_LEVELS } from "../../src/game/levels";
import { solveLevel } from "../../src/game/solver";
import { generateSurpriseMaze, MAX_GENERATED_MAZE_SIZE } from "../../src/game/generator";
import { getCameraWindow, getVisibleTileKeys } from "../../src/game/exploration";
import { createActiveRunSnapshot, ACTIVE_RUN_STORAGE_KEY } from "../../src/session";
import { createDefaultPlayerProgress, PLAYER_PROGRESS_STORAGE_KEY } from "../../src/progress";
import { DEFAULT_PRESENTATION_PREFERENCES, PRESENTATION_PREFERENCES_KEY } from "../../src/motion";
import { deriveRoute, expectUiRouteState, replayRouteStep } from "./gameplay-browser";

const output = resolve(process.env.MAZE_PERF_EVIDENCE_DIR!, "tall-walls");
const progress = { ...createDefaultPlayerProgress(), unlockedLevelCount: 16, unlockedLevelIds: CURATED_LEVELS.map(l => l.id) };
test.beforeAll(async () => { await mkdir(output, { recursive: true }); });
for (const [width, height] of [[780, 312], [1194, 834]]) {
  test(`WALL04C all campaign surfaces and late equipped actors ${width}x${height}`, async ({ browser }) => {
    const results = [];
    for (const [index, level] of CURATED_LEVELS.entries()) {
      const route = deriveRoute(level, solveLevel(level, { requireAllAnimals: true }).directions);
      const points = [0, ...([6, 8, 9, 15].includes(index) ? [Math.max(1, route.length - 4)] : [])];
      for (const start of points) {
        const before = route[start]!.before;
        const revealed = new Set(route.slice(0, start + 1).flatMap(s => getVisibleTileKeys(level, s.before.position)));
        const snapshot = createActiveRunSnapshot({ level, game: before, mode: "normal", runId: before.loot.runId, revealedTiles: revealed });
        expect(snapshot).toBeTruthy();
        const context = await browser.newContext({ viewport: { width, height }, deviceScaleFactor: 2 });
        try {
          const page = await context.newPage(), errors: string[] = [];
          page.on("pageerror", e => errors.push(e.message));
          await page.addInitScript(({ snapshot, progress, preferences, keys }) => {
            localStorage.setItem(keys.run, JSON.stringify(snapshot)); localStorage.setItem(keys.progress, JSON.stringify(progress));
            localStorage.setItem(keys.preferences, JSON.stringify({ ...preferences, muted: true, quality: "full", motion: "full" }));
          }, { snapshot, progress, preferences: DEFAULT_PRESENTATION_PREFERENCES, keys: { run: ACTIVE_RUN_STORAGE_KEY, progress: PLAYER_PROGRESS_STORAGE_KEY, preferences: PRESENTATION_PREFERENCES_KEY } });
          await page.goto("/"); await page.getByRole("button", { name: "Play", exact: true }).click(); await page.getByRole("button", { name: /^Continue/ }).click();
          await expectUiRouteState(page, before);
          const terrain = page.locator('.maze-terrain-svg');
          await expect(terrain).toHaveAttribute("data-wall-lighting", "04c-balanced-v2");
          await page.evaluate(async () => { await document.fonts.ready; await Promise.all([...document.images].map(i => i.decode().catch(() => {}))); });
          await page.waitForTimeout(350);
          const initial = await terrain.innerHTML();
          if ([0, 8, 9, 15].includes(index) && start === 0) {
            const pixelProof = await page.evaluate(async ({camera,terrain}) => {
              const source = document.querySelector<SVGSVGElement>('.maze-terrain-svg')!;
              const board = document.querySelector('.maze-board')!.getBoundingClientRect();
              const width = Math.round(board.width * devicePixelRatio), height = Math.round(board.height * devicePixelRatio);
              const clone = source.cloneNode(true) as SVGSVGElement;
              clone.setAttribute('viewBox', `${camera.left} ${camera.top} ${camera.width} ${camera.height}`);
              clone.setAttribute('width', String(width)); clone.setAttribute('height', String(height));
              for (const node of [...clone.children]) if (node.tagName !== 'defs' && !node.classList.contains('terrain-tall-walls')) node.remove();
              for (const path of clone.querySelectorAll('.terrain-tall-walls path')) { path.setAttribute('fill', path.getAttribute('fill') === 'none' ? 'none' : 'white'); path.setAttribute('stroke', path.hasAttribute('stroke') ? 'white' : 'none'); path.setAttribute('opacity', '1'); }
              // The actual mounted SVG/clip IDs are exercised; image textures are
              // replaced only in this detached coverage proof, never in gameplay.
              for (const image of clone.querySelectorAll('image')) image.remove();
              const mask = clone.cloneNode(false) as SVGSVGElement;
              const footprint = document.createElementNS('http://www.w3.org/2000/svg','path');
              const allowed:string[]=[];
              for(let y=0;y<terrain.length;y++) for(let x=0;x<terrain[y]!.length;x++) if(terrain[y]![x]==='wall') {
                allowed.push(`M${x} ${y}h1v1h-1Z`);
                if(y>0&&terrain[y-1]![x]!=='wall') allowed.push(`M${x} ${y-.30}h1v.30h-1Z`);
              }
              footprint.setAttribute('d',allowed.join('')); footprint.setAttribute('fill','white'); mask.appendChild(footprint);
              const raster = async (svg: SVGSVGElement) => {
                const url = URL.createObjectURL(new Blob([new XMLSerializer().serializeToString(svg)], { type: 'image/svg+xml' }));
                try { const image = new Image(); image.src = url; await image.decode(); const canvas = document.createElement('canvas'); canvas.width = width; canvas.height = height; const context = canvas.getContext('2d')!; context.drawImage(image, 0, 0); return context.getImageData(0, 0, width, height).data; }
                finally { URL.revokeObjectURL(url); }
              };
              const actual = await raster(clone), expected = await raster(mask); let outside = 0, maxAlpha = 0;
              for (let i = 3; i < actual.length; i += 4) if (expected[i] === 0 && actual[i]! > 4) { outside++; maxAlpha = Math.max(maxAlpha, actual[i]!); }
              return { width, height, outside, maxAlpha };
            }, {camera:getCameraWindow(level, before.position),terrain:level.terrain});
            await writeFile(resolve(output, `${width}-${level.id}-clip.json`), JSON.stringify(pixelProof, null, 2));
            expect(pixelProof.outside).toBe(0);
          }
          const scene = await page.evaluate(() => ({
            broken: [...document.images].filter(i => !i.complete || !i.naturalWidth).length,
            wallGroups: document.querySelectorAll('.terrain-tall-walls').length,
            playerCount: document.querySelectorAll('.player-layer').length,
            followers: document.querySelectorAll('[data-follower-id]').length,
            dressing: [...document.querySelectorAll('.terrain-floor-dressing,.terrain-wall-dressing')].map(e => ({ opacity: getComputedStyle(e).opacity, filter: getComputedStyle(e).filter })),
          }));
          expect(await page.locator('.maze-foreground').count()).toBe(1);
          const registration=await page.evaluate(()=>[...document.querySelectorAll<HTMLImageElement>('.maze-board img[data-field-layout]')].map(e=>{
            const bounds=e.dataset.artVisibleBounds!.split(',').map(Number),r=e.getBoundingClientRect();
            const canvas=e.offsetWidth,tile=e.parentElement!.clientWidth;
            return {id:e.dataset.artId,width:canvas*bounds[2]!/tile,aspect:e.offsetHeight/e.offsetWidth,source:e.naturalHeight/e.naturalWidth};
          }));
          for(const r of registration) {expect(r.width,r.id).toBeGreaterThan(.88);expect(r.width,r.id).toBeLessThan(.92);expect(r.aspect).toBeCloseTo(r.source,1);}
          expect(scene.broken).toBe(0); expect(scene.wallGroups).toBe(1); expect(scene.playerCount).toBe(1);
          for (const dressing of scene.dressing) { expect(dressing.opacity).toBe("1"); expect(dressing.filter).toBe("none"); }
          await page.screenshot({ path: resolve(output, `${width}-${level.id}-${start}.png`) });
          // Real inputs preserve immutable terrain while actors/encounters progress.
          for (const step of route.slice(start, Math.min(route.length - 1, start + 2))) await replayRouteStep(page, step);
          expect(await terrain.innerHTML()).toBe(initial);
          expect(errors).toEqual([]); results.push({ level: level.id, start, scene });
        } finally { await context.close(); }
      }
    }
    await writeFile(resolve(output, `${width}-scenes.json`), JSON.stringify(results, null, 2));
  });
}

for (const [width, height] of [[780, 312], [1194, 834]]) {
  test(`WALL04C maximum generated maze movement ${width}x${height}`, async ({ browser }) => {
    // Freeze only the generation seed, not rAF/performance timers. Fully unlocked
    // normal profiles select size hint17/adventure; the generator's odd ceiling23
    // is deliberately distinct from the absolute24-tile game ceiling.
    let epoch = 1788739200000;
    let level = generateSurpriseMaze({ seed: `ame-${epoch.toString(36)}`, size: 17, difficulty: "adventure" });
    for (let attempt = 0; level.width !== MAX_GENERATED_MAZE_SIZE && attempt < 64; attempt++) {
      epoch++;
      level = generateSurpriseMaze({ seed: `ame-${epoch.toString(36)}`, size: 17, difficulty: "adventure" });
    }
    expect(level.width).toBe(23); expect(level.height).toBe(23);
    const route = deriveRoute(level, solveLevel(level, { requireAllAnimals: true }).directions);
    const context = await browser.newContext({ viewport: { width, height }, deviceScaleFactor: 2 });
    try {
      const page = await context.newPage(), errors: string[] = [];
      page.on("pageerror", e => errors.push(e.message));
      await page.addInitScript(({ epoch, progress, preferences, keys }) => {
        Date.now = () => epoch;
        localStorage.setItem(keys.progress, JSON.stringify(progress));
        localStorage.setItem(keys.preferences, JSON.stringify({ ...preferences, muted: true, quality: "full", motion: "full" }));
      }, { epoch, progress, preferences: DEFAULT_PRESENTATION_PREFERENCES, keys: { progress: PLAYER_PROGRESS_STORAGE_KEY, preferences: PRESENTATION_PREFERENCES_KEY } });
      await page.goto("/"); await page.getByRole("button", { name: "Play", exact: true }).click();
      await page.getByRole("button", { name: "Surprise maze", exact: true }).click();
      await expect(page.getByRole("region", { name: `${level.name} maze`, exact: true })).toBeVisible();
      const terrain = page.locator('.maze-terrain-svg');
      await expect(terrain).toHaveAttribute("data-wall-lighting", "04c-balanced-v2");
      const initial = await terrain.innerHTML();
      for (const step of route.slice(0, 24)) await replayRouteStep(page, step);
      expect(await terrain.innerHTML()).toBe(initial);
      expect(errors).toEqual([]);
      const resources = await page.evaluate(() => ({
        svgNodes: document.querySelectorAll('.maze-terrain-svg *').length,
        brokenImages: [...document.images].filter(i => !i.complete || !i.naturalWidth).length,
        heap: (performance as Performance & { memory?: { usedJSHeapSize: number } }).memory?.usedJSHeapSize,
      }));
      expect(resources.brokenImages).toBe(0);
      await page.screenshot({ path: resolve(output, `${width}-generated-maximum.png`) });
      await writeFile(resolve(output, `${width}-generated-maximum.json`), JSON.stringify({ seed: `ame-${epoch.toString(36)}`, level: level.id, width: level.width, height: level.height, moves: Math.min(24, route.length), resources, errors }, null, 2));
    } finally { await context.close(); }
  });
}
