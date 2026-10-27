---
title: "Task: Repair controlled Sheet overlay registration after deferred mount"
status: complete
owner: "trade-header-sheet-20261022"
id: T-f51142ae
scope: "workspace"
role: task
lifecycle: historical
authority: canonical
provenance: accepted
view: exception
risk: standard
proofSubject: task-closure
proofBaseline: baseline-e7d896e637a27bfa
lastUpdated: 2026-10-22
---

# Task: Repair controlled Sheet overlay registration after deferred mount

## Changelog

- `2026-10-22`: Synchronized Task state `complete` from Skopos.

## Goal

Repair controlled Sheet overlay registration after deferred mount

## Acceptance

- A Sheet opened from closed state focuses inside, isolates background, traps Tab and restores trigger focus; installed localhost snapshot preserves the fix.

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

- `apps/docs/e2e/datatable-regression.spec.ts`
- `apps/docs/e2e/visual-regression.spec.ts`
- `apps/docs/e2e/visual-regression.spec.ts-snapshots`
- `apps/docs/playwright.config.ts`
- `apps/docs/scripts/serve-static-fixtures.mjs`
- `docs/standards/testing-and-generated-artifacts.md`
- `packages/ui/registry/components/sheet.tsx`
- `packages/ui/registry/components/text-field.tsx`
- `packages/ui/registry/registry.json`
- `packages/ui/src/components/sheet.tsx`
- `packages/ui/src/components/text-field.tsx`
- `packages/ui/tests/sheet/sheet.test.tsx`
- `packages/ui/tests/text-field/text-field.test.tsx`
- `skopos.config.yaml`
- `tools/skopos/actions/quality-build.yaml`
- `tools/skopos/actions/quality-lint.yaml`
- `tools/skopos/actions/quality-test.yaml`
- `tools/skopos/actions/quality-typecheck.yaml`
- `tools/skopos/actions/ui-capture-responsive-proof.yaml`
- `tools/skopos/actions/ui-dependencies-restore.yaml`
- `tools/skopos/actions/ui-reviewed-visual-baselines.yaml`
- `tools/skopos/actions/ui-sheet-build.yaml`
- `tools/skopos/guards/ui-dependencies.yaml`
- `tools/skopos/guards/ui-reviewed-visual-baselines.yaml`
- `tools/skopos/guards/ui-sheet.yaml`

## Ownership Expansions

- `2026-10-22T13:06:51.484Z` by `trade-header-sheet-20261022`: `tools/skopos/actions/ui-sheet-build.yaml`, `tools/skopos/guards/ui-sheet.yaml` — Use the owner registry/build action for the approved Sheet repair without rebuilding unrelated applications first.
- `2026-10-22T13:49:53.925Z` by `trade-header-sheet-20261022`: `docs/standards/testing-and-generated-artifacts.md`, `tools/skopos/actions/ui-dependencies-restore.yaml`, `tools/skopos/guards/ui-dependencies.yaml` — User explicitly requested repairing the docs-app lint blocker. Missing frozen Next and MDX installations require normal whole-workspace dependency restoration, not application casts or weaker lint rules.
- `2026-10-22T17:05:34.786Z` by `trade-header-sheet-20261022`: `apps/docs/playwright.config.ts`, `apps/docs/scripts/serve-static-fixtures.mjs` — Repair canonical Playwright launcher to serve the existing production static export on loopback, instead of unsupported next start
- `2026-10-22T17:07:57.537Z` by `trade-header-sheet-20261022`: `apps/docs/e2e/visual-regression.spec.ts` — Collect every existing section mismatch in one canonical visual run instead of stopping at the first stale field baseline; no threshold or expected behavior relaxation
- `2026-10-22T17:09:43.877Z` by `trade-header-sheet-20261022`: `apps/docs/e2e/visual-regression.spec.ts-snapshots`, `tools/skopos/actions/ui-reviewed-visual-baselines.yaml`, `tools/skopos/guards/ui-reviewed-visual-baselines.yaml` — Review and regenerate 13 stale visual images exposed by repairing the canonical static-export launcher: six Select chevrons from existing committed sizing fix and seven 1–8 pixel glyph edges; keep all thresholds and independently rerun comparison
- `2026-10-22T17:11:23.251Z` by `trade-header-sheet-20261022`: `apps/docs/e2e/datatable-regression.spec.ts` — Wait for the wheel gesture scrollend before exact programmatic scroll positioning; preserve existing sticky-header and scroll-owner assertions instead of tolerating a race
- `2026-10-22T17:20:33.511Z` by `trade-header-sheet-20261022`: `skopos.config.yaml` — Exclude already Git-ignored generated docs static export from source fingerprints; visual rebuilds must not invalidate authored-source proof through disposable output
- `2026-10-22T17:24:21.504Z` by `trade-header-sheet-20261022`: `tools/skopos/actions/quality-build.yaml`, `tools/skopos/actions/quality-lint.yaml`, `tools/skopos/actions/quality-test.yaml`, `tools/skopos/actions/quality-typecheck.yaml`, `tools/skopos/actions/ui-capture-responsive-proof.yaml` — Bind unchanged quality commands to complete authored package/docs inputs explicitly; directory fingerprints do not apply nested Git/output ignores, so generated static chunks must not be declared as source inputs
- `2026-10-22T17:27:37.789Z` by `trade-header-sheet-20261022`: `packages/ui/registry/components/text-field.tsx`, `packages/ui/src/components/text-field.tsx`, `packages/ui/tests/text-field/text-field.test.tsx` — Repeated strict mobile visual comparison revealed genuine auto-resize measurement before font/visible width readiness. Re-measure through the existing autoResize path, test teardown and retain strict image thresholds; no new consumer publication is included.

