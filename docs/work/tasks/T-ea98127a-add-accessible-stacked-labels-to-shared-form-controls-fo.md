---
title: "Task: Add accessible stacked labels to shared form controls for consistent product forms"
status: active
owner: "codex-form-polish"
id: T-ea98127a
scope: "workspace"
role: task
lifecycle: active
authority: canonical
provenance: accepted
view: current
risk: standard
proofSubject: task-closure
proofBaseline: baseline-fad51b1fecc8745c
lastUpdated: 2026-09-09
---

# Task: Add accessible stacked labels to shared form controls for consistent product forms

## Changelog

- `2026-09-09`: Synchronized Task state `active` from Skopos.

## Goal

Add accessible stacked labels to shared form controls for consistent product forms

## Acceptance

- Stacked labels remain associated with controls across empty filled error and disabled states; existing floating presentation remains the default.

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

- `packages/ui/registry`
- `packages/ui/src/components/month-picker.tsx`
- `packages/ui/src/components/select-field.tsx`
- `packages/ui/src/components/stacked-field.test.tsx`
- `packages/ui/src/components/text-field.tsx`
- `packages/ui/src/components/token-field.tsx`
- `packages/ui/src/lib/field-shell.ts`
- `packages/ui/tests/text-field/stacked-field.test.tsx`
- `tools/skopos/actions/stacked-fields-generate.yaml`

## Ownership Expansions

- `2026-09-09T19:35:15.137Z` by `codex-form-polish`: `packages/ui/tests/text-field/stacked-field.test.tsx` — Exercise shared stacked label accessibility and state behavior in the existing test directory.
- `2026-09-09T19:38:02.318Z` by `codex-form-polish`: `packages/ui/registry`, `tools/skopos/actions/stacked-fields-generate.yaml` — Regenerate distributable component registry from shared source.

## Steps

- [x] **Record Task risk and detail before editing** (implementation, complete) — Confirm whether Task risk is light, standard, or high-impact. Keep the active Task current, use a Plan only for multi-Task direction, add a Decision for durable choices, and add or update a Finding for structural gaps.
- [x] **Review the current pattern in unisane-ui** (implementation, complete) — Use the compact references to confirm the current scope, command surface, and docs entrypoints before editing code.
- [x] **Implement the smallest scoped change** (implementation, complete) — Carry out "Add accessible stacked labels to shared form controls for consistent product forms" inside the resolved scope before widening impact to adjacent areas.
- [x] **Sync docs and instruction surfaces if touched** (docs, complete) — Keep docs, instruction mirrors, and generated project knowledge aligned with the implementation.
- [x] **Build affected project** (action, complete) — Required by Guard quality.build.
- [x] **Lint affected code** (action, complete) — Required by Guard quality.lint.
- [x] **Run focused UI proof phase** (action, complete) — Required by Guard ui.accessibility-proof.
- [x] **Test affected behavior** (action, complete) — Required by Guard quality.test.
- [x] **Typecheck affected code** (action, complete) — Required by Guard quality.typecheck.
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

