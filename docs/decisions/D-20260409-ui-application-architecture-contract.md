---
id: 'D-cbc320cfdab5'
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

# D-20260409-ui-application-architecture-contract

## Context

Unisane already has a strong backend and runtime architecture contract, plus a first-party UI system in `@unisane/ui`. What remained under-defined was the product-app UI architecture used by starters and platform apps:

1. screen, feature, shell, and pattern ownership could drift per app
2. root UI configuration had no frozen canonical placement
3. app code needed a harder boundary around generated/runtime internals
4. visual doctrine and token governance risked being mixed into feature code or one large narrative lawbook

The repo needed one final document split and boundary contract so future starter/platform UI work does not re-litigate structure every time.

## Decision Drivers

1. Keep starter and platform app UI structure predictable.
2. Make page composition and app-shell ownership obvious.
3. Preserve a strict runtime/generated boundary for frontend app code.
4. Separate structural architecture from visual doctrine without losing either.
5. Keep the docs small enough for humans and LLMs to route correctly.

## Considered Options

1. Keep one giant UI lawbook that mixes architecture, blueprints, visual rules, and authoring workflow.
2. Add only a short UI baseline and leave page, shell, and token doctrine implicit.
3. Freeze a layered UI doc set: architecture SSOT, page blueprints, visual doctrine, compact baseline, targeted how-to guides, and an active plan for enforcement follow-up.

## Decision

Selected option: `3`.

The canonical UI contract is now:

1. root `config/ui/**` owns authored UI declarations
2. the canonical UI chain is `route -> route-group layout -> app shell -> screen -> pattern family -> feature sections -> platform/support/state`
3. `src/screens/**` owns route-level composition
4. `src/features/**` owns business UI capability
5. `src/patterns/pages/**`, `src/patterns/sections/**`, `src/patterns/shells/**`, and `src/patterns/feedback/**` own reusable structure
6. `src/platform/**` is the only app-facing runtime bridge and the only allowed consumer of generated/runtime internals
7. `src/state/**` is optional and promotion-only
8. visual doctrine and token governance are a separate canonical architecture document, not mixed into the structural architecture doc

The durable UI doc set is:

1. `docs/architecture/08-ui-application-architecture.md`
2. `docs/architecture/09-ui-page-blueprints.md`
3. `docs/architecture/10-ui-visual-doctrine-and-token-governance.md`
4. `docs/standards/10-ui-application-architecture-baseline.md`
5. `docs/guides/add-ui-screen.md`
6. `docs/guides/add-ui-theme-and-app-tokens.md`

## Consequences

- Positive:
  - starter and platform apps now share one UI ownership model
  - app-shell structure, page patterns, and feature ownership are explicit
  - app-level tokens and visual policy gain one canonical home
  - UI tasks can route through a compact baseline before loading deeper docs
- Negative / tradeoffs:
  - requires future enforcement and scaffolding work to keep drift down
  - adds new canonical docs that must stay synchronized as the UI system evolves
  - some existing app-local UI code may now look structurally under-specified and will need gradual convergence

## Enforcement Updates

- Gates/scripts/docs updated to enforce decision:
  - add canonical UI architecture, blueprint, visual-doctrine, baseline, and how-to docs
  - update doc routers so UI work is discoverable without entering the default first-load path
  - keep future lint/generator work tracked through the active UI architecture plan
- Validation commands:
  - `pnpm docs:core:check`
  - `pnpm architecture:index:check`
  - `pnpm program:index:check`

## Rollback / Follow-up

- How to revert/supersede if needed:
  - supersede with a new decision that explicitly changes the UI layer model, root config boundary, or doc split in the same change
- Follow-up workpacks/issues:
  - add import-boundary and generated-runtime enforcement for the new UI layers
  - add scaffolding for screens, patterns, and app token files
  - decide whether generated LLM reference surfaces need explicit UI-doc routing beyond the current doc routers

## Changelog

- `2026-04-09`: Initial decision entry created to freeze the UI application architecture contract, the root `config/ui/**` boundary, the route-to-screen/page-pattern model, and the split between structural UI docs and visual token governance.
