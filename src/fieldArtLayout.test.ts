import { describe,it,expect } from 'vitest';
import { AME_ART, MGJRPG02_ART } from './artCatalog';
import { measureFieldArt } from './fieldArtLayout';
import { FIELD_GROUND_Y } from './game/tallWalls';

describe('alpha-registered field artwork',()=>{
  it('leaves5%clearance each side without squeezing tall artwork',()=>{
    for(const art of Object.values(MGJRPG02_ART)) {
      if(!['character','enemy','friend','item','weapon'].includes(art.family)) continue;
      const g=art.geometry,frame=measureFieldArt(g,art.family==='item'||art.family==='weapon'?'item':'actor');
      expect(frame.left+g.visibleBounds[0]*frame.scale).toBeCloseTo(.05);
      expect(frame.left+(g.visibleBounds[0]+g.visibleBounds[2])*frame.scale).toBeCloseTo(.95);
      expect(frame.top+frame.anchor*frame.scale).toBeCloseTo(FIELD_GROUND_Y);
    }
    expect(measureFieldArt(AME_ART.geometry).visibleHeight).toBeGreaterThan(1.77);
    expect(measureFieldArt(AME_ART.geometry).visibleHeight).toBeLessThan(1.78);
  });
});
