---
title: 'Task: Publish corrected stable Unisane UI 0.1.1 package family after the public Vite consumer found the invalid pnpm development flag'
status: complete
owner: 'bhaskarbarma'
id: T-ef5fbd67
scope: 'workspace'
role: task
lifecycle: historical
authority: canonical
provenance: accepted
view: exception
risk: high-impact
proofSubject: project-integration
proofBaseline: baseline-dbbfd92193bd3a13
lastUpdated: 2026-08-13
---

# Task: Publish corrected stable Unisane UI 0.1.1 package family after the public Vite consumer found the invalid pnpm development flag

## Changelog

- `2026-08-13`: Synchronized Task state `complete` from Skopos.

## Goal

Publish corrected stable Unisane UI 0.1.1 package family after the public Vite consumer found the invalid pnpm development flag

## Acceptance

- pnpm development dependencies use a supported exact flag and focused tests cover pnpm npm yarn and bun command generation
- the complete local and GitHub release gates pass at committed 0.1.1 source
- a clean external Vite consumer runs @unisane/ui-cli@latest init and add, has no Unisane runtime dependency, and builds
- exactly the five approved packages publish at latest 0.1.1 with provenance while next remains unchanged
- the optional runtime package imports from a clean external consumer and ui.unisane.com registry endpoints remain healthy

## Non-Goals

- Do not publish Unisane Core, Framework, docs, or packages outside unisane-ui

## Constraints

- Use the existing company GitHub provenance workflow and do not expose or rotate credentials

## Admission And Workflow

- Workflow: `strict`
- Selected risk/detail: `high-impact` / `detailed`
- Recommended risk/detail: `high-impact` / `detailed`
- Selection source: `proof-subject`
- Reason: Project-integration proof always requires strict high-impact work.

## Owned Paths

- `docs/guides/licensing-prerequisites.md`
- `docs/reference/generated/repository-convergence-report.json`
- `docs/release-approval.json`
- `docs/work/archive/tasks/T-ac8a7183-publish-the-stable-unisane-ui-0-1-0-package-family.md`
- `package.json`
- `packages/data-table/package.json`
- `packages/email-templates/certificates/packed-producer-certificate.json`
- `packages/email-templates/package.json`
- `packages/tokens/package.json`
- `packages/ui-cli/pack.manifest.json`
- `packages/ui-cli/package.json`
- `packages/ui-cli/src/commands/add-helpers.ts`
- `packages/ui-cli/src/commands/add.ts`
- `packages/ui-cli/src/commands/init.ts`
- `packages/ui-cli/src/commands/package-manager.ts`
- `packages/ui-cli/tests/add-helpers.test.ts`
- `packages/ui-cli/tests/package-manager.test.ts`
- `packages/ui-cli/tests/theme.test.ts`
- `packages/ui/package.json`
- `packages/ui/registry`
- `packages/ui/src/lib/utils.ts`
- `scripts/__tests__`
- `scripts/check-release-readiness.mjs`
- `scripts/check-repository-boundaries.mjs`
- `scripts/fixtures/packed-producer-consumer`
- `scripts/verify-email-templates-packed-producer-certificate.mjs`
- `scripts/verify-packed-producer-certificate.mjs`

## Ownership Expansions

- `2026-08-13T20:52:19.996Z` by `bhaskarbarma`: `packages/ui-cli/src/commands/add-helpers.ts`, `packages/ui-cli/src/commands/add.ts`, `packages/ui-cli/tests/add-helpers.test.ts`, `packages/ui/registry`, `packages/ui/src/lib/utils.ts` — The clean Vite build proved the copied source needs portable relative internal imports and must not depend on Node process globals.
- `2026-08-13T20:54:35.076Z` by `bhaskarbarma`: `packages/ui-cli/src/commands/init.ts`, `packages/ui-cli/tests/theme.test.ts` — The clean Vite build proved Tailwind directives need a generated PostCSS adapter configuration and exact dev dependency.
- `2026-08-13T20:58:59.901Z` by `bhaskarbarma`: `docs/work/archive/tasks/T-ac8a7183-publish-the-stable-unisane-ui-0-1-0-package-family.md` — Adopt the cancelled 0.1.0 release record whose failed clean-consumer proof directly caused this immutable 0.1.1 successor.

## Steps

