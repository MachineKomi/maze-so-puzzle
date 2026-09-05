import { useLayoutEffect, useRef, useState, type KeyboardEvent, type ReactNode } from "react";
import { ASSETS, STICKER_ART, MEDAL_ART, BADGE_ART } from "../../assets";
import { resolveAnimalArt, resolveEnemyArt } from "../../artCatalog";
import { FRIEND_BOOK_LORE, ENEMY_BOOK_LORE } from "../../bookLore";
import { CURATED_LEVELS } from "../../game/levels";
import { ANIMAL_SPECIES, ENEMY_STYLE_IDS, type LevelDefinition } from "../../game/types";
import { animalPersonality } from "../../game/visualPersonality";
import { hasCurrentGameplay } from "../../game/contentIdentity";
import { STICKER_LABELS, ACHIEVEMENT_LABELS, BADGE_IDS, BADGE_LABELS, type PlayerProgress } from "../../progress";
import { getStoryRescueRecordDisplay } from "../../rescueRecords";
import { storyForLevel } from "../../story";
import type { ArtDetail } from "../game/AdventureHud";
import { CatalogueImage } from "../CatalogueImage";
import { QuickSoundControl } from "../QuickSoundControl";

type DetailHandler = (detail: ArtDetail, trigger: HTMLElement) => void;
const BOOK_PAGES = [
  { id: "mazes", label: "Mazes", art: ASSETS.navMazes },
  { id: "friends", label: "Friends", art: ASSETS.rewardAnimalFriendSticker },
  // Poggle is the already-known keeper of this page; no undiscovered enemy art is fetched for its tab.
  { id: "bestiary", label: "Bestiary", art: ASSETS.storyProfessorPoggle },
  { id: "stats", label: "Stats", art: ASSETS.treasureScienceGears },
  { id: "achievements", label: "Achievements", art: ASSETS.rewardTrailSticker },
] as const;
type BookPage = (typeof BOOK_PAGES)[number]["id"];

function PageHeading({ eyebrow, title, count, children }: { eyebrow: string; title: string; count?: ReactNode; children?: ReactNode }) {
  return <div className="book-page-heading"><div><span className="book-eyebrow">{eyebrow}</span><h2>{title}</h2>{children && <p>{children}</p>}</div>{count && <span className="book-count">{count}</span>}</div>;
}

