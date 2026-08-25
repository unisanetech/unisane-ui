---
id: 'PAT-0f536d8fbceb'
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
  - 'theme'
  - 'runtime'
  - 'preset'
  - 'layer'
---

# FP-20260714 UI Theme As Runtime Preset Layer

## Failure Pattern

Normal project color selection is shipped as a collection of runtime selector presets over a consumer-visible reference-palette and tone-mapping graph. External setup then places that graph in a secondary stylesheet imported by the application stylesheet.

## Why It Fails

1. developers must understand generator internals to override ordinary semantic colors
2. every preset remains in production CSS even when the project selected only one
3. later theme changes add selector state instead of producing a small reviewable value diff
4. preview scopes and design-time schemes leak into the product runtime contract
5. a second application stylesheet obscures which file owns Tailwind, tokens, focus, animation, and utilities

## Required Replacement

Generate one selected theme directly into canonical `--color-*` semantic roles. Keep palette/tone calculation private to tooling. External projects receive one complete local `globals.css`; later theme changes replace only an explicit managed semantic region and preserve app-owned CSS. Runtime selectors remain only for real user preferences or deliberate application capabilities.

A documentation workbench may generate a separate preview-only asset for combinatorial theme review. That asset is not a consumer package export path, registry baseline dependency, or application theming recipe.

## Grep Direction

- consumer output: zero `--ref-*`, `--tone-*`, `[data-color-theme]`, `[data-scheme]`, and `[data-theme-scope]`
- external CLI: zero secondary `styles/unisane.css` creation/import
- replacement proof: semantic `--color-*` values, managed theme markers, complete baseline assets, safe theme mutation tests

## Changelog

- `2026-07-14`: Added after W2 admission confirmed that runtime preset layers and a secondary token stylesheet were carrying generator ownership into the consumer API.
