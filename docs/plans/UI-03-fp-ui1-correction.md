# UI-03 — Human-directed FP-UI1 correction

Status: published and verified; ready for family playtesting, 2026-09-05.
Runtime source: `68e303da680d5aec0ba71154949c5a2a0d1697ae` (v0.22.0).
See `../reviews/2026-09-05-ui03-root-review.md`, the 61-row audit and the
[public release receipt](../../release/FP-UI1-v0.22.0-release-verification.json).
Human family/device acceptance remains pending. Root owns runtime integration
and release. The detailed v0.20.1/v0.21.0 comparison supersedes the preceding STOP
for discussion; v0.21.0 remains a rejected Human UI result. Automated passes
never promote that build to visual or family acceptance.

## Intent and authority

Make a warm, tactile, picture-led landscape game for Ame and all ages. Preserve
the larger unobstructed maze, grouped Home controls, corrected approved hero,
semantic detail inspection, Sound/comfort preferences, exact tile rules and
coordinated corridor followers. Correct the composition and interaction failures
rather than restoring the old stylesheet. Read the complete intake at
`../playtests/2026-09-05-v021-ui-correction-intake.md` and its screenshot mapping.

Latest Human decisions explicitly advance bounded parts of UI-02, 02, 05 and 08
into this correction: Book pages/cards, visible grey locked achievements,
focus finish, joyful no-scroll victory, the anchored hybrid directional pad,
coherent movement cadence and restrained Ame travel acting. Future owners consume
the accepted contracts and finish their remaining scope; they must not redo or
undo these decisions. Plan 04 still waits for this preview's feedback.

## Execution plan

1. **Record and diagnose.** Trace every complaint and positive retention into an
   acceptance row. Inspect the supplied comparisons and actual code. Record
   causes of notice-driven deck movement, board resizing, and first-step speed.
2. **Stabilize the play surface and travel.** Keep a square board at the largest
   useful size after a legible deck is reserved. Eliminate Big/Normal. Reserve
   notice space. Keep all scene bounds independent of acting/feedback. Give
   first taps and repeated steps the same smooth travel treatment, with a
   slightly faster cruising pace. Gentle acceleration is explicitly acceptable;
   a first-step flash followed by a pause/crawl is not. Retain exact cardinal
   engine moves, bounded input and portal,
   jump, modal, visibility and resize cancellation. Replace the four-arrow row
   with the bottom-right tap/hold/drag thumb pad.
3. **Restore authored composition and scale.** Title and Home use the art's
   left-hand negative space for logo/actions; the Home hero belongs on the right
   path. Use rounded substantial type, colorful tactile primary controls and
   a consistent pearl surface grammar. Enlarge map, portrait/Power, inventory,
   friends, navigation and detail art. Remove redundant slot ticks and reward
   preview numbers; preserve puzzle-critical Power and post-pickup teaching.
4. **Make stories, rewards and the Book feel like a game.** Circular speaker
   medallions; a single story advance action plus deliberate multi-turn skip;
   Enter/tap body continuation; no redundant close on acknowledgement dialogs.
   Bounded frosted modal backdrop with quality fallback. Page tabs and spacious
   colorful Book cards; grey locked artwork; encountered bestiary and friend
   detail cards with truthful discovery data. Restore confetti and distinct
   friend celebration gestures with a fully visible victory composition.
5. **Review the result, not just test counts.** Inspect actual screenshots and
   motion sequences at desktop, iPad, minimum Tauri and landscape phone sizes.
   Compare each intake row with evidence. Exercise single taps, holds, turns,
   pickups, bumps, combat, modal interruption, mouse, keyboard and touch. Check
   no geometry movement during feedback and stable first/held speed. Retain
   meaningful gameplay/save/banking/focus tests; replace assertions of explicitly
   superseded UI with the new Human requirements. Measure delivery and timing
   honestly and approve only bounded measured allocations.
6. **Checkpoint and deliver.** Update maintained contracts, roadmap/backlog and
   fresh-task instructions. Review explicit changed paths, commit/push meaningful
   accepted checkpoints, then version a new immutable preview from a clean SHA.
   Verify CI, web deployment, Windows portable identity and actual journeys;
   publish source/artifact hashes and a focused family playtest guide. Family
   comfort and visual acceptance remain the Human's decision.

## Layout and interaction direction

- Primary landscape retains maze left / deck right. The deck fills the available
  height; its map and picture groups receive real space instead of fixed blank
  tracks. Current 1–5 friends and 0–7 bag items all fit, with a larger synthetic
  roster proving wrap rather than forcing every normal layout to tiny cells.
- Compact landscape phone is an intentional size regime with the same hierarchy,
  readable objectives and essential touch controls. Portrait shows a clear rotate
  invitation; it does not stack and continuously morph the gameplay composition.
- One measured square map; one calm objective; prominent Ame/Power; generous
  rescue/bag art; utilities grouped beside the bottom-right thumb pad; a stable
  feedback area. No layout dimensions depend on transient notifications.
- Full motion keeps useful continuous travel and bounded decorative delight.
  Reduced motion removes hops/confetti but preserves essential smooth travel.
  Static quality remains an explicit stationary-presentation fallback.
