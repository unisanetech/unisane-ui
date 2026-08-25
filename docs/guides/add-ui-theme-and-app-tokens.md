---
id: 'DOC-d326afbd58e1'
owner: 'unisane'
repository: unisane-ui
scope: workspace
role: guide
lifecycle: durable
authority: supporting
provenance: accepted
view: current
---

# Add UI Theme And App Tokens

Use this guide when a starter or platform app needs app-level visual policy, not a one-off local component tweak.

## Changelog

- `2026-08-15`: Moved adopter tooling to the independent UI-owned `unisane-ui` CLI.
  Framework `unisane` and Ops `unisane-ops` do not host or forward UI commands; the
  former combined-host command shape is transitional residue to be deleted in the
  implementation cutover.
- `2026-07-21`: Aligned the first-party stylesheet order with the compiled package baseline and reiterated that app CSS scans app source only.
- `2026-07-14`: Replaced the hybrid `theme.ts`/provider vocabulary with one `appearance.ts` runtime-preference contract and no compatibility aliases or storage fallback.
- `2026-07-14`: Added explicit CLI-managed appearance axes, local/runtime provider paths, persistence policy, and pre-hydration integration while keeping project color and scheme generated.
- `2026-07-14`: Replaced direct token-package layering with one global stylesheet, generated semantic theme replacement, the first-party package baseline, and explicit runtime appearance opt-ins.
- `2026-04-09`: Added the canonical workflow for app-level theme and token authorship under root `config/ui/**`, including layering, allowed overrides, and drift prevention rules.

## Goal

Extend or brand an app without creating a second token system inside patterns, screens, or features.

## Open First

1. `docs/architecture/10-ui-visual-doctrine-and-token-governance.md`
2. `docs/architecture/08-ui-application-architecture.md`
3. `docs/standards/10-ui-application-architecture-baseline.md`

## Canonical Files

Author app-level visual policy in:

1. `config/ui/appearance.ts`
2. `config/ui/tokens.ts`
3. `config/ui/navigation.ts`
4. `config/ui/metadata.ts`
5. `config/ui/density.ts`
6. `src/app/globals.css` or the framework-equivalent global stylesheet

## Workflow

### 1. Decide Whether The Change Is App-Level

Use `config/ui/**` only when the change affects:

1. more than one page family
2. the app shell or navigation chrome
3. typography, density, or color semantics
4. app-brand identity

If the change is only a local business presentation concern, keep it near the feature or pattern and consume existing tokens.

### 2. Extend Tokens At The Right Layer

Stylesheet order for a first-party runtime app:

1. `@import '@unisane/ui/styles.css'`
2. `@import 'tailwindcss'`
3. generated app semantic values
4. app-owned overrides

Declare only app-owned Tailwind sources. Never add `@source` paths into `unisane-ui` or another package workspace.

External projects receive the equivalent generated baseline and semantic values directly in this one file. They do not import `@unisane/ui` or `@unisane/tokens`.

Initialize an external project with one selected color theme:

```bash
unisane-ui init --theme blue
```

Change the selected theme later without replacing app-owned CSS:

```bash
unisane-ui theme green
```

The theme command replaces only the region bounded by `/* unisane:theme:start */` and `/* unisane:theme:end */`, writes `globals.css.backup`, and fails when the managed region is missing or malformed.

Enable runtime user preferences only when the product exposes them:

```bash
unisane-ui appearance enable --axes mode,density,contrast --persistence localStorage
```

External projects then import `AppearanceProvider` and `AppearanceScript` from `@/components/ui/appearance-provider`. First-party apps use `@unisane/ui/appearance-provider`. Pass the same explicit `enabledAxes` and persistence policy to both; do not put project color theme or generated scheme into provider state.

Rules:

1. add semantic extensions, not raw-value shortcuts
2. prefer naming by role, not by appearance
3. avoid duplicating existing semantic meaning
4. keep palette/tone calculation inside the generator; app CSS consumes final semantic roles
5. keep documentation-only multi-theme preview CSS out of consumer baselines

### 3. Keep Visual And Appearance Policy Centralized

`config/ui/appearance.ts` owns:

1. enabled runtime appearance axes
2. their typed defaults
3. persistence policy and key

`config/ui/tokens.ts`, the root layout, and the managed semantic region in `globals.css` own typography, app token extensions, font setup, and the selected project color theme. Color selection is never provider state.

Color-theme changes replace the managed semantic `:root` and `.dark` values. Do not add `[data-color-theme]` layers for ordinary project theme selection.

Do not scatter these choices across feature components.

### 4. Consume Tokens, Do Not Re-Declare Them

Patterns, screens, and features should:

1. consume app and design-system tokens
2. stay within existing spacing and typography roles
3. avoid raw hex, shadow, radius, and spacing values as policy defaults

### 5. Verify Accessibility And Drift

Before closing the change, verify:

1. contrast and focus visibility still work
2. status semantics are preserved
3. page-family spacing and hierarchy remain consistent
4. the app did not gain a second local visual language
5. the app still has one global stylesheet and no direct token import or UI source scan

## Allowed Overrides

1. app brand accents and surfaces
2. shell chrome and navigation tone
3. typography family selection
4. density defaults
5. chart or data-visualization palette extensions

## Forbidden Drift

1. feature-local theme objects used as app policy
2. duplicate token systems inside a feature
3. raw color literals or spacing constants as cross-page defaults
4. app-brand overrides that break accessibility or semantic status meaning

## Completion Checklist

1. The change is truly app-level.
2. The new token or theme rule lives in `config/ui/**`.
3. Naming is semantic, not visual-only.
4. Existing semantic tokens were considered before adding a new one.
5. Patterns/screens/features consume the token instead of re-declaring it.
6. Accessibility and hierarchy remain intact.
