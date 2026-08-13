---
title: "Task: Publish a deterministic Shadcn-compatible static registry and align CLI pack discovery"
status: blocked
owner: "project"
id: T-f5b7397b
scope: "workspace"
role: task
lifecycle: active
authority: canonical
provenance: accepted
view: current
risk: high-impact
proofSubject: task-closure
proofBaseline: baseline-e266f7da456e53e9
lastUpdated: 2026-08-13
---

# Task: Publish a deterministic Shadcn-compatible static registry and align CLI pack discovery

## Changelog

- `2026-08-13`: Synchronized Task state `blocked` from Skopos.

## Goal

Publish a deterministic Shadcn-compatible static registry and align CLI pack discovery

## Acceptance

- A deterministic build emits one catalog, one components.json schema, and exactly one content-bearing item JSON for each of the 94 canonical catalog items
- Hosted item dependency addresses resolve within the Unisane registry and emitted paths use supported Shadcn alias targets without source or target traversal
- The standalone CLI and pack handler both expose list, search, and view from the same canonical catalog
- GitHub Pages deployment is source-bound, least-privilege, and remote contract checks validate the catalog, schema, and representative item
- A clean official Shadcn CLI fixture can consume a representative hosted-format item without an @unisane runtime dependency

## Non-Goals

- Do not define blocks, templates, marketplace, entitlements, or Pro taxonomy

## Constraints

- Do not publish npm latest or mutate DNS until hosted endpoint verification is ready

## Admission And Workflow

- Workflow: `strict`
- Selected risk/detail: `high-impact` / `detailed`
- Recommended risk/detail: `high-impact` / `detailed`
- Selection source: `explicit-override`
- Reason: Declared ownership spans 15 paths.

## Owned Paths

- `.github/workflows/deploy-registry.yml`
- `docs/architecture/design-system.md`
- `docs/reference/generated/repository-convergence-report.json`
- `package.json`
- `packages/ui-cli/components.schema.json`
- `packages/ui-cli/pack.manifest.json`
- `packages/ui-cli/package.json`
- `packages/ui-cli/README.md`
- `packages/ui-cli/src/commands/catalog.ts`
- `packages/ui-cli/tests/catalog.test.ts`
- `packages/ui-cli/tests/handler.test.ts`
- `packages/ui/package.json`
- `packages/ui/registry/registry-schema.json`
- `README.md`
- `scripts/__tests__/build-static-registry.test.mjs`
- `scripts/build-static-registry.mjs`
- `scripts/check-repository-boundaries.mjs`
- `scripts/check-static-registry.mjs`

## Ownership Expansions

- `2026-08-13T15:57:34.717Z` by `bhaskarbarma`: `packages/ui-cli/src/commands/catalog.ts` — The pack parity regression proved catalog JSON must write through the handler-captured stdout surface.
- `2026-08-13T15:58:09.195Z` by `bhaskarbarma`: `packages/ui-cli/tests/catalog.test.ts` — The existing catalog unit test must observe the captured stdout contract used by both standalone and pack transports.
- `2026-08-13T16:12:02.875Z` by `bhaskarbarma`: `scripts/check-repository-boundaries.mjs` — Prevent ignored registry build output from entering the tracked convergence ledger and breaking clean-clone verification.

## Steps

- [x] **Should this plan change a public contract, route, or SDK surface?** (decision, complete) — Public-facing changes need explicit confirmation so the agent does not silently ship a breaking contract.
- [x] **Resolve plan decisions** (implementation, complete) — Answer the recommended ask-back questions before implementation so the agent does not guess on high-impact choices.
- [x] **Record Task risk and detail before editing** (implementation, complete) — Confirm whether Task risk is light, standard, or high-impact. Keep the active Task current, use a Plan only for multi-Task direction, add a Decision for durable choices, and add or update a Finding for structural gaps.
- [x] **Review the current pattern in unisane-ui** (implementation, complete) — Use the compact references to confirm the current scope, command surface, and docs entrypoints before editing code.
- [x] **Implement the smallest scoped change** (implementation, complete) — Carry out "Publish a deterministic Shadcn-compatible static registry and align CLI pack discovery" inside the resolved scope before widening impact to adjacent areas.
- [x] **Sync docs and instruction surfaces if touched** (docs, complete) — Keep docs, instruction mirrors, and generated project knowledge aligned with the implementation.

## Actions And Guards

- No Action or Guard is selected.

## Evidence And Readiness

