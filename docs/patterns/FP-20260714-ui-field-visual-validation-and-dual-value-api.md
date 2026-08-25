---
id: 'PAT-9285bdaddf7f'
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
  - 'field'
  - 'visual'
  - 'validation'
  - 'dual'
  - 'value'
---

# FP-20260714 UI Field Visual Validation And Dual Value API

## Failure Pattern

A rich field recipe is treated as accessible because its border and helper copy change color, while the control does not expose invalid state or stable description relationships. The same recipe then inherits both input and textarea attribute interfaces, casts incompatible events together, mirrors native value state, and keeps native `onChange` beside higher-level controlled-state conventions.

This produces an API that looks capable but is difficult to understand and easy to use incorrectly. Styling escape hatches such as arbitrary label classes or label background classes often compensate for missing semantic options such as a visually hidden label and also couple consumers to implementation layout.

## Why It Fails

1. visual error styling is not an accessibility contract
2. one helper prop cannot distinguish guidance from error content
3. input and textarea attribute intersections create misleading event types
4. mirrored controlled state and effect-based ref assignment duplicate native/React ownership
5. native event callbacks and recipe value callbacks create two value models
6. arbitrary styling props hide semantic needs and make recipe internals public

## Required Correction

1. expose `invalid` for control state and `description` / `errorMessage` for content
2. set and merge `aria-invalid` and `aria-describedby` at the real control
3. expose one `onValueChange(value)` recipe callback while retaining controlled and uncontrolled values
4. keep input and multiline capabilities explicit without intersecting incompatible callback contracts
5. replace label-style hacks with an explicit visually hidden label option
6. reuse a small Field foundation for label, description, and error semantics
7. migrate every owned adopter and delete the retired vocabulary in the same workpack

## Detection

- rich field source accepts `error?: boolean`, `helperText`, or native `onChange` as its value API
- input and textarea HTML attribute types are directly intersected
- invalid styling exists without `aria-invalid`
- internal description ids overwrite rather than merge consumer `aria-describedby`
- label visibility is achieved through `labelClassName="sr-only"`

## Changelog

- `2026-07-14`: W8 removed the failure pattern from the representative TextField recipe and added direct zero-residue, semantic, accessibility, registry, visual, and installation proof.
- `2026-07-14`: Added after W8 preflight found the same visual/accessibility drift and dual input/textarea value model in the representative TextField recipe.
