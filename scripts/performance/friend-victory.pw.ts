import {test,expect} from '@playwright/test';
import {mkdir,writeFile} from 'node:fs/promises';
import {resolve} from 'node:path';
import {CURATED_LEVELS} from '../../src/game/levels';
import {createInitialGameState,movePlayer} from '../../src/game/engine';
import {beginLootClaims,finishLootClaims} from '../../src/game/loot';
import {solveLevel} from '../../src/game/solver';
import {createActiveRunSnapshot,ACTIVE_RUN_STORAGE_KEY} from '../../src/session';
import {createDefaultPlayerProgress,PLAYER_PROGRESS_STORAGE_KEY} from '../../src/progress';
import {DEFAULT_PRESENTATION_PREFERENCES,PRESENTATION_PREFERENCES_KEY} from '../../src/motion';
import {deriveRoute,replayRouteStep,selectTesterLevel} from './gameplay-browser';
const output=resolve(process.env.MAZE_PERF_EVIDENCE_DIR!,'friend-victory');
const baseline=process.env.MAZE_DELIGHT_BASELINE==='1';
const level=CURATED_LEVELS.find(l=>l.objects.filter(o=>o.kind==='animal').length===5)!;
function fixture(count:'none'|'one'|'all') {
 let game=createInitialGameState(level,`run-delight24-${count}`);
 const advance=(d:Parameters<typeof movePlayer>[2])=>{
  game=movePlayer(level,game,d).state;
  game=finishLootClaims(beginLootClaims(level,game,game.loot.sources.flatMap(s=>s.drops.map(d=>({id:d.id,elapsedMs:2000})))));
 };
 if(count==='one')for(const d of solveLevel(level,{requireAllAnimals:true}).directions){advance(d);if(game.rescuedAnimalIds.length===1)break;}
 const solution=solveLevel(level,{initialState:game,requireAllAnimals:count==='all',avoidAnimals:count!=='all'});
 if(!solution.solvable)throw Error('Expected real victory route');for(const d of solution.directions)advance(d);
 if(game.status!=='won'||game.rescuedAnimalIds.length!==({none:0,one:1,all:5}[count]))throw Error('Wrong rescue route');
 const snapshot=createActiveRunSnapshot({runId:game.loot.runId,mode:'normal',level,game,revealedTiles:[]})!;
 return {snapshot,progress:createDefaultPlayerProgress(16)};
}
const fixtures={none:fixture('none'),one:fixture('one'),all:fixture('all')};
test.beforeAll(async()=>{await mkdir(output,{recursive:true});await writeFile(resolve(output,'fixtures.json'),JSON.stringify({levelId:level.id,fixtures},null,2));});
for(const [width,height,count,quality,motion] of [
 [1280,720,'all','full','full'],[844,390,'all','full','full'],[780,312,'all','full','full'],
 [844,390,'none','full','full'],[844,390,'one','full','full'],
 [1080,810,'all','static','full'],[844,390,'all','lite','full'],[844,390,'all','full','reduced'],
] as const)test(`DELIGHT24 ${width} ${count} ${quality}/${motion}`,async({page})=>{
 await page.setViewportSize({width,height});const errors:string[]=[];page.on('pageerror',e=>errors.push(e.message));
 await page.clock.install({time:new Date('2026-09-07T00:00:00Z')});
 await page.addInitScript(({fixture,quality,motion,keys,preferences})=>{
  if(!sessionStorage.getItem('delight24')){
   localStorage.setItem(keys.run,JSON.stringify(fixture.snapshot));localStorage.setItem(keys.progress,JSON.stringify(fixture.progress));
   localStorage.setItem(keys.preferences,JSON.stringify({...preferences,quality,motion,musicVolume:0,sfxVolume:0}));sessionStorage.setItem('delight24','1');
  }
 },{fixture:fixtures[count],quality,motion,keys:{run:ACTIVE_RUN_STORAGE_KEY,progress:PLAYER_PROGRESS_STORAGE_KEY,preferences:PRESENTATION_PREFERENCES_KEY},preferences:DEFAULT_PRESENTATION_PREFERENCES});
 await page.goto('/');await page.getByRole('button',{name:'Play',exact:true}).click();await page.getByRole('button',{name:/^Continue/}).click();
 const dialog=page.locator('.dialog-celebration');await expect(dialog).toBeVisible();
 await page.evaluate(async()=>{await document.fonts.ready;await Promise.all([...document.images].map(i=>i.decode().catch(()=>{})));});
 await page.clock.pauseAt(new Date('2026-09-07T01:00:00Z'));
 const stage=page.locator('.rescued-result-row');
 const geometry=await dialog.evaluate(e=>({dialog:e.getBoundingClientRect().toJSON(),body:[...e.querySelectorAll('.dialog-body')].map(b=>({height:b.clientHeight,scroll:b.scrollHeight})),friends:[...e.querySelectorAll('.rescued-result img')].map(i=>i.getBoundingClientRect().toJSON())}));
 await page.screenshot({path:resolve(output,`${width}-${count}-${quality}-${motion}.png`)});
 await writeFile(resolve(output,`${width}-${count}-${quality}-${motion}.json`),JSON.stringify({geometry,errors,baseline},null,2));
 if(!baseline){
  await expect(stage).toHaveAttribute('data-celebration','friend-led-v1');
  await expect(stage.locator('.rescued-result')).toHaveCount(count==='none'?1:count==='one'?1:5);
  await expect(dialog).toContainText('Ready to record');await expect(dialog).toContainText('After moving on');
  expect(geometry.body.every(b=>b.scroll<=b.height+1),JSON.stringify(geometry.body)).toBe(true);
  await expect(page.getByRole('button',{name:/^Next maze/})).toBeInViewport();
  expect(await stage.locator('.confetti-piece').count()).toBeLessThanOrEqual(12);
  expect(await stage.locator('[data-flip="true"]').count()).toBeLessThanOrEqual(1);
  if(count==='all')await expect(stage.locator('[data-flip="true"]')).toHaveCount(1);
  if(quality==='static'||motion==='reduced')expect(await stage.evaluate(e=>e.getAnimations({subtree:true}).length)).toBe(0);
  const deadlines=await stage.evaluate(e=>e.getAnimations({subtree:true}).map(a=>Number(a.effect!.getComputedTiming().endTime)));
  expect(deadlines.every(t=>Number.isFinite(t)&&t<=10000)).toBe(true);
  if(count==='all'&&quality==='full'&&motion==='full'){
   await stage.evaluate(e=>e.getAnimations({subtree:true}).forEach(a=>{a.pause();a.currentTime=1260;}));
   await page.screenshot({path:resolve(output,`flip-${width}.png`)});
  }
  await stage.evaluate(e=>e.getAnimations({subtree:true}).forEach(a=>a.finish()));
  expect(await stage.evaluate(e=>e.getAnimations({subtree:true}).filter(a=>a.playState==='running').length)).toBe(0);
 }
 const rewards=async()=>page.evaluate(k=>{const {discoveredFriendIds,discoveredEnemyIds,...rewards}=JSON.parse(localStorage.getItem(k)!);return rewards;},PLAYER_PROGRESS_STORAGE_KEY);
 const before=await rewards();
 // Resuming legitimately reveals current visible/rescued species; it does not
 // bank completion rewards. Discovery is intentionally an independent owner.
 await page.getByRole('button',{name:'Stay here',exact:true}).click();expect(await rewards()).toEqual(before);
 expect(errors).toEqual([]);await writeFile(resolve(output,`${width}-${count}-${quality}-${motion}.json`),JSON.stringify({geometry,errors,baseline},null,2));
});

