---
title: "Task: Publish the stable Unisane UI 0.1.0 package family"
status: active
owner: "bhaskarbarma"
id: T-ac8a7183
scope: "workspace"
role: task
lifecycle: active
authority: canonical
provenance: accepted
view: current
risk: high-impact
proofSubject: project-integration
proofBaseline: baseline-76d96110c9f76550
lastUpdated: 2026-08-13
---

# Task: Publish the stable Unisane UI 0.1.0 package family

## Changelog

- `2026-08-13`: Synchronized Task state `active` from Skopos.

## Goal

Publish the stable Unisane UI 0.1.0 package family

## Acceptance

- the generated repository boundary report is current and GitHub main CI passes
- exactly the five approved Unisane UI packages use version 0.1.0 and provenance-enabled latest publication
- a clean external consumer installs and exercises the stable CLI and runtime package without workspace or sibling fallback
- npm latest resolves to 0.1.0 while the existing next prerelease remains available
- ui.unisane.com and its Shadcn-compatible registry endpoints remain healthy

## Non-Goals

- Do not publish Unisane Core, Framework, docs application, or any package outside the unisane-ui repository

## Constraints

- Use one GitHub-hosted provenance publication path and do not expose or rotate credentials

## Admission And Workflow

- Workflow: `strict`
- Selected risk/detail: `high-impact` / `detailed`
- Recommended risk/detail: `high-impact` / `detailed`
- Selection source: `proof-subject`
- Reason: Project-integration proof always requires strict high-impact work.

## Owned Paths

- `.github/workflows/publish-prerelease.yml`
- `.github/workflows/publish-release.yml`
- `apps/docs/app/(app-shell)/docs/getting-started`
- `docs/guides/licensing-prerequisites.md`
- `docs/reference/generated/repository-convergence-report.json`
- `docs/release-approval.json`
- `MIGRATION.md`
- `package.json`
- `packages/data-table/package.json`
- `packages/email-templates/certificates/packed-producer-certificate.json`
- `packages/email-templates/package.json`
- `packages/tokens/package.json`
- `packages/ui-cli/pack.manifest.json`
- `packages/ui-cli/package.json`
- `packages/ui-cli/README.md`
- `packages/ui/package.json`
- `pnpm-lock.yaml`
- `README.md`
- `scripts/__tests__`
- `scripts/check-package-contents.mjs`
- `scripts/check-release-readiness.mjs`
- `scripts/check-repository-boundaries.mjs`
- `scripts/fixtures/packed-producer-consumer`
- `scripts/verify-email-templates-packed-producer-certificate.mjs`
- `scripts/verify-packed-producer-certificate.mjs`

## Ownership Expansions

- `2026-08-13T20:19:42.779Z` by `bhaskarbarma`: `scripts/check-package-contents.mjs` — The new exported CLI components schema is correctly packed, but the existing package-content owner omitted that declared root and fails CI.
- `2026-08-13T20:26:59.417Z` by `bhaskarbarma`: `apps/docs/app/(app-shell)/docs/getting-started`, `packages/ui-cli/README.md`, `README.md` — Stable publication changes the canonical public command from @next to @latest in the root, CLI, and live documentation guidance.
- `2026-08-13T20:29:33.906Z` by `bhaskarbarma`: `MIGRATION.md` — Stable publication makes @latest the canonical command in current public migration guidance.

## Steps

- [x] **Record Task risk and detail before editing** (implementation, complete) — Confirm whether Task risk is light, standard, or high-impact. Keep the active Task current, use a Plan only for multi-Task direction, add a Decision for durable choices, and add or update a Finding for structural gaps.
- [x] **Review the current pattern in unisane-ui** (implementation, complete) — Use the compact references to confirm the current scope, command surface, and docs entrypoints before editing code.
- [x] **Implement the smallest scoped change** (implementation, complete) — Carry out "Publish the stable Unisane UI 0.1.0 package family" inside the resolved scope before widening impact to adjacent areas.
- [x] **Sync docs and instruction surfaces if touched** (docs, complete) — Keep docs, instruction mirrors, and generated project knowledge aligned with the implementation.

## Actions And Guards

- No Action or Guard is selected.

## Evidence And Readiness

- the generated repository boundary report is current and GitHub main CI passes (closure, agent-observation)
- exactly the five approved Unisane UI packages use version 0.1.0 and provenance-enabled latest publication (closure, agent-observation)
- a clean external consumer installs and exercises the stable CLI and runtime package without workspace or sibling fallback (closure, agent-observation)
- npm latest resolves to 0.1.0 while the existing next prerelease remains available (closure, agent-observation)
- ui.unisane.com and its Shadcn-compatible registry endpoints remain healthy (closure, agent-observation)

