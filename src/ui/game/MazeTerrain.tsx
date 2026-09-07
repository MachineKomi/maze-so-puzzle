import { memo, useId, useMemo, type CSSProperties } from "react";
import { ASSETS } from "../../assets";
import { HAZARD_ART, resolveTerrainTheme, type TerrainRenderTreatment, type TerrainDressingArt } from "../../artCatalog";
import { poisonBubbleMarks } from "../../game/hazardSurface";
import { createDressingStamps } from "../../game/terrainDressing";
import { createTallWallGeometry, TALL_WALL_REVISION } from "../../game/tallWalls";
import { getTerrainAt } from "../../game/engine";
import { createRoundedTerrainGeometry, createRoundedTerrainPath } from "../../game/terrainGeometry";
import { buildWallLighting, resolveWallLight, WALL_LIGHTING_PROFILES, WALL_LIGHTING_REVISION } from "../../game/wallLighting";
import type { LevelDefinition, Point } from "../../game/types";
import { toTileKey, type CameraWindow } from "../../game/exploration";
import { CatalogueImage } from "../CatalogueImage";
import { worldLayerStyle } from "../../cameraMotion";
import { isInsideWindow } from "./sceneGeometry";

function terrainTreatmentFilter(treatment: TerrainRenderTreatment): string {
  return `brightness(${treatment.brightness}) saturate(${treatment.saturation}) contrast(${treatment.contrast})`;
}

export function lightVector(level: LevelDefinition): { readonly x: number; readonly y: number } {
  return resolveWallLight(level).cast;
}

function DressingPattern({ id, art, seed }: { id: string; art: TerrainDressingArt; seed: string }) {
  const stamps = useMemo(() => createDressingStamps(art, seed), [art, seed]);
  return <pattern id={id} patternUnits="userSpaceOnUse" width={art.periodTiles} height={art.periodTiles}>
    {stamps.map(({ frame, size, x, y, rotation }, i) => <svg key={i}
      x={x - size / 2} y={y - size / 2} width={size} height={size}
      viewBox={frame.join(" ")} preserveAspectRatio="xMidYMid meet"
      transform={`rotate(${rotation} ${x} ${y})`} overflow="hidden">
      <image href={art.src} width={art.width} height={art.height} />
    </svg>)}
  </pattern>;
}

