// Release comparison against frozen live0.22.10; records served hashes and gzip traces.
// Run alone after the source-matched build, with no dev edits or other browser jobs.
import { gzipSync } from "node:zlib";
import { createServer } from 'node:http';
import { readFile, mkdir, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { resolve, extname } from 'node:path';
import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { pathToFileURL } from 'node:url';

const root = resolve(import.meta.dirname, '../..');
const output = resolve(root, process.env.MAZE_REVIEW_OUTPUT || '../maze-game-qa/performance/phone02-book-paired-20260906');
const jumpReview = process.env.MAZE_REVIEW_ROUTE === 'jump';
const idleReview = process.env.MAZE_REVIEW_ROUTE === 'idle';
const baseline = resolve(root, process.env.MAZE_REVIEW_BASELINE || 'output/playwright/migration-preflight-20260906/live-baseline');
const fixturesPath = resolve(root, process.env.MAZE_REVIEW_FIXTURES || 'output/playwright/walls04-rack-new-host/fixtures.json');
const playwrightPath = process.env.MAZE_PLAYWRIGHT_PATH;
if (!playwrightPath) throw Error('Set MAZE_PLAYWRIGHT_PATH to the installed Playwright index.mjs');
const { chromium } = await import(pathToFileURL(playwrightPath).href);
await mkdir(output, { recursive: true });
const data = JSON.parse(await readFile(fixturesPath, 'utf8'));
const fixture = jumpReview ? data.fixtures.find(f => f.level.id === 'wishing-woods' && f.step.direction === 'right' && f.step.result.events.every(e=>['hole-jumped','moved'].includes(e.type))) : data.fixtures.find(f => f.id === (process.env.MAZE_REVIEW_FIXTURE_ID || 'twilight-treasure-loop'));
if (!fixture || (!jumpReview && (fixture.direction !== 'right' || fixture.count < 4))) throw Error('Expected frozen engine-derived route');
if (idleReview && !(fixture.visibleHazardCells > 0)) throw Error('Idle hazard comparison requires a nonempty visible-hazard fixture');
const sha = bytes => createHash('sha256').update(bytes).digest('hex');
const index = await readFile(resolve(root, 'dist/index.html'), 'utf8');
const candidateBundle = index.match(/src="(\/assets\/[^"]+\.js)"/)[1];
const baselineIndex=await readFile(resolve(baseline,'index.html'),'utf8');
const baselineBundle=baselineIndex.match(/src="(\/assets\/[^"]+\.js)"/)[1];
const hashes = { baseline: sha(await readFile(resolve(baseline, baselineBundle.slice(1)))), candidate: sha(await readFile(resolve(root,'dist',candidateBundle.slice(1)))) };
const baselineIdentity=process.env.MAZE_REVIEW_BASELINE ? JSON.parse(await readFile(resolve(baseline,'identity.json'),'utf8')) : null;
if(baselineIdentity) for(const row of baselineIdentity.rows) {const b=await readFile(resolve(baseline,row.file));if(b.length!==row.bytes||sha(b)!==row.sha256)throw Error('Frozen entry drift');}
else if (hashes.baseline !== 'e4cb4b603e531a4a67da0bab5bae26599bf594237d9005fb699a8b5a043b135a') throw Error('Frozen baseline drift');
if (execFileSync('git',['diff','--name-only',baselineIdentity?.source ?? 'd9c76976c0e1926fd6020f3071f32a6a37e762a7','--','public'],{cwd:root,encoding:'utf8'}).trim()) throw Error('Baseline fallback requires unchanged public media');
const served = { baseline: {}, candidate: {} }; let servingMode = 'baseline';
const hashCache = new Map();
const mime = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.webp': 'image/webp', '.png': 'image/png', '.woff2': 'font/woff2', '.mp3': 'audio/mpeg', '.svg': 'image/svg+xml' };
const server = createServer(async (req, res) => {
  try {
    const pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
    const relative = pathname === '/baseline' ? null : pathname.replace(/^\/+/, '');
    const candidates = relative === null ? [resolve(baseline, 'index.html')]
      : pathname === '/candidate' ? [resolve(root, 'dist/index.html')]
        : [resolve(baseline, relative), resolve(root, 'dist', relative)];
    const file = candidates.find(p => (p.startsWith(baseline + '/') || p.startsWith(baseline + '\\') || p.startsWith(resolve(root, 'dist') + '/') || p.startsWith(resolve(root, 'dist') + '\\')) && existsSync(p));
    if (!file) { res.writeHead(404); res.end(); return; }
    res.writeHead(200, { 'Content-Type': mime[extname(file)] || 'application/octet-stream', 'Cache-Control': 'no-store' });
    const bytes = await readFile(file);
    if (!hashCache.has(file)) hashCache.set(file, sha(bytes));
    served[servingMode][pathname] = { bytes: bytes.length, sha256: hashCache.get(file) };
    res.end(bytes);
  } catch { res.writeHead(500); res.end(); }
});
await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
const origin = `http://127.0.0.1:${server.address().port}`;
const browser = await chromium.launch({ headless: true });
const report = { date: new Date().toISOString(), head: execFileSync('git', ['rev-parse', 'HEAD'], { cwd: root, encoding: 'utf8' }).trim(), browser: browser.version(), hashes, served, fixture: fixture.id ?? fixture.level.id, route: jumpReview ? 'eight reversible one-hole jumps' : 'sixteen reversible ordinary steps', baselineIdentity,
  scope: 'Headless local Chromium same-host paired frame/trace diagnostic; no physical iPad, native, GPU-time or Human beauty acceptance. Trace durations overlap and are not additive.', rows: [] };
