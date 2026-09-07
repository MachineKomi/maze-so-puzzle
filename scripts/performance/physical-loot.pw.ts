import { test, expect } from '@playwright/test';
import { mkdir, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { findInputFixture, savedFixture } from './v22-input-fixtures';
import { ACTIVE_RUN_STORAGE_KEY, VERSION_THREE_ACTIVE_RUN_STORAGE_KEY } from '../../src/session';
import { PLAYER_PROGRESS_STORAGE_KEY, createDefaultPlayerProgress } from '../../src/progress';
import { PRESENTATION_PREFERENCES_KEY, DEFAULT_PRESENTATION_PREFERENCES } from '../../src/motion';
import { gameplayFingerprintForRules } from '../../src/game/contentIdentity';
import { legacyCreditedLoot } from '../../src/game/loot';

const output=resolve(process.env.MAZE_PERF_EVIDENCE_DIR!,'physical-loot');
const fixtures=['gold','science'].map(currency=>findInputFixture(events=>events.some(e=>e.type==='treasure-opened'&&e.currency===currency))!);
test.beforeAll(async()=>{await mkdir(output,{recursive:true});expect(fixtures.every(Boolean)).toBe(true);});
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
