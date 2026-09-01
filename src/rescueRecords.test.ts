import { describe, expect, it } from "vitest";
import { getStoryRescueRecordDisplay } from "./rescueRecords";

describe("story rescue record presentation", () => {
  it("marks a complete old trio as earlier-version rescues after the level changes", () => {
    expect(getStoryRescueRecordDisplay(
      ["puppy", "duckling", "fawn"],
      3,
      ["bunny", "fox", "kitten"],
    )).toEqual({
      documentedStorySpecies: [],
      hasUnknownRescues: true,
    });
  });

  it("keeps current documented friends and identifies only the unmatched remainder", () => {
    expect(getStoryRescueRecordDisplay(
      ["puppy", "duckling", "fawn"],
      3,
      ["puppy", "fox", "kitten"],
    )).toEqual({
      documentedStorySpecies: ["puppy"],
      hasUnknownRescues: true,
    });
  });

  it("does not invent unknown rescues for a current record", () => {
    expect(getStoryRescueRecordDisplay(
      ["puppy", "duckling", "fawn"],
      2,
      ["puppy", "duckling"],
    )).toEqual({
      documentedStorySpecies: ["puppy", "duckling"],
      hasUnknownRescues: false,
    });
  });
});
