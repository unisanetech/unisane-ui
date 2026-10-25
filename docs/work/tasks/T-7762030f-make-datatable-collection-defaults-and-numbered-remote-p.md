---
title: "Task: Make DataTable collection defaults and numbered remote pagination production-ready"
status: active
owner: "codex-datatable"
id: T-7762030f
scope: "workspace"
role: task
lifecycle: active
authority: canonical
provenance: accepted
view: current
risk: standard
proofSubject: task-closure
proofBaseline: baseline-3e8b977f61c7298e
lastUpdated: 2026-10-11
---

# Task: Make DataTable collection defaults and numbered remote pagination production-ready

## Changelog

- `2026-10-11`: Synchronized Task state `active` from Skopos.

## Goal

Make DataTable collection defaults and numbered remote pagination production-ready

## Acceptance

- The simple and dashboard presets do not expose hidden-column controls by default; controlled remote offset pagination renders accessible numbered desktop controls and compact mobile controls; focused DataTable tests and package typecheck pass.

## Non-Goals

- None declared.

## Constraints

- None declared.

## Admission And Workflow

- Workflow: `tracked`
- Selected risk/detail: `standard` / `standard`
- Recommended risk/detail: `standard` / `standard`
- Selection source: `automatic`
- Reason: The work changes multiple paths, durable guidance, configuration, or a normal coordinated surface.

## Owned Paths

- `packages/data-table/src/components/data-table-inner.tsx`
- `packages/data-table/src/components/data-table.tsx`
- `packages/data-table/src/components/pagination.tsx`
- `packages/data-table/src/context/hooks/use-pagination.ts`
- `packages/data-table/src/context/provider.tsx`
- `packages/data-table/src/context/types.ts`
- `packages/data-table/src/types/config.ts`
- `packages/data-table/src/utils/pagination.ts`
- `packages/data-table/tests/components/pagination.test.tsx`
- `packages/data-table/tests/context/hooks/use-pagination.test.tsx`
- `packages/data-table/tests/utils/pagination.test.ts`

## Ownership Expansions

- None recorded.

## Steps

- [ ] **Record Task risk and detail before editing** (implementation, pending) — Confirm whether Task risk is light, standard, or high-impact. Keep the active Task current, use a Plan only for multi-Task direction, add a Decision for durable choices, and add or update a Finding for structural gaps.
- [ ] **Review the current pattern in unisane-ui** (implementation, pending) — Use the compact references to confirm the current scope, command surface, and docs entrypoints before editing code.
- [ ] **Implement the smallest scoped change** (implementation, pending) — Carry out "Make DataTable collection defaults and numbered remote pagination production-ready" inside the resolved scope before widening impact to adjacent areas.
- [ ] **Sync docs and instruction surfaces if touched** (docs, pending) — Keep docs, instruction mirrors, and generated project knowledge aligned with the implementation.
- [ ] **Build affected project** (action, pending) — Required by Guard quality.build.
- [ ] **Lint affected code** (action, pending) — Required by Guard quality.lint.
- [ ] **Run focused UI proof phase** (action, pending) — Required by Guard ui.accessibility-proof.
- [ ] **Test affected behavior** (action, pending) — Required by Guard quality.test.
- [ ] **Typecheck affected code** (action, pending) — Required by Guard quality.typecheck.
- [ ] **Capture responsive UI proof** (action, pending) — Required by Guard ui.accessibility-proof.

## Actions And Guards

- Action `quality.build`: Required by Guard quality.build.
- Action `quality.lint`: Required by Guard quality.lint.
- Action `quality.run-proof-phase`: Required by Guard ui.accessibility-proof.
- Action `quality.test`: Required by Guard quality.test.
- Action `quality.typecheck`: Required by Guard quality.typecheck.
- Action `ui.capture-responsive-proof`: Required by Guard ui.accessibility-proof.
- Guard `quality.build`
- Guard `quality.lint`
- Guard `quality.test`
- Guard `quality.typecheck`
- Guard `ui.accessibility-proof`

