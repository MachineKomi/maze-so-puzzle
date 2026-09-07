import { describe,it,expect } from 'vitest';
import { AME_ART, DOOR_ART, WEAPON_ART, MGJRPG02_ART } from './artCatalog';
import { measureHeldWeaponPlacement } from './heldWeaponPresentation';
import { measureFieldArt } from './fieldArtLayout';
import { FIELD_GROUND_Y } from './game/tallWalls';

describe('alpha-registered field artwork',()=>{
  it('makes every doorway tall enough for Ame and matches floor weapons to their held scale',()=>{
    for(const door of Object.values(DOOR_ART)) {
      const frame=measureFieldArt(door.geometry!,'door');
      expect(frame.visibleHeight).toBeGreaterThanOrEqual(1.25);
      expect(frame.visibleHeight).toBeLessThanOrEqual(1.35);
      expect(frame.scale*door.geometry!.visibleBounds[2]).toBeLessThanOrEqual(1.12);
      expect(frame.top+frame.anchor*frame.scale).toBeCloseTo(FIELD_GROUND_Y);
    }
    for(const weapon of Object.values(WEAPON_ART)) for(const context of ['field','jump','portal','battle'] as const)
      expect(measureFieldArt(weapon.geometry,'weapon').scale).toBe(measureHeldWeaponPlacement(weapon,context).size);
  });
  it('keeps corridor clearance and natural proportions within the actor/item height budgets',()=>{
    for(const art of Object.values(MGJRPG02_ART)) {
      if(!['character','enemy','friend','item','weapon'].includes(art.family)) continue;
      const g=art.geometry,frame=measureFieldArt(g,art.family==='item'||art.family==='weapon'?'item':'actor');
      expect(frame.left+g.visibleBounds[0]*frame.scale).toBeGreaterThanOrEqual(.05-1e-8);
      expect(frame.left+(g.visibleBounds[0]+g.visibleBounds[2])*frame.scale).toBeLessThanOrEqual(.95+1e-8);
      expect(frame.visibleHeight).toBeLessThanOrEqual((art.family==='item'||art.family==='weapon'? .9:1.35)+1e-8);
      expect(frame.top+frame.anchor*frame.scale).toBeCloseTo(FIELD_GROUND_Y);
    }
    expect(measureFieldArt(AME_ART.geometry).visibleHeight).toBeGreaterThan(1.34);
    expect(measureFieldArt(AME_ART.geometry).visibleHeight).toBeLessThan(1.36);
  });
});