- Stacked labels remain associated with controls across empty filled error and disabled states; existing floating presentation remains the default. (closure, agent-observation)
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
  "id": "T-ea98127a",
  "type": "task",
  "status": "active",
  "generatedAt": "2026-09-09T19:32:31.582Z",
  "updatedAt": "2026-09-09T20:12:30.861Z",
  "planIds": [],
  "childTasks": [],
  "state": "active",
  "detail": "standard",
  "title": "Add accessible stacked labels to shared form controls for consistent product forms",
  "goal": "Add accessible stacked labels to shared form controls for consistent product forms",
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
      "Stacked labels remain associated with controls across empty filled error and disabled states; existing floating presentation remains the default."
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
      "ownedPathCount": 6,
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
    "baselineId": "baseline-fad51b1fecc8745c"
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
      "detail": "Carry out \"Add accessible stacked labels to shared form controls for consistent product forms\" inside the resolved scope before widening impact to adjacent areas.",
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
        "packages/ui/registry",
        "packages/ui/src/components/month-picker.tsx",
        "packages/ui/src/components/select-field.tsx",
        "packages/ui/src/components/stacked-field.test.tsx",
        "packages/ui/src/components/text-field.tsx",
        "packages/ui/src/components/token-field.tsx",
        "packages/ui/src/lib/field-shell.ts",
        "packages/ui/tests/text-field/stacked-field.test.tsx",
        "tools/skopos/actions/stacked-fields-generate.yaml"
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
        "packages/ui/registry",
        "packages/ui/src/components/month-picker.tsx",
        "packages/ui/src/components/select-field.tsx",
        "packages/ui/src/components/stacked-field.test.tsx",
        "packages/ui/src/components/text-field.tsx",
        "packages/ui/src/components/token-field.tsx",
        "packages/ui/src/lib/field-shell.ts",
        "packages/ui/tests/text-field/stacked-field.test.tsx",
        "tools/skopos/actions/stacked-fields-generate.yaml"
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
        "packages/ui/src/components/month-picker.tsx",
        "packages/ui/src/components/select-field.tsx",
        "packages/ui/src/components/stacked-field.test.tsx",
        "packages/ui/src/components/text-field.tsx",
        "packages/ui/src/components/token-field.tsx",
        "packages/ui/src/lib/field-shell.ts",
        "packages/ui/tests/text-field/stacked-field.test.tsx"
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
        "packages/ui/registry",
        "packages/ui/src/components/month-picker.tsx",
        "packages/ui/src/components/select-field.tsx",
        "packages/ui/src/components/stacked-field.test.tsx",
        "packages/ui/src/components/text-field.tsx",
        "packages/ui/src/components/token-field.tsx",
        "packages/ui/src/lib/field-shell.ts",
        "packages/ui/tests/text-field/stacked-field.test.tsx",
        "tools/skopos/actions/stacked-fields-generate.yaml"
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
        "packages/ui/registry",
        "packages/ui/src/components/month-picker.tsx",
        "packages/ui/src/components/select-field.tsx",
        "packages/ui/src/components/stacked-field.test.tsx",
        "packages/ui/src/components/text-field.tsx",
        "packages/ui/src/components/token-field.tsx",
        "packages/ui/src/lib/field-shell.ts",
        "packages/ui/tests/text-field/stacked-field.test.tsx",
        "tools/skopos/actions/stacked-fields-generate.yaml"
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
        "packages/ui/src/components/month-picker.tsx",
        "packages/ui/src/components/select-field.tsx",
        "packages/ui/src/components/stacked-field.test.tsx",
        "packages/ui/src/components/text-field.tsx",
        "packages/ui/src/components/token-field.tsx",
        "packages/ui/src/lib/field-shell.ts",
        "packages/ui/tests/text-field/stacked-field.test.tsx"
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
      "acceptanceCriterion": "Stacked labels remain associated with controls across empty filled error and disabled states; existing floating presentation remains the default.",
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
      "status": "open"
    }
  ],
  "ownershipExpansions": [
    {
      "paths": [
        "packages/ui/tests/text-field/stacked-field.test.tsx"
      ],
      "reason": "Exercise shared stacked label accessibility and state behavior in the existing test directory.",
      "actorId": "codex-form-polish",
      "recordedAt": "2026-09-09T19:35:15.137Z",
      "baselinePaths": [
        {
          "path": "packages/ui/tests/text-field/stacked-field.test.tsx",
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
        "packages/ui/registry",
        "tools/skopos/actions/stacked-fields-generate.yaml"
      ],
      "reason": "Regenerate distributable component registry from shared source.",
      "actorId": "codex-form-polish",
      "recordedAt": "2026-09-09T19:38:02.318Z",
      "baselinePaths": [
        {
          "path": "packages/ui/registry",
          "digest": "5a2a8e84c09bf7c433ae5f9a2b16d5ec4bcb61297334c6cdc5e0eca80f8c67c1",
          "digestAlgorithm": "skopos-path-v2-code-unit-segment-dfs"
        },
        {
          "path": "tools/skopos/actions/stacked-fields-generate.yaml",
          "digest": "00917d66ac0ec6254ef35e352252ae25def64ac4447c01d52153c89bcf001c1e",
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
    "packages/ui/registry",
    "packages/ui/src/components/month-picker.tsx",
    "packages/ui/src/components/select-field.tsx",
    "packages/ui/src/components/stacked-field.test.tsx",
    "packages/ui/src/components/text-field.tsx",
    "packages/ui/src/components/token-field.tsx",
    "packages/ui/src/lib/field-shell.ts",
    "packages/ui/tests/text-field/stacked-field.test.tsx",
    "tools/skopos/actions/stacked-fields-generate.yaml"
  ]
}
```
<!-- skopos:task-state:end -->
