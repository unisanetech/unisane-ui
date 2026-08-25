---
id: 'D-c373f7e5f4c9'
owner: 'unisane'
repository: unisane-ui
scope: workspace
role: decision
lifecycle: durable
authority: canonical
provenance: accepted
view: current
status: accepted
---

# D-20260714 UI Dual Distribution And Theme Contract

## Context

Unisane UI currently mixes package-runtime consumption, registry-installed source, root and deep imports, direct token CSS, package CSS, package-source scanning, generated reference palettes, runtime color-theme selectors, and app-owned copies of baseline focus and animation CSS. The component fleet needs the full semantic color and appearance capability, but consumers should not need to understand the internal token-generation pipeline or install a Unisane runtime package when they choose local source ownership.

First-party Unisane apps have a different operational need: copying the entire component fleet into every monorepo platform would create repeated source and divergent maintenance. The decision therefore has to distinguish distribution from component semantics without creating two UI systems.

## Decision Drivers

- one component authoring source and one behavioral contract
- local source ownership for external projects without a Unisane UI runtime dependency
- shared runtime consumption for first-party monorepo apps without repeated component copies
- one styling entrypoint per app and one stable semantic token vocabulary
- safe theme replacement without losing density, contrast, mode, shape, elevation, or accessibility capability
- canonical imports and complete install dependency closure
- public-package migration safety

## Considered Options

1. Publish only a runtime component package. This minimizes packaging work but keeps external projects coupled to Unisane runtime imports and recreates the current CSS/import ambiguity.
2. Copy source into every project, including first-party monorepo apps. This matches source-owned libraries but needlessly duplicates the shared component fleet across Unisane platforms.
3. Maintain separate runtime and registry implementations. This optimizes each delivery independently but creates two APIs, two accessibility implementations, and unavoidable drift.
4. Author once and produce two governed distributions with shared parity proof.

## Decision

Select option 4.

1. `packages/ui/src/**` is the component authoring source of truth. The
   former transitional `packages/core` path was removed without changing the
   `@unisane/ui` public identity.
2. First-party Unisane apps consume tree-shakable flat runtime subpaths such as `@unisane/ui/button`, `@unisane/ui/dialog`, and `@unisane/ui/icon`, plus `@unisane/ui/styles.css` as the sole package baseline.
3. External projects receive registry-installed local files and import from their own aliases such as `@/components/ui/button`; they do not require `@unisane/ui`, `@unisane/tokens`, or `@unisane/data-table` as application runtime dependencies.
4. Runtime and registry output may differ only in import rewriting and packaging. Public props, behavior, accessibility, semantic token use, and tests remain equivalent.
5. Every app has one `globals.css`. First-party apps import the package baseline and append app-owned semantic values/overrides. External apps receive the complete generated baseline and selected semantic values directly in that file.
6. Color themes replace the canonical `:root` and `.dark` semantic values. Standard color selection does not add runtime color-theme selector layers.
7. Mode, density, and contrast remain optional runtime preferences. Radius, action shape, elevation, and typography are generated project defaults unless explicitly enabled as advanced runtime axes.
8. The consumer contract keeps the complete semantic role vocabulary required by components. Only internal palette/tone derivation layers are removed from consumer output.
9. Foundations own accessibility-sensitive behavior, leaf components keep direct task-focused props, and richer product APIs are named recipes over the foundations.
10. Public-package changes use versioned migration notes. Before the `1.0` stability boundary, superseded UI APIs are hard-deleted after in-repo migration; compatibility aliases and wrappers are not retained as a second public path.

## Consequences

- Positive: external usage becomes source-owned and familiar while first-party platforms avoid repeated copies.
- Positive: theme capability is preserved behind a smaller semantic output and explicit appearance opt-ins.
- Positive: one authoring source and parity fixtures make runtime and registry behavior independently verifiable.
- Negative / tradeoffs: build tooling must generate, package, and test two distributions.
- Negative / tradeoffs: the CLI must own dependency-complete, path-preserving, conflict-safe installation and theme-region updates.
- Negative / tradeoffs: existing root/deep imports, token imports, runtime color presets, and duplicated CSS require phased public migration.

## Enforcement Updates

