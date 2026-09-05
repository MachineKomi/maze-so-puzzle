# Plan 15 — transferable process retrospective

Status: pending final Plan-14 decisions and all Human-approved follow-on work.
Prepared 2026-09-05. Owner: root. No retrospective results are claimed yet.

## Outcome

Write exactly one canonical `docs/REUSABLE_AGENTIC_GAME_DEV_PLAYBOOK.md` that
another game team can use without knowing this chat. Explain which practices
helped, when they failed, and what evidence supports the lesson. Preserve the
warm, authored game as the outcome; paperwork and agent count are not success.

Read roadmap §5.15, final history, accepted specialist checkpoints/prompts,
Human decisions/rejections, backlog, subsystem specs, asset/provenance chain,
performance reports, release manifests and family reports. Missing logs or
ignored files are recorded as missing, never reconstructed as fact.

## Work sequence

1. Assemble an evidence index linking major decisions to commits/documents and
   outcomes. Include failed experiments, bounded recoveries and unverified claims.
2. Separate portable practice from Maze-specific product choices and contextual
   inference. Explain tradeoffs instead of declaring a model/tool universally best.
3. Trace at least one feature, one asset family and one release end to end:
   Human intent → owner → contract → implementation → evidence → review →
   consumer/loading → backup/delivery → later correction or lifecycle.
4. Cover orchestration, sequential runtime ownership, safe concurrent planning,
   skill/tool selection, reusable prompts, subjective approval, family feedback,
   deterministic gameplay/saves, art iteration, UI/comfort, validation, release
   provenance, cleanup and scope control. Explain how evidence survives handoff.
5. Provide compact copy-ready role briefs, start/completion packets, decision
   and evidence templates, review checklists and one starter repository map.
   Remove redundant checklists that obscure the few gates that actually matter.
6. Review for unsupported causality, stale instructions, private data, credentials
   and inaccessible path assumptions. Keep useful quoted provenance within the
   project's rights; do not reproduce third-party asset content.

## Required lessons to revisit with final evidence

- A source commit can change a running specialist's HEAD guard even when the
  files are disjoint: freeze shared HEAD during runtime work and checkpoint
  queued planning edits at the agreed boundary.
- A plan approved in principle can still lack a specific downstream rendition,
  landmark or budget: preflight actual semantic consumers before broad work.
- An attractive screenshot or green compiler is not a comfort, family, hardware
  or delivered-artifact result; separate those acceptance levels.
- Preserving good approved work and correcting a bounded omission can save more
  effort than reopening a completed creative direction.

These are provisional questions/known incidents, not permission to invent final
outcomes. Use the complete programme to confirm, nuance or reject the lessons.

## Completion

The canonical playbook is self-contained, evidence-linked, practical and candid.
Root reviews/commits/pushes it and marks the roadmap complete only when all
required work is actually done. Do not create skills, plugins, templates in other
repositories or new product work as a side effect of writing the playbook.
