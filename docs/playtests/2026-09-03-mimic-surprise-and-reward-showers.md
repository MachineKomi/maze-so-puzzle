# Feature intake — Mimic surprise and reward showers

- Captured: 2026-09-03
- Source: direct Human feature request
- Initial status: Captured and routed in `docs/PLAYTEST_BACKLOG.md`

## Desired player experience

Opening a chest should create a short, satisfying moment of anticipation and
reward. A chest may reveal treasure or a playful Mimic, while treasure,
rescues, and victories should produce a reusable shower of visible rewards that
spray outward and then magnetically fly into Ame.

## Human-directed behaviour

- A Mimic begins as a closed chest. On the first bump, Ame performs the same
  single-strike presentation used for an ordinary chest and the chest opens.
- The reveal is a good chest 65% of the time and a Mimic 35% of the time.
- A good chest contains either Gold Stars or Science Parts. Its amount is
  randomly selected from an explicit bounded range.
- If it is a Mimic, its enemy form and Power become visible. Existing combat
  rules then either resolve the battle or show the truthful too-strong guidance.
- Reward sprites burst from a good chest with simple semi-random two-dimensional
  trajectories, ignore walls and world-object collision, leave small
  currency-coloured trails, and then accelerate toward Ame like magnetized
  pickups with satisfying collection audio.
- The same reusable reward-shower language applies to ordinary Gold chests and
  Gold bags. Every rescued friend releases a bounded Gold-Star reward, and
  defeated enemies release Gold Stars and Science rewards in addition to their
  existing Power outcome.
- Ordinary chests receive a one-hit battle-like opening presentation but never
  retaliate. Mimics may use the full battle presentation after their reveal.

## Manager interpretation requiring implementation evidence

- Random outcomes and amounts must be deterministic for a semantic object and
  active run, persisted or reconstructable across save/resume, and impossible to
  reroll by repeatedly bumping, reopening an overlay, or reloading a save.
- Currency totals are gameplay truth and commit atomically. Particle arrival is
  presentation only; cancellation, navigation, reduced motion, or dropped
  frames cannot lose or duplicate rewards.
- A large numeric reward does not require one rendered particle per unit. The
  presentation uses a bounded visual count and communicates the exact credited
  amount through text/count-up feedback.
- Mimic/reward randomness cannot be required for an ordinary solution or create
  an unknowable progression gate. Authored placement and solver evidence must
  remain valid for both reveal outcomes.
- This is a playful, non-monetized surprise. It must not create a paid chance
  mechanic, pressure loop, or repeatable save-scumming economy.
- Exact Gold/Science ranges, enemy drop tables, reveal Power, and replay policy
  remain balance decisions to freeze in the Gameplay Design Spec before runtime
  implementation.

## Intended ownership

- Plan 03: coherent closed/open/Mimic and reward-pickup static assets and
  production geometry only.
- Root gameplay contract and Plan 09: deterministic reveal/reward rules,
  persistence, solver semantics, balance, authored placement, and campaign use.
- Plan 02: reusable burst/ballistic/trail/magnetic-collection choreography,
  presentation cancellation, count feedback, and SFX integration.
- Plan 05: the bounded chest strike/open/Mimic reveal animation frames where
  they fit its approved frame tranche.
- Plan 07B: overlap, frame-time, decoded-memory, audio, and lower-tier/reduced-
  motion qualification.
- Plan 10: later co-op reward-recipient presentation without duplicating shared
  rewards or changing the solo contract.
- Plan 13: closure only for compatible pieces left unresolved by those owners.

