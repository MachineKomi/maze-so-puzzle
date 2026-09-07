import type { CSSProperties } from "react";
import type { ArtGeometry } from "./artCatalog";
import { FIELD_GROUND_Y } from "./game/tallWalls";

export type FieldArtRole = "actor" | "item";
/** Alpha bounds size the picture; registered pivots remain registration,
 * never pretend to be newly measured anatomical feet. */
export function measureFieldArt(geometry: ArtGeometry, role: FieldArtRole = "actor", width = .9) {
  const [x, y, w, h] = geometry.visibleBounds;
  // Width is clearance, not a demand to inflate a narrow silhouette. Keep
  // large detailed actors in proportion to broad creatures and ground items.
  const scale = Math.min(width / w, (role === "actor" ? 1.35 : .9) / h);
  const anchor = role === "actor"
    ? geometry.groundLine ?? geometry.baseline ?? geometry.pivot[1]
    : y + h;
  return { scale, anchor, center: x + w / 2,
    left: .5 - scale * (x + w / 2), top: FIELD_GROUND_Y - scale * anchor,
    head: FIELD_GROUND_Y - scale * (anchor - y), visibleHeight: scale * h };
}
export function fieldArtStyle(geometry: ArtGeometry, role: FieldArtRole): CSSProperties {
  const frame = measureFieldArt(geometry, role);
  return { "--field-size": `${frame.scale * 100}%`, "--field-x": `${-frame.center * 100}%`,
    "--field-y": `${-frame.anchor * 100}%`, "--field-ground": `${FIELD_GROUND_Y * 100}%`,
    "--field-pivot": `${frame.anchor * 100}%` } as CSSProperties;
}
export function fieldActorStyle(geometry: ArtGeometry, rowsAbove = Infinity): CSSProperties {
  // Badge line box is .23tile at the normal .25tile type size. Reserve .36
  // for its complete line/stroke/shadow at the board edge, including row1's
  // taller-than-tile actor; moving the image/feet would break registration.
  return { "--field-label-top": `${Math.max(measureFieldArt(geometry).head - .04, .36 - rowsAbove) * 100}%`,
    "--field-ground": `${FIELD_GROUND_Y * 100}%` } as CSSProperties;
}
