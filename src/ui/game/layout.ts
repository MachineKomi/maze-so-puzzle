/** Physical CSS-pixel layout. Engine/camera coordinates do not enter this calculation. */
export function calculatePlayLayout(width: number, height: number, big: boolean) {
  const w = Math.max(1, Number.isFinite(width) ? width : 1);
  const h = Math.max(1, Number.isFinite(height) ? height : 1);
  const compact = h < 450 || w < 800;
  const emergency = w < 650;
  const gap = emergency ? 4 : 8;
  const minimumDeck = emergency ? 304 : compact ? 464 : 360;
  const board = Math.max(1, Math.min(h - (big ? 8 : 28), w - minimumDeck - gap));
  const deck = w - board - gap;
  const map = emergency ? 96 : compact ? 128 : w >= 1200 ? Math.min(240, Math.floor(deck * .4)) : 164;
  return { board, deck, gap, map, compact, emergency };
}
