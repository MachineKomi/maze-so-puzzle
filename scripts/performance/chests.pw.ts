import {test,expect} from '@playwright/test';
import {mkdir,writeFile} from 'node:fs/promises';
import {resolve} from 'node:path';
import {findInputFixture,savedFixture} from './v22-input-fixtures';
import {ACTIVE_RUN_STORAGE_KEY} from '../../src/session';
import {PLAYER_PROGRESS_STORAGE_KEY,createDefaultPlayerProgress} from '../../src/progress';
import {PRESENTATION_PREFERENCES_KEY,DEFAULT_PRESENTATION_PREFERENCES} from '../../src/motion';
import {LEGACY_CURATED_LEVELS} from '../../src/game/levels';
import {createInitialGameState,movePlayer} from '../../src/game/engine';
import {createActiveRunSnapshot} from '../../src/session';

const output=resolve(process.env.MAZE_PERF_EVIDENCE_DIR!,'chests');
const good=findInputFixture(events=>events.some(e=>e.type==='chest-opened'&&e.outcome==='good'))!;
const mimic=findInputFixture(events=>events.some(e=>e.type==='chest-opened'&&e.outcome==='mimic'))!;
const keys={run:ACTIVE_RUN_STORAGE_KEY,progress:PLAYER_PROGRESS_STORAGE_KEY,preferences:PRESENTATION_PREFERENCES_KEY};
const arrow=(d:string)=>`Arrow${d[0]!.toUpperCase()}${d.slice(1)}`;
test.beforeAll(async()=>{await mkdir(output,{recursive:true});expect(good).toBeTruthy();expect(mimic).toBeTruthy();
  await writeFile(resolve(output,'fixtures.json'),JSON.stringify({good,mimic,keys},null,2));
  const level=LEGACY_CURATED_LEVELS.find(l=>l.id===good.level.id)!;
  const before=good.prefix.reduce((g,d)=>movePlayer(level,g,d).state,createInitialGameState(level,good.before.loot.runId));
  expect(before.position).toEqual(good.before.position);expect(before.power).toBe(good.before.power);
  const {chests:_,...oldGame}=before,event=good.result.events.find(e=>e.type==='chest-opened')!;
  const baseline={...createActiveRunSnapshot({level,game:before,runId:before.loot.runId,mode:'normal',revealedTiles:good.revealed}),schemaVersion:5,game:oldGame};
  await writeFile(resolve(output,'paired-fixtures.json'),JSON.stringify({keys,preferences:DEFAULT_PRESENTATION_PREFERENCES,progress:createDefaultPlayerProgress(16),
    fixtures:[{id:'authored-chest',snapshot:savedFixture(good,'chest-pair'),baselineSnapshot:baseline,direction:good.direction,objectId:event.objectId,
      rewards:good.result.state.loot.sources.filter(s=>s.objectId===event.objectId).map(s=>({currency:s.currency,amount:s.amount}))}]},null,2));
});

for(const [quality,motion,width,height] of [
  ['full','full',844,390],['full','full',1080,810],['full','full',1440,900],
  ['lite','full',844,390],['static','full',844,390],['full','reduced',844,390],
] as const)for(const outcome of ['good','mimic'] as const)test(`chest ${outcome} ${quality}/${motion}/${width}`,async({browser})=>{
  const context=await browser.newContext({viewport:{width,height},reducedMotion:motion==='reduced'?'reduce':'no-preference'}),page=await context.newPage();
  const fixture=outcome==='good'?good:mimic,event=fixture.result.events.find(e=>e.type==='chest-opened')!;
  const errors:string[]=[];page.on('pageerror',e=>errors.push(e.message));
  await page.addInitScript(({keys,snapshot,preferences,progress})=>{
    if(!sessionStorage.getItem('chest-test')){localStorage.setItem(keys.run,JSON.stringify(snapshot));localStorage.setItem(keys.progress,JSON.stringify(progress));
      localStorage.setItem(keys.preferences,JSON.stringify(preferences));sessionStorage.setItem('chest-test','yes');}
  },{keys,snapshot:savedFixture(fixture,'chest22'),preferences:{...DEFAULT_PRESENTATION_PREFERENCES,quality,motion},progress:createDefaultPlayerProgress(16)});
  const read=()=>page.evaluate(key=>JSON.parse(localStorage.getItem(key)!).game,keys.run);
  const enter=async()=>{await page.goto('/');await page.getByRole('button',{name:'Play',exact:true}).click();await page.getByRole('button',{name:/^Continue/}).click();await page.bringToFront();};
  try{
    await enter();const before=await read();
    const closed=page.locator(`[data-object-id="${event.objectId}"]`);await expect(closed).toHaveAttribute('data-chest-phase','closed');
    await expect(closed.locator('.enemy-power')).toHaveCount(0);
    const discoveryBefore=await page.evaluate(key=>JSON.parse(localStorage.getItem(key)!),keys.progress);
    if(outcome==='mimic')expect(JSON.stringify(discoveryBefore.discoveredEnemyIds??[])).not.toContain('candy-mimic');
    await page.keyboard.down(arrow(fixture.direction));
    await expect(page.locator('.chest-presentation')).toHaveAttribute('data-chest-state',outcome==='good'?'good-open':'revealed');
    const during=await read();expect(during.position).toEqual(before.position);expect(during.steps).toBe(before.steps);expect(during.power).toBe(before.power);
    expect(during.chests.find((c:any)=>c.objectId===event.objectId).phase).toBe(outcome==='good'?'good-open':'revealed');
    const source=during.loot.sources.filter((s:any)=>s.objectId===event.objectId);
    expect(source).toHaveLength(outcome==='good'?2:0);
    expect(source.every((s:any)=>s.credited===0)).toBe(true);
    const label=`${outcome}-${quality}-${motion}-${width}`;
    await page.screenshot({path:resolve(output,`${label}-open.png`)});
    await expect(page.locator('.chest-presentation')).toHaveCount(0);
    await page.waitForTimeout(350);
    expect((await read()).position).toEqual(before.position); // a held opening never traverses/fights
    expect((await read()).power).toBe(before.power);
    await page.keyboard.up(arrow(fixture.direction));
    if(outcome==='mimic'){
      await expect(page.locator(`[data-object-id="${event.objectId}"]`)).toHaveAttribute('data-chest-phase','revealed');
      await page.keyboard.press(arrow(fixture.direction));await expect(page.locator('.battle-presentation')).toBeVisible();
      const defeated=await read();expect(defeated.chests.find((c:any)=>c.objectId===event.objectId).phase).toBe('defeated');
      expect(defeated.power).toBe(before.power+event.power);
      await expect(page.locator('.battle-presentation')).toHaveCount(0);
    }
    await page.waitForTimeout(2000);const settled=await read();
    const rewards=settled.loot.sources.filter((s:any)=>s.objectId===event.objectId);expect(rewards).toHaveLength(2);
    for(const s of rewards)expect(s.credited+s.drops.reduce((n:number,d:any)=>n+d.amount,0)).toBe(s.amount);
    expect(rewards.find((s:any)=>s.currency==='gold').amount).toBeGreaterThanOrEqual(outcome==='good'?8:11);
    await page.screenshot({path:resolve(output,`${label}-settled.png`)});
    await enter();await page.waitForTimeout(1200);const restored=await read();
    expect(restored.chests).toEqual(settled.chests);expect(restored.power).toBe(settled.power);
    expect(restored.loot.sources.filter((s:any)=>s.objectId===event.objectId).map((s:any)=>[s.sourceId,s.amount]))
      .toEqual(rewards.map((s:any)=>[s.sourceId,s.amount]));
    expect(errors).toEqual([]);await writeFile(resolve(output,`${label}.json`),JSON.stringify({during,settled,restored,errors},null,2));
  }finally{await context.close();}
});

