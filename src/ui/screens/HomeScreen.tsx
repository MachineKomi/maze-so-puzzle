import type { CSSProperties } from "react";
import { ASSETS } from "../../assets";
import { CURATED_LEVELS } from "../../game/levels";
import type { PlayerProgress } from "../../progress";
import { getNextStoryIndex } from "../../navigation";
import { CatalogueImage } from "../CatalogueImage";
import { BUILD_VERSION } from "../version";

interface TitleScreenProps {
  readonly progress: PlayerProgress;
  readonly updatedMazeRestarted: boolean;
  readonly activeRun: { readonly name: string; readonly steps: number } | null;
  readonly blocked: boolean;
  readonly muted: boolean;
  readonly playRef: React.RefObject<HTMLButtonElement | null>;
  readonly onPlay: () => void;
  readonly onSurprise: () => void;
  readonly onAchievements: () => void;
  readonly onChooseMaze: (trigger: HTMLElement) => void;
  readonly onRequestReset: (trigger: HTMLElement) => void;
  readonly onOpenTester: () => void;
  readonly onToggleSound: () => void;
}

export function TitleScreen({
  progress,
  updatedMazeRestarted,
  activeRun,
  blocked,
  muted,
  playRef,
  onPlay,
  onSurprise,
  onAchievements,
  onChooseMaze,
  onRequestReset,
  onOpenTester,
  onToggleSound,
}: TitleScreenProps) {
  const solvedIds = Object.keys(progress.bestResultsByLevel);
  const storySolved = CURATED_LEVELS.filter((level) => solvedIds.includes(level.id)).length;
  const hasProgress = solvedIds.length > 0 || progress.gold > 0 || progress.sciencePoints > 0 || progress.unlockedLevelCount > 1;
  const nextStoryNumber = getNextStoryIndex(progress, CURATED_LEVELS.map((storyLevel) => storyLevel.id)) + 1;

  return (
    <section className="title-screen" aria-labelledby="game-title" inert={blocked ? true : undefined} aria-hidden={blocked || undefined}>
      <CatalogueImage
        className="title-background"
        src={ASSETS.titleBackground}
        alt=""
        aria-hidden="true"
        decoding="async"
        fetchPriority="high"
        fallbackSrc={ASSETS.titleBackgroundFallback}
      />
      <CatalogueImage
        className="title-logo"
        src={ASSETS.gameLogo}
        srcSet={`${ASSETS.gameLogoCompact} 512w, ${ASSETS.gameLogo} 1024w`}
        sizes="(max-width: 640px) 33vw, 35vw"
        alt=""
        aria-hidden="true"
        decoding="async"
        fallbackSrc={ASSETS.gameLogoFallback}
      />
      <CatalogueImage
        className="title-hero"
        src={ASSETS.homeHeroSplash}
        alt=""
        aria-hidden="true"
        decoding="async"
        fallbackSrc={ASSETS.homeHeroSplashFallback}
      />
      <div className="title-fireflies" aria-hidden="true">
        {Array.from({ length: 12 }, (_, index) => (
          <i
            key={index}
            style={{
              "--firefly-x": `${7 + index * 7.2}%`,
              "--firefly-y": `${8 + index * 7}%`,
              "--firefly-size": `${3 + (index % 3) * 2}px`,
              "--firefly-speed": `${3.5 + (index % 4) * 0.7}s`,
              "--firefly-delay": `${index * -0.31}s`,
            } as CSSProperties}
          />
        ))}
      </div>

      <button
        className="title-sound"
        aria-label="Open Sound and comfort"
        aria-pressed={!muted}
        onClick={onToggleSound}
      ><CatalogueImage src={muted ? ASSETS.navMuted : ASSETS.navSound} alt="" /></button>

      <div className="title-copy">
        <h1 id="game-title" className="sr-only">Maze so Puzzle</h1>
        <p className="title-welcome">Follow the paths, grow Ame's Power, and help every little friend find their way home.</p>
        {updatedMazeRestarted && (
          <p className="title-welcome" role="status">
            This maze was updated, so Ame restarted it. Your Adventure Book is safe.
          </p>
        )}

        <div className="title-actions">
          <button ref={playRef} className="title-play-button" onClick={onPlay}>
            <span aria-hidden="true"><CatalogueImage src={ASSETS.goal} alt="" /></span>
            <span>
              <strong>{activeRun || hasProgress ? "Continue" : "Begin adventure"}</strong>
              <small>{activeRun ? `${activeRun.name} · ${activeRun.steps} ${activeRun.steps === 1 ? "step" : "steps"}` : hasProgress ? `Story maze ${nextStoryNumber} awaits` : "A lovely first maze awaits"}</small>
            </span>
          </button>
          <div className="title-secondary-actions">
            <button onClick={(event) => onChooseMaze(event.currentTarget)}><CatalogueImage src={ASSETS.navMazes} alt="" /> Choose a maze</button>
            <button onClick={onAchievements}><CatalogueImage src={ASSETS.navBook} alt="" /> Ame's adventure book</button>
            <button onClick={onSurprise}><CatalogueImage src={ASSETS.rewardSurpriseSparkleSticker} alt="" /> Surprise maze</button>
            <button style={{ gridColumn: "1 / -1" }} onClick={(event) => onRequestReset(event.currentTarget)}><CatalogueImage src={ASSETS.navRestart} alt="" /> Reset progress</button>
          </div>
        </div>

        <div className="title-progress" aria-label="Saved adventure progress">
          <span><b>{storySolved}</b><small>story stars</small></span>
          <span><b>{progress.totalAnimalsRescued}</b><small>friends helped</small></span>
          <span><b>{progress.gold}</b><small>gold stars</small></span>
        </div>
      </div>

      <button
        className="title-version"
        onClick={onOpenTester}
        aria-label={`Playable build ${BUILD_VERSION}. Open the secret tester maze picker.`}
        title="Secret tester maze picker"
      >Playable build {BUILD_VERSION} <CatalogueImage src={ASSETS.navMazes} alt="" /></button>
    </section>
  );
}
