import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { MiniMap } from "./MiniMap";
import { CURATED_LEVELS } from "../../game/levels";
import type { LevelDefinition, LevelObject } from "../../game/types";
import type { TileKey } from "../../game/exploration";

const objects: LevelObject[] = [
  { id: "first", kind: "key", color: "blue", at: { x: 2, y: 1 } },
  { id: "last", kind: "key", color: "red", at: { x: 2, y: 1 } },
  { id: "guide", kind: "key", color: "yellow", at: { x: 3, y: 3 } },
];
const level: LevelDefinition = { ...CURATED_LEVELS[0]!, width: 5, height: 5,
  terrain: Array.from({ length: 5 }, () => Array.from({ length: 5 }, () => "floor" as const)),
  exit: { x: 4, y: 4 }, objects };
const render = (revealed: TileKey[], highlightedObjectId?: string) => renderToStaticMarkup(<MiniMap level={level}
  position={{ x: 1, y: 1 }} camera={{ left: 0, top: 0, width: 5, height: 5, right: 4, bottom: 4 }}
  revealed={new Set(revealed)} currentView={new Set<TileKey>(["1,1"])} objects={objects} highlightedObjectId={highlightedObjectId} />);

describe("grouped exploration map", () => {
  it("keeps unknown objects and exit hidden without losing accessible exploration text", () => {
    const html = render(["0,0"]);
    expect(html).toContain("2 of 25 tiles revealed, 8 percent");
    expect(html).toContain("Ame is at column 2, row 2.");
    expect(html).toContain("The exit has not been discovered yet.");
    expect(html).not.toContain("marker-key"); expect(html).not.toContain("marker-exit");
    expect(html).not.toContain("minimap-tile"); expect(html).toContain("minimap-terrain");
    expect(html.match(/id="[^"]+-view"><path d="([^"]*)"/)![1]).toBe("M1 1h1v1h-1Z");
    const seen = html.match(/id="[^"]+-seen"><path d="([^"]*)"/)![1];
    expect(seen).toContain("M0 0h1v1h-1Z"); expect(seen).toContain("M1 1h1v1h-1Z");
  });
  it("shows a guided unknown marker without revealing its terrain or counting it explored", () => {
    const html = render(["0,0"], "guide");
    expect(html).toContain("marker-yellow guided-marker");
    expect(html).toContain("2 of 25 tiles revealed, 8 percent");
    expect(html).toContain("Guided marker:");
    const clip = html.match(/id="[^"]+-seen"><path d="([^"]*)"/)![1];
    expect(clip).not.toContain("M3 3");
  });
  it("preserves one last-active marker per shared tile and unique explored counts", () => {
    const html = render(["0,0", "1,1", "2,1", "4,4"]);
    expect(html).toContain("4 of 25 tiles revealed, 16 percent");
    expect(html).toContain("marker-red"); expect(html).not.toContain("marker-blue");
    expect(html).toContain("marker-exit"); expect(html).toContain("column 5, row 5");
  });
});
