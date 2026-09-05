# UI-02 — Adventure Book, focus and victory polish

**Latest Human-directed correction, 2026-09-05:** UI-03 now implements the five-page Book, discovered bestiary, large cards, visible grey locked achievements, restrained focus and no-scroll victory layout before the corrected FP-UI1. Do not repeat or undo these slices. After Human playtest, this plan owns only remaining Book polish and newly evidenced defects. Read `UI-03-fp-ui1-correction.md` first.

Status: core slices promoted into UI-03; remaining polish follows family evidence.
Prepared: 2026-09-05. Owner: a fresh UI specialist task, started by the Human
from a root-prepared prompt after Plan 02; root reviews persistence semantics,
acceptance, checkpoint and release evidence. Root assigns disjoint ownership if
the Human authorizes parallel work; never overlap active runtime files.

Source: `../playtests/2026-09-05-v0201-wishlist.md`, items 3, 4, 10 and 11;
`PT-20260905-34` (focus), `PT-20260905-35` (victory), and
`PT-20260905-37` (Book tabs, bestiary and lore cards).

The earlier statement that this scope would wait until after FP-UI1 is superseded
by UI-03. Agent01 is finished. Consume the corrected preview's actual code and
family feedback; do not start by rebuilding its Book, discovery store or dialogs.

## Outcome and execution gate

The Adventure Book should make the child's discoveries easy to find, admire
and remember. Its five distinct pages replace the combined long page. Encountered
guardians and friends have inviting, original lore cards. Focus is
clear and carefully styled for the current input method. Victory feels like a
complete celebration, with every item on its popup visible without scrolling.

Execute **after accepted 02 and before 08**. Read the vision, integrated roadmap,
this complete plan, intake/backlog cards, accepted Gameplay/Art/UI/Lighting/VFX
specs, root MOVE-01 contract, current progress/reset/active-run modules and
Plan 08's input ownership before editing. Historical Plan 01 prose and the
2026-09-05 running candidate are evidence to reconcile, not frozen symbol names.

Use the accepted shell, DialogShell, catalogue resolver, motion preferences and
presentation director. This is a bounded return to those components, not a
second UI framework, input system, animation scheduler or progress store.

## Ownership and scope

| Work | Owner and boundary |
|---|---|
| Book tabs, card viewer, visual focus and final victory composition | UI-03 implements the core; UI-02 owns remaining evidence-backed polish. Preserve its semantics, stage geometry and approved art. |
| Encounter ledger, migration and persistence integration | UI-03 supplies schema6, legitimate encounters, legacy migration and future-profile protection. UI-02 preserves these readers and asks root to review any necessary evolution. No reward or puzzle-rule changes. |
| Victory celebration, species dance recipes and lifecycle | UI-03 supplies finite confetti and32 authored signatures. Plan02 evolves its broader director/lifecycle without restoring synchronized generic dances; UI-02 verifies composition. |
| Optional authored victory frames | Plan 05, using accepted species identity and the same director. No second completion trigger. |
| Canonical input normalization, controller navigation and modality truth | Plan 08. UI-02 supplies stable native actions, tab/card focus IDs and visual tokens; existing pointer/keyboard behaviour remains usable before 08. |
| Final guardian/friend roster, introductions and lore completeness | Plan 09, consuming the UI-02 schema/card template and updating content through stable IDs. |
| Integrated performance and family preview | Plan 07B qualifies the combined product for FP-CORE2. Root owns release transactions. |

Keep existing achievements and their earned-only showcase. Do not add persistent
sticker placement, XP levels, new reward currencies, collectible bonuses for
Book visits, combat powers, new guardian identities or a separate quest system.
The referenced JRPG Book/Pokedex experiences express taste; all wording, page
composition, ornaments and interaction styling must remain original Maze work.

## 1. Five readable Book pages

- Expose **Mazes, Friends, Bestiary, Stats, Achievements** in that order, with
  readable names and recognisable icons. Active page has a shape/position cue as
  well as colour. Use restrained page edges, dividers and tab bookmarks from the
  accepted Maze material system; decoration must not consume the reading area.
