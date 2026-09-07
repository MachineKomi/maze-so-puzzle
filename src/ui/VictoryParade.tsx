import {useEffect,useState,type CSSProperties} from 'react';
import {CatalogueImage} from './CatalogueImage';
import {animalPersonality} from '../game/visualPersonality';
import type {AnimalSpecies} from '../game/types';

/** Decoration consumes the existing won result; it never owns an award/clock. */
export function VictoryParade({friends,ameSrc,flourish,active}: {
 friends: readonly {id:string;species:AnimalSpecies;src:string;label:string}[];
 ameSrc:string;flourish:boolean;active:boolean;
}) {
 const [quiet,setQuiet]=useState(!active);
 useEffect(()=>{if(!active)setQuiet(true);},[active]);
 const cast=friends.length?friends.map(f=>({...f,...animalPersonality(f.species)})):
  [{id:'ame',species:undefined,src:ameSrc,label:'Ame',motion:'sway',greeting:'You found your way!'}];
 // One deterministic occasional flourish, entirely independent of reward RNG.
 const flip=flourish?cast.findIndex(f=>['hop','prance','scamper'].includes(f.motion)):-1;
 return <div className="rescued-result-row victory-stage" data-celebration="friend-led-v1"
  data-quiet={quiet} data-friend-count={friends.length}
  style={{'--friend-count':cast.length} as CSSProperties}
  aria-label={friends.length?`${friends.length} rescued friends celebrate with Ame`:'Ame celebrates your solved maze'}>
  <div className="celebration-burst" aria-hidden="true">
   {Array.from({length:12},(_,i)=><i className="confetti-piece" key={i} style={{'--i':i,'--side':i%2?1:-1} as CSSProperties}/>)}
  </div>
  {cast.map((friend,i)=><div className="rescued-result rescued" key={friend.id}
   data-species={friend.species} data-animal-motion={friend.motion}
   style={{'--entrance-delay':`${i*70}ms`} as CSSProperties}>
   <div className="victory-pose" data-flip={i===flip}>
    <CatalogueImage src={friend.src} alt={friend.label} decoding="async" />
   </div>
   <span>{friend.greeting}</span>
  </div>)}
 </div>;
}
