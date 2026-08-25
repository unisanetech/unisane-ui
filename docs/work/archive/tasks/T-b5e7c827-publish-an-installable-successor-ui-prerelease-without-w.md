---
title: "Task: Publish an installable successor UI prerelease without workspace protocol leakage"
status: complete
owner: "bhaskarbarma"
id: T-b5e7c827
scope: "workspace"
role: task
lifecycle: historical
authority: canonical
provenance: accepted
view: exception
risk: high-impact
proofSubject: task-closure
proofBaseline: baseline-7820593fb7d711c2
lastUpdated: 2026-08-13
---

# Task: Publish an installable successor UI prerelease without workspace protocol leakage

## Changelog

- `2026-08-13`: Synchronized Task state `complete` from Skopos.

## Goal

Publish an installable successor UI prerelease without workspace protocol leakage

## Acceptance

- Every published package uses one immutable successor prerelease version and the next tag
- The publication path transforms workspace protocols into exact registry coordinates before upload
- Clean anonymous installs of UI, DataTable, and the registry CLI pass
- Release, packed-consumer, email, package-content, and boundary gates pass

## Non-Goals

- None declared.

## Constraints

- Do not publish an unscoped unisane package or couple UI runtime to Framework core

## Admission And Workflow

- Workflow: `strict`
- Selected risk/detail: `high-impact` / `detailed`
- Recommended risk/detail: `high-impact` / `detailed`
- Selection source: `explicit-override`
- Reason: The goal contains high-impact signal: release.

## Owned Paths

- `.github/workflows/publish-prerelease.yml`
- `docs/guides/licensing-prerequisites.md`
- `docs/reference/generated/repository-convergence-report.json`
- `docs/release-approval.json`
- `packages/data-table/package.json`
- `packages/email-templates/certificates/packed-producer-certificate.json`
- `packages/email-templates/package.json`
- `packages/tokens/package.json`
- `packages/ui-cli/pack.manifest.json`
- `packages/ui-cli/package.json`
- `packages/ui/package.json`
- `scripts/__tests__/verify-email-templates-packed-producer-certificate.test.mjs`
- `scripts/__tests__/verify-packed-producer-certificate.test.mjs`
- `scripts/check-release-readiness.mjs`
- `scripts/check-repository-boundaries.mjs`
- `scripts/fixtures/packed-producer-consumer/pnpm-lock.yaml`
- `scripts/verify-email-templates-packed-producer-certificate.mjs`
- `scripts/verify-packed-producer-certificate.mjs`

## Ownership Expansions

- None recorded.

## Steps

- [x] **Should this plan change a public contract, route, or SDK surface?** (decision, complete) — Public-facing changes need explicit confirmation so the agent does not silently ship a breaking contract.
- [x] **Resolve plan decisions** (implementation, complete) — Answer the recommended ask-back questions before implementation so the agent does not guess on high-impact choices.
- [x] **Record Task risk and detail before editing** (implementation, complete) — Confirm whether Task risk is light, standard, or high-impact. Keep the active Task current, use a Plan only for multi-Task direction, add a Decision for durable choices, and add or update a Finding for structural gaps.
- [x] **Review the current pattern in unisane-ui** (implementation, complete) — Use the compact references to confirm the current scope, command surface, and docs entrypoints before editing code.
- [x] **Implement the smallest scoped change** (implementation, complete) — Carry out "Publish an installable successor UI prerelease without workspace protocol leakage" inside the resolved scope before widening impact to adjacent areas.
- [x] **Sync docs and instruction surfaces if touched** (docs, complete) — Keep docs, instruction mirrors, and generated project knowledge aligned with the implementation.

## Actions And Guards

- No Action or Guard is selected.

## Evidence And Readiness

- Every published package uses one immutable successor prerelease version and the next tag (closure, agent-observation)
- The publication path transforms workspace protocols into exact registry coordinates before upload (closure, agent-observation)
- Clean anonymous installs of UI, DataTable, and the registry CLI pass (closure, agent-observation)
- Release, packed-consumer, email, package-content, and boundary gates pass (closure, agent-observation)

## Memory Obligations

- [complete] guide: The declared Task scope owns canonical guide Memory at docs/guides/licensing-prerequisites.md; review and synchronize it if project truth changes. (target: `docs/guides/licensing-prerequisites.md`); resolution: memory-updated

## Portable Task State

This machine-readable block is the durable source used to rebuild local Skopos state.

