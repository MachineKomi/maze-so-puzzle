import { parseAsciiLevel } from '../../../src/game/levels';

// Isolated authoring hypotheses. These IDs are never registered by production.
export const CANARIES = [
  parseAsciiLevel({
    id: 'p1-first-use', name: 'A little stronger', objective: 'Find the star; friends are optional.',
    source: 'curated', initialPower: 6, terrainThemeId: 'wishing-woods',
    weaponStyle: 'leaf-blade', enemyStylesByPower: { 9: 'pebble-golem', 5: 'mushroom-imp' },
    map: [
      '#########',
      '###..E###',
      '###c..###',
      '####9####',
      '#k..@.sv#',
      '######.##',
      '######5i#',
      '#########',
      '#########',
    ],
  }),
  parseAsciiLevel({
    id: 'p1-room-return', name: 'The lantern reunion', objective: 'Explore, grow and return to the star room.',
    source: 'curated', initialPower: 6, terrainThemeId: 'lantern-ruins',
    objectIds: {
      '3,2': 'p1-room-return-treasure-gallery-science',
      '11,9': 'p1-room-return-treasure-growth-science',
      '9,4': 'p1-room-return-treasure-gallery-gold',
      '1,10': 'p1-room-return-treasure-courtyard-gold',
    },
    weaponStyle: 'flower-sabre', enemyStylesByPower: { 9: 'pebble-golem', 5: 'mushroom-imp' },
    map: [
      '#############',
      '#...........#',
      '#..i.....E..#',
      '#.....#.....#',
      '#..c..#..k..#',
      '####9########',
      '#.....#######',
      '#.....#.....#',
      '#..s@...5...#',
      '#.....#....i#',
      '#k....#.....#',
      '#############',
      '#############',
    ],
  }),
] as const;
