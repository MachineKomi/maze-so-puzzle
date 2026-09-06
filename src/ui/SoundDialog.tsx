import { useEffect, useRef, useState } from "react";
import type { MusicTransportPort } from "../musicTransport";
import { musicTrackById } from "../musicCatalogue";
import { usePresentation } from "./PresentationProvider";
import { DialogShell } from "./dialogs/DialogShell";
import { testSoundFromUserGesture } from "../sound";
import { musicGain, musicPosition, sfxGain, sfxPosition } from "../audioCalibration";

const PACE_VALUES = ["chill", "regular", "zippy"] as const;
const PACE_LABELS = { chill: "Chill", regular: "Regular", zippy: "Zippy" } as const;

export function SoundDialog({ transport, onClose, returnFocus }: { transport: MusicTransportPort; onClose: () => void; returnFocus: HTMLElement | null }) {
  const [snapshot, setSnapshot] = useState(() => transport.getSnapshot());
  const presentation = usePresentation();
  const testRequest = useRef<AbortController | null>(null);
  useEffect(() => () => testRequest.current?.abort(), []);
  useEffect(() => transport.subscribe(setSnapshot), [transport]);
  const act = (action: () => unknown) => { action(); void transport.startFromUserGesture(); };
  return <DialogShell title="Sound & comfort" onClose={onClose} returnFocus={returnFocus} footer={<button className="primary-button" onClick={onClose}>Back to the adventure</button>}>
    <div className="sound-layout">
    <section className="sound-player" aria-label="Music controls">
    <p className="sound-track">{musicTrackById(snapshot.currentTrackId)?.id.replaceAll("-", " ") ?? "Maze music"}</p>
    <div className="sound-controls" data-focus-group="sound">
      <button data-focus-id="sound:mute" aria-pressed={snapshot.muted} onClick={() => act(() => transport.setMuted(!snapshot.muted))}>{snapshot.muted ? "Unmute" : "Mute"}</button>
      <button data-focus-id="sound:previous" disabled={!snapshot.canPrevious} onClick={() => act(() => transport.previous())}>Previous</button>
      <button data-focus-id="sound:next" disabled={!snapshot.canNext} onClick={() => act(() => transport.next())}>Next track</button>
      <button data-focus-id="sound:shuffle" disabled={!snapshot.canShuffle} onClick={() => act(() => transport.shuffle())}>Shuffle</button>
    </div>
    <div className="sound-levels">
      {(["musicVolume", "sfxVolume"] as const).map(channel => {
        const music = channel === "musicVolume";
        const percent = Math.round((music ? musicPosition : sfxPosition)(presentation.preferences[channel]) * 100);
        return <label key={channel} htmlFor={music ? "music-volume" : "sfx-volume"}>
          <span>{music ? "Music" : "Sound effects"} <output aria-hidden="true">{percent}%</output></span>
          <input id={music ? "music-volume" : "sfx-volume"} type="range" min="0" max="100" step="1" data-focus-id={`sound:${channel}`} value={percent} aria-valuetext={`${percent} percent`} onChange={event => presentation.update({ [channel]: (music ? musicGain : sfxGain)(Number(event.currentTarget.value) / 100) })} />
        </label>;
      })}
      <button type="button" data-focus-id="sound:test" disabled={snapshot.muted || presentation.preferences.sfxVolume === 0} onClick={() => {
        testRequest.current?.abort(); testRequest.current = new AbortController();
        void testSoundFromUserGesture(snapshot.muted, testRequest.current.signal);
      }}>Test sound</button>
    </div>
    <p className="sound-persistence">Very high Music and Sound effects together may distort; lower either if you hear it.</p>
    </section>
    <fieldset><legend>Motion</legend><div className="preference-options">{(["system", "full", "reduced"] as const).map(value => <label key={value}><input type="radio" name="motion" value={value} checked={presentation.preferences.motion === value} onChange={() => presentation.update({ motion: value })} />{value === "system" ? "Use device setting" : value === "full" ? "Full" : "Reduced"}</label>)}</div></fieldset>
    <fieldset><legend>Surface quality</legend><div className="preference-options">{(["full", "lite", "static"] as const).map(value => <label key={value}><input type="radio" name="quality" value={value} checked={presentation.preferences.quality === value} onChange={() => presentation.update({ quality: value })} />{value}</label>)}</div></fieldset>
    <fieldset><legend>Movement pace</legend><button type="button" data-focus-id="comfort:pace" aria-label={`Movement pace: ${PACE_LABELS[presentation.preferences.pace]}. Change pace`} onClick={() => { const index=PACE_VALUES.indexOf(presentation.preferences.pace); presentation.update({pace:PACE_VALUES[(index+1)%PACE_VALUES.length]!}); }}>{PACE_LABELS[presentation.preferences.pace]} <span aria-hidden="true">→</span></button></fieldset>
    <p className="sound-persistence">These comfort settings stay when you reset your adventure.</p>
    {presentation.saveFailed && <p role="alert">This device could not save comfort settings. They still apply while the game is open.</p>}
    </div>
  </DialogShell>;
}
