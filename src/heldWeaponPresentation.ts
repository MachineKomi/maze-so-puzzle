import type { CSSProperties } from "react";
import { AME_ART, type WeaponArt } from "./artCatalog";

export type HeldWeaponContext = "field" | "battle" | "portal";

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
  field: { scale: 0.92, left: 0.04, top: 0.09 },
  battle: { scale: 0.94, left: 0.03, top: 0.07 },
  portal: { scale: 0.94, left: 0.03, top: 0.07 },
} as const satisfies Readonly<Record<HeldWeaponContext, RegisteredActorCanvas>>;

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
