---
title: "Task: Publish only the standalone Unisane UI prerelease with a direct registry CLI"
status: complete
owner: "codex"
id: T-dd5c282f
scope: "workspace"
role: task
lifecycle: historical
authority: canonical
provenance: accepted
view: exception
risk: high-impact
proofSubject: task-closure
proofBaseline: baseline-24f123dd280f2f13
lastUpdated: 2026-08-13
---

# Task: Publish only the standalone Unisane UI prerelease with a direct registry CLI

## Changelog

- `2026-08-13`: Synchronized Task state `complete` from Skopos.

## Goal

Publish only the standalone Unisane UI prerelease with a direct registry CLI

## Acceptance

- @unisane/ui-cli publishes its own unisane-ui executable and runs init/add from a clean packed install
- No unscoped unisane package is required, installed, checked, or published
- The five approved packages from this repository retain exact prerelease identities, public MIT metadata, and dependency closure
- The release workflow validates the exact package set and publishes with npm provenance
- Public README, docs, approval, and readiness checks consistently describe direct UI-only installation

## Non-Goals

- Do not publish unisane, Ops, Framework, Growth, Cloud, provider, console, or any other repository

## Constraints

- None declared.

## Admission And Workflow

- Workflow: `strict`
- Selected risk/detail: `high-impact` / `detailed`
- Recommended risk/detail: `high-impact` / `detailed`
- Selection source: `explicit-override`
- Reason: The goal contains high-impact signal: release.

## Owned Paths

- `.github/workflows/publish-prerelease.yml`
- `apps/docs/app`
- `docs/architecture/design-system.md`
- `docs/guides/licensing-prerequisites.md`
- `docs/overview.md`
- `docs/reference/generated/repository-convergence-report.json`
- `docs/release-approval.json`
- `MIGRATION.md`
- `packages/ui-cli`
- `README.md`
- `scripts/check-package-contents.mjs`
- `scripts/check-release-readiness.mjs`
- `scripts/check-repository-boundaries.mjs`
- `THIRD_PARTY_NOTICES.md`

## Ownership Expansions

- `2026-08-13T12:49:41.049Z` by `codex`: `scripts/check-repository-boundaries.mjs` — The canonical repository boundary currently forbids the standalone UI executable and records the removed unisane host prerequisite; it must change with the approved direct CLI contract.
- `2026-08-13T12:51:41.018Z` by `codex`: `docs/architecture/design-system.md`, `MIGRATION.md`, `THIRD_PARTY_NOTICES.md` — The approved direct CLI contract changes the canonical architecture description, migration commands, and legal notice that previously referenced a separate unisane host.

## Steps

- [x] **Should this plan change a public contract, route, or SDK surface?** (decision, complete) — Public-facing changes need explicit confirmation so the agent does not silently ship a breaking contract.
- [x] **Resolve plan decisions** (implementation, complete) — Answer the recommended ask-back questions before implementation so the agent does not guess on high-impact choices.
- [x] **Record Task risk and detail before editing** (implementation, complete) — Confirm whether Task risk is light, standard, or high-impact. Keep the active Task current, use a Plan only for multi-Task direction, add a Decision for durable choices, and add or update a Finding for structural gaps.
- [x] **Review the current pattern in unisane-ui** (implementation, complete) — Use the compact references to confirm the current scope, command surface, and docs entrypoints before editing code.
- [x] **Implement the smallest scoped change** (implementation, complete) — Carry out "Publish only the standalone Unisane UI prerelease with a direct registry CLI" inside the resolved scope before widening impact to adjacent areas.
- [x] **Sync docs and instruction surfaces if touched** (docs, complete) — Keep docs, instruction mirrors, and generated project knowledge aligned with the implementation.

## Actions And Guards

- No Action or Guard is selected.

## Evidence And Readiness

- @unisane/ui-cli publishes its own unisane-ui executable and runs init/add from a clean packed install (closure, agent-observation)
- No unscoped unisane package is required, installed, checked, or published (closure, agent-observation)
- The five approved packages from this repository retain exact prerelease identities, public MIT metadata, and dependency closure (closure, agent-observation)
- The release workflow validates the exact package set and publishes with npm provenance (closure, agent-observation)
- Public README, docs, approval, and readiness checks consistently describe direct UI-only installation (closure, agent-observation)

## Memory Obligations

- [complete] architecture: The declared Task scope owns canonical architecture Memory at docs/architecture/design-system.md; review and synchronize it if project truth changes. (target: `docs/architecture/design-system.md`); resolution: memory-updated
- [complete] guide: The declared Task scope owns canonical guide Memory at docs/guides/licensing-prerequisites.md; review and synchronize it if project truth changes. (target: `docs/guides/licensing-prerequisites.md`); resolution: memory-updated

## Portable Task State

This machine-readable block is the durable source used to rebuild local Skopos state.