## Memory Obligations

- [complete] guide: The declared Task scope owns canonical guide Memory at docs/guides/licensing-prerequisites.md; review and synchronize it if project truth changes. (target: `docs/guides/licensing-prerequisites.md`); resolution: memory-updated

## Portable Task State

This machine-readable block is the durable source used to rebuild local Skopos state.

<!-- skopos:task-state:start -->
```json
{
  "schemaVersion": 1,
  "id": "T-ac8a7183",
  "type": "task",
  "status": "active",
  "generatedAt": "2026-08-13T20:14:02.977Z",
  "updatedAt": "2026-08-13T20:35:38.827Z",
  "planIds": [],
  "childTasks": [],
  "state": "active",
  "detail": "detailed",
  "title": "Publish the stable Unisane UI 0.1.0 package family",
  "goal": "Publish the stable Unisane UI 0.1.0 package family",
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
      "the generated repository boundary report is current and GitHub main CI passes",
      "exactly the five approved Unisane UI packages use version 0.1.0 and provenance-enabled latest publication",
      "a clean external consumer installs and exercises the stable CLI and runtime package without workspace or sibling fallback",
      "npm latest resolves to 0.1.0 while the existing next prerelease remains available",
      "ui.unisane.com and its Shadcn-compatible registry endpoints remain healthy"
    ],
    "nonGoals": [
      "Do not publish Unisane Core, Framework, docs application, or any package outside the unisane-ui repository"
    ],
    "constraints": [
      "Use one GitHub-hosted provenance publication path and do not expose or rotate credentials"
    ]
  },
  "risk": "high-impact",
  "admission": {
    "recommendedRisk": "high-impact",
    "recommendedDetail": "detailed",
    "selectedRisk": "high-impact",
    "selectedDetail": "detailed",
    "selectionSource": "proof-subject",
    "workflow": "strict",
    "reasons": [
      "Project-integration proof always requires strict high-impact work."
    ],
    "signals": {
      "goalSignals": [],
      "ownedPathCount": 20,
      "affectedScopeIds": [
        "workspace"
      ],
      "impactCategories": [
        "docs",
        "workspace-file"
      ],
      "proofSubjectKind": "project-integration"
    }
  },
  "proofSubject": {
    "kind": "project-integration",
    "baselineId": "baseline-76d96110c9f76550"
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
      "detail": "Carry out \"Publish the stable Unisane UI 0.1.0 package family\" inside the resolved scope before widening impact to adjacent areas.",
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
      "acceptanceCriterion": "the generated repository boundary report is current and GitHub main CI passes",
      "phase": "closure",
      "actionIds": [],
      "guardIds": [],
      "evidence": "agent-observation"
    },
    {
      "id": "acceptance-2",
      "acceptanceCriterion": "exactly the five approved Unisane UI packages use version 0.1.0 and provenance-enabled latest publication",
      "phase": "closure",
      "actionIds": [],
      "guardIds": [],
      "evidence": "agent-observation"
    },
    {
      "id": "acceptance-3",
      "acceptanceCriterion": "a clean external consumer installs and exercises the stable CLI and runtime package without workspace or sibling fallback",
      "phase": "closure",
      "actionIds": [],
      "guardIds": [],
      "evidence": "agent-observation"
    },
    {
      "id": "acceptance-4",
      "acceptanceCriterion": "npm latest resolves to 0.1.0 while the existing next prerelease remains available",
      "phase": "closure",
      "actionIds": [],
      "guardIds": [],
      "evidence": "agent-observation"
    },
    {
      "id": "acceptance-5",
      "acceptanceCriterion": "ui.unisane.com and its Shadcn-compatible registry endpoints remain healthy",
      "phase": "closure",
      "actionIds": [],
      "guardIds": [],
      "evidence": "agent-observation"
    }
  ],
  "memoryObligations": [
    {
      "id": "memory-guide-b57e5c2584",
      "role": "guide",
      "reason": "The declared Task scope owns canonical guide Memory at docs/guides/licensing-prerequisites.md; review and synchronize it if project truth changes.",
      "status": "complete",
      "targetPath": "docs/guides/licensing-prerequisites.md",
      "resolution": "memory-updated",
      "resolutionReason": "Updated the canonical licensing and release guide from prerelease next to stable 0.1.0 latest publication.",
      "resolvedAt": "2026-08-13T20:35:38.105Z",
      "resolvedByActorId": "bhaskarbarma"
    }
  ],
  "questions": [],
  "recommendations": [
    {
      "id": "start-bounded-child-task",
      "title": "Start a bounded child Task",
      "summary": "The Task may be drifting from its admitted subject because ownership expanded 3 times. Keep this Task intact and move the suggested paths into focused follow-up work.",
      "priority": "medium",
      "actionKind": "start-child-task",
      "command": "skopos task child start 'T-ac8a7183' 'Continue Publish the stable Unisane UI 0.1.0 package family as bounded follow-up work' . --scope 'workspace' --own 'apps/docs/app/(app-shell)/docs/getting-started' --own 'MIGRATION.md' --own 'packages/ui-cli/README.md' --own 'README.md' --own 'scripts/check-package-contents.mjs' --reason 'The Task may be drifting from its admitted subject because ownership expanded 3 times.' --actor 'bhaskarbarma'",
      "ownedPaths": [
        "apps/docs/app/(app-shell)/docs/getting-started",
        "MIGRATION.md",
        "packages/ui-cli/README.md",
        "README.md",
        "scripts/check-package-contents.mjs"
      ],
      "scopeId": "workspace",
      "reason": "The Task may be drifting from its admitted subject because ownership expanded 3 times.",
      "blocking": false,
      "status": "open"
    }
  ],
  "ownershipExpansions": [
    {
      "paths": [
        "scripts/check-package-contents.mjs"
      ],
      "reason": "The new exported CLI components schema is correctly packed, but the existing package-content owner omitted that declared root and fails CI.",
      "actorId": "bhaskarbarma",
      "recordedAt": "2026-08-13T20:19:42.779Z",
      "baselinePaths": [
        {
          "path": "scripts/check-package-contents.mjs",
          "digest": "9acf0770bb88a795635b3859b3d503c4dae6a9b3b5f7016c5e50373e8ad8c881"
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
        "apps/docs/app/(app-shell)/docs/getting-started",
        "packages/ui-cli/README.md",
        "README.md"
      ],
      "reason": "Stable publication changes the canonical public command from @next to @latest in the root, CLI, and live documentation guidance.",
      "actorId": "bhaskarbarma",
      "recordedAt": "2026-08-13T20:26:59.417Z",
      "baselinePaths": [
        {
          "path": "README.md",
          "digest": "40b7aa12702ba70e47256ca1fc0abf159c1040104b3734b0bc8cf944564cd516"
        },
        {
          "path": "apps/docs/app/(app-shell)/docs/getting-started",
          "digest": "7312a3be76bfa0944fc33adfe029a9a8e4611f61e87cdac0ef66631ee18116ad"
        },
        {
          "path": "packages/ui-cli/README.md",
          "digest": "01b4c024b8f858a1f8fbbe096828309ef2c6f4bbb463d9b796607438c594eaec"
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
        "MIGRATION.md"
      ],
      "reason": "Stable publication makes @latest the canonical command in current public migration guidance.",
      "actorId": "bhaskarbarma",
      "recordedAt": "2026-08-13T20:29:33.906Z",
      "baselinePaths": [
        {
          "path": "MIGRATION.md",
          "digest": "85a207aff4a56a6b579d919651d613adade84bfdf712b7bd9707b16cb6ae9ba8"
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
    ".github/workflows/publish-prerelease.yml",
    ".github/workflows/publish-release.yml",
    "apps/docs/app/(app-shell)/docs/getting-started",
    "docs/guides/licensing-prerequisites.md",
    "docs/reference/generated/repository-convergence-report.json",
    "docs/release-approval.json",
    "MIGRATION.md",
    "package.json",
    "packages/data-table/package.json",
    "packages/email-templates/certificates/packed-producer-certificate.json",
    "packages/email-templates/package.json",
    "packages/tokens/package.json",
    "packages/ui-cli/pack.manifest.json",
    "packages/ui-cli/package.json",
    "packages/ui-cli/README.md",
    "packages/ui/package.json",
    "pnpm-lock.yaml",
    "README.md",
    "scripts/__tests__",
    "scripts/check-package-contents.mjs",
    "scripts/check-release-readiness.mjs",
    "scripts/check-repository-boundaries.mjs",
    "scripts/fixtures/packed-producer-consumer",
    "scripts/verify-email-templates-packed-producer-certificate.mjs",
    "scripts/verify-packed-producer-certificate.mjs"
  ]
}
```
<!-- skopos:task-state:end -->
