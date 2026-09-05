# Human follow-up — audio readiness and hole crossings

Received: 2026-09-05, in Sol/Astra collaboration.
Repository inspected: `9418ee245c16c645ec5a4dab03ded9e02ab97417`.
Reported phone version: **v0.22.0**, not the newly published v0.22.1 preview.

## Observations and requested outcomes

- The Human's phone suddenly switched BGM promptly at the intended transitions.
  They wonder whether installing the app or leaving it in the background helped.
  Device/browser/cache/session details were not supplied. Record this as positive
  audio feedback, not evidence of a fix, offline support or v0.22.1 acceptance.
- The Human recalls delayed desktop music too, especially arriving at victory in
  silence and losing the emotional impact. BGM and SFX should be ready when the
  corresponding screen/action occurs, with smooth transitions.
- The hole sprite should be cleaner, simpler and closer to the approved chunky,
  coloured-outline art direction. The Human associates two/three-hole jumps with
  visual glitches and wants ordinary jumps to cross only one hole tile.
- Preserve long rows of holes dividing a room: a north–south trench can still be
  crossed east–west at its one-tile width. A hole at a T/+ path junction remains
  an interesting directional crossing. Multiple adjacent holes should look like
  a joined ditch rather than separate pits.
- The Human suggests rotating middle/end pieces to keep the art set small.
  That is an implementation suggestion, not an exact two-sprite requirement;
  elbows, junctions and isolated pits must also join correctly if supported.
- The Human wants Claude's useful sound-design proposals retained in delivery.

## Evidence and routing

Read-only comparison of v0.22.0 runtime `68e303d` with v0.22.1 `8442b79`
finds no change to music/sound/transport/catalogue modules or OST assets.
The current music player still uses `preload="none"` and disposes the old player
on track change. Warm cache/session readiness is a hypothesis; background time
does not establish its cause. SFX are synthesized locally by `src/sound.ts`.

The engine currently traverses consecutive hole runs and the generator samples
one/two/three-hole gaps. Restricting crossings requires coordinated rules,
content, solver/hints, saves and presentation work; changing art alone cannot do it.

| Requirement | Owner / status |
| --- | --- |
| Prompt contextual music and action cues | PT20 extension; early [AUDIO-01A](../plans/AUDIO-01-readiness-and-sound-design.md), then Plan 02 creative sound and 07B integrated qualification. Planned, not implemented. |
| Cleaner pits, single-width crossings and connected ditches | New PT49; [V22-HOLE-01](../plans/V22-HOLE-01-single-crossings-and-ditches.md), before Plan 04/02/05; Plan 09 consumes the new rules. Planned, not implemented. |
| Claude sound proposals | Existing CR-AUDIO-01–06/03a are jointly assessed in the [disposition ledger](../reviews/2026-09-05-sol-astra-opus5-v4-disposition.md). AUDIO-01 maps each to a concrete phase and listening gate. |

The published v0.22.1 comparison stays available unchanged. This feedback does
not supply the outstanding affected-iPad Full/Lite/Motion result. No new build
is requested merely to record these requirements.
