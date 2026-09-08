// Release comparison against a frozen entry; records served hashes and optional gzip traces.
// Run alone after the source-matched build, with no dev edits or other browser jobs.
import { gzipSync } from "node:zlib";
import { createServer } from 'node:http';
import { readFile, mkdir, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { resolve, extname } from 'node:path';
import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { pathToFileURL } from 'node:url';
import { platform, release, cpus, totalmem } from 'node:os';
import { readBuildProvenance } from './build-provenance.mjs';
import { installColdOpeningProbe, installMountSample } from './cold-opening-probe.mjs';

const root = resolve(import.meta.dirname, '../..');
const output = resolve(root, process.env.MAZE_REVIEW_OUTPUT || '../maze-game-qa/performance/phone02-book-paired-20260906');
const jumpReview = process.env.MAZE_REVIEW_ROUTE === 'jump';
const idleReview = process.env.MAZE_REVIEW_ROUTE === 'idle';
const victoryReview = process.env.MAZE_REVIEW_ROUTE === 'victory';
const keepsakeReview = process.env.MAZE_REVIEW_ROUTE === 'keepsake';
const guidanceReview = process.env.MAZE_REVIEW_ROUTE === 'guidance';
const lootReview = process.env.MAZE_REVIEW_ROUTE === 'loot';
const enemyReview = process.env.MAZE_REVIEW_ROUTE === 'enemy';
const chestReview = process.env.MAZE_REVIEW_ROUTE === 'chest';
const potionReview = process.env.MAZE_REVIEW_ROUTE === 'potion';
const entrySettleMs = Number(process.env.MAZE_REVIEW_ENTRY_SETTLE_MS ?? 500);
if (![0,500].includes(entrySettleMs)) throw Error('Use immediate or loaded entry');
const pairCount = Number(process.env.MAZE_REVIEW_PAIRS ?? 5);
const coldProbe = process.env.MAZE_REVIEW_COLD_PROBE === '1';
const mountSample = process.env.MAZE_REVIEW_MOUNT === '1';
if(coldProbe && pairCount!==1) throw Error('Cold wrappers are diagnostic only; use one pilot pair');
const cpuRate = Number(process.env.MAZE_REVIEW_CPU_RATE ?? 1);
const captureTrace = process.env.MAZE_REVIEW_TRACE !== '0';
const captureLayers = process.env.MAZE_REVIEW_LAYERS === '1';
const captureScreenshots = process.env.MAZE_REVIEW_SCREENSHOTS !== '0';
const cycles = Number(process.env.MAZE_REVIEW_CYCLES ?? 1);
if (!Number.isInteger(cycles) || cycles < 1 || cycles > 16) throw Error('Use 1-16 reversible route cycles');
if (!Number.isFinite(cpuRate) || cpuRate < 1 || cpuRate > 8) throw Error('Unsupported CPU throttle');
const profiles = process.env.MAZE_REVIEW_PROFILES ? JSON.parse(process.env.MAZE_REVIEW_PROFILES)
  : [{width:780,height:312,dpr:2},{width:1193,height:833,dpr:2}];
if (![1,5].includes(pairCount)) throw Error('Use one pilot pair or five qualification pairs');
const baseline = resolve(root, process.env.MAZE_REVIEW_BASELINE || 'output/playwright/migration-preflight-20260906/live-baseline');
const fixturesPath = resolve(root, process.env.MAZE_REVIEW_FIXTURES || 'output/playwright/walls04-rack-new-host/fixtures.json');
const playwrightPath = process.env.MAZE_PLAYWRIGHT_PATH;
if (!playwrightPath) throw Error('Set MAZE_PLAYWRIGHT_PATH to the installed Playwright index.mjs');
const { chromium } = await import(pathToFileURL(playwrightPath).href);
await mkdir(output, { recursive: true });
const data = JSON.parse(await readFile(fixturesPath, 'utf8'));
const fixture = jumpReview ? data.fixtures.find(f => f.level.id === 'wishing-woods' && f.step.direction === 'right' && f.step.result.events.every(e=>['hole-jumped','moved'].includes(e.type))) : data.fixtures.find(f => f.id === (process.env.MAZE_REVIEW_FIXTURE_ID || 'twilight-treasure-loop'));
const reverse = { right: 'left', left: 'right', up: 'down', down: 'up' };
if (!fixture || (!jumpReview && !victoryReview && !keepsakeReview && !guidanceReview && (!reverse[fixture.direction] || (!chestReview && !enemyReview && !potionReview && fixture.count < 4)))) throw Error('Expected frozen engine-derived route');
if(chestReview&&!fixture.baselineSnapshot)throw Error('Chest comparison requires the actual historical object graph');
if (idleReview && !(fixture.visibleHazardCells > 0 || fixture.visiblePickupCount > 0)) throw Error('Idle comparison requires visible hazards or authored pickups');
const sha = bytes => createHash('sha256').update(bytes).digest('hex');
const index = await readFile(resolve(root, 'dist/index.html'), 'utf8');
const candidateBundle = index.match(/src="(\/assets\/[^"]+\.js)"/)[1];
const baselineIndex=await readFile(resolve(baseline,'index.html'),'utf8');
const baselineBundle=baselineIndex.match(/src="(\/assets\/[^"]+\.js)"/)[1];
const hashes = { baseline: sha(await readFile(resolve(baseline, baselineBundle.slice(1)))), candidate: sha(await readFile(resolve(root,'dist',candidateBundle.slice(1)))) };
const buildIdentity = await readBuildProvenance();
if (!buildIdentity.runtimeInputsMatch || !buildIdentity.distMatches) throw Error('Candidate build is not source matched');
const baselineIdentity=process.env.MAZE_REVIEW_BASELINE ? JSON.parse(await readFile(resolve(baseline,'identity.json'),'utf8')) : null;
if(baselineIdentity) for(const row of baselineIdentity.rows) {const b=await readFile(resolve(baseline,row.file));if(b.length!==row.bytes||sha(b)!==row.sha256)throw Error('Frozen entry drift');}
else if (hashes.baseline !== 'e4cb4b603e531a4a67da0bab5bae26599bf594237d9005fb699a8b5a043b135a') throw Error('Frozen baseline drift');
const baselineRef=baselineIdentity?.source ?? 'd9c76976c0e1926fd6020f3071f32a6a37e762a7';
const candidateOnlyMedia=data.candidateOnlyMedia ?? [];
for(const entry of candidateOnlyMedia) {
  if(!/^public\/assets\/[a-z0-9-]+\.png$/.test(entry.path))throw Error('Invalid candidate-only media path');
  try {execFileSync('git',['cat-file','-e',baselineRef+':'+entry.path],{cwd:root,stdio:'ignore'});throw Error('Candidate-only media existed in baseline');}
  catch(error){if(!error.status)throw error;}
  if(sha(await readFile(resolve(root,entry.path)))!==entry.sha256)throw Error('Candidate-only media drift');
}
const changedMedia=execFileSync('git',['diff','--name-status',baselineRef,'--','public'],{cwd:root,encoding:'utf8'}).trim();
for(const line of changedMedia?changedMedia.split(/\r?\n/):[]) {
  const [status,path]=line.split('\t');
  if(status!=='A'||!candidateOnlyMedia.some(e=>e.path===path))throw Error('Baseline fallback requires unchanged existing public media');
}
const served = { baseline: {}, candidate: {} }; let servingMode = 'baseline';
const hashCache = new Map();
const mime = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.webp': 'image/webp', '.png': 'image/png', '.woff2': 'font/woff2', '.mp3': 'audio/mpeg', '.svg': 'image/svg+xml' };
const server = createServer(async (req, res) => {
  try {
    const pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
    if(servingMode==='baseline'&&candidateOnlyMedia.some(e=>'/'+e.path.slice(7)===pathname)){res.writeHead(404);res.end();return;}
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
const channel=process.env.MAZE_REVIEW_CHANNEL;
if(channel && channel!=='msedge') throw Error('Unsupported channel');
const freshBrowser=process.env.MAZE_REVIEW_FRESH_BROWSER==='1';
if(freshBrowser && pairCount!==1) throw Error('Fresh-process comparison is diagnostic only');
let browser = await chromium.launch({ headless: true,channel });
const report = { date: new Date().toISOString(), head: execFileSync('git', ['rev-parse', 'HEAD'], { cwd: root, encoding: 'utf8' }).trim(), browser: browser.version(), hashes, served, fixture: fixture.id ?? fixture.level.id, route: jumpReview ? 'eight reversible one-hole jumps' : 'sixteen reversible ordinary steps', baselineIdentity,
  candidateOnlyMedia, scope: 'Headless local Chromium same-host paired frame/trace diagnostic; no physical iPad, native, GPU-time or Human beauty acceptance. Trace durations overlap and are not additive.', rows: [] };
report.pairCount=pairCount; report.pilot=pairCount!==5;
report.cpuRate=cpuRate;
report.cycles=cycles;
report.buildIdentity=buildIdentity;
report.host={platform:platform(),release:release(),cpu:cpus()[0]?.model,logicalCpus:cpus().length,totalMemoryBytes:totalmem(),node:process.version,
  lockSha256:sha(await readFile(resolve(root,'package-lock.json'))),powerAndThermal:'Not controlled; diagnostic host, no physical low-memory qualification'};
report.captureTrace=captureTrace;report.captureLayers=captureLayers;
report.captureScreenshots=captureScreenshots;
report.candidateStyle=process.env.MAZE_REVIEW_CANDIDATE_STYLE??null;
report.candidateFolded=process.env.MAZE_REVIEW_FOLDED==='1';
report.baselineFolded=process.env.MAZE_REVIEW_BASELINE_FOLDED==='1';
report.saveKeys={seed:data.keys.run,baseline:process.env.MAZE_REVIEW_BASELINE_RUN_KEY||data.keys.run,candidate:process.env.MAZE_REVIEW_CANDIDATE_RUN_KEY||data.keys.run};
report.coldOpeningProbe=coldProbe;
report.mountSample=mountSample;
report.entrySettleMs=entrySettleMs; report.freshBrowser=freshBrowser;
if(victoryReview) report.route='eleven seconds decoded won-modal celebration, both entries paused before mount and resumed together at measurement start; no completion commit, cold-start or gameplay timing claim';
if(keepsakeReview)report.route='Next commits the same earned rewards before measurement; then chapter dismissal, finite earned card and five seconds stationary. No cold-start claim.';
if(guidanceReview)report.route='Actual underpowered encounter, four seconds for bounded search, request tier-one Required Path,800ms reading then dismiss and500ms rest. Unchanged position and Power.';
if (idleReview) { report.route = 'eight seconds idle with live ambient surfaces'; report.visibleHazardCells = fixture.visibleHazardCells; }
if (lootReview) report.route='open authored Gold, pause1500ms, approach distant bundle, pause900ms, retrace two steps, idle1500ms; conserved Gold8, implementations identified by served entry hashes';
if (enemyReview) report.route='defeat first enemy, pause2700ms, enter cleared tile, pause1300ms, return, pause500ms; unchanged Power and candidate declared-currency conservation';
if (chestReview) report.route='same authored chest slot: baseline walk-over8Gold versus candidate stationary mixed opening; pause1400ms, candidate enters cleared tile, pause1300ms, both return, pause500ms. Two movements each; the new opening input/beat is an explicit feature cost.';
if (potionReview) report.route='collect real Power potion, pause1700ms, return, pause500ms; immediate-entry cosmetic-stall comparison with unchanged semantic Power';
const percentile = (a, q) => a[Math.min(a.length - 1, Math.floor(a.length * q))];
try {
  for (const cohort of profiles) {
    for (let pair = -1; pair < pairCount; pair++) {
      for (const mode of pair % 2 === 0 ? ['baseline', 'candidate'] : ['candidate', 'baseline']) {
        servingMode = mode;
        if(freshBrowser && report.rows.length) {await browser.close();browser=await chromium.launch({headless:true,channel});}
        const ctx = await browser.newContext({ viewport: { width: cohort.width, height: cohort.height }, deviceScaleFactor: cohort.dpr });
        try {
          const page = await ctx.newPage(); const errors = [];
          page.on('pageerror', e => errors.push(String(e)));
          const snapshot=mode==='baseline'&&fixture.baselineSnapshot?fixture.baselineSnapshot:fixture.snapshot;
          const seededData=mode==='baseline'&&data.baselineProgress?{...data,progress:data.baselineProgress}:data;
          await page.addInitScript(({ data, snapshot }) => {
            localStorage.setItem(data.keys.run, JSON.stringify(snapshot));
            localStorage.setItem(data.keys.progress, JSON.stringify(data.progress));
            localStorage.setItem(data.keys.preferences, JSON.stringify({ ...data.preferences, quality: 'full', motion: 'full', pace: 'regular' }));
          }, { data:seededData, snapshot });
          await page.goto(`${origin}/${mode}`);
          await page.getByRole('button', { name: 'Play', exact: true }).click();
          const client = await ctx.newCDPSession(page), events = [];
          if(coldProbe || mountSample) {
            await client.send('Emulation.setCPUThrottlingRate',{rate:cpuRate});
            if(coldProbe) await installColdOpeningProbe(page);
            if(mountSample) await installMountSample(page);
          }
          const victoryPause=victoryReview?await page.addStyleTag({content:'.dialog-celebration * { animation-play-state:paused !important; }'}):null;
          await page.getByRole('button', { name: /^Continue/ }).click();
          if(victoryReview)await page.locator('.dialog-celebration').waitFor();
          if(keepsakeReview){await page.locator('.dialog-celebration').waitFor();await page.getByRole('button',{name:/^Next maze/}).click();await page.locator('.dialog-story').waitFor();}
          const routeSnapshot=keepsakeReview?await page.evaluate(k=>JSON.parse(localStorage.getItem(k)),data.keys.run):fixture.snapshot;
          await page.locator('.maze-terrain-svg').waitFor();
          if(mode==='candidate' ? report.candidateFolded : report.baselineFolded) await page.getByRole('button',{name:'Fold sidebar'}).click();
          if(mode==='candidate' && report.candidateStyle) await page.addStyleTag({content:report.candidateStyle});
          const bundle = await page.locator('script[type="module"]').getAttribute('src');
          if (bundle !== (mode === 'baseline' ? baselineBundle : candidateBundle)) throw Error('Wrong entry module');
          await page.evaluate(async () => { await document.fonts.ready; await Promise.all([...document.images].map(i => i.decode().catch(() => {}))); });
          if(entrySettleMs) await page.waitForTimeout(entrySettleMs);
          if(mountSample) {
            await page.waitForFunction(()=>window.__mazeMountSample?.done);
            if(!await page.evaluate(()=>{
              const m=window.__mazeMountSample;
              return m.frames.length>=4 && typeof m.terrainAt==='number' && Number.isFinite(m.terrainAt);
            })) throw Error('Incomplete cold mount observation');
          }
          await client.send('Emulation.setCPUThrottlingRate',{rate:cpuRate});
          let layers=[];
          client.on('LayerTree.layerTreeDidChange',e=>{layers=e.layers??[];});
          if(captureLayers) await client.send('LayerTree.enable');
          client.on('Tracing.dataCollected', ({ value }) => events.push(...value));
          if(captureTrace) await client.send('Tracing.start', { categories: 'devtools.timeline,disabled-by-default-devtools.timeline', transferMode: 'ReportEvents' });
          await page.evaluate(() => {
            window.wallAb = { frames: [], positions: [], windows: [], done: false, mutations: 0, rebases: 0, keepsakePeak:0 };
            window.wallAbObserver = new MutationObserver(records => {
              for(const m of records) {
                if(m.type==='attributes' && m.target.matches('.maze-terrain-svg') && m.attributeName==='viewBox') window.wallAb.rebases++;
                else if(!(m.type==='attributes' && m.target.matches('mask[maskUnits="userSpaceOnUse"]') && ['x','y','width','height'].includes(m.attributeName))) window.wallAb.mutations++;
              }
            });
            window.wallAbObserver.observe(document.querySelector('.maze-terrain-svg'), { attributes: true, childList: true, subtree: true });
            const tick = t => {
              window.wallAb.frames.push(t);
              window.wallAb.keepsakePeak=Math.max(window.wallAb.keepsakePeak,document.querySelectorAll('.earned-keepsake').length);
              const world=document.querySelector('.camera-world');
              const box=document.querySelector('.maze-terrain-svg').viewBox.baseVal;
              const parts=world.style.translate.split(' ').map(parseFloat);
              window.wallAb.positions.push(`${box.x-(parts[0]||0)*box.width/100},${box.y-(parts[1]||0)*box.height/100}`);
              window.wallAb.windows.push([box.x,box.y,box.width,box.height]);
              if (!window.wallAb.done) requestAnimationFrame(tick);
            }; requestAnimationFrame(tick);
          });
          const resources = () => page.evaluate(() => {
            const c=document.querySelector('canvas.vfx-rewards');
            const board=document.querySelector('.maze-board').getBoundingClientRect();
            const pickups=[...document.querySelectorAll('.object-kind-sword,.object-kind-potion,.object-kind-boots,.object-kind-spring-boots,.object-kind-antidote-leaf,.object-kind-key,.object-kind-treasure')].filter(el=>{const r=el.getBoundingClientRect();return r.right>board.left&&r.left<board.right&&r.bottom>board.top&&r.top<board.bottom;});
            return { nodes:document.querySelectorAll('*').length, heapBytes:performance.memory?.usedJSHeapSize??null,
              visiblePickups:pickups.length,pickupAnimations:pickups.flatMap(el=>el.getAnimations({subtree:true})).length,
              images:document.images.length,reward:c?{width:c.width,height:c.height,running:c.dataset.running,tokens:c.dataset.tokens,arrivals:c.dataset.arrivals,peak:c.dataset.peak}:null };
          });
          const resourcesBefore=await resources();
          const victoryProgressBefore=(victoryReview||keepsakeReview)?await page.evaluate(key=>localStorage.getItem(key),data.keys.progress):null;
          // Four reversible four-step legs per cycle; preserve engine-derived direction.
          let keepsakeResources=null,guidance=null;
          if(guidanceReview){
            await page.evaluate(()=>{
              window.learnProbe={input:0,commit:0,frame:0};
              addEventListener('keydown',()=>window.learnProbe.input=performance.now(),{once:true,capture:true});
              const observer=new MutationObserver(()=>{if(document.querySelector('.too-strong-equation')){window.learnProbe.commit=performance.now();observer.disconnect();requestAnimationFrame(()=>requestAnimationFrame(()=>window.learnProbe.frame=performance.now()));}});
              observer.observe(document.body,{childList:true,subtree:true});
            });
            await page.keyboard.press(`Arrow${fixture.direction[0].toUpperCase()+fixture.direction.slice(1)}`);await page.waitForTimeout(4000);
            guidance=await page.evaluate(()=>({...window.learnProbe,search:document.querySelector('.power-opportunities')?.dataset.searchState,exhausted:document.querySelector('.power-opportunities')?.dataset.searchExhausted,ids:[...document.querySelectorAll('[data-opportunity-id]')].map(e=>e.dataset.opportunityId)}));
            guidance.resources=await resources();
            if(guidance.search!=='complete'||!guidance.input||guidance.frame<=guidance.input)throw Error('Guidance route incomplete');
            await page.getByRole('button',{name:'Show Required Path',exact:true}).click();await page.waitForTimeout(800);
            if(!await page.locator('.hint-card').count())throw Error('Hint did not open');
            await page.keyboard.press('Escape');await page.waitForTimeout(500);
          }
          else if(keepsakeReview){await page.getByRole('button',{name:'Start the maze',exact:true}).click();await page.waitForTimeout(1100);keepsakeResources=await resources();await page.waitForTimeout(4000);}
          else if(victoryReview) {await victoryPause.evaluate(e=>e.remove());await page.waitForTimeout(11000);}
          else if(potionReview) {
            const press=direction=>page.keyboard.press(`Arrow${direction[0].toUpperCase()+direction.slice(1)}`);
            await press(fixture.direction);await page.waitForTimeout(1700);
            await press(reverse[fixture.direction]);await page.waitForTimeout(500);
          }
          else if(chestReview) {
            const press=direction=>page.keyboard.press(`Arrow${direction[0].toUpperCase()+direction.slice(1)}`);
            await press(fixture.direction);await page.waitForTimeout(1400);
            if(mode==='candidate')await press(fixture.direction);
            await page.waitForTimeout(1300);await press(reverse[fixture.direction]);await page.waitForTimeout(500);
          }
          else if(enemyReview) {
            const press=direction=>page.keyboard.press(`Arrow${direction[0].toUpperCase()+direction.slice(1)}`);
            await press(fixture.direction);await page.waitForTimeout(2700);
            await press(fixture.direction);await page.waitForTimeout(1300);
            await press(reverse[fixture.direction]);await page.waitForTimeout(500);
          }
          else if(lootReview) {
            const press=direction=>page.keyboard.press(`Arrow${direction[0].toUpperCase()+direction.slice(1)}`);
            await press(fixture.direction);await page.waitForTimeout(1500);
            await press(fixture.approach);await page.waitForTimeout(900);
            await press(reverse[fixture.approach]);await page.waitForTimeout(300);
            await press(reverse[fixture.direction]);await page.waitForTimeout(1500);
          }
          else if(idleReview) await page.waitForTimeout(8000);
          else if(jumpReview) for(let step=0;step<8;step++){await page.keyboard.press(step%2?'ArrowLeft':'ArrowRight');await page.waitForTimeout(600);}
          else for (let cycle=0;cycle<cycles;cycle++) for (const direction of [fixture.direction, reverse[fixture.direction], fixture.direction, reverse[fixture.direction]]) {
            for (let step = 0; step < 4; step++) { await page.keyboard.press(`Arrow${direction[0].toUpperCase()+direction.slice(1)}`); await page.waitForTimeout(240); }
          }
          const sample = await page.evaluate(({key,progressKey}) => {
            window.wallAb.done = true; window.wallAbObserver.disconnect();
            return { ...window.wallAb, mount:window.__mazeMountSample, coldProbe:window.__mazeColdProbe, save: JSON.parse(localStorage.getItem(key)), victory:document.querySelector('.dialog-celebration')?{running:document.querySelector('.rescued-result-row').getAnimations({subtree:true}).filter(a=>a.playState==='running').length,progress:localStorage.getItem(progressKey)}:null, brokenImages: [...document.images].filter(i => !i.complete || !i.naturalWidth).length };
          }, {key:report.saveKeys[mode],progressKey:data.keys.progress});
          if(captureTrace) { const complete = new Promise(resolve => client.once('Tracing.tracingComplete', resolve));
            await client.send('Tracing.end'); await complete; }
          const deltas = sample.frames.slice(1).map((t, i) => t - sample.frames[i]), sorted = [...deltas].sort((a, b) => a - b);
          const trace = Object.fromEntries(['Paint', 'RasterTask', 'CompositeLayers', 'Layout', 'UpdateLayoutTree'].map(name => {
            const entries = events.filter(e => e.name === name && e.ph === 'X');
            return [name, { count: entries.length, totalMs: entries.length ? entries.reduce((n, e) => n + (e.dur || 0), 0) / 1000 : null }];
          }));
          const row = { mode, pair, warmup: pair < 0, viewport: [cohort.width, cohort.height], bundle, stepsBefore: routeSnapshot.game.steps, stepsAfter: sample.save?.game?.steps,
            keepsakePeak:sample.keepsakePeak,keepsakeResources,guidance,
            resourcesBefore,resourcesAfter:await resources(),victoryProgressBefore,victory:sample.victory,loot:sample.save?.game?.loot??null,
            gold:sample.save?.game?.goldStarsCollected,science:sample.save?.game?.sciencePointsCollected,coldProbe:sample.coldProbe,mount:sample.mount,
            dpr:cohort.dpr,cpuRate,rebases:sample.rebases,windows:sample.windows,
            rebaseAdjacentDeltas:deltas.filter((_,i)=>[i,i+1].some(j=>j>0&&sample.windows[j]?.join()!==sample.windows[j-1]?.join())),
            layers:layers.map(({width,height,drawsContent,backendNodeId,paintCount})=>({width,height,drawsContent,backendNodeId,paintCount})),
            positionBefore: routeSnapshot.game.position, positionAfter: sample.save?.game?.position, transforms: new Set(sample.positions).size, mutations: sample.mutations,
            p50: percentile(sorted, .5), p90: percentile(sorted, .9), p95: percentile(sorted, .95), max: sorted.at(-1), over20: deltas.filter(n => n > 20).length, over34: deltas.filter(n => n > 34).length, deltas, positions: sample.positions, trace, errors, brokenImages: sample.brokenImages };
          report.rows.push(row);
          await writeFile(resolve(output, 'report.json'), JSON.stringify(report, null, 2));
          if (pair === 0 && captureScreenshots) await page.screenshot({ path: resolve(output, `${cohort.width}-${mode}.png`) });
          if(captureTrace) await writeFile(resolve(output, `${cohort.width}-${pair}-${mode}-trace.json.gz`), gzipSync(JSON.stringify({ traceEvents: events }), { level: 6 }));
          console.log(JSON.stringify({ ...row, deltas: undefined, positions: undefined,windows:undefined,layers:undefined,coldProbe:undefined,mount:undefined }));
          if (errors.length || sample.brokenImages || row.stepsAfter - row.stepsBefore !== (chestReview||enemyReview||potionReview?2:lootReview?4:(idleReview||victoryReview||keepsakeReview||guidanceReview)?0:jumpReview?8:16*cycles) || JSON.stringify(row.positionBefore) !== JSON.stringify(row.positionAfter) || ((idleReview||victoryReview||keepsakeReview||guidanceReview) ? row.transforms !== 1 : row.transforms < (chestReview||potionReview?1:jumpReview&&mode==='baseline'?2:8)) || row.mutations) throw Error('Contaminated or unmatched route; retained report');
          if(guidanceReview&&sample.save.game.power!==snapshot.game.power)throw Error('Guidance changed Power');
          if(victoryReview){
            if(!sample.victory || (mode==='candidate'&&sample.victory.running!==0))throw Error('Victory did not settle');
            if(sample.victory.progress!==victoryProgressBefore)throw Error('Victory changed unbanked profile');
          }
          if(keepsakeReview){
            if(row.keepsakePeak!==(mode==='candidate'?1:0)||await page.locator('.earned-keepsake').count())throw Error('Earned card missing, multiplied or not expired');
            const rewardFields=value=>{const {discoveredFriendIds,discoveredEnemyIds,...rewards}=JSON.parse(value);return rewards;};
            // Start legitimately reveals visible species through the separate
            // discovery owner. Every completion/reward field must stay fixed.
            if(JSON.stringify(rewardFields(await page.evaluate(key=>localStorage.getItem(key),data.keys.progress)))!==JSON.stringify(rewardFields(victoryProgressBefore)))throw Error('Decoration changed committed rewards');
          }
          if(chestReview){
            const sources=row.loot.sources.filter(s=>s.objectId===fixture.objectId);
            if(sources.length!==(mode==='baseline'?1:2))throw Error('Chest comparison missed reward');
            for(const s of sources)if(s.credited+s.drops.reduce((n,d)=>n+d.amount,0)!==s.amount)throw Error('Chest reward conservation failed');
            if(sample.save.game.power!==snapshot.game.power)throw Error('Benign chest changed Power');
            if(mode==='candidate'){
              if(sample.save.game.chests.find(c=>c.objectId===fixture.objectId)?.phase!=='good-open')throw Error('Chest did not open');
              for(const expected of fixture.rewards)if(sources.find(s=>s.currency===expected.currency)?.amount!==expected.amount)throw Error('Chest reward drift');
            }else if(sources[0].amount!==8)throw Error('Baseline chest identity changed');
          }
          if(potionReview && sample.save?.game?.power!==fixture.powerAfter) throw Error('Potion semantic credit changed');
          if(lootReview) {
            const source=row.loot?.sources.find(s=>s.sourceId===fixture.sourceId);
            if(mode==='candidate' && (!source || source.credited<=0 || source.credited+source.drops.reduce((n,d)=>n+d.amount,0)!==fixture.amount)) throw Error('Physical reward not conserved');
          }
          if(enemyReview) {
            if(sample.save?.game?.power!==fixture.powerAfter || !sample.save?.game?.defeatedEnemyIds.includes(fixture.objectId)) throw Error('Enemy comparison missed real defeat');
            if(mode==='candidate') for(const expected of fixture.rewards) {
              const source=row.loot?.sources.find(s=>s.objectId===fixture.objectId&&s.currency===expected.currency);
              if(!source || source.amount!==expected.amount || source.credited+source.drops.reduce((n,d)=>n+d.amount,0)!==expected.amount) throw Error('Enemy reward not conserved');
            }
          }
        } finally { await ctx.close(); }
      }
    }
  }
  const finalIdentity=await readBuildProvenance();
  if(!finalIdentity.runtimeInputsMatch||!finalIdentity.distMatches||finalIdentity.marker.runtimeInputsSha256!==buildIdentity.marker.runtimeInputsSha256) throw Error('Candidate changed during measurement');
} finally { await browser.close(); await new Promise(resolve => server.close(resolve)); }
