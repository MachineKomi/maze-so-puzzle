# HAZARD-03 — connected living surfaces

**Delivered web0.22.16:** [qualification](../reviews/2026-09-07-v02216-web-qualification.md),
[actual Sol review](../reviews/2026-09-07-v02216-sol-final-review.md) and
[public verification](../reviews/2026-09-07-v02216-public-verification.md) close
this implementation within the measured Chromium scope. Real Full idle raster
cost and device limits remain explicit. Q04/P18 awaits Human appearance/feel;
LOOT-03 A is next without waiting for that observation. The original plan below
retains its preimplementation status as history.

September7 implementation contract, Astra. Human authorizes this revision in
[v02214 feedback](../user-playtests/v02213-20260907-playtest-feedback.md).
Book completion and MOVE-02 are being qualified first on
`codex/book-completion-hazard-refinement`; published web remains0.22.15.
No new Human decision blocks implementation. This plan is not a delivery claim.

1. Restore a phase-matched floor lip at connected liquid/ordinary-floor edges:
   .04tile clear floor plus a .03tile transition inside the region. Trace the
   union of all non-floor cells, then clip its strokes inside each liquid, so
   material/wall/pit interfaces never acquire a fake safe-floor strip. No per-cell
   seams, blur or morphology. The lean candidate uses two antialiased strokes.
2. Separate dressing eligibility from shadow receiving. Cast and contact shade
   ordinary floor, liquid, transition and lip; real wall footprints and pit voids
   remain excluded. The accepted tall-wall/foreground geometry is unchanged.
3. Remove generic white racing dashes. Prototype seamless drift of the existing
   texture, sparse expanding water ripples, slow lava heat/current and existing
   seeded varied poison bubbles. Keep identity readable at every phase. Texture
   motion can repaint large areas: its cost is measured, never presumed free.
4. Lite, Reduced and Static freeze ambient motion; Lite omits extra surface FX.
   All modes retain base texture, connected edge and consistent wall shadow.
   No new asset/dependency, gameplay RNG, per-cell timer, traversal rule or save.
5. Prove isolated, strip, L, T and ring pools and mixed materials with bright/dark
   floors; shadow samples across interior/transition/lip/floor and pit exclusion.
   Actual campaign journeys at phone/desktop sizes and four modes must pass.
   Inspect phase captures independently, then matched five-pair nonempty idle
   and moving traces against the frozen public15 HTML/JS/CSS, sharing media.

Accept only after exact-source project/build/budget/guard checks, independent
Sol source/pixel/cost review and public verification. Report regressions and
physical-device limitations separately. A bounded byte allocation requires
measured growth, evidence and rollback; timing is a separate decision.

Rollback is the complete hazard renderer/CSS seam to published15, retaining
Book/MOVE fixes and current saves. Optional foot splashes, lava underlight and
gas are subsequent bounded work; this slice must visibly improve the material
and boundary first. LOOT-03 follows qualified delivery, then the preserved
DELIGHT-02B/LEARN-01, connected HOLE-02 and Plan08 pace work.

Record local captures/traces in the artifact ledger. Reuse dist in place; keep
only baseline entry files, not another repository or media copy. No deletion
or archive without explicit Human approval.

Implementation references: [SVG pattern coordinate systems](https://developer.mozilla.org/en-US/docs/Web/SVG/Reference/Element/pattern)
and [even-odd clipping](https://developer.mozilla.org/en-US/docs/Web/SVG/Reference/Attribute/clip-rule).
These inform the coordinate/clip contract; browser phase/raster proof determines
actual implementation behavior, and documentation compatibility is not iPad proof.

First diagonal/four-band pilot was rejected for further optimization: one pair
showed RasterTask+27.34% phone/+41.30% desktop despite steady16.8ms maxima. The
lean candidate uses two wrapped image draws, single-axis drift and two border
strokes. This combined change is not an ablation attributing individual costs.
Final matched five-pair evidence remains required.