- Focus is a restrained plum/gold treatment for keyboard navigation; pointer
  interaction does not paint a thick ring around the maze, text or every button.
- Book tabs separate content. Scrolling within long collections is legitimate;
  the main victory flow and ordinary short acknowledgement/comfort dialogs fit
  without scrolling at their declared normal landscape targets. Text enlargement
  keeps content and actions accessible rather than clipping it to claim a pass.

## Guardrails and handoff

The Human explicitly authorized parallel fresh sub-agents during this correction.
Root assigns disjoint file ownership, integrates changes and serializes expensive
verification/builds on this host. No old specialist task is resumed. Preserve
user work, approved identities and original source assets. The two specifically
reported Home matte islands are a bounded correction, not an art reapproval.
No new puzzle rules, XP/progression, campaign expansion or later zoom feature is
implied. Bestiary discovery is additive, truthful and save-compatible; do not
invent encounter history for older saves. Keep immutable v0.20.1 and v0.21.0
artifacts untouched. Record physical-device and Human evidence separately from
browser emulation, model calculations and automated checks.

## Current implementation review — 2026-09-05

The first integrated candidate passed 486 project tests and TypeScript/Vite. The
first new browser sweep passed nine of fifteen cases and correctly rejected
full-content iPad/minimum-window overflow, a held-travel discontinuity, and the
longest five-friend victory composition. Those failures were rejected and
corrected in the subsequent cohorts recorded below; the failed attempt remains
historical evidence. Original comparison
screenshots are archived byte-exactly under the local review evidence directory.

Home v05 clears the two authorized pockets with 579 alpha-only source changes.
Forty-four approved-source 512px actor derivatives support large contextual cards.
Visual inspection found Tessera's pre-existing coral-fin alpha loss; a separately
masked source-derived r02 repair replaces only its new contextual rendition.
Original approved field pixels remain unchanged. Exact-byte technical decisions
and the separately approved 8,008,395-byte public allocation are recorded in
`../source-assets/publication/ui-correction-art-delivery-request.json`. No character
identity or historical Human art decision was reopened.

The new Book uses schema 6 with truthful normal-play guardian discoveries, empty
legacy discovery migration, preserved reward receipts, tester isolation and a
read-only guard for future schemas. Future owners must preserve these contracts.
The **0.22.0** correction is built from reviewed source
`68e303da680d5aec0ba71154949c5a2a0d1697ae` with restored locked npm dependencies.
R6's 62/63 result retains its setup-observer failure; all five relevant r7
interaction/save cases passed after that observer correction, and all17 r8 UI
checks passed. Native testing then rejected Home clipping in candidate `2f8fa6a`;
the two r9 Home tests passed after the bounded CSS correction. A later strict
comparison caught an installed minifier/lock mismatch in the first `68e303d`
package. Both candidate binaries and failed evidence remain preserved.

The final locked run passed488 project tests in55.85s. The prior131 Python/art
test result is retained on unchanged relevant inputs, not claimed as a new run.
Final gzip9 sizes are152,379 JS /23,130 CSS bytes; public delivery is164,988,031
bytes. Six locked local browser journeys passed in46.8s and the same six
canonical-web journeys passed in52.0s. Exact-source CI33958357582 passed both
required jobs; canonical JS/CSS are byte-identical to the locked build and all47
art delivery hashes passed. Root observed final native Title/Home, Hint/Escape,
close/reopen with the38-step run preserved, and the960×540 minimum layout.

The final portable is
`Maze-so-Puzzle-0.22.0-FP-UI1-68e303d-locked-portable.exe`; other same-version
candidate filenames are withheld. [GitHub prerelease v0.22.0](https://github.com/MachineKomi/maze-so-puzzle/releases/tag/v0.22.0)
was published at 10:51:24 UTC on 2026-09-05. All four unauthenticated public
downloads matched the frozen stage by length and SHA-256 at 10:52:59.744 UTC;
the public release receipt records release ID 383217101 and exact asset identity.
The frozen uploaded manifest's pre-publication status is historical; this later
receipt records completion without rewriting the uploaded manifest or notes.

The [accepted final modal review](../reviews/2026-09-05-ui03-final-modal-cost.md)
closes the bounded UC-13 backdrop comparison, UC-29 watched Static sequence and
UC-10 meaningful round-close inspection. Twelve actual-modal blur/no-blur windows
had 16.8–16.9ms rAF p95, no intervals above 50ms and no observed long tasks. The
traced DPR2 pair's 33.209ms renderer task CPU delta over approximately 2.514s is
an observed browser comparison, not GPU cost or a universal filter allowance.
The ordinary Static victory had zero active animations across 241 rAF samples
and four byte-identical captures; root accepted its 1194/568 compositions,
including twelve stationary colored confetti tips and the documented compact
content treatment. The meaningful 48px close control's 20px mark was centered
in normal, hover and keyboard captures. No runtime change was needed.

Plan07B retains qualified target-hardware performance. Human family acceptance,
physical iPad/Safari, controller/couch, screen-reader speech and qualified low-end
timing remain pending. The fresh Agent 04 task stays on hold until family
feedback is accepted/resolved and root records the PT36 attachment preflight.
See the root review and release checklist for receipts; none of these technical
passes starts Agent 04 automatically.
