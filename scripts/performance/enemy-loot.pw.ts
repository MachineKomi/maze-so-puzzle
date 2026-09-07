import { test, expect } from '@playwright/test';
import { mkdir, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { findInputFixture, savedFixture, authoredLootFixture, routeCheckpoints } from './v22-input-fixtures';
import { createInitialGameState, movePlayer } from '../../src/game/engine';
import { LEGACY_CURATED_LEVELS } from '../../src/game/levels';
import { solveLevel } from '../../src/game/solver';
import { revealVisibleTiles } from '../../src/game/exploration';
import { DIRECTIONS } from '../../src/game/types';
import { ACTIVE_RUN_STORAGE_KEY, VERSION_FOUR_ACTIVE_RUN_STORAGE_KEY } from '../../src/session';
import { gameplayFingerprintForRules } from '../../src/game/contentIdentity';
import { PLAYER_PROGRESS_STORAGE_KEY, createDefaultPlayerProgress } from '../../src/progress';
import { PRESENTATION_PREFERENCES_KEY, DEFAULT_PRESENTATION_PREFERENCES } from '../../src/motion';

const output=resolve(process.env.MAZE_PERF_EVIDENCE_DIR!,'enemy-loot');
const f=findInputFixture(events=>events.some(e=>e.type==='enemy-defeated'))!;
const event=f.result.events.find(e=>e.type==='enemy-defeated')!;
const keys={run:ACTIVE_RUN_STORAGE_KEY,progress:PLAYER_PROGRESS_STORAGE_KEY,preferences:PRESENTATION_PREFERENCES_KEY};
test.beforeAll(async()=>{await mkdir(output,{recursive:true});expect(f.before.defeatedEnemyIds).toEqual([]);
  await writeFile(resolve(output,'fixture.json'),JSON.stringify({keys,fixture:f,snapshot:savedFixture(f,'enemy20')},null,2));
  const {loot:_,...oldGame}=f.before;
  const snapshot={...savedFixture(f,'enemy20-paired'),schemaVersion:3,gameplayFingerprint:gameplayFingerprintForRules(f.level,3),game:oldGame};
  await writeFile(resolve(output,'paired-fixtures.json'),JSON.stringify({keys:{...keys,run:'maze-so-puzzle-active-run-v3'},
    preferences:DEFAULT_PRESENTATION_PREFERENCES,progress:createDefaultPlayerProgress(16),fixtures:[{id:'enemy-first',snapshot,
      direction:f.direction,objectId:event.objectId,powerAfter:event.powerAfter,rewards:f.result.state.loot.sources.map(s=>({currency:s.currency,amount:s.amount}))}]},null,2));
});

for(const [quality,motion,width,height,noCanvas] of [
  ['full','full',844,390,false],['full','full',1080,810,false],['lite','full',844,390,false],
  ['static','full',844,390,false],['full','reduced',844,390,false],['full','full',844,390,true],
] as const) test(`enemy final-defeat reward ${quality}/${motion}/${width}/canvas${!noCanvas}`,async({browser})=>{
  const context=await browser.newContext({viewport:{width,height},deviceScaleFactor:2});
  try {
    const page=await context.newPage(),errors:string[]=[];page.on('pageerror',e=>errors.push(e.message));
    await page.addInitScript(({snapshot,keys,preferences,progress,quality,motion,noCanvas})=>{
      if(!sessionStorage.getItem('enemy20')) {
        localStorage.setItem(keys.run,JSON.stringify(snapshot));localStorage.setItem(keys.progress,JSON.stringify(progress));
        localStorage.setItem(keys.preferences,JSON.stringify({...preferences,quality,motion,muted:true}));sessionStorage.setItem('enemy20','1');
      }
      if(noCanvas) {const get=HTMLCanvasElement.prototype.getContext;
        HTMLCanvasElement.prototype.getContext=function(...args:any[]){return this.classList.contains('vfx-rewards')?null:get.apply(this,args as any);} as any;}
    },{snapshot:savedFixture(f,'enemy20'),keys,preferences:DEFAULT_PRESENTATION_PREFERENCES,progress:createDefaultPlayerProgress(16),quality,motion,noCanvas});
    const enter=async()=>{await page.goto('/');await page.getByRole('button',{name:'Play',exact:true}).click();await page.getByRole('button',{name:/^Continue/}).click();await page.bringToFront();};
    const read=()=>page.evaluate(key=>JSON.parse(localStorage.getItem(key)!).game,keys.run);
    await enter();await page.evaluate(()=>document.fonts.ready);
    await page.evaluate(()=>{
      const start=performance.now(),samples:any[]=[];(window as any).enemySamples=samples;
      const tick=()=>{const canvas=document.querySelector<HTMLCanvasElement>('canvas.vfx-rewards');
        samples.push({ms:performance.now()-start,battle:!!document.querySelector('.battle-presentation'),
          loot:Math.max(Number(canvas?.dataset.loot)||0,document.querySelectorAll('[data-loot-fallback]').length),tokens:Number(canvas?.dataset.tokens)||0});
        if(performance.now()-start<5000)requestAnimationFrame(tick);};requestAnimationFrame(tick);
    });
    await page.keyboard.press(`Arrow${f.direction[0]!.toUpperCase()}${f.direction.slice(1)}`);
    await page.waitForTimeout(60);const during=await read();
    expect(during.power).toBe(event.powerAfter);expect(during.goldStarsCollected+during.sciencePointsCollected).toBe(0);
    expect(during.loot.sources).toHaveLength(3);expect(during.loot.sources.every((s:any)=>s.objectId===event.objectId&&s.credited===0)).toBe(true);
    await expect(page.locator('.battle-presentation')).toHaveCount(0);
    await page.waitForTimeout(180);
    const burst=await read();expect(burst.goldStarsCollected+burst.sciencePointsCollected).toBe(0);
    const label=`${quality}-${motion}-${width}-${noCanvas}`;
    await page.screenshot({path:resolve(output,`${label}-burst.png`)});
    await page.waitForTimeout(1800);const settled=await read();
    expect(settled.loot.sources.map((s:any)=>s.currency).sort()).toEqual(['gold','science','xp']);
    for(const source of settled.loot.sources) expect(source.credited+source.drops.reduce((n:number,d:any)=>n+d.amount,0)).toBe(during.loot.sources.find((s:any)=>s.sourceId===source.sourceId).amount);
    const samples=await page.evaluate(()=>(window as any).enemySamples as any[]);
    expect(samples.some(s=>s.battle)).toBe(true);expect(samples.filter(s=>s.battle).every(s=>s.loot===0)).toBe(true);
    expect(samples.some(s=>!s.battle&&s.loot>0)).toBe(true);expect(samples.every(s=>s.tokens<=(quality==='lite'?12:24))).toBe(true);
    await page.screenshot({path:resolve(output,`${label}-settled.png`)});
    await enter();await page.waitForTimeout(1000);expect(await read()).toEqual(settled);
    // Enter the real cleared enemy square; never teleport toward a reward.
    await page.keyboard.press(`Arrow${f.direction[0]!.toUpperCase()}${f.direction.slice(1)}`);await page.waitForTimeout(1300);
    const approached=await read();expect(approached.defeatedEnemyIds).toEqual(settled.defeatedEnemyIds);
    expect(approached.power).toBe(settled.power);expect(approached.loot.sources).toHaveLength(3);
    expect(approached.goldStarsCollected+approached.sciencePointsCollected).toBeGreaterThanOrEqual(settled.goldStarsCollected+settled.sciencePointsCollected);
    expect(errors).toEqual([]);
    await writeFile(resolve(output,`${label}.json`),JSON.stringify({during,burst,settled,approached,samples,errors},null,2));
  }finally{await context.close();}
});

test('reload during battle preserves earned enemy value without replay or duplicate defeat',async({page})=>{
  await page.addInitScript(({snapshot,keys,progress})=>{if(!sessionStorage.getItem('enemy-crash')){
    localStorage.setItem(keys.run,JSON.stringify(snapshot));localStorage.setItem(keys.progress,JSON.stringify(progress));sessionStorage.setItem('enemy-crash','1');
  }},{snapshot:savedFixture(f,'enemy-crash'),keys,progress:createDefaultPlayerProgress(16)});
  const enter=async()=>{await page.goto('/');await page.getByRole('button',{name:'Play',exact:true}).click();await page.getByRole('button',{name:/^Continue/}).click();};
  await enter();await page.keyboard.press(`Arrow${f.direction[0]!.toUpperCase()}${f.direction.slice(1)}`);
  await expect(page.locator('.battle-presentation')).toBeVisible();
  const during=await page.evaluate(key=>JSON.parse(localStorage.getItem(key)!).game,keys.run);
  await enter();await expect(page.locator('.battle-presentation')).toHaveCount(0);await page.waitForTimeout(1600);
  const after=await page.evaluate(key=>JSON.parse(localStorage.getItem(key)!).game,keys.run);
  expect(after.power).toBe(during.power);expect(after.defeatedEnemyIds).toEqual(during.defeatedEnemyIds);
  expect(after.loot.sources).toHaveLength(3);
  for(const source of after.loot.sources)expect(source.credited+source.drops.reduce((n:number,d:any)=>n+d.amount,0))
    .toBe(during.loot.sources.find((s:any)=>s.sourceId===source.sourceId).amount);
  await writeFile(resolve(output,'battle-reload.json'),JSON.stringify({during,after},null,2));
});

test('production v4 migration keeps distant grounded treasure and retires past enemies',async({page})=>{
  // A historical save must come from the actual historical object graph, not
  // today's chest layout relabelled with a v4 schema/fingerprint.
  const reached=(()=>{for(const level of LEGACY_CURATED_LEVELS){
    let before=createInitialGameState(level),revealed=revealVisibleTiles([],level,before.position);
    const prefix:typeof DIRECTIONS[number][]=[];
    for(const direction of solveLevel(level,{requireAllAnimals:true}).directions){
      const result=movePlayer(level,before,direction);
      if(before.defeatedEnemyIds.length&&result.events.some(e=>e.type==='treasure-opened'&&e.currency==='gold'))
        return{level,before,prefix,direction,result,revealed};
      before=result.state;revealed=revealVisibleTiles(revealed,level,before.position);prefix.push(direction);
    }
  }throw Error('No historical enemy/treasure witness');})();
  const treasure=authoredLootFixture(reached);
  const game=treasure.result.state, current=savedFixture({...treasure,before:game},'v4-enemy-migration');
  expect(game.defeatedEnemyIds.length).toBeGreaterThan(0);
  const old={...current,schemaVersion:4,gameplayFingerprint:gameplayFingerprintForRules(treasure.level,4),game:{...game,
    loot:{version:1,sources:game.loot.sources.map(({sourceKind:_,objectId:__,...s})=>s)}}};
  const far=game.loot.sources.flatMap(s=>s.drops).filter(d=>Math.hypot(d.at.x-game.position.x,d.at.y-game.position.y)>1.75);
  expect(far.length).toBeGreaterThan(0);
  await page.addInitScript(({old,key,keys,progress})=>{if(!sessionStorage.getItem('old-four')){
    localStorage.setItem(key,JSON.stringify(old));localStorage.setItem(keys.progress,JSON.stringify(progress));sessionStorage.setItem('old-four','1');
  }},{old,key:VERSION_FOUR_ACTIVE_RUN_STORAGE_KEY,keys,progress:createDefaultPlayerProgress(16)});
  await page.goto('/');await page.getByRole('button',{name:'Play',exact:true}).click();await page.getByRole('button',{name:/^Continue/}).click();await page.waitForTimeout(1500);
  const restored=await page.evaluate(({key,prior})=>({current:JSON.parse(localStorage.getItem(key)!),prior:localStorage.getItem(prior)}),{key:keys.run,prior:VERSION_FOUR_ACTIVE_RUN_STORAGE_KEY});
  expect(restored.prior).toBeNull();expect(restored.current.runId).toBe(current.runId);
  expect(restored.current.game.loot.legacyRetiredEnemyIds).toEqual([...game.defeatedEnemyIds].sort());
  expect(restored.current.game.loot.sources.every((s:any)=>s.sourceKind==='treasure')).toBe(true);
  for(const drop of far)expect(restored.current.game.loot.sources.flatMap((s:any)=>s.drops)).toContainEqual(drop);
  expect(restored.current.game.goldStarsCollected+restored.current.game.sciencePointsCollected+
    restored.current.game.loot.sources.flatMap((s:any)=>s.drops).reduce((n:number,d:any)=>n+d.amount,0)).toBe(game.loot.sources.reduce((n,s)=>n+s.amount,0));
  await writeFile(resolve(output,'production-v4-migration.json'),JSON.stringify({old,restored},null,2));
});

for(const lite of [false,true])test(`saturated loot releases enemy then new treasure Lite${lite}`,async({page})=>{
  await page.goto('http://127.0.0.1:1421/');await page.bringToFront();
  const result=await page.evaluate(async(lite)=>{
    const {mountRewardPriorityHarness}=await import('/scripts/art_review/physical-loot-harness.tsx');
    document.getElementById('root')!.style.display='none';const host=document.createElement('div');document.body.append(host);
    const h=mountRewardPriorityHarness(host,lite),initial=h.read();h.defeat();await new Promise(r=>setTimeout(r,100));
    const during=h.read();h.release();await new Promise(r=>setTimeout(r,800));const released=h.read();
    h.treasure();await new Promise(r=>setTimeout(r,800));const treasure=h.read();h.unmount();host.remove();return{initial,during,released,treasure};
  },lite);
  const visible=(row:any)=>row.represented.filter((s:any)=>s.ids.length);
  expect(visible(result.initial)).toHaveLength(lite?8:20);
  expect(visible(result.during).some((s:any)=>s.objectId==='priority-enemy')).toBe(false);
  expect(visible(result.released).filter((s:any)=>s.objectId==='priority-enemy').map((s:any)=>s.currency).sort()).toEqual(['gold','science','xp']);
  expect(visible(result.treasure).some((s:any)=>s.objectId==='priority-treasure')).toBe(true);
  for(const row of [result.released,result.treasure]) {
    const ids=visible(row).flatMap((s:any)=>s.ids);expect(ids.length).toBeLessThanOrEqual(lite?8:20);expect(ids.every((id:string)=>row.motions.includes(id))).toBe(true);
    expect(row.shown).toEqual([]); // Paused admission cannot count as visible reading time.
    expect(row.game.goldStarsCollected+row.game.sciencePointsCollected).toBe(0);
    for(const source of row.game.loot.sources)expect(source.drops.reduce((n:number,d:any)=>n+d.amount,0)).toBe(source.amount);
  }
  await writeFile(resolve(output,`saturation-${lite}.json`),JSON.stringify(result,null,2));
});

for(const boundary of ['hidden-battle','restored-home'] as const)test(`enemy loot readable interval survives ${boundary}`,async({page})=>{
  const snapshot=savedFixture(boundary==='restored-home'?{...f,before:f.result.state}:f,`readable-${boundary}`);
  await page.addInitScript(({snapshot,keys,progress})=>{
    localStorage.setItem(keys.run,JSON.stringify(snapshot));localStorage.setItem(keys.progress,JSON.stringify(progress));
  },{snapshot,keys,progress:createDefaultPlayerProgress(16)});
  const read=()=>page.evaluate(key=>JSON.parse(localStorage.getItem(key)!).game,keys.run);
  const enter=async()=>{await page.getByRole('button',{name:'Play',exact:true}).click();await page.getByRole('button',{name:/^Continue/}).click();await page.bringToFront();};
  await page.goto('/');
  if(boundary==='hidden-battle'){
    await enter();await page.keyboard.press(`Arrow${f.direction[0]!.toUpperCase()}${f.direction.slice(1)}`);
    await expect(page.locator('.battle-presentation')).toBeVisible();
    // Explicit synthetic visibility signal exercises the production cancellation
    // handler and hook. This is not evidence of browser background throttling.
    await page.evaluate(()=>{
      Object.defineProperty(document,'hidden',{configurable:true,get:()=>true});
      Object.defineProperty(document,'visibilityState',{configurable:true,get:()=> 'hidden'});
      document.dispatchEvent(new Event('visibilitychange'));
    });
    await expect(page.locator('.battle-presentation')).toHaveCount(0);
  }
  await page.waitForTimeout(1200);const paused=await read();
  expect(paused.goldStarsCollected+paused.sciencePointsCollected).toBe(0);
  if(boundary==='restored-home')await enter();else await page.evaluate(()=>{
    delete (document as any).hidden;delete (document as any).visibilityState;
    document.dispatchEvent(new Event('visibilitychange'));
  });
  await page.waitForTimeout(350);const readable=await read();
  expect(readable.goldStarsCollected+readable.sciencePointsCollected).toBe(0);
  expect(readable.loot.sources.every((s:any)=>s.drops.every((d:any)=>d.phase==='grounded'))).toBe(true);
  await page.waitForTimeout(1300);const after=await read();
  expect(after.goldStarsCollected+after.sciencePointsCollected).toBeGreaterThan(0);
  for(const source of after.loot.sources)expect(source.credited+source.drops.reduce((n:number,d:any)=>n+d.amount,0)).toBe(source.amount);
  await writeFile(resolve(output,`readable-${boundary}.json`),JSON.stringify({boundary,syntheticVisibility:boundary==='hidden-battle',paused,readable,after},null,2));
});
