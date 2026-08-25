---
id: 'PAT-423e2f323d34'
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
  - 'pagination'
  - 'link'
  - 'action'
  - 'range'
---

# FP-20260718 UI Pagination Link Action And Range Drift

## Wrong Pattern

A pagination component renders anchor-shaped page numbers but prevents native hyperlink activation, keeps previous and next controls as buttons, accepts a custom renderer without complete anchor props, and hides fixed range assumptions inside the implementation.

## Symptom / Failure Mode

Modifier-click, open-in-new-tab, copy-link, browser navigation, and no-JavaScript behavior stop working even though `href` exists. Framework links cannot receive the complete semantic/event contract. Previous, page, and next destinations do not share one mode. Shrinking or invalid page counts render contradictory controls, English labels cannot be replaced, and a stable component has no evidence for its range or navigation behavior.

## Root Cause

Rendering and navigation ownership were mixed together before the public button-versus-link boundary was defined. A visual range recipe was treated as sufficient API design, so state normalization, localization, native element ownership, and evidence were deferred.

## Correct Pattern

1. Make button mode and link mode an explicit discriminated contract.
2. In link mode, render every active destination as a real hyperlink and do not prevent native activation merely to observe selection.
3. Give framework renderers the complete anchor props and require a React element result.
4. Keep page-number state controlled, normalize dynamic invalid bounds deterministically, and render nothing for zero pages.
5. Expose only the useful range-density control; keep first/last boundaries and semantic ellipses stable.
6. Forward native nav props/ref and localize every accessible name.
7. Prove range, state, native links, custom links, accessibility, delivery, installation, and appearance before claiming stable maturity.

## Detection Rule

- an anchor `onClick` always calls `preventDefault()`
- numbered pages are anchors while previous/next destinations remain buttons
- a custom link renderer receives only children or silently falls back on invalid output
- fixed range thresholds are inaccessible to consumers
- zero or invalid total pages render a navigation landmark
- labels are fixed strings and native nav props/ref are unavailable
- no-op variant/slot machinery survives without a public capability
- a stable Pagination has no direct tests

## Fix Recipe

1. Inventory runtime, registry, docs, exports, tests, fixtures, adopters, and shared navigation contracts.
2. Freeze normalized range semantics and the strict button/link union before editing.
3. Preserve real anchors, give custom renderers complete props, localize labels, and forward the nav boundary.
4. Remove no-op composition machinery and use canonical icon/action/token owners.
5. Add direct behavior, install, registry, docs, visual, type, build, and zero-residue proof.

## Linked Artifacts

- Decision: `docs/decisions/D-20260714-ui-dual-distribution-and-theme-contract.md`
- Workpack: [P114-W20](https://github.com/unisane/unisane/blob/5f6e0b3e3dea915b4267a266571c99150834f88b/docs/work/archive/tasks/P114-W20.md)
- Finding: [archived UI distribution finding](https://github.com/unisane/unisane/blob/5f6e0b3e3dea915b4267a266571c99150834f88b/docs/archive/findings/F-20260713-ui-source-distribution-and-theme-complexity.md)

## Changelog

- `2026-07-18`: Linked the closed W20 proof after native link/action ownership, normalized ranges, localizable nav semantics, canonical delivery, direct behavior/install/visual evidence, and zero retired residue passed formal closure.
- `2026-07-18`: Added after Pagination inventory found intercepted native links, mixed destination ownership, incomplete custom-link props, fixed range/state assumptions, non-localizable semantics, non-canonical delivery, and stable maturity without direct evidence.
