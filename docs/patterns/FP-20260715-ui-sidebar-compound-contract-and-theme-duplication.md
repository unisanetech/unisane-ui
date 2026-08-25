---
id: 'PAT-5e8e160a74ea'
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
  - 'sidebar'
  - 'compound'
  - 'theme'
  - 'duplication'
---

# FP-20260715 UI Sidebar Compound Contract And Theme Duplication

## Wrong Pattern

A high-level application-shell recipe republishes item, selection, link, visual-theme, and overlay contracts already owned by lower foundations, then exposes every internal wrapper as a public compound component. Consumers manually map the same navigation catalog into rail items, drawer items, nested groups, active flags, and framework links.

## Symptom / Failure Mode

An ordinary shell needs a provider plus more than a dozen compound imports. Route state uses different vocabulary from other navigation presentations, responsive behavior keeps a compatibility value, each app duplicates nested rendering, and component-local presets/tokens compete with global theme and density controls. Modal naming, backdrop, focus, and dismissal ownership become split across several pieces.

## Root Cause

Sidebar grew feature-by-feature before its responsibility as an application-shell recipe was separated from canonical navigation presentations, controlled state, overlay behavior, and semantic theming. Internal layout pieces became public API instead of implementation detail or named slots.

## Correct Pattern

1. Keep Sidebar as the owner of responsive rail/drawer orchestration, expansion, hover disclosure, persistence, breakpoints, and content inset.
2. Consume the canonical `NavigationItem`, selection, activation, and `renderLink` contracts.
3. Render top-level rail, contextual desktop drawer, and complete nested overlay navigation from one item collection.
4. Expose a small shell composition surface with explicit header/footer slots and a required accessible drawer name.
5. Use the shared controllable-state and overlay foundations for controlled state, Escape, outside dismissal, focus containment/restoration, and scroll locking.
6. Use semantic global tokens, appearance axes, CSS variables, and local classes for visual customization; do not create a component-specific theme system.
7. Generate the nested registry output from the runtime source and verify a clean project can install, typecheck, build, and repeat the installation without a Unisane runtime dependency.

## Detection Rule

- the same item collection is mapped separately into rail and drawer item components
- Sidebar exposes item-local `active`, `asChild`, `childIds`, or a callback vocabulary different from other navigation presentations
- `adaptive` survives as a compatibility input instead of being the default responsive resolution policy
- a Sidebar visual preset or token object duplicates semantic theme variables
- backdrop, modal surface, focus trap, Escape, and restoration have separate owners
- first-party consumers import Sidebar through a deep or root package path
- the nested registry fixture only checks copied paths and not dependency-complete compilation/build behavior

## Fix Recipe

1. Inventory the provider, structural components, tests, registry entry, docs, and real app-shell consumers together.
2. Freeze retained shell capabilities and the hard-cut item/state/link/theme/overlay contract in a convergence workpack.
3. Build array-driven rail and nested drawer presentations over the canonical navigation action and state foundations.
4. Replace manual compound mappings with provider configuration plus named shell slots.
5. Migrate flat runtime imports and project-local source docs, regenerate registry output, and test both distributions.
6. Audit zero legacy compounds, callbacks, behavior strings, visual theme layers, branded DOM markers, and deep imports.

## Linked Artifacts

- Decision: `docs/decisions/D-20260714-ui-dual-distribution-and-theme-contract.md`
- Historical evidence: `P114-W14` — Nested Sidebar And App-Shell Convergence; `F-20260713-ui-source-distribution-and-theme-complexity` — UI Source Distribution, Component Contract, And Theme Complexity.

## Changelog

- `2026-07-15`: Linked the formally closed and archived W14 proof after zero competing Sidebar contract/theme/import residue and complete runtime, registry, installation, app-shell, and accessibility evidence.
- `2026-07-15`: Added after W14 preflight found a seventeen-piece public Sidebar surface, a duplicate navigation contract, compatibility behavior/callbacks, a second visual theme layer, hand-built overlay behavior, repeated app-shell mappings, and incomplete nested installation proof.
