# Balanced walls accepted; relative scale and edge corrections

**Engineering response:** [web0.22.21](../reviews/2026-09-07-v02221-public-verification.md) delivers scale,
airborne layering and perimeter fixes. Generated reward sprites remain queued.
P21 asks about the new corrections; original feedback below is preserved.

Human feedback, September 7, 2026, following published web v0.22.20.

The Human explicitly accepts the balanced 3D walls: the effect looks perfect,
stunning and better than actual 3D. Preserve the interior wall shape and lighting.
This acceptance does not close the newly reported issues below or device QA.

1. Inspect all field sprites in horizontal and vertical corridors. Ame looks too
   large beside most other sprites. Keep lovely large detail, but reduce her if
   other sprites cannot grow while retaining corridor clearance.
2. Power and Science drops are enormously oversized; Gold likely is too. Make
   the rewards appropriately small. Queue generation and replacement with proper
   attractive sprites; current art looks like emoji/ugly placeholder artwork.
3. While jumping over a hole, Ame's head is hidden by the upper corridor's wall
   foreground. Airborne Ame must appear above all walls.
4. Make outer map walls thicker, with thicker tops, so outside the maze is hidden.

Source audit: current reward glyphs are programmatically drawn Canvas shapes,
not platform emoji. This distinction does not invalidate the aesthetic complaint.
Generation/replacement remains explicitly on the backlog; shrinking those glyphs
alone does not fulfill the requested final artwork.

[Current execution](../plans/FIELD-21-scale-jump-and-perimeter.md) prioritizes these
corrections before the remaining mixed chest/Mimic slice. [Queue](../HUMAN_REVIEW_QUEUE.md).
