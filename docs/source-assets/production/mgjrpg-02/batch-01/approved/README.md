# `mgjrpg-02` Batch 01 approved transparent masters

This directory contains the 14 Human-approved, deterministic RGBA 512 px
masters from Batch 01. These are tracked production inputs, not disposable
proof files and not active runtime catalogue pointers.

- Source authority and exact generator output IDs: `../run-record.json`
- Human decision and three exceptions: `../human-review-r01.json`
- Immutable exact prompt snapshot: `../PROMPTS-r01.md`
- Rebuild command: `npm run art:proof:mgjrpg02:batch01`
- Derivative recipe: `flat-impossible-matte-alpha-unblend-v1`
- Alpha contract: straight RGBA, minimum four-pixel transparent gutter, hidden
  RGB dilation, zero visible exact-black pixels, and zero measured matte
  contamination.

Lamia v01, Soda Slime v01, and Minotaur v01 are intentionally absent because
the Human rejected them. Their fresh v02 source replacements and exact prompts
are preserved under `../../batch-01-r02/`; they remain pending review and have
not been promoted here.

Runtime WebP derivatives must be generated from these masters or from their
bound immutable matte originals, versioned under `public/assets/`, validated,
and then selected through the catalogue. Never overwrite an approved runtime
version. No runtime asset may be retired until the Plan 12 sweep proves every
consumer and rollback path complete.
