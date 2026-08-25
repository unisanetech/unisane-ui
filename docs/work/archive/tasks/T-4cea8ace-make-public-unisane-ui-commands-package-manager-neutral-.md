---
title: 'Task: Make public Unisane UI commands package-manager-neutral and remove duplicated or stale CLI invocations'
status: complete
owner: 'bhaskarbarma'
id: T-4cea8ace
scope: 'workspace'
role: task
lifecycle: historical
authority: canonical
provenance: accepted
view: exception
risk: standard
proofSubject: task-closure
proofBaseline: baseline-e9acab986099d0ea
lastUpdated: 2026-08-14
---

# Task: Make public Unisane UI commands package-manager-neutral and remove duplicated or stale CLI invocations

## Changelog

- `2026-08-14`: Synchronized Task state `complete` from Skopos.

## Goal

Make public Unisane UI commands package-manager-neutral and remove duplicated or stale CLI invocations

## Acceptance

- The public command selector defaults to npm and renders correct npx, pnpm dlx, yarn dlx, and bunx invocations without duplicated runners
- Public GitHub and website instructions use @unisane/ui-cli@latest for registry commands and clearly reserve @unisane/ui for optional runtime installation
- Focused documentation formatting, type checking, website build, and repository boundary checks pass

## Non-Goals

- Do not change package versions, npm artifacts, release tags, or publish anything

## Constraints

- Keep repository development and CI standardized on pnpm

## Admission And Workflow

- Workflow: `tracked`
- Selected risk/detail: `standard` / `standard`
- Recommended risk/detail: `standard` / `standard`
- Selection source: `explicit-override`
- Reason: The work changes multiple paths, durable guidance, configuration, or a normal coordinated surface.

## Owned Paths

- `README.md`
- `apps/docs/app/(app-shell)/docs/components/[slug]/page.tsx`
- `apps/docs/app/(app-shell)/docs/getting-started/installation/page.tsx`
- `apps/docs/app/(app-shell)/docs/getting-started/quick-start/page.tsx`
- `apps/docs/app/(app-shell)/docs/getting-started/theming/page.tsx`
- `apps/docs/features/docs-page/components/cli-command.tsx`
- `docs/guides/licensing-prerequisites.md`
- `docs/reference/generated/repository-convergence-report.json`

## Ownership Expansions

- None recorded.

## Steps

- [x] **Should this plan change a public contract, route, or SDK surface?** (decision, complete) — Public-facing changes need explicit confirmation so the agent does not silently ship a breaking contract.
- [x] **Does this plan require a destructive rename, removal, or migration path?** (decision, complete) — Destructive changes need an explicit cutover strategy instead of an implicit agent decision.
- [x] **Resolve plan decisions** (implementation, complete) — Answer the recommended ask-back questions before implementation so the agent does not guess on high-impact choices.
- [x] **Record Task risk and detail before editing** (implementation, complete) — Confirm whether Task risk is light, standard, or high-impact. Keep the active Task current, use a Plan only for multi-Task direction, add a Decision for durable choices, and add or update a Finding for structural gaps.
- [x] **Review the current pattern in unisane-ui** (implementation, complete) — Use the compact references to confirm the current scope, command surface, and docs entrypoints before editing code.
- [x] **Implement the smallest scoped change** (implementation, complete) — Carry out "Make public Unisane UI commands package-manager-neutral and remove duplicated or stale CLI invocations" inside the resolved scope before widening impact to adjacent areas.
- [x] **Sync docs and instruction surfaces if touched** (docs, complete) — Keep docs, instruction mirrors, and generated project knowledge aligned with the implementation.

## Actions And Guards

- No Action or Guard is selected.

## Evidence And Readiness

- The public command selector defaults to npm and renders correct npx, pnpm dlx, yarn dlx, and bunx invocations without duplicated runners (closure, agent-observation)
- Public GitHub and website instructions use @unisane/ui-cli@latest for registry commands and clearly reserve @unisane/ui for optional runtime installation (closure, agent-observation)
- Focused documentation formatting, type checking, website build, and repository boundary checks pass (closure, agent-observation)

## Memory Obligations

- [complete] guide: The declared Task scope owns canonical guide Memory at docs/guides/licensing-prerequisites.md; review and synchronize it if project truth changes. (target: `docs/guides/licensing-prerequisites.md`); resolution: memory-updated

## Portable Task State

This machine-readable block is the durable source used to rebuild local Skopos state.

<!-- skopos:task-state:start -->

