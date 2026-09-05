import { describe, expect, it } from "vitest";
import { calculatePlayLayout } from "./layout";
import { buildAdventureHudModel, EQUIPMENT_REGISTRY } from "./hudModel";
import { CURATED_LEVELS } from "../../game/levels";
import { createInitialGameState } from "../../game/engine";

describe("physical play layout", () => {
  for (const [w,h,mapMin] of [[1920,1080,192],[1280,720,192],[1194,834,160],[1024,768,160],[960,540,160],[844,390,120],[568,320,96]]) {
    it(`keeps square board and useful map at ${w}×${h}`, () => {
      const normal = calculatePlayLayout(w! - 16,h! - 16,false);
      const big = calculatePlayLayout(w! - 16,h! - 16,true);
      expect(normal.board + normal.deck + normal.gap).toBe(w! - 16);
      expect(big.board).toBeGreaterThanOrEqual(normal.board);
      expect(normal.map).toBeGreaterThanOrEqual(mapMin!);
      // Emergency deck gives status cells real space before spending on board.
      expect(normal.board).toBeGreaterThan(w! < 650 ? 240 : 250);
    });
  }
  it("has deterministic finite fallbacks", () => {
    expect(calculatePlayLayout(NaN,Infinity,false).board).toBe(1);
  });
});
describe("typed equipment registry", () => {
  it("shows every current slot with exact found/total semantics", () => {
    for (const level of CURATED_LEVELS) {
      const game = createInitialGameState(level);
      const model = buildAdventureHudModel(level,game);
      expect(model.bagFound).toBe(0);
      expect(model.bagTotal).toBe(model.slots.length);
      expect(new Set(model.slots.map(slot => slot.id)).size).toBe(model.slots.length);
      expect(model.rescueTotal).toBe(level.objects.filter(o => o.kind === "animal").length);
      expect(model.objective).toBe(level.objective);
    }
  });
  it("supports every one-to-seven count and a larger future registry", () => {
    const level = CURATED_LEVELS[11]!;
    const game = createInitialGameState(level);
    for (let count = 1; count <= 7; count++) {
      const model = buildAdventureHudModel(level,game,EQUIPMENT_REGISTRY.slice(0,count));
      expect(model.bagTotal).toBe(count);
    }
    const registry = Array.from({length:12},(_,index) => ({...EQUIPMENT_REGISTRY[0]!,id:`synthetic-${index}`}));
    expect(buildAdventureHudModel(level,game,registry).bagTotal).toBe(12);
    const found = buildAdventureHudModel(level,{...game,hasSword:true,hasBoots:true,hasSpringBoots:true,hasAntidoteLeaf:true,keys:["red","yellow","blue"]});
    expect(found.bagFound).toBe(7);
    expect(found.slots.slice(-3).map(slot => slot.id)).toEqual(["key-red","key-yellow","key-blue"]);
  });
});
