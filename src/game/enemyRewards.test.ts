import { describe, expect, it } from "vitest";
import { enemyRewardAmount, enemyRewardRange, ENEMY_REWARD_BANDS } from "./enemyRewards";
import { createInitialGameState, movePlayer } from "./engine";
import { CURATED_LEVELS, parseAsciiLevel } from "./levels";
import { generateSurpriseMaze } from "./generator";
import { authoredLootErrors, beginLootClaims, finishLootClaims, lootFloor, migrateAuthoredLoot, pendingLoot, sanitizeLoot, scatterTreasure } from "./loot";
import { representedLoot } from "../vfx/useLootCollection";
import type { LevelObject } from "./types";

const level = parseAsciiLevel({ id: "enemy-loot", name: "Loot", objective: "Explore",
  map: ["#######", "#@s1.E#", "#.....#", "#.....#", "#.....#", "#.....#", "#######"] });
function defeat(runId = "run-enemy-test-fixed") {
  const before = movePlayer(level,createInitialGameState(level,runId),"right").state;
  return { before, result: movePlayer(level,before,"right") };
}

describe("bounded enemy reward rules", () => {
  it.each([[1,1,2],[3,1,2],[4,2,2],[8,2,2],[9,3,3],[19,3,3],[20,4,2],[99,4,2]])(
    "freezes independent channel vectors at Power %i", (power,gold,science) => {
      expect(enemyRewardAmount("run-golden-rewards","fixture","enemy-a",power!,"gold")).toBe(gold);
      expect(enemyRewardAmount("run-golden-rewards","fixture","enemy-a",power!,"science")).toBe(science);
    });
  it("keeps table endpoints monotonic, samples bounded, and run/source/level channels stable", () => {
    for (const currency of ["gold","science"] as const) {
      for (let i=1;i<ENEMY_REWARD_BANDS.length;i++) for (const end of [0,1] as const)
        expect(ENEMY_REWARD_BANDS[i]![currency][end]).toBeGreaterThanOrEqual(ENEMY_REWARD_BANDS[i-1]![currency][end]);
      const seen = new Set<number>();
      for (let i=0;i<200;i++) {
        const args = [`run-sample-${i}`, "level", "enemy", 99, currency] as const;
        const value = enemyRewardAmount(...args), [min,max] = enemyRewardRange(99,currency);
        expect(value).toBeGreaterThanOrEqual(min); expect(value).toBeLessThanOrEqual(max);
        // Calling the other channel never advances an RNG stream.
        enemyRewardAmount(...[args[0],args[1],args[2],args[3],currency === "gold" ? "science" : "gold"] as const);
        expect(enemyRewardAmount(...args)).toBe(value); seen.add(value);
      }
      expect(seen.size).toBe(enemyRewardRange(99,currency)[1]-enemyRewardRange(99,currency)[0]+1);
    }
  });
  it.each([0,-1,Infinity,NaN,1.5,Number.MAX_SAFE_INTEGER+1])("rejects invalid Power %s", power => {
    expect(()=>enemyRewardRange(power,"gold")).toThrow();
  });
  it("commits both currencies at successful defeat, preserves immediate Power and never repeats", () => {
    const { before,result }=defeat();
    expect(result.moved).toBe(false); expect(result.state.position).toEqual(before.position);
    expect(result.state.power).toBe(before.power+1); expect(result.state.steps).toBe(before.steps);
    const sources=result.state.loot.sources;
    expect(sources.map(s=>s.currency).sort()).toEqual(["gold","science"]);
    expect(sources.every(s=>s.sourceKind === "enemy" && s.objectId===result.state.defeatedEnemyIds[0] && s.credited===0)).toBe(true);
    expect(result.state.goldStarsCollected+result.state.sciencePointsCollected).toBe(0);
    expect(sanitizeLoot(result.state.loot,level,result.state)).toEqual(result.state.loot);
    expect(movePlayer(level,result.state,"right").state.loot).toBe(result.state.loot);
    expect(defeat().result.state).toEqual(result.state);
    expect(new Set(sources.flatMap(s=>s.drops.map(d=>JSON.stringify(d.at)))).size).toBe(sources.flatMap(s=>s.drops).length);
  });
  it("cannot earn drops without a sword or enough Power", () => {
    const {before}=defeat();
    for(const changed of [{...before,hasSword:false},{...before,power:0}]) {
      const result=movePlayer(level,changed,"right");expect(result.state).toBe(changed);expect(result.state.loot.sources).toEqual([]);
    }
  });
  it("conserves accepted value exactly once and rejects forged enemy attribution", () => {
    let game=defeat().result.state; const original=game, total=pendingLoot(game), source=game.loot.sources[0]!;
    for(const change of [{...source,amount:source.amount+1},{...source,objectId:"foreign"},
      {...source,sourceKind:"treasure"},{...source,currency:source.currency==="gold"?"science":"gold"}])
      expect(sanitizeLoot({...game.loot,sources:[change,...game.loot.sources.slice(1)]},level,game)).toBeNull();
    for(const sources of [[],[source,source]]) expect(sanitizeLoot({...game.loot,sources},level,game)).toBeNull();
    expect(sanitizeLoot({...game.loot,legacyRetiredEnemyIds:game.defeatedEnemyIds},level,game)).toBeNull();
    expect(sanitizeLoot({...game.loot,legacyRetiredEnemyIds:["foreign"]},level,game)).toBeNull();
    expect(sanitizeLoot(game.loot,level,{...game,defeatedEnemyIds:[]})).toBeNull();
    for(const drop of original.loot.sources.flatMap(s=>s.drops)) {
      expect(lootFloor(level,game,drop.at)).toBe(true);
      game=finishLootClaims(beginLootClaims(level,game,[{id:drop.id,elapsedMs:750}],drop.at));
    }
    expect(pendingLoot(game)).toBe(0);expect(game.goldStarsCollected+game.sciencePointsCollected).toBe(total);
    expect(finishLootClaims(game)).toBe(game);expect(sanitizeLoot(game.loot,level,game)).toEqual(game.loot);
  });
  it("reserves both final channels at exactly64 and rejects65 before play", () => {
    const terrain=Array.from({length:19},(_,y)=>Array.from({length:19},(_,x)=>!x||!y||x===18||y===18?"wall" as const:"floor" as const));
    const objects:LevelObject[]=Array.from({length:32},(_,i)=>({id:`enemy-${i}`,kind:"enemy",power:99,style:"blueberry-slime",at:{x:2+i%15,y:2+Math.floor(i/15)}}));
    const fixture={...level,width:19,height:19,terrain,objects,exit:{x:17,y:17}};
    let game=createInitialGameState(fixture);
    for(const object of objects) if(object.kind==="enemy") {
      game={...game,defeatedEnemyIds:[...game.defeatedEnemyIds,object.id]};game={...game,loot:scatterTreasure(fixture,game,object)};
      expect(game.loot.sources.flatMap(s=>s.drops).length).toBeLessThanOrEqual(64);
    }
    expect(game.loot.sources).toHaveLength(64);expect(game.loot.sources.flatMap(s=>s.drops)).toHaveLength(64);
    expect(sanitizeLoot(game.loot,fixture,game)).not.toBeNull();
    expect(authoredLootErrors({...fixture,objects:[...objects,{id:"extra",kind:"treasure",amount:1,currency:"gold",style:"gold-chest",at:{x:17,y:16}}]}).join()).toContain("64");
  });
  it("audits the current49 ordinary-enemy supply envelope separately from the disguised Mimic", () => {
    const enemies=CURATED_LEVELS.flatMap(l=>l.objects.filter(o=>o.kind==="enemy"));expect(enemies).toHaveLength(49);
    expect(["gold","science"].map(c=>[0,1].map(i=>enemies.reduce((n,o)=>n+enemyRewardRange(o.power,c as "gold"|"science")[i]!,0))))
      .toEqual([[98,196],[62,114]]);
    for(const current of CURATED_LEVELS) {
      expect(authoredLootErrors(current),current.id).toEqual([]);
      // Even the worst legal v4 treasure state leaves room for every new enemy channel.
      expect(current.objects.reduce((n,o)=>n+(o.kind==="treasure"?4:o.kind==="enemy"?2:0),0)).toBeLessThanOrEqual(64);
    }
  });
  it("compacts only grounded legacy value when future channels need space",()=>{
    const terrain=Array.from({length:19},(_,y)=>Array.from({length:19},(_,x)=>!x||!y||x===18||y===18?"wall" as const:"floor" as const));
    const treasures=Array.from({length:16},(_,i)=>({id:`treasure-${i}`,kind:"treasure" as const,currency:"gold" as const,amount:8,style:"gold-chest" as const,at:{x:2+i%8,y:2+Math.floor(i/8)}}));
    const fixture={...level,width:19,height:19,terrain,objects:[...treasures,{id:"future-enemy",kind:"enemy" as const,power:1,at:{x:16,y:16}}]};
    const game={...createInitialGameState(fixture),collectedObjectIds:treasures.map(t=>t.id)};
    const legacy={version:1,sources:treasures.map(o=>({sourceId:o.id,currency:o.currency,amount:8,credited:0,
      drops:[0,1,2,3].map(i=>({id:`${o.id}/${i}`,at:o.at,amount:2,phase:"grounded"}))}))};
    const migrated=migrateAuthoredLoot(legacy,fixture,game,game.loot.runId)!;
    expect(migrated).not.toBeNull();expect(pendingLoot(migrated)).toBe(128);expect(migrated.goldStarsCollected).toBe(0);
    expect(migrated.loot.sources.flatMap(s=>s.drops).length).toBeLessThanOrEqual(62);
    const enemy=fixture.objects.at(-1)!;if(enemy.kind!=="enemy")throw Error("fixture");
    const resolved={...migrated,defeatedEnemyIds:[enemy.id]};
    const next={...resolved,loot:scatterTreasure(fixture,resolved,enemy)};
    expect(next.loot.sources.filter(s=>s.sourceKind==="enemy")).toHaveLength(2);
    expect(sanitizeLoot(next.loot,fixture,next)).not.toBeNull();
  });
  it("rejects potential source-key collisions before consuming any source",()=>{
    const enemy=level.objects.find(o=>o.kind==="enemy")!;
    const collision={id:JSON.stringify(["enemy",enemy.id,"gold"]),kind:"treasure" as const,amount:1,currency:"gold" as const,style:"gold-chest" as const,at:{x:4,y:3}};
    expect(()=>createInitialGameState({...level,objects:[...level.objects,collision]})).toThrow("identities");
  });
  it.each([8,20])("makes the released encounter readable at %i-slot saturation, preserving accepted claims",limit=>{
    const game=defeat().result.state, fresh=game.loot.sources;
    const old={...fresh[0]!,sourceId:"old",objectId:"old",drops:Array.from({length:limit},(_,i)=>({id:`old/${i}`,amount:1,phase:"grounded" as const,at:{x:2,y:2}}))};
    const saturated={...game,loot:{...game.loot,sources:[old,...fresh]}};
    const prior=new Set(old.drops.map(d=>d.id)), enemy=game.defeatedEnemyIds[0]!;
    expect([...representedLoot(saturated,prior,game.position,limit,enemy)]).toEqual([...prior]);
    const visible=representedLoot(saturated,prior,game.position,limit,undefined,enemy);
    for(const s of fresh)expect(s.drops.some(d=>visible.has(d.id))).toBe(true);
    const claimed={...saturated,loot:{...saturated.loot,sources:[{...old,drops:old.drops.map(d=>({...d,phase:"claiming" as const}))},...fresh]}};
    expect(representedLoot(claimed,prior,game.position,limit,undefined,enemy)).toEqual(prior);
  });
  it.each(["movement","growing","adventure"] as const)("keeps generated %s rewards in capacity and deterministic", difficulty => {
    for(const size of [9,17,23]) for(const seed of ["loot-audit-1","loot-audit-2"]) {
      const current=generateSurpriseMaze({seed,difficulty,size});expect(authoredLootErrors(current)).toEqual([]);
      for(const object of current.objects) if(object.kind==="enemy") for(const currency of ["gold","science"] as const)
        expect(enemyRewardAmount("run-generated-audit",current.id,object.id,object.power,currency)).toBeGreaterThan(0);
    }
  },30_000);
});
