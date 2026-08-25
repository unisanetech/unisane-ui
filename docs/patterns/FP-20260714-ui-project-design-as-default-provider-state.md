---
id: 'PAT-8c5966cd1b07'
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
  - 'project'
  - 'design'
  - 'default'
  - 'provider'
  - 'state'
---

# FP-20260714 UI Project Design As Default Provider State

## Failure Pattern

One default runtime provider owns project color selection, generated scheme, mode, contrast, density, radius, action shape, and elevation, then writes every attribute even when the application did not expose those settings.

The same failure returns when a broad provider is renamed but a public compatibility wrapper keeps the old provider, hooks, configuration type, attributes, and storage translation alive. That wrapper is a second API, not harmless migration plumbing.

## Why It Fails

1. design-time project decisions become mutable user state
2. every app must understand and persist axes it does not use
3. the provider can override CSS defaults merely by mounting
4. external source installation inherits a broad API before any preference capability is requested
5. pre-hydration, validation, persistence, and reset behavior become coupled to unrelated design choices

## Required Replacement

Keep selected project color and scheme in generated CSS. Runtime appearance owns only explicitly enabled preference axes. Use one typed generic preference state with focused hooks, validated DOM/storage input, explicit `none`, local-storage, or cookie persistence, reset behavior, and a pre-hydration script. External projects install this capability locally through the CLI; first-party apps consume the equivalent flat runtime subpath.

## Grep Direction

- provider source: zero `colorTheme`, `ColorTheme`, `data-color-theme`, `scheme`, `ColorScheme`, and `data-scheme`
- public guidance: zero runtime project-color setter or selector recipes
- replacement proof: explicit enabled axes, generic preference update, persistence policy, pre-hydration script, CLI configuration, and focused tests
- compatibility proof: zero wrapper, alias, legacy selector, or retired-storage migration after the pre-1.0 hard cut

## Changelog

- `2026-07-14`: Reopened the pattern for W6 after the package compatibility wrapper reintroduced retired project color/scheme state and a second appearance vocabulary.
- `2026-07-14`: Linked the archived W3 proof after the required replacement and grep-zero contract passed.
- `2026-07-14`: Added for W3 after W2 separated generated color selection from runtime preference selectors but the existing provider still retained project design state.
