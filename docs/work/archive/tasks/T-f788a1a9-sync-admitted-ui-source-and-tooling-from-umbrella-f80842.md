---
title: "Task: Sync admitted UI source and tooling from umbrella f80842247 into the standalone checkout"
status: complete
owner: "codex-ui-standalone-sync"
id: T-f788a1a9
scope: "workspace"
role: task
lifecycle: historical
authority: canonical
provenance: accepted
view: exception
risk: high-impact
proofSubject: task-closure
proofBaseline: baseline-c3e744dda4fa684a
lastUpdated: 2026-08-12
---

# Task: Sync admitted UI source and tooling from umbrella f80842247 into the standalone checkout

## Changelog

- `2026-08-12`: Synchronized Task state `complete` from Skopos.

## Goal

Sync admitted UI source and tooling from umbrella f80842247 into the standalone checkout

## Acceptance

- Only current unisane-ui-owned package, application-source, and repository-tooling changes since the immutable extraction freeze are synchronized while standalone provenance and target-only foundation remain intact.
- All target packages build, test, and typecheck using only repository-local dependencies.
- The packed-producer certificate runs from the standalone checkout with an offline clean external consumer and no sibling, workspace, file, link, or portal fallback.

## Non-Goals

- Do not copy umbrella Tasks or umbrella-only docs, create remotes, push, access a registry, publish, decide licenses, or flip authority.

## Constraints

- None declared.

## Admission And Workflow

- Workflow: `strict`
- Selected risk/detail: `high-impact` / `detailed`
- Recommended risk/detail: `high-impact` / `detailed`
- Selection source: `explicit-override`
- Reason: Declared ownership spans 18 paths.

## Owned Paths

- `.prettierignore`
- `apps/docs/app/(app-shell)/docs/data-table/responsiveness/page.tsx`
- `apps/docs/lib/docs/runtime/navigation.ts`
- `docs/reference/generated/repository-convergence-report.json`
- `package.json`
- `packages/data-table/docs/RESPONSIVENESS.md`
- `packages/data-table/package.json`
- `packages/email-templates/certificates/packed-producer-certificate.json`
- `packages/email-templates/package.json`
- `packages/ui-cli`
- `pnpm-lock.yaml`
- `prettier.config.mjs`
- `scripts/__tests__/verify-email-templates-packed-producer-certificate.test.mjs`
- `scripts/__tests__/verify-packed-producer-certificate.test.mjs`
- `scripts/check-package-contents.mjs`
- `scripts/check-repository-boundaries.mjs`
- `scripts/verify-email-templates-packed-producer-certificate.mjs`
- `scripts/verify-packed-producer-certificate.mjs`
- `turbo.json`

## Ownership Expansions

- `2026-08-12T09:42:00.502Z` by `codex-ui-standalone-sync`: `docs/reference/generated/repository-convergence-report.json` — Target-local repository boundary report is mechanically invalidated by the admitted standalone sync.

## Steps

- [x] **Record Task risk and detail before editing** (implementation, complete) — Confirm whether Task risk is light, standard, or high-impact. Keep the active Task current, use a Plan only for multi-Task direction, add a Decision for durable choices, and add or update a Finding for structural gaps.
- [x] **Review the current pattern in unisane-ui** (implementation, complete) — Use the compact references to confirm the current scope, command surface, and docs entrypoints before editing code.
- [x] **Implement the smallest scoped change** (implementation, complete) — Carry out "Sync admitted UI source and tooling from umbrella f80842247 into the standalone checkout" inside the resolved scope before widening impact to adjacent areas.
- [x] **Sync docs and instruction surfaces if touched** (docs, complete) — Keep docs, instruction mirrors, and generated project knowledge aligned with the implementation.

## Actions And Guards

- No Action or Guard is selected.

## Evidence And Readiness

- Only current unisane-ui-owned package, application-source, and repository-tooling changes since the immutable extraction freeze are synchronized while standalone provenance and target-only foundation remain intact. (closure, agent-observation)
- All target packages build, test, and typecheck using only repository-local dependencies. (closure, agent-observation)
- The packed-producer certificate runs from the standalone checkout with an offline clean external consumer and no sibling, workspace, file, link, or portal fallback. (closure, agent-observation)

## Memory Obligations

- [complete] architecture: High-impact work must review and synchronize the existing architecture Memory for Scope workspace. (target: `docs/architecture/design-system.md`); resolution: reviewed-no-change

## Portable Task State

This machine-readable block is the durable source used to rebuild local Skopos state.

