---
title: "Task: Refresh stale UI release boundary report and verify publication prerequisites"
status: complete
owner: "codex-ui-release"
id: T-40726b29
scope: "workspace"
role: task
lifecycle: historical
authority: canonical
provenance: accepted
view: exception
risk: high-impact
proofSubject: task-closure
proofBaseline: baseline-4bd5f0cca2744d72
lastUpdated: 2026-09-10
---

# Task: Refresh stale UI release boundary report and verify publication prerequisites

## Changelog

- `2026-09-10`: Synchronized Task state `complete` from Skopos.

## Goal

Refresh stale UI release boundary report and verify publication prerequisites

## Acceptance

- The generated boundary report matches current source and the UI release quality checks pass

## Non-Goals

- None declared.

## Constraints

- None declared.

## Admission And Workflow

- Workflow: `strict`
- Selected risk/detail: `high-impact` / `detailed`
- Recommended risk/detail: `high-impact` / `detailed`
- Selection source: `automatic`
- Reason: The goal contains high-impact signal: release.

## Owned Paths

- `.github/workflows/publish-packages.yml`
- `docs/architecture/package-and-distribution-boundaries.md`
- `docs/reference/generated/repository-convergence-report.json`
- `docs/release-approval.json`
- `package.json`
- `scripts/__tests__/verify-email-templates-packed-producer-certificate.test.mjs`
- `scripts/__tests__/verify-packed-producer-certificate.test.mjs`
- `scripts/check-repository-boundaries.mjs`
- `scripts/verify-email-templates-packed-producer-certificate.mjs`
- `scripts/verify-packed-producer-certificate.mjs`

## Ownership Expansions

- `2026-09-10T14:22:44.930Z` by `codex-ui-release`: `scripts/check-repository-boundaries.mjs` — Generated release report includes machine-specific macOS .DS_Store files and would differ on CI
- `2026-09-10T14:31:11.010Z` by `codex-ui-release`: `.github/workflows/publish-packages.yml`, `docs/release-approval.json`, `package.json`, `scripts/__tests__/verify-email-templates-packed-producer-certificate.test.mjs`, `scripts/__tests__/verify-packed-producer-certificate.test.mjs`, `scripts/verify-email-templates-packed-producer-certificate.mjs`, `scripts/verify-packed-producer-certificate.mjs` — Replace umbrella-only certificate with one repository-local packed consumer verification and configure approved bootstrap publishing
- `2026-09-10T14:35:55.546Z` by `codex-ui-release`: `docs/architecture/package-and-distribution-boundaries.md` — Document the repository-local packed release proof and immutable artifact publishing path

## Steps

- [x] **Record Task risk and detail before editing** (implementation, complete) — Confirm whether Task risk is light, standard, or high-impact. Keep the active Task current, use a Plan only for multi-Task direction, add a Decision for durable choices, and add or update a Finding for structural gaps.
- [x] **Review the current pattern in unisane-ui** (implementation, complete) — Use the compact references to confirm the current scope, command surface, and docs entrypoints before editing code.
- [x] **Implement the smallest scoped change** (implementation, complete) — Carry out "Refresh stale UI release boundary report and verify publication prerequisites" inside the resolved scope before widening impact to adjacent areas.
- [x] **Sync docs and instruction surfaces if touched** (docs, complete) — Keep docs, instruction mirrors, and generated project knowledge aligned with the implementation.
- [x] **Build affected project** (action, complete) — Required by Guard quality.build.
- [x] **Lint affected code** (action, complete) — Required by Guard quality.lint.
- [x] **Test affected behavior** (action, complete) — Required by Guard quality.test.
- [x] **Typecheck affected code** (action, complete) — Required by Guard quality.typecheck.

## Actions And Guards

- Action `quality.build`: Required by Guard quality.build.
- Action `quality.lint`: Required by Guard quality.lint.
- Action `quality.test`: Required by Guard quality.test.
- Action `quality.typecheck`: Required by Guard quality.typecheck.
- Guard `quality.build`
- Guard `quality.lint`
- Guard `quality.test`
- Guard `quality.typecheck`

## Evidence And Readiness

- The generated boundary report matches current source and the UI release quality checks pass (closure, agent-observation)
- Guard quality.build: Build affected project (closure, source-bound-action)
- Guard quality.lint: Lint affected code (closure, source-bound-action)
- Guard quality.test: Test affected behavior (closure, source-bound-action)
- Guard quality.typecheck: Typecheck affected code (closure, source-bound-action)

## Memory Obligations

- [complete] architecture: The declared Task scope owns canonical architecture Memory at docs/architecture/package-and-distribution-boundaries.md; review and synchronize it if project truth changes. (target: `docs/architecture/package-and-distribution-boundaries.md`); resolution: memory-updated

## Portable Task State

This machine-readable block is the durable source used to rebuild local Skopos state.

