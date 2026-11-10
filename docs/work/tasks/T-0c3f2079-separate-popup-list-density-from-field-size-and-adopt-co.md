---
title: "Task: Separate popup list density from field size and adopt compact Trade menus"
status: active
owner: "codex-popup-density-20261111"
id: T-0c3f2079
scope: "workspace"
role: task
lifecycle: active
authority: canonical
provenance: accepted
view: current
risk: high-impact
proofSubject: task-closure
proofBaseline: baseline-4e064f1871eef63c
lastUpdated: 2026-11-10
---

# Task: Separate popup list density from field size and adopt compact Trade menus

## Changelog

- `2026-11-10`: Synchronized Task state `active` from Skopos.

## Goal

Separate popup list density from field size and adopt compact Trade menus

## Acceptance

- One optional shared provider controls menu select and combobox rows without changing fields or legacy consumers; registry and packed runtime stay aligned

## Non-Goals

- None declared.

## Constraints

- None declared.

## Admission And Workflow

- Workflow: `strict`
- Selected risk/detail: `high-impact` / `detailed`
- Recommended risk/detail: `standard` / `standard`
- Selection source: `explicit-override`
- Reason: The work changes multiple paths, durable guidance, configuration, or a normal coordinated surface.
- Reason: The caller explicitly selected high-impact; Skopos recommended standard and kept both values visible.

## Owned Paths

- `docs/architecture/design-system.md`
- `packages/ui`

## Ownership Expansions

- None recorded.

## Steps

- [ ] **Record Task risk and detail before editing** (implementation, pending) — Confirm whether Task risk is light, standard, or high-impact. Keep the active Task current, use a Plan only for multi-Task direction, add a Decision for durable choices, and add or update a Finding for structural gaps.
- [ ] **Review the current pattern in unisane-ui** (implementation, pending) — Use the compact references to confirm the current scope, command surface, and docs entrypoints before editing code.
- [ ] **Implement the smallest scoped change** (implementation, pending) — Carry out "Separate popup list density from field size and adopt compact Trade menus" inside the resolved scope before widening impact to adjacent areas.
- [ ] **Sync docs and instruction surfaces if touched** (docs, pending) — Keep docs, instruction mirrors, and generated project knowledge aligned with the implementation.
- [ ] **Build affected project** (action, pending) — Required by Guard quality.build.
- [ ] **Lint affected code** (action, pending) — Required by Guard quality.lint.
- [ ] **Run focused UI proof phase** (action, pending) — Required by Guard ui.sheet.
- [ ] **Test affected behavior** (action, pending) — Required by Guard quality.test.
- [ ] **Typecheck affected code** (action, pending) — Required by Guard quality.typecheck.
- [ ] **Verify menu selection indicator and registry parity** (action, pending) — Required by Guard ui.menu-indicator.
- [ ] **Generate and build the shared Sheet package** (action, pending) — Required by Guards ui.menu-indicator, ui.sheet.

## Actions And Guards

- Action `quality.build`: Required by Guard quality.build.
- Action `quality.lint`: Required by Guard quality.lint.
- Action `quality.run-proof-phase`: Required by Guard ui.sheet.
- Action `quality.test`: Required by Guard quality.test.
- Action `quality.typecheck`: Required by Guard quality.typecheck.
- Action `ui.menu-indicator`: Required by Guard ui.menu-indicator.
- Action `ui.sheet.build`: Required by Guards ui.menu-indicator, ui.sheet.
- Guard `quality.build`
- Guard `quality.lint`
- Guard `quality.test`
- Guard `quality.typecheck`
- Guard `ui.menu-indicator`
- Guard `ui.sheet`

## Evidence And Readiness

- One optional shared provider controls menu select and combobox rows without changing fields or legacy consumers; registry and packed runtime stay aligned (closure, agent-observation)
- Guard quality.build: Build affected project (closure, source-bound-action)
- Guard quality.lint: Lint affected code (closure, source-bound-action)
- Guard quality.test: Test affected behavior (closure, source-bound-action)
- Guard quality.typecheck: Typecheck affected code (closure, source-bound-action)
- Guard ui.menu-indicator: Menu indicators preserve content alignment (closure, source-bound-action)
- Guard ui.sheet: Verify controlled Sheet distribution (closure, source-bound-action)

## Memory Obligations

- [complete] architecture: The declared Task scope owns canonical architecture Memory at docs/architecture/design-system.md; review and synchronize it if project truth changes. (target: `docs/architecture/design-system.md`); resolution: memory-updated

## Portable Task State

This machine-readable block is the durable source used to rebuild local Skopos state.