- Keep one active panel and one coherent tab interaction model. Keyboard users
  can select tabs, enter the panel, inspect an entry and return. Use correct
  tab/tabpanel semantics, roving tab focus and a documented activation rule;
  inactive panels are absent from focus and reading order. Plan 08 receives the
  same semantic actions for controller navigation.
- Preserve the selected tab and its reading position when opening/closing a
  detail card or Sound. Stable IDs restore the exact card invoker; if content
  changes while open, restore to the containing page's legal fallback. Back
  closes the detail before leaving the Book. Resume returns to the unchanged run.
- Each page owns its own bounded content region. Book pages may use one-axis
  reading scroll or explicit pagination; neither creates one long combined page
  or a scrolling tab strip that conceals available sections. Keep tabs and
  Home/Resume reachable at supported sizes and enlarged text.
- Derive maze entries from canonical campaign order and distinguish current
  versus historical-layout records. Preserve generated records and known versus
  unclassified rescue history. Stats and reset remain available without placing
  destructive reset beside routine card-selection actions.
- Empty, partly discovered and complete pages should feel intentional. The
  former locked-achievement concealment rule is superseded by UI-03: display
  recognizable grey real achievement art and its earning goal, with colourful
  earned cards. Undiscovered bestiary entries
  use a consistent mystery treatment and never leak hidden names/lore through
  alt text, accessible names, tooltips, filter results or eager asset requests.

## 2. Encounter truth and persistence

Freeze the following contract in the UI-02 implementation report and root review
before adding card content. Store semantic discovery, not a render-side guess.

- **Encounter rule:** first legitimate exposure through the accepted gameplay
  discovery/reveal model records the enemy identity; a direct interaction or
  defeat also qualifies. Mere level/catalogue loading, asset preloading, camera
  zoom, an unrevealed object, a hidden surprise chest or a tester preview does
  not. If current visibility and reveal APIs differ, publish one explicit
  gameplay-facing selector and prove the boundary with root review; do not infer
  discovery from mounted DOM nodes or request completion.
- **Mimic:** a disguised family becomes known only after actual reveal; a
  secretly preselected outcome cannot expose a Book entry. Today's visible
  ordinary `candy-mimic` enemy is a legacy exception: legitimate exposure counts
  now. Plan 09 migrates that entry to its disguised-family identity without
  duplicate entries or lost discovery. Do not require an event that does not yet
  exist to recognise today's visible Candy Mimic.
- **Identity:** use stable canonical enemy/species IDs. Per-level object IDs,
  labels, filenames and grid locations are unsuitable persistent keys. Resolve
  omitted legacy enemy styles using the accepted canonical default. Distinguish
  canonical EnemyStyle and MimicFamilyId keys through a documented stable entry
  mapping/alias contract; future Mimics are not ordinary enemy styles. Retain a
  documented safe policy for unknown/future IDs and catalogue changes.
- **Durability:** deduplicate legitimate discoveries and save them without
  waiting for a maze win. Restart, reload and repeated encounters never award
  money or inflate existing progress. Tester mode leaves the real ledger
  untouched. Reset Progress clears this history with the rest of the adventure;
  display preferences retain their existing separate reset policy.
- **Migration:** preserve existing currencies, campaign access, best records,
  rescue totals, completion receipts and pending exits. Historical completions
  do not prove which enemy species were encountered. Start unknown enemy history
  conservatively and explain the difference in welcoming copy; never fabricate
  discoveries by scanning a completed level's current object list.
- **Friends:** preserve documented rescue totals and unknown historical species
  honestly. Preserve access to existing friend names/records rather than
  silently converting the already visible roll-call into a new locked reward
  system. Every visible friend entry opens its card; a lore visit does not
  fabricate a rescue. Encounter-earned concealment applies to the new bestiary.
- **Failure:** malformed/old saves and unavailable/full storage receive explicit
  safe handling. An unsupported future profile must not be replaced by defaults
  when recording an encounter. Freeze a read-only/fallback policy and prove no
  write-back/data loss; an existing migration fallback alone is not sufficient
  evidence. An unwritable ledger must not prevent play or corrupt an active run.

