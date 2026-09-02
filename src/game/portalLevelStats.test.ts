import { describe, expect, it } from "vitest";
import { createInitialGameState, movePlayer } from "./engine";
import {
  CLOVER_COMEBACK_CARNIVAL_LEVEL,
  FRIENDSHIP_CROWN_VAULT_LEVEL,
  ROSE_HEART_ROUNDABOUT_LEVEL,
} from "./levels";
import { solveLevel } from "./solver";

describe("portal level design stats", () => {
  it.each([
    ["Rose Heart Roundabout", ROSE_HEART_ROUNDABOUT_LEVEL, 28, 42, 1],
    ["Clover Comeback Carnival", CLOVER_COMEBACK_CARNIVAL_LEVEL, 103, 177, 21],
    ["Friendship Crown Vault", FRIENDSHIP_CROWN_VAULT_LEVEL, 44, 56, 0],
  ] as const)(
    "%s requires portal travel and keeps rescue detours optional",
    (_name, level, ordinaryLength, perfectLength, minimumMovedRevisits) => {
      const ordinary = solveLevel(level, { avoidAnimals: true });
      const perfect = solveLevel(level, { requireAllAnimals: true });
      let state = createInitialGameState(level);
      const events: string[] = [];
      const visited = new Set([`${state.position.x},${state.position.y}`]);
      let movedRevisits = 0;
      for (const direction of ordinary.directions) {
        const result = movePlayer(level, state, direction);
        state = result.state;
        events.push(...result.events.filter((event) => event.type !== "moved").map((event) => event.type));
        if (result.moved) {
          const key = `${state.position.x},${state.position.y}`;
          if (visited.has(key)) movedRevisits += 1;
          visited.add(key);
        }
      }
      const portalCount = level.objects.filter((object) => object.kind === "portal").length;
      const animalCount = level.objects.filter((object) => object.kind === "animal").length;
      expect(portalCount).toBeGreaterThanOrEqual(2);
      expect(portalCount % 2).toBe(0);
      expect(ordinary.directions).toHaveLength(ordinaryLength);
      expect(perfect.directions).toHaveLength(perfectLength);
      expect(ordinary.finalState).toMatchObject({
        status: "won",
        rescuedAnimalIds: [],
      });
      expect(ordinary.finalState?.openedDoorIds.length).toBeGreaterThanOrEqual(1);
      expect(perfect.finalState?.rescuedAnimalIds).toHaveLength(animalCount);
      expect(movedRevisits).toBeGreaterThanOrEqual(minimumMovedRevisits);
      expect(events.filter((event) => event === "portal-warped").length)
        .toBeGreaterThanOrEqual(2);
    },
  );

  it("makes all three Crown Vault keys, doors, and portal pairs required", () => {
    const level = FRIENDSHIP_CROWN_VAULT_LEVEL;
    const ordinary = solveLevel(level, { avoidAnimals: true });
    expect(ordinary.solvable).toBe(true);
    expect(ordinary.finalState?.keys).toEqual(["blue", "red", "yellow"]);
    expect(ordinary.finalState?.openedDoorIds).toEqual(
      level.objects.filter((object) => object.kind === "door").map((object) => object.id).sort(),
    );

    let state = createInitialGameState(level);
    const usedPortalPairs: string[] = [];
    for (const direction of ordinary.directions) {
      const result = movePlayer(level, state, direction);
      state = result.state;
      usedPortalPairs.push(...result.events.flatMap((event) => (
        event.type === "portal-warped" ? [event.pair] : []
      )));
    }
    const expectedPairs = [...new Set(level.objects.flatMap((object) => (
      object.kind === "portal" ? [object.pair] : []
    )))].sort();
    expect(usedPortalPairs.sort()).toEqual(expectedPairs);

    for (const color of ["red", "yellow", "blue"] as const) {
      const withoutKey = {
        ...level,
        objects: level.objects.filter((object) => object.kind !== "key" || object.color !== color),
      };
      expect(solveLevel(withoutKey, { avoidAnimals: true }).solvable, color).toBe(false);
    }
  }, 120_000);
});
