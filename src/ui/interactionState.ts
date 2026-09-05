/** UI-owned surface truth, not the future Plan 08 semantic input policy. */
export type UiScreen = "front-door" | "title" | "game" | "achievements";
export type UiOverlay = "reset" | "tester" | "maze-picker" | "switch" | "story" | "help" | "hint" | "blocker" | "too-strong" | "completion" | "lost" | "sound" | "detail" | "more";
export interface UiInteractionState {
  readonly screen: UiScreen;
  readonly topOverlay: UiOverlay | null;
}
export function getCurrentInputBlock(ui: UiInteractionState) {
  const backgroundInert = ui.topOverlay !== null;
  return {
    gameplayInputAllowed: ui.screen === "game" && !backgroundInert,
    backgroundInert,
    topLayer: ui.topOverlay,
    clearHeldInput: ui.screen !== "game" || backgroundInert,
  } as const;
}
