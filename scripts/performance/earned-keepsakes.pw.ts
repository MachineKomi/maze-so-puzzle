import {test,expect,type Page} from '@playwright/test';
import {mkdir,writeFile} from 'node:fs/promises';
import {resolve} from 'node:path';
import {CURATED_LEVELS} from '../../src/game/levels';
import {createInitialGameState,movePlayer} from '../../src/game/engine';
import {solveLevel} from '../../src/game/solver';
import {getCameraWindow} from '../../src/game/exploration';
import {ACTIVE_RUN_STORAGE_KEY,createActiveRunSnapshot} from '../../src/session';
import {PLAYER_PROGRESS_STORAGE_KEY,createDefaultPlayerProgress} from '../../src/progress';
import {PRESENTATION_PREFERENCES_KEY,DEFAULT_PRESENTATION_PREFERENCES} from '../../src/motion';
import {selectTesterLevel} from './gameplay-browser';
const out=resolve(process.env.MAZE_PERF_EVIDENCE_DIR!,'earned-keepsakes');
const baseline=process.env.MAZE_KEEPSAKE_BASELINE==='1';
const keys={run:ACTIVE_RUN_STORAGE_KEY,progress:PLAYER_PROGRESS_STORAGE_KEY,prefs:PRESENTATION_PREFERENCES_KEY};
function fixture(index=0){
 const level=CURATED_LEVELS[index]!;let game=createInitialGameState(level,`run-keepsake27-${index}`),before=game;
 const route=solveLevel(level,{requireAllAnimals:true}).directions;
 for(const d of route){before=game;game=movePlayer(level,game,d).state;}
 if(game.status!=='won')throw Error('Expected actual won route');
 return {level,game,before,last:route.at(-1)!,snapshot:createActiveRunSnapshot({runId:game.loot.runId,mode:'normal',level,game:before,revealedTiles:[]})!};
}
const first=fixture(),last=fixture(CURATED_LEVELS.length-1);
const arrow=(d:string)=>`Arrow${d[0]!.toUpperCase()}${d.slice(1)}`;
test.beforeAll(async()=>{await mkdir(out,{recursive:true});await writeFile(resolve(out,'fixtures.json'),JSON.stringify({first,last},null,2));});
async function enter(page:Page,{f=first,quality='full',motion='full',failure='',future=false,tester=false}:any={}){
 await page.clock.install();await page.clock.pauseAt(new Date(Date.now()+1000));
 await page.addInitScript(({f,keys,quality,motion,failure,future,tester,prefs,progress})=>{
  if(!sessionStorage.getItem('keepsake27')){
   localStorage.setItem(keys.run,JSON.stringify({...f.snapshot,mode:tester?'tester':'normal'}));
   localStorage.setItem(keys.progress,JSON.stringify({...progress,...(future?{schemaVersion:999}:{})}));
   localStorage.setItem(keys.prefs,JSON.stringify({...prefs,quality,motion,musicVolume:0,sfxVolume:0}));sessionStorage.setItem('keepsake27','1');
  }
  const set=Storage.prototype.setItem,remove=Storage.prototype.removeItem;
  (window as any).denyKeepsake=false;
  Storage.prototype.setItem=function(k,v){if((window as any).denyKeepsake&&k===(failure==='run-write'?keys.run:failure==='profile-write'?keys.progress:''))throw Error('QA denied');return set.call(this,k,v);};
  Storage.prototype.removeItem=function(k){if((window as any).denyKeepsake&&failure==='run-clear'&&k===keys.run)throw Error('QA denied');return remove.call(this,k);};
 },{f,keys,quality,motion,failure,future,tester,prefs:DEFAULT_PRESENTATION_PREFERENCES,progress:createDefaultPlayerProgress(CURATED_LEVELS.length)});
 await page.goto('/');await page.getByRole('button',{name:'Play',exact:true}).click();
 if(future){await page.getByRole('button',{name:/^Begin adventure/}).click();await page.getByRole('button',{name:'Start the maze',exact:true}).click();for(const d of solveLevel(first.level,{requireAllAnimals:true}).directions.slice(0,-1)){await page.keyboard.press(arrow(d));await page.clock.runFor(2200);}}
 else await page.getByRole('button',{name:/^Continue/}).click();
}
async function win(page:Page,f=first){await page.keyboard.press(arrow(f.last));await page.clock.runFor(1800);await expect(page.locator('.dialog-celebration')).toBeVisible();}
async function next(page:Page){await page.getByRole('button',{name:/^(Next|Surprise) maze/}).click();}
async function start(page:Page){if(await page.locator('.dialog-story').isVisible())await page.getByRole('button',{name:'Start the maze',exact:true}).click();await page.clock.runFor(1050);}
async function read(page:Page){return page.evaluate(k=>JSON.parse(localStorage.getItem(k)!),keys.progress);}
async function capture(page:Page,name:string,index=1){
 await page.evaluate(async()=>{await document.fonts.ready;await Promise.all([...document.images].map(i=>i.decode().catch(()=>{})));});
 const geometry=await page.evaluate(()=>{
  const board=document.querySelector<HTMLElement>('.maze-board')!,card=document.querySelector<HTMLElement>('.earned-keepsake');
  const rect=(e:Element)=>e.getBoundingClientRect().toJSON();
  return {board:rect(board),card:card?rect(card):null,columns:Number(board.style.getPropertyValue('--grid-size')),rows:Number(board.style.getPropertyValue('--grid-rows')),
   art:card?rect(card.querySelector('img')!):null,overflow:card?[card.scrollWidth>card.clientWidth,card.scrollHeight>card.clientHeight]:[],
   animations:card?card.getAnimations({subtree:true}).map(a=>({state:a.playState,end:a.effect!.getComputedTiming().endTime})):[],
   pointer:card?getComputedStyle(card).pointerEvents:null,
   hud:rect(document.querySelector('.adventure-hud')!),pad:rect(document.querySelector('.thumb-pad')!)};
 });
 await page.screenshot({path:resolve(out,`${name}.png`)});await writeFile(resolve(out,`${name}.json`),JSON.stringify(geometry,null,2));
 if(baseline)return geometry;
 const b=geometry.board,c=geometry.card!;expect(c).toBeTruthy();expect(c.x).toBeGreaterThanOrEqual(b.x);expect(c.right).toBeLessThanOrEqual(b.right);expect(c.y).toBeGreaterThanOrEqual(b.y);expect(c.bottom).toBeLessThanOrEqual(b.bottom);
 expect(geometry.pointer).toBe('none');expect(geometry.overflow).toEqual([false,false]);expect(geometry.art!.height).toBeGreaterThan(40);
 const level=CURATED_LEVELS[index]!,camera=getCameraWindow(level,level.start,{width:geometry.columns,height:geometry.rows});
 const x=b.x+(level.start.x-camera.left+.5)*b.width/geometry.columns,y=b.y+(level.start.y-camera.top+.5)*b.height/geometry.rows;
 const rx=1.5*b.width/geometry.columns,ry=1.5*b.height/geometry.rows;
 expect(c.right<x-rx||c.x>x+rx||c.bottom<y-ry||c.y>y+ry,'Card clears nearby player tiles').toBe(true);
 return geometry;
}
for(const [width,height,layout,quality,motion] of [
 [844,390,'expanded','full','full'],[844,390,'folded','full','full'],[844,390,'classic','full','full'],
 [1280,720,'expanded','full','full'],[1280,720,'classic','full','full'],[780,312,'folded','full','full'],
 [844,390,'expanded','lite','full'],[844,390,'folded','full','reduced'],[1280,720,'expanded','static','full'],
] as const)test(`keepsake ${width} ${layout} ${quality}/${motion}`,async({page})=>{
 await page.setViewportSize({width,height});await enter(page,{quality,motion});
 if(layout==='folded')await page.getByRole('button',{name:'Fold sidebar',exact:true}).click();
 if(layout==='classic'){await page.getByRole('button',{name:/^More/}).click();await page.getByRole('button',{name:'Use classic square view'}).click();}
 const before=await read(page);await win(page);await expect(page.locator('.earned-keepsake')).toHaveCount(0);expect((await read(page)).gold).toBe(before.gold);
 await next(page);const saved=await read(page);expect(saved.stickers).toContain('first-star');expect(saved.stickers).toContain('animal-friend');
 await expect(page.locator('.earned-keepsake')).toHaveCount(0);await start(page);
 const g=await capture(page,`${width}-${layout}-${quality}-${motion}`);
 if(!baseline){const count=saved.stickers.length+saved.medals.length+saved.badges.length;await expect(page.locator('.earned-keepsake')).toContainText(`And ${count-1} more`);expect(g.animations.every(a=>Number(a.end)<=900)).toBe(true);if(quality==='static'||motion==='reduced')expect(g.animations).toHaveLength(0);}
 const steps=await page.locator('.step-pill').getAttribute('aria-label');await page.keyboard.press(arrow(solveLevel(CURATED_LEVELS[1]!).directions[0]!));await page.clock.runFor(500);await expect(page.locator('.earned-keepsake')).toHaveCount(0);expect(await page.locator('.step-pill').getAttribute('aria-label')).not.toBe(steps);
 expect((await read(page)).stickers).toEqual(saved.stickers);
});
for(const failure of ['run-write','profile-write','run-clear','future'])test(`keepsake durable boundary ${failure}`,async({page})=>{
 await enter(page,{failure,future:failure==='future'});await win(page);const before=await read(page);
 await page.evaluate(()=>{(window as any).denyKeepsake=true;});await next(page);
 if(failure==='run-write'||failure==='profile-write'){await expect(page.locator('.dialog-celebration')).toBeVisible();expect((await read(page)).stickers).toEqual(before.stickers);await expect(page.locator('.earned-keepsake')).toHaveCount(0);await page.evaluate(()=>{(window as any).denyKeepsake=false;});await next(page);}
 await start(page);
 if(failure==='future'){await expect(page.locator('.earned-keepsake')).toHaveCount(0);expect(await read(page)).toEqual(before);}
 else{await expect(page.locator('.earned-keepsake')).toBeVisible();expect((await read(page)).completionReceipts).toHaveLength(1);}
 await page.reload();await page.getByRole('button',{name:'Play',exact:true}).click();if(await page.getByRole('button',{name:/^Continue/}).count())await page.getByRole('button',{name:/^Continue/}).click();await expect(page.locator('.earned-keepsake')).toHaveCount(0);
});
test('keepsake Stay is unbanked; no delayed earned card',async({page})=>{await enter(page);await win(page);const before=await read(page);await page.getByRole('button',{name:'Stay here',exact:true}).click();await page.clock.runFor(6000);await expect(page.locator('.earned-keepsake')).toHaveCount(0);expect((await read(page)).stickers).toEqual(before.stickers);});
for(const when of ['waiting','active'])test(`keepsake hidden ${when} never resumes`,async({page})=>{
 await enter(page);await win(page);await next(page);if(when==='active')await start(page);
 await page.evaluate(()=>{Object.defineProperty(document,'visibilityState',{configurable:true,get:()=> 'hidden'});document.dispatchEvent(new Event('visibilitychange'));});
 await page.evaluate(()=>{delete (document as any).visibilityState;document.dispatchEvent(new Event('visibilitychange'));});
 await start(page);await expect(page.locator('.earned-keepsake')).toHaveCount(0);
});
test('keepsake rests, expires and does not replay after More',async({page})=>{
 await enter(page);await win(page);await next(page);await start(page);await expect(page.locator('.earned-keepsake')).toBeVisible();await page.clock.runFor(4600);await expect(page.locator('.earned-keepsake')).toHaveCount(0);
 await page.getByRole('button',{name:/^More/}).click();await page.keyboard.press('Escape');await expect(page.locator('.earned-keepsake')).toHaveCount(0);
});
test('keepsake generated destination has no chapter wait',async({page})=>{
 await enter(page,{f:last});await win(page,last);await next(page);await expect(page.locator('.dialog-story')).toHaveCount(0);await page.clock.runFor(1050);await expect(page.locator('.earned-keepsake')).toBeVisible();await page.screenshot({path:resolve(out,'generated-destination.png')});
});
test('keepsake centered Classic start uses narrower large card',async({page})=>{
 const f=fixture(1);await page.setViewportSize({width:780,height:312});await enter(page,{f});
 await page.getByRole('button',{name:/^More/}).click();await page.getByRole('button',{name:'Use classic square view'}).click();
 await win(page,f);await next(page);await start(page);await expect(page.locator('.earned-keepsake')).toHaveAttribute('data-wide','true');await capture(page,'centered-classic',2);
});
test('keepsake active overlay cancels without resume',async({page})=>{
 await enter(page);await win(page);await next(page);await start(page);await expect(page.locator('.earned-keepsake')).toBeVisible();
 await page.getByRole('button',{name:/^More/}).click();await expect(page.locator('.earned-keepsake')).toHaveCount(0);await page.keyboard.press('Escape');await expect(page.locator('.earned-keepsake')).toHaveCount(0);
});
test('keepsake tester completion never admits an earned event',async({page})=>{
 await page.clock.install();await selectTesterLevel(page,first.level);
 for(const d of solveLevel(first.level).directions){await page.keyboard.press(arrow(d));await page.clock.runFor(2200);}
 await expect(page.locator('.dialog-celebration')).toBeVisible();await page.getByRole('button',{name:/^Next test maze/}).click();await page.clock.runFor(1500);await expect(page.locator('.earned-keepsake')).toHaveCount(0);
});
test('keepsake enlarged text and resize cancel cleanly',async({page})=>{
 await page.setViewportSize({width:844,height:390});await enter(page);await page.addStyleTag({content:'html {font-size:24px !important}'});
 await win(page);await next(page);await start(page);await capture(page,'enlarged');await page.setViewportSize({width:1280,height:720});await expect(page.locator('.earned-keepsake')).toHaveCount(0);
});
test('keepsake StrictMode dev expiry retains its timer',async({page})=>{
 test.skip(!!process.env.MAZE_PUBLIC_JUMP_ORIGIN,'Dev-only effect replay');
 await enter(page,{f:last});await page.goto('http://127.0.0.1:1421');await page.getByRole('button',{name:'Play',exact:true}).click();await page.getByRole('button',{name:/^Continue/}).click();
 await win(page,last);await next(page);await page.clock.runFor(1050);await expect(page.locator('.earned-keepsake')).toBeVisible();await page.clock.runFor(4600);await expect(page.locator('.earned-keepsake')).toHaveCount(0);
});
