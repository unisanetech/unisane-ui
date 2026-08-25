---
title: 'Task: Remove obsolete migration-shadow authority and harden the public UI repository boundary'
status: complete
owner: 'codex'
id: T-9f19a862
scope: 'workspace'
role: task
lifecycle: historical
authority: canonical
provenance: accepted
view: exception
risk: standard
proofSubject: task-closure
proofBaseline: baseline-eb1ac3c92a9536ae
lastUpdated: 2026-08-13
---

# Task: Remove obsolete migration-shadow authority and harden the public UI repository boundary

## Changelog

- `2026-08-13`: Synchronized Task state `complete` from Skopos.

## Goal

Remove obsolete migration-shadow authority and harden the public UI repository boundary

## Acceptance

- Current README and canonical docs identify unisanetech/unisane-ui main as the standalone public source authority and treat umbrella extraction only as historical provenance.
- The obsolete active migration-shadow guide is replaced by one current repository provenance and authority guide.
- The boundary owner emits standalone-public-source authority, rejects a reintroduced migration-shadow guide, and regenerates a fresh zero-violation report.
- Git ignore rules fail closed for environment variants, repository npm credentials, package archives, TypeScript build state, and common local caches while allowing documented examples.
- Focused repository, formatting, package-content, and npm dry-run checks pass without publishing packages.

## Non-Goals

- None declared.

## Constraints

- Do not change package APIs, versions, dependencies, licenses, registry state, or npm publication state.
- Preserve historical extraction receipts, history mapping, filter specification, and audit evidence.

## Admission And Workflow

- Workflow: `tracked`
- Selected risk/detail: `standard` / `standard`
- Recommended risk/detail: `standard` / `standard`
- Selection source: `explicit-override`
- Reason: The work changes multiple paths, durable guidance, configuration, or a normal coordinated surface.

## Owned Paths

- `.gitignore`
- `README.md`
- `docs/00-start-here.md`
- `docs/guides/migration-shadow.md`
- `docs/guides/repository-provenance.md`
- `docs/overview.md`
- `docs/reference/generated/repository-convergence-report.json`
- `scripts/check-repository-boundaries.mjs`

## Ownership Expansions

- None recorded.

## Steps

- [x] **Record Task risk and detail before editing** (implementation, complete) — Confirm whether Task risk is light, standard, or high-impact. Keep the active Task current, use a Plan only for multi-Task direction, add a Decision for durable choices, and add or update a Finding for structural gaps.
- [x] **Review the current pattern in unisane-ui** (implementation, complete) — Use the compact references to confirm the current scope, command surface, and docs entrypoints before editing code.
- [x] **Implement the smallest scoped change** (implementation, complete) — Carry out "Remove obsolete migration-shadow authority and harden the public UI repository boundary" inside the resolved scope before widening impact to adjacent areas.
- [x] **Sync docs and instruction surfaces if touched** (docs, complete) — Keep docs, instruction mirrors, and generated project knowledge aligned with the implementation.

## Actions And Guards

- No Action or Guard is selected.

## Evidence And Readiness

- Current README and canonical docs identify unisanetech/unisane-ui main as the standalone public source authority and treat umbrella extraction only as historical provenance. (closure, agent-observation)
- The obsolete active migration-shadow guide is replaced by one current repository provenance and authority guide. (closure, agent-observation)
- The boundary owner emits standalone-public-source authority, rejects a reintroduced migration-shadow guide, and regenerates a fresh zero-violation report. (closure, agent-observation)
- Git ignore rules fail closed for environment variants, repository npm credentials, package archives, TypeScript build state, and common local caches while allowing documented examples. (closure, agent-observation)
- Focused repository, formatting, package-content, and npm dry-run checks pass without publishing packages. (closure, agent-observation)

## Memory Obligations

- [complete] guide: The declared Task scope owns canonical guide Memory at docs/guides/migration-shadow.md; review and synchronize it if project truth changes. (target: `docs/guides/repository-provenance.md`); resolution: memory-updated

## Portable Task State

This machine-readable block is the durable source used to rebuild local Skopos state.

<!-- skopos:task-state:start -->

