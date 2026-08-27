---
title: "Task: Prepare safe next-tag publication for public UI packages"
status: complete
owner: "codex"
id: T-18880218
scope: "workspace"
role: task
lifecycle: historical
authority: canonical
provenance: accepted
view: exception
risk: high-impact
proofSubject: task-closure
proofBaseline: baseline-027d9aeaf875a6df
lastUpdated: 2026-08-27
---

# Task: Prepare safe next-tag publication for public UI packages

## Changelog

- `2026-08-27`: Synchronized Task state `complete` from Skopos.

## Goal

Prepare safe next-tag publication for public UI packages

## Acceptance

- A manual trusted-publisher workflow builds, verifies, packs, and publishes only the four public UI packages in dependency order under the next tag.
- The private UI CLI is never published, existing versions fail closed, and no publication occurs from this preparation task.

## Non-Goals

- Publishing packages or pushing repository commits.

## Constraints

- Use npm trusted publishing with provenance and immutable package versions.

## Admission And Workflow

- Workflow: `strict`
- Selected risk/detail: `high-impact` / `detailed`
- Recommended risk/detail: `standard` / `standard`
- Selection source: `explicit-override`
- Reason: The work changes multiple paths, durable guidance, configuration, or a normal coordinated surface.
- Reason: The caller explicitly selected high-impact; Skopos recommended standard and kept both values visible.

## Owned Paths

- `.github/workflows/publish-packages.yml`
- `docs/findings/README.md`
- `docs/work/archive/tasks/T-23066e43-polish-the-documentation-site-layout-and-homepage.md`
- `docs/work/tasks/T-23066e43-polish-the-documentation-site-layout-and-homepage.md`
- `packages/data-table/package.json`
- `packages/email-templates/package.json`
- `packages/tokens/package.json`
- `packages/ui/package.json`

## Ownership Expansions

- `2026-08-26T23:18:39.204Z` by `codex`: `docs/work/archive/tasks/T-23066e43-polish-the-documentation-site-layout-and-homepage.md`, `docs/work/tasks/T-23066e43-polish-the-documentation-site-layout-and-homepage.md` — Adopt the approved predecessor-task disposition records created while establishing the release-preparation successor.
- `2026-08-27T18:16:32.384Z` by `codex`: `docs/findings/README.md` — Adopt the exact repository-memory blocker surfaced by closure Readiness.

## Steps

- [x] **Record Task risk and detail before editing** (implementation, complete) — Confirm whether Task risk is light, standard, or high-impact. Keep the active Task current, use a Plan only for multi-Task direction, add a Decision for durable choices, and add or update a Finding for structural gaps.
- [x] **Review the current pattern in unisane-ui** (implementation, complete) — Use the compact references to confirm the current scope, command surface, and docs entrypoints before editing code.
- [x] **Implement the smallest scoped change** (implementation, complete) — Carry out "Prepare safe next-tag publication for public UI packages" inside the resolved scope before widening impact to adjacent areas.
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

- A manual trusted-publisher workflow builds, verifies, packs, and publishes only the four public UI packages in dependency order under the next tag. (closure, agent-observation)
- The private UI CLI is never published, existing versions fail closed, and no publication occurs from this preparation task. (closure, agent-observation)
- Guard quality.build: Build affected project (closure, source-bound-action)
- Guard quality.lint: Lint affected code (closure, source-bound-action)
- Guard quality.test: Test affected behavior (closure, source-bound-action)
- Guard quality.typecheck: Typecheck affected code (closure, source-bound-action)

## Memory Obligations

- [complete] architecture: High-impact work must review and synchronize the existing architecture Memory for Scope workspace. (target: `docs/architecture/08-ui-application-architecture.md`); resolution: reviewed-no-change

## Portable Task State

This machine-readable block is the durable source used to rebuild local Skopos state.

