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
    ["Rose Heart Roundabout", ROSE_HEART_ROUNDABOUT_LEVEL, 105, 117, 33, 1, 1],
    ["Clover Comeback Carnival", CLOVER_COMEBACK_CARNIVAL_LEVEL, 103, 177, 21, 3, 1],
    ["Friendship Crown Vault", FRIENDSHIP_CROWN_VAULT_LEVEL, 231, 260, 54, 3, 3],
  ] as const)(
    "%s requires portal travel, physical backtracking, and optional rescue detours",
    (_name, level, ordinaryLength, perfectLength, minimumMovedRevisits, defeatedCount, doorCount) => {
      const ordinary = solveLevel(level);
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
      expect(ordinary.finalState?.defeatedEnemyIds).toHaveLength(defeatedCount);
      expect(ordinary.finalState?.openedDoorIds).toHaveLength(doorCount);
      expect(perfect.finalState?.rescuedAnimalIds).toHaveLength(animalCount);
      expect(movedRevisits).toBeGreaterThanOrEqual(minimumMovedRevisits);
      expect(events.filter((event) => event === "portal-warped").length)
        .toBeGreaterThanOrEqual(2);
    },
  );
});
