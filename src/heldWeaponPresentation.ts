import type { CSSProperties } from "react";
import { AME_ART, type WeaponArt } from "./artCatalog";
import { measureFieldArt } from "./fieldArtLayout";

export type HeldWeaponContext = "field" | "battle" | "portal" | "jump";

interface RegisteredActorCanvas {
  readonly scale: number;
  readonly left: number;
  readonly top: number;
}

/**
 * Exact square-canvas placement declared by the matching CSS selectors.
 * Keep this table and those selectors together: weapon geometry is measured
 * against Ame's registered canvas, not against her alpha-visible silhouette.
 */
export const HELD_WEAPON_ACTOR_CANVAS = {
  field: measureFieldArt(AME_ART.geometry),
  battle: measureFieldArt(AME_ART.geometry),
  portal: measureFieldArt(AME_ART.geometry),
  jump: measureFieldArt(AME_ART.geometry),
} as const satisfies Readonly<Record<HeldWeaponContext, RegisteredActorCanvas>>;

/** Preserve the existing boot attachment in Ame's canvas coordinates while
 * resizing her whole pose; ground pickup boots use their own visible bounds. */
export const JUMP_BOOTS_STYLE = {
  "--jump-boots-left": (HELD_WEAPON_ACTOR_CANVAS.jump.left + HELD_WEAPON_ACTOR_CANVAS.jump.scale * (.41 - .03) / .94) * 100,
  "--jump-boots-top": (HELD_WEAPON_ACTOR_CANVAS.jump.top + HELD_WEAPON_ACTOR_CANVAS.jump.scale * (.62 - .07) / .94) * 100,
  "--jump-boots-size": HELD_WEAPON_ACTOR_CANVAS.jump.scale * .42 / .94 * 100,
} as CSSProperties;

export interface HeldWeaponPlacement {
  readonly left: number;
  readonly top: number;
  readonly size: number;
  readonly gripX: number;
  readonly gripY: number;
  readonly rotationDegrees: number;
  readonly zOrder: number;
}

export function measureHeldWeaponPlacement(
  weapon: WeaponArt,
  context: HeldWeaponContext,
): HeldWeaponPlacement {
  const actor = HELD_WEAPON_ACTOR_CANVAS[context];
  const ameGrip = AME_ART.geometry.gripPoint;
  const weaponGrip = weapon.geometry.gripPoint;
  if (!ameGrip) throw new Error("Ame art is missing its required hand socket");

  const size = actor.scale * weapon.geometry.heldScale;
  const handX = actor.left + actor.scale * ameGrip[0];
  const handY = actor.top + actor.scale * ameGrip[1];
  return {
    left: handX - size * weaponGrip[0],
    top: handY - size * weaponGrip[1],
    size,
    gripX: weaponGrip[0],
    gripY: weaponGrip[1],
    rotationDegrees: weapon.geometry.heldRotationDegrees,
    zOrder: weapon.geometry.zOrder,
  };
}

function percent(value: number): string {
  return `${(value * 100).toFixed(4)}%`;
}

export function heldWeaponStyle(
  weapon: WeaponArt,
  context: HeldWeaponContext,
): CSSProperties {
  const placement = measureHeldWeaponPlacement(weapon, context);
  return {
    "--held-left": percent(placement.left),
    "--held-top": percent(placement.top),
    "--held-size": percent(placement.size),
    "--held-grip-x": percent(placement.gripX),
    "--held-grip-y": percent(placement.gripY),
    "--held-rotation": `${placement.rotationDegrees}deg`,
    "--held-z": placement.zOrder,
  } as CSSProperties;
}
