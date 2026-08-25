---
id: 'PLAN-35a08e6e96db'
owner: 'unisane'
repository: unisane-ui
scope: workspace
role: plan
lifecycle: active
authority: supporting
provenance: accepted
view: current
status: active
appliesTo:
  - 'application'
  - 'architecture'
  - 'plan'
---

# Framework UI Application Architecture Plan

Define one canonical UI architecture system for Unisane starters and platform apps so page building, visual governance, and app-scale frontend growth stay predictable.

## Program Routing

This is a peer `unisane-ui` Plan, not a P-7 child. It owns UI application structure,
visual governance, and UI enforcement outcomes. P-7 and accepted Framework Decisions
govern only the Compiler, runtime, package, and generated-client interfaces consumed
across the repository boundary; neither program becomes the other's implementation or
release owner.

## Changelog

- `2026-08-23`: Removed the retired Invoice Platform from current UI proof and future
  migration routing. Its completed P65 slices remain historical evidence; surviving
  enforcement and adoption must use current starters or products.
- `2026-08-15`: Recorded peer routing beside P-7 and retained UI application
  architecture and enforcement under `unisane-ui` ownership.
- `2026-04-09`: Archived `P65-W5` after `data-entry-lm` converged end to end on the new UI contract. The plan now has two real proving surfaces, `invoice-platform` and `data-entry-lm`, and the next remaining starter/platform migration slice still needs explicit selection before the enforcement wave opens.
- `2026-04-09`: Opened `P65-W5` for the full `data-entry-lm` convergence slice after invoice-platform proved the new UI contract structurally, internally, and visually. The active lane now removes top-level `src/components/**`, promotes `config/ui/**`, and routes auth, public, and workspace surfaces through canonical screens, patterns, support, and state ownership.
- `2026-04-09`: Opened `P65-W4` for invoice-platform visual-doctrine convergence so the proving app now aligns app tokens, spacing, typography, and shell/page hierarchy with the documented visual contract after the structural and feature-internal slices landed.
- `2026-04-09`: Opened `P65-W3` for invoice-platform feature-internal convergence so the same proving app now removes the remaining legacy `ui/` and `model/` buckets after the top-level app structure landed under `P65-W2`.
- `2026-04-09`: Routed the active UI execution lane from `P65-W1` to `P65-W2`, which now treats `invoice-platform` as the first live end-to-end migration target for the new app UI contract.
- `2026-04-09`: Opened `F-20260409-ui-application-architecture-convergence-gap` and `P65-W1` so the UI plan now has an explicit execution lane for AGENTS and mirror routing, active program tracking, and live starter/platform drift inventory before migration or enforcement work widens.
- `2026-04-09`: Added the workflow and generated-reference direction for the UI lane: use existing command tiers plus UI-specific playbooks now, and defer any dedicated generated UI reference family until compact-routing or scaffold-catalog pressure is proven.
- `2026-04-09`: Added the active UI architecture plan to freeze the initial doc set, folder contract, visual-governance split, and follow-up enforcement path for starters and platform apps.

## Goal

Publish one maintainable UI doctrine for serious product apps built on Unisane:

1. architecture is deterministic
2. page composition is consistent
3. app-shell, pattern, feature, and support ownership stay clear
4. visual quality and token usage do not drift per app or per feature
5. humans and LLMs can load the smallest correct document set for UI work

## Why This Plan Exists

Current backend and runtime rules are already strongly shaped, but frontend app structure still risks local invention:

1. screens, features, and page shells can drift without one root contract
2. app-local visual choices can leak into feature code without token governance
3. starters and platform apps need the same UI vocabulary if they are meant to scale predictably
4. public `@unisane/ui` docs are not the same thing as internal app-architecture SSOT

## Non-Goals

This plan does not:

1. replace public `apps/docs` package documentation
2. define marketing-site or docs-site architecture as the default product-app contract
3. freeze every future lint rule or scaffold before the doc layer exists

## Final Doc Set

The durable UI documentation surface is:

1. `docs/architecture/08-ui-application-architecture.md`
2. `docs/architecture/09-ui-page-blueprints.md`
3. `docs/architecture/10-ui-visual-doctrine-and-token-governance.md`
4. `docs/standards/10-ui-application-architecture-baseline.md`
5. `docs/guides/add-ui-screen.md`
6. `docs/guides/add-ui-theme-and-app-tokens.md`
7. `docs/decisions/D-20260409-ui-application-architecture-contract.md`

The active planning surface remains this plan doc until the first enforcement wave lands.

## Active Execution Lane

- `P65-W1`: route AGENTS and mirror instructions to the new UI docs, open the active
  Finding/Task spine, and freeze the first starter/platform drift inventory before live
  migration begins.
- `P65-W2`: converge `invoice-platform` end to end against the new screen, shell, support, and root `config/ui/**` ownership contract.
- `P65-W3`: remove the remaining legacy feature-internal `ui/` and `model/` structure from `invoice-platform` and converge live features onto canonical internal ownership folders.
- `P65-W4`: align invoice-platform with the visual doctrine by adding canonical app token surfaces plus consistent shell/page spacing and typography across the major page families.
- `P65-W5`: completed. `data-entry-lm` now converges end to end against the same app UI contract, including promoted state placement, public/workspace screen handoff, and deletion of the remaining global `src/components/**` ownership bucket.

## Final Architecture Direction

The canonical UI chain is:

`route -> route-group layout -> app shell -> screen -> pattern family -> feature sections -> platform/support/state`

Core boundary rules:

1. root `config/ui/**` owns authored UI declarations
2. `src/screens/**` owns route-level composition
3. `src/features/**` owns business UI capability
4. `src/patterns/pages/**` owns page-family grammar
5. `src/patterns/shells/**` owns route-family and workspace shell chrome
6. `src/platform/**` is the only app-facing runtime bridge
7. only `src/platform/**` may import generated/runtime internals
8. `src/state/**` is optional and promotion-only

## Open Questions Still Tracked Here

The durable doc set is ready now, but these follow-up items still belong to the active plan:

1. import-boundary enforcement and lint ratchets for the new UI layers
2. scaffolding/generator coverage for screens, patterns, and token files
3. whether compact LLM generated references should gain explicit UI-doc routing beyond normal doc links
4. whether `support/` should later gain narrower codegen/test templates for forms, tables, and permissions

## Workflow Direction

Current execution policy for UI work:

1. use the existing `T0` / `T1c` / `T2` command lanes
2. route humans and LLMs through the compact UI baseline and UI how-to docs first
3. do not add a parallel root `ui:*` command family for ordinary screen/page work

Current generated-reference policy for UI work:

1. there is no dedicated generated UI reference family yet
2. extend current generated references only after a real routing, scaffold-input, or machine-readable blueprint need is proven

## Delivery Phases

### Phase 1: Canonical docs

Land the architecture, blueprint, visual-doctrine, baseline, and authoring docs.

### Phase 2: Router integration

Update core routers so UI work routes to the correct docs without bloating first-load.

### Phase 3: Enforcement

Add or tighten:

1. import rules
2. boundary linting
3. scaffold/generator support
4. review checklists and drift prevention

### Phase 4: LLM discoverability hardening

If UI work becomes frequent enough to require stronger machine routing, extend generated LLM reference surfaces after the written rules are stable.

## Exit Criteria

This plan can leave the active route when all are true:

1. the durable doc set above exists and stays current
2. UI work routes through core routers without ambiguity
3. at least one enforcement wave exists for ownership and generated-boundary rules
4. the remaining open questions either close or move into narrower Tasks/Findings
