# WALL-04A candidate — Astra / independent Sol

2026-09-06. Base `67db82cc122d903c815591f5e402ed00b0e0cdfd`;
branch `codex/wall-depth-04a`. Target v0.22.9, not yet published.

Implements the bounded [04-A contract](../LIGHTING_AND_DEPTH_SPEC.md):
internal rounded front faces, signed material-local bevels, floor-only contact,
smaller material repeats, pale moon-slate floor and PT33 ornament/vignette split.
Gameplay, saves, holes, six-tile camera and actor/held presentation are unchanged.

## Evidence and judgment

PT33 was reproduced in the existing build: Rainbow's 696px board had a208.797px
wide animated inset-shadow pseudo. A width/animation-only browser override removed
the line without changing terrain. Twilight has the same selector collision.
Production now gives the ornament its own aria-hidden span; the frame explicitly
resets width/height/animation/transform/opacity. Root inspected before/isolated
screens, all12 corrected material pairs and the actual Sky scene.

Actual Sol independently reviewed canonical edge normals, arc signs, complementary
internal face/top masks, floor/hazard receivers and the reproduced PT33 fix. No
source blocker was found; acceptance is conditional on exact-source browser/native
and release gates. No manufactured physical-device or whole-Plan04 approval.

Root rejected the first square-corner implementation and replaced it with masks
derived from the same rounded wall path. The first gallery reused SSR SVG IDs,
making later samples use the first material: those images are invalid evidence.
The corrected gallery uses unique per-scene identifierPrefix plus a duplicate-ID
assertion. It compares old depth at NEW calibration, not frozen v0.22.8 pixels.

630/630 project tests passed with one worker. A preceding concurrent-load default
run timed out on the unchanged80-seed generator test (629 passed); no timeout,
solver rule or assertion was weakened. The expanded opt-in rack/fixture suite
then passed3/3, adding one normal-suite test. Current-route fixtures derive three
safe ordinary movement segments; no invented or invalid saved game is used.
142 art tests passed; fresh art check reports0 errors/429 disclosed historical
warnings. TypeScript/Vite and `cargo check --locked` passed on the candidate.
Final versioned/frozen evidence will be recorded separately.

Measured pre-version candidate: JSgzip9 158643 versus157169 (+1474); CSS24041
versus23980 (+61); runtime public165031011 unchanged. Root allocated1500/61/0
for this bounded feature, within prototype4000/250/0. Decoded image inventory
411582176B unchanged. Removing the old wall blur and limiting pattern-image
filters does not prove physical GPU memory or iPad smoothness.

Review artifacts live outside delivery in `output/playwright/walls04-rack/`:
actual-component HTML, current-route fixtures, material/cardinal/campaign screens
and browser log. Initial probe sampled `transform` instead of the established
individual `translate`; its36 runs validate frame bounds/zero terrain mutations
only, not moving-camera coverage. Corrected probe must observe camera translation.
Host timing under active agents is report-only, never a clean-host target pass.

Release still requires frozen source, final build/performance/art consistency,
actual native controls/reopen, remote CI/Production and identical public downloads.
Physical P13/iPad, richer continuous corner light, exterior cast, region/ditch
receivers and actor grounding remain open. Reward-first Plan02 follows this slice.
