/** Reproducible authored chest economy/routes; no browser, media copy or deployment. */
import {createServer} from 'vite';
import {mkdir,writeFile} from 'node:fs/promises';
import {resolve} from 'node:path';
const output=process.env.MAZE_PERF_EVIDENCE_DIR;
if(!output)throw Error('Set MAZE_PERF_EVIDENCE_DIR to a logged QA folder');
const server=await createServer({server:{middlewareMode:true}});
try{
  const {CURATED_LEVELS,LEGACY_CURATED_LEVELS}=await server.ssrLoadModule('/src/game/levels.ts');
  const {measureLevel}=await server.ssrLoadModule('/src/game/metrics.ts');
  const {solveLevel}=await server.ssrLoadModule('/src/game/solver.ts');
  const {enemyRewardRange}=await server.ssrLoadModule('/src/game/enemyRewards.ts');
  const {ORDINARY_MIXED_CHEST,mimicRewardRanges}=await server.ssrLoadModule('/src/game/chests.ts');
  const rows=CURATED_LEVELS.map(level=>({id:level.id,revision:level.contentRevision,fingerprint:level.gameplayFingerprint,
    metrics:measureLevel(level),ordinaryWithoutMimic:solveLevel(level,{avoidAnimals:true,avoidMimics:true}).solvable,
    chests:level.objects.filter(o=>o.kind==='chest'),
    allChests:level.objects.some(o=>o.kind==='chest')?((r)=>({solvable:r.solvable,reason:r.reason,visited:r.visitedStates,inputs:r.directions.length}))(solveLevel(level,{requireAllAnimals:true,requireAllChests:true})):null}));
  const envelope=levels=>Object.fromEntries(['gold','science'].map(c=>[c,[0,1].map(i=>levels.flatMap(l=>l.objects).reduce((n,o)=>n+
    (o.kind==='treasure'&&o.currency===c?o.amount:o.kind==='enemy'?enemyRewardRange(o.power,c)[i]:o.kind==='chest'?
      (o.mimicChance===100?mimicRewardRanges(o.power):ORDINARY_MIXED_CHEST)[c][i]:0),0))]));
  const report={rows,envelope:{legacy:envelope(LEGACY_CURATED_LEVELS),current:envelope(CURATED_LEVELS)}};
  await mkdir(output,{recursive:true});await writeFile(resolve(output,'authored-audit.json'),JSON.stringify(report,null,2));
  console.log(JSON.stringify(report));
}finally{await server.close();}
