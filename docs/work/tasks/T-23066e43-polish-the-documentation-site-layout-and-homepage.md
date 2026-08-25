---
title: "Task: Polish the documentation site layout and homepage"
status: active
owner: "codex"
id: T-23066e43
scope: "workspace"
role: task
lifecycle: active
authority: canonical
provenance: accepted
view: current
risk: standard
proofSubject: task-closure
proofBaseline: baseline-dad569d4d08d3dfa
lastUpdated: 2026-08-21
---

# Task: Polish the documentation site layout and homepage

## Changelog

- `2026-08-21`: Synchronized Task state `active` from Skopos.

## Goal

Polish the documentation site layout and homepage

## Acceptance

- The homepage has a clear, polished hierarchy that uses existing Unisane tokens and components.
- Homepage navigation is usable at desktop and mobile widths.
- Desktop and mobile viewport checks show no broken layout or horizontal overflow.

## Non-Goals

- None declared.

## Constraints

- None declared.

## Admission And Workflow

- Workflow: `tracked`
- Selected risk/detail: `standard` / `standard`
- Recommended risk/detail: `standard` / `standard`
- Selection source: `automatic`
- Reason: The work changes multiple paths, durable guidance, configuration, or a normal coordinated surface.

## Owned Paths

- `apps/docs/features/home/components/component-grid-section.tsx`
- `apps/docs/features/home/components/cta-section.tsx`
- `apps/docs/features/home/components/features-section.tsx`
- `apps/docs/features/home/components/hero-section.tsx`
- `apps/docs/features/home/components/hero-showcase.tsx`
- `apps/docs/features/home/components/home-page.tsx`
- `apps/docs/features/home/components/install-command.tsx`
- `apps/docs/features/home/components/section-layout.tsx`
- `apps/docs/features/home/components/system-anatomy-section.tsx`
- `apps/docs/features/shell/components/app-header.tsx`
- `apps/docs/features/shell/components/docs-shell.tsx`
- `apps/docs/features/shell/components/shell-route-layout.tsx`
- `design-qa.md`

## Ownership Expansions

- `2026-08-15T13:05:38.021Z` by `codex`: `apps/docs/features/home/components/hero-showcase.tsx`, `apps/docs/features/shell/components/app-header.tsx` — Adopt reviewed changed paths discovered during active work.
- `2026-08-15T16:14:27.382Z` by `codex`: `apps/docs/features/home/components/install-command.tsx`, `apps/docs/features/home/components/system-anatomy-section.tsx`, `design-qa.md` — Implement the approved homepage visual and capture required design QA evidence

## Steps

- [x] **Record Task risk and detail before editing** (implementation, complete) — Confirm whether Task risk is light, standard, or high-impact. Keep the active Task current, use a Plan only for multi-Task direction, add a Decision for durable choices, and add or update a Finding for structural gaps.
- [x] **Review the current pattern in unisane-ui** (implementation, complete) — Use the compact references to confirm the current scope, command surface, and docs entrypoints before editing code.
- [x] **Implement the smallest scoped change** (implementation, complete) — Carry out "Polish the documentation site layout and homepage" inside the resolved scope before widening impact to adjacent areas.
- [x] **Sync docs and instruction surfaces if touched** (docs, complete) — Keep docs, instruction mirrors, and generated project knowledge aligned with the implementation.
- [x] **Build affected project** (action, complete) — Required by Guard quality.build.
- [x] **Lint affected code** (action, complete) — Required by Guard quality.lint.
- [x] **Run focused UI proof phase** (action, complete) — Required by Guard ui.accessibility-proof.
- [x] **Test affected behavior** (action, complete) — Required by Guard quality.test.
- [x] **Typecheck affected code** (action, complete) — Required by Guard quality.typecheck.
- [ ] **Capture responsive UI proof** (action, pending) — Required by Guard ui.accessibility-proof.

## Actions And Guards

- Action `quality.build`: Required by Guard quality.build.
- Action `quality.lint`: Required by Guard quality.lint.
- Action `quality.run-proof-phase`: Required by Guard ui.accessibility-proof.
- Action `quality.test`: Required by Guard quality.test.
- Action `quality.typecheck`: Required by Guard quality.typecheck.
- Action `ui.capture-responsive-proof`: Required by Guard ui.accessibility-proof.
- Guard `quality.build`
- Guard `quality.lint`
- Guard `quality.test`
- Guard `quality.typecheck`
- Guard `ui.accessibility-proof`

## Evidence And Readiness

- The homepage has a clear, polished hierarchy that uses existing Unisane tokens and components. (closure, agent-observation)
- Homepage navigation is usable at desktop and mobile widths. (closure, agent-observation)
- Desktop and mobile viewport checks show no broken layout or horizontal overflow. (closure, agent-observation)
- Guard quality.build: Build affected project (closure, source-bound-action)
- Guard quality.lint: Lint affected code (closure, source-bound-action)
- Guard quality.test: Test affected behavior (closure, source-bound-action)
- Guard quality.typecheck: Typecheck affected code (closure, source-bound-action)
- Guard ui.accessibility-proof: Require UI accessibility and rendered-behavior evidence (closure, source-bound-action)

