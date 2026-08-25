---
id: 'PAT-4fa12a9d319f'
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
  - 'selection'
  - 'control'
  - 'dual'
  - 'api'
  - 'semantic'
---

# FP-20260716 UI Selection-Control Dual API And Semantic Drift

## Wrong Pattern

Related native controls use private and divergent label, validation, icon, size, and wrapper contracts while a higher-level selection component publishes both options-array and manual-child APIs with different behavior and union-valued state.

## Symptom / Failure Mode

Checkbox and Radio accept visual `error` while Switch cannot publish invalid state; labels are string-only and prop types are private. A no-behavior `selection-controls` barrel creates a second install/import owner. SegmentedButton switches between an options recipe and manual `SegmentedButtonItem` children, uses `multiSelect` to hide `string | string[]` callbacks, and gives the two paths different roles and keyboard behavior. Stable labels exist without direct tests.

## Root Cause

Visual components were authored independently and later grouped by filename rather than by a frozen public contract. Convenience APIs accumulated beside the original path without choosing one owner, while type, accessibility, distribution, and maturity evidence remained secondary.

## Correct Pattern

1. Keep native Checkbox, Radio, and Switch events/attributes familiar; export their prop types and use rich labels plus semantic `invalid` state consistently.
2. Use explicit capability names such as `showIcons` and document that `className` styles the labelled root.
3. Install and import concrete components; do not add a grouped barrel that owns no behavior.
4. Give a high-level options-driven selection recipe one authoring model and use a discriminant so single and multiple state cannot be confused.
5. Require an accessible group name and implement one keyboard/focus model per selection mode, including disabled-option and RTL behavior.
6. Keep stable maturity only after direct behavior/accessibility, registry, visual, type, and build evidence agrees.

## Detection Rule

- sibling controls use `error`, `invalid`, or no validation semantics for the same job
- labels are artificially string-only or public prop types are not exported
- a grouped component file only re-exports concrete controls
- one selection component accepts both options and children with separate item state APIs
- a boolean changes callback/value types to a union and consumers must cast
- a composite selection group is unnamed or makes every item an independent tab stop
- docs claim stable without direct component tests

## Fix Recipe

1. Inventory source, generated registry, exports, docs, tests, fixtures, and all adopters.
2. Freeze retained native and visual capabilities before selecting one vocabulary and high-level authoring model.
3. Use a hard cut before `1.0`: migrate consumers and delete duplicate owners/props instead of adding aliases.
4. Add direct semantics, keyboard, controlled/uncontrolled, disabled, ref, SSR, registry-install, and visual proof.
5. Enforce flat internal imports and project-local external examples.
6. Run strict residue, type, build, docs, dependency, dead-code, formatting, and workpack closure checks.

## Linked Artifacts

- Decision: `docs/decisions/D-20260714-ui-dual-distribution-and-theme-contract.md`
- Workpack: [P114-W16](https://github.com/unisane/unisane/blob/5f6e0b3e3dea915b4267a266571c99150834f88b/docs/work/archive/tasks/P114-W16.md)
- Finding: [archived UI distribution finding](https://github.com/unisane/unisane/blob/5f6e0b3e3dea915b4267a266571c99150834f88b/docs/archive/findings/F-20260713-ui-source-distribution-and-theme-complexity.md)

## Changelog

- `2026-07-16`: Linked the closed W16 proof after divergent native semantics, the duplicate selection owner, dual SegmentedButton authoring/state models, incomplete keyboard behavior, and unevidenced maturity were removed from runtime, registry, docs, and adopters.
- `2026-07-16`: Added after Phase 6 inventory found divergent native-control vocabulary, a redundant grouped owner, dual SegmentedButton authoring/state models, incomplete keyboard semantics, non-canonical imports, and stable labels without direct tests.
