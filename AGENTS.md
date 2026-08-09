# unisane-ui Agent Contract

Read `skopos session context . --json` before implementation. Skopos owns local Tasks, Project Memory, Evidence, Readiness, and closure; product behavior must not depend on Skopos.

Use `docs/00-start-here.md` as the documentation router. Work only through repository-local commands and dependencies. Do not import infrastructure, a sibling checkout, or the checkout parent.

This repository contains migrated history but follows clean-refactor policy: remove obsolete paths rather than adding compatibility shims before a stable release. Preserve named, tested resilience and safe persisted-data migration.

Never commit credentials or secret values. External repository, registry, DNS, cloud, visibility, release, or authority mutations require explicit human approval.

<!-- skopos-operating-contract:start -->

## Default Skopos Operating Contract

When Skopos is installed, agents should treat it as the default operating memory layer for project Memory, planning, coordination, Evidence, and Readiness.

### Session Start

1. Read `AGENTS.md` first.
2. Run or inspect `skopos session context . --json` before broad scanning or implementation.
3. If Skopos state is missing or stale, run `skopos init .` and then re-check `skopos session context`.
4. Use `docs/00-start-here.md` as the human docs router when it exists; otherwise inspect `docs/` conservatively.
5. Host adapters should inject `skopos session context . --json`; use it directly when the host cannot inject session context.

### Agent Response Contract

- Answer the user directly before process detail.
- Use the response mode that fits the moment; do not announce a lane unless risk or execution scope makes it useful.
- Ask only when the answer changes direction, risk, policy, or public behavior.
- When asking, show the recommendation, reason, alternatives, and the default behavior if the user has no preference.
- For progress, report completed work, current work, blockers, and proof still needed without false precision.
- For closure, state changed behavior, focused proof, memory updates, and remaining risk.

### Task Risk And Detail

- Light risk: use for narrow local edits. Inspect relevant files, edit, capture focused Evidence, and update Memory only if project truth changed.
- Standard risk: use for bounded multi-file feature, docs, policy, or maintenance work. Start or continue a Task, keep decisions current, and capture proportional Evidence.
- High-impact risk: use for architecture, public API, data migration, security, stack, release, multi-Scope, or long-running work. Use a detailed Task or child Tasks, staged Guards and Evidence, findings, Memory sync, and explicit Readiness.
- Proof subject: keep the default `task-closure` subject for bounded work. Use `--proof-subject project-integration` only to certify an explicit integration or release baseline; it requires owned paths, is always detailed/high-impact, and never absorbs unrelated dirty-worktree changes.

### Memory And Docs

- Update durable docs, decisions, findings, or policy only when project truth changes.
- Do not duplicate truth. Tasks track execution; durable rules belong in docs, policy, decisions, findings, Patterns, or Memory.
- In brownfield projects, use Skopos adoption discovery, proposal, approval, transformation, verification, and activation to converge docs safely.
- After changing `AGENTS.md`, run the project instruction action selected by Skopos. `skopos instructions sync .` owns only mirrors and adapters declared through Skopos.

### Validation Economy

- Treat root validation commands as a capability catalog, not a mandatory sequence.
- Select Actions and Guards from Task-owned changed paths and affected Scope dependents. Unchanged dirty paths that predate the Task are outside its proof boundary unless explicitly adopted with `--own`.
- Run the narrowest reliable check first. Do not run a workspace-wide test or build when affected-scope evidence is sufficient.
- Stop after the first failing check, fix the cause, then resume. Do not spend time collecting predictable downstream failures.
- Reuse valid source-bound Evidence while the exact Action, source, config, and command state are unchanged. Rerun after relevant invalidation.
- If project commands already own verification, register them as Actions; do not maintain a second verification authority.

### Readiness

- Before saying work is complete, capture the focused Evidence selected for the Task.
- For a compact diagnostic, run `skopos verify <task-id> . --phase closure --json`; add `--full` only for complete Evidence detail.
- To close after required Evidence exists, run `skopos finish <task-id> . --actor <id>`.
- Do not claim completion while Readiness blockers, blocking accepted-policy drift, open Task questions, missing Evidence, or Task state prevent closure.
- Final responses should state what changed, Evidence, Memory/docs updates, and remaining risk.

### Default Commands

- Session context: `skopos session context . --json`
- Work Queue: `skopos work queue . --json`
- Next work: `skopos work next . --json`
- Start tracked work: `skopos start "<goal>" . --accept "<criterion>" --own <path> --actor <id>`
- Start explicit integration proof: `skopos start "<integration goal>" . --proof-subject project-integration --own <integration-path> --actor <id>`
- Current Task: `skopos task show <task-id> . --json`
- Sync instructions: `skopos instructions sync .`
- Verify diagnostic: `skopos verify <task-id> . --phase closure --json`
- Finish Task: `skopos finish <task-id> . --actor <id>`
- Validation commands below are discoverable capabilities. Skopos selects a proportional affected-scope set; do not run all of them by default.
- typecheck: `pnpm typecheck`
- test: `pnpm test`
- lint: `pnpm lint`
- build: `pnpm build`
<!-- skopos-operating-contract:end -->