for(const outcome of ['good','mimic'] as const)test(`reload interrupts ${outcome} reveal without reroll`,async({page})=>{
  const f=outcome==='good'?good:mimic,event=f.result.events.find(e=>e.type==='chest-opened')!;
  await page.addInitScript(({keys,snapshot,progress})=>{if(!sessionStorage.getItem('chest-crash')){
    localStorage.setItem(keys.run,JSON.stringify(snapshot));localStorage.setItem(keys.progress,JSON.stringify(progress));sessionStorage.setItem('chest-crash','1');
  }},{keys,snapshot:savedFixture(f,'chest-crash'),progress:createDefaultPlayerProgress(16)});
  const enter=async()=>{await page.goto('/');await page.getByRole('button',{name:'Play',exact:true}).click();await page.getByRole('button',{name:/^Continue/}).click();};
  await enter();await page.keyboard.press(arrow(f.direction));await expect(page.locator('.chest-presentation')).toBeVisible();
  const during=await page.evaluate(key=>JSON.parse(localStorage.getItem(key)!).game,keys.run);
  await enter();await expect(page.locator('.chest-presentation')).toHaveCount(0);
  const after=await page.evaluate(key=>JSON.parse(localStorage.getItem(key)!).game,keys.run);
  expect(after.chests).toEqual(during.chests);expect(after.power).toBe(during.power);expect(after.position).toEqual(during.position);
  expect(after.loot.sources.filter((s:any)=>s.objectId===event.objectId)).toHaveLength(outcome==='good'?2:0);
  await writeFile(resolve(output,`${outcome}-reload.json`),JSON.stringify({during,after},null,2));
});

test('production runtime resumes v21 Twilight and restarts on the new layout',async({page})=>{
  const level=LEGACY_CURATED_LEVELS.find(l=>l.id==='twilight-treasure-loop')!,runId='run-chest-old-twilight';
  const game=createInitialGameState(level,runId),{chests:_,...oldGame}=game;
  const snapshot={...createActiveRunSnapshot({level,game,runId,mode:'normal',revealedTiles:[]}),schemaVersion:5,game:oldGame};
  await page.addInitScript(({keys,snapshot,progress})=>{if(!sessionStorage.getItem('legacy-start')){localStorage.setItem(keys.run,JSON.stringify(snapshot));localStorage.setItem(keys.progress,JSON.stringify(progress));sessionStorage.setItem('legacy-start','1');}},
    {keys,snapshot,progress:createDefaultPlayerProgress(16)});
  await page.goto('/');await page.getByRole('button',{name:'Play',exact:true}).click();await page.getByRole('button',{name:/^Continue/}).click();
  const restored=await page.evaluate(key=>JSON.parse(localStorage.getItem(key)!),keys.run);
  expect(restored.schemaVersion).toBe(6);expect(restored.gameplayFingerprint).toBe(level.gameplayFingerprint);expect(restored.game.chests).toEqual([]);
  expect(restored.game.position).toEqual(game.position);
  await page.getByRole('button',{name:'Restart',exact:true}).click();await page.getByRole('button',{name:'Again!',exact:true}).click();
  await expect.poll(()=>page.evaluate(key=>JSON.parse(localStorage.getItem(key)!).gameplayFingerprint,keys.run)).not.toBe(level.gameplayFingerprint);
  const restarted=await page.evaluate(key=>JSON.parse(localStorage.getItem(key)!),keys.run);
  expect(restarted.runId).not.toBe(runId);expect(restarted.game.chests).toEqual([]);
  await writeFile(resolve(output,'legacy-twilight.json'),JSON.stringify({snapshot,restored,restarted},null,2));
});
