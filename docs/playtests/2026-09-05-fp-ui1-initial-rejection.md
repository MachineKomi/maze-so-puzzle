# FP-UI1 initial Human rejection — 2026-09-05

The Human inspected the v0.21.0 preview and reported some improvements, but
"loads of regressions and bugs" and that the UI is "overall much much worse
than it was before", including against specific previously supplied requirements.
The Human instructed root to wrap up so the problems can be discussed.

This is a failed family/UI acceptance gate. Earlier automated results and root
engineering checkpoints do not override it. Do not trigger Agent04, continue
implementation, publish the planned GitHub prerelease, or silently close UI
backlog requirements. Specific reproduction details and missed requirements are
not yet enumerated; await the discussion rather than inventing diagnoses.

Preserved state: UI checkpoint372e7d9, movement checkpoint5344873 and versioned
source2924fd73f60229dd244eeba21c05f66afb4eb8b0 are on main/GitHub. Canonical Vercel
already serves v0.21.0. The local portable exists and was launched; the planned
GitHub prerelease/tag/assets have NOT been published. The local PLAYTEST note is
an unpublished draft. Older v0.20.1 artifacts remain available. No automatic
rollback, user-profile reset or further native input was performed after this
instruction. The preview window is left with the Human.

Next: discuss concrete regressions and requirements, compare against the old
experience, then agree which changes to retain, revise or revert. Preserve all
work and saved progress. This report reopens overall UI/PT25 acceptance; it does
not assert an unreported cause or independently reject every movement change.
