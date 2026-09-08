import {test,expect,type Page} from '@playwright/test';
import {mkdir,writeFile} from 'node:fs/promises';
import {resolve} from 'node:path';
import {CURATED_LEVELS} from '../../src/game/levels';
import {createInitialGameState,movePlayer} from '../../src/game/engine';
import {solveLevel,progressionStateSignature} from '../../src/game/solver';
import {getProgressiveHint} from '../../src/game/hints';
import {DIRECTIONS,type Direction,type GameState,type LevelDefinition} from '../../src/game/types';
import {ACTIVE_RUN_STORAGE_KEY,createActiveRunSnapshot} from '../../src/session';
import {PLAYER_PROGRESS_STORAGE_KEY,createDefaultPlayerProgress} from '../../src/progress';
import {PRESENTATION_PREFERENCES_KEY,DEFAULT_PRESENTATION_PREFERENCES} from '../../src/motion';
import {storyRescueLine,storyForLevel} from '../../src/story';
const out=resolve(process.env.MAZE_PERF_EVIDENCE_DIR!,'learning');
const baseline=process.env.MAZE_LEARN_BASELINE==='1';
const arrow=(d:Direction)=>`Arrow${d[0]!.toUpperCase()}${d.slice(1)}`;
const keys={run:ACTIVE_RUN_STORAGE_KEY,progress:PLAYER_PROGRESS_STORAGE_KEY,prefs:PRESENTATION_PREFERENCES_KEY};
type Fixture={level:LevelDefinition;game:GameState;direction?:Direction};
function encounter(index:number):Fixture{
 const level=CURATED_LEVELS[index]!,initial=createInitialGameState(level,`run-learn28-${index}`);
 const pots=new Set(level.objects.filter(o=>o.kind==='potion').map(o=>o.id)),queue=[initial],seen=new Set<string>();
 for(let head=0;head<queue.length&&head<4096;head++)for(const direction of DIRECTIONS){
  const game=queue[head]!,r=movePlayer(level,game,direction);
  if(r.events.some(e=>e.type==='enemy-too-strong'))return {level,game,direction};
  const signature=progressionStateSignature(r.state,pots);if(!seen.has(signature)&&r.state.status==='playing'){seen.add(signature);queue.push(r.state);}
 }
 throw Error('Missing authored underpowered witness '+index);
}
function ending(index:number,perfect:boolean|'partial'):Fixture{
 const level=CURATED_LEVELS[index]!;let game=createInitialGameState(level,`run-learn28-end-${index}`);
 if(perfect==='partial')for(const direction of solveLevel(level,{requireAllAnimals:true}).directions){game=movePlayer(level,game,direction).state;if(game.rescuedAnimalIds.length===1)break;}
 const route=solveLevel(level,perfect===true?{requireAllAnimals:true}:{initialState:game,avoidAnimals:true}).directions;
 for(const direction of route.slice(0,-1))game=movePlayer(level,game,direction).state;
 if(movePlayer(level,game,route.at(-1)!).state.status!=='won')throw Error('No actual win');
 return {level,game,direction:route.at(-1)};
}
const powers=[encounter(6),encounter(15)];
const hints:Record<string,Fixture>={};
for(const index of [1,2,8,9,12]){
 const level=CURATED_LEVELS[index]!;let game=createInitialGameState(level,`run-learn28-hint-${index}`);
 for(const direction of solveLevel(level,{avoidAnimals:true}).directions){
  const r=movePlayer(level,game,direction);
  if(r.events.some(e=>!['moved','animal-rescued','treasure-opened'].includes(e.type))){
   const hint=getProgressiveHint(level,game,0);hints[hint.picture]??={level,game};
  }
  game=r.state;
 }
}
test.beforeAll(async()=>{await mkdir(out,{recursive:true});await writeFile(resolve(out,'fixtures.json'),JSON.stringify({powers,hints},null,2));});
test.beforeEach(({page})=>{const errors:string[]=[];page.on('pageerror',e=>errors.push(e.message));(page as any).learnErrors=errors;});
test.afterEach(async({page},info)=>{const errors=(page as any).learnErrors;await writeFile(resolve(out,info.title.replace(/[^a-z0-9]+/gi,'-')+'-errors.json'),JSON.stringify(errors));expect(errors).toEqual([]);});
async function enter(page:Page,f:Fixture,{large=false,quality='full',motion='reduced'}={}){
 const snapshot=createActiveRunSnapshot({runId:f.game.loot.runId,mode:'normal',level:f.level,game:f.game,revealedTiles:[]});if(!snapshot)throw Error('Invalid witness');
 await page.clock.install();await page.clock.pauseAt(new Date(Date.now()+1000));
 await page.addInitScript(({snapshot,keys,large,quality,motion,prefs,progress})=>{
  if(sessionStorage.getItem('learn28'))return;
  localStorage.setItem(keys.run,JSON.stringify(snapshot));localStorage.setItem(keys.progress,JSON.stringify(progress));
  localStorage.setItem(keys.prefs,JSON.stringify({...prefs,quality,motion,musicVolume:0,sfxVolume:0}));sessionStorage.setItem('learn28','1');
 },{snapshot,keys,large,quality,motion,prefs:DEFAULT_PRESENTATION_PREFERENCES,progress:createDefaultPlayerProgress(CURATED_LEVELS.length)});
 await page.goto('/');await page.getByRole('button',{name:'Play',exact:true}).click();await page.getByRole('button',{name:/^Continue/}).click();
 if(large)await page.addStyleTag({content:'html {font-size:32px !important}'});
}
async function read(page:Page){return page.evaluate(k=>JSON.parse(localStorage.getItem(k)!),keys.run);}
async function capture(page:Page,name:string){
 await page.evaluate(async()=>{await document.fonts.ready;await Promise.all([...document.images].map(i=>i.decode().catch(()=>{})));});
 const geometry=await page.locator('[role="dialog"]').evaluate(e=>{
  const r=e.getBoundingClientRect();return {rect:r.toJSON(),width:innerWidth,height:innerHeight,overflow:e.scrollWidth>e.clientWidth+1,
   images:[...e.querySelectorAll('img')].map(i=>({src:i.currentSrc,rect:i.getBoundingClientRect().toJSON(),ok:i.complete&&i.naturalWidth>0})),
   actions:[...e.querySelectorAll('button')].map(b=>({text:b.textContent,rect:b.getBoundingClientRect().toJSON()}))};
 });
 await page.screenshot({path:resolve(out,name+'.png')});await writeFile(resolve(out,name+'.json'),JSON.stringify(geometry,null,2));
 expect(geometry.rect.left).toBeGreaterThanOrEqual(0);expect(geometry.rect.right).toBeLessThanOrEqual(geometry.width+.1);expect(geometry.rect.bottom).toBeLessThanOrEqual(geometry.height+.1);expect(geometry.overflow).toBe(false);expect(geometry.images.every(i=>i.ok)).toBe(true);
 return geometry;
}
for(const [width,height,large,quality] of [[780,312,false,'full'],[780,312,true,'full'],[960,540,false,'lite'],[1280,720,false,'full'],[1280,720,true,'static']] as const)
test(`learn Power ${width} large${large} ${quality}`,async({page})=>{
 await page.setViewportSize({width,height});const f=powers[0]!;await enter(page,f,{large,quality});const before=await read(page);
 await page.keyboard.press(arrow(f.direction!));await page.clock.runFor(1000);
 await expect(page.getByRole('heading',{name:'Too strong!',exact:true})).toBeVisible();
 const event=movePlayer(f.level,f.game,f.direction!).events.find(e=>e.type==='enemy-too-strong')!;
 if(!baseline){await expect(page.locator('.power-shortfall')).toHaveText(`Need ${event.enemyPower-event.playerPower} more Power`);await expect(page.locator('.modal-lead').filter({hasText:'With the maze weapon'})).toBeVisible();}
 await capture(page,`power-${width}-${large}-${quality}`);
 if(large&&!baseline){await page.locator('.power-search-help').scrollIntoViewIfNeeded();const fits=await page.locator('.power-search-help').evaluate(e=>{const r=e.getBoundingClientRect(),b=e.closest('.dialog-body')!.getBoundingClientRect();return r.top>=b.top-1&&r.bottom<=b.bottom+1;});expect(fits).toBe(true);await capture(page,`power-${width}-${large}-${quality}-scrolled`);}
 await page.keyboard.press('Escape');await page.clock.runFor(1000);expect((await read(page)).game.position).toEqual(before.game.position);
 await page.keyboard.press(arrow(f.direction!));await page.clock.runFor(1000);await expect(page.getByRole('heading',{name:'Too strong!',exact:true})).toBeVisible();
 await page.getByRole('button',{name:'Show Required Path',exact:true}).click();await expect(page.getByRole('heading',{name:'A little hint'})).toBeVisible();
});
test('learn high Power and live opportunity gains',async({page})=>{
 await page.setViewportSize({width:844,height:390});const f=powers[1]!;await enter(page,f);await page.keyboard.press(arrow(f.direction!));
 for(let i=0;i<40&&await page.locator('.power-opportunities').getAttribute('data-search-state')!=='complete';i++)await page.clock.runFor(500);
 await expect(page.locator('.power-opportunities')).toHaveAttribute('data-search-state','complete');
 const event=movePlayer(f.level,f.game,f.direction!).events.find(e=>e.type==='enemy-too-strong')!;
 if(!baseline){await expect(page.locator('.power-shortfall')).toHaveText(`Need ${event.enemyPower-event.playerPower} more Power`);
 for(const card of await page.locator('[data-opportunity-id]').all()){const id=await card.getAttribute('data-opportunity-id'),o=f.level.objects.find(o=>o.id===id)!;expect(['enemy','potion']).toContain(o.kind);await expect(card).toContainText(`Gain ${o.kind==='enemy'?o.power:o.kind==='potion'?o.amount:0} Power`);}}
 await capture(page,'high-power');
});
for(const [picture,f] of Object.entries(hints))test(`learn four hints ${picture}`,async({page})=>{
 await page.setViewportSize({width:780,height:312});await enter(page,f,{large:picture==='springBoots'});const before=await read(page);
 for(let tier=0;tier<4;tier++){
  await page.getByRole('button',{name:/^More/}).click();await page.getByRole('button',{name:'Objective & gentle hint'}).click();
  const expected=getProgressiveHint(f.level,f.game,tier);await expect(page.locator('.hint-card small')).toContainText(`Hint ${tier+1} of 4`);
  if(!baseline){await expect(page.locator('.hint-thought')).toContainText(expected.text.split('. ')[0]);expect(expected.picture).toBe(picture);}
  await capture(page,`hint-${picture}-${tier}`);await page.getByRole('button',{name:'Got it!',exact:true}).click();await page.clock.runFor(500);
  expect((await read(page)).game).toEqual(before.game);
 }
 await page.reload();await page.getByRole('button',{name:'Play',exact:true}).click();await page.getByRole('button',{name:/^Continue/}).click();
 await page.getByRole('button',{name:/^More/}).click();await page.getByRole('button',{name:'Objective & gentle hint'}).click();await expect(page.locator('.hint-card small')).toContainText('Hint 4 of 4');
});
test('learn pending cancellation cannot reopen or replay held movement',async({page})=>{
 await page.setViewportSize({width:844,height:390});const f=powers[0]!;await enter(page,f,{motion:'full'});const before=await read(page);
 await page.keyboard.down(arrow(f.direction!));await expect(page.getByRole('heading',{name:'Too strong!'})).toBeVisible();
 if(!baseline)await expect(page.locator('.power-search-help')).toHaveAttribute('role','status');
 await page.keyboard.press('Escape');await page.clock.runFor(5000);await expect(page.locator('.too-strong-equation')).toHaveCount(0);expect((await read(page)).game).toEqual(before.game);await page.keyboard.up(arrow(f.direction!));
 await page.keyboard.press(arrow(f.direction!));await expect(page.getByRole('heading',{name:'Too strong!'})).toBeVisible();await page.getByRole('button',{name:'I’ll go get stronger.',exact:true}).click();
 await page.getByRole('button',{name:/^More/}).click();await page.getByRole('button',{name:'Home',exact:true}).click();await page.clock.runFor(5000);await expect(page.locator('.power-opportunities')).toHaveCount(0);
});
for(const index of [6,7,8,11])for(const perfect of (index===11?[false,true,'partial']:[false,true]) as (boolean|'partial')[])test(`learn story ${index+1} perfect${perfect}`,async({page})=>{
 await page.setViewportSize({width:780,height:312});const f=ending(index,perfect);await enter(page,f);await page.keyboard.press(arrow(f.direction!));await page.clock.runFor(2200);
 await expect(page.getByRole('heading',{name:'Maze solved!'})).toBeVisible();
 if(!baseline){await expect(page.locator('.story-outro-card')).toContainText(storyForLevel(f.level.id)!.outro);await expect(page.locator('.story-rescue-result')).toHaveText(storyRescueLine(f.game.rescuedAnimalIds.length,f.level.objects.filter(o=>o.kind==='animal').length));}
 await page.locator('.story-outro-card').scrollIntoViewIfNeeded();await capture(page,`story-${index+1}-${perfect}`);
 await page.getByRole('button',{name:'Stay here',exact:true}).click();await page.clock.runFor(500);expect((await read(page)).game.rescuedAnimalIds).toEqual(f.game.rescuedAnimalIds);
});

