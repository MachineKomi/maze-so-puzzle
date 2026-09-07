import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { adventureProgress, boundedXp, enemyXp, MAX_ADVENTURE_XP, xpThreshold } from "./game/adventureXp";
import { applyLevelCompletion, createDefaultPlayerProgress, hasUnsupportedProgressProfile, migratePlayerProgress,
  PLAYER_PROGRESS_STORAGE_KEY, readPlayerProgress, writePlayerProgress, type LevelCompletionInput } from "./progress";
import { createInitialGameState, movePlayer, stayAfterPendingCompletion } from "./game/engine";
import { CURATED_LEVELS, LEGACY_CURATED_LEVELS, parseAsciiLevel } from "./game/levels";
import { beginLootClaims, finishLootClaims, migratePreXpLoot, pendingLoot, sanitizeLoot, scatterTreasure } from "./game/loot";
import { enemyRewardAmount } from "./game/enemyRewards";
import { ACTIVE_RUN_STORAGE_KEY, createActiveRunSnapshot, readActiveRunResult, writeActiveRun, clearActiveRun } from "./session";
import { AdventureLevel } from "./ui/AdventureLevel";
import type { GameState } from "./game/types";

const runId="run-adventure-xp-test";
const level=parseAsciiLevel({id:"xp-test",name:"XP",objective:"Explore",objectIds:{"3,1":"xp-test-enemy-first","3,3":"xp-test-enemy-later"},
  map:["#######","#@s1.E#","#.....#","#..1..#","#.....#","#.....#","#######"]});
const input:LevelCompletionInput={completionId:`completion:${runId}`,levelId:level.id,source:"curated",campaignIndex:0,rescuedCount:0,steps:5,power:2};
function storage() { const values=new Map<string,string>(); return {values,getItem:(k:string)=>values.get(k)??null,setItem:(k:string,v:string)=>{values.set(k,v);},removeItem:(k:string)=>{values.delete(k);}}; }
function defeat() { return movePlayer(level,movePlayer(level,createInitialGameState(level,runId),"right").state,"right").state; }
function claimXp(game:GameState) {
  for(const drop of game.loot.sources.filter(s=>s.currency==="xp").flatMap(s=>s.drops))
    game=finishLootClaims(beginLootClaims(level,game,[{id:drop.id,elapsedMs:2000}],drop.at));
  return game;
}
function preXp(game:GameState) {
  const {xpCollected:_,...old}=game;
  return {...old,loot:{version:2,runId,legacyRetiredEnemyIds:game.loot.legacyRetiredEnemyIds,sources:game.loot.sources.filter(s=>s.currency!=="xp")}};
}

