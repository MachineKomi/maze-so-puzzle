import { describe, expect, it } from "vitest";
import {
  MUSIC_CATALOGUE,
  MUSIC_CONTEXTS,
  MUSIC_POOLS,
} from "./musicCatalogue";
import { validateMusicCatalogue } from "./musicTransport";

describe("delivered OST catalogue", () => {
  it("maps all 42 delivered files exactly once into the six stable pools", () => {
    const delivered = import.meta.glob("../public/assets/ost/*/*.mp3", {
      eager: true,
      import: "default",
      query: "?url",
    });
    const deliveredUrls = Object.keys(delivered)
      .map((sourcePath) => sourcePath.replace("../public", ""))
      .sort();

    expect(MUSIC_CATALOGUE).toHaveLength(42);
    expect(MUSIC_CONTEXTS).toEqual([
      "title",
      "story",
      "maze",
      "victory",
      "garden",
      "adventure-book",
    ]);
    expect(MUSIC_CATALOGUE.map((track) => track.url).sort()).toEqual(deliveredUrls);
    expect(validateMusicCatalogue()).toEqual([]);
  });

  it("keeps every context non-empty with stable semantic IDs", () => {
    expect(Object.fromEntries(MUSIC_CONTEXTS.map((context) => [
      context,
      MUSIC_POOLS[context].length,
    ]))).toEqual({
      title: 6,
      story: 6,
      maze: 14,
      victory: 4,
      garden: 6,
      "adventure-book": 6,
    });
    expect(new Set(MUSIC_CATALOGUE.map((track) => track.id)).size).toBe(42);
    expect(MUSIC_CATALOGUE.every((track) => /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(track.id))).toBe(true);
  });
});