## Memory Obligations

- No durable Memory obligation is inferred.

## Portable Task State

This machine-readable block is the durable source used to rebuild local Skopos state.

<!-- skopos:task-state:start -->
```json
{
  "schemaVersion": 1,
  "id": "T-23066e43",
  "type": "task",
  "status": "active",
  "generatedAt": "2026-08-15T13:00:28.561Z",
  "updatedAt": "2026-08-21T11:02:21.361Z",
  "planIds": [],
  "childTasks": [],
  "state": "active",
  "detail": "standard",
  "title": "Polish the documentation site layout and homepage",
  "goal": "Polish the documentation site layout and homepage",
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
      "The homepage has a clear, polished hierarchy that uses existing Unisane tokens and components.",
      "Homepage navigation is usable at desktop and mobile widths.",
      "Desktop and mobile viewport checks show no broken layout or horizontal overflow."
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
    "selectionSource": "automatic",
    "workflow": "tracked",
    "reasons": [
      "The work changes multiple paths, durable guidance, configuration, or a normal coordinated surface."
    ],
    "signals": {
      "goalSignals": [],
      "ownedPathCount": 8,
      "affectedScopeIds": [
        "workspace"
      ],
      "impactCategories": [
        "workspace-file"
      ],
      "proofSubjectKind": "task-closure"
    }
  },
  "proofSubject": {
    "kind": "task-closure",
    "baselineId": "baseline-dad569d4d08d3dfa"
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
      "detail": "Carry out \"Polish the documentation site layout and homepage\" inside the resolved scope before widening impact to adjacent areas.",
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
      "status": "pending"
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
        "apps/docs/features/home/components/component-grid-section.tsx",
        "apps/docs/features/home/components/cta-section.tsx",
        "apps/docs/features/home/components/features-section.tsx",
        "apps/docs/features/home/components/hero-section.tsx",
        "apps/docs/features/home/components/hero-showcase.tsx",
        "apps/docs/features/home/components/home-page.tsx",
        "apps/docs/features/home/components/install-command.tsx",
        "apps/docs/features/home/components/section-layout.tsx",
        "apps/docs/features/home/components/system-anatomy-section.tsx",
        "apps/docs/features/shell/components/app-header.tsx",
        "apps/docs/features/shell/components/docs-shell.tsx",
        "apps/docs/features/shell/components/shell-route-layout.tsx"
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
        "apps/docs/features/home/components/component-grid-section.tsx",
        "apps/docs/features/home/components/cta-section.tsx",
        "apps/docs/features/home/components/features-section.tsx",
        "apps/docs/features/home/components/hero-section.tsx",
        "apps/docs/features/home/components/hero-showcase.tsx",
        "apps/docs/features/home/components/home-page.tsx",
        "apps/docs/features/home/components/install-command.tsx",
        "apps/docs/features/home/components/section-layout.tsx",
        "apps/docs/features/home/components/system-anatomy-section.tsx",
        "apps/docs/features/shell/components/app-header.tsx",
        "apps/docs/features/shell/components/docs-shell.tsx",
        "apps/docs/features/shell/components/shell-route-layout.tsx"
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
        "apps/docs/features/home/components/component-grid-section.tsx",
        "apps/docs/features/home/components/cta-section.tsx",
        "apps/docs/features/home/components/features-section.tsx",
        "apps/docs/features/home/components/hero-section.tsx",
        "apps/docs/features/home/components/hero-showcase.tsx",
        "apps/docs/features/home/components/home-page.tsx",
        "apps/docs/features/home/components/install-command.tsx",
        "apps/docs/features/home/components/section-layout.tsx",
        "apps/docs/features/home/components/system-anatomy-section.tsx",
        "apps/docs/features/shell/components/app-header.tsx",
        "apps/docs/features/shell/components/docs-shell.tsx",
        "apps/docs/features/shell/components/shell-route-layout.tsx"
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
        "apps/docs/features/home/components/component-grid-section.tsx",
        "apps/docs/features/home/components/cta-section.tsx",
        "apps/docs/features/home/components/features-section.tsx",
        "apps/docs/features/home/components/hero-section.tsx",
        "apps/docs/features/home/components/hero-showcase.tsx",
        "apps/docs/features/home/components/home-page.tsx",
        "apps/docs/features/home/components/install-command.tsx",
        "apps/docs/features/home/components/section-layout.tsx",
        "apps/docs/features/home/components/system-anatomy-section.tsx",
        "apps/docs/features/shell/components/app-header.tsx",
        "apps/docs/features/shell/components/docs-shell.tsx",
        "apps/docs/features/shell/components/shell-route-layout.tsx"
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
        "apps/docs/features/home/components/component-grid-section.tsx",
        "apps/docs/features/home/components/cta-section.tsx",
        "apps/docs/features/home/components/features-section.tsx",
        "apps/docs/features/home/components/hero-section.tsx",
        "apps/docs/features/home/components/hero-showcase.tsx",
        "apps/docs/features/home/components/home-page.tsx",
        "apps/docs/features/home/components/install-command.tsx",
        "apps/docs/features/home/components/section-layout.tsx",
        "apps/docs/features/home/components/system-anatomy-section.tsx",
        "apps/docs/features/shell/components/app-header.tsx",
        "apps/docs/features/shell/components/docs-shell.tsx",
        "apps/docs/features/shell/components/shell-route-layout.tsx"
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
        "apps/docs/features/home/components/component-grid-section.tsx",
        "apps/docs/features/home/components/cta-section.tsx",
        "apps/docs/features/home/components/features-section.tsx",
        "apps/docs/features/home/components/hero-section.tsx",
        "apps/docs/features/home/components/hero-showcase.tsx",
        "apps/docs/features/home/components/home-page.tsx",
        "apps/docs/features/home/components/install-command.tsx",
        "apps/docs/features/home/components/section-layout.tsx",
        "apps/docs/features/home/components/system-anatomy-section.tsx",
        "apps/docs/features/shell/components/app-header.tsx",
        "apps/docs/features/shell/components/docs-shell.tsx",
        "apps/docs/features/shell/components/shell-route-layout.tsx"
      ],
      "outputPaths": [
        "apps/docs/test-results"
      ],
      "requiresApproval": false
    }
  ],
  "selectedGuardIds": [
    "quality.build",
    "quality.lint",
    "quality.test",
    "quality.typecheck",
    "ui.accessibility-proof"
  ],
  "evidenceRequirements": [
    {
      "id": "acceptance-1",
      "acceptanceCriterion": "The homepage has a clear, polished hierarchy that uses existing Unisane tokens and components.",
      "phase": "closure",
      "actionIds": [],
      "guardIds": [],
      "evidence": "agent-observation"
    },
    {
      "id": "acceptance-2",
      "acceptanceCriterion": "Homepage navigation is usable at desktop and mobile widths.",
      "phase": "closure",
      "actionIds": [],
      "guardIds": [],
      "evidence": "agent-observation"
    },
    {
      "id": "acceptance-3",
      "acceptanceCriterion": "Desktop and mobile viewport checks show no broken layout or horizontal overflow.",
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
    }
  ],
  "memoryObligations": [],
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
      "status": "open"
    }
  ],
  "ownershipExpansions": [
    {
      "paths": [
        "apps/docs/features/home/components/hero-showcase.tsx",
        "apps/docs/features/shell/components/app-header.tsx"
      ],
      "reason": "Adopt reviewed changed paths discovered during active work.",
      "actorId": "codex",
      "recordedAt": "2026-08-15T13:05:38.021Z",
      "baselinePaths": [
        {
          "path": "apps/docs/features/home/components/hero-showcase.tsx",
          "digest": "c11deb84dfb3816ffa405bd19fff19624df87ed1de19c7796d9cf29f884ed341"
        },
        {
          "path": "apps/docs/features/shell/components/app-header.tsx",
          "digest": "fa32aeeb2eb0cf1a47fe283a431bea073c8364e9522b977f9f4b4a6a6fa28b1a"
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
        "apps/docs/features/home/components/install-command.tsx",
        "apps/docs/features/home/components/system-anatomy-section.tsx",
        "design-qa.md"
      ],
      "reason": "Implement the approved homepage visual and capture required design QA evidence",
      "actorId": "codex",
      "recordedAt": "2026-08-15T16:14:27.382Z",
      "baselinePaths": [
        {
          "path": "apps/docs/features/home/components/install-command.tsx",
          "digest": "ffa63583dfa6706b87d284b86b0d693a161e4840aad2c5cf6b5d27c3b9621f7d"
        },
        {
          "path": "apps/docs/features/home/components/system-anatomy-section.tsx",
          "digest": "ffa63583dfa6706b87d284b86b0d693a161e4840aad2c5cf6b5d27c3b9621f7d"
        },
        {
          "path": "design-qa.md",
          "digest": "ffa63583dfa6706b87d284b86b0d693a161e4840aad2c5cf6b5d27c3b9621f7d"
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
    "apps/docs/features/home/components/component-grid-section.tsx",
    "apps/docs/features/home/components/cta-section.tsx",
    "apps/docs/features/home/components/features-section.tsx",
    "apps/docs/features/home/components/hero-section.tsx",
    "apps/docs/features/home/components/hero-showcase.tsx",
    "apps/docs/features/home/components/home-page.tsx",
    "apps/docs/features/home/components/install-command.tsx",
    "apps/docs/features/home/components/section-layout.tsx",
    "apps/docs/features/home/components/system-anatomy-section.tsx",
    "apps/docs/features/shell/components/app-header.tsx",
    "apps/docs/features/shell/components/docs-shell.tsx",
    "apps/docs/features/shell/components/shell-route-layout.tsx",
    "design-qa.md"
  ]
}
```
<!-- skopos:task-state:end -->