describe("Adventure XP recognition and physical currency",()=>{
  it("freezes all band boundaries and derives every level from one bounded total",()=>{
    expect([1,3,4,8,9,19,20,999].map(p=>enemyXp(p))).toEqual([2,2,4,4,6,6,10,10]);
    expect([1,4,9,20].map(p=>enemyXp(p,true))).toEqual([4,8,12,20]);
    expect(MAX_ADVENTURE_XP).toBe(49490);
    for(let l=1;l<=99;l++){
      expect(adventureProgress(xpThreshold(l)).level).toBe(l);
      if(l>1)expect(adventureProgress(xpThreshold(l)-1).level).toBe(l-1);
    }
    for(const bad of [-1,NaN,Infinity,1.5,"20",Number.MAX_SAFE_INTEGER+1])expect(boundedXp(bad)).toBe(0);
    expect(adventureProgress(Number.MAX_SAFE_INTEGER)).toMatchObject({level:99,max:true});
  });
  it("scatters XP only on committed final defeat with unchanged Gold/Science and Power",()=>{
    const game=defeat(),object=level.objects.find(o=>o.id==="xp-test-enemy-first")!;
    expect(game.xpCollected).toBe(0);expect(game.power).toBe(createInitialGameState(level).power+1);
    for(const c of ["gold","science"] as const)expect(game.loot.sources.find(s=>s.currency===c)?.amount)
      .toBe(enemyRewardAmount(runId,level.id,object.id,1,c));
    const xp=game.loot.sources.find(s=>s.currency==="xp")!;expect(xp.amount).toBe(2);
    expect(xp.drops.every(d=>d.phase==="grounded")).toBe(true);
    expect(scatterTreasure(level,game,object as Extract<typeof object,{kind:"enemy"}>)).toBe(game.loot);
    const claimed=claimXp(game);expect(claimed.xpCollected).toBe(2);
    expect(claimed.goldStarsCollected+claimed.sciencePointsCollected).toBe(0);
    expect(finishLootClaims(claimed)).toBe(claimed);expect(sanitizeLoot(claimed.loot,level,claimed)).toEqual(claimed.loot);
    expect(pendingLoot(game)-pendingLoot(claimed)).toBe(2);
    expect(sanitizeLoot(claimed.loot,level,{...claimed,xpCollected:3})).toBeNull();
  });
  it("migrates v7 profile without historical XP, preserving all existing fields and unknown discoveries",()=>{
    const original={...applyLevelCompletion(createDefaultPlayerProgress(),input),adventureXp:0,
      discoveredEnemyIds:["future-guardian"],discoveredFriendIds:["future-friend"]};
    const raw={...original,schemaVersion:7,adventureXp:999};
    expect(migratePlayerProgress(raw)).toEqual(original);
    const target=storage(),bytes=JSON.stringify(raw);target.setItem(PLAYER_PROGRESS_STORAGE_KEY,bytes);
    expect(readPlayerProgress({...target,setItem(){throw Error("quota");}})).toEqual(original);
    expect(target.getItem(PLAYER_PROGRESS_STORAGE_KEY)).toBe(bytes);
    expect(readPlayerProgress(target)).toEqual(original);expect(JSON.parse(target.getItem(PLAYER_PROGRESS_STORAGE_KEY)!).schemaVersion).toBe(8);
    const future=JSON.stringify({...raw,schemaVersion:9,unknown:"preserve"});target.setItem(PLAYER_PROGRESS_STORAGE_KEY,future);
    expect(hasUnsupportedProgressProfile(target)).toBe(true);expect(writePlayerProgress(original,target)).toBe(false);
    expect(target.getItem(PLAYER_PROGRESS_STORAGE_KEY)).toBe(future);
  });
  it("banks collected XP and solve10 once per receipt; replays and Surprise earn without stat changes",()=>{
    const before=createDefaultPlayerProgress(),next=applyLevelCompletion(before,{...input,collectedXp:12});
    expect(next.adventureXp).toBe(22);expect(before.adventureXp).toBe(0);
    expect(applyLevelCompletion(next,{...input,collectedXp:999})).toEqual(next);
    const replay=applyLevelCompletion(next,{...input,completionId:"completion:run-xp-replay",collectedXp:2});
    expect(replay.adventureXp).toBe(34);
    expect(applyLevelCompletion(replay,{...input,source:"generated",completionId:"completion:run-surprise-xp"}).adventureXp).toBe(44);
    expect(applyLevelCompletion(before,{...input,completionId:undefined,collectedXp:50}).adventureXp).toBe(0);
    expect(applyLevelCompletion({...before,adventureXp:MAX_ADVENTURE_XP-1},input).adventureXp).toBe(MAX_ADVENTURE_XP);
    expect(next.bestResultsByLevel[level.id]?.bestPower).toBe(input.power);
  });
  it("restores v6 exact graphs, retires defeated XP alone and leaves unresolved enemies eligible",()=>{
    const game=defeat(),oldGame=preXp(game),target=storage();
    const snapshot=createActiveRunSnapshot({runId,mode:"normal",level,game,revealedTiles:[]})!;
    target.setItem(ACTIVE_RUN_STORAGE_KEY,JSON.stringify({...snapshot,schemaVersion:6,game:oldGame}));
    const next=readActiveRunResult([level],target).snapshot!;
    expect(next.schemaVersion).toBe(7);expect(next.game.xpCollected).toBe(0);
    expect(next.game.loot.sources).toEqual(oldGame.loot.sources);
    expect(next.game.loot.legacyRetiredEnemyIds).toEqual([]);expect(next.game.loot.legacyRetiredXpIds).toEqual(["xp-test-enemy-first"]);
    let later=next.game;for(const d of ["down","right","down"] as const)later=movePlayer(level,later,d).state;
    expect(later.loot.sources.find(s=>s.objectId==="xp-test-enemy-later"&&s.currency==="xp")?.amount).toBe(2);
    expect(later.loot.sources.some(s=>s.objectId==="xp-test-enemy-first"&&s.currency==="xp")).toBe(false);
    for(const l of [...CURATED_LEVELS,...LEGACY_CURATED_LEVELS]){
      const g=createInitialGameState(l,runId),s=createActiveRunSnapshot({runId,mode:"normal",level:l,game:g,revealedTiles:[]})!;
      target.setItem(ACTIVE_RUN_STORAGE_KEY,JSON.stringify({...s,schemaVersion:6,game:preXp(g)}));
      expect(readActiveRunResult(CURATED_LEVELS,target).snapshot?.game, l.id).toEqual(g);
    }
  });
  it("holds old bytes on denied migration, protects malformed XP, and preserves pending won XP through Stay",()=>{
    const game=claimXp(defeat()),target=storage(),snapshot=createActiveRunSnapshot({runId,mode:"normal",level,game,revealedTiles:[]})!;
    const old=JSON.stringify({...snapshot,schemaVersion:6,game:preXp(game)});target.setItem(ACTIVE_RUN_STORAGE_KEY,old);
    const denied={...target,setItem(){throw Error("quota");}};
    expect(readActiveRunResult([level],denied).persistence).toBe("migration-unsaved");expect(target.getItem(ACTIVE_RUN_STORAGE_KEY)).toBe(old);
    for(const change of [{xpCollected:99},{xpCollected:-1},{loot:{...game.loot,legacyRetiredXpIds:["xp-test-enemy-later"]}}]){
      const raw=JSON.stringify({...snapshot,game:{...game,...change}});target.setItem(ACTIVE_RUN_STORAGE_KEY,raw);
      expect(readActiveRunResult([level],target).persistence).toBe("protected");
      expect(writeActiveRun({runId,mode:"normal",level,game,revealedTiles:[]},target)).toBe(false);
      expect(target.getItem(ACTIVE_RUN_STORAGE_KEY)).toBe(raw);
    }
    let won=game;for(const d of ["right","right","right"] as const)won=movePlayer(level,won,d).state;
    expect(won.status).toBe("won");expect(won.xpCollected).toBe(2);
    expect(stayAfterPendingCompletion(level,won)).toMatchObject({status:"playing",xpCollected:2,loot:won.loot});
    expect(createActiveRunSnapshot({runId,mode:"tester",level,game:won,revealedTiles:[]})).toBeNull();
    expect(clearActiveRun(target)).toBe(false);
  });
  it("rejects v2 XP forgery and compacts only grounded value to reserve future XP",()=>{
    const game=defeat(),old=preXp(game);
    expect(migratePreXpLoot({...old.loot,sources:game.loot.sources},level,{...game,xpCollected:0})).toBeNull();
    const migrated=migratePreXpLoot(old.loot,level,{...game,xpCollected:0})!;
    expect(migrated.loot.sources).toEqual(old.loot.sources);
    expect(migrated.xpCollected).toBe(0);
    const terrain=Array.from({length:19},(_,y)=>Array.from({length:19},(_,x)=>!x||!y||x===18||y===18?"wall" as const:"floor" as const));
    const treasures=Array.from({length:16},(_,i)=>({id:`treasure-${i}`,kind:"treasure" as const,currency:"gold" as const,amount:8,style:"gold-chest" as const,at:{x:2+i%8,y:2+Math.floor(i/8)}}));
    const fixture={...level,width:19,height:19,terrain,exit:{x:17,y:17},objects:[...treasures,{id:"future",kind:"enemy" as const,power:1,at:{x:16,y:16}}]};
    const saturated={...createInitialGameState(fixture,runId),collectedObjectIds:treasures.map(t=>t.id)};
    const legacy={version:2,runId,legacyRetiredEnemyIds:[],sources:treasures.map((o,index)=>({sourceId:o.id,sourceKind:"treasure",objectId:o.id,currency:o.currency,amount:8,credited:0,
      drops:Array.from({length:index===15?2:4},(_,i)=>({id:`${o.id}/${i}`,at:o.at,amount:index===15?4:2,phase:"grounded"}))}))};
    const compacted=migratePreXpLoot(legacy,fixture,saturated)!;
    expect(compacted).not.toBeNull();expect(pendingLoot(compacted)).toBe(128);expect(compacted.goldStarsCollected).toBe(0);
    expect(compacted.loot.sources.flatMap(s=>s.drops).length).toBeLessThanOrEqual(61);
    expect(compacted.loot.sources.every(s=>s.drops.every(d=>legacy.sources.find(o=>o.sourceId===s.sourceId)!.drops.some(old=>old.id===d.id&&old.at.x===d.at.x&&old.at.y===d.at.y)))).toBe(true);
  });
  it("renders truthful saved, projected, temporary and capped progress without a level checklist",()=>{
    const saved=renderToStaticMarkup(<AdventureLevel xp={20}/>);
    expect(saved).toContain("Adventure Level 2");expect(saved).toContain("0 / 30");expect(saved).toContain("Saved Adventure Level");
    const projected=renderToStaticMarkup(<AdventureLevel xp={22} previousXp={10} collected={2}/>);
    expect(projected).toContain("Level up!");expect(projected).toContain("Ready to save +12 XP when you move on");
    expect(renderToStaticMarkup(<AdventureLevel xp={22} previousXp={10} temporary/>)).toContain("XP will not be saved");
    expect(renderToStaticMarkup(<AdventureLevel xp={MAX_ADVENTURE_XP}/>)).toContain("Highest Adventure Level reached");
  });
});
