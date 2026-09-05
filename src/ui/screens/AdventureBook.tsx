import { useState } from "react";
import { ASSETS, STICKER_ART, MEDAL_ART, BADGE_ART } from "../../assets";
import { resolveAnimalArt } from "../../artCatalog";
import { CURATED_LEVELS } from "../../game/levels";
import { ANIMAL_SPECIES, type LevelDefinition } from "../../game/types";
import { hasCurrentGameplay } from "../../game/contentIdentity";
import { STICKER_LABELS, ACHIEVEMENT_LABELS, BADGE_IDS, BADGE_LABELS, type PlayerProgress } from "../../progress";
import { getStoryRescueRecordDisplay } from "../../rescueRecords";
import { storyForLevel } from "../../story";
import type { ArtDetail } from "../game/AdventureHud";
import { CatalogueImage } from "../CatalogueImage";

function describeGeneratedRecord(levelId: string): string {
  const match = /-(movement|gentle|growing|adventure)-(\d+)$/.exec(levelId);
  if (match === null) return "Procedural maze";
  const difficulty = match[1] ?? "surprise";
  const size = Number(match[2]);
  return `${Number.isFinite(size) ? `${size} × ${size} · ` : ""}${difficulty[0]?.toUpperCase()}${difficulty.slice(1)}`;
}

interface AchievementsScreenProps {
  readonly onDetail: (detail: ArtDetail, trigger: HTMLElement) => void;
  readonly progress: PlayerProgress;
  readonly unlockedLevelIds: readonly string[];
  readonly activeRun: { readonly levelId: string; readonly name: string; readonly steps: number } | null;
  readonly blocked: boolean;
  readonly headingRef: React.RefObject<HTMLHeadingElement | null>;
  readonly muted: boolean;
  readonly onHome: () => void;
  readonly onResume: () => void;
  readonly onPlayLevel: (level: LevelDefinition) => void;
  readonly onSurprise: () => void;
  readonly onRequestReset: (trigger: HTMLElement) => void;
  readonly onToggleSound: () => void;
}

