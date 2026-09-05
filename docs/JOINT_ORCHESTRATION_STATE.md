# Maze so Puzzle — joint orchestration state

State date: 2026-09-05. Current operating state for **Sol Astra MsP Collab**.
Replace this state when it changes; keep history in dated records and Git.
Human instructions outrank repository assumptions. This file owns current status;
the vision/specifications own product contracts and the roadmap owns dependencies.

## 1. Checkpoints and acceptance

- Branch: `main`. This review's intake HEAD: `5f7f8c957f1b42095d96248eae3eb77d038768a9`. Only the supplied `docs/user-playtests/` was untracked on entry; source and release were unchanged.
- Frozen UI-03 / FP-UI1 runtime: `68e303da680d5aec0ba71154949c5a2a0d1697ae`, **v0.22.0**.
- Engineering disposition: reviewed, technically verified, committed, pushed and published.
- Human disposition: **POSITIVE, WITH OPEN CORRECTIONS**. Full v0.22.0 feedback and 51 cross-device images have now been reviewed by Astra. The Human reports a huge improvement and likes the desktop/iPad composition; sustained iPad performance, phone scaling and interrupted holds prevent full FP-UI1 acceptance. No blanket defect closure or Amelia/family qualification is claimed.
- v0.21.0 was Human-rejected despite earlier engineering passes. v0.20.1 is the prior comparison baseline, not a claim of universal device qualification.
- No runtime candidate or specialist implementation is active. This transfer changes documentation only.
- This document's handoff commit is discoverable with `git log -1 --format=%H -- docs/JOINT_ORCHESTRATION_STATE.md`; the transfer capsule gives its exact SHA. Intake HEAD above is deliberately not the future commit containing this file.
- On arrival, inspect `git status --short --branch`, HEAD, remote and active ownership. Do not infer a clean tree from this dated receipt.

## 2. Release and deployment

Read-only recheck: **2026-09-05 approximately 13:53 UTC**; full publication evidence is in the [release receipt](../release/FP-UI1-v0.22.0-release-verification.json).

