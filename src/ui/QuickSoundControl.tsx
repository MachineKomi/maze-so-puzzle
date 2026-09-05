import { ASSETS } from "../assets";
import { CatalogueImage } from "./CatalogueImage";

export interface QuickSoundControlProps {
  readonly muted: boolean;
  readonly onToggleMuted?: () => void;
  readonly onOpenSettings: () => void;
  readonly className?: string;
}

/** The existing audio authority supplies both state and actions; this control owns neither. */
export function QuickSoundControl({ muted, onToggleMuted, onOpenSettings, className = "" }: QuickSoundControlProps) {
  const toggleLabel = muted ? "Unmute sound" : "Mute sound";
  return <div className={`quick-sound-control ${className}`.trim()} role="group" aria-label="Sound controls">
    {onToggleMuted && <button type="button" className="quick-sound-toggle" data-muted={muted || undefined} data-focus-id="sound:quick-toggle" aria-label={toggleLabel} title={toggleLabel} onClick={onToggleMuted} style={{ minWidth: 44, minHeight: 44 }}>
      <CatalogueImage src={muted ? ASSETS.navMuted : ASSETS.navSound} alt="" displayPx={40} />
    </button>}
    <button type="button" className="quick-sound-settings" data-focus-id="sound:settings" aria-label="Open Sound and comfort" aria-haspopup="dialog" title="Sound and comfort" onClick={onOpenSettings} style={{ minWidth: 44, minHeight: 44 }}>
      {onToggleMuted ? <svg className="sound-settings-mark" viewBox="0 0 28 28" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden="true" focusable="false">
        <path d="M6 4v5m0 6v9M14 4v12m0 6v2M22 4v2m0 6v12" />
        <circle cx="6" cy="12" r="3" /><circle cx="14" cy="19" r="3" /><circle cx="22" cy="9" r="3" />
      </svg> : <CatalogueImage src={muted ? ASSETS.navMuted : ASSETS.navSound} alt="" displayPx={40} />}
    </button>
  </div>;
}
