import { describe, expect, it } from "vitest";
import {
  createInitialGameState,
  isObjectResolved,
  movePlayer,
  restartLevel,
} from "./engine";
import { parseAsciiLevel } from "./levels";

const level = (id: string, corridor: string, initialPower = 2) =>
  parseAsciiLevel({
    id,
    name: id,
    objective: "Test",
    initialPower,
    map: [
      "#########",
      corridor,
      "#########",
      "#########",
      "#########",
      "#########",
      "#########",
      "#########",
      "#########",
    ],
  });

describe("immutable movement", () => {
  it("moves one tile without mutating the previous state", () => {
    const testLevel = level("movement", "#@....E.#");
    const before = createInitialGameState(testLevel);
    const result = movePlayer(testLevel, before, "right");

    expect(result.moved).toBe(true);
    expect(result.state.position).toEqual({ x: 2, y: 1 });
    expect(result.state.steps).toBe(1);
    expect(before.position).toEqual({ x: 1, y: 1 });
    expect(before.steps).toBe(0);
  });

  it("leaves state unchanged when a wall blocks movement", () => {
    const testLevel = level("wall", "#@....E.#");
    const before = createInitialGameState(testLevel);
    const result = movePlayer(testLevel, before, "up");

    expect(result.moved).toBe(false);
    expect(result.state).toBe(before);
    expect(result.events[0]).toMatchObject({ type: "blocked", reason: "wall" });
  });
});

describe("optional maze treasures", () => {
  it("collects Gold Stars and Science Points once without changing Power", () => {
    const treasureLevel = level("treasure-corridor", "#@kivxE.#");
    let state = createInitialGameState(treasureLevel);
    const events: string[] = [];
    for (let step = 0; step < 4; step += 1) {
      const result = movePlayer(treasureLevel, state, "right");
      state = result.state;
      events.push(...result.events.map((event) => event.type));
    }

    expect(state).toMatchObject({
      power: 2,
      goldStarsCollected: 11,
      sciencePointsCollected: 6,
    });
    expect(events.filter((event) => event === "treasure-collected")).toHaveLength(4);
    expect(state.collectedObjectIds).toHaveLength(4);
  });
});

describe("paired magic flower portals", () => {
  it("warps to the matching flower in one counted move and then walks off normally", () => {
    const portalLevel = level("portal-corridor", "#@H..H.E#");
    const [entrance, destination] = portalLevel.objects.filter(
      (object) => object.kind === "portal",
    );
    const before = createInitialGameState(portalLevel);
    const warped = movePlayer(portalLevel, before, "right");

    expect(warped.moved).toBe(true);
    expect(warped.state.position).toEqual({ x: 5, y: 1 });
    expect(warped.state.steps).toBe(1);
    expect(warped.events).toEqual([
      {
        type: "portal-warped",
        pair: "rose-heart",
        from: { x: 2, y: 1 },
        to: { x: 5, y: 1 },
      },
      { type: "moved", from: { x: 1, y: 1 }, to: { x: 5, y: 1 } },
    ]);
    expect(entrance && isObjectResolved(entrance, warped.state)).toBe(false);
    expect(destination && isObjectResolved(destination, warped.state)).toBe(false);

    const walkedOff = movePlayer(portalLevel, warped.state, "right");
    expect(walkedOff.state.position).toEqual({ x: 6, y: 1 });
    expect(walkedOff.events.some((event) => event.type === "portal-warped")).toBe(false);
  });
});

