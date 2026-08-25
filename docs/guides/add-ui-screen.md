---
id: 'DOC-68a343cb6a22'
owner: 'unisane'
repository: unisane-ui
scope: workspace
role: guide
lifecycle: durable
authority: supporting
provenance: accepted
view: current
---

# Add UI Screen

Use this guide when adding or restructuring a non-trivial UI page in a starter or platform app.

## Changelog

- `2026-07-24`: Added the target authorization workflow for server-derived affordances/effective access, trusted facts, non-enforcement hiding, unauthorized-data exclusion, final server rechecks, and stale access revisions.
- `2026-04-09`: Clarified the canonical feature-internal folders: use `components/`, `hooks/`, `lib/`, optional `server/`, `schemas/`, `actions/`, and `view-models/`; do not create legacy `ui/` or `model/` buckets inside features.
- `2026-04-09`: Clarified the placement rule that `support/` remains the canonical neutral support layer and that a top-level `src/components/**` folder should not be introduced for ordinary app work.
- `2026-04-09`: Added the canonical UI screen-authoring workflow for classifying a page, selecting shell and pattern ownership, placing features/platform/support/state correctly, and verifying page states plus capability boundaries.

## Goal

Build a page through the canonical chain instead of starting from one large component.

## Open First

1. `docs/standards/10-ui-application-architecture-baseline.md`
2. `docs/architecture/08-ui-application-architecture.md`
3. `docs/architecture/09-ui-page-blueprints.md`
4. [Framework authorization architecture](https://github.com/unisanetech/unisane/blob/main/docs/architecture/11-authorization-architecture.md) when the screen exposes protected resources, admin/seller actions, affordances, or effective access
5. `docs/architecture/10-ui-visual-doctrine-and-token-governance.md` only if visual/token rules are part of the change

## Workflow

### 1. Classify The Page

Decide:

1. route group in `src/app/**`
2. app shell family in `src/patterns/shells/**`
3. primary page family in `src/patterns/pages/**`

If the page is tiny and self-contained, a full screen module may stay small, but the ownership model still applies.

### 2. Create Or Update The Screen

`src/screens/**` owns:

1. page assembly
2. pattern selection
3. composition of feature sections
4. page-level state switching

Do not move business rules or generated imports into the screen.

### 3. Map Business Sections To Features

For each visible business section, decide which feature owns it.

Use:

1. `src/features/<feature>/components`
2. `src/features/<feature>/hooks`
3. `src/features/<feature>/lib`
4. `src/features/<feature>/server` when server-only feature composition is needed
5. `src/features/<feature>/schemas`
6. `src/features/<feature>/actions`
7. `src/features/<feature>/view-models`

Do not let one feature import another feature directly.
Do not create `ui/` or `model/` buckets inside the feature.

### 4. Choose Data Surfaces In Platform

Use `src/platform/**` for:

1. server fetch helpers
2. browser/query hooks
3. API-safe DTO types
4. generated/runtime bridges

Rules:

1. screens may orchestrate more than one platform surface
2. features may consume platform types and hooks
3. only `src/platform/**` may import generated/runtime internals

### 5. Use Support Before Inventing Shared Logic

Reach for `src/support/**` when the logic is neutral and cross-feature:

1. permissions
2. forms
3. tables
4. filters
5. URLs
6. metadata
7. errors
8. formatting and dates

Do not create `shared`, `helpers`, or `utils` buckets.
Keep `support/` as the canonical name for this layer.

### 6. Promote State Only With Evidence

Choose the lowest valid owner:

1. local component state
2. feature hook state
3. promoted state under `src/state/**`

Do not use `src/state/**` as a second backend cache.

### 7. Define Page States And Permissions

Before finishing the screen, define the relevant states:

1. loading
2. refreshing
3. empty
4. filtered empty
5. error
6. denied
7. not found

Also define:

1. which actions require capabilities
2. whether the action renders hidden, disabled, locked, or read-only

For protected resource, admin, or seller screens, follow the accepted target in the
[Framework authorization architecture](https://github.com/unisanetech/unisane/blob/main/docs/architecture/11-authorization-architecture.md):

1. identify the owning module policy under `src/service/policies/**`
2. consume coarse access summaries only for navigation/page visibility and
   server-derived resource affordances or effective-access projections for row actions,
   sensitive forms, and stateful commands
3. do not infer access from role names, raw permission strings, or client-supplied
   owner/seller/company/relationship facts
4. treat hidden/disabled UI as presentation only; every protected command is rechecked
   by the server against authoritative resource facts and exact input
5. ensure unauthorized rows and fields are omitted by the server rather than sent and
   hidden in the UI
6. on a stale access-revision response, refresh access, resource, and affordance data,
   then require an explicit user retry; do not automatically replay the mutation

These affordance, effective-access, and revision surfaces are planned target APIs, not a
claim of current universal runtime support. If the required server surface is absent,
record the backend gap instead of implementing client-side policy.

### 8. Verify Responsive And Visual Doctrine

Check:

1. shell collapse rules
2. page-family responsive behavior
3. action relocation
4. spacing and typography consistency
5. token usage instead of local ad hoc values

## Suggested File Map

```text
src/app/(group)/route/page.tsx
src/screens/<page>/<page>-screen.tsx
src/features/<feature>/**
src/patterns/pages/<family>/**
src/patterns/shells/<shell>/**
src/support/**
src/state/**              # only if promoted
config/ui/**              # only if app-level visual policy changes
```

Import generated API, hooks, errors, and DTO types through their exact
`#unisane/generated/platform/**` subpaths; do not create authored forwarding files.

Do not add `src/components/**` as a generic app-level bucket. Keep components under their owner, such as `features/**`, `screens/**`, or `patterns/**`.

## Anti-Patterns

1. page components that fetch, mutate, and render everything inline
2. feature-to-feature imports
3. physical `.cache/unisane/**` imports or authored wrappers around generated surfaces
4. feature-local theme or route-helper systems
5. global client state used as default server-data ownership
6. a top-level `src/components/**` folder used as an ownership dump
7. role, raw-permission, or ABAC checks embedded in React components
8. protected data sent to the browser and hidden after render
9. automatic mutation replay after a stale-access response

## Completion Checklist

1. Route group, shell family, and page family are explicit.
2. Screen owns composition and state switching.
3. Each business section has a feature owner.
4. Data access routes through `src/platform/**`.
5. Shared neutral logic routes through `src/support/**`.
6. State promotion is justified.
7. Relevant page states are designed.
8. Capability behavior is explicit.
9. Responsive behavior is defined.
10. Visual doctrine and token rules are still intact.
11. Protected data and actions come from server-derived access projections or an
    explicitly tracked target-API gap.
12. Server recheck and stale-access-revision behavior are defined for protected
    mutations.