export function AchievementsScreen({
  onDetail,
  progress,
  unlockedLevelIds,
  activeRun,
  blocked,
  headingRef,
  muted,
  onHome,
  onResume,
  onPlayLevel,
  onSurprise,
  onRequestReset,
  onToggleSound,
}: AchievementsScreenProps) {
  const [friendLedgerMode, setFriendLedgerMode] = useState<"default" | "expanded" | "collapsed">("default");
  const solvedIds = Object.keys(progress.bestResultsByLevel);
  const classifiedRescues = ANIMAL_SPECIES.reduce(
    (total, species) => total + progress.rescuesBySpecies[species],
    0,
  );
  const unclassifiedRescues = Math.max(0, progress.totalAnimalsRescued - classifiedRescues);
  const surpriseResults = Object.entries(progress.bestResultsByLevel)
    .filter(([, result]) => result.source === "generated");
  const recentSurpriseResults = surpriseResults.slice(-6).reverse();
  const collectibles = [
    ...(["first-star", "animal-friend", "surprise-sparkle"] as const).map((id) => ({
      id,
      label: STICKER_LABELS[id].label,
      description: STICKER_LABELS[id].description,
      art: STICKER_ART[id],
      owned: progress.stickers.includes(id),
      kind: "Sticker",
    })),
    ...(["perfect-rescue-5", "perfect-rescue-10", "perfect-rescue-15"] as const).map((id) => ({
      id,
      label: ACHIEVEMENT_LABELS[id].label,
      description: ACHIEVEMENT_LABELS[id].description,
      art: MEDAL_ART[id],
      owned: progress.medals.includes(id),
      kind: "Medal",
    })),
    ...BADGE_IDS.map((id) => ({
      id,
      label: BADGE_LABELS[id].label,
      description: BADGE_LABELS[id].description,
      art: BADGE_ART[id],
      owned: progress.badges.includes(id),
      kind: "Badge",
    })),
  ];

  return (
    <section className="achievements-screen" aria-labelledby="adventure-book-title" inert={blocked ? true : undefined} aria-hidden={blocked || undefined}>
      <div className="book-sparkles" aria-hidden="true">✦　·　✧　·　✦</div>
      <header className="book-header">
        <button className="book-back" onClick={onHome}><span aria-hidden="true">←</span> Home</button>
        <div>
          <span>Ame's keepsake shelf</span>
          <h1 ref={headingRef} tabIndex={-1} id="adventure-book-title">Adventure Book</h1>
          <p>Every star, stamp, and friend from the journey.</p>
        </div>
        <div className="book-header-actions">
          <button aria-label="Open Sound and comfort" aria-pressed={!muted} onClick={onToggleSound}><CatalogueImage src={muted ? ASSETS.navMuted : ASSETS.navSound} alt="" /></button>
          {activeRun && <button className="book-resume" onClick={onResume}><CatalogueImage src={ASSETS.goal} alt="" /> Resume</button>}
          <button onClick={onSurprise}><CatalogueImage src={ASSETS.rewardSurpriseSparkleSticker} alt="" /> New maze</button>
        </div>
      </header>

      <div className="book-scroll" role="region" aria-label="Adventure book pages" tabIndex={0}>
        <section className="book-stats" aria-label="Adventure totals">
          <article><CatalogueImage src={ASSETS.goal} alt="" /><span><b>{progress.totalMazesCompleted}</b><small>mazes solved</small></span></article>
          <article><CatalogueImage src={ASSETS.coinPouch} alt="" /><span><b>{progress.gold}</b><small>gold stars</small></span></article>
          <article><CatalogueImage src={ASSETS.rewardAnimalFriendSticker} alt="" /><span><b>{progress.totalAnimalsRescued}</b><small>friends helped</small></span></article>
          <article><CatalogueImage src={ASSETS.rewardHelpingPawMedal} alt="" /><span><b>{progress.perfectRescueMazeCount}</b><small>perfect rescues</small></span></article>
          <article><CatalogueImage src={ASSETS.rewardTrailSticker} alt="" /><span><b>{progress.totalCompletions}</b><small>happy finishes</small></span></article>
          <article><CatalogueImage src={ASSETS.rewardSurpriseSparkleSticker} alt="" /><span><b>{progress.generatedMazesCompleted}</b><small>surprise stars</small></span></article>
        </section>

        <section className="friend-ledger" aria-labelledby="friend-ledger-title">
          <div className="book-section-heading">
            <div><span>Rescue roll-call</span><h2 id="friend-ledger-title">Little friends helped</h2></div>
            <div className="friend-ledger-tools">
              <b>{progress.totalAnimalsRescued} total</b>
              <div className="friend-ledger-view-buttons" aria-label="Friend section size">
                <button
                  className={friendLedgerMode === "expanded" ? "active" : ""}
                  type="button"
                  aria-pressed={friendLedgerMode === "expanded"}
                  onClick={() => setFriendLedgerMode("expanded")}
                >Expand</button>
                <button
                  className={friendLedgerMode === "default" ? "active" : ""}
                  type="button"
                  aria-pressed={friendLedgerMode === "default"}
                  onClick={() => setFriendLedgerMode("default")}
                >Default</button>
                <button
                  className={friendLedgerMode === "collapsed" ? "active" : ""}
                  type="button"
                  aria-pressed={friendLedgerMode === "collapsed"}
                  onClick={() => setFriendLedgerMode("collapsed")}
                >Collapse</button>
              </div>
            </div>
          </div>
          <div
            id="friend-ledger-content"
            className={`friend-ledger-viewport friend-ledger-${friendLedgerMode}`}
            hidden={friendLedgerMode === "collapsed"}
          >
          <div className="friend-ledger-grid">
            {ANIMAL_SPECIES.map((species) => (
              <article key={species}>
                <CatalogueImage src={resolveAnimalArt(species).src} alt="" loading="lazy" decoding="async" />
                <span><strong>{resolveAnimalArt(species).label}</strong><b>{progress.rescuesBySpecies[species]}</b><small>recorded rescues</small></span>
              </article>
            ))}
            {unclassifiedRescues > 0 && (
              <article className="past-rescues"><CatalogueImage src={ASSETS.rewardAnimalFriendSticker} alt="" /><span><strong>Earlier friends</strong><b>{unclassifiedRescues}</b><small>before the roll-call began</small></span></article>
            )}
          </div>
          </div>
        </section>

        <section className="badge-shelf" aria-labelledby="badge-shelf-title">
          <div className="book-section-heading"><div><span>Sticker, medal and badge shelf</span><h2 id="badge-shelf-title">Ame's shiny collection</h2></div><b>{collectibles.filter((item) => item.owned).length}/{collectibles.length}</b></div>
          <div className="badge-grid">
            {collectibles.map((item) => (
              <button className={`badge-card ${item.owned ? "earned" : "locked"}`} key={item.id} disabled={!item.owned}
                data-focus-id={`achievement:${item.id}`}
                onClick={event => onDetail({ art: item.art, label: item.label, description: item.description }, event.currentTarget)}>
                <div className="badge-art-wrap">{item.owned ? <CatalogueImage src={item.art} alt="" loading="lazy" /> : <span className="locked-keepsake" aria-hidden="true">?</span>}</div>
                <div><small>{item.owned ? `Earned ${item.kind}` : `Locked ${item.kind}`}</small><strong>{item.owned ? item.label : "A mystery keepsake"}</strong><p>{item.owned ? item.description : "Keep adventuring to discover it."}</p></div>
              </button>
            ))}
          </div>
        </section>

        <section className="maze-records" aria-labelledby="maze-records-title">
          <div className="book-section-heading"><div><span>Story map</span><h2 id="maze-records-title">Maze records</h2></div><b>{CURATED_LEVELS.filter((item) => solvedIds.includes(item.id)).length}/{CURATED_LEVELS.length} cleared</b></div>
          <div className="maze-record-grid">
            {CURATED_LEVELS.map((storyLevel, index) => {
              const result = progress.bestResultsByLevel[storyLevel.id];
              const currentResult = result && hasCurrentGameplay(
                storyLevel,
                result.contentRevision ?? 0,
                result.gameplayFingerprint ?? "",
              ) ? result : undefined;
              const locked = !unlockedLevelIds.includes(storyLevel.id);
              const rescueCount = currentResult?.bestRescuedCount ?? 0;
              const documentedSpecies = currentResult?.bestRescuedSpecies ?? [];
              const earlierBest = [
                result?.historicalBestSteps,
                !currentResult ? result?.bestSteps : undefined,
              ].filter((steps): steps is number => typeof steps === "number")
                .reduce<number | undefined>((best, steps) => best === undefined ? steps : Math.min(best, steps), undefined);
              const storySpecies = storyLevel.objects.flatMap((object) => (
                object.kind === "animal" ? [object.species] : []
              ));
              const { documentedStorySpecies, hasUnknownRescues } = getStoryRescueRecordDisplay(
                storySpecies,
                rescueCount,
                documentedSpecies,
              );
              const isActive = activeRun?.levelId === storyLevel.id;
              return (
                <button
                  className={`maze-record-card ${result ? "cleared" : "open"}${isActive ? " active-run" : ""}`}
                  key={storyLevel.id}
                  disabled={locked}
                  onClick={() => isActive ? onResume() : onPlayLevel(storyLevel)}
                  aria-label={`${storyLevel.name}. ${locked ? "Locked" : isActive ? `Current maze, ${activeRun.steps} ${activeRun.steps === 1 ? "step" : "steps"}` : currentResult ? `Cleared on this layout, best ${currentResult.bestSteps ?? 0} steps, ${rescueCount} friends rescued${hasUnknownRescues ? ", some friend details came from an earlier version" : ""}` : result ? "Cleared on an earlier maze version; this layout has no record yet" : "Ready to play"}`}
                >
                  <span className="record-number">{locked ? "◆" : isActive ? "▶" : index + 1}</span>
                  <span className="record-copy">
                    <strong>{locked ? "A mystery maze" : storyLevel.name}</strong>
                    <small>{locked ? "Keep adventuring to unlock" : isActive ? "Current maze · tap to resume" : `${storyLevel.width} × ${storyLevel.height}`}</small>
                    {!locked && <em className="record-skill">{storyForLevel(storyLevel.id)?.puzzlePower}</em>}
                  </span>
                  <span className="record-best">{currentResult
                    ? <><b>{currentResult.bestSteps ?? "—"}</b><small>best {currentResult.bestSteps === 1 ? "step" : "steps"}{earlierBest !== undefined && earlierBest !== null ? ` · earlier ${earlierBest}` : ""}</small></>
                    : result
                      ? <><b>New</b><small>layout · earlier {earlierBest ?? "—"}</small></>
                      : locked
                        ? <><CatalogueImage className="record-lock-art" src={ASSETS.doorBlueStar} alt="" /><small>locked</small></>
                        : <><b>New</b><small>ready</small></>}</span>
                  <span className="record-friends" aria-hidden="true">
                    {storySpecies.map((species) => (
                      <CatalogueImage
                        className={documentedStorySpecies.includes(species) ? "saved" : hasUnknownRescues ? "saved-unknown" : ""}
                        key={species}
                        src={resolveAnimalArt(species).src}
                        alt=""
                        loading="lazy"
                        decoding="async"
                      />
                    ))}
                  </span>
                </button>
              );
            })}
          </div>
        </section>

        <section className="surprise-records" aria-labelledby="surprise-records-title">
          <div className="book-section-heading">
            <div><span>Procedural scrapbook</span><h2 id="surprise-records-title">Surprise Maze memories</h2></div>
            <b>{progress.generatedMazesCompleted} unique</b>
          </div>
          <div className="surprise-explainer">
            <CatalogueImage className="surprise-explainer-star" src={ASSETS.rewardSurpriseSparkleSticker} alt="" />
            <div>
              <strong>Freshly made, not a hidden fixed list</strong>
              <p>Surprise Mazes are generated from a new seed, so there can always be another one. The Book remembers completed adventures while the button makes a fresh puzzle.</p>
            </div>
            <button onClick={onSurprise}>Make a Surprise Maze</button>
          </div>
          {recentSurpriseResults.length > 0 && (
            <div className="surprise-record-grid" aria-label="Recent completed Surprise Maze records">
              {recentSurpriseResults.map(([levelId, result], index) => (
                <article key={levelId}>
                  <CatalogueImage src={index === 0 ? ASSETS.rewardTrailSticker : ASSETS.rewardSurpriseSparkleSticker} alt="" />
                  <div><strong>Surprise memory</strong><small>{describeGeneratedRecord(levelId)}</small></div>
                  <div><b>{result.bestSteps ?? "—"}</b><small>best steps</small></div>
                  <div><b>{result.bestRescuedCount}/{result.totalRescueCount}</b><small>friends</small></div>
                </article>
              ))}
            </div>
          )}
        </section>

        <section className="maze-records" aria-labelledby="reset-progress-title">
          <div className="book-section-heading">
            <div><span>New beginning</span><h2 id="reset-progress-title">Reset the adventure</h2></div>
            <button className="secondary-button" onClick={(event) => onRequestReset(event.currentTarget)}><CatalogueImage src={ASSETS.navRestart} alt="" /> Reset progress</button>
          </div>
        </section>
      </div>
    </section>
  );
}
