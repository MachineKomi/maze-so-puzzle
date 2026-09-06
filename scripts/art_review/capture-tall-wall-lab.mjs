import { mkdir, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
const { chromium } = await import(pathToFileURL(process.env.MAZE_PLAYWRIGHT_PATH).href);
const output = resolve(process.env.MAZE_WALL_PROOF_DIR);
await mkdir(output, { recursive: true });
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 950 }, deviceScaleFactor: 1 });
const errors = []; page.on('pageerror', e => errors.push(e.message));
try {
  await page.goto('http://127.0.0.1:1421/scripts/art_review/tall-wall-lab.html');
  await page.waitForFunction(() => Boolean(window.wallLab));
  await page.waitForTimeout(700);
  const snapshots = [];
  for (const [name, theme, at, index = 0] of [['stone-start', 'sunny-stone', null], ['stone-corridor', 'sunny-stone', { x: 3, y: 3 }], ['vines', 'lantern-ruins', null], ['leaves', 'harvest-bramble', null], ['maze', 'sunny-stone', null, 8]]) {
    await page.evaluate(({ theme, at, index }) => { window.wallLab.setScene(index, theme); if (at) window.wallLab.setPoint(at); }, { theme, at, index });
    await page.waitForTimeout(450);
    // SVG image resources are not in document.images; wait for network decode/paint.
    await page.screenshot({ path: resolve(output, `${name}.png`), fullPage: true });
    snapshots.push({ name, ...await page.evaluate(() => window.wallLab.snapshot) });
  }
  await writeFile(resolve(output, 'capture.json'), JSON.stringify({ browser: browser.version(), viewport: [1440, 950], errors, snapshots, scope: 'Isolated local geometry canary, not production/performance acceptance.' }, null, 2));
  if (errors.length) throw Error(errors.join('\n'));
} finally { await browser.close(); }