describe("Power combat", () => {
  it("blocks a goblin safely until the sword is collected", () => {
    const testLevel = level("no-sword", "#@1...E.#");
    const before = createInitialGameState(testLevel);
    const result = movePlayer(testLevel, before, "right");

    expect(result.moved).toBe(false);
    expect(result.state.status).toBe("playing");
    expect(result.events[0]).toMatchObject({ type: "blocked", reason: "needs-sword" });
  });

  it("wins at equal Power, adds the enemy once, and cannot farm it", () => {
    const testLevel = level("equal-combat", "#@s2..E.#");
    const initial = createInitialGameState(testLevel);
    const armed = movePlayer(testLevel, initial, "right").state;
    const victory = movePlayer(testLevel, armed, "right");

    expect(victory.moved).toBe(false);
    expect(victory.state.position).toEqual(armed.position);
    expect(victory.state.steps).toBe(armed.steps);
    expect(victory.state.power).toBe(4);
    expect(victory.state.defeatedEnemyIds).toHaveLength(1);
    expect(victory.events).toEqual([expect.objectContaining({
      type: "enemy-defeated",
      powerBefore: 2,
      powerAfter: 4,
    })]);

    const enteredClearedTile = movePlayer(testLevel, victory.state, "right");
    expect(enteredClearedTile.moved).toBe(true);
    expect(enteredClearedTile.state.position.x).toBe(3);
    expect(enteredClearedTile.state.power).toBe(4);
    expect(enteredClearedTile.events.some((event) => event.type === "enemy-defeated")).toBe(false);

    const back = movePlayer(testLevel, enteredClearedTile.state, "left").state;
    const revisit = movePlayer(testLevel, back, "right").state;
    expect(revisit.power).toBe(4);
    expect(revisit.defeatedEnemyIds).toHaveLength(1);
  });

  it("stops safely at a stronger goblin without changing the attempt", () => {
    const testLevel = level("stronger-combat", "#@s4..E.#");
    const armed = movePlayer(
      testLevel,
      createInitialGameState(testLevel),
      "right",
    ).state;
    const result = movePlayer(testLevel, armed, "right");

    expect(result.moved).toBe(false);
    expect(result.state).toBe(armed);
    expect(result.state.status).toBe("playing");
    expect(result.state.position).toEqual(armed.position);
    expect(result.state.steps).toBe(armed.steps);
    expect(result.state.power).toBe(armed.power);
    expect(result.state.defeatedEnemyIds).toEqual([]);
    expect(result.events[0]).toMatchObject({
      type: "enemy-too-strong",
      objectId: testLevel.objects.find((object) => object.kind === "enemy")?.id,
      playerPower: 2,
      enemyPower: 4,
    });
    expect(restartLevel(testLevel)).toEqual(createInitialGameState(testLevel));
  });
});

