# Tall walls, small dressing and jump camera — local0.22.13 candidate

Astra,2026-09-06. Branch `codex/jump-camera-delight`; runtime dfe04a93.
**Final update:** [web qualification](2026-09-06-v02213-web-qualification.md)
records654 project tests,33 current-source browser cases, three five-pair
comparisons and actual final Sol review. Engineering release-ready within that
scope; public deployment and Human beauty closure remain separate. The earlier
candidate narrative below preserves the implementation and qualification sequence.
The [Human intake](../user-playtests/2026-09-06-jump-camera-and-tall-walls.md)
and [WALL-04B](../plans/WALL-04B-tall-walls-and-readable-paths.md) own the target.

The first actual SVG canary proved that full tall caps obscure Ame and routes.
Lowering whole foreground cells restored visibility but lost height. A real
dollhouse section retains full-height front faces and trims cap depth instead.
The integrated renderer maps nonuniform axes before tracing/rounding the cap
union, exposes five fixed side-light groups, uses separately mapped cap/side
textures, restrained directional rim and one floor-only cast path. Height is
0.88814140625 tile:1.15×the unchanged standing Ame's visible height. Projection
is `(x+0.18z,y-z)` with identical ground/camera coordinates. Original solid wall
footprints remain beneath the volume; a final silhouette clip protects rounded
corners. No per-frame triangulation, extra rAF, renderer, dependency or new media.

The static section protects all non-wall receivers, without asserting they are
walkable. Hazards/pits retain their own art and engine rules. This removes the
need to dynamically fade walls around secret actors or use a second actor plane.
The projected-cap test samples every authored campaign boundary. Final actual
body/held/door/hazard/jump and camera-edge renders remain required.

Dressing reuses intact regions from the four approved source sheets through SVG
viewBoxes. Details are0.12–0.42 tile, opaque at renderer level with natural alpha,
deterministically thinned over a12-tile pattern. Vines retain their orientation.
Floor dressing excludes every authored object/start/exit cell as well as existing
wall/hazard/pit receiver exclusions. Source files and their provenance are unchanged.

The jump repair uses one existing travel clock for ground/camera and three local
pose animation handles. A real Static→Full test caught a cascade-layer race:
the later comfort layer recreated CSS handles after the child layout binding.
Only those three pose nodes are now exempt from the root comfort rule; committed
game-stage Reduced/Static attributes control them synchronously.13 jump/interaction
browser cases passed on that corrected predecessor; the integrated wall candidate
still requires its own source-matched browser/performance review.

Actual Sol independently found the projected approach viable in fresh canary
renders, and requested cleaner light/UV seams and sparser dressing. Those requests
informed the integrated source; final review is pending. It is not Sol acceptance
of this newer source. No iPad/native/Human beauty success is inferred.

Current build succeeds: JS594,615B /164,431gzip9, CSS119,481B /23,895gzip9.
Against live0.22.12 this is +1,982gzip9 JS and -21gzip9 CSS; public media unchanged.
These are candidate observations, to be refreshed after any source change.
The jump allocation is500JS bytes; root admits an additional bounded2,000JS bytes
for this wall/dressing seam, within the earlier8KiB proof ceiling. Moving work
and source/browser checks must qualify before promotion.

Retained visual iterations live under `C:/GameDev/maze-game-qa/art-proof/`:
`tall-wall-lab-20260906`, `tall-wall-section-20260906`,
`tall-wall-volume-20260906`, `tall-wall-lit-20260906`, and
`tall-wall-integrated-20260906`. Earlier failed variants are not release evidence.
Only the last folder renders the integrated candidate in its right-hand panel;
the left panel retains old walls but already uses candidate dressing. It is not
an old-dressing comparison or a production gameplay/performance proof. All outputs
are retained for review; no deletion/archiving is authorized.

Next: verify actual gameplay/actors and geometry, source-matched broad checks,
five matched moving pairs per qualifying viewport, genuine final Sol review,
then one qualified Git-integrated web deployment and public-byte verification.
After walls, the Human's lava/water/poison polish takes visual priority before
returning to DELIGHT-02B/LEARN-01 and the wider preserved roadmap.
