# UI-03 — root integration and release review

Date: 2026-09-05. **Engineering correction accepted for clean-source packaging; publication and
Human acceptance remain separate gates.** This report supersedes the engineering assessment of
v0.21.0 for current UI work. The Human rejected that build's visual result, and
its earlier automated passes remain historical evidence, not family acceptance.

## What the correction changes

The title and Home are composed around their approved illustrations: large
logo/actions on the left and Home's cast on the right-hand path. The grouped
menu remains. Existing Fredoka type now has substantial body weight, with
warmer gradient controls, soft depth and restrained keyboard focus. The two
authorized Home matte islands are removed through the approved exact mask.

Gameplay has one maximum useful square board at the existing six-tile view.
Big/Normal is removed. The deck restores Ame's portrait/Power, larger picture
groups and a bottom-right directional pad. Status art uses cages/fading/full
colour without the rejected little ticks or question badges. Feedback has a
stable home; actor acting no longer scales the board. Uncollected reward
amounts are gone; collected Power arithmetic remains readable.

Single taps and held steps share a 160ms interval. The first step no longer
uses the old short tap duration followed by a long repeat pause. A shared
actual-callback animation clock moves the player, camera and corridor followers;
terrain receives a stable memoized world window. Ame's pronounced hop is
replaced by restrained acting. Exact tile rules, legal corners, portal/jump
handoffs and interruption rules remain protected.

The Book has five pages, spacious keepsake cards, grey locked achievement art,
large contextual friend/guardian art and original concise lore. New bestiary
records are truthful normal-play encounters. Schema 6 migrates old saves without
inventing encounters; future-schema profiles and their active-run bytes are
protected from incidental writes. No engine rules, campaign content, currencies
or reward receipts were changed by this correction.

Stories use circular medallions and coherent single/multi-turn actions. Their
non-control surface and Enter advance without requiring button refocus. Simple
acknowledgements do not have duplicate X actions. Frosted dialogs, larger detail
art, quick mute and Sound & Comfort are integrated. Victory restores finite
confetti and 32 authored friend dance signatures with reduced/static alternatives.

## Authority, review and traceability

- Full Human intake: `../playtests/2026-09-05-v021-ui-correction-intake.md`,
  UC-01–UC-61. The companion `2026-09-05-ui03-feedback-audit.md` maps every row
  to implementation and evidence, with explicit limitations.
- Plan: `../plans/UI-03-fp-ui1-correction.md`. Official reference research and
  the movement reasoning are in `2026-09-05-ui-inspiration-research.md`.
- Root integrated disjoint fresh agents under the Human's explicit parallel
  authorization, reviewed actual source and screenshots, and serialized heavy
  checks on this 8GB host. Future specialists start fresh tasks.
- Exact art decisions, proofs, source hashes and per-file ceilings are in
  `../source-assets/publication/ui-correction-art-delivery-request.json`.
  Approved identities/field pixels remain unchanged. The 47 new delivery files
  total 8,008,395 bytes; 512px art is demand-loaded for contextual views.

Original Human comparison files are archived byte-exactly at
`C:/Users/hellb/Documents/Maze so Puzzle/review-evidence/2026-09-05-ui03-human-comparison/`.
Raw browser evidence stays outside Git; maintained reports preserve results,
source identity, commands and relevant limitations.

## Verification record

This section records failed attempts as well as later corrections. A later
pass qualifies only the source and scenario actually exercised.

| Check | Current evidence |
| --- | --- |
| Project suite | 488 tests in 49 files passed with `npm test -- --maxWorkers=2`; final runtime run took45.68s. The earlier default run timed out one pure campaign solver test at its unchanged 5s timeout under host contention (487 passed); no gameplay assertion failed. Exact-source default CI remains required. |
| Production build | TypeScript and Vite passed for v0.22.0. Final source fingerprint/bytes are recorded after the last correction. |
| Full browser r4 | 49/62 passed. Rejected primary/compact overflow, stale minimap-spacing assertions, derived missing proof sheet and DPR-only fallback recovery. No failed row is treated as accepted. |
| Movement r4 | All 17 MOVE checks plus UI03 first-tap/hold, pad cancellation, secondary-touch, Story/Enter, ordinary discovery and future-profile preservation passed. |
| Geometry r5 | 9/17 passed after corrections; all six UI03 landscape cases and the longest five-friend ordinary victory passed. Busy maze12/legacy geometry exposed remaining deck and enlarged-text issues, corrected and passed in r6. |
| Final production r6 | 62/63 passed in8.9m: every layout/text/DPR/image/input/Book/story/victory check passed. One reduced-rescue setup observation raced its150ms lifetime before the full jump handoff. The test observer is now armed before input; r7 targeted retest passed all five interaction/save cases in54.4s. |
| Art | Canonical proof regeneration and art validation passed: zero errors, 430 classified warnings (420 existing plus ten new proof/master evidence records). Final131 art unit tests passed in146.278s. An earlier130/131 run rejected a stale v04 Home expectation; the six-test group and final full suite passed after aligning it with the authorized v05 pointer. Updating that pipeline test invalidated the canary/index; normal proof and manifest regeneration restored the final zero-error check. |
| Desktop compilation | `npm run check:desktop` passed locked Cargo for0.22.0 in28.46s. Actual portable packaging/journeys remain separate. |
| Proof/geometry r8 | All17 UI overhaul checks passed in2.2m after fixing the DEV-only proof host; root inspected the regenerated full-material reference. Production JS/CSS filenames and bytes remain identical to r6. |
| Static release gates | Performance contracts, exact JS/CSS/public budgets and all3 maintained evidence files passed. Production dependency audit: zero vulnerabilities. Publication/artifact identity follows separately. |

