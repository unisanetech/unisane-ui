---
id: 'PAT-666196770b4a'
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
  - 'stepper'
  - 'dual'
  - 'authoring'
  - 'visual'
  - 'only'
---

# FP-20260718 UI Stepper Dual Authoring And Visual-Only Progress

## Wrong Pattern

A Stepper exposes one array renderer and a second compound component family with different state, interaction, orientation, semantics, and styling rules, while both primarily encode progress through visual classes.

## Symptom / Failure Mode

Consumers must choose between incompatible APIs. Active and completed flags can conflict. Array steps lack ordered-list and current-step semantics. A claimed vertical orientation changes only a single item's content direction, not the sequence. Static items look interactive because pointer and Ripple behavior are unconditional. Dynamic collections depend on fragile indexes, and stable maturity is claimed without behavior evidence.

## Root Cause

Custom composition was added before one high-level state and semantic contract was defined. Visual recipes then became independent public APIs instead of implementation details derived from one step catalog and one current value.

## Correct Pattern

1. Use one steps catalog with stable values and rich label/description nodes.
2. Derive current and default completion state from one controlled value; allow only a non-conflicting completion override.
3. Make interaction explicit through one change callback and use native buttons only in that mode.
4. Put sequence semantics on an ordered list and current semantics on exactly one resolved item.
5. Make orientation own the whole sequence and connectors, not one item's internal layout.
6. Forward native root attributes/ref and localize positional/completion announcements.
7. Prove state, orientation, semantics, interaction, delivery, installation, and appearance before claiming stable maturity.

## Detection Rule

- `steps` and arbitrary Stepper children are both public authoring paths
- exported `Step` compounds duplicate state/rendering logic
- independent `active` and `completed` booleans can both be true
- array steps use only divs and visual color to expose progress
- vertical orientation does not move the connector sequence
- static steps retain pointer cursor, Ripple, or focus styling
- positional indexes are the only identity mechanism
- a stable Stepper has no direct tests

## Fix Recipe

1. Inventory runtime, registry, docs, exports, tests, fixtures, adopters, and shared state conventions.
2. Freeze one stable-ID array contract and passive/interactive behavior before editing.
3. Derive non-conflicting progress, add ordered-list/current-step semantics, and implement both sequence orientations.
4. Delete the compound/no-op paths and use canonical icon, Ripple, focus, typography, and semantic token owners.
5. Add direct behavior, install, registry, docs, visual, type, build, and zero-residue proof.

## Linked Artifacts

- Decision: `docs/decisions/D-20260714-ui-dual-distribution-and-theme-contract.md`
- Historical evidence: `P114-W21` — Stepper Boundary And State Convergence; `F-20260713-ui-source-distribution-and-theme-complexity` — UI Source Distribution, Component Contract, And Theme Complexity.

## Changelog

- `2026-07-18`: Added after Stepper inventory found dual array/compound authoring, contradictory state, visual-only progress, false orientation guidance, non-canonical delivery, and stable maturity without direct evidence.
