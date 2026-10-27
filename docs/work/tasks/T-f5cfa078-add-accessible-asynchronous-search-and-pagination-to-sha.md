---
title: "Task: Add accessible asynchronous search and pagination to shared Combobox"
status: active
owner: "trade-picker-polish"
id: T-f5cfa078
scope: "workspace"
role: task
lifecycle: active
authority: canonical
provenance: accepted
view: current
risk: standard
proofSubject: task-closure
proofBaseline: baseline-7e301938cae69da0
lastUpdated: 2026-10-14
---

# Task: Add accessible asynchronous search and pagination to shared Combobox

## Changelog

- `2026-10-14`: Synchronized Task state `active` from Skopos.

## Goal

Add accessible asynchronous search and pagination to shared Combobox

## Acceptance

- Remote results retain owner search ordering, loading/error recovery and pagination live inside the popup, and existing keyboard selection remains functional.

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
- `packages/data-table/tests/components/status-announcement.test.tsx`
- `packages/ui/registry`
- `packages/ui/src/components/combobox.tsx`
- `packages/ui/tests/combobox/combobox.test.tsx`
- `tools/skopos/actions/ui-data-table-behavior.yaml`

## Ownership Expansions

- `2026-10-14T21:24:02.525Z` by `trade-picker-polish`: `packages/data-table/src/components/data-table-inner.tsx` — Correct the shared table announcement for externally paginated collections in the same approved local UI snapshot.
- `2026-10-14T21:28:31.315Z` by `trade-picker-polish`: `packages/data-table/tests/components/status-announcement.test.tsx`, `tools/skopos/actions/ui-data-table-behavior.yaml` — Own focused remote-total accessibility regression and its narrow package check.

## Steps

- [ ] **Record Task risk and detail before editing** (implementation, pending) — Confirm whether Task risk is light, standard, or high-impact. Keep the active Task current, use a Plan only for multi-Task direction, add a Decision for durable choices, and add or update a Finding for structural gaps.
- [ ] **Review the current pattern in unisane-ui** (implementation, pending) — Use the compact references to confirm the current scope, command surface, and docs entrypoints before editing code.
- [ ] **Implement the smallest scoped change** (implementation, pending) — Carry out "Add accessible asynchronous search and pagination to shared Combobox" inside the resolved scope before widening impact to adjacent areas.
- [ ] **Sync docs and instruction surfaces if touched** (docs, pending) — Keep docs, instruction mirrors, and generated project knowledge aligned with the implementation.
- [ ] **Build affected project** (action, pending) — Required by Guard quality.build.
- [ ] **Lint affected code** (action, pending) — Required by Guard quality.lint.
- [x] **Run focused UI proof phase** (action, complete) — Required by Guard ui.accessibility-proof.
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

