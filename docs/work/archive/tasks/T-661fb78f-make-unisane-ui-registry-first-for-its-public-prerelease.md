---
title: "Task: Make Unisane UI registry-first for its public prerelease"
status: complete
owner: "bhaskarbarma"
id: T-661fb78f
scope: "workspace"
role: task
lifecycle: historical
authority: canonical
provenance: accepted
view: exception
risk: high-impact
proofSubject: task-closure
proofBaseline: baseline-b92f0fd37c989bde
lastUpdated: 2026-08-13
---

# Task: Make Unisane UI registry-first for its public prerelease

## Changelog

- `2026-08-13`: Synchronized Task state `complete` from Skopos.

## Goal

Make Unisane UI registry-first for its public prerelease

## Acceptance

- Public positioning leads with open-code registry ownership and local-source imports.
- The approved prerelease includes the UI CLI pack and keeps the canonical unisane host as the sole executable.
- Public docs consistently require React 19 and do not make unsupported accessibility, size, or variant-count claims.
- The release workflow verifies and publishes the exact approved package set without publishing npm during this Task.
- A clean packed UI CLI install proves bundled registry assets and representative local-source adoption without @unisane/ui runtime imports.

## Non-Goals

- Do not publish npm packages or mutate npm credentials, tags, registry ownership, or the canonical unisane host repository.

## Constraints

- Preserve one canonical unisane executable; @unisane/ui-cli remains a pack with no binary.
- Do not add compatibility aliases, fallback registries, or a second component authoring source.

## Admission And Workflow

- Workflow: `strict`
- Selected risk/detail: `high-impact` / `detailed`
- Recommended risk/detail: `high-impact` / `detailed`
- Selection source: `explicit-override`
- Reason: The goal contains high-impact signal: release.

## Owned Paths

- `.github/workflows/publish-prerelease.yml`
- `apps/docs/app/(app-shell)/docs`
- `apps/docs/features/home`
- `apps/docs/README.md`
- `docs/00-start-here.md`
- `docs/architecture/design-system.md`
- `docs/guides/licensing-prerequisites.md`
- `docs/overview.md`
- `docs/reference/generated/repository-convergence-report.json`
- `docs/release-approval.json`
- `package.json`
- `packages/data-table/package.json`
- `packages/data-table/README.md`
- `packages/email-templates/certificates/packed-producer-certificate.json`
- `packages/email-templates/package.json`
- `packages/email-templates/README.md`
- `packages/tokens/package.json`
- `packages/tokens/README.md`
- `packages/ui-cli`
- `packages/ui/package.json`
- `packages/ui/README.md`
- `README.md`
- `scripts/check-package-contents.mjs`
- `scripts/check-release-readiness.mjs`
- `scripts/check-repository-boundaries.mjs`
- `THIRD_PARTY_NOTICES.md`

## Ownership Expansions

- `2026-08-13T12:18:39.244Z` by `bhaskarbarma`: `scripts/check-repository-boundaries.mjs` — Update the canonical boundary owner to the approved five-package registry-first release contract.
- `2026-08-13T12:21:19.343Z` by `bhaskarbarma`: `packages/email-templates/certificates/packed-producer-certificate.json` — Refresh the canonical packed email certificate against the immutable registry-first implementation revision.

## Steps

- [x] **Record Task risk and detail before editing** (implementation, complete) — Confirm whether Task risk is light, standard, or high-impact. Keep the active Task current, use a Plan only for multi-Task direction, add a Decision for durable choices, and add or update a Finding for structural gaps.
- [x] **Review the current pattern in unisane-ui** (implementation, complete) — Use the compact references to confirm the current scope, command surface, and docs entrypoints before editing code.
- [x] **Implement the smallest scoped change** (implementation, complete) — Carry out "Make Unisane UI registry-first for its public prerelease" inside the resolved scope before widening impact to adjacent areas.
- [x] **Sync docs and instruction surfaces if touched** (docs, complete) — Keep docs, instruction mirrors, and generated project knowledge aligned with the implementation.

## Actions And Guards

- No Action or Guard is selected.

## Evidence And Readiness

- Public positioning leads with open-code registry ownership and local-source imports. (closure, agent-observation)
- The approved prerelease includes the UI CLI pack and keeps the canonical unisane host as the sole executable. (closure, agent-observation)
- Public docs consistently require React 19 and do not make unsupported accessibility, size, or variant-count claims. (closure, agent-observation)
- The release workflow verifies and publishes the exact approved package set without publishing npm during this Task. (closure, agent-observation)
- A clean packed UI CLI install proves bundled registry assets and representative local-source adoption without @unisane/ui runtime imports. (closure, agent-observation)

## Memory Obligations

- [complete] architecture: The declared Task scope owns canonical architecture Memory at docs/architecture/design-system.md; review and synchronize it if project truth changes. (target: `docs/architecture/design-system.md`); resolution: memory-updated
- [complete] guide: The declared Task scope owns canonical guide Memory at docs/guides/licensing-prerequisites.md; review and synchronize it if project truth changes. (target: `docs/guides/licensing-prerequisites.md`); resolution: memory-updated

## Portable Task State

This machine-readable block is the durable source used to rebuild local Skopos state.

