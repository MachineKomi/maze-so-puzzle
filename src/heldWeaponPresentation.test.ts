import { describe, expect, it } from "vitest";
import { AME_ART, WEAPON_ART } from "./artCatalog";
import {
  HELD_WEAPON_ACTOR_CANVAS,
  heldWeaponStyle,
  measureHeldWeaponPlacement,
} from "./heldWeaponPresentation";

describe("registered held-weapon presentation", () => {
  it("aligns every measured weapon grip to Ame's hand socket in every context", () => {
    const ameGrip = AME_ART.geometry.gripPoint!;
    for (const [id, weapon] of Object.entries(WEAPON_ART)) {
      for (const context of ["field", "battle", "portal"] as const) {
        const actor = HELD_WEAPON_ACTOR_CANVAS[context];
        const placement = measureHeldWeaponPlacement(weapon, context);
        const resolvedGripX = placement.left + placement.size * placement.gripX;
        const resolvedGripY = placement.top + placement.size * placement.gripY;

        expect(resolvedGripX, `${id}/${context}/x`).toBeCloseTo(actor.left + actor.scale * ameGrip[0], 10);
        expect(resolvedGripY, `${id}/${context}/y`).toBeCloseTo(actor.top + actor.scale * ameGrip[1], 10);
      }
    }
  });

  it("uses one measured family axis without a universal scale or rotation", () => {
    const scales = new Set<number>();
    const rotations = new Set<number>();
    for (const weapon of Object.values(WEAPON_ART)) {
      const geometry = weapon.geometry;
      expect(geometry.forwardAxisDegrees + geometry.heldRotationDegrees).toBeCloseTo(-55, 8);
      expect(geometry.heldScale).toBeGreaterThanOrEqual(0.5);
      expect(geometry.heldScale).toBeLessThanOrEqual(0.7);
      expect([1, 3]).toContain(geometry.zOrder);
      scales.add(geometry.heldScale);
      rotations.add(geometry.heldRotationDegrees);
    }
    expect(scales.size).toBe(8);
    expect(rotations.size).toBeGreaterThan(4);
    expect(WEAPON_ART["bubble-ring-blade"].geometry.zOrder).toBe(1);
    expect(Object.values(WEAPON_ART).filter((weapon) => weapon.geometry.zOrder === 3)).toHaveLength(7);
  });

  it("serializes measured geometry as per-weapon CSS variables", () => {
    const style = heldWeaponStyle(WEAPON_ART["moon-wand"], "field") as Record<string, string | number>;
    expect(style["--held-left"]).toMatch(/%$/);
    expect(style["--held-top"]).toMatch(/%$/);
    expect(style["--held-size"]).toBe("62.3760%");
    expect(style["--held-grip-x"]).toBe("33.6000%");
    expect(style["--held-grip-y"]).toBe("77.3000%");
    expect(style["--held-rotation"]).toBe("9deg");
    expect(style["--held-z"]).toBe(3);
  });
});