test('DELIGHT24 real-time rest, hidden cancellation and calm preference return',async({page})=>{
 await page.setViewportSize({width:1280,height:720});
 await page.addInitScript(({f,keys,preferences})=>{
  localStorage.setItem(keys.run,JSON.stringify(f.snapshot));localStorage.setItem(keys.progress,JSON.stringify(f.progress));
  localStorage.setItem(keys.preferences,JSON.stringify({...preferences,quality:'full',motion:'system',musicVolume:0,sfxVolume:0}));
 },{f:fixtures.all,keys:{run:ACTIVE_RUN_STORAGE_KEY,progress:PLAYER_PROGRESS_STORAGE_KEY,preferences:PRESENTATION_PREFERENCES_KEY},preferences:DEFAULT_PRESENTATION_PREFERENCES});
 const enter=async()=>{await page.goto('/');await page.getByRole('button',{name:'Play',exact:true}).click();await page.getByRole('button',{name:/^Continue/}).click();};
 await enter();const stage=page.locator('.victory-stage');await expect(stage).toHaveAttribute('data-quiet','false');
 expect(await stage.evaluate(e=>e.getAnimations({subtree:true}).some(a=>a.playState==='running'))).toBe(true);
 // Native CSS time, not the Playwright clock: prove real playback stops.
 await page.waitForTimeout(11000);
 expect(await stage.evaluate(e=>e.getAnimations({subtree:true}).filter(a=>a.playState==='running').length)).toBe(0);
 await page.screenshot({path:resolve(output,'rest-real-time.png')});
 await enter();await expect(stage).toHaveAttribute('data-quiet','false');
 // Controlled lifecycle event exercises the existing App visibility owner.
 await page.evaluate(()=>{Object.defineProperty(document,'visibilityState',{configurable:true,get:()=> 'hidden'});Object.defineProperty(document,'hidden',{configurable:true,get:()=>true});document.dispatchEvent(new Event('visibilitychange'));});
 await expect(stage).toHaveAttribute('data-quiet','true');
 await page.evaluate(()=>{delete (document as any).visibilityState;delete (document as any).hidden;document.dispatchEvent(new Event('visibilitychange'));});
 await expect(stage).toHaveAttribute('data-quiet','true');expect(await stage.evaluate(e=>e.getAnimations({subtree:true}).length)).toBe(0);
 await enter();await page.emulateMedia({reducedMotion:'reduce'});await expect(stage).toHaveAttribute('data-quiet','true');
 await page.emulateMedia({reducedMotion:'no-preference'});await expect(stage).toHaveAttribute('data-quiet','true');
 expect(await stage.evaluate(e=>e.getAnimations({subtree:true}).length)).toBe(0);
 await page.setViewportSize({width:780,height:312});await expect(page.getByRole('button',{name:/^Next maze/})).toBeInViewport();
 await page.getByRole('button',{name:'Stay here',exact:true}).click();await expect(stage).toHaveCount(0);await expect(page.locator('.confetti-piece')).toHaveCount(0);
});