- Archived `P114-W1` made registry dependency closure, nested paths, CLI registry independence, and flat runtime exports blocking.
- Archived `P114-W2` made semantic-only consumer color output, one external stylesheet, and safe theme replacement blocking.
- Archived `P114-W3` makes explicit enabled axes, local/runtime `AppearanceProvider` parity, persistence policy, reset, pre-hydration application, and CLI configuration blocking.
- Archived `P114-W4` makes one private topmost-layer, focus, dismissal, and modal-isolation behavior owner blocking for the first representative overlay migration.
- Archived `P114-W5` makes neutral source-owned DOM blocking: private coordination uses module state and refs, not vendor-prefixed data attributes.
- Archived `P114-W6` hard-deletes the legacy theme-provider vocabulary, runtime project-color state, selector attributes, and storage fallback while migrating every in-repo adopter to the canonical appearance API.
- Archived `P114-W7` makes one leaf source owner and one public vocabulary blocking, including explicit Button slots, a singular IconButton icon role, one Typography variant selector, and direct runtime/registry/install evidence.
- Archived `P114-W8` makes one Field semantic owner and one TextField validation/value/label vocabulary blocking while retaining native form, visual, multiline, resize, slot, and controlled-state capabilities.
- Archived `P114-W9` makes truthful modal naming/description/role semantics and one ConfirmDialog tone/action/lifecycle vocabulary blocking while retaining Dialog visual and responsive capability.
- Later P114 workpacks own foundation convergence, adopter migration, and release closure.
- Clean Next.js and Vite fixtures must prove local source installation without Unisane runtime imports.
- Runtime and registry contract suites must share API, behavior, accessibility, semantic-token, SSR, and build assertions.
- Validation commands are declared in each P114 convergence contract and include scoped package tests plus docs/program/architecture freshness checks.

## Rollback / Follow-up

- If registry delivery cannot meet parity for a component, keep that component experimental and unavailable externally; do not create an unrelated registry implementation.
- Superseding this decision requires a new consolidated decision that preserves the one-authoring-source rule or explicitly documents why it is being abandoned.
- Follow-up workpacks: `P114-W1` distribution correctness, then token/theme output, CLI appearance, shared behavior foundations, representative component proof, fleet migration, DataTable convergence, and release closure.
- `D-20260807-unisane-ui-standalone-repository-structure-cleanup-and-production-readiness-contract.md`
  superseded the transitional `packages/core` location and requires package-owned UI
  and DataTable registry generation; this Decision's one-source/two-distribution
  semantics remain accepted.

## Changelog

- `2026-08-07`: Linked the accepted standalone `packages/ui` target and package-owned
  registry generation without changing the dual-distribution contract.
- `2026-07-14`: Archived W9 after strict Dialog/ConfirmDialog convergence and every declared closure check passed; no compatibility path remains.
- `2026-07-14`: Implemented the W9 Dialog/ConfirmDialog hard cut with zero retired API/import/description residue, complete adopter migration, direct semantic/accessibility proof, runtime/registry parity, and clean local-source installation.
- `2026-07-14`: Opened W9 to prove Dialog/ConfirmDialog through explicit accessible naming, truthful description/role semantics, one controlled/uncontrolled confirmation lifecycle, semantic tone, runtime/registry parity, and local-source installation.
- `2026-07-14`: Archived W8 after strict Field/TextField convergence and every declared closure check passed; no compatibility path remains.
- `2026-07-14`: Implemented the W8 Field/TextField hard cut with zero retired prop/import residue, complete adopter migration, direct semantic/accessibility proof, runtime/registry parity, and clean local-source installation; formal closure remains.
- `2026-07-14`: Opened W8 to prove the Field foundation and TextField recipe through one semantic/value vocabulary, full accessibility relationships, retained rich capabilities, runtime/registry parity, and local-source installation.
- `2026-07-14`: Archived W7 after strict leaf convergence and every declared closure check passed; no compatibility path remains.
- `2026-07-14`: Implemented the W7 leaf hard cut and vertical proof with zero retired-path or retired-prop residue; formal closure remains.
- `2026-07-14`: Opened W7 under the decision as the first bounded representative leaf proof with one source owner and one canonical vocabulary per component job.
- `2026-07-14`: Archived W6 after strict zero-legacy convergence and all declared closure checks passed; the canonical appearance contract now has no compatibility wrapper or fallback.
- `2026-07-14`: Implemented the W6 hard cut across the public package, generated registry, docs, starters/templates, platforms, persistence, and auxiliary UI consumers without removing appearance axes or generated color themes.
- `2026-07-14`: Opened W6 and replaced the time-boxed `ThemeProvider` compatibility decision with a pre-1.0 hard cut, explicit migration notes, and zero legacy aliases/fallbacks.
- `2026-07-14`: Archived W5 after vendor-neutral source ownership and private layer coordination passed every declared gate.
- `2026-07-14`: Opened W5 to correct vendor-prefixed private DOM coordination without weakening W4 behavior.
- `2026-07-14`: Archived W4 after the representative shared overlay behavior contract passed all declared closure gates.
- `2026-07-14`: Opened W4 to prove the private shared overlay behavior owner without changing public visual APIs.
- `2026-07-14`: Archived W3 after the explicit appearance runtime and local CLI configuration contract passed its declared closure gates.
- `2026-07-14`: Recorded `AppearanceProvider` as the canonical explicit runtime preference owner; W6 later superseded the temporary package-boundary compatibility allowance.
- `2026-07-14`: Recorded the approved one-source/two-distribution architecture, single-stylesheet contract, replace-in-place color themes, complete semantic vocabulary, appearance opt-ins, and foundation/leaf/recipe model before implementation.
