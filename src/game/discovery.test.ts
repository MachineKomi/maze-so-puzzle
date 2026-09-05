import { describe, expect, it } from "vitest";
import { enemyDiscoveriesForView } from "./discovery";
import type { LevelDefinition } from "./types";

const level: LevelDefinition = {
  schemaVersion: 1, contentRevision: 1, gameplayFingerprint: "discovery-test",
  id: "discovery-test", name: "Discovery test", objective: "Find the exit", source: "curated",
  width: 12, height: 10, initialPower: 1, start: { x: 1, y: 1 }, exit: { x: 11, y: 9 },
  terrain: Array.from({ length: 10 }, () => Array.from({ length: 12 }, () => "floor" as const)),
  objects: [
    { id: "goblin-one", kind: "enemy", at: { x: 1, y: 1 }, power: 2 },
    { id: "goblin-two", kind: "enemy", at: { x: 2, y: 2 }, power: 3, style: "goblin" },
    { id: "bat", kind: "enemy", at: { x: 5, y: 5 }, power: 2, style: "moon-bat" },
    { id: "golem-in-render-gutter", kind: "enemy", at: { x: 6, y: 5 }, power: 5, style: "pebble-golem" },
    { id: "far-slime", kind: "enemy", at: { x: 11, y: 9 }, power: 2, style: "blueberry-slime" },
    { id: "unrevealed-chest", kind: "treasure", at: { x: 3, y: 2 }, currency: "gold", amount: 3, style: "gold-chest" },
  ],
};

describe("bestiary exposure from the gameplay view", () => {
  it("records each visible enemy style once, excluding the offscreen renderer gutter and chests", () => {
    expect(enemyDiscoveriesForView(level, { x: 1, y: 1 })).toEqual(["goblin", "moon-bat"]);
  });

  it("discovers a gutter enemy only after the authoritative camera reaches its tile", () => {
    expect(enemyDiscoveriesForView(level, { x: 2, y: 2 })).not.toContain("pebble-golem");
    expect(enemyDiscoveriesForView(level, { x: 3, y: 2 })).toContain("pebble-golem");
  });

  it("does not infer encounters from already-defeated objects in a resumed legacy run", () => {
    expect(enemyDiscoveriesForView(level, { x: 1, y: 1 }, ["goblin-one", "goblin-two", "bat"]))
      .toEqual([]);
  });

  it("uses clamped edge visibility and works for small whole-maze views", () => {
    expect(enemyDiscoveriesForView(level, { x: 11, y: 9 })).toEqual(["pebble-golem", "blueberry-slime"]);
    const small = { ...level, width: 3, height: 3, objects: level.objects.slice(0, 2) };
    expect(enemyDiscoveriesForView(small, { x: 2, y: 2 })).toEqual(["goblin"]);
  });
});
