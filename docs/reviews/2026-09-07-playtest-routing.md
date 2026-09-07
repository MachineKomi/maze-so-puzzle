# September7 playtest routing

Astra read the complete Human-authored
[v02213/v02214 feedback](../user-playtests/v02213-20260907-playtest-feedback.md).
The original file is preserved verbatim. This is routing, not completion.

1. **WALL-04C remains first:** finish the current wall/cutout/large grounded
   sprite candidate and qualify it before publication. Human acceptance of
   v0.22.13's tall3D direction remains valid.
2. **Campaign-selection loop:** reproduce normal Book maze selection through
   completion. The reported same-maze restart is a bug, not intended campaign
   progression. Inspect normal versus tester selection and completed-maze
   routing; default requested behavior is the next story maze, with a clear
   final-campaign destination. Preserve explicit replay, stays and save safety.
   Deliver a bounded regression fix before broad new reward mechanics.
3. **HAZARD-03:** v0.22.14 is technically published, but the Human rejects its
   dashed-curve appearance and reports the lost floor lip/fade on PC and phone.
   Restore connected-region inset floor margins and a subtle bounded feather;
   wall cast must cover hazard, transition and exposed floor consistently.
   Replace generic dashes with distinct restrained water/lava/poison behavior.
   Compare cheap geometric/texture-offset approaches first; any texture warp,
   smoke or gas must earn its cost in paired motion and idle traces. No return
   to an unqualified whole-maze blur/filter. Full/Lite/Reduced/Static must all
   retain readable hazard identity and edges. Then physical LOOT-03 proceeds.
4. **HOLE-02 remains unfinished:** single-crossing rules/camera do not deliver
   the approved connected-pit art. Keep horizontal/vertical, T and + trenches
   and the selected visual proposal under Plan04/V22-HOLE-01. Adjacent holes
   intentionally restrict which crossing axis works; never jump multiple hole
   tiles. Prove connected rendering and solver-valid authored use before wider
   generation. The phrase one-way crossing means this axis restriction, not
   permission to invent a directional movement rule.
5. **Movement pace:** three saved timings already exist: Chill320ms,
   Regular200ms and Zippy120ms, exposed in Sound & comfort. The requested
   discoverable icon-led **Chill / Walk / Zippy** UI is still unfinished in
   Plan08/PT45. Change the visible middle label without migrating the stable
   `regular` preference key. Preserve keyboard/touch/controller parity.

This routing supersedes claims that hazard beauty is merely awaiting its first
feedback. Q04 now records a requested revision; no repeat of the rejected14
playtest is needed. Q01's next walls/sprites build and Q02's post13 jump check
remain independent. No new Human decision blocks these authorized fixes.

## Book-loop source triage,1f8ab73

Programme independently traced Book→`requestEnterLevel`→normal `enterLevel`.
The actual Next handler uses current-level-derived `campaignIndex+1`; an
explicit Next restart is not yet reproduced. A concrete loop-like branch is
the older PT10 missing-friend policy: **Stay here is primary and initially
focused**; Enter resumes/disarms the same exit without banking. Book then
labels that run Current and resumes it. Same-ID Book selection also retains
tester mode because its active-run view omits mode. Neither source observation
is a claimed reproduction of the Human's exact event.

Next slice must begin through actual Book selection and cover explicit Next
versus default Enter, partial/perfect completion, middle/final chapters and
same-ID tester selection. Adopt the newer next-story-primary request, retain
explicit Stay/Restart, preserve provisional reward wording and exactly-once
finalize/save-failure/future-profile protection. Do not add a Choose-maze action
that bypasses the completion transaction. Existing Home-launched tests expecting
Stay focus need an explicit latest-steer update, not silent test weakening.

## Hazard source triage,e69f3e4

Programme confirms HAZARD-02/ada4cbc deliberately replaced13's erode.055 and
Gaussian.022 masks with exact full-region clip paths for both material and FX.
That removed the floor margin/feather on every device. Separately, `floorD`
subtracts full hazard paths and is also used for wall cast/contact; that older
exclusion already existed in13. Current paint order is correct, but restoring
an inset alone cannot fix the shadow receiver.

HAZARD-03 first candidate: reuse the connected even-odd boundary and phase-matched
floor pattern in narrow inside-clipped strokes, with a clear band and two or
three stepped alpha bands approximating a feather. Prototype.04tile floor and
.02–.03 transition; no morphology/blur/new pixels or internal tile seams.
Split a cast receiver covering ground/liquid/lip/transition, excluding actual
wall footprints and pit voids, from the dressing-only hazard exclusion.
Keep absent-family gating and current2.4/2.2/2.1 texture periods.

Remove racing white dashes. Compare restrained wrapped texture drift plus
sparse broad water ripples, slow local lava currents/hot patches with crust,
and deterministic varied poison bubbles/oily movement. Pattern animation can
still repaint a large receiver: qualify genuinely nonempty idle and movement
before accepting it. Finite foot splashes/underlight/gas can follow from existing
committed movement and presentation ownership, with no new crossing rule.
Prove isolated/strip/L/T/ring pools, mixed materials, cast across all receiver
parts, bright/dark themes and Full/Lite/Reduced/Static. These are researched
implementation leads, not shipped changes or Human-approved appearance.
