# Exact approved proof recovery

The current art gate still requires the approved mgjrpg-02 v14 index and its
48 bound children. They are restored from the committed ZIP here, not recreated
from today's scripts and not downloaded from a personal temporary directory.
The receipt binds the archive and the unchanged original Human review; that
review authenticates the index, which authenticates every child.

From the repository root after installing `requirements-art.txt`:

```text
python scripts/art_pipeline/proof_archive.py --check
python scripts/art_pipeline/proof_archive.py --restore
npm run art:check
```

`--check` reads/verifies only and lists missing targets. `--restore` verifies
everything first, writes only missing approval-bound files under the ignored
`artifacts/art-proofs/mgjrpg-02/v14`, and refuses differing local files. It does
not delete or validate unrelated extra files in that folder. Normal `art:check`
does not silently restore files. Missing/tampered mandatory evidence still fails.
No archive, source picture or proof image enters `public/` or the game bundle.

The ZIP is 8,737,476 bytes, SHA-256
`8a0e7551dec6d7a130959a43c012957a64acd9da81b0ff337c2a308e3f0d072a`.
`--pack` is for preservation of the exact existing approved packet only. Each
file is atomically installed; an interrupted archive/receipt pair can be resumed
only if the existing file is byte-identical. It cannot reapprove changed art.

Historical **optional** canary checks are now explicit:

```text
python scripts/art_pipeline.py --check-legacy-canary artifacts
python scripts/art_pipeline.py --check-legacy-canary current-inputs
```

The first checks output checksum self-consistency against that local index;
it is not an independent Human-authenticity certificate. The second also checks
the pinned input snapshot against today's source and is expected to fail after
legitimate changes. Neither is selected implicitly by current-art validation.
Mandatory approved v14 verification is unaffected.

`python scripts/art_pipeline.py --manifest` is a non-writing field-level diff.
Inspect it before `--manifest --write`. Hashes remain exact bytes; there is no
global newline normalization in the hash function. Git's explicit EOL attributes
must be honored on checkout. Historical approvals retain their own byte policy.

The HOLE-02 source gallery rebuild is separate:
`python scripts/art_pipeline/hole02_candidates.py`. It uses the committed exact
originals and shared terrain geometry; it neither publishes art nor changes play.
