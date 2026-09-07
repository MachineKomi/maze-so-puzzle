import { adventureProgress, COMPLETION_XP } from "../game/adventureXp";
import { XP_CRYSTAL_SRC } from "../vfx/rewardGlyphs";

export function AdventureLevel({ xp, previousXp, collected = 0, temporary = false }: {
  xp: number; previousXp?: number; collected?: number; temporary?: boolean;
}) {
  const progress = adventureProgress(xp), preview = previousXp !== undefined;
  const old = adventureProgress(previousXp ?? xp), levelUp = preview && progress.level > old.level;
  return <section className={`adventure-level${levelUp ? " adventure-level-up" : ""}`} aria-label={preview ? "Adventure XP preview" : "Saved Adventure Level"} data-adventure-level={progress.level} data-adventure-xp={progress.xp}>
    <img src={XP_CRYSTAL_SRC} width={64} height={64} alt="" decoding="async" />
    <div className="adventure-level-copy">
      <small>{levelUp ? `Level up! ${old.level} → ${progress.level}` : preview ? "A little more adventure" : "Your adventures, remembered"}</small>
      <strong>Adventure Level {progress.level}</strong>
      <progress max={progress.max ? 1 : progress.needed} value={progress.max ? 1 : progress.earned} aria-label={progress.max ? "Highest Adventure Level reached" : `${progress.earned} of ${progress.needed} XP towards Adventure Level ${progress.level+1}`} />
      <span>{progress.max ? "Highest Adventure Level reached" : `${progress.earned} / ${progress.needed} XP to Level ${progress.level+1}`}</span>
      {preview ? <p>{temporary ? "Temporary adventure — XP will not be saved." : `Ready to save +${progress.xp-old.xp} XP when you move on.`} Collected {collected} · Maze solved +{COMPLETION_XP}{progress.max ? " · Level cap reached" : ""}</p>
        : <p>Collect rainbow crystals and finish mazes. Adventure Level celebrates your journey; puzzle Power stays separate.</p>}
    </div>
  </section>;
}
