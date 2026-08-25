---
title: "Task: Complete the registry-first UI CLI cutover with standard project configuration, automatic dependency installation, and clean Next/Vite adoption proof"
status: complete
owner: "bhaskarbarma"
id: T-2e1ac8d7
scope: "workspace"
role: task
lifecycle: historical
authority: canonical
provenance: accepted
view: exception
risk: high-impact
proofSubject: task-closure
proofBaseline: baseline-cc61042136efc26a
lastUpdated: 2026-08-13
---

# Task: Complete the registry-first UI CLI cutover with standard project configuration, automatic dependency installation, and clean Next/Vite adoption proof

## Changelog

- `2026-08-13`: Synchronized Task state `complete` from Skopos.

## Goal

Complete the registry-first UI CLI cutover with standard project configuration, automatic dependency installation, and clean Next/Vite adoption proof

## Acceptance

- init and add detect the package manager, install exact required dependencies, and leave no partial writes on failure
- components.json is the sole installation-routing configuration and the obsolete unisane-ui.json path is removed
- registry list, search, view, diff, and add resolve one generated dependency-closed catalog
- clean Next.js, Vite, and monorepo fixtures pass init, add, typecheck, build, repetition, and overwrite safety
- registry consumers retain no @unisane/ui, @unisane/tokens, CLI, Framework Core, sibling, or fallback runtime dependency

## Non-Goals

- Do not deploy DNS, publish the stable latest tag, or mutate external registry state in this implementation Task

## Constraints

- Use one canonical generator-owned registry and delete obsolete configuration or compatibility paths

## Admission And Workflow

- Workflow: `strict`
- Selected risk/detail: `high-impact` / `detailed`
- Recommended risk/detail: `high-impact` / `detailed`
- Selection source: `explicit-override`
- Reason: Declared ownership spans 12 paths.

## Owned Paths

- `README.md`
- `docs/architecture/design-system.md`
- `docs/reference/generated/repository-convergence-report.json`
- `docs/standards/component-authoring.md`
- `packages/ui-cli/README.md`
- `packages/ui-cli/package.json`
- `packages/ui-cli/scripts`
- `packages/ui-cli/src`
- `packages/ui-cli/tests`
- `packages/ui/registry`
- `packages/ui/scripts`
- `scripts/check-repository-boundaries.mjs`

## Ownership Expansions

- None recorded.

## Steps

- [x] **Record Task risk and detail before editing** (implementation, complete) — Confirm whether Task risk is light, standard, or high-impact. Keep the active Task current, use a Plan only for multi-Task direction, add a Decision for durable choices, and add or update a Finding for structural gaps.
- [x] **Review the current pattern in unisane-ui** (implementation, complete) — Use the compact references to confirm the current scope, command surface, and docs entrypoints before editing code.
- [x] **Implement the smallest scoped change** (implementation, complete) — Carry out "Complete the registry-first UI CLI cutover with standard project configuration, automatic dependency installation, and clean Next/Vite adoption proof" inside the resolved scope before widening impact to adjacent areas.
- [x] **Sync docs and instruction surfaces if touched** (docs, complete) — Keep docs, instruction mirrors, and generated project knowledge aligned with the implementation.

## Actions And Guards

- No Action or Guard is selected.

## Evidence And Readiness

- init and add detect the package manager, install exact required dependencies, and leave no partial writes on failure (closure, agent-observation)
- components.json is the sole installation-routing configuration and the obsolete unisane-ui.json path is removed (closure, agent-observation)
- registry list, search, view, diff, and add resolve one generated dependency-closed catalog (closure, agent-observation)
- clean Next.js, Vite, and monorepo fixtures pass init, add, typecheck, build, repetition, and overwrite safety (closure, agent-observation)
- registry consumers retain no @unisane/ui, @unisane/tokens, CLI, Framework Core, sibling, or fallback runtime dependency (closure, agent-observation)

## Memory Obligations

- [complete] architecture: The declared Task scope owns canonical architecture Memory at docs/architecture/design-system.md; review and synchronize it if project truth changes. (target: `docs/architecture/design-system.md`); resolution: memory-updated
- [complete] standard: The declared Task scope owns canonical standard Memory at docs/standards/component-authoring.md; review and synchronize it if project truth changes. (target: `docs/standards/component-authoring.md`); resolution: memory-updated

## Portable Task State

This machine-readable block is the durable source used to rebuild local Skopos state.

