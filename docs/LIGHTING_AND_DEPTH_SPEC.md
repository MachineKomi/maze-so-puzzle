# Wall depth and lighting — implemented WALL-04B contract

## Current Human target — still open for beauty review, web0.22.13

The [latest feedback](user-playtests/2026-09-06-jump-camera-and-tall-walls.md)
requires walls convincingly taller than Ame, clean3D faces and beautiful lighting.
Live0.22.13 implements `04b-section-v1`, independently engineering-reviewed and
[publicly verified](reviews/2026-09-06-v02213-public-verification.md). R1/0.22.11
is still held, never deployed. [WALL-04B](plans/WALL-04B-tall-walls-and-readable-paths.md)
and [qualification](reviews/2026-09-06-v02213-web-qualification.md) own the new seam.
Height0.88814140625tile is1.15×Ame's unchanged visible standing height;
projection `(x+0.18z,y-z)`. True rear/east cap sections preserve tall front faces
while final rounded wall-footprint clipping protects every non-wall receiver.
Five fixed side-light groups, separate cap/side texture mapping, restrained rim
and one floor-only cast establish depth. No new rAF, media, actor plane or rules.
Small seeded dressing uses intact approved sheet regions, natural alpha and no
renderer blur/fade; semantic object/start/exit floor cells remain clear. Full/
Lite/Static keep structural depth. The historical shallow/R1 contracts below
do not override this implemented seam. P13/Human beauty and device limits remain.

## Historical held R1 stronger-relief candidate — v0.22.11, never deployed

The Human found 04-A too subtle and its lower-corner highlight misaligned.
[R1 research/brief](plans/WALL-04A-R1-convincing-depth.md) and
[candidate evidence](reviews/2026-09-06-wall04ar1-candidate.md) supersede the
earlier height, cast and bevel construction below. This is not full Plan04,
physical-iPad acceptance, or proof that the Human's beauty goal is met.

- Top remains `W ∩ translate(W,0,-height)`; side remains `W − top`. Both complete
  original and uniformly raised contour bands supply the top rim. This aligns
  front arcs while retaining the unshifted rear rim; never shift arc fragments
  by their lighting response. Same-response bands share one nonzero fill.
- Profile revision `04a-r1`: height 0.20–0.26 tile, bevel 0.045–0.055 tile.
  Opaque material-colored face plus compressed existing texture makes the
  front read separately from the top. Solid geometry stays inside the original
  wall footprint; one-tile top thickness remains at least 0.74 tile.
- A finite cardinal cast uses a translated cap plus straight/rounded swept
  ribbons in one opacity group, clipped to ordinary floor. Current maximum
  reach is 0.221 tile; absolute cap 0.24. Contact reaches 0.0375 tile. No cast
  paints a hazard/pit or changes traversal; all actors remain above terrain.
- Four additional constant paint paths, no additional wall filters, new media,
  dependencies, CSS, ambient animation, camera/rules/save changes. Group
  opacity can still incur compositing work; do not equate “no blur” with free.
- Full/Lite/Static retain structural depth. The dev-only material rack and
  production camera review cover exact-scale joins and the old ghost-edge
  cases. Local Chromium is not a physical Safari/WebView performance cohort.

If this still disappoints visually, compare a real orthographic 3D wall slice
against the same scene and cost budget rather than endlessly tweaking opacity.
Current research and the renderer-alternative gate are in the R1 brief.

## Historical 04-A delivery

Published v0.22.9 WALL-04A, frozen `cbe8ab879bd58c0a08a770209ebfeb649f684e2b`.
Root Astra implemented; actual Sol independently accepted source/browser/native.
[Acceptance](reviews/2026-09-06-v0229-engineering-acceptance.md) and
[receipt](../release/WALL-04A-v0.22.9-release-verification.json) bind evidence.
This is not full Plan04 completion or an iPad performance claim; P13 is open.

## Player-visible contract

- Raised walls remain inside their original connected rounded footprint. The
  lower/front face is always screen-down, independent of the maze light.
- Exposed normals facing the existing light receive a warm/material-tinted
  inward bevel; opposite normals receive shade. Convex rounded corners use
  three broad response sectors from the canonical arc, never pixel-dependent
  tessellation. Concave corners suppress highlights.
- Small floor-only contact lines, dark side faces and a restrained neutral
  material boundary replace the old blurred displaced silhouette/white halo.
  No shadow covers a hole or hazard. Actor/held lighting remains unchanged.
- Full/Lite/Static use the same structural depth. No new animation or per-frame
  geometry, effect nodes per tile, external texture or dependency is added.
- Existing material repeats become smaller (floors 2.6–3 tiles, walls 2.4–3,
  dressing 5–6.5). Moon-slate receives a pale blue wash so it reads lighter than
  lavender walls. Actual approved pixels were inspected: source mean RGB is
  (96,93,162) versus lavender wall (137,118,212); historical lightness metadata
  alone did not establish the intended hierarchy.

## Implementation boundaries

One trace returns the unchanged `d` plus merged exposed edges from its existing
rounded corners. Two compound paths cover signed bevels; one fixed-view side
mask is the original wall minus its upward-shifted copy, clipped to the wall.
The complementary top mask prevents face/bevel/dressing overlap. Side darkness
responds to the light without rotating the face itself.
Original wall clipping owns final geometry; front bands never cover a path.
No exterior directional cast is a deliberate 04-A limit; richer continuous
corner response/cast/region receivers remain 04-B/04-C.
Catalogue wall entries select a versioned material response (04a-v1), not a
filename/theme switch. Existing legacy source bearings remain exact. No new
light metadata, generator stream, gameplay, content fingerprint or save change.

Terrain and dressing are world-anchored. Material correction filters move from
full-maze painted shapes to their bounded pattern images; wall depth has no
filter. Hazard masks are unchanged. This reduces declared filter extent, not
a measured GPU-memory or physical-iPad claim. `?wallLighting=legacy` compares
old wall geometry at the NEW texture calibration; Git v0.22.8 is the exact
old visual rollback. Memoized geometry ignores ordinary camera travel.

## PT33 ghost line

Reproduced on v0.22.8 Rainbow Power Parade: the theme decoration and viewport
vignette shared `::after`. A 696px board had a 208.797px-wide animated inset
shadow, making a drifting/fading vertical edge at about 30% of board width.
Isolating width/animation removed it without changing terrain. Twilight shares
the same collision. Dedicated aria-hidden ambient decoration now owns the
theme marks; the frame vignette has full bounds and no animation/transform.
Lite still omits the vignette as before and hides its ambient ornament.
The latest Human calls it a right-side line; the reproduced line is the right
edge of this left-anchored fragment. Physical confirmation remains requested.

## Candidate budget and acceptance

Root authorizes at most +4000 gzip9 JS / +250 CSS bytes for this prototype;
zero public/media/decoded-image growth. Allocate measured growth before merge.
Validate unchanged wall silhouettes, outward normals, all small occupancy
patterns, disjoint signed edge bands, fixed-view sides, constant SVG paths,
complete material selection, actual-size pale/dark/foliage/crystal/corridor
scenes, both PT33 mazes in all quality/motion states and fractional travel.
Run full project/art/build/desktop/performance checks. Native smoke and locked
release publication remain separate from browser evidence. Keep physical
iPad movement and whole Plan04 actor/region/corner/continuous-light gates open.
