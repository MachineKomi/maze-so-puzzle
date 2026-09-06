# BOOK-02A — a Book of discoveries worth opening

Prepared 2026-09-06. Implementation waits for the Human's next execution prompt.
Astra is the default runtime writer; actual Sol reviews independently. Root owns
the encounter/save contract and qualification. This is the first Book slice,
not a replacement of the five-page Book already delivered.

## Outcome, authority and dependencies

The child can see the shape of a friend or guardian still to meet, recognize a
new encounter immediately, and enjoy a truthful growing collection. Preserve the
praised warm pages, large art, short lore and accessible controls.

[PT50/51](../playtests/2026-09-06-depth-discovery-and-celebration.md) supersedes
older visible-all-friends and question-mark Bestiary instructions. Read the
[roadmap](00-integrated-implementation-roadmap.md), [UI-02](UI-02-adventure-book-and-focus-polish.md),
current joint state and progress/reset/active-run source in full before edits.
Begin after the bounded wall qualification decision, against its qualified
predecessor or an explicitly isolated accepted baseline if R1 remains held.
Do not make Book progress depend on waiting for a physical iPad beauty verdict.
Plan09-P0 must first provide a reviewed obtainable-roster snapshot.

## Freeze the source contract first

At assignment SHA, inspect `BookFriends`/`BookBestiary` in
`src/ui/screens/AdventureBook.tsx`, `src/progress.ts`, legitimate reveal selectors,
existing enemy encounter wiring, catalogue resolvers and progress tests.
Friends currently expose the full species roll-call and rescue totals. Enemy
discovery and Bestiary X/Y already exist. Implement the missing friend encounter
truth and revised card treatment; do not create a second progress store.

Write a small contract table before coding: identity, legitimate encounter event,
obtainability source, migration evidence, reset behavior, missing-art policy,
future-ID policy and consumer. Root and Sol review that table with the code.

## Required behavior

- Freeze the current playable obtainable friend/guardian sets from Plan09-P0,
  with a source rationale for each admitted ID. Catalogue presence alone is not
  obtainable content. Include actual authored or supported generated access;
  exclude tester-only, dormant and future Plan09/10 content. Deduplicate aliases.
- X/Y means unique encountered eligible identities / unique obtainable eligible
  identities. Display total rescues separately; neither encounters nor repeated
  rescues inflate X. Keep safe historical/future IDs in storage without counting
  unadmitted IDs. Do not erase genuine history when eligibility later evolves.
- Undiscovered entries show grey silhouettes of their actual approved sprites.
  No visible name, question mark, description, rescue count or locked prose.
  Provide a neutral accessible label without hidden identity or lore. Empty
  discovery should be inviting and readable without invented progress.
- Silhouettes intentionally reveal shape, as requested. This permits bounded
  approved silhouette imagery for the mounted Book page, not eager full lore-card
  art, hidden map positions or catalogue-wide presentation preloads. Choose the
  cheapest crisp approach at actual sizes; no mandatory per-card live blur.
- On legitimate encounter, reveal color, name and the short original one-liner.
  Friends count when genuinely encountered while caged, before rescue or maze
  completion. A rescue also proves encounter. Preserve current enemy reveal,
  direct-interaction and disguised-Mimic boundaries.
- Fogged/off-camera-hidden content, loading a level, mounting the Book, viewing
  lore, prefetching art, tester fixtures and a secret Mimic outcome never count.
  Use the accepted gameplay reveal model, not DOM intersection or network loads.
- Persist discovery at the event boundary, deduplicated and without waiting for
  completion. Reopen/restart retains it; Reset Progress clears it with the same
  progress owner. No new currencies, rewards, RNG calls or puzzle-rule changes.
- Historical **species-specific** rescue records prove those friend encounters.
  An aggregate rescue count or completed chapter does not prove which species
  was seen. Preserve unclassified totals honestly. Do not scan today's maps to
  invent old encounters; do not relabel every already-visible card as discovered.
- Extend the validated progress schema only as necessary. Preserve currencies,
  completion receipts, pending exits, active runs, best records, preferences and
  conservative unsupported-future-profile behavior. Storage failure cannot stop
  play or cause destructive default write-back. Add meaningful migration tests.
- A discovered friend may show the existing rescue count. Garden membership is
  absent until Plan10 supplies actual ownership; no decorative membership badge
  or empty claim today. New all-met/Bestiary awards wait for Plan09 roster and
  award contracts; all-Garden waits for Plan10. Existing earned stickers remain.
- Preserve five page names/order, selected tab/scroll, detail-card focus return,
  Home/Resume access and a stable active run. Unknown silhouettes need not open
  a lore dialog; keyboard/screen-reader behavior must match their actual action.

## Acceptance and delivery

First demonstrate empty / partly discovered / fully discovered pages at actual
size and freeze the roster/migration contract. Then implement and verify:

1. A visible unrescued friend becomes known and remains so after reload; hidden
   objects and tester visits do not. Repeat encounters produce no extra writes
   or rewards. Disguised/visible legacy Mimic cases preserve current boundaries.
2. Fresh, old species-specific, aggregate-only, malformed, storage-failure and
   future-schema profiles preserve their promised data. Reset is consistent.
3. Every denominator ID has real current obtainability evidence. X never exceeds
   Y; rescues, Garden and encounters remain distinguishable. Migration neither
   deletes genuine history nor fabricates discovery from current content.
4. No unknown identity leaks through alt/title text, headings, accessible names,
   hidden dialog content or eager detail requests. Approved shape is intentional.
5. Desktop/iPad-size/compact landscape, native minimum and enlarged text retain
   readable tabs, silhouettes, X/Y, names and card controls. Pointer/touch/keyboard
   navigation and close/return do not move the player; Plan08 consumes stable IDs.
6. Lazy image/decode failure preserves layout; repeated page switching/open/close
   releases work. Record new bytes, active requests and decoded image bounds.
   Compare against the same predecessor; do not accept a collection-page preload
   merely because compressed delivery still fits a global cap.

Use focused store/encounter/migration and UI tests plus affected shared browser
scenarios. Root runs required full integration/release checks once the slice is
ready. Sol independently checks code and rendered states; report physical-device
and family comprehension separately. One voluntary playtest asks what the grey
shape means and whether meeting a friend changes the Book before rescue.

Checkpoint the complete schema/UI/test/spec change together. Roll back that
change as a unit; preserve profiles written by the candidate through the frozen
forward-data policy. Record inputs/outputs in the artifact ledger. A tested web
slice and its Windows qualification remain separate release decisions.
