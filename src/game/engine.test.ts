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

    expect(victory.moved).toBe(true);
    expect(victory.state.power).toBe(4);
    expect(victory.state.defeatedEnemyIds).toHaveLength(1);
    expect(victory.events[0]).toMatchObject({
      type: "enemy-defeated",
      powerBefore: 2,
      powerAfter: 4,
    });

    const back = movePlayer(testLevel, victory.state, "left").state;
    const revisit = movePlayer(testLevel, back, "right").state;
    expect(revisit.power).toBe(4);
    expect(revisit.defeatedEnemyIds).toHaveLength(1);
  });

  it("loses to a stronger goblin and restart restores the level", () => {
    const testLevel = level("stronger-combat", "#@s4..E.#");
    const armed = movePlayer(
      testLevel,
      createInitialGameState(testLevel),
      "right",
    ).state;
    const result = movePlayer(testLevel, armed, "right");

    expect(result.moved).toBe(false);
    expect(result.state.status).toBe("lost");
    expect(result.state.position).toEqual(armed.position);
    expect(result.events[0]).toMatchObject({
      type: "combat-lost",
      playerPower: 2,
      enemyPower: 4,
      enemyPowerAfter: 6,
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
