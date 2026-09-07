import {describe,it,expect} from 'vitest';
import {createDefaultPlayerProgress} from '../progress';
import {earnedKeepsakes,keepsakeCorner} from './earnedKeepsakes';
import {CURATED_LEVELS} from '../game/levels';
import {getCameraWindow} from '../game/exploration';

describe('durable earned keepsake adapter',()=>{
 const before=createDefaultPlayerProgress();
 const after={...before,stickers:['first-star','animal-friend'] as const,medals:['perfect-rescue-5'] as const,badges:['twinkle-toes'] as const};
 it('admits each actual newly saved family, with approved artwork',()=>{
  const items=earnedKeepsakes(before,after,true);
  expect(items.map(i=>i.id)).toEqual(['first-star','animal-friend','perfect-rescue-5','twinkle-toes']);
  expect(items.every(i=>i.art&&i.label)).toBe(true);
 });
 it('never celebrates a denied or unsupported-profile write',()=>expect(earnedKeepsakes(before,after,false)).toEqual([]));
 it('does not replay already recorded awards on retry',()=>expect(earnedKeepsakes(after,after,true)).toEqual([]));
 it('ignores currency-only changes and preserves existing awards',()=>{
  expect(earnedKeepsakes(after,{...after,gold:after.gold+100},true)).toEqual([]);
  expect(earnedKeepsakes({...before,stickers:['first-star']},after,true).map(i=>i.id)).not.toContain('first-star');
 });
 it('clears the protected tiles at every current Classic start',()=>{
  for(const level of CURATED_LEVELS){
   const view=getCameraWindow(level,level.start,6);
   expect(keepsakeCorner(level.start.x-view.left,level.start.y-view.top,view.width,view.height),level.id).not.toBeNull();
  }
 });
 it('fits every whole-tile start in a six-cell generated camera',()=>{
  for(let y=0;y<6;y++)for(let x=0;x<6;x++)expect(keepsakeCorner(x,y,6,6),`${x},${y}`).not.toBeNull();
  expect(keepsakeCorner(2,2,6,6)?.height).toBe(.28);
 });
});
