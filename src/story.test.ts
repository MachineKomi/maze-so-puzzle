import { describe, expect, it } from "vitest";
import { CURATED_LEVELS } from "./game/levels";
import { STORY_LORE, shouldDismissStoryForKey, storyForLevel } from "./story";

describe("read-together campaign lore", () => {
  it("covers every authored maze exactly once and in campaign order", () => {
    expect(STORY_LORE.map((entry) => entry.levelId)).toEqual(
      CURATED_LEVELS.map((level) => level.id),
    );
    expect(STORY_LORE.map((entry) => entry.chapter)).toEqual(
      CURATED_LEVELS.map((_, index) => index + 1),
    );
    expect(new Set(STORY_LORE.map((entry) => entry.levelId)).size).toBe(STORY_LORE.length);
  });

  it("keeps every story card concise and gives it a practical thinking prompt", () => {
    for (const entry of STORY_LORE) {
      const storyWordCount = entry.intro.join(" ").split(/\s+/u).length;
      expect(storyWordCount, entry.title).toBeGreaterThanOrEqual(35);
      expect(storyWordCount, entry.title).toBeLessThanOrEqual(80);
      expect(entry.quote.length, entry.title).toBeLessThanOrEqual(90);
      expect(entry.puzzlePower.length, entry.title).toBeGreaterThan(2);
      expect(entry.tryThis, entry.title).toMatch(/[.!?]$/u);
      expect(entry.outro, entry.title).toMatch(/[.!?]$/u);
    }
  });

  it("returns no story for generated or unknown levels", () => {
    expect(storyForLevel("little-star-trail")?.chapter).toBe(1);
    expect(storyForLevel("surprise-v4-example")).toBeUndefined();
  });

  it("lets ordinary play inputs skip instantly while preserving keyboard navigation", () => {
    for (const key of ["Enter", " ", "Escape", "ArrowLeft", "w", "A"]) {
      expect(shouldDismissStoryForKey({ key }), key).toBe(true);
    }
    expect(shouldDismissStoryForKey({ key: "Tab" })).toBe(false);
    expect(shouldDismissStoryForKey({ key: "c", ctrlKey: true })).toBe(false);
    expect(shouldDismissStoryForKey({ key: "r", metaKey: true })).toBe(false);
  });
});
