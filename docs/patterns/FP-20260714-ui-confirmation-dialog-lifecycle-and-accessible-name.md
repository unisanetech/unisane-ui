---
id: 'PAT-7be494926002'
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
  - 'confirmation'
  - 'dialog'
  - 'lifecycle'
  - 'accessible'
  - 'name'
---

# FP-20260714 UI Confirmation Dialog Lifecycle And Accessible Name

## Wrong Pattern

A modal foundation treats a visually present body as its accessible description and permits unnamed dialogs, while a confirmation recipe models semantic intent as `variant`, exposes a generic `disabled` prop for only one action, and delegates cancel, successful close, pending, and error behavior inconsistently to every consumer.

## Symptom / Failure Mode

Complex forms and command content can be announced as one oversized description, unnamed dialogs pass typecheck, confirmation dialogs expose a generic close icon beside their explicit cancel action, and adopters repeat subtly different close/loading/error behavior. Semantic warning or danger intent also conflicts with the shared `tone` vocabulary.

## Root Cause

Visual container composition was treated as the complete accessibility and lifecycle contract. The foundation did not require a name or distinguish description copy from arbitrary children, and the recipe added buttons without owning the common confirmation state transition.

## Correct Pattern

1. Require a visible title or explicit accessible label for every modal.
2. Link only declared description content through `aria-describedby`; omit it for complex bodies unless the consumer supplies an explicit description ID.
3. Let the foundation support truthful `dialog` and `alertdialog` roles.
4. Keep ConfirmDialog as a recipe with `tone`, explicit confirm-action state, safer initial focus, and no generic close icon.
5. Close after cancellation and successful confirmation, retain the dialog when confirmation returns `false` or rejects, and prevent dismissal while pending.
6. Preserve controlled and uncontrolled disclosure, custom content, visual capability, and external mutation loading without retaining old prop aliases.

## Detection Rule

- Dialog source contains body-description fallback IDs or can render without a title/explicit label.
- ConfirmDialog exposes semantic `variant`, generic `disabled`, or a default export beside its named export.
- Confirmation cancellation callbacks replace rather than accompany closing.
- Confirmation has no direct async success/false/error and loading-dismissal proof.
- First-party consumers import Dialog/ConfirmDialog through the root barrel or `components/*` paths.

## Fix Recipe

1. Freeze accessible-name, role, description, lifecycle, tone, and action-state vocabulary in a convergence contract.
2. Correct Dialog semantics and label foundation recipes such as CommandDialog and TimePicker explicitly.
3. Implement one ConfirmDialog state transition and migrate every adopter to `tone`, `confirmDisabled`, and flat imports.
4. Add direct foundation/recipe behavior and accessibility tests, public docs, visual proof, registry/runtime parity, and clean local installation.
5. Prove zero legacy residue and archive the workpack after strict closure.

## Linked Artifacts

- Decision doc: `docs/decisions/D-20260714-ui-dual-distribution-and-theme-contract.md`
- Workpack/findings: [P114-W9](https://github.com/unisane/unisane/blob/5f6e0b3e3dea915b4267a266571c99150834f88b/docs/work/archive/tasks/P114-W9.md), [archived UI distribution finding](https://github.com/unisane/unisane/blob/5f6e0b3e3dea915b4267a266571c99150834f88b/docs/archive/findings/F-20260713-ui-source-distribution-and-theme-complexity.md)
- Docs updated: [archived UI source-distribution plan](https://github.com/unisane/unisane/blob/5f6e0b3e3dea915b4267a266571c99150834f88b/docs/work/archive/plans/framework-ui-source-distribution-and-theme-system-plan.md)

## Changelog

- `2026-07-14`: Added after W9 preflight found optional Dialog naming, complex-body description fallback, and duplicated semantic confirmation lifecycle across the representative recipe and 35 usages.