<!-- skopos:task-state:start -->
```json
{
  "schemaVersion": 1,
  "id": "T-18880218",
  "type": "task",
  "status": "durable",
  "generatedAt": "2026-08-26T23:16:41.105Z",
  "updatedAt": "2026-08-27T18:19:21.849Z",
  "planIds": [],
  "childTasks": [],
  "state": "complete",
  "detail": "detailed",
  "title": "Prepare safe next-tag publication for public UI packages",
  "goal": "Prepare safe next-tag publication for public UI packages",
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
      "A manual trusted-publisher workflow builds, verifies, packs, and publishes only the four public UI packages in dependency order under the next tag.",
      "The private UI CLI is never published, existing versions fail closed, and no publication occurs from this preparation task."
    ],
    "nonGoals": [
      "Publishing packages or pushing repository commits."
    ],
    "constraints": [
      "Use npm trusted publishing with provenance and immutable package versions."
    ]
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
      "ownedPathCount": 5,
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
    "baselineId": "baseline-027d9aeaf875a6df"
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
      "detail": "Carry out \"Prepare safe next-tag publication for public UI packages\" inside the resolved scope before widening impact to adjacent areas.",
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
        "docs/findings/README.md",
        "docs/work/archive/tasks/T-23066e43-polish-the-documentation-site-layout-and-homepage.md",
        "docs/work/tasks/T-23066e43-polish-the-documentation-site-layout-and-homepage.md",
        "packages/data-table/package.json",
        "packages/email-templates/package.json",
        "packages/tokens/package.json",
        "packages/ui/package.json"
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
        "docs/findings/README.md",
        "docs/work/archive/tasks/T-23066e43-polish-the-documentation-site-layout-and-homepage.md",
        "docs/work/tasks/T-23066e43-polish-the-documentation-site-layout-and-homepage.md",
        "packages/data-table/package.json",
        "packages/email-templates/package.json",
        "packages/tokens/package.json",
        "packages/ui/package.json"
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
        "docs/findings/README.md",
        "docs/work/archive/tasks/T-23066e43-polish-the-documentation-site-layout-and-homepage.md",
        "docs/work/tasks/T-23066e43-polish-the-documentation-site-layout-and-homepage.md",
        "packages/data-table/package.json",
        "packages/email-templates/package.json",
        "packages/tokens/package.json",
        "packages/ui/package.json"
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
        "docs/findings/README.md",
        "docs/work/archive/tasks/T-23066e43-polish-the-documentation-site-layout-and-homepage.md",
        "docs/work/tasks/T-23066e43-polish-the-documentation-site-layout-and-homepage.md",
        "packages/data-table/package.json",
        "packages/email-templates/package.json",
        "packages/tokens/package.json",
        "packages/ui/package.json"
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
      "acceptanceCriterion": "A manual trusted-publisher workflow builds, verifies, packs, and publishes only the four public UI packages in dependency order under the next tag.",
      "phase": "closure",
      "actionIds": [],
      "guardIds": [],
      "evidence": "agent-observation"
    },
    {
      "id": "acceptance-2",
      "acceptanceCriterion": "The private UI CLI is never published, existing versions fail closed, and no publication occurs from this preparation task.",
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
      "id": "memory-architecture-2dff0510c1",
      "role": "architecture",
      "reason": "High-impact work must review and synchronize the existing architecture Memory for Scope workspace.",
      "status": "complete",
      "targetPath": "docs/architecture/08-ui-application-architecture.md",
      "resolution": "reviewed-no-change",
      "resolutionReason": "The workflow implements the already-accepted package graph, next-tag public package policy, and provenance boundary; UI application architecture does not change.",
      "resolvedAt": "2026-08-26T23:19:22.388Z",
      "resolvedByActorId": "codex"
    }
  ],
  "questions": [],
  "recommendations": [
    {
      "id": "start-bounded-child-task",
      "title": "Start a bounded child Task",
      "summary": "The Task may be drifting from its admitted subject because new impact categories appeared (docs). Keep this Task intact and move the suggested paths into focused follow-up work.",
      "priority": "high",
      "actionKind": "start-child-task",
      "command": "skopos task child start 'T-18880218' 'Continue Prepare safe next-tag publication for public UI packages as bounded follow-up work' . --scope 'workspace' --own 'docs/findings/README.md' --own 'docs/work/archive/tasks/T-23066e43-polish-the-documentation-site-layout-and-homepage.md' --own 'docs/work/tasks/T-23066e43-polish-the-documentation-site-layout-and-homepage.md' --reason 'The Task may be drifting from its admitted subject because new impact categories appeared (docs).' --actor 'codex'",
      "ownedPaths": [
        "docs/findings/README.md",
        "docs/work/archive/tasks/T-23066e43-polish-the-documentation-site-layout-and-homepage.md",
        "docs/work/tasks/T-23066e43-polish-the-documentation-site-layout-and-homepage.md"
      ],
      "scopeId": "workspace",
      "reason": "The Task may be drifting from its admitted subject because new impact categories appeared (docs).",
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
        "docs/work/archive/tasks/T-23066e43-polish-the-documentation-site-layout-and-homepage.md",
        "docs/work/tasks/T-23066e43-polish-the-documentation-site-layout-and-homepage.md"
      ],
      "reason": "Adopt the approved predecessor-task disposition records created while establishing the release-preparation successor.",
      "actorId": "codex",
      "recordedAt": "2026-08-26T23:18:39.204Z",
      "baselinePaths": [
        {
          "path": "docs/work/archive/tasks/T-23066e43-polish-the-documentation-site-layout-and-homepage.md",
          "digest": "7f46a9235cf8e6bbcfacaab524647a10a42e9f0d39c7eb126ae22be33af612af",
          "digestAlgorithm": "skopos-path-v2-code-unit-segment-dfs"
        },
        {
          "path": "docs/work/tasks/T-23066e43-polish-the-documentation-site-layout-and-homepage.md",
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
        "docs/findings/README.md"
      ],
      "reason": "Adopt the exact repository-memory blocker surfaced by closure Readiness.",
      "actorId": "codex",
      "recordedAt": "2026-08-27T18:16:32.384Z",
      "baselinePaths": [
        {
          "path": "docs/findings/README.md",
          "digest": "621d23ac7f2f88f58e55d7e9ac718204c912ed62e04e96194cd0283f9d4ed025",
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
    "docs/findings/README.md",
    "docs/work/archive/tasks/T-23066e43-polish-the-documentation-site-layout-and-homepage.md",
    "docs/work/tasks/T-23066e43-polish-the-documentation-site-layout-and-homepage.md",
    "packages/data-table/package.json",
    "packages/email-templates/package.json",
    "packages/tokens/package.json",
    "packages/ui/package.json"
  ]
}
```
<!-- skopos:task-state:end -->
