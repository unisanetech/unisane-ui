---
title: "Task: Fix and release combobox pointer focus race that drops held option clicks"
status: complete
owner: "codex-item-selection"
id: T-296b9633
scope: "workspace"
role: task
lifecycle: historical
authority: canonical
provenance: accepted
view: exception
risk: high-impact
proofSubject: task-closure
proofBaseline: baseline-79c6e17c9a9edd7f
lastUpdated: 2026-11-17
---

# Task: Fix and release combobox pointer focus race that drops held option clicks

## Changelog

- `2026-11-17`: Synchronized Task state `complete` from Skopos.

## Goal

Fix and release combobox pointer focus race that drops held option clicks

## Acceptance

- Keep input focus during primary option press; a click held beyond the100ms blur timeout selects exactly once, retaining keyboard, disabled and outside dismissal behavior. Verify and publish immutable UI package for Trade; no sibling source imports.

## Non-Goals

- None declared.

## Constraints

- None declared.

## Admission And Workflow

- Workflow: `strict`
- Selected risk/detail: `high-impact` / `detailed`
- Recommended risk/detail: `high-impact` / `detailed`
- Selection source: `explicit-override`
- Reason: The goal contains high-impact signal: release.

## Owned Paths

- `docs/reference/combobox-pointer-selection-20261117.md`
- `docs/reference/generated/repository-convergence-report.json`
- `docs/release-approval.json`
- `packages/data-table/package.json`
- `packages/email-templates/package.json`
- `packages/tokens/package.json`
- `packages/ui/package.json`
- `packages/ui/registry/components/combobox.tsx`
- `packages/ui/src/components/combobox.tsx`
- `packages/ui/tests/combobox/combobox.test.tsx`

## Ownership Expansions

- `2026-11-16T23:44:09.262Z` by `codex-item-selection`: `docs/release-approval.json`, `packages/data-table/package.json`, `packages/email-templates/package.json`, `packages/tokens/package.json` — Prepare the existing aligned four-package immutable release route, with version-only changes in unchanged packages and prepared rather than approved status; no registry publication is authorized by this metadata.
- `2026-11-17T08:22:35.735Z` by `codex-item-selection`: `docs/reference/generated/repository-convergence-report.json` — The existing selected release-convergence Action owns this generated release proof; adopt its declared output for the owner-approved immutable package publication.

## Steps

- [x] **Record Task risk and detail before editing** (implementation, complete) — Confirm whether Task risk is light, standard, or high-impact. Keep the active Task current, use a Plan only for multi-Task direction, add a Decision for durable choices, and add or update a Finding for structural gaps.
- [x] **Review the current pattern in unisane-ui** (implementation, complete) — Use the compact references to confirm the current scope, command surface, and docs entrypoints before editing code.
- [x] **Implement the smallest scoped change** (implementation, complete) — Carry out "Fix and release combobox pointer focus race that drops held option clicks" inside the resolved scope before widening impact to adjacent areas.
- [x] **Sync docs and instruction surfaces if touched** (docs, complete) — Keep docs, instruction mirrors, and generated project knowledge aligned with the implementation.
- [x] **Build affected project** (action, complete) — Required by Guard quality.build.
- [x] **Lint affected code** (action, complete) — Required by Guard quality.lint.
- [x] **Run focused UI proof phase** (action, complete) — Required by Guard ui.accessibility-proof.
- [x] **Test affected behavior** (action, complete) — Required by Guard quality.test.
- [x] **Typecheck affected code** (action, complete) — Required by Guard quality.typecheck.
- [x] **Capture responsive UI proof** (action, complete) — Required by Guard ui.accessibility-proof.
- [x] **Prepare the local DataTable candidate archive** (action, complete) — Required by Guard ui.data-table.prepare-candidate.
- [x] **Restore the complete locked UI workspace dependencies** (action, complete) — Required by Guard ui.hosted-release.
- [x] **Regenerate canonical release convergence evidence** (action, complete) — Required by Guard ui.hosted-release.
- [x] **Verify the exact hosted UI release archives** (action, complete) — Required by Guard ui.hosted-release.

## Actions And Guards

