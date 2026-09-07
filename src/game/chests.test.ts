import {describe,it,expect} from 'vitest';
import {parseAsciiLevel,CURATED_LEVELS,LEGACY_CURATED_LEVELS} from './levels';
import {createInitialGameState,movePlayer,isObjectResolved} from './engine';
import {chestReceipt,resolveChest,sanitizeChests,commitChest,ORDINARY_MIXED_CHEST,mimicRewardRanges} from './chests';
import {authoredLootErrors,beginLootClaims,finishLootClaims,pendingLoot,sanitizeLoot,scatterTreasure} from './loot';
import {solveLevel,progressionStateSignature} from './solver';
import {gameplayFingerprint} from './contentIdentity';
import {enemyRewardRange} from './enemyRewards';
import type {ChestObject,Direction,GameState,LevelDefinition} from './types';

export function chestFixture(chance=0,power=2):LevelDefinition {
  const base=parseAsciiLevel({id:'chest-test',name:'Chest',initialPower:1,objective:'Find the star',map:[
    '#######','#@s...#','#.....#','#..p..#','#...q.#','#....E#','#######'],potionAmount:2});
  const chest:ChestObject={id:'test-chest',at:{x:3,y:1},kind:'chest',family:'candy-mimic',mimicChance:chance,power,rewardRules:2};
  const level={...base,objects:[...base.objects,chest]};return {...level,gameplayFingerprint:gameplayFingerprint(level)};
}
const walk=(level:LevelDefinition,state:GameState,route:Direction[])=>route.reduce((g,d)=>movePlayer(level,g,d).state,state);

