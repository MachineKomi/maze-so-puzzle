/** Physical CSS-pixel layout. Engine/camera coordinates do not enter this calculation. */
export function calculatePlayLayout(width: number, height: number, _legacyBig = true) {
  const w = Math.max(1, Number.isFinite(width) ? width : 1);
  const h = Math.max(1, Number.isFinite(height) ? height : 1);
  const compact = h < 600 || w < 800;
  const emergency = w < 650;
  const gap = emergency ? 4 : 8;
  const minimumDeck = emergency ? 352 : compact ? 440 : Math.max(480, Math.min(w * .40, 520));
  const board = Math.max(1, Math.min(h, w - minimumDeck - gap));
  const deck = w - board - gap;
  const map = emergency ? 96 : compact ? (h >= 450 ? 192 : 128) : Math.max(164, Math.min(380, Math.floor(deck * .46), h - 352));
  return { board, deck, gap, map, compact, emergency };
}
