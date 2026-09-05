import { memo, useMemo } from "react";
import { ASSETS } from "../../assets";
import { pointsEqual } from "../../game/engine";
import { toTileKey, type TileKey, type CameraWindow } from "../../game/exploration";
import type { LevelDefinition, LevelObject, Point } from "../../game/types";
import { CatalogueImage } from "../CatalogueImage";
import { describeObject } from "./descriptions";

interface MiniMapProps {
  readonly level: LevelDefinition;
  readonly position: Point;
  readonly camera: CameraWindow;
  readonly revealed: ReadonlySet<TileKey>;
  readonly currentView: ReadonlySet<TileKey>;
  readonly objects: readonly LevelObject[];
  readonly newExplorer?: boolean;
  readonly compact?: boolean;
  readonly highlightedObjectId?: string | null;
}

export const MiniMap = memo(function MiniMap({
  level,
  position,
  camera,
  revealed,
  currentView,
  objects,
  newExplorer = false,
  compact = false,
  highlightedObjectId = null,
}: MiniMapProps) {
  const visibleObjectByTile = useMemo(() => new Map(
    objects.map((object) => [toTileKey(object.at), object] as const),
  ), [objects]);
  const exploredCount = useMemo(() => new Set([...revealed, ...currentView]).size, [currentView, revealed]);
  const exploredPercent = Math.round((exploredCount / (level.width * level.height)) * 100);
  const guidedObject = highlightedObjectId
    ? objects.find((object) => object.id === highlightedObjectId)
    : undefined;

  return (
    <section
      className={`maze-map-card${compact ? " compact-map" : ""}`}
      aria-label={`Exploration map. ${exploredCount} of ${level.width * level.height} tiles revealed, ${exploredPercent} percent.${guidedObject ? ` Guided marker: ${describeObject(guidedObject)} at column ${guidedObject.at.x + 1}, row ${guidedObject.at.y + 1}.` : ""}`}
    >
      <div className="maze-map-heading"><CatalogueImage src={ASSETS.navMazes} alt="" /><strong>My map</strong><small>{exploredPercent}%</small></div>
      <div
        className="maze-minimap"
        style={{
          gridTemplateColumns: `repeat(${level.width}, minmax(0, 1fr))`,
          gridTemplateRows: `repeat(${level.height}, minmax(0, 1fr))`,
        }}
        aria-hidden="true"
      >
        {level.terrain.flatMap((row, y) => row.map((terrain, x) => {
          const point = { x, y };
          const tileKey = toTileKey(point);
          const inView = currentView.has(tileKey);
          const seen = inView || revealed.has(tileKey);
          const candidate = visibleObjectByTile.get(tileKey);
          const guided = candidate?.id === highlightedObjectId;
          const object = seen || guided ? candidate : undefined;
          const isPlayer = pointsEqual(position, point);
          const isExit = seen && pointsEqual(level.exit, point);
          return (
            <i
              key={tileKey}
              className={`minimap-tile ${seen ? `map-${terrain} ${inView ? "in-view" : "remembered"}` : "map-fog"}`}
            >
              {isExit && <b className="map-marker marker-exit" />}
              {object && <b className={`map-marker marker-${object.kind}${object.kind === "door" || object.kind === "key" ? ` marker-${object.color}` : object.kind === "portal" ? ` marker-${object.pair}` : ""}${guided ? " guided-marker" : ""}`} />}
              {isPlayer && <b className="map-player" />}
            </i>
          );
        }))}
        <span
          className="map-camera-frame"
          style={{
            left: `${(camera.left / level.width) * 100}%`,
            top: `${(camera.top / level.height) * 100}%`,
            width: `${(camera.width / level.width) * 100}%`,
            height: `${(camera.height / level.height) * 100}%`,
          }}
        />
      </div>
      {newExplorer
        ? <div className="maze-map-nudge"><CatalogueImage src={ASSETS.goal} alt="" /> Walk to reveal the maze!</div>
        : <div className="maze-map-key"><span><i className="key-current" />Now</span><span><i className="key-seen" />Explored</span><span><i className="key-fog" />Mystery</span></div>}
      <p className="sr-only">
        Ame is at column {position.x + 1}, row {position.y + 1}.
        {pointsEqual(level.exit, position) || currentView.has(toTileKey(level.exit)) || revealed.has(toTileKey(level.exit))
          ? ` The sparkling exit is at column ${level.exit.x + 1}, row ${level.exit.y + 1}.`
          : " The exit has not been discovered yet."}
        {objects.some((object) => currentView.has(toTileKey(object.at)) || revealed.has(toTileKey(object.at)))
          ? ` Discovered landmarks: ${objects
            .filter((object) => currentView.has(toTileKey(object.at)) || revealed.has(toTileKey(object.at)))
            .map((object) => `${describeObject(object)} at column ${object.at.x + 1}, row ${object.at.y + 1}`)
            .join("; ")}.`
          : " No unresolved landmarks have been discovered yet."}
      </p>
    </section>
  );
});
