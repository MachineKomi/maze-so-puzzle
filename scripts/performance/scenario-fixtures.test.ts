import { describe, expect, it } from "vitest";
import fixtures from "./fixtures/scenarios.json";
import { generateSurpriseMaze } from "../../src/game/generator";
import { CURATED_LEVELS, getCuratedLevel } from "../../src/game/levels";
import { solveLevel } from "../../src/game/solver";
import type { GameEvent, LevelDefinition, LevelObject, TerrainKind } from "../../src/game/types";

type EventType = GameEvent["type"];

function scenarioLevelIds(scenario: Record<string, unknown>): string[] {
  const ids: string[] = [];
  if (typeof scenario.levelId === "string") ids.push(scenario.levelId);
  if (Array.isArray(scenario.levelIds)) {
    ids.push(...scenario.levelIds.filter((value): value is string => typeof value === "string"));
  }
  if (Array.isArray(scenario.checkpoints)) {
    for (const checkpoint of scenario.checkpoints) {
      if (
        checkpoint !== null
        && typeof checkpoint === "object"
        && "levelId" in checkpoint
        && typeof checkpoint.levelId === "string"
      ) {
        ids.push(checkpoint.levelId);
      }
    }
  }
  return ids;
}

function levelCanEmit(level: LevelDefinition, eventType: EventType): boolean {
  const hasObject = (kind: LevelObject["kind"]) => level.objects.some((object) => object.kind === kind);
  switch (eventType) {
    case "blocked": return true;
    case "moved": return true;
    case "sword-collected": return hasObject("sword");
    case "boots-collected": return hasObject("boots");
    case "spring-boots-collected": return hasObject("spring-boots");
    case "antidote-leaf-collected": return hasObject("antidote-leaf");
    case "hole-jumped": return level.terrain.some((row) => row.includes("hole")) && hasObject("spring-boots");
    case "key-collected": return hasObject("key");
    case "potion-collected": return hasObject("potion");
    case "animal-rescued": return hasObject("animal");
    case "portal-warped": return hasObject("portal");
    case "treasure-collected": return hasObject("treasure");
    case "door-opened": return hasObject("door") && hasObject("key");
    case "enemy-defeated": return hasObject("enemy") && hasObject("sword");
    case "enemy-too-strong": return hasObject("enemy");
    case "level-won": return true;
  }
}

describe("Plan 07 performance scenario fixtures", () => {
  it("uses the complete stable S01-S11 contract without recorded routes", () => {
    expect(fixtures.schemaVersion).toBe(1);
    expect(fixtures.routePolicy).toBe("derive-from-current-engine");
    expect(fixtures.scenarios.map((scenario) => scenario.id)).toEqual(
      Array.from({ length: 11 }, (_, index) => `S${String(index + 1).padStart(2, "0")}`),
    );
    expect(JSON.stringify(fixtures)).not.toMatch(/"directions"|"coordinates"/);
  });

  it("references current, solvable curated levels by stable ID", () => {
    const ids = new Set<string>();
    for (const scenario of fixtures.scenarios as readonly Record<string, unknown>[]) {
      for (const id of scenarioLevelIds(scenario)) ids.add(id);
    }
    for (const id of ids) {
      const level = getCuratedLevel(id);
      expect(level, id).toBeDefined();
      expect(solveLevel(level!).solvable, id).toBe(true);
    }
    expect(CURATED_LEVELS.some((level) => level.width === 23 && level.height === 23)).toBe(true);
  });

  it("keeps hazard and presentation checkpoints semantically reachable", () => {
    const hazardScenario = fixtures.scenarios.find((scenario) => scenario.id === "S06")!;
    const hazardLevels = hazardScenario.levelIds.map((id) => getCuratedLevel(id)!);
    const presentTerrain = new Set<TerrainKind>(
      hazardLevels.flatMap((level) => level.terrain.flat()),
    );
    for (const terrain of hazardScenario.checkpoint.terrain) {
      expect(presentTerrain.has(terrain as TerrainKind), terrain).toBe(true);
    }

    const presentationScenario = fixtures.scenarios.find((scenario) => scenario.id === "S07")!;
    for (const checkpoint of presentationScenario.checkpoints) {
      const level = getCuratedLevel(checkpoint.levelId)!;
      expect(levelCanEmit(level, checkpoint.eventType as EventType), `${checkpoint.levelId}:${checkpoint.eventType}`).toBe(true);
    }
  });

  it("generates fixed Surprise identities from the current generator", () => {
    const scenario = fixtures.scenarios.find((entry) => entry.id === "S10")!;
    const levels = scenario.surpriseFixtures.map((entry) => generateSurpriseMaze({
      seed: entry.seed,
      size: entry.sizeHint,
      difficulty: entry.difficulty,
    }));
    for (const level of levels) expect(solveLevel(level).solvable, level.id).toBe(true);
    const generatedIds = levels.map((level) => level.id);
    expect(new Set(generatedIds).size).toBe(generatedIds.length);
    expect(generatedIds.every((id) => id.startsWith("surprise-v5-"))).toBe(true);
  });
});
