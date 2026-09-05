# Product intake — adjustable gameplay camera zoom

- Date: 2026-09-05
- Source: direct Human request accompanying Agent 01's completed review candidate
- Status: captured, triaged and routed; no runtime implementation claimed
- Backlog: `PT-20260905-32`
- Owner: future Plan 08; Plan 07B requalifies the integrated result

The Human requests a future option to zoom in by two tiles or out by one tile
from the default view. The intended benefit is a comfortable personal choice:
larger sprites for close inspection, or a little more map context for planning.
The same request reinforces excellent appearance, sound, responsive movement,
performance and rewarding puzzle-led learning across the programme.

The current exploration module defines a six-tile default along each camera
side. The authorized endpoints are **Close — 4 tiles** and **Wide — 7 tiles**,
with **Default — 6 tiles**. Adopt one-tile steps 4/5/6/7 for the controls; the
intermediate five-tile choice is a UX proposal, not an additional Human demand.
“Two fewer” and “one extra” describe the total camera span, not additions/removals
on every edge. A map smaller than the requested span uses an explicit effective
clamp while retaining the player's stored choice.

This is a display-framing preference, not browser magnification, Big mode, free
analogue movement or a new discovery rule. Keep the current legal tile movement
and exploration policy: the wider view shows additional context where already
available, and unexplored tiles stay concealed. Prove Wide displays real known
terrain/objects outside the default crop, not merely an empty band. Changing zoom
must not call a larger reveal window, award discovery, erase prior exploration or change a
solver result. If a later prototype demonstrates that wider discovery is needed
for the intended outcome, present that specific gameplay change for a Human
decision; do not infer it from a camera setting.

Integrate one compact row in the accepted game menu: Zoom in, Default and Zoom
out, with the current descriptive selection and clear disabled limit actions.
All input methods use the same semantic controls; no pinch gesture or
simultaneous chord is necessary. Retain HUD/text/Bag/minimap sizes. Persist a
validated local preference separate from progress, respecting storage failure and Reset
Progress behavior. Browser and Tauri storage remain distinct.

Reuse MOVE-01's single actor/camera owner and current scene-coordinate contract.
Prove edge and small-map clamps, odd/even centring, fog/culling and effect
anchors, pointer targeting, reduced motion, Normal/Big and responsive geometry.
Plan 07B measures the seven-tile visible workload and four-tile sprite/paint
cost at supported DPRs. A choice that makes sprites prettier must still feel
immediate and comfortable while holding a direction and turning a corner.

This feature follows accepted UI, MOVE-01, lighting and VFX in the established
Plan-08 slot. It is **not part of the next FP-UI1 build** and must not delay that
preview's movement-comfort work. Future family evidence should record chosen
view, readability, camera comfort, ease of reset and any effect on route
planning; it is not a substitute for the current stutter correction.
