---
title: "Task: Publish the complete Unisane UI website and registry at ui.unisane.com"
status: active
owner: "child-t-a58c4be5"
id: T-a58c4be5
scope: "workspace"
role: task
lifecycle: active
authority: canonical
provenance: accepted
view: current
risk: standard
proofSubject: task-closure
proofBaseline: baseline-f2047825b64cd1d3
lastUpdated: 2026-08-13
parentTaskId: T-f5b7397b
---

# Task: Publish the complete Unisane UI website and registry at ui.unisane.com

## Changelog

- `2026-08-13`: Synchronized Task state `active` from Skopos.

## Goal

Publish the complete Unisane UI website and registry at ui.unisane.com

## Acceptance

- The complete docs and component gallery export as static files at the site root
- The same output contains the 94-item Shadcn registry under /r and schemas under /schema
- Cloudflare Workers Static Assets is the sole deployment target for ui.unisane.com
- The combined build and registry contract pass locally before any external deployment

## Non-Goals

- None declared.

## Constraints

- None declared.

## Admission And Workflow

- Workflow: `tracked`
- Selected risk/detail: `standard` / `standard`
- Recommended risk/detail: `standard` / `standard`
- Selection source: `explicit-override`
- Reason: The work changes multiple paths, durable guidance, configuration, or a normal coordinated surface.

## Owned Paths

- `.github/workflows/deploy-registry.yml`
- `.gitignore`
- `apps/docs`
- `docs/architecture/design-system.md`
- `docs/reference/generated/repository-convergence-report.json`
- `docs/work/tasks/T-f5b7397b-publish-a-deterministic-shadcn-compatible-static-registr.md`
- `eslint.config.mjs`
- `package.json`
- `pnpm-lock.yaml`
- `README.md`
- `scripts/__tests__/build-static-registry.test.mjs`
- `scripts/build-static-registry.mjs`
- `scripts/check-static-registry.mjs`
- `wrangler.jsonc`

## Ownership Expansions

- `2026-08-13T18:51:27.886Z` by `child-t-a58c4be5`: `eslint.config.mjs` — Keep generated static export output outside the canonical lint source boundary
- `2026-08-13T18:56:36.960Z` by `child-t-a58c4be5`: `.gitignore`, `docs/work/tasks/T-f5b7397b-publish-a-deterministic-shadcn-compatible-static-registr.md` — Own the Wrangler cache ignore and generated parent-child Task linkage required by this hosting slice.

## Steps

- [x] **Record Task risk and detail before editing** (implementation, complete) — Confirm whether Task risk is light, standard, or high-impact. Keep the active Task current, use a Plan only for multi-Task direction, add a Decision for durable choices, and add or update a Finding for structural gaps.
- [x] **Review the current pattern in unisane-ui** (implementation, complete) — Use the compact references to confirm the current scope, command surface, and docs entrypoints before editing code.
- [x] **Implement the smallest scoped change** (implementation, complete) — Carry out "Publish the complete Unisane UI website and registry at ui.unisane.com" inside the resolved scope before widening impact to adjacent areas.
- [x] **Sync docs and instruction surfaces if touched** (docs, complete) — Keep docs, instruction mirrors, and generated project knowledge aligned with the implementation.

## Actions And Guards

- No Action or Guard is selected.

## Evidence And Readiness

- The complete docs and component gallery export as static files at the site root (closure, agent-observation)
- The same output contains the 94-item Shadcn registry under /r and schemas under /schema (closure, agent-observation)
- Cloudflare Workers Static Assets is the sole deployment target for ui.unisane.com (closure, agent-observation)
- The combined build and registry contract pass locally before any external deployment (closure, agent-observation)

## Memory Obligations

- [complete] architecture: The declared Task scope owns canonical architecture Memory at docs/architecture/design-system.md; review and synchronize it if project truth changes. (target: `docs/architecture/design-system.md`); resolution: memory-updated

