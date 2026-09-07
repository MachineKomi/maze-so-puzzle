import { describe, expect, it } from "vitest";
import { lootPose, lootReadableDelay, representedLoot, type LootMotion } from "./useLootCollection";
import { createInitialGameState } from "../game/engine";
import { CURATED_LEVELS } from "../game/levels";
import type { LootLedger } from "../game/loot";

describe("physical loot presentation boundary",()=>{
  it.each([350,500,550])("leaves at least250ms settled after a%sms throw",scatterMs=>{
    const motion:LootMotion={born:0,scatterMs,angle:0,path:[{x:1,y:1},{x:2,y:1}]};
    expect(lootReadableDelay(motion)).toBeGreaterThanOrEqual(scatterMs+250);
    expect(lootReadableDelay(motion)).toBeGreaterThanOrEqual(750);
  });
  it("follows both cardinal legs around a corner and comes to rest",()=>{
    const motion:LootMotion={born:0,scatterMs:500,angle:1,path:[{x:1,y:1},{x:2,y:1},{x:2,y:2}]};
    for(let now=0;now<=500;now+=5){const pose=lootPose(motion,{x:2,y:2},{x:1,y:1},now,true);
      expect(pose.x===2.5||pose.y===1.5).toBe(true);expect(pose.lift).toBeGreaterThanOrEqual(0);expect(pose.lift).toBeLessThanOrEqual(.11);}
    expect(lootPose(motion,{x:2,y:2},{x:1,y:1},501,true)).toMatchObject({x:2.5,y:2.5,lift:0,moving:false});
  });
  it("holds a stable Lite set, releases distant slots on approach and prioritizes accepted claims",()=>{
    const loot:LootLedger={version:1,sources:[{sourceId:"capacity",currency:"gold",amount:12,credited:0,
      drops:Array.from({length:12},(_,i)=>({id:String(i),amount:1,at:{x:i,y:2},phase:"grounded"}))}]};
    const game={...createInitialGameState(CURATED_LEVELS[0]!),loot};
    const first=representedLoot(game,new Set(),{x:3,y:2},8);
    expect(first.size).toBe(8);expect(representedLoot(game,first,{x:3.5,y:2},8)).toEqual(first);
    const moved=representedLoot(game,first,{x:10,y:2},8);
    expect(moved.has("0")).toBe(false);expect(moved.has("11")).toBe(true);
    const claiming={...game,loot:{...loot,sources:[{...loot.sources[0]!,drops:loot.sources[0]!.drops.map(d=>d.id==="0"?{...d,phase:"claiming" as const}:d)}]}};
    expect(representedLoot(claiming,moved,{x:10,y:2},8).has("0")).toBe(true);
  });
});
