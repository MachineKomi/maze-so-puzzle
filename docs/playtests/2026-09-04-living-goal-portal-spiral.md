# Playtest/product intake — living goal-portal spiral

- Date: 2026-09-04
- Source: direct Human feature request
- Status: captured for manager triage

The upright objective star already contains a lovely central spiral suggesting
a magical portal. Make that aperture feel alive: the spiral should turn slowly
inward, glow and breathe with the goal, and may draw a small bounded set of
particles toward its centre where they disappear.

The preferred construction is layered and non-destructive. Keep the approved
static goal sprite as identity authority, then overlay either a separately
authored feathered/transparent spiral aperture or a clean code-native mask that
matches it. Rotate and pulse the overlay programmatically rather than replacing
the whole sprite with a large flipbook. The effect must stay behind the goal's
front rim, remain readable at gameplay scale, and never imply a different
destination or gameplay rule.

Reduced-motion and lite/static modes need an attractive luminous aperture
without continuous rotation, scaling, particle travel, or animated blur. The
full effect must be finite in node count, stop when the goal is absent/occluded,
and coexist with the stronger goal-entry and victory choreography.
