# FP-UI1 v0.22.0 — initial Human playtest feedback

Recorded: 2026-09-05. Source: Human message in the outgoing Astra orchestration task.
Disposition: **STILL UNDER REVIEW**; positive initial reaction, detailed device findings pending.

## Build attribution

The message follows delivery of FP-UI1 **v0.22.0**, runtime source
`68e303da680d5aec0ba71154949c5a2a0d1697ae`.
Delivered Windows file: `Maze-so-Puzzle-0.22.0-FP-UI1-68e303d-locked-portable.exe`,
SHA-256 `b230c5681806737e884e1638fce0fdadf1a3155952e35cc5d73b8b76bdf77329`.
Delivered web: https://maze-so-puzzle.vercel.app/; the 13:53 UTC handoff audit
confirmed its entry bytes still match that runtime build.

This is the release identity associated with the feedback, not an independent
Human confirmation of the executable hash or the build loaded on every device.
The Human called it the “latest build”; exact tested filename, per-device build
label, OS/browser versions and URLs were not supplied in this message.

## Human's initial report (verbatim excerpt)

> ok - overall HUGE improvement. Thank you so much for all of the hard work on this and for addressing I think maybe all of my feedback. I'm busying capturing screenshots for all screens on ipad, mobile phone, and desktop, and will provide my detailed feedback (what I love what bugs and issues we still have which are far fewer especially on ipad and desktop).

## Observations and follow-up

| Kind | What the Human reported | Evidence boundary / follow-up |
| --- | --- | --- |
| Improvements worth preserving | Overall “HUGE improvement”; thinks “maybe all” previous feedback addressed. | Preserve the current UI-03 experience as the comparison point. Individual fixes are not yet Human-confirmed. |
| Device/context | Capturing all screens on iPad, mobile phone and desktop. | Models, dimensions, browser/OS, input method and exact per-device artifact are pending. Do not infer that all captures or tests are complete. |
| Regressions/defects | Remaining bugs/issues are “far fewer especially on ipad and desktop.” | No specific new defect, reproduction or diagnosed cause was provided in this message. Phone severity is not quantified. |
| Requested follow-up | Human will provide detailed likes/issues and screenshots, and ask Claude to update feedback. | Attach new dated evidence and route confirmed findings through the backlog/joint review; keep observations separate from technical causes. |
| Uncertainty | “I think maybe all of my feedback.” | Not a completed 61-row checklist or unconditional acceptance. No Amelia/family-session result was stated. |

No specific new runtime feature is requested in this initial report. The associated
instruction is a **documentation-only transfer** to Sol–Astra collaboration,
followed by joint review of the supplied Opus pack. It does not authorize adopting
that pack, advancing Agent 04 or skipping family gates.

Use the [family checklist](FP-UI1-checklist.md) and [feedback template](FP-UI1-feedback-template.md)
for the detailed follow-up. [Canonical joint state](../JOINT_ORCHESTRATION_STATE.md)
owns current acceptance and release status. Earlier v0.21.0 rejection and its
[61-row correction intake](2026-09-05-v021-ui-correction-intake.md) remain historical
source feedback, not a claim that the same defects persist in v0.22.0.
