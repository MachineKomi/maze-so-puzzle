// Playwright CLI run-code callback: same warmed save, alternating baseline/R1.
// Trace/rAF diagnostics from a loaded host, not a clean-cohort or iPad benchmark.
async page => {
  const castIsolation = await page.evaluate(() => new URL(location.href).searchParams.get('reviewProbe') === 'cast');
  const data = await (await page.request.get('http://127.0.0.1:4190/output/playwright/walls04-rack/fixtures.json')).json();
  const fixture = data.fixtures.find(f => f.id === 'twilight-treasure-loop');
  const browser = page.context().browser();
  const rows = [];
  for (const quality of (castIsolation ? ['full', 'lite'] : ['full', 'static'])) for (let repeat = 0; repeat < 3; repeat++) for (const candidate of (repeat % 2 ? [true, false] : [false, true])) {
    const ctx = await browser.newContext({ viewport: { width: 1193, height: 833 }, deviceScaleFactor: 2 });
    const p = await ctx.newPage();
    await p.addInitScript(({ data, fixture, quality }) => {
      localStorage.setItem(data.keys.run, JSON.stringify(fixture.snapshot));
      localStorage.setItem(data.keys.progress, JSON.stringify(data.progress));
      localStorage.setItem(data.keys.preferences, JSON.stringify({ ...data.preferences, quality, motion: quality === 'static' ? 'reduced' : 'full' }));
    }, { data, fixture, quality });
    await p.goto(candidate || castIsolation ? 'http://127.0.0.1:4189/' : 'https://mazesopuzzle.com/');
    await p.getByRole('button', { name: 'Play', exact: true }).click();
    await p.getByRole('button', { name: /^Continue/ }).click();
    await p.locator('.maze-terrain-svg').waitFor();
    await p.bringToFront();
    await p.evaluate(async () => { await document.fonts.ready; await Promise.all([...document.images].map(i => i.decode().catch(() => {}))); });
    const expected = candidate || castIsolation ? '/assets/index-fV--7I7N.js' : '/assets/index-T8J736ZB.js';
    if (await p.locator('script[type="module"]').getAttribute('src') !== expected) throw new Error('Comparison identity changed');
    if (castIsolation && !candidate) await p.locator('.terrain-wall-cast').evaluate(el => el.style.display = 'none');
    await p.waitForTimeout(400);
    const client = await ctx.newCDPSession(p);
    const events = [];
    client.on('Tracing.dataCollected', ({ value }) => events.push(...value));
    await client.send('Tracing.start', { categories: 'devtools.timeline,disabled-by-default-devtools.timeline,disabled-by-default-devtools.timeline.layers', transferMode: 'ReportEvents' });
    await p.evaluate(() => {
      window.paintFrames = [];
      window.paintWorlds = [];
      let start;
      const frame = t => {
        start ??= t;
        window.paintFrames.push(t);
        window.paintWorlds.push(getComputedStyle(document.querySelector('.camera-world')).translate);
        if (t - start < 1100) requestAnimationFrame(frame);
      };
      requestAnimationFrame(frame);
    });
    await p.keyboard.down('ArrowRight');
    await p.waitForTimeout(430);
    await p.keyboard.up('ArrowRight');
    await p.waitForTimeout(850);
    const complete = new Promise(resolve => client.once('Tracing.tracingComplete', resolve));
    await client.send('Tracing.end');
    await complete;
    const samples = await p.evaluate(() => ({ frames: window.paintFrames, transforms: new Set(window.paintWorlds).size }));
    if (samples.transforms < 2) throw new Error('Comparison camera did not move');
    const timings = samples.frames.slice(1).map((v, i) => v - samples.frames[i]).sort((a, b) => a - b);
    const summary = Object.fromEntries(['Paint', 'RasterTask', 'CompositeLayers', 'UpdateLayerTree', 'Layout', 'UpdateLayoutTree'].map(name => {
      const records = events.filter(e => e.name === name && e.ph === 'X');
      return [name, { events: records.length, totalMs: records.reduce((n, e) => n + (e.dur || 0), 0) / 1000 }];
    }));
    rows.push({ candidate, quality, repeat, bundle: expected, transforms: samples.transforms, p95FrameMs: timings[Math.floor(timings.length * .95)], trace: summary });
    await ctx.close();
  }
  return { castIsolation, scope: 'Alternating candidate/live baseline OR cast-on/off same-candidate diagnostic, decoded image/font barrier; loaded Windows Chromium DPR2, not hardware acceptance; trace durations include other game work and are not additive', rows };
}
