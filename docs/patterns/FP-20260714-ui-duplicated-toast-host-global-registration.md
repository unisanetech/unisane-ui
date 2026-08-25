---
id: 'PAT-a7b856d46f02'
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
  - 'duplicated'
  - 'toast'
  - 'host'
  - 'global'
  - 'registration'
---

# FP-20260714 UI Duplicated Toast Host And Global Registration

## Wrong Pattern

A Toast provider and a standalone Toaster each own separate notification arrays, ID generation, timers, portals, and cleanup. An imperative API is connected by mutating public module-global function pointers whenever either host mounts.

## Symptom / Failure Mode

The last mounted host wins, calls before mount are dropped, unmount order changes behavior, IDs are random, and two documented setup paths render different state. Auto-dismiss can expire while a user is reading, hovering, using an action, or away from the page. A record type named `Toast` also prevents the name from describing a real renderable recipe.

## Root Cause

Declarative rendering, application hosting, notification storage, and imperative delivery were implemented as competing APIs instead of one model. Visual completion hid lifecycle, accessibility-timing, and deterministic-state requirements.

## Correct Pattern

1. Keep one module-private external notification store with immutable snapshots, subscription, monotonic IDs, show, dismiss, and dismiss-all operations.
2. Keep `Toaster` as the only application host and portal owner; calls before mount stay in the same store for later delivery.
3. Make `Toast` the public renderable recipe used by `Toaster`, not a public storage record.
4. Keep `toast.show/success/error/warning/info/dismiss/dismissAll` as ergonomic operations over that store.
5. Use canonical `tone`: `neutral`, `info`, `success`, `warning`, and `danger`.
6. Pause expiry for pointer interaction, contained focus, and hidden-page state, then resume from the remaining duration.
7. Announce normal statuses politely and danger assertively; keep every message atomic.
8. Teach project-local imports publicly and flat runtime imports only to first-party Unisane applications.

## Detection Rule

- Toast exposes a provider, context hook, host setter, or mutable function-pointer registration.
- more than one component owns notification state or portal rendering.
- imperative calls warn or return an empty ID before a host mounts.
- stored IDs use randomness.
- Toast uses semantic `variant`, `default`, or `error` vocabulary.
- auto-dismiss has no pointer, focus, or page-visibility pause proof.
- docs or adopters import Toast through the package root or `components/*` paths.

## Fix Recipe

1. Freeze the host/store, public recipe, semantic tone, timing, and announcement contract in a convergence workpack.
2. Delete the provider/context/global-registration family and implement one private external store.
3. Compose the sole Toaster host from the public Toast recipe.
4. Migrate every adopter and downstream feedback type to canonical tone and imports without aliases.
5. Generate the registry and prove complete repeat-safe local installation without a runtime package.
6. Add queued-delivery, deterministic-ID, timer-pause, visibility, focus, action, dismissal, SSR, visual, docs, and zero-residue proof.

## Linked Artifacts

- Decision: `docs/decisions/D-20260714-ui-dual-distribution-and-theme-contract.md`
- Workpack: [P114-W11](https://github.com/unisane/unisane/blob/5f6e0b3e3dea915b4267a266571c99150834f88b/docs/work/archive/tasks/P114-W11.md)
- Finding: [archived UI distribution finding](https://github.com/unisane/unisane/blob/5f6e0b3e3dea915b4267a266571c99150834f88b/docs/archive/findings/F-20260713-ui-source-distribution-and-theme-complexity.md)

## Changelog

- `2026-07-14`: Added after W11 found two full Toast hosts, public mutable host registration, dropped pre-host delivery, random IDs, and interaction-insensitive auto-dismiss.