<!-- skopos:task-state:start -->
```json
{
  "schemaVersion": 1,
  "id": "T-40726b29",
  "type": "task",
  "status": "durable",
  "generatedAt": "2026-09-10T14:22:06.721Z",
  "updatedAt": "2026-09-10T14:38:31.005Z",
  "planIds": [],
  "childTasks": [],
  "state": "complete",
  "detail": "detailed",
  "title": "Refresh stale UI release boundary report and verify publication prerequisites",
  "goal": "Refresh stale UI release boundary report and verify publication prerequisites",
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
      "The generated boundary report matches current source and the UI release quality checks pass"
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
    "selectionSource": "automatic",
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
    "baselineId": "baseline-4bd5f0cca2744d72"
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
      "detail": "Carry out \"Refresh stale UI release boundary report and verify publication prerequisites\" inside the resolved scope before widening impact to adjacent areas.",
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
        ".github/workflows/publish-packages.yml",
        "docs/architecture/package-and-distribution-boundaries.md",
        "docs/reference/generated/repository-convergence-report.json",
        "docs/release-approval.json",
        "scripts/__tests__/verify-email-templates-packed-producer-certificate.test.mjs",
        "scripts/__tests__/verify-packed-producer-certificate.test.mjs",
        "scripts/check-repository-boundaries.mjs",
        "scripts/verify-email-templates-packed-producer-certificate.mjs",
        "scripts/verify-packed-producer-certificate.mjs"
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
        ".github/workflows/publish-packages.yml",
        "docs/architecture/package-and-distribution-boundaries.md",
        "docs/reference/generated/repository-convergence-report.json",
        "docs/release-approval.json",
        "scripts/__tests__/verify-email-templates-packed-producer-certificate.test.mjs",
        "scripts/__tests__/verify-packed-producer-certificate.test.mjs",
        "scripts/check-repository-boundaries.mjs",
        "scripts/verify-email-templates-packed-producer-certificate.mjs",
        "scripts/verify-packed-producer-certificate.mjs"
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
        ".github/workflows/publish-packages.yml",
        "docs/architecture/package-and-distribution-boundaries.md",
        "docs/reference/generated/repository-convergence-report.json",
        "docs/release-approval.json",
        "scripts/__tests__/verify-email-templates-packed-producer-certificate.test.mjs",
        "scripts/__tests__/verify-packed-producer-certificate.test.mjs",
        "scripts/check-repository-boundaries.mjs",
        "scripts/verify-email-templates-packed-producer-certificate.mjs",
        "scripts/verify-packed-producer-certificate.mjs"
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
        ".github/workflows/publish-packages.yml",
        "docs/architecture/package-and-distribution-boundaries.md",
        "docs/reference/generated/repository-convergence-report.json",
        "docs/release-approval.json",
        "scripts/__tests__/verify-email-templates-packed-producer-certificate.test.mjs",
        "scripts/__tests__/verify-packed-producer-certificate.test.mjs",
        "scripts/check-repository-boundaries.mjs",
        "scripts/verify-email-templates-packed-producer-certificate.mjs",
        "scripts/verify-packed-producer-certificate.mjs"
      ],
      "outputPaths": [],
      "requiresApproval": false
    }
  ],
  "selectedGuardIds": [
    "quality.build",
    "quality.lint",
    "quality.test",
    "quality.typecheck"
  ],
  "evidenceRequirements": [
    {
      "id": "acceptance-1",
      "acceptanceCriterion": "The generated boundary report matches current source and the UI release quality checks pass",
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
    }
  ],
  "memoryObligations": [
    {
      "id": "memory-architecture-9fc662a2b9",
      "role": "architecture",
      "reason": "The declared Task scope owns canonical architecture Memory at docs/architecture/package-and-distribution-boundaries.md; review and synchronize it if project truth changes.",
      "status": "complete",
      "targetPath": "docs/architecture/package-and-distribution-boundaries.md",
      "resolution": "memory-updated",
      "resolutionReason": "Documented repository-local artifact verification and publication of integrity-checked archives",
      "resolvedAt": "2026-09-10T14:37:14.889Z",
      "resolvedByActorId": "codex-ui-release"
    }
  ],
  "questions": [],
  "recommendations": [
    {
      "id": "start-bounded-child-task",
      "title": "Start a bounded child Task",
      "summary": "The Task may be drifting from its admitted subject because ownership expanded 3 times and new impact categories appeared (workspace-file). Keep this Task intact and move the suggested paths into focused follow-up work.",
      "priority": "high",
      "actionKind": "start-child-task",
      "command": "skopos task child start 'T-40726b29' 'Continue Refresh stale UI release boundary report and verify publication prerequisites as bounded follow-up work' . --scope 'workspace' --own '.github/workflows/publish-packages.yml' --own 'docs/architecture/package-and-distribution-boundaries.md' --own 'docs/release-approval.json' --own 'package.json' --own 'scripts/__tests__/verify-email-templates-packed-producer-certificate.test.mjs' --own 'scripts/__tests__/verify-packed-producer-certificate.test.mjs' --own 'scripts/check-repository-boundaries.mjs' --own 'scripts/verify-email-templates-packed-producer-certificate.mjs' --own 'scripts/verify-packed-producer-certificate.mjs' --reason 'The Task may be drifting from its admitted subject because ownership expanded 3 times and new impact categories appeared (workspace-file).' --actor 'codex-ui-release'",
      "ownedPaths": [
        ".github/workflows/publish-packages.yml",
        "docs/architecture/package-and-distribution-boundaries.md",
        "docs/release-approval.json",
        "package.json",
        "scripts/__tests__/verify-email-templates-packed-producer-certificate.test.mjs",
        "scripts/__tests__/verify-packed-producer-certificate.test.mjs",
        "scripts/check-repository-boundaries.mjs",
        "scripts/verify-email-templates-packed-producer-certificate.mjs",
        "scripts/verify-packed-producer-certificate.mjs"
      ],
      "scopeId": "workspace",
      "reason": "The Task may be drifting from its admitted subject because ownership expanded 3 times and new impact categories appeared (workspace-file).",
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
    }
  ],
  "ownershipExpansions": [
    {
      "paths": [
        "scripts/check-repository-boundaries.mjs"
      ],
      "reason": "Generated release report includes machine-specific macOS .DS_Store files and would differ on CI",
      "actorId": "codex-ui-release",
      "recordedAt": "2026-09-10T14:22:44.930Z",
      "baselinePaths": [
        {
          "path": "scripts/check-repository-boundaries.mjs",
          "digest": "f173b0319ab7601d8afb1b41aba2ef7c82e3671302230720071ccf2e785b1ef2",
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
        ".github/workflows/publish-packages.yml",
        "docs/release-approval.json",
        "package.json",
        "scripts/__tests__/verify-email-templates-packed-producer-certificate.test.mjs",
        "scripts/__tests__/verify-packed-producer-certificate.test.mjs",
        "scripts/verify-email-templates-packed-producer-certificate.mjs",
        "scripts/verify-packed-producer-certificate.mjs"
      ],
      "reason": "Replace umbrella-only certificate with one repository-local packed consumer verification and configure approved bootstrap publishing",
      "actorId": "codex-ui-release",
      "recordedAt": "2026-09-10T14:31:11.010Z",
      "baselinePaths": [
        {
          "path": ".github/workflows/publish-packages.yml",
          "digest": "7d4ef86716b7f07c61feee2414980b93c6d9afb936af46b31108c1013f93d11a",
          "digestAlgorithm": "skopos-path-v2-code-unit-segment-dfs"
        },
        {
          "path": "docs/release-approval.json",
          "digest": "62d1f7abbe577bcde19a8439d7080918e2fcd28d196fc07df30903e43fa89929",
          "digestAlgorithm": "skopos-path-v2-code-unit-segment-dfs"
        },
        {
          "path": "package.json",
          "digest": "ff3f5651379b369ccab3536d8e017e0457363e74f70bbf654ba8a2c3f0b6364d",
          "digestAlgorithm": "skopos-path-v2-code-unit-segment-dfs"
        },
        {
          "path": "scripts/__tests__/verify-email-templates-packed-producer-certificate.test.mjs",
          "digest": "478e5ca8d8fbbc256ee92fcd5da2ef1b56014aa92c42c94e728689eab054c3a0",
          "digestAlgorithm": "skopos-path-v2-code-unit-segment-dfs"
        },
        {
          "path": "scripts/__tests__/verify-packed-producer-certificate.test.mjs",
          "digest": "c4d3e04dcb0d6d4eca6f85815392d53cc62d7635cbb708af9b926b4a6368a3cb",
          "digestAlgorithm": "skopos-path-v2-code-unit-segment-dfs"
        },
        {
          "path": "scripts/verify-email-templates-packed-producer-certificate.mjs",
          "digest": "4e42c5392e197f00d05fc1398453d6a2d70d042ef084edbbe90e67bc60de6b6b",
          "digestAlgorithm": "skopos-path-v2-code-unit-segment-dfs"
        },
        {
          "path": "scripts/verify-packed-producer-certificate.mjs",
          "digest": "042479828ce26eff7582fca9be06d94c5a4706865de681a284bea043d11cd29c",
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
        "docs/architecture/package-and-distribution-boundaries.md"
      ],
      "reason": "Document the repository-local packed release proof and immutable artifact publishing path",
      "actorId": "codex-ui-release",
      "recordedAt": "2026-09-10T14:35:55.546Z",
      "baselinePaths": [
        {
          "path": "docs/architecture/package-and-distribution-boundaries.md",
          "digest": "d1e11569f7946dd44fa071dc1be9c124b5908776e89e19f9a770896b7b024027",
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
    ".github/workflows/publish-packages.yml",
    "docs/architecture/package-and-distribution-boundaries.md",
    "docs/reference/generated/repository-convergence-report.json",
    "docs/release-approval.json",
    "package.json",
    "scripts/__tests__/verify-email-templates-packed-producer-certificate.test.mjs",
    "scripts/__tests__/verify-packed-producer-certificate.test.mjs",
    "scripts/check-repository-boundaries.mjs",
    "scripts/verify-email-templates-packed-producer-certificate.mjs",
    "scripts/verify-packed-producer-certificate.mjs"
  ]
}
```
<!-- skopos:task-state:end -->
