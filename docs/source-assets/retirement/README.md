# Asset retirement and delivery hygiene

Current bounded cleanup: [early-assets-2026-09-06.json](early-assets-2026-09-06.json).
[Human authority and scope](../../reviews/2026-09-06-early-asset-cleanup.md).

## Current disposition

The ledger tracks 134 historical candidates / 41,231,881 encoded bytes.
The early authorized batch removes 30 delivery files / 9,488,260 bytes.
The remaining 104 candidates / 31,743,621 bytes are retained because the audit
found fallback, comparison, reconstruction or catalogue dependencies.
The receipt names each held reference. Approved dormant assets are not obsolete.

New in-use artwork stays in its existing versioned family folders below
`public/assets/mgjrpg-02/`. Do not flatten or rename it for tidiness.
No original source images, exact prompts, model sheets, rights/provenance,
historical publication maps or approved future-feature assets were removed.

## Lifecycle and authority

Normal final Plan 12 remains: classified → rollback hold → final eligibility →
verified export → Human external backup confirmation → retired from runtime.
That final programme still depends on the later consumer freeze.

The Human's 2026-09-06 instruction explicitly authorized earlier direct deletion
after backing up the complete local repository externally. For this bounded
exception, `retired-early-delivery` records removal without pretending the final
Plan 12, signed/offline package or Human visual gates have passed.
`earlyRetirement` binds each affected ledger row to the exact approved receipt.
The original `retirementEvidence` flags describe historical final-gate evidence;
the dated receipt, not those unchanged flags, owns early-cleanup evidence.
The ledger's candidate/byte totals remain historical totals, not current disk use.

The validator joins receipt + ledger + exact source-record derivative identity.
Only an explicitly superseded, hash/size/dimension-matching derivative may be
absent. Unknown missing files and missing active/dormant/source files still fail.
Accidental reintroduction of retired delivery bytes also fails validation.
The generated manifest separates `runtimeImages` from `retiredRuntimeImages`.
Historical publisher previous-URL metadata can use a verified tombstone; it does
not silently regenerate obsolete delivery copies into `public/`.

## Recovery

Each retired file is preserved in Git at
`363859ef60ef974cb41d4e001d1be85d58e5ac56` and in the Human-attested full-repo
backup. The agent checked Git blob bytes against local SHA256/size before removal;
the external ZIP itself was not independently inspected.

Restore only the requested recorded paths from that commit or the backup,
verify against the receipt, and update/revert the corresponding tombstones.
Regenerate the manifest and run art/project/build/performance checks.
A shallow clone may need to fetch the recorded commit first.
Never restore the whole public directory over newer art.

## Remaining Plan 12 work

Repeat the consumer/reconstruction audit after later content and art consumers
settle; solve held dependencies before proposing additional removal.
Source masters and sole-copy evidence are never generic deletion payloads.
The current authorization covers superseded unused assets, not broad purging of
all files that happen to be absent from the current campaign.

Any future archive belongs outside `public/`, `dist/` and package inputs.
A tracked archive still contributes to checkout size, and an archive inside
public still ships. This operation does not rewrite Git history, reclaim old
Vercel deployments or change existing release attachments.
