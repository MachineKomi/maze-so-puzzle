import type { AnimalSpecies } from "./game/types";

export interface StoryRescueRecordDisplay {
  readonly documentedStorySpecies: readonly AnimalSpecies[];
  readonly hasUnknownRescues: boolean;
}

/**
 * Reconciles a durable rescue count with the current animals authored into a
 * story level. This keeps old records honest when a later build changes that
 * level's trio: the count remains authoritative, while unmatched species are
 * shown as earlier-version friends until a new run refreshes the record.
 */
export function getStoryRescueRecordDisplay(
  storySpecies: readonly AnimalSpecies[],
  rescuedCount: number,
  documentedSpecies: readonly AnimalSpecies[],
): StoryRescueRecordDisplay {
  const currentSpecies = new Set(storySpecies);
  const documentedStorySpecies = [...new Set(documentedSpecies)]
    .filter((species) => currentSpecies.has(species));

  return {
    documentedStorySpecies,
    hasUnknownRescues: rescuedCount > documentedStorySpecies.length,
  };
}
