import { test, expect } from '@playwright/test';
import { mkdir, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { findInputFixture, savedFixture } from './v22-input-fixtures';
import { ACTIVE_RUN_STORAGE_KEY } from '../../src/session';
import { PLAYER_PROGRESS_STORAGE_KEY, createDefaultPlayerProgress } from '../../src/progress';
import { PRESENTATION_PREFERENCES_KEY, DEFAULT_PRESENTATION_PREFERENCES } from '../../src/motion';

const output=resolve(process.env.MAZE_PERF_EVIDENCE_DIR!,'enemy-loot');
const f=findInputFixture(events=>events.some(e=>e.type==='enemy-defeated'))!;
const event=f.result.events.find(e=>e.type==='enemy-defeated')!;
const keys={run:ACTIVE_RUN_STORAGE_KEY,progress:PLAYER_PROGRESS_STORAGE_KEY,preferences:PRESENTATION_PREFERENCES_KEY};
test.beforeAll(async()=>{await mkdir(output,{recursive:true});expect(f.before.defeatedEnemyIds).toEqual([]);
  await writeFile(resolve(output,'fixture.json'),JSON.stringify({keys,fixture:f,snapshot:savedFixture(f,'enemy20')},null,2));});

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
    expect(during.loot.sources).toHaveLength(2);expect(during.loot.sources.every((s:any)=>s.objectId===event.objectId&&s.credited===0)).toBe(true);
    await expect(page.locator('.battle-presentation')).toHaveCount(0);
    await page.waitForTimeout(180);
    const burst=await read();expect(burst.goldStarsCollected+burst.sciencePointsCollected).toBe(0);
    const label=`${quality}-${motion}-${width}-${noCanvas}`;
    await page.screenshot({path:resolve(output,`${label}-burst.png`)});
    await page.waitForTimeout(1800);const settled=await read();
    expect(settled.loot.sources.map((s:any)=>s.currency).sort()).toEqual(['gold','science']);
    for(const source of settled.loot.sources) expect(source.credited+source.drops.reduce((n:number,d:any)=>n+d.amount,0)).toBe(during.loot.sources.find((s:any)=>s.sourceId===source.sourceId).amount);
    const samples=await page.evaluate(()=>(window as any).enemySamples as any[]);
    expect(samples.some(s=>s.battle)).toBe(true);expect(samples.filter(s=>s.battle).every(s=>s.loot===0)).toBe(true);
    expect(samples.some(s=>!s.battle&&s.loot>0)).toBe(true);expect(samples.every(s=>s.tokens<=(quality==='lite'?12:24))).toBe(true);
    await page.screenshot({path:resolve(output,`${label}-settled.png`)});
    await enter();await page.waitForTimeout(1000);expect(await read()).toEqual(settled);
    // Enter the real cleared enemy square; never teleport toward a reward.
    await page.keyboard.press(`Arrow${f.direction[0]!.toUpperCase()}${f.direction.slice(1)}`);await page.waitForTimeout(1300);
    const approached=await read();expect(approached.defeatedEnemyIds).toEqual(settled.defeatedEnemyIds);
    expect(approached.power).toBe(settled.power);expect(approached.loot.sources).toHaveLength(2);
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
  expect(after.loot.sources).toHaveLength(2);
  for(const source of after.loot.sources)expect(source.credited+source.drops.reduce((n:number,d:any)=>n+d.amount,0))
    .toBe(during.loot.sources.find((s:any)=>s.sourceId===source.sourceId).amount);
  await writeFile(resolve(output,'battle-reload.json'),JSON.stringify({during,after},null,2));
});
