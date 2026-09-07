# Moving yellow dot — Human feedback, 2026-09-07

Reported build: v0.22.10; the Human suspects earlier versions too. This is not
yet a reproduction on the current build.

> It is invisible when you are standing still - but when you move the character there is a very small flashing yellow blurry dot that looks to be located in the bottom right corner of the player character's tile. It's not super noticeable - but its kinda weird and I'd like to see it removed / resolved. Can go on the backlog since its not urgent, but it should be fixed before we ship the finished game.

Priority: nonurgent, required before final release. Astra owns runtime diagnosis;
independent source review is checking movement/footstep/actor/VFX anchors. Verify
actual moving pixels before naming a cause. Preserve legitimate pickups, player
grounding and gameplay movement. No further Human input is needed to investigate.