<!-- skopos:task-state:start -->
```json
{
  "schemaVersion": 1,
  "id": "T-2e1ac8d7",
  "type": "task",
  "status": "durable",
  "generatedAt": "2026-08-13T15:13:49.982Z",
  "updatedAt": "2026-08-13T15:39:21.445Z",
  "planIds": [],
  "childTasks": [],
  "state": "complete",
  "detail": "detailed",
  "title": "Complete the registry-first UI CLI cutover with standard project configuration, automatic dependency installation, and clean Next/Vite adoption proof",
  "goal": "Complete the registry-first UI CLI cutover with standard project configuration, automatic dependency installation, and clean Next/Vite adoption proof",
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
      "init and add detect the package manager, install exact required dependencies, and leave no partial writes on failure",
      "components.json is the sole installation-routing configuration and the obsolete unisane-ui.json path is removed",
      "registry list, search, view, diff, and add resolve one generated dependency-closed catalog",
      "clean Next.js, Vite, and monorepo fixtures pass init, add, typecheck, build, repetition, and overwrite safety",
      "registry consumers retain no @unisane/ui, @unisane/tokens, CLI, Framework Core, sibling, or fallback runtime dependency"
    ],
    "nonGoals": [
      "Do not deploy DNS, publish the stable latest tag, or mutate external registry state in this implementation Task"
    ],
    "constraints": [
      "Use one canonical generator-owned registry and delete obsolete configuration or compatibility paths"
    ]
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
      "Declared ownership spans 12 paths."
    ],
    "signals": {
      "goalSignals": [],
      "ownedPathCount": 12,
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
    "baselineId": "baseline-cc61042136efc26a"
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
      "detail": "Carry out \"Complete the registry-first UI CLI cutover with standard project configuration, automatic dependency installation, and clean Next/Vite adoption proof\" inside the resolved scope before widening impact to adjacent areas.",
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
      "acceptanceCriterion": "init and add detect the package manager, install exact required dependencies, and leave no partial writes on failure",
      "phase": "closure",
      "actionIds": [],
      "guardIds": [],
      "evidence": "agent-observation"
    },
    {
      "id": "acceptance-2",
      "acceptanceCriterion": "components.json is the sole installation-routing configuration and the obsolete unisane-ui.json path is removed",
      "phase": "closure",
      "actionIds": [],
      "guardIds": [],
      "evidence": "agent-observation"
    },
    {
      "id": "acceptance-3",
      "acceptanceCriterion": "registry list, search, view, diff, and add resolve one generated dependency-closed catalog",
      "phase": "closure",
      "actionIds": [],
      "guardIds": [],
      "evidence": "agent-observation"
    },
    {
      "id": "acceptance-4",
      "acceptanceCriterion": "clean Next.js, Vite, and monorepo fixtures pass init, add, typecheck, build, repetition, and overwrite safety",
      "phase": "closure",
      "actionIds": [],
      "guardIds": [],
      "evidence": "agent-observation"
    },
    {
      "id": "acceptance-5",
      "acceptanceCriterion": "registry consumers retain no @unisane/ui, @unisane/tokens, CLI, Framework Core, sibling, or fallback runtime dependency",
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
      "reason": "The declared Task scope owns canonical architecture Memory at docs/architecture/design-system.md; review and synchronize it if project truth changes.",
      "status": "complete",
      "targetPath": "docs/architecture/design-system.md",
      "resolution": "memory-updated",
      "resolutionReason": "Documented the single generated Shadcn-compatible catalog, components.json authority, package-manager installation, rollback, and overwrite contract.",
      "resolvedAt": "2026-08-13T15:37:07.803Z",
      "resolvedByActorId": "bhaskarbarma"
    },
    {
      "id": "memory-standard-9bcdfc879d",
      "role": "standard",
      "reason": "The declared Task scope owns canonical standard Memory at docs/standards/component-authoring.md; review and synchronize it if project truth changes.",
      "status": "complete",
      "targetPath": "docs/standards/component-authoring.md",
      "resolution": "memory-updated",
      "resolutionReason": "Added canonical registry item, file target, dependency closure, no-runtime-fallback, generated-owner, and components.json authoring rules.",
      "resolvedAt": "2026-08-13T15:37:07.581Z",
      "resolvedByActorId": "bhaskarbarma"
    }
  ],
  "questions": [],
  "recommendations": [],
  "declaredOwnedPaths": [
    "README.md",
    "docs/architecture/design-system.md",
    "docs/reference/generated/repository-convergence-report.json",
    "docs/standards/component-authoring.md",
    "packages/ui-cli/README.md",
    "packages/ui-cli/package.json",
    "packages/ui-cli/scripts",
    "packages/ui-cli/src",
    "packages/ui-cli/tests",
    "packages/ui/registry",
    "packages/ui/scripts",
    "scripts/check-repository-boundaries.mjs"
  ]
}
```
<!-- skopos:task-state:end -->
