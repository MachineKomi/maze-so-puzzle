# LOOT-03 A — authored physical collection

In progress on `codex/physical-authored-loot`, based on0c4535e. Web0.22.17
remains live. CAMERA-17 is locally qualified; physical iPhone13/iPad8 stutter
remains Q08/P19. Further speculative renderer changes would not resolve that
missing device evidence. Continue the authorized complete authored-loot slice.

## Implementation decisions

- Rules4 / active-run schema4 uses a new v4 key. Only the exact rules3 content
  fingerprint migrates v3, retaining runId, route/hints, credits and resolved
  enemies. Already resolved treasure sources become credited tombstones. No
  retroactive awards. Profile schema/key and completion receipt remain unchanged.
- One semantic source record owns its exact amount. At most64 authored sources
  and64 pending bundles; positive safe-integer amounts and aggregate totals are
  structural requirements. Reserve one bundle per unopened source, allowing up
  to four at each opening. Coalesce units within a source, never across claims.
- A two-step cardinal flood chooses ordinary safe landings, including a near
  and a straight two-tile distant bundle when possible. Retain the cardinal path
  for presentation; exclude hazards, holes, start/exit, portals and unresolved
  interactions. Around-corner vacuum waits for a clear glyph-sized straight path.
- Outward350–550ms with two diminishing bounces, then a pause: earliest admission
  is750ms and always at least250ms after the throw (up to800ms total).
  Range1.75tiles, clamped250–700ms accelerating attraction. Sample Ame's
  travelling ground point, not a battle-lunge DOM box. Accepted claims cannot be
  revoked. One reducer owns credit, including recovery and interruptions.
- Canvas shares its existing bounded reward clock with Power. Full permits24
  total visual tokens, Lite12; reserve four slots for immediate-rule Power.
  A stable represented-ID set owns physical admission, so no hidden token is
  collected. Newly represented/restored grounded value receives a fresh750ms
  readable interval; static landings do not replay old bursts. Remaining semantic
  value persists until approached. No perpetual idle animation or polling.
- Canvas unavailability uses small original SVG glyphs in the existing camera
  world; Science keeps its distinct atom symbol. Static/Reduced/interruption
  credits accepted claims through the same reducer and retains grounded value.
- Exit settles accepted claims before projecting rewards. Next writes the won
  recovery journal before the idempotent profile receipt. Stay retains grounded
  value; Next leaves it behind with an explicit cue. Restart/maze replacement
  abandons the existing unbanked attempt under the established run rules, with
  additional remaining-loot wording; it does not bank a restart reward.
- Malformed/future authoritative records remain byte-exact and block routine
  write/clear. Successful migration writes v4 before prior cleanup. Cleanup
  removes oldest first and stops on failure, retaining the newer authoritative
  record so a stale older adventure cannot reappear. Full confirmed reset owns
  its separate explicit key allowlist.
- After public migration, recovery must keep v4 compatible: disable visual
  animation in a corrective build if needed, while retaining the ledger and
  credit reducer. A v3-only rollback is not a safe active-run recovery strategy.

## Pre-freeze checks

Checkpoint0bfc808 is backed up. The first production matrix passed7 cases;
expanded `loot03-browser-r3` passed41 (15Book/MOVE/completion,11camera/map,
10physical-loot including capacity/crash recovery,5Power/overlay cases).
Sol freshly inspected phone/tablet/fallback images and found a wall-covered Gold
count. Counts now sit centrally; old misleading opening toast is also corrected.
New empty-ledger motion does not wake/allocate Canvas. Current version18 measures
172003 JSgzip9 (+4922 over17),24170 CSS and155542751 public bytes. Named5200JS
allocation is requested, pending final timing and review. Final source checks,
timing, final visual receipt and publication are not yet claimed by this section.

## Independent review and qualification sequence

Actual Sol independently reviewed the pure ledger and then storage/controller/
completion source. Sol accepted the bounded source reservation policy, flagged
missing amount validation, deletion ordering and invisible over-cap claims.
Those findings are being covered before promotion; this is not final acceptance.

1. Prove conservation, valid landings, duplicate/stale commands,64-source saturation,
   strict malformed/future protection, v3 migration and denied writes/cleanup.
2. Exercise production Full/Lite/Static/Reduced and missing Canvas, real source
   opening, visible pause, distant retention, approach, reload, interruptions,
   completion/Stay/Next and failed-save retries. Inspect actual screenshots.
3. Requalify immediate-rule Power, existing walls/camera/map and completion routes.
4. Compare the frozen public17 baseline at
   `C:/GameDev/maze-game-qa/performance/camera17-release-v02217/` using equivalent
   no-loot moving routes and a bounded loot/idle stress case. Preserve outliers.
5. Obtain actual Sol final review of exact source/evidence. Allocate any measured
   compressed JS growth by name; there is no general budget waiver. No new media
   or dependencies. Freeze version/build, pass CI, and publish once through the
   guarded Git integration; verify both public origins and fresh save journeys.

Following A: enemy Gold/Science then mixed chests/Mimics, recognition-only XP,
usable inventory before eggs. These are not included in the authored-reward
release. Human Q05 becomes ready only after public verification; Q08 remains
the highest-priority device question. No physical Apple/3GB/native claim follows
from Windows Chromium checks.