export function BookFriends({ progress, onDetail }: { progress: PlayerProgress; onDetail: DetailHandler }) {
  const classifiedRescues = ANIMAL_SPECIES.reduce((total, species) => total + progress.rescuesBySpecies[species], 0);
  const unclassifiedRescues = Math.max(0, progress.totalAnimalsRescued - classifiedRescues);
  return <>
    <PageHeading eyebrow="The friends along the way" title="Little friends, lovely stories" count={`${progress.totalAnimalsRescued} helped`}>Choose a friend to take a closer look.</PageHeading>
    <div className="book-character-grid friend-ledger-grid">
      {ANIMAL_SPECIES.map(species => {
        const art = resolveAnimalArt(species);
        const rescues = progress.rescuesBySpecies[species];
        const personality = animalPersonality(species);
        return <button key={species} className={`book-character-card book-friend-card${rescues ? " has-memory" : ""}`} data-focus-id={`book-friend:${species}`}
          onClick={event => onDetail({ art: art.src, label: art.label, description: `${personality.greeting}. ${FRIEND_BOOK_LORE[species]} ${rescues ? `${rescues} ${rescues === 1 ? "happy rescue" : "happy rescues"} recorded in Ame's Book.` : "A lovely friend to look out for on your travels."}` }, event.currentTarget)}>
          <span className="book-character-art"><CatalogueImage src={art.src} usage="field" displayPx={128} alt="" loading="lazy" /></span>
          <strong>{art.label}</strong><span className="book-character-greeting">{personality.greeting}</span>
          <span className="book-rescue-count">{rescues ? <><b>{rescues}</b> {rescues === 1 ? "happy rescue" : "happy rescues"}</> : "An adventure awaits"}</span>
        </button>;
      })}
      {unclassifiedRescues > 0 && <article className="book-character-card book-earlier-friends"><CatalogueImage src={ASSETS.rewardAnimalFriendSticker} alt="" loading="lazy" /><strong>Earlier friends</strong><p>{unclassifiedRescues} happy rescues from before the roll-call began.</p></article>}
    </div>
  </>;
}

/** Discovery is supplied by normal-play progress. Unknown identities never enter markup or image requests. */
export function BookBestiary({ discoveredEnemyIds, onDetail }: { discoveredEnemyIds: readonly string[]; onDetail: DetailHandler }) {
  const discovered = new Set(discoveredEnemyIds);
  const count = ENEMY_STYLE_IDS.filter(id => discovered.has(id)).length;
  return <>
    <PageHeading eyebrow="Poggle's field notes" title="Meet the maze guardians" count={`${count} / ${ENEMY_STYLE_IDS.length} met`}>A page for every guardian you meet on your adventures.</PageHeading>
    <div className="book-field-note"><CatalogueImage src={ASSETS.storyProfessorPoggle} alt="" /><p>Puzzlewild guardians love a friendly challenge. Find a maze weapon, then match or beat their Power to help them scoot aside.</p></div>
    <div className="book-character-grid bestiary-grid">
      {ENEMY_STYLE_IDS.map((id, index) => {
        if (!discovered.has(id)) return <article className="book-character-card book-unknown-card" key={id} aria-label={`Guardian page ${index + 1}: not met yet`}><span className="book-unknown-art" aria-hidden="true">?</span><strong>A guardian to meet</strong><span className="book-character-greeting">A new story is waiting somewhere in the Puzzlewild.</span><span className="book-rescue-count">Not met yet</span></article>;
        const art = resolveEnemyArt(id);
        return <button className="book-character-card book-guardian-card" key={id} data-focus-id={`book-guardian:${id}`} onClick={event => onDetail({ art: art.src, label: art.label, description: ENEMY_BOOK_LORE[id] }, event.currentTarget)}>
          <span className="book-character-art"><CatalogueImage src={art.src} usage="field" displayPx={128} alt="" loading="lazy" /></span><strong>{art.label}</strong><span className="book-character-greeting">{ENEMY_BOOK_LORE[id]}</span><span className="book-rescue-count">Met on an adventure</span>
        </button>;
      })}
    </div>
  </>;
}

export function BookKeepsakes({ progress, onDetail }: { progress: PlayerProgress; onDetail: DetailHandler }) {
  const collectibles = [
    ...(["first-star", "animal-friend", "surprise-sparkle"] as const).map(id => ({ id, ...STICKER_LABELS[id], art: STICKER_ART[id], owned: progress.stickers.includes(id), kind: "Sticker" })),
    ...(["perfect-rescue-5", "perfect-rescue-10", "perfect-rescue-15"] as const).map(id => ({ id, ...ACHIEVEMENT_LABELS[id], art: MEDAL_ART[id], owned: progress.medals.includes(id), kind: "Medal" })),
    ...BADGE_IDS.map(id => ({ id, ...BADGE_LABELS[id], art: BADGE_ART[id], owned: progress.badges.includes(id), kind: "Badge" })),
  ];
  return <>
    <PageHeading eyebrow="Stickers, medals and little triumphs" title="Ame's shiny collection" count={`${collectibles.filter(item => item.owned).length} / ${collectibles.length} earned`}>Every keepsake remembers something lovely you did.</PageHeading>
    <div className="badge-grid">
      {collectibles.map(item => {
        const contents = <><span className="badge-art-wrap"><CatalogueImage src={item.art} alt="" displayPx={104} loading="lazy" /></span><span className="badge-copy"><small>{item.owned ? `Earned ${item.kind}` : `${item.kind} to earn`}</small><strong>{item.label}</strong><span className="badge-description">{item.description}</span></span></>;
        return item.owned
          ? <button className="badge-card earned" key={item.id} data-focus-id={`achievement:${item.id}`} onClick={event => onDetail({ art: item.art, label: item.label, description: item.description }, event.currentTarget)}>{contents}</button>
          : <article className="badge-card locked" key={item.id} aria-label={`${item.label}. Not earned yet. ${item.description}`}>{contents}</article>;
      })}
    </div>
  </>;
}

function describeGeneratedRecord(levelId: string): string {
  const match = /-(movement|gentle|growing|adventure)-(\d+)$/.exec(levelId);
  if (match === null) return "A surprise adventure";
  const mood = match[1] === "movement" ? "First steps" : match[1] === "gentle" ? "A gentle journey" : match[1] === "growing" ? "A growing adventure" : "A grand adventure";
  const size = Number(match[2]);
  return `${mood}${Number.isFinite(size) ? ` · ${size} × ${size}` : ""}`;
}

interface AchievementsScreenProps {
  readonly onDetail: DetailHandler;
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
  readonly onToggleMuted?: () => void;
}

export function AchievementsScreen({ onDetail, progress, unlockedLevelIds, activeRun, blocked, headingRef, muted, onHome, onResume, onPlayLevel, onSurprise, onRequestReset, onToggleSound, onToggleMuted }: AchievementsScreenProps) {
  const [page, setPage] = useState<BookPage>("mazes");
  const panelRef = useRef<HTMLDivElement>(null);
  const tabRefs = useRef<Partial<Record<BookPage, HTMLButtonElement | null>>>({});
  const scrollPositions = useRef<Partial<Record<BookPage, number>>>({});
  const selectPage = (next: BookPage) => {
    if (page === next) return;
    scrollPositions.current[page] = panelRef.current?.scrollTop ?? 0;
    setPage(next);
  };
  useLayoutEffect(() => {
    if (panelRef.current) panelRef.current.scrollTop = scrollPositions.current[page] ?? 0;
  }, [page]); // Modal inertness/return must not reset the chosen page or its scroll.
  const navigateTabs = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    let nextIndex: number;
    if (event.key === "ArrowRight") nextIndex = (index + 1) % BOOK_PAGES.length;
    else if (event.key === "ArrowLeft") nextIndex = (index + BOOK_PAGES.length - 1) % BOOK_PAGES.length;
    else if (event.key === "Home") nextIndex = 0;
    else if (event.key === "End") nextIndex = BOOK_PAGES.length - 1;
    else return;
    event.preventDefault(); event.stopPropagation();
    const next = BOOK_PAGES[nextIndex]!;
    selectPage(next.id);
    tabRefs.current[next.id]?.focus({ preventScroll: true });
  };
  const solvedIds = Object.keys(progress.bestResultsByLevel);
  const surpriseResults = Object.entries(progress.bestResultsByLevel).filter(([, result]) => result.source === "generated").slice(-6).reverse();
  return <section className="achievements-screen" aria-labelledby="adventure-book-title" inert={blocked || undefined} aria-hidden={blocked || undefined}>
    <header className="book-header">
      <button className="book-back" onClick={onHome}><CatalogueImage src={ASSETS.navHome} alt="" /><span>Home</span></button>
      <div className="book-heading"><span className="book-eyebrow">Ame's keepsake shelf</span><h1 ref={headingRef} tabIndex={-1} id="adventure-book-title">Adventure Book</h1></div>
      <div className="book-header-actions">
        {activeRun && <button className="book-resume" onClick={onResume}><CatalogueImage src={ASSETS.goal} alt="" /><span>Resume</span></button>}
        <button className="book-new-maze" onClick={onSurprise}><CatalogueImage src={ASSETS.rewardSurpriseSparkleSticker} alt="" /><span>New maze</span></button>
        <QuickSoundControl className="book-sound-controls" muted={muted} onToggleMuted={onToggleMuted} onOpenSettings={onToggleSound} />
      </div>
    </header>
    <div className="book-volume">
      <div className="book-tabs" role="tablist" aria-label="Adventure Book pages">
        {BOOK_PAGES.map((tab, index) => <button key={tab.id} ref={element => { tabRefs.current[tab.id] = element; }} role="tab" id={`book-tab-${tab.id}`} aria-controls="book-page" aria-selected={page === tab.id} tabIndex={page === tab.id ? 0 : -1} data-book-tab={tab.id} onClick={() => selectPage(tab.id)} onKeyDown={event => navigateTabs(event, index)}><CatalogueImage src={tab.art} alt="" /><span>{tab.label}</span></button>)}
      </div>
      <div className="book-paper">
        <div ref={panelRef} className="book-scroll" id="book-page" role="tabpanel" aria-labelledby={`book-tab-${page}`} tabIndex={0} data-book-page={page} onScroll={event => { scrollPositions.current[page] = event.currentTarget.scrollTop; }}>
          {page === "friends" && <BookFriends progress={progress} onDetail={onDetail} />}
          {page === "bestiary" && <BookBestiary discoveredEnemyIds={progress.discoveredEnemyIds ?? []} onDetail={onDetail} />}
          {page === "achievements" && <BookKeepsakes progress={progress} onDetail={onDetail} />}
          {page === "mazes" && <>
            <PageHeading eyebrow="Follow your story" title="Paths worth remembering" count={`${CURATED_LEVELS.filter(level => solvedIds.includes(level.id)).length} / ${CURATED_LEVELS.length} cleared`}>Revisit a favourite, or find your next little adventure.</PageHeading>
            <div className="maze-record-grid">
              {CURATED_LEVELS.map((storyLevel, index) => {
                const result = progress.bestResultsByLevel[storyLevel.id];
                const currentResult = result && hasCurrentGameplay(storyLevel, result.contentRevision ?? 0, result.gameplayFingerprint ?? "") ? result : undefined;
                const locked = !unlockedLevelIds.includes(storyLevel.id);
                const rescueCount = currentResult?.bestRescuedCount ?? 0;
                const earlierBest = [result?.historicalBestSteps, !currentResult ? result?.bestSteps : undefined].filter((steps): steps is number => typeof steps === "number").reduce<number | undefined>((best, steps) => best === undefined ? steps : Math.min(best, steps), undefined);
                const storySpecies = storyLevel.objects.flatMap(object => object.kind === "animal" ? [object.species] : []);
                const { documentedStorySpecies, hasUnknownRescues } = getStoryRescueRecordDisplay(storySpecies, rescueCount, currentResult?.bestRescuedSpecies ?? []);
                const isActive = activeRun?.levelId === storyLevel.id;
                return <button className={`maze-record-card ${result ? "cleared" : "open"}${isActive ? " active-run" : ""}`} key={storyLevel.id} disabled={locked} onClick={() => isActive ? onResume() : onPlayLevel(storyLevel)}
                  aria-label={`${locked ? `Story maze ${index + 1}. Locked` : `${storyLevel.name}. ${isActive ? `Current maze, ${activeRun.steps} ${activeRun.steps === 1 ? "step" : "steps"}` : currentResult ? `Cleared on this layout, best ${currentResult.bestSteps ?? 0} steps, ${rescueCount} friends rescued${hasUnknownRescues ? ", some friend details came from an earlier version" : ""}` : result ? "Cleared on an earlier maze version; this layout has no record yet" : "Ready to play"}`}`}>
                  <span className="record-number" aria-hidden="true">{index + 1}</span>
                  <span className="record-copy"><strong>{locked ? "A mystery maze" : storyLevel.name}</strong><small>{locked ? "Keep adventuring to unlock" : isActive ? "Your current adventure" : `${storyLevel.width} × ${storyLevel.height}`}</small>{!locked && <em className="record-skill">{storyForLevel(storyLevel.id)?.puzzlePower}</em>}</span>
                  <span className="record-best">{currentResult ? <><b>{currentResult.bestSteps ?? "—"}</b><small>best {currentResult.bestSteps === 1 ? "step" : "steps"}{earlierBest !== undefined ? ` · earlier ${earlierBest}` : ""}</small></> : result ? <><b>New</b><small>layout · earlier {earlierBest ?? "—"}</small></> : locked ? <><CatalogueImage className="record-lock-art" src={ASSETS.doorBlueStar} alt="" /><small>Locked</small></> : <><b>{isActive ? "Play" : "New"}</b><small>{isActive ? "Resume" : "Ready"}</small></>}</span>
                  <span className="record-friends" aria-hidden="true">{storySpecies.map((species, friendIndex) => <CatalogueImage className={documentedStorySpecies.includes(species) ? "saved" : hasUnknownRescues ? "saved-unknown" : ""} key={`${species}-${friendIndex}`} src={resolveAnimalArt(species).src} alt="" displayPx={52} loading="lazy" />)}</span>
                </button>;
              })}
            </div>
            <section className="surprise-records" aria-labelledby="surprise-records-title"><div className="book-page-heading"><div><span className="book-eyebrow">The surprise scrapbook</span><h2 id="surprise-records-title">Little adventures, lovely memories</h2></div><span className="book-count">{progress.generatedMazesCompleted} remembered</span></div>
              <div className="surprise-explainer"><CatalogueImage className="surprise-explainer-star" src={ASSETS.rewardSurpriseSparkleSticker} alt="" /><div><strong>{surpriseResults.length ? "There's always another path to discover." : "Your first surprise is waiting."}</strong><p>{surpriseResults.length ? "Here are a few lovely memories from your surprise adventures." : "Solve a Surprise Maze and keep a little memory of it here."}</p></div><button onClick={onSurprise}>Make a Surprise Maze <span aria-hidden="true">→</span></button></div>
              {surpriseResults.length > 0 && <div className="surprise-record-grid" aria-label="Recorded Surprise Maze memories">{surpriseResults.map(([levelId, result], index) => <article key={levelId}><CatalogueImage src={index === 0 ? ASSETS.rewardTrailSticker : ASSETS.rewardSurpriseSparkleSticker} alt="" /><div><strong>Surprise memory</strong><small>{describeGeneratedRecord(levelId)}</small></div><span><b>{result.bestSteps ?? "—"}</b><small>best steps</small></span><span><b>{result.bestRescuedCount}/{result.totalRescueCount}</b><small>friends</small></span></article>)}</div>}
            </section>
          </>}
          {page === "stats" && <>
            <PageHeading eyebrow="Look how far you've come" title="Your adventure in little wonders">Every star and every homecoming has a place in the Book.</PageHeading>
            <div className="book-stats" aria-label="Adventure totals">{[
              { art: ASSETS.goal, value: progress.totalMazesCompleted, label: "Mazes solved" },
              { art: ASSETS.coinPouch, value: progress.gold, label: "Gold stars" },
              { art: ASSETS.treasureScienceGears, value: progress.sciencePoints, label: "Science" },
              { art: ASSETS.rewardAnimalFriendSticker, value: progress.totalAnimalsRescued, label: "Friends helped" },
              { art: ASSETS.rewardHelpingPawMedal, value: progress.perfectRescueMazeCount, label: "Perfect rescues" },
              { art: ASSETS.rewardTrailSticker, value: progress.totalCompletions, label: "Happy finishes" },
              { art: ASSETS.rewardSurpriseSparkleSticker, value: progress.generatedMazesCompleted, label: "Surprise mazes" },
            ].map(stat => <article key={stat.label}><CatalogueImage src={stat.art} alt="" displayPx={88} /><span><b>{stat.value}</b><strong>{stat.label}</strong></span></article>)}</div>
            <section className="book-new-beginning" aria-labelledby="reset-progress-title"><div><span className="book-eyebrow">A new beginning</span><h2 id="reset-progress-title">Begin the story again</h2><p>Starting over clears the adventure and its keepsakes. You can review this choice before anything changes.</p></div><button onClick={event => onRequestReset(event.currentTarget)}><CatalogueImage src={ASSETS.navRestart} alt="" /> Reset progress</button></section>
          </>}
        </div>
      </div>
    </div>
  </section>;
}
