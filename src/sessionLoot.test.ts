import { describe, expect, it } from "vitest";
import { createInitialGameState, movePlayer } from "./game/engine";
import { gameplayFingerprintForRules } from "./game/contentIdentity";
import { CURATED_LEVELS, parseAsciiLevel } from "./game/levels";
import { beginLootClaims, finishLootClaims, legacyCreditedLoot, pendingLoot } from "./game/loot";
import { ACTIVE_RUN_STORAGE_KEY, VERSION_THREE_ACTIVE_RUN_STORAGE_KEY, VERSION_TWO_ACTIVE_RUN_STORAGE_KEY,
  createActiveRunSnapshot, readActiveRunResult, writeActiveRun, clearActiveRun, sanitizeActiveRunSnapshot, type ActiveRunStorage } from "./session";

const level=parseAsciiLevel({id:"loot-save",name:"Loot",objective:"Explore",map:["#######","#@kv.E#","#.....#","#.....#","#.....#","#.....#","#######"]});
function storage() {
  const values=new Map<string,string>();
  return { values, getItem:(key:string)=>values.get(key)??null, setItem:(key:string,value:string)=>{values.set(key,value);}, removeItem:(key:string)=>{values.delete(key);} };
}
function input() { return {runId:"run-physical-save-test",mode:"normal" as const,level,
  game:movePlayer(level,createInitialGameState(level,"run-physical-save-test"),"right").state,revealedTiles:["1,1" as const],hintUsesByState:{route:2}}; }
