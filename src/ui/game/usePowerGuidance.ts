import { useEffect, useState } from "react";
import type { GameState, LevelDefinition } from "../../game/types";
import { createPowerOpportunitySearch, schedulePowerOpportunitySearch, type PowerSearchResult } from "./powerGuidance";

export function usePowerGuidance(level:LevelDefinition,game:GameState,blockerId:string|undefined) {
  const [result,setResult]=useState<{level:LevelDefinition;game:GameState;blockerId:string;value:PowerSearchResult}>();
  useEffect(()=>{
    if(!blockerId)return;
    return schedulePowerOpportunitySearch(createPowerOpportunitySearch(level,game,blockerId),value=>setResult({level,game,blockerId,value}));
  },[level,game,blockerId]);
  // Cleanup alone cannot prevent a stale render before a changed effect runs.
  return blockerId&&result?.level===level&&result.game===game&&result.blockerId===blockerId ? result.value : undefined;
}