Use the current progress schema and migration convention, with one validated
extension and meaningful migration tests. A second local-storage catalogue that
can drift from Reset Progress is not an acceptable shortcut. Root reviews
discovery timing, schema/unknown-data policy and reset/receipt interaction.

## 3. Friend and guardian cards

- A card shows the correct canonical name, a lovely large approved sprite and
  short original world-appropriate flavor text. A memorable preference, habit or
  gentle mystery should invite curiosity without becoming an encyclopedia page.
  Gameplay facts, if present, are separate from flavor and use current rules.
- Use one reusable card surface with keyboard, mouse and touch parity, explicit
  close, accessible heading/body and exact invoker return. Plan 08 implements
  controller access through the same actions. Avoid nested independent dialogs
  or any-key handlers that can also move Ame.
- Request the appropriate presentation rendition only for the selected card.
  Measure its optical size and DPR 1/2 requirements. A larger CSS box around an
  undersized field sprite is not full-resolution presentation. Report any
  genuinely missing rendition by semantic ID, consumer size, approved source,
  bytes and responsible art owner; do not redraw accepted identities or claim
  a semantic fallback fulfils a mandatory final-art gate.
- Cold, delayed and failed art loads retain meaningful name/copy and stable
  geometry. Locked entries neither preload nor reveal their full card. Reuse
  accepted artwork and licensed fonts, preserve provenance and source hashes,
  and document active decoded/resident cost rather than only encoded bytes.
- UI-02 supplies correct short initial lore for the currently supported entries
  using the Story Bible. Plan 09 audits every final eligible identity, resolves
  cast revisions and completes authored lore through the same content contract.
  Do not leave production placeholders while calling the initial Book complete.

## 4. Focus that fits its component and input

- Treat focus, selection, hover and pressed states independently. Replace the
  broad green emphasis with restrained component-specific Maze treatments. A
  small control and the entire maze viewport need different visual weight.
- Mouse/touch activation should not leave a persistent keyboard-navigation ring
  around the board. Keyboard and controller navigation retain an unmistakable
  current target and an intelligible board-input-region cue. Trying to move is
  not the only way for a non-pointer user to discover their focus location.
- Keep minimum 2px-equivalent focus visibility, 3:1 contrast against adjacent
  painted surfaces, unclipped/visible focus and forced-colours support. Do not
  substitute a faint glow, colour alone, moving decoration or target scaling.
  Verify the result at couch distance, not solely in enlarged screenshots.
- UI-02 adapts existing keyboard/pointer focus styling and publishes visual
  tokens/attributes for Plan 08's canonical input-modality state. Do not introduce
  a competing global source detector. Controller programmatic focus must later
  be explicit rather than relying solely on browser `:focus-visible` heuristics.
- Switching input method must not lose the focused control, activate it, move
  Ame or leave a stale focus treatment. Include gameplay, Book tabs/cards,
  completion, More, Sound and stacked-dialog cases in the state proof.

## 5. Complete victory without scrolling

The Human requests that the victory popup **never scroll and show everything
on it at once**. This is the target, not already-proven candidate behaviour.
UI-02 owns final composition; Plan 02 owns the celebration recipes it consumes.

- Design a measured composition for result, steps, rescued/missing friends,
  reward summary, new keepsakes and applicable chapter outro, with persistent
  Stay here / Next maze / Restart. Retain the accepted defaults: Stay if friends
  remain, Next when all are rescued. Reserve and document the later Plan 10
  Garden-action case without inventing a destination before Garden exists.
- Keep the existing pending-completion transaction. Animation, card inspection,
  closing, resize and render completion never bank rewards. Stay, Next, Restart,
  reload and generated/tester/finale routes preserve accepted exactly-once and
  safe-continuation semantics. Missing friends are welcomed back, not framed as
  failure or stripped from the result to make the layout fit.
- Demonstrate the full required popup content at minimum phone through TV,
  safe-area insets, Normal/Big, maximum current and forecast friend/reward counts,
  longest authored text, 200% text and text-spacing overrides. Assert measured
  bounds, no occlusion and zero horizontal/vertical scrolling. Do not hide
  scrollbars, clip content, shrink type below the accepted minima or shrink
  interactive targets to pass a screenshot check.
