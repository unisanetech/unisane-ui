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
proofBaseline: baseline-9a989167c0db9399
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
- `docs/guides/licensing-prerequisites.md`
- `docs/reference/generated/repository-convergence-report.json`
- `docs/release-approval.json`
- `package.json`
- `packages/data-table/package.json`
- `packages/email-templates/certificates/packed-producer-certificate.json`
- `packages/email-templates/package.json`
- `packages/tokens/package.json`
- `packages/ui-cli/pack.manifest.json`
- `packages/ui-cli/package.json`
- `packages/ui/package.json`
- `pnpm-lock.yaml`
- `scripts/__tests__`
- `scripts/check-package-contents.mjs`
- `scripts/check-release-readiness.mjs`
- `scripts/check-repository-boundaries.mjs`
- `scripts/fixtures/packed-producer-consumer`
- `scripts/verify-email-templates-packed-producer-certificate.mjs`
- `scripts/verify-packed-producer-certificate.mjs`

## Ownership Expansions

- `2026-08-13T20:19:42.779Z` by `bhaskarbarma`: `scripts/check-package-contents.mjs` — The new exported CLI components schema is correctly packed, but the existing package-content owner omitted that declared root and fails CI.

## Steps

- [x] **Record Task risk and detail before editing** (implementation, complete) — Confirm whether Task risk is light, standard, or high-impact. Keep the active Task current, use a Plan only for multi-Task direction, add a Decision for durable choices, and add or update a Finding for structural gaps.
- [x] **Review the current pattern in unisane-ui** (implementation, complete) — Use the compact references to confirm the current scope, command surface, and docs entrypoints before editing code.
- [ ] **Implement the smallest scoped change** (implementation, pending) — Carry out "Publish the stable Unisane UI 0.1.0 package family" inside the resolved scope before widening impact to adjacent areas.
- [ ] **Sync docs and instruction surfaces if touched** (docs, pending) — Keep docs, instruction mirrors, and generated project knowledge aligned with the implementation.

## Actions And Guards

- No Action or Guard is selected.

## Evidence And Readiness

- the generated repository boundary report is current and GitHub main CI passes (closure, agent-observation)
- exactly the five approved Unisane UI packages use version 0.1.0 and provenance-enabled latest publication (closure, agent-observation)
- a clean external consumer installs and exercises the stable CLI and runtime package without workspace or sibling fallback (closure, agent-observation)
- npm latest resolves to 0.1.0 while the existing next prerelease remains available (closure, agent-observation)
- ui.unisane.com and its Shadcn-compatible registry endpoints remain healthy (closure, agent-observation)

## Memory Obligations

- [open] guide: The declared Task scope owns canonical guide Memory at docs/guides/licensing-prerequisites.md; review and synchronize it if project truth changes. (target: `docs/guides/licensing-prerequisites.md`)

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
  "updatedAt": "2026-08-13T20:19:42.779Z",
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
    "baselineId": "baseline-9a989167c0db9399"
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
      "status": "pending"
    },
    {
      "id": "step-sync-knowledge",
      "kind": "docs",
      "title": "Sync docs and instruction surfaces if touched",
      "detail": "Keep docs, instruction mirrors, and generated project knowledge aligned with the implementation.",
      "status": "pending"
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
      "status": "open",
      "targetPath": "docs/guides/licensing-prerequisites.md"
    }
  ],
  "questions": [],
  "recommendations": [],
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
    }
  ],
  "declaredOwnedPaths": [
    ".github/workflows/publish-prerelease.yml",
    ".github/workflows/publish-release.yml",
    "docs/guides/licensing-prerequisites.md",
    "docs/reference/generated/repository-convergence-report.json",
    "docs/release-approval.json",
    "package.json",
    "packages/data-table/package.json",
    "packages/email-templates/certificates/packed-producer-certificate.json",
    "packages/email-templates/package.json",
    "packages/tokens/package.json",
    "packages/ui-cli/pack.manifest.json",
    "packages/ui-cli/package.json",
    "packages/ui/package.json",
    "pnpm-lock.yaml",
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
