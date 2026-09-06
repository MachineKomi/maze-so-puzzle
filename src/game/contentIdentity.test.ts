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
      ["little-star-trail", 3, "g-da9a47f7"],
      ["shiny-sword", 3, "g-7076adaf"],
      ["splashy-boots", 3, "g-b2047ab6"],
      ["rainbow-picnic", 3, "g-510d6362"],
      ["toasty-toes", 3, "g-f8c1704f"],
      ["moonbeam-moat", 3, "g-937db122"],
      ["wishing-woods", 3, "g-33675a07"],
      ["ames-grand-parade", 3, "g-a8a50e65"],
      ["springstep-sky-hollow", 3, "g-10a9ff01"],
      ["lanternlight-labyrinth", 3, "g-3eea1e54"],
      ["twilight-treasure-loop", 3, "g-8c27dbaa"],
      ["moonlit-friendship-quest", 3, "g-26763d04"],
      ["rose-heart-roundabout", 3, "g-6578e01b"],
      ["clover-comeback-carnival", 3, "g-11c194f2"],
      ["friendship-crown-vault", 4, "g-8f843f6e"],
      ["rainbow-power-parade", 3, "g-25b3d8e1"],
    ]);
  });
});
