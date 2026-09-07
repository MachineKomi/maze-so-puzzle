/** Source-only supply and matched v22/v23 fixture preparation. No extra media copies. */
import {createServer} from 'vite';
import {mkdir,readFile,writeFile} from 'node:fs/promises';
import {resolve} from 'node:path';
import {createHash} from 'node:crypto';
const output=process.env.MAZE_PERF_EVIDENCE_DIR;
if(!output)throw Error('Set external QA output');
const server=await createServer({server:{middlewareMode:true}});
try{
  const {CURATED_LEVELS}=await server.ssrLoadModule('/src/game/levels.ts');
  const {createDefaultPlayerProgress,PLAYER_PROGRESS_STORAGE_KEY}=await server.ssrLoadModule('/src/progress.ts');
  const {ACTIVE_RUN_STORAGE_KEY}=await server.ssrLoadModule('/src/session.ts');
  const {DEFAULT_PRESENTATION_PREFERENCES,PRESENTATION_PREFERENCES_KEY}=await server.ssrLoadModule('/src/motion.ts');
  const {enemyXp,adventureProgress}=await server.ssrLoadModule('/src/game/adventureXp.ts');
  const {findInputFixture,savedFixture}=await server.ssrLoadModule('/scripts/performance/v22-input-fixtures.ts');
  const {createInitialGameState,movePlayer}=await server.ssrLoadModule('/src/game/engine.ts');
  const {solveLevel}=await server.ssrLoadModule('/src/game/solver.ts');
  const {generateSurpriseMaze}=await server.ssrLoadModule('/src/game/generator.ts');
  const {authoredLootErrors}=await server.ssrLoadModule('/src/game/loot.ts');
  const rows=CURATED_LEVELS.map(l=>({id:l.id,fingerprint:l.gameplayFingerprint,solve:10,
    physicalXp:l.objects.reduce((n,o)=>n+(o.kind==='enemy'?enemyXp(o.power):o.kind==='chest'&&o.mimicChance===100?enemyXp(o.power,true):0),0),
    potentialChannels:l.objects.reduce((n,o)=>n+(o.kind==='treasure'?1:o.kind==='enemy'||o.kind==='chest'?3:0),0)}));
  const generated=[];for(const difficulty of ['movement','gentle','growing','adventure'])for(const size of [9,17,23])for(const seed of ['xp-supply-1','xp-supply-2']){
    const l=generateSurpriseMaze({difficulty,size,seed});if(authoredLootErrors(l).length)throw Error('Generated capacity');
    generated.push({difficulty,size,seed,channels:l.objects.reduce((n,o)=>n+(o.kind==='treasure'?1:o.kind==='enemy'?3:0),0)});
  }
  const min=rows.length*10,max=rows.reduce((n,r)=>n+r.solve+r.physicalXp,0);
  const supply={rows,generated,minXp:min,maxXp:max,minLevel:adventureProgress(min),maxLevel:adventureProgress(max),
    replayExamples:{noncombat:10,ordinaryPower1WithAllCrystals:12,mimicPower6WithAllCrystals:18},
    note:'Solve-only floor is160 XP; optional collected crystals add at most the physical supply. Recognition has no combat or unlock advantage.'};
  const f=findInputFixture(e=>e.some(e=>e.type==='enemy-defeated'));
  const event=f.result.events.find(e=>e.type==='enemy-defeated');
  const preXp=s=>{const {xpCollected,...game}=s.game;return{...s,schemaVersion:6,game:{...game,loot:{version:2,runId:s.runId,legacyRetiredEnemyIds:game.loot.legacyRetiredEnemyIds,sources:game.loot.sources.filter(s=>s.currency!=='xp')}}};};
  const snapshot=savedFixture(f,'xp23-pair');
  const camera=JSON.parse(await readFile(resolve('../maze-game-qa/performance/field21-final-browser/camera-window/fixtures.json'),'utf8')).fixtures.find(f=>f.id==='shiny-sword');
  // Existing schema5 camera prefix remains valid under v22; v23 migrates that
  // exact prefix, with no retroactive XP. Same physical route, both directions.
  const progress=createDefaultPlayerProgress(16),baselineProgress={...progress,schemaVersion:7};delete baselineProgress.adventureXp;
  const mediaPath='public/assets/adventure-xp-v1.png';
  const fixtures={keys:{run:ACTIVE_RUN_STORAGE_KEY,progress:PLAYER_PROGRESS_STORAGE_KEY,preferences:PRESENTATION_PREFERENCES_KEY},
    preferences:DEFAULT_PRESENTATION_PREFERENCES,progress,baselineProgress,
    candidateOnlyMedia:[{path:mediaPath,sha256:createHash('sha256').update(await readFile(mediaPath)).digest('hex')}],
    fixtures:[{id:'xp-enemy',snapshot,baselineSnapshot:preXp(snapshot),direction:f.direction,objectId:event.objectId,powerAfter:event.powerAfter,
      rewards:f.result.state.loot.sources.filter(s=>s.objectId===event.objectId).map(s=>({currency:s.currency,amount:s.amount}))},camera]};
  // Assert campaign fingerprints and engine rules haven't been rewritten as XP.
  for(const l of CURATED_LEVELS){let g=createInitialGameState(l);const solved=solveLevel(l,{avoidAnimals:true});if(!solved.solvable)throw Error(l.id);for(const d of solved.directions)g=movePlayer(l,g,d).state;if(g.status!=='won')throw Error(l.id);}
  await mkdir(output,{recursive:true});await writeFile(resolve(output,'supply.json'),JSON.stringify(supply,null,2));await writeFile(resolve(output,'paired-fixtures.json'),JSON.stringify(fixtures,null,2));
  console.log(JSON.stringify({min,max,minLevel:supply.minLevel.level,maxLevel:supply.maxLevel.level,maxAuthoredChannels:Math.max(...rows.map(r=>r.potentialChannels)),maxGeneratedChannels:Math.max(...generated.map(r=>r.channels))}));
}finally{await server.close();}
