import React, { useLayoutEffect, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import { flushSync } from "react-dom";
import { createInitialGameState } from "../../src/game/engine";
import { CURATED_LEVELS } from "../../src/game/levels";
import { scatterTreasure } from "../../src/game/loot";
import { RewardLayer, EMPTY_REWARD_PORT } from "../../src/vfx/RewardLayer";
import { useLootCollection } from "../../src/vfx/useLootCollection";
import type { TreasureObject } from "../../src/game/types";

/** Synthetic capacity/owner harness. Never imported into the game or used as
 * authored-route, real-device or gameplay-acceptance evidence. */
export function mountPhysicalLootHarness(host:HTMLElement, lite=false) {
  const terrain=Array.from({length:12},(_,y)=>Array.from({length:12},(_,x)=>x===0||y===0||x===11||y===11?"wall" as const:"floor" as const));
  const objects:TreasureObject[]=Array.from({length:64},(_,i)=>({id:`capacity-${i}`,kind:"treasure",amount:2,currency:i%2?"science":"gold",style:"gold-chest",at:{x:2+i%8,y:2+Math.floor(i/8)}}));
  const level={...CURATED_LEVELS[0]!,width:12,height:12,start:{x:1,y:1},exit:{x:10,y:10},terrain,objects};
  let initial=createInitialGameState(level);
  for(const object of objects) {
    initial={...initial,collectedObjectIds:[...initial.collectedObjectIds,object.id]};
    initial={...initial,loot:scatterTreasure(level,initial,object)};
  }
  initial={...initial,position:{x:5,y:5}};
  const scene={current:{position:{x:5,y:5},camera:{left:2,top:2,right:7,bottom:7,width:6,height:6},cameraEnvelope:{left:2,top:2,right:7,bottom:7},contentSize:{width:480,height:480},followers:[]}};
  const root=createRoot(host), samples:any[]=[];
  let controls:{interrupt():void;replace():void;read():any};
  function Harness() {
    const [game,setGame]=useState(initial),[runId,setRunId]=useState("run-capacity-first"),[enabled,setEnabled]=useState(true);
    const port=useRef(EMPTY_REWARD_PORT);
    const view=useLootCollection({game,setGame,level,runId,scene,port,enabled,animate:true,limit:lite?8:20});
    useLayoutEffect(()=>{
      samples.push({runId,claiming:game.loot.sources.flatMap(s=>s.drops).filter(d=>d.phase==='claiming').map(d=>d.id),
        represented:[...view.current.represented],credit:game.goldStarsCollected+game.sciencePointsCollected});
    },[game,runId,view]);
    controls={interrupt(){setEnabled(false);},replace(){setRunId("run-capacity-replacement");setGame(initial);setEnabled(false);},read(){return{game,samples};}};
    return <div style={{position:"relative",width:480,height:480}}><div className="camera-world" />
      <div data-reward-anchor="ame" style={{position:"absolute",left:240,top:240,width:80,height:80}} />
      <RewardLayer port={port} level={level} scene={scene} active={true} quality={lite?"lite":"full"} muted={true} loot={view} />
    </div>;
  }
  flushSync(()=>root.render(<Harness/>));
  return {read:()=>controls.read(),interrupt:()=>flushSync(()=>controls.interrupt()),replace:()=>flushSync(()=>controls.replace()),unmount:()=>flushSync(()=>root.unmount())};
}

/** Synthetic saturated presentation sequence; semantic admission is paused so
 * pre-existing grounded slots remain full throughout the two new releases. */
export function mountRewardPriorityHarness(host:HTMLElement, lite:boolean) {
  const limit=lite?8:20,runId="run-priority-harness";
  const terrain=Array.from({length:12},(_,y)=>Array.from({length:12},(_,x)=>!x||!y||x===11||y===11?"wall" as const:"floor" as const));
  const prior:TreasureObject[]=Array.from({length:limit},(_,i)=>({id:`prior-${i}`,kind:"treasure",amount:1,currency:"gold",style:"gold-chest",at:{x:3+i%5,y:3+Math.floor(i/5)}}));
  const enemy={id:"priority-enemy",kind:"enemy" as const,power:99,at:{x:8,y:5}};
  const treasure:TreasureObject={id:"priority-treasure",kind:"treasure",amount:3,currency:"science",style:"science-gears",at:{x:8,y:7}};
  const level={...CURATED_LEVELS[0]!,width:12,height:12,start:{x:1,y:1},exit:{x:10,y:10},terrain,objects:[...prior,enemy,treasure]};
  let initial=createInitialGameState(level,runId);
  for(const object of prior){initial={...initial,collectedObjectIds:[...initial.collectedObjectIds,object.id]};initial={...initial,loot:scatterTreasure(level,initial,object)};}
  initial={...initial,position:{x:6,y:6}};
  const scene={current:{position:{x:6,y:6},camera:{left:3,top:3,right:8,bottom:8,width:6,height:6},cameraEnvelope:{left:3,top:3,right:8,bottom:8},contentSize:{width:480,height:480},followers:[]}};
  const root=createRoot(host);let controls:any;
  function Harness(){
    const [game,setGame]=useState(initial),[withheld,setWithheld]=useState<string>();const port=useRef(EMPTY_REWARD_PORT);
    const view=useLootCollection({game,setGame,level,runId,scene,port,enabled:false,animate:true,limit,withheldObjectId:withheld});
    controls={
      defeat(){setWithheld(enemy.id);setGame(current=>{const resolved={...current,defeatedEnemyIds:[enemy.id]};return{...resolved,loot:scatterTreasure(level,resolved,enemy)};});},
      release(){setWithheld(undefined);},
      treasure(){setGame(current=>{const resolved={...current,collectedObjectIds:[...current.collectedObjectIds,treasure.id]};return{...resolved,loot:scatterTreasure(level,resolved,treasure)};});},
      read(){return{game,represented:game.loot.sources.map(s=>({objectId:s.objectId,currency:s.currency,ids:s.drops.filter(d=>view.current.represented.has(d.id)).map(d=>d.id)})),
        motions:[...view.current.motions.keys()],shown:[...view.current.motions].filter(([id,m])=>view.current.represented.has(id)&&m.shownAt!==undefined).map(([id])=>id)}}
    };
    return <div style={{position:"relative",width:480,height:480}}><div className="camera-world"/>
      <div data-reward-anchor="ame" style={{position:"absolute",left:240,top:240,width:80,height:80}}/>
      <RewardLayer port={port} level={level} scene={scene} active quality={lite?"lite":"full"} muted loot={view}/></div>;
  }
  flushSync(()=>root.render(<Harness/>));
  return{read:()=>controls.read(),defeat:()=>flushSync(()=>controls.defeat()),release:()=>flushSync(()=>controls.release()),treasure:()=>flushSync(()=>controls.treasure()),unmount:()=>flushSync(()=>root.unmount())};
}
