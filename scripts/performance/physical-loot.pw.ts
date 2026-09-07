import { test, expect } from '@playwright/test';
import { mkdir, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { findInputFixture, savedFixture } from './v22-input-fixtures';
import { ACTIVE_RUN_STORAGE_KEY, VERSION_THREE_ACTIVE_RUN_STORAGE_KEY } from '../../src/session';
import { PLAYER_PROGRESS_STORAGE_KEY, createDefaultPlayerProgress } from '../../src/progress';
import { PRESENTATION_PREFERENCES_KEY, DEFAULT_PRESENTATION_PREFERENCES } from '../../src/motion';
import { gameplayFingerprintForRules } from '../../src/game/contentIdentity';
import { legacyCreditedLoot } from '../../src/game/loot';
import { CURATED_LEVELS } from '../../src/game/levels';
import { solveLevel } from '../../src/game/solver';

const output=resolve(process.env.MAZE_PERF_EVIDENCE_DIR!,'physical-loot');
const fixtures=['gold','science'].map(currency=>findInputFixture(events=>events.some(e=>e.type==='treasure-opened'&&e.currency===currency))!);
test.beforeAll(async()=>{
  await mkdir(output,{recursive:true});expect(fixtures.every(Boolean)).toBe(true);
  const f=fixtures[0]!, current=savedFixture(f,'paired-physical-gold'), ledger=legacyCreditedLoot(f.level,current.game);
  const {loot:_,...prior}=current.game;
  const snapshot={...current,schemaVersion:3,gameplayFingerprint:gameplayFingerprintForRules(f.level,3),game:{...prior,
    goldStarsCollected:ledger.sources.filter(s=>s.currency==='gold').reduce((n,s)=>n+s.credited,0),
    sciencePointsCollected:ledger.sources.filter(s=>s.currency==='science').reduce((n,s)=>n+s.credited,0)}};
  const opened=f.result.events.find(e=>e.type==='treasure-opened')!;
  const far=f.result.state.loot.sources.find(s=>s.sourceId===opened.objectId)!.drops.find(d=>Math.hypot(d.at.x-f.result.state.position.x,d.at.y-f.result.state.position.y)>1.75)!;
  const from=f.result.state.position, approach=far.at.x>from.x?'right':far.at.x<from.x?'left':far.at.y>from.y?'down':'up';
  await writeFile(resolve(output,'paired-fixtures.json'),JSON.stringify({keys:{run:VERSION_THREE_ACTIVE_RUN_STORAGE_KEY,progress:PLAYER_PROGRESS_STORAGE_KEY,preferences:PRESENTATION_PREFERENCES_KEY},
    preferences:DEFAULT_PRESENTATION_PREFERENCES,progress:createDefaultPlayerProgress(16),fixtures:[{id:'physical-gold',snapshot,direction:f.direction,approach,sourceId:opened.objectId,amount:opened.amount}]},null,2));
});
for(const [quality,motion,width,height,noCanvas] of [
  ['full','full',780,312,false],['full','full',1194,834,false],['lite','full',780,312,false],
  ['static','full',780,312,false],['full','reduced',780,312,false],['full','full',780,312,true],
] as const) test(`LOOT03 physical collection ${quality}/${motion}/${width}/canvas${!noCanvas}`,async({browser})=>{
  const rows=[];
  for(const f of fixtures) {
    const event=f.result.events.find(e=>e.type==='treasure-opened')!;
    const ctx=await browser.newContext({viewport:{width,height},deviceScaleFactor:2});
    try {
      const page=await ctx.newPage(),errors:string[]=[];page.on('pageerror',e=>errors.push(e.message));
      const snapshot=savedFixture(f,`loot-${event.currency}`);
      await page.addInitScript(({snapshot,quality,motion,noCanvas,keys,progress,preferences})=>{
        if(!sessionStorage.getItem('fixture')) {
          localStorage.setItem(keys.run,JSON.stringify(snapshot));localStorage.setItem(keys.progress,JSON.stringify(progress));
          localStorage.setItem(keys.preferences,JSON.stringify({...preferences,quality,motion,muted:true}));sessionStorage.setItem('fixture','1');
        }
        if(noCanvas) {
          const original=HTMLCanvasElement.prototype.getContext;
          HTMLCanvasElement.prototype.getContext=function(...args:any[]){return this.classList.contains('vfx-rewards')?null:original.apply(this,args as any);} as any;
        }
      },{snapshot,quality,motion,noCanvas,keys:{run:ACTIVE_RUN_STORAGE_KEY,progress:PLAYER_PROGRESS_STORAGE_KEY,preferences:PRESENTATION_PREFERENCES_KEY},progress:createDefaultPlayerProgress(16),preferences:DEFAULT_PRESENTATION_PREFERENCES});
      const enter=async()=>{await page.goto('/');await page.getByRole('button',{name:'Play',exact:true}).click();await page.getByRole('button',{name:/^Continue/}).click();await page.bringToFront();await page.evaluate(()=>document.fonts.ready);};
      const read=()=>page.evaluate(key=>JSON.parse(localStorage.getItem(key)!).game,ACTIVE_RUN_STORAGE_KEY);
      await enter();
      await page.keyboard.press(`Arrow${f.direction[0]!.toUpperCase()}${f.direction.slice(1)}`);
      await page.waitForTimeout(150);
      const early=await read();expect(early.goldStarsCollected).toBe(f.before.goldStarsCollected);expect(early.sciencePointsCollected).toBe(f.before.sciencePointsCollected);
      expect(early.loot.sources.find((s:any)=>s.sourceId===event.objectId).drops.length).toBeGreaterThan(0);
      await page.screenshot({path:resolve(output,`${event.currency}-${quality}-${motion}-${width}-${noCanvas}-burst.png`)});
      await page.waitForTimeout(1600);
      const settled=await read(), source=settled.loot.sources.find((s:any)=>s.sourceId===event.objectId);
      expect(source.credited).toBeGreaterThan(0); expect(source.drops.length).toBeGreaterThan(0);
      expect(source.credited+source.drops.reduce((n:number,d:any)=>n+d.amount,0)).toBe(event.amount);
      expect(source.drops.every((d:any)=>d.phase==='grounded')).toBe(true);
      const canvas=await page.locator('canvas.vfx-rewards').evaluate((c:HTMLCanvasElement)=>({width:c.width,height:c.height,...c.dataset}));
      if(!noCanvas){expect(Number(canvas.tokens)).toBeLessThanOrEqual(quality==='lite'?12:24);expect(canvas.running).toBe('false');}
      else expect(await page.locator('[data-loot-fallback]').count()).toBeGreaterThan(0);
      await page.screenshot({path:resolve(output,`${event.currency}-${quality}-${motion}-${width}-${noCanvas}-settled.png`)});
      await page.waitForTimeout(350);expect(await read()).toEqual(settled);
      await enter();await page.waitForTimeout(1000);expect(await read()).toEqual(settled);
      // A real adjacent movement toward the distant, straight two-tile bundle
      // brings it into range; no debug teleport or artificial reward mutation.
      const far=source.drops.find((d:any)=>Math.hypot(d.at.x-settled.position.x,d.at.y-settled.position.y)>1.75)!;
      expect(far).toBeTruthy();
      const dx=far.at.x-settled.position.x,dy=far.at.y-settled.position.y;
      await page.keyboard.press(Math.abs(dx)>Math.abs(dy)?dx>0?'ArrowRight':'ArrowLeft':dy>0?'ArrowDown':'ArrowUp');
      await page.waitForTimeout(1200);const approached=await read();
      expect(approached.loot.sources.find((s:any)=>s.sourceId===event.objectId).credited).toBeGreaterThan(source.credited);
      expect(errors).toEqual([]);rows.push({currency:event.currency,early,settled,approached,canvas,errors});
    } finally { await ctx.close(); }
  }
  await writeFile(resolve(output,`${quality}-${motion}-${width}-${noCanvas}.json`),JSON.stringify(rows,null,2));
});

test('LOOT03 production migrates a genuine rules3 save without replaying credited loot',async({page})=>{
  const f=fixtures[0]!, game={...f.result.state,loot:legacyCreditedLoot(f.level,f.result.state)};
  game.goldStarsCollected=game.loot.sources.filter(s=>s.currency==='gold').reduce((n,s)=>n+s.amount,0);
  game.sciencePointsCollected=game.loot.sources.filter(s=>s.currency==='science').reduce((n,s)=>n+s.amount,0);
  const current=savedFixture({...f,before:game},'legacy-physical'),{loot:_,...oldGame}=game;
  const old={...current,schemaVersion:3,gameplayFingerprint:gameplayFingerprintForRules(f.level,3),game:oldGame};
  await page.addInitScript(({old,oldKey,progressKey,progress})=>{
    localStorage.setItem(oldKey,JSON.stringify(old));localStorage.setItem(progressKey,JSON.stringify(progress));
  },{old,oldKey:VERSION_THREE_ACTIVE_RUN_STORAGE_KEY,progressKey:PLAYER_PROGRESS_STORAGE_KEY,progress:createDefaultPlayerProgress(16)});
  await page.goto('/');await page.getByRole('button',{name:'Play',exact:true}).click();await page.getByRole('button',{name:/^Continue/}).click();await page.waitForTimeout(1200);
  const result=await page.evaluate(({key,oldKey})=>({old:localStorage.getItem(oldKey),current:JSON.parse(localStorage.getItem(key)!)}),{key:ACTIVE_RUN_STORAGE_KEY,oldKey:VERSION_THREE_ACTIVE_RUN_STORAGE_KEY});
  expect(result.old).toBeNull();expect(result.current.runId).toBe(current.runId);expect(result.current.game).toEqual(game);
  await writeFile(resolve(output,'migration.json'),JSON.stringify({old,result},null,2));
});

for(const lite of [false,true]) test(`LOOT03 synthetic64 capacity has no invisible claims and rejects retired-run callbacks Lite${lite}`,async({page})=>{
  await page.goto('http://127.0.0.1:1421/');await page.bringToFront();
  const result=await page.evaluate(async(lite)=>{
    const {mountPhysicalLootHarness}=await import('/scripts/art_review/physical-loot-harness.tsx');
    const root=document.getElementById('root')!;root.style.display='none';
    const host=document.createElement('div');document.body.append(host);
    const h=mountPhysicalLootHarness(host,lite);await new Promise(r=>setTimeout(r,810));
    const accepting=h.read(),c=host.querySelector('canvas')!;
    const cap=Number(c.dataset.peak);h.interrupt();await new Promise(r=>setTimeout(r,50));const interrupted=h.read();
    h.replace();await new Promise(r=>setTimeout(r,1600));const replaced=h.read();
    h.unmount();host.remove();root.style.display='';return{accepting,interrupted,replaced,cap};
  },lite);
  expect(result.accepting.samples.some((s:any)=>s.claiming.length>0)).toBe(true);
  expect(result.accepting.samples.every((s:any)=>s.claiming.every((id:string)=>s.represented.includes(id)))).toBe(true);
  expect(result.cap).toBeLessThanOrEqual(lite?12:24);
  expect(result.interrupted.game.loot.sources.flatMap((s:any)=>s.drops).some((d:any)=>d.phase==='claiming')).toBe(false);
  expect(result.interrupted.game.goldStarsCollected+result.interrupted.game.sciencePointsCollected).toBeGreaterThan(0);
  expect(result.replaced.game.goldStarsCollected+result.replaced.game.sciencePointsCollected).toBe(0);
  await writeFile(resolve(output,`capacity-${lite}.json`),JSON.stringify(result,null,2));
});

test('LOOT03 accepted-claim crash fixture settles before Stay/Next and repeated receipt does not double bank',async({page})=>{
  // Real solver-completed campaign state plus one explicitly synthetic accepted
  // claim, modelling a crash at the transaction boundary, not a played approach.
  const candidate=CURATED_LEVELS.map(level=>({level,game:solveLevel(level,{requireAllAnimals:true}).finalState!}))
    .find(({game})=>game?.loot.sources.some(s=>s.drops.length>1))!;
  expect(candidate).toBeTruthy();const {level}=candidate;
  const source=candidate.game.loot.sources.find(s=>s.drops.length>1)!, drop=source.drops[0]!;
  const game={...candidate.game,loot:{version:1 as const,sources:candidate.game.loot.sources.map(s=>s.sourceId===source.sourceId
    ? {...s,drops:s.drops.map(d=>d.id===drop.id?{...d,phase:'claiming' as const}:d)}:s)}};
  const snapshot=savedFixture({level,before:game,revealed:new Set()},'claiming-crash');
  await page.addInitScript(({snapshot,keys,progress})=>{if(!sessionStorage.getItem('crash-fixture')){
    localStorage.setItem(keys.run,JSON.stringify(snapshot));localStorage.setItem(keys.progress,JSON.stringify(progress));sessionStorage.setItem('crash-fixture','1');
  }},{snapshot,keys:{run:ACTIVE_RUN_STORAGE_KEY,progress:PLAYER_PROGRESS_STORAGE_KEY},progress:createDefaultPlayerProgress(16)});
  const enter=async()=>{await page.goto('/');await page.getByRole('button',{name:'Play',exact:true}).click();await page.getByRole('button',{name:/^Continue/}).click();await expect(page.locator('.dialog-celebration')).toBeVisible();};
  const read=()=>page.evaluate(({run,progress})=>({run:JSON.parse(localStorage.getItem(run)!),progress:JSON.parse(localStorage.getItem(progress)!)}),{run:ACTIVE_RUN_STORAGE_KEY,progress:PLAYER_PROGRESS_STORAGE_KEY});
  await enter();const recovered=await read();
  expect(recovered.run.game.loot.sources.find((s:any)=>s.sourceId===source.sourceId).credited).toBe(drop.amount);
  await expect(page.locator('.dialog-celebration')).toContainText('optional reward points are still on the floor');
  await enter();expect(await read()).toEqual(recovered);
  await page.getByRole('button',{name:/^(Next maze|Surprise maze)/}).click();
  await expect.poll(async()=> (await read()).progress.totalCompletions).toBe(1);
  const banked=(await read()).progress;
  // Restore the exact already-banked won journal to model a failed clear/crash.
  await page.evaluate(({key,run})=>localStorage.setItem(key,JSON.stringify(run)),{key:ACTIVE_RUN_STORAGE_KEY,run:recovered.run});
  await enter();await page.getByRole('button',{name:/^(Next maze|Surprise maze)/}).click();
  expect((await read()).progress).toEqual(banked);
  await writeFile(resolve(output,'completion-crash-retry.json'),JSON.stringify({snapshot,recovered,banked,after:await read()},null,2));
});