## Portable Task State

This machine-readable block is the durable source used to rebuild local Skopos state.

<!-- skopos:task-state:start -->
```json
{
  "schemaVersion": 1,
  "id": "T-a58c4be5",
  "type": "task",
  "status": "active",
  "generatedAt": "2026-08-13T18:41:15.183Z",
  "updatedAt": "2026-08-13T18:57:03.839Z",
  "planIds": [],
  "parentTaskId": "T-f5b7397b",
  "childTasks": [],
  "state": "active",
  "detail": "standard",
  "title": "Publish the complete Unisane UI website and registry at ui.unisane.com",
  "goal": "Publish the complete Unisane UI website and registry at ui.unisane.com",
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
      "The complete docs and component gallery export as static files at the site root",
      "The same output contains the 94-item Shadcn registry under /r and schemas under /schema",
      "Cloudflare Workers Static Assets is the sole deployment target for ui.unisane.com",
      "The combined build and registry contract pass locally before any external deployment"
    ],
    "nonGoals": [],
    "constraints": []
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
      "ownedPathCount": 11,
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
    "baselineId": "baseline-f2047825b64cd1d3"
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
      "detail": "Carry out \"Publish the complete Unisane UI website and registry at ui.unisane.com\" inside the resolved scope before widening impact to adjacent areas.",
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
      "acceptanceCriterion": "The complete docs and component gallery export as static files at the site root",
      "phase": "closure",
      "actionIds": [],
      "guardIds": [],
      "evidence": "agent-observation"
    },
    {
      "id": "acceptance-2",
      "acceptanceCriterion": "The same output contains the 94-item Shadcn registry under /r and schemas under /schema",
      "phase": "closure",
      "actionIds": [],
      "guardIds": [],
      "evidence": "agent-observation"
    },
    {
      "id": "acceptance-3",
      "acceptanceCriterion": "Cloudflare Workers Static Assets is the sole deployment target for ui.unisane.com",
      "phase": "closure",
      "actionIds": [],
      "guardIds": [],
      "evidence": "agent-observation"
    },
    {
      "id": "acceptance-4",
      "acceptanceCriterion": "The combined build and registry contract pass locally before any external deployment",
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
      "resolutionReason": "Documented Cloudflare Workers Static Assets as the sole static website and registry deployment target for ui.unisane.com.",
      "resolvedAt": "2026-08-13T18:57:03.839Z",
      "resolvedByActorId": "child-t-a58c4be5"
    }
  ],
  "questions": [],
  "recommendations": [],
  "ownershipExpansions": [
    {
      "paths": [
        "eslint.config.mjs"
      ],
      "reason": "Keep generated static export output outside the canonical lint source boundary",
      "actorId": "child-t-a58c4be5",
      "recordedAt": "2026-08-13T18:51:27.886Z",
      "baselinePaths": [
        {
          "path": "eslint.config.mjs",
          "digest": "1a4df0c8b1c1b7c181b6fc51e9fb44ff677a5a8d4f0eff585fd8c9f15545312c"
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
        ".gitignore",
        "docs/work/tasks/T-f5b7397b-publish-a-deterministic-shadcn-compatible-static-registr.md"
      ],
      "reason": "Own the Wrangler cache ignore and generated parent-child Task linkage required by this hosting slice.",
      "actorId": "child-t-a58c4be5",
      "recordedAt": "2026-08-13T18:56:36.960Z",
      "baselinePaths": [
        {
          "path": ".gitignore",
          "digest": "43d577ed35ce0841ec0c826b8fce75973777354b3db1c2a39fd2588143e1f4d3"
        },
        {
          "path": "docs/work/tasks/T-f5b7397b-publish-a-deterministic-shadcn-compatible-static-registr.md",
          "digest": "7be37f591e876816a8e9c1f275cd01558b3cc32eb0704787b27de8818b25604b"
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
  ]
}
```
<!-- skopos:task-state:end -->
