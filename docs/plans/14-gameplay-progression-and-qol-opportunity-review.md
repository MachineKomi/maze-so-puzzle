# Plan 14 — gameplay, progression and quality-of-life opportunity review

Status: execution brief only, prepared 2026-09-05. Final opportunity review is
pending RC-01; no recommendation or new feature is approved by this document.
Owner: root with Human decisions. Complete the eventual review in this same
canonical file, replacing the pending-results portion rather than creating a
second competing strategy document.

## Purpose

After the integrated game is playable and qualified, ask what would make it more
satisfying, simpler or more fun. Distinguish remaining observed friction from
the understandable temptation to keep adding systems. The accepted release
remains usable while this planning-only review takes place.

Read the vision, roadmap §5.14, full closed backlog, final campaign/co-op/Garden
specs, release/family evidence and relevant source. Use product-brainstorming,
synthesize-research and write-spec where available. New external claims need
appropriate primary-source verification; the game's own observed evidence leads.

## Method and option set

1. Frame the player jobs: enjoy traversal, understand a solvable next choice,
   feel durable accomplishment, discover friends/world, enjoy returning, and
   stop/resume easily. Record actual friction and successful moments separately.
2. Develop at least seven materially distinct approaches before choosing.
   Include all the required options below, one inversion and one removal; do
   not present seven variants of XP as meaningful divergence.
3. For each option, state benefit, evidence strength, affected players,
   dependency/cost, co-op/accessibility implications, failure mode, cheapest
   experiment and what result would reject it. Compare each with doing nothing
   systemic and improving the existing journey instead.

Required comparison directions (hypotheses, not implementation):

- Persistent Adventure level/XP and durable milestones, with no farming pressure.
- Friend/Garden/collection-led progress without permanent combat advantage.
- Mastery, chapter discoveries or cosmetic recognition using existing rewards.
- Upgradeable convenience, including sprinting, with movement/camera safeguards.
- Bounded wall hopping or assist options, with explicit topology/solver impact.
- Personal sticker placement versus the simpler earned-achievement showcase.
- Removing repeated friction/copy/actions while retaining per-maze resets and
  their puzzle fairness; include a no-new-progression alternative.
- Text-only, sparse vocal reactions and short voiced lines as a separate audio
  decision, not an assumed add-on to progression.

Consider who might prefer a fresh fair puzzle over a stronger persistent avatar.
Do not interpret per-maze inventory reset as a defect solely because it resembles
another genre. Durable recognition may solve the feeling at far lower rule cost.

## 2026-09-05 v0.20.1 wishlist boundary

The Human's reward fantasy in
`docs/playtests/2026-09-05-v0201-wishlist.md` includes a possible later shower of
glowing, holographic-rainbow XP crystals that home into the moving player with a
subtle, satisfying sound. Record this as a presentation preference for the XP
option, conditional on a separately approved persistent-progression design.
Plan 02 may deliver Gold/Science showers now through its own scheduled work;
it must not invent an XP balance, drop source, spending rule or permanent Power
advantage merely to fill a visual channel.

If XP is shortlisted, compare the value of a durable mastery/collection record
with a new currency, and specify credit timing, migration, per-source caps,
replay/farming rules, co-op attribution and visual/audio budgets before an
experiment. Crystal arrival must remain cosmetic, exactly-once reward credit
must precede the effect, and homing must track the moving collector without
prolonging input locks. Full/reduced/static treatments must communicate the same
award without noisy repeated chimes or large particle populations.

PT22's safer designer-owned Mimics and richer Gold/Science defeat rewards,
PT41's selected original cute/spooky friends, and PT42's satisfying harder
puzzles with explicit generated difficulty already belong to Plan 09. Do not
defer those approved programme requirements to this opportunity review or treat
them as reasons to introduce persistent combat advantage. Evaluate any further
progression against the final game after those improvements are qualified.

## Additional wishlist 20260905-02 — preserve the early mechanics decision

Read `docs/playtests/2026-09-05-02-room-variety-and-mechanics.md` and Plan 09's
PT43/44 dispositions. Monster/treasure rooms and monster/treasure whole-maze
profiles are Plan-09 content delivery. The bounded comparison of intuitive new
mechanics happens during Plan-09 design preflight, before dependent maps freeze;
it is not work to postpone wholesale until this late opportunity review.

Use this stage to reconsider only explicitly deferred/unselected hypotheses in
light of the accepted game's actual challenge, comprehension and replay evidence.
Retain the original reason for each deferral and state what new observation
would justify revisiting it. Compare any proposed new mechanic with removing
friction or making richer use of existing rules. Early mention or a promising
paper puzzle is not runtime approval; PT14 spikes/ice and any new switch/push/
traversal idea still need an explicit scoped specification and Human decision.
No late new-rule proposal may silently invalidate accepted campaign, save,
solver/Hint, input or release qualification.

## Decision gates

Shortlist at most three product experiments with an explicit value/risk reason;
voice feasibility may be recorded separately because its rights/content pipeline
is different. The Human chooses accept/defer/reject. Experiments that alter code,
saves, balance, assets or real player profiles require a separately scoped
implementation plan; this review authorizes none.

For XP, state sources, duplicate/farming behavior, optional-rescue parity and
whether it alters Power. For sprint/hopping, enumerate doors, hazards, portals,
camera, narrow corners, controls, co-op, seeds, solver and migrations. For sticker
editing, compare persistence/controller complexity with recognition value. For
voices, cover consent/rights, scripts, subtitles, mix, offline bytes and failure
fallback before any generation. No mandatory Plan-09 integration is deferred here.

## Pending results template

At execution, record:

1. Exact RC source/artifact and evidence reviewed, including sample limitations.
2. Observed problems, retained strengths and Human preferences.
3. Opportunity/option comparisons with evidence versus inference labelled.
4. Recommended shortlist and rejected/deferred options, costs and experiment gates.
5. Human dispositions, any newly authorized plan IDs and dependency/release impact.

Do not invent playtest results or fill this template from assumptions. Plan 15
runs after this decision and any accepted follow-ons, as the last programme task.
