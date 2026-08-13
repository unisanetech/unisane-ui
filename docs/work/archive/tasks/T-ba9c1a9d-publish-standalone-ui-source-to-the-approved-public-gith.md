---
title: "Task: Publish standalone UI source to the approved public GitHub repository"
status: complete
owner: "codex"
id: T-ba9c1a9d
scope: "workspace"
role: task
lifecycle: historical
authority: canonical
provenance: accepted
view: exception
risk: high-impact
proofSubject: task-closure
proofBaseline: baseline-05cf6300fbb06364
lastUpdated: 2026-08-13
---

# Task: Publish standalone UI source to the approved public GitHub repository

## Changelog

- `2026-08-13`: Synchronized Task state `complete` from Skopos.

## Goal

Publish standalone UI source to the approved public GitHub repository

## Acceptance

- All canonical repository metadata names https://github.com/unisanetech/unisane-ui.git.
- A manually dispatched GitHub-hosted prerelease workflow proves the approved packages and publishes only with explicit npm credentials and provenance.
- Focused boundary, release-readiness, packed-producer, and generated-ledger checks pass from the committed source.
- The verified standalone main is pushed to the new public unisanetech/unisane-ui repository without publishing npm packages.

## Non-Goals

- None declared.

## Constraints

- Do not publish any npm package or configure registry credentials in this Task.
- Do not add migration aliases, fallback repository identities, remotes to sibling repositories, or unrelated product changes.

## Admission And Workflow

- Workflow: `strict`
- Selected risk/detail: `high-impact` / `detailed`
- Recommended risk/detail: `high-impact` / `detailed`
- Selection source: `explicit-override`
- Reason: Declared ownership spans 13 paths.

## Owned Paths

- `.github/workflows/publish-prerelease.yml`
- `docs/guides/licensing-prerequisites.md`
- `docs/reference/generated/repository-convergence-report.json`
- `package.json`
- `packages/data-table/package.json`
- `packages/email-templates/certificates/packed-producer-certificate.json`
- `packages/email-templates/package.json`
- `packages/tokens/package.json`
- `packages/ui-cli/package.json`
- `packages/ui/package.json`
- `scripts/__tests__/verify-email-templates-packed-producer-certificate.test.mjs`
- `scripts/check-release-readiness.mjs`
- `scripts/verify-email-templates-packed-producer-certificate.mjs`

## Ownership Expansions

- None recorded.

## Steps

- [x] **Record Task risk and detail before editing** (implementation, complete) — Confirm whether Task risk is light, standard, or high-impact. Keep the active Task current, use a Plan only for multi-Task direction, add a Decision for durable choices, and add or update a Finding for structural gaps.
- [x] **Review the current pattern in unisane-ui** (implementation, complete) — Use the compact references to confirm the current scope, command surface, and docs entrypoints before editing code.
- [x] **Implement the smallest scoped change** (implementation, complete) — Carry out "Publish standalone UI source to the approved public GitHub repository" inside the resolved scope before widening impact to adjacent areas.
- [x] **Sync docs and instruction surfaces if touched** (docs, complete) — Keep docs, instruction mirrors, and generated project knowledge aligned with the implementation.

## Actions And Guards

- No Action or Guard is selected.

## Evidence And Readiness

- All canonical repository metadata names https://github.com/unisanetech/unisane-ui.git. (closure, agent-observation)
- A manually dispatched GitHub-hosted prerelease workflow proves the approved packages and publishes only with explicit npm credentials and provenance. (closure, agent-observation)
- Focused boundary, release-readiness, packed-producer, and generated-ledger checks pass from the committed source. (closure, agent-observation)
- The verified standalone main is pushed to the new public unisanetech/unisane-ui repository without publishing npm packages. (closure, agent-observation)

## Memory Obligations

- [complete] guide: The declared Task scope owns canonical guide Memory at docs/guides/licensing-prerequisites.md; review and synchronize it if project truth changes. (target: `docs/guides/licensing-prerequisites.md`); resolution: memory-updated

## Portable Task State

This machine-readable block is the durable source used to rebuild local Skopos state.

<!-- skopos:task-state:start -->
```json
{
  "schemaVersion": 1,
  "id": "T-ba9c1a9d",
  "type": "task",
  "status": "durable",
  "generatedAt": "2026-08-13T10:34:13.577Z",
  "updatedAt": "2026-08-13T10:49:13.668Z",
  "planIds": [],
  "childTasks": [],
  "state": "complete",
  "detail": "detailed",
  "title": "Publish standalone UI source to the approved public GitHub repository",
  "goal": "Publish standalone UI source to the approved public GitHub repository",
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
      "All canonical repository metadata names https://github.com/unisanetech/unisane-ui.git.",
      "A manually dispatched GitHub-hosted prerelease workflow proves the approved packages and publishes only with explicit npm credentials and provenance.",
      "Focused boundary, release-readiness, packed-producer, and generated-ledger checks pass from the committed source.",
      "The verified standalone main is pushed to the new public unisanetech/unisane-ui repository without publishing npm packages."
    ],
    "nonGoals": [],
    "constraints": [
      "Do not publish any npm package or configure registry credentials in this Task.",
      "Do not add migration aliases, fallback repository identities, remotes to sibling repositories, or unrelated product changes."
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
      "Declared ownership spans 13 paths."
    ],
    "signals": {
      "goalSignals": [],
      "ownedPathCount": 13,
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
    "baselineId": "baseline-05cf6300fbb06364"
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
      "detail": "Carry out \"Publish standalone UI source to the approved public GitHub repository\" inside the resolved scope before widening impact to adjacent areas.",
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
      "acceptanceCriterion": "All canonical repository metadata names https://github.com/unisanetech/unisane-ui.git.",
      "phase": "closure",
      "actionIds": [],
      "guardIds": [],
      "evidence": "agent-observation"
    },
    {
      "id": "acceptance-2",
      "acceptanceCriterion": "A manually dispatched GitHub-hosted prerelease workflow proves the approved packages and publishes only with explicit npm credentials and provenance.",
      "phase": "closure",
      "actionIds": [],
      "guardIds": [],
      "evidence": "agent-observation"
    },
    {
      "id": "acceptance-3",
      "acceptanceCriterion": "Focused boundary, release-readiness, packed-producer, and generated-ledger checks pass from the committed source.",
      "phase": "closure",
      "actionIds": [],
      "guardIds": [],
      "evidence": "agent-observation"
    },
    {
      "id": "acceptance-4",
      "acceptanceCriterion": "The verified standalone main is pushed to the new public unisanetech/unisane-ui repository without publishing npm packages.",
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
      "resolutionReason": "Updated the canonical guide with the approved public source repository, manual provenance workflow, and separate npm publication boundary.",
      "resolvedAt": "2026-08-13T10:39:23.390Z",
      "resolvedByActorId": "codex"
    }
  ],
  "questions": [],
  "recommendations": [],
  "declaredOwnedPaths": [
    ".github/workflows/publish-prerelease.yml",
    "docs/guides/licensing-prerequisites.md",
    "docs/reference/generated/repository-convergence-report.json",
    "package.json",
    "packages/data-table/package.json",
    "packages/email-templates/certificates/packed-producer-certificate.json",
    "packages/email-templates/package.json",
    "packages/tokens/package.json",
    "packages/ui-cli/package.json",
    "packages/ui/package.json",
    "scripts/__tests__/verify-email-templates-packed-producer-certificate.test.mjs",
    "scripts/check-release-readiness.mjs",
    "scripts/verify-email-templates-packed-producer-certificate.mjs"
  ]
}
```
<!-- skopos:task-state:end -->