- Action `quality.build`: Required by Guard quality.build.
- Action `quality.lint`: Required by Guard quality.lint.
- Action `quality.run-proof-phase`: Required by Guard ui.accessibility-proof.
- Action `quality.test`: Required by Guard quality.test.
- Action `quality.typecheck`: Required by Guard quality.typecheck.
- Action `ui.capture-responsive-proof`: Required by Guard ui.accessibility-proof.
- Action `ui.data-table.prepare-candidate`: Required by Guard ui.data-table.prepare-candidate.
- Action `ui.dependencies.restore`: Required by Guard ui.hosted-release.
- Action `ui.hosted-release.convergence`: Required by Guard ui.hosted-release.
- Action `ui.hosted-release.packed`: Required by Guard ui.hosted-release.
- Guard `quality.build`
- Guard `quality.lint`
- Guard `quality.test`
- Guard `quality.typecheck`
- Guard `ui.accessibility-proof`
- Guard `ui.data-table.prepare-candidate`
- Guard `ui.hosted-release`

## Evidence And Readiness

- Keep input focus during primary option press; a click held beyond the100ms blur timeout selects exactly once, retaining keyboard, disabled and outside dismissal behavior. Verify and publish immutable UI package for Trade; no sibling source imports. (closure, agent-observation)
- Guard quality.build: Build affected project (closure, source-bound-action)
- Guard quality.lint: Lint affected code (closure, source-bound-action)
- Guard quality.test: Test affected behavior (closure, source-bound-action)
- Guard quality.typecheck: Typecheck affected code (closure, source-bound-action)
- Guard ui.accessibility-proof: Require UI accessibility and rendered-behavior evidence (closure, source-bound-action)
- Guard ui.data-table.prepare-candidate: Prepare the changed DataTable as its real distributable (closure, source-bound-action)
- Guard ui.hosted-release: Hosted UI prereleases require locked dependencies and packed consumer proof (closure, source-bound-action)

## Memory Obligations

- [complete] architecture: High-impact work must review and synchronize the existing architecture Memory for Scope workspace. (target: `docs/architecture/08-ui-application-architecture.md`); resolution: reviewed-no-change

## Portable Task State

This machine-readable block is the durable source used to rebuild local Skopos state.