## Steps

- [x] **Record Task risk and detail before editing** (implementation, complete) — Confirm whether Task risk is light, standard, or high-impact. Keep the active Task current, use a Plan only for multi-Task direction, add a Decision for durable choices, and add or update a Finding for structural gaps.
- [x] **Review the current pattern in unisane-ui** (implementation, complete) — Use the compact references to confirm the current scope, command surface, and docs entrypoints before editing code.
- [x] **Implement the smallest scoped change** (implementation, complete) — Carry out "Repair controlled Sheet overlay registration after deferred mount" inside the resolved scope before widening impact to adjacent areas.
- [x] **Sync docs and instruction surfaces if touched** (docs, complete) — Keep docs, instruction mirrors, and generated project knowledge aligned with the implementation.
- [x] **Build affected project** (action, complete) — Required by Guards quality.build, ui.dependencies.
- [x] **Lint affected code** (action, complete) — Required by Guards quality.lint, ui.dependencies.
- [x] **Run focused UI proof phase** (action, complete) — Required by Guards ui.accessibility-proof, ui.sheet.
- [x] **Test affected behavior** (action, complete) — Required by Guard quality.test.
- [x] **Typecheck affected code** (action, complete) — Required by Guards quality.typecheck, ui.dependencies.
- [x] **Capture responsive UI proof** (action, complete) — Required by Guards ui.accessibility-proof, ui.reviewed-visual-baselines.
- [x] **Restore the complete locked UI workspace dependencies** (action, complete) — Required by Guard ui.dependencies.
- [x] **Refresh reviewed docs visual baselines** (action, complete) — Required by Guard ui.reviewed-visual-baselines.
- [x] **Generate and build the shared Sheet package** (action, complete) — Required by Guard ui.sheet.

## Actions And Guards

- Action `quality.build`: Required by Guards quality.build, ui.dependencies.
- Action `quality.lint`: Required by Guards quality.lint, ui.dependencies.
- Action `quality.run-proof-phase`: Required by Guards ui.accessibility-proof, ui.sheet.
- Action `quality.test`: Required by Guard quality.test.
- Action `quality.typecheck`: Required by Guards quality.typecheck, ui.dependencies.
- Action `ui.capture-responsive-proof`: Required by Guards ui.accessibility-proof, ui.reviewed-visual-baselines.
- Action `ui.dependencies.restore`: Required by Guard ui.dependencies.
- Action `ui.refresh-reviewed-visual-baselines`: Required by Guard ui.reviewed-visual-baselines.
- Action `ui.sheet.build`: Required by Guard ui.sheet.
- Guard `quality.build`
- Guard `quality.lint`
- Guard `quality.test`
- Guard `quality.typecheck`
- Guard `ui.accessibility-proof`
- Guard `ui.dependencies`
- Guard `ui.reviewed-visual-baselines`
- Guard `ui.sheet`

## Evidence And Readiness

- A Sheet opened from closed state focuses inside, isolates background, traps Tab and restores trigger focus; installed localhost snapshot preserves the fix. (closure, agent-observation)
- Guard quality.build: Build affected project (closure, source-bound-action)
- Guard quality.lint: Lint affected code (closure, source-bound-action)
- Guard quality.test: Test affected behavior (closure, source-bound-action)
- Guard quality.typecheck: Typecheck affected code (closure, source-bound-action)
- Guard ui.accessibility-proof: Require UI accessibility and rendered-behavior evidence (closure, source-bound-action)
- Guard ui.dependencies: Verify locked docs dependencies without weakening type rules (closure, source-bound-action)
- Guard ui.reviewed-visual-baselines: Reviewed baselines still pass the unmodified comparison (closure, source-bound-action)
- Guard ui.sheet: Verify controlled Sheet distribution (closure, source-bound-action)

## Memory Obligations

- [complete] standard: The declared Task scope owns canonical standard Memory at docs/standards/testing-and-generated-artifacts.md; review and synchronize it if project truth changes. (target: `docs/standards/testing-and-generated-artifacts.md`); resolution: memory-updated

## Portable Task State

This machine-readable block is the durable source used to rebuild local Skopos state.

