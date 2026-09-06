# Wall depth and lighting — 04-A candidate

Root Astra owns this bounded runtime slice after `67db82c`; independent Sol
reviews it. It is not full Plan04 completion or an iPad performance claim.

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
