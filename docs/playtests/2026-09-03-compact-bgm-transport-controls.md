# Feature intake — compact contextual BGM transport controls

- Captured: 2026-09-03
- Source: direct Human feature request
- Status: captured and routed; not implemented or playtested
- Related authority: `PT-20260903-20` continuous contextual original OST

## Human direction

Players should be able to change the currently playing BGM without leaving the
screen or activity. Required actions are Previous track, Next track and a
random/shuffle choice. Loop may also be useful, but is not yet a locked product
decision.

These controls must operate within the music set for the current context. For
example, a maze may navigate only the Maze playlist; the Garden, title, story,
victory and Adventure Book use their own pools.

The interface must not add a row of permanent buttons. Collapse all sound and
music actions—including the existing Mute/Unmute action—under one compact sound
control that expands when requested.

## Manager interpretation

- Preserve a single persistent Sound affordance in the shared cross-device UI.
  It opens an accessible popover, menu or compact sheet containing Mute/Unmute,
  Previous, Next and Shuffle/Random.
- `Previous` follows actual listening history inside the current context. It is
  not filename order and cannot pull a track from a context the player has left.
- `Next` uses the current contextual selector and its immediate-repeat avoidance.
  `Shuffle/Random` explicitly asks for a different eligible track whenever the
  current pool contains more than one playable track.
- Manual navigation participates in the same history and selection state as
  automatic progression. It must not create a second player, overlapping audio,
  stale timers or a route around preload/crossfade/fallback behaviour.
- A context change outranks manual history and any possible loop. Moving from a
  maze to a story scene selects from the Story pool; Previous cannot restart the
  old Maze track while the Story context is active.
- Empty, one-track and partially failed pools need explicit silent-safe fallback
  behaviour. An enabled, foreground session must not become silent merely
  because the player pressed a transport action.
- Rapid repeated transport input must cancel or replace the in-flight transition
  predictably. Tracks crossfade smoothly and the likely replacement is prepared
  before the outgoing track ends where platform policy permits.
- The expanded control needs equivalent pointer, touch, keyboard and controller
  operation, visible focus, accessible names and pressed/disabled state, and a
  reliable close/back action. While it is open, navigation input must not also
  move Ame.
- Sound state must be understandable without relying on colour alone. Avoid
  permanent Now Playing metadata or extra chrome unless testing shows it earns
  the space.

## Open decision: Loop

Loop is recorded as a Human decision rather than silently included. If approved,
it loops only the current track while the current context remains active; a
context transition overrides it. The Human must also choose whether Loop is a
temporary per-session choice or a persisted preference. The initial compact
menu should reserve a coherent place for it without requiring implementation.

## Intended ownership

- Plan 01: one compact cross-device Sound control and accessible disclosure
  surface; no music-selection policy.
- Plan 07B: contextual history, Previous/Next/Shuffle semantics, optional Loop
  policy after approval, preload/crossfade, fallback, lifecycle and media tests.
- Plan 08: semantic actions, focus navigation and full Xbox controller,
  keyboard, pointer and touch parity.
- Plan 02: only BGM/SFX coexistence and presentation-audio cancellation seams.
- Plan 10: supplies the Garden context/pool and inherits the same controls.
- Plan 13: bounded residual polish only if an owning pass does not close the card.

## Acceptance outline

- Every required transport action remains inside the active contextual pool and
  updates deterministic, testable playback history.
- Previous, Next and Shuffle behave sensibly for zero, one, two and many playable
  tracks, including a failed or missing candidate.
- Context changes, mute/unmute, natural track completion, background/foreground
  transitions and rapid repeated commands produce no overlap, silence gap,
  leaked player, stale timer or phantom selection.
- The same compact control and logical option order work on TV, desktop, iPad
  and the playable compact-phone layout.
- A controller-only user can open the menu, identify state, operate each action
  and close it without gameplay movement leaking through.
- Web and packaged Tauri evidence covers audible manual transitions and honest
  browser user-activation constraints.

