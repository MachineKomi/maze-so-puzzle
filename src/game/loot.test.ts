import { describe, expect, it } from "vitest";
import { createInitialGameState, movePlayer, stayAfterPendingCompletion } from "./engine";
import { CURATED_LEVELS, parseAsciiLevel } from "./levels";
import { authoredLootErrors, beginLootClaims, finishLootClaims, lootFloor, lootLandingPaths, lootLineClear, pendingLoot, sanitizeLoot, scatterTreasure } from "./loot";
import { getLevelStructureErrors, solveLevel } from "./solver";
import type { GameState, LevelDefinition, TreasureObject } from "./types";

export const lootTestLevel = () => parseAsciiLevel({ id: "physical-loot-test", name: "Loot", objective: "Explore",
  map: ["#########","#@kiv..E#","#.......#","#.......#","#.......#","#.......#","#.......#","#.......#","#########"] });
const openFirst = (level: LevelDefinition) => movePlayer(level,createInitialGameState(level),"right").state;
const acceptAt = (level: LevelDefinition, game: GameState, id: string) => {
  const drop = game.loot.sources.flatMap(s=>s.drops).find(d=>d.id===id)!;
  return beginLootClaims(level,{...game,position:drop.at},[{id,elapsedMs:750}]);
};
describe("physical authored rewards", () => {
  it("keeps exact value pending, waits750ms, and credits an accepted ID only once", () => {
    const level=lootTestLevel(), opened=openFirst(level), source=opened.loot.sources[0]!, drop=source.drops[0]!;
    expect(opened.goldStarsCollected).toBe(0); expect(pendingLoot(opened)).toBe(3);
    expect(beginLootClaims(level,{...opened,position:drop.at},[{id:drop.id,elapsedMs:749}]).loot).toBe(opened.loot);
    const claimed=acceptAt(level,opened,drop.id), credited=finishLootClaims(claimed);
    expect(credited.goldStarsCollected).toBe(drop.amount);
    expect(pendingLoot(credited)+credited.goldStarsCollected).toBe(3);
    expect(finishLootClaims(credited)).toBe(credited);
    expect(beginLootClaims(level,credited,[{id:drop.id,elapsedMs:999}])).toBe(credited);
    expect(credited.loot.sources[0]!.sourceId).toBe(source.sourceId);
  });
  it("cannot attract out of range, through a blocked corner, or from start/exit", () => {
    const level=lootTestLevel(), game=openFirst(level), requests=game.loot.sources[0]!.drops.map(d=>({id:d.id,elapsedMs:999}));
    expect(beginLootClaims(level,game,requests,{x:7,y:7})).toBe(game);
    expect(beginLootClaims(level,game,requests,level.start)).toBe(game);
    expect(beginLootClaims(level,game,requests,level.exit)).toBe(game);
    expect(beginLootClaims(level,game,requests,{x:NaN,y:1})).toBe(game);
    const terrain=level.terrain.map(row=>[...row]); terrain[2]![3]="wall";
    expect(lootLineClear({...level,terrain},game,{x:2,y:2},{x:3,y:3})).toBe(false);
  });
  it("finishes accepted claims on exit, leaves grounded loot optional, and preserves it through Stay", () => {
    const level=lootTestLevel(), game=openFirst(level), claimed=acceptAt(level,game,game.loot.sources[0]!.drops[0]!.id);
    const won=movePlayer(level,{...claimed,position:{x:6,y:1}},"right").state;
    expect(won.status).toBe("won"); expect(won.goldStarsCollected).toBeGreaterThan(0);
    expect(pendingLoot(won)).toBeGreaterThan(0);
    expect(stayAfterPendingCompletion(level,won).loot).toBe(won.loot);
    expect(solveLevel(level).solvable).toBe(true);
  });
  it("chooses cardinal safe paths and includes a distant bundle in every campaign treasure opening", () => {
    for(const level of CURATED_LEVELS) for(const object of level.objects) if(object.kind==="treasure") {
      const game={...createInitialGameState(level),collectedObjectIds:[object.id]};
      const ledger=scatterTreasure(level,game,object), paths=lootLandingPaths(level,game,object.at);
      expect(ledger.sources[0]!.drops.some(d=>Math.hypot(d.at.x-object.at.x,d.at.y-object.at.y)>1.75)).toBe(true);
      for(const drop of ledger.sources[0]!.drops) {
        const path=paths.find(p=>p.at(-1)!.x===drop.at.x&&p.at(-1)!.y===drop.at.y)!;
        expect(path.every(p=>lootFloor(level,game,p))).toBe(true);
        for(let i=1;i<path.length;i++) expect(Math.abs(path[i]!.x-path[i-1]!.x)+Math.abs(path[i]!.y-path[i-1]!.y)).toBe(1);
      }
    }
  });
  it("reserves future sources at capacity without erasing or duplicating a single unit", () => {
    const base=lootTestLevel(), terrain=Array.from({length:19},(_,y)=>Array.from({length:19},(_,x)=>x===0||y===0||x===18||y===18?"wall" as const:"floor" as const));
    const objects: TreasureObject[]=Array.from({length:64},(_,i)=>({id:`treasure-${i}`,kind:"treasure",currency:i%2?"science":"gold",amount:100+i,style:"gold-chest",at:{x:2+i%15,y:2+Math.floor(i/15)}}));
    const level={...base,width:19,height:19,terrain,objects,exit:{x:17,y:17}};
    let game=createInitialGameState(level);
    for(const object of objects) {
      game={...game,collectedObjectIds:[...game.collectedObjectIds,object.id]};
      game={...game,loot:scatterTreasure(level,game,object)};
      expect(game.loot.sources.flatMap(s=>s.drops).length).toBeLessThanOrEqual(64);
    }
    expect(pendingLoot(game)).toBe(objects.reduce((n,o)=>n+o.amount,0));
    expect(sanitizeLoot(game.loot,level,game)).not.toBeNull();
    for(const source of game.loot.sources) for(const drop of source.drops) game=finishLootClaims(acceptAt(level,game,drop.id));
    expect(pendingLoot(game)).toBe(0); expect(game.loot.sources).toHaveLength(64);
    expect(game.goldStarsCollected+game.sciencePointsCollected).toBe(objects.reduce((n,o)=>n+o.amount,0));
    const tooMany={...level,objects:[...objects,{...objects[0]!,id:"extra",at:{x:17,y:7}}]};
    expect(getLevelStructureErrors(tooMany).join()).toContain("64");
    expect(()=>createInitialGameState(tooMany)).toThrow("64");
  });
  it.each([0,-1,NaN,Infinity,Number.MAX_SAFE_INTEGER+1])("rejects invalid amount %s at the content boundary", amount => {
    const base=lootTestLevel(), object=base.objects.find(o=>o.kind==="treasure")!;
    expect(authoredLootErrors({...base,objects:[{...object,amount}]}).length).toBeGreaterThan(0);
  });
  it("rejects forged attribution, phases, duplicate IDs, unsafe destinations and broken conservation", () => {
    const level=lootTestLevel(), game=openFirst(level), source=game.loot.sources[0]!, drop=source.drops[0]!;
    for(const changed of [ {...source,sourceId:"foreign"}, {...source,credited:1}, {...source,currency:"science"},
      {...source,drops:[drop,drop]}, {...source,drops:[{...drop,phase:"credited"}]},
      {...source,drops:[{...drop,at:level.start}]}, {...source,drops:[{...drop,amount:NaN}]} ]) {
      expect(sanitizeLoot({...game.loot,sources:[changed]},level,game)).toBeNull();
    }
    expect(sanitizeLoot({version:99,sources:[source]},level,game)).toBeNull();
    expect(sanitizeLoot({version:1,sources:[source,source]},level,game)).toBeNull();
  });
});
