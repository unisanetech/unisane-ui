---
id: 'PAT-caf2b7653ad3'
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
  - 'date'
  - 'picker'
  - 'visual'
  - 'composition'
  - 'behavior'
---

# FP-20260714 UI Date Picker Visual Composition Without A Behavior Contract

## Wrong Pattern

A date picker is treated as a visual combination of an input-shaped surface and a calendar-shaped surface. The field invents its own validation vocabulary, the calendar invents its own grid and localization rules, and the recipe invents document listeners, positioning, focus behavior, and modal attributes independently.

## Symptom / Failure Mode

The composed control looks complete while its contracts disagree. A locale-aware segmented input can open an English-only calendar, helper and error content share one ambiguous prop, the non-modal popup claims modal semantics, the trigger is skipped by keyboard navigation, and documentation can promise focus trapping that the implementation does not provide. Source-installed consumers inherit all of those decisions as local code.

## Root Cause

Visual composition was completed before foundation ownership was frozen. Date entry, date-grid interaction, field semantics, overlay behavior, positioning, and distribution proof were reviewed as styling details inside one component rather than independent reusable contracts composed by a recipe.

## Correct Pattern

1. Keep DateInput as the segmented field foundation with the shared `invalid`, `description`, `errorMessage`, label, size, and variant vocabulary.
2. Keep Calendar as a localized single-date grid with one roving tab stop, truthful selected/today/disabled state, bounded month navigation, and cross-month keyboard movement.
3. Keep DatePicker as the named recipe that composes DateInput and Calendar without duplicating their behavior.
4. Reuse the private overlay behavior and anchored-position owners for Escape, outside interaction, focus entry/return, portal rendering, collision handling, and topmost-layer coordination.
5. Describe the popup truthfully as non-modal; do not inert or trap the page unless the product explicitly uses a modal dialog.
6. Generate registry output from the runtime source and prove the complete local dependency closure in a clean repeat-safe installation.
7. Teach project-local imports publicly and flat runtime subpaths only to first-party Unisane applications.

## Detection Rule

- date-field props expose `error`, `helperText`, `labelBg`, or another vocabulary different from the canonical Field contract
- a composed picker owns document-level Escape/outside listeners instead of the shared overlay behavior owner
- a non-modal picker sets `aria-modal="true"`, removes its trigger from tab order, or claims focus trapping without implementing modal behavior
- Calendar uses `role="application"`, static English labels despite a locale-aware recipe, or more than one date-grid state owner
- public examples manually approximate the visual instead of rendering the actual source-installed recipe
- first-party date-family imports use the root barrel or `components/*` paths, or the clean fixture cannot install DatePicker transitively

## Fix Recipe

1. Inventory DateInput, Calendar, and DatePicker together while keeping month-only, time-only, and range selection outside the slice.
2. Freeze the foundation/recipe boundary, retained capabilities, hard-cut props, semantics, localization, and overlay behavior in a convergence workpack.
3. Implement and directly test each foundation before testing their composed recipe.
4. Migrate adopters, flat exports, actual public examples, and appearance-axis visual fixtures.
5. Regenerate the registry from source and prove clean, repeat-safe installation without a Unisane runtime.
6. Audit for zero retired props, private listeners, false modal semantics, vendor-specific source commentary, and non-flat imports before closure.

## Linked Artifacts

- Decision: `docs/decisions/D-20260714-ui-dual-distribution-and-theme-contract.md`
- Historical evidence: `P114-W12` — Date Picker Vertical Proof; `F-20260713-ui-source-distribution-and-theme-complexity` — UI Source Distribution, Component Contract, And Theme Complexity.

## Changelog

- `2026-07-14`: Linked the archived W12 closure proof after the date family passed strict convergence and every declared closure check.
- `2026-07-14`: Added after W12 found that visual DateInput plus Calendar composition hid divergent field, localization, overlay, keyboard, modal-semantic, import, and evidence contracts.
