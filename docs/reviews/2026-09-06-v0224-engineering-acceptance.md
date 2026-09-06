# v0.22.4 V22-RESCUE1 — final engineering acceptance

Date: 2026-09-06. Frozen runtime: `45d843774d0335aa0ae1ee51aa9ca2f70f235b31`.
Decision: **accepted for a versioned family preview**. Publication/download
verification is recorded separately; this is not physical-device acceptance.
Actual Sol implemented PLAY-B; Astra independently reviewed and qualified the
frozen integration. [Source review](2026-09-06-play-b-astra-review.md).

## Delivered and compatible

Adjacent rescue commits exactly one rescued ID while Ame stays visible at the
original tile and movement steps remain unchanged. The friend joins from the
cage; later input can turn away or enter the cleared tile. Unresolved cages are
not remote hole-jump landings. Zero-step rescue progress gets navigation guards.
Loose pickups remain walk-over interactions.

Rules revision2 changes every authored fingerprint. **All sixteen unfinished
old-rules campaign saves restart through updated-maze messaging.** Durable
completions, unlocks, friend/reward/currency records remain. Earlier best results
stay historical. Generated runs were already not persistent. No save schema,
content layouts, media, dependencies, camera or audio changes are included.

## Frozen qualification

- Fresh locked install: Rolldown1.2.6 matches lock; production audit zero findings.
- `npm test -- --maxWorkers=1`: **533/533**,50 files.
- TypeScript/production build passed, including native beforeBuild.
- Deterministic performance gates: JSgzip9 **155090/155113**, CSSgzip9
  **23563/30280**, public **165031011/165031011**. Eleven scenarios valid.
- Art qualification inherited from frozen v0.22.3:136 tests, zero errors,
 429 declared historical warnings. Approved assets, art pipeline, requirements,
 source records, catalogue and resolver inputs are byte-unchanged. Not a new run.
- Locked Cargo check and optimized no-bundle Windows build passed.
- Fresh canonical production browser: **22/22** existing journeys, covering
 Home, save/Book/story/reward, all paces and stationary rescue held/released,
 Full/Lite/Reduced/Static, hidden cancellation and zero-step reload.
- Actual Windows portable, WebView2 **152.0.4191.62**, fresh synthetic profile:
 52 in-presentation visibility/origin samples, one rescue, unchanged steps,
 turn-away/return/cleared-tile entry, same run/rescued ID/settings after normal
 OS close/reopen. Two normal closes observed; interrupted automation resumed
 only after Human authorization. No private Human profile changed.
- Native preferences restored Zippy, Music12%, SFX64%, including muted adjustment.
 Inherited AUDIO-01V graph evidence remains valid; UI tests are not listening.
- Exact-source CI **34004670826**, verify/desktop success; Production deployment
 **6287989870** success; raw canonical HTML/entry JS/CSS match final native dist.

Source/stage/attachment executable: **173424640 bytes**, unsigned Windows x64,
SHA-256 `9888f8f2bbd4f6c2f6210e3eecf0104d852f3928cc03a74b338772647e28e7c0`.
External evidence: `C:/GameDev/maze-game-qa/releases/v0224`.
The release manifest binds exact logs, native fixture/summary and browser reports.

## Retained failed attempts and honest limits

The first project-check invocation misplaced the serial-worker argument; its
parallel launch was stopped and rejected. The correctly serialized full run above
passed. Tauri touched Cargo.toml metadata, but raw bytes exactly matched HEAD;
refreshing the index cleared the false dirty-source gate without source changes.
The fixture initially required a reverse move into a wall and correctly failed;
the corrected finite engine search selects an actually legal turn-away route.

Native attempt1 incorrectly treated the existing rescue-cheer pose transform as
tile travel. The observer now separately checks unchanged layout/individual
travel-translate, visibility, engine state/steps and a within-origin-tile pose
bound. Attempt2 passed; the original failed record is retained. This corrects
test semantics, not the runtime or the allowed movement rule. No error was
waived by disabling the cheer. Computer Use stops/normal cleanup are not passes
for the still-broken Title Exit button.

Sol's broader candidate evidence remains separate:95 passed/3 unavailable-route
skips,19 focused and2 final save checks. Not every possible player route was
tested. No native sustained performance, physical iPad efficacy, acoustic mix,
signing, installer, offline or clean-machine qualification is claimed.
The Human's quick pace feedback is positive; iPad camera stutter remains open.
Native Title Exit and phone UI remain queued. v0.22.3 is immutable rollback;
do not run older binaries over newer saves without a private backup.

