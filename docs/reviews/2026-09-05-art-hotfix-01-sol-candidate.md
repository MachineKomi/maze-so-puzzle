# ART-HOTFIX-01 — Sol Tessera field candidate

Status: candidate for independent root source/image review and promotion. This
receipt records the bounded field repair prepared from
`9418ee245c16c645ec5a4dab03ded9e02ab97417`; it is not publication approval.

## Outcome

The damaged 256px Tessera Dolphin field rendition now has a forward-only `r02`
derivative made directly from the already approved recovered delivery master.
The operation repeats the established field registration and deterministic
cleanup/encoding path; it does not resize the 512px contextual presentation,
reclassify alpha, paint pixels, or regenerate the character. The prior `r01`
asset and record remain unchanged for rollback.

`springstep-sky-hollow` still authors Tessera at coordinate `1,11` with the
`moon-silver` cage. Cage, rescue, follower, and completion consumers continue to
resolve the same active `tessera-dolphin` catalogue identity. Contextual viewers
continue to select the independently approved 512px `r02` presentation.

## Bound inputs and outputs

| Item | Bytes | SHA-256 |
| --- | ---: | --- |
| Approved 1254px recovery master | 883,603 | `1e7a7f8d3a687bb27d5473eef9eff961b0affbf766403ade5bcc2051f02f1f0d` |
| Retained 256px field `r01` | 44,362 | `33ca2f6baeba27d42f0a331f3b973dff43d4fa9e8da6325b0d026a4ad404e9d2` |
| Candidate 256px field `r02` | 42,980 | `0fa2cd354705e591c3f70fa0f50e050cf3c0e50e78bb6e54fe31b0be0ca4c156` |
| Candidate source record | 9,640 | `d2803b50b0405d59aff77c9c73ed3b46a5d23e3468c59d3ec267a5af77b19292` |
| Candidate publication report | 5,073 | `4b2fee38e93a1a54f993796dfb505df8cf4ce5b80fa3857e22c7e04548496966` |
| Repair authority | 1,525 | `0d84fde031d0686206ec91242c8ccc5382f83c8f0e67b49608bd7703bf5ec03c` |

Registration remains `targetBox [0.1, 0.08, 0.9, 0.94]`, `align [0.5, 1.0]`,
and alpha threshold `3`. Both field renditions have alpha bounds
`[37, 20, 219, 241]`; pivot `[0.5, 0.84]`, visible bounds, and safe inset are
unchanged. The alpha-weighted float centre is remeasured as
`[0.52284155, 0.46120434]` because the missing coral fins are present again.

The repaired output increases thresholded-alpha coverage from 21,303 to 23,709
pixels, opaque coverage from 17,921 to 21,598 pixels, and summed alpha from
5,028,469 to 5,830,965. The source-space repair only raises alpha. After
premultiplied field resampling and component cleanup, 4,035 pixels increase and
135 pixels decrease locally; this expected edge-filtering effect does not change
canvas registration or alpha bounds.

## Catalogue preservation and reproducibility

The dedicated publisher pins accepted catalogue blob
`174d282e5b2cc68773bb27bdea63be3ae592ba8bb4e6d7e906cfa7e5275d8485`
from `9418ee`. It changes exactly the Tessera row. Every non-Tessera line,
semantic ID, order, activation status, and later corrective publication layer is
deep-equal to that accepted catalogue. Tessera remains active with the same
identity, art version, profile, dimensions, pivot, and visible geometry; only
its versioned source pointer and alpha-derived float centre change.

`--write` refuses before mutation unless the current normalized catalogue is
either the accepted base or this exact candidate, so future unrelated catalogue
work cannot be silently replaced. `--check` reconstructs versioned runtime and
provenance bytes in a temporary directory, compares the catalogue with normalized
line endings, and compares the ignored visual proof only when that proof exists.
Targeted `.gitattributes` rules preserve LF for the three new hash-bound JSON
families on Windows and Linux checkouts.

The ignored proof at
`artifacts/art-proofs/art-hotfix-01/tessera-field-r01-r02-actual-size.png`
has SHA-256
`695ef83d345e36b1f8b7852746c5173d37fe41590f8ad52cf524619f0e98bef7`.
It shows unscaled `r01`/`r02` on light and dark backgrounds plus the repaired
`r02` at the app's normal 128px-cell cage and follower proportions with the
authored moon-silver cage.

## Cost

The selected encoded transfer decreases by 1,382 bytes. Retaining immutable
`r01` adds exactly 42,980 public inventory bytes and 262,144 bytes to the
theoretical decoded inventory upper bound. Runtime still selects one 256px RGBA
field image, so the active field working set is not doubled.

| Measure | Accepted base | Candidate | Delta |
| --- | ---: | ---: | ---: |
| JavaScript gzip-9 | 153,261 | 153,270 | +9 |
| CSS gzip-9 | 23,512 | 23,512 | 0 |
| Public inventory | 164,988,031 | 165,031,011 | +42,980 |

The named `art-hotfix-01-tessera-field-alpha-repair` allocation authorizes the
exact public increase. The +9 JavaScript bytes remain inside the prior 46-byte
headroom, so no JS/CSS allocation is added.

## Verification

- Dedicated and inherited Tessera Python tests: 6 passed.
- Exact reconstruction: `python scripts/art_pipeline/tessera_field_alpha_hotfix.py --check` passed.
- Approved recovery pipeline's 3 focused reconstruction tests passed. Its legacy
  top-level `--check` reports metadata drift on this CRLF checkout, as qualified
  below; ART-HOTFIX-01 independently pins its approved master/approval hashes.
- Focused Vitest set (`artCatalog`, `assets`, UI art, Adventure Book, follower trail): 5 files / 46 tests passed.
- Full application production build: passed.
- Performance contracts and exact inventory: passed, 11 scenarios / 9 allocation owners.
- `git diff --check`: passed.

`npm ci` supplied the existing checked-in development toolchain only; it produced
no package or lockfile change and is not a runtime dependency change.

## Integration gate and inherited tooling note

Root must independently review the exact source, field pixels, proof, catalogue
invariance, and candidate record before changing candidate approval state or
promoting the pointer. The affected-iPad and family observations remain pending
acceptance evidence; under the latest Human direction they are not development
or release blockers.

The repository-wide manifest writer was deliberately not used to broaden this
hotfix. On this Windows checkout it rejects inherited CRLF-sensitive hashes in
many pre-existing records, recipes, prompts, and the canary before it can write a
candidate manifest. No manifest bytes were changed. Promotion therefore needs a
canonical-LF manifest refresh (or the existing global EOL defect corrected in a
separate scope) after root changes the new source record from candidate to its
reviewed publication state. Until then, the global `art:check` publication gate
is expected to remain closed; the focused checkout-stable reconstruction and
runtime checks above are green.

Rollback is one generated-row reversion to the retained `r01` URL and original
source-record ID. Keep both versioned fields, records, and approved recovery
evidence until the authorized retirement sweep.
