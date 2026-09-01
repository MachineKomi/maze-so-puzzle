import { describe, expect, it } from "vitest";
import {
  areTerrainTexturesCompatible,
  resolveTerrainTheme,
} from "../artCatalog";
import { createInitialGameState, movePlayer } from "./engine";
import {
  CURATED_LEVELS,
  LANTERNLIGHT_LABYRINTH_LEVEL,
  MOVEMENT_LEVEL,
  parseAsciiLevel,
  WISHING_WOODS_LEVEL,
} from "./levels";
import { solveLevel, validateLevel } from "./solver";
import type { LevelDefinition, TerrainKind } from "./types";
import {
  ANIMALS_PER_LEVEL,
  ANIMAL_SPECIES,
  CAGE_STYLE_IDS,
  ENEMY_STYLE_IDS,
  TERRAIN_THEME_IDS,
  WEAPON_STYLE_IDS,
} from "./types";

function largestConnectedTerrainRegion(
  level: LevelDefinition,
  terrainKind: TerrainKind,
): number {
  const seen = new Set<string>();
  let largest = 0;
  const key = (x: number, y: number) => `${x},${y}`;

  for (let y = 0; y < level.height; y += 1) {
    for (let x = 0; x < level.width; x += 1) {
      if (level.terrain[y]?.[x] !== terrainKind || seen.has(key(x, y))) continue;
      const queue = [{ x, y }];
      seen.add(key(x, y));
      for (let head = 0; head < queue.length; head += 1) {
        const point = queue[head];
        if (point === undefined) continue;
        for (const [dx, dy] of [[0, -1], [1, 0], [0, 1], [-1, 0]] as const) {
          const next = { x: point.x + dx, y: point.y + dy };
          if (level.terrain[next.y]?.[next.x] !== terrainKind || seen.has(key(next.x, next.y))) {
            continue;
          }
          seen.add(key(next.x, next.y));
          queue.push(next);
        }
      }
      largest = Math.max(largest, queue.length);
    }
  }
  return largest;
}

