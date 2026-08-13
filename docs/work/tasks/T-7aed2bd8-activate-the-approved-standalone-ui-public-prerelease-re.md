---
title: "Task: Activate the approved standalone UI public prerelease release contract"
status: active
owner: "codex"
id: T-7aed2bd8
scope: "workspace"
role: task
lifecycle: active
authority: canonical
provenance: accepted
view: current
risk: high-impact
proofSubject: task-closure
proofBaseline: baseline-8f3bf95ec680ac8c
lastUpdated: 2026-08-13
---

# Task: Activate the approved standalone UI public prerelease release contract

## Changelog

- `2026-08-13`: Synchronized Task state `active` from Skopos.

## Goal

Activate the approved standalone UI public prerelease release contract

## Acceptance

- The four approved packages are exact MIT public prereleases at 0.1.0-next.b67ebfd0 with provenance-enabled next-tag metadata and LICENSE files in their packed archives.
- Standalone release readiness validates the founder approval and asset provenance while UI CLI and docs remain private.
- Packed external-consumer proofs pass offline with no sibling-source fallback and the standalone boundary report is fresh.

## Non-Goals

- None declared.

## Constraints

- No remote creation, push, authority cutover, credential storage, or publication before authenticated provenance-capable npm execution.

## Admission And Workflow

- Workflow: `strict`
- Selected risk/detail: `high-impact` / `detailed`
- Recommended risk/detail: `high-impact` / `detailed`
- Selection source: `explicit-override`
- Reason: The goal contains high-impact signal: release.

## Owned Paths

- `CONTRIBUTING.md`
- `LICENSE`
- `NOTICE`
- `THIRD_PARTY_NOTICES.md`
- `docs/architecture/package-and-distribution-boundaries.md`
- `docs/asset-provenance.json`
- `docs/guides/licensing-prerequisites.md`
- `docs/reference/generated/repository-convergence-report.json`
- `docs/release-approval.json`
- `package.json`
- `packages/data-table/LICENSE`
- `packages/data-table/README.md`
- `packages/data-table/package.json`
- `packages/email-templates/LICENSE`
- `packages/email-templates/certificates/packed-producer-certificate.json`
- `packages/email-templates/package.json`
- `packages/tokens/LICENSE`
- `packages/tokens/README.md`
- `packages/tokens/package.json`
- `packages/ui/LICENSE`
- `packages/ui/package.json`
- `scripts/__tests__/verify-email-templates-packed-producer-certificate.test.mjs`
- `scripts/__tests__/verify-packed-producer-certificate.test.mjs`
- `scripts/check-package-contents.mjs`
- `scripts/check-release-readiness.mjs`
- `scripts/check-repository-boundaries.mjs`
- `scripts/verify-email-templates-packed-producer-certificate.mjs`
- `scripts/verify-packed-producer-certificate.mjs`

## Ownership Expansions

- None recorded.

## Steps

- [x] **Record Task risk and detail before editing** (implementation, complete) — Confirm whether Task risk is light, standard, or high-impact. Keep the active Task current, use a Plan only for multi-Task direction, add a Decision for durable choices, and add or update a Finding for structural gaps.
- [x] **Review the current pattern in unisane-ui** (implementation, complete) — Use the compact references to confirm the current scope, command surface, and docs entrypoints before editing code.
- [ ] **Implement the smallest scoped change** (implementation, pending) — Carry out "Activate the approved standalone UI public prerelease release contract" inside the resolved scope before widening impact to adjacent areas.
- [ ] **Sync docs and instruction surfaces if touched** (docs, pending) — Keep docs, instruction mirrors, and generated project knowledge aligned with the implementation.

## Actions And Guards

- No Action or Guard is selected.

## Evidence And Readiness

- The four approved packages are exact MIT public prereleases at 0.1.0-next.b67ebfd0 with provenance-enabled next-tag metadata and LICENSE files in their packed archives. (closure, agent-observation)
- Standalone release readiness validates the founder approval and asset provenance while UI CLI and docs remain private. (closure, agent-observation)
- Packed external-consumer proofs pass offline with no sibling-source fallback and the standalone boundary report is fresh. (closure, agent-observation)

