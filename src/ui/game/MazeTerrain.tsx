import { memo, useId, useMemo } from "react";
import { ASSETS } from "../../assets";
import { resolveTerrainTheme, type TerrainRenderTreatment, type TerrainDressingArt } from "../../artCatalog";
import { createDressingStamps } from "../../game/terrainDressing";
import { createTallWallGeometry, TALL_WALL_REVISION } from "../../game/tallWalls";
import { getTerrainAt } from "../../game/engine";
import { createRoundedTerrainGeometry, createRoundedTerrainPath } from "../../game/terrainGeometry";
import { buildWallLighting, resolveWallLight, WALL_LIGHTING_PROFILES, WALL_LIGHTING_REVISION } from "../../game/wallLighting";
import type { LevelDefinition, Point } from "../../game/types";
import { toTileKey, type CameraWindow } from "../../game/exploration";
import { CatalogueImage } from "../CatalogueImage";
import { cameraLayerStyle, isInsideWindow } from "./sceneGeometry";

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
  wallMode = typeof window !== "undefined" && new URLSearchParams(window.location.search).get("wallLighting") === "legacy" ? "legacy" : "tall",
}: {
  readonly level: LevelDefinition;
  readonly camera: CameraWindow;
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
  const hazardInsetFilterId = `${patternPrefix}-hazard-inset`;
  const waterMaskId = `${patternPrefix}-water-mask`;
  const lavaMaskId = `${patternPrefix}-lava-mask`;
  const poisonMaskId = `${patternPrefix}-poison-mask`;
  const floorDressingPatternId = `${patternPrefix}-floor-dressing`;
  const dressingExclusionId = `${patternPrefix}-dressing-exclusions`;
  const wallDressingPatternId = `${patternPrefix}-wall-dressing`;
  const wallDepthFilterId = `${patternPrefix}-wall-depth`;
  const wallClipId = `${patternPrefix}-wall-clip`;
  const floorClipId = `${patternPrefix}-floor-clip`;
  const wallTopMaskId = `${patternPrefix}-wall-top`;
  const wallSideMaskId = `${patternPrefix}-wall-side`;
  const light = resolveWallLight(level);
  const shadow = light.cast;
  const profile = WALL_LIGHTING_PROFILES[theme.wall.wallLightingProfile ?? "stone"];
  const walls = useMemo(() => createRoundedTerrainGeometry(level, camera, "wall", 0.13), [level, camera]);
  const depth = useMemo(() => buildWallLighting(walls, light.toLight, profile), [walls, light.toLight.x, light.toLight.y, profile]);
  const tall = useMemo(() => wallMode === "tall" ? createTallWallGeometry(level, walls, light.toLight) : null, [level, walls, wallMode, light.toLight.x, light.toLight.y]);
  const water = createRoundedTerrainPath(level, camera, "water", 0.16);
  const lava = createRoundedTerrainPath(level, camera, "lava", 0.16);
  const poison = createRoundedTerrainPath(level, camera, "poison", 0.16);
  const holes: Point[] = [];
  for (let y = camera.top; y <= camera.bottom; y += 1) {
    for (let x = camera.left; x <= camera.right; x += 1) {
      const point = { x, y };
      if (getTerrainAt(level, point) === "hole") holes.push(point);
    }
  }
  // Visible ground complement, including rounded-away wall corners, but never
  // hazard or pit interiors. This is a receiver, not walkability geometry.
  const floorD = `M${camera.left} ${camera.top}h${camera.width}v${camera.height}h${-camera.width}Z ${walls.d} ${water.d} ${lava.d} ${poison.d} ${holes.map(p => `M${p.x} ${p.y}h1v1h-1Z`).join(" ")}`;

  return (
    <>
      <svg
        className="maze-terrain-svg"
        viewBox={`${camera.left} ${camera.top} ${camera.width} ${camera.height}`}
        preserveAspectRatio="none"
        aria-hidden="true"
        data-wall-lighting={wallMode === "tall" ? TALL_WALL_REVISION : wallMode === "depth" ? WALL_LIGHTING_REVISION : "legacy"}
        data-wall-profile={theme.wall.wallLightingProfile}
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
          <pattern id={waterPatternId} patternUnits="userSpaceOnUse" width="4.6" height="4.6">
            <image href={ASSETS.water} x="0" y="0" width="4.6" height="4.6" preserveAspectRatio="none" />
          </pattern>
          <pattern id={lavaPatternId} patternUnits="userSpaceOnUse" width="4.6" height="4.6">
            <image href={ASSETS.lava} x="0" y="0" width="4.6" height="4.6" preserveAspectRatio="none" />
          </pattern>
          <pattern id={poisonPatternId} patternUnits="userSpaceOnUse" width="4.2" height="4.2">
            <image href={ASSETS.poison} x="0" y="0" width="4.2" height="4.2" preserveAspectRatio="none" />
          </pattern>
          <pattern id={waterFxPatternId} patternUnits="userSpaceOnUse" width="1.8" height="1.8">
            <g className="water-ripple-marks">
              <path d="M.16 .42 C.38 .27 .68 .27 .91 .42 S1.43 .57 1.66 .4" />
              <path d="M.06 1.16 C.3 1.02 .57 1.02 .8 1.16 S1.3 1.31 1.57 1.15" />
              <path d="M.5 1.57 C.68 1.48 .91 1.48 1.08 1.57" />
            </g>
          </pattern>
          <pattern id={lavaFxPatternId} patternUnits="userSpaceOnUse" width="1.75" height="1.75">
            <g className="lava-shimmer-marks">
              <circle cx=".34" cy=".42" r=".18" />
              <circle cx="1.32" cy="1.16" r=".25" />
              <path d="M.18 1.42 C.55 1.1 .7 1.66 1.02 1.39 S1.48 1.22 1.7 1.45" />
            </g>
          </pattern>
          <pattern id={poisonFxPatternId} patternUnits="userSpaceOnUse" width="1.55" height="1.55">
            <g className="poison-bubble-marks">
              <circle className="poison-bubble bubble-a" cx=".3" cy="1.3" r=".09" />
              <circle className="poison-bubble bubble-b" cx=".88" cy=".92" r=".12" />
              <circle className="poison-bubble bubble-c" cx="1.3" cy="1.4" r=".065" />
              <circle className="poison-bubble bubble-d" cx="1.18" cy=".42" r=".05" />
            </g>
          </pattern>
          <filter
            id={hazardInsetFilterId}
            x={camera.left - 0.2}
            y={camera.top - 0.2}
            width={camera.width + 0.4}
            height={camera.height + 0.4}
            filterUnits="userSpaceOnUse"
            colorInterpolationFilters="sRGB"
          >
            <feMorphology in="SourceGraphic" operator="erode" radius="0.055" result="inset" />
            <feGaussianBlur in="inset" stdDeviation="0.022" />
          </filter>
          {wallMode === "legacy" && <filter id={wallDepthFilterId} x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="0.055" />
          </filter>}
          <clipPath id={wallClipId}><path d={walls.d} clipRule="evenodd" /></clipPath>
          <clipPath id={floorClipId}><path d={floorD} clipRule="evenodd" /></clipPath>
          <mask id={wallTopMaskId} maskUnits="userSpaceOnUse" maskContentUnits="userSpaceOnUse" x={camera.left} y={camera.top} width={camera.width} height={camera.height}>
            <path d={walls.d} fill="white" fillRule="evenodd" transform={`translate(0 ${-profile.height})`} />
          </mask>
          <mask id={wallSideMaskId} maskUnits="userSpaceOnUse" maskContentUnits="userSpaceOnUse" x={camera.left} y={camera.top} width={camera.width} height={camera.height}>
            <path d={walls.d} fill="white" fillRule="evenodd" />
            <path d={walls.d} fill="black" fillRule="evenodd" transform={`translate(0 ${-profile.height})`} />
          </mask>
          {water.d && (
            <mask
              id={waterMaskId}
              x={camera.left - 0.2}
              y={camera.top - 0.2}
              width={camera.width + 0.4}
              height={camera.height + 0.4}
              maskUnits="userSpaceOnUse"
              maskContentUnits="userSpaceOnUse"
            >
              <path d={water.d} fill="white" fillRule={water.fillRule} filter={`url(#${hazardInsetFilterId})`} />
            </mask>
          )}
          {lava.d && (
            <mask
              id={lavaMaskId}
              x={camera.left - 0.2}
              y={camera.top - 0.2}
              width={camera.width + 0.4}
              height={camera.height + 0.4}
              maskUnits="userSpaceOnUse"
              maskContentUnits="userSpaceOnUse"
            >
              <path d={lava.d} fill="white" fillRule={lava.fillRule} filter={`url(#${hazardInsetFilterId})`} />
            </mask>
          )}
          {poison.d && (
            <mask
              id={poisonMaskId}
              x={camera.left - 0.2}
              y={camera.top - 0.2}
              width={camera.width + 0.4}
              height={camera.height + 0.4}
              maskUnits="userSpaceOnUse"
              maskContentUnits="userSpaceOnUse"
            >
              <path d={poison.d} fill="white" fillRule={poison.fillRule} filter={`url(#${hazardInsetFilterId})`} />
            </mask>
          )}
          {theme.floorDressing && <DressingPattern id={floorDressingPatternId} art={theme.floorDressing} seed={`${level.id}:floor`} />}
          {theme.floorDressing && <mask id={dressingExclusionId} maskUnits="userSpaceOnUse" x={camera.left} y={camera.top} width={camera.width} height={camera.height}>
            <rect x={camera.left} y={camera.top} width={camera.width} height={camera.height} fill="white" />
            {[level.start, level.exit, ...level.objects.map(object => object.at)].map((at, i) => <rect key={i} x={at.x} y={at.y} width="1" height="1" fill="black" />)}
          </mask>}
          {theme.wallDressing && <DressingPattern id={wallDressingPatternId} art={theme.wallDressing} seed={`${level.id}:wall`} />}
        </defs>

        <rect
          className="terrain-floor"
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
        {water.d && <path className="terrain-water" d={water.d} fill={`url(#${waterPatternId})`} fillRule={water.fillRule} mask={`url(#${waterMaskId})`} />}
        {lava.d && <path className="terrain-lava" d={lava.d} fill={`url(#${lavaPatternId})`} fillRule={lava.fillRule} mask={`url(#${lavaMaskId})`} />}
        {poison.d && <path className="terrain-poison" d={poison.d} fill={`url(#${poisonPatternId})`} fillRule={poison.fillRule} mask={`url(#${poisonMaskId})`} />}
        {water.d && <path className="terrain-water-fx" d={water.d} fill={`url(#${waterFxPatternId})`} fillRule={water.fillRule} mask={`url(#${waterMaskId})`} />}
        {lava.d && <path className="terrain-lava-fx" d={lava.d} fill={`url(#${lavaFxPatternId})`} fillRule={lava.fillRule} mask={`url(#${lavaMaskId})`} />}
        {poison.d && <path className="terrain-poison-fx" d={poison.d} fill={`url(#${poisonFxPatternId})`} fillRule={poison.fillRule} mask={`url(#${poisonMaskId})`} />}
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
        {tall && <path className="terrain-wall-cast" d={tall.shadow} fill="#33283f" opacity=".16" clipPath={`url(#${floorClipId})`} />}
        {walls.d && wallMode !== "legacy" && <path className="terrain-wall-contact" d={walls.d} fill="none" stroke="#50425f" strokeWidth="0.055" opacity="0.22" clipPath={`url(#${floorClipId})`} />}
        {walls.d && (
          <path
            className="terrain-wall"
            d={walls.d}
            fill={`url(#${wallPatternId})`}
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
        {tall && <g className="terrain-tall-walls" clipPath={`url(#${wallClipId})`}>
          {tall.sides.map((d, index) => d && <g key={index}><path d={d} fill={`url(#${wallSidePatternId})`} /><path d={d} fill="#241e31" opacity={.22 + index * .065} /></g>)}
          <path d={tall.cap.d} fill={`url(#${wallCapPatternId})`} fillRule="evenodd" transform={`translate(${tall.dx} ${-tall.height})`} />
          <path d={tall.cap.d} fill={profile.highlight} opacity=".16" fillRule="evenodd" transform={`translate(${tall.dx} ${-tall.height})`} />
          {theme.wallDressing && <path className="terrain-wall-dressing" d={walls.d} fill={`url(#${wallDressingPatternId})`} fillRule="evenodd" clipPath={`url(#${wallCapClipId})`} />}
          <path d={tall.rim} fill="none" stroke={profile.highlight} strokeWidth=".023" opacity=".40" />
        </g>}
      </svg>
      {holes.map((hole) => (
        <div className="terrain-hole-layer" style={cameraLayerStyle(hole, camera)} key={toTileKey(hole)} aria-hidden="true">
          <CatalogueImage usage="field" src={ASSETS.hole} alt="" draggable={false} />
        </div>
      ))}
      {isInsideWindow(level.exit, camera) && (
        <div className="goal-layer" style={cameraLayerStyle(level.exit, camera)} aria-hidden="true">
          <CatalogueImage usage="field" className="goal-sprite" src={ASSETS.goal} alt="" draggable={false} />
        </div>
      )}
    </>
  );
});
