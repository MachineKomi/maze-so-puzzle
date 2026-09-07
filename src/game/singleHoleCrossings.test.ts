import { describe, expect, it } from "vitest";
import { createInitialGameState, movePlayer } from "./engine";
import { parseAsciiLevel, FRIENDSHIP_CROWN_VAULT_LEVEL, LANTERNLIGHT_LABYRINTH_LEVEL } from "./levels";
import {
  DIRECTION_DELTAS,
  DIRECTIONS,
  type BlockedReason,
  type Direction,
  type GameState,
  type LevelDefinition,
  type Point,
} from "./types";

function fixture(id: string, map: readonly string[]): LevelDefinition {
  return parseAsciiLevel({ id, name: id, objective: "Cross one hole safely.", map });
}

function corridor(id: string, interior: string): LevelDefinition {
  const row = `#${interior}#`;
  return fixture(id, ["#".repeat(row.length), row, "#".repeat(row.length)]);
}

function equipped(level: LevelDefinition, overrides: Partial<GameState> = {}): GameState {
  return { ...createInitialGameState(level), hasSpringBoots: true, steps: 7, ...overrides };
}

function offset(point: Point, direction: Direction, distance = 1): Point {
  const delta = DIRECTION_DELTAS[direction];
  return { x: point.x + delta.x * distance, y: point.y + delta.y * distance };
}

function straightCrossing(direction: Direction, width: number): LevelDefinition {
  const starts: Readonly<Record<Direction, Point>> = {
    right: { x: 1, y: 3 }, left: { x: 5, y: 3 },
    down: { x: 3, y: 1 }, up: { x: 3, y: 5 },
  };
  const map: string[][] = Array.from({ length: 7 }, (_, y) => Array.from(
    { length: 7 }, (_, x) => x === 0 || y === 0 || x === 6 || y === 6 ? "#" : ".",
  ));
  const start = starts[direction];
  map[1]![1] = "E";
  map[start.y]![start.x] = "@";
  for (let distance = 1; distance <= width; distance += 1) {
    const point = offset(start, direction, distance);
    map[point.y]![point.x] = "o";
  }
  return fixture(`single-hole-${direction}-${width}`, map.map((row) => row.join("")));
}

function expectBlocked(
  level: LevelDefinition,
  before: GameState,
  direction: Direction,
  reason: BlockedReason,
  target?: Point,
): void {
  const snapshot = structuredClone(before);
  const result = movePlayer(level, before, direction);
  expect(result.moved).toBe(false);
  expect(result.state).toBe(before);
  expect(before).toEqual(snapshot);
  expect(result.state.steps).toBe(snapshot.steps);
  expect(result.events).toEqual([expect.objectContaining({
    type: "blocked", reason, ...(target === undefined ? {} : { target }),
  })]);
}

function expectSingleJump(level: LevelDefinition, before: GameState, direction: Direction): void {
  const snapshot = structuredClone(before);
  const landing = offset(before.position, direction, 2);
  const result = movePlayer(level, before, direction);
  expect(result.moved).toBe(true);
  expect(result.state.position).toEqual(landing);
  expect(result.state.steps).toBe(before.steps + 1);
  expect(before).toEqual(snapshot);
  expect(result.events).toEqual([
    { type: "hole-jumped", from: before.position, over: [offset(before.position, direction)], to: landing },
    { type: "moved", from: before.position, to: landing },
  ]);
}

