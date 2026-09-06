/** Isolated working extrusion/cutaway comparison. No production import or save writes. */
import React, { useMemo, useState, type ReactNode } from 'react';
import { createRoot } from 'react-dom/client';
import { CURATED_LEVELS } from '../../src/game/levels';
import { getCameraWindow } from '../../src/game/exploration';
import { createRoundedCellUnionGeometry, createRectilinearUnionGeometry, type RoundedTerrainGeometry } from '../../src/game/terrainGeometry';
import { resolveWallLight } from '../../src/game/wallLighting';
import { AME_ART, TERRAIN_THEMES, resolveTerrainTheme, resolveAnimalArt, resolveEnemyArt, resolveKeyArt, resolveDoorArt } from '../../src/artCatalog';
import { ASSETS } from '../../src/assets';
import { MazeTerrain } from '../../src/ui/game/MazeTerrain';
import type { LevelDefinition, Point, TerrainThemeId } from '../../src/game/types';
import './tall-wall-lab.css';

// Ground remains exactly square. A small rightward rise exposes a second face.
// This is an explicit oblique projection P(x,y,z)=(x+.18z,y-z).
const skew = .18;
const ameSize = .92;
const ameVisibleHeight = ameSize * (AME_ART.geometry.groundLine - AME_ART.geometry.visibleBounds[1]);
const point = (p: Point) => `${p.x.toFixed(4)},${p.y.toFixed(4)}`;
const lift = (p: Point, h: number) => ({ x: p.x + h * skew, y: p.y - h });

function faces(geometry: RoundedTerrainGeometry, height: number, light: Point) {
  const result: { y: number; d: string; shade: number; rim: string }[] = [];
  const segment = (a: Point, b: Point, normal: Point) => {
    if (-skew * normal.x + normal.y <= .001) return;
    const count = Math.max(1, Math.ceil(Math.abs(a.y - b.y)));
    for (let i = 0; i < count; i++) {
      const mix = (t: number) => ({ x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t });
      const p = mix(i / count), q = mix((i + 1) / count), ph = lift(p, height), qh = lift(q, height);
      result.push({ y: Math.ceil((p.y + q.y) / 2) - 1, d: `M${point(p)}L${point(q)}L${point(qh)}L${point(ph)}Z`,
        shade: .25 + .30 * (1 - (normal.x * light.x + normal.y * light.y)) / 2,
        rim: `M${point(ph)}L${point(qh)}` });
    }
  };
  geometry.edges.forEach(e => segment(e.entry, e.exit, e.normal));
  geometry.corners.forEach(c => {
    const a = Math.atan2(c.entry.y - c.center.y, c.entry.x - c.center.x);
    let d = Math.atan2(c.exit.y - c.center.y, c.exit.x - c.center.x) - a;
    if (c.sweep && d < 0) d += Math.PI * 2;
    if (!c.sweep && d > 0) d -= Math.PI * 2;
    const p = (t: number) => ({ x: c.center.x + c.radius * Math.cos(a + d * t), y: c.center.y + c.radius * Math.sin(a + d * t) });
    for (let i = 0; i < 5; i++) {
      const theta = a + d * (i + .5) / 5, sign = c.sweep ? 1 : -1;
      segment(p(i / 5), p((i + 1) / 5), { x: Math.cos(theta) * sign, y: Math.sin(theta) * sign });
    }
  });
  return result;
}

