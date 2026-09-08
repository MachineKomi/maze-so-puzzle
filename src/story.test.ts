import { describe, expect, it } from "vitest";
import { CURATED_LEVELS } from "./game/levels";
import { STORY_LORE, shouldDismissStoryForKey, storyForLevel, storyRescueLine } from "./story";

describe("read-together campaign lore", () => {
  it("describes only the current attempt's optional rescues, including zero and partial", () => {
    expect(storyRescueLine(0, 0)).toBe("");
    expect(storyRescueLine(0, 5)).toContain("return for the friends");
    expect(storyRescueLine(1, 5)).toContain("1 friend is safe");
    expect(storyRescueLine(3, 5)).toContain("3 friends are safe");
    expect(storyRescueLine(5, 5)).toBe("Ame has company for the journey home!");
    for (const id of ["wishing-woods", "ames-grand-parade", "springstep-sky-hollow", "moonlit-friendship-quest"]) {
      expect(storyForLevel(id)?.outro).not.toMatch(/bounded free|every flag, friend|rescued friends|All five friends/);
    }
    expect(storyForLevel("rainbow-power-parade")?.outro).not.toContain("At Power 99");
  });
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