<!-- skopos:task-state:start -->
```json
{
  "schemaVersion": 1,
  "id": "T-f51142ae",
  "type": "task",
  "status": "durable",
  "generatedAt": "2026-10-22T13:05:51.606Z",
  "updatedAt": "2026-10-22T17:34:44.833Z",
  "planIds": [],
  "childTasks": [],
  "state": "complete",
  "detail": "standard",
  "title": "Repair controlled Sheet overlay registration after deferred mount",
  "goal": "Repair controlled Sheet overlay registration after deferred mount",
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
      "A Sheet opened from closed state focuses inside, isolates background, traps Tab and restores trigger focus; installed localhost snapshot preserves the fix."
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
      "ownedPathCount": 4,
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
    "baselineId": "baseline-e7d896e637a27bfa"
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
      "detail": "Carry out \"Repair controlled Sheet overlay registration after deferred mount\" inside the resolved scope before widening impact to adjacent areas.",
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
      "detail": "Required by Guards quality.build, ui.dependencies.",
      "status": "complete"
    },
    {
      "id": "action-quality.lint",
      "kind": "action",
      "title": "Lint affected code",
      "detail": "Required by Guards quality.lint, ui.dependencies.",
      "status": "complete"
    },
    {
      "id": "action-quality.run-proof-phase",
      "kind": "action",
      "title": "Run focused UI proof phase",
      "detail": "Required by Guards ui.accessibility-proof, ui.sheet.",
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
      "detail": "Required by Guards quality.typecheck, ui.dependencies.",
      "status": "complete"
    },
    {
      "id": "action-ui.capture-responsive-proof",
      "kind": "action",
      "title": "Capture responsive UI proof",
      "detail": "Required by Guards ui.accessibility-proof, ui.reviewed-visual-baselines.",
      "status": "complete"
    },
    {
      "id": "action-ui.dependencies.restore",
      "kind": "action",
      "title": "Restore the complete locked UI workspace dependencies",
      "detail": "Required by Guard ui.dependencies.",
      "status": "complete"
    },
    {
      "id": "action-ui.refresh-reviewed-visual-baselines",
      "kind": "action",
      "title": "Refresh reviewed docs visual baselines",
      "detail": "Required by Guard ui.reviewed-visual-baselines.",
      "status": "complete"
    },
    {
      "id": "action-ui.sheet.build",
      "kind": "action",
      "title": "Generate and build the shared Sheet package",
      "detail": "Required by Guard ui.sheet.",
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
      "reason": "Required by Guards quality.build, ui.dependencies.",
      "matchedPaths": [
        "apps/docs/e2e/datatable-regression.spec.ts",
        "apps/docs/e2e/visual-regression.spec.ts",
        "apps/docs/e2e/visual-regression.spec.ts-snapshots",
        "apps/docs/playwright.config.ts",
        "apps/docs/scripts/serve-static-fixtures.mjs",
        "docs/standards/testing-and-generated-artifacts.md",
        "packages/ui/registry/components/sheet.tsx",
        "packages/ui/registry/components/text-field.tsx",
        "packages/ui/registry/registry.json",
        "packages/ui/src/components/sheet.tsx",
        "packages/ui/src/components/text-field.tsx",
        "packages/ui/tests/sheet/sheet.test.tsx",
        "packages/ui/tests/text-field/text-field.test.tsx",
        "tools/skopos/actions/quality-build.yaml",
        "tools/skopos/actions/quality-lint.yaml",
        "tools/skopos/actions/quality-test.yaml",
        "tools/skopos/actions/quality-typecheck.yaml",
        "tools/skopos/actions/ui-capture-responsive-proof.yaml",
        "tools/skopos/actions/ui-dependencies-restore.yaml",
        "tools/skopos/actions/ui-reviewed-visual-baselines.yaml",
        "tools/skopos/actions/ui-sheet-build.yaml",
        "tools/skopos/guards/ui-dependencies.yaml",
        "tools/skopos/guards/ui-reviewed-visual-baselines.yaml",
        "tools/skopos/guards/ui-sheet.yaml"
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
      "reason": "Required by Guards quality.lint, ui.dependencies.",
      "matchedPaths": [
        "apps/docs/e2e/datatable-regression.spec.ts",
        "apps/docs/e2e/visual-regression.spec.ts",
        "apps/docs/e2e/visual-regression.spec.ts-snapshots",
        "apps/docs/playwright.config.ts",
        "apps/docs/scripts/serve-static-fixtures.mjs",
        "docs/standards/testing-and-generated-artifacts.md",
        "packages/ui/registry/components/sheet.tsx",
        "packages/ui/registry/components/text-field.tsx",
        "packages/ui/registry/registry.json",
        "packages/ui/src/components/sheet.tsx",
        "packages/ui/src/components/text-field.tsx",
        "packages/ui/tests/sheet/sheet.test.tsx",
        "packages/ui/tests/text-field/text-field.test.tsx",
        "tools/skopos/actions/quality-build.yaml",
        "tools/skopos/actions/quality-lint.yaml",
        "tools/skopos/actions/quality-test.yaml",
        "tools/skopos/actions/quality-typecheck.yaml",
        "tools/skopos/actions/ui-capture-responsive-proof.yaml",
        "tools/skopos/actions/ui-dependencies-restore.yaml",
        "tools/skopos/actions/ui-reviewed-visual-baselines.yaml",
        "tools/skopos/actions/ui-sheet-build.yaml",
        "tools/skopos/guards/ui-dependencies.yaml",
        "tools/skopos/guards/ui-reviewed-visual-baselines.yaml",
        "tools/skopos/guards/ui-sheet.yaml"
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
      "reason": "Required by Guards ui.accessibility-proof, ui.sheet.",
      "matchedPaths": [
        "apps/docs/e2e/datatable-regression.spec.ts",
        "apps/docs/e2e/visual-regression.spec.ts",
        "packages/ui/registry/components/sheet.tsx",
        "packages/ui/registry/components/text-field.tsx",
        "packages/ui/src/components/sheet.tsx",
        "packages/ui/src/components/text-field.tsx",
        "packages/ui/tests/sheet/sheet.test.tsx",
        "packages/ui/tests/text-field/text-field.test.tsx",
        "tools/skopos/actions/ui-sheet-build.yaml"
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
        "apps/docs/e2e/datatable-regression.spec.ts",
        "apps/docs/e2e/visual-regression.spec.ts",
        "apps/docs/e2e/visual-regression.spec.ts-snapshots",
        "apps/docs/playwright.config.ts",
        "apps/docs/scripts/serve-static-fixtures.mjs",
        "docs/standards/testing-and-generated-artifacts.md",
        "packages/ui/registry/components/sheet.tsx",
        "packages/ui/registry/components/text-field.tsx",
        "packages/ui/registry/registry.json",
        "packages/ui/src/components/sheet.tsx",
        "packages/ui/src/components/text-field.tsx",
        "packages/ui/tests/sheet/sheet.test.tsx",
        "packages/ui/tests/text-field/text-field.test.tsx",
        "tools/skopos/actions/quality-build.yaml",
        "tools/skopos/actions/quality-lint.yaml",
        "tools/skopos/actions/quality-test.yaml",
        "tools/skopos/actions/quality-typecheck.yaml",
        "tools/skopos/actions/ui-capture-responsive-proof.yaml",
        "tools/skopos/actions/ui-dependencies-restore.yaml",
        "tools/skopos/actions/ui-reviewed-visual-baselines.yaml",
        "tools/skopos/actions/ui-sheet-build.yaml",
        "tools/skopos/guards/ui-dependencies.yaml",
        "tools/skopos/guards/ui-reviewed-visual-baselines.yaml",
        "tools/skopos/guards/ui-sheet.yaml"
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
      "reason": "Required by Guards quality.typecheck, ui.dependencies.",
      "matchedPaths": [
        "apps/docs/e2e/datatable-regression.spec.ts",
        "apps/docs/e2e/visual-regression.spec.ts",
        "apps/docs/e2e/visual-regression.spec.ts-snapshots",
        "apps/docs/playwright.config.ts",
        "apps/docs/scripts/serve-static-fixtures.mjs",
        "docs/standards/testing-and-generated-artifacts.md",
        "packages/ui/registry/components/sheet.tsx",
        "packages/ui/registry/components/text-field.tsx",
        "packages/ui/registry/registry.json",
        "packages/ui/src/components/sheet.tsx",
        "packages/ui/src/components/text-field.tsx",
        "packages/ui/tests/sheet/sheet.test.tsx",
        "packages/ui/tests/text-field/text-field.test.tsx",
        "tools/skopos/actions/quality-build.yaml",
        "tools/skopos/actions/quality-lint.yaml",
        "tools/skopos/actions/quality-test.yaml",
        "tools/skopos/actions/quality-typecheck.yaml",
        "tools/skopos/actions/ui-capture-responsive-proof.yaml",
        "tools/skopos/actions/ui-dependencies-restore.yaml",
        "tools/skopos/actions/ui-reviewed-visual-baselines.yaml",
        "tools/skopos/actions/ui-sheet-build.yaml",
        "tools/skopos/guards/ui-dependencies.yaml",
        "tools/skopos/guards/ui-reviewed-visual-baselines.yaml",
        "tools/skopos/guards/ui-sheet.yaml"
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
      "reason": "Required by Guards ui.accessibility-proof, ui.reviewed-visual-baselines.",
      "matchedPaths": [
        "apps/docs/e2e/datatable-regression.spec.ts",
        "apps/docs/e2e/visual-regression.spec.ts",
        "packages/ui/registry/components/sheet.tsx",
        "packages/ui/registry/components/text-field.tsx",
        "packages/ui/src/components/sheet.tsx",
        "packages/ui/src/components/text-field.tsx",
        "packages/ui/tests/sheet/sheet.test.tsx",
        "packages/ui/tests/text-field/text-field.test.tsx",
        "tools/skopos/actions/ui-reviewed-visual-baselines.yaml"
      ],
      "outputPaths": [
        "apps/docs/test-results"
      ],
      "requiresApproval": false
    },
    {
      "id": "ui.dependencies.restore",
      "title": "Restore the complete locked UI workspace dependencies",
      "category": "maintenance",
      "safety": "mutating",
      "sourcePath": "tools/skopos/actions/ui-dependencies-restore.yaml",
      "reason": "Required by Guard ui.dependencies.",
      "matchedPaths": [
        "tools/skopos/actions/ui-dependencies-restore.yaml",
        "tools/skopos/guards/ui-dependencies.yaml"
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
      "id": "ui.refresh-reviewed-visual-baselines",
      "title": "Refresh reviewed docs visual baselines",
      "category": "maintenance",
      "safety": "mutating",
      "sourcePath": "tools/skopos/actions/ui-reviewed-visual-baselines.yaml",
      "reason": "Required by Guard ui.reviewed-visual-baselines.",
      "matchedPaths": [
        "tools/skopos/actions/ui-reviewed-visual-baselines.yaml"
      ],
      "outputPaths": [
        "apps/docs/e2e/visual-regression.spec.ts-snapshots",
        "apps/docs/test-results"
      ],
      "requiresApproval": true
    },
    {
      "id": "ui.sheet.build",
      "title": "Generate and build the shared Sheet package",
      "category": "quality-check",
      "safety": "artifact-producing",
      "sourcePath": "tools/skopos/actions/ui-sheet-build.yaml",
      "reason": "Required by Guard ui.sheet.",
      "matchedPaths": [
        "packages/ui/src/components/sheet.tsx",
        "packages/ui/tests/sheet/sheet.test.tsx",
        "tools/skopos/actions/ui-sheet-build.yaml"
      ],
      "outputPaths": [
        "packages/ui/registry",
        "packages/ui/dist"
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
    "ui.dependencies",
    "ui.reviewed-visual-baselines",
    "ui.sheet"
  ],
  "evidenceRequirements": [
    {
      "id": "acceptance-1",
      "acceptanceCriterion": "A Sheet opened from closed state focuses inside, isolates background, traps Tab and restores trigger focus; installed localhost snapshot preserves the fix.",
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
      "id": "guard-ui.dependencies",
      "acceptanceCriterion": "Guard ui.dependencies: Verify locked docs dependencies without weakening type rules",
      "phase": "closure",
      "actionIds": [
        "ui.dependencies.restore",
        "quality.lint",
        "quality.typecheck",
        "quality.build"
      ],
      "guardIds": [
        "ui.dependencies"
      ],
      "evidence": "source-bound-action"
    },
    {
      "id": "guard-ui.reviewed-visual-baselines",
      "acceptanceCriterion": "Guard ui.reviewed-visual-baselines: Reviewed baselines still pass the unmodified comparison",
      "phase": "closure",
      "actionIds": [
        "ui.refresh-reviewed-visual-baselines",
        "ui.capture-responsive-proof"
      ],
      "guardIds": [
        "ui.reviewed-visual-baselines"
      ],
      "evidence": "source-bound-action"
    },
    {
      "id": "guard-ui.sheet",
      "acceptanceCriterion": "Guard ui.sheet: Verify controlled Sheet distribution",
      "phase": "closure",
      "actionIds": [
        "ui.sheet.build",
        "quality.run-proof-phase"
      ],
      "guardIds": [
        "ui.sheet"
      ],
      "evidence": "source-bound-action"
    }
  ],
  "memoryObligations": [
    {
      "id": "memory-standard-e28f0a4be0",
      "role": "standard",
      "reason": "The declared Task scope owns canonical standard Memory at docs/standards/testing-and-generated-artifacts.md; review and synchronize it if project truth changes.",
      "status": "complete",
      "targetPath": "docs/standards/testing-and-generated-artifacts.md",
      "resolution": "memory-updated",
      "resolutionReason": "Documented verified missing-import recovery through the full frozen workspace install; no docs casts or unsafe-rule suppressions.",
      "resolvedAt": "2026-10-22T13:52:33.186Z",
      "resolvedByActorId": "trade-header-sheet-20261022"
    }
  ],
  "questions": [],
  "recommendations": [
    {
      "id": "start-bounded-child-task",
      "title": "Start a bounded child Task",
      "summary": "The Task may be drifting from its admitted subject because ownership expanded 9 times and new impact categories appeared (docs, root-config). Keep this Task intact and move the suggested paths into focused follow-up work.",
      "priority": "high",
      "actionKind": "start-child-task",
      "command": "skopos task child start 'T-f51142ae' 'Continue Repair controlled Sheet overlay registration after deferred mount as bounded follow-up work' . --scope 'workspace' --own 'apps/docs/e2e/datatable-regression.spec.ts' --own 'apps/docs/e2e/visual-regression.spec.ts' --own 'apps/docs/e2e/visual-regression.spec.ts-snapshots' --own 'apps/docs/playwright.config.ts' --own 'apps/docs/scripts/serve-static-fixtures.mjs' --own 'docs/standards/testing-and-generated-artifacts.md' --own 'packages/ui/registry/components/text-field.tsx' --own 'packages/ui/src/components/text-field.tsx' --own 'packages/ui/tests/text-field/text-field.test.tsx' --own 'skopos.config.yaml' --own 'tools/skopos/actions/quality-build.yaml' --own 'tools/skopos/actions/quality-lint.yaml' --own 'tools/skopos/actions/quality-test.yaml' --own 'tools/skopos/actions/quality-typecheck.yaml' --own 'tools/skopos/actions/ui-capture-responsive-proof.yaml' --own 'tools/skopos/actions/ui-dependencies-restore.yaml' --own 'tools/skopos/actions/ui-reviewed-visual-baselines.yaml' --own 'tools/skopos/actions/ui-sheet-build.yaml' --own 'tools/skopos/guards/ui-dependencies.yaml' --own 'tools/skopos/guards/ui-reviewed-visual-baselines.yaml' --own 'tools/skopos/guards/ui-sheet.yaml' --reason 'The Task may be drifting from its admitted subject because ownership expanded 9 times and new impact categories appeared (docs, root-config).' --actor 'trade-header-sheet-20261022'",
      "ownedPaths": [
        "apps/docs/e2e/datatable-regression.spec.ts",
        "apps/docs/e2e/visual-regression.spec.ts",
        "apps/docs/e2e/visual-regression.spec.ts-snapshots",
        "apps/docs/playwright.config.ts",
        "apps/docs/scripts/serve-static-fixtures.mjs",
        "docs/standards/testing-and-generated-artifacts.md",
        "packages/ui/registry/components/text-field.tsx",
        "packages/ui/src/components/text-field.tsx",
        "packages/ui/tests/text-field/text-field.test.tsx",
        "skopos.config.yaml",
        "tools/skopos/actions/quality-build.yaml",
        "tools/skopos/actions/quality-lint.yaml",
        "tools/skopos/actions/quality-test.yaml",
        "tools/skopos/actions/quality-typecheck.yaml",
        "tools/skopos/actions/ui-capture-responsive-proof.yaml",
        "tools/skopos/actions/ui-dependencies-restore.yaml",
        "tools/skopos/actions/ui-reviewed-visual-baselines.yaml",
        "tools/skopos/actions/ui-sheet-build.yaml",
        "tools/skopos/guards/ui-dependencies.yaml",
        "tools/skopos/guards/ui-reviewed-visual-baselines.yaml",
        "tools/skopos/guards/ui-sheet.yaml"
      ],
      "scopeId": "workspace",
      "reason": "The Task may be drifting from its admitted subject because ownership expanded 9 times and new impact categories appeared (docs, root-config).",
      "blocking": false,
      "status": "open"
    },
    {
      "id": "run-quality.build",
      "title": "Build affected project",
      "summary": "Required by Guards quality.build, ui.dependencies.",
      "priority": "medium",
      "actionKind": "run-action",
      "actionId": "quality.build",
      "blocking": false,
      "status": "complete"
    },
    {
      "id": "run-quality.lint",
      "title": "Lint affected code",
      "summary": "Required by Guards quality.lint, ui.dependencies.",
      "priority": "medium",
      "actionKind": "run-action",
      "actionId": "quality.lint",
      "blocking": false,
      "status": "complete"
    },
    {
      "id": "run-quality.run-proof-phase",
      "title": "Run focused UI proof phase",
      "summary": "Required by Guards ui.accessibility-proof, ui.sheet.",
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
      "summary": "Required by Guards quality.typecheck, ui.dependencies.",
      "priority": "medium",
      "actionKind": "run-action",
      "actionId": "quality.typecheck",
      "blocking": false,
      "status": "complete"
    },
    {
      "id": "run-ui.capture-responsive-proof",
      "title": "Capture responsive UI proof",
      "summary": "Required by Guards ui.accessibility-proof, ui.reviewed-visual-baselines.",
      "priority": "medium",
      "actionKind": "run-action",
      "actionId": "ui.capture-responsive-proof",
      "blocking": false,
      "status": "complete"
    },
    {
      "id": "run-ui.dependencies.restore",
      "title": "Restore the complete locked UI workspace dependencies",
      "summary": "Required by Guard ui.dependencies.",
      "priority": "medium",
      "actionKind": "run-action",
      "actionId": "ui.dependencies.restore",
      "blocking": false,
      "status": "open"
    },
    {
      "id": "run-ui.refresh-reviewed-visual-baselines",
      "title": "Refresh reviewed docs visual baselines",
      "summary": "Required by Guard ui.reviewed-visual-baselines.",
      "priority": "medium",
      "actionKind": "run-action",
      "actionId": "ui.refresh-reviewed-visual-baselines",
      "blocking": false,
      "status": "complete"
    },
    {
      "id": "run-ui.sheet.build",
      "title": "Generate and build the shared Sheet package",
      "summary": "Required by Guard ui.sheet.",
      "priority": "medium",
      "actionKind": "run-action",
      "actionId": "ui.sheet.build",
      "blocking": false,
      "status": "complete"
    }
  ],
  "ownershipExpansions": [
    {
      "paths": [
        "tools/skopos/actions/ui-sheet-build.yaml",
        "tools/skopos/guards/ui-sheet.yaml"
      ],
      "reason": "Use the owner registry/build action for the approved Sheet repair without rebuilding unrelated applications first.",
      "actorId": "trade-header-sheet-20261022",
      "recordedAt": "2026-10-22T13:06:51.484Z",
      "baselinePaths": [
        {
          "path": "tools/skopos/actions/ui-sheet-build.yaml",
          "digest": "f378833fe7ab82cb96ef5c414767fa086bc1b3912d2c613f4e45a656a8b7b403",
          "digestAlgorithm": "skopos-path-v2-code-unit-segment-dfs"
        },
        {
          "path": "tools/skopos/guards/ui-sheet.yaml",
          "digest": "5c31775defa891af94d3c8202c9e2aa7d12c8e6d8f44bb10bd49bd8a8a734db7",
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
        "docs/standards/testing-and-generated-artifacts.md",
        "tools/skopos/actions/ui-dependencies-restore.yaml",
        "tools/skopos/guards/ui-dependencies.yaml"
      ],
      "reason": "User explicitly requested repairing the docs-app lint blocker. Missing frozen Next and MDX installations require normal whole-workspace dependency restoration, not application casts or weaker lint rules.",
      "actorId": "trade-header-sheet-20261022",
      "recordedAt": "2026-10-22T13:49:53.925Z",
      "baselinePaths": [
        {
          "path": "docs/standards/testing-and-generated-artifacts.md",
          "digest": "29549f6d4607bf4070935d1f55677f9aa90564c73fcc4c9b99c3ad81298dbb1c",
          "digestAlgorithm": "skopos-path-v2-code-unit-segment-dfs"
        },
        {
          "path": "tools/skopos/actions/ui-dependencies-restore.yaml",
          "digest": "2647332bd1fbf2288417f54226e68319ce9633103cd883ea215dace1c004e9ed",
          "digestAlgorithm": "skopos-path-v2-code-unit-segment-dfs"
        },
        {
          "path": "tools/skopos/guards/ui-dependencies.yaml",
          "digest": "b8aa1a8b52d67b63c43490fddeafed280d57ff76d820347505e48a0beb1cfe9a",
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
        "apps/docs/playwright.config.ts",
        "apps/docs/scripts/serve-static-fixtures.mjs"
      ],
      "reason": "Repair canonical Playwright launcher to serve the existing production static export on loopback, instead of unsupported next start",
      "actorId": "trade-header-sheet-20261022",
      "recordedAt": "2026-10-22T17:05:34.786Z",
      "baselinePaths": [
        {
          "path": "apps/docs/playwright.config.ts",
          "digest": "38450d3f5d4f8d0bab135db6082c216111e0fd9d94d68554f19b03c0ab5ffc77",
          "digestAlgorithm": "skopos-path-v2-code-unit-segment-dfs"
        },
        {
          "path": "apps/docs/scripts/serve-static-fixtures.mjs",
          "digest": "c741529fff138771ffe43897f86e2e2b8d499014fabec9dec3d459ae8419bb24",
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
        "apps/docs/e2e/visual-regression.spec.ts"
      ],
      "reason": "Collect every existing section mismatch in one canonical visual run instead of stopping at the first stale field baseline; no threshold or expected behavior relaxation",
      "actorId": "trade-header-sheet-20261022",
      "recordedAt": "2026-10-22T17:07:57.537Z",
      "baselinePaths": [
        {
          "path": "apps/docs/e2e/visual-regression.spec.ts",
          "digest": "71dc00e334f21c04c8f91072c7031d51d1e03c3b62763ac91d56ca33ac83c6c2",
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
        "apps/docs/e2e/visual-regression.spec.ts-snapshots",
        "tools/skopos/actions/ui-reviewed-visual-baselines.yaml",
        "tools/skopos/guards/ui-reviewed-visual-baselines.yaml"
      ],
      "reason": "Review and regenerate 13 stale visual images exposed by repairing the canonical static-export launcher: six Select chevrons from existing committed sizing fix and seven 1–8 pixel glyph edges; keep all thresholds and independently rerun comparison",
      "actorId": "trade-header-sheet-20261022",
      "recordedAt": "2026-10-22T17:09:43.877Z",
      "baselinePaths": [
        {
          "path": "apps/docs/e2e/visual-regression.spec.ts-snapshots",
          "digest": "7b2b52c7a733d3d0843baa9996927fdc7b7d01edfe4704c5d09b77c8ee677678",
          "digestAlgorithm": "skopos-path-v2-code-unit-segment-dfs"
        },
        {
          "path": "tools/skopos/actions/ui-reviewed-visual-baselines.yaml",
          "digest": "09c658287acb8322601a92fdca01706edbd982da6697c9249d144c2159c6d2a8",
          "digestAlgorithm": "skopos-path-v2-code-unit-segment-dfs"
        },
        {
          "path": "tools/skopos/guards/ui-reviewed-visual-baselines.yaml",
          "digest": "a0ee89dec1d62c158689e50b281b3c3e278d5fe0f1db8894ee27423ea6771553",
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
        "apps/docs/e2e/datatable-regression.spec.ts"
      ],
      "reason": "Wait for the wheel gesture scrollend before exact programmatic scroll positioning; preserve existing sticky-header and scroll-owner assertions instead of tolerating a race",
      "actorId": "trade-header-sheet-20261022",
      "recordedAt": "2026-10-22T17:11:23.251Z",
      "baselinePaths": [
        {
          "path": "apps/docs/e2e/datatable-regression.spec.ts",
          "digest": "67f520cd1b11c38fc1cefeb8e7a3c0bc1562008be34639bc28a3ae1f192eeacb",
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
        "skopos.config.yaml"
      ],
      "reason": "Exclude already Git-ignored generated docs static export from source fingerprints; visual rebuilds must not invalidate authored-source proof through disposable output",
      "actorId": "trade-header-sheet-20261022",
      "recordedAt": "2026-10-22T17:20:33.511Z",
      "baselinePaths": [
        {
          "path": "skopos.config.yaml",
          "digest": "70b35860f719a5386d99e3b72079f1d748124fe5344ef834030ba2906c784bae",
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
        "tools/skopos/actions/quality-build.yaml",
        "tools/skopos/actions/quality-lint.yaml",
        "tools/skopos/actions/quality-test.yaml",
        "tools/skopos/actions/quality-typecheck.yaml",
        "tools/skopos/actions/ui-capture-responsive-proof.yaml"
      ],
      "reason": "Bind unchanged quality commands to complete authored package/docs inputs explicitly; directory fingerprints do not apply nested Git/output ignores, so generated static chunks must not be declared as source inputs",
      "actorId": "trade-header-sheet-20261022",
      "recordedAt": "2026-10-22T17:24:21.504Z",
      "baselinePaths": [
        {
          "path": "tools/skopos/actions/quality-build.yaml",
          "digest": "26c9ce1e82e77c4168b8b6c5a5c901efdc971fcc3cbc80fa64a3152b3510fc15",
          "digestAlgorithm": "skopos-path-v2-code-unit-segment-dfs"
        },
        {
          "path": "tools/skopos/actions/quality-lint.yaml",
          "digest": "5be87c0c4d1b4479941d940342dfcd5e2dac3644258cc55c00a7c2d803966178",
          "digestAlgorithm": "skopos-path-v2-code-unit-segment-dfs"
        },
        {
          "path": "tools/skopos/actions/quality-test.yaml",
          "digest": "2664d2235cf30df085be749caafd9e9a553dc4ae1c4c882f71626a0f1412ac3b",
          "digestAlgorithm": "skopos-path-v2-code-unit-segment-dfs"
        },
        {
          "path": "tools/skopos/actions/quality-typecheck.yaml",
          "digest": "2ab739666604747fcedf7a5eff4007d760470a2b2ed91d102a823897ddcd38c8",
          "digestAlgorithm": "skopos-path-v2-code-unit-segment-dfs"
        },
        {
          "path": "tools/skopos/actions/ui-capture-responsive-proof.yaml",
          "digest": "dba7f0be5d7b2bc91951df709a7cb5afdd6e1e93a72e0a00aa402a4c7fdfea5a",
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
        "packages/ui/registry/components/text-field.tsx",
        "packages/ui/src/components/text-field.tsx",
        "packages/ui/tests/text-field/text-field.test.tsx"
      ],
      "reason": "Repeated strict mobile visual comparison revealed genuine auto-resize measurement before font/visible width readiness. Re-measure through the existing autoResize path, test teardown and retain strict image thresholds; no new consumer publication is included.",
      "actorId": "trade-header-sheet-20261022",
      "recordedAt": "2026-10-22T17:27:37.789Z",
      "baselinePaths": [
        {
          "path": "packages/ui/registry/components/text-field.tsx",
          "digest": "2d81d276631bece2771275c6b938996f243e699c68413d813150a88aafcfac1d",
          "digestAlgorithm": "skopos-path-v2-code-unit-segment-dfs"
        },
        {
          "path": "packages/ui/src/components/text-field.tsx",
          "digest": "c44e2573b92b57eee7d0c0e5180d393e811ff348ec21efa1cce1581911ef355e",
          "digestAlgorithm": "skopos-path-v2-code-unit-segment-dfs"
        },
        {
          "path": "packages/ui/tests/text-field/text-field.test.tsx",
          "digest": "66c6c423b75742edad31298b8e8cbb44f895258c1901a7d75c04777901b4c505",
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
    "apps/docs/e2e/datatable-regression.spec.ts",
    "apps/docs/e2e/visual-regression.spec.ts",
    "apps/docs/e2e/visual-regression.spec.ts-snapshots",
    "apps/docs/playwright.config.ts",
    "apps/docs/scripts/serve-static-fixtures.mjs",
    "docs/standards/testing-and-generated-artifacts.md",
    "packages/ui/registry/components/sheet.tsx",
    "packages/ui/registry/components/text-field.tsx",
    "packages/ui/registry/registry.json",
    "packages/ui/src/components/sheet.tsx",
    "packages/ui/src/components/text-field.tsx",
    "packages/ui/tests/sheet/sheet.test.tsx",
    "packages/ui/tests/text-field/text-field.test.tsx",
    "skopos.config.yaml",
    "tools/skopos/actions/quality-build.yaml",
    "tools/skopos/actions/quality-lint.yaml",
    "tools/skopos/actions/quality-test.yaml",
    "tools/skopos/actions/quality-typecheck.yaml",
    "tools/skopos/actions/ui-capture-responsive-proof.yaml",
    "tools/skopos/actions/ui-dependencies-restore.yaml",
    "tools/skopos/actions/ui-reviewed-visual-baselines.yaml",
    "tools/skopos/actions/ui-sheet-build.yaml",
    "tools/skopos/guards/ui-dependencies.yaml",
    "tools/skopos/guards/ui-reviewed-visual-baselines.yaml",
    "tools/skopos/guards/ui-sheet.yaml"
  ]
}
```
<!-- skopos:task-state:end -->
