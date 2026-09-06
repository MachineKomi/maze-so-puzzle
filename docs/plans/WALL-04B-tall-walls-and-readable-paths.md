# WALL-04B — tall walls, clean light and readable paths

Prepared 2026-09-06 from the [new Human wall/jump instruction](../user-playtests/2026-09-06-jump-camera-and-tall-walls.md).
**The wall appearance is unresolved.** The Human wants walls that look taller
than Ame, convincing three-dimensional form and beautiful clean lighting; a
2D illusion is acceptable. Finish the already-started jump-camera correction,
then this bounded wall comparison before DELIGHT-02B and LEARN-01. Preserve the
wider roadmap. This wall identifier does not close Plan04's separately named
historical 04-B region/ditch work or 04-C/PT36 actor/held-grounding work.

Astra is the sole runtime writer; actual Sol independently challenges source
and rendered evidence. This brief defines a prototype and selection contract
within the Human's instruction, not a declaration of backend selection,
dependency admission, deployment or Human beauty acceptance. No prototype,
benchmark, dependency installation or runtime edit was performed to write it.

## Evidence and the material change required

### Active implementation refinement

Astra implemented the SVG canary and a production candidate on2026-09-06.
[Candidate record](../reviews/2026-09-06-tall-wall-integration-candidate.md) owns
the exact changes/remaining gates. Actual Sol's fresh visual review found this
SVG approach viable; a mandatory second Three.js implementation is unnecessary
unless the measured SVG result fails. The comparison contract below remains
available as an escalation, not a reason to defer an already viable renderer.

Projection is now explicitly `P(x,y,z)=(x+0.18z,y-z)`, height0.88814140625 tile
(1.15×Ame visible standing height). Fully lowered foreground walls lost the
visual goal in the first canary. The candidate instead sections the rear/east
cap depth while retaining a full-height face and the original collision base.
Mapped rectilinear union coordinates produce real narrow volumes before rounding;
this is not an inflated old relief mask. All non-wall receivers retain their
own visible surfaces and rules, including hazards. Static topology-based sections
fit the projected volume inside blocked cells, so no extra cutaway animation,
actor raster layer, gameplay discovery or hidden-position input is needed.
Validate this stronger geometric constraint and actual actor/held/jump views;
it replaces the initial whole-run-lowering/hysteresis hypothesis below.

The latest Human priority includes crisp sparse dressing with intact source
motifs and no renderer fading, then hazard-surface polish after walls qualify.

Inspected source was `af70dd0fe51e0b1840c33e2c2486f4cea637f024`, with Astra's
jump/camera edits in progress. It is an observation, not a frozen comparison
baseline. Freeze the qualified jump-repair successor before wall measurement.
Re-read current source and the [joint state](../JOINT_ORCHESTRATION_STATE.md)
at assignment; do not compare wall modes across different jump implementations.

- Active `wallLighting.ts` is restored `04a-v1`: height 0.085–0.13 tile. R1's
  0.20–0.26 relief remains a separate held candidate. Neither is Human-accepted
  as the finished appearance. The [new-host decision](../reviews/2026-09-06-new-host-wall-decision.md)
  found +37.4% raster-task work for R1, a trace-work proxy rather than GPU time
  or player latency. Old-host frame regressions remain evidence; later shadow
  isolation did not identify a shadow-specific cause. Do not promote held R1.
- `MazeTerrain.tsx` clips its raised top and side inside the original footprint:
  `top = W ∩ translate(W,0,-h)`, `side = W − top`. Increasing `h` towards a tile
  can erase an isolated one-tile cap. This is shallow relief construction,
  not a tall wall model. Another bevel/opacity variant is not this task.
- The new proof needs a **complete translated top, actual connecting side faces
  and a retained ground footprint**. Projected visual volume may extend outside
  that footprint; collision never does. The Human supersedes the older same-
  footprint visual restriction where it prevents height, not route readability.
