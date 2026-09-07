// Verify the published bytes against the frozen local build, then use isolated
// public contexts. Never touches the Human's browser profile or saved adventure.
import { pathToFileURL } from 'node:url';
import { createHash } from 'node:crypto';
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { execFileSync } from 'node:child_process';
import { resolve } from 'node:path';

const root = resolve(import.meta.dirname, '../..');
if (!process.env.MAZE_PLAYWRIGHT_PATH) throw Error('Set MAZE_PLAYWRIGHT_PATH to installed Playwright index.mjs');
const { chromium } = await import(pathToFileURL(process.env.MAZE_PLAYWRIGHT_PATH).href);
const output = process.env.MAZE_PERF_EVIDENCE_DIR;
if (!output) throw Error('Set an external MAZE_PERF_EVIDENCE_DIR');
const { version } = JSON.parse(await readFile(resolve(root, 'package.json'), 'utf8'));
const index = await readFile(resolve(root, 'dist/index.html'), 'utf8');
const paths = ['/', ...[...index.matchAll(/(?:src|href)="(\/assets\/[^" ]+\.(?:js|css))"/g)].map(m => m[1])];
if (paths.length !== 3) throw Error('Expected HTML/JS/CSS entry files');
const sha = b => createHash('sha256').update(b).digest('hex');
const expected = await Promise.all(paths.map(async path => { const b = await readFile(resolve(root, 'dist', path === '/' ? 'index.html' : path.slice(1))); return { path, bytes: b.length, sha256: sha(b) }; }));
const receipt = { time: new Date().toISOString(), source: execFileSync('git', ['rev-parse', 'HEAD'], { cwd: root, encoding: 'utf8' }).trim(), version, expected, http: [], browser: [] };
await mkdir(output, { recursive: true });
for (const origin of ['https://mazesopuzzle.com', 'https://maze-so-puzzle.vercel.app']) for (const expectedFile of expected) {
  const response = await fetch(origin + expectedFile.path, { headers: { 'cache-control': 'no-cache' } });
  const b = Buffer.from(await response.arrayBuffer());
  const row = { url: origin + expectedFile.path, status: response.status, bytes: b.length, sha256: sha(b) }; receipt.http.push(row);
  if (row.status !== 200 || row.bytes !== expectedFile.bytes || row.sha256 !== expectedFile.sha256) throw Error(`Public identity mismatch ${JSON.stringify(row)}`);
}
async function settle(page) {
  await page.evaluate(async () => { await document.fonts.ready; await Promise.all([...document.images].filter(i => { const r = i.getBoundingClientRect(); return r.width > 0 && r.height > 0 && r.top < innerHeight && r.bottom > 0; }).map(i => i.decode())); });
}
const browser = await chromium.launch({ headless: true });
try { for (const [width, height] of [[780, 312], [1280, 720]]) {
  const context = await browser.newContext({ viewport: { width, height }, deviceScaleFactor: 2 });
  try {
    const page = await context.newPage(), errors = []; page.on('pageerror', e => errors.push(e.message));
    await page.goto('https://mazesopuzzle.com/', { waitUntil: 'networkidle' });
    if (!(await page.locator('body').innerText()).includes(version)) throw Error('Version absent');
    await page.getByRole('button', { name: 'Play', exact: true }).click();
    await page.getByRole('button', { name: "Ame's adventure book", exact: true }).click();
    await page.getByRole('tab', { name: 'Friends', exact: true }).click();
    const count = await page.locator('.book-count').innerText(); if (count !== '0 / 32 met') throw Error(count);
    await settle(page); await page.screenshot({ path: resolve(output, `friends-${width}.png`) });
    await page.keyboard.press('Escape'); await page.locator('.quick-sound-settings').click();
    const music = await page.locator('#music-volume').inputValue(), sfx = await page.locator('#sfx-volume').inputValue();
    if (music !== '65' || sfx !== '85') throw Error('Wrong fresh mix');
    await page.keyboard.press('Escape'); await page.getByRole('button', { name: 'Home', exact: true }).click();
    await page.getByRole('button', { name: /Begin adventure/ }).click();
    await page.getByRole('button', { name: 'Start the maze', exact: true }).click();
    await page.locator('.maze-board').waitFor({ state: 'visible' }); await page.waitForTimeout(600);
    const wall = await page.locator('.maze-terrain-svg').getAttribute('data-wall-lighting');
    if (wall !== '04c-balanced-v1') throw Error('Wrong wall construction');
    if (await page.locator('.maze-terrain-svg').getAttribute('data-hazard-surface') !== '02-crisp-local') throw Error('Wrong hazard surface revision');
    // Right from the first maze's start rescues an adjacent friend without a
    // movement step. Up is the authored clear path for this movement assertion.
    await page.keyboard.press('ArrowUp'); await page.waitForTimeout(400);
    const steps = await page.locator('.step-pill').getAttribute('aria-label');
    if (steps !== '1 step') throw Error(`Input failed: ${steps}`);
    const geometry = await page.locator('.game-stage').evaluate(e => ({ phone: e.hasAttribute('data-phone-fit'), rect: e.getBoundingClientRect().toJSON() }));
    if (geometry.rect.x < -.1 || geometry.rect.y < -.1 || geometry.rect.right > width + .1 || geometry.rect.bottom > height + .1) throw Error('Stage clips');
    await page.locator('[data-focus-id="sound"]').click();
    if (await page.locator('#music-volume').inputValue() !== '65') throw Error('Game mix changed');
    await page.keyboard.press('Escape'); await settle(page); await page.screenshot({ path: resolve(output, `game-${width}.png`) });
    receipt.browser.push({ width, height, count, music, sfx, steps, errors, geometry, wall, hazard: '02-crisp-local', journey: 'Play, Friends, Sound, Home, Begin adventure, Start the maze, ArrowUp, Sound, resume' });
    if (errors.length) throw Error(JSON.stringify(errors));
  } finally { await context.close(); }
} } finally { await browser.close(); await writeFile(resolve(output, 'receipt.json'), JSON.stringify(receipt, null, 2) + '\n'); }
console.log(JSON.stringify(receipt));
