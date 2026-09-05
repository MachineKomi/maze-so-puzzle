# FP-UI1 — family playtest checklist

Status: prepared 2026-09-05; build, release URL and results not yet available.
Scope: reviewed Plan 01 UI plus MOVE-01 coordinated character/camera travel.
Controller overhaul, final VFX/animation, gapless OST qualification and 24 mazes
are later work. This checklist does not imply those features already ship.

Root fills in the exact version, source SHA, download/web link, isolated profile
and known issues here or in the linked release PLAYTEST note before handoff.
Root performs technical checks first. Family testing is voluntary; one short
session and a few useful observations are more valuable than exhausting a matrix.

Use `FP-UI1-feedback-template.md` to report results in the existing Astra task.
If all tested rows pass, send the exact build/device/input and comfort verdict;
root records acceptance and prepares Agent 04 after remaining required gates.
Report any issue immediately with short reproduction steps. Future adjustable
camera zoom (PT32, Plan 08) is not expected in this preview.

## First session: comfort and clarity

1. Open the title, enter Home, and begin or continue. Are the actions obvious?
2. In Maze 1, try taps and a hold. In a scrolling maze, repeat a straight hold,
   a corner, a reversal and travel near an outside edge. Does the background
   feel comfortable? Can you hold naturally instead of taking isolated steps?
   Try Reduced motion if useful. Stop that check if uncomfortable.
3. Explain the current objective in your own words. Find Power, the minimap,
   Bag and waiting/rescued friends. Do labels read at your usual distance?
4. Meet a blocker or stronger guardian. What could you do next? Use a Hint only
   when wanted; asking an adult for help is welcome, never counted as failure.
5. End at a natural stopping point. Reopen and continue the same progress.

Record the device, input, build and maze; what happened; what was expected;
whether an adult intervened; and one liked moment or frustrating moment.
Comfort can be recorded as comfortable / tolerable / uncomfortable plus a note.
No percentage or broad population claim comes from one family's session.

## Optional second session: busy UI and recovery

Tester access is for layout, content and movement checks. Tester runs deliberately
suppress ordinary persistence/rewards. Use an ordinary run in the isolated preview
profile for exit choices, reward accounting and save/reopen checks below.

| Journey | Observe |
| --- | --- |
| Mazes 12/15 through safe tester access or normal progress | Seven Bag slots, five friends, full objective; no missing content or awkward scrolling on the intended primary device |
| Normal ↔ Big | Board never gets smaller; useful map and actions remain available |
| Help/Hint/Sound, then close | Clear close action; no movement behind the surface; keyboard focus returns |
| Sound | Mute, Previous, Next and Shuffle work within the current context; unavailable actions are explained |
| Adventure Book | Earned achievement opens large and clear; locked reward stays concealed; friend catalogue remains usable |
| Story | Easy advance/skip/replay; no accidental maze movement or lost progress |
| Ordinary run: exit with a friend remaining | Stay is the safe choice; same run resumes intact |
| Ordinary run: Next/Restart and save/reopen | Rewards are not duplicated; restart warns appropriately; ordinary saves remain protected |

## Root handoff checklist

- All mandatory UI/art/geometry and MOVE-01 gates are accepted or have an explicit
  Human decision; do not use family testing to conceal a known implementation gap.
- Verify primary-device geometry and compact-phone behavior, 200% text, focus,
  input isolation, large-art load/failure paths, font/media budget and regressions.
- Smoke the exact web and portable build through title → story → maze → save →
  reopen; record artifact hash/profile and truthful hardware limitations.
- Publish one prioritized feedback list after the session. Route defects to the
  owning phase; preserve likes as well as failures. Add new features only through
  a separately recorded Human decision.