- Terrain currently sits below all object/player planes. Moving one entire wall
  layer above them hides actors; leaving it below makes actors appear pasted onto
  foreground faces. Local occlusion/cutaway ownership is part of the wall solution.

Read [LIGHTING_AND_DEPTH_SPEC](../LIGHTING_AND_DEPTH_SPEC.md),
[Plan04](04-lighting-wall-depth.md), [R1](WALL-04A-R1-convincing-depth.md),
[architecture](../ARCHITECTURE.md) and the current source seams before coding:
`src/ui/game/MazeTerrain.tsx`, `src/game/terrainGeometry.ts`,
`src/game/wallLighting.ts`, `src/ui/game/useSceneTravel.ts`, `src/cameraMotion.ts`,
`src/ui/game/sceneGeometry.ts`, `src/ui/stageFit.ts`, `src/App.tsx`,
`src/game/exploration.ts`, `src/game/discovery.ts`, `src/artCatalog.ts`,
`src/ui/styles/scene.css` and `src/vfx/RewardLayer.tsx`.

## Recommendation and primary-source research

**Build one real extrusion model and compare two bounded presentations of it.**
First prove tall form and cutaway with projected 2.5D; compare the same scene with
real low-poly meshes under a fixed parallel projection. Prefer the simpler
production integration only if it achieves the appearance and measured gates.
If 3D is materially better, select it from evidence and integrate the bounded
terrain seam; do not require repeated weak 2D variants first. These recommendations
are engineering/design inferences, not measured claims about either backend.

