import {describe,it,expect} from 'vitest';
import {CURATED_LEVELS,LEGACY_CURATED_LEVELS} from './game/levels';
import {createInitialGameState,movePlayer} from './game/engine';
import {solveLevel} from './game/solver';
import {beginLootClaims,finishLootClaims,pendingLoot} from './game/loot';
import {createActiveRunSnapshot,readActiveRunResult,writeActiveRun,clearActiveRun,resolveActiveRunLevel,
  sanitizeActiveRunSnapshot,ACTIVE_RUN_STORAGE_KEY} from './session';
import type {LevelDefinition,GameState} from './game/types';
function preXp(game:GameState) {
  const {xpCollected:_,...old}=game;
  return {...old,loot:{version:2,runId:game.loot.runId,legacyRetiredEnemyIds:game.loot.legacyRetiredEnemyIds,sources:game.loot.sources.filter(s=>s.currency!=="xp")}};
}
function migratedXp(game:GameState) {
  return {...game,xpCollected:0,loot:{...game.loot,sources:game.loot.sources.filter(s=>s.currency!=="xp"),legacyRetiredXpIds:[...game.defeatedEnemyIds].sort()}};
}
const runId='run-chest-save-tests';
const snapshot=(level:LevelDefinition,game:GameState)=>createActiveRunSnapshot({runId,mode:'normal',level,game,revealedTiles:[]})!;
function storage(){const values=new Map<string,string>();return{values,getItem:(k:string)=>values.get(k)??null,setItem:(k:string,v:string)=>{values.set(k,v);},removeItem:(k:string)=>{values.delete(k);}};}

