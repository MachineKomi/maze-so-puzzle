# PHONE-02 / BOOK-02A / default-mix candidate

Status snapshot, 2026-09-06: **candidate only, not deployed or fully qualified**.
Intended version is **0.22.12**; the runtime owner will freeze the final version,
commit and build identity after remaining checks. Source starts from accepted-wall
restoration commit `e926737a5c0e927ebec4c8b8b80c80dfe8923e16` on
`codex/phone02-book`, with the current runtime changes still being qualified.
This document is a progress receipt, not a release acceptance or deployment record.

## Authority and predecessor

The [Human phone/default-mix instruction](../user-playtests/2026-09-06-phone-composition-and-default-mix.md)
authorizes implementation of the coordinated phone composition and stronger SFX
balance. [PT50/51](../playtests/2026-09-06-depth-discovery-and-celebration.md),
[BOOK-02A](../plans/BOOK-02A-silhouettes-and-discovery.md),
[Plan09-P0](2026-09-06-plan09-p0-obtainable-roster.md) and the
[runtime contract](2026-09-06-book02a-runtime-contract.md) own discovery behavior.
Astra is the single runtime writer; actual Sol supplies independent review.

Live web remains **v0.22.10**. Latest fully published Windows is **v0.22.9**;
native v0.22.10 is separately unfinished despite the recovered staged executable.
The **v0.22.11 R1 wall candidate remains held** on its preserved migration branch.
The [new-host wall decision](2026-09-06-new-host-wall-decision.md) records the
paired evidence and actual independent Sol wall review. This candidate uses the
accepted v0.22.10 wall predecessor; its UI work does not promote R1 or resolve
the old-laptop frame-time concern. No physical iPad or native success is claimed.

## Implemented source contract

### Phone composition and coordinates

- In landscape, **outer viewport height below 450 CSS px** selects phone fitting.
  Safe-area reduction cannot classify a 540-pixel-high outer viewport as a phone.
  `ResponsiveStage` fits a 720-logical-pixel-high stage into its available content
  slot; its logical width follows the slot aspect ratio. Other layouts retain
  scale 1. Title, Home, gameplay, Book and dialogs share this composition.
- Container queries use stage dimensions. The 200-logical-pixel ThumbPad has
  stronger relative prominence while secondary controls are smaller. This follows
  the explicit Human override; it **does not establish 48-physical-pixel target
  compliance**. Unobscured controls, enlarged reading and safe input remain required.
- The outer frame owns safe-area padding once; fitted descendants use zero local
  safe insets. The stage slot clips its visual extent. Title/Home recommend a
  larger display discreetly; JS derives note font size to retain 11 physical px.
- Pointer events and DOM rectangles remain physical. `physicalContentRect`
  accounts for transformed border/content offsets when converting board input.
  HUD composition measures logical layout size. Portaled dialogs share stage
  origin/scale and preserve portrait inertness and return focus, including a
  replacement invoker after responsive remount.
- `CatalogueImage` selects art from **logical rendered extent × stage scale × DPR**,
  avoiding oversized renditions solely because the composition is 720 logical px.
  `RewardLayer` maps physical actor bounds into canvas world coordinates and uses
  physical-to-logical scale in its capped backing resolution. These changes do
  not add reward events, random calls or a new canvas layer.

Source seams: `src/ui/ResponsiveStage.tsx`, `src/ui/stageFit.ts`, `src/App.tsx`,
`src/ui/game/AdventureHud.tsx`, `src/ui/dialogs/DialogShell.tsx`,
`src/ui/CatalogueImage.tsx`, `src/vfx/RewardLayer.tsx` and shared UI styles.
The [UI/UX spec](../UI_UX_SPEC.md) records the current override above dated rules.

### Sound balance

New defaults are **Music 65 / SFX 85** slider positions, approximately effective
gains `0.0751111` / `1.1333333`. Calibration stays at v2 with existing curves,
music's 75-position `0.10` anchor and SFX's `4/3` ceiling. Valid existing v2 gains
remain unchanged. Existing legacy/future preference policies remain in force.
**Recommended balance** explicitly updates only the two gains and preserves mute;
it does not start playback, reset comfort settings or change progress. Transport,
OST files, SFX palette, preview cancellation and the maximum-combination warning
remain within the [audio plan](../plans/AUDIO-01-readiness-and-sound-design.md).
No perceived-loudness percentage or acoustic listening acceptance follows from
these slider values or browser checks.

### Book and durable discovery

- Explicit `src/bookRoster.ts` revision `obtainable-20260906` freezes **32 friends /
  12 guardians** from actual admitted authored/generated content in Plan09-P0.
  Enum/catalogue growth cannot silently change Y.
- Unknown entries use grey silhouettes of their actual approved sprites. Neutral
  accessible labels disclose page category/position, not hidden names or lore.
  They have no lore action or eager detail dialog. Mounted-page approved field
  images are lazy. Known entries show color, name and existing short one-liner.
