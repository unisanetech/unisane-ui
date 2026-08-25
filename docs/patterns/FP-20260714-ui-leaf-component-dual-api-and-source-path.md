---
id: 'PAT-2ceebb5607dd'
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
  - 'leaf'
  - 'component'
  - 'dual'
  - 'api'
  - 'source'
---

# UI Leaf Component Dual API And Source Path

## Changelog

- `2026-07-14`: Archived the proving W7 workpack after the prevention contract passed strict closure with zero allowlists.
- `2026-07-14`: Verified the prevention contract through W7: duplicate registry owners now fail generation, legacy Icon paths are blocked, retired props have zero live residue, and direct runtime/registry/install proof passes.
- `2026-07-14`: Recorded the failure pattern while opening the first representative leaf-component proof.

## Failure Pattern

A leaf component is authored under more than one source category or exposes more than one prop vocabulary for the same job. Re-export-only files, deep import aliases, `icon` versus `leadingIcon`, and `typeRole` versus `variant` make a small component harder to learn while allowing runtime and registry delivery to disagree.

## Why It Fails

1. developers cannot identify the canonical import or source owner
2. registry generation can choose a different owner from the runtime package
3. docs and prop types can describe different primary APIs
4. compatibility aliases turn a one-time migration into permanent conceptual weight
5. maturity claims become documentation labels rather than evidence-backed contracts

## Canonical Pattern

1. each public leaf has one implementation file and one import path per delivery mode
2. two-sided slots use `leadingIcon` and `trailingIcon`; `icon` is reserved for a single icon role
3. one selector prop owns one visual hierarchy vocabulary
4. runtime and registry outputs derive from the same owner and pass the same type and behavior proof
5. stable maturity requires direct semantics, interaction, accessibility, visual, docs, registry, and fixture evidence
6. pre-1.0 hard cuts delete retired paths and props instead of preserving aliases

## Prevention

- block primitive/deep Icon imports after the canonical component owner lands
- block the retired Button `icon` prop and Typography `typeRole` selector
- require direct tests and public docs for every representative leaf
- regenerate registry, package metadata, and symbol inventories through their owners
- do not widen a representative-family workpack into unrelated component fleets
