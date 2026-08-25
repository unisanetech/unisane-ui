---
id: 'PAT-0e2402e91264'
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
  - 'data'
  - 'display'
  - 'semantic'
  - 'authoring'
---

# FP-20260716 UI Data-Display Semantic And Authoring Drift

## Wrong Pattern

Simple data-display components assert accessibility semantics regardless of context, while a structured list hides multiple rendered element types and two content-authoring models behind one generic div contract.

## Symptom / Failure Mode

Every Badge becomes a live region, every Divider becomes a semantic separator, and Divider inset behavior is physical-direction styling disguised as a visual variant. List recreates `ul`/`li` through roles, accepts div attributes while rendering links and buttons through casts, supports structured slots and free-form children, and republishes two content helpers for the same job. Stable labels exist without direct tests.

## Root Cause

Visual appearance was treated as sufficient component behavior. Accessibility roles, native element ownership, interaction typing, router integration, distribution paths, and maturity evidence were added independently rather than frozen as one public family contract.

## Correct Pattern

1. Keep passive visual labels passive by default; let consumers opt into live-region semantics for genuinely dynamic updates.
2. Make decorative versus semantic separation explicit and use logical-direction inset vocabulary.
3. Prefer native collection ownership before adding ARIA roles.
4. Use one structured rich-content model for high-level list rows and remove duplicate child/helper paths.
5. Discriminate static, button, and link behavior with familiar native props; never cast one element's attributes to another.
6. Keep one explicit framework-link extension point instead of combining `href`, slotted children, and hidden clone behavior.
7. Keep stable maturity only after direct semantics, interaction, registry, visual, type, and build evidence agrees.

## Detection Rule

- a passive status label always declares `role="status"`
- a purely visual rule always declares separator semantics
- start/end behavior uses left/right classes instead of logical direction
- a component simulates native list ownership with generic element roles
- one prop type is cast across div, anchor, button, or slotted element output
- structured slots and free-form children both author the same high-level row
- slot names say icon or supporting text even though they accept arbitrary content
- docs claim stable without direct component tests

## Fix Recipe

1. Inventory source, generated registry, exports, docs, tests, fixtures, and all adopters.
2. Freeze retained visual/content/interaction capability before selecting native owners and one vocabulary.
3. Use a hard cut before `1.0`: migrate consumers and delete duplicate paths instead of adding aliases.
4. Add direct semantics, native-prop, disabled, ref, interaction, router-extension, SSR, registry-install, and visual proof.
5. Enforce flat internal imports and project-local external examples.
6. Run strict residue, type, build, docs, dependency, dead-code, formatting, and workpack closure checks.

## Linked Artifacts

- Decision: `docs/decisions/D-20260714-ui-dual-distribution-and-theme-contract.md`
- Historical evidence: `P114-W17` — Data-Display Family Convergence; `F-20260713-ui-source-distribution-and-theme-complexity` — UI Source Distribution, Component Contract, And Theme Complexity.

## Changelog

- `2026-07-16`: Added after Phase 6 inventory found forced Badge and Divider semantics, physical-direction Divider inset, simulated List roles, unsafe cross-element casts, dual List authoring, ambiguous vocabulary, non-canonical imports, and stable labels without direct tests.