- Normal visible gameplay uses the authoritative six-tile view; a visible caged
  friend counts before rescue. Current-run rescued object IDs also prove encounter.
  Hidden content, tester visits, story/dialog views and Book mounting do not grant
  discovery. Existing guardian/disguised-Mimic boundaries remain.
- Unique admitted encounters drive X/Y; total rescues remain separate. Discovery
  persists at the event boundary and deduplicates without extra rewards. The same
  progress owner handles storage failure and Reset Progress.
- Schema **7 remains at `maze-so-puzzle-progress-v6`**, deliberately allowing old
  v6 runtimes to recognize a future profile and refuse destructive write-back.
  Positive per-species rescue totals and validated historical/best species lists
  can prove past encounters; aggregates, completed chapters and today's maps cannot.
  Safe unknown IDs survive in storage but do not count until admitted.
- No Garden membership, new collection award, currency, RNG or second store is
  introduced. Rollback must preserve schema-7 profiles and future-write protection;
  never downgrade or delete player data to make old code accept it.

Source seams: `src/progress.ts`, `src/game/discovery.ts`, normal encounter wiring
in `src/App.tsx`, and `src/ui/screens/AdventureBook.tsx`. The runtime contract and
BOOK-02A acceptance list remain authoritative for migration and rollback review.

## Evidence so far and remaining qualification

These are completed-run observations, not claims that every later source edit
has been exercised. Reports are under `C:/GameDev/maze-game-qa/performance/`.

| Evidence | Observed result | Limit / next action |
| --- | --- | --- |
| `phone02-book-20260906/playwright-report.json` | 13 passed, 4 failed; 58.852 seconds | Initial geometry failed at 568×320 and inset 780×312 / 844×390; rotation return focus failed. Preserve original failure evidence. |
| `phone02-book-20260906-r2/playwright-report.json` | **17 passed, 0 failed/skipped/flaky**; 39.799 seconds; started `2026-09-06T19:24:46.427Z` | Corrected focused pass. Subsequent reader/slot edits need final-source coverage. |
| `phone02-book-full-20260906/playwright-report.json` | 3 passed, 8 failed, 69 not run; 69.269 seconds | Runtime owner diagnosed inherited movement probes reading percentage world translations as pixels and repaired the probe. Failure report retained; this diagnosis is not a replacement for rerun evidence. |
| `phone02-book-full-20260906-r2/` | **In progress at this snapshot** | Broader 80-case rerun pending; do not report acceptance before its final result. |
| Independent Sol source review | Runtime owner relays acceptance of the architecture with required corrections: physical image extent, outer-viewport predicate and JS note-font calculation | All three corrections are present in inspected source. Final independent visual review of corrected captures remains pending; no blanket Sol approval is inferred. |

The focused set includes eight geometry viewport/inset cases across representative
mazes, six empty/partial/full Book cases at phone and tablet-sized viewports, a
normal unrescued encounter/reload with tester/Book isolation, a scaled board/pad
input and rotation/focus case, and explicit recommended balance while muted.
It covers normal responsive layout, not all enlarged-text/device/accessibility
claims. The broader run and independent source/visual review must account for the
latest source. Full project checks, build/art/bundle budgets, exact release-source
identity and deployment guard verification require root's recorded closeout.
No tests or builds were run by this documentation writer.

Physical phone/tablet comfort, child comprehension, acoustic listening and Windows
release qualification remain distinct evidence. Their pending status is not an
invented gate on other independently authorized work. Do not claim native release
acceptance from a compile or infer family approval from automated viewport tests.

## Output and recovery bookkeeping

The [artifact ledger](../LOCAL_ARTIFACT_LEDGER.md) records completed first-pass
output (49 files / 13,126,403 bytes), two exploratory prototypes (1,437,522 bytes),
completed r2 and pending broader outputs without inventing unmeasured sizes.
The 17-file, 448,999,668-byte wall evidence packet remains retained. Candidate
`dist/` builds occur in place; no repository or dependency copy was created.
`scripts/performance/installed-playwright-hook.mjs` resolves the already installed
Playwright runtime without a package shim, installation or lockfile mutation.

The [restored-folder receipt](2026-09-06-restored-folder-reconciliation.md) verifies
the newly recovered staged v0.22.10 binary identity and bounded proof packets.
It preserves obsolete worktree pointers and historical evidence paths as
provenance; it does not turn restored archives into current working checkouts or
declare transfer completion. No deletion or archiving is authorized here.

Next closeout: finish the corrected broader run and latest-source checks, obtain
actual Sol's final independent disposition, freeze the version/source/build packet,
then have the runtime owner record the qualified release decision. Until that
record exists, this remains an undeployed candidate on the accepted wall baseline.
