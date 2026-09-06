# VFX-02A candidate review

Root Astra, 2026-09-06. Baseline published v0.22.9 / main7ad3816.
Independent [Sol source review](2026-09-06-vfx02a-sol-source-review.md)
found and required absolute-clock, whole-sequence cancellation and visible-radius
corrections. Those are implemented; no remaining stop-level source blocker.
Native/frozen release and physical/Human review remain separate gates.

## Scope and evidence

See [VFX Bible](../VFX_BIBLE.md). Existing committed treasure, potion and combat
events feed one cancellable fixed-budget Canvas. No engine/save/solver, rewards,
drop table, camera, catalogue or public-media change. Combat retains2220ms/three
impacts, conserves each displayed pair and uses its existing typed step authority.
Gold/science homing is into rendered Ame, not the HUD. Science atom is the Human's
requested motif; these are new original code-native effect glyphs, not approved
bitmap replacement art or permanent XP.

- 640 project tests /58 files passed serially before version-only release bump.
- Fresh142 art unit tests passed; current validator0 errors/429 historical
  warnings. TypeScript/build, locked desktop check, exact byte contracts and
  production audit pass. A post-version project rerun is separately recorded.
- Production24-case matrix: Gold, Science, potion and combat across desktop/
  tablet/phone, DPR1/2, Full/Lite/Static/reduced. Exact saved game equals the
  current engine outcome; combat pairs conserve Power; no broken images/errors,
  no terrain mutations. All natural Full/Lite representatives arrived; static/
  reduced had zero motion. Backing store returns1x1.
- Four additional production cases exercise continuing movement/reversal,
  resize, focus switching and Home during combat. Moving Gold arrived8/8;
  resize and Home cleared the owner and every committed combat result persisted.
  A browser tab switch is not assumed to deliver physical blur/visibility; its
  observed state is recorded separately and no hidden-tab claim is inferred.
- Real React/Canvas/rAF harness:100 cancellation cycles, queued future contacts,
  fresh event after cancel, preference teardown/remount and unmount. Zero pending
  animation callbacks/old tokens afterward. Synthetic blur is not a physical
  hidden-tab test; production/native navigation is separately qualified.
- Same24-glyph/trail/shadow/group-label renderer comparison: Canvas1 node, DOM97.
  Drawing-work p95 approximately0.8ms vs1.0–1.6ms; both frame p95 around17ms.
  Browser Paint event totals0.121/0.147ms vs75.684/67.24ms over3.4s passes.
  Canvas GPU/draw work is not represented by Paint events; do not call it free.
  Canvas trades bounded backing memory for fewer nodes and lower observed work.

External evidence: `C:/GameDev/maze-game-qa/releases/v02210/` contains
`before-inventory.json`, `candidate-inventory.json`, `project-tests.txt`,
`browser-final-matrix.txt`, `lifecycle.txt`, `renderer-equivalent.txt`.
Scripts/fixtures are source controlled under `scripts/art_review/reward-*`.
Photos in `output/playwright/rewards/` are excluded delivery evidence.

Rejected/limited cohorts: initial5tile/sec homing missed legitimate stationary
arrivals, now fixed with bounded14tile/sec/8ms steps. Early mid-effect screenshot
capture stalled rAF and expired effects; it is not natural completion evidence.
The first DOM comparison omitted trails/shadows/labels and is superseded by the
equivalent-workload comparison. Loaded-host traces do not qualify iPad/clean-host
performance, acoustic mix, or complete Plan02.

## Budget and rollback

Prototype authorized6500gzip9 JS /600CSS /0public. Final measured allocation
2700/0/0 covers measured2645JS growth,386CSS saving and0public growth; no package/media
or decoded-image inventory. Temporary Canvas<=1536x1536 (9MiB maximum), atlas
three64px canvases, one owner, Full24/Lite12 shared tokens. Whole-sequence cancel
owns future emissions, frame and the bounded sound handle; no per-token timer.
Rollback the full rendering/audio/typed-timing seam to cbe8ab8/v0.22.9. Existing
save schemas/data remain readable and no migration or asset deletion is needed.
