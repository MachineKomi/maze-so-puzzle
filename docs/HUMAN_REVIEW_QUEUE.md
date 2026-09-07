# Human playtests and decisions

Single current queue, requested2026-09-06. Mention the open items at the end of
each development response. The Human can reply when available; independent
implementation and qualification continue. Preserve completed observations in
the linked cumulative records rather than deleting or overwriting them.

| ID | Request | Status / effect on work |
| --- | --- | --- |
| Q08 | On the changed CAMERA-17 build, try campaign maze2 and Lanternlight Labyrinth on iPhone13/iPad8 using the same browser, Full quality and Regular pace. Is camera travel smooth, including reversals and hole jumps? Please include OS/browser version and whether it worsens after a few minutes; the smooth iPhone17 is a useful control. | **Implementation under qualification; do not repeat the old build yet.** [Report/limits](user-playtests/2026-09-07-modest-device-camera-stutter.md), P19. Physical confirmation remains open; no RAM threshold is established. |
| Q01 | On0.22.15 or newer, do the balanced wall caps, clean perspective cutout and larger grounded sprites look right? Walk a horizontal corridor and turn with friends/items; check lower-foot overlap, faces and Power readability. | **Ready since0.22.15, retained in16; P17 is the short journey.**13's tall3D/lighting direction remains accepted. [Public build proof](reviews/2026-09-07-v02215-public-verification.md), [actual feedback](user-playtests/2026-09-06-v02213-wall-acceptance-and-refinement.md). |
| Q02 | On0.22.13 or newer, jump over a hole while the camera is away from its outer clamp. Does it follow Ame smoothly? If it still jerks, note device, maze and motion/quality setting. | Open; the latest report names0.22.12, before the published repair. |
| Q03 | Should persistent Adventure/account levels grant only recognition/cosmetics, or eventually change puzzle Power? | Nonblocking direction check. Recommended/default first implementation: recognition only, preserving solvable per-maze Power puzzles. |
| Q04 | On0.22.16, do the restored liquid banks/fading edges and wall shadows blend naturally, with water/lava/poison feeling alive? | **Ready on published0.22.16; P18.**14 feedback drove this revision; no new Human beauty acceptance is inferred. [Public proof](reviews/2026-09-07-v02216-public-verification.md). |
| Q05 | Physical loot: burst/bounce/settle, spin, pickup range and satisfaction. | Not ready; staged implementation follows the loot contract. No repeated old-build test requested. |
| Q06 | Should rare eggs be enabled only once there is a visible usable egg inventory, or should eggs accumulate earlier? | Nonblocking direction check. Default: deliver protected usable inventory before enabling egg rewards. |
| Q07 | On0.22.16, select a middle story maze through the Book, finish and choose Next: does it advance, with Stay still available? | **Ready on published0.22.16; P18.** Primary Next focus and tester/normal selection are repaired; routing/save checks pass. Final chapter explicitly offers Surprise. [Qualification](reviews/2026-09-07-v02216-web-qualification.md) distinguishes reproduced causes from the original interaction. |

[Cumulative family checklist](PLAYTEST_CHECKLIST.md) retains P5–P18, phone/audio,
Book comprehension and device limits. [Human decisions](HUMAN_DECISIONS.md) owns
accepted steer. [Latest loot intake](user-playtests/2026-09-06-physical-loot-and-account-level.md)
preserves every new request. No unresolved queue item is permission to invent
Human approval or silently pause unrelated authorized work.
