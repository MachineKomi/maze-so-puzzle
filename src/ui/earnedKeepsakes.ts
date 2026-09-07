import { STICKER_ART, MEDAL_ART, BADGE_ART } from '../assets';
import { STICKER_LABELS, ACHIEVEMENT_LABELS, BADGE_LABELS, type PlayerProgress } from '../progress';

export interface EarnedKeepsake { readonly id:string; readonly label:string; readonly art:string; readonly kind:string }

/** Fixed corner footprint must clear Ame and her immediately neighbouring tiles. */
export function keepsakeCorner(x:number,y:number,columns:number,rows:number) {
 const px=(x+.5)/columns,py=(y+.5)/rows;
 const corners=[{right:px<.5,bottom:py<.5},{right:px<.5,bottom:py>=.5},
  {right:px>=.5,bottom:py<.5},{right:px>=.5,bottom:py>=.5}];
 for(const [width,height] of [[.36,.4],[.60,.28],[.28,.4],[.20,.28]] as const){
  const corner=corners.find(({right,bottom})=>{
   const left=right?1-.02-width:.02,top=bottom?1-.02-height:.02;
   return left+width<px-1.5/columns || left>px+1.5/columns
    || top+height<py-1.5/rows || top>py+1.5/rows;
  });
  if(corner)return {...corner,width,height};
 }
 return null;
}

/** Presentation-only difference, admitted by the successful profile-write owner. */
export function earnedKeepsakes(before:PlayerProgress, after:PlayerProgress, saved:boolean):readonly EarnedKeepsake[] {
 if(!saved)return [];
 return [
  ...after.stickers.filter(id=>!before.stickers.includes(id)).map(id=>({id,label:STICKER_LABELS[id].label,art:STICKER_ART[id],kind:'Sticker'})),
  ...after.medals.filter(id=>!before.medals.includes(id)).map(id=>({id,label:ACHIEVEMENT_LABELS[id].label,art:MEDAL_ART[id],kind:'Medal'})),
  ...after.badges.filter(id=>!before.badges.includes(id)).map(id=>({id,label:BADGE_LABELS[id].label,art:BADGE_ART[id],kind:'Badge'})),
 ];
}