function Scene({ level, at, ratio, mode }: { level: LevelDefinition; at: Point; ratio: number; mode: 'baseline' | 'tall' | 'cutaway' | 'integrated' }) {
  const camera = getCameraWindow(level, at), theme = resolveTerrainTheme(level.terrainThemeId);
  const height = ameVisibleHeight * ratio, prefix = `${mode}-${level.id}`, light = resolveWallLight(level).toLight;
  const bounds = { left: 0, top: 0, right: level.width - 1, bottom: level.height - 1 };
  const terrain = (x: number, y: number) => level.terrain[y]?.[x];
  const { groups, lowered, total } = useMemo(() => {
    const low = new Set<string>(); let total = 0;
    for (let y = 0; y < level.height; y++) for (let x = 0; x < level.width; x++) {
      if (terrain(x, y) !== 'wall') continue;
      total++;
      if (mode !== 'cutaway') continue;
      // Static P0 rule protects every floor-channel choice, without solver data.
      // The production owner must additionally retain sampled actor/flight envelopes.
      for (let fy = Math.max(0, y - Math.ceil(height)); fy <= y; fy++) for (let fx = Math.max(0, x - 1); fx <= Math.min(level.width - 1, x + 1); fx++) {
        if (!terrain(fx, fy) || terrain(fx, fy) === 'wall') continue;
        if (x < fx + .775 && x + 1 + skew * height > fx + .225 && y - height < fy + .775 && y + 1 > fy + .225) low.add(`${x},${y}`);
      }
    }
    const capDepth = Math.max(.10, Math.min(.34, 1 - height + .20));
    const rows = Array.from({ length: level.height }, (_, y) => [y, y + 1 - capDepth]).flat().concat(level.height);
    const geometry = mode === 'cutaway' ? createRectilinearUnionGeometry(
      Array.from({ length: level.width + 1 }, (_, x) => x), rows,
      (x, sy) => terrain(x, Math.floor(sy / 2)) === 'wall' && (sy % 2 === 1 || !low.has(`${x},${Math.floor(sy / 2)}`)), .13,
    ) : createRoundedCellUnionGeometry(bounds, (x, y) => terrain(x, y) === 'wall', .13);
    return { lowered: low.size, total, groups: [{ geometry, height, capDepth: 1, faces: faces(geometry, height, light) }] };
  }, [level, ratio, mode]);
  const bands: { y: number; content: ReactNode }[] = [];
  if (mode !== 'baseline' && mode !== 'integrated') groups.forEach((group, gi) => {
    for (let y = 0; y < level.height; y++) {
      const rowFaces = group.faces.filter(f => f.y === y);
      bands.push({ y: y + .99, content: <g key={`wall-${gi}-${y}`}>
        {rowFaces.map((f, i) => <g key={i}><path d={f.d} fill={`url(#${prefix}-wall)`} /><path d={f.d} fill="#251d3c" opacity={f.shade} /></g>)}
        <g clipPath={`url(#${prefix}-row-${gi}-${y})`}><use href={`#${prefix}-cap-${gi}`} fill={`url(#${prefix}-wall)`} />
          <use href={`#${prefix}-cap-${gi}`} fill="#e2dcff" opacity=".22" /></g>
        {rowFaces.map((f, i) => <path key={`rim-${i}`} d={f.rim} fill="none" stroke="#f1d9bd" strokeWidth=".022" />)}
      </g> });
    }
  });
  level.objects.forEach(object => {
    const src = object.kind === 'animal' ? resolveAnimalArt(object.species).src
      : object.kind === 'enemy' ? resolveEnemyArt(object.style).src
      : object.kind === 'key' ? resolveKeyArt(object.color).src
      : object.kind === 'door' ? resolveDoorArt(object.color).src
      : object.kind === 'spring-boots' ? ASSETS.springBoots
      : object.kind === 'sword' ? ASSETS.sword : object.kind === 'potion' ? ASSETS.potion : null;
    if (src) bands.push({ y: object.at.y + .90, content: <image key={object.id} href={src} x={object.at.x + .06} y={object.at.y + .08} width=".88" height=".88" /> });
  });
  bands.push({ y: at.y + .918, content: <g key="ame"><ellipse cx={at.x + .5} cy={at.y + .91} rx=".19" ry=".05" fill="#34223e" opacity=".25" />
    <image href={AME_ART.src} x={at.x + .04} y={at.y + .09} width={ameSize} height={ameSize} /></g> });
  bands.sort((a, b) => a.y - b.y);
  return <article><h2>{mode === 'baseline' ? 'Current shallow walls' : mode === 'tall' ? 'Full tall extrusion' : 'Integrated tall wall candidate'}</h2>
    <div className="board" data-mode={mode}>
      <MazeTerrain level={level} camera={camera} wallMode={mode === 'integrated' ? 'tall' : 'depth'} />
      <svg className="volume" viewBox={`${camera.left} ${camera.top} ${camera.width} ${camera.height}`}>
        <defs>
          <pattern id={`${prefix}-wall`} patternUnits="userSpaceOnUse" width={theme.wall.periodTiles} height={theme.wall.periodTiles}>
            <rect width={theme.wall.periodTiles} height={theme.wall.periodTiles} fill={theme.wall.fallbackColor} />
            <image href={theme.wall.src} width={theme.wall.periodTiles} height={theme.wall.periodTiles} />
          </pattern>
          {groups.map((g, gi) => <React.Fragment key={gi}><path id={`${prefix}-cap-${gi}`} d={g.geometry.d} fillRule="evenodd" transform={`translate(${skew * g.height} ${-g.height})`} />
            {Array.from({ length: level.height }, (_, y) => <clipPath key={y} id={`${prefix}-row-${gi}-${y}`}><rect x={-2} y={y + 1 - g.capDepth - g.height} width={level.width + 4} height={g.capDepth} /></clipPath>)}
          </React.Fragment>)}
        </defs>
        {bands.map(b => b.content)}
      </svg>
    </div>
    <p>{mode === 'baseline' ? 'Published wall construction; candidate small dressing.' : `${height.toFixed(3)} tile rise / ${ratio.toFixed(2)} × Ame visible height. ${lowered}/${total} wall caps sectioned across the full map.`}</p>
  </article>;
}