- [x] **Should this plan change a public contract, route, or SDK surface?** (decision, complete) — Public-facing changes need explicit confirmation so the agent does not silently ship a breaking contract.
- [x] **Resolve plan decisions** (implementation, complete) — Answer the recommended ask-back questions before implementation so the agent does not guess on high-impact choices.
- [x] **Record Task risk and detail before editing** (implementation, complete) — Confirm whether Task risk is light, standard, or high-impact. Keep the active Task current, use a Plan only for multi-Task direction, add a Decision for durable choices, and add or update a Finding for structural gaps.
- [x] **Review the current pattern in unisane-ui** (implementation, complete) — Use the compact references to confirm the current scope, command surface, and docs entrypoints before editing code.
- [x] **Implement the smallest scoped change** (implementation, complete) — Carry out "Publish corrected stable Unisane UI 0.1.1 package family after the public Vite consumer found the invalid pnpm development flag" inside the resolved scope before widening impact to adjacent areas.
- [x] **Sync docs and instruction surfaces if touched** (docs, complete) — Keep docs, instruction mirrors, and generated project knowledge aligned with the implementation.

## Actions And Guards

- No Action or Guard is selected.

## Evidence And Readiness

- pnpm development dependencies use a supported exact flag and focused tests cover pnpm npm yarn and bun command generation (closure, agent-observation)
- the complete local and GitHub release gates pass at committed 0.1.1 source (closure, agent-observation)
- a clean external Vite consumer runs @unisane/ui-cli@latest init and add, has no Unisane runtime dependency, and builds (closure, agent-observation)
- exactly the five approved packages publish at latest 0.1.1 with provenance while next remains unchanged (closure, agent-observation)
- the optional runtime package imports from a clean external consumer and ui.unisane.com registry endpoints remain healthy (closure, agent-observation)

## Memory Obligations

- [complete] guide: The declared Task scope owns canonical guide Memory at docs/guides/licensing-prerequisites.md; review and synchronize it if project truth changes. (target: `docs/guides/licensing-prerequisites.md`); resolution: memory-updated

## Portable Task State

This machine-readable block is the durable source used to rebuild local Skopos state.

<!-- skopos:task-state:start -->

