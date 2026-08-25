---
id: 'PAT-467ed709ae0f'
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
  - 'monolithic'
  - 'select'
  - 'field'
  - 'recipe'
---

# FP-20260714 UI Monolithic Select Field Recipe

## Wrong Pattern

One `Select` component combines an options array, field label, helper and error content, trigger styling, popup rendering, collection navigation, selection state, and document-level dismissal. Its placeholder silently becomes the accessible name when no label is supplied.

## Symptom / Failure Mode

Consumers cannot compose grouped or rich items, the public name does not reveal whether `Select` is a collection foundation or a form-field recipe, and browser behavior is duplicated inside a visual component. Unlabeled controls appear usable but receive a changing placeholder as their name, while documented keyboard behavior can diverge from the implementation.

## Root Cause

Convenience and foundation jobs were treated as one API surface. Visual completeness hid missing accessible-name requirements, and options-array rendering prevented the collection contract from becoming independently testable and reusable.

## Correct Pattern

1. Keep `Select` as the compound collection foundation with trigger, value, content, item, grouping, and separator parts.
2. Keep controlled/uncontrolled value and open state, disabled-item navigation, typeahead, portal, dismissal, and form participation in that foundation.
3. Build `SelectField` as the named options-array recipe over `Select` and the shared Field contract.
4. Require a visible label or explicit `aria-label`; connect descriptions and errors through merged `aria-describedby`.
5. Reuse the private overlay behavior owner instead of adding component-specific document listeners.
6. Teach project-local imports publicly and flat runtime subpaths only for first-party Unisane applications.

## Detection Rule

- `SelectProps` contains `options`, `label`, helper/error, or field-shell recipe props.
- a placeholder is used as the fallback accessible name.
- Select owns document-level outside-interaction listeners instead of the shared behavior owner.
- docs or adopters import Select through the package root or `components/*` paths.
- the registry cannot install SelectField and its complete local dependency closure independently.

## Fix Recipe

1. Freeze the foundation/recipe boundary and accessibility contract in a convergence workpack.
2. Implement the compound Select API and build SelectField from it without compatibility aliases.
3. Migrate every options-array adopter to SelectField and add explicit names to compact controls.
4. Generate the registry from the source owners and prove clean, repeat-safe local installation.
5. Add direct keyboard, typeahead, controlled-state, naming, validation, dismissal, visual, docs, and runtime/registry proof.
6. Audit for zero retired API and non-flat import residue before closure.

## Linked Artifacts

- Decision: `docs/decisions/D-20260714-ui-dual-distribution-and-theme-contract.md`
- Workpack: [P114-W10](https://github.com/unisane/unisane/blob/5f6e0b3e3dea915b4267a266571c99150834f88b/docs/work/archive/tasks/P114-W10.md)
- Finding: [archived UI distribution finding](https://github.com/unisane/unisane/blob/5f6e0b3e3dea915b4267a266571c99150834f88b/docs/archive/findings/F-20260713-ui-source-distribution-and-theme-complexity.md)

## Changelog

- `2026-07-14`: Added after W10 found the monolithic options-array Select recipe, placeholder-as-name behavior, incomplete keyboard proof, and duplicated outside dismissal across 74 usages.
