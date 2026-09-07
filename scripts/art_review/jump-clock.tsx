/** Isolated hook/CSS fixture; never imported by the production entry. */
import React,{useRef,useState} from 'react';
import {createRoot} from 'react-dom/client';
import {flushSync} from 'react-dom';
import {useSceneTravel} from '../../src/ui/game/useSceneTravel';
import {getCameraWindow} from '../../src/game/exploration';
import {cameraLayerStyle} from '../../src/ui/game/sceneGeometry';
import {cameraWorldStyle} from '../../src/cameraMotion';
import {worldLayerStyle} from '../../src/cameraMotion';
import {getJumpPresentationMotion,type JumpTravel} from '../../src/jumpPresentation';
import '../../src/styles.css';
const grid={width:12,height:12},from={x:5,y:3},to={x:7,y:3},remote={x:10,y:9};
function Harness(){
 const boardRef=useRef<HTMLDivElement>(null),[jump,setJump]=useState<JumpTravel|null>(null),[portal,setPortal]=useState(false),[quality,setQuality]=useState('full'),[width,setWidth]=useState(480),[position,setPosition]=useState(from);
 const camera=getCameraWindow(grid,jump?.to??position),reset=()=>{};
 const scene=useSceneTravel({boardRef,grid,position,camera,followers:[],bindingKey:`${!!jump}:${portal}`,runKey:'fixture',enabled:quality!=='static',discontinuity:portal,jump,animateJump:quality!=='static',durationMs:160,onGeometryReset:reset});
 const start=(chain=false,delay=0)=>{const flight={from,to,startedAt:performance.now(),durationMs:460};const until=performance.now()+delay;while(performance.now()<until){};flushSync(()=>{setPortal(false);setPosition(chain?remote:to);setJump(flight);});setTimeout(()=>flushSync(()=>{setJump(null);setPortal(chain);}),Math.max(0,460-delay));};
 (window as any).jumpHarness={start,quality:(v:string)=>flushSync(()=>setQuality(v)),resize:()=>flushSync(()=>setWidth(600)),scene:()=>scene.current};
 return <div className="game-stage" data-motion="full" data-quality={quality}>
 <div ref={boardRef} className="maze-board" style={{position:'relative',width,height:width,overflow:'hidden','--grid-size':6} as React.CSSProperties}>
 <div className="camera-world" style={{position:'absolute',...cameraWorldStyle(grid as any,camera),background:'repeating-conic-gradient(#eee 0 25%,#bbb 0 50%) 0 / 16.666% 16.666%'}}/>
 <div className="camera-actors" style={cameraWorldStyle(grid as any,camera)}><div className="player-layer" style={{position:'absolute',...worldLayerStyle(position,grid),visibility:jump?'hidden':'visible'}}/></div>
 <div data-travel-actor="label" style={cameraLayerStyle(position,camera)}/>
 {jump&&<div className="jump-ground" style={{...cameraLayerStyle(from,camera),'--jump-duration':'460ms'} as React.CSSProperties}><i className="jump-presentation-shadow"/><i className="jump-spring-squash"/></div>}
 {jump&&<div className="jump-presentation" data-travel-actor="jump" style={{...cameraLayerStyle(from,camera),'--jump-duration':'460ms','--jump-apex':`${getJumpPresentationMotion().apexPercent}%`,'--jump-descent':'-30%'} as React.CSSProperties}>
 <div className="jump-presentation-body"><span style={{fontSize:48}}>★</span></div></div>}
 </div></div>;
}
createRoot(document.getElementById('proof')!).render(<Harness/>);