function legacy() {
  const current=input(), game={...current.game,goldStarsCollected:3,loot:legacyCreditedLoot(level,current.game)};
  const next=createActiveRunSnapshot({...current,game})!;
  const {loot:_,...oldGame}=game;
  return {...next,schemaVersion:3,gameplayFingerprint:gameplayFingerprintForRules(level,3),game:oldGame};
}
describe("physical-loot durable migration",()=>{
  it("retains the authoritative v4 when any old-key cleanup fails",()=>{
    const target=storage(), first=CURATED_LEVELS[0]!, current={runId:"run-cleanup-order",mode:"normal" as const,level:first,game:createInitialGameState(first,"run-cleanup-order"),revealedTiles:[]};
    expect(writeActiveRun(current,target)).toBe(true);
    const raw=target.getItem(ACTIVE_RUN_STORAGE_KEY);
    target.setItem(VERSION_THREE_ACTIVE_RUN_STORAGE_KEY,"stale old record");
    const denied={...target,removeItem(key:string){if(key===VERSION_THREE_ACTIVE_RUN_STORAGE_KEY)throw Error("denied");target.removeItem(key);}};
    expect(clearActiveRun(denied)).toBe(false);
    expect(target.getItem(ACTIVE_RUN_STORAGE_KEY)).toBe(raw);
    expect(readActiveRunResult(CURATED_LEVELS,denied).snapshot?.runId).toBe(current.runId);
    const noCurrentRemoval={...target,removeItem(key:string){if(key===ACTIVE_RUN_STORAGE_KEY)throw Error("denied");target.removeItem(key);}};
    expect(clearActiveRun(noCurrentRemoval)).toBe(false);expect(target.getItem(ACTIVE_RUN_STORAGE_KEY)).toBe(raw);
    expect(target.getItem(VERSION_THREE_ACTIVE_RUN_STORAGE_KEY)).toBeNull();
  });
  it.each([2,3])("keeps a sole schema%s migration source when writing v4 failed and navigation clears",schema=>{
    const first=CURATED_LEVELS[0]!, target=storage();
    const snapshot=createActiveRunSnapshot({runId:"run-old-retention",mode:"normal",level:first,game:createInitialGameState(first,"run-old-retention"),revealedTiles:[]})!;
    const old={...snapshot,schemaVersion:schema,gameplayFingerprint:gameplayFingerprintForRules(first,3)};
    const key=schema===3?VERSION_THREE_ACTIVE_RUN_STORAGE_KEY:VERSION_TWO_ACTIVE_RUN_STORAGE_KEY,raw=JSON.stringify(old);
    target.setItem(key,raw);const denied={...target,setItem(){throw Error("quota");}};
    expect(readActiveRunResult(CURATED_LEVELS,denied).persistence).toBe("migration-unsaved");
    expect(clearActiveRun(denied)).toBe(false);expect(target.getItem(key)).toBe(raw);
  });
  it("migrates the exact rules-3 runId, counters, route and hints with only credited tombstones",()=>{
    const target=storage(), prior=legacy(); target.setItem(VERSION_THREE_ACTIVE_RUN_STORAGE_KEY,JSON.stringify(prior));
    const result=readActiveRunResult([level],target);
    expect(result.snapshot).toMatchObject({schemaVersion:6,runId:prior.runId,hintUsesByState:prior.hintUsesByState,
      game:{goldStarsCollected:3,steps:1,collectedObjectIds:prior.game.collectedObjectIds}});
    expect(pendingLoot(result.snapshot!.game)).toBe(0);
    expect(result.snapshot!.game.loot.sources[0]).toMatchObject({credited:3,drops:[]});
    expect(target.getItem(VERSION_THREE_ACTIVE_RUN_STORAGE_KEY)).toBeNull();
    expect(readActiveRunResult([level],target).snapshot).toEqual(result.snapshot);
  });
  it("rejects counterfeit old totals rather than repairing them during migration",()=>{
    const target=storage(), prior=legacy(); prior.game.goldStarsCollected=30;
    const raw=JSON.stringify(prior); target.setItem(VERSION_THREE_ACTIVE_RUN_STORAGE_KEY,raw);
    expect(readActiveRunResult([level],target)).toMatchObject({snapshot:null,persistence:"protected"});
    expect(writeActiveRun(input(),target)).toBe(false);
    expect(target.getItem(VERSION_THREE_ACTIVE_RUN_STORAGE_KEY)).toBe(raw);
  });
  it("preserves the sole old copy when v4 write is denied, and reports cleanup failure separately",()=>{
    const target=storage(), raw=JSON.stringify(legacy()); target.setItem(VERSION_THREE_ACTIVE_RUN_STORAGE_KEY,raw);
    const denied:ActiveRunStorage={...target,setItem(){throw Error("quota");}};
    expect(readActiveRunResult([level],denied)).toMatchObject({snapshot:{runId:"run-physical-save-test"},persistence:"migration-unsaved"});
    expect(target.getItem(VERSION_THREE_ACTIVE_RUN_STORAGE_KEY)).toBe(raw); expect(target.getItem(ACTIVE_RUN_STORAGE_KEY)).toBeNull();
    const noCleanup:ActiveRunStorage={...target,removeItem(){throw Error("denied");}};
    expect(readActiveRunResult([level],noCleanup)).toMatchObject({persistence:"cleanup-failed"});
    expect(target.getItem(ACTIVE_RUN_STORAGE_KEY)).not.toBeNull(); expect(target.getItem(VERSION_THREE_ACTIVE_RUN_STORAGE_KEY)).toBe(raw);
  });
  it.each(["{broken",JSON.stringify({schemaVersion:99}),JSON.stringify({schemaVersion:4}),"null"])("protects authoritative malformed/future bytes %s from read/write/clear and stale fallbacks",raw=>{
    const target=storage(); target.setItem(ACTIVE_RUN_STORAGE_KEY,raw);
    target.setItem(VERSION_THREE_ACTIVE_RUN_STORAGE_KEY,JSON.stringify(legacy())); target.setItem(VERSION_TWO_ACTIVE_RUN_STORAGE_KEY,"older");
    expect(readActiveRunResult([level],target)).toEqual({snapshot:null,discardedUpdatedRun:false,persistence:"protected"});
    expect(writeActiveRun(input(),target)).toBe(false); expect(clearActiveRun(target)).toBe(false);
    expect(target.getItem(ACTIVE_RUN_STORAGE_KEY)).toBe(raw); expect(target.getItem(VERSION_TWO_ACTIVE_RUN_STORAGE_KEY)).toBe("older");
  });
  it("round-trips grounded value and settles accepted claims exactly once after reload",()=>{
    const target=storage(), current=input(); expect(writeActiveRun(current,target)).toBe(true);
    const restored=readActiveRunResult([level],target).snapshot!;
    expect(restored.game).toEqual(current.game);
    const drop=current.game.loot.sources[0]!.drops[0]!;
    // Admission samples a physical point; semantic player position remains a
    // genuine one-step source position for the strict save plausibility check.
    const accepted=beginLootClaims(level,current.game,[{id:drop.id,elapsedMs:750}],drop.at);
    expect(accepted).not.toBe(current.game); expect(writeActiveRun({...current,game:accepted},target)).toBe(true);
    const recovered=readActiveRunResult([level],target).snapshot!;
    expect(recovered.game).toEqual(finishLootClaims(accepted));
    expect(readActiveRunResult([level],target).snapshot).toEqual(recovered);
    expect(recovered.game.goldStarsCollected+pendingLoot(recovered.game)).toBe(3);
  });
  it("refuses mismatched rules/content identities while retaining durable campaign progress",()=>{
    const target=storage(), prior=legacy(); prior.gameplayFingerprint="g-obsolete";
    target.setItem(VERSION_THREE_ACTIVE_RUN_STORAGE_KEY,JSON.stringify(prior)); target.setItem("unrelated-profile","keep");
    expect(readActiveRunResult([level],target)).toEqual({snapshot:null,discardedUpdatedRun:true});
    expect(target.getItem("unrelated-profile")).toBe("keep");
    const first=CURATED_LEVELS[0]!;
    expect(sanitizeActiveRunSnapshot({...createActiveRunSnapshot({runId:"run-compatible-test",mode:"normal",level:first,game:createInitialGameState(first,"run-compatible-test"),revealedTiles:[]}),schemaVersion:3},CURATED_LEVELS)).toBeNull();
  });
});
