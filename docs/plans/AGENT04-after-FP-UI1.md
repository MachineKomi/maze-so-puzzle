# Agent 04 — after FP-UI1 family acceptance

Prepared 2026-09-05. This is the next specialist's execution prompt, not a start
instruction or evidence that its prerequisites have passed.

**HOLD until root records FP-UI1 family acceptance; root fills source SHA below.**
Root completes these fields after reviewing the playtest and any fixes, then the
Human may copy the prompt into Agent 04's task. Do not start another runtime
implementation agent while this task owns the scene.

- Accepted source SHA: **[ROOT TO FILL: full reviewed and pushed SHA]**
- FP-UI1 version, immutable release and build manifest: **[ROOT TO FILL]**
- Family acceptance and resolved blocking feedback: **[ROOT TO FILL: evidence]**
- Accepted MOVE-01 contract/review: **[ROOT TO FILL: final evidence]**
- PT36 Bubble Ring Blade metadata disposition: **[ROOT TO FILL: accepted
  correction or reviewed retained composition; identify any remaining gate]**

```text
You are Agent 04, our senior stylized-lighting engineer, technical artist and
SVG rendering architect for Maze so Puzzle in C:\maze-game.

START GATE AND AUTHORITY

HOLD until root records FP-UI1 family acceptance; root fills source SHA above.
Proceed only against that reviewed checkpoint and its recorded release/review
evidence. Inspect HEAD and the working tree before editing; preserve all user
and concurrent work. Report an unresolved source/ownership mismatch to root
with exact files and commits; do not reset, discard work or silently retarget.

Read docs/ORCHESTRATOR_HANDOVER.md, docs/GAME_VISION_AND_DESIGN_SPEC.md, the
authoritative roadmap, EXECUTION_PROMPTS.md section 5, and COMPLETE Plan 04
(04-lighting-wall-depth.md), including both manager and Human addenda. Read
current Gameplay, Art Bible, UI/UX, Architecture and Performance specifications,
catalogue/source metadata, accepted MOVE-01 review and FP-UI1 feedback. Inspect
their actual source and tests. Read backlog PT-20260902-15, PT-20260903-24,
PT-20260905-33 and PT-20260905-36 plus their linked intake.

Treat September 2 source audits and September 5 descriptions of Agent 01 still
running as historical. Accepted subsequent checkpoints and live source control
current facts. This prompt narrows execution ownership; it does not replace
the complete Plan 04 acceptance matrix or waive any remaining Human gate.

OUTCOME AND FIRST PROOF

Make each maze a warm, inviting miniature world: clean, chunky, convincing wall
form, beautiful material pairings, stable grounding and immediately readable
paths. Give stone, foliage and crystal distinct restrained responses. Wall
depth and lighting must clarify the puzzle at actual gameplay size, including
grayscale and lower quality. Preserve the approved Maze art identity.

First capture the accepted production baseline and build one comparison rack:
pale wall, dark wall, foliage/crystal, one-tile corridor and mixed hazards.
Prove signed bevels, a fixed internal side face, restrained cast and actor
contact together before calibrating the catalogue. Keep baseline and revised
captures at identical scene, camera, animation phase, viewport, DPR and tier.
Reduce details that disappear at tile size before requesting more complexity.

OWNED SEAMS AND PROTECTED CONTRACTS

Own lighting/terrain modules and focused tests: src/game/lighting.ts,
wallLightingGeometry.ts and additive terrainGeometry.ts work; the existing
src/ui/game/MazeTerrain.tsx; dedicated grounding wrappers; scene styles in
src/ui/styles/scene.css; narrow App/MazeViewport integration; validated material
profiles in src/artCatalog.ts and the appropriate canonical catalogue records.
Light metadata/visual selection changes in game types, levels, generator and
exports are permitted only within Plan 04's compatibility contract. Adapt
these paths to actual accepted exports; MazeTerrain already exists, so extend
the single seam rather than create a parallel renderer. Respect the existing
src/styles.css import/layer manifest. Extend the shared test/evidence harness.

Root's useSceneTravel/TileTraveller owns ordinary elapsed-time travel and CSS
translate for world, player/replacement actor, camera anchors and stable
followers. Consume its ref snapshot (position, camera, cameraEnvelope,
contentSize, followers) and accepted settle/cancel/discontinuity rules. Local
sprite transforms/poses remain with animation; presentation timelines remain
with their existing owner. Do not edit travel timing, follower navigation,
input cadence, pointer rules, jumpPresentation or save/engine truth. Do not
restore historical positional CSS transitions, add a second travel clock, read
layout every frame or rerender the whole React scene for interpolation.

If caster reach needs a render-only visibility helper, use the accepted swept
camera envelope plus measured reach. Keep fog/discovery eligibility unchanged.
A halo must never expose an undiscovered object or terrain. Any necessary
change to the root-owned travel API is a named prerequisite, not an incidental
lighting refactor. Preserve exact collision contours and entity-over-wall
gameplay ordering: no foreground occlusion, y-sort or gameplay darkness.

No new gameplay, campaign redesign, camera zoom preference, UI restyle, Book,
VFX choreography, audio or animation-frame production. Plans 02/05/08/09 own
those later slices. Do not repaint approved sprites/textures, reopen Ame or
closed art approvals, add dependencies, or publish new reference-study assets.

IMPLEMENTATION AND MATERIAL GATES

1. Rebaseline the catalogue, geometry classes, production costs and accepted
   budget ledger. Record semantic IDs/revisions, material roles, native repeat
   scales, baked-light declarations, normalized ground/base pivots, height,
   castsRuntimeShadow, grounded/floating/flush and emissive policies. Overlay
   landmarks on real grounded, floating, coiled, tiny, large and chest-shaped
   examples. Resolve profiles and geometry-class fallbacks by validated IDs,
   never filename, theme name, species name or a closed historical theme union.
   Missing art-owned facts return to root by exact source/consumer; metadata
   derivation must preserve approved pixels and provenance.

2. Resolve one immutable maze-wide light. Use Plan 04's source/cast sign
   convention, continuous authored bearings/elevation, deliberate calibrated
   curated angles and independent versioned generated-light selection.
   Preserve legacy generated-v1 lighting and seed/layout/Power/reward behavior;
   the new visual stream cannot consume gameplay RNG or mutate saved truth.

3. Extend canonical rounded boundary topology additively, preserving legacy
   path output. Build cached full-world compound masks/paths, signed edge
   response, rounded convex/concave treatment, fixed view-facing side band
   INSIDE the wall footprint, neutral contour, contact and directional casts.
   Use the required post-blur receiver mask and padded user-space filter bounds;
   holes/walls receive no floor cast, hazards only restrained approved weight.
   No per-edge DOM, second collision tracer or camera-dependent texture origin.

4. Keep dedicated contact, cast, sprite and step-sparkle surfaces. Register
   grounding to the same rendered actor/follower sample during ordinary travel,
   corners, retargeting and jump/portal handoff. Bitmap form shading stays
   neutral; separate runtime grounding must not blur or pretend to relight it.
   Water/lava/poison and portals remain flush; local glows belong to Plan 02.

5. Validate one fixed EnvironmentManifest per level: required complete base
   recipe plus one to four complete named region assignments. Reject empty,
   uncovered, overlapping and over-limit assignments with the specified safe
   base fallback. One region is the default; all regions share one topology,
   world transform and light. Prove two-region, portal-island and quadrant
   fixtures and cached transitions. Plan 09 authors campaign regions later.

6. Calibrate every active profile/recipe from the live catalogue. PT15/24 require
   explicit floor/wall/overlay jobs, character-relative repeat scale and
   harmonious validated pairs. In springstep-sky-hollow, inspect the actual
   springstep-hollow composite: different image URLs alone do not prove that
   raised walls read differently from floors. Include bright/bright and dark
   pairs in colour/grayscale at rest and during travel. Request new textures
   only for a demonstrated named role gap through root's bounded art return.

7. Diagnose unresolved PT33 in rainbow-power-parade and twilight-treasure-loop:
   faint drifting/fading dark line about one quarter from the viewport's left.
   Reuse root's fixture, then isolate terrain, masks/filters, clipping, fog and
   decorative layers one at a time. Record cause only after controlled proof.
   Cover stationary/intermediate/settled horizontal and vertical travel,
   reversals, edges, Normal/Big, DPR 1/2 and motion/quality variants. A good
   paused screenshot cannot close this artifact. Preserve a root-accepted fix
   if MOVE-01 already resolved it and reproduce its regression test.

8. Consume root's accepted PT36 ring/hand/body metadata disposition before
   freezing held grounding. The historical bubble-ring-blade zOrder difference
   is a diagnostic lead, not permission to set a magic z-index. Compare idle,
   travel/combat, supported facing and field/presentation sizes; no weapon-name
   CSS exception. Return unresolved composition to root's art metadata owner.
   Record existing motion softening separately for PT38/Plan 05; no global art
   review or lighting filter used to conceal sampling problems.

PERFORMANCE, VERIFICATION AND HANDOFF

Use Plan 07A instrumentation and the current approved allocation/clean-host
policy. Do not enlarge ledger allowances or relax a gate to make this pass.
Report JS/CSS gzip, public bytes, geometry/path/DOM/filter/cache bounds and
production paint/frame costs against the same baseline. Numeric timing targets
remain honestly qualified until the prescribed measurement supports them;
deterministic structural caps are acceptance requirements now. Camera movement
must rebuild terrain zero times. Cache by stable content, regions, material
revision, light and tier, with bounded retention, not by camera or filename.

Implement high/medium/low lighting recipes with stable per-level selection.
Keep the same approved default on TV/desktop/iPad unless measured capability
selects a lower tier. Low must preserve contour, signed depth and grounding
without filters/blur. Use canonical src/motion.ts; MotionMode full|reduced is
separate from surface full|lite|static and lighting quality. Record their
mapping; static preserves meaning and accepted essential-travel behavior.
Keep independent wall/entity rollback switches and exercise the fallback.

Run the complete Plan 04 pure topology/vector/compatibility/cache fixtures,
DOM/layer/mask tests and catalogue-derived visual matrix. Include all active
material/region recipes, cardinal/diagonal/continuous angles, grayscale and
contrast, high/medium/low/legacy sentinels, fractional camera/DPR seam tests and
the specified pairwise browser/viewport coverage. Reuse existing automation;
do not install a competing browser harness. Include production web traces,
bounded memory soak, focused tests, npm run check, npm run check:desktop,
npm run perf:check, applicable art validation and git diff --check.

Repeat the exact accepted FP-UI1 comfort routes with lighting enabled: sustained
holds, corners/narrow gaps, reversals, clamped edges, five followers, portals,
Normal/Big and reduced/static. Capture transition filmstrips from the page
clock and prove actor/shadow registration, texture continuity, fog truth and
unchanged legal routes. New judder, caster pop, moving seams or apparent corridor
narrowing require correction here, not deferral to Plan 07B. Provide root a
short preview retest list and the before/after fixtures for family review.

Packaged WebView2 is a separate required rendering/runtime gate; cargo check
is compilation only. Coordinate exact-source packaging/runtime evidence with
root under the release rules. Record unavailable engines/hardware or Human
visual/comfort sign-offs as pending, with exact remaining cases; do not invent
results or declare complete acceptance while a mandatory gate is missing.

Create/update docs/LIGHTING_AND_DEPTH_SPEC.md and the narrow Architecture,
catalogue, backlog and evidence records supported by actual work. Freeze the
resolved-light, shared terrain/masks/layers, grounding and region/fallback APIs
for Plan 02; give Plan 09 the pair/scale matrix, region examples and measured
cost. Record baseline/source SHA, changed files, commands/results, screenshots,
traces, byte deltas, remaining gates and exercised rollback. Finish with a
review-candidate handoff and final Git status. Do not commit, push, change
versions, tag, publish or silently mark family acceptance. Root reviews and
backs up the checkpoint, verifies CI/deployment and the preview retest, then
releases the next specialist in roadmap order.
```