| Surface | Verified identity/status |
| --- | --- |
| Web | [Canonical playable site](https://maze-so-puzzle.vercel.app/), HTTP 200; HTML/JS/CSS bytes still match the frozen locked build. This URL moves with deployment. |
| Runtime deployment | Vercel `6jKMmDnfqkD4b3Kv6gK7X5QTLv6R`, success status `53594785609`, source `68e303d`. |
| Intake HEAD deployment | Vercel `J7GXhSmS2rKMEbuqu6Xm7b677K5B`, success status `53596404458`, source `f1166b0`, dated 11:01:33Z. Documentation-only redeployment preserved runtime bytes. |
| Runtime CI | [33958357582](https://github.com/MachineKomi/maze-so-puzzle/actions/runs/33958357582): verify and desktop succeeded. |
| Intake HEAD CI | [33962177582](https://github.com/MachineKomi/maze-so-puzzle/actions/runs/33962177582): verify `101295844473`, desktop `101295844610`, both succeeded. |
| Windows | `Maze-so-Puzzle-0.22.0-FP-UI1-68e303d-locked-portable.exe`, x64, 173,378,560 bytes, SHA-256 `b230c5681806737e884e1638fce0fdadf1a3155952e35cc5d73b8b76bdf77329`. |
| GitHub | [v0.22.0 prerelease](https://github.com/MachineKomi/maze-so-puzzle/releases/tag/v0.22.0), release `383217101`, published 10:51:24Z; tag points to full runtime SHA above. Four public assets, independently downloaded/hash-checked at 10:52:59Z. Current audit rechecked metadata/digests/local files without repeating the 173 MB download. |

The three text attachments ([manifest](../release/FP-UI1-v0.22.0-manifest.json), [playtest guide](../release/FP-UI1-v0.22.0-PLAYTEST.md), [checksums](../release/FP-UI1-v0.22.0-SHA256SUMS.txt)) are frozen bytes; do not rewrite them. The manifest predates publication; the later receipt closes that state. The portable was built after `npm ci`, with locked Rolldown 1.2.6/Oxc 0.147.0 and locked Cargo. There is no new installer or signing/clean-host/offline qualification.

The transfer push may create a newer documentation deployment/CI run. Check those separately; it does not change v0.22.0's runtime source, release tag or attachments. Capture new evidence in a new receipt, never overwrite hash-bound prior reports.

## 3. Active work and next decision gate

**Immediate next task: GPT-5.6 Sol — HIGH independently challenges Astra's first assessment.** The Human explicitly gave Astra the first turn, superseding the earlier Sol-first capsule. Astra's read-only review and documentation intake are complete; Sol's position and joint dispositions remain pending. No Opus proposal is implemented merely because it appears in a review.

- Read the [complete Human feedback](user-playtests/v0220-playtest-feedback.md), [Astra assessment and 20 acceptance slices](reviews/2026-09-05-astra-v0220-review.md), [current 88-row ledger](reviews/2026-09-05-sol-astra-opus5-v4-disposition.md), [Opus v4](reviews/external/2026-09-05-claude-opus5-maze-so-puzzle-review-v4.md), [focused response](reviews/external/2026-09-05-claude-opus5-v0220-feedback-response.md), [provenance](reviews/external/2026-09-05-v0220-review-pack-provenance.json) and [51-image external manifest](reviews/external/2026-09-05-v0220-screenshot-manifest.json).
- Current Opus v4 names `5f7f8c9`; the earlier v3/fef/uncommitted warning belongs only to the retained historical snapshot. Code claims were selectively reverified. Physical-device cause/timing remains unmeasured in this turn.
- Astra proposes a bounded performance/live-input correction first, then short-height UI/Book/celebration refinements. Proposed writers: Astra for the first slice, Sol for the UI slice; the other reviews read-only. Sol may challenge these assignments and scope. No runtime owner is active yet.
- Human V22-04/09 override the old successful-interaction neutral gate and first/third-bump explanation policy. The controls plan now states the new desired lifecycle; implementation is pending. Other Claude-derived spec/sequence changes await reconciliation, not automatic adoption.
- Sol should record substantive positions, reconcile a narrow next brief for already-requested fixes and name the next writer. Escalate material product choices, not routine engineering decisions. Further Claude review is optional/bounded, not a per-output dependency.
- **Agent 04 remains HOLD** for blocking feedback, joint sequencing and PT36 attachment preflight. A bounded renderer/performance decision precedes further lighting cost. Preserve the remaining programme, particularly 09 → 10 → 11; do not move co-op beyond the release candidate.

## 4. Binding Human decisions and experience to preserve

- Aim for a warm, beautiful, tactile, readable all-ages puzzle adventure: fun, discovery, satisfying rewards and learning through play. Inspirations include Trails in the Sky, Mario Wonder/Party and Kirby; they are quality references, not assets to copy or a quota of effects/menus.
- Landscape iPad and desktop are primary; phones are secondary but must remain playable. Keep authored landscape layouts, with a rotate invitation in portrait. No requirement for a continuously morphing portrait layout.
- Preserve two-stage Title/Home: large logo/actions use the background's left negative space, cast belongs on the right path. Keep approved logo/cast identities and correct cutouts.
- Maximize the existing maze area; **no Big/Normal toggle**. Future zoom is separately scoped: **4/5/6/7 visible tiles, default 6**, Plan 08/PT32, with 07B workload requalification.
- First tap and held movement must both look smooth and feel responsive; gentle acceleration is allowed. No first-tile flash/camera jerk or old hopping gait. Retain precise tile legality unless a later reviewed decision changes it. No full analog rewrite has been agreed.
- Latest V22-04/09: keep genuinely held direction through eligible successful interactions, observing release/steering while paused; never replay queued moves. Failed requirements explain on each fresh deliberate attempt, not once per enemy or only on the third bump. One continuous blocked gesture must not flood modals. Menus, cancellation, blur, hidden pages, disconnects and level changes still clear safely.
- Keep large readable art/type, Ame's Power portrait, useful minimap, cages/faded inventory becoming full colour without tick badges, stable HUD/feedback bounds and the bottom-right tap/hold/drag thumb pad.
- Preserve Book pages, large friend/guardian details, grey real locked achievement art, restrained modality-aware focus, round story portraits, clear primary actions/Enter progression, joyful bounded victory and motion preferences.
- Pickup amounts should be discovered on collection, not advertised in tiny tile-corner labels. Preserve readable post-pickup arithmetic and puzzle-critical enemy/player/gate information.
- Preserve Sound settings and convenient quick mute. Current compact-phone More menu is a declared layout tradeoff for family review, not blanket approval of every phone screen.
- Ame remains recognizably young, blonde and blue-eyed; clean chunky JRPG art uses material-local coloured contours. Do not reopen completed art approvals or resurrect rejected calibration/outline work.
- All 32 friends have authored rescues in the existing 16 mazes and generated eligibility; Unicorn appears in Maze 1 and Tea-Time Skeleton in Maze 2. The tea-drinking skeleton is a friend. Home v05 preserves the corrected horn and adds the expressly authorized precise alpha cleanup; do not restore earlier damaged cutouts.
- Campaign growth is 16→24 (four inserted, four later), with purposeful asset ecology, harmonious floor/wall pairings, deeper intuitive solvable puzzles, varied rooms, optional decisions and gentle teaching. New mechanics require design/solver/family gates; wishlist wording is not immediate runtime authorization.
- Mimic surprise must never create an unsolvable route. Loot colours/sound, room variety, difficulty icons, original cute spooky cast and other wishlist details remain owned by their backlog cards/plans.
- Preserve the original contextual OST and existing music transport. Optional co-op keeps single-player default; greybox/family review must show shared laughter rather than sibling distress before costly production.
- Persistent XP, sprinting, wall hopping and other Plan 14 opportunities are hypotheses, not approved systems. Asset retirement requires copy-first/hash-verified external backup and Human confirmation before removal.
- Future specialists use fresh tasks/current prompts; do not restart old Agent 01 tasks. Do not repeat the earlier Codex-update reminder; the Human deliberately held that update.

## 5. Remaining programme sequence

Completed foundations: 07A measurement; 06 gameplay/save/hints/content identity; 03 art; root 03M music compatibility; 01/MOVE-01 engineering history; UI-03 technical FP-UI1 release. These do not imply every future performance or family gate passed.

After the joint review and required Human decisions, retain the existing sequence until explicitly reconciled/approved:

1. Reconcile the [Astra follow-up proposal](reviews/2026-09-05-astra-v0220-review.md) with Sol; resolve FP-UI1 performance/input/phone blockers and obtain a focused family retest. These slices bring part of 07/08/01 forward without rewriting the whole programme. Resolve root PT36 attachment preflight before 04.
2. **04** lighting, wall depth, terrain topology/regions.
3. **02** VFX, effect lifecycle, feedback and reward showers; then **remaining UI-02** polish. UI-03 already delivered Book/tab/detail/focus/victory foundations; reconcile residual work rather than rebuilding them.
4. **08** normalized input, controllers/Xbox/Steam Deck and bounded zoom.
5. **05** limited sprite animation.
6. **07B** integrated performance/audio/delivery qualification → **FP-CORE2**.
7. **09** campaign expansion/content ecology/deeper puzzles → **FP-CAMPAIGN**.
8. **10** optional co-op/Friend Garden, greybox and Human gate → **FP-COOP**.
9. **11** branding/front-door audit → **13** backlog polish → **12** archive-first asset retirement.
10. **RC-01** integrated qualification → **14** planning-only opportunities → Human-approved follow-ons, if any → **15** final `docs/REUSABLE_AGENTIC_GAME_DEV_PLAYBOOK.md`.

Read the full roadmap, specialist plan and manager addenda before executing. Plan IDs are not execution-prompt section numbers. The prepared [Agent 04 prompt](plans/AGENT04-after-FP-UI1.md) remains unissued/held.

## 6. Evidence completed and practical limits

- Locked project check: **488 tests / 49 files**, TypeScript/Vite passed, 55.85 s. Prior **131 art tests** apply to unchanged art/Python inputs; not rerun after npm lock restoration. Locked desktop compilation and optimized portable build passed.
- Art validation: **0 errors, 430 classified warnings** (420 earlier + 10 proof/master records), not warning-free. Production dependency audit: 0 vulnerabilities; 11 scenario/9 owner/3 report performance contracts passed.
- Browser r6: **62/63**, with an observer race in a short reduced-motion rescue. Helper corrected, **r7 5/5 targeted**, **r8 17/17 UI/proof**, **r9 2/2 fresh/saved Home** (seven landscapes × normal/200% text). Do not report a nonexistent full 63/63 rerun.
- Locked local production **6/6, 46.793 s** and canonical production **6/6, 52.006 s**: movement, saved Home, Book/discovery/reload, dialog/victory and tester-profile isolation. Served entries and all 47 new art files matched expected bytes.
- Exact locked native portable: Title/Home, saved 37→38-step movement, Hint/Escape, normal close/reopen/resume at 38, 960×540 resize/layout; captures 30–37. Native compilation alone was not used as this evidence.
- Bounded modal review: 12 × 2.5 s blur/no-blur samples at desktop DPR1 and iPad-sized DPR2; p95 16.8–16.9 ms, no observed >50 ms frames/long tasks. CPU trace differences are not GPU measurements, sustained performance or physical iPad qualification.
- Static victory: zero active animations and identical screenshots across a 4-second sample; 12 stationary clipped confetti tips were recorded. Full/reduced motion and centered close affordance were separately observed. Compact decorative omissions and 200% accessible reader behaviour are documented, not hidden.
- Final gzip9: **152,379 JS / 23,130 CSS bytes**; public delivery **164,988,031 bytes**. Ceilings **152,557 / 30,227 / 164,988,031**: only 178 JS bytes remain and public allocation is exactly full. Additional work needs measured allocation decisions, not silent budget growth.
- Release documentation and committed proofs are cross-device. Some raw traces, full native captures and private profile backups remain local under `C:/Users/hellb/Documents/Maze so Puzzle/release-evidence/FP-UI1-v0.22.0`; the manifest records hashes/paths. A Git clone cannot reconstruct all ignored/local evidence. Never publish private profiles.

Open risks/gates:

| Area | Current unresolved boundary |
| --- | --- |
| Product/visual/family | Detailed Human findings and 51 images received and Astra-reviewed. Desktop/iPad presentation is strongly positive; V22 correction slices, physical sustained comfort and final family acceptance remain open. |
| Movement/input | Physical touch, single taps/holds/corners, long follower chains and comfort still require family evidence; controller/Steam Deck, couch/TV and screen-reader speech remain unqualified. Plan 08 owns the future canonical input policy. |
| Architecture | Current Opus claims have Astra-side code checks and explicit corrections; Sol assessment remains pending. Preserve scene/coordinate/layer/motion seams, effect cancellation and one writer. No speculative full clock/renderer/hub rewrite is approved. |
| Performance | Tiny remaining JS budget/full public allocation; bounded timing only. Terrain/effects/zoom/animation need integrated low-end sustained measurement before 07B qualification. |
| Solver/content | More mechanics, procedural loops/difficulty and Mimic RNG must preserve solver tractability and solvability. No code-review suggestion is automatically good family puzzle design. |
| PT36 visuals | Ring attachment currently uses layer 1 vs actor 2/other weapons 3; root must review canonical attachment metadata/composition before Agent 04 grounding. Do not infer a renderer defect or fix by weapon-name CSS. |
| Delivery/save | Unsigned portable, no clean-host install or offline qualification. Schema 6 protects future-version saves and preview isolation, but downgrade safety is not promised. |

## 7. Authoritative reading and exact evidence

Read in this order, then only the relevant owned plan/backlog slices:

1. This state, [complete Human feedback](user-playtests/v0220-playtest-feedback.md), [Astra review](reviews/2026-09-05-astra-v0220-review.md), [current source provenance](reviews/external/2026-09-05-v0220-review-pack-provenance.json), [current joint ledger](reviews/2026-09-05-sol-astra-opus5-v4-disposition.md), both linked complete Opus reports and the external screenshots. The earlier initial-feedback/v3 records remain history.
2. [Vision](GAME_VISION_AND_DESIGN_SPEC.md), [roadmap](plans/00-integrated-implementation-roadmap.md), [execution prompts](plans/EXECUTION_PROMPTS.md), [owned backlog](PLAYTEST_BACKLOG.md).
3. [Architecture](ARCHITECTURE.md), [gameplay specification](GAMEPLAY_DESIGN_SPEC.md), [Story Bible](STORY_BIBLE.md), [Art Bible](ART_BIBLE.md), [UI contracts](UI_UX_SPEC.md), [performance budgets](PERFORMANCE_BUDGETS.md).
4. [UI-03 plan](plans/UI-03-fp-ui1-correction.md), [61-row Human intake](playtests/2026-09-05-v021-ui-correction-intake.md), [feedback audit](reviews/2026-09-05-ui03-feedback-audit.md), [root review](reviews/2026-09-05-ui03-root-review.md), [modal-cost review](reviews/2026-09-05-ui03-final-modal-cost.md), [dialog review](reviews/2026-09-05-ui03-dialog-review.md), [inspiration research](reviews/2026-09-05-ui-inspiration-research.md).
5. [MOVE-01 contract](plans/MOVE-01-smooth-travel-and-camera.md), [earlier movement review](reviews/2026-09-05-move01-review.md); UI-03's later correction evidence supersedes earlier claims about first-tap quality.
6. [Release manifest](../release/FP-UI1-v0.22.0-manifest.json), [publication receipt](../release/FP-UI1-v0.22.0-release-verification.json), [family checklist](playtests/FP-UI1-checklist.md), [feedback template](playtests/FP-UI1-feedback-template.md), [release checklist](RELEASE_CHECKLIST.md).

Historical Agent 01 assignments and approvals remain evidence, not instructions to rerun them. UI-03 art additions reuse approved actors: 44 larger actor renditions, authorized Home alpha cleanup and contextual Tessera repair; field identities were retained. Consult publication/provenance records before any later asset work.

## 8. Rollback and recovery

| Checkpoint | Immutable source/release and artifact identity |
| --- | --- |
| v0.20.1 baseline | Runtime `d6b11c026ead3d75565e10490c10307a5a14cfd0`; annotated tag object `04a1f40dd649469db7420828e4159ed0b0bfc1b3` peels to docs receipt `4bca5322b6026e6a03a5b5a0f8e44aac1655d58a`. [Public release](https://github.com/MachineKomi/maze-so-puzzle/releases/tag/v0.20.1) ID `382945842`. Portable 160,436,224 bytes, SHA-256 `1ff30c2d5f58a60a2d4fad44443a1d61d5a3b7df66d4a96e86858e725d2b8777`; installer 154,642,433 bytes, SHA-256 `09208147ae5ffb7ded0640257b6978adb9a79210619e469f821d9d055757f143`. |
| v0.21.0 rejected | Source `2924fd73f60229dd244eeba21c05f66afb4eb8b0` in GitHub history. Local `release/Maze-so-Puzzle-0.21.0-FP-UI1-2924fd7-portable.exe`, 165,352,448 bytes, SHA-256 `9d353f8b055afb883da5cb2bf4f51f7fea669279ed4e946a0acf4e7c69be000c`. **No public tag/release**; historical planned download links are unpublished drafts. Source recovery is cross-device; this local binary is not. |
| v0.22.0 current | Frozen `68e303d` full SHA and published locked artifact in §2. Withheld same-version `2f8fa6a` (Home clipping) and non-locked `68e303d` binaries are not approved substitutes. |

Historical Vercel identities: v0.20.1 `6tAUShfZgbNfnNhcCkCjAjrbMmGi`; v0.21.0 `5MHu8ECwrntLAkCDczWQGun5STib`. Do not confuse those recorded deployments with today's canonical URL or promise their permanent availability.

Use an isolated checkout for historical source; never reset shared main/user work. Preserve and privately back up app profiles before comparisons. FP-UI1 v0.21/v0.22 use `com.ame.mazesopuzzle.preview.fpui1`; v0.20.1 uses `com.ame.mazesopuzzle.preview`. Executable folders do not isolate saves. Do not run older code against newer saves without a recovery plan.

## 9. Sol–Astra collaboration protocol

- The Human manually switches **GPT-5.6 Sol / GPT-6 Astra** in one shared task. Repository records, not either model's hidden context, carry decisions and evidence.
- Both models own the product outcome. Sol's proposed next emphasis is player experience/UI; Astra's is performance/input/technical risk. These are task assignments, not permanent restrictions or claims of inherent model superiority.
- Use **one proposes → the other independently challenges → reconcile → name one writer**. The Human's latest turn explicitly selected Astra first, then Sol. Do not require two full planning rounds for routine fixes. Record disagreements and their resolution; never manufacture consensus or substitute subagents for the other model's review.
- **Only one runtime writer.** Before work, agree one execution owner and explicit paths; the other reviewer is read-only and adversarial. Subagents may help with bounded independent read-only/documentation work; they do not stand in for the manually switched model's joint assessment.
- The Human governs vision, final family/visual/play-feel acceptance and material scope choices. The models lead routine implementation and tell the Human the next useful action. Claude is an occasional bounded independent reviewer, not an implementation resource or mandatory reviewer of every output.
- Before a handoff, update this state, owned backlog/evidence and the joint ledger, inspect exact diffs, run proportionate checks, commit/push a meaningful reviewed checkpoint and verify remote agreement. Preserve unrelated work and immutable release/source-art records.
- Use existing harnesses; do not weaken tests to hide failures. Run expensive browser/art/solver/build work serially on this memory-constrained host and distinguish host contention from product regressions.
- Responses identify the active model (`# Astra:` or `# Sol:`) and end with a prominent next-model/reasoning handoff. The Human requested **Sol — HIGH** next. Do not switch models or create/resume specialist tasks implicitly.
- Sol now reviews the complete current pack against Astra's positions and defines the next bounded correction/owner. No runtime or Agent 04 launch occurred during Astra's documentation checkpoint. A fresh task can resume from this file without reconstructing either prior conversation.
