import { describe, expect, it } from "vitest";
import architecture from "../../docs/ARCHITECTURE.md?raw";
import gameplaySpec from "../../docs/GAMEPLAY_DESIGN_SPEC.md?raw";
import checklist from "../../docs/RELEASE_CHECKLIST.md?raw";
import story from "../../docs/STORY_BIBLE.md?raw";
import readme from "../../README.md?raw";
import { CURATED_LEVELS } from "./levels";
import { measureLevel } from "./metrics";

describe("gameplay documentation consistency", () => {
  it("keeps every current maze and solver route in the gameplay specification", () => {
    for (const [index, level] of CURATED_LEVELS.entries()) {
      const metric = measureLevel(level);
      expect(gameplaySpec, level.name).toContain(`| ${index + 1} | ${level.name.replaceAll("'", "’")}`);
      expect(gameplaySpec, level.name).toContain(`${metric.ordinaryMoves} / ${metric.perfectMoves}`);
    }
  }, 120_000);

  it("keeps current persistence, onboarding, and optional-rescue authority aligned", () => {
    expect(readme).toContain("6 × 6 maze is fully visible");
    expect(readme).toContain("Gold and Science Points are records of discovery");
    expect(architecture).toContain("schema-v4 progress");
    expect(architecture).toContain("schema-v2 snapshot");
    expect(architecture).toContain("four-tier Required Path help");
    expect(story).toContain("rescuing friends remains a kind optional act");
    expect(checklist).toContain("ordinary solution with zero\n  rescues");
  });
});
