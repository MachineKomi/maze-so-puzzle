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
    if (wall !== '04c-balanced-v2') throw Error('Wrong wall construction');
    const hazard = await page.locator('.maze-terrain-svg').getAttribute('data-hazard-surface');
    if (hazard !== '03-living-connected') throw Error('Wrong hazard surface revision');
    // Right from the first maze's start rescues an adjacent friend without a
    // movement step. Up is the authored clear path for this movement assertion.
    await page.keyboard.press('ArrowUp'); await page.waitForTimeout(400);
    const steps = await page.locator('.step-pill').getAttribute('aria-label');
    if (steps !== '1 step') throw Error(`Input failed: ${steps}`);
    const geometry = await page.locator('.game-stage').evaluate(e => ({ phone: e.hasAttribute('data-phone-fit'), rect: e.getBoundingClientRect().toJSON() }));
    if (geometry.rect.x < -.1 || geometry.rect.y < -.1 || geometry.rect.right > width + .1 || geometry.rect.bottom > height + .1) throw Error('Stage clips');
    if(!await page.locator('[data-focus-id="sound"]:visible').count()) await page.locator('[data-focus-id="more"]:visible').click();
    await page.locator('[data-focus-id="sound"]:visible').click();
    if (await page.locator('#music-volume').inputValue() !== '65') throw Error('Game mix changed');
    await page.keyboard.press('Escape'); await settle(page); await page.screenshot({ path: resolve(output, `game-${width}.png`) });
    receipt.browser.push({ width, height, count, music, sfx, steps, errors, geometry, wall, hazard, journey: 'Play, Friends, Sound, Home, Begin adventure, Start the maze, ArrowUp, Sound, resume' });
    if (errors.length) throw Error(JSON.stringify(errors));
  } finally { await context.close(); }
}
// Optional current-engine camera route, restored only in fresh owned contexts.
// This checks published behavior, not physical-device frame performance.
if (process.env.MAZE_PUBLIC_CAMERA_FIXTURES) {
  const fixtureBytes = await readFile(process.env.MAZE_PUBLIC_CAMERA_FIXTURES);
  const data = JSON.parse(fixtureBytes), fixture = data.fixtures.find(f => f.id === 'shiny-sword');
  if (!fixture || fixture.count !== 4) throw Error('Expected engine-derived four-step camera fixture');
  receipt.cameraFixtureSha256 = sha(fixtureBytes); receipt.camera = [];
  const reverse = { left: 'right', right: 'left', up: 'down', down: 'up' };
  for (const [origin, width, height, dpr] of [
    ['https://mazesopuzzle.com', 844, 390, 3],
    ['https://maze-so-puzzle.vercel.app', 1080, 810, 2],
  ]) {
    const context = await browser.newContext({ viewport: { width, height }, deviceScaleFactor: dpr });
    try {
      const page = await context.newPage(), errors = []; page.on('pageerror', e => errors.push(e.message));
      await page.addInitScript(({ data, fixture }) => {
        localStorage.setItem(data.keys.run, JSON.stringify(fixture.snapshot));
        localStorage.setItem(data.keys.progress, JSON.stringify(data.progress));
        localStorage.setItem(data.keys.preferences, JSON.stringify({ ...data.preferences, quality: 'full', motion: 'full', pace: 'regular', muted: true }));
      }, { data, fixture });
      await page.goto(origin); await page.getByRole('button', { name: 'Play', exact: true }).click();
      await page.getByRole('button', { name: /^Continue/ }).click();
      await page.locator('.maze-board').waitFor(); await settle(page); await page.waitForTimeout(400);
      const camera = () => page.evaluate(() => {
        const world = document.querySelector('.camera-world'), terrain = document.querySelector('.maze-terrain-svg');
        const box = terrain.viewBox.baseVal, parts = world.style.translate.split(' ').map(parseFloat);
        return { x: box.x - (parts[0] || 0) * box.width / 100, y: box.y - (parts[1] || 0) * box.height / 100,
          width: box.width, height: box.height, aligned: terrain.getAttribute('viewBox') === document.querySelector('.maze-foreground').getAttribute('viewBox') };
      });
      const before = await camera(); let turn;
      for (const direction of [fixture.direction, reverse[fixture.direction]]) {
        if (!direction) throw Error('Unexpected camera direction');
        for (let step = 0; step < 4; step++) { await page.keyboard.press(`Arrow${direction[0].toUpperCase() + direction.slice(1)}`); await page.waitForTimeout(300); }
        if (!turn) turn = await camera();
      }
      const resultKey=process.env.MAZE_PUBLIC_CAMERA_RUN_KEY||data.keys.run;
      const after = await camera(), saved = await page.evaluate(key => JSON.parse(localStorage.getItem(key)), resultKey);
      if (Math.abs(turn.x - before.x) + Math.abs(turn.y - before.y) < 1
        || Math.abs(after.x - before.x) + Math.abs(after.y - before.y) > .0001
        || [before, turn, after].some(c => !c.aligned || c.width > 10 || c.height > 10)
        || saved.game.steps !== fixture.snapshot.game.steps + 8
        || JSON.stringify(saved.game.position) !== JSON.stringify(fixture.snapshot.game.position)
        || errors.length) throw Error(`Public camera route failed ${JSON.stringify({ before, turn, after, errors })}`);
      await page.screenshot({ path: resolve(output, `camera-${width}.png`) });
      receipt.camera.push({ origin, width, height, dpr, before, turn, after, steps: saved.game.steps, seedKey:data.keys.run,resultKey,errors });
    } finally { await context.close(); }
  }
}
if(process.env.MAZE_PUBLIC_LOOT_FIXTURES) {
  const fixtureBytes=await readFile(process.env.MAZE_PUBLIC_LOOT_FIXTURES),data=JSON.parse(fixtureBytes),fixture=data.fixtures.find(f=>f.id==='physical-gold');
  if(!fixture)throw Error('Expected current authored loot fixture');
  receipt.lootFixtureSha256=sha(fixtureBytes);receipt.loot=[];
  for(const origin of ['https://mazesopuzzle.com','https://maze-so-puzzle.vercel.app']) {
    const context=await browser.newContext({viewport:{width:844,height:390},deviceScaleFactor:3});
    try {
      const page=await context.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));
      await page.addInitScript(({data,fixture})=>{
        if(!sessionStorage.getItem('public-loot-fixture')) {
          localStorage.setItem(data.keys.run,JSON.stringify(fixture.snapshot));localStorage.setItem(data.keys.progress,JSON.stringify(data.progress));
          localStorage.setItem(data.keys.preferences,JSON.stringify({...data.preferences,muted:true,motion:'full',quality:'full'}));
          sessionStorage.setItem('public-loot-fixture','1');
        }
      },{data,fixture});
      const enter=async()=>{await page.goto(origin);await page.getByRole('button',{name:'Play',exact:true}).click();await page.getByRole('button',{name:/^Continue/}).click();await page.bringToFront();await settle(page);};
      const read=()=>page.evaluate(key=>JSON.parse(localStorage.getItem(key)),process.env.MAZE_PUBLIC_LOOT_RUN_KEY||'maze-so-puzzle-active-run-v5');
      const source=run=>run.game.loot.sources.find(s=>s.sourceId===fixture.sourceId);
      const press=direction=>page.keyboard.press(`Arrow${direction[0].toUpperCase()+direction.slice(1)}`);
      await enter();await press(fixture.direction);await page.waitForTimeout(150);const early=await read();
      if(!source(early)||source(early).credited!==0)throw Error('Loot credited before settling');
      await page.waitForTimeout(1600);const settled=await read(),pending=source(settled);
      if(!pending.drops.length||pending.credited<=0||pending.credited+pending.drops.reduce((n,d)=>n+d.amount,0)!==fixture.amount)throw Error('Loot did not remain conserved and distant');
      await page.screenshot({path:resolve(output,`loot-${receipt.loot.length}.png`)});
      await enter();await page.waitForTimeout(900);const restored=await read();
      if(JSON.stringify(restored.game)!==JSON.stringify(settled.game))throw Error('Grounded loot changed on reload');
      await press(fixture.approach);await page.waitForTimeout(1200);const approached=await read();
      if(source(approached).credited<=pending.credited||errors.length)throw Error('Public approach failed');
      receipt.loot.push({origin,early,settled,restored,approached,errors});
    } finally {await context.close();}
  }
}
if(process.env.MAZE_PUBLIC_ENEMY_FIXTURES) {
  const bytes=await readFile(process.env.MAZE_PUBLIC_ENEMY_FIXTURES),data=JSON.parse(bytes),fixture=data.fixtures.find(f=>f.id==='enemy-first');
  if(!fixture)throw Error('Expected engine-derived enemy fixture');
  receipt.enemyFixtureSha256=sha(bytes);receipt.enemy=[];
  for(const origin of ['https://mazesopuzzle.com','https://maze-so-puzzle.vercel.app']) {
    const context=await browser.newContext({viewport:{width:844,height:390},deviceScaleFactor:3});
    try {
      const page=await context.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));
      await page.addInitScript(({data,fixture})=>{if(!sessionStorage.getItem('enemy-public')) {
        localStorage.setItem(data.keys.run,JSON.stringify(fixture.snapshot));localStorage.setItem(data.keys.progress,JSON.stringify(data.progress));
        localStorage.setItem(data.keys.preferences,JSON.stringify({...data.preferences,muted:true}));sessionStorage.setItem('enemy-public','1');
      }},{data,fixture});
      const enter=async()=>{await page.goto(origin);await page.getByRole('button',{name:'Play',exact:true}).click();await page.getByRole('button',{name:/^Continue/}).click();await page.bringToFront();};
      const read=()=>page.evaluate(key=>JSON.parse(localStorage.getItem(key)),process.env.MAZE_PUBLIC_ENEMY_RUN_KEY||'maze-so-puzzle-active-run-v5');
      const press=()=>page.keyboard.press(`Arrow${fixture.direction[0].toUpperCase()+fixture.direction.slice(1)}`);
      await enter();await press();await page.waitForTimeout(100);const during=await read();
      if(during.game.power!==fixture.powerAfter||during.game.loot.sources.length!==2||during.game.loot.sources.some(s=>s.credited!==0))throw Error('Public defeat transaction failed');
      await page.locator('.battle-presentation').waitFor({state:'hidden'});await page.waitForTimeout(180);
      await page.screenshot({path:resolve(output,`enemy-${receipt.enemy.length}.png`)});
      await page.waitForTimeout(1700);const settled=await read();await enter();await page.waitForTimeout(1000);const restored=await read();
      if(JSON.stringify(restored.game)!==JSON.stringify(settled.game))throw Error('Public enemy reload drift');
      await press();await page.waitForTimeout(1200);const approached=await read();
      for(const expected of fixture.rewards){const source=approached.game.loot.sources.find(s=>s.objectId===fixture.objectId&&s.currency===expected.currency);
        if(!source||source.amount!==expected.amount||source.credited+source.drops.reduce((n,d)=>n+d.amount,0)!==expected.amount)throw Error('Public enemy conservation failed');}
      if(approached.game.power!==fixture.powerAfter||errors.length)throw Error('Public enemy approach failed');
      receipt.enemy.push({origin,during,settled,restored,approached,errors});
    } finally {await context.close();}
  }
}
} finally { await browser.close(); await writeFile(resolve(output, 'receipt.json'), JSON.stringify(receipt, null, 2) + '\n'); }
console.log(JSON.stringify(receipt));