- Remote results retain owner search ordering, loading/error recovery and pagination live inside the popup, and existing keyboard selection remains functional. (closure, agent-observation)
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
  "id": "T-f5cfa078",
  "type": "task",
  "status": "active",
  "generatedAt": "2026-10-14T21:21:25.184Z",
  "updatedAt": "2026-10-14T21:34:04.088Z",
  "planIds": [],
  "childTasks": [],
  "state": "active",
  "detail": "standard",
  "title": "Add accessible asynchronous search and pagination to shared Combobox",
  "goal": "Add accessible asynchronous search and pagination to shared Combobox",
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
      "Remote results retain owner search ordering, loading/error recovery and pagination live inside the popup, and existing keyboard selection remains functional."
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
      "ownedPathCount": 3,
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
    "baselineId": "baseline-7e301938cae69da0"
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
      "detail": "Carry out \"Add accessible asynchronous search and pagination to shared Combobox\" inside the resolved scope before widening impact to adjacent areas.",
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
      "status": "complete"
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
        "packages/data-table/src/components/data-table-inner.tsx",
        "packages/data-table/tests/components/status-announcement.test.tsx",
        "packages/ui/registry",
        "packages/ui/src/components/combobox.tsx",
        "packages/ui/tests/combobox/combobox.test.tsx",
        "tools/skopos/actions/ui-data-table-behavior.yaml"
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
        "packages/data-table/src/components/data-table-inner.tsx",
        "packages/data-table/tests/components/status-announcement.test.tsx",
        "packages/ui/registry",
        "packages/ui/src/components/combobox.tsx",
        "packages/ui/tests/combobox/combobox.test.tsx",
        "tools/skopos/actions/ui-data-table-behavior.yaml"
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
        "packages/data-table/src/components/data-table-inner.tsx",
        "packages/data-table/tests/components/status-announcement.test.tsx",
        "packages/ui/src/components/combobox.tsx",
        "packages/ui/tests/combobox/combobox.test.tsx"
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
        "packages/data-table/src/components/data-table-inner.tsx",
        "packages/data-table/tests/components/status-announcement.test.tsx",
        "packages/ui/registry",
        "packages/ui/src/components/combobox.tsx",
        "packages/ui/tests/combobox/combobox.test.tsx",
        "tools/skopos/actions/ui-data-table-behavior.yaml"
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
        "packages/data-table/src/components/data-table-inner.tsx",
        "packages/data-table/tests/components/status-announcement.test.tsx",
        "packages/ui/registry",
        "packages/ui/src/components/combobox.tsx",
        "packages/ui/tests/combobox/combobox.test.tsx",
        "tools/skopos/actions/ui-data-table-behavior.yaml"
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
        "packages/data-table/src/components/data-table-inner.tsx",
        "packages/data-table/tests/components/status-announcement.test.tsx",
        "packages/ui/src/components/combobox.tsx",
        "packages/ui/tests/combobox/combobox.test.tsx"
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
      "acceptanceCriterion": "Remote results retain owner search ordering, loading/error recovery and pagination live inside the popup, and existing keyboard selection remains functional.",
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
  "ownershipExpansions": [
    {
      "paths": [
        "packages/data-table/src/components/data-table-inner.tsx"
      ],
      "reason": "Correct the shared table announcement for externally paginated collections in the same approved local UI snapshot.",
      "actorId": "trade-picker-polish",
      "recordedAt": "2026-10-14T21:24:02.525Z",
      "baselinePaths": [
        {
          "path": "packages/data-table/src/components/data-table-inner.tsx",
          "digest": "94090ff46ff1d57749bdf68e98ecfe4c1f001b6c9a64ff03a736c0671066e6c3",
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
        "packages/data-table/tests/components/status-announcement.test.tsx",
        "tools/skopos/actions/ui-data-table-behavior.yaml"
      ],
      "reason": "Own focused remote-total accessibility regression and its narrow package check.",
      "actorId": "trade-picker-polish",
      "recordedAt": "2026-10-14T21:28:31.315Z",
      "baselinePaths": [
        {
          "path": "packages/data-table/tests/components/status-announcement.test.tsx",
          "digest": "466fd4c5667cc3d327ae1dd48e6fa586fc0c0d8004457b5bed830d77fbc6a49d",
          "digestAlgorithm": "skopos-path-v2-code-unit-segment-dfs"
        },
        {
          "path": "tools/skopos/actions/ui-data-table-behavior.yaml",
          "digest": "ecdc8f3511ce1d06d6c5b2dd5d6359c9cb2d25d3f4a09bec4c6308243c585238",
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
    "packages/data-table/src/components/data-table-inner.tsx",
    "packages/data-table/tests/components/status-announcement.test.tsx",
    "packages/ui/registry",
    "packages/ui/src/components/combobox.tsx",
    "packages/ui/tests/combobox/combobox.test.tsx",
    "tools/skopos/actions/ui-data-table-behavior.yaml"
  ]
}
```
<!-- skopos:task-state:end -->
