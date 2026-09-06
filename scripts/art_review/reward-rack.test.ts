import { it, expect } from "vitest";
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { findInputFixture, savedFixture } from "../performance/v22-input-fixtures";
import { ACTIVE_RUN_STORAGE_KEY } from "../../src/session";
import { PLAYER_PROGRESS_STORAGE_KEY, createDefaultPlayerProgress } from "../../src/progress";
import { PRESENTATION_PREFERENCES_KEY, DEFAULT_PRESENTATION_PREFERENCES } from "../../src/motion";

it("derives opt-in committed reward browser fixtures from legal engine routes", () => {
  const directory = process.env.MAZE_REWARD_PROOF_DIR;
  if (!directory) return;
  const fixtures = ["gold", "science", "potion", "combat"].map(kind => {
    const fixture = findInputFixture(events => events.some(event =>
      kind === "potion" ? event.type === "potion-collected"
        : kind === "combat" ? event.type === "enemy-defeated" && event.enemyPower >= 7
          : event.type === "treasure-collected" && event.currency === kind));
    expect(fixture).toBeDefined();
    return { id: kind, direction: fixture!.direction, level: fixture!.level.id,
      events: fixture!.result.events, before: fixture!.before, after: fixture!.result.state,
      snapshot: savedFixture(fixture!, `reward-${kind}`) };
  });
  mkdirSync(directory, { recursive: true });
  writeFileSync(join(directory, "fixtures.json"), JSON.stringify({ fixtures,
    keys: { run: ACTIVE_RUN_STORAGE_KEY, progress: PLAYER_PROGRESS_STORAGE_KEY, preferences: PRESENTATION_PREFERENCES_KEY },
    progress: createDefaultPlayerProgress(16), preferences: DEFAULT_PRESENTATION_PREFERENCES }, null, 2));
});
