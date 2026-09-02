import { describe, expect, it } from "vitest";
import { combatPowerNotice, pickupToastFor } from "./mapNotices";
import { ASSETS } from "./assets";
import { resolveKeyArt, resolveWeaponArt } from "./artCatalog";
import { SWORD_AND_KEY_LEVEL } from "./game/levels";
import type { GameEvent } from "./game/types";

describe("on-map notices", () => {
  it("uses the collected object's rendered sprite for every pickup family", () => {
    const weapon = SWORD_AND_KEY_LEVEL.objects.find((object) => object.kind === "sword");
    expect(weapon?.kind).toBe("sword");
    if (!weapon || weapon.kind !== "sword") return;

    const cases: readonly [GameEvent, string][] = [
      [{ type: "sword-collected", objectId: weapon.id }, resolveWeaponArt(weapon.style).src],
      [{ type: "boots-collected", objectId: "boots" }, ASSETS.boots],
      [{ type: "spring-boots-collected", objectId: "spring-boots" }, ASSETS.springBoots],
      [{ type: "antidote-leaf-collected", objectId: "leaf" }, ASSETS.antidoteLeaf],
      [{ type: "potion-collected", objectId: "potion", amount: 4, powerBefore: 2, powerAfter: 6 }, ASSETS.potion],
      [{ type: "key-collected", objectId: "key", color: "red" }, resolveKeyArt("red").src],
      [{ type: "treasure-collected", objectId: "gold", currency: "gold", amount: 3, total: 3 }, ASSETS.treasureGoldChest],
      [{ type: "treasure-collected", objectId: "science", currency: "science", amount: 2, total: 2 }, ASSETS.treasureScienceGears],
    ];

    for (const [event, expectedIcon] of cases) {
      const notice = pickupToastFor([event], SWORD_AND_KEY_LEVEL);
      expect(notice).toMatchObject({ icon: expectedIcon, kind: "pickup" });
      expect(notice?.icon).toMatch(/^\/assets\/.+\.(?:png|webp)$/);
    }
  });

  it("announces the exact Power won at Ame's pre-combat tile", () => {
    const at = { x: 3, y: 4 };
    const notice = combatPowerNotice({
      type: "enemy-defeated",
      objectId: "friendly-goblin",
      enemyPower: 7,
      powerBefore: 6,
      powerAfter: 13,
    }, at);

    expect(notice).toEqual({ text: "+7!", kind: "power", at });
  });
});