describe("single-hole geometry and honest blockers", () => {
  it.each(DIRECTIONS)("crosses exactly one hole %s as one committed movement", (direction) => {
    const level = straightCrossing(direction, 1);
    expectSingleJump(level, equipped(level), direction);
  });

  it.each(DIRECTIONS)("rejects two and three holes %s, with or without Spring Boots", (direction) => {
    for (const width of [2, 3]) {
      const level = straightCrossing(direction, width);
      for (const hasSpringBoots of [false, true]) {
        expectBlocked(level, equipped(level, { hasSpringBoots }), direction, "hole-too-wide");
      }
    }
  });

  it.each(DIRECTIONS)("asks for Spring Boots only for valid one-hole geometry %s", (direction) => {
    const level = straightCrossing(direction, 1);
    const before = equipped(level, { hasSpringBoots: false });
    expectBlocked(level, before, direction, "needs-spring-boots", offset(before.position, direction));
  });

  it.each(DIRECTIONS)("rejects a wall landing %s before asking for Spring Boots", (direction) => {
    const parsed = straightCrossing(direction, 1);
    const landing = offset(parsed.start, direction, 2);
    const level: LevelDefinition = {
      ...parsed,
      terrain: parsed.terrain.map((row, y) => row.map((tile, x) => (
        x === landing.x && y === landing.y ? "wall" : tile
      ))),
    };
    for (const hasSpringBoots of [false, true]) {
      expectBlocked(level, equipped(level, { hasSpringBoots }), direction, "wall", landing);
    }
  });

  it.each([
    ["right", ["###E", "##@o", "####"], { x: 4, y: 1 }],
    ["left", ["E###", "o@##", "####"], { x: -1, y: 1 }],
    ["down", ["E##", "#@#", "#o#"], { x: 1, y: 3 }],
    ["up", ["#o#", "#@#", "E##"], { x: 1, y: -1 }],
  ] as const)("rejects an out-of-bounds landing %s before asking for Spring Boots", (direction, map, target) => {
    const level = fixture(`single-hole-edge-${direction}`, map);
    for (const hasSpringBoots of [false, true]) {
      expectBlocked(level, equipped(level, { hasSpringBoots }), direction, "out-of-bounds", target);
    }
  });

  it("crosses a long north-south ditch east-west, never along its length", () => {
    const level = fixture("single-hole-long-ditch", [
      "#######", "#..E..#", "#..o..#", "#..o..#", "#@.o..#",
      "#..o..#", "#..o..#", "#.....#", "#######",
    ]);
    expectSingleJump(level, equipped(level, { position: { x: 2, y: 4 } }), "right");
    expectSingleJump(level, equipped(level, { position: { x: 4, y: 4 } }), "left");
    expectBlocked(level, equipped(level, { position: { x: 3, y: 1 } }), "down", "hole-too-wide");
    expectBlocked(level, equipped(level, { position: { x: 3, y: 7 } }), "up", "hole-too-wide");
  });

  it.each(DIRECTIONS)("keeps an isolated plus-junction crossing straight when moving %s", (direction) => {
    const level = fixture("single-hole-plus", [
      "#######", "###E###", "###.###", "#..o..#", "###.###", "###@###", "#######",
    ]);
    const centre = { x: 3, y: 3 };
    expectSingleJump(level, equipped(level, { position: offset(centre, direction, -1) }), direction);
  });

  it("does not turn a T-junction jump sideways to find a landing", () => {
    const level = fixture("single-hole-tee", [
      "#######", "#######", "#######", "#..o.E#", "###.###", "###@###", "#######",
    ]);
    expectSingleJump(level, equipped(level, { position: { x: 2, y: 3 } }), "right");
    expectSingleJump(level, equipped(level, { position: { x: 4, y: 3 } }), "left");
    expectBlocked(level, equipped(level, { position: { x: 3, y: 4 } }), "up", "wall", { x: 3, y: 2 });
  });
});