## Memory Obligations

- [open] guide: The declared Task scope owns canonical guide Memory at docs/guides/licensing-prerequisites.md; review and synchronize it if project truth changes. (target: `docs/guides/licensing-prerequisites.md`)

## Portable Task State

This machine-readable block is the durable source used to rebuild local Skopos state.

<!-- skopos:task-state:start -->
```json
{
  "schemaVersion": 1,
  "id": "T-7aed2bd8",
  "type": "task",
  "status": "active",
  "generatedAt": "2026-08-13T09:25:44.170Z",
  "updatedAt": "2026-08-13T09:26:06.544Z",
  "planIds": [],
  "childTasks": [],
  "state": "active",
  "detail": "detailed",
  "title": "Activate the approved standalone UI public prerelease release contract",
  "goal": "Activate the approved standalone UI public prerelease release contract",
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
      "The four approved packages are exact MIT public prereleases at 0.1.0-next.b67ebfd0 with provenance-enabled next-tag metadata and LICENSE files in their packed archives.",
      "Standalone release readiness validates the founder approval and asset provenance while UI CLI and docs remain private.",
      "Packed external-consumer proofs pass offline with no sibling-source fallback and the standalone boundary report is fresh."
    ],
    "nonGoals": [],
    "constraints": [
      "No remote creation, push, authority cutover, credential storage, or publication before authenticated provenance-capable npm execution."
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
      "ownedPathCount": 28,
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
    "baselineId": "baseline-8f3bf95ec680ac8c"
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
      "detail": "Carry out \"Activate the approved standalone UI public prerelease release contract\" inside the resolved scope before widening impact to adjacent areas.",
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
      "acceptanceCriterion": "The four approved packages are exact MIT public prereleases at 0.1.0-next.b67ebfd0 with provenance-enabled next-tag metadata and LICENSE files in their packed archives.",
      "phase": "closure",
      "actionIds": [],
      "guardIds": [],
      "evidence": "agent-observation"
    },
    {
      "id": "acceptance-2",
      "acceptanceCriterion": "Standalone release readiness validates the founder approval and asset provenance while UI CLI and docs remain private.",
      "phase": "closure",
      "actionIds": [],
      "guardIds": [],
      "evidence": "agent-observation"
    },
    {
      "id": "acceptance-3",
      "acceptanceCriterion": "Packed external-consumer proofs pass offline with no sibling-source fallback and the standalone boundary report is fresh.",
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
  "declaredOwnedPaths": [
    "CONTRIBUTING.md",
    "LICENSE",
    "NOTICE",
    "THIRD_PARTY_NOTICES.md",
    "docs/architecture/package-and-distribution-boundaries.md",
    "docs/asset-provenance.json",
    "docs/guides/licensing-prerequisites.md",
    "docs/reference/generated/repository-convergence-report.json",
    "docs/release-approval.json",
    "package.json",
    "packages/data-table/LICENSE",
    "packages/data-table/README.md",
    "packages/data-table/package.json",
    "packages/email-templates/LICENSE",
    "packages/email-templates/certificates/packed-producer-certificate.json",
    "packages/email-templates/package.json",
    "packages/tokens/LICENSE",
    "packages/tokens/README.md",
    "packages/tokens/package.json",
    "packages/ui/LICENSE",
    "packages/ui/package.json",
    "scripts/__tests__/verify-email-templates-packed-producer-certificate.test.mjs",
    "scripts/__tests__/verify-packed-producer-certificate.test.mjs",
    "scripts/check-package-contents.mjs",
    "scripts/check-release-readiness.mjs",
    "scripts/check-repository-boundaries.mjs",
    "scripts/verify-email-templates-packed-producer-certificate.mjs",
    "scripts/verify-packed-producer-certificate.mjs"
  ]
}
```
<!-- skopos:task-state:end -->
