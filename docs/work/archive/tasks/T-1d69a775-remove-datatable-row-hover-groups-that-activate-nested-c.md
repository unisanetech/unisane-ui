---
title: "Task: Remove DataTable row hover groups that activate nested controls"
status: complete
owner: "codex-row-hover"
id: T-1d69a775
scope: "workspace"
role: task
lifecycle: historical
authority: canonical
provenance: accepted
view: exception
risk: standard
proofSubject: task-closure
proofBaseline: baseline-5937fdddc6912081
lastUpdated: 2026-11-12
---

# Task: Remove DataTable row hover groups that activate nested controls

## Changelog

- `2026-11-12`: Synchronized Task state `complete` from Skopos.

## Goal

Remove DataTable row hover groups that activate nested controls

## Acceptance

- DataTable body rows do not create hover groups or propagate hover styling to nested buttons; selection, active state, focus, expansion and individual control feedback remain. Prepare source and local proof without publication or Trade cutover.

## Non-Goals

- None declared.

## Constraints

- None declared.

## Admission And Workflow

- Workflow: `tracked`
- Selected risk/detail: `standard` / `standard`
- Recommended risk/detail: `standard` / `standard`
- Selection source: `explicit-override`
- Reason: The work changes multiple paths, durable guidance, configuration, or a normal coordinated surface.

## Owned Paths

- `apps/docs/e2e/datatable-regression.spec.ts`
- `apps/docs/e2e/visual-regression.spec.ts-snapshots`
- `docs/reference/2026-11-12-table-row-hover.md`
- `docs/reference/generated/repository-convergence-report.json`
- `docs/release-approval.json`
- `packages/data-table/package.json`
- `packages/data-table/src/components/row-state.ts`
- `packages/data-table/src/components/row.tsx`
- `packages/data-table/src/components/table.tsx`
- `packages/data-table/tests/components/row-hover-boundary.test.tsx`
- `packages/email-templates/package.json`
- `packages/tokens/package.json`
- `packages/ui/package.json`
- `tools/skopos/actions/ui-data-table-prepare-candidate.yaml`
- `tools/skopos/guards/ui-data-table-prepare-candidate.yaml`

## Ownership Expansions

- `2026-11-12T10:05:45.788Z` by `codex-row-hover`: `packages/data-table/package.json`, `tools/skopos/actions/ui-data-table-prepare-candidate.yaml`, `tools/skopos/guards/ui-data-table-prepare-candidate.yaml` — Prepare a new immutable DataTable-only archive for review without changing the approved release manifest or publishing. Reuse existing build/test owners and native pnpm pack.
- `2026-11-12T10:17:45.585Z` by `codex-row-hover`: `apps/docs/e2e/datatable-regression.spec.ts`, `packages/data-table/src/components/row-state.ts` — Restore row-only hover feedback and verify control isolation in the existing browser suite as requested
- `2026-11-12T10:28:36.166Z` by `codex-row-hover`: `apps/docs/e2e/visual-regression.spec.ts-snapshots`, `docs/reference/generated/repository-convergence-report.json`, `docs/release-approval.json`, `packages/email-templates/package.json`, `packages/tokens/package.json`, `packages/ui/package.json` — User explicitly requested making the row-hover fix live through the existing aligned package release and Trade adoption route; review visual comparison failures before release

## Steps

- [x] **Record Task risk and detail before editing** (implementation, complete) — Confirm whether Task risk is light, standard, or high-impact. Keep the active Task current, use a Plan only for multi-Task direction, add a Decision for durable choices, and add or update a Finding for structural gaps.
- [x] **Review the current pattern in unisane-ui** (implementation, complete) — Use the compact references to confirm the current scope, command surface, and docs entrypoints before editing code.
- [x] **Implement the smallest scoped change** (implementation, complete) — Carry out "Remove DataTable row hover groups that activate nested controls" inside the resolved scope before widening impact to adjacent areas.
- [x] **Sync docs and instruction surfaces if touched** (docs, complete) — Keep docs, instruction mirrors, and generated project knowledge aligned with the implementation.
- [x] **Build affected project** (action, complete) — Required by Guard quality.build.
- [x] **Lint affected code** (action, complete) — Required by Guard quality.lint.
- [x] **Run focused UI proof phase** (action, complete) — Required by Guard ui.accessibility-proof.
- [x] **Test affected behavior** (action, complete) — Required by Guard quality.test.
- [x] **Typecheck affected code** (action, complete) — Required by Guard quality.typecheck.
- [x] **Capture responsive UI proof** (action, complete) — Required by Guard ui.accessibility-proof.
- [x] **Prepare the local DataTable candidate archive** (action, complete) — Required by Guard ui.data-table.prepare-candidate.
- [x] **Restore the complete locked UI workspace dependencies** (action, complete) — Required by Guard ui.hosted-release.
- [x] **Regenerate canonical release convergence evidence** (action, complete) — Required by Guard ui.hosted-release.
- [x] **Verify the exact hosted UI release archives** (action, complete) — Required by Guard ui.hosted-release.

