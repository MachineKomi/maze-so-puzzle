/** Seven decorrelation samples shared by a world-anchored3.6-tile pattern.
 * Seeded once per level, never gameplay RNG or a timer per hazard cell. */
export function poisonBubbleMarks(seed: string) {
  let state = 2166136261;
  for (const letter of seed) state = Math.imul(state ^ letter.charCodeAt(0), 16777619);
  const next = () => {
    state ^= state << 13; state ^= state >>> 17; state ^= state << 5;
    return (state >>> 0) / 4294967296;
  };
  return [[.52, .63], [1.82, .6], [2.97, 1.13], [1.11, 1.76], [2.21, 2.47], [.52, 2.98], [3.13, 3.08]]
    .map(([x, y]) => ({
      x: x! + (next() - .5) * .24, y: y! + (next() - .5) * .24,
      radius: .07 + next() * .055, duration: 3.8 + next() * 2.4,
      delay: -next() * 7, drift: (next() - .5) * 90,
    }));
}