describe("single-hole landing requirements", () => {
  it.each([
    [LANTERNLIGHT_LABYRINTH_LEVEL, { x: 7, y: 4 }, "right", { x: 9, y: 4 }],
  ] as const)("preserves the authored Lanternlight cage landing protection", (level, position, direction, landing) => {
    const cage = level.objects.find((object) => object.kind === "animal" && object.at.x === landing.x && object.at.y === landing.y)!;
    expectBlocked(level, equipped(level, { position }), direction, "caged-friend", landing);
    expectSingleJump(level, equipped(level, { position, rescuedAnimalIds: [cage.id] }), direction);
  });

  it("preserves every tile of Crown Vault's north-south strip", () => {
    const level = FRIENDSHIP_CROWN_VAULT_LEVEL;
    for (let y = 9; y <= 15; y++) expect(level.terrain[y]?.[12]).toBe("hole");
    expect(level.terrain[8]?.[12]).toBe("wall");
    expect(level.terrain[16]?.[12]).toBe("wall");
    expectSingleJump(level, equipped(level, { position: { x: 11, y: 12 } }), "right");
    expectSingleJump(level, equipped(level, { position: { x: 13, y: 12 } }), "left");
    const blueKeyLanding = movePlayer(level, equipped(level, { position: { x: 13, y: 9 } }), "left");
    expect(blueKeyLanding.state.keys).toEqual(["blue"]);
    expect(blueKeyLanding.state.position).toEqual({ x: 11, y: 9 });
    expect(blueKeyLanding.events.map((event) => event.type)).toEqual(["hole-jumped", "key-collected", "moved"]);
  });

  it.each([
    ["water", "u", "hasBoots", "needs-boots"],
    ["lava", "u", "hasBoots", "needs-boots"],
    ["poison", "l", "hasAntidoteLeaf", "needs-antidote-leaf"],
  ] as const)("requires pre-existing protection for %s; its landing pickup cannot grant access", (terrain, token, capability, reason) => {
    // ASCII objects normally imply floor. Overlay terrain explicitly to model
    // a future/generated protective pickup on a hazardous landing square.
    const parsed = corridor(`single-hole-${terrain}-pickup`, `@o${token}.E`);
    const level: LevelDefinition = {
      ...parsed,
      terrain: parsed.terrain.map((row, y) => row.map((tile, x) => (
        x === 3 && y === 1 ? terrain : tile
      ))),
    };
    const before = equipped(level);
    expectBlocked(level, before, "right", reason, { x: 3, y: 1 });
    expectBlocked(level, equipped(level, { hasSpringBoots: false }), "right", "needs-spring-boots", { x: 2, y: 1 });

    const protectedState = equipped(level, { [capability]: true });
    const landed = movePlayer(level, protectedState, "right");
    expect(landed.moved).toBe(true);
    expect(landed.state.position).toEqual({ x: 3, y: 1 });
    expect(landed.state.steps).toBe(protectedState.steps + 1);
    expect(landed.state.collectedObjectIds).toEqual([level.objects[0]!.id]);
    expect(landed.events.map((event) => event.type)).toEqual([
      "hole-jumped", terrain === "poison" ? "antidote-leaf-collected" : "boots-collected", "moved",
    ]);
  });

  it.each([
    ["door", "R", "openedDoorIds", "occupied-jump-landing"],
    ["enemy", "1", "defeatedEnemyIds", "occupied-jump-landing"],
    ["animal", "q", "rescuedAnimalIds", "caged-friend"],
  ] as const)("blocks an unresolved %s but lands on its already-resolved square", (kind, token, resolvedIds, reason) => {
    const level = corridor(`single-hole-${kind}-landing`, `@o${token}.E`);
    const object = level.objects[0]!;
    expect(object.kind).toBe(kind);
    // Occupancy, not missing gear or enemy strength, is the jump blocker.
    const unprepared = equipped(level);
    const strong = equipped(level, { hasSword: true, keys: ["red"], power: 99 });
    const weak = equipped(level, { hasSword: true, keys: ["red"], power: 0 });
    for (const before of [unprepared, strong, weak]) {
      expectBlocked(level, before, "right", reason, object.at);
    }
    expectBlocked(level, equipped(level, { hasSpringBoots: false }), "right", "needs-spring-boots", { x: 2, y: 1 });

    const resolved = equipped(level, { [resolvedIds]: [object.id] });
    expectSingleJump(level, resolved, "right");
    const landed = movePlayer(level, resolved, "right");
    expect(landed.state.power).toBe(resolved.power);
    expect(landed.state[resolvedIds]).toEqual([object.id]);
    expect(landed.state.collectedObjectIds).toEqual([]);
  });
});