- A deterministic build emits one catalog, one components.json schema, and exactly one content-bearing item JSON for each of the 94 canonical catalog items (closure, agent-observation)
- Hosted item dependency addresses resolve within the Unisane registry and emitted paths use supported Shadcn alias targets without source or target traversal (closure, agent-observation)
- The standalone CLI and pack handler both expose list, search, and view from the same canonical catalog (closure, agent-observation)
- GitHub Pages deployment is source-bound, least-privilege, and remote contract checks validate the catalog, schema, and representative item (closure, agent-observation)
- A clean official Shadcn CLI fixture can consume a representative hosted-format item without an @unisane runtime dependency (closure, agent-observation)

## Memory Obligations

- [complete] architecture: The declared Task scope owns canonical architecture Memory at docs/architecture/design-system.md; review and synchronize it if project truth changes. (target: `docs/architecture/design-system.md`); resolution: memory-updated

## Portable Task State

This machine-readable block is the durable source used to rebuild local Skopos state.

<!-- skopos:task-state:start -->
```json
{
  "schemaVersion": 1,
  "id": "T-f5b7397b",
  "type": "task",
  "status": "active",
  "generatedAt": "2026-08-13T15:50:27.055Z",
  "updatedAt": "2026-08-13T18:57:04.017Z",
  "planIds": [],
  "childTasks": [
    {
      "taskId": "T-a58c4be5",
      "title": "Publish the complete Unisane UI website and registry at ui.unisane.com",
      "goal": "Publish the complete Unisane UI website and registry at ui.unisane.com",
      "scopeId": "workspace",
      "state": "active",
      "createdAt": "2026-08-13T18:41:15.183Z",
      "createdByActorId": "bhaskarbarma",
      "ownedPaths": [
        ".github/workflows/deploy-registry.yml",
        ".gitignore",
        "apps/docs",
        "docs/architecture/design-system.md",
        "docs/reference/generated/repository-convergence-report.json",
        "docs/work/tasks/T-f5b7397b-publish-a-deterministic-shadcn-compatible-static-registr.md",
        "eslint.config.mjs",
        "package.json",
        "pnpm-lock.yaml",
        "README.md",
        "scripts/__tests__/build-static-registry.test.mjs",
        "scripts/build-static-registry.mjs",
        "scripts/check-static-registry.mjs",
        "wrangler.jsonc"
      ],
      "dependencyTaskIds": [],
      "parentAcceptanceRequirementIds": [
        "acceptance-5"
      ],
      "claimedByActorId": "child-t-a58c4be5"
    }
  ],
  "state": "blocked",
  "detail": "detailed",
  "title": "Publish a deterministic Shadcn-compatible static registry and align CLI pack discovery",
  "goal": "Publish a deterministic Shadcn-compatible static registry and align CLI pack discovery",
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
      "A deterministic build emits one catalog, one components.json schema, and exactly one content-bearing item JSON for each of the 94 canonical catalog items",
      "Hosted item dependency addresses resolve within the Unisane registry and emitted paths use supported Shadcn alias targets without source or target traversal",
      "The standalone CLI and pack handler both expose list, search, and view from the same canonical catalog",
      "GitHub Pages deployment is source-bound, least-privilege, and remote contract checks validate the catalog, schema, and representative item",
      "A clean official Shadcn CLI fixture can consume a representative hosted-format item without an @unisane runtime dependency"
    ],
    "nonGoals": [
      "Do not define blocks, templates, marketplace, entitlements, or Pro taxonomy"
    ],
    "constraints": [
      "Do not publish npm latest or mutate DNS until hosted endpoint verification is ready"
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
      "Declared ownership spans 15 paths."
    ],
    "signals": {
      "goalSignals": [],
      "ownedPathCount": 15,
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
    "baselineId": "baseline-e266f7da456e53e9"
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
      "detail": "Carry out \"Publish a deterministic Shadcn-compatible static registry and align CLI pack discovery\" inside the resolved scope before widening impact to adjacent areas.",
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
      "acceptanceCriterion": "A deterministic build emits one catalog, one components.json schema, and exactly one content-bearing item JSON for each of the 94 canonical catalog items",
      "phase": "closure",
      "actionIds": [],
      "guardIds": [],
      "evidence": "agent-observation"
    },
    {
      "id": "acceptance-2",
      "acceptanceCriterion": "Hosted item dependency addresses resolve within the Unisane registry and emitted paths use supported Shadcn alias targets without source or target traversal",
      "phase": "closure",
      "actionIds": [],
      "guardIds": [],
      "evidence": "agent-observation"
    },
    {
      "id": "acceptance-3",
      "acceptanceCriterion": "The standalone CLI and pack handler both expose list, search, and view from the same canonical catalog",
      "phase": "closure",
      "actionIds": [],
      "guardIds": [],
      "evidence": "agent-observation"
    },
    {
      "id": "acceptance-4",
      "acceptanceCriterion": "GitHub Pages deployment is source-bound, least-privilege, and remote contract checks validate the catalog, schema, and representative item",
      "phase": "closure",
      "actionIds": [],
      "guardIds": [],
      "evidence": "agent-observation"
    },
    {
      "id": "acceptance-5",
      "acceptanceCriterion": "A clean official Shadcn CLI fixture can consume a representative hosted-format item without an @unisane runtime dependency",
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
      "resolutionReason": "Design-system architecture now owns the deterministic hosted registry projection and shared CLI/pack/MCP catalog contract.",
      "resolvedAt": "2026-08-13T16:07:43.452Z",
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
      "resolvedOptionId": "confirm-contract-first",
      "resolvedAt": "2026-08-13T15:50:36.268Z",
      "resolvedByActorId": "bhaskarbarma",
      "disposition": {
        "kind": "answered",
        "reason": "Selected Task question option confirm-contract-first.",
        "actorId": "bhaskarbarma",
        "recordedAt": "2026-08-13T15:50:36.268Z",
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
    },
    {
      "id": "start-bounded-child-task",
      "title": "Start a bounded child Task",
      "summary": "The Task may be drifting from its admitted subject because ownership expanded 3 times. Keep this Task intact and move the suggested paths into focused follow-up work.",
      "priority": "medium",
      "actionKind": "start-child-task",
      "command": "skopos task child start 'T-f5b7397b' 'Continue Publish a deterministic Shadcn-compatible static registry and align CLI pack discovery as bounded follow-up work' . --scope 'workspace' --own 'packages/ui-cli/src/commands/catalog.ts' --own 'packages/ui-cli/tests/catalog.test.ts' --own 'scripts/check-repository-boundaries.mjs' --reason 'The Task may be drifting from its admitted subject because ownership expanded 3 times.' --actor 'bhaskarbarma'",
      "ownedPaths": [
        "packages/ui-cli/src/commands/catalog.ts",
        "packages/ui-cli/tests/catalog.test.ts",
        "scripts/check-repository-boundaries.mjs"
      ],
      "scopeId": "workspace",
      "reason": "The Task may be drifting from its admitted subject because ownership expanded 3 times.",
      "blocking": false,
      "status": "complete"
    }
  ],
  "ownershipExpansions": [
    {
      "paths": [
        "packages/ui-cli/src/commands/catalog.ts"
      ],
      "reason": "The pack parity regression proved catalog JSON must write through the handler-captured stdout surface.",
      "actorId": "bhaskarbarma",
      "recordedAt": "2026-08-13T15:57:34.717Z",
      "baselinePaths": [
        {
          "path": "packages/ui-cli/src/commands/catalog.ts",
          "digest": "a0442fc25328c4b5bb1f2bd3403130d2fda0b80e0e423ef65946db51fdb7d1ba"
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
        "packages/ui-cli/tests/catalog.test.ts"
      ],
      "reason": "The existing catalog unit test must observe the captured stdout contract used by both standalone and pack transports.",
      "actorId": "bhaskarbarma",
      "recordedAt": "2026-08-13T15:58:09.195Z",
      "baselinePaths": [
        {
          "path": "packages/ui-cli/tests/catalog.test.ts",
          "digest": "e5129f3c8a8b16aee7c8faa1210cbf07294704bd54d6573a80d7bb2d6ecc1393"
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
        "scripts/check-repository-boundaries.mjs"
      ],
      "reason": "Prevent ignored registry build output from entering the tracked convergence ledger and breaking clean-clone verification.",
      "actorId": "bhaskarbarma",
      "recordedAt": "2026-08-13T16:12:02.875Z",
      "baselinePaths": [
        {
          "path": "scripts/check-repository-boundaries.mjs",
          "digest": "d868eb652272be4d6a2fe862d4edf55cd68ac8b32f161661a60639ee25827a6c"
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
    ".github/workflows/deploy-registry.yml",
    "docs/architecture/design-system.md",
    "docs/reference/generated/repository-convergence-report.json",
    "package.json",
    "packages/ui-cli/components.schema.json",
    "packages/ui-cli/pack.manifest.json",
    "packages/ui-cli/package.json",
    "packages/ui-cli/README.md",
    "packages/ui-cli/src/commands/catalog.ts",
    "packages/ui-cli/tests/catalog.test.ts",
    "packages/ui-cli/tests/handler.test.ts",
    "packages/ui/package.json",
    "packages/ui/registry/registry-schema.json",
    "README.md",
    "scripts/__tests__/build-static-registry.test.mjs",
    "scripts/build-static-registry.mjs",
    "scripts/check-repository-boundaries.mjs",
    "scripts/check-static-registry.mjs"
  ]
}
```
<!-- skopos:task-state:end -->