export const MazeTerrain = memo(function MazeTerrain({
  level,
  camera,
  volumeId,
  wallMode = typeof window !== "undefined" && new URLSearchParams(window.location.search).get("wallLighting") === "legacy" ? "legacy" : "tall",
}: {
  readonly level: LevelDefinition;
  readonly camera: CameraWindow;
  readonly volumeId?: string;
  /** Explicit comparison/rollback switch; never changes terrain rules. */
  readonly wallMode?: "legacy" | "depth" | "tall";
}) {
  const patternPrefix = useId().replace(/:/g, "");
  const theme = resolveTerrainTheme(level.terrainThemeId);
  const floorPatternId = `${patternPrefix}-floor`;
  const wallPatternId = `${patternPrefix}-wall`;
  const wallSidePatternId = `${patternPrefix}-wall-side-texture`;
  const wallCapPatternId = `${patternPrefix}-wall-cap-texture`;
  const wallCapClipId = `${patternPrefix}-wall-cap-clip`;
  const waterPatternId = `${patternPrefix}-water`;
  const lavaPatternId = `${patternPrefix}-lava`;
  const poisonPatternId = `${patternPrefix}-poison`;
  const waterFxPatternId = `${patternPrefix}-water-fx`;
  const lavaFxPatternId = `${patternPrefix}-lava-fx`;
  const poisonFxPatternId = `${patternPrefix}-poison-fx`;
  const waterMaskId = `${patternPrefix}-water-mask`;
  const lavaMaskId = `${patternPrefix}-lava-mask`;
  const poisonMaskId = `${patternPrefix}-poison-mask`;
  const floorDressingPatternId = `${patternPrefix}-floor-dressing`;
  const dressingExclusionId = `${patternPrefix}-dressing-exclusions`;
  const wallDressingPatternId = `${patternPrefix}-wall-dressing`;
  const wallDepthFilterId = `${patternPrefix}-wall-depth`;
  const wallClipId = `${patternPrefix}-wall-clip`;
  const floorClipId = `${patternPrefix}-floor-clip`;
  const shadowClipId = `${patternPrefix}-shadow-clip`;
  const lavaHeatId = `${patternPrefix}-lava-heat`;
  const wallTopMaskId = `${patternPrefix}-wall-top`;
  const wallSideMaskId = `${patternPrefix}-wall-side`;
  const light = resolveWallLight(level);
  const shadow = light.cast;
  const profile = WALL_LIGHTING_PROFILES[theme.wall.wallLightingProfile ?? "stone"];
  const walls = useMemo(() => createRoundedTerrainGeometry(level, camera, "wall", 0.13), [level, camera]);
  const depth = useMemo(() => buildWallLighting(walls, light.toLight, profile), [walls, light.toLight.x, light.toLight.y, profile]);
  const tall = useMemo(() => wallMode === "tall" ? createTallWallGeometry(level, walls, light.toLight) : null, [level, walls, wallMode, light.toLight.x, light.toLight.y]);
  const groundWall = tall?.footprint ?? walls;
  const bubbles = useMemo(() => poisonBubbleMarks(level.id), [level.id]);
  const water = createRoundedTerrainPath(level, camera, "water", 0.16);
  const lava = createRoundedTerrainPath(level, camera, "lava", 0.16);
  const poison = createRoundedTerrainPath(level, camera, "poison", 0.16);
  // A floor bank belongs only to an ordinary-floor boundary. Joining every
  // non-floor family prevents fake safe strips between liquids, walls or pits.
  const shore = water.d || lava.d || poison.d
    ? createRoundedTerrainPath(level, camera, terrain => terrain !== "floor", .16) : null;
  const holes: Point[] = [];
  for (let y = camera.top; y <= camera.bottom; y += 1) {
    for (let x = camera.left; x <= camera.right; x += 1) {
      const point = { x, y };
      if (getTerrainAt(level, point) === "hole") holes.push(point);
    }
  }
  // Shadow receiving includes liquid, its transition and exposed lip. Dressing
  // still excludes liquids. Neither complement changes walkability geometry.
  const receiverD = `M${camera.left} ${camera.top}h${camera.width}v${camera.height}h${-camera.width}Z ${groundWall.d} ${holes.map(p => `M${p.x} ${p.y}h1v1h-1Z`).join(" ")}`;
  const floorD = `${receiverD} ${water.d} ${lava.d} ${poison.d}`;
  const dryFloorD = `M${camera.left} ${camera.top}h${camera.width}v${camera.height}h${-camera.width}Z ${water.d} ${lava.d} ${poison.d}`;

  return (
    <>
      <svg
        className="maze-terrain-svg"
        viewBox={`${camera.left} ${camera.top} ${camera.width} ${camera.height}`}
        preserveAspectRatio="none"
        aria-hidden="true"
        data-wall-lighting={wallMode === "tall" ? TALL_WALL_REVISION : wallMode === "depth" ? WALL_LIGHTING_REVISION : "legacy"}
        data-wall-profile={theme.wall.wallLightingProfile}
        data-hazard-surface="03-living-connected"
      >
        <defs>
          <pattern id={floorPatternId} patternUnits="userSpaceOnUse" width={theme.floor.periodTiles} height={theme.floor.periodTiles}>
            <rect width={theme.floor.periodTiles} height={theme.floor.periodTiles} fill={theme.floor.fallbackColor} />
            <image href={theme.floor.src} x="0" y="0" width={theme.floor.periodTiles} height={theme.floor.periodTiles} preserveAspectRatio="none" style={{ filter: terrainTreatmentFilter(theme.floorTreatment) }} />
            {theme.floorWash && <rect width={theme.floor.periodTiles} height={theme.floor.periodTiles} fill={theme.floorWash.color} opacity={theme.floorWash.opacity} />}
          </pattern>
          <pattern id={wallPatternId} patternUnits="userSpaceOnUse" width={theme.wall.periodTiles} height={theme.wall.periodTiles}>
            <rect width={theme.wall.periodTiles} height={theme.wall.periodTiles} fill={theme.wall.fallbackColor} />
            <image href={theme.wall.src} x="0" y="0" width={theme.wall.periodTiles} height={theme.wall.periodTiles} preserveAspectRatio="none" style={{ filter: terrainTreatmentFilter(theme.wallTreatment) }} />
          </pattern>
          {tall && <>
            <pattern id={wallSidePatternId} patternUnits="userSpaceOnUse" width={theme.wall.periodTiles} height={theme.wall.periodTiles * .72}>
              <image href={theme.wall.src} width={theme.wall.periodTiles} height={theme.wall.periodTiles * .72} preserveAspectRatio="none" style={{ filter: terrainTreatmentFilter(theme.wallTreatment) }} />
            </pattern>
            <pattern id={wallCapPatternId} patternUnits="userSpaceOnUse" width={theme.wall.periodTiles} height={theme.wall.periodTiles} patternTransform={`translate(${tall.dx} ${-tall.height})`}>
              <image href={theme.wall.src} width={theme.wall.periodTiles} height={theme.wall.periodTiles} style={{ filter: terrainTreatmentFilter(theme.wallTreatment) }} />
            </pattern>
            <clipPath id={wallCapClipId}><path d={tall.cap.d} clipRule="evenodd" transform={`translate(${tall.dx} ${-tall.height})`} /></clipPath>
          </>}
          {wallMode === "legacy" && <filter id={wallDepthFilterId} x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="0.055" />
          </filter>}
          <clipPath id={wallClipId}><path d={walls.d} clipRule="evenodd" /></clipPath>
          {shore && <clipPath id={`${patternPrefix}-dry-floor`}><path d={dryFloorD} clipRule="evenodd" /></clipPath>}
          <clipPath id={floorClipId}><path d={floorD} clipRule="evenodd" /></clipPath>
          <clipPath id={shadowClipId}><path d={receiverD} clipRule="evenodd" /></clipPath>
          <mask id={wallTopMaskId} maskUnits="userSpaceOnUse" maskContentUnits="userSpaceOnUse" x={camera.left} y={camera.top} width={camera.width} height={camera.height}>
            <path d={walls.d} fill="white" fillRule="evenodd" transform={`translate(0 ${-profile.height})`} />
          </mask>
          <mask id={wallSideMaskId} maskUnits="userSpaceOnUse" maskContentUnits="userSpaceOnUse" x={camera.left} y={camera.top} width={camera.width} height={camera.height}>
            <path d={walls.d} fill="white" fillRule="evenodd" />
            <path d={walls.d} fill="black" fillRule="evenodd" transform={`translate(0 ${-profile.height})`} />
          </mask>
          {water.d && <clipPath id={waterMaskId}><path d={water.d} clipRule={water.fillRule} /></clipPath>}
          {lava.d && <clipPath id={lavaMaskId}><path d={lava.d} clipRule={lava.fillRule} /></clipPath>}
          {poison.d && <clipPath id={poisonMaskId}><path d={poison.d} clipRule={poison.fillRule} /></clipPath>}
          {theme.floorDressing && <DressingPattern id={floorDressingPatternId} art={theme.floorDressing} seed={`${level.id}:floor`} />}
          {theme.floorDressing && <mask id={dressingExclusionId} maskUnits="userSpaceOnUse" x={camera.left} y={camera.top} width={camera.width} height={camera.height}>
            <rect x={camera.left} y={camera.top} width={camera.width} height={camera.height} fill="white" />
            {[level.start, level.exit, ...level.objects.map(object => object.at)].map((at, i) => <rect key={i} x={at.x} y={at.y} width="1" height="1" fill="black" />)}
          </mask>}
          {theme.wallDressing && <DressingPattern id={wallDressingPatternId} art={theme.wallDressing} seed={`${level.id}:wall`} />}
        </defs>

        <rect
          className="terrain-floor"
          clipPath={shore ? `url(#${patternPrefix}-dry-floor)` : undefined}
          x={camera.left}
          y={camera.top}
          width={camera.width}
          height={camera.height}
          fill={`url(#${floorPatternId})`}
        />
        {theme.floorDressing && (
          <rect
            className="terrain-floor-dressing"
            x={camera.left}
            y={camera.top}
            width={camera.width}
            height={camera.height}
            fill={`url(#${floorDressingPatternId})`}
            mask={`url(#${dressingExclusionId})`}
            clipPath={`url(#${floorClipId})`}
          />
        )}
        {[water, lava, poison].map((region, i) => region.d && <g key={i} className="terrain-hazard-lip"
          data-kind={['water', 'lava', 'poison'][i]} clipPath={`url(#${[waterMaskId, lavaMaskId, poisonMaskId][i]})`}
          fill="none" stroke={`url(#${floorPatternId})`} strokeLinejoin="round">
          {[[.14, .4], [.08, 1]].map(([width, opacity]) =>
            <path key={width} d={shore!.d} strokeWidth={width} opacity={opacity} />)}
        </g>)}
        {walls.d && wallMode === "legacy" && (
          <path
            className="terrain-wall-depth"
            d={walls.d}
            fill="#332b58"
            fillRule={walls.fillRule}
            opacity="0.34"
            transform={`translate(${shadow.x * 0.10} ${shadow.y * 0.10})`}
            filter={`url(#${wallDepthFilterId})`}
          />
        )}
        {tall && <path className="terrain-wall-cast" d={tall.shadow} fill="#33283f" opacity=".25" clipPath={`url(#${shadowClipId})`} />}
        {walls.d && wallMode !== "legacy" && <path className="terrain-wall-contact" d={groundWall.d} fill="none" stroke="#50425f" strokeWidth="0.055" opacity="0.28" clipPath={`url(#${shadowClipId})`} />}
        {walls.d && (
          <path
            className="terrain-wall"
            d={walls.d}
            fill={tall ? "none" : `url(#${wallPatternId})`}
            fillRule={walls.fillRule}
          />
        )}
        {walls.d && wallMode === "legacy" && (
          <path
            className="terrain-wall-highlight"
            d={walls.d}
            fill="none"
            fillRule={walls.fillRule}
            stroke="rgba(255,255,255,0.45)"
            strokeWidth="0.045"
            transform={`translate(${shadow.x * -0.025} ${shadow.y * -0.025})`}
          />
        )}
        {walls.d && theme.wallDressing && !tall && (
          <path
            className="terrain-wall-dressing"
            d={walls.d}
            fill={`url(#${wallDressingPatternId})`}
            fillRule={walls.fillRule}
            mask={wallMode === "depth" ? `url(#${wallTopMaskId})` : undefined}
          />
        )}
        {walls.d && wallMode === "depth" && <g clipPath={`url(#${wallClipId})`}>
          <path className="terrain-wall-side" d={walls.d} fill={profile.side} opacity={profile.sideOpacity - light.toLight.y * .1} mask={`url(#${wallSideMaskId})`} />
          <g mask={`url(#${wallTopMaskId})`}>
            <path className="terrain-wall-shade" d={depth.shade} fill={profile.shade} opacity="0.5" />
            <path className="terrain-wall-highlight" d={depth.lit} fill={profile.highlight} opacity="0.55" />
          </g>
          <path className="terrain-wall-contour" d={walls.d} fill="none" stroke={profile.shade} strokeWidth="0.025" opacity="0.75" />
        </g>}
        {tall && <g className="terrain-tall-walls" id={volumeId}>
          {tall.sides.map((d, index) => d && <g key={index}><path d={d} fill={`url(#${wallSidePatternId})`} /><path d={d} fill="#241e31" opacity={.22 + index * .065} /></g>)}
          <path d={tall.cap.d} fill={`url(#${wallCapPatternId})`} fillRule="evenodd" transform={`translate(${tall.dx} ${-tall.height})`} />
          <path d={tall.cap.d} fill={profile.highlight} opacity=".16" fillRule="evenodd" transform={`translate(${tall.dx} ${-tall.height})`} />
          {theme.wallDressing && <path className="terrain-wall-dressing" d={tall.cap.d} transform={`translate(${tall.dx} ${-tall.height})`} fill={`url(#${wallDressingPatternId})`} fillRule="evenodd" />}
          <path d={tall.rim} fill="none" stroke={profile.highlight} strokeWidth=".035" opacity=".64" />
        </g>}
      </svg>
      {shore && <svg className="maze-liquid-svg" viewBox={`${camera.left} ${camera.top} ${camera.width} ${camera.height}`} preserveAspectRatio="none" aria-hidden="true">
        <defs>
          {[water, lava, poison].map((region,i) => region.d && <clipPath key={i} id={`${[waterMaskId,lavaMaskId,poisonMaskId][i]}-local`}><path d={region.d} clipRule="evenodd" /></clipPath>)}
          {(['water', 'lava', 'poison'] as const).map((kind, i) => {
            if (![water.d, lava.d, poison.d][i]) return null;
            const art = HAZARD_ART[kind];
            return <pattern key={kind} id={[waterPatternId, lavaPatternId, poisonPatternId][i]} patternUnits="userSpaceOnUse" width={art.periodTiles} height={art.periodTiles}>
              <rect width={art.periodTiles} height={art.periodTiles} fill={art.fallbackColor} />
              <g className={`hazard-current hazard-current-${kind}`} style={{ '--current-period': `${art.periodTiles}px` } as CSSProperties}>
                {[-1, 0].map(x => <image key={x} href={art.src}
                  x={x * art.periodTiles} width={art.periodTiles} height={art.periodTiles} preserveAspectRatio="none" />)}
              </g>
            </pattern>;
          })}
          {water.d && <pattern id={waterFxPatternId} patternUnits="userSpaceOnUse" width="2.4" height="2.4">
            <g className="water-ripple-marks">
              <ellipse cx=".6" cy=".68" rx=".42" ry=".23" />
              <ellipse cx="1.75" cy="1.7" rx=".48" ry=".29" />
              <ellipse cx="1.86" cy=".46" rx=".26" ry=".16" />
            </g>
          </pattern>}
          {lava.d && <><radialGradient id={lavaHeatId}><stop stopColor="#ffdc79" stopOpacity=".62" /><stop offset="1" stopColor="#ff7818" stopOpacity="0" /></radialGradient>
          <pattern id={lavaFxPatternId} patternUnits="userSpaceOnUse" width="2.2" height="2.2">
            <g className="lava-shimmer-marks">
              <ellipse cx=".52" cy=".64" rx=".38" ry=".24" fill={`url(#${lavaHeatId})`} />
              <ellipse cx="1.55" cy="1.48" rx=".42" ry=".34" fill={`url(#${lavaHeatId})`} />
            </g>
          </pattern></>}
          {poison.d && <pattern id={poisonFxPatternId} patternUnits="userSpaceOnUse" width="3.6" height="3.6">
            <g className="poison-bubble-marks">{bubbles.map((bubble, i) => <g key={i} className="poison-bubble"
              style={{ animationDuration: `${bubble.duration}s`, animationDelay: `${bubble.delay}s`, '--bubble-drift': `${bubble.drift}%` } as CSSProperties}>
              <circle cx={bubble.x} cy={bubble.y} r={bubble.radius} />
              <path className="poison-bubble-glint" d={`M${bubble.x - bubble.radius * .52} ${bubble.y - bubble.radius * .1}q0 ${-bubble.radius * .48} ${bubble.radius * .45} ${-bubble.radius * .5}`} />
            </g>)}</g>
          </pattern>}
        </defs>
        {water.d && <path className="terrain-water" d={water.d} fill={`url(#${waterPatternId})`} fillRule={water.fillRule} clipPath={`url(#${waterMaskId}-local)`} />}
        {lava.d && <path className="terrain-lava" d={lava.d} fill={`url(#${lavaPatternId})`} fillRule={lava.fillRule} clipPath={`url(#${lavaMaskId}-local)`} />}
        {poison.d && <path className="terrain-poison" d={poison.d} fill={`url(#${poisonPatternId})`} fillRule={poison.fillRule} clipPath={`url(#${poisonMaskId}-local)`} />}
        {water.d && <path className="terrain-water-fx" d={water.d} fill={`url(#${waterFxPatternId})`} fillRule={water.fillRule} clipPath={`url(#${waterMaskId}-local)`} />}
        {lava.d && <path className="terrain-lava-fx" d={lava.d} fill={`url(#${lavaFxPatternId})`} fillRule={lava.fillRule} clipPath={`url(#${lavaMaskId}-local)`} />}
        {poison.d && <path className="terrain-poison-fx" d={poison.d} fill={`url(#${poisonFxPatternId})`} fillRule={poison.fillRule} clipPath={`url(#${poisonMaskId}-local)`} />}
      </svg>}
      {holes.map((hole) => (
        <div className="terrain-hole-layer" style={worldLayerStyle(hole, level)} key={toTileKey(hole)} aria-hidden="true">
          <CatalogueImage usage="field" src={ASSETS.hole} alt="" draggable={false} />
        </div>
      ))}
      {isInsideWindow(level.exit, camera) && (
        <div className="goal-layer" style={worldLayerStyle(level.exit, level)} aria-hidden="true">
          <CatalogueImage usage="field" className="goal-sprite" src={ASSETS.goal} alt="" draggable={false} />
        </div>
      )}
    </>
  );
});