for(const width of [780,1280])test(`DELIGHT24 enlarged text retains actions ${width}`,async({page})=>{
 await page.setViewportSize({width,height:width===780?312:720});
 await page.addInitScript(({f,keys})=>{localStorage.setItem(keys.run,JSON.stringify(f.snapshot));localStorage.setItem(keys.progress,JSON.stringify(f.progress));},{f:fixtures.all,keys:{run:ACTIVE_RUN_STORAGE_KEY,progress:PLAYER_PROGRESS_STORAGE_KEY}});
 await page.goto('/');await page.addStyleTag({content:'html {font-size:24px !important}'});await page.getByRole('button',{name:'Play',exact:true}).click();await page.getByRole('button',{name:/^Continue/}).click();
 for(const name of [/^Next maze/,'Stay here','Restart'])await expect(page.getByRole('button',{name,exact:typeof name==='string'})).toBeInViewport();
 const body=page.locator('.dialog-celebration .dialog-body');await body.evaluate(e=>e.scrollTop=e.scrollHeight);
 await expect(page.locator('.dialog-celebration .adventure-level')).toBeInViewport();
 await page.screenshot({path:resolve(output,`large-text-${width}.png`)});await page.getByRole('button',{name:'Stay here',exact:true}).click();await expect(page.locator('.victory-stage')).toHaveCount(0);
});

test('DELIGHT24 future profile stays temporary and byte-protected',async({page})=>{
 const future=JSON.stringify({...fixtures.all.progress,schemaVersion:999,futurePayload:'preserve me'});
 await page.addInitScript(({future,key})=>localStorage.setItem(key,future),{future,key:PLAYER_PROGRESS_STORAGE_KEY});
 // A protected future profile deliberately cannot resume a saved normal run.
 // Exercise its actual fresh temporary adventure, rather than bypassing it.
 await page.goto('/');await page.getByRole('button',{name:'Play',exact:true}).click();
 await page.getByRole('button',{name:/Begin adventure/}).click();await page.getByRole('button',{name:'Start the maze',exact:true}).click();
 const first=CURATED_LEVELS[0]!;
 for(const step of deriveRoute(first,solveLevel(first,{avoidAnimals:true}).directions))await replayRouteStep(page,step);
 await expect(page.locator('.dialog-celebration')).toContainText('Temporary reward');await expect(page.locator('.dialog-celebration')).not.toContainText('Ready to record');
 await page.getByRole('button',{name:/^Next maze/}).click();
 expect(await page.evaluate(k=>localStorage.getItem(k),PLAYER_PROGRESS_STORAGE_KEY)).toBe(future);
});

test('DELIGHT24 tester completion celebrates without recording rewards',async({page})=>{
 await page.setViewportSize({width:844,height:390});
 const first=CURATED_LEVELS[0]!;await selectTesterLevel(page,first);
 const before=await page.evaluate(k=>localStorage.getItem(k),PLAYER_PROGRESS_STORAGE_KEY);
 for(const step of deriveRoute(first,solveLevel(first,{requireAllAnimals:true}).directions))await replayRouteStep(page,step);
 await expect(page.locator('.victory-stage')).toBeVisible();
 await expect(page.locator('.dialog-celebration')).not.toContainText('Ready to record');
 await expect(page.locator('.dialog-celebration .adventure-level')).toHaveCount(0);
 await page.getByRole('button',{name:/^Next test maze/}).click();
 expect(await page.evaluate(k=>localStorage.getItem(k),PLAYER_PROGRESS_STORAGE_KEY)).toBe(before);
});