describe("single-hole committed pickups, exits and portals", () => {
  it.each([
    ["s", "sword-collected", { hasSword: true }],
    ["u", "boots-collected", { hasBoots: true }],
    ["j", "spring-boots-collected", { hasSpringBoots: true }],
    ["l", "antidote-leaf-collected", { hasAntidoteLeaf: true }],
    ["r", "key-collected", { keys: ["red"] }],
    ["p", "potion-collected", { power: 4 }],
    ["k", "treasure-opened", { goldStarsCollected: 0 }],
    ["i", "treasure-opened", { sciencePointsCollected: 0 }],
  ] as const)("collects landing pickup %s exactly once, not once per jump frame or revisit", (token, eventType, expectedState) => {
    const level = corridor(`single-hole-pickup-${token}`, `@o${token}.E`);
    const before = equipped(level);
    const object = level.objects[0]!;
    const landed = movePlayer(level, before, "right");
    expect(landed.moved).toBe(true);
    expect(landed.state).toMatchObject({
      ...expectedState, position: object.at, steps: before.steps + 1, collectedObjectIds: [object.id],
    });
    expect(landed.events).toEqual([
      { type: "hole-jumped", from: before.position, over: [{ x: 2, y: 1 }], to: object.at },
      expect.objectContaining({ type: eventType, objectId: object.id }),
      { type: "moved", from: before.position, to: object.at },
    ]);
    const returned = movePlayer(level, landed.state, "left");
    const revisited = movePlayer(level, returned.state, "right");
    expect(revisited.state).toMatchObject({
      ...expectedState, steps: before.steps + 3, collectedObjectIds: [object.id],
    });
    expect(returned.events.map((event) => event.type)).toEqual(["hole-jumped", "moved"]);
    expect(revisited.events.map((event) => event.type)).toEqual(["hole-jumped", "moved"]);
    expect(before.collectedObjectIds).toEqual([]);
  });

  it("reaches an exit in one step with one win event, then rejects additional input", () => {
    const level = corridor("single-hole-exit", "@oE");
    const before = equipped(level);
    const result = movePlayer(level, before, "right");
    expect(result.moved).toBe(true);
    expect(result.state).toMatchObject({
      position: level.exit, status: "won", exitArmed: false, steps: before.steps + 1,
    });
    expect(result.events).toEqual([
      { type: "hole-jumped", from: before.position, over: [{ x: 2, y: 1 }], to: level.exit },
      { type: "moved", from: before.position, to: level.exit },
      { type: "level-won", steps: before.steps + 1, power: before.power },
    ]);
    expectBlocked(level, result.state, "left", "game-over", { x: 2, y: 1 });
  });

  it("emits jump, portal warp, then final movement once for a portal landing", () => {
    const id = "single-hole-portal";
    const level = parseAsciiLevel({
      id, name: id, objective: "Jump onto the flower.",
      map: ["#########", "#@oH..HE#", "#########"],
      objectIds: { "3,1": `${id}-portal-entry`, "6,1": `${id}-portal-destination` },
    });
    const before = equipped(level);
    const result = movePlayer(level, before, "right");
    expect(result.moved).toBe(true);
    expect(result.state.position).toEqual({ x: 6, y: 1 });
    expect(result.state.steps).toBe(before.steps + 1);
    expect(result.state.collectedObjectIds).toEqual([]);
    expect(result.events).toEqual([
      { type: "hole-jumped", from: before.position, over: [{ x: 2, y: 1 }], to: { x: 3, y: 1 } },
      { type: "portal-warped", pair: "rose-heart", from: { x: 3, y: 1 }, to: { x: 6, y: 1 } },
      { type: "moved", from: before.position, to: { x: 6, y: 1 } },
    ]);
    expect(before.position).toEqual({ x: 1, y: 1 });
    expect(before.steps).toBe(7);
    const walkedOff = movePlayer(level, result.state, "left");
    expect(walkedOff.events).toEqual([
      { type: "moved", from: { x: 6, y: 1 }, to: { x: 5, y: 1 } },
    ]);
    expect(walkedOff.state.steps).toBe(before.steps + 2);
  });
});
