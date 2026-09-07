/** Development-only rack. Actual renderer/art owners, no production import or saves. */
import { createRoot } from 'react-dom/client';
import { useId } from 'react';
import { CURATED_LEVELS } from '../../src/game/levels';
import { MazeTerrain } from '../../src/ui/game/MazeTerrain';
import { MazeForeground } from '../../src/ui/game/MazeForeground';
import { CagedFriend } from '../../src/ui/game/CagedFriend';
import { CatalogueImage } from '../../src/ui/CatalogueImage';
import { AME_ART, WEAPON_ART, ANIMAL_ART, ENEMY_ART, PICKUP_ART, TREASURE_CATALOG_ART, CAGE_ART, resolveAnimalArt, resolveEnemyArt, resolveCageArt } from '../../src/artCatalog';
import { fieldActorStyle } from '../../src/fieldArtLayout';
import { heldWeaponStyle } from '../../src/heldWeaponPresentation';
import { worldLayerStyle } from '../../src/cameraMotion';
import type { LevelDefinition, LightDirection } from '../../src/game/types';
import '../../src/styles.css';

const q=new URLSearchParams(location.search);
document.documentElement.dataset.motion='reduced'; document.documentElement.dataset.quality='static';
const lights:LightDirection[]=['top','top-right','right','bottom-right','bottom','bottom-left','left','top-left'];
const scene={...CURATED_LEVELS[0]!,width:6,height:6,start:{x:3,y:2},exit:{x:5,y:5},objects:[],
  terrain:['WWWWWW','W....W','WWW..W','W....W','W.WWWW','WWWWWW'].map(row=>[...row].map(c=>c==='W'?'wall':'floor'))} as LevelDefinition;
function ArtRack() {
  const cages=Object.values(CAGE_ART),friends=Object.entries(ANIMAL_ART);
  const start=Number(q.get('start')??0),count=Number(q.get('count')??16);
  const rows=q.has('weapons')?Object.entries(WEAPON_ART):q.has('enemies')?Object.entries(ENEMY_ART):q.has('items')?Object.entries({...PICKUP_ART,...TREASURE_CATALOG_ART}):q.has('cage')?friends.filter(([id])=>['bunny','alpaca','tidecurl-hippocamp','mallowmusk-aroma-wisp'].includes(id)):friends.slice(start,start+count);
  return <main style={{display:'grid',gridTemplateColumns:'repeat(4,240px)',gap:16,padding:16,background:'#eee3d3'}}>{rows.map(([name,art],i)=><section key={name}>
    <h2 style={{fontSize:16,margin:0}}>{name}</h2><div className="maze-board" style={{position:'relative',width:240,height:245,display:'block',background:'#f5eacb',borderRadius:12,overflow:'hidden'}}>
      {q.has('weapons')?<div className="player-layer" style={{left:65,top:142,width:100,height:100}}>
        <CatalogueImage usage="field" fieldRole="actor" className="player-sprite" art={AME_ART}/>
        <CatalogueImage usage="field" fieldDetail className="player-held-weapon" art={art} style={heldWeaponStyle(WEAPON_ART[name as keyof typeof WEAPON_ART],'field')}/>
      </div>:<>
        {!q.has('items')&&!q.has('enemies')&&<div className="object-layer object-kind-animal" style={{left:8,top:125,width:100,height:100}}><div className="animal-stack">
          <CagedFriend friendSrc={art.src} cageSrc={cages[Number(q.get('cage')??i)%cages.length]!.src}/>
        </div></div>}
        <div className="object-layer" style={{left:q.has('items')||q.has('enemies')?65:126,top:143,width:100,height:100}}>
          <CatalogueImage usage="field" fieldRole={q.has('items')?'item':'actor'} art={art}/>
        </div>
      </>}
    </div>
  </section>)}</main>;
}
function Rack({direction}:{direction:LightDirection}) {
  const id=useId().replace(/:/g,''), level={...scene,lightDirection:direction,terrainThemeId:CURATED_LEVELS[Number(q.get('theme')??8)]!.terrainThemeId};
  const camera={left:0,top:0,right:5,bottom:5,width:6,height:6};
  const weapon=WEAPON_ART[(q.get('weapon')??'sunflower-hammer') as keyof typeof WEAPON_ART]??Object.values(WEAPON_ART)[0]!;
  return <section><h2>{direction}</h2><div className="maze-board" style={{position:'relative',width:480,height:480,display:'block',containerType:'inline-size'}}>
    <MazeTerrain level={level} camera={camera} volumeId={id}/>
    <div className="player-layer" style={{...worldLayerStyle({x:3,y:3},level),...fieldActorStyle(AME_ART.geometry)}}>
      <CatalogueImage usage="field" fieldRole="actor" className="player-sprite" art={AME_ART} />
      <CatalogueImage usage="field" fieldDetail className="player-held-weapon" art={weapon} style={heldWeaponStyle(weapon,'field')} />
      <span className="power-badge player-power">12</span>
    </div>
    <div className="object-layer object-kind-enemy" style={worldLayerStyle({x:4,y:1},level)}>
      <CatalogueImage usage="field" fieldRole="actor" className="maze-object object-enemy" src={resolveEnemyArt('goblin').src} />
    </div>
    <div className="object-layer object-kind-animal" style={worldLayerStyle({x:1,y:3},level)}><div className="animal-stack">
      <CagedFriend friendSrc={resolveAnimalArt('alpaca').src} cageSrc={resolveCageArt('golden-heart').src}/>
    </div></div>
    <MazeForeground level={level} volumeId={id} style={{inset:0,width:'100%',height:'100%'}} />
  </div></section>;
}
createRoot(document.getElementById('root')!).render(q.has('art')?<ArtRack/>:<main style={{display:'flex',flexWrap:'wrap',gap:24,padding:24,background:'#eadfd4'}}>{(q.has('all')?lights:[q.get('light') as LightDirection || 'top-left']).map(direction=><Rack key={direction} direction={direction}/>)}</main>);
