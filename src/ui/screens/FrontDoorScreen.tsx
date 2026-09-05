import { useState } from "react";
import { ASSETS } from "../../assets";
import { playSound } from "../../sound";
import { CatalogueImage } from "../CatalogueImage";
import { BUILD_VERSION } from "../version";

interface FrontDoorScreenProps {
  readonly blocked: boolean;
  readonly playRef: React.RefObject<HTMLButtonElement | null>;
  readonly muted: boolean;
  readonly onPlay: () => void;
}

export function FrontDoorScreen({ playRef, muted, onPlay, blocked }: FrontDoorScreenProps) {
  const [exitNotice, setExitNotice] = useState(false);

  const requestExit = () => {
    playSound("menu", muted);
    window.close();
    window.setTimeout(() => setExitNotice(true), 180);
  };

  return (
    <section className="front-door-screen" aria-labelledby="front-door-title" inert={blocked || undefined} aria-hidden={blocked || undefined}>
      <CatalogueImage
        className="front-door-background"
        src={ASSETS.titleIntroBackground}
        alt=""
        aria-hidden="true"
        decoding="async"
        fetchPriority="high"
      />
      <div className="front-door-shade" aria-hidden="true" />
      <div className="front-door-content">
        <h1 id="front-door-title" className="sr-only">Maze so Puzzle</h1>
        <CatalogueImage
          className="front-door-logo"
          src={ASSETS.gameLogo}
          fallbackSrc={ASSETS.gameLogoFallback}
          srcSet={`${ASSETS.gameLogoCompact} 512w, ${ASSETS.gameLogo} 1024w`}
          sizes="(max-width: 760px) 58vw, 43vw"
          alt=""
          aria-hidden="true"
          decoding="async"
        />
        <div className="front-door-actions">
          <button ref={playRef} className="front-door-play" onClick={onPlay}>
            <CatalogueImage src={ASSETS.goal} alt="" />
            <span>Play</span>
          </button>
          <button className="front-door-exit" onClick={requestExit}>
            Exit
          </button>
        </div>
        {exitNotice && (
          <p className="front-door-exit-note" role="status">
            Your browser keeps this tab open. It is safe to close it whenever you are ready.
          </p>
        )}
      </div>
      <span className="front-door-version">v{BUILD_VERSION}</span>
    </section>
  );
}
