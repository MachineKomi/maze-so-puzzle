# RC-01 — integrated release-candidate qualification

Status: pending post-Plan-12 reviewed checkpoint. Prepared 2026-09-05.
Owner: root release manager. This is qualification, not an open-ended feature pass.

## Outcome

Prove that the exact game and artifacts being shared agree with the final
campaign, UI, input, art, audio, accessibility and save contracts. Plan 07B's
earlier measurements cannot certify the later campaign, co-op, brand or cleanup.

Read roadmap, Plan 13 closure, Plan 12 report/ledger, all final subsystem specs,
performance budgets, release checklist, deployment docs and current manifests.
Freeze exact source and lockfile hashes; use clean checkouts and isolated test
profiles. Preserve a known-good release and verify ordinary-save backup/restore
before any intentional migration testing of real data.

## Qualification matrix

| Area | Required evidence |
| --- | --- |
| Content | All 24 stable story IDs, 4 inserted + 4 appended history, ordinary/perfect solver routes, mandatory roster/terrain consumers, generated version/golden seeds and final size/teaching/pacing disposition |
| Persistence | Old supported saves, current resume, pending exit, exactly-once rewards, Stay/restart, co-op/Garden migrations, corrupt/unsupported data recovery, preference preservation and isolated preview profiles |
| Interface | Final eight-profile viewport matrix from Plans 07/08, including 1280×800 Steam Deck; maximum Bag/friends/text, Normal/Big, every overlay, earned/locked details, 200% text/spacing, focus/target/contrast and semantic image failure behavior |
| Controls/comfort | Keyboard, pointer/touch, on-screen and supported gamepad journeys; MOVE-01 travel, held boundaries, input latency, reconnect/focus loss, safe defaults; physical claims tied to actual devices |
| Presentation | Final art metadata, light/region seam, VFX/sprite cancellation, reduced/static truth, no stuck travel/effects/audio or resource growth after repeated transitions |
| Audio | Six contextual pools including Garden, original files/provenance, Previous/Next/Shuffle, activation/mute, context changes, audible transitions, failed-media recovery and offline playback |
| Performance | Final exact inventory/allocations, qualified reference/low-end/WebView cohorts, input-to-visible response, continuous and overlap scenarios, decoded/cache limits and S01–S11 lifecycle evidence |
| Delivery | Clean production web and desktop build, offline assets, package reachability, version/profile consistency, CI, canonical Vercel deployment, real portable/installer journeys and checksums |

Critical rules/save and content coverage are exhaustive across the supported
identities. Use a reproducible covering/pairwise matrix for art/effect combinations
and document gaps. Reuse accepted evidence only when source, build and relevant
dependencies are unchanged; record why it remains valid. Run required full checks
once on the final candidate, repeat after fixes only as affected risk requires.

## Release transaction

The v0.20.1 wishlist adds final regression cases to the matrix: all five Book
pages/cards and encounter/reset/migration truth (including legacy Candy aliases
and unsupported future-profile protection); no-scroll dense victory with actual
friend dances and Garden action; modality-appropriate focus; offcamera follower
identity/corridor continuity; ring attachment and full-cycle sprite sharpness;
typed harmonious terrain and the three named visual-defect mazes; dense varied
poison and moving-collector reward/audio; every allowed Mimic policy branch and
richer-loot comparator; Easy/Medium/Hard/Surprise me identity, learned-rule
eligibility and real puzzle evidence. Use the established covering matrix,
not another exhaustive cross-product. No generated active-run resume is implied
where the accepted platform contract does not support it.

1. Resolve next unused version and intended release status. Reconcile package,
   Tauri, app display, content versions and profile namespace. Commit/push the
   reviewed candidate before building distributables; exact SHA is hash authority.
2. Verify GitHub CI and Vercel independently. Smoke the canonical URL, selected
   assets, version and save journey; a successful push is not a deployment result.
3. Build Windows artifacts from that clean source. Inspect file versions and
   hash/byte identity. Launch actual WebView content and play/save/reopen; a
   responding native window alone does not prove the game works.
4. Produce immutable SHA/version-named artifacts, generated manifest and
   checksums, short launch/playtest note, known issues, toolchain, namespaces,
   source/build identities and rollback. Keep binaries outside Git and publish
   as GitHub release/pre-release assets according to the approved release status.
5. Confirm uploaded bytes/metadata and usable download paths. Never overwrite a
   tag, earlier binary or evidence to make it appear current; use a new revision.

Unsigned/internal previews may state pending signing/clean-host/hardware rows.
Do not call a platform supported, a build signed/store-ready, or the release fully
qualified while its required evidence is absent. A blocking defect returns to
its owner with a narrow fix; a changed pointer reopens affected Plan 12 evidence.

## Deliverable and exit

Create `release/RC-01-<version>-manifest.json` and matching PLAYTEST/checksum
records, using existing release conventions. Record pass/fail/pending per row,
evidence provenance and exact Human/family acceptance. Root reports the actual
release disposition without treating absence of complaints as approval.

Plan 14 may study opportunities against this preserved candidate. Any approved
follow-on work receives a separate plan and requalification scope; it does not
retroactively destabilize or invalidate the preserved release artifact.
