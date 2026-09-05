import { useEffect, useState } from "react";
import type { MusicTransportPort } from "../musicTransport";
import { musicTrackById } from "../musicCatalogue";
import { usePresentation } from "./PresentationProvider";
import { DialogShell } from "./dialogs/DialogShell";

export function SoundDialog({ transport, onClose, returnFocus }: { transport: MusicTransportPort; onClose: () => void; returnFocus: HTMLElement | null }) {
  const [snapshot, setSnapshot] = useState(() => transport.getSnapshot());
  const presentation = usePresentation();
  useEffect(() => transport.subscribe(setSnapshot), [transport]);
  const act = (action: () => unknown) => { action(); void transport.startFromUserGesture(); };
  return <DialogShell title="Sound & comfort" onClose={onClose} returnFocus={returnFocus} footer={<button className="primary-button" onClick={onClose}>Back to the adventure</button>}>
    <p className="sound-track">{musicTrackById(snapshot.currentTrackId)?.id.replaceAll("-", " ") ?? "Maze music"}</p>
    <div className="sound-controls" data-focus-group="sound">
      <button data-focus-id="sound:mute" aria-pressed={snapshot.muted} onClick={() => act(() => transport.setMuted(!snapshot.muted))}>{snapshot.muted ? "Unmute" : "Mute"}</button>
      <button data-focus-id="sound:previous" disabled={!snapshot.canPrevious} onClick={() => act(() => transport.previous())}>Previous</button>
      <button data-focus-id="sound:next" disabled={!snapshot.canNext} onClick={() => act(() => transport.next())}>Next track</button>
      <button data-focus-id="sound:shuffle" disabled={!snapshot.canShuffle} onClick={() => act(() => transport.shuffle())}>Shuffle</button>
    </div>
    <fieldset><legend>Motion</legend><div className="preference-options">{(["system", "full", "reduced"] as const).map(value => <label key={value}><input type="radio" name="motion" value={value} checked={presentation.preferences.motion === value} onChange={() => presentation.update({ motion: value })} />{value === "system" ? "Use device setting" : value === "full" ? "Full" : "Reduced"}</label>)}</div></fieldset>
    <fieldset><legend>Surface quality</legend><div className="preference-options">{(["full", "lite", "static"] as const).map(value => <label key={value}><input type="radio" name="quality" value={value} checked={presentation.preferences.quality === value} onChange={() => presentation.update({ quality: value })} />{value}</label>)}</div></fieldset>
    <p>These comfort settings stay when you reset your adventure.</p>
    {presentation.saveFailed && <p role="alert">This device could not save comfort settings. They still apply while the game is open.</p>}
  </DialogShell>;
}