<!-- skopos:task-state:start -->
```json
{
  "schemaVersion": 1,
  "id": "T-b5e7c827",
  "type": "task",
  "status": "durable",
  "generatedAt": "2026-08-13T14:44:34.206Z",
  "updatedAt": "2026-08-13T14:57:14.849Z",
  "planIds": [],
  "childTasks": [],
  "state": "complete",
  "detail": "detailed",
  "title": "Publish an installable successor UI prerelease without workspace protocol leakage",
  "goal": "Publish an installable successor UI prerelease without workspace protocol leakage",
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
      "Every published package uses one immutable successor prerelease version and the next tag",
      "The publication path transforms workspace protocols into exact registry coordinates before upload",
      "Clean anonymous installs of UI, DataTable, and the registry CLI pass",
      "Release, packed-consumer, email, package-content, and boundary gates pass"
    ],
    "nonGoals": [],
    "constraints": [
      "Do not publish an unscoped unisane package or couple UI runtime to Framework core"
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
      "The goal contains high-impact signal: release."
    ],
    "signals": {
      "goalSignals": [
        "release"
      ],
      "ownedPathCount": 18,
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
    "baselineId": "baseline-7820593fb7d711c2"
  },
  "priority": 0,
  "dependencyTaskIds": [
    "T-ba567992"
  ],
  "steps": [
    {
      "id": "decision-plan.public-api-change",
      "kind": "decision",
      "title": "Should this plan change a public contract, route, or SDK surface?",
      "detail": "Public-facing changes need explicit confirmation so the agent does not silently ship a breaking contract.",
      "status": "complete"
    },
    {
      "id": "step-resolve-decisions",
      "kind": "implementation",
      "title": "Resolve plan decisions",
      "detail": "Answer the recommended ask-back questions before implementation so the agent does not guess on high-impact choices.",
      "status": "complete"
    },
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
      "detail": "Carry out \"Publish an installable successor UI prerelease without workspace protocol leakage\" inside the resolved scope before widening impact to adjacent areas.",
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
      "acceptanceCriterion": "Every published package uses one immutable successor prerelease version and the next tag",
      "phase": "closure",
      "actionIds": [],
      "guardIds": [],
      "evidence": "agent-observation"
    },
    {
      "id": "acceptance-2",
      "acceptanceCriterion": "The publication path transforms workspace protocols into exact registry coordinates before upload",
      "phase": "closure",
      "actionIds": [],
      "guardIds": [],
      "evidence": "agent-observation"
    },
    {
      "id": "acceptance-3",
      "acceptanceCriterion": "Clean anonymous installs of UI, DataTable, and the registry CLI pass",
      "phase": "closure",
      "actionIds": [],
      "guardIds": [],
      "evidence": "agent-observation"
    },
    {
      "id": "acceptance-4",
      "acceptanceCriterion": "Release, packed-consumer, email, package-content, and boundary gates pass",
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
      "resolutionReason": "Updated the canonical release guide for the successor version and pnpm publish serialization.",
      "resolvedAt": "2026-08-13T14:51:37.847Z",
      "resolvedByActorId": "bhaskarbarma"
    }
  ],
  "questions": [
    {
      "id": "plan.public-api-change",
      "category": "public-api",
      "escalation": "must-ask",
      "question": "Should this plan change a public contract, route, or SDK surface?",
      "whyItMatters": "Public-facing changes need explicit confirmation so the agent does not silently ship a breaking contract.",
      "recommendedOptionId": "confirm-contract-first",
      "options": [
        {
          "id": "confirm-contract-first",
          "label": "Confirm contract first",
          "rationale": "Recommended because contract decisions should be explicit before implementation starts."
        },
        {
          "id": "no-public-contract-change",
          "label": "No public contract change",
          "rationale": "Use when the wording does not actually change an API, CLI, SDK, schema, or other external contract."
        }
      ],
      "blocking": true,
      "status": "resolved",
      "resolvedOptionId": "no-public-contract-change",
      "resolvedAt": "2026-08-13T14:45:42.951Z",
      "resolvedByActorId": "bhaskarbarma",
      "disposition": {
        "kind": "answered",
        "reason": "Selected Task question option no-public-contract-change.",
        "actorId": "bhaskarbarma",
        "recordedAt": "2026-08-13T14:45:42.951Z",
        "target": {
          "kind": "option",
          "ref": "no-public-contract-change"
        }
      }
    }
  ],
  "recommendations": [
    {
      "id": "resolve-plan.public-api-change",
      "title": "Resolve: Should this plan change a public contract, route, or SDK surface?",
      "summary": "Public-facing changes need explicit confirmation so the agent does not silently ship a breaking contract.",
      "priority": "high",
      "actionKind": "resolve-question",
      "linkedQuestionId": "plan.public-api-change",
      "blocking": true,
      "status": "complete"
    }
  ],
  "declaredOwnedPaths": [
    ".github/workflows/publish-prerelease.yml",
    "docs/guides/licensing-prerequisites.md",
    "docs/reference/generated/repository-convergence-report.json",
    "docs/release-approval.json",
    "packages/data-table/package.json",
    "packages/email-templates/certificates/packed-producer-certificate.json",
    "packages/email-templates/package.json",
    "packages/tokens/package.json",
    "packages/ui-cli/pack.manifest.json",
    "packages/ui-cli/package.json",
    "packages/ui/package.json",
    "scripts/__tests__/verify-email-templates-packed-producer-certificate.test.mjs",
    "scripts/__tests__/verify-packed-producer-certificate.test.mjs",
    "scripts/check-release-readiness.mjs",
    "scripts/check-repository-boundaries.mjs",
    "scripts/fixtures/packed-producer-consumer/pnpm-lock.yaml",
    "scripts/verify-email-templates-packed-producer-certificate.mjs",
    "scripts/verify-packed-producer-certificate.mjs"
  ]
}
```
<!-- skopos:task-state:end -->
