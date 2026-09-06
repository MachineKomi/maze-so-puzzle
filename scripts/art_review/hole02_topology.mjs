// Source-only construction preview. Reuses the runtime terrain union authority.
import { createRoundedCellUnionPath } from '../../src/game/terrainGeometry.ts';

const directions = [[0,-1],[1,0],[0,1],[-1,0]];
const rows = Array.from({length:16},(_,mask) => {
  const cells = [[1,1], ...directions.flatMap(([x,y],bit) => mask & (1<<bit) ? [[1+x,1+y]] : [])];
  const occupied = new Set(cells.map(([x,y])=>`${x},${y}`));
  const shape = createRoundedCellUnionPath({left:0,top:0,right:2,bottom:2},(x,y)=>occupied.has(`${x},${y}`),.28);
  if(shape.loopCount!==1 || !shape.d) throw new Error(`Invalid connected mask ${mask}`);
  return {mask,cells,...shape};
});
const diagonal = createRoundedCellUnionPath({left:0,top:0,right:1,bottom:1},(x,y)=>x===y,.28);
if(diagonal.loopCount!==2) throw new Error('Diagonal pits must remain separate');
process.stdout.write(JSON.stringify({schema:'maze-hole02-topology-preview/v1',authority:'src/game/terrainGeometry.ts',cardinalMasks:rows,diagonal}));
