import { describe, expect, it } from "vitest";
import { BOOK_FRIEND_IDS, BOOK_GUARDIAN_IDS } from "./bookRoster";
import { CURATED_LEVELS } from "./game/levels";
import { friendDiscoveriesForView } from "./game/discovery";
import { createDefaultPlayerProgress, migratePlayerProgress, readPlayerProgress, recordFriendDiscoveries, writePlayerProgress, PLAYER_PROGRESS_STORAGE_KEY, PLAYER_PROGRESS_SCHEMA_VERSION } from "./progress";

describe("Book friend encounter truth", () => {
  it("admits only the reviewed32/12 roster, with actual authored access for every identity", () => {
    const objects = CURATED_LEVELS.flatMap(level => level.objects);
    expect(BOOK_FRIEND_IDS).toHaveLength(32); expect(BOOK_GUARDIAN_IDS).toHaveLength(12);
    expect(new Set(BOOK_FRIEND_IDS).size).toBe(32); expect(new Set(BOOK_GUARDIAN_IDS).size).toBe(12);
    for (const id of BOOK_FRIEND_IDS) expect(objects.some(o => o.kind === "animal" && o.species === id), id).toBe(true);
    for (const id of BOOK_GUARDIAN_IDS) expect(objects.some(o => o.kind === "enemy" && (o.style ?? "goblin") === id
      || o.kind==="chest"&&o.family===id&&o.mimicChance>0), id).toBe(true);
  });
  it("learns a caged friend in the six-tile view, excluding the gutter until seen or rescued", () => {
    const level = { ...CURATED_LEVELS[0]!, width: 12, height: 10, objects: [
      { id: "near", kind: "animal" as const, species: "bunny" as const, at: { x: 5, y: 5 } },
      { id: "gutter", kind: "animal" as const, species: "fox" as const, at: { x: 6, y: 5 } },
    ] };
    expect(friendDiscoveriesForView(level, { x: 1, y: 1 })).toEqual(["bunny"]);
    expect(friendDiscoveriesForView(level, { x: 3, y: 2 })).toEqual(["bunny", "fox"]);
    expect(friendDiscoveriesForView(level, { x: 1, y: 1 }, ["gutter"])).toEqual(["bunny", "fox"]);
  });
  it("deduplicates encounters without changing rewards or save receipts and preserves future IDs", () => {
    const before = createDefaultPlayerProgress();
    const next = recordFriendDiscoveries(before, ["bunny", "bunny", "future-friend", "__proto__", "constructor"]);
    expect(next).toEqual({ ...before, discoveredFriendIds: ["bunny", "future-friend"] });
    expect(recordFriendDiscoveries(next, ["bunny"])).toBe(next);
    expect(migratePlayerProgress(next)).toEqual(next);
  });
  it("migrates v6 species proof without manufacturing knowledge from aggregate rescue totals", () => {
    const old = { ...createDefaultPlayerProgress(), schemaVersion: 6, gold: 47, totalAnimalsRescued: 12,
      rescuesBySpecies: { ...createDefaultPlayerProgress().rescuesBySpecies, fox: 2 },
      discoveredFriendIds: ["untrusted-experimental-field"], discoveredEnemyIds: ["goblin"] };
    const next = migratePlayerProgress(old);
    expect(next.discoveredFriendIds).toEqual(["fox"]);
    expect(next.gold).toBe(47); expect(next.totalAnimalsRescued).toBe(12);
    expect(next.discoveredEnemyIds).toEqual(["goblin"]);
    expect(migratePlayerProgress({ ...old, rescuesBySpecies: {} }).discoveredFriendIds).toEqual([]);
  });
  it("uses the established key and handles failed writes/future schemas without replacing their bytes", () => {
    let raw = JSON.stringify({ ...createDefaultPlayerProgress(), schemaVersion: 6, gold: 47 });
    const keys: string[] = [];
    const storage = { getItem: () => raw, setItem: (key: string, value: string) => { keys.push(key); raw = value; } };
    expect(readPlayerProgress(storage).gold).toBe(47);
    expect(keys).toEqual(["maze-so-puzzle-progress-v6"]);
    expect(JSON.parse(raw).schemaVersion).toBe(PLAYER_PROGRESS_SCHEMA_VERSION);
    const future = raw = JSON.stringify({ schemaVersion: 99, discovery: "keep exact" });
    expect(writePlayerProgress(createDefaultPlayerProgress(), storage)).toBe(false); expect(raw).toBe(future);
    expect(readPlayerProgress(storage)).toEqual(createDefaultPlayerProgress());
    const denied = { getItem: (key: string) => key === PLAYER_PROGRESS_STORAGE_KEY ? JSON.stringify({ ...createDefaultPlayerProgress(), schemaVersion: 6, gold: 47 }) : null,
      setItem: () => { throw Error("full"); } };
    expect(readPlayerProgress(denied).gold).toBe(47);
    expect(writePlayerProgress(recordFriendDiscoveries(createDefaultPlayerProgress(), ["bunny"]), denied)).toBe(false);
  });
});
