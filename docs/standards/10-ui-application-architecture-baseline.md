---
id: 'DOC-2f29163ac325'
owner: 'unisane'
repository: unisane-ui
scope: workspace
role: standard
lifecycle: durable
authority: canonical
provenance: accepted
view: current
---

# UI Application Architecture Baseline

Use this file as the compact invariant summary for UI work in starters and platform apps.

## Changelog

- `2026-08-03`: Added the human-first AI interaction boundary: manual workflow parity,
  server-derived action state, proportional preview/approval, and visible receipt,
  verification, and recovery for affected risk classes.
- `2026-08-02`: Hard-cut authored platform API/type re-export facades; UI code now
  consumes exact compiler-owned public subpaths through `#unisane/generated/*`.
- `2026-08-01`: Required DataTable consumers to declare page-owned or table-owned vertical scrolling so wheel, overscroll, virtualization, and sticky-header behavior remain portable across shells.
- `2026-07-24`: Linked the accepted authorization target and added the compact server-affordance, unauthorized-data, final-recheck, and stale-access-revision UI rules.
- `2026-07-21`: Made the UI distribution rules enforceable closure invariants: explicit flat modules only, complete public/private classification, transitive private support, and one grouped DataTable runtime/local contract.
- `2026-07-14`: Added the compact first-party UI distribution rules for flat runtime subpaths, one package CSS baseline, no direct token/source scans, and runtime/registry parity.
- `2026-04-09`: Clarified the canonical feature-internal shape: `components/`, `hooks/`, `lib/`, optional `server/`, `schemas/`, `actions/`, and `view-models/` are allowed; legacy `ui/` and `model/` feature buckets are not canonical.
- `2026-04-09`: Clarified the naming decision that `support/` remains the canonical neutral support layer and that a top-level `src/components/**` folder is not part of the default app contract.
- `2026-04-09`: Added the compact UI architecture baseline covering the route-to-screen chain, ownership layers, root `config/ui/**`, page-family rules, generated-runtime boundaries, and local-first state doctrine.

## Goal

Keep UI work predictable across starters and platform apps without forcing every task to open the longer architecture docs first.

## Canonical Chain

`route -> route-group layout -> app shell -> screen -> pattern family -> feature sections -> platform/support/state`

## Hard Rules

1. Screens compose; features implement.
2. Patterns own structure, not business logic.
3. `patterns/shells` own app-shell chrome.
4. Features must not import other features.
5. Root `config/ui/**` owns authored UI declarations.
6. Generated runtime/API imports use exact public `#unisane/generated/*` subpaths;
   physical `.cache/unisane/**` imports and authored re-export facades are forbidden.
7. Raw backend DTOs enter app code through `#unisane/generated/platform/types`.
8. `support/` is for neutral support logic only.
9. `support/` stays the canonical cross-feature layer; do not replace it with `shared`, `common`, `helpers`, or `utils`.
10. A top-level `src/components/**` folder is not default architecture.
11. `state/` is promotion-only, not default.
12. Server data does not belong in arbitrary global client state.
13. Every non-trivial page must choose one primary pattern family.
14. Every meaningful page must define relevant loading/empty/error/denied/not-found behavior.
15. Capabilities are centralized truth, not scattered role checks.
16. Screens are server-first by default; client boundaries must be intentional.
17. App-level visual/tokens policy lives in `config/ui/**`, not in features.
18. Canonical feature-internal folders are `components/`, `hooks/`, `lib/`, optional `server/`, `schemas/`, `actions/`, and `view-models/`.
19. `ui/` and `model/` are not canonical feature folder names.
20. First-party apps use flat runtime imports such as `@unisane/ui/button`; root barrels and category-deep UI imports are not canonical.
21. First-party apps import only `@unisane/ui/styles.css` as the package styling baseline and do not import `@unisane/tokens` directly or scan UI package source.
22. External consumers use registry-installed local source and no Unisane UI/token application runtime dependency.
23. One app must not mix runtime and local-source ownership for the same component.
24. Every app has one global stylesheet entrypoint; selected color themes replace semantic light/dark values.
25. Mode, density, and contrast remain available as explicit runtime opt-ins without making color-theme selection another runtime layer.
26. `@unisane/ui` has no root, wildcard, or category-deep fallback export; every public owner has one explicit flat module.
27. Private UI mechanics are registry dependencies, not public application imports.
28. DataTable exports one grouped prop contract and installs as one dependency-complete local composite for external projects.
29. DataTable layout declares one vertical scroll owner: page-owned tables keep wheel and overscroll with the surrounding page and disable row virtualization; table-owned layouts require an explicitly bounded container and own virtualization and internal sticky headers.
30. AI assistance is embedded in normal owned screens and workflows; chat is not the
    only path to a capability.
31. Draft and preview state is visually and semantically distinct from committed state.
32. Agent-visible actions consume server-derived affordances and never reconstruct
    permission, scope, approval, or risk policy in the client.
33. Preview, separate approval, verification, and recovery UI are required only when the
    declared effect/risk policy needs them; low-risk atomic mutations do not inherit
    unnecessary high-risk ceremony.
34. A completed governed action shows exact target, outcome, receipt/verification state,
    and the safe recovery or escalation route without exposing secrets.

## Authorization Target

These are accepted target rules from the [Framework authorization architecture](https://github.com/unisane/unisane/blob/main/docs/architecture/11-authorization-architecture.md),
not a claim that planned affordance, effective-access, or access-revision APIs are
already shipped:

1. Owning modules evaluate pure typed policies from `src/service/policies/**` over
   server-loaded trusted facts.
2. UI and `src/support/permissions/**` consume server-derived access summaries,
   resource affordances, and effective-access projections; they do not interpret roles,
   raw permission strings, or ABAC facts.
3. Hiding is not enforcement, unauthorized rows and fields are never sent merely to be
   hidden, and the server rechecks every protected command.
4. A stale access revision triggers access/resource/affordance refresh and an explicit
   retry, never automatic mutation replay.
5. Until those server surfaces exist, track the backend gap rather than creating a
   client-side policy substitute.

## Canonical Root Shape

```text
config/ui/**
src/app/**
src/screens/**
src/features/**
src/patterns/{pages,sections,shells,feedback}/**
src/platform/**
src/support/**
src/state/**   # optional
```

`components/` may still exist inside a clear owner such as `features/<feature>/components`, `screens/<screen>/components`, or pattern-local internals.

## Dependency Shorthand

1. `app -> screens | patterns/pages | patterns/shells | platform | config`
2. `screens -> features | patterns | platform | support | state | config`
3. `features -> platform | support | state | config | patterns/sections`
4. `platform -> config`
5. `support -> config`
6. `state -> config`
7. forbidden: `features -> features`, `patterns -> features`, `platform -> screens/features/patterns`, `state -> features/screens/patterns`

## Open The Deeper Docs When

1. page-family structure is unclear: `docs/architecture/09-ui-page-blueprints.md`
2. spacing, typography, or token policy is changing: `docs/architecture/10-ui-visual-doctrine-and-token-governance.md`
3. you are adding or restructuring a page: `docs/guides/add-ui-screen.md`
4. you are changing theme or app tokens: `docs/guides/add-ui-theme-and-app-tokens.md`
5. you are changing authorization, affordances, effective access, or stale-access
   behavior: [Framework authorization architecture](https://github.com/unisane/unisane/blob/main/docs/architecture/11-authorization-architecture.md)