<!-- skopos:task-state:start -->
```json
{
  "schemaVersion": 1,
  "id": "T-f788a1a9",
  "type": "task",
  "status": "durable",
  "generatedAt": "2026-08-12T09:29:37.067Z",
  "updatedAt": "2026-08-12T12:25:51.339Z",
  "planIds": [],
  "childTasks": [],
  "state": "complete",
  "detail": "detailed",
  "title": "Sync admitted UI source and tooling from umbrella f80842247 into the standalone checkout",
  "goal": "Sync admitted UI source and tooling from umbrella f80842247 into the standalone checkout",
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
      "Only current unisane-ui-owned package, application-source, and repository-tooling changes since the immutable extraction freeze are synchronized while standalone provenance and target-only foundation remain intact.",
      "All target packages build, test, and typecheck using only repository-local dependencies.",
      "The packed-producer certificate runs from the standalone checkout with an offline clean external consumer and no sibling, workspace, file, link, or portal fallback."
    ],
    "nonGoals": [
      "Do not copy umbrella Tasks or umbrella-only docs, create remotes, push, access a registry, publish, decide licenses, or flip authority."
    ],
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
      "Declared ownership spans 18 paths."
    ],
    "signals": {
      "goalSignals": [],
      "ownedPathCount": 18,
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
    "baselineId": "baseline-c3e744dda4fa684a"
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
      "detail": "Carry out \"Sync admitted UI source and tooling from umbrella f80842247 into the standalone checkout\" inside the resolved scope before widening impact to adjacent areas.",
      "status": "complete"
    },
    {
      "id": "step-sync-knowledge",
      "kind": "docs",
      "title": "Sync docs and instruction surfaces if touched",
      "detail": "Keep docs, instruction mirrors, and generated project knowledge aligned with the implementation.",
      "status": "complete"
    }
  ],
  "selectedActions": [],
  "selectedGuardIds": [],
  "evidenceRequirements": [
    {
      "id": "acceptance-1",
      "acceptanceCriterion": "Only current unisane-ui-owned package, application-source, and repository-tooling changes since the immutable extraction freeze are synchronized while standalone provenance and target-only foundation remain intact.",
      "phase": "closure",
      "actionIds": [],
      "guardIds": [],
      "evidence": "agent-observation"
    },
    {
      "id": "acceptance-2",
      "acceptanceCriterion": "All target packages build, test, and typecheck using only repository-local dependencies.",
      "phase": "closure",
      "actionIds": [],
      "guardIds": [],
      "evidence": "agent-observation"
    },
    {
      "id": "acceptance-3",
      "acceptanceCriterion": "The packed-producer certificate runs from the standalone checkout with an offline clean external consumer and no sibling, workspace, file, link, or portal fallback.",
      "phase": "closure",
      "actionIds": [],
      "guardIds": [],
      "evidence": "agent-observation"
    }
  ],
  "memoryObligations": [
    {
      "id": "memory-architecture-d58f039fa4",
      "role": "architecture",
      "reason": "High-impact work must review and synchronize the existing architecture Memory for Scope workspace.",
      "status": "complete",
      "targetPath": "docs/architecture/design-system.md",
      "resolution": "reviewed-no-change",
      "resolutionReason": "Reviewed docs/architecture/design-system.md; package boundaries and design-system architecture remain unchanged by the standalone dependency-resolution portability fix.",
      "resolvedAt": "2026-08-12T12:24:25.032Z",
      "resolvedByActorId": "codex-ui-standalone-sync"
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
      "command": "skopos start 'Continue Sync admitted UI source and tooling from umbrella f80842247 into the standalone checkout as bounded follow-up work' . --scope 'workspace' --own 'docs/reference/generated/repository-convergence-report.json' --actor 'codex-ui-standalone-sync'",
      "ownedPaths": [
        "docs/reference/generated/repository-convergence-report.json"
      ],
      "scopeId": "workspace",
      "reason": "The Task may be drifting from its admitted subject because new impact categories appeared (docs).",
      "blocking": false,
      "status": "open"
    }
  ],
  "ownershipExpansions": [
    {
      "paths": [
        "docs/reference/generated/repository-convergence-report.json"
      ],
      "reason": "Target-local repository boundary report is mechanically invalidated by the admitted standalone sync.",
      "actorId": "codex-ui-standalone-sync",
      "recordedAt": "2026-08-12T09:42:00.502Z",
      "baselinePaths": [
        {
          "path": "docs/reference/generated/repository-convergence-report.json",
          "digest": "69ed52f61af6ad324f6a0895758d7aa9bfa47ffe949bfa140f2aa76ae9a4606a"
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
    ".prettierignore",
    "apps/docs/app/(app-shell)/docs/data-table/responsiveness/page.tsx",
    "apps/docs/lib/docs/runtime/navigation.ts",
    "docs/reference/generated/repository-convergence-report.json",
    "package.json",
    "packages/data-table/docs/RESPONSIVENESS.md",
    "packages/data-table/package.json",
    "packages/email-templates/certificates/packed-producer-certificate.json",
    "packages/email-templates/package.json",
    "packages/ui-cli",
    "pnpm-lock.yaml",
    "prettier.config.mjs",
    "scripts/__tests__/verify-email-templates-packed-producer-certificate.test.mjs",
    "scripts/__tests__/verify-packed-producer-certificate.test.mjs",
    "scripts/check-package-contents.mjs",
    "scripts/check-repository-boundaries.mjs",
    "scripts/verify-email-templates-packed-producer-certificate.mjs",
    "scripts/verify-packed-producer-certificate.mjs",
    "turbo.json"
  ]
}
```
<!-- skopos:task-state:end -->
