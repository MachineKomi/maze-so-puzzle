# WALL-04A-R1 — convincing depth without losing the paths

Owner: Astra implementation, Sol independent review. Base: `feb04e1` / web0.22.10.
Status: research complete; bounded prototype in progress, not visual acceptance.
Human source: [depth/discovery intake](../playtests/2026-09-06-depth-discovery-and-celebration.md).

## Diagnosis and recommendation

The current side is only0.085–0.13tile and translucent. More importantly,
`MazeTerrain` defines the top as original wall intersected with a uniformly
upshifted wall, while `buildWallLighting` shifts only south straight edges and
some corner sectors. These are different surfaces. Merely increasing brightness
or blur cannot fix the mismatch. This source diagnosis is high confidence;
physical device cost remains unmeasured.

First compare a materially taller **storybook relief** using existing approved
textures: clear top, substantial colored front face, matched rounded rim,
short directional cast and tight contact. Preserve orthographic grid/readability.
This is a bounded next delivery, not closure of all Plan04 or an iPad fix.

## Current primary-source research (accessed 2026-09-06)

| Approach | Useful property / cost | Maze decision |
| --- | --- | --- |
| Connected SVG relief | Reuses current topology, art and one camera; few compound shapes. Full-world masks may still incur raster cost. | First implementation/proof: correct geometry and stronger art direction, no new renderer. |
| Cached Canvas2D terrain | Pre-render repeated/static work, separate static and changing layers. Scaling and large raster surfaces still require bounds. | If the same camera-route trace implicates SVG paint, compare a bounded-resolution cached terrain surface, never an unbounded full-maze DPR texture. [MDN Canvas optimization](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial/Optimizing_canvas). |
| Cached/batched GPU 2D | Pixi can cache a complex static container to a texture; caching trades memory for repeated scene work and requires explicit refresh. | Alternative controlled backend prototype, not a guaranteed speedup or an added dependency now. [Pixi texture caching](https://pixijs.com/8.x/guides/components/scene-objects/container/cache-as-texture). |
| True3D orthographic walls | Real top/side normals with no distance-size variation. Perspective changes size with distance. | If relief still fails visually, compare low-poly extruded merged wall meshes under a fixed orthographic camera first. Perspective is an optional separate composition experiment; preserve input-to-grid mapping and sprite readability. [Three.js cameras](https://threejs.org/manual/en/cameras.html). |
| Dynamic3D shadows | Shadow maps render from the light as well as the view; resolution/coverage trade quality, memory and work. Point lights require six shadow views. | Start3D proof with one light, baked/static contact/cast or one bounded static shadow map; no many-light realtime shadows, SSAO or full-screen bloom as baseline. [Three.js shadows](https://threejs.org/manual/en/shadows.html). |

The technology recommendation is an **inference** from these constraints and
our source, not a cross-device benchmark. No primary source proves SVG, Canvas
or WebGL is fastest on this family's iPad8. The visual goal is not negotiable;
switch approaches if a bounded fair comparison shows a better result.

## R1 implementation contract

- Same connected rounded footprint, unchanged rules, camera, fog and sprites.
- Define top as `W ∩ translate(W,0,-height)` and side as `W − top`.
  Construct top bevel from both exact boundary bands, clipped to that same top;
  uniform transforms apply to whole arcs, never normal-dependent arc fragments.
  Union same-response subpaths before opacity, avoiding doubled vertical glints.
- Compare stone/crystal height0.24–0.28, foliage0.18–0.22 and bramble0.22–0.26.
  The old0.16 cap is superseded for this reviewed comparison only. All solid
  faces stay insideW; retain at least0.65tile top thickness on one-tile walls.
- Colored side shading strong enough to read as a face, not a transparent stripe.
  Keep approved material texture visible; no near-black wall masses.
- Floor-only directional cast with connected coverage and maximum0.24tile reach;
  zero new blur/filter, no hazard/pit paint. Separate short contact from cast.
  One-tile path center remains unobscured; actors/pickups remain above terrain.
- Full/Lite/Static retain structural depth; no new ambient animation, timer or
  per-frame geometry. Zero media/dependency/generation/save growth.
- Provisional incremental ceilings: +2000JS gzip9, +100CSS gzip9, ≤4 additional
  wall paint paths, zero filters; allocate measured bytes before promotion.

## Acceptance and escalation

Render baseline/R1 at gameplay scale on pale stone, dark dungeon, foliage,
crystal, bramble, isolated/L/U/ring/stair walls and one-tile corridors. Inspect
both lower and upper arcs, grayscale readability and all four light bearings.
Exercise fractional camera travel, reverse/edge holds, hazard/pit adjacency,
Full/Lite/Static and small/large viewports. No new halo, doubled rim or moving
line. Count added SVG nodes and verify path/pattern invariance during travel.
Run pure geometry/render tests, project/build/desktop/performance checks and
independent review. Publish only an evidenced bounded candidate; ask Human P13
whether it is now convincingly raised. Report physical iPad acceptance separately.

If R1 is still visually underwhelming, the next action is a **same-scene true3D
orthographic comparison**, not another tiny opacity tweak. Prototype outside the
default renderer, cap resolution/draw calls, test context loss and DPR/resize,
compare cold load, memory, camera frames, path occlusion and same approved art.
Select on visible quality plus measured target-device behavior. Do not rewrite
movement, collision, saves or all assets as a side effect.

Rollback R1 atomically to `feb04e1`; keep the original wall mode diagnostic and
current approved assets. Native0.22.10 remains a separate unfinished release
qualification, not silently considered complete by this newer web checkpoint.