describe('authored mixed chests and Mimics',()=>{
  it('opens from the adjacent square without a sword, reserving and conserving both currencies once',()=>{
    const level=chestFixture(),chest=level.objects.at(-1)!;
    let state=walk(level,createInitialGameState(level),['down','right','right']);
    expect(state.hasSword).toBe(false);
    const opened=movePlayer(level,state,'up');state=opened.state;
    expect(opened.moved).toBe(false);expect(opened.events.map(e=>e.type)).toEqual(['chest-opened']);
    expect(state.position).toEqual({x:3,y:2});expect(state.steps).toBe(3);expect(state.power).toBe(1);
    expect(state.chests).toHaveLength(1);expect(state.loot.sources.map(s=>s.currency).sort()).toEqual(['gold','science']);
    expect(state.loot.sources.every(s=>s.sourceKind==='chest'&&s.credited===0)).toBe(true);
    expect(isObjectResolved(chest,state)).toBe(true);expect(sanitizeLoot(state.loot,level,state)).toEqual(state.loot);
    expect(scatterTreasure(level,state,chest as ChestObject)).toBe(state.loot);
    const again=movePlayer(level,state,'up');expect(again.moved).toBe(true);expect(again.state.loot).toEqual(state.loot);
    const requests=state.loot.sources.flatMap(s=>s.drops.map(d=>({id:d.id,elapsedMs:2000})));
    const collected=finishLootClaims(beginLootClaims(level,state,requests));
    expect(collected.goldStarsCollected+collected.sciencePointsCollected+pendingLoot(collected))
      .toBe(state.loot.sources.reduce((n,s)=>n+s.amount,0));
    expect(finishLootClaims(collected)).toBe(collected);
  });
  it('reveals safely when underpowered, permits a real return route, and wins at equal Power',()=>{
    const level=chestFixture(100,3);
    let state=walk(level,createInitialGameState(level),['right','right']);
    expect(state.position).toEqual({x:2,y:1});expect(state.power).toBe(1);
    expect(state.chests[0]?.phase).toBe('revealed');expect(state.loot.sources).toEqual([]);
    const blocked=movePlayer(level,state,'right');expect(blocked.state).toBe(state);expect(blocked.events[0]?.type).toBe('enemy-too-strong');
    const signature=progressionStateSignature(state,new Set());
    state=walk(level,state,['down','down','right','up','left','up']); // potion then return to west of chest
    expect(state.power).toBe(3);expect(chestReceipt(state,'test-chest')?.phase).toBe('revealed');
    const defeated=movePlayer(level,state,'right');
    expect(defeated.moved).toBe(false);expect(defeated.state.power).toBe(6);
    expect(defeated.state.chests[0]?.phase).toBe('defeated');expect(defeated.state.defeatedEnemyIds).toEqual([]);
    expect(defeated.state.loot.sources).toHaveLength(3);
    expect(progressionStateSignature(defeated.state,new Set())).not.toBe(signature);
    expect(sanitizeLoot(defeated.state.loot,level,defeated.state)).not.toBeNull();
  });
  it('freezes independent run-bound rolls and enforces richer minima in every band',()=>{
    const chest=chestFixture(35).objects.at(-1) as ChestObject,seen=new Set();
    for(let i=0;i<300;i++){
      const id=`run-chest-random-${i}`,r=resolveChest(id,'level',chest);
      expect(resolveChest(id,'level',chest)).toEqual(r);seen.add(r.outcome);
      expect(sanitizeChests([r],{...chestFixture(35),id:'level'},id)).toEqual([r]);
    }
    expect([...seen].sort()).toEqual(['good','mimic']);
    for(const power of [1,4,9,20,1000])for(const c of ['gold','science'] as const){
      expect(mimicRewardRanges(power)[c][0]).toBeGreaterThan(ORDINARY_MIXED_CHEST[c][1]);
      expect(mimicRewardRanges(power)[c][0]).toBeGreaterThan(enemyRewardRange(power,c)[1]);
    }
    for(const chance of [0,100])for(let i=0;i<100;i++)expect(resolveChest(`run-boundary-${i}`,'level',{...chest,mimicChance:chance}).outcome).toBe(chance?'mimic':'good');
  });
  it('rejects malformed policy, forged rewards and nonmonotonic receipts',()=>{
    const level=chestFixture(100),state=createInitialGameState(level),chest=level.objects.at(-1) as ChestObject;
    for(const invalid of [{mimicChance:-1},{mimicChance:101},{mimicChance:.5},{power:0},{power:Infinity},{rewardRules:1},{family:'fake'}])
      expect(authoredLootErrors({...level,objects:[{...chest,...invalid} as ChestObject]})).not.toEqual([]);
    const r=resolveChest(state.loot.runId,level.id,chest),revealed=commitChest(state,r);
    expect(()=>commitChest(state,{...r,phase:'defeated'})).toThrow();
    const defeated=commitChest(revealed,{...r,phase:'defeated'});expect(()=>commitChest(defeated,r)).toThrow();
    expect(sanitizeChests([{...r,rewards:[{currency:'gold',amount:999}]}],level,state.loot.runId)).toBeNull();
    expect(sanitizeChests([r,r],level,state.loot.runId)).toBeNull();
    expect(sanitizeChests([{...r,phase:'good-open'}],level,state.loot.runId)).toBeNull();
  });
  it('proves ordinary, perfect and all-chest routes for every allowed joint outcome',()=>{
    const base=chestFixture(35,1),first=base.objects.at(-1) as ChestObject;
    for(const a of [0,100])for(const b of [0,100]){
      const level={...base,objects:[...base.objects.slice(0,-1),{...first,mimicChance:a},
        {...first,id:'second',at:{x:4,y:2},mimicChance:b}]};
      for(const options of [{avoidAnimals:true},{requireAllAnimals:true},{requireAllAnimals:true,requireAllChests:true}]){
        const result=solveLevel(level,options);expect(result.solvable,JSON.stringify({a,b,options})).toBe(true);
        expect(result.visitedStates).toBeLessThan(10000);
      }
    }
  });
  it('proves production chest routes and required Twilight pre-Power without its own reward',()=>{
    expect(CURATED_LEVELS.flatMap(l=>l.objects.filter(o=>o.kind==='chest'))).toHaveLength(5);
    for(const level of CURATED_LEVELS.filter(l=>l.objects.some(o=>o.kind==='chest'))){
      const result=solveLevel(level,{requireAllAnimals:true,requireAllChests:true});expect(result.solvable,level.id).toBe(true);
      expect(result.visitedStates).toBeLessThan(150000);
      let state=createInitialGameState(level);
      for(const d of result.directions){
        const next=movePlayer(level,state,d);
        for(const e of next.events)if(e.type==='enemy-defeated'&&level.objects.find(o=>o.id===e.objectId)?.kind==='chest'){
          expect(state.chests.find(c=>c.objectId===e.objectId)?.phase).toBe('revealed');
          expect(state.power).toBeGreaterThanOrEqual(e.enemyPower);
          expect(state.loot.sources.some(s=>s.objectId===e.objectId)).toBe(false);
        }
        state=next.state;
      }
    }
    expect(LEGACY_CURATED_LEVELS.flatMap(l=>l.objects).filter(o=>o.kind==='treasure'&&o.style==='gold-chest')).toHaveLength(4);
    expect(LEGACY_CURATED_LEVELS.flatMap(l=>l.objects).filter(o=>o.kind==='enemy')).toHaveLength(50);
  },30000);
});
