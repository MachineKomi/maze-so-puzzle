# Human playtest — v0.22.13 wall acceptance and refinement

Source: direct Human message,2026-09-06, during HAZARD-02 qualification.

The Human explicitly confirms that the walls now achieve the intended tall,
convincingly3D appearance and lighting: the direction looks great and is what
they were aiming for. Record this as actual acceptance of the0.22.13 tall-wall
direction, replacing the earlier unresolved depth finding. It does not accept
all remaining wall refinements, devices, native qualification or later builds.

Remaining requests:

1. Vertical walls look much thicker than horizontal walls. Slightly narrow
   vertical walls, thicken horizontal tops and balance their apparent cap widths.
   Retain exactly the same logical tile collision/movement space.
2. Slightly reduce wall height while retaining as much convincing height as
   possible. The Human now explicitly allows walls to overlap about20–30% of
   the tile behind them, including the bottom of Ame/friend sprites and door
   words. Central colour/symbol information must remain playable and readable.
   Partial concealment can support discovery, but may not create gameplay issues.
3. Make cast shadows darker and wider/longer. Improve the accurate but currently
   faint/thin edge highlights so their material and lighting read more clearly.
4. Make the construction convincing for eight light directions: N,NE,E,SE,S,SW,
   W,NW. The duplicated SE in the typed example is read as the intended complete
   eight compass bearings, not a ninth or missing direction.

Next: finish the already-frozen HAZARD-02 release, then WALL-04C refinement before
LOOT-03. The zero-overlap restriction in the older wall contract is superseded
only by this explicit bounded20–30% visual overlap. No collision change,
unbounded hiding, save reset or invented device acceptance is authorized.

[Human queue](../HUMAN_REVIEW_QUEUE.md) separates accepted0.22.13 direction from
the new refined-wall playtest. The camera report is independent and stays open.

## Follow-up: exposed flat texture outside the perspective edge

The Human supplies annotated and unannotated actual-play images showing pale,
unshaded flat wall texture outside the sloping side-face silhouette. Preferred
fix: cut that leftover paint away so the projected wall edge is clean and the
perspective remains convincing. Consistent shading is only a fallback. This is
permission to change rendered coverage, not delete source images or alter tiles.
The current original `.terrain-wall` underlay remains painted behind the tall
faces and explains the visible strips; WALL-04C must remove that residual paint.

Preserved originals: `C:/GameDev/maze-game-qa/playtests/v02213/wall-perspective/`
contains `annotated.png` and `original.png`, copied byte-for-byte from the two
Human clipboard attachments on2026-09-06. No image edit, media publication or
cleanup is implied. The local artifact ledger records the retained input.

## Follow-up: larger visible sprites and physical corridor grounding

The Human additionally requests Ame, enemies, friends, pickups/drops/items scaled
to about5% clearance on each side of a tile (roughly90% visible-art width), with
proportions preserved. Transparent image padding is not the sizing target. Art
may extend above its logical tile; larger beautiful character detail is wanted.
Bodies should render in front of walls behind them, behind walls in front, with
feet slightly covered in horizontal corridors. Place the ground contact midway
between the actual wall ground edges, including the edge hidden by the wall.

This expands WALL-04C to the shared visible-art size/grounding contract, including
held-prop, number/label, follower, pickup/drop and camera-edge checks. The earlier
height comparison against unchanged Ame must be recalibrated after sizing; do
not secretly keep tiny figures merely to preserve that old ratio. Keep logical
tiles, save/rule identity and input stable. No new source art is requested.
