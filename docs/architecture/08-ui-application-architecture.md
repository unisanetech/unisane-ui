---
id: 'DOC-2dff0510c176'
owner: 'unisane'
repository: unisane-ui
scope: workspace
role: architecture
lifecycle: durable
authority: canonical
provenance: accepted
view: current
---

# UI Application Architecture (Canonical SSOT)

> Purpose: one durable UI architecture contract for Unisane starters and platform apps.
>
> Precedence: if this conflicts with the [Framework architecture](https://github.com/unisane/unisane/blob/main/docs/architecture/00-architecture.md), follow that architecture and update this doc in the same change.

## Changelog

- `2026-07-24`: Linked the accepted authorization target and clarified that UI consumes server-derived affordances/effective access, never hides unauthorized data as enforcement, and refreshes stale access revisions before retry.
- `2026-07-21`: Closed the distribution contract as an enforced hard cut: root/category-deep/wildcard runtime paths are absent, every public UI owner has an explicit flat module and local registry owner, DataTable installs as one local composite, and private support remains transitive.
- `2026-07-14`: Made `config/ui/appearance.ts` the canonical runtime-preference configuration file and removed the legacy theme-provider configuration vocabulary.
- `2026-07-14`: Added the governed UI distribution boundary: first-party apps use flat `@unisane/ui/<component>` runtime subpaths and one package CSS baseline, while external consumers own registry-installed source; both derive from one authoring system.
- `2026-04-09`: Clarified the canonical feature-internal shape: `components/`, `hooks/`, `lib/`, optional `server/`, `schemas/`, `actions/`, and `view-models/` are allowed; legacy `ui/` and `model/` feature buckets are not canonical.
- `2026-04-09`: Clarified the naming boundary for cross-feature support and component ownership: `support/` remains the canonical neutral support layer, and a top-level `src/components/**` folder is not part of the app architecture contract.
- `2026-04-09`: Added the canonical UI application architecture for starters and platform apps, including folder ownership, dependency rules, shell/pattern boundaries, root `config/ui/**`, and generated-runtime isolation through `src/platform/**`.

## 1. Scope

This document defines the internal UI architecture for:

1. starters under [`starters/**`](https://github.com/unisane/unisane/tree/main/starters)
2. first-party platform apps under [`apps/**`](https://github.com/unisane/unisane-platforms/tree/main/apps)
3. future internal product apps that follow the same framework contract

This document does not replace the public Unisane UI docs. `apps/docs` remains the public component-system surface; this file governs how first-party product apps are structured on top of the runtime distribution.

### 1.1 UI Distribution Boundary

Unisane UI has one authoring source and two governed distributions:

1. first-party apps and starters use flat runtime imports such as `@unisane/ui/button`, `@unisane/ui/dialog`, and `@unisane/ui/icon`
2. external projects install local source and import from their own aliases such as `@/components/ui/button`
3. first-party apps do not copy the shared component fleet into `src/components/ui/**`
4. external projects do not require Unisane UI or token packages as application runtime dependencies
5. one app must not resolve both runtime and local-source owners for the same component
6. runtime and registry outputs must preserve the same props, behavior, accessibility, and semantic-token contract
7. `@unisane/ui` exposes explicit flat modules only; the root entry and wildcard/category-deep fallbacks do not exist
8. DataTable is a first-party runtime package but a dependency-complete local registry composite for external projects; both expose the grouped contract rendered by `DataTable`

## 2. Canonical Mental Model

The canonical UI chain is:

`route -> route-group layout -> app shell -> screen -> pattern family -> feature sections -> platform/support/state`

Meaning:

1. `route` exposes the URL entry through `src/app/**`
2. `route-group layout` owns framework-level shell boundaries
3. `app shell` owns workspace/admin/app-family chrome
4. `screen` owns route-level orchestration
5. `pattern family` owns reusable page grammar
6. `feature sections` own business capability
7. `platform/support/state` provide runtime integration, neutral support logic, and promoted client state

Route-group names are app-local examples, not global fixed framework names.

## 3. Vocabulary

- `screen`: route-level composition entry for a non-trivial page
- `feature`: business-owned UI capability
- `patterns/pages`: reusable page-family grammar
- `patterns/sections`: reusable neutral structural sections
- `patterns/shells`: reusable route-family and workspace chrome
- `patterns/feedback`: canonical feedback surfaces such as empty, denied, not-found, and result pages
- `platform`: the only app-facing runtime bridge
- `support`: domain-neutral cross-feature support logic
- `config`: authored static app declarations
- `state`: promoted client state only
- `view-model`: presentation-safe shape derived from platform data
- `capability`: permission or access truth rendered into UI behavior

## 4. Non-Negotiable Laws

1. Screens compose; features implement.
2. Patterns own structure, not business meaning.
3. Features must not directly import other features.
4. Only `src/platform/**` may bridge to generated/runtime internals.
5. Root `config/ui/**` owns authored UI declarations.
6. Local state is the default; promoted state needs evidence.
7. Server data does not belong in arbitrary global client state.
8. App shells and page patterns must stay structurally consistent.
9. Support is for neutral support logic, not vague shared dumping grounds.
10. Every non-trivial page must choose one primary pattern family.
11. Capabilities are rendered from centralized truth, not scattered role checks.
12. If ownership is unclear, the design is incomplete.
13. First-party shared UI imports use canonical flat `@unisane/ui/<component>` subpaths, not root barrels or category-deep paths.
14. First-party apps import `@unisane/ui/styles.css` as their sole package styling baseline and must not import `@unisane/tokens` directly or scan UI package source.
15. Private mechanics such as ripple, focus/state layers, overlay helpers, navigation helpers, and action-control helpers install transitively and are not application import surfaces.

## 5. Canonical Root Shape

```text
config/
  ui/
    appearance.ts
    tokens.ts
    navigation.ts
    metadata.ts
    density.ts

src/
  app/
  screens/
  features/
  patterns/
    pages/
    sections/
    shells/
    feedback/
  platform/
    api/
      server.ts
      client.ts
      hooks.ts
      errors.ts
    types.ts
    capabilities/
    runtime/
  support/
    permissions/
    forms/
    tables/
    filters/
    urls/
    metadata/
    errors/
    formatting/
    dates/
  state/
    ui/
    preferences/
    workflow/
    session/
```

Notes:

1. `state/` is optional; do not create it until promotion is justified.
2. Any app layer may consume canonical flat `@unisane/ui/<component>` runtime subpaths; direct `@unisane/tokens`, root-barrel, `components/*`, `primitives/*`, and `lib/*` imports are not canonical app consumption.
3. A top-level `src/components/**` folder is not canonical in this architecture. Components should live inside a clear owner such as `features/**`, `screens/**`, or `patterns/**`.

## 6. Ownership Map

### `config/ui/**`

Owns:

1. app-level theme declarations
2. app token extensions
3. navigation catalogs
4. metadata defaults
5. density and visual preference defaults

Must not own:

1. components
2. hooks
3. mutable state
4. feature behavior disguised as config

### `src/app/**`

Owns:

1. framework routing files
2. layout files
3. route-group boundaries
4. thin route-entry handoff into screens

Must not own:

1. feature logic
2. reusable page grammar
3. platform client implementation

### `src/screens/**`

Owns:

1. page assembly
2. shell and pattern selection
3. composition of multiple feature sections
4. page-state switching
5. page-level responsive composition

Must not own:

1. reusable cross-page grammar
2. deep business logic
3. generated/runtime imports

### `src/features/**`

Owns:

1. business sections
2. business interactions
3. feature-local components, hooks, lib helpers, and optional server-only loaders or composition
4. feature-local actions, schemas, and view-models
5. capability-aware UI behavior

Must not own:

1. page-family grammar
2. route ownership
3. other feature internals

### `src/patterns/pages/**`

Owns:

1. management/details/settings/flow/dashboard page grammar
2. section-shell conventions
3. family-specific layout rules
4. standard action zones and spacing rhythm

Must not own:

1. domain fetching
2. business mutations
3. capability resolution

### `src/patterns/sections/**`

Owns:

1. reusable neutral structural wrappers
2. section headers, rails, split panes, and common structural shells

Must not own:

1. business logic
2. domain data orchestration

### `src/patterns/shells/**`

Owns:

1. workspace/admin/docs/app chrome
2. route-family navigation structure
3. top app bars, side rails, and shell-level notices

Must not own:

1. feature business logic
2. page-instance orchestration

### `src/patterns/feedback/**`

Owns:

1. canonical error/empty/denied/not-found/result surfaces
2. reusable feedback page grammar

### `src/platform/**`

Owns:

1. API/browser/server data access facades
2. generated/runtime bridging
3. platform-safe types
4. runtime helpers and capability facades

Must not own:

1. business UI
2. page grammar
3. feature presentation abstractions

### `src/support/**`

Owns:

1. neutral support logic reused across features/screens
2. permissions, tables, forms, filters, URLs, metadata, errors, formatting, and date helpers

Must not own:

1. feature-specific business behavior
2. route composition
3. vague generic buckets

Naming rule:

1. keep `support/` as the canonical cross-feature support layer
2. do not rename it to vague families such as `shared`, `common`, `helpers`, or `utils`

### `src/state/**`

Owns:

1. promoted UI state
2. preferences
3. workflow client state
4. session-scoped client state when needed

Must not own:

1. arbitrary server caches
2. feature business logic
3. page grammar

## 7. Dependency Rules

Allowed high-level directions:

1. `app -> screens | patterns/pages | patterns/shells | platform | config`
2. `screens -> features | patterns/pages | patterns/sections | patterns/feedback | platform | support | state | config`
3. `features -> platform | support | state | config | patterns/sections`
4. `patterns/pages -> support | config`
5. `patterns/sections -> support | config`
6. `patterns/shells -> platform | support | config`
7. `patterns/feedback -> support | config`
8. `platform -> config`
9. `support -> config`
10. `state -> config`

Forbidden directions:

1. `features -> features`
2. `features -> patterns/pages`
3. `features -> patterns/shells`
4. `patterns/* -> features`
5. `support -> features`
6. `support -> screens`
7. `platform -> screens | features | patterns`
8. `state -> features | screens | patterns`

Interpretation:

1. screens coordinate
2. features implement
3. patterns structure
4. platform integrates
5. support assists
6. state stores promoted client concerns

## 8. Layout And Shell Layering

There are four layout layers:

1. route-group layout in `src/app/**`
2. app shell in `src/patterns/shells/**`
3. page-family pattern in `src/patterns/pages/**`
4. page-instance composition in `src/screens/**`

Do not collapse these into one mega-component.

Rules:

1. route-group layout solves framework-level family boundaries
2. app shell solves route-family chrome and workspace/admin navigation
3. page pattern solves page grammar
4. screen solves page-instance composition and state

## 9. Pattern System

Canonical pattern families:

1. `auth`
2. `management`
3. `details`
4. `settings`
5. `flow`
6. `dashboard`
7. `feedback`
8. `navigation`

Pattern responsibilities:

1. structural grammar
2. section-shell conventions
3. action zones
4. responsive layout behavior
5. spacing rhythm within the page family

Patterns never own:

1. business rules
2. domain fetching
3. feature-specific mutation logic
4. capability truth

Promote into `patterns/**` only when reuse is:

1. structural
2. stable
3. repeated across multiple screens
4. clearer after extraction than before

## 10. Feature Architecture

Canonical feature shape:

```text
features/<feature>/
  components/
  hooks/
  lib/
  server/         # optional
  schemas/
  actions/
  view-models/
```

Rules:

1. use only the folders the feature needs
2. keep business-owned logic inside the feature
3. let screens coordinate more than one feature
4. use `server/` only for feature-local server loaders, server composition, or server-only data shaping that still belongs to the feature
5. `ui/` and `model/` are legacy bucket names, not canonical feature folders
6. derive view-models from `#unisane/generated/platform/types` or feature-local derived
   types, never from physical cache imports or duplicated DTO declarations

## 11. Platform Boundary

Canonical generated surfaces:

1. `#unisane/generated/platform/api/server`
2. `#unisane/generated/platform/api/client`
3. `#unisane/generated/platform/api/hooks`
4. `#unisane/generated/platform/api/errors`
5. `#unisane/generated/platform/types`

Rules:

1. app code imports generated public surfaces only through the sole
   `#unisane/generated/*` alias and never through physical `.cache/unisane/**` paths
2. compiler-generated API subpaths own transport access; authored proxy/re-export
   files do not
3. generated route builders are consumed from their exact generated subpath
4. UI navigation and search-param helpers belong in `src/support/urls/**` or local route files near the owner
5. DTO exposure into app code routes through `#unisane/generated/platform/types`

## 12. Support Domains

Allowed first-level support domains:

1. `permissions`
2. `tables`
3. `filters`
4. `forms`
5. `urls`
6. `metadata`
7. `errors`
8. `dates`
9. `formatting`

Do not create vague top-level buckets such as `shared`, `helpers`, `misc`, or `utils`.

Component placement rule:

1. do not create a top-level `src/components/**` by default
2. use `components/` only inside a clear owner such as `features/<feature>/components`, `screens/<screen>/components`, or pattern-local internals

## 13. State Model

Canonical state layers:

1. local component state
2. feature-hook state
3. promoted global client state
4. server state/cache owned by platform data tools

Rules:

1. promotion order is local -> feature hook -> global
2. global client state is optional, not default
3. backend data must not become a second arbitrary global cache
4. workflow draft state must define lifetime, persistence scope, reset, and resume behavior

## 14. Access, Page States, And Client Boundaries

Rules:

1. authentication and authorization are capability-based
2. visual hiding alone is never sufficient for sensitive actions
3. every meaningful page must define relevant states from: loading, refreshing, empty, filtered empty, error, denied, not found
4. screens are server-first by default
5. client boundaries must be intentional and pushed down to the smallest useful leaf

### 14.1 Target Authorization UI Contract

The following rules describe the accepted target in the
[Framework authorization architecture](https://github.com/unisane/unisane/blob/main/docs/architecture/11-authorization-architecture.md); they do not claim that its planned
affordance, effective-access, or access-revision APIs are already shipped.

1. Owning modules keep pure typed resource policies under `src/service/policies/**`;
   React, screens, features, and `src/support/permissions/**` consume projections and do
   not recreate policy.
2. Policy inputs use trusted resource and relationship facts loaded by the server, never
   owner, seller, company, channel, privacy, or relationship claims supplied by the UI.
3. Navigation and page visibility may use a coarse server access summary; row actions,
   sensitive forms, and stateful commands use server-derived resource affordances or
   effective-access projections.
4. Do not scatter role-name checks, raw permission-string checks, or hidden ABAC
   conditionals through UI components and helpers.
5. Hiding or disabling an action is presentation, not enforcement. The server rechecks
   authorization against the exact resource and command input.
6. Data the principal may not observe must not be sent to the browser and then hidden.
7. When the server reports a stale access revision, refresh the access summary, affected
   resource, and affordances before asking the user to retry; never replay a mutation
   automatically under stale authority.
8. Until the target server surfaces exist, record the missing backend contract instead
   of inventing a client-side authorization substitute.

## 15. Visual And Token Boundary

Visual doctrine and token governance are defined in `docs/architecture/10-ui-visual-doctrine-and-token-governance.md`.

Architecture rule:

1. app-level visual declarations live in root `config/ui/**`
2. patterns, screens, and features consume app and design-system tokens
3. patterns and features must not create their own ad hoc theme systems

## 16. Governance And Enforcement

This document is only the architecture contract. Enforcement should converge through:

1. import-boundary linting
2. scaffold/generator support for screens and patterns
3. review checklists for page states, capabilities, and visual doctrine
4. future generated reference routing if UI work needs deeper machine-discoverable entrypoints