describe("curated campaign levels", () => {
  it("starts with a gentle movement teaching level", () => {
    expect(CURATED_LEVELS[0]).toBe(MOVEMENT_LEVEL);
    expect(MOVEMENT_LEVEL.objects.filter((object) => object.kind === "enemy")).toEqual([]);
    expect(MOVEMENT_LEVEL.objects.filter((object) => object.kind === "sword")).toHaveLength(1);
    expect(MOVEMENT_LEVEL.width).toBe(9);
  });

  it("mixes readable maze sizes before the 25 by 25 exploration finale", () => {
    expect(CURATED_LEVELS.map((level) => [level.width, level.height])).toEqual([
      [9, 9],
      [11, 11],
      [13, 13],
      [15, 15],
      [13, 13],
      [15, 15],
      [17, 17],
      [17, 17],
      [19, 19],
      [25, 25],
    ]);
    expect(CURATED_LEVELS.map((level) => solveLevel(level).directions.length)).toEqual([
      26,
      36,
      62,
      78,
      66,
      90,
      114,
      116,
      190,
      290,
    ]);
  });

  it("uses connected pools and lava patches once boots and hazards are introduced", () => {
    const levelsWithHazards = CURATED_LEVELS.filter((level) =>
      level.terrain.some((row) => row.some((tile) => tile === "water" || tile === "lava")),
    );

    expect(levelsWithHazards).toHaveLength(8);
    for (const level of levelsWithHazards) {
      for (const terrainKind of ["water", "lava"] as const) {
        const tileCount = level.terrain.flat().filter((tile) => tile === terrainKind).length;
        if (tileCount > 0) {
          expect(largestConnectedTerrainRegion(level, terrainKind), level.name)
            .toBeGreaterThanOrEqual(2);
        }
      }
    }
  });

  it("turns the later story mazes into real detour puzzles with safe spring jumps", () => {
    const backtrackingLevels = CURATED_LEVELS.filter((level) =>
      level.introducedMechanics?.includes("required-backtracking"),
    );
    expect(backtrackingLevels).toHaveLength(4);

    for (const level of backtrackingLevels) {
      const springBoots = level.objects.filter(
        (object) => object.kind === "spring-boots",
      );
      const holeCount = level.terrain.flat().filter((tile) => tile === "hole").length;
      expect(springBoots, level.name).toHaveLength(1);
      expect(holeCount, level.name).toBeGreaterThanOrEqual(2);
      expect(largestConnectedTerrainRegion(level, "hole"), level.name)
        .toBeGreaterThanOrEqual(2);

      const solution = solveLevel(level);
      let state = createInitialGameState(level);
      const visited = new Set([`${state.position.x},${state.position.y}`]);
      let revisitedTiles = 0;
      const events: string[] = [];
      for (const direction of solution.directions) {
        const result = movePlayer(level, state, direction);
        state = result.state;
        events.push(...result.events.map((event) => event.type));
        const position = `${state.position.x},${state.position.y}`;
        if (visited.has(position)) revisitedTiles += 1;
        visited.add(position);
      }

      expect(state).toMatchObject({ status: "won", hasSpringBoots: true });
      expect(revisitedTiles, `${level.name} should require an out-and-back detour.`)
        .toBeGreaterThan(0);
      expect(events.indexOf("spring-boots-collected"), level.name).toBeGreaterThanOrEqual(0);
      expect(events.indexOf("hole-jumped"), level.name)
        .toBeGreaterThan(events.indexOf("spring-boots-collected"));
    }
  });

  it.each(CURATED_LEVELS.map((level) => [level.name, level] as const))(
    "%s is square, structurally valid, and safely solvable",
    (_name, level) => {
      const validation = validateLevel(level);
      expect(validation.errors).toEqual([]);
      expect(validation.valid).toBe(true);
      expect(validation.solution.length).toBeGreaterThan(0);
      expect(level.width).toBe(level.height);

      let state = createInitialGameState(level);
      for (const direction of validation.solution) {
        state = movePlayer(level, state, direction).state;
      }
      expect(state.status).toBe("won");
    },
  );

  it.each(CURATED_LEVELS.map((level) => [level.name, level] as const))(
    "%s has three distinct optional animal rescues and all three can be saved safely",
    (_name, level) => {
      const animals = level.objects.filter((object) => object.kind === "animal");
      const species = animals.map((animal) => animal.species);
      expect(animals).toHaveLength(ANIMALS_PER_LEVEL);
      expect(new Set(species).size).toBe(ANIMALS_PER_LEVEL);
      expect(
        species.every((animalSpecies) => ANIMAL_SPECIES.includes(animalSpecies)),
      ).toBe(true);

      const ordinaryWin = solveLevel(level);
      const perfectRescueWin = solveLevel(level, { requireAllAnimals: true });
      expect(ordinaryWin.finalState?.rescuedAnimalIds).toHaveLength(0);
      expect(perfectRescueWin.solvable).toBe(true);
      expect(perfectRescueWin.finalState?.rescuedAnimalIds).toHaveLength(ANIMALS_PER_LEVEL);
    },
  );

  it("gives every story maze an intentional theme and varied illustrated objects", () => {
    expect(CURATED_LEVELS.map((level) => level.terrainThemeId)).toEqual([
      "sunny-stone",
      "rose-courtyard",
      "moonlit-moat",
      "star-garden",
      "ember-keep",
      "moonbeam-castle",
      "wishing-woods",
      "parade-courtyard",
      "springstep-hollow",
      "lantern-ruins",
    ]);
    expect(new Set(CURATED_LEVELS.map((level) => level.terrainThemeId)).size)
      .toBe(CURATED_LEVELS.length);
    expect(
      [...new Set(CURATED_LEVELS.map((level) => level.terrainThemeId))].sort(),
    ).toEqual([...TERRAIN_THEME_IDS].sort());

    for (const level of CURATED_LEVELS) {
      const terrainTheme = resolveTerrainTheme(level.terrainThemeId);
      const weapons = level.objects.filter((object) => object.kind === "sword");
      const enemies = level.objects.filter((object) => object.kind === "enemy");
      const animals = level.objects.filter((object) => object.kind === "animal");

      expect(
        areTerrainTexturesCompatible(terrainTheme.floor, terrainTheme.wall),
        `${level.name} should use a harmonious light-floor/dark-wall theme.`,
      ).toBe(true);
      expect(weapons, `${level.name} should contain one weapon.`).toHaveLength(1);
      expect(WEAPON_STYLE_IDS).toContain(weapons[0]?.style);
      expect(
        enemies.every(
          (enemy) => enemy.style !== undefined && ENEMY_STYLE_IDS.includes(enemy.style),
        ),
      ).toBe(true);
      expect(
        animals.every(
          (animal) =>
            animal.cageStyle !== undefined && CAGE_STYLE_IDS.includes(animal.cageStyle),
        ),
      ).toBe(true);
    }

    const weaponStyles = CURATED_LEVELS.flatMap((level) =>
      level.objects.flatMap((object) =>
        object.kind === "sword" && object.style !== undefined ? [object.style] : [],
      ),
    );
    const enemyStyles = CURATED_LEVELS.flatMap((level) =>
      level.objects.flatMap((object) =>
        object.kind === "enemy" && object.style !== undefined ? [object.style] : [],
      ),
    );
    const cageStyles = CURATED_LEVELS.flatMap((level) =>
      level.objects.flatMap((object) =>
        object.kind === "animal" && object.cageStyle !== undefined
          ? [object.cageStyle]
          : [],
      ),
    );
    const campaignSpecies = CURATED_LEVELS.flatMap((level) =>
      level.objects.flatMap((object) =>
        object.kind === "animal" ? [object.species] : [],
      ),
    );

    expect([...new Set(weaponStyles)].sort()).toEqual([...WEAPON_STYLE_IDS].sort());
    expect([...new Set(enemyStyles)].sort()).toEqual([...ENEMY_STYLE_IDS].sort());
    expect([...new Set(cageStyles)].sort()).toEqual([...CAGE_STYLE_IDS].sort());
    expect([...new Set(campaignSpecies)].sort()).toEqual([...ANIMAL_SPECIES].sort());
  });

  it("keeps the giant exploration finale gentle, ordered, and rewarding to fully explore", () => {
    const ordinaryWin = solveLevel(LANTERNLIGHT_LABYRINTH_LEVEL);
    const perfectRescueWin = solveLevel(LANTERNLIGHT_LABYRINTH_LEVEL, {
      requireAllAnimals: true,
    });

    expect(ordinaryWin.directions).toHaveLength(290);
    expect(ordinaryWin.finalState).toMatchObject({
      power: 29,
      hasSword: true,
      hasBoots: true,
      hasSpringBoots: true,
      keys: ["blue", "red", "yellow"],
      status: "won",
    });
    expect(ordinaryWin.finalState?.defeatedEnemyIds).toHaveLength(4);
    expect(ordinaryWin.finalState?.openedDoorIds).toHaveLength(3);
    expect(perfectRescueWin.directions).toHaveLength(322);
    expect(perfectRescueWin.finalState?.rescuedAnimalIds).toHaveLength(ANIMALS_PER_LEVEL);

    let state = createInitialGameState(LANTERNLIGHT_LABYRINTH_LEVEL);
    const progressionEvents: string[] = [];
    for (const direction of ordinaryWin.directions) {
      const result = movePlayer(LANTERNLIGHT_LABYRINTH_LEVEL, state, direction);
      state = result.state;
      progressionEvents.push(
        ...result.events
          .filter((event) => event.type !== "moved" && event.type !== "level-won")
          .map((event) => event.type),
      );
    }
    expect(progressionEvents).toEqual([
      "sword-collected",
      "enemy-defeated",
      "potion-collected",
      "key-collected",
      "door-opened",
      "boots-collected",
      "enemy-defeated",
      "key-collected",
      "door-opened",
      "enemy-defeated",
      "key-collected",
      "door-opened",
      "potion-collected",
      "spring-boots-collected",
      "hole-jumped",
      "enemy-defeated",
    ]);
  });

  it("makes the Wishing Woods kitten a safe optional miniboss stretch rescue", () => {
    const objectAt = (x: number, y: number) => {
      const object = WISHING_WOODS_LEVEL.objects.find(
        (candidate) => candidate.at.x === x && candidate.at.y === y,
      );
      expect(object, `Expected a Wishing Woods object at ${x},${y}.`).toBeDefined();
      if (object === undefined) {
        throw new Error(`Missing Wishing Woods object at ${x},${y}.`);
      }
      return object;
    };

    const sword = objectAt(7, 15);
    const firstEnemy = objectAt(11, 14);
    const potion = objectAt(15, 15);
    const bridgeEnemy = objectAt(13, 10);
    const guardian = objectAt(15, 8);
    const kitten = objectAt(15, 7);

    expect(sword.kind).toBe("sword");
    expect(firstEnemy).toMatchObject({
      kind: "enemy",
      power: 2,
      style: "mushroom-imp",
    });
    expect(potion).toMatchObject({ kind: "potion", amount: 2 });
    expect(bridgeEnemy).toMatchObject({
      kind: "enemy",
      power: 5,
      style: "mushroom-imp",
    });
    expect(guardian).toMatchObject({
      kind: "enemy",
      power: 9,
      style: "pebble-golem",
    });
    expect(kitten).toMatchObject({ kind: "animal", species: "kitten" });

    const ordinaryWin = solveLevel(WISHING_WOODS_LEVEL);
    const perfectRescueWin = solveLevel(WISHING_WOODS_LEVEL, {
      requireAllAnimals: true,
    });

    expect(ordinaryWin.directions).toHaveLength(114);
    expect(ordinaryWin.finalState).toMatchObject({
      power: 20,
      rescuedAnimalIds: [],
      status: "won",
    });
    expect(ordinaryWin.finalState?.defeatedEnemyIds).toHaveLength(3);
    expect(ordinaryWin.finalState?.defeatedEnemyIds).not.toContain(guardian.id);

    expect(perfectRescueWin.directions).toHaveLength(148);
    expect(perfectRescueWin.finalState).toMatchObject({
      power: 29,
      status: "won",
    });
    expect(perfectRescueWin.finalState?.rescuedAnimalIds).toHaveLength(ANIMALS_PER_LEVEL);
    expect(perfectRescueWin.finalState?.defeatedEnemyIds).toHaveLength(4);
    expect(perfectRescueWin.finalState?.defeatedEnemyIds).toContain(guardian.id);

    let state = createInitialGameState(WISHING_WOODS_LEVEL);
    const puzzleObjectIds = new Set([
      sword.id,
      firstEnemy.id,
      potion.id,
      bridgeEnemy.id,
      guardian.id,
      kitten.id,
    ]);
    const puzzleProgression: string[] = [];
    for (const direction of perfectRescueWin.directions) {
      const result = movePlayer(WISHING_WOODS_LEVEL, state, direction);
      state = result.state;
      for (const event of result.events) {
        if (!("objectId" in event) || !puzzleObjectIds.has(event.objectId)) {
          continue;
        }
        if (event.type === "enemy-defeated" || event.type === "potion-collected") {
          puzzleProgression.push(
            `${event.type}:${event.objectId}:${event.powerBefore}->${event.powerAfter}`,
          );
        } else {
          puzzleProgression.push(`${event.type}:${event.objectId}`);
        }
      }
    }
    expect(puzzleProgression).toEqual([
      `sword-collected:${sword.id}`,
      `enemy-defeated:${firstEnemy.id}:2->4`,
      `potion-collected:${potion.id}:4->6`,
      `enemy-defeated:${bridgeEnemy.id}:6->11`,
      `enemy-defeated:${guardian.id}:11->20`,
      `animal-rescued:${kitten.id}`,
    ]);

    // The tempting branch is visible at Power 6, but remains safely optional.
    let scoutingState = createInitialGameState(WISHING_WOODS_LEVEL);
    for (const direction of ordinaryWin.directions) {
      scoutingState = movePlayer(WISHING_WOODS_LEVEL, scoutingState, direction).state;
      if (
        scoutingState.position.x === 15 &&
        scoutingState.position.y === 11 &&
        scoutingState.power === 6
      ) {
        break;
      }
    }
    expect(scoutingState).toMatchObject({
      position: { x: 15, y: 11 },
      power: 6,
      hasSword: true,
      status: "playing",
    });
    scoutingState = movePlayer(WISHING_WOODS_LEVEL, scoutingState, "up").state;
    scoutingState = movePlayer(WISHING_WOODS_LEVEL, scoutingState, "up").state;
    const earlyChallenge = movePlayer(WISHING_WOODS_LEVEL, scoutingState, "up");
    expect(earlyChallenge.moved).toBe(false);
    expect(earlyChallenge.state.status).toBe("lost");
    expect(earlyChallenge.events).toContainEqual({
      type: "combat-lost",
      objectId: guardian.id,
      playerPower: 6,
      enemyPower: 9,
      enemyPowerAfter: 15,
    });
  });

  it.each(CURATED_LEVELS.map((level) => [level.name, level] as const))(
    "%s only exposes underpowered combat when it is an intentional puzzle clue",
    (_name, level) => {
      const initial = createInitialGameState(level);
      const queue = [initial];
      const signature = (state: typeof initial): string => [
        state.position.x,
        state.position.y,
        state.power,
        state.hasSword ? 1 : 0,
        state.hasBoots ? 1 : 0,
        state.hasSpringBoots ? 1 : 0,
        state.keys.join(","),
        state.collectedObjectIds.join(","),
        state.rescuedAnimalIds.join(","),
        state.defeatedEnemyIds.join(","),
        state.openedDoorIds.join(","),
      ].join("|");
      const seen = new Set([signature(initial)]);

      for (let head = 0; head < queue.length; head += 1) {
        const current = queue[head];
        if (current === undefined) {
          continue;
        }

        for (const direction of ["up", "down", "left", "right"] as const) {
          const result = movePlayer(level, current, direction);
          const loss = result.events.find((event) => event.type === "combat-lost");
          const isIntentionalOptionalGuardian =
            level === WISHING_WOODS_LEVEL &&
            loss?.type === "combat-lost" &&
            loss.objectId === level.objects.find(
              (object) =>
                object.kind === "enemy" &&
                object.at.x === 15 &&
                object.at.y === 8 &&
                object.power === 9,
            )?.id;
          const isIntentionalBacktrackingClue =
            level.introducedMechanics?.includes("required-backtracking") ?? false;
          if (
            loss?.type === "combat-lost" &&
            !isIntentionalOptionalGuardian &&
            !isIntentionalBacktrackingClue
          ) {
            throw new Error(
              `${level.id} exposes enemy ${loss.enemyPower} to Ame at Power ${loss.playerPower}.`,
            );
          }

          if (result.moved && result.state.status === "playing") {
            const nextSignature = signature(result.state);
            if (!seen.has(nextSignature)) {
              seen.add(nextSignature);
              queue.push(result.state);
            }
          }
        }
      }
    },
  );

  it("keeps every required gate on the winning route", () => {
    const expectedKinds = [
      { animal: 3, sword: 1 },
      { animal: 3, sword: 1, enemy: 1, key: 1, door: 1 },
      { animal: 3, sword: 1, potion: 1, enemy: 2, boots: 1, key: 1, door: 1 },
      { animal: 3, enemy: 2, door: 2, sword: 1, key: 2, boots: 1, potion: 1 },
      { animal: 3, sword: 1, potion: 1, enemy: 3, boots: 1, key: 2, door: 2 },
      { animal: 3, key: 3, door: 3, enemy: 2, sword: 1, boots: 1, potion: 1 },
      {
        animal: 3,
        sword: 1,
        enemy: 4,
        key: 3,
        potion: 1,
        door: 3,
        boots: 1,
        "spring-boots": 1,
      },
      {
        animal: 3,
        key: 3,
        door: 3,
        enemy: 4,
        sword: 1,
        boots: 1,
        "spring-boots": 1,
        potion: 2,
      },
      {
        animal: 3,
        key: 1,
        enemy: 3,
        door: 1,
        boots: 1,
        sword: 1,
        potion: 1,
        "spring-boots": 1,
      },
      {
        animal: 3,
        potion: 2,
        enemy: 4,
        boots: 1,
        "spring-boots": 1,
        key: 3,
        door: 3,
        sword: 1,
      },
    ] as const;
    const expectedEnemyCounts = [0, 1, 2, 2, 3, 2, 3, 4, 3, 4] as const;
    const expectedDoorCounts = [0, 1, 1, 2, 2, 3, 3, 3, 1, 3] as const;

    CURATED_LEVELS.forEach((level, index) => {
      const counts = Object.fromEntries(
        [...new Set(level.objects.map((object) => object.kind))].map((kind) => [
          kind,
          level.objects.filter((object) => object.kind === kind).length,
        ]),
      );
      expect(counts).toEqual(expectedKinds[index]);

      const result = solveLevel(level);
      expect(result.finalState?.hasSword).toBe(true);
      expect(result.finalState?.hasBoots).toBe(index > 1);
      expect(result.finalState?.hasSpringBoots).toBe(index >= 6);
      expect(result.finalState?.defeatedEnemyIds).toHaveLength(expectedEnemyCounts[index] ?? 0);
      expect(result.finalState?.openedDoorIds).toHaveLength(expectedDoorCounts[index] ?? 0);
    });
  });

  it("uses gameplay state rather than plain floor connectivity", () => {
    const impossible = parseAsciiLevel({
      id: "stateful-impossible",
      name: "Stateful Impossible",
      objective: "Test",
      map: [
        "#######",
        "#@4..E#",
        "#######",
        "#######",
        "#######",
        "#######",
        "#######",
      ],
    });

    const result = solveLevel(impossible);
    expect(result.solvable).toBe(false);
    expect(result.reason).toBe("unsolvable");

    const springBootsBehindHole = parseAsciiLevel({
      id: "spring-boots-behind-hole",
      name: "Spring Boots Behind Hole",
      objective: "Test",
      map: [
        "#######",
        "#@oj.E#",
        "#######",
        "#######",
        "#######",
        "#######",
        "#######",
      ],
    });
    expect(solveLevel(springBootsBehindHole)).toMatchObject({
      solvable: false,
      reason: "unsolvable",
    });
  });

  it("enforces a finite state cap without allowing invalid numeric options", () => {
    const capped = solveLevel(MOVEMENT_LEVEL, { maxStates: 1 });
    expect(capped.reason).toBe("state-limit");
    expect(capped.visitedStates).toBe(1);

    expect(solveLevel(MOVEMENT_LEVEL, { maxStates: Number.NaN }).reason).toBe("solved");
  });

  it("rejects unknown terrain data at the runtime validation boundary", () => {
    const terrain = MOVEMENT_LEVEL.terrain.map((row) => [...row]);
    (terrain[1] as unknown as string[])[1] = "cloud";
    const invalid = { ...MOVEMENT_LEVEL, terrain } as typeof MOVEMENT_LEVEL;

    const result = validateLevel(invalid);
    expect(result.valid).toBe(false);
    expect(result.errors).toContain("Terrain tile 1,1 has an unknown kind.");
  });
});
