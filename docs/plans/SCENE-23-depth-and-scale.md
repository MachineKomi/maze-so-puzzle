# SCENE-23: readable doors, shared sprite depth and jump cleanup

Owner Astra, independent review Sol; branch `codex/adventure-xp`. Bounded addition
to candidate0.22.23 after [direct Human feedback](../user-playtests/2026-09-07-doors-depth-power-and-jump.md).
Web0.22.22 stays live until combined qualification. XP is preserved; this does
not change collision, accepted interior/exterior wall geometry, Power or saves.

## Sequence and acceptance

1. Register closed/opening doors by alpha bounds at the shared ground line.
   Preserve aspect ratio, allow jambs to reach1.12 tile width and height up to
   Ame's1.35 tile silhouette. Current door families measure1.25–1.35 tile tall.
   Door jambs intentionally differ from an actor's corridor-clearance rule.
   Floor weapons use precisely Ame's registered canvas scale times that
   weapon's existing held scale in field, battle, portal and jump contexts.
2. Put objects, followers, Ame, combatants, chest reveals and rescued friends
   in one bounded retained actor plane. Sort solids by interpolated ground Y;
   equal contacts sort object, friend, Ame. Artwork height/family does not
   decide order. Reuse the one scene-travel clock and retained window; no
   per-frame geometry reads, React writes, per-actor camera surfaces or new
   animation loops. Terrain and accepted wall cap rendering stay unchanged.
3. Opening doors are dissolving scenery behind solid actors. Grounded solids
   sit below foreground wall caps. Airborne Ame stays above every wall, with
   her shadow below the caps. Portal arrival remains an explicit magic pass.
4. Give Ame one independent Power-label layer above walls/solids, at34% tile
   size bounded14–28 CSS pixels. Share her travel, battle and jump pose clocks;
   reserve edge space. Preserve legendary/comfort presentation and one label
   through every replacement state.
5. Remove jump boot artwork and obsolete attachment styling. Keep the brief
   spring ring/shadow and actual boots pickup/inventory/capability unchanged.

## Qualification and resource budget

Real authored door/weapon routes, horizontal/vertical movement, all replacement
states, Full/Lite/Reduced/Static, camera rebase, top-edge numbers, jump departure/
apex/landing, no boots artwork, closed/open door ordering and image/source review.
Retain XP banking/migration/capacity checks; run the full unit suite and affected
browser contracts. Compare the combined source-matched production build with
frozen22 in separate five-pair frame/work enemy and camera cohorts.

Initial combined gzip9 measurement:178568 JS/24662 CSS, +348/+55 over XP-only
581ee00. Astra allocates400 JS bytes to this bounded scene change; CSS/public
fit existing ceilings. This is an engineering budget, not Human or physical-device
acceptance. Actor painting adds one transparent retained plane bounded to the
same view+4 tiles; paired traces must assess the practical cost. No media or
dependency change from this scene slice. [Artifact ledger](../LOCAL_ARTIFACT_LEDGER.md).

Rollback before publication can revert this complete scene slice while keeping
XP forward-compatible saves. After publication prefer scoped forward corrections;
never restore an older schema writer, clear progress, change accepted walls or
disable the [Vercel documentation guard](../VERCEL_DEPLOYMENT.md).
