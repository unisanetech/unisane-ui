---
title: "Task: Complete the authorized row-hover release and preserve current inventory evidence"
status: complete
owner: "codex-row-hover"
id: T-a72a2191
scope: "workspace"
role: task
lifecycle: historical
authority: canonical
provenance: accepted
view: exception
risk: high-impact
proofSubject: task-closure
proofBaseline: baseline-d857eb6c8b14b669
lastUpdated: 2026-11-12
---

# Task: Complete the authorized row-hover release and preserve current inventory evidence

## Changelog

- `2026-11-12`: Synchronized Task state `complete` from Skopos.

## Goal

Complete the authorized row-hover release and preserve current inventory evidence

## Acceptance

- Current source inventory matches the final reviewed release source; source CI and canonical clean-consumer certificate pass before the existing npm staging route is used. Preserve the concurrent dependency update.

## Non-Goals

- None declared.

## Constraints

- None declared.

## Admission And Workflow

- Workflow: `strict`
- Selected risk/detail: `high-impact` / `detailed`
- Recommended risk/detail: `high-impact` / `detailed`
- Selection source: `explicit-override`
- Reason: The goal contains high-impact signal: release.

## Owned Paths

- `docs/reference/generated/repository-convergence-report.json`
- `docs/release-approval.json`
- `tools/skopos/actions/ui-release-convergence.yaml`

## Ownership Expansions

- `2026-11-12T10:40:43.617Z` by `codex-row-hover`: `docs/release-approval.json` — Certify the existing approved immutable release selection together with its corrected inventory report
- `2026-11-12T10:41:04.013Z` by `codex-row-hover`: `tools/skopos/actions/ui-release-convergence.yaml` — The inventory generator scans reference docs but its Action omitted them, incorrectly reusing stale inventory proof after a documentation edit; declare the real inputs while excluding owned generated reports and task projections

## Steps

- [x] **Record Task risk and detail before editing** (implementation, complete) — Confirm whether Task risk is light, standard, or high-impact. Keep the active Task current, use a Plan only for multi-Task direction, add a Decision for durable choices, and add or update a Finding for structural gaps.
- [x] **Review the current pattern in unisane-ui** (implementation, complete) — Use the compact references to confirm the current scope, command surface, and docs entrypoints before editing code.
- [x] **Implement the smallest scoped change** (implementation, complete) — Carry out "Complete the authorized row-hover release and preserve current inventory evidence" inside the resolved scope before widening impact to adjacent areas.
- [x] **Sync docs and instruction surfaces if touched** (docs, complete) — Keep docs, instruction mirrors, and generated project knowledge aligned with the implementation.
- [x] **Build affected project** (action, complete) — Required by Guard quality.build.
- [x] **Lint affected code** (action, complete) — Required by Guard quality.lint.
- [x] **Test affected behavior** (action, complete) — Required by Guard quality.test.
- [x] **Typecheck affected code** (action, complete) — Required by Guard quality.typecheck.
- [x] **Restore the complete locked UI workspace dependencies** (action, complete) — Required by Guard ui.hosted-release.
- [x] **Regenerate canonical release convergence evidence** (action, complete) — Required by Guard ui.hosted-release.
- [x] **Verify the exact hosted UI release archives** (action, complete) — Required by Guard ui.hosted-release.

## Actions And Guards

- Action `quality.build`: Required by Guard quality.build.
- Action `quality.lint`: Required by Guard quality.lint.
- Action `quality.test`: Required by Guard quality.test.
- Action `quality.typecheck`: Required by Guard quality.typecheck.
- Action `ui.dependencies.restore`: Required by Guard ui.hosted-release.
- Action `ui.hosted-release.convergence`: Required by Guard ui.hosted-release.
- Action `ui.hosted-release.packed`: Required by Guard ui.hosted-release.
- Guard `quality.build`
- Guard `quality.lint`
- Guard `quality.test`
- Guard `quality.typecheck`
- Guard `ui.hosted-release`

## Evidence And Readiness

- Current source inventory matches the final reviewed release source; source CI and canonical clean-consumer certificate pass before the existing npm staging route is used. Preserve the concurrent dependency update. (closure, agent-observation)
- Guard quality.build: Build affected project (closure, source-bound-action)
- Guard quality.lint: Lint affected code (closure, source-bound-action)
- Guard quality.test: Test affected behavior (closure, source-bound-action)
- Guard quality.typecheck: Typecheck affected code (closure, source-bound-action)
- Guard ui.hosted-release: Hosted UI prereleases require locked dependencies and packed consumer proof (closure, source-bound-action)

## Memory Obligations

- [complete] architecture: High-impact work must review and synchronize the existing architecture Memory for Scope workspace. (target: `docs/architecture/08-ui-application-architecture.md`); resolution: reviewed-no-change

## Portable Task State

This machine-readable block is the durable source used to rebuild local Skopos state.

