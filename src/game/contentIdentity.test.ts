import { describe, expect, it } from "vitest";
import { gameplayFingerprint, gameplayFingerprintForRules } from "./contentIdentity";
import { CURATED_LEVELS, LEGACY_CURATED_LEVELS, parseAsciiLevel } from "./levels";

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

  it("preserves exact pre-loot rules-3 fingerprints for migration of unchanged authored content", () => {
    expect(LEGACY_CURATED_LEVELS.map(level => (
      [level.id, level.contentRevision, gameplayFingerprintForRules(level, 3)]
    ))).toEqual([
      ["little-star-trail", 3, "g-8c174a58"],
      ["shiny-sword", 3, "g-ede2cc24"],
      ["splashy-boots", 3, "g-417a46ff"],
      ["rainbow-picnic", 3, "g-20e95a23"],
      ["toasty-toes", 3, "g-65dad932"],
      ["moonbeam-moat", 3, "g-105e7d19"],
      ["wishing-woods", 4, "g-575f0c11"],
      ["ames-grand-parade", 4, "g-59ecade3"],
      ["springstep-sky-hollow", 4, "g-121e3053"],
      ["lanternlight-labyrinth", 4, "g-55e98ad2"],
      ["twilight-treasure-loop", 4, "g-24f30a40"],
      ["moonlit-friendship-quest", 4, "g-d2b011e4"],
      ["rose-heart-roundabout", 3, "g-b1373b22"],
      ["clover-comeback-carnival", 4, "g-e854612e"],
      ["friendship-crown-vault", 4, "g-3e959ce9"],
      ["rainbow-power-parade", 3, "g-7acfa580"],
    ]);
  });
});
