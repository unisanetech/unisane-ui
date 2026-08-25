---
id: 'PAT-80d0fa925e80'
owner: 'unisane'
repository: unisane-ui
scope: workspace
role: pattern
lifecycle: durable
authority: supporting
provenance: accepted
view: current
kind: failure-pattern
status: accepted
appliesTo:
  - 'communication'
  - 'unevidenced'
  - 'maturity'
---

# FP-20260716 UI Communication Contract And Unevidenced Maturity

## Wrong Pattern

Related communication components invent separate content, title, icon, visibility, dismissal, action, and live-region vocabularies, while documentation labels them stable without direct behavioral and accessibility tests.

## Symptom / Failure Mode

Inline Alert accepts children but page-level Banner requires a message string. Banner must be controlled and dismissible even for persistent content, action identity depends on array position, and Alert announces neutral information assertively. Deep runtime imports remain common while both docs pages claim stable maturity despite having no direct tests.

## Root Cause

Visual variants and examples were added independently before the shared component vocabulary, distribution boundary, semantic live-region rules, and maturity evidence requirements were frozen. Documentation status became a manual assertion rather than a conclusion supported by runtime, registry, test, visual, and build proof.

## Correct Pattern

1. Keep distinct components for distinct jobs, but share predictable anatomy: children, rich title, semantic icon override/suppression, native attributes, and severity variants.
2. Default warning/error announcements to assertive semantics and neutral/info/success announcements to polite semantics; allow native ARIA overrides.
3. Make persistent Banner the default, controlled visibility optional, and dismissal opt-in through `onDismiss`.
4. Give array-driven actions stable ids, rich labels, disabled state, and explicit handlers.
5. Use flat runtime subpaths internally and project-local component paths externally.
6. Treat stable maturity as earned only after direct behavior/accessibility tests, registry installation, visual proof, typechecks, and production build evidence agree.

## Detection Rule

- related components use `message` versus `children` for the same content role
- a persistent communication component requires open/close state or always renders a dismiss control
- informational content unconditionally uses `role="alert"`
- array action keys depend on index rather than consumer-owned identity
- docs claim stable while the component lacks a direct test owner
- first-party code imports from `@unisane/ui/components/*` or the root barrel instead of a flat component subpath
- public examples import the runtime package instead of locally installed source

## Fix Recipe

1. Inventory the related family across source, docs, registry, exports, tests, visual fixtures, and adopters.
2. Freeze one anatomy and semantic contract while preserving each component's distinct job.
3. Hard-delete pre-`1.0` compatibility props, migrate consumers, and document the public migration.
4. Add focused direct tests before retaining or promoting stable status.
5. Regenerate registry output, prove repeat-safe local installation, and verify flat runtime exports.
6. Run strict residue, visual, type, build, docs, dependency, and formatting checks before closure.

## Linked Artifacts

- Decision: `docs/decisions/D-20260714-ui-dual-distribution-and-theme-contract.md`
- Historical evidence: `P114-W15` — Alert And Banner Contract Convergence; `F-20260713-ui-source-distribution-and-theme-complexity` — UI Source Distribution, Component Contract, And Theme Complexity.

## Changelog

- `2026-07-16`: Closed W15 with the correct communication contract, direct evidence-backed maturity, canonical delivery paths, and zero retired-pattern residue; retained this entry as the fleet-wide guardrail.
- `2026-07-16`: Added after Phase 6 inventory found divergent Alert/Banner contracts, incorrect default announcement urgency, deep runtime imports, and stable labels without direct tests.
