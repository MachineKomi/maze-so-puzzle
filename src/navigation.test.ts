import { describe, expect, it } from "vitest";
import { getNextStoryIndex, shouldConfirmMazeSwitch } from "./navigation";

const STORY_IDS = ["one", "two", "three", "four"] as const;

describe("getNextStoryIndex", () => {
  it("starts a fresh save at the first story", () => {
    expect(getNextStoryIndex({ unlockedLevelCount: 1, bestResultsByLevel: {} }, STORY_IDS)).toBe(0);
  });

  it("preserves a record-less v1 save at its latest unlocked story", () => {
    expect(getNextStoryIndex({ unlockedLevelCount: 4, bestResultsByLevel: {} }, STORY_IDS)).toBe(3);
  });

  it("continues at the first open unsolved story once records exist", () => {
    expect(getNextStoryIndex({
      unlockedLevelCount: 3,
      bestResultsByLevel: { one: {}, three: {} },
    }, STORY_IDS)).toBe(1);
  });

  it("returns the latest open story when every open story is documented", () => {
    expect(getNextStoryIndex({
      unlockedLevelCount: 3,
      bestResultsByLevel: { one: {}, two: {}, three: {} },
    }, STORY_IDS)).toBe(2);
  });

  it("clamps an oversized unlock count to the campaign", () => {
    expect(getNextStoryIndex({ unlockedLevelCount: 99, bestResultsByLevel: {} }, STORY_IDS)).toBe(3);
  });
});

describe("shouldConfirmMazeSwitch", () => {
  const activeRun = {
    hasActiveRun: true,
    status: "playing" as const,
    steps: 7,
    currentLevelId: "two",
  };

  it("protects a moved run when a different maze is selected", () => {
    expect(shouldConfirmMazeSwitch(activeRun, "three")).toBe(true);
  });

  it("resumes the current maze without confirmation", () => {
    expect(shouldConfirmMazeSwitch(activeRun, "two")).toBe(false);
  });

  it("allows a zero-step run to be replaced", () => {
    expect(shouldConfirmMazeSwitch({ ...activeRun, steps: 0 }, "three")).toBe(false);
  });

  it("does not protect a completed or lost run", () => {
    expect(shouldConfirmMazeSwitch({ ...activeRun, status: "won" }, "three")).toBe(false);
    expect(shouldConfirmMazeSwitch({ ...activeRun, status: "lost" }, "three")).toBe(false);
  });

  it("does not invent an active run", () => {
    expect(shouldConfirmMazeSwitch({ ...activeRun, hasActiveRun: false }, "three")).toBe(false);
  });
});