<!-- skopos:task-state:start -->
```json
{
  "schemaVersion": 1,
  "id": "T-dd5c282f",
  "type": "task",
  "status": "durable",
  "generatedAt": "2026-08-13T12:48:14.591Z",
  "updatedAt": "2026-08-13T13:00:07.038Z",
  "planIds": [],
  "childTasks": [],
  "state": "complete",
  "detail": "detailed",
  "title": "Publish only the standalone Unisane UI prerelease with a direct registry CLI",
  "goal": "Publish only the standalone Unisane UI prerelease with a direct registry CLI",
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
      "@unisane/ui-cli publishes its own unisane-ui executable and runs init/add from a clean packed install",
      "No unscoped unisane package is required, installed, checked, or published",
      "The five approved packages from this repository retain exact prerelease identities, public MIT metadata, and dependency closure",
      "The release workflow validates the exact package set and publishes with npm provenance",
      "Public README, docs, approval, and readiness checks consistently describe direct UI-only installation"
    ],
    "nonGoals": [
      "Do not publish unisane, Ops, Framework, Growth, Cloud, provider, console, or any other repository"
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
      "The goal contains high-impact signal: release."
    ],
    "signals": {
      "goalSignals": [
        "release"
      ],
      "ownedPathCount": 10,
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
    "baselineId": "baseline-24f123dd280f2f13"
  },
  "priority": 0,
  "dependencyTaskIds": [],
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
      "detail": "Carry out \"Publish only the standalone Unisane UI prerelease with a direct registry CLI\" inside the resolved scope before widening impact to adjacent areas.",
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
      "acceptanceCriterion": "@unisane/ui-cli publishes its own unisane-ui executable and runs init/add from a clean packed install",
      "phase": "closure",
      "actionIds": [],
      "guardIds": [],
      "evidence": "agent-observation"
    },
    {
      "id": "acceptance-2",
      "acceptanceCriterion": "No unscoped unisane package is required, installed, checked, or published",
      "phase": "closure",
      "actionIds": [],
      "guardIds": [],
      "evidence": "agent-observation"
    },
    {
      "id": "acceptance-3",
      "acceptanceCriterion": "The five approved packages from this repository retain exact prerelease identities, public MIT metadata, and dependency closure",
      "phase": "closure",
      "actionIds": [],
      "guardIds": [],
      "evidence": "agent-observation"
    },
    {
      "id": "acceptance-4",
      "acceptanceCriterion": "The release workflow validates the exact package set and publishes with npm provenance",
      "phase": "closure",
      "actionIds": [],
      "guardIds": [],
      "evidence": "agent-observation"
    },
    {
      "id": "acceptance-5",
      "acceptanceCriterion": "Public README, docs, approval, and readiness checks consistently describe direct UI-only installation",
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
      "resolutionReason": "Updated the canonical design-system architecture to make @unisane/ui-cli the standalone registry executable with no unscoped host dependency.",
      "resolvedAt": "2026-08-13T12:57:34.370Z",
      "resolvedByActorId": "codex"
    },
    {
      "id": "memory-guide-b57e5c2584",
      "role": "guide",
      "reason": "The declared Task scope owns canonical guide Memory at docs/guides/licensing-prerequisites.md; review and synchronize it if project truth changes.",
      "status": "complete",
      "targetPath": "docs/guides/licensing-prerequisites.md",
      "resolution": "memory-updated",
      "resolutionReason": "Updated the canonical release guide for direct @unisane/ui-cli invocation and UI-only provenance publication.",
      "resolvedAt": "2026-08-13T12:57:35.161Z",
      "resolvedByActorId": "codex"
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
      "resolvedOptionId": "confirm-contract-first",
      "resolvedAt": "2026-08-13T12:48:29.389Z",
      "resolvedByActorId": "codex",
      "disposition": {
        "kind": "answered",
        "reason": "Selected Task question option confirm-contract-first.",
        "actorId": "codex",
        "recordedAt": "2026-08-13T12:48:29.389Z",
        "target": {
          "kind": "option",
          "ref": "confirm-contract-first"
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
  "ownershipExpansions": [
    {
      "paths": [
        "scripts/check-repository-boundaries.mjs"
      ],
      "reason": "The canonical repository boundary currently forbids the standalone UI executable and records the removed unisane host prerequisite; it must change with the approved direct CLI contract.",
      "actorId": "codex",
      "recordedAt": "2026-08-13T12:49:41.049Z",
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
        "docs/architecture/design-system.md",
        "MIGRATION.md",
        "THIRD_PARTY_NOTICES.md"
      ],
      "reason": "The approved direct CLI contract changes the canonical architecture description, migration commands, and legal notice that previously referenced a separate unisane host.",
      "actorId": "codex",
      "recordedAt": "2026-08-13T12:51:41.018Z",
      "baselinePaths": [
        {
          "path": "MIGRATION.md",
          "digest": "b3b3c4782d2b909eea479372d4b63ba1e5831991609856557e65a35319a1bcfd"
        },
        {
          "path": "THIRD_PARTY_NOTICES.md",
          "digest": "f0e7646fd975fae779b67b37b9ff8a8a3b8905d72810ee97edd355cda770ccee"
        },
        {
          "path": "docs/architecture/design-system.md",
          "digest": "a43d7e2a6fea26814ffcfeac51ca52843bba0db9103b252488d3a63d3f959bb8"
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
    "apps/docs/app",
    "docs/architecture/design-system.md",
    "docs/guides/licensing-prerequisites.md",
    "docs/overview.md",
    "docs/reference/generated/repository-convergence-report.json",
    "docs/release-approval.json",
    "MIGRATION.md",
    "packages/ui-cli",
    "README.md",
    "scripts/check-package-contents.mjs",
    "scripts/check-release-readiness.mjs",
    "scripts/check-repository-boundaries.mjs",
    "THIRD_PARTY_NOTICES.md"
  ]
}
```
<!-- skopos:task-state:end -->