## Actions And Guards

- Action `quality.build`: Required by Guard quality.build.
- Action `quality.lint`: Required by Guard quality.lint.
- Action `quality.run-proof-phase`: Required by Guard ui.accessibility-proof.
- Action `quality.test`: Required by Guard quality.test.
- Action `quality.typecheck`: Required by Guard quality.typecheck.
- Action `ui.capture-responsive-proof`: Required by Guard ui.accessibility-proof.
- Action `ui.data-table.prepare-candidate`: Required by Guard ui.data-table.prepare-candidate.
- Action `ui.dependencies.restore`: Required by Guard ui.hosted-release.
- Action `ui.hosted-release.convergence`: Required by Guard ui.hosted-release.
- Action `ui.hosted-release.packed`: Required by Guard ui.hosted-release.
- Guard `quality.build`
- Guard `quality.lint`
- Guard `quality.test`
- Guard `quality.typecheck`
- Guard `ui.accessibility-proof`
- Guard `ui.data-table.prepare-candidate`
- Guard `ui.hosted-release`

## Evidence And Readiness

- DataTable body rows do not create hover groups or propagate hover styling to nested buttons; selection, active state, focus, expansion and individual control feedback remain. Prepare source and local proof without publication or Trade cutover. (closure, agent-observation)
- Guard quality.build: Build affected project (closure, source-bound-action)
- Guard quality.lint: Lint affected code (closure, source-bound-action)
- Guard quality.test: Test affected behavior (closure, source-bound-action)
- Guard quality.typecheck: Typecheck affected code (closure, source-bound-action)
- Guard ui.accessibility-proof: Require UI accessibility and rendered-behavior evidence (closure, source-bound-action)
- Guard ui.data-table.prepare-candidate: Prepare the changed DataTable as its real distributable (closure, source-bound-action)
- Guard ui.hosted-release: Hosted UI prereleases require locked dependencies and packed consumer proof (closure, source-bound-action)

## Memory Obligations

- No durable Memory obligation is inferred.

## Portable Task State

This machine-readable block is the durable source used to rebuild local Skopos state.

