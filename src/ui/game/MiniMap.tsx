import { memo, useId, useMemo } from "react";
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

/** Adjacent cells become short spans; no per-cell render tree is needed. */
function mapPath(keys: Iterable<TileKey>): string {
  const rows = new Map<number, Set<number>>();
  for (const key of keys) {
    const [x, y] = key.split(",").map(Number);
    if (!rows.has(y!)) rows.set(y!, new Set());
    rows.get(y!)!.add(x!);
  }
  const paths: string[] = [];
  for (const [y, cells] of rows) {
    const xs = [...cells].sort((a, b) => a - b);
    for (let i = 0; i < xs.length;) {
      const x = xs[i]!; let end = x + 1; i++;
      while (xs[i] === end) { end++; i++; }
      paths.push(`M${x} ${y}h${end - x}v1h${x - end}Z`);
    }
  }
  return paths.join("");
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
  const id = useId().replace(/:/g, "");
  const terrainPaths = useMemo(() => {
    const keys = new Map<string, TileKey[]>();
    level.terrain.forEach((row, y) => row.forEach((kind, x) => {
      if (!keys.has(kind)) keys.set(kind, []);
      keys.get(kind)!.push(toTileKey({ x, y }));
    }));
    return [...keys].map(([kind, cells]) => ({ kind, d: mapPath(cells) }));
  }, [level]);
  const seenTiles = useMemo(() => new Set([...revealed, ...currentView]), [revealed, currentView]);
  const exploredCount = seenTiles.size;
  const seenPath = useMemo(() => mapPath(seenTiles), [seenTiles]);
  const viewPath = useMemo(() => mapPath(currentView), [currentView]);
  // Preserve the previous map's last-active-object marker when a tile has
  // overlapping authored objects; a reveal must not introduce extra markers.
  const markerObjects = useMemo(() => [...new Map(objects.map(object => [toTileKey(object.at), object])).values()], [objects]);
  const cellStyle = (point: Point) => ({ left: `${point.x / level.width * 100}%`, top: `${point.y / level.height * 100}%`,
    width: `${100 / level.width}%`, height: `${100 / level.height}%` });
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
        <svg className="minimap-terrain" viewBox={`0 0 ${level.width} ${level.height}`} preserveAspectRatio="none">
          <defs>
            <g id={`${id}-terrain`}>{terrainPaths.map(({ kind, d }) => <path key={kind} className={`map-${kind}`} d={d} />)}</g>
            <clipPath id={`${id}-seen`}><path d={seenPath} /></clipPath>
            <clipPath id={`${id}-view`}><path d={viewPath} /></clipPath>
            <pattern id={`${id}-grid`} patternUnits="userSpaceOnUse" width="1" height="1">
              <rect width="1" height="1" fill="none" stroke="#fff4" strokeWidth=".5" vectorEffect="non-scaling-stroke" />
            </pattern>
          </defs>
          <use href={`#${id}-terrain`} className="map-memory" clipPath={`url(#${id}-seen)`} />
          <g clipPath={`url(#${id}-view)`}><use href={`#${id}-terrain`} />
            <rect width={level.width} height={level.height} fill={`url(#${id}-grid)`} /></g>
        </svg>
        {seenTiles.has(toTileKey(level.exit)) && <i className="minimap-marker-cell" style={cellStyle(level.exit)}><b className="map-marker marker-exit" /></i>}
        {markerObjects.filter(object => seenTiles.has(toTileKey(object.at)) || object.id === highlightedObjectId).map(object =>
          <i key={object.id} className="minimap-marker-cell" style={cellStyle(object.at)}>
            <b className={`map-marker marker-${object.kind}${object.kind === "door" || object.kind === "key" ? ` marker-${object.color}` : object.kind === "portal" ? ` marker-${object.pair}` : ""}${object.id === highlightedObjectId ? " guided-marker" : ""}`} />
          </i>)}
        <i className="minimap-player-cell" style={cellStyle(position)}><b className="map-player" /></i>
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
