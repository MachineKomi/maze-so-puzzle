import { describe, expect, it } from "vitest";
import { ANIMAL_SPECIES, ENEMY_STYLE_IDS } from "./types";
import {
  ANIMAL_PERSONALITIES,
  ENEMY_PERSONALITIES,
  animalPersonality,
  enemyPersonality,
} from "./visualPersonality";

describe("visual creature personalities", () => {
  it("gives every rescue friend a motion, flourish, and readable trait", () => {
    expect(Object.keys(ANIMAL_PERSONALITIES).sort()).toEqual([...ANIMAL_SPECIES].sort());
    for (const species of ANIMAL_SPECIES) {
      const personality = animalPersonality(species);
      expect(personality.motion).toMatch(/^(hop|waddle|prance|sway|snuggle|scamper)$/);
      expect(personality.flourish).toMatch(/^(♥|✦|❀|♪|☁|❉)$/);
      expect(personality.greeting.length).toBeGreaterThan(8);
    }
  });

  it("gives every opponent a low-cost idle motion and falls back to goblin", () => {
    expect(Object.keys(ENEMY_PERSONALITIES).sort()).toEqual([...ENEMY_STYLE_IDS].sort());
    for (const style of ENEMY_STYLE_IDS) {
      expect(enemyPersonality(style).motion).toMatch(/^(squish|flutter|stomp|skitter|swagger|bob|hop)$/);
    }
    expect(enemyPersonality(undefined)).toBe(ENEMY_PERSONALITIES.goblin);
  });
});