| Approach / verified capability | Candidate use and tradeoff |
| --- | --- |
| Projected 2.5D polygons, optionally cached Canvas2D | Reuse traced exposed boundaries; project full caps and swept faces with deterministic depth ordering. Flat material normals, coherent contact and cast can convey tall volume without a 3D dependency. Start with bounded polygons, not per-tile CSS transforms or an enlarged old mask. [MDN Canvas optimization](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial/Optimizing_canvas) supports caching repeated/static work; caches still cost memory and need bounds. |
| Low-poly Three.js/WebGL meshes | [ExtrudeGeometry](https://threejs.org/docs/pages/ExtrudeGeometry.html) supplies path extrusion; specify depth, modest curve segments and bevel settings explicitly. Preserve holes/diagonal separation from the canonical loops; avoid default bevel expansion into paths. [InstancedMesh](https://threejs.org/docs/pages/InstancedMesh.html) can reduce calls for repeated geometry/material, while merged exposed runs avoid hidden interior faces. Neither guarantees a faster frame. |
| Fixed parallel camera | [OrthographicCamera](https://threejs.org/docs/pages/OrthographicCamera.html) keeps apparent size independent of distance. It does not automatically preserve today's square ground projection when tilted. Freeze the compensation described below; no orbit, perspective zoom or camera-control package. |
| Light and shadow | [Three.js shadows](https://threejs.org/manual/en/shadows.html) describes shadow-map rendering from light views and its resolution/coverage costs. Start one directional light plus restrained fill and static analytic contact/cast; no real-time shadow map, SSAO, bloom, point-light shadows or postprocessing baseline. A single bounded static map is a separately measured option only if visibly necessary. |
| Resources and lifecycle | Current [WebGLRenderer](https://threejs.org/docs/pages/WebGLRenderer.html) requires WebGL2; transparent sorting is not universally correct and renderer counters are not exact VRAM bytes. [Cleanup](https://threejs.org/manual/en/cleanup.html) requires explicit geometry/material/texture disposal. Test unavailable/lost context and return to accepted terrain without losing the run; [MDN context-loss event](https://developer.mozilla.org/en-US/docs/Web/API/HTMLCanvasElement/webglcontextlost_event) supplies the relevant event/test mechanism. |
| Physical resolution and scheduling | [Three.js responsive rendering](https://threejs.org/manual/en/responsive.html) discusses explicit drawing-buffer sizing and pixel caps. [MDN WebGL practices](https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API/WebGL_best_practices) recommends bounded memory, batching and avoiding blocking hot-path queries. [On-demand rendering](https://threejs.org/manual/en/rendering-on-demand.html) avoids idle redraws; Maze must still render every sample of active travel/cutaway through its existing presentation owner. |

Sources accessed 2026-09-06. No official documentation establishes the fastest
choice on this family's iPad, laptop or WebView. A prototype library version and
lock identity must be recorded before use; this research does not install or
pin Three.js. Keep any experimental dependency isolated from the default bundle
until the runtime owner explicitly admits the measured integration.

## One explicit projection and height contract

Use tile-space `(x,y)` and height `z`, with the existing ground plane unchanged.
For the ground-preserving projected proof define `P(x,y,z) = (x, y − k·z)`.
At `z=0`, tile centers, sizes, camera crop and all ground anchors match current
rendering exactly. This is **oblique/compensated parallel projection**, not a
claim of an unchanged physical overhead orthographic camera.

For comparison, an ordinary pitched orthographic view at elevation `α` projects
`(x, y·sin α − z·cos α)`. It foreshortens the ground; at directly overhead `α=90°`
the vertical rise vanishes. Deliberately compensating the vertical projection by
`1/sin α` yields the first formula with `k=cot α`. A Three.js proof may use this
explicitly compensated orthographic projection with real extrusion/depth, or show
an ordinary pitched view as a separately labelled composition reference. Do not
overlay an uncorrected tilted wall canvas on today's square DOM ground.

Before material tuning, fix the projection, footprint, cap height and camera in
one shared fixture description. Compare two height settings with **projected
ground-to-cap rise of 1.15 and 1.40 times Ame's visible standing ground-to-hair
height** at the same ground reference. These are prototype starting hypotheses,
not approved aesthetic constants. Measure approved visible bounds/ground line,
not transparent PNG dimensions; Ame currently has catalogue `groundLine=0.90`.
Record corresponding model `z` and `k`, with an Ame-height calibration marker.
Do not shrink Ame, fatten walls, widen corridors or change FOV to obtain the ratio.

Caps must retain their complete silhouette above the base. Side faces connect
the same boundary vertices at zero and full height; remove internal shared faces,
preserve holes/concave loops and prevent diagonal contacts becoming bridges.
UV/repeat coordinates remain world/material anchored. Narrow walls remain wall
volumes rather than collapsing into bright ribbons. A top-down base debug overlay
must match authoritative occupancy exactly.

## Readability, occlusion and shared-scene requirements

1. **Local cutaway is a first-class requirement.** Tall foreground walls can hide
   a whole one-tile passage. Prototype a bounded foreground segment/cap cutaway
   that protects the visible travel corridor and relevant actors/objects, while
   retaining a solid, recognizable collision base. Keep unaffected rear/side walls
   tall. Never fade an entire connected maze wall because Ame is near one part.
   Prefer a clean lowered section over layers of ghostly translucent faces.
   Initial rule: select only foreground runs whose projected volume intersects
   the protected visible floor-channel/actor envelope; lower those runs to a
   capped 0.18-tile base section. Protect all visible route choices, not a solver-
   selected path. Keep the selected run through the sampled travel envelope and
   release only after a 0.2-tile clearance margin; compare this hysteresis at
   reversals before admitting it. These values are prototype hypotheses.
2. Protect a continuous central **0.55-tile clear floor channel** through the
   one-tile route fixtures and visible turning junctions; treat this as an initial
   measurable readability floor, not an accessibility standard. Full Ame face/body,
   feet/ground reference, held item, relevant Power badge, cage, key/door cue,
   hazard lip and jump landing remain readable. A wall's base must still clearly
   mark the blocked cell; cutaway must never resemble a new legal opening.
3. Apply one ordering/cutaway rule to Ame, followers, enemies, cages, held art and
   battle/rescue/jump replacements. GPU proof sprites may be unchanged approved
   billboards; they are not new 3D characters. Explicitly prove alpha/depth edges.
   A wall canvas under every sprite is not evidence of solved occlusion. Avoid
   migrating all actor rendering merely to make the first screenshot possible.
4. Derive cutaway from the scene owner's **sampled ground position and swept
   travel envelope**, including the corrected two-tile jump camera, not the
   committed destination or raised sprite head. Use stable segment identities
   and a bounded hysteresis/transition rule so reverse holds and boundary crossings
   do not flicker. Any transition uses existing motion/cancellation ownership;
   Reduced/Static preserves clear structural cutaway without a new animation loop.
5. Do not change six-tile visibility, explored minimap data or Book encounter
   selectors. They are tile-window rules, not optical line of sight. Eligible
   gameplay objects must remain visibly readable; the wall renderer cannot hide
   them and still claim a visual encounter was demonstrated. Cutaway cannot use
   secret positions, reveal unseen actors/shadows, grant discovery or clear fog.
6. Separate extrusion draw overscan from reveal authority. Compute projected
   overscan from maximum rise, cast reach and swept camera bounds; today's one-
   tile gutter is not automatically enough. Clip the final scene at board bounds,
   not at each wall's ground cell. Test top-edge caps and unseen outside casters;
   no new wall/fog leak is permitted to hide a clipping defect.
7. Keep one camera/travel clock and the existing cardinal input owner. Board
   canvas is decorative/pointer-transparent; keyboard, pad, pointer capture,
   modal and portrait cancellation remain unchanged. Verify ground mapping at
   center and all corners to **≤0.5 physical CSS px** through fractional camera
   positions, resize and PHONE-02 scaling. No second raycast movement mechanic.
   Actor shadows/VFX use the same sampled ground anchors; jump height is body
   presentation only, not a new camera focus or collision coordinate.
8. Lighting must describe volume: broad clean top, separate colored side values,
   small stable contact and a directional floor cast consistent with the resolved
   level light. Preserve existing bearings and recognisable approved materials.
   Keep hazard/pit receivers excluded in this wall tranche. No black slabs,
   glistening double rims, baked-light rotations or inflated texture noise.
   Full/Lite/Static all retain tall form and route readability.

If local cutaway reduces practically every visible wall to the old low curb, or
the protected channel hides the tall-wall effect, that candidate fails the visual
purpose. Show the failure and compare the other backend/composition; do not claim
height from the calibration rack while ordinary gameplay still looks unchanged.

## Proposed prototype budgets and fair comparison

These are initial engineering envelopes to freeze with the runtime owner before
coding, not approved increases to `scripts/performance/feature-allocations.json`.
The current byte gate sums all shipped chunks; lazy loading does not erase bytes.

| Resource | Initial proof envelope / check |
| --- | --- |
| New bytes | Projected 2.5D target ≤8 KiB gzip9 JS / 1 KiB CSS; zero new public art. Isolated Three.js proof envelope ≤250 KiB gzip9 added JS including library, with exact measured package/chunk inventory. Any production choice requires an explicit measured allocation; no automatic transfer of this research ceiling. |
| Pixel work | One wall-rendering surface/context; physical board extent × capped DPR, initially DPR≤1.5, ≤1536 per dimension and ≤1.5 million backing pixels. PHONE-02 uses physical transformed bounds. No full-maze DPR bitmap, multiple hidden renderers or postprocessing targets. |
| Geometry / calls | Cache topology on level/material change; no path triangulation on ordinary camera frames. GPU proof ≤20,000 wall triangles and ≤24 wall-related draw calls, including cutaway/cast. Bound active cutaway work by visible scene plus overscan, not full-world cells. Record equivalent polygon/path counts and redraw work for 2.5D. |
| Added resident resources | Initial ≤32 MiB estimated wall-backend resources, including duplicated decoded textures, buffers and render targets. Report dimensions/formats/mip estimates plus observable counters; browser/driver overhead is not precisely measurable VRAM. Reuse approved art; no catalogue-wide preload. |
| Lifetime | After repeated level/mode changes, resource counts return to the named steady cache bound; no monotonic context/texture/geometry growth. Hidden/settled scenes perform no wall-only rAF work. Simulated context loss/unavailability retains the playable accepted fallback and all progress. |
| Moving scene | Freeze paired thresholds against the qualified same-source predecessor. Initial investigation trigger: p95 interval >max(baseline+1 ms, baseline×1.10), p99 >baseline+2 ms, or >25 ms frames up by >1 percentage point. These are regression flags, not proof of 60 Hz or physical-device acceptance. A consistent resource/raster-work increase >10% needs attributed evidence and an explicit value/cost decision, not a silent pass. |

Use the existing paired harness pattern: identical scene, approved bytes,
viewport/DPR, quality, pace, followers, input route and **equal accepted steps**;
warm up, then five measured alternating pairs per qualifying row. Three pairs
may guide an early diagnostic but cannot close the release run-count requirement.
Serialize performance jobs. Include moving camera, cutaway transitions and
jump tracking; stationary screenshots are insufficient. Record frame distributions,
main/compositor/raster work and GPU timing where actually available. Missing GPU
events are unavailable data, not zero cost. WebGL may move work off raster threads;
do not call lower RasterTask totals alone a performance win. Preserve failures,
source/asset hashes, output counts and exact comparison settings in the ledger.

## Smallest useful execution and acceptance

**P0 — geometry/readability canary:** one isolated local comparison page using
actual approved wall/floor/Ame art and frozen live scene data; no default renderer
switch, canonical map/seed/save mutation or production dependency. Compare baseline,
projected tall extrusion and real-mesh proof at matching ground projection,
height and light. Use neutral stone first, then pale/dark, foliage and crystal.
Keep the fixture/projection shared so material/backend differences are honest.

Required scene cases: isolated/L/U/ring/stair walls and diagonal contacts;
near/far horizontal and vertical one-tile corridors; a doorway/turn with key and
Power badge; five followers; pit/hazard adjacency and jump landing; top/bottom
camera limits and fractional reversal. Show actual-size desktop/tablet and phone
views plus grayscale. Include normal tall and local-cutaway states, full Ame
height reference, no misleading zoom crop and all four existing light bearings.

**P1 — choose and integrate one wall seam:** independent source/render review
must identify convincing height and readable routes on actual gameplay scenes,
then compare moving/resource cost. Select/hold/replace with named evidence and
limits. Integrate only the selected renderer/cutaway owner; protect stable geometry,
camera, object anchors, fog, controls and fallback. Add meaningful topology,
projection/occlusion, shared-browser and lifetime checks; run required current
integration/build/art/budget and exact-source release checks. Re-read the jump
repair after merge so no camera fix is lost.

**P2 — qualified delivery and honest feedback:** publish only the qualified
bounded change through the existing Vercel guard. Keep source/backend rollback
atomic and preserve origin-local saves and retained R1 proof. Report native and
physical iPad evidence separately; compilation or desktop Chrome cannot supply
those acceptances. Ask the cumulative wall playtest whether normal walls now
clearly feel taller than Ame and whether any path/object became hard to read.
Engineering review can recommend the result; **only actual Human feedback can
close the Human beauty finding**. Do not wait for a reply to perform independent
authorized engineering checks or create a new mandatory Claude gate.

Open prototype decisions are owned by Astra with independent Sol challenge:
height/projection pairing, local cutaway rule, material-light balance and the
backend whose measured result best satisfies both appearance and readability.
The Human has already given direction; do not ask them to design projection math
or repeat approval for routine reversible implementation choices. After this
wall outcome is qualified, return to bounded DELIGHT-02B, then LEARN-01 and the
preserved programme dependency chain.