<!-- skopos:task-state:start -->
```json
{
  "schemaVersion": 1,
  "id": "T-661fb78f",
  "type": "task",
  "status": "durable",
  "generatedAt": "2026-08-13T11:34:47.473Z",
  "updatedAt": "2026-08-13T12:22:35.743Z",
  "planIds": [],
  "childTasks": [],
  "state": "complete",
  "detail": "detailed",
  "title": "Make Unisane UI registry-first for its public prerelease",
  "goal": "Make Unisane UI registry-first for its public prerelease",
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
      "Public positioning leads with open-code registry ownership and local-source imports.",
      "The approved prerelease includes the UI CLI pack and keeps the canonical unisane host as the sole executable.",
      "Public docs consistently require React 19 and do not make unsupported accessibility, size, or variant-count claims.",
      "The release workflow verifies and publishes the exact approved package set without publishing npm during this Task.",
      "A clean packed UI CLI install proves bundled registry assets and representative local-source adoption without @unisane/ui runtime imports."
    ],
    "nonGoals": [
      "Do not publish npm packages or mutate npm credentials, tags, registry ownership, or the canonical unisane host repository."
    ],
    "constraints": [
      "Preserve one canonical unisane executable; @unisane/ui-cli remains a pack with no binary.",
      "Do not add compatibility aliases, fallback registries, or a second component authoring source."
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
      "ownedPathCount": 24,
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
    "baselineId": "baseline-b92f0fd37c989bde"
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
      "detail": "Carry out \"Make Unisane UI registry-first for its public prerelease\" inside the resolved scope before widening impact to adjacent areas.",
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
      "acceptanceCriterion": "Public positioning leads with open-code registry ownership and local-source imports.",
      "phase": "closure",
      "actionIds": [],
      "guardIds": [],
      "evidence": "agent-observation"
    },
    {
      "id": "acceptance-2",
      "acceptanceCriterion": "The approved prerelease includes the UI CLI pack and keeps the canonical unisane host as the sole executable.",
      "phase": "closure",
      "actionIds": [],
      "guardIds": [],
      "evidence": "agent-observation"
    },
    {
      "id": "acceptance-3",
      "acceptanceCriterion": "Public docs consistently require React 19 and do not make unsupported accessibility, size, or variant-count claims.",
      "phase": "closure",
      "actionIds": [],
      "guardIds": [],
      "evidence": "agent-observation"
    },
    {
      "id": "acceptance-4",
      "acceptanceCriterion": "The release workflow verifies and publishes the exact approved package set without publishing npm during this Task.",
      "phase": "closure",
      "actionIds": [],
      "guardIds": [],
      "evidence": "agent-observation"
    },
    {
      "id": "acceptance-5",
      "acceptanceCriterion": "A clean packed UI CLI install proves bundled registry assets and representative local-source adoption without @unisane/ui runtime imports.",
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
      "resolutionReason": "Documented registry-first dual distribution, local-source imports, single authoring source, and the optional runtime package path.",
      "resolvedAt": "2026-08-13T12:20:14.869Z",
      "resolvedByActorId": "bhaskarbarma"
    },
    {
      "id": "memory-guide-b57e5c2584",
      "role": "guide",
      "reason": "The declared Task scope owns canonical guide Memory at docs/guides/licensing-prerequisites.md; review and synchronize it if project truth changes.",
      "status": "complete",
      "targetPath": "docs/guides/licensing-prerequisites.md",
      "resolution": "memory-updated",
      "resolutionReason": "Documented the exact five-package MIT prerelease, canonical CLI host prerequisite, and provenance-enabled release boundary.",
      "resolvedAt": "2026-08-13T12:20:15.701Z",
      "resolvedByActorId": "bhaskarbarma"
    }
  ],
  "questions": [],
  "recommendations": [],
  "ownershipExpansions": [
    {
      "paths": [
        "scripts/check-repository-boundaries.mjs"
      ],
      "reason": "Update the canonical boundary owner to the approved five-package registry-first release contract.",
      "actorId": "bhaskarbarma",
      "recordedAt": "2026-08-13T12:18:39.244Z",
      "baselinePaths": [
        {
          "path": "scripts/check-repository-boundaries.mjs",
          "digest": "f3dfe94ce0599b1444d1b99f87bd72dd18213c3acd0a1ff7871699523687c6d6"
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
        "packages/email-templates/certificates/packed-producer-certificate.json"
      ],
      "reason": "Refresh the canonical packed email certificate against the immutable registry-first implementation revision.",
      "actorId": "bhaskarbarma",
      "recordedAt": "2026-08-13T12:21:19.343Z",
      "baselinePaths": [
        {
          "path": "packages/email-templates/certificates/packed-producer-certificate.json",
          "digest": "c64f827a5835209e410b0cb237c2ea4a0e3577ff0b5b42efc7dab99ff6fb68c2"
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
    "apps/docs/app/(app-shell)/docs",
    "apps/docs/features/home",
    "apps/docs/README.md",
    "docs/00-start-here.md",
    "docs/architecture/design-system.md",
    "docs/guides/licensing-prerequisites.md",
    "docs/overview.md",
    "docs/reference/generated/repository-convergence-report.json",
    "docs/release-approval.json",
    "package.json",
    "packages/data-table/package.json",
    "packages/data-table/README.md",
    "packages/email-templates/certificates/packed-producer-certificate.json",
    "packages/email-templates/package.json",
    "packages/email-templates/README.md",
    "packages/tokens/package.json",
    "packages/tokens/README.md",
    "packages/ui-cli",
    "packages/ui/package.json",
    "packages/ui/README.md",
    "README.md",
    "scripts/check-package-contents.mjs",
    "scripts/check-release-readiness.mjs",
    "scripts/check-repository-boundaries.mjs",
    "THIRD_PARTY_NOTICES.md"
  ]
}
```
<!-- skopos:task-state:end -->
