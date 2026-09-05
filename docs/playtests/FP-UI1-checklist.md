# FP-UI1 — family playtest checklist

Current scope: UI-03 corrects the rejected v0.21.0 preview. The published release
PLAYTEST note supplies the version, exact source SHA, verified Windows/web links
and technical results. A previous build or previous automated pass does not
qualify this correction. Controller overhaul, final lighting/VFX/animation,
expanded campaign puzzles and adjustable camera zoom remain later work.

Technical handoff, 2026-09-05: v0.22.0 runtime source
`68e303da680d5aec0ba71154949c5a2a0d1697ae` has verified locked-build, canonical-web
and native journeys. The [published v0.22.0 preview](https://github.com/MachineKomi/maze-so-puzzle/releases/tag/v0.22.0)
is ready for this playtest; all four public downloads passed length/hash checks
on 2026-09-05 at 10:52:59.744 UTC in the [verification receipt](../../release/FP-UI1-v0.22.0-release-verification.json).
Use `Maze-so-Puzzle-0.22.0-FP-UI1-68e303d-locked-portable.exe` from that release,
or the [verified web build](https://maze-so-puzzle.vercel.app/). Earlier
same-version candidate files are withheld. Technical verification does not replace the family checks below or
qualify physical iPad/Safari, controller/couch or screen-reader use.

Root also accepted the [bounded modal, Static celebration and close-button
review](../reviews/2026-09-05-ui03-final-modal-cost.md) on the locked build.
Those browser observations support this handoff; they do not decide whether
the appearance and motion feel right to your family.

Use `FP-UI1-feedback-template.md` to reply in the existing Astra task. Report an
issue immediately; you need not finish the checklist. A short comfortable
session is enough. The remaining family-quality decision belongs to you and Ame.

## First session: feel and clarity

1. **Title and Home.** Logo/actions belong on the left; the Home cast belongs on
   the right-hand path. Check the larger buttons, readable rounded type, warm
   surfaces and one-action speaker mute. The settings icon opens Sound & Comfort.
2. **Movement.** In a scrolling maze, tap once after waiting, tap several times,
   then hold. Try corners, reversals and the outside edge of the maze. Each first
   step should be smooth, with no flash, camera jerk or pronounced Ame hop.
   Does holding feel comfortable enough that you no longer avoid it?
3. **Play surface.** The board is always the largest useful square at the same
   six-tile view; Big/Normal is gone. Collect a potion, meet a wall and fight a
   guardian. Neither board nor tools should jump or pulse in size. Amounts are
   revealed after collection, not printed beside uncollected rewards.
4. **Picture-led tools.** Find Ame's Power, Gold, Science, map, friends and bag.
   Are they legible at your usual distance? Waiting friends are caged, missing
   equipment faded, acquired art in full colour with no little tick badges.
   Tap a friend or item for its larger card (More holds details on small phones).
5. **Thumb control.** On iPad/touch, use the bottom-right pad: tap its arrows,
   hold, and drag within it. Release and change direction. It should follow your
   intent and always stop when released or when a dialog opens.
6. **Stories and help.** Circular portraits, clear teaching copy, one Start on a
   one-turn story. Tap its non-control body or press Enter after clicking the
   text. Open Hint/Help and return to the same run. Keyboard focus should be
   clear but restrained, without a thick green ring.
7. **A lovely finish.** Complete an ordinary maze. Look for confetti and the
   friends' different celebrations, clear rewards and visible continuation.
   Press Enter after clicking an inert area. If you deliberately focus Stay or
   Restart, Enter should respect that choice. Try Reduced motion if preferred.
8. **The Book.** Visit Mazes, Friends, Bestiary, Stats and Achievements. Inspect
   a large friend card and an encountered guardian. Locked achievements show
   grey real art and their goals; earned cards become colourful keepsakes.
9. **Return later.** Close and reopen the new preview. Continue the same ordinary
   run and check that rewards/progress were neither lost nor duplicated.

Record device, OS/browser, input, build, maze and motion setting; one liked
moment, any confusing moment, and comfortable / tolerable / uncomfortable.
For Windows, include the complete portable filename from the release note.
A result on one device does not qualify every platform. Pause any check that
feels uncomfortable.

## Optional short second session

| Journey | Observe |
| --- | --- |
| Mazes 12/15 via tester access, and a five-friend maze | All actual Bag/friend content remains available; nothing important is clipped on your main device |
| Landscape iPad and desktop, then a narrow landscape phone | Same information hierarchy in deliberately composed layouts; compact phones move secondary actions into More |
| Rotate to portrait and back | Clear landscape invitation, no moving underneath it, same run when restored |
| Sound & Comfort | Immediate mute; Previous/Next/Shuffle follow the current music context; choices fit the screen |
| Static Surface quality | Complete an ordinary maze: the celebration stays still, including small colored confetti tips at its top. Are its rewards, story and actions clear and does it still feel rewarding? |
| Ordinary exit with a friend remaining | Stay safely resumes the same run; choosing to leave has the intended meaning |
| Restart twice; cancel/timeout after one press | First press is a clear reversible confirmation; only deliberate second press restarts |
| Larger text / OS scaling | Important content remains readable and reachable; scrolling is allowed for enlarged-text accessibility, never clipped |

Tester runs deliberately do not bank ordinary rewards or save their run. Use an
ordinary run in the preview profile for the save/reward/exit-choice checks.
The new Windows preview keeps the FP-UI1 profile used by v0.21.0 and migrates its
Book discovery data safely; it remains separate from the older v0.20.1 app profile.
Do not reset a profile to diagnose a possible save problem.

## After playtest

If all tested journeys pass, reply with the build/device/input, comfort and
clarity observations, and “FP-UI1 playtest passed.” Untested journeys stay
untested. Root records your evidence, resolves feedback and required gates,
and completes the PT36 attachment preflight before supplying the final Agent 04
prompt for a **fresh task**. That task remains on hold until then. A passing
playtest does not automatically launch another specialist.

If anything regresses, send a short reproduction in this Astra task using the
feedback template. Root reproduces it, records ownership, corrects and verifies
it, and supplies a new immutable preview when needed. Keep the build/version
with the report so later agents do not confuse old and new evidence.
