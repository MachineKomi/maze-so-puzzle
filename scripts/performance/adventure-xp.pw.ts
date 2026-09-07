import {test,expect} from '@playwright/test';
import {mkdir,writeFile} from 'node:fs/promises';
import {resolve} from 'node:path';
import {CURATED_LEVELS} from '../../src/game/levels';
import {createInitialGameState,movePlayer,stayAfterPendingCompletion} from '../../src/game/engine';
import {beginLootClaims,finishLootClaims} from '../../src/game/loot';
import {solveLevel} from '../../src/game/solver';
import {DIRECTIONS} from '../../src/game/types';
import {createActiveRunSnapshot,ACTIVE_RUN_STORAGE_KEY} from '../../src/session';
import {createDefaultPlayerProgress,PLAYER_PROGRESS_STORAGE_KEY} from '../../src/progress';
import {DEFAULT_PRESENTATION_PREFERENCES,PRESENTATION_PREFERENCES_KEY} from '../../src/motion';
const output=resolve(process.env.MAZE_PERF_EVIDENCE_DIR!,'adventure-xp');
const level=CURATED_LEVELS[1]!,runId='run-xp23-completion';
let won=createInitialGameState(level,runId);
for(const direction of solveLevel(level,{avoidAnimals:true}).directions){
  won=movePlayer(level,won,direction).state;
  // Engine owner collects only physically eligible, settled nearby bundles.
  won=finishLootClaims(beginLootClaims(level,won,won.loot.sources.flatMap(s=>s.drops.map(d=>({id:d.id,elapsedMs:2000})))));
}
if(won.status!=='won'||!won.xpCollected)throw Error('Expected actual completed route with nearby XP');
const snapshot=createActiveRunSnapshot({runId,mode:'normal',level,game:won,revealedTiles:[]})!;
const keys={run:ACTIVE_RUN_STORAGE_KEY,progress:PLAYER_PROGRESS_STORAGE_KEY,preferences:PRESENTATION_PREFERENCES_KEY};
const progress={...createDefaultPlayerProgress(16),adventureXp:18};
const arrow=(d:string)=>`Arrow${d[0]!.toUpperCase()}${d.slice(1)}`;
const reverse={up:'down',down:'up',left:'right',right:'left'};
test.beforeAll(async()=>{await mkdir(output,{recursive:true});await writeFile(resolve(output,'completed-fixture.json'),JSON.stringify({snapshot,progress},null,2));});

