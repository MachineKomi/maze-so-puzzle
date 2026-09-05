# Agent 01 — bounded review correction

Status: root-prepared follow-up for the SAME existing Agent 01 task.
Prepared 2026-09-05. The Human starts it; no task was automatically triggered.
The original candidate is preserved and not accepted or released.

Copy the following prompt into that task after root's planning checkpoint:

```text
Continue your existing Plan-01 implementation from the preserved candidate in
C:/maze-game. Root has completed the first review and is returning exact gaps.
Do not restart the overhaul or discard any work. Read the complete Plan 01 and
addendum, UI_UX_SPEC, current vision/roadmap, and
docs/reviews/2026-09-05-plan01-review.md before editing.

Root's newer planning-only checkpoint(s) descending from 47bfff4 are authorized.
Inspect HEAD/history and verify their committed diffs contain documentation
only; do not reset to 47bfff4. Preserve every concurrent planning file. There
is no other active runtime owner. Report an unexpected runtime HEAD change.

Complete these bounded corrections:

1. Compact-phone visibility and input. At 844×390 and 568×320, normal text and
   the current maximum seven Bag/five friend states must fit without scrolling
   essential statuses away. Use Plan 01 section 9.4's allowed 24–28px
   NONINTERACTIVE status cells, with fully accessible 44/48px contextual/grouped
   details; do not shrink a button below its target requirement. Retain readable
   full Objective, useful minimap, stable logical order, 48px movement/Hint and
   all utilities through the allowed compact More surface. Use the available
   composition choices before requesting a waiver. Where 200%/extreme text needs
   a named scroller, preserve Objective/Hint and movement access using section 9.2's
   dock/sticky contract. Keep primary-device topology and targets intact.
   Add vertical viewport/clip containment, simultaneous-status and role-specific
   target assertions. The present horizontal-only checks and generic 43.9px
   target check do not prove these criteria. Include Normal/Big and safe areas.

2. Restore music compatibility through the existing port. A fresh adapter's
   logical title track is never applied to music.ts because setContext('title')
   returns early. First Play/Home can therefore play DEFAULT_MAZE_TRACK while
   Sound reports the title. Also, replacing the old createMazeMusicPicker calls
   loses accepted shuffled/no-repeat maze selection; story-to-maze always
   selects the first maze pool entry. Root authorizes the smallest current-
   adapter compatibility repair in musicTransport.ts and focused integration
   tests. Keep UI exclusively on MusicTransportPort, preserve existing shuffle-
   bag behavior and prefer unchanged port signatures. Any necessary compatible
   extension must be explicit and tested against current/fake consumers.
   Verify actual selected media URL agrees with snapshot at fresh entry, mute/
   unmute, story/maze/Book/victory/Stay/return and successive/revisited/generated
   mazes. This is not the full Plan 07B crossfade/contextual-engine project.

3. Repair responsive-image failure. CatalogueImage keeps srcSet active when
   replacing src with fallbackSrc, so the browser can keep selecting failed
   primary logo media. It also records resolved rather than actual currentSrc.
   Track the true failed resource and clear/adapt responsive candidates during
   fallback. Test each compact/full v06 logo failure, then full fallback failure,
   with stable live title and actions; preserve approved art pointers/sources.

4. Make long dialogs explicitly keyboard-scrollable. Define a labelled focus
   contract for dialog-body and include it in the trap. Prove Tab/Shift-Tab,
   PageDown/Up and keyboard access to all long Help/story content, followed by
   footer action, Escape and exact invoker restoration. Do not use programmatic
   scrollIntoView as the evidence that a keyboard user can read the body.

5. Close ART-UI-PRESENTATION as a bounded root-owned dependency repair. Root
   delegates deterministic derivative preparation to this SAME task so no
   second runtime/art task runs in parallel. This narrow exception permits
   extending/reusing the established art publisher, source records and catalogue
   variants for ALREADY APPROVED masters only. It does not permit generation,
   redraws, changed silhouettes/style, cropping proof boards or reopening art
   approval. Read the existing processor and reproduce its approved alpha/
   registration from the immutable originals. If a specific source cannot yield
   a faithful derivative, return that exact ID/proof to root; do not invent art.
   Cover the 14 equipment identities inventoried in UI_UX_SPEC: 8 weapons,
   3 keys, Splash Boots, Spring Boots and Antidote Leaf. Publish correctly typed
   presentation candidates (normally 512px for 200px at DPR 2), preserving optical
   HUD delivery. Verify visible subject >=144px at 960×540 and >=96px compact,
   proper alpha/pale details, aspect, metadata, exact sources/hashes and byte
   deltas. Do not merely relabel/upscale prop-field-256. Supply actual-size proof
   sheets for root review. Include exact additional DPR2 earned-reward rendition
   gaps in the return rather than claiming sharpness from a 256px image at 200px at 2× DPR.
   Use a cold browser context to prove exact selected rendition/role/DPR,
   bounded on-demand loading, delayed decode and semantic error fallback.
   These remain candidate derivatives until root reviews the proofs/allocation.

6. Keep the too-strong teaching response fast. Measure the new 2,048-state
   findPowerOpportunities search on demanding real encounters and separately
   record modal-opening latency and main-thread cost. If it delays feedback,
   make exact blocker/Power information available promptly and bound/defer/cache
   optional suggestions without false promises, stale results or changing rules.
   Preserve the engine-witness tests and Required Path fallback on exhaustion.

Root approves the bounded existing UI/font allocation of 4,500 gzip9 JS,
0 CSS and 43,795 public bytes, based on verified candidate hashes/provenance and
9,976-byte combined compressed-code saving. Update its ledger/evidence status
to approved, explicitly tied to this root decision, then remeasure the corrected
candidate. This does not approve extra derivative bytes, new code above the cap,
timing/hardware claims or the whole UI. Report any additional allocation with
exact bytes, purpose, evidence and rollback; never silently raise a limit.

Use existing tests and scripts/performance harness. Run focused regressions,
full project/desktop/art checks, byte gates and the affected browser matrix.
Root reproduced 9 timeout-only failures in the default parallel solver suite on
this constrained host. The single-worker diagnostic still had 3 timeouts
(441 passes); distinguish both failed commands from the agent's earlier pass.
Do not raise timeouts, drop seeds or weaken assertions to hide contention.
Do not run competing heavyweight suites. Record exact new source/build hashes,
requirements-to-evidence, expected injected errors and honest pending physical/
screen-reader/couch/Human rows; update your owned specs/audit/release docs.

Do not implement MOVE-01, future PT32 camera zoom, lighting or later systems.
Do not commit, push, bump versions, package or deploy. Leave a reviewable tree
with exact changed files, proof paths, checks, allocation/art return and rollback.
Root reviews this correction, checkpoints accepted UI, then implements MOVE-01
and publishes the verified FP-UI1 build.
```
