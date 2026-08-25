---
title: "Task: Make the frozen packed-consumer lock portable across build platforms"
status: complete
owner: "bhaskarbarma"
id: T-ba567992
scope: "workspace"
role: task
lifecycle: historical
authority: canonical
provenance: accepted
view: exception
risk: high-impact
proofSubject: task-closure
proofBaseline: baseline-0c643796a62d081f
lastUpdated: 2026-08-13
---

# Task: Make the frozen packed-consumer lock portable across build platforms

## Changelog

- `2026-08-13`: Synchronized Task state `complete` from Skopos.

## Goal

Make the frozen packed-consumer lock portable across build platforms

## Acceptance

- Locally generated package tarballs are not pinned to host-specific archive integrity in the frozen consumer lock
- All registry-resolved packages retain integrity pins and frozen offline installation
- Packed-producer fixtures and full clean-consumer proof pass
- The standalone boundary report and release readiness remain current

## Non-Goals

- None declared.

## Constraints

- Do not change package source, package versions, publication scope, or registry authority

## Admission And Workflow

- Workflow: `strict`
- Selected risk/detail: `high-impact` / `detailed`
- Recommended risk/detail: `standard` / `standard`
- Selection source: `explicit-override`
- Reason: The work changes multiple paths, durable guidance, configuration, or a normal coordinated surface.
- Reason: The caller explicitly selected high-impact; Skopos recommended standard and kept both values visible.

## Owned Paths

- `docs/reference/generated/repository-convergence-report.json`
- `scripts/__tests__/verify-packed-producer-certificate.test.mjs`
- `scripts/fixtures/packed-producer-consumer/pnpm-lock.yaml`
- `scripts/verify-packed-producer-certificate.mjs`

## Ownership Expansions

- None recorded.

## Steps

- [x] **Record Task risk and detail before editing** (implementation, complete) — Confirm whether Task risk is light, standard, or high-impact. Keep the active Task current, use a Plan only for multi-Task direction, add a Decision for durable choices, and add or update a Finding for structural gaps.
- [x] **Review the current pattern in unisane-ui** (implementation, complete) — Use the compact references to confirm the current scope, command surface, and docs entrypoints before editing code.
- [x] **Implement the smallest scoped change** (implementation, complete) — Carry out "Make the frozen packed-consumer lock portable across build platforms" inside the resolved scope before widening impact to adjacent areas.
- [x] **Sync docs and instruction surfaces if touched** (docs, complete) — Keep docs, instruction mirrors, and generated project knowledge aligned with the implementation.

## Actions And Guards

- No Action or Guard is selected.

## Evidence And Readiness

- Locally generated package tarballs are not pinned to host-specific archive integrity in the frozen consumer lock (closure, agent-observation)
- All registry-resolved packages retain integrity pins and frozen offline installation (closure, agent-observation)
- Packed-producer fixtures and full clean-consumer proof pass (closure, agent-observation)
- The standalone boundary report and release readiness remain current (closure, agent-observation)

## Memory Obligations

- [complete] architecture: High-impact work must review and synchronize the existing architecture Memory for Scope workspace. (target: `docs/architecture/design-system.md`); resolution: reviewed-no-change

## Portable Task State

This machine-readable block is the durable source used to rebuild local Skopos state.

<!-- skopos:task-state:start -->
```json
{
  "schemaVersion": 1,
  "id": "T-ba567992",
  "type": "task",
  "status": "durable",
  "generatedAt": "2026-08-13T13:58:54.015Z",
  "updatedAt": "2026-08-13T14:02:38.005Z",
  "planIds": [],
  "childTasks": [],
  "state": "complete",
  "detail": "detailed",
  "title": "Make the frozen packed-consumer lock portable across build platforms",
  "goal": "Make the frozen packed-consumer lock portable across build platforms",
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
      "Locally generated package tarballs are not pinned to host-specific archive integrity in the frozen consumer lock",
      "All registry-resolved packages retain integrity pins and frozen offline installation",
      "Packed-producer fixtures and full clean-consumer proof pass",
      "The standalone boundary report and release readiness remain current"
    ],
    "nonGoals": [],
    "constraints": [
      "Do not change package source, package versions, publication scope, or registry authority"
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
      "ownedPathCount": 4,
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
    "baselineId": "baseline-0c643796a62d081f"
  },
  "priority": 0,
  "dependencyTaskIds": [
    "T-e604babd"
  ],
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
      "detail": "Carry out \"Make the frozen packed-consumer lock portable across build platforms\" inside the resolved scope before widening impact to adjacent areas.",
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
      "acceptanceCriterion": "Locally generated package tarballs are not pinned to host-specific archive integrity in the frozen consumer lock",
      "phase": "closure",
      "actionIds": [],
      "guardIds": [],
      "evidence": "agent-observation"
    },
    {
      "id": "acceptance-2",
      "acceptanceCriterion": "All registry-resolved packages retain integrity pins and frozen offline installation",
      "phase": "closure",
      "actionIds": [],
      "guardIds": [],
      "evidence": "agent-observation"
    },
    {
      "id": "acceptance-3",
      "acceptanceCriterion": "Packed-producer fixtures and full clean-consumer proof pass",
      "phase": "closure",
      "actionIds": [],
      "guardIds": [],
      "evidence": "agent-observation"
    },
    {
      "id": "acceptance-4",
      "acceptanceCriterion": "The standalone boundary report and release readiness remain current",
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
      "resolutionReason": "The change affects release-proof portability only; the registry-first design-system distribution contract is unchanged.",
      "resolvedAt": "2026-08-13T13:59:27.991Z",
      "resolvedByActorId": "bhaskarbarma"
    }
  ],
  "questions": [],
  "recommendations": [],
  "declaredOwnedPaths": [
    "docs/reference/generated/repository-convergence-report.json",
    "scripts/__tests__/verify-packed-producer-certificate.test.mjs",
    "scripts/fixtures/packed-producer-consumer/pnpm-lock.yaml",
    "scripts/verify-packed-producer-certificate.mjs"
  ]
}
```
<!-- skopos:task-state:end -->
