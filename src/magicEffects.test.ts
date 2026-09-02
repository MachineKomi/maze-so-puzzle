import { describe, expect, it } from "vitest";
import { createDoorBurstParticles, LOCK_MAGIC_EFFECTS } from "./magicEffects";

describe("lock magic effects", () => {
  it("gives every lock colour a distinct colour and accessible shape cue", () => {
    expect(new Set(Object.values(LOCK_MAGIC_EFFECTS).map((effect) => effect.core)).size).toBe(3);
    expect(LOCK_MAGIC_EFFECTS.red.symbols).toContain("♥");
    expect(LOCK_MAGIC_EFFECTS.blue.symbols).toContain("★");
    expect(LOCK_MAGIC_EFFECTS.yellow.symbols).toContain("☀");
  });

  it("creates a deterministic full-circle door particle shower", () => {
    const first = createDoorBurstParticles("blue");
    expect(first).toEqual(createDoorBurstParticles("blue"));
    expect(first).toHaveLength(18);
    expect(new Set(first.map((particle) => particle.glyph))).toEqual(new Set(["★", "✦", "◆"]));
    expect(first.some((particle) => particle.x.startsWith("-"))).toBe(true);
    expect(first.some((particle) => !particle.x.startsWith("-"))).toBe(true);
    expect(first.some((particle) => particle.y.startsWith("-"))).toBe(true);
    expect(first.some((particle) => !particle.y.startsWith("-"))).toBe(true);
  });
});
