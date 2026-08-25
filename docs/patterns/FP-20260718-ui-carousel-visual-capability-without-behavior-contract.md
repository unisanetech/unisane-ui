---
id: 'PAT-f0d8a8ffe94d'
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
  - 'carousel'
  - 'visual'
  - 'capability'
  - 'behavior'
---

# FP-20260718 UI Carousel Visual Capability Without Behavior Contract

## Wrong Pattern

A composite advertises navigation, tab, swipe, and autoplay capability through visual controls and prose while its state, semantics, focus safety, motion control, orientation, and input behavior are incomplete or absent.

## Symptom / Failure Mode

The carousel is uncontrolled-only, hidden slides remain keyboard reachable, tab roles lack tabpanel wiring, the root intercepts arrows from nested content, and autoplay cannot be explicitly paused or restarted. Hover is the only pause path, live announcements continue during automatic changes, physical controls ignore RTL/orientation, and docs call a configuration swipe-only even though no pointer gesture exists. A no-op variant still expands the API and dependency graph.

## Root Cause

Visible affordances were treated as proof of behavior. State ownership, WAI carousel semantics, WCAG motion control, hidden-content focus safety, pointer input, orientation, localization, distribution, and maturity evidence were not frozen as one composite contract.

## Correct Pattern

1. Pair high-level visual controls with one controlled/uncontrolled state owner and deterministic collection bounds.
2. Use either complete tab/tabpanel wiring or named slide groups; never publish partial tab semantics.
3. Remove inactive slide descendants from interaction with inertness as well as accessibility-tree hiding.
4. Treat autoplay as a motion capability: provide explicit stop/restart, stop on focus entry, pause on hover, respect reduced motion, and disable live announcements while rotating.
5. Make orientation, writing direction, keyboard behavior, logical control placement, and pointer gestures agree.
6. Delete no-op variants and ambiguous timing names rather than retaining decorative API layers.
7. Keep stable maturity only after direct behavior, accessibility, timer, gesture, registry, visual, type, and build evidence agrees.

## Detection Rule

- autoplay exists without a rotation control
- rotation pauses only on hover or restarts after focus without an explicit request
- inactive rich content is only `aria-hidden`, not inert
- `tab`/`tabpanel` roles lack matching IDs and control/label relationships
- a focusable root globally intercepts arrow keys around arbitrary slide content
- docs claim touch/swipe without pointer behavior
- a CVA variant has only one empty value
- composite state cannot be controlled or reconciled when item count changes
- docs claim stable without direct tests

## Fix Recipe

1. Inventory runtime, generated registry, exports, docs, tests, fixtures, and adopters before changing props.
2. Freeze retained content, visual, motion, orientation, and input capability plus retired vocabulary in a convergence contract.
3. Implement state and semantics first, then controls, gestures, animation, and styling.
4. Hard-cut pre-1.0 vocabulary and migrate every consumer; do not add aliases.
5. Add direct semantics, controlled-state, collection-bound, focus/inertness, timer, reduced-motion, pointer, RTL/orientation, ref, registry-install, and visual proof.
6. Enforce flat internal imports and project-local external examples, then run strict closure gates.

## Linked Artifacts

- Decision: `docs/decisions/D-20260714-ui-dual-distribution-and-theme-contract.md`
- Workpack: [P114-W18](https://github.com/unisane/unisane/blob/5f6e0b3e3dea915b4267a266571c99150834f88b/docs/work/archive/tasks/P114-W18.md)
- Finding: [archived UI distribution finding](https://github.com/unisane/unisane/blob/5f6e0b3e3dea915b4267a266571c99150834f88b/docs/archive/findings/F-20260713-ui-source-distribution-and-theme-complexity.md)

## Changelog

- `2026-07-18`: Linked the formally closed W18 proof after all declared shared and W18-owned checks passed.
- `2026-07-18`: Linked the implemented W18 proof after the incomplete Carousel state, semantic, hidden-content, motion-control, orientation, pointer, distribution, and maturity pattern was removed from runtime, registry, docs, and installation output; formal shared closure remains pending P113 reconciliation.
- `2026-07-18`: Added after Carousel inventory found visual controls and documented swipe/autoplay capability without complete state, semantics, focus safety, motion control, orientation, pointer behavior, canonical delivery, or direct maturity evidence.
