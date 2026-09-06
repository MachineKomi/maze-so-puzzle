// Playwright CLI run-code callback. Dev/review tooling only; never shipped.
// Open the candidate with ?reviewLane=desktop-1 (or compact-2, etc.) first.
// Fixtures are engine-produced normal saves, not tester-granted progress.
async page => {
  const { lane, target } = await page.evaluate(() => ({ lane: new URL(location.href).searchParams.get('reviewLane') || 'desktop-1', target: location.origin }));
  const compact = lane.startsWith('compact');
  const dpr = Number(lane.split('-')[1]);
  if (![1, 2].includes(dpr)) throw new Error('Expected desktop/compact-1/2 lane');
  const data = await (await page.request.get('http://127.0.0.1:4190/output/playwright/walls04-rack/fixtures.json')).json();
  const browser = page.context().browser();
  const rows = [];
  for (const quality of ['full', 'lite', 'static']) for (const motion of ['full', 'reduced']) for (const fixture of data.fixtures) {
    const viewport = compact ? { width: 844, height: 390 } : { width: 1193, height: 833 };
    const ctx = await browser.newContext({ viewport, deviceScaleFactor: dpr });
    const p = await ctx.newPage();
    p.setDefaultTimeout(15000);
    const errors = [];
    p.on('pageerror', e => errors.push(String(e)));
    p.on('console', m => { if (['error', 'warning'].includes(m.type())) errors.push(m.text()); });
    await p.addInitScript(({ data, fixture, quality, motion }) => {
      localStorage.setItem(data.keys.run, JSON.stringify(fixture.snapshot));
      localStorage.setItem(data.keys.progress, JSON.stringify(data.progress));
      localStorage.setItem(data.keys.preferences, JSON.stringify({ ...data.preferences, quality, motion }));
    }, { data, fixture, quality, motion });
    await p.goto(target);
    await p.getByRole('button', { name: 'Play', exact: true }).click();
    await p.getByRole('button', { name: /^Continue/ }).click();
    await p.locator('.maze-terrain-svg').waitFor();
    await p.bringToFront();
    await p.evaluate(() => Promise.all([...document.images].map(i => i.decode().catch(() => {}))));
    const bundle = await p.locator('script[type="module"]').getAttribute('src');
    if (bundle !== '/assets/index-fV--7I7N.js') throw new Error('Final bundle mismatch: ' + bundle);
    const client = await ctx.newCDPSession(p);
    await client.send('Performance.enable');
    const beforeMetrics = (await client.send('Performance.getMetrics')).metrics;
    const before = await p.evaluate(() => ({ step: document.querySelector('.step-pill')?.getAttribute('aria-label'), world: getComputedStyle(document.querySelector('.camera-world')).translate }));
    await p.evaluate(() => {
      window.wallProbe = { mutations: 0, frames: [], samples: [] };
      window.wallObserver = new MutationObserver(m => window.wallProbe.mutations += m.length);
      window.wallObserver.observe(document.querySelector('.maze-terrain-svg'), { subtree: true, attributes: true, childList: true });
      let start;
      const sample = t => {
        start ??= t;
        const board = document.querySelector('.maze-board'), v = getComputedStyle(board, '::after');
        window.wallProbe.frames.push(t);
        window.wallProbe.samples.push({ width: board.clientWidth, pseudo: parseFloat(v.width), content: v.content, animation: v.animationName, transform: v.transform, world: getComputedStyle(document.querySelector('.camera-world')).translate });
        if (t - start < 1100) requestAnimationFrame(sample);
      };
      requestAnimationFrame(sample);
    });
    await p.waitForFunction(() => window.wallProbe.samples.length > 0);
    const key = 'Arrow' + fixture.direction[0].toUpperCase() + fixture.direction.slice(1);
    await p.keyboard.down(key);
    await p.waitForTimeout(430);
    await p.keyboard.up(key);
    await p.waitForTimeout(850);
    const after = await p.evaluate(() => {
      window.wallObserver.disconnect();
      return { ...window.wallProbe, world: getComputedStyle(document.querySelector('.camera-world')).translate, step: document.querySelector('.step-pill')?.getAttribute('aria-label'), wallNodes: document.querySelectorAll('.terrain-wall-side').length, castNodes: document.querySelectorAll('.terrain-wall-cast path').length, quality: document.querySelector('.game-stage').dataset.quality, broken: [...document.images].filter(i => !i.complete || !i.naturalWidth).length };
    });
    const afterMetrics = (await client.send('Performance.getMetrics')).metrics;
    const metricsMs = Object.fromEntries(['TaskDuration', 'LayoutDuration', 'RecalcStyleDuration'].map(name => [name, 1000 * (afterMetrics.find(m => m.name === name).value - beforeMetrics.find(m => m.name === name).value)]));
    const bad = after.samples.filter(s => s.content !== 'none' && (Math.abs(s.width - s.pseudo) > 1 || s.animation !== 'none' || s.transform !== 'none'));
    const moving = new Set([before.world, ...after.samples.map(s => s.world), after.world]).size;
    if (bad.length || errors.length || after.mutations || after.broken || after.wallNodes !== 1 || after.castNodes !== 2 || after.step === before.step || moving < 2 || after.quality !== quality) throw new Error(JSON.stringify({ fixture: fixture.id, lane, quality, motion, bad: bad.slice(0, 2), errors, before, after }));
    const deltas = after.frames.slice(1).map((t, i) => t - after.frames[i]).sort((a, b) => a - b);
    rows.push({ id: fixture.id, lane, viewport, dpr, quality, motion, beforeStep: before.step, afterStep: after.step, terrainMutations: after.mutations, movingTransforms: moving, p95FrameMs: deltas[Math.floor(deltas.length * .95)], maxFrameMs: deltas.at(-1), metricsMs, ghostInvalidSamples: bad.length, errors });
    if (quality === 'full' && motion === 'full') await p.screenshot({ path: `C:/maze-game/output/playwright/wall04ar1/${lane}-${fixture.id}.png` });
    await ctx.close();
  }
  return { status: 'pass', scope: 'Loaded-host Chromium diagnostics, not iPad or clean-host FPS qualification', lane, cases: rows.length, rows };
}