function Lab() {
  const [index, setIndex] = useState(0), [ratio, setRatio] = useState(1.15), [themeId, setTheme] = useState<TerrainThemeId>('sunny-stone');
  const source = CURATED_LEVELS[index]!, [pointOverride, setPoint] = useState<Point | null>(null);
  const level = useMemo(() => ({ ...source, terrainThemeId: themeId }), [source, themeId]);
  const at = pointOverride ?? level.start;
  (window as any).wallLab = { setScene: (i: number, theme: TerrainThemeId) => { setIndex(i); setTheme(theme); setPoint(null); }, setPoint, setRatio,
    snapshot: { projection: 'x+.18z,y-z', ameVisibleHeight, ratio, height: ratio * ameVisibleHeight, level: level.id, at } };
  return <main><header><p>MAZE SO PUZZLE · WORKING VISUAL COMPARISON</p><h1>Tall walls, clear paths</h1>
    <p>Actual approved art and authored terrain. Inspection only: no saves, unlocks or live renderer changed.</p></header>
    <nav><label>Scene <select value={index} onChange={e => { setIndex(+e.target.value); setPoint(null); }}>{CURATED_LEVELS.map((l, i) => <option key={l.id} value={i}>{l.name}</option>)}</select></label>
      <label>Material <select value={themeId} onChange={e => setTheme(e.target.value as TerrainThemeId)}>{Object.values(TERRAIN_THEMES).map(t => <option key={t.id}>{t.id}</option>)}</select></label>
      <label>Height <select value={ratio} onChange={e => setRatio(+e.target.value)}><option>1.15</option><option>1.4</option></select> × Ame</label>
      <button onClick={() => { const points: Point[] = []; level.terrain.forEach((row, y) => row.forEach((t, x) => { if (t === 'floor') points.push({ x, y }); })); const i = points.findIndex(p => p.x === at.x && p.y === at.y); setPoint(points[(i + 1) % points.length]!); }}>Next floor position</button></nav>
    <section className="comparison">{(['baseline', 'tall', 'integrated'] as const).map(mode => <Scene key={mode} level={level} at={at} ratio={ratio} mode={mode} />)}</section>
    <footer>Projection preserves square ground: x′=x+0.18z, y′=y−z. Front walls can actually occlude sprites in this proof. Sectioned caps retain tall front faces and the original solid base. This is a geometry canary; cast, cutaway joins, all actor cases and runtime cost remain under review.</footer>
  </main>;
}
createRoot(document.getElementById('proof')!).render(<Lab />);
