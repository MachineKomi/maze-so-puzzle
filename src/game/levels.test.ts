import { describe, expect, it } from "vitest";
import {
  areTerrainTexturesCompatible,
  resolveTerrainTheme,
} from "../artCatalog";
import { createInitialGameState, movePlayer } from "./engine";
import {
  CURATED_LEVELS,
  AUTHORED_CAMPAIGN_ANIMAL_SPECIES,
  LANTERNLIGHT_LABYRINTH_LEVEL,
  MOONLIT_FRIENDSHIP_QUEST_LEVEL,
  MOVEMENT_LEVEL,
  parseAsciiLevel,
  RAINBOW_POWER_PARADE_LEVEL,
  TWILIGHT_TREASURE_LOOP_LEVEL,
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
    expect(MOVEMENT_LEVEL.width).toBeLessThanOrEqual(6);
    const requiredFirstStep = solveLevel(MOVEMENT_LEVEL, { avoidAnimals: true }).directions[0];
    expect(requiredFirstStep).toBe("up");
    expect(movePlayer(MOVEMENT_LEVEL, createInitialGameState(MOVEMENT_LEVEL), requiredFirstStep!).state.rescuedAnimalIds)
      .toEqual([]);
  });

  it("enforces the absolute 24 by 24 maze ceiling at validation", () => {
    const oversized: LevelDefinition = {
      ...MOVEMENT_LEVEL,
      id: "oversized-test-maze",
      width: 25,
      height: 25,
      terrain: [
        ...MOVEMENT_LEVEL.terrain.map((row) => [
          ...row,
          ...Array.from<TerrainKind>({ length: 16 }).fill("wall"),
        ]),
        ...Array.from({ length: 16 }, () => Array.from<TerrainKind>({ length: 25 }).fill("wall")),
      ],
    };

    expect(validateLevel(oversized).errors).toContain("Maze dimensions cannot exceed 24 tiles.");
  });

  it("mixes readable maze sizes instead of increasing monotonically", () => {
    expect(CURATED_LEVELS.map((level) => [level.width, level.height])).toEqual([
      [6, 6],
      [11, 11],
      [13, 13],
      [15, 15],
      [13, 13],
      [15, 15],
      [17, 17],
      [17, 17],
      [19, 19],
      [23, 23],
      [21, 21],
      [23, 23],
      [13, 13],
      [17, 17],
      [17, 17],
      [17, 17],
    ]);
    expect(CURATED_LEVELS.map((level) => solveLevel(level, { avoidAnimals: true }).directions.length)).toEqual([
      6,
      38,
      65,
      82,
      71,
      95,
      120,
      123,
      182,
      150,
      204,
      164,
      29,
      104,
      47,
      62,
    ]);
    expect(CURATED_LEVELS.every((level) => level.width <= 24 && level.height <= 24))
      .toBe(true);
  });

  it("uses connected pools and lava patches once boots and hazards are introduced", () => {
    const levelsWithHazards = CURATED_LEVELS.filter((level) =>
      level.terrain.some((row) => row.some((tile) => tile === "water" || tile === "lava")),
    );

    expect(levelsWithHazards).toHaveLength(11);
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
      level.objects.some((object) => object.kind === "spring-boots")
        && level.introducedMechanics?.includes("required-backtracking"),
    );

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
        if (result.moved && visited.has(position)) revisitedTiles += 1;
        if (result.moved) visited.add(position);
      }

      expect(state).toMatchObject({ status: "won", hasSpringBoots: true });
      if (level.introducedMechanics?.includes("required-return-trip")) {
        expect(revisitedTiles, `${level.name} should require an out-and-back detour.`)
          .toBeGreaterThan(0);
      }
      expect(events.indexOf("spring-boots-collected"), level.name).toBeGreaterThanOrEqual(0);
      expect(events.indexOf("hole-jumped"), level.name)
        .toBeGreaterThan(events.indexOf("spring-boots-collected"));
    }
  });

  it("varies authored Spring Boots puzzles across one, two, and three holes", () => {
    const jumpLengths = new Set<number>();
    for (const level of CURATED_LEVELS) {
      const perfectRoute = solveLevel(level, { requireAllAnimals: true });
      let state = createInitialGameState(level);
      for (const direction of perfectRoute.directions) {
        const result = movePlayer(level, state, direction);
        state = result.state;
        for (const event of result.events) {
          if (event.type === "hole-jumped") jumpLengths.add(event.over.length);
        }
      }
    }
    expect([...jumpLengths].sort()).toEqual([1, 2, 3]);

    const crossroad = { x: 8, y: 4 };
    expect(LANTERNLIGHT_LABYRINTH_LEVEL.terrain[crossroad.y]?.[crossroad.x]).toBe("hole");
    for (const [dx, dy] of [[0, -1], [1, 0], [0, 1], [-1, 0]] as const) {
      expect(LANTERNLIGHT_LABYRINTH_LEVEL.terrain[crossroad.y + dy]?.[crossroad.x + dx])
        .not.toBe("wall");
    }
  }, 10_000);

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

  const rescueCounts = [1, 2, 3, 3, 3, 3, 3, 3, 3, 3, 4, 5, 3, 4, 5, 5] as const;

  it.each(CURATED_LEVELS.map((level, index) => [
    level.name,
    level,
    rescueCounts[index]!,
  ] as const))(
    "%s has a scale-appropriate set of distinct optional rescues",
    (_name, level, expectedRescueCount) => {
      const animals = level.objects.filter((object) => object.kind === "animal");
      const species = animals.map((animal) => animal.species);
      expect(animals).toHaveLength(expectedRescueCount);
      expect(new Set(species).size).toBe(expectedRescueCount);
      expect(
        species.every((animalSpecies) => ANIMAL_SPECIES.includes(animalSpecies)),
      ).toBe(true);

      const ordinaryWin = solveLevel(level, { avoidAnimals: true });
      const perfectRescueWin = solveLevel(level, { requireAllAnimals: true });
      expect(ordinaryWin.finalState?.rescuedAnimalIds).toHaveLength(0);
      expect(perfectRescueWin.solvable).toBe(true);
      expect(perfectRescueWin.finalState?.rescuedAnimalIds).toHaveLength(
        expectedRescueCount,
      );
    },
  );

  it.each([TWILIGHT_TREASURE_LOOP_LEVEL, MOONLIT_FRIENDSHIP_QUEST_LEVEL])(
    "%s retains ordered, stateful prerequisites without endurance-only routes",
    (level) => {
      const solution = solveLevel(level, { avoidAnimals: true });
      let state = createInitialGameState(level);
      const events: string[] = [];
      let firstPoisonStep = -1;
      let antidoteLeafStep = -1;

      for (const [index, direction] of solution.directions.entries()) {
        const result = movePlayer(level, state, direction);
        state = result.state;
        events.push(...result.events.map((event) => event.type));
        if (result.events.some((event) => event.type === "antidote-leaf-collected")) {
          antidoteLeafStep = index;
        }
        if (firstPoisonStep < 0 && level.terrain[state.position.y]?.[state.position.x] === "poison") {
          firstPoisonStep = index;
        }
      }

      expect(solution.solvable).toBe(true);
      expect(solution.directions.length).toBeLessThan(210);
      expect(state).toMatchObject({
        status: "won",
        hasSword: true,
        hasBoots: true,
        hasSpringBoots: true,
        rescuedAnimalIds: [],
      });
      expect(events.indexOf("spring-boots-collected")).toBeLessThan(events.indexOf("hole-jumped"));
      expect(events).toContain("key-collected");
      expect(events).toContain("door-opened");
      if (level.objects.some((object) => object.kind === "antidote-leaf")) {
        expect(antidoteLeafStep).toBeGreaterThanOrEqual(0);
        expect(firstPoisonStep).toBeGreaterThan(antidoteLeafStep);
      }
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
      "pearl-grotto",
      "moonbeam-castle",
      "rose-courtyard",
      "springstep-hollow",
      "moonbeam-castle",
      "harvest-bramble",
    ]);
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
    expect([...new Set(campaignSpecies)].sort()).toEqual(
      [...AUTHORED_CAMPAIGN_ANIMAL_SPECIES].sort(),
    );
  });

  it("makes compact Lanternlight rooms rich, ordered, and rewarding to revisit", () => {
    const ordinaryWin = solveLevel(LANTERNLIGHT_LABYRINTH_LEVEL);
    const perfectRescueWin = solveLevel(LANTERNLIGHT_LABYRINTH_LEVEL, {
      requireAllAnimals: true,
    });

    expect(ordinaryWin.directions).toHaveLength(150);
    expect(ordinaryWin.finalState).toMatchObject({
      power: 17,
      hasSword: true,
      hasBoots: true,
      hasSpringBoots: true,
      keys: ["yellow"],
      status: "won",
    });
    expect(ordinaryWin.finalState?.defeatedEnemyIds).toHaveLength(3);
    expect(ordinaryWin.finalState?.openedDoorIds).toHaveLength(1);
    expect(perfectRescueWin.directions).toHaveLength(205);
    expect(perfectRescueWin.finalState?.rescuedAnimalIds).toHaveLength(ANIMALS_PER_LEVEL);

    const monsterTreasureRoom = LANTERNLIGHT_LABYRINTH_LEVEL.objects.filter(
      (object) => object.at.x >= 5 && object.at.x <= 9 && object.at.y >= 2 && object.at.y <= 5,
    );
    expect(monsterTreasureRoom.filter((object) => object.kind === "animal")).toHaveLength(2);
    expect(monsterTreasureRoom.filter((object) => object.kind === "treasure")).toHaveLength(2);
    expect(monsterTreasureRoom).toContainEqual(expect.objectContaining({ kind: "enemy", power: 10 }));

    let state = createInitialGameState(LANTERNLIGHT_LABYRINTH_LEVEL);
    const progressionEvents: string[] = [];
    for (const direction of ordinaryWin.directions) {
      const result = movePlayer(LANTERNLIGHT_LABYRINTH_LEVEL, state, direction);
      state = result.state;
      progressionEvents.push(
        ...result.events
          .filter((event) => event.type !== "moved" && event.type !== "level-won" && event.type !== "treasure-collected")
          .map((event) => event.type),
      );
    }
    expect(progressionEvents).toEqual([
      "sword-collected",
      "enemy-defeated",
      "potion-collected",
      "enemy-defeated",
      "boots-collected",
      "spring-boots-collected",
      "hole-jumped",
      "enemy-defeated",
      "key-collected",
      "door-opened",
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

    expect(ordinaryWin.directions).toHaveLength(120);
    expect(ordinaryWin.finalState).toMatchObject({
      power: 20,
      rescuedAnimalIds: [],
      status: "won",
    });
    expect(ordinaryWin.finalState?.defeatedEnemyIds).toHaveLength(3);
    expect(ordinaryWin.finalState?.defeatedEnemyIds).not.toContain(guardian.id);

    expect(perfectRescueWin.directions).toHaveLength(153);
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
    expect(earlyChallenge.state).toBe(scoutingState);
    expect(earlyChallenge.state.status).toBe("playing");
    expect(earlyChallenge.events).toContainEqual({
      type: "enemy-too-strong",
      objectId: guardian.id,
      playerPower: 6,
      enemyPower: 9,
    });
  });

  it("makes the Power 99 finale a compact growth-and-return puzzle with optional rescues", () => {
    const ordinaryWin = solveLevel(RAINBOW_POWER_PARADE_LEVEL, {
      avoidAnimals: true,
    });
    const perfectWin = solveLevel(RAINBOW_POWER_PARADE_LEVEL, {
      requireAllAnimals: true,
    });

    expect(ordinaryWin.solvable).toBe(true);
    expect(ordinaryWin.directions).toHaveLength(62);
    expect(ordinaryWin.finalState?.rescuedAnimalIds).toEqual([]);
    expect(perfectWin.solvable).toBe(true);
    expect(perfectWin.directions).toHaveLength(78);
    expect(perfectWin.finalState).toMatchObject({
      power: 198,
      hasSword: true,
      keys: ["yellow"],
      status: "won",
    });
    expect(perfectWin.finalState?.defeatedEnemyIds).toHaveLength(7);
    expect(perfectWin.finalState?.rescuedAnimalIds).toHaveLength(5);
    expect(perfectWin.finalState?.openedDoorIds).toHaveLength(1);
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
        state.hasAntidoteLeaf ? 1 : 0,
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
          const warning = result.events.find((event) => event.type === "enemy-too-strong");
          const isIntentionalOptionalGuardian =
            level === WISHING_WOODS_LEVEL &&
            warning?.type === "enemy-too-strong" &&
            warning.objectId === level.objects.find(
              (object) =>
                object.kind === "enemy" &&
                object.at.x === 15 &&
                object.at.y === 8 &&
                object.power === 9,
            )?.id;
          const isIntentionalBacktrackingClue =
            level.introducedMechanics?.includes("required-backtracking") ?? false;
          if (
            warning?.type === "enemy-too-strong" &&
            !isIntentionalOptionalGuardian &&
            !isIntentionalBacktrackingClue
          ) {
            throw new Error(
              `${level.id} exposes enemy ${warning.enemyPower} to Ame at Power ${warning.playerPower}.`,
            );
          }

          if (result.state.status === "playing") {
            const nextSignature = signature(result.state);
            if (!seen.has(nextSignature)) {
              seen.add(nextSignature);
              queue.push(result.state);
            }
          }
        }
      }
    },
    10_000,
  );

  it("keeps every campaign level ordinarily and perfectly solver-valid", () => {
    for (const level of CURATED_LEVELS) {
      const ordinary = solveLevel(level, { avoidAnimals: true });
      const perfect = solveLevel(level, { requireAllAnimals: true });
      const animalCount = level.objects.filter((object) => object.kind === "animal").length;

      expect(ordinary.solvable, level.name).toBe(true);
      expect(ordinary.finalState?.status, level.name).toBe("won");
      expect(ordinary.finalState?.rescuedAnimalIds, level.name).toEqual([]);
      expect(perfect.solvable, level.name).toBe(true);
      expect(perfect.finalState?.status, level.name).toBe("won");
      expect(perfect.finalState?.rescuedAnimalIds, level.name).toHaveLength(animalCount);
    }
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
