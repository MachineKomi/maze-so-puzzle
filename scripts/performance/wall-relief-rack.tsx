// Dev-only visual fixture, not imported by the shipped application.
import { createRoot } from "react-dom/client";
import { useState } from "react";
import { MazeTerrain } from "../../src/ui/game/MazeTerrain";
import { CURATED_LEVELS } from "../../src/game/levels";
import { TERRAIN_THEMES } from "../../src/artCatalog";
import type { TerrainThemeId, LightDirection, TerrainKind } from "../../src/game/types";

const rows = ["########", "#..#...#", "#.##.#.#", "#....#.#", "#.###..#", "#.#.#w.#", "#.#..h.#", "########"];
const terrain = rows.map(row => [...row].map(c => c === "#" ? "wall" : c === "w" ? "water" : c === "h" ? "hole" : "floor") as TerrainKind[]);
const themes: TerrainThemeId[] = ["sunny-stone","rose-courtyard","ember-keep","wishing-woods","pearl-grotto","harvest-bramble"];
function Rack() {
  const [size,setSize] = useState(48);
  const [light,setLight] = useState<LightDirection>("bottom");
  const [grey,setGrey] = useState(false);
  return <><h1>WALL-04A-R1 · exact gameplay-scale surfaces</h1>
    <p>Isolated pillars, L/U/stair corners, one-tile corridors, water and pit. No animation. R1 is a candidate, not Human acceptance.</p>
    <label>Tile size <select value={size} onChange={e=>setSize(Number(e.target.value))}>{[32,48,64,112].map(n=><option key={n}>{n}</option>)}</select></label>{" "}
    <label>Light <select value={light} onChange={e=>setLight(e.target.value as LightDirection)}>{["top","right","bottom","left"].map(n=><option key={n}>{n}</option>)}</select></label>{" "}
    <label><input type="checkbox" checked={grey} onChange={e=>setGrey(e.target.checked)}/>Grayscale review</label>
    <main style={{display:"flex",flexWrap:"wrap",gap:20,marginTop:16,filter:grey?"grayscale(1)":undefined}}>
      {themes.map(terrainThemeId => {
        const level={...CURATED_LEVELS[0]!,id:`rack-${terrainThemeId}`,width:8,height:8,terrain,objects:[],exit:{x:99,y:99},terrainThemeId,lightDirection:light};
        return <section key={terrainThemeId}><h2>{TERRAIN_THEMES[terrainThemeId].label}</h2><div className="rack-board" style={{width:8*size,height:8*size}}><MazeTerrain level={level} camera={{left:0,top:0,right:7,bottom:7,width:8,height:8}}/></div></section>;
      })}
    </main></>;
}
const style=document.createElement("style");
style.textContent="body{background:#f8f3ed;color:#503e64;font:16px system-ui;margin:24px}h1{font-size:24px}h2{font-size:17px}.rack-board{position:relative;overflow:hidden}.maze-terrain-svg{width:100%;height:100%;position:absolute;inset:0}.terrain-hole-layer{position:absolute}.terrain-hole-layer img{width:100%;height:100%;object-fit:contain}.terrain-water-fx,.terrain-lava-fx,.terrain-poison-fx{display:none}";
document.head.append(style);
createRoot(document.getElementById("root")!).render(<Rack/>);
