---
id: 'PAT-ed4f69aec7ef'
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
  - 'navigation'
  - 'presentation'
  - 'specific'
  - 'contracts'
---

# FP-20260715 UI Navigation Presentation-Specific Contracts

## Wrong Pattern

Each responsive navigation presentation invents its own item identifier, active-state props, callback shape, framework-link escape hatch, disabled behavior, and accessibility semantics. A generic navigation component family is then added beside bar, rail, drawer, and application-shell Sidebar instead of establishing one data and interaction contract.

## Symptom / Failure Mode

The same destination collection needs adapters when moving between mobile bar, desktop rail, persistent drawer, and modal drawer. Router links are integrated through different combinations of `asChild`, `children`, and `linkElement`; selection may be item-local or container-owned; disabled links behave differently; and documentation can promise modal focus behavior that one presentation does not implement.

## Root Cause

Visual presentations were authored independently before navigation item, selection, activation, link rendering, and shell-state ownership were frozen. Responsive variants therefore became separate component systems rather than views over the same navigation model.

## Correct Pattern

1. Keep one serializable `NavigationItem` contract with one `id` identity and shared label, icon, badge, link, disabled, hidden, external, and nested-item fields.
2. Give Bar, Rail, and Drawer the same controlled/uncontrolled selection and activation vocabulary.
3. Route native anchors, buttons, and framework links through one private action owner and one `renderLink` seam.
4. Keep presentation state local to selection; app-shell expansion, persistence, responsive orchestration, hover disclosure, and content inset belong to Sidebar.
5. Implement modal Drawer focus, inertness, dismissal, restoration, scroll lock, and portal behavior through the shared overlay foundation.
6. Generate registry output from runtime source and prove all presentation dependencies in a clean repeat-safe local installation.

## Detection Rule

- responsive presentations use both `id` and `value` for the same destination identity
- items carry presentation-local `active` props instead of container selection state
- framework links use multiple `asChild`, `children`, or `linkElement` APIs
- generic Nav hooks duplicate Sidebar persistence, breakpoint, hover, or drawer state
- destination buttons use toggle semantics such as `aria-pressed`
- modal Drawer docs claim containment that the implementation does not provide
- first-party imports use root or deep package paths, or local installation omits shared action/type dependencies

## Fix Recipe

1. Inventory Bar, Rail, Drawer, generic Nav, and Sidebar together, then bound presentation convergence separately from app-shell convergence.
2. Freeze the item, state, activation, link, semantics, retained capabilities, and hard-cut paths in a convergence workpack.
3. Implement and directly test one private action owner plus each responsive presentation.
4. Migrate flat exports, adopters, actual public examples, and visual fixtures.
5. Regenerate the registry and prove repeat-safe installation without a Unisane runtime.
6. Audit zero competing item/state/link contracts before opening the nested Sidebar slice.

## Linked Artifacts

- Decision: `docs/decisions/D-20260714-ui-dual-distribution-and-theme-contract.md`
- Historical evidence: `P114-W13` — Navigation Presentation Vertical Proof; `F-20260713-ui-source-distribution-and-theme-complexity` — UI Source Distribution, Component Contract, And Theme Complexity.

## Changelog

- `2026-07-15`: Linked the formally closed and archived W13 proof after zero competing navigation contract residue and complete runtime/registry/install evidence.
- `2026-07-15`: Added after W13 found that independently authored responsive navigation presentations created incompatible item, selection, link, disabled, modal, import, and evidence contracts.
