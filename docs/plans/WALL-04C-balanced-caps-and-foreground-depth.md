# WALL-04C — balanced caps, foreground depth and eight lights

Authorized continuation of the Human-accepted0.22.13 tall-wall direction.
[Actual feedback](../user-playtests/2026-09-06-v02213-wall-acceptance-and-refinement.md)
supersedes the previous zero-occlusion rule. Finish HAZARD-02, then implement
this refinement before LOOT-03. Root Astra is sole runtime writer; actual Sol
independently reviews source, rendered play and performance.

## Geometry and presentation target

Before the latest sprite enlargement request, standing Ame was0.77230tile high. Sol independently checked that a0.74tile
wall would violate the accepted taller-than-Ame direction. Start the refinement
near0.81tile (1.05×Ame), with0.28–0.29tile rear overlap and roughly0.47–0.48tile
horizontal/vertical cap thickness. The cap-depth constraint is
`1 − projected height + rear overlap`;0.54cap cannot coexist with0.81height and
the Human's0.30maximum overlap. Qualify actual-size renders before freezing.

**Later sizing override:** the Human now requests roughly90% visible-art width
for characters, enemies, friends and items/pickups/drops, preserved proportions
and unlimited-by-tile-square height. Recalibrate the combined scene after this
change rather than preserving the old unchanged-Ame ratio. Ground sprites midway
between physical wall foot edges and depth-sort them in front of rear walls,
behind front walls. Verify every art envelope/held socket, labels, camera edges,
followers and reward burst saturation. This is now part of WALL-04C.

Use canonical exterior union boundaries, rounded after rectilinear mapping.
Inset exposed vertical cap edges and recover horizontal cap depth through the
allowed rear overlap. Preserve holes, concavities, diagonal separation, fixed
projection and every logical collision/interaction tile. No per-actor cutaway,
camera-dependent topology, hidden route or puzzle change.

The Human's subsequent annotated screenshots require removing the exposed flat
wall texture outside the projected side/cap silhouette. For tall mode, retain
the original wall path as logical/coverage metadata but do not paint its flat
underlay. Draw only the physical projected volume; no pale leftover wedges or
unrequested source-image deletion. Verify the marked corner/vertical examples.

The base terrain draws the in-footprint volume. A single pointer-transparent,
aria-hidden foreground SVG draws only genuine rear spill, clipped to the bottom
at most30% of directly rear-adjacent non-wall tiles. Its full-world transform
shares the existing `useSceneTravel` clock and exact camera translation. No new
animation owner, React frame state or layout reads. It must cover lower actor,
friend and ordinary door bodies consistently during movement/battle/rescue/jump,
while leaving top70% centers/faces/Power/key motifs/locks readable. Door/portal
magic, reward receipts and input affordances retain their semantic upper layers.

Increase a single floor-only cast to about0.28–0.32tile reach, opacity0.23–0.25;
strengthen the one directional rim to roughly0.035tile/0.60–0.65opacity. No blur,
filter, whole-scene layer or stacked translucent corner patches. Wall and hazard
planes remain distinct. Darker cast must not hide route/hazard identification.

Add normalized NE/SE/SW/NW vectors to the four existing visual direction literals.
Preserve exact cardinal results and gameplay fingerprints. Story and Surprise
mazes can choose all eight through visual metadata; any generator routing change
is visual only and requires deterministic identity checks. Lighting must mirror
correctly at opposite bearings with equal cast magnitude.

## Qualification and release

- Exact thickness/height/overlap tests, all512 local3×3 occupancy masks, holes,
  diagonals, L/U/ring/stair shapes and original collision/fingerprint invariance.
- Actual foreground coverage never enters the top70% of a non-wall semantic tile;
  no spill on unrelated tiles. Check direct SVG coverage and actual actor renders.
- All eight light directions, representative materials and grayscale; lit/shaded
  sides, convex/re-entrant rim/cast, narrow paths, doors/locks, five followers,
  goals, hazards, camera edges and held equipment.
- Terrain/foreground camera transforms agree within0.5CSS pixel on walk,
  reversal, jump departure/apex/landing, portal/door/battle/rescue, PHONE-02 scale,
  resize, hidden/resume and Full/Lite/Reduced/Static. No landing depth pop.
- Source/solver/save tests, final browser matrix, serialized five-pair moving,
  jump and idle costs versus the qualified predecessor. Investigate attributed
  work increases above10%; do not excuse them with the new laptop. Record bytes,
  owners and traces. New GPU/native/iPad claims require their own evidence.
- Commit/push meaningful checkpoints; one qualified Git deployment, public bytes
  and gameplay smoke, then docs-only closure through the unchanged Vercel guard.
  Log all generated files; no deletion or archiving without explicit approval.

Q01 asks the Human to judge the refined result after deployment. Their actual
acceptance of0.22.13 remains preserved regardless of further iteration.
