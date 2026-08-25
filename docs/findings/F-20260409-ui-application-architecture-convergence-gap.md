---
id: 'F-96a97d3fa2c7'
owner: 'unisane'
repository: unisane-ui
scope: workspace
role: finding
lifecycle: active
authority: supporting
provenance: accepted
view: current
severity: SHOULD
status: in-progress
---

# F-20260409-ui-application-architecture-convergence-gap: UI Application Architecture Convergence Gap

## Changelog

- `2026-08-23`: Removed the retired Invoice Platform from current UI proof routing.
  Its completed migration slices remain historical evidence, while future enforcement
  must be proved by surviving starters or products.
- `2026-07-29`: Replaced retired workpack/program-index routing with bounded Skopos
  Tasks and selected Actions.
- `2026-04-09`: Archived `P65-W5` after `data-entry-lm` converged end to end on the canonical app UI contract. Invoice-platform and data-entry-lm now both prove the new structure, feature-internal ownership, and app-level UI config model; the finding stays active only for the remaining starter/platform migration and future enforcement ratchet.
- `2026-04-09`: Opened `P65-W5` for the full `data-entry-lm` app convergence after invoice-platform proved the new UI contract structurally, internally, and visually. The active lane now removes top-level `src/components/**`, promotes `config/ui/**`, and routes auth, public, and workspace surfaces through canonical screens/patterns/support/state ownership.
- `2026-04-09`: Opened `P65-W4` for invoice-platform visual-doctrine convergence after the structural and feature-internal UI migration slices proved cleanly under `P65-W2` and `P65-W3`.
- `2026-04-09`: Opened `P65-W3` for the feature-internal invoice-platform cleanup after the top-level route, shell, support, and `config/ui/**` cutover proved cleanly under `P65-W2`.
- `2026-04-09`: Opened `P65-W2` as the first live migration slice and selected `invoice-platform` as the end-to-end proving target for the new UI architecture contract.
- `2026-04-09`: Opened the finding and moved it directly to `in-progress` under `P65-W1` after the canonical UI doc set landed, the agent/bootstrap route still lacked the new UI load path, and no active execution lane yet existed for starter/platform convergence.

## Summary

- Severity: `SHOULD`
- Status: `in-progress`
- Owner: `architecture-program`
- Target Pack: `queued-next-ui-convergence-slice`

## Symptom

The canonical UI architecture now exists in durable docs, but live starters, platform apps, templates, and agent bootstrap routing have not converged on that contract yet.

Known drift already exists across starter/platform surfaces such as top-level app `src/components/**`, ambiguous shared ownership buckets, and older route or shell composition shapes that predate the new `screens -> patterns -> features -> platform/support/state` doctrine. Without an active execution lane, the new UI rules stay aspirational and later enforcement would either miss real drift or block normal app work too early.

## Impact

Starter and platform UI work can still fragment into multiple ownership models, humans and LLMs can load inconsistent guidance for the same task, and future lint or import-boundary ratchets would be unsafe because the live proof surfaces are not yet aligned with the newly documented target state.

## Fix Plan

1. Preserve the completed archived execution evidence while routing remaining work through
   bounded Skopos Tasks.
2. Converge each remaining starter or platform under one Task-owned scope and prove the
   replacement before widening enforcement.
3. Keep the active Finding current until all remaining UI ownership drift is closed.

## Verification

1. `pnpm agent:instructions:check`
2. `pnpm docs:core:check`
3. focused UI behavior and type proof selected by the owning Skopos Task
4. `pnpm architecture:index:check`

## Linked Docs

- [Framework findings](https://github.com/unisane/unisane/blob/main/docs/findings/README.md)
- `docs/work/plans/framework-ui-application-architecture-plan.md`
- [P65-W1 archive](https://github.com/unisane/unisane/blob/5f6e0b3e3dea915b4267a266571c99150834f88b/docs/work/archive/tasks/P65-W1.md)
- [P65-W2 archive](https://github.com/unisane/unisane/blob/5f6e0b3e3dea915b4267a266571c99150834f88b/docs/work/archive/tasks/P65-W2.md)
- [P65-W3 archive](https://github.com/unisane/unisane/blob/5f6e0b3e3dea915b4267a266571c99150834f88b/docs/work/archive/tasks/P65-W3.md)
- [P65-W4 archive](https://github.com/unisane/unisane/blob/5f6e0b3e3dea915b4267a266571c99150834f88b/docs/work/archive/tasks/P65-W4.md)
- [P65-W5 archive](https://github.com/unisane/unisane/blob/5f6e0b3e3dea915b4267a266571c99150834f88b/docs/work/archive/tasks/P65-W5.md)
- [P65-W1 convergence contract](https://github.com/unisane/unisane/blob/5f6e0b3e3dea915b4267a266571c99150834f88b/docs/work/archive/tasks/contracts/P65-W1.convergence.json)
- [P65-W2 convergence contract](https://github.com/unisane/unisane/blob/5f6e0b3e3dea915b4267a266571c99150834f88b/docs/work/archive/tasks/contracts/P65-W2.convergence.json)
- [P65-W3 convergence contract](https://github.com/unisane/unisane/blob/5f6e0b3e3dea915b4267a266571c99150834f88b/docs/work/archive/tasks/contracts/P65-W3.convergence.json)
- [P65-W4 convergence contract](https://github.com/unisane/unisane/blob/5f6e0b3e3dea915b4267a266571c99150834f88b/docs/work/archive/tasks/contracts/P65-W4.convergence.json)
- [P65-W5 convergence contract](https://github.com/unisane/unisane/blob/5f6e0b3e3dea915b4267a266571c99150834f88b/docs/work/archive/tasks/contracts/P65-W5.convergence.json)
- `docs/architecture/08-ui-application-architecture.md`
- `docs/architecture/09-ui-page-blueprints.md`
- `docs/architecture/10-ui-visual-doctrine-and-token-governance.md`
- `docs/standards/10-ui-application-architecture-baseline.md`
