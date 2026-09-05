import { useState, type ReactNode } from "react";
import { DialogShell } from "./DialogShell";
import { PresentationArt } from "../CatalogueImage";

export interface DialogueTurn { readonly id: string; readonly speaker: string; readonly portrait: string; readonly line: ReactNode }
export function StoryDialog({ title, turns, onBegin, returnFocus, learning }: {
  title: string; turns: readonly DialogueTurn[]; onBegin: () => void; returnFocus?: HTMLElement | null; learning?: ReactNode;
}) {
  const [index, setIndex] = useState(0);
  const turn = turns[index];
  const final = index >= turns.length - 1;
  return <DialogShell title={title} variant="story" onClose={onBegin} returnFocus={returnFocus}
    footer={<div className="modal-actions"><button className="primary-button" data-focus-id="story-advance" onClick={() => final ? onBegin() : setIndex(index + 1)}>{final ? "Start the maze" : "Next"}</button><button data-focus-id="story-skip" onClick={onBegin}>Skip story</button></div>}>
    {turn && <div className="story-body" aria-live="polite" aria-atomic="true"><div className="story-speaker"><PresentationArt art={turn.portrait} label={turn.speaker} /><strong>{turn.speaker}</strong></div><div className="story-copy" data-turn-id={turn.id}>{turn.line}</div></div>}
    {learning}
    {turns.length > 1 && <p className="dialog-progress">{index + 1} of {turns.length}</p>}
  </DialogShell>;
}