```json
{
  "schemaVersion": 1,
  "id": "T-4cea8ace",
  "type": "task",
  "status": "durable",
  "generatedAt": "2026-08-14T07:10:05.298Z",
  "updatedAt": "2026-08-14T07:16:41.766Z",
  "planIds": [],
  "childTasks": [],
  "state": "complete",
  "detail": "standard",
  "title": "Make public Unisane UI commands package-manager-neutral and remove duplicated or stale CLI invocations",
  "goal": "Make public Unisane UI commands package-manager-neutral and remove duplicated or stale CLI invocations",
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
      "The public command selector defaults to npm and renders correct npx, pnpm dlx, yarn dlx, and bunx invocations without duplicated runners",
      "Public GitHub and website instructions use @unisane/ui-cli@latest for registry commands and clearly reserve @unisane/ui for optional runtime installation",
      "Focused documentation formatting, type checking, website build, and repository boundary checks pass"
    ],
    "nonGoals": [
      "Do not change package versions, npm artifacts, release tags, or publish anything"
    ],
    "constraints": ["Keep repository development and CI standardized on pnpm"]
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
    "baselineId": "baseline-e9acab986099d0ea"
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
      "id": "decision-plan.destructive-migration",
      "kind": "decision",
      "title": "Does this plan require a destructive rename, removal, or migration path?",
      "detail": "Destructive changes need an explicit cutover strategy instead of an implicit agent decision.",
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
      "detail": "Carry out \"Make public Unisane UI commands package-manager-neutral and remove duplicated or stale CLI invocations\" inside the resolved scope before widening impact to adjacent areas.",
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
      "acceptanceCriterion": "The public command selector defaults to npm and renders correct npx, pnpm dlx, yarn dlx, and bunx invocations without duplicated runners",
      "phase": "closure",
      "actionIds": [],
      "guardIds": [],
      "evidence": "agent-observation"
    },
    {
      "id": "acceptance-2",
      "acceptanceCriterion": "Public GitHub and website instructions use @unisane/ui-cli@latest for registry commands and clearly reserve @unisane/ui for optional runtime installation",
      "phase": "closure",
      "actionIds": [],
      "guardIds": [],
      "evidence": "agent-observation"
    },
    {
      "id": "acceptance-3",
      "acceptanceCriterion": "Focused documentation formatting, type checking, website build, and repository boundary checks pass",
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
      "resolutionReason": "Updated the canonical release guide so public registry invocation is package-manager-neutral while internal publication remains pnpm-owned.",
      "resolvedAt": "2026-08-14T07:15:41.413Z",
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
      "resolvedAt": "2026-08-14T07:10:39.943Z",
      "resolvedByActorId": "bhaskarbarma",
      "disposition": {
        "kind": "answered",
        "reason": "Selected Task question option no-public-contract-change.",
        "actorId": "bhaskarbarma",
        "recordedAt": "2026-08-14T07:10:39.943Z",
        "target": {
          "kind": "option",
          "ref": "no-public-contract-change"
        }
      }
    },
    {
      "id": "plan.destructive-migration",
      "category": "migration",
      "escalation": "must-ask",
      "question": "Does this plan require a destructive rename, removal, or migration path?",
      "whyItMatters": "Destructive changes need an explicit cutover strategy instead of an implicit agent decision.",
      "recommendedOptionId": "stage-the-change",
      "options": [
        {
          "id": "stage-the-change",
          "label": "Stage the change",
          "rationale": "Recommended because staged rollouts reduce drift and make Readiness easier to reason about."
        },
        {
          "id": "hard-cutover",
          "label": "Hard cutover",
          "rationale": "Use only when an immediate break is intentional and fully understood."
        },
        {
          "id": "no-destructive-change",
          "label": "No destructive change",
          "rationale": "Use when the classified wording does not actually rename, remove, or migrate persisted or public state."
        }
      ],
      "blocking": true,
      "status": "resolved",
      "resolvedOptionId": "no-destructive-change",
      "resolvedAt": "2026-08-14T07:10:43.434Z",
      "resolvedByActorId": "bhaskarbarma",
      "disposition": {
        "kind": "answered",
        "reason": "Selected Task question option no-destructive-change.",
        "actorId": "bhaskarbarma",
        "recordedAt": "2026-08-14T07:10:43.434Z",
        "target": {
          "kind": "option",
          "ref": "no-destructive-change"
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
    },
    {
      "id": "resolve-plan.destructive-migration",
      "title": "Resolve: Does this plan require a destructive rename, removal, or migration path?",
      "summary": "Destructive changes need an explicit cutover strategy instead of an implicit agent decision.",
      "priority": "high",
      "actionKind": "resolve-question",
      "linkedQuestionId": "plan.destructive-migration",
      "blocking": true,
      "status": "complete"
    }
  ],
  "declaredOwnedPaths": [
    "README.md",
    "apps/docs/app/(app-shell)/docs/components/[slug]/page.tsx",
    "apps/docs/app/(app-shell)/docs/getting-started/installation/page.tsx",
    "apps/docs/app/(app-shell)/docs/getting-started/quick-start/page.tsx",
    "apps/docs/app/(app-shell)/docs/getting-started/theming/page.tsx",
    "apps/docs/features/docs-page/components/cli-command.tsx",
    "docs/guides/licensing-prerequisites.md",
    "docs/reference/generated/repository-convergence-report.json"
  ]
}
```

<!-- skopos:task-state:end -->