describe('chest save cutover',()=>{
  it('restores every v5 authored layout with exact old identity and no retroactive rewards',()=>{
    for(const level of LEGACY_CURATED_LEVELS){
      const game=createInitialGameState(level,runId),{chests:_,...oldGame}=preXp(game);
      const prior={...snapshot(level,game),schemaVersion:5,game:oldGame};
      const target=storage();target.setItem(ACTIVE_RUN_STORAGE_KEY,JSON.stringify(prior));
      const restored=readActiveRunResult(CURATED_LEVELS,target);
      expect(restored.persistence,level.id).toBeUndefined();expect(restored.discardedUpdatedRun).toBe(false);
      expect(restored.snapshot?.game).toEqual(game);expect(restored.snapshot?.gameplayFingerprint).toBe(level.gameplayFingerprint);
      const actual=resolveActiveRunLevel(restored.snapshot!);expect(actual).toEqual(level);
      expect(JSON.parse(target.getItem(ACTIVE_RUN_STORAGE_KEY)!).schemaVersion).toBe(7);
      expect(writeActiveRun({runId,mode:'normal',level:actual!,game:restored.snapshot!.game,revealedTiles:[]},target)).toBe(true);
    }
  });
  it('preserves old collected chests and visible Candy defeats, pending currency and retired IDs',()=>{
    const level=LEGACY_CURATED_LEVELS.find(l=>l.id==='twilight-treasure-loop')!;
    let game=createInitialGameState(level,runId),checked=0;
    const path=solveLevel(level,{requireAllAnimals:true});expect(path.solvable).toBe(true);
    for(const d of path.directions){
      const result=movePlayer(level,game,d);game=result.state;
      if(result.events.some(e=>e.type==='treasure-opened'||e.type==='enemy-defeated')){
        const {chests:_,...oldGame}=preXp(game),prior={...snapshot(level,game),schemaVersion:5,game:oldGame},target=storage();
        target.setItem(ACTIVE_RUN_STORAGE_KEY,JSON.stringify(prior));const restored=readActiveRunResult(CURATED_LEVELS,target).snapshot!;
        expect(restored.game).toEqual(migratedXp(game));expect(restored.game.chests).toEqual([]);checked++;
      }
    }
    expect(checked).toBeGreaterThan(4);
  });
  it('round-trips each committed chest phase, settles accepted claims once and rejects forged Power/phase',()=>{
    const level=CURATED_LEVELS.find(l=>l.id==='twilight-treasure-loop')!;
    let game=createInitialGameState(level,runId);const phases=new Set();
    for(const d of solveLevel(level,{requireAllAnimals:true,requireAllChests:true}).directions){
      const result=movePlayer(level,game,d);game=result.state;
      if(result.events.some(e=>e.type==='chest-opened'||e.type==='enemy-defeated')){
        const s=snapshot(level,game);expect(s).not.toBeNull();expect(sanitizeActiveRunSnapshot(s,CURATED_LEVELS)?.game).toEqual(game);
        const legacyTarget=storage();legacyTarget.setItem(ACTIVE_RUN_STORAGE_KEY,JSON.stringify({...s,schemaVersion:6,game:preXp(game)}));
        const migrated=readActiveRunResult(CURATED_LEVELS,legacyTarget).snapshot!;
        expect(migrated.game.xpCollected).toBe(0);
        expect(migrated.game.loot.sources).toEqual(game.loot.sources.filter(source=>source.currency!=='xp'));
        expect(migrated.game.loot.legacyRetiredXpIds).toEqual([...game.defeatedEnemyIds,...game.chests.filter(c=>c.phase!=='revealed').map(c=>c.objectId)].sort());
        for(const c of game.chests)phases.add(c.phase);
        if(game.chests.length){
          expect(sanitizeActiveRunSnapshot({...s,game:{...game,chests:[...game.chests,{...game.chests[0]}]}},CURATED_LEVELS)).toBeNull();
          expect(sanitizeActiveRunSnapshot({...s,game:{...game,power:game.power+1}},CURATED_LEVELS)).toBeNull();
        }
        const claims=beginLootClaims(level,game,game.loot.sources.flatMap(s=>s.drops.map(d=>({id:d.id,elapsedMs:2000}))));
        const target=storage();target.setItem(ACTIVE_RUN_STORAGE_KEY,JSON.stringify(snapshot(level,claims)));
        const restored=readActiveRunResult(CURATED_LEVELS,target).snapshot!;
        expect(restored.game).toEqual(finishLootClaims(claims));
        expect(readActiveRunResult(CURATED_LEVELS,target).snapshot).toEqual(restored);
        expect(restored.game.goldStarsCollected+restored.game.sciencePointsCollected+restored.game.xpCollected+pendingLoot(restored.game))
          .toBe(game.loot.sources.reduce((n,s)=>n+s.amount,0));
      }
    }
    expect([...phases].sort()).toEqual(['defeated','good-open','revealed']);
  });
  it('protects the only v5 copy after denied migration writes and future/malformed current records',()=>{
    const level=LEGACY_CURATED_LEVELS[0]!,game=createInitialGameState(level,runId),{chests:_,...oldGame}=preXp(game);
    const old=JSON.stringify({...snapshot(level,game),schemaVersion:5,game:oldGame}),target=storage();target.setItem(ACTIVE_RUN_STORAGE_KEY,old);
    const denied={...target,setItem:()=>{throw Error('quota');}};
    expect(readActiveRunResult(CURATED_LEVELS,denied).persistence).toBe('migration-unsaved');
    expect(clearActiveRun(denied)).toBe(false);expect(target.getItem(ACTIVE_RUN_STORAGE_KEY)).toBe(old);
    for(const raw of ['bad JSON',JSON.stringify({...snapshot(level,game),schemaVersion:99}),JSON.stringify({...snapshot(level,game),game:{...game,chests:[{}]}})]){
      target.setItem(ACTIVE_RUN_STORAGE_KEY,raw);
      expect(readActiveRunResult(CURATED_LEVELS,target).persistence).toBe('protected');
      expect(clearActiveRun(target)).toBe(false);
      expect(writeActiveRun({runId,mode:'normal',level:CURATED_LEVELS[0]!,game:createInitialGameState(CURATED_LEVELS[0]!,runId),revealedTiles:[]},target)).toBe(false);
      expect(target.getItem(ACTIVE_RUN_STORAGE_KEY)).toBe(raw);
    }
  });
});