- First produce actual dense-state geometry and a compact visual proposal. If
  literal simultaneous visibility conflicts with accessible minimum geometry,
  show root the concrete conflicting case and a reviewable alternative for
  Human resolution. Paging, summaries that omit previously visible information,
  or moving details elsewhere must not silently be declared equivalent to the
  request. No speculative permission gate blocks independent Book/focus work.
- Compose Plan 02's species-specific little dances with differing rhythm,
  amplitude, pose combinations and staggered starts. Paused frames stay lovely;
  reduced/static modes preserve the same result and choices. Plan 05 may replace
  inner poses with approved frames while keeping the same lifecycle and bounds.

## Delivery phases and evidence

1. **Entry audit:** confirm a root-reviewed/pushed clean predecessor and no other
   runtime owner; read actual symbols, choose explicit owned paths and capture
   dense Book/victory/focus before-states in the shared harness. List inherited
   defects separately from new scope. Freeze discovery/migration and component
   contracts, content/art gaps, rollback seams and a measured budget request.
2. **Persistence and one card:** implement the bounded root-reviewed discovery
   slice, migrations and one enemy/friend card canary. Prove existing records,
   tester isolation, unknown history and exact return before broad content work.
3. **Book and focus:** integrate five pages, current-entry lore, responsive
   cards, page restoration and component-specific focus. Publish stable native
   semantic IDs for Plan 08; extend the existing test runner, not a second one.
4. **Victory composition:** integrate accepted 02 recipes with the dense-state
   no-scroll design and unchanged completion actions. Resolve any demonstrated
   geometry conflict honestly before claiming this criterion accepted.
5. **Review packet:** provide changed-file/requirement evidence, final visual
   proofs, schema/reset notes, byte/decode costs, tests, deferred hardware/Human
   rows and Plan 08 handoff. Root reviews, commits and pushes the accepted
   checkpoint; the specialist does not change version, publish or deploy.

Anticipated owned paths are the accepted Book/card and completion UI modules,
their scoped CSS, a small canonical lore module, the minimum progress/reset/
discovery integration, meaningful tests, and a new implementation report such
as `docs/ADVENTURE_BOOK_SPEC.md`. `App.tsx` may need narrow integration; runtime
file names and exact scope must be established against the accepted predecessor.
Do not assume any file in the currently running Agent 01 tree is available now.
No campaign layout edits, new input adapters, asset retirement or soundtrack
transport changes belong here.

Budget discipline: measure against the accepted predecessor using the existing
07A harness and allocation ledger. Separate gzip JS/CSS, public bytes, decoded
image residency, card-opening latency and idle/animated work. Reuse UI/font/art
and director code; do not preload the roster, add a UI framework or relax timing
ceilings. Required new renditions or an allocation excess return a precise,
measured request to root; planning authorisation is not a byte-budget waiver.
07B independently qualifies the integrated product for FP-CORE2.

Acceptance includes the shared viewport matrix (including 568×320 phone,
844×390 phone, 960×540 Tauri, 1024×768 tablet, 1280×720 desktop,
1280×800 Deck geometry and 1920×1080 TV), safe areas, enlarged text, all motion
and quality tiers, empty/partial/full discovery, 24-entry campaign fixtures,
cold/failing DPR 1/2 art and keyboard/pointer/touch journeys. Run appropriate
targeted persistence/interaction tests, existing full project gates and actual
browser evidence at implementation time. Compilation is not a packaged
WebView2 interaction test. Physical screen-reader/controller/couch/family rows
remain pending until exercised; do not invent remote analytics or numeric
learning/satisfaction results.

The handoff gives Plan 08 stable tab/card/completion IDs, reading regions,
explicit safe Back/default actions, focus attributes and restoration fallbacks.
After Plan 09 final content, root repeats Book coverage, longest-card text,
discovery/migration and controller focus journeys against the final roster and
24 chapters. Plan 10 repeats completion geometry with its Garden destination.
No later content owner gets permission to replace UI/input/persistence contracts
merely because those new data are larger.