<!-- skopos:task-state:start -->
```json
{
  "schemaVersion": 1,
  "id": "T-a72a2191",
  "type": "task",
  "status": "durable",
  "generatedAt": "2026-11-12T10:40:27.992Z",
  "updatedAt": "2026-11-12T10:48:16.531Z",
  "planIds": [],
  "childTasks": [],
  "state": "complete",
  "detail": "detailed",
  "title": "Complete the authorized row-hover release and preserve current inventory evidence",
  "goal": "Complete the authorized row-hover release and preserve current inventory evidence",
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
      "Current source inventory matches the final reviewed release source; source CI and canonical clean-consumer certificate pass before the existing npm staging route is used. Preserve the concurrent dependency update."
    ],
    "nonGoals": [],
    "constraints": []
  },
  "risk": "high-impact",
  "admission": {
    "recommendedRisk": "high-impact",
    "recommendedDetail": "detailed",
    "selectedRisk": "high-impact",
    "selectedDetail": "detailed",
    "selectionSource": "explicit-override",
    "workflow": "strict",
    "reasons": [
      "The goal contains high-impact signal: release."
    ],
    "signals": {
      "goalSignals": [
        "release"
      ],
      "ownedPathCount": 1,
      "affectedScopeIds": [
        "workspace"
      ],
      "impactCategories": [
        "docs"
      ],
      "proofSubjectKind": "task-closure"
    }
  },
  "proofSubject": {
    "kind": "task-closure",
    "baselineId": "baseline-d857eb6c8b14b669"
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
      "detail": "Carry out \"Complete the authorized row-hover release and preserve current inventory evidence\" inside the resolved scope before widening impact to adjacent areas.",
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
        "docs/reference/generated/repository-convergence-report.json",
        "docs/release-approval.json",
        "tools/skopos/actions/ui-release-convergence.yaml"
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
        "docs/reference/generated/repository-convergence-report.json",
        "docs/release-approval.json",
        "tools/skopos/actions/ui-release-convergence.yaml"
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
        "docs/reference/generated/repository-convergence-report.json",
        "docs/release-approval.json",
        "tools/skopos/actions/ui-release-convergence.yaml"
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
        "docs/reference/generated/repository-convergence-report.json",
        "docs/release-approval.json",
        "tools/skopos/actions/ui-release-convergence.yaml"
      ],
      "outputPaths": [],
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
    "ui.hosted-release"
  ],
  "evidenceRequirements": [
    {
      "id": "acceptance-1",
      "acceptanceCriterion": "Current source inventory matches the final reviewed release source; source CI and canonical clean-consumer certificate pass before the existing npm staging route is used. Preserve the concurrent dependency update.",
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
  "memoryObligations": [
    {
      "id": "memory-architecture-2dff0510c1",
      "role": "architecture",
      "reason": "High-impact work must review and synchronize the existing architecture Memory for Scope workspace.",
      "status": "complete",
      "targetPath": "docs/architecture/08-ui-application-architecture.md",
      "resolution": "reviewed-no-change",
      "resolutionReason": "Reviewed the actual canonical docs/architecture/design-system.md and package-and-distribution-boundaries.md rather than the inferred absent numbered target. This declares the inventory generator actual inputs, excludes generated reports/task projections and changes no package ownership, public API or dependency direction. Existing generated-artifact standards already require source-bound proof.",
      "resolvedAt": "2026-11-12T10:43:20.056Z",
      "resolvedByActorId": "codex-row-hover"
    }
  ],
  "questions": [],
  "recommendations": [
    {
      "id": "start-bounded-child-task",
      "title": "Start a bounded child Task",
      "summary": "The Task may be drifting from its admitted subject because new impact categories appeared (workspace-file). Keep this Task intact and move the suggested paths into focused follow-up work.",
      "priority": "high",
      "actionKind": "start-child-task",
      "command": "skopos task child start 'T-a72a2191' 'Continue Complete the authorized row-hover release and preserve current inventory evidence as bounded follow-up work' . --scope 'workspace' --own 'tools/skopos/actions/ui-release-convergence.yaml' --reason 'The Task may be drifting from its admitted subject because new impact categories appeared (workspace-file).' --actor 'codex-row-hover'",
      "ownedPaths": [
        "tools/skopos/actions/ui-release-convergence.yaml"
      ],
      "scopeId": "workspace",
      "reason": "The Task may be drifting from its admitted subject because new impact categories appeared (workspace-file).",
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
        "docs/release-approval.json"
      ],
      "reason": "Certify the existing approved immutable release selection together with its corrected inventory report",
      "actorId": "codex-row-hover",
      "recordedAt": "2026-11-12T10:40:43.617Z",
      "baselinePaths": [
        {
          "path": "docs/release-approval.json",
          "digest": "c706cc2d382c1a753516eb9dfd2c5fc917d517cd00ed67b149e8aff9471997d8",
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
        "tools/skopos/actions/ui-release-convergence.yaml"
      ],
      "reason": "The inventory generator scans reference docs but its Action omitted them, incorrectly reusing stale inventory proof after a documentation edit; declare the real inputs while excluding owned generated reports and task projections",
      "actorId": "codex-row-hover",
      "recordedAt": "2026-11-12T10:41:04.013Z",
      "baselinePaths": [
        {
          "path": "tools/skopos/actions/ui-release-convergence.yaml",
          "digest": "e8a8418b5d127844c2f894b02c00aba4edc151e3986292208cc62ea69514b023",
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
    "docs/reference/generated/repository-convergence-report.json",
    "docs/release-approval.json",
    "tools/skopos/actions/ui-release-convergence.yaml"
  ]
}
```
<!-- skopos:task-state:end -->