```json
{
  "schemaVersion": 1,
  "id": "T-9f19a862",
  "type": "task",
  "status": "durable",
  "generatedAt": "2026-08-13T11:06:14.949Z",
  "updatedAt": "2026-08-13T11:09:35.768Z",
  "planIds": [],
  "childTasks": [],
  "state": "complete",
  "detail": "standard",
  "title": "Remove obsolete migration-shadow authority and harden the public UI repository boundary",
  "goal": "Remove obsolete migration-shadow authority and harden the public UI repository boundary",
  "scope": {
    "query": "workspace",
    "matchedBy": "id",
    "scope": {
      "id": "workspace",
      "kind": "workspace",
      "title": "unisane-ui",
      "path": ".",
      "aliases": ["root"],
      "summary": "unisane-ui (public-package-product).",
      "confidence": "high",
      "ancestorIds": [],
      "profile": "public-package-product",
      "memoryRoot": "docs",
      "codeRoots": ["."],
      "dependsOn": [],
      "owners": ["ui-maintainers"]
    }
  },
  "contract": {
    "acceptanceCriteria": [
      "Current README and canonical docs identify unisanetech/unisane-ui main as the standalone public source authority and treat umbrella extraction only as historical provenance.",
      "The obsolete active migration-shadow guide is replaced by one current repository provenance and authority guide.",
      "The boundary owner emits standalone-public-source authority, rejects a reintroduced migration-shadow guide, and regenerates a fresh zero-violation report.",
      "Git ignore rules fail closed for environment variants, repository npm credentials, package archives, TypeScript build state, and common local caches while allowing documented examples.",
      "Focused repository, formatting, package-content, and npm dry-run checks pass without publishing packages."
    ],
    "nonGoals": [],
    "constraints": [
      "Do not change package APIs, versions, dependencies, licenses, registry state, or npm publication state.",
      "Preserve historical extraction receipts, history mapping, filter specification, and audit evidence."
    ]
  },
  "risk": "standard",
  "admission": {
    "recommendedRisk": "standard",
    "recommendedDetail": "standard",
    "selectedRisk": "standard",
    "selectedDetail": "standard",
    "selectionSource": "explicit-override",
    "workflow": "tracked",
    "reasons": [
      "The work changes multiple paths, durable guidance, configuration, or a normal coordinated surface."
    ],
    "signals": {
      "goalSignals": [],
      "ownedPathCount": 8,
      "affectedScopeIds": ["workspace"],
      "impactCategories": ["docs", "workspace-file"],
      "proofSubjectKind": "task-closure"
    }
  },
  "proofSubject": {
    "kind": "task-closure",
    "baselineId": "baseline-eb1ac3c92a9536ae"
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
      "detail": "Carry out \"Remove obsolete migration-shadow authority and harden the public UI repository boundary\" inside the resolved scope before widening impact to adjacent areas.",
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
      "acceptanceCriterion": "Current README and canonical docs identify unisanetech/unisane-ui main as the standalone public source authority and treat umbrella extraction only as historical provenance.",
      "phase": "closure",
      "actionIds": [],
      "guardIds": [],
      "evidence": "agent-observation"
    },
    {
      "id": "acceptance-2",
      "acceptanceCriterion": "The obsolete active migration-shadow guide is replaced by one current repository provenance and authority guide.",
      "phase": "closure",
      "actionIds": [],
      "guardIds": [],
      "evidence": "agent-observation"
    },
    {
      "id": "acceptance-3",
      "acceptanceCriterion": "The boundary owner emits standalone-public-source authority, rejects a reintroduced migration-shadow guide, and regenerates a fresh zero-violation report.",
      "phase": "closure",
      "actionIds": [],
      "guardIds": [],
      "evidence": "agent-observation"
    },
    {
      "id": "acceptance-4",
      "acceptanceCriterion": "Git ignore rules fail closed for environment variants, repository npm credentials, package archives, TypeScript build state, and common local caches while allowing documented examples.",
      "phase": "closure",
      "actionIds": [],
      "guardIds": [],
      "evidence": "agent-observation"
    },
    {
      "id": "acceptance-5",
      "acceptanceCriterion": "Focused repository, formatting, package-content, and npm dry-run checks pass without publishing packages.",
      "phase": "closure",
      "actionIds": [],
      "guardIds": [],
      "evidence": "agent-observation"
    }
  ],
  "memoryObligations": [
    {
      "id": "memory-guide-8042a7e90d",
      "role": "guide",
      "reason": "The declared Task scope owns canonical guide Memory at docs/guides/migration-shadow.md; review and synchronize it if project truth changes.",
      "status": "complete",
      "targetPath": "docs/guides/repository-provenance.md",
      "resolution": "memory-updated",
      "resolutionReason": "Replaced the obsolete migration-shadow guide with the canonical current repository provenance and source-authority guide while preserving extraction evidence.",
      "resolvedAt": "2026-08-13T11:07:47.253Z",
      "resolvedByActorId": "codex"
    }
  ],
  "questions": [],
  "recommendations": [],
  "declaredOwnedPaths": [
    ".gitignore",
    "README.md",
    "docs/00-start-here.md",
    "docs/guides/migration-shadow.md",
    "docs/guides/repository-provenance.md",
    "docs/overview.md",
    "docs/reference/generated/repository-convergence-report.json",
    "scripts/check-repository-boundaries.mjs"
  ]
}
```

<!-- skopos:task-state:end -->
