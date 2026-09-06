import { test,expect } from '@playwright/test';
import { mkdir,writeFile } from 'node:fs/promises';
import {resolve} from 'node:path';
const output=resolve(process.env.MAZE_PERF_EVIDENCE_DIR!,'wall-sprite-rack');
test.beforeAll(async()=>{await mkdir(output,{recursive:true});});
for(const query of ['all&theme=8','all&theme=0','light=bottom-left&theme=9','light=top-right&theme=15','art&start=0','art&start=16','art&weapons','art&enemies','art&items','art&cage=0','art&cage=1','art&cage=2','art&cage=3']) test(`WALL04C artwork rack ${query}`,async({browser})=>{
 const context=await browser.newContext({viewport:{width:1050,height:900},deviceScaleFactor:2});
 try{
  const page=await context.newPage(),errors:string[]=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto(`http://127.0.0.1:1421/scripts/art_review/wall-sprite-lab.html?${query}`);
  await page.evaluate(async()=>{await document.fonts.ready;await Promise.all([...document.images].map(i=>i.decode()));});
  await page.waitForTimeout(400);
  const result=await page.evaluate(()=>({images:[...document.images].map(i=>({id:i.dataset.artId,field:i.dataset.fieldLayout,src:i.currentSrc,natural:i.naturalWidth,
   canvas:i.getBoundingClientRect().width,physical:i.getBoundingClientRect().width*devicePixelRatio,sufficient:i.dataset.artResolutionSufficient,
   alpha:i.dataset.artVisibleBounds,broken:!i.naturalWidth})),foreground:document.querySelectorAll('.maze-foreground').length}));
  const name=query.replaceAll(/[&=]/g,'-');
  await writeFile(resolve(output,`${name}.json`),JSON.stringify({errors,...result},null,2));
  await page.screenshot({path:resolve(output,`${name}.png`),fullPage:true});
  expect(errors).toEqual([]); expect(result.images.every(i=>!i.broken)).toBe(true);
  for(const i of result.images.filter(i=>i.field)) {
   const bounds=i.alpha!.split(',').map(Number);expect(i.canvas*bounds[2]!).toBeGreaterThan(70);
   if(i.physical>i.natural+2) {
    // These existing delivered items have no approved larger rendition. Keep
    // the explicit measured exception visible; don't invent or soften proof.
    expect(['power-potion','gold-bag','gold-chest','science-gears','science-beaker']).toContain(i.id);
    expect(i.sufficient).toBe('false'); expect(i.physical/i.natural).toBeLessThan(1.35);
   }
  }
 }finally{await context.close();}
});