for(const [quality,motion,width,height] of [['full','full',844,390],['full','full',1080,810],['lite','full',844,390],['static','full',844,390],['full','reduced',844,390]] as const)
test(`XP completion, Stay, exactly-once bank and Book ${quality}/${motion}/${width}`,async({browser})=>{
  const context=await browser.newContext({viewport:{width,height},reducedMotion:motion==='reduced'?'reduce':'no-preference'}),page=await context.newPage(),errors:string[]=[];
  page.on('pageerror',e=>errors.push(e.message));
  await page.addInitScript(({keys,snapshot,progress,preferences})=>{if(!sessionStorage.getItem('xp23')){
    localStorage.setItem(keys.run,JSON.stringify(snapshot));localStorage.setItem(keys.progress,JSON.stringify(progress));localStorage.setItem(keys.preferences,JSON.stringify(preferences));sessionStorage.setItem('xp23','1');
  }},{keys,snapshot,progress,preferences:{...DEFAULT_PRESENTATION_PREFERENCES,quality,motion}});
  const enter=async()=>{await page.goto('/');await page.getByRole('button',{name:'Play',exact:true}).click();await page.getByRole('button',{name:/^Continue/}).click();};
  const read=()=>page.evaluate(key=>JSON.parse(localStorage.getItem(key)!),keys.progress);
  try{
    await enter();const card=page.locator('.dialog-celebration .adventure-level');await expect(card).toBeVisible();
    await expect(card).toHaveAttribute('data-adventure-xp',String(18+won.xpCollected+10));
    await expect(card).toContainText('Level up!');await expect(card).toContainText('when you move on');
    expect((await read()).adventureXp).toBe(18);
    await expect(card.locator('img')).toHaveJSProperty('naturalWidth',128);
    const label=`${quality}-${motion}-${width}`;await page.screenshot({path:resolve(output,`${label}-completion.png`)});
    await page.getByRole('button',{name:'Stay here',exact:true}).click();expect((await read()).adventureXp).toBe(18);
    const stay=stayAfterPendingCompletion(level,won),leave=DIRECTIONS.find(d=>movePlayer(level,stay,d).moved)!;
    await page.keyboard.press(arrow(leave));await page.waitForTimeout(450);await page.keyboard.press(arrow(reverse[leave]));
    await expect(card).toBeVisible();expect((await read()).adventureXp).toBe(18);
    await page.getByRole('button',{name:/^Next maze/}).evaluate((button:HTMLButtonElement)=>{button.click();button.click();});
    await expect.poll(async()=>(await read()).totalCompletions).toBe(1);
    const saved=await read();expect(saved.adventureXp).toBe(18+won.xpCollected+10);expect(saved.completionReceipts).toEqual([`completion:${runId}`]);
    await page.goto('/');await page.getByRole('button',{name:'Play',exact:true}).click();await page.getByRole('button',{name:"Ame's adventure book",exact:true}).click();
    await page.getByRole('tab',{name:'Stats',exact:true}).click();await expect(page.getByRole('region',{name:'Saved Adventure Level'})).toHaveAttribute('data-adventure-xp',String(saved.adventureXp));
    await page.screenshot({path:resolve(output,`${label}-book.png`)});expect(errors).toEqual([]);
    await writeFile(resolve(output,`${label}.json`),JSON.stringify({saved,errors},null,2));
  }finally{await context.close();}
});

for(const failure of ['run-write','profile-write','run-clear'] as const)test(`XP recovery journal survives ${failure}`,async({page})=>{
  await page.addInitScript(({keys,snapshot,progress,failure})=>{
    if(!sessionStorage.getItem('xp-failure')){localStorage.setItem(keys.run,JSON.stringify(snapshot));localStorage.setItem(keys.progress,JSON.stringify(progress));sessionStorage.setItem('xp-failure','1');}
    const set=Storage.prototype.setItem,remove=Storage.prototype.removeItem;
    (window as any).denyXp=false;
    Storage.prototype.setItem=function(k,v){if((window as any).denyXp&&k===(failure==='run-write'?keys.run:failure==='profile-write'?keys.progress:''))throw Error('Test denied');return set.call(this,k,v);};
    Storage.prototype.removeItem=function(k){if((window as any).denyXp&&failure==='run-clear'&&k===keys.run)throw Error('Test denied');return remove.call(this,k);};
  },{keys,snapshot,progress,failure});
  const enter=async()=>{await page.goto('/');await page.getByRole('button',{name:'Play',exact:true}).click();await page.getByRole('button',{name:/^Continue/}).click();};
  await enter();await expect(page.locator('.dialog-celebration')).toBeVisible();await page.evaluate(()=>(window as any).denyXp=true);
  await page.getByRole('button',{name:/^Next maze/}).click();
  const first=await page.evaluate(key=>JSON.parse(localStorage.getItem(key)!),keys.progress);
  expect(first.adventureXp).toBe(failure==='run-clear'?18+won.xpCollected+10:18);
  await enter(); // A fresh document removes the injected denial, retaining real storage.
  if(await page.locator('.dialog-celebration').isVisible())await page.getByRole('button',{name:/^Next maze/}).click();
  await expect.poll(async()=>page.evaluate(key=>JSON.parse(localStorage.getItem(key)!).adventureXp,keys.progress)).toBe(18+won.xpCollected+10);
  const final=await page.evaluate(key=>JSON.parse(localStorage.getItem(key)!),keys.progress);
  expect(final.totalCompletions).toBe(1);expect(final.completionReceipts).toHaveLength(1);
  await writeFile(resolve(output,`${failure}.json`),JSON.stringify({first,final},null,2));
});
