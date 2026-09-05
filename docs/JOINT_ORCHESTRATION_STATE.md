# Maze so Puzzle — joint orchestration state

State date: 2026-09-05. Current operating state for **Sol Astra MsP Collab**.
Replace this state when it changes; keep history in dated records and Git.
Human instructions outrank repository assumptions. This file owns current status;
the vision/specifications own product contracts and the roadmap owns dependencies.

## 1. Checkpoints and acceptance

- **Published current preview: v0.22.1 V22-PERF1**, runtime/tag source `8442b79db11a59e23f23c59f213116e7b8f54592`. This is the independently accepted R1 runtime `91678d1a7f97055dc2f167f8a3e7106226817306` with only seven coordinated version fields changed across six files.
- Sol's pushed review checkpoint is `c19128b7a45bc2179370bf55cfc8ab5851dbf008`; its [R1 verdict](reviews/2026-09-05-sol-v22-perf01-r1-review.md) accepts preview promotion, not sustained performance or physical-device success. Original [candidate](reviews/2026-09-05-v22-perf01-candidate.md), [R1 response](reviews/2026-09-05-v22-perf01-r1-response.md), rejected attempts and hash-bound measurements remain history.
- Astra completed the bounded publication transaction from an isolated worktree. Main fast-forwarded from `461cab02b065a1d0f654c49189ed24108c22c5a8`; frozen attachment documentation is `487afcffb2f91b433f79cc67d5ce4fd29a013552`. Later publication documentation is separate. The [receipt](../release/V22-PERF1-v0.22.1-release-verification.json) binds the immutable public artifacts and exact runtime CI/deployment.
- Frozen prior UI-03 / FP-UI1 runtime is `68e303da680d5aec0ba71154949c5a2a0d1697ae`, **v0.22.0**. Its tag, release, four attachments and earlier binaries are untouched. v0.21.0 remains Human-rejected; v0.20.1 remains a comparison baseline.
- Human disposition remains **POSITIVE, WITH OPEN CORRECTIONS**. The praised desktop/iPad composition is preserved. Sustained affected-iPad performance, phone scaling and later interaction/UI corrections are not accepted by publication. No Amelia/family qualification is claimed.
- Release worktrees use locked dependencies and external browser tooling, without Playwright junctions in their dependency trees. The original candidate checkout's ignored tooling junctions remain local-only history. Native QA used a hash-verified private copy of the FP-UI1 profile; all 334 original files remained unchanged.
- Discover this handoff's exact documentation commit with `git log -1 --format=%H -- docs/JOINT_ORCHESTRATION_STATE.md`. Inspect branch, HEAD, origin and `git status --short --branch` on arrival; dated receipts do not imply the current checkout is clean.

## 2. Release and deployment

Public download verification: **2026-09-05T21:00:52.875Z**. See the immutable
[manifest](../release/V22-PERF1-v0.22.1-manifest.json), short
[playtest note](../release/V22-PERF1-v0.22.1-PLAYTEST.md),
[checksums](../release/V22-PERF1-v0.22.1-SHA256SUMS.txt) and later
[publication receipt](../release/V22-PERF1-v0.22.1-release-verification.json).

