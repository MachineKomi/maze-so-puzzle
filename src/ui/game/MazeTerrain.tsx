import { memo, useId, useMemo } from "react";
import { ASSETS } from "../../assets";
import { resolveTerrainTheme, type TerrainRenderTreatment } from "../../artCatalog";
import { getTerrainAt } from "../../game/engine";
import { createRoundedTerrainGeometry, createRoundedTerrainPath } from "../../game/terrainGeometry";
import { buildWallCast, buildWallLighting, resolveWallLight, WALL_LIGHTING_PROFILES, WALL_LIGHTING_REVISION } from "../../game/wallLighting";
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

export const MazeTerrain = memo(function MazeTerrain({
  level,
  camera,
  wallMode = typeof window !== "undefined" && new URLSearchParams(window.location.search).get("wallLighting") === "legacy" ? "legacy" : "depth",
}: {
  readonly level: LevelDefinition;
  readonly camera: CameraWindow;
  /** Explicit comparison/rollback switch; never changes terrain rules. */
  readonly wallMode?: "legacy" | "depth";
}) {
  const patternPrefix = useId().replace(/:/g, "");
  const theme = resolveTerrainTheme(level.terrainThemeId);
  const floorPatternId = `${patternPrefix}-floor`;
  const wallPatternId = `${patternPrefix}-wall`;
  const wallFacePatternId = `${patternPrefix}-wall-face`;
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
  const cast = useMemo(() => buildWallCast(walls, shadow, profile.height), [walls, shadow.x, shadow.y, profile.height]);
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
        data-wall-lighting={wallMode === "depth" ? WALL_LIGHTING_REVISION : "legacy"}
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
          <pattern id={wallFacePatternId} patternUnits="userSpaceOnUse" width={theme.wall.periodTiles} height={theme.wall.periodTiles} patternTransform="scale(1 .42)">
            <rect width={theme.wall.periodTiles} height={theme.wall.periodTiles} fill={`url(#${wallPatternId})`} />
          </pattern>
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
          {theme.floorDressing && (
            <pattern
              id={floorDressingPatternId}
              patternUnits="userSpaceOnUse"
              width={theme.floorDressing.periodTiles}
              height={theme.floorDressing.periodTiles}
            >
              <image
                href={theme.floorDressing.src}
                x="0"
                y="0"
                width={theme.floorDressing.periodTiles}
                height={theme.floorDressing.periodTiles}
                preserveAspectRatio="none"
              />
            </pattern>
          )}
          {theme.wallDressing && (
            <pattern
              id={wallDressingPatternId}
              patternUnits="userSpaceOnUse"
              width={theme.wallDressing.periodTiles}
              height={theme.wallDressing.periodTiles}
            >
              <image
                href={theme.wallDressing.src}
                x="0"
                y="0"
                width={theme.wallDressing.periodTiles}
                height={theme.wallDressing.periodTiles}
                preserveAspectRatio="none"
              />
            </pattern>
          )}
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
            opacity={theme.floorDressing.opacity}
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
        {walls.d && wallMode === "depth" && <g className="terrain-wall-cast" fill="#50425f" opacity="0.19" clipPath={`url(#${floorClipId})`}>
          <path d={walls.d} fillRule="evenodd" transform={`translate(${cast.offset.x} ${cast.offset.y})`} />
          <path d={cast.ribbons} />
        </g>}
        {walls.d && wallMode === "depth" && <path className="terrain-wall-contact" d={walls.d} fill="none" stroke="#50425f" strokeWidth="0.075" opacity="0.25" clipPath={`url(#${floorClipId})`} />}
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
        {walls.d && theme.wallDressing && (
          <path
            className="terrain-wall-dressing"
            d={walls.d}
            fill={`url(#${wallDressingPatternId})`}
            fillRule={walls.fillRule}
            opacity={theme.wallDressing.opacity}
            mask={wallMode === "depth" ? `url(#${wallTopMaskId})` : undefined}
          />
        )}
        {walls.d && wallMode === "depth" && <g clipPath={`url(#${wallClipId})`}>
          <g className="terrain-wall-side" mask={`url(#${wallSideMaskId})`}>
            <path d={walls.d} fill={profile.side} fillRule="evenodd" />
            <path d={walls.d} fill={`url(#${wallFacePatternId})`} fillRule="evenodd" opacity={1 - profile.sideOpacity + light.toLight.y * .1} />
          </g>
          <path className="terrain-wall-foot" d={walls.d} fill="none" stroke={profile.shade} strokeWidth="0.09" opacity="0.28" mask={`url(#${wallSideMaskId})`} />
          <g mask={`url(#${wallTopMaskId})`}>
            <path className="terrain-wall-shade" d={depth.shade} fill={profile.shade} opacity="0.5" />
            <path className="terrain-wall-highlight" d={depth.lit} fill={profile.highlight} opacity="0.55" />
          </g>
          <path className="terrain-wall-contour" d={walls.d} fill="none" stroke={profile.shade} strokeWidth="0.025" opacity="0.75" />
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