if (idleReview) { report.route = 'eight seconds idle with live ambient surfaces'; report.visibleHazardCells = fixture.visibleHazardCells; }
const percentile = (a, q) => a[Math.min(a.length - 1, Math.floor(a.length * q))];
try {
  for (const cohort of [{ width: 780, height: 312, pairs: 5 }, { width: 1193, height: 833, pairs: 5 }]) {
    for (let pair = -1; pair < cohort.pairs; pair++) {
      for (const mode of pair % 2 === 0 ? ['baseline', 'candidate'] : ['candidate', 'baseline']) {
        servingMode = mode;
        const ctx = await browser.newContext({ viewport: { width: cohort.width, height: cohort.height }, deviceScaleFactor: 2 });
        try {
          const page = await ctx.newPage(); const errors = [];
          page.on('pageerror', e => errors.push(String(e)));
          await page.addInitScript(({ data, fixture }) => {
            localStorage.setItem(data.keys.run, JSON.stringify(fixture.snapshot));
            localStorage.setItem(data.keys.progress, JSON.stringify(data.progress));
            localStorage.setItem(data.keys.preferences, JSON.stringify({ ...data.preferences, quality: 'full', motion: 'full', pace: 'regular' }));
          }, { data, fixture });
          await page.goto(`${origin}/${mode}`);
          await page.getByRole('button', { name: 'Play', exact: true }).click();
          await page.getByRole('button', { name: /^Continue/ }).click();
          await page.locator('.maze-terrain-svg').waitFor();
          const bundle = await page.locator('script[type="module"]').getAttribute('src');
          if (bundle !== (mode === 'baseline' ? baselineBundle : candidateBundle)) throw Error('Wrong entry module');
          await page.evaluate(async () => { await document.fonts.ready; await Promise.all([...document.images].map(i => i.decode().catch(() => {}))); });
          await page.waitForTimeout(500);
          const client = await ctx.newCDPSession(page), events = [];
          client.on('Tracing.dataCollected', ({ value }) => events.push(...value));
          await client.send('Tracing.start', { categories: 'devtools.timeline,disabled-by-default-devtools.timeline,disabled-by-default-devtools.timeline.layers', transferMode: 'ReportEvents' });
          await page.evaluate(() => {
            window.wallAb = { frames: [], positions: [], done: false, mutations: 0 };
            window.wallAbObserver = new MutationObserver(m => window.wallAb.mutations += m.length);
            window.wallAbObserver.observe(document.querySelector('.maze-terrain-svg'), { attributes: true, childList: true, subtree: true });
            const tick = t => {
              window.wallAb.frames.push(t);
              window.wallAb.positions.push(getComputedStyle(document.querySelector('.camera-world')).translate);
              if (!window.wallAb.done) requestAnimationFrame(tick);
            }; requestAnimationFrame(tick);
          });
          // Four reversible four-step legs: deterministic 16 attempts, ~3.84s.
          if(idleReview) await page.waitForTimeout(8000);
          else if(jumpReview) for(let step=0;step<8;step++){await page.keyboard.press(step%2?'ArrowLeft':'ArrowRight');await page.waitForTimeout(600);}
          else for (const direction of ['Right', 'Left', 'Right', 'Left']) {
            for (let step = 0; step < 4; step++) { await page.keyboard.press(`Arrow${direction}`); await page.waitForTimeout(240); }
          }
          const sample = await page.evaluate(key => {
            window.wallAb.done = true; window.wallAbObserver.disconnect();
            return { ...window.wallAb, save: JSON.parse(localStorage.getItem(key)), brokenImages: [...document.images].filter(i => !i.complete || !i.naturalWidth).length };
          }, data.keys.run);
          const complete = new Promise(resolve => client.once('Tracing.tracingComplete', resolve));
          await client.send('Tracing.end'); await complete;
          const deltas = sample.frames.slice(1).map((t, i) => t - sample.frames[i]), sorted = [...deltas].sort((a, b) => a - b);
          const trace = Object.fromEntries(['Paint', 'RasterTask', 'CompositeLayers', 'Layout', 'UpdateLayoutTree'].map(name => {
            const entries = events.filter(e => e.name === name && e.ph === 'X');
            return [name, { count: entries.length, totalMs: entries.length ? entries.reduce((n, e) => n + (e.dur || 0), 0) / 1000 : null }];
          }));
          const row = { mode, pair, warmup: pair < 0, viewport: [cohort.width, cohort.height], bundle, stepsBefore: fixture.snapshot.game.steps, stepsAfter: sample.save?.game?.steps,
            positionBefore: fixture.snapshot.game.position, positionAfter: sample.save?.game?.position, transforms: new Set(sample.positions).size, mutations: sample.mutations,
            p50: percentile(sorted, .5), p90: percentile(sorted, .9), p95: percentile(sorted, .95), max: sorted.at(-1), over20: deltas.filter(n => n > 20).length, over34: deltas.filter(n => n > 34).length, deltas, positions: sample.positions, trace, errors, brokenImages: sample.brokenImages };
          report.rows.push(row);
          await writeFile(resolve(output, 'report.json'), JSON.stringify(report, null, 2));
          if (pair === 0) await page.screenshot({ path: resolve(output, `${cohort.width}-${mode}.png`) });
          await writeFile(resolve(output, `${cohort.width}-${pair}-${mode}-trace.json.gz`), gzipSync(JSON.stringify({ traceEvents: events }), { level: 6 }));
          console.log(JSON.stringify({ ...row, deltas: undefined, positions: undefined }));
          if (errors.length || sample.brokenImages || row.stepsAfter - row.stepsBefore !== (idleReview?0:jumpReview?8:16) || JSON.stringify(row.positionBefore) !== JSON.stringify(row.positionAfter) || (idleReview ? row.transforms !== 1 : row.transforms < (jumpReview&&mode==='baseline'?2:8)) || row.mutations) throw Error('Contaminated or unmatched route; retained report');
        } finally { await ctx.close(); }
      }
    }
  }
} finally { await browser.close(); await new Promise(resolve => server.close(resolve)); }