| Surface | Verified identity/status |
| --- | --- |
| Web | [Canonical playable site](https://maze-so-puzzle.vercel.app/), HTTP 200, visible v0.22.1; exact raw HTML/JS/CSS parity with the clean same-SHA LF-entry web reference. Canonical URL moves with deployment. |
| Runtime production deployment | Vercel `6XHZa3JELH5SKtUoGc1j2X8Src4c`, success status `53609530882`; GitHub Production deployment `6285663984`, exact runtime `8442b79`. The earlier same-source Preview deployment is separately identified in the manifest. |
| Runtime CI | [33991271551](https://github.com/MachineKomi/maze-so-puzzle/actions/runs/33991271551), exact `8442b79`; verify `101373827057` and desktop `101373826857` both succeeded. |
| Windows | `Maze-so-Puzzle-0.22.1-V22-PERF1-8442b79-locked-portable.exe`, unsigned x64 PE, file/product version 0.22.1; **173,379,584 bytes**, SHA-256 `8e1e2e692efc38823bc32e56c3d559db3fe2bc8e8c27830340fbed4f567ac92c`. Source/stage/final bytes match. |
| GitHub | [v0.22.1 prerelease](https://github.com/MachineKomi/maze-so-puzzle/releases/tag/v0.22.1), release `383372738`, published `2026-09-05T21:00:39Z`; lightweight tag targets the full runtime SHA above. Exactly four public assets were independently downloaded and byte/hash checked. |

The native build passed `cargo check --locked` (2m26s) and an optimized
`tauri build --no-bundle --ci -- --locked` (10m31s). The 24.5-second actual
Windows WebView2 smoke verified Title→Home→existing saved maze, a real
solver-derived normal battle with held continuation, release stopping movement,
normal close/reopen/resume at ten steps and the true 960×540 client minimum.
This is functional evidence, not native performance qualification.

Windows checkout CRLF produced different HTML line terminators from Vercel's
committed LF source. The native portable remains immutable. A second clean
same-SHA reference with committed LF entry HTML passed a separate 493-test/build/
static check and exact canonical HTML/JS/CSS comparison. Both builds' JavaScript
and CSS are byte-identical; their separate source/dist fingerprints and original
failed comparisons are recorded. No normalized-byte match substitutes for the
canonical raw-byte check.

Final gates: **493/493 tests across 49 files**, four scenario fixtures, TypeScript/
build, **87 input passes / two unchanged unavailable authored fixture skips**,
shared browser cohort **1/1**, canonical saved-run/input journeys **26/26**,
locked native compile/build/smoke, production audit **0 vulnerabilities** and
`git diff --check` passed. JS gzip9 **153,261 / 153,307** leaves **46 bytes**;
CSS **23,512 / 30,227**; public **164,988,031 / 164,988,031**. No new allocation,
asset, dependency, content or save-schema change was made.

The three text attachments are frozen before upload; do not rewrite them.
Documentation-only later deployments must be identified separately from the
runtime tag and verified to preserve these runtime bytes. The FP-UI1 namespace
`com.ame.mazesopuzzle.preview.fpui1` is preserved for the comparison run.
No installer, signing, clean-machine, offline, physical-iPad or family acceptance
is claimed. Raw evidence and private profile copies remain external under
`C:/GameDev/maze-game-qa/releases/v0221`; private profiles are not published.

## 3. Active work and next decision gate

**New physical feedback, 2026-09-05:** the Human's
[v0.22.1 web playtest](user-playtests/v0221-playtest-feedback.md) reports buttery
smooth movement on their phone, but severe movement lag on an eighth-generation
iPad from Maze 2 onward, despite smooth Maze 1, menus, stationary interaction
animations and prompt BGM. The iPad has 32GB storage, not a reported RAM value.
The later [minimum-settings follow-up](user-playtests/2026-09-05-v0221-graphics-minimum-follow-up.md)
reports only slight relief; phone model is Samsung S25 Plus or similar. Exact
OS/browser/named Quality/Motion settings are not yet recorded. This failed
observed iPad run now prioritizes **V22-PERF-02 movement/camera isolation before
V22-PLAY-01**. The bounded Tessera candidate is pushed at
`c724c954fd302d22f391d25e88ab467301ac047c` on `codex/tessera-field-hotfix`;
Astra inspected its repaired field pixels and exact one-row catalogue change,
but canonical manifest/publication integration remains pending. It must not delay
the independent [PERF-02A coordinate experiment](plans/V22-PERF-02-moving-camera-isolation.md).
Do not wait
for another reproduction before investigating, blame device age, declare all
mobile devices qualified, or treat Chill pace as the performance remedy.

**Latest Human authorization, 2026-09-05:** playtesting is deferred until the
Human has time tomorrow; continue safe implementation in the meantime. Missing
device feedback is an open acceptance row, not a blanket stop on subsequent
work. Do not mark those rows passed or alter the immutable v0.22.1 comparison.
Keep one runtime writer, evidence-based sequencing and real dependency checks.
The **ART-HOTFIX-01** Sol candidate is backed up, visually reviewed by Astra and
awaiting final publication integration from the approved recovery master.
**Astra is now the sole runtime writer for V22-PERF-02A**; Sol reviews read-only.
V22-PERF-02 now takes
the next runtime slot. The [V22-PLAY-01 brief](plans/V22-PLAY-01-pace-and-stationary-rescue.md)
is prepared for the following separately reviewed pace and rescue seams.

Every response ends with links to [PLAYTEST_CHECKLIST](PLAYTEST_CHECKLIST.md)
and [HUMAN_DECISIONS](HUMAN_DECISIONS.md). Keep build-specific tests cumulative
and track real questions without requiring answers to routine implementation
choices. Current feedback is preserved in the
[audio/hole intake](user-playtests/2026-09-05-audio-readiness-and-hole-crossings.md).

**Received Human evidence: affected-iPad v0.22.1 movement remains poor; settings-
specific comparison is still outstanding.** Publication is complete. Follow the
[playtest note](../release/V22-PERF1-v0.22.1-PLAYTEST.md) on the affected iPad in
the same ordinary 23×23 maze with about five followers: Full quality + Full
motion fresh and sustained, then Lite + Full, then Lite + Reduced. Record model,
iPadOS, browser/PWA, charging/Low Power Mode, duration, maze transitions and
whether each setting actually feels responsive and smooth.

Also hold, steer and release through successful doors, battles, rescues and jumps
as encountered; on desktop try pad→keyboard/board takeover. Sol's delayed-chain
unlock and stale-pad defects are closed in this preview. Desktop lifecycle checks
cannot establish physical latency, background behavior, GPU cost or sustained
smoothness.

Original performance limitations remain open: the unexplained recovery timeout,
mixed/worse Full sustained p95/p99, occasional tails, missing >50 ms causal
attribution, repeated single-corridor soaks, multi-maze/music/resource retention
and timed Tauri/WebView2. No broad contaminated performance cohorts were repeated
for publication and no physical-iPad success is inferred.

- **ART-HOTFIX-01**, then **V22-PLAY-01** pace/stationary-rescue work may proceed
  as separately reviewable seams under the latest Human authorization.
- The newly reported Maze-2-onward movement failure routes directly to
  **V22-PERF-02** movement/camera/renderer isolation; the as-yet-unspecified
  Quality/Motion setting does not prevent investigation. The controlled
  Full/Lite/Motion comparison remains useful follow-up evidence.
- **V22-UI-01 and Agent 04 retain engineering/dependency and PT36 gates**;
  pending family feedback alone does not stop safe preparation/implementation.
  Tessera, Chill/Regular/Zippy,
  stationary rescue, Alex, phone/Book/victory and later feature work did not enter
  this release transaction. Preserve the programme, especially 09 → 10 → 11.

## 4. Binding Human decisions and experience to preserve

- Aim for a warm, beautiful, tactile, readable all-ages puzzle adventure: fun, discovery, satisfying rewards and learning through play. Inspirations include Trails in the Sky, Mario Wonder/Party and Kirby; they are quality references, not assets to copy or a quota of effects/menus.
- Landscape iPad and desktop are primary; phones are secondary but must remain playable. Keep authored landscape layouts, with a rotate invitation in portrait. No requirement for a continuously morphing portrait layout.
- Preserve two-stage Title/Home: large logo/actions use the background's left negative space, cast belongs on the right path. Keep approved logo/cast identities and correct cutouts.
- Maximize the existing maze area; **no Big/Normal toggle**. Future zoom is separately scoped: **4/5/6/7 visible tiles, default 6**, Plan 08/PT32, with 07B workload requalification.
- First tap and held movement must both look smooth and feel responsive; gentle acceleration is allowed. No first-tile flash/camera jerk or old hopping gait. Retain precise tile legality unless a later reviewed decision changes it. No full analog rewrite has been agreed.
- Provide exactly three player-selectable movement pace modes: **Chill**, **Regular** (default, likely slightly slower than v0.22.0) and **Zippy** (faster than v0.22.0). Pace changes presentation/repeat cadence, never tile legality, interactions or solver truth; it applies consistently to keyboard, touch, fixed pad and later controllers, persists safely and is performance-qualified at Zippy.
- Latest V22-04/09: keep genuinely held direction through eligible successful interactions, observing release/steering while paused; never replay queued moves. Failed requirements explain on each fresh deliberate attempt, not once per enemy or only on the third bump. One continuous blocked gesture must not flood modals. Menus, cancellation, blur, hidden pages, disconnects and level changes still clear safely.
- A cage rescue follows the same stationary-contact principle as a door or battle: resolve while Player 1 remains on the adjacent origin tile; only a later or still-genuinely-held eligible step enters the cleared tile. Ordinary consumables remain walk-over pickups.
- Keep large readable art/type, Ame's Power portrait, useful minimap, cages/faded inventory becoming full colour without tick badges, stable HUD/feedback bounds and the bottom-right tap/hold/drag thumb pad.
- Preserve Book pages, large friend/guardian details, grey real locked achievement art, restrained modality-aware focus, round story portraits, clear primary actions/Enter progression, joyful bounded victory and motion preferences.
- Pickup amounts should be discovered on collection, not advertised in tiny tile-corner labels. Preserve readable post-pickup arithmetic and puzzle-critical enemy/player/gate information.
- Preserve Sound settings and convenient quick mute. Current compact-phone More menu is a declared layout tradeoff for family review, not blanket approval of every phone screen.
- Ame remains recognizably young, blonde and blue-eyed; clean chunky JRPG art uses material-local coloured contours. Do not reopen completed art approvals or resurrect rejected calibration/outline work.
- Alex is a Human-approved future optional Player-1 character for the Human's son, with blue eyes and blonde to slightly brown-blonde hair; Ame remains the default. His model/canon and runtime selection require a later Human gate, equal capabilities and an ALT-P1-01 seam before Plans 08/05/09/10 consume the selected lead and Plan 11 may depict him. Chill pace—not a weaker ruleset—provides beginner comfort.
- All 32 friends have authored rescues in the existing 16 mazes and generated eligibility; Unicorn appears in Maze 1 and Tea-Time Skeleton in Maze 2. The tea-drinking skeleton is a friend. Home v05 preserves the corrected horn and adds the expressly authorized precise alpha cleanup; do not restore earlier damaged cutouts.
- Tessera Dolphin's published 256px field rendition has a confirmed alpha defect that removes coral tail/flipper regions. Repair it from the already approved bounded alpha-recovery master as a new versioned derivative; do not redesign the character.
- Campaign growth is 16→24 (four inserted, four later), with purposeful asset ecology, harmonious floor/wall pairings, deeper intuitive solvable puzzles, varied rooms, optional decisions and gentle teaching. New mechanics require design/solver/family gates; wishlist wording is not immediate runtime authorization.
- Mimic surprise must never create an unsolvable route. Loot colours/sound, room variety, difficulty icons, original cute spooky cast and other wishlist details remain owned by their backlog cards/plans.
- Preserve the original contextual OST and existing music transport. Optional co-op keeps single-player default; greybox/family review must show shared laughter rather than sibling distress before costly production.
- AUDIO-01A advances bounded preparation/continuity and SFX readiness before
  Plan 04 after queued V22 corrections. Plan 02 owns the reconciled Claude sound
  palette/variation/mix trials; 07B qualifies the integrated result. Prompt phone
  v0.22.0 playback has no established cause and is not evidence of an audio fix.
- V22-HOLE-01 restricts crossing depth to one hole tile along the movement axis,
  preserving long one-tile-wide dividing trenches and T/+ path choices. Produce
  cleaner joined ditch art with truthful cardinal adjacency and safe landings;
  rules/content/saves and presentation must change together before 04/02/05/09.
- Persistent XP, sprinting, wall hopping and other Plan 14 opportunities are hypotheses, not approved systems. Asset retirement requires copy-first/hash-verified external backup and Human confirmation before removal.
- Future specialists use fresh tasks/current prompts; do not restart old Agent 01 tasks. Do not repeat the earlier Codex-update reminder; the Human deliberately held that update.

## 5. Remaining programme sequence

Completed foundations: 07A measurement; 06 gameplay/save/hints/content identity; 03 art; root 03M music compatibility; 01/MOVE-01 engineering history; UI-03 technical FP-UI1 release. These do not imply every future performance or family gate passed.

After the joint review and required Human decisions, retain the existing sequence until explicitly reconciled/approved:

1. The accepted v0.22.1 performance/input preview is published; the Human's eighth-generation iPad test still fails movement from Maze 2. Finish the in-flight Tessera field-alpha checkpoint, then prioritize V22-PERF-02 movement/camera isolation. V22-PLAY-01 pace/stationary rescue follows as separately reviewed seams, then V22-UI-01 short-height/Book/pad/pickup/victory work. Preserve the remaining settings-specific/device rows and fix actual regressions before dependent work. Resolve root PT36 attachment preflight before 04.
2. **AUDIO-01A** bounded music/SFX readiness, then **V22-HOLE-01** single-width
   crossings and joined ditch art; then **04** lighting, wall depth and terrain
   topology/regions. The Human's deferred feedback does not alone stop these
   independent steps; retain actual safety/dependency/engineering review gates.
3. **02** VFX, effect lifecycle, feedback and reward showers; then **remaining UI-02** polish. UI-03 already delivered Book/tab/detail/focus/victory foundations; reconcile residual work rather than rebuilding them.
4. **ALT-P1-01** Human-gated Alex model/canon and equal optional lead-player integration.
5. **08** normalized input, controllers/Xbox/Steam Deck and bounded zoom.
6. **05** limited sprite animation.
7. **07B** integrated performance/audio/delivery qualification → **FP-CORE2**.
8. **09** campaign expansion/content ecology/deeper puzzles → **FP-CAMPAIGN**.
9. **10** optional co-op/Friend Garden, greybox and Human gate → **FP-COOP**.
10. **11** branding/front-door audit → **13** backlog polish → **12** archive-first asset retirement.
11. **RC-01** integrated qualification → **14** planning-only opportunities → Human-approved follow-ons, if any → **15** final `docs/REUSABLE_AGENTIC_GAME_DEV_PLAYBOOK.md`.

Read the full roadmap, specialist plan and manager addenda before executing. Plan IDs are not execution-prompt section numbers. The prepared [Agent 04 prompt](plans/AGENT04-after-FP-UI1.md) remains unissued/held.

## 6. Historical v0.22.0 evidence and continuing practical limits

- Locked project check: **488 tests / 49 files**, TypeScript/Vite passed, 55.85 s. Prior **131 art tests** apply to unchanged art/Python inputs; not rerun after npm lock restoration. Locked desktop compilation and optimized portable build passed.
- Art validation: **0 errors, 430 classified warnings** (420 earlier + 10 proof/master records), not warning-free. Production dependency audit: 0 vulnerabilities; 11 scenario/9 owner/3 report performance contracts passed.
- Browser r6: **62/63**, with an observer race in a short reduced-motion rescue. Helper corrected, **r7 5/5 targeted**, **r8 17/17 UI/proof**, **r9 2/2 fresh/saved Home** (seven landscapes × normal/200% text). Do not report a nonexistent full 63/63 rerun.
- Locked local production **6/6, 46.793 s** and canonical production **6/6, 52.006 s**: movement, saved Home, Book/discovery/reload, dialog/victory and tester-profile isolation. Served entries and all 47 new art files matched expected bytes.
- Exact locked native portable: Title/Home, saved 37→38-step movement, Hint/Escape, normal close/reopen/resume at 38, 960×540 resize/layout; captures 30–37. Native compilation alone was not used as this evidence.
- Bounded modal review: 12 × 2.5 s blur/no-blur samples at desktop DPR1 and iPad-sized DPR2; p95 16.8–16.9 ms, no observed >50 ms frames/long tasks. CPU trace differences are not GPU measurements, sustained performance or physical iPad qualification.
- Static victory: zero active animations and identical screenshots across a 4-second sample; 12 stationary clipped confetti tips were recorded. Full/reduced motion and centered close affordance were separately observed. Compact decorative omissions and 200% accessible reader behaviour are documented, not hidden.
- Final gzip9: **152,379 JS / 23,130 CSS bytes**; public delivery **164,988,031 bytes**. Ceilings **152,557 / 30,227 / 164,988,031**: that historical build left 178 JS bytes and filled public allocation; current v0.22.1 leaves 46 JS bytes under its reviewed allocation (§2). Additional work needs measured allocation decisions, not silent budget growth.
- Release documentation and committed proofs are cross-device. Some raw traces, full native captures and private profile backups remain local under `C:/Users/hellb/Documents/Maze so Puzzle/release-evidence/FP-UI1-v0.22.0`; the manifest records hashes/paths. A Git clone cannot reconstruct all ignored/local evidence. Never publish private profiles.

Open risks/gates:

| Area | Current unresolved boundary |
| --- | --- |
| Product/visual/family | Detailed Human findings and 51 images received and independently Astra/Sol-reviewed. Desktop/iPad presentation is strongly positive; V22 correction slices, physical sustained comfort and final family acceptance remain open. |
| Movement/input | Physical touch, single taps/holds/corners, long follower chains and comfort still require family evidence; controller/Steam Deck, couch/TV and screen-reader speech remain unqualified. Plan 08 owns the future canonical input policy. |
| Architecture | Astra and Sol independently checked and reconciled the current Opus claims, including explicit corrections. Preserve scene/coordinate/layer/motion seams, effect cancellation and one writer. No speculative full clock/renderer/hub rewrite is approved. |
| Performance | Tiny remaining JS budget/full public allocation; bounded timing only. Human evidence shows reduced effects/movement help on iPad without solving responsiveness; laptop web and Tauri are also imperfect. Terrain/effects/zoom/animation need integrated low-end sustained measurement before 07B qualification. |
| Solver/content | More mechanics, procedural loops/difficulty and Mimic RNG must preserve solver tractability and solvability. No code-review suggestion is automatically good family puzzle design. |
| PT36 visuals | Ring attachment currently uses layer 1 vs actor 2/other weapons 3; root must review canonical attachment metadata/composition before Agent 04 grounding. Do not infer a renderer defect or fix by weapon-name CSS. |
| Delivery/save | Unsigned portable, no clean-host install or offline qualification. Schema 6 protects future-version saves and preview isolation, but downgrade safety is not promised. |

## 7. Authoritative reading and exact evidence

Read in this order, then only the relevant owned plan/backlog slices:

1. This state, [complete Human feedback](user-playtests/v0220-playtest-feedback.md), [follow-up Human intake](user-playtests/2026-09-05-v0220-follow-up.md), [Astra review](reviews/2026-09-05-astra-v0220-review.md), [Sol review](reviews/2026-09-05-sol-v0220-review.md), [V22-PERF-01 candidate review](reviews/2026-09-05-sol-v22-perf01-candidate-review.md), [V22-PERF-01](plans/V22-PERF-01-sustained-play-and-live-input.md), [current source provenance](reviews/external/2026-09-05-v0220-review-pack-provenance.json), [current joint ledger](reviews/2026-09-05-sol-astra-opus5-v4-disposition.md), both linked complete Opus reports and the external screenshots. The earlier initial-feedback/v3 records remain history.
2. [Vision](GAME_VISION_AND_DESIGN_SPEC.md), [roadmap](plans/00-integrated-implementation-roadmap.md), [execution prompts](plans/EXECUTION_PROMPTS.md), [owned backlog](PLAYTEST_BACKLOG.md).
3. [Architecture](ARCHITECTURE.md), [gameplay specification](GAMEPLAY_DESIGN_SPEC.md), [Story Bible](STORY_BIBLE.md), [Art Bible](ART_BIBLE.md), [UI contracts](UI_UX_SPEC.md), [performance budgets](PERFORMANCE_BUDGETS.md).
4. [UI-03 plan](plans/UI-03-fp-ui1-correction.md), [61-row Human intake](playtests/2026-09-05-v021-ui-correction-intake.md), [feedback audit](reviews/2026-09-05-ui03-feedback-audit.md), [root review](reviews/2026-09-05-ui03-root-review.md), [modal-cost review](reviews/2026-09-05-ui03-final-modal-cost.md), [dialog review](reviews/2026-09-05-ui03-dialog-review.md), [inspiration research](reviews/2026-09-05-ui-inspiration-research.md).
5. [MOVE-01 contract](plans/MOVE-01-smooth-travel-and-camera.md), [earlier movement review](reviews/2026-09-05-move01-review.md); UI-03's later correction evidence supersedes earlier claims about first-tap quality.
6. [Current release manifest](../release/V22-PERF1-v0.22.1-manifest.json), [publication receipt](../release/V22-PERF1-v0.22.1-release-verification.json), [family checklist](playtests/FP-UI1-checklist.md), [feedback template](playtests/FP-UI1-feedback-template.md), [release checklist](RELEASE_CHECKLIST.md).

Historical Agent 01 assignments and approvals remain evidence, not instructions to rerun them. UI-03 art additions reuse approved actors: 44 larger actor renditions, authorized Home alpha cleanup and contextual Tessera repair; field identities were retained. Consult publication/provenance records before any later asset work.

## 8. Rollback and recovery

| Checkpoint | Immutable source/release and artifact identity |
| --- | --- |
| v0.20.1 baseline | Runtime `d6b11c026ead3d75565e10490c10307a5a14cfd0`; annotated tag object `04a1f40dd649469db7420828e4159ed0b0bfc1b3` peels to docs receipt `4bca5322b6026e6a03a5b5a0f8e44aac1655d58a`. [Public release](https://github.com/MachineKomi/maze-so-puzzle/releases/tag/v0.20.1) ID `382945842`. Portable 160,436,224 bytes, SHA-256 `1ff30c2d5f58a60a2d4fad44443a1d61d5a3b7df66d4a96e86858e725d2b8777`; installer 154,642,433 bytes, SHA-256 `09208147ae5ffb7ded0640257b6978adb9a79210619e469f821d9d055757f143`. |
| v0.21.0 rejected | Source `2924fd73f60229dd244eeba21c05f66afb4eb8b0` in GitHub history. Local `release/Maze-so-Puzzle-0.21.0-FP-UI1-2924fd7-portable.exe`, 165,352,448 bytes, SHA-256 `9d353f8b055afb883da5cb2bf4f51f7fea669279ed4e946a0acf4e7c69be000c`. **No public tag/release**; historical planned download links are unpublished drafts. Source recovery is cross-device; this local binary is not. |
| v0.22.0 rollback | Frozen `68e303da680d5aec0ba71154949c5a2a0d1697ae` and [immutable prior release](https://github.com/MachineKomi/maze-so-puzzle/releases/tag/v0.22.0). Withheld same-version `2f8fa6a` (Home clipping) and non-locked `68e303d` binaries are not approved substitutes. |

Current v0.22.1 runtime/tag and portable identity are in §2. Close the preview before switching binaries; the unchanged FP-UI1 namespace deliberately shares comparison progress.

Historical Vercel identities: v0.20.1 `6tAUShfZgbNfnNhcCkCjAjrbMmGi`; v0.21.0 `5MHu8ECwrntLAkCDczWQGun5STib`. Do not confuse those recorded deployments with today's canonical URL or promise their permanent availability.

Use an isolated checkout for historical source; never reset shared main/user work. Preserve and privately back up app profiles before comparisons. FP-UI1 v0.21/v0.22 use `com.ame.mazesopuzzle.preview.fpui1`; v0.20.1 uses `com.ame.mazesopuzzle.preview`. Executable folders do not isolate saves. Do not run older code against newer saves without a recovery plan.

## 9. Sol–Astra collaboration protocol

- The Human can switch **GPT-5.6 Sol / GPT-6 Astra** in this shared task. Under
  their continuing self-organization authorization, an explicitly selected actual
  Sol/Astra model may also take a bounded delegated turn. Record model, scope and
  reviewed evidence; never label a same-model audit as the other model's opinion.
  Repository records carry decisions across tasks/devices.
- Both models own the product outcome. Sol's proposed next emphasis is player experience/UI; Astra's is performance/input/technical risk. These are task assignments, not permanent restrictions or claims of inherent model superiority.
- Use **one proposes → the other independently challenges → reconcile → name one writer**. Do not require two full planning rounds for routine fixes. Record disagreements and their resolution; review actual returned code/evidence before asserting consensus.
- **Only one runtime writer.** Name the execution owner and paths; other agents
  review read-only or work on separately owned documentation. ART-HOTFIX-01 is an
  actual GPT-5.6 Sol isolated candidate with parent Astra review, not an invented
  Sol assessment. The latest Human instruction permits this work while they sleep.
- The Human governs vision, final family/visual/play-feel acceptance and material scope choices. The models lead routine implementation and tell the Human the next useful action. Claude is an occasional bounded independent reviewer, not an implementation resource or mandatory reviewer of every output.
- Before a handoff, update this state, owned backlog/evidence and the joint ledger, inspect exact diffs, run proportionate checks, commit/push a meaningful reviewed checkpoint and verify remote agreement. Preserve unrelated work and immutable release/source-art records.
- Use existing harnesses; do not weaken tests to hide failures. Run expensive browser/art/solver/build work serially on this memory-constrained host and distinguish host contention from product regressions.
- Responses identify the active model (`# Astra:` or `# Sol:`), name the next
  owner/action, and end with the cumulative playtest and Human-decision links.
  Continue safe queued work while physical results are pending; Astra evaluates
  them when supplied. Do not create/resume historical specialist tasks.
- The independent Human/Opus review is complete. No runtime or Agent 04 launch occurred during either documentation turn. A fresh task can resume from this file without reconstructing the conversation.