## Evidence And Readiness

- The simple and dashboard presets do not expose hidden-column controls by default; controlled remote offset pagination renders accessible numbered desktop controls and compact mobile controls; focused DataTable tests and package typecheck pass. (closure, agent-observation)
- Guard quality.build: Build affected project (closure, source-bound-action)
- Guard quality.lint: Lint affected code (closure, source-bound-action)
- Guard quality.test: Test affected behavior (closure, source-bound-action)
- Guard quality.typecheck: Typecheck affected code (closure, source-bound-action)
- Guard ui.accessibility-proof: Require UI accessibility and rendered-behavior evidence (closure, source-bound-action)

## Memory Obligations

- No durable Memory obligation is inferred.

## Portable Task State

This machine-readable block is the durable source used to rebuild local Skopos state.

<!-- skopos:task-state:start -->
```json
{
  "schemaVersion": 1,
  "id": "T-7762030f",
  "type": "task",
  "status": "active",
  "generatedAt": "2026-10-11T23:18:35.973Z",
  "updatedAt": "2026-10-11T23:18:35.973Z",
  "planIds": [],
  "childTasks": [],
  "state": "active",
  "detail": "standard",
  "title": "Make DataTable collection defaults and numbered remote pagination production-ready",
  "goal": "Make DataTable collection defaults and numbered remote pagination production-ready",
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
      "The simple and dashboard presets do not expose hidden-column controls by default; controlled remote offset pagination renders accessible numbered desktop controls and compact mobile controls; focused DataTable tests and package typecheck pass."
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
    "selectionSource": "automatic",
    "workflow": "tracked",
    "reasons": [
      "The work changes multiple paths, durable guidance, configuration, or a normal coordinated surface."
    ],
    "signals": {
      "goalSignals": [],
      "ownedPathCount": 11,
      "affectedScopeIds": [
        "workspace"
      ],
      "impactCategories": [
        "workspace-file"
      ],
      "proofSubjectKind": "task-closure"
    }
  },
  "proofSubject": {
    "kind": "task-closure",
    "baselineId": "baseline-3e8b977f61c7298e"
  },
  "priority": 0,
  "dependencyTaskIds": [],
  "steps": [
    {
      "id": "step-record-task-risk",
      "kind": "implementation",
      "title": "Record Task risk and detail before editing",
      "detail": "Confirm whether Task risk is light, standard, or high-impact. Keep the active Task current, use a Plan only for multi-Task direction, add a Decision for durable choices, and add or update a Finding for structural gaps.",
      "status": "pending"
    },
    {
      "id": "step-review-current-pattern",
      "kind": "implementation",
      "title": "Review the current pattern in unisane-ui",
      "detail": "Use the compact references to confirm the current scope, command surface, and docs entrypoints before editing code.",
      "status": "pending"
    },
    {
      "id": "step-implement-scoped-change",
      "kind": "implementation",
      "title": "Implement the smallest scoped change",
      "detail": "Carry out \"Make DataTable collection defaults and numbered remote pagination production-ready\" inside the resolved scope before widening impact to adjacent areas.",
      "status": "pending"
    },
    {
      "id": "step-sync-knowledge",
      "kind": "docs",
      "title": "Sync docs and instruction surfaces if touched",
      "detail": "Keep docs, instruction mirrors, and generated project knowledge aligned with the implementation.",
      "status": "pending"
    },
    {
      "id": "action-quality.build",
      "kind": "action",
      "title": "Build affected project",
      "detail": "Required by Guard quality.build.",
      "status": "pending"
    },
    {
      "id": "action-quality.lint",
      "kind": "action",
      "title": "Lint affected code",
      "detail": "Required by Guard quality.lint.",
      "status": "pending"
    },
    {
      "id": "action-quality.run-proof-phase",
      "kind": "action",
      "title": "Run focused UI proof phase",
      "detail": "Required by Guard ui.accessibility-proof.",
      "status": "pending"
    },
    {
      "id": "action-quality.test",
      "kind": "action",
      "title": "Test affected behavior",
      "detail": "Required by Guard quality.test.",
      "status": "pending"
    },
    {
      "id": "action-quality.typecheck",
      "kind": "action",
      "title": "Typecheck affected code",
      "detail": "Required by Guard quality.typecheck.",
      "status": "pending"
    },
    {
      "id": "action-ui.capture-responsive-proof",
      "kind": "action",
      "title": "Capture responsive UI proof",
      "detail": "Required by Guard ui.accessibility-proof.",
      "status": "pending"
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
        "packages/data-table/src/types/config.ts",
        "packages/data-table/src/components/data-table.tsx",
        "packages/data-table/src/components/data-table-inner.tsx",
        "packages/data-table/src/components/pagination.tsx",
        "packages/data-table/src/context/types.ts",
        "packages/data-table/src/context/provider.tsx",
        "packages/data-table/src/context/hooks/use-pagination.ts",
        "packages/data-table/src/utils/pagination.ts",
        "packages/data-table/tests/components/pagination.test.tsx",
        "packages/data-table/tests/context/hooks/use-pagination.test.tsx",
        "packages/data-table/tests/utils/pagination.test.ts"
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
        "packages/data-table/src/types/config.ts",
        "packages/data-table/src/components/data-table.tsx",
        "packages/data-table/src/components/data-table-inner.tsx",
        "packages/data-table/src/components/pagination.tsx",
        "packages/data-table/src/context/types.ts",
        "packages/data-table/src/context/provider.tsx",
        "packages/data-table/src/context/hooks/use-pagination.ts",
        "packages/data-table/src/utils/pagination.ts",
        "packages/data-table/tests/components/pagination.test.tsx",
        "packages/data-table/tests/context/hooks/use-pagination.test.tsx",
        "packages/data-table/tests/utils/pagination.test.ts"
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
        "packages/data-table/src/types/config.ts",
        "packages/data-table/src/components/data-table.tsx",
        "packages/data-table/src/components/data-table-inner.tsx",
        "packages/data-table/src/components/pagination.tsx",
        "packages/data-table/src/context/types.ts",
        "packages/data-table/src/context/provider.tsx",
        "packages/data-table/src/context/hooks/use-pagination.ts",
        "packages/data-table/src/utils/pagination.ts",
        "packages/data-table/tests/components/pagination.test.tsx",
        "packages/data-table/tests/context/hooks/use-pagination.test.tsx",
        "packages/data-table/tests/utils/pagination.test.ts"
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
        "packages/data-table/src/types/config.ts",
        "packages/data-table/src/components/data-table.tsx",
        "packages/data-table/src/components/data-table-inner.tsx",
        "packages/data-table/src/components/pagination.tsx",
        "packages/data-table/src/context/types.ts",
        "packages/data-table/src/context/provider.tsx",
        "packages/data-table/src/context/hooks/use-pagination.ts",
        "packages/data-table/src/utils/pagination.ts",
        "packages/data-table/tests/components/pagination.test.tsx",
        "packages/data-table/tests/context/hooks/use-pagination.test.tsx",
        "packages/data-table/tests/utils/pagination.test.ts"
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
        "packages/data-table/src/types/config.ts",
        "packages/data-table/src/components/data-table.tsx",
        "packages/data-table/src/components/data-table-inner.tsx",
        "packages/data-table/src/components/pagination.tsx",
        "packages/data-table/src/context/types.ts",
        "packages/data-table/src/context/provider.tsx",
        "packages/data-table/src/context/hooks/use-pagination.ts",
        "packages/data-table/src/utils/pagination.ts",
        "packages/data-table/tests/components/pagination.test.tsx",
        "packages/data-table/tests/context/hooks/use-pagination.test.tsx",
        "packages/data-table/tests/utils/pagination.test.ts"
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
        "packages/data-table/src/types/config.ts",
        "packages/data-table/src/components/data-table.tsx",
        "packages/data-table/src/components/data-table-inner.tsx",
        "packages/data-table/src/components/pagination.tsx",
        "packages/data-table/src/context/types.ts",
        "packages/data-table/src/context/provider.tsx",
        "packages/data-table/src/context/hooks/use-pagination.ts",
        "packages/data-table/src/utils/pagination.ts",
        "packages/data-table/tests/components/pagination.test.tsx",
        "packages/data-table/tests/context/hooks/use-pagination.test.tsx",
        "packages/data-table/tests/utils/pagination.test.ts"
      ],
      "outputPaths": [
        "apps/docs/test-results"
      ],
      "requiresApproval": false
    }
  ],
  "selectedGuardIds": [
    "quality.build",
    "quality.lint",
    "quality.test",
    "quality.typecheck",
    "ui.accessibility-proof"
  ],
  "evidenceRequirements": [
    {
      "id": "acceptance-1",
      "acceptanceCriterion": "The simple and dashboard presets do not expose hidden-column controls by default; controlled remote offset pagination renders accessible numbered desktop controls and compact mobile controls; focused DataTable tests and package typecheck pass.",
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
    }
  ],
  "memoryObligations": [],
  "questions": [],
  "recommendations": [
    {
      "id": "run-quality.build",
      "title": "Build affected project",
      "summary": "Required by Guard quality.build.",
      "priority": "medium",
      "actionKind": "run-action",
      "actionId": "quality.build",
      "blocking": false,
      "status": "open"
    },
    {
      "id": "run-quality.lint",
      "title": "Lint affected code",
      "summary": "Required by Guard quality.lint.",
      "priority": "medium",
      "actionKind": "run-action",
      "actionId": "quality.lint",
      "blocking": false,
      "status": "open"
    },
    {
      "id": "run-quality.run-proof-phase",
      "title": "Run focused UI proof phase",
      "summary": "Required by Guard ui.accessibility-proof.",
      "priority": "medium",
      "actionKind": "run-action",
      "actionId": "quality.run-proof-phase",
      "blocking": false,
      "status": "open"
    },
    {
      "id": "run-quality.test",
      "title": "Test affected behavior",
      "summary": "Required by Guard quality.test.",
      "priority": "medium",
      "actionKind": "run-action",
      "actionId": "quality.test",
      "blocking": false,
      "status": "open"
    },
    {
      "id": "run-quality.typecheck",
      "title": "Typecheck affected code",
      "summary": "Required by Guard quality.typecheck.",
      "priority": "medium",
      "actionKind": "run-action",
      "actionId": "quality.typecheck",
      "blocking": false,
      "status": "open"
    },
    {
      "id": "run-ui.capture-responsive-proof",
      "title": "Capture responsive UI proof",
      "summary": "Required by Guard ui.accessibility-proof.",
      "priority": "medium",
      "actionKind": "run-action",
      "actionId": "ui.capture-responsive-proof",
      "blocking": false,
      "status": "open"
    }
  ],
  "declaredOwnedPaths": [
    "packages/data-table/src/components/data-table-inner.tsx",
    "packages/data-table/src/components/data-table.tsx",
    "packages/data-table/src/components/pagination.tsx",
    "packages/data-table/src/context/hooks/use-pagination.ts",
    "packages/data-table/src/context/provider.tsx",
    "packages/data-table/src/context/types.ts",
    "packages/data-table/src/types/config.ts",
    "packages/data-table/src/utils/pagination.ts",
    "packages/data-table/tests/components/pagination.test.tsx",
    "packages/data-table/tests/context/hooks/use-pagination.test.tsx",
    "packages/data-table/tests/utils/pagination.test.ts"
  ]
}
```
<!-- skopos:task-state:end -->
