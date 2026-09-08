import { test, expect } from '@playwright/test';
import { readFileSync, mkdirSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { CANARIES } from './fixtures';
import { CURATED_LEVELS } from '../../../src/game/levels';
import { createActiveRunSnapshot, ACTIVE_RUN_STORAGE_KEY } from '../../../src/session';
import { createDefaultPlayerProgress, PLAYER_PROGRESS_STORAGE_KEY } from '../../../src/progress';
import { PRESENTATION_PREFERENCES_KEY } from '../../../src/motion';
import { hintStateKey, getProgressiveHint } from '../../../src/game/hints';
const root = 'C:/GameDev/maze-game-qa/plan09-p1';
const images = process.env.MAZE_P1_BROWSER_DIR ?? resolve(root, 'browser-final');
const report = JSON.parse(readFileSync(resolve(root, 'engine-report.json'), 'utf8'));
mkdirSync(images, { recursive: true });

const levels = process.env.MAZE_P1_BASELINE === '1' ? [CURATED_LEVELS[6]!, CURATED_LEVELS[9]!] : CANARIES;
for (const level of levels) for (const width of [780, 1280]) test(`${level.id} ${width} clue branch return and saved help`, async ({ page }) => {
  const errors: string[] = []; page.on('pageerror', e => errors.push(e.message));
  await page.setViewportSize({ width, height: width === 780 ? 312 : 720 });
  const proof = report.find((r: any) => r.id === level.id);
  const checkpoints = { ...proof.checkpoints, ...(proof.roomContact ? { roomContact: proof.roomContact.game } : {}) };
  for (const [label, game] of Object.entries(checkpoints) as [string, any][]) {
    const snapshot = createActiveRunSnapshot({ runId: game.loot.runId, mode: 'normal', level, game, revealedTiles: proof.explored[label] ?? [], hintUsesByState: {} });
    expect(snapshot).not.toBeNull();
    await page.goto('/');
    await page.evaluate(({ snapshot, run, progress, prefs, defaults }) => {
      localStorage.setItem(run, JSON.stringify(snapshot));
      localStorage.setItem(progress, JSON.stringify(defaults));
      localStorage.setItem(prefs, JSON.stringify({ quality: 'full', motion: 'reduced', musicVolume: 0, sfxVolume: 0 }));
    }, { snapshot, run: ACTIVE_RUN_STORAGE_KEY, progress: PLAYER_PROGRESS_STORAGE_KEY, prefs: PRESENTATION_PREFERENCES_KEY, defaults: createDefaultPlayerProgress(levels.length === 2 && !process.env.MAZE_P1_BASELINE ? 2 : CURATED_LEVELS.length) });
    await page.reload();
    await page.getByRole('button', { name: 'Play', exact: true }).click();
    await page.getByRole('button', { name: /^Continue/ }).click();
    await expect(page.locator('.maze-panel')).toBeVisible();
    await page.evaluate(async () => { await document.fonts.ready; await Promise.all([...document.images].map(i => i.decode().catch(() => {}))); });
    await page.screenshot({ path: resolve(images, `${level.id}-${width}-${label}.png`) });
    const geometry = await page.evaluate(() => ({
      viewport: document.querySelector('.maze-panel')?.getBoundingClientRect().toJSON(),
      map: document.querySelector('.maze-minimap')?.getBoundingClientRect().toJSON(),
      broken: [...document.images].filter(i => !i.complete || !i.naturalWidth).map(i => i.src),
    }));
    expect(geometry.broken).toEqual([]);
    expect(geometry.map).toBeDefined();
    writeFileSync(resolve(images, `${level.id}-${width}-${label}.json`), JSON.stringify(geometry));
    const saved = await page.evaluate(k => JSON.parse(localStorage.getItem(k)!), ACTIVE_RUN_STORAGE_KEY);
    expect(saved.game.position).toEqual(game.position); expect(saved.game.power).toBe(game.power);
    // Real mounted help, then a fresh reload; fixtures never touch Human origins.
    for (let tier = 0; tier < 4; tier++) {
      await page.getByRole('button', { name: /^More/ }).click();
      await page.getByRole('button', { name: 'Objective & gentle hint' }).click();
      await expect(page.locator('.hint-card small')).toContainText(`Hint ${tier + 1} of 4`);
      await expect(page.locator('.hint-thought')).toContainText(getProgressiveHint(level, game, tier).text.split('. ')[0]!);
      if (tier === 0 || tier === 3) await page.screenshot({ path: resolve(images, `${level.id}-${width}-${label}-hint-${tier}.png`) });
      await page.getByRole('button', { name: 'Got it!', exact: true }).click();
    }
    await page.reload();
    const resumed = await page.evaluate(k => JSON.parse(localStorage.getItem(k)!), ACTIVE_RUN_STORAGE_KEY);
    expect(resumed.game.position).toEqual(game.position); expect(resumed.game.power).toBe(game.power);
    expect(resumed.hintUsesByState[hintStateKey(game)]).toBe(4);
  }
  expect(errors).toEqual([]);
});