<!-- skopos:task-state:start -->
```json
{
  "schemaVersion": 1,
  "id": "T-296b9633",
  "type": "task",
  "status": "durable",
  "generatedAt": "2026-11-16T23:35:09.740Z",
  "updatedAt": "2026-11-17T09:10:38.144Z",
  "planIds": [],
  "childTasks": [],
  "state": "complete",
  "detail": "detailed",
  "title": "Fix and release combobox pointer focus race that drops held option clicks",
  "goal": "Fix and release combobox pointer focus race that drops held option clicks",
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
      "Keep input focus during primary option press; a click held beyond the100ms blur timeout selects exactly once, retaining keyboard, disabled and outside dismissal behavior. Verify and publish immutable UI package for Trade; no sibling source imports."
    ],
    "nonGoals": [],
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
      "ownedPathCount": 5,
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
    "baselineId": "baseline-79c6e17c9a9edd7f"
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
      "detail": "Carry out \"Fix and release combobox pointer focus race that drops held option clicks\" inside the resolved scope before widening impact to adjacent areas.",
      "status": "complete"
    },
    {
      "id": "step-sync-knowledge",
      "kind": "docs",
      "title": "Sync docs and instruction surfaces if touched",
      "detail": "Keep docs, instruction mirrors, and generated project knowledge aligned with the implementation.",
      "status": "complete"
    },
    {
      "id": "action-quality.build",
      "kind": "action",
      "title": "Build affected project",
      "detail": "Required by Guard quality.build.",
      "status": "complete"
    },
    {
      "id": "action-quality.lint",
      "kind": "action",
      "title": "Lint affected code",
      "detail": "Required by Guard quality.lint.",
      "status": "complete"
    },
    {
      "id": "action-quality.run-proof-phase",
      "kind": "action",
      "title": "Run focused UI proof phase",
      "detail": "Required by Guard ui.accessibility-proof.",
      "status": "complete"
    },
    {
      "id": "action-quality.test",
      "kind": "action",
      "title": "Test affected behavior",
      "detail": "Required by Guard quality.test.",
      "status": "complete"
    },
    {
      "id": "action-quality.typecheck",
      "kind": "action",
      "title": "Typecheck affected code",
      "detail": "Required by Guard quality.typecheck.",
      "status": "complete"
    },
    {
      "id": "action-ui.capture-responsive-proof",
      "kind": "action",
      "title": "Capture responsive UI proof",
      "detail": "Required by Guard ui.accessibility-proof.",
      "status": "complete"
    },
    {
      "id": "action-ui.data-table.prepare-candidate",
      "kind": "action",
      "title": "Prepare the local DataTable candidate archive",
      "detail": "Required by Guard ui.data-table.prepare-candidate.",
      "status": "complete"
    },
    {
      "id": "action-ui.dependencies.restore",
      "kind": "action",
      "title": "Restore the complete locked UI workspace dependencies",
      "detail": "Required by Guard ui.hosted-release.",
      "status": "complete"
    },
    {
      "id": "action-ui.hosted-release.convergence",
      "kind": "action",
      "title": "Regenerate canonical release convergence evidence",
      "detail": "Required by Guard ui.hosted-release.",
      "status": "complete"
    },
    {
      "id": "action-ui.hosted-release.packed",
      "kind": "action",
      "title": "Verify the exact hosted UI release archives",
      "detail": "Required by Guard ui.hosted-release.",
      "status": "complete"
    }
  ],
  "selectedActions": [
    {
      "id": "quality.build",
      "title": "Build affected project",
      "category": "quality-check",
      "safety": "mutating",
      "sourcePath": "tools/skopos/actions/quality-build.yaml",
      "reason": "Required by Guard quality.build.",
      "matchedPaths": [
        "docs/reference/combobox-pointer-selection-20261117.md",
        "docs/reference/generated/repository-convergence-report.json",
        "docs/release-approval.json",
        "packages/data-table/package.json",
        "packages/email-templates/package.json",
        "packages/tokens/package.json",
        "packages/ui/package.json",
        "packages/ui/registry/components/combobox.tsx",
        "packages/ui/src/components/combobox.tsx",
        "packages/ui/tests/combobox/combobox.test.tsx"
      ],
      "outputPaths": [],
      "requiresApproval": true
    },
    {
      "id": "quality.lint",
      "title": "Lint affected code",
      "category": "quality-check",
      "safety": "read-only",
      "sourcePath": "tools/skopos/actions/quality-lint.yaml",
      "reason": "Required by Guard quality.lint.",
      "matchedPaths": [
        "docs/reference/combobox-pointer-selection-20261117.md",
        "docs/reference/generated/repository-convergence-report.json",
        "docs/release-approval.json",
        "packages/data-table/package.json",
        "packages/email-templates/package.json",
        "packages/tokens/package.json",
        "packages/ui/package.json",
        "packages/ui/registry/components/combobox.tsx",
        "packages/ui/src/components/combobox.tsx",
        "packages/ui/tests/combobox/combobox.test.tsx"
      ],
      "outputPaths": [],
      "requiresApproval": false
    },
    {
      "id": "quality.run-proof-phase",
      "title": "Run focused UI proof phase",
      "category": "quality-check",
      "safety": "read-only",
      "sourcePath": "tools/skopos/actions/quality-run-proof-phase.yaml",
      "reason": "Required by Guard ui.accessibility-proof.",
      "matchedPaths": [
        "packages/ui/registry/components/combobox.tsx",
        "packages/ui/src/components/combobox.tsx",
        "packages/ui/tests/combobox/combobox.test.tsx"
      ],
      "outputPaths": [],
      "requiresApproval": false
    },
    {
      "id": "quality.test",
      "title": "Test affected behavior",
      "category": "quality-check",
      "safety": "read-only",
      "sourcePath": "tools/skopos/actions/quality-test.yaml",
      "reason": "Required by Guard quality.test.",
      "matchedPaths": [
        "docs/reference/combobox-pointer-selection-20261117.md",
        "docs/reference/generated/repository-convergence-report.json",
        "docs/release-approval.json",
        "packages/data-table/package.json",
        "packages/email-templates/package.json",
        "packages/tokens/package.json",
        "packages/ui/package.json",
        "packages/ui/registry/components/combobox.tsx",
        "packages/ui/src/components/combobox.tsx",
        "packages/ui/tests/combobox/combobox.test.tsx"
      ],
      "outputPaths": [],
      "requiresApproval": false
    },
    {
      "id": "quality.typecheck",
      "title": "Typecheck affected code",
      "category": "quality-check",
      "safety": "read-only",
      "sourcePath": "tools/skopos/actions/quality-typecheck.yaml",
      "reason": "Required by Guard quality.typecheck.",
      "matchedPaths": [
        "docs/reference/combobox-pointer-selection-20261117.md",
        "docs/reference/generated/repository-convergence-report.json",
        "docs/release-approval.json",
        "packages/data-table/package.json",
        "packages/email-templates/package.json",
        "packages/tokens/package.json",
        "packages/ui/package.json",
        "packages/ui/registry/components/combobox.tsx",
        "packages/ui/src/components/combobox.tsx",
        "packages/ui/tests/combobox/combobox.test.tsx"
      ],
      "outputPaths": [],
      "requiresApproval": false
    },
    {
      "id": "ui.capture-responsive-proof",
      "title": "Capture responsive UI proof",
      "category": "quality-check",
      "safety": "artifact-producing",
      "sourcePath": "tools/skopos/actions/ui-capture-responsive-proof.yaml",
      "reason": "Required by Guard ui.accessibility-proof.",
      "matchedPaths": [
        "packages/ui/registry/components/combobox.tsx",
        "packages/ui/src/components/combobox.tsx",
        "packages/ui/tests/combobox/combobox.test.tsx"
      ],
      "outputPaths": [
        "apps/docs/test-results"
      ],
      "requiresApproval": false
    },
    {
      "id": "ui.data-table.prepare-candidate",
      "title": "Prepare the local DataTable candidate archive",
      "category": "quality-check",
      "safety": "artifact-producing",
      "sourcePath": "tools/skopos/actions/ui-data-table-prepare-candidate.yaml",
      "reason": "Required by Guard ui.data-table.prepare-candidate.",
      "matchedPaths": [
        "packages/data-table/package.json"
      ],
      "outputPaths": [
        ".tmp/data-table-candidate"
      ],
      "requiresApproval": false
    },
    {
      "id": "ui.dependencies.restore",
      "title": "Restore the complete locked UI workspace dependencies",
      "category": "maintenance",
      "safety": "mutating",
      "sourcePath": "tools/skopos/actions/ui-dependencies-restore.yaml",
      "reason": "Required by Guard ui.hosted-release.",
      "matchedPaths": [
        "docs/release-approval.json"
      ],
      "outputPaths": [
        "node_modules",
        "apps/docs/node_modules",
        "packages/ui/node_modules",
        "packages/tokens/node_modules",
        "packages/data-table/node_modules",
        "packages/ui-cli/node_modules",
        "packages/email-templates/node_modules"
      ],
      "requiresApproval": false
    },
    {
      "id": "ui.hosted-release.convergence",
      "title": "Regenerate canonical release convergence evidence",
      "category": "quality-check",
      "safety": "artifact-producing",
      "sourcePath": "tools/skopos/actions/ui-release-convergence.yaml",
      "reason": "Required by Guard ui.hosted-release.",
      "matchedPaths": [
        "docs/release-approval.json"
      ],
      "outputPaths": [
        "docs/reference/generated/repository-convergence-report.json"
      ],
      "requiresApproval": false
    },
    {
      "id": "ui.hosted-release.packed",
      "title": "Verify the exact hosted UI release archives",
      "category": "quality-check",
      "safety": "artifact-producing",
      "sourcePath": "tools/skopos/actions/ui-hosted-release.yaml",
      "reason": "Required by Guard ui.hosted-release.",
      "matchedPaths": [
        "docs/release-approval.json"
      ],
      "outputPaths": [
        ".tmp/release"
      ],
      "requiresApproval": false
    }
  ],
  "selectedGuardIds": [
    "quality.build",
    "quality.lint",
    "quality.test",
    "quality.typecheck",
    "ui.accessibility-proof",
    "ui.data-table.prepare-candidate",
    "ui.hosted-release"
  ],
  "evidenceRequirements": [
    {
      "id": "acceptance-1",
      "acceptanceCriterion": "Keep input focus during primary option press; a click held beyond the100ms blur timeout selects exactly once, retaining keyboard, disabled and outside dismissal behavior. Verify and publish immutable UI package for Trade; no sibling source imports.",
      "phase": "closure",
      "actionIds": [],
      "guardIds": [],
      "evidence": "agent-observation"
    },
    {
      "id": "guard-quality.build",
      "acceptanceCriterion": "Guard quality.build: Build affected project",
      "phase": "closure",
      "actionIds": [
        "quality.build"
      ],
      "guardIds": [
        "quality.build"
      ],
      "evidence": "source-bound-action"
    },
    {
      "id": "guard-quality.lint",
      "acceptanceCriterion": "Guard quality.lint: Lint affected code",
      "phase": "closure",
      "actionIds": [
        "quality.lint"
      ],
      "guardIds": [
        "quality.lint"
      ],
      "evidence": "source-bound-action"
    },
    {
      "id": "guard-quality.test",
      "acceptanceCriterion": "Guard quality.test: Test affected behavior",
      "phase": "closure",
      "actionIds": [
        "quality.test"
      ],
      "guardIds": [
        "quality.test"
      ],
      "evidence": "source-bound-action"
    },
    {
      "id": "guard-quality.typecheck",
      "acceptanceCriterion": "Guard quality.typecheck: Typecheck affected code",
      "phase": "closure",
      "actionIds": [
        "quality.typecheck"
      ],
      "guardIds": [
        "quality.typecheck"
      ],
      "evidence": "source-bound-action"
    },
    {
      "id": "guard-ui.accessibility-proof",
      "acceptanceCriterion": "Guard ui.accessibility-proof: Require UI accessibility and rendered-behavior evidence",
      "phase": "closure",
      "actionIds": [
        "quality.run-proof-phase",
        "ui.capture-responsive-proof"
      ],
      "guardIds": [
        "ui.accessibility-proof"
      ],
      "evidence": "source-bound-action"
    },
    {
      "id": "guard-ui.data-table.prepare-candidate",
      "acceptanceCriterion": "Guard ui.data-table.prepare-candidate: Prepare the changed DataTable as its real distributable",
      "phase": "closure",
      "actionIds": [
        "ui.data-table.prepare-candidate"
      ],
      "guardIds": [
        "ui.data-table.prepare-candidate"
      ],
      "evidence": "source-bound-action"
    },
    {
      "id": "guard-ui.hosted-release",
      "acceptanceCriterion": "Guard ui.hosted-release: Hosted UI prereleases require locked dependencies and packed consumer proof",
      "phase": "closure",
      "actionIds": [
        "ui.dependencies.restore",
        "ui.hosted-release.convergence",
        "ui.hosted-release.packed"
      ],
      "guardIds": [
        "ui.hosted-release"
      ],
      "evidence": "source-bound-action"
    }
  ],
  "memoryObligations": [
    {
      "id": "memory-architecture-2dff0510c1",
      "role": "architecture",
      "reason": "High-impact work must review and synchronize the existing architecture Memory for Scope workspace.",
      "status": "complete",
      "targetPath": "docs/architecture/08-ui-application-architecture.md",
      "resolution": "reviewed-no-change",
      "resolutionReason": "Reviewed native source/registry/runtime distribution and first-party UI architecture. Five-line primary-mousedown focus correction preserves existing API, keyboard and native overlay ownership; Trade must adopt a published immutable package rather than copying source. No architecture change.",
      "resolvedAt": "2026-11-16T23:46:34.276Z",
      "resolvedByActorId": "codex-item-selection"
    }
  ],
  "questions": [],
  "recommendations": [
    {
      "id": "run-quality.build",
      "title": "Build affected project",
      "summary": "Required by Guard quality.build.",
      "priority": "medium",
      "actionKind": "run-action",
      "actionId": "quality.build",
      "blocking": false,
      "status": "complete"
    },
    {
      "id": "run-quality.lint",
      "title": "Lint affected code",
      "summary": "Required by Guard quality.lint.",
      "priority": "medium",
      "actionKind": "run-action",
      "actionId": "quality.lint",
      "blocking": false,
      "status": "complete"
    },
    {
      "id": "run-quality.run-proof-phase",
      "title": "Run focused UI proof phase",
      "summary": "Required by Guard ui.accessibility-proof.",
      "priority": "medium",
      "actionKind": "run-action",
      "actionId": "quality.run-proof-phase",
      "blocking": false,
      "status": "complete"
    },
    {
      "id": "run-quality.test",
      "title": "Test affected behavior",
      "summary": "Required by Guard quality.test.",
      "priority": "medium",
      "actionKind": "run-action",
      "actionId": "quality.test",
      "blocking": false,
      "status": "complete"
    },
    {
      "id": "run-quality.typecheck",
      "title": "Typecheck affected code",
      "summary": "Required by Guard quality.typecheck.",
      "priority": "medium",
      "actionKind": "run-action",
      "actionId": "quality.typecheck",
      "blocking": false,
      "status": "complete"
    },
    {
      "id": "run-ui.capture-responsive-proof",
      "title": "Capture responsive UI proof",
      "summary": "Required by Guard ui.accessibility-proof.",
      "priority": "medium",
      "actionKind": "run-action",
      "actionId": "ui.capture-responsive-proof",
      "blocking": false,
      "status": "complete"
    },
    {
      "id": "run-ui.data-table.prepare-candidate",
      "title": "Prepare the local DataTable candidate archive",
      "summary": "Required by Guard ui.data-table.prepare-candidate.",
      "priority": "medium",
      "actionKind": "run-action",
      "actionId": "ui.data-table.prepare-candidate",
      "blocking": false,
      "status": "complete"
    },
    {
      "id": "run-ui.dependencies.restore",
      "title": "Restore the complete locked UI workspace dependencies",
      "summary": "Required by Guard ui.hosted-release.",
      "priority": "medium",
      "actionKind": "run-action",
      "actionId": "ui.dependencies.restore",
      "blocking": false,
      "status": "complete"
    },
    {
      "id": "run-ui.hosted-release.convergence",
      "title": "Regenerate canonical release convergence evidence",
      "summary": "Required by Guard ui.hosted-release.",
      "priority": "medium",
      "actionKind": "run-action",
      "actionId": "ui.hosted-release.convergence",
      "blocking": false,
      "status": "complete"
    },
    {
      "id": "run-ui.hosted-release.packed",
      "title": "Verify the exact hosted UI release archives",
      "summary": "Required by Guard ui.hosted-release.",
      "priority": "medium",
      "actionKind": "run-action",
      "actionId": "ui.hosted-release.packed",
      "blocking": false,
      "status": "complete"
    }
  ],
  "ownershipExpansions": [
    {
      "paths": [
        "docs/release-approval.json",
        "packages/data-table/package.json",
        "packages/email-templates/package.json",
        "packages/tokens/package.json"
      ],
      "reason": "Prepare the existing aligned four-package immutable release route, with version-only changes in unchanged packages and prepared rather than approved status; no registry publication is authorized by this metadata.",
      "actorId": "codex-item-selection",
      "recordedAt": "2026-11-16T23:44:09.262Z",
      "baselinePaths": [
        {
          "path": "docs/release-approval.json",
          "digest": "0808297f9d6d2b6ed00ade9c2fcb71b2e9e9f974a5a6ab819a46f71a769ac0a7",
          "digestAlgorithm": "skopos-path-v2-code-unit-segment-dfs"
        },
        {
          "path": "packages/data-table/package.json",
          "digest": "72bc35a10e4add83c9aa3fd4a8eed9ca9c7c779ff6e5a473b21d47a74b433233",
          "digestAlgorithm": "skopos-path-v2-code-unit-segment-dfs"
        },
        {
          "path": "packages/email-templates/package.json",
          "digest": "1f3abdf55ae73f7652af6003020ea4c5c8851796399548b587bdc3b54cc23732",
          "digestAlgorithm": "skopos-path-v2-code-unit-segment-dfs"
        },
        {
          "path": "packages/tokens/package.json",
          "digest": "703ba8a8b4df738798c0c5affda74faf836e5ab740e90d3309be1e28bff0d18d",
          "digestAlgorithm": "skopos-path-v2-code-unit-segment-dfs"
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
        "docs/reference/generated/repository-convergence-report.json"
      ],
      "reason": "The existing selected release-convergence Action owns this generated release proof; adopt its declared output for the owner-approved immutable package publication.",
      "actorId": "codex-item-selection",
      "recordedAt": "2026-11-17T08:22:35.735Z",
      "baselinePaths": [
        {
          "path": "docs/reference/generated/repository-convergence-report.json",
          "digest": "6b6cc7d1d79187d131a9a579206be055d7ad4d1eac263bce0c2a7547b763b63e",
          "digestAlgorithm": "skopos-path-v2-code-unit-segment-dfs"
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
    "docs/reference/combobox-pointer-selection-20261117.md",
    "docs/reference/generated/repository-convergence-report.json",
    "docs/release-approval.json",
    "packages/data-table/package.json",
    "packages/email-templates/package.json",
    "packages/tokens/package.json",
    "packages/ui/package.json",
    "packages/ui/registry/components/combobox.tsx",
    "packages/ui/src/components/combobox.tsx",
    "packages/ui/tests/combobox/combobox.test.tsx"
  ]
}
```
<!-- skopos:task-state:end -->
