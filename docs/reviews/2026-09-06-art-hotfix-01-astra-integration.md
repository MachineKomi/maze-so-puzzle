# ART-HOTFIX-01 — Astra integration acceptance

2026-09-06. Independently reviewed actual Sol candidate
`c724c954fd302d22f391d25e88ab467301ac047c` over `dfbc425` in an isolated branch.
**Accepted for a separately versioned successor; not deployed by this review.**

## Authority and pixels

[Root decision](../source-assets/publication/tessera-field-alpha-hotfix-r02-approval.json)
binds the original candidate, approved recovered master and exact field r02.
[Publication record](../source-assets/publication/tessera-field-alpha-hotfix-r02-publication.json)
SHA256: `19d7d7811fab6a287b4fec470b133df2b752b10be8d10ae33f2350079bc10755`.

Runtime: `tessera-dolphin-v01-friend-field-256-r02.webp`, 42980 bytes, SHA256
`0fa2cd354705e591c3f70fa0f50e050cf3c0e50e78bb6e54fe31b0be0ca4c156`.
Coral fins/tail are solid again. No regeneration, source RGB/identity change,
alpha reclassification or registration change. Float centre is remeasured.
Only Tessera's generated field row changes; other rows/order remain exact.
Source status is approved with root evidence; candidate report and r01 remain.

## Checks

- Dedicated rebuild/approval: 5/5; complete art suite: **136/136**.
- Global art validator: **0 errors**,429 declared historical warnings; generated
  manifest refreshed, never manually patched.
- Project: **501/501**,49 files; TypeScript/production build passed.
- Performance contracts pass: JS gzip9 **153284/153307**, CSS **23512/30227**,
  public **165031011/165031011**. Versus v0.22.2: +10JS,0CSS,+42980public bytes.
  Named art allocation covers the retained file; no new JS allocation.
- Selected field transfer decreases1382 bytes. Active field decoded size stays
  one256px RGBA image; retained-inventory upper bound grows262144 bytes.
- Production browser1280×720: Book card and Maze9 cage select256px r02;
  contextual dialog retains approved512px r02. Images complete, zero console
  warnings/errors. Root inspected field light/dark, cage, follower composition
  proof and Book dialog. Consumer tests prove shared resolver selection.
- Actual follower movement/native build remain successor packaging checks, not
  claimed passes here. Physical iPad performance/family acceptance remain open.
- Whitespace passed. No gameplay/save/camera/audio/dependency/Tauri changes.

External browser evidence in `C:/GameDev/maze-game-qa/output/playwright/`:

| File | SHA256 |
| --- | --- |
| tessera-book-dialog.png | bd2b377ed8a2b3be9aada1e837b7325a204fe74dd21ba9a281ea223b90e893ba |
| tessera-maze9-cage.png | 12b3edd60210c323ff94445d29e4d891e370234d3231370e1aacecf7e6577772 |

## Checkout recovery and rejected attempts

Initial art check235errors included inherited approval-byte mismatches and
missing ignored proofs. Independent read-only audit examined496JSON/2175text
bindings. Ten exact authorities reproduce original hashes using CRLF;
`.gitattributes` now preserves those bytes. Other mutable manifest inputs useLF.
**No historical approval hash or substantive source content was rewritten.**
First manifest attempt lacked v14 proofs; a subsequent full check found38 nested
missing files. Restored the original packet from the existing external/ignored
archive with exact per-file hashes. Final art check passed.

A fresh clone still needs the historical ignored v14 proof packet restored from
the project's separate backup for the complete art audit. Canonical review/index
list exact hashes. EOL portability is fixed; ignored screenshots are not falsely
claimed backed up by Git. Runtime build/focused Tessera reconstruction do not
need that archive. Uploaded v0.22.2 text attachments now preserve exact bytes.

## Rollback and next owner

Restore only the old Tessera field row and source-record pointer; preserve both
files and records until Plan12. Main/v0.22.2 remains camera-only. Actual Sol may
implement PLAY-A from this branch with root review and a measured allocation.
Never attribute a changed-cadence result to the isolated camera experiment.