```json
{
  "schemaVersion": 1,
  "id": "T-ef5fbd67",
  "type": "task",
  "status": "durable",
  "generatedAt": "2026-08-13T20:46:37.304Z",
  "updatedAt": "2026-08-13T21:14:11.125Z",
  "planIds": [],
  "childTasks": [],
  "state": "complete",
  "detail": "detailed",
  "title": "Publish corrected stable Unisane UI 0.1.1 package family after the public Vite consumer found the invalid pnpm development flag",
  "goal": "Publish corrected stable Unisane UI 0.1.1 package family after the public Vite consumer found the invalid pnpm development flag",
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
      "pnpm development dependencies use a supported exact flag and focused tests cover pnpm npm yarn and bun command generation",
      "the complete local and GitHub release gates pass at committed 0.1.1 source",
      "a clean external Vite consumer runs @unisane/ui-cli@latest init and add, has no Unisane runtime dependency, and builds",
      "exactly the five approved packages publish at latest 0.1.1 with provenance while next remains unchanged",
      "the optional runtime package imports from a clean external consumer and ui.unisane.com registry endpoints remain healthy"
    ],
    "nonGoals": ["Do not publish Unisane Core, Framework, docs, or packages outside unisane-ui"],
    "constraints": [
      "Use the existing company GitHub provenance workflow and do not expose or rotate credentials"
    ]
  },
  "risk": "high-impact",
  "admission": {
    "recommendedRisk": "high-impact",
    "recommendedDetail": "detailed",
    "selectedRisk": "high-impact",
    "selectedDetail": "detailed",
    "selectionSource": "proof-subject",
    "workflow": "strict",
    "reasons": ["Project-integration proof always requires strict high-impact work."],
    "signals": {
      "goalSignals": [],
      "ownedPathCount": 19,
      "affectedScopeIds": ["workspace"],
      "impactCategories": ["docs", "workspace-file"],
      "proofSubjectKind": "project-integration"
    }
  },
  "proofSubject": {
    "kind": "project-integration",
    "baselineId": "baseline-dbbfd92193bd3a13"
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
      "detail": "Carry out \"Publish corrected stable Unisane UI 0.1.1 package family after the public Vite consumer found the invalid pnpm development flag\" inside the resolved scope before widening impact to adjacent areas.",
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
      "acceptanceCriterion": "pnpm development dependencies use a supported exact flag and focused tests cover pnpm npm yarn and bun command generation",
      "phase": "closure",
      "actionIds": [],
      "guardIds": [],
      "evidence": "agent-observation"
    },
    {
      "id": "acceptance-2",
      "acceptanceCriterion": "the complete local and GitHub release gates pass at committed 0.1.1 source",
      "phase": "closure",
      "actionIds": [],
      "guardIds": [],
      "evidence": "agent-observation"
    },
    {
      "id": "acceptance-3",
      "acceptanceCriterion": "a clean external Vite consumer runs @unisane/ui-cli@latest init and add, has no Unisane runtime dependency, and builds",
      "phase": "closure",
      "actionIds": [],
      "guardIds": [],
      "evidence": "agent-observation"
    },
    {
      "id": "acceptance-4",
      "acceptanceCriterion": "exactly the five approved packages publish at latest 0.1.1 with provenance while next remains unchanged",
      "phase": "closure",
      "actionIds": [],
      "guardIds": [],
      "evidence": "agent-observation"
    },
    {
      "id": "acceptance-5",
      "acceptanceCriterion": "the optional runtime package imports from a clean external consumer and ui.unisane.com registry endpoints remain healthy",
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
      "resolutionReason": "Updated the canonical release guide to corrected stable 0.1.1 latest publication.",
      "resolvedAt": "2026-08-13T20:58:48.763Z",
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
      "resolvedAt": "2026-08-13T20:47:11.225Z",
      "resolvedByActorId": "bhaskarbarma",
      "disposition": {
        "kind": "answered",
        "reason": "Selected Task question option no-public-contract-change.",
        "actorId": "bhaskarbarma",
        "recordedAt": "2026-08-13T20:47:11.225Z",
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
    },
    {
      "id": "start-bounded-child-task",
      "title": "Start a bounded child Task",
      "summary": "The Task may be drifting from its admitted subject because ownership expanded 3 times. Keep this Task intact and move the suggested paths into focused follow-up work.",
      "priority": "medium",
      "actionKind": "start-child-task",
      "command": "skopos task child start 'T-ef5fbd67' 'Continue Publish corrected stable Unisane UI 0.1.1 package family after the public Vite consumer found the invalid pnpm development flag as bounded follow-up work' . --scope 'workspace' --own 'docs/work/archive/tasks/T-ac8a7183-publish-the-stable-unisane-ui-0-1-0-package-family.md' --own 'packages/ui-cli/src/commands/add-helpers.ts' --own 'packages/ui-cli/src/commands/add.ts' --own 'packages/ui-cli/src/commands/init.ts' --own 'packages/ui-cli/tests/add-helpers.test.ts' --own 'packages/ui-cli/tests/theme.test.ts' --own 'packages/ui/registry' --own 'packages/ui/src/lib/utils.ts' --reason 'The Task may be drifting from its admitted subject because ownership expanded 3 times.' --actor 'bhaskarbarma'",
      "ownedPaths": [
        "docs/work/archive/tasks/T-ac8a7183-publish-the-stable-unisane-ui-0-1-0-package-family.md",
        "packages/ui-cli/src/commands/add-helpers.ts",
        "packages/ui-cli/src/commands/add.ts",
        "packages/ui-cli/src/commands/init.ts",
        "packages/ui-cli/tests/add-helpers.test.ts",
        "packages/ui-cli/tests/theme.test.ts",
        "packages/ui/registry",
        "packages/ui/src/lib/utils.ts"
      ],
      "scopeId": "workspace",
      "reason": "The Task may be drifting from its admitted subject because ownership expanded 3 times.",
      "blocking": false,
      "status": "open"
    }
  ],
  "ownershipExpansions": [
    {
      "paths": [
        "packages/ui-cli/src/commands/add-helpers.ts",
        "packages/ui-cli/src/commands/add.ts",
        "packages/ui-cli/tests/add-helpers.test.ts",
        "packages/ui/registry",
        "packages/ui/src/lib/utils.ts"
      ],
      "reason": "The clean Vite build proved the copied source needs portable relative internal imports and must not depend on Node process globals.",
      "actorId": "bhaskarbarma",
      "recordedAt": "2026-08-13T20:52:19.996Z",
      "baselinePaths": [
        {
          "path": "packages/ui-cli/src/commands/add-helpers.ts",
          "digest": "899ac0a133971268b1a7a2aecd91cba1d467a3f8c9225e45c47d7df05b7fe164"
        },
        {
          "path": "packages/ui-cli/src/commands/add.ts",
          "digest": "2e8d4134b2d072ea545dd2cfe196a35baf0e4c8ba3920115f2620db1ce10e7e6"
        },
        {
          "path": "packages/ui-cli/tests/add-helpers.test.ts",
          "digest": "e1e3179e75117068713515737eb47c5b29ca29d683632f0678515f5ee20ec73b"
        },
        {
          "path": "packages/ui/registry",
          "digest": "d31755069250ff0e352c6e010b2274fb9ba5aade6b7a49ed713543869aaf7be1"
        },
        {
          "path": "packages/ui/src/lib/utils.ts",
          "digest": "dbc18bc6c5d0e5cd699cc72a9d03271b8b1a02cae486b2771d1dc122ceecf362"
        }
      ],
      "classification": "within-scope",
      "priorScopeId": "workspace",
      "nextScopeId": "workspace",
      "affectedScopeIds": ["workspace"]
    },
    {
      "paths": ["packages/ui-cli/src/commands/init.ts", "packages/ui-cli/tests/theme.test.ts"],
      "reason": "The clean Vite build proved Tailwind directives need a generated PostCSS adapter configuration and exact dev dependency.",
      "actorId": "bhaskarbarma",
      "recordedAt": "2026-08-13T20:54:35.076Z",
      "baselinePaths": [
        {
          "path": "packages/ui-cli/src/commands/init.ts",
          "digest": "2a85f1cbcfd0c5fe2888520036834edb46308201ab153aee2d000a4ab629ea17"
        },
        {
          "path": "packages/ui-cli/tests/theme.test.ts",
          "digest": "585ce8356c61d6a35ebdbfb05d44aefdb34a77a14a8a3b2469ea512fde2978dc"
        }
      ],
      "classification": "within-scope",
      "priorScopeId": "workspace",
      "nextScopeId": "workspace",
      "affectedScopeIds": ["workspace"]
    },
    {
      "paths": [
        "docs/work/archive/tasks/T-ac8a7183-publish-the-stable-unisane-ui-0-1-0-package-family.md"
      ],
      "reason": "Adopt the cancelled 0.1.0 release record whose failed clean-consumer proof directly caused this immutable 0.1.1 successor.",
      "actorId": "bhaskarbarma",
      "recordedAt": "2026-08-13T20:58:59.901Z",
      "baselinePaths": [
        {
          "path": "docs/work/archive/tasks/T-ac8a7183-publish-the-stable-unisane-ui-0-1-0-package-family.md",
          "digest": "c94c8afce3b9a2531229c0f7bd5a6f3a940d4e1adb660af660ee039cf076ebf8"
        }
      ],
      "classification": "within-scope",
      "priorScopeId": "workspace",
      "nextScopeId": "workspace",
      "affectedScopeIds": ["workspace"]
    }
  ],
  "declaredOwnedPaths": [
    "docs/guides/licensing-prerequisites.md",
    "docs/reference/generated/repository-convergence-report.json",
    "docs/release-approval.json",
    "docs/work/archive/tasks/T-ac8a7183-publish-the-stable-unisane-ui-0-1-0-package-family.md",
    "package.json",
    "packages/data-table/package.json",
    "packages/email-templates/certificates/packed-producer-certificate.json",
    "packages/email-templates/package.json",
    "packages/tokens/package.json",
    "packages/ui-cli/pack.manifest.json",
    "packages/ui-cli/package.json",
    "packages/ui-cli/src/commands/add-helpers.ts",
    "packages/ui-cli/src/commands/add.ts",
    "packages/ui-cli/src/commands/init.ts",
    "packages/ui-cli/src/commands/package-manager.ts",
    "packages/ui-cli/tests/add-helpers.test.ts",
    "packages/ui-cli/tests/package-manager.test.ts",
    "packages/ui-cli/tests/theme.test.ts",
    "packages/ui/package.json",
    "packages/ui/registry",
    "packages/ui/src/lib/utils.ts",
    "scripts/__tests__",
    "scripts/check-release-readiness.mjs",
    "scripts/check-repository-boundaries.mjs",
    "scripts/fixtures/packed-producer-consumer",
    "scripts/verify-email-templates-packed-producer-certificate.mjs",
    "scripts/verify-packed-producer-certificate.mjs"
  ]
}
```

<!-- skopos:task-state:end -->
