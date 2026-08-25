---
id: 'PAT-5485f4301ce7'
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
  - 'scroll'
  - 'wrapper'
  - 'viewport'
  - 'ownership'
---

# FP-20260718 UI Scroll Wrapper And Viewport Ownership Drift

## Wrong Pattern

A scroll component accepts native props and styling on one wrapper while a private descendant owns the actual overflow viewport, focus, scrolling state, and scrollbar styling.

## Symptom / Failure Mode

The forwarded ref cannot read or set the actual `scrollTop`/`scrollLeft`, `onScroll` is attached to the wrong element, and `tabIndex`, role, or ARIA attributes focus and describe a wrapper that does not scroll. A second `scrollbarClassName` channel styles the hidden viewport, while global CSS already owns scrollbar tokens and behavior. The wrapper adds layout and clipping complexity without a separate public job.

## Root Cause

Visual containment and scrolling behavior were split into separate DOM owners before the public native-element contract was defined. Styling escape hatches then accumulated around the implementation detail instead of keeping the scrolling viewport as the component boundary.

## Correct Pattern

1. Make the public root and actual native scroll viewport the same element unless a separately named compound part has an independent job.
2. Forward native props, events, focus, ARIA, refs, and programmatic scroll state to that element.
3. Keep one explicit orientation contract and one `className` channel.
4. Keep shared scrollbar colors and sizes in the CSS baseline rather than duplicating them inside each scroll component.
5. Ensure the viewport or a descendant participates in sequential focus navigation; do not document keyboard access that the runtime cannot provide.
6. Add a second wrapper only when its independent clipping/layout job is public, necessary, and directly tested.

## Detection Rule

- native div props land on a wrapper while overflow classes land on a descendant
- a ref targets an element whose `scrollTop` is not the visible scroll position
- `tabIndex`, role, or accessible name targets a non-scrolling wrapper
- `scrollbarClassName` or equivalent styles an anonymous private viewport
- component-local scrollbar colors duplicate the global theme baseline
- docs claim keyboard scrolling without a sequential-focus path
- a stable scroll component has no direct tests

## Fix Recipe

1. Inventory source, registry, global CSS, docs, exports, tests, fixtures, and adopters.
2. Freeze the one-element native boundary and retained orientations before editing.
3. Move overflow, native props/events, focus, and ref ownership to one viewport; delete the redundant wrapper and second style channel.
4. Keep global scrollbar theming and migrate runtime/local-source delivery paths.
5. Add direct orientation, focus, ref, event, install, registry, docs, visual, and type proof.

## Linked Artifacts

- Decision: `docs/decisions/D-20260714-ui-dual-distribution-and-theme-contract.md`
- Historical evidence: `P114-W19` — ScrollArea Boundary Convergence; `F-20260713-ui-source-distribution-and-theme-complexity` — UI Source Distribution, Component Contract, And Theme Complexity.

## Changelog

- `2026-07-18`: Linked the closed W19 proof after one native viewport, global scrollbar ownership, canonical delivery, direct behavior/install/visual evidence, and zero retired residue passed formal closure.
- `2026-07-18`: Added after ScrollArea inventory found native ownership separated from the actual overflow viewport, duplicated scrollbar styling, false keyboard guidance, non-canonical delivery, and stable maturity without direct evidence.