R4 evidence:
`C:/Users/hellb/Documents/Maze so Puzzle/review-evidence/2026-09-05-ui03-full-r4/`.
R6 evidence:
`C:/Users/hellb/Documents/Maze so Puzzle/review-evidence/2026-09-05-ui03-full-r6/`.
R5 evidence:
`C:/Users/hellb/Documents/Maze so Puzzle/review-evidence/2026-09-05-ui03-geometry-r5/`.
R7 movement/setup-observer recheck:
`C:/Users/hellb/Documents/Maze so Puzzle/review-evidence/2026-09-05-ui03-recheck-r7/`.
R8 final UI/reference proof:
`C:/Users/hellb/Documents/Maze so Puzzle/review-evidence/2026-09-05-ui03-proof-r8/`.
Actual dialog compositions and animation review are detailed in
`2026-09-05-ui03-dialog-review.md`.

Root directly inspected r4 Title/Home at desktop, iPad, minimum window and
568px landscape; Sprig's intro at iPad/568px; and the iPad Book spread. The
logo/actions occupy the illustration's left negative space, the cast remains
on the right path, and primary controls are visibly large and substantial.
Home retains its tidy panel without covering the cast. Sprig's round medallion,
heavier story copy, one Start and blurred/glowing backdrop address the specific
comparison; the long intro has an accessible reader on the shortest phone.
The Book's tabs, spacious coloured cards and paper/spine treatment are materially
different from the cramped v0.21 page. The rejected r5 HUD screenshots were
also inspected: oversized map/collection tracks genuinely pushed controls below
the deck. Root rejected those compositions and reviewed the corrected real-maze results.
R6 now passes those strict geometry/content checks. Root inspected final iPad/
desktop busy decks, both compact safe-area captures, grey Book keepsakes, long
DPR2 equipment detail, full-motion ordinary victory and longest five-friend
1024px victory. The latter has all story/reward/action content visible. Root
also found a broken standalone DEV component rack in the generated proof sheet;
that fixture was corrected independently of the passing actual gameplay and its regenerated r8 reference was inspected.

Before native preview testing, root made and hash-verified a local backup of the
existing FP-UI1 WebView profile (317 files, 32,744,117 bytes). It is private local
rollback evidence under the v0.22.0 release-evidence directory, never a release
asset. Existing profile contents were not reset or deleted.

The lightweight r6 first-tap/held sample recorded no callback intervals above
50ms; maxima were35.1ms and23.9ms respectively (held p95:21.6ms). Heavy trace/LongTaskObserver
instrumentation was disabled in that cohort after the inspector itself caused
a 132ms callback inside a 242ms task. Empty diagnostic arrays do not establish
zero long tasks. These measurements are browser observations, not universal
frame-time qualification or a substitute for physical iPad comfort testing.

## Deliberate compact and accessibility differences

Landscape is the authored mode; portrait gives a rotate invitation and safely
pauses interaction. Compact phones keep objective, map, status pictures and a
48px-sector thumb pad, while secondary actions/details move into More. At the
smallest 568px landscape, currency art and decorative metadata are reduced or
hidden; this does not qualify identical desktop art scale or couch readability.
The smallest568px layout reserves a352px deck and about204px board (188px with
12px insets), with24px noninteractive status pictures. The dense1194px iPad
case fits62px collection pictures and164px map;1920px fits92px and380px. These
are deliberate content/control tradeoffs, not universal promises of a larger map.
Primary landscape keeps direct mute; compact gameplay places mute in More,
taking two actions. Root accepts this compact hierarchy for the preview.
Compact feedback uses the readable map toast rather than an extra deck row.
Its geometry remains independent of notification contents.

Ordinary victory fits the tested landscape targets. Short layouts retain the
full outro, parade, award/total, arithmetic, keepsake art and 48px actions, while
decorative praise/greetings/metadata are selectively absent visually. Enlarged
text and long Help content retain accessible independent reading scroll instead
of clipping text to claim literal no-scroll compliance. These distinctions are
recorded explicitly for Human review.

## Final static allocation

The r6 production measurement is152,377 gzip9 JS /23,099 CSS /164,988,031 public
bytes. Root reviewed the additional layout/DPR correction code and raised only
the UI03 JS allowance from7,100 to7,950 bytes: final JS ceiling152,557 leaves180
bytes of compression variance. CSS stays below30,227 and public bytes exactly
match the separate reviewed allocation. No new library is added. The bytes do
not certify blur/compositing or low-end performance.

## Release and next owner

The intended immutable preview is **v0.22.0 FP-UI1**. Its manifest and PLAYTEST
note will identify the clean source, Windows bytes, web deployment, CI and
verified journeys. Existing v0.20.1/v0.21.0 files remain untouched. The Windows
FP-UI1 profile is retained and remains separate from the older v0.20.1 profile.

Family material/readability/comprehension, actual iPad/Safari touch and comfort,
screen-reader speech, controller/couch use and qualified low-end timing remain
Human/device checks. This report does not claim perfection or Human acceptance.
After feedback passes, root records that evidence and completes the prepared
fresh Agent04 lighting prompt. No specialist starts automatically.
