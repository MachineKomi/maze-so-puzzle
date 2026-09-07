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
  const map = emergency ? 96 : compact ? (h >= 450 ? 192 : h >= 350 ? 128 : 96) : Math.max(164, Math.min(380, Math.floor(deck * .46), h - 352));
  return { board, deck, gap, map, compact, emergency };
}

/** A stable rail and bounded continuous viewport. Content never resizes the maze.
 * Six cells on the shorter axis; no axis exceeds twelve cells. Tiny whole-map
 * lessons are fitted intact. Board border is excluded from the cell metric. */
export function calculateExploreLayout(width: number, height: number, grid: {width:number;height:number}, folded = false) {
  const w = Math.max(1, width), h = Math.max(1, height), gap = 8;
  const deck = Math.min(w * .55, folded ? 240 : Math.max(360, Math.min(520, w * .34)));
  const paneWidth = Math.max(9, w - deck - gap), paneHeight = Math.max(9, h);
  const whole = grid.width <= 6 && grid.height <= 6;
  const tile = whole ? Math.min((paneWidth-8)/grid.width, (paneHeight-8)/grid.height)
    : Math.max(Math.min(paneWidth-8,paneHeight-8)/6, (paneWidth-8)/Math.min(12,grid.width), (paneHeight-8)/Math.min(12,grid.height));
  const boardWidth = whole ? tile * grid.width + 8 : paneWidth;
  const boardHeight = whole ? tile * grid.height + 8 : paneHeight;
  return { deck, gap, paneWidth, boardWidth, boardHeight,
    columns: whole ? grid.width : (boardWidth-8)/tile,
    rows: whole ? grid.height : (boardHeight-8)/tile,
    map: folded ? 140 : Math.min(160, Math.max(136, deck * .38)),
  };
}