describe("keys, doors, potions and boots", () => {
  it("only opens a door with its matching reusable key", () => {
    const wrongKeyLevel = level("wrong-key", "#@b.R.E.#");
    let wrongState = createInitialGameState(wrongKeyLevel);
    wrongState = movePlayer(wrongKeyLevel, wrongState, "right").state;
    wrongState = movePlayer(wrongKeyLevel, wrongState, "right").state;
    const blocked = movePlayer(wrongKeyLevel, wrongState, "right");
    expect(blocked.events[0]).toMatchObject({
      type: "blocked",
      reason: "needs-key",
      color: "red",
    });

    const matchingLevel = level("matching-key", "#@r.R.E.#");
    let state = createInitialGameState(matchingLevel);
    state = movePlayer(matchingLevel, state, "right").state;
    state = movePlayer(matchingLevel, state, "right").state;
    const opened = movePlayer(matchingLevel, state, "right");
    expect(opened.moved).toBe(true);
    expect(opened.state.keys).toEqual(["red"]);
    expect(opened.state.openedDoorIds).toHaveLength(1);
    expect(opened.events[0]).toMatchObject({ type: "door-opened", color: "red" });

    const back = movePlayer(matchingLevel, opened.state, "left").state;
    const crossedAgain = movePlayer(matchingLevel, back, "right");
    expect(crossedAgain.events.some((event) => event.type === "door-opened")).toBe(false);
  });

  it("blocks both hazards without boots and permits both after collecting them", () => {
    const noBootsLevel = level("no-boots", "#@~^.E..#");
    const blocked = movePlayer(
      noBootsLevel,
      createInitialGameState(noBootsLevel),
      "right",
    );
    expect(blocked.events[0]).toMatchObject({
      type: "blocked",
      reason: "needs-boots",
      terrain: "water",
    });

    const bootsLevel = level("with-boots", "#@u~^E..#");
    let state = createInitialGameState(bootsLevel);
    state = movePlayer(bootsLevel, state, "right").state;
    expect(state.hasBoots).toBe(true);
    state = movePlayer(bootsLevel, state, "right").state;
    expect(state.position.x).toBe(3);
    state = movePlayer(bootsLevel, state, "right").state;
    expect(state.position.x).toBe(4);
  });

  it("blocks poison until the antidote leaf is collected, then permits it", () => {
    const corridor = level("with-antidote-leaf", "#@....E.#");
    const terrain = corridor.terrain.map((row, y) => row.map((tile, x) => (
      y === 1 && (x === 3 || x === 4) ? "poison" as const : tile
    )));
    const antidoteLeaf = {
      id: "with-antidote-leaf-antidote-leaf-1",
      kind: "antidote-leaf" as const,
      at: { x: 2, y: 1 },
    };
    const poisonLevel = { ...corridor, terrain, objects: [antidoteLeaf] };
    const initial = createInitialGameState(poisonLevel);

    const noLeafLevel = { ...poisonLevel, id: "without-antidote-leaf", objects: [] };
    const beforePoison = movePlayer(
      noLeafLevel,
      createInitialGameState(noLeafLevel),
      "right",
    ).state;
    const blocked = movePlayer(noLeafLevel, beforePoison, "right");
    expect(blocked.state).toBe(beforePoison);
    expect(blocked).toMatchObject({ moved: false });
    expect(blocked.events[0]).toEqual({
      type: "blocked",
      reason: "needs-antidote-leaf",
      target: { x: 3, y: 1 },
      terrain: "poison",
    });

    const collected = movePlayer(poisonLevel, initial, "right");
    expect(collected.state.hasAntidoteLeaf).toBe(true);
    expect(collected.state.collectedObjectIds).toEqual([antidoteLeaf.id]);
    expect(collected.events[0]).toEqual({
      type: "antidote-leaf-collected",
      objectId: antidoteLeaf.id,
    });
    expect(isObjectResolved(antidoteLeaf, collected.state)).toBe(true);

    const crossedFirst = movePlayer(poisonLevel, collected.state, "right");
    const crossedSecond = movePlayer(poisonLevel, crossedFirst.state, "right");
    expect(crossedFirst.moved).toBe(true);
    expect(crossedSecond.moved).toBe(true);
    expect(crossedSecond.state.position).toEqual({ x: 4, y: 1 });
  });

  it("applies a potion exactly once", () => {
    const potionLevel = level("potion", "#@p...E.#");
    let state = createInitialGameState(potionLevel);
    state = movePlayer(potionLevel, state, "right").state;
    expect(state.power).toBe(4);
    state = movePlayer(potionLevel, state, "left").state;
    state = movePlayer(potionLevel, state, "right").state;
    expect(state.power).toBe(4);
  });

  it("blocks ground holes until spring boots are collected, then leaps a whole run", () => {
    const noSpringBootsLevel = level("no-spring-boots", "#@o...E.#");
    const blocked = movePlayer(
      noSpringBootsLevel,
      createInitialGameState(noSpringBootsLevel),
      "right",
    );
    expect(blocked).toMatchObject({ moved: false });
    expect(blocked.events[0]).toMatchObject({
      type: "blocked",
      reason: "needs-spring-boots",
      terrain: "hole",
      target: { x: 2, y: 1 },
    });

    const springBootsLevel = level("with-spring-boots", "#@joo.E.#");
    let state = createInitialGameState(springBootsLevel);
    const collected = movePlayer(springBootsLevel, state, "right");
    state = collected.state;
    expect(state.hasSpringBoots).toBe(true);
    expect(collected.events[0]).toMatchObject({ type: "spring-boots-collected" });

    const jumped = movePlayer(springBootsLevel, state, "right");
    expect(jumped.moved).toBe(true);
    expect(jumped.state.position).toEqual({ x: 5, y: 1 });
    expect(jumped.state.steps).toBe(2);
    expect(jumped.events[0]).toEqual({
      type: "hole-jumped",
      from: { x: 2, y: 1 },
      over: [{ x: 3, y: 1 }, { x: 4, y: 1 }],
      to: { x: 5, y: 1 },
    });
    expect(jumped.events.at(-1)).toEqual({
      type: "moved",
      from: { x: 2, y: 1 },
      to: { x: 5, y: 1 },
    });
  });

  it("refuses a spring jump without a safe landing tile", () => {
    const unsafeLevel = level("unsafe-spring-jump", "#@jo##E.#");
    const initial = createInitialGameState(unsafeLevel);
    const equipped = movePlayer(unsafeLevel, initial, "right").state;
    const blocked = movePlayer(unsafeLevel, equipped, "right");

    expect(blocked.moved).toBe(false);
    expect(blocked.state).toBe(equipped);
    expect(blocked.events[0]).toMatchObject({
      type: "blocked",
      reason: "wall",
      target: { x: 4, y: 1 },
    });
  });
});

describe("animal rescues", () => {
  it("rescues an animal exactly once and tracks it separately from inventory", () => {
    const corridor = level("animal-rescue", "#@....E.#");
    const animal = {
      id: "animal-rescue-bunny-1",
      kind: "animal" as const,
      at: { x: 2, y: 1 },
      species: "bunny" as const,
    };
    const rescueLevel = { ...corridor, objects: [animal] };
    const initial = createInitialGameState(rescueLevel);

    const rescued = movePlayer(rescueLevel, initial, "right");
    expect(rescued.moved).toBe(true);
    expect(rescued.state.rescuedAnimalIds).toEqual([animal.id]);
    expect(rescued.state.collectedObjectIds).toEqual([]);
    expect(rescued.events[0]).toEqual({
      type: "animal-rescued",
      objectId: animal.id,
      species: "bunny",
    });
    expect(isObjectResolved(animal, rescued.state)).toBe(true);

    const back = movePlayer(rescueLevel, rescued.state, "left").state;
    const revisit = movePlayer(rescueLevel, back, "right");
    expect(revisit.state.rescuedAnimalIds).toEqual([animal.id]);
    expect(revisit.events.some((event) => event.type === "animal-rescued")).toBe(false);
  });
});
