import { expect, it } from "vitest";
import { getCurrentInputBlock, type UiOverlay } from "./interactionState";
import { measuredFlight } from "./game/MazeViewport";
it("blocks all current sources behind every declared overlay", () => {
  const overlays: UiOverlay[] = ["reset","tester","maze-picker","switch","story","help","hint","blocker","too-strong","completion","lost","sound","detail","more"];
  for (const topOverlay of overlays) expect(getCurrentInputBlock({screen:"game",topOverlay})).toMatchObject({gameplayInputAllowed:false,backgroundInert:true,clearHeldInput:true});
  expect(getCurrentInputBlock({screen:"game",topOverlay:null}).gameplayInputAllowed).toBe(true);
  expect(getCurrentInputBlock({screen:"title",topOverlay:null}).gameplayInputAllowed).toBe(false);
});
it("derives revision-one flight anchors from measured rectangles", () => {
  const rect = (left:number,top:number,width:number,height:number) => ({left,top,width,height}) as DOMRect;
  expect(measuredFlight(rect(20,30,600,600),rect(800,100,48,48),rect(10,10,1000,700),.5,.5)).toEqual({left:"310px",top:"320px","--treasure-fly-x":"504px","--treasure-fly-y":"-206px"});
});
