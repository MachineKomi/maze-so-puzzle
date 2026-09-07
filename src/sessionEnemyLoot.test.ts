import { describe, expect, it } from "vitest";
import { createInitialGameState, movePlayer } from "./game/engine";
import { parseAsciiLevel } from "./game/levels";
import { gameplayFingerprintForRules } from "./game/contentIdentity";
import { beginLootClaims, finishLootClaims, pendingLoot } from "./game/loot";
import { ACTIVE_RUN_STORAGE_KEY, VERSION_FOUR_ACTIVE_RUN_STORAGE_KEY, createActiveRunSnapshot,
  readActiveRunResult, sanitizeActiveRunSnapshot, writeActiveRun } from "./session";

const level=parseAsciiLevel({id:"enemy-migration",name:"Migration",objective:"Explore",
  objectIds:{"3,1":"enemy-migration-enemy-retired","4,2":"enemy-migration-enemy-new"},
  map:["#########","#@s1kv.E#","#...1...#","#.......#","#.......#","#.......#","#.......#","#.......#","#########"]});
const runId="run-migration-enemies";
function prior() {
  let game=createInitialGameState(level,runId);
  for(let i=0;i<5;i++) game=movePlayer(level,game,"right").state;
  const gold=game.loot.sources.find(s=>s.sourceKind==="treasure"&&s.currency==="gold")!.drops[0]!;
  game=finishLootClaims(beginLootClaims(level,game,[{id:gold.id,elapsedMs:750}],gold.at));
  const science=game.loot.sources.find(s=>s.sourceKind==="treasure"&&s.currency==="science")!.drops[0]!;
  game=beginLootClaims(level,game,[{id:science.id,elapsedMs:750}],science.at);
  const snapshot=createActiveRunSnapshot({runId,mode:"normal",level,game,revealedTiles:[],hintUsesByState:{route:3}})!;
  expect(snapshot).not.toBeNull();
  return {...snapshot,schemaVersion:4,gameplayFingerprint:gameplayFingerprintForRules(level,4),game:{...game,
    loot:{version:1,sources:game.loot.sources.filter(s=>s.sourceKind==="treasure").map(({sourceKind:_,objectId:__,...s})=>s)}}};
}
function storage() {
  const values=new Map<string,string>();return{values,getItem:(k:string)=>values.get(k)??null,
    setItem:(k:string,v:string)=>{values.set(k,v);},removeItem:(k:string)=>{values.delete(k);}};
}
describe("v4 enemy-reward migration",()=>{
  it("retains grounded treasure, settles accepted value once and retires old defeated enemies",()=>{
    const old=prior(),target=storage();target.setItem(VERSION_FOUR_ACTIVE_RUN_STORAGE_KEY,JSON.stringify(old));
    const result=readActiveRunResult([level],target),next=result.snapshot!;
    expect(next.schemaVersion).toBe(6);expect(next.runId).toBe(runId);expect(next.game.loot.runId).toBe(runId);
    expect(next.game.loot.legacyRetiredEnemyIds).toEqual(old.game.defeatedEnemyIds);
    expect(next.game.loot.sources.every(s=>s.sourceKind==="treasure")).toBe(true);
    const grounded=old.game.loot.sources.flatMap(s=>s.drops).filter(d=>d.phase==="grounded");
    expect(next.game.loot.sources.flatMap(s=>s.drops)).toEqual(grounded);
    expect(next.game.sciencePointsCollected).toBeGreaterThan(old.game.sciencePointsCollected);
    expect(next.game.goldStarsCollected).toBe(old.game.goldStarsCollected);
    expect(next.hintUsesByState).toEqual(old.hintUsesByState);expect(pendingLoot(next.game)).toBeGreaterThan(0);
    expect(target.getItem(VERSION_FOUR_ACTIVE_RUN_STORAGE_KEY)).toBeNull();
    expect(readActiveRunResult([level],target)).toEqual(result);
    const approached=movePlayer(level,next.game,"left").state,defeated=movePlayer(level,approached,"down").state;
    expect(defeated.defeatedEnemyIds).toHaveLength(2);
    expect(defeated.loot.sources.filter(s=>s.sourceKind==="enemy")).toHaveLength(2);
    expect(sanitizeActiveRunSnapshot({...next,game:defeated},[level])?.game).toEqual(defeated);
  });
  it("rejects rebinding a persisted reward roll to another run",()=>{
    const target=storage();target.setItem(VERSION_FOUR_ACTIVE_RUN_STORAGE_KEY,JSON.stringify(prior()));
    const snapshot=readActiveRunResult([level],target).snapshot!;
    expect(sanitizeActiveRunSnapshot({...snapshot,runId:"run-another-attempt"},[level])).toBeNull();
    expect(writeActiveRun({runId:"run-another-attempt",mode:"normal",level,game:snapshot.game,revealedTiles:[]},target)).toBe(false);
  });
  it("preserves exact old bytes on denied writes and leaves v5 authoritative after cleanup failure",()=>{
    const old=JSON.stringify(prior()),target=storage();target.setItem(VERSION_FOUR_ACTIVE_RUN_STORAGE_KEY,old);
    const failed=readActiveRunResult([level],{...target,setItem(){throw Error("quota");}});
    expect(failed.persistence).toBe("migration-unsaved");expect(target.getItem(VERSION_FOUR_ACTIVE_RUN_STORAGE_KEY)).toBe(old);
    expect(target.getItem(ACTIVE_RUN_STORAGE_KEY)).toBeNull();
    expect(readActiveRunResult([level],{...target,removeItem(){throw Error("denied");}}).persistence).toBe("cleanup-failed");
    target.setItem(VERSION_FOUR_ACTIVE_RUN_STORAGE_KEY,"broken stale record");
    expect(readActiveRunResult([level],target).snapshot).toEqual(failed.snapshot);
  });
  it.each(["missing","amount","phase","future"])("protects a malformed/future v4 %s ledger",change=>{
    const old=prior();
    if(change==="missing")old.game.loot.sources=[];
    if(change==="amount")old.game.loot.sources[0]!.amount++;
    if(change==="phase")(old.game.loot.sources[0]!.drops[0] as unknown as {phase:string}).phase="bad";
    if(change==="future")old.game.loot.version=99;
    const raw=JSON.stringify(old),target=storage();target.setItem(VERSION_FOUR_ACTIVE_RUN_STORAGE_KEY,raw);
    expect(readActiveRunResult([level],target)).toMatchObject({snapshot:null,persistence:"protected"});
    expect(target.getItem(VERSION_FOUR_ACTIVE_RUN_STORAGE_KEY)).toBe(raw);expect(target.getItem(ACTIVE_RUN_STORAGE_KEY)).toBeNull();
  });
});
