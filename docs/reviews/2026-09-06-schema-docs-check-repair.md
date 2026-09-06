# Current-schema documentation check repair

2026-09-06, root Astra. Test/documentation only; no delivered runtime changes.

The receipt checkpoint `bcaab812026d6e24bb37e10e263681b612b8842f` failed
[verify CI34006241067](https://github.com/MachineKomi/maze-so-puzzle/actions/runs/34006241067).
Its annotation identifies `src/game/docsConsistency.test.ts:22`, which still
expected `schema-v5 progress`. The preceding architecture correction truthfully
describes the already shipped schema6. Runtime exports are
`PLAYER_PROGRESS_SCHEMA_VERSION = 6` and `ACTIVE_RUN_SCHEMA_VERSION = 3`.
The test was stale; restoring inaccurate v5 current-state prose would be wrong.

The two exact schema assertions now derive their versions from those existing
runtime constants. Neither assertion is removed or broadened. The architecture
reset allow-list also includes its missing current progress-v6 key, already
present through `PLAYER_PROGRESS_STORAGE_KEY` in `resetProgress.ts`.

Read-only local checks confirm the current schema phrases and storage key.
`git diff --check` passes. Full CI is the fresh verification gate; root does not
start a concurrent solver/build while Sol owns native Exit qualification.
The original failed run remains visible, rather than being relabelled a pass.

The failed documentation checkpoint's desktop job succeeded and Production
deployment6288238697 succeeded. Canonical HTML/JS/CSS were independently checked
byte-identical to frozen v0.22.4. Its runtime-source CI34004670826 and immutable
release qualification remain unchanged; the later documentation failure is not
evidence of a newly changed runtime or a reason to overwrite its attachments.
