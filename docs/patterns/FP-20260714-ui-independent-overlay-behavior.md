---
id: 'PAT-241474a1c1c4'
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
  - 'independent'
  - 'overlay'
  - 'behavior'
---

# FP-20260714 UI Independent Overlay Behavior

## Failure Pattern

Each modal, sheet, popup, menu, tooltip, and picker independently implements focus entry, focus containment, restoration, Escape, outside interaction, portal layering, background isolation, and semantic roles.

## Why It Fails

1. accessibility fixes must be repeated across unrelated visual components
2. modal and non-modal roles can disagree with actual behavior
3. nested layers race independent document listeners
4. local-source installation can omit hidden behavior dependencies
5. visual API richness becomes coupled to fragile browser mechanics
6. vendor-prefixed private data attributes leak library implementation identity into source-installed user DOM

## Required Replacement

Keep component visuals and task-focused APIs, but route shared browser behavior through private tested owners. Private identity, roots, anchors, and nesting use module records and refs rather than vendor-prefixed DOM coordination. The foundation must distinguish modal from non-modal semantics, dismiss only the topmost layer, contain and restore focus where modal, isolate the modal background, clean up document state, remain SSR-safe, and travel through both distributions.

## Grep Direction

- migrated components: zero duplicated focus-discovery functions
- non-modal popovers: zero `aria-modal="true"`
- source-installed UI DOM: zero `data-unisane-*` private coordination markers
- replacement proof: one shared behavior owner used by representative modal and non-modal components, with interaction and registry tests

## Changelog

- `2026-07-14`: Linked archived W5 after the vendor-neutral private-mechanics correction passed with zero residue.
- `2026-07-14`: Added the source-ownership correction after W4 leaked private coordination through `data-unisane-*` attributes.
- `2026-07-14`: Linked the archived W4 proof after the representative replacement and grep-zero contract passed.
- `2026-07-14`: Added for W4 after the fleet audit found repeated overlay behavior and Popover declared modal semantics without modal behavior.