<!-- skopos:task-state:start -->
```json
{
  "schemaVersion": 1,
  "id": "T-0c3f2079",
  "type": "task",
  "status": "active",
  "generatedAt": "2026-11-10T20:24:28.863Z",
  "updatedAt": "2026-11-10T20:55:53.419Z",
  "planIds": [],
  "childTasks": [],
  "state": "active",
  "detail": "detailed",
  "title": "Separate popup list density from field size and adopt compact Trade menus",
  "goal": "Separate popup list density from field size and adopt compact Trade menus",
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
      "One optional shared provider controls menu select and combobox rows without changing fields or legacy consumers; registry and packed runtime stay aligned"
    ],
    "nonGoals": [],
    "constraints": []
  },
  "risk": "high-impact",
  "admission": {
    "recommendedRisk": "standard",
    "recommendedDetail": "standard",
    "selectedRisk": "high-impact",
    "selectedDetail": "detailed",
    "selectionSource": "explicit-override",
    "workflow": "strict",
    "reasons": [
      "The work changes multiple paths, durable guidance, configuration, or a normal coordinated surface.",
      "The caller explicitly selected high-impact; Skopos recommended standard and kept both values visible."
    ],
    "signals": {
      "goalSignals": [],
      "ownedPathCount": 2,
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
    "baselineId": "baseline-4e064f1871eef63c"
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
      "detail": "Carry out \"Separate popup list density from field size and adopt compact Trade menus\" inside the resolved scope before widening impact to adjacent areas.",
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
      "detail": "Required by Guard ui.sheet.",
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
      "id": "action-ui.menu-indicator",
      "kind": "action",
      "title": "Verify menu selection indicator and registry parity",
      "detail": "Required by Guard ui.menu-indicator.",
      "status": "pending"
    },
    {
      "id": "action-ui.sheet.build",
      "kind": "action",
      "title": "Generate and build the shared Sheet package",
      "detail": "Required by Guards ui.menu-indicator, ui.sheet.",
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
        "packages/ui",
        "docs/architecture/design-system.md"
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
        "packages/ui",
        "docs/architecture/design-system.md"
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
      "reason": "Required by Guard ui.sheet.",
      "matchedPaths": [
        "packages/ui"
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
        "packages/ui",
        "docs/architecture/design-system.md"
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
        "packages/ui",
        "docs/architecture/design-system.md"
      ],
      "outputPaths": [],
      "requiresApproval": false
    },
    {
      "id": "ui.menu-indicator",
      "title": "Verify menu selection indicator and registry parity",
      "category": "quality-check",
      "safety": "read-only",
      "sourcePath": "tools/skopos/actions/ui-menu-indicator.yaml",
      "reason": "Required by Guard ui.menu-indicator.",
      "matchedPaths": [
        "packages/ui"
      ],
      "outputPaths": [],
      "requiresApproval": false
    },
    {
      "id": "ui.sheet.build",
      "title": "Generate and build the shared Sheet package",
      "category": "quality-check",
      "safety": "artifact-producing",
      "sourcePath": "tools/skopos/actions/ui-sheet-build.yaml",
      "reason": "Required by Guards ui.menu-indicator, ui.sheet.",
      "matchedPaths": [
        "packages/ui"
      ],
      "outputPaths": [
        "packages/ui/registry",
        "packages/ui/dist"
      ],
      "requiresApproval": false
    }
  ],
  "selectedGuardIds": [
    "quality.build",
    "quality.lint",
    "quality.test",
    "quality.typecheck",
    "ui.menu-indicator",
    "ui.sheet"
  ],
  "evidenceRequirements": [
    {
      "id": "acceptance-1",
      "acceptanceCriterion": "One optional shared provider controls menu select and combobox rows without changing fields or legacy consumers; registry and packed runtime stay aligned",
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
      "id": "guard-ui.menu-indicator",
      "acceptanceCriterion": "Guard ui.menu-indicator: Menu indicators preserve content alignment",
      "phase": "closure",
      "actionIds": [
        "ui.menu-indicator",
        "ui.sheet.build"
      ],
      "guardIds": [
        "ui.menu-indicator"
      ],
      "evidence": "source-bound-action"
    },
    {
      "id": "guard-ui.sheet",
      "acceptanceCriterion": "Guard ui.sheet: Verify controlled Sheet distribution",
      "phase": "closure",
      "actionIds": [
        "ui.sheet.build",
        "quality.run-proof-phase"
      ],
      "guardIds": [
        "ui.sheet"
      ],
      "evidence": "source-bound-action"
    }
  ],
  "memoryObligations": [
    {
      "id": "memory-architecture-d58f039fa4",
      "role": "architecture",
      "reason": "The declared Task scope owns canonical architecture Memory at docs/architecture/design-system.md; review and synchronize it if project truth changes.",
      "status": "complete",
      "targetPath": "docs/architecture/design-system.md",
      "resolution": "memory-updated",
      "resolutionReason": "Documented app-level popup density ownership and unchanged field sizing in design-system architecture.",
      "resolvedAt": "2026-11-10T20:55:53.419Z",
      "resolvedByActorId": "codex-popup-density-20261111"
    }
  ],
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
      "summary": "Required by Guard ui.sheet.",
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
      "id": "run-ui.menu-indicator",
      "title": "Verify menu selection indicator and registry parity",
      "summary": "Required by Guard ui.menu-indicator.",
      "priority": "medium",
      "actionKind": "run-action",
      "actionId": "ui.menu-indicator",
      "blocking": false,
      "status": "open"
    },
    {
      "id": "run-ui.sheet.build",
      "title": "Generate and build the shared Sheet package",
      "summary": "Required by Guards ui.menu-indicator, ui.sheet.",
      "priority": "medium",
      "actionKind": "run-action",
      "actionId": "ui.sheet.build",
      "blocking": false,
      "status": "open"
    }
  ],
  "declaredOwnedPaths": [
    "docs/architecture/design-system.md",
    "packages/ui"
  ]
}
```
<!-- skopos:task-state:end -->