<!-- skopos:task-state:start -->
```json
{
  "schemaVersion": 1,
  "id": "T-1d69a775",
  "type": "task",
  "status": "durable",
  "generatedAt": "2026-11-12T10:03:46.969Z",
  "updatedAt": "2026-11-12T10:35:33.969Z",
  "planIds": [],
  "childTasks": [],
  "state": "complete",
  "detail": "standard",
  "title": "Remove DataTable row hover groups that activate nested controls",
  "goal": "Remove DataTable row hover groups that activate nested controls",
  "scope": {
    "query": "workspace",
    "matchedBy": "id",
    "scope": {
      "id": "workspace",
      "kind": "workspace",
      "title": "unisane-ui",
      "path": ".",
      "aliases": [
        "root"
      ],
      "summary": "unisane-ui (public-package-product).",
      "confidence": "high",
      "ancestorIds": [],
      "profile": "public-package-product",
      "memoryRoot": "docs",
      "codeRoots": [
        "."
      ],
      "dependsOn": [],
      "owners": [
        "ui-maintainers"
      ]
    }
  },
  "contract": {
    "acceptanceCriteria": [
      "DataTable body rows do not create hover groups or propagate hover styling to nested buttons; selection, active state, focus, expansion and individual control feedback remain. Prepare source and local proof without publication or Trade cutover."
    ],
    "nonGoals": [],
    "constraints": []
  },
  "risk": "standard",
  "admission": {
    "recommendedRisk": "standard",
    "recommendedDetail": "standard",
    "selectedRisk": "standard",
    "selectedDetail": "standard",
    "selectionSource": "explicit-override",
    "workflow": "tracked",
    "reasons": [
      "The work changes multiple paths, durable guidance, configuration, or a normal coordinated surface."
    ],
    "signals": {
      "goalSignals": [],
      "ownedPathCount": 4,
      "affectedScopeIds": [
        "workspace"
      ],
      "impactCategories": [
        "docs",
        "workspace-file"
      ],
      "proofSubjectKind": "task-closure"
    }
  },
  "proofSubject": {
    "kind": "task-closure",
    "baselineId": "baseline-5937fdddc6912081"
  },
  "priority": 0,
  "dependencyTaskIds": [],
  "steps": [
    {
      "id": "step-record-task-risk",
      "kind": "implementation",
      "title": "Record Task risk and detail before editing",
      "detail": "Confirm whether Task risk is light, standard, or high-impact. Keep the active Task current, use a Plan only for multi-Task direction, add a Decision for durable choices, and add or update a Finding for structural gaps.",
      "status": "complete"
    },
    {
      "id": "step-review-current-pattern",
      "kind": "implementation",
      "title": "Review the current pattern in unisane-ui",
      "detail": "Use the compact references to confirm the current scope, command surface, and docs entrypoints before editing code.",
      "status": "complete"
    },
    {
      "id": "step-implement-scoped-change",
      "kind": "implementation",
      "title": "Implement the smallest scoped change",
      "detail": "Carry out \"Remove DataTable row hover groups that activate nested controls\" inside the resolved scope before widening impact to adjacent areas.",
      "status": "complete"
    },
    {
      "id": "step-sync-knowledge",
      "kind": "docs",
      "title": "Sync docs and instruction surfaces if touched",
      "detail": "Keep docs, instruction mirrors, and generated project knowledge aligned with the implementation.",
      "status": "complete"
    },
    {
      "id": "action-quality.build",
      "kind": "action",
      "title": "Build affected project",
      "detail": "Required by Guard quality.build.",
      "status": "complete"
    },
    {
      "id": "action-quality.lint",
      "kind": "action",
      "title": "Lint affected code",
      "detail": "Required by Guard quality.lint.",
      "status": "complete"
    },
    {
      "id": "action-quality.run-proof-phase",
      "kind": "action",
      "title": "Run focused UI proof phase",
      "detail": "Required by Guard ui.accessibility-proof.",
      "status": "complete"
    },
    {
      "id": "action-quality.test",
      "kind": "action",
      "title": "Test affected behavior",
      "detail": "Required by Guard quality.test.",
      "status": "complete"
    },
    {
      "id": "action-quality.typecheck",
      "kind": "action",
      "title": "Typecheck affected code",
      "detail": "Required by Guard quality.typecheck.",
      "status": "complete"
    },
    {
      "id": "action-ui.capture-responsive-proof",
      "kind": "action",
      "title": "Capture responsive UI proof",
      "detail": "Required by Guard ui.accessibility-proof.",
      "status": "complete"
    },
    {
      "id": "action-ui.data-table.prepare-candidate",
      "kind": "action",
      "title": "Prepare the local DataTable candidate archive",
      "detail": "Required by Guard ui.data-table.prepare-candidate.",
      "status": "complete"
    },
    {
      "id": "action-ui.dependencies.restore",
      "kind": "action",
      "title": "Restore the complete locked UI workspace dependencies",
      "detail": "Required by Guard ui.hosted-release.",
      "status": "complete"
    },
    {
      "id": "action-ui.hosted-release.convergence",
      "kind": "action",
      "title": "Regenerate canonical release convergence evidence",
      "detail": "Required by Guard ui.hosted-release.",
      "status": "complete"
    },
    {
      "id": "action-ui.hosted-release.packed",
      "kind": "action",
      "title": "Verify the exact hosted UI release archives",
      "detail": "Required by Guard ui.hosted-release.",
      "status": "complete"
    }
  ],
  "selectedActions": [
    {
      "id": "quality.build",
      "title": "Build affected project",
      "category": "quality-check",
      "safety": "mutating",
      "sourcePath": "tools/skopos/actions/quality-build.yaml",
      "reason": "Required by Guard quality.build.",
      "matchedPaths": [
        "apps/docs/e2e/datatable-regression.spec.ts",
        "apps/docs/e2e/visual-regression.spec.ts-snapshots",
        "docs/reference/2026-11-12-table-row-hover.md",
        "docs/reference/generated/repository-convergence-report.json",
        "docs/release-approval.json",
        "packages/data-table/package.json",
        "packages/data-table/src/components/row-state.ts",
        "packages/data-table/src/components/row.tsx",
        "packages/data-table/src/components/table.tsx",
        "packages/data-table/tests/components/row-hover-boundary.test.tsx",
        "packages/email-templates/package.json",
        "packages/tokens/package.json",
        "packages/ui/package.json",
        "tools/skopos/actions/ui-data-table-prepare-candidate.yaml",
        "tools/skopos/guards/ui-data-table-prepare-candidate.yaml"
      ],
      "outputPaths": [],
      "requiresApproval": true
    },
    {
      "id": "quality.lint",
      "title": "Lint affected code",
      "category": "quality-check",
      "safety": "read-only",
      "sourcePath": "tools/skopos/actions/quality-lint.yaml",
      "reason": "Required by Guard quality.lint.",
      "matchedPaths": [
        "apps/docs/e2e/datatable-regression.spec.ts",
        "apps/docs/e2e/visual-regression.spec.ts-snapshots",
        "docs/reference/2026-11-12-table-row-hover.md",
        "docs/reference/generated/repository-convergence-report.json",
        "docs/release-approval.json",
        "packages/data-table/package.json",
        "packages/data-table/src/components/row-state.ts",
        "packages/data-table/src/components/row.tsx",
        "packages/data-table/src/components/table.tsx",
        "packages/data-table/tests/components/row-hover-boundary.test.tsx",
        "packages/email-templates/package.json",
        "packages/tokens/package.json",
        "packages/ui/package.json",
        "tools/skopos/actions/ui-data-table-prepare-candidate.yaml",
        "tools/skopos/guards/ui-data-table-prepare-candidate.yaml"
      ],
      "outputPaths": [],
      "requiresApproval": false
    },
    {
      "id": "quality.run-proof-phase",
      "title": "Run focused UI proof phase",
      "category": "quality-check",
      "safety": "read-only",
      "sourcePath": "tools/skopos/actions/quality-run-proof-phase.yaml",
      "reason": "Required by Guard ui.accessibility-proof.",
      "matchedPaths": [
        "apps/docs/e2e/datatable-regression.spec.ts",
        "packages/data-table/src/components/row-state.ts",
        "packages/data-table/src/components/row.tsx",
        "packages/data-table/src/components/table.tsx",
        "packages/data-table/tests/components/row-hover-boundary.test.tsx"
      ],
      "outputPaths": [],
      "requiresApproval": false
    },
    {
      "id": "quality.test",
      "title": "Test affected behavior",
      "category": "quality-check",
      "safety": "read-only",
      "sourcePath": "tools/skopos/actions/quality-test.yaml",
      "reason": "Required by Guard quality.test.",
      "matchedPaths": [
        "apps/docs/e2e/datatable-regression.spec.ts",
        "apps/docs/e2e/visual-regression.spec.ts-snapshots",
        "docs/reference/2026-11-12-table-row-hover.md",
        "docs/reference/generated/repository-convergence-report.json",
        "docs/release-approval.json",
        "packages/data-table/package.json",
        "packages/data-table/src/components/row-state.ts",
        "packages/data-table/src/components/row.tsx",
        "packages/data-table/src/components/table.tsx",
        "packages/data-table/tests/components/row-hover-boundary.test.tsx",
        "packages/email-templates/package.json",
        "packages/tokens/package.json",
        "packages/ui/package.json",
        "tools/skopos/actions/ui-data-table-prepare-candidate.yaml",
        "tools/skopos/guards/ui-data-table-prepare-candidate.yaml"
      ],
      "outputPaths": [],
      "requiresApproval": false
    },
    {
      "id": "quality.typecheck",
      "title": "Typecheck affected code",
      "category": "quality-check",
      "safety": "read-only",
      "sourcePath": "tools/skopos/actions/quality-typecheck.yaml",
      "reason": "Required by Guard quality.typecheck.",
      "matchedPaths": [
        "apps/docs/e2e/datatable-regression.spec.ts",
        "apps/docs/e2e/visual-regression.spec.ts-snapshots",
        "docs/reference/2026-11-12-table-row-hover.md",
        "docs/reference/generated/repository-convergence-report.json",
        "docs/release-approval.json",
        "packages/data-table/package.json",
        "packages/data-table/src/components/row-state.ts",
        "packages/data-table/src/components/row.tsx",
        "packages/data-table/src/components/table.tsx",
        "packages/data-table/tests/components/row-hover-boundary.test.tsx",
        "packages/email-templates/package.json",
        "packages/tokens/package.json",
        "packages/ui/package.json",
        "tools/skopos/actions/ui-data-table-prepare-candidate.yaml",
        "tools/skopos/guards/ui-data-table-prepare-candidate.yaml"
      ],
      "outputPaths": [],
      "requiresApproval": false
    },
    {
      "id": "ui.capture-responsive-proof",
      "title": "Capture responsive UI proof",
      "category": "quality-check",
      "safety": "artifact-producing",
      "sourcePath": "tools/skopos/actions/ui-capture-responsive-proof.yaml",
      "reason": "Required by Guard ui.accessibility-proof.",
      "matchedPaths": [
        "apps/docs/e2e/datatable-regression.spec.ts",
        "packages/data-table/src/components/row-state.ts",
        "packages/data-table/src/components/row.tsx",
        "packages/data-table/src/components/table.tsx",
        "packages/data-table/tests/components/row-hover-boundary.test.tsx"
      ],
      "outputPaths": [
        "apps/docs/test-results"
      ],
      "requiresApproval": false
    },
    {
      "id": "ui.data-table.prepare-candidate",
      "title": "Prepare the local DataTable candidate archive",
      "category": "quality-check",
      "safety": "artifact-producing",
      "sourcePath": "tools/skopos/actions/ui-data-table-prepare-candidate.yaml",
      "reason": "Required by Guard ui.data-table.prepare-candidate.",
      "matchedPaths": [
        "packages/data-table/package.json",
        "tools/skopos/actions/ui-data-table-prepare-candidate.yaml",
        "tools/skopos/guards/ui-data-table-prepare-candidate.yaml"
      ],
      "outputPaths": [
        ".tmp/data-table-candidate"
      ],
      "requiresApproval": false
    },
    {
      "id": "ui.dependencies.restore",
      "title": "Restore the complete locked UI workspace dependencies",
      "category": "maintenance",
      "safety": "mutating",
      "sourcePath": "tools/skopos/actions/ui-dependencies-restore.yaml",
      "reason": "Required by Guard ui.hosted-release.",
      "matchedPaths": [
        "docs/release-approval.json"
      ],
      "outputPaths": [
        "node_modules",
        "apps/docs/node_modules",
        "packages/ui/node_modules",
        "packages/tokens/node_modules",
        "packages/data-table/node_modules",
        "packages/ui-cli/node_modules",
        "packages/email-templates/node_modules"
      ],
      "requiresApproval": false
    },
    {
      "id": "ui.hosted-release.convergence",
      "title": "Regenerate canonical release convergence evidence",
      "category": "quality-check",
      "safety": "artifact-producing",
      "sourcePath": "tools/skopos/actions/ui-release-convergence.yaml",
      "reason": "Required by Guard ui.hosted-release.",
      "matchedPaths": [
        "docs/release-approval.json"
      ],
      "outputPaths": [
        "docs/reference/generated/repository-convergence-report.json"
      ],
      "requiresApproval": false
    },
    {
      "id": "ui.hosted-release.packed",
      "title": "Verify the exact hosted UI release archives",
      "category": "quality-check",
      "safety": "artifact-producing",
      "sourcePath": "tools/skopos/actions/ui-hosted-release.yaml",
      "reason": "Required by Guard ui.hosted-release.",
      "matchedPaths": [
        "docs/release-approval.json"
      ],
      "outputPaths": [
        ".tmp/release"
      ],
      "requiresApproval": false
    }
  ],
  "selectedGuardIds": [
    "quality.build",
    "quality.lint",
    "quality.test",
    "quality.typecheck",
    "ui.accessibility-proof",
    "ui.data-table.prepare-candidate",
    "ui.hosted-release"
  ],
  "evidenceRequirements": [
    {
      "id": "acceptance-1",
      "acceptanceCriterion": "DataTable body rows do not create hover groups or propagate hover styling to nested buttons; selection, active state, focus, expansion and individual control feedback remain. Prepare source and local proof without publication or Trade cutover.",
      "phase": "closure",
      "actionIds": [],
      "guardIds": [],
      "evidence": "agent-observation"
    },
    {
      "id": "guard-quality.build",
      "acceptanceCriterion": "Guard quality.build: Build affected project",
      "phase": "closure",
      "actionIds": [
        "quality.build"
      ],
      "guardIds": [
        "quality.build"
      ],
      "evidence": "source-bound-action"
    },
    {
      "id": "guard-quality.lint",
      "acceptanceCriterion": "Guard quality.lint: Lint affected code",
      "phase": "closure",
      "actionIds": [
        "quality.lint"
      ],
      "guardIds": [
        "quality.lint"
      ],
      "evidence": "source-bound-action"
    },
    {
      "id": "guard-quality.test",
      "acceptanceCriterion": "Guard quality.test: Test affected behavior",
      "phase": "closure",
      "actionIds": [
        "quality.test"
      ],
      "guardIds": [
        "quality.test"
      ],
      "evidence": "source-bound-action"
    },
    {
      "id": "guard-quality.typecheck",
      "acceptanceCriterion": "Guard quality.typecheck: Typecheck affected code",
      "phase": "closure",
      "actionIds": [
        "quality.typecheck"
      ],
      "guardIds": [
        "quality.typecheck"
      ],
      "evidence": "source-bound-action"
    },
    {
      "id": "guard-ui.accessibility-proof",
      "acceptanceCriterion": "Guard ui.accessibility-proof: Require UI accessibility and rendered-behavior evidence",
      "phase": "closure",
      "actionIds": [
        "quality.run-proof-phase",
        "ui.capture-responsive-proof"
      ],
      "guardIds": [
        "ui.accessibility-proof"
      ],
      "evidence": "source-bound-action"
    },
    {
      "id": "guard-ui.data-table.prepare-candidate",
      "acceptanceCriterion": "Guard ui.data-table.prepare-candidate: Prepare the changed DataTable as its real distributable",
      "phase": "closure",
      "actionIds": [
        "ui.data-table.prepare-candidate"
      ],
      "guardIds": [
        "ui.data-table.prepare-candidate"
      ],
      "evidence": "source-bound-action"
    },
    {
      "id": "guard-ui.hosted-release",
      "acceptanceCriterion": "Guard ui.hosted-release: Hosted UI prereleases require locked dependencies and packed consumer proof",
      "phase": "closure",
      "actionIds": [
        "ui.dependencies.restore",
        "ui.hosted-release.convergence",
        "ui.hosted-release.packed"
      ],
      "guardIds": [
        "ui.hosted-release"
      ],
      "evidence": "source-bound-action"
    }
  ],
  "memoryObligations": [],
  "questions": [],
  "recommendations": [
    {
      "id": "start-bounded-child-task",
      "title": "Start a bounded child Task",
      "summary": "The Task may be drifting from its admitted subject because ownership expanded 3 times. Keep this Task intact and move the suggested paths into focused follow-up work.",
      "priority": "medium",
      "actionKind": "start-child-task",
      "command": "skopos task child start 'T-1d69a775' 'Continue Remove DataTable row hover groups that activate nested controls as bounded follow-up work' . --scope 'workspace' --own 'apps/docs/e2e/datatable-regression.spec.ts' --own 'apps/docs/e2e/visual-regression.spec.ts-snapshots' --own 'docs/reference/generated/repository-convergence-report.json' --own 'docs/release-approval.json' --own 'packages/data-table/package.json' --own 'packages/data-table/src/components/row-state.ts' --own 'packages/email-templates/package.json' --own 'packages/tokens/package.json' --own 'packages/ui/package.json' --own 'tools/skopos/actions/ui-data-table-prepare-candidate.yaml' --own 'tools/skopos/guards/ui-data-table-prepare-candidate.yaml' --reason 'The Task may be drifting from its admitted subject because ownership expanded 3 times.' --actor 'codex-row-hover'",
      "ownedPaths": [
        "apps/docs/e2e/datatable-regression.spec.ts",
        "apps/docs/e2e/visual-regression.spec.ts-snapshots",
        "docs/reference/generated/repository-convergence-report.json",
        "docs/release-approval.json",
        "packages/data-table/package.json",
        "packages/data-table/src/components/row-state.ts",
        "packages/email-templates/package.json",
        "packages/tokens/package.json",
        "packages/ui/package.json",
        "tools/skopos/actions/ui-data-table-prepare-candidate.yaml",
        "tools/skopos/guards/ui-data-table-prepare-candidate.yaml"
      ],
      "scopeId": "workspace",
      "reason": "The Task may be drifting from its admitted subject because ownership expanded 3 times.",
      "blocking": false,
      "status": "open"
    },
    {
      "id": "run-quality.build",
      "title": "Build affected project",
      "summary": "Required by Guard quality.build.",
      "priority": "medium",
      "actionKind": "run-action",
      "actionId": "quality.build",
      "blocking": false,
      "status": "complete"
    },
    {
      "id": "run-quality.lint",
      "title": "Lint affected code",
      "summary": "Required by Guard quality.lint.",
      "priority": "medium",
      "actionKind": "run-action",
      "actionId": "quality.lint",
      "blocking": false,
      "status": "complete"
    },
    {
      "id": "run-quality.run-proof-phase",
      "title": "Run focused UI proof phase",
      "summary": "Required by Guard ui.accessibility-proof.",
      "priority": "medium",
      "actionKind": "run-action",
      "actionId": "quality.run-proof-phase",
      "blocking": false,
      "status": "complete"
    },
    {
      "id": "run-quality.test",
      "title": "Test affected behavior",
      "summary": "Required by Guard quality.test.",
      "priority": "medium",
      "actionKind": "run-action",
      "actionId": "quality.test",
      "blocking": false,
      "status": "complete"
    },
    {
      "id": "run-quality.typecheck",
      "title": "Typecheck affected code",
      "summary": "Required by Guard quality.typecheck.",
      "priority": "medium",
      "actionKind": "run-action",
      "actionId": "quality.typecheck",
      "blocking": false,
      "status": "complete"
    },
    {
      "id": "run-ui.capture-responsive-proof",
      "title": "Capture responsive UI proof",
      "summary": "Required by Guard ui.accessibility-proof.",
      "priority": "medium",
      "actionKind": "run-action",
      "actionId": "ui.capture-responsive-proof",
      "blocking": false,
      "status": "complete"
    },
    {
      "id": "run-ui.data-table.prepare-candidate",
      "title": "Prepare the local DataTable candidate archive",
      "summary": "Required by Guard ui.data-table.prepare-candidate.",
      "priority": "medium",
      "actionKind": "run-action",
      "actionId": "ui.data-table.prepare-candidate",
      "blocking": false,
      "status": "complete"
    },
    {
      "id": "run-ui.dependencies.restore",
      "title": "Restore the complete locked UI workspace dependencies",
      "summary": "Required by Guard ui.hosted-release.",
      "priority": "medium",
      "actionKind": "run-action",
      "actionId": "ui.dependencies.restore",
      "blocking": false,
      "status": "complete"
    },
    {
      "id": "run-ui.hosted-release.convergence",
      "title": "Regenerate canonical release convergence evidence",
      "summary": "Required by Guard ui.hosted-release.",
      "priority": "medium",
      "actionKind": "run-action",
      "actionId": "ui.hosted-release.convergence",
      "blocking": false,
      "status": "complete"
    },
    {
      "id": "run-ui.hosted-release.packed",
      "title": "Verify the exact hosted UI release archives",
      "summary": "Required by Guard ui.hosted-release.",
      "priority": "medium",
      "actionKind": "run-action",
      "actionId": "ui.hosted-release.packed",
      "blocking": false,
      "status": "complete"
    }
  ],
  "ownershipExpansions": [
    {
      "paths": [
        "packages/data-table/package.json",
        "tools/skopos/actions/ui-data-table-prepare-candidate.yaml",
        "tools/skopos/guards/ui-data-table-prepare-candidate.yaml"
      ],
      "reason": "Prepare a new immutable DataTable-only archive for review without changing the approved release manifest or publishing. Reuse existing build/test owners and native pnpm pack.",
      "actorId": "codex-row-hover",
      "recordedAt": "2026-11-12T10:05:45.788Z",
      "baselinePaths": [
        {
          "path": "packages/data-table/package.json",
          "digest": "ba4a546ac07d3cc09fe81decc31aacdc4fc27e1d72cc82f9078c4c561cc186bc",
          "digestAlgorithm": "skopos-path-v2-code-unit-segment-dfs"
        },
        {
          "path": "tools/skopos/actions/ui-data-table-prepare-candidate.yaml",
          "digest": "c741529fff138771ffe43897f86e2e2b8d499014fabec9dec3d459ae8419bb24",
          "digestAlgorithm": "skopos-path-v2-code-unit-segment-dfs"
        },
        {
          "path": "tools/skopos/guards/ui-data-table-prepare-candidate.yaml",
          "digest": "c741529fff138771ffe43897f86e2e2b8d499014fabec9dec3d459ae8419bb24",
          "digestAlgorithm": "skopos-path-v2-code-unit-segment-dfs"
        }
      ],
      "classification": "within-scope",
      "priorScopeId": "workspace",
      "nextScopeId": "workspace",
      "affectedScopeIds": [
        "workspace"
      ]
    },
    {
      "paths": [
        "apps/docs/e2e/datatable-regression.spec.ts",
        "packages/data-table/src/components/row-state.ts"
      ],
      "reason": "Restore row-only hover feedback and verify control isolation in the existing browser suite as requested",
      "actorId": "codex-row-hover",
      "recordedAt": "2026-11-12T10:17:45.585Z",
      "baselinePaths": [
        {
          "path": "apps/docs/e2e/datatable-regression.spec.ts",
          "digest": "6ed8935c0aa81b17ce0194551ddedef13441d28daa6e7dbc53fcf324c92467ff",
          "digestAlgorithm": "skopos-path-v2-code-unit-segment-dfs"
        },
        {
          "path": "packages/data-table/src/components/row-state.ts",
          "digest": "6f0e7c038070468ac909d497837882bcb685a326a0dcc427acd7255366eef063",
          "digestAlgorithm": "skopos-path-v2-code-unit-segment-dfs"
        }
      ],
      "classification": "within-scope",
      "priorScopeId": "workspace",
      "nextScopeId": "workspace",
      "affectedScopeIds": [
        "workspace"
      ]
    },
    {
      "paths": [
        "apps/docs/e2e/visual-regression.spec.ts-snapshots",
        "docs/reference/generated/repository-convergence-report.json",
        "docs/release-approval.json",
        "packages/email-templates/package.json",
        "packages/tokens/package.json",
        "packages/ui/package.json"
      ],
      "reason": "User explicitly requested making the row-hover fix live through the existing aligned package release and Trade adoption route; review visual comparison failures before release",
      "actorId": "codex-row-hover",
      "recordedAt": "2026-11-12T10:28:36.166Z",
      "baselinePaths": [
        {
          "path": "apps/docs/e2e/visual-regression.spec.ts-snapshots",
          "digest": "2c226ee31391d08090834b74b66e5d1c7382b38550d5594d468ea1c991908766",
          "digestAlgorithm": "skopos-path-v2-code-unit-segment-dfs"
        },
        {
          "path": "docs/reference/generated/repository-convergence-report.json",
          "digest": "021c755a67520794d6b2b9f1bdad440d6b8fc029cb36cd1cfcb6a220221ccb94",
          "digestAlgorithm": "skopos-path-v2-code-unit-segment-dfs"
        },
        {
          "path": "docs/release-approval.json",
          "digest": "748ca9f638d7b320753e638934332af5708c5a9cdcf4a602078cb4567306c15e",
          "digestAlgorithm": "skopos-path-v2-code-unit-segment-dfs"
        },
        {
          "path": "packages/email-templates/package.json",
          "digest": "e096577ca95ce6db482a8d6c20154442ba976ff51666fe3705a81a81ebcfa1dd",
          "digestAlgorithm": "skopos-path-v2-code-unit-segment-dfs"
        },
        {
          "path": "packages/tokens/package.json",
          "digest": "8e8546d7c3421177b16cd1ed8c0b3bdc996ef28d4baa923968be683161b08e14",
          "digestAlgorithm": "skopos-path-v2-code-unit-segment-dfs"
        },
        {
          "path": "packages/ui/package.json",
          "digest": "7ac5274ab333be9e0474e6b0bb302a1e42e5408f748eb36bd3dac34f8b82a8f2",
          "digestAlgorithm": "skopos-path-v2-code-unit-segment-dfs"
        }
      ],
      "classification": "within-scope",
      "priorScopeId": "workspace",
      "nextScopeId": "workspace",
      "affectedScopeIds": [
        "workspace"
      ]
    }
  ],
  "declaredOwnedPaths": [
    "apps/docs/e2e/datatable-regression.spec.ts",
    "apps/docs/e2e/visual-regression.spec.ts-snapshots",
    "docs/reference/2026-11-12-table-row-hover.md",
    "docs/reference/generated/repository-convergence-report.json",
    "docs/release-approval.json",
    "packages/data-table/package.json",
    "packages/data-table/src/components/row-state.ts",
    "packages/data-table/src/components/row.tsx",
    "packages/data-table/src/components/table.tsx",
    "packages/data-table/tests/components/row-hover-boundary.test.tsx",
    "packages/email-templates/package.json",
    "packages/tokens/package.json",
    "packages/ui/package.json",
    "tools/skopos/actions/ui-data-table-prepare-candidate.yaml",
    "tools/skopos/guards/ui-data-table-prepare-candidate.yaml"
  ]
}
```
<!-- skopos:task-state:end -->
