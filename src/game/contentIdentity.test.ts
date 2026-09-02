import { describe, expect, it } from "vitest";
import { gameplayFingerprint } from "./contentIdentity";
import { CURATED_LEVELS, parseAsciiLevel } from "./levels";

describe("authored content identity", () => {
  it("uses semantic IDs that do not renumber when an unrelated kind is added", () => {
    const base = parseAsciiLevel({ id: "identity", name: "Identity", objective: "Test", map: ["#####", "#@sE#", "#..q#", "#...#", "#####"] });
    const changed = parseAsciiLevel({ id: "identity", name: "Identity", objective: "Test", map: ["#####", "#@sE#", "#p.q#", "#...#", "#####"] });
    expect(base.objects.find((item) => item.kind === "sword")?.id).toBe(changed.objects.find((item) => item.kind === "sword")?.id);
    expect(base.objects.find((item) => item.kind === "animal")?.id).toBe(changed.objects.find((item) => item.kind === "animal")?.id);
    expect(base.gameplayFingerprint).not.toBe(changed.gameplayFingerprint);
  });

  it("honours explicit semantic IDs for repeated objects", () => {
    const level = parseAsciiLevel({
      id: "explicit", name: "Explicit", objective: "Test",
      objectIds: {
        "2,1": "explicit-potion-opening",
        "2,3": "explicit-potion-return",
      },
      map: ["#####", "#@pE#", "#.#.#", "#.p.#", "#####"],
    });
    expect(level.objects.map((item) => item.id)).toEqual([
      "explicit-potion-opening",
      "explicit-potion-return",
    ]);
  });

  it("includes the content revision in the gameplay fingerprint", () => {
    const input = { id: "revisioned", name: "Revisioned", objective: "Test", map: ["#####", "#@.E#", "#...#", "#...#", "#####"] } as const;
    const first = parseAsciiLevel({ ...input, contentRevision: 1 });
    const second = parseAsciiLevel({ ...input, contentRevision: 2 });
    expect(first.gameplayFingerprint).not.toBe(second.gameplayFingerprint);
  });

  it.each([0, -1, 1.5, Number.NaN, Number.POSITIVE_INFINITY])(
    "rejects invalid content revision %s",
    (contentRevision) => {
      expect(() => parseAsciiLevel({
        id: "bad-revision",
        name: "Bad revision",
        objective: "Test",
        contentRevision,
        map: ["#####", "#@.E#", "#...#", "#...#", "#####"],
      })).toThrow(/positive integer content revision/);
    },
  );

  it("requires stable IDs for repeated roles and validates explicit mappings", () => {
    const repeated = {
      id: "repeated",
      name: "Repeated",
      objective: "Test",
      map: ["#####", "#@pE#", "#...#", "#.p.#", "#####"],
    } as const;
    expect(() => parseAsciiLevel(repeated)).toThrow(/needs an explicit semantic id/);
    expect(() => parseAsciiLevel({
      ...repeated,
      objectIds: {
        "2,1": "repeated-potion-shared",
        "2,3": "repeated-potion-shared",
      },
    })).toThrow(/duplicate semantic object ids/);
    expect(() => parseAsciiLevel({
      ...repeated,
      objectIds: {
        "2,1": "repeated-potion-opening",
        "2,3": "repeated-potion-return",
        "1,2": "repeated-potion-empty",
      },
    })).toThrow(/empty coordinate/);
  });

  it("preserves an explicit semantic ID when its object moves", () => {
    const first = parseAsciiLevel({
      id: "moving",
      name: "Moving",
      objective: "Test",
      objectIds: { "2,1": "moving-sword-main-route" },
      map: ["#####", "#@sE#", "#...#", "#...#", "#####"],
    });
    const moved = parseAsciiLevel({
      id: "moving",
      name: "Moving",
      objective: "Test",
      objectIds: { "2,2": "moving-sword-main-route" },
      map: ["#####", "#@.E#", "#.s.#", "#...#", "#####"],
    });
    expect(first.objects[0]?.id).toBe(moved.objects[0]?.id);
    expect(first.gameplayFingerprint).not.toBe(moved.gameplayFingerprint);
  });

  it("excludes treasure artwork style from gameplay identity", () => {
    const level = parseAsciiLevel({
      id: "treasure-style",
      name: "Treasure Style",
      objective: "Test",
      map: ["#####", "#@kE#", "#...#", "#...#", "#####"],
    });
    const treasure = level.objects[0];
    if (!treasure || treasure.kind !== "treasure") throw new Error("Missing treasure fixture.");
    const changedStyle = { ...treasure, style: "gold-chest" as const };
    const fingerprint = gameplayFingerprint({ ...level, objects: [changedStyle] });
    expect(fingerprint).toBe(level.gameplayFingerprint);
  });

  it("locks every authored maze revision and gameplay fingerprint together", () => {
    expect(CURATED_LEVELS.map(({ id, contentRevision, gameplayFingerprint: fingerprint }) => (
      [id, contentRevision, fingerprint]
    ))).toEqual([
      ["little-star-trail", 2, "g-881ac73e"],
      ["shiny-sword", 2, "g-1f10bae6"],
      ["splashy-boots", 2, "g-cfc6dc81"],
      ["rainbow-picnic", 2, "g-4ce23835"],
      ["toasty-toes", 2, "g-aad20c92"],
      ["moonbeam-moat", 2, "g-9e3e677f"],
      ["wishing-woods", 2, "g-aa40ae56"],
      ["ames-grand-parade", 2, "g-14be7f64"],
      ["springstep-sky-hollow", 2, "g-f1650018"],
      ["lanternlight-labyrinth", 2, "g-978e1f1b"],
      ["twilight-treasure-loop", 2, "g-db7d3631"],
      ["moonlit-friendship-quest", 2, "g-b19e71a3"],
      ["rose-heart-roundabout", 2, "g-6dea9900"],
      ["clover-comeback-carnival", 2, "g-9a5ed7e9"],
      ["friendship-crown-vault", 3, "g-627c7995"],
      ["rainbow-power-parade", 2, "g-762eb9c0"],
    ]);
  });
});
