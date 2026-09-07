# EXPLORE-25 — spacious maze and folding adventure rail

September7 Human explicitly asks for a non-square maze viewport consuming the
space the HUD does not need, and a narrower compact essentials rail. This scope
supersedes Plan01's square-view/no-shell-overhaul constraint. Astra is the sole
runtime writer on `codex/expansive-exploration`; Sol independently reviews.
Baseline: live web0.22.24, runtime d880b223, recovered clean ba59cd7.

The expanded rail starts at34% of logical available width, bounded360–520px;
compact uses240px, or288px below600px logical height so map and pad can
sit side by side. Content changes do not resize it. Adjust only from actual
dense-rack, phone/tablet/desktop and enlarged-text evidence. Below500px logical height the
objective preview moves to More; the map/pad dock and complete collections stay
visible. Phone and short-layout collection icons are labelled status images,
with full-size inspection buttons in More. Keep Power, currencies,
friends, Bag, minimap, pad and a persistent expand/More control available. More
contains all actions/details and a Classic square view switch. Session-only view
preferences do not modify run/profile schemas. Preserve focus and clear held
board/pad/keyboard input before a mode change. Existing resize settlement owns
movement/jump cancellation; no second camera animation loop.

The maze pane consumes the remainder with square physical cells, not stretched
SVG art. The short viewport axis starts at6 cells; neither axis exceeds12.
On ultrawide panes, the12-cell long-axis cap can bring the short axis below6;
this intentional zoom keeps the whole pane useful and preserves square cells
without growing the backing. Six is a starting scale, not a minimum FOV.
Retained backing rounds outward to whole tiles plus the existing four-cell
gutter. Whole-map lessons fit intact and centred. Fractional viewport extents
are `[left,left+width)` and `[top,top+height)`; legacy right/bottom retain last-cell
origin semantics. A tile becomes known when its centre enters the viewport,
with a1e-7 numerical tolerance. All fog, visible objects, Book discovery and
minimap current coverage share that canonical set, never the rendering gutter.
Folding intentionally exposes more real maze cells. Exploration/discovery stays
monotonic when switching back; Classic reverses presentation, not saved knowledge.

Keep the map and pad in the rail initially: overlays would obscure paths,
pickups and wall depth and add hit-target competition. No new artwork, package,
canvas, animation loop, currency, reward or gameplay collision rule. Initial
incremental JavaScript allowance1500 gzip bytes, CSS within existing budget;
measure actual totals and worst expanded camera surface, not just compilation.

Qualification: unit aspect/bounds/centre-coverage/discovery cases; actual dense
five-friend/seven-slot compositions at1280×720,1194×834,844×390,960×540,1920×1080,
shortest supported phone, safe areas and ultrawide; visible/reachable essentials,
mouse/touch/keyboard toggle, focus, Classic, full tutorial, enlarged text. Prove
camera plane agreement, edge input, midmovement/jump resize, map/Book agreement,
reward conservation, Full/Lite/Reduced/Static. Serial paired exact24/25 moving,
jump/hazard and idle performance must cover the largest viewport; no concurrent
QA during timing. Actual Sol review, relevant project/browser gates and exact
reviewed-head CI precede Git/Vercel promotion. Public bytes and real journeys
verify both origins. Physical Apple/3GB and native acceptance stay separate.

Artifacts: one in-place dist; existing-media-sharing four-file `release-v02224`;
external `maze-game-qa/performance/explore25-*` packets only. Record created files
and bytes in the ledger; no deletion, archive or repository/media clone.

After this direct Human priority, return to DELIGHT-02B A pickup presence and C
post-write earned fanfare, then LEARN-01 including STORY-RESCUE-01. Preserve the
wider roadmap and usable Plan10 Garden dependencies before rare eggs.
