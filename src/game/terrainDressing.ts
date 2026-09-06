import type { TerrainDressingArt } from "../artCatalog";

/** A small bounded pattern of intact details. No camera, time or gameplay RNG:
 * world-space marks cannot shuffle when the view scrolls or a save reopens. */
export function createDressingStamps(art: TerrainDressingArt, seed: string) {
  let state = 2166136261;
  for (const c of seed) state = Math.imul(state ^ c.charCodeAt(0), 16777619);
  const random = () => {
    state ^= state << 13; state ^= state >>> 17; state ^= state << 5;
    return (state >>> 0) / 4294967296;
  };
  return Array.from({ length: 100 }, (_, i) => {
    const frame = art.frames[Math.floor(random() * art.frames.length)]!;
    const size = art.detailTiles[0] + random() * (art.detailTiles[1] - art.detailTiles[0]);
    const cell = art.periodTiles / 10;
    const x = (i % 10 + 0.5 + (random() - 0.5) * 0.4) * cell;
    const y = (Math.floor(i / 10) + 0.5 + (random() - 0.5) * 0.4) * cell;
    const rotation = art.id === "terrain-dressing-vines" ? 0 : (random() - 0.5) * 70;
    return { frame, size, x, y, rotation, active: random() < (art.id === "terrain-dressing-crystal" ? .18 : .36) };
  }).filter(mark => mark.active);
}
