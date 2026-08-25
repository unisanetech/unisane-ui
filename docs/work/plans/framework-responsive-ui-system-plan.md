---
id: 'PLAN-2ec55dab5dce'
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
  - 'responsive'
  - 'system'
  - 'plan'
---

# Framework Responsive UI System Plan

Define a reusable responsive typography, spacing, density, and layout recipe layer for `@unisane/tokens` and `@unisane/ui` so public pages, app pages, admin surfaces, and workspaces can adapt across mobile, tablet, and desktop without platform-specific styling leaking into the shared UI library.

## Program Routing

This is a peer `unisane-ui` Plan, not a P-7 child. It owns responsive UI-system and
token outcomes. P-7 and accepted Framework Decisions govern only the Compiler, runtime,
package, and generated-client interfaces consumed across the repository boundary; neither
program becomes the other's implementation or release owner.

## Changelog

- `2026-08-15`: Recorded peer routing beside P-7 and retained responsive UI-system
  outcomes under `unisane-ui` ownership.
- `2026-07-14`: Reconciled this responsive strategy with the dual-distribution/theme decision: semantic responsive capability remains, but consumer token internals, global spacing replacement, required runtime theme scopes, and non-canonical first-party imports are not implementation authority.
- `2026-05-23`: Clarified that responsive implementation must use the Tailwind v4 breakpoint and container-query surface already emitted by `@unisane/tokens`; do not invent parallel app-specific media-query names or breakpoint systems.
- `2026-05-23`: Added the responsive UI-system strategy after auditing True Resume public/workspace UI and the current `@unisane/tokens` / `@unisane/ui` typography, density, spacing, and sidebar primitives. The plan freezes the reusable system boundary before mobile/tablet public-page implementation begins.

## Goal

Build a neutral responsive design system layer that lets Unisane apps optimize typography, spacing, action layout, media, and surface density across viewport and container sizes while keeping product-specific design in each platform.

Success means:

1. mobile public pages can use compact, readable rhythm without ad hoc utility piles
2. tablet layouts can be intentionally different from both mobile and desktop
3. desktop visual identity remains stable
4. density and type scaling keep working through generated defaults or explicitly enabled runtime appearance attributes
5. `@unisane/ui` exposes reusable capabilities, not True Resume-specific styling
6. platform apps can adopt the system gradually without a full rewrite

## Why This Plan Exists

The current UI stack already has useful foundations. Implementation follows
`docs/decisions/D-20260714-ui-dual-distribution-and-theme-contract.md` and
`docs/guides/add-ui-theme-and-app-tokens.md` where this Plan discusses consumer token
layers, theme scopes, or import paths. The
[archived source-distribution and theme plan](https://github.com/unisane/unisane/blob/5f6e0b3e3dea915b4267a266571c99150834f88b/docs/work/archive/plans/framework-ui-source-distribution-and-theme-system-plan.md)
preserves delivery history only and is not current implementation authority:

1. the internal token generator can emit semantic color, spacing, radius, typography, density, contrast, and Tailwind v4 theme variables.
2. density capability remains, but it must target explicit component/control variables rather than replacing the standard application spacing scale.
3. `@unisane/ui` exposes stable primitive variants such as `displayLarge`, `headlineMedium`, `bodyMedium`, plus components like buttons, tabs, sheets, sidebars, dialogs, and typography.
4. platform apps such as True Resume already layer app-local `config/ui/**` tokens and product-specific page patterns on top of `@unisane/ui`.

The missing layer is a reusable responsive system for page-family roles:

1. primitive type variants are not enough to express responsive page intent
2. mobile/tablet public pages need compact rhythm without globally shrinking every component
3. repeated raw utilities such as `py-14 lg:py-16`, `gap-10`, fixed hero heights, and fixed absolute visuals are hard to maintain across platforms
4. platform-specific fixes should not be encoded inside `@unisane/ui`
5. using JavaScript viewport detection for responsive density would create hydration risk and unnecessary runtime coupling

## Non-Goals

This plan does not:

1. make `displayLarge`, `headlineLarge`, or any primitive typography variant automatically responsive everywhere
2. add True Resume, resume, ATS, template, career, or platform-product vocabulary to `@unisane/ui`
3. replace app-specific visual identity, composition, imagery, copy, or route structure
4. create a mobile-only component fork for every shared component
5. use JavaScript viewport detection to switch density or layout
6. force all platform public pages to look like one marketing template
7. change workspace/editor product decisions such as True Resume's two-zone editor layout

## Ownership Boundary

### `@unisane/tokens`

May own:

1. primitive type scale variables
2. semantic responsive type-role variables
3. semantic spacing and layout variables
4. viewport-aware scale composition variables
5. density, radius, contrast, color, and elevation axes
6. Tailwind v4 mappings for neutral token utilities

Must not own:

1. platform-specific names
2. product copy
3. page content hierarchy
4. marketing-art direction
5. resume/template/workspace visual assets

### `@unisane/ui`

May own:

1. `Typography` support for neutral responsive roles
2. neutral layout primitives or recipes such as `PageSection`, `PageHeader`, `ActionCluster`, `CardGrid`, and `PreviewFrame`
3. container-query-aware component behavior
4. accessible action, media, and surface layout defaults
5. docs examples for generic app, marketing, docs, admin, and workspace page families

Must not own:

1. True Resume public-page composition
2. platform brand tokens
3. domain-specific hero imagery
4. platform-specific navigation or route maps
5. app copy and CTA wording

### Platform Apps

Own:

1. brand palette and font overrides
2. page-family selection
3. exact page composition
4. imagery and preview art
5. product copy
6. app-local shell/workspace layout decisions
7. platform-specific `config/ui/**` tokens

## System Direction

### Primitive Variants Stay Stable

Primitive variants remain literal scale choices:

1. `displayLarge`
2. `displayMedium`
3. `displaySmall`
4. `headlineLarge`
5. `headlineMedium`
6. `headlineSmall`
7. `title*`
8. `body*`
9. `label*`

These must not globally remap by breakpoint. A primitive token should mean the same thing wherever it appears.

### Add Responsive Type Roles

Add semantic roles for page intent:

1. `heroTitle`
2. `pageTitle`
3. `sectionTitle`
4. `sectionLead`
5. `panelTitle`
6. `cardTitle`
7. `eyebrow`

Role tokens may use `clamp()` and media-aware values, but must continue to respect theme scaling through `--scale-type`.

Target CSS shape:

```css
:root,
[data-theme-scope] {
  --scale-type-density: 1;
  --scale-type-user: 1;
  --scale-type-viewport: 1;
  --scale-type: calc(
    var(--scale-type-density) * var(--scale-type-user) * var(--scale-type-viewport)
  );

  --type-role-hero-title-size: clamp(
    calc(34px * var(--scale-type)),
    6vw,
    calc(57px * var(--scale-type))
  );
  --type-role-hero-title-line: clamp(
    calc(40px * var(--scale-type)),
    6.8vw,
    calc(64px * var(--scale-type))
  );
  --type-role-hero-title-weight: 400;
  --type-role-hero-title-tracking: 0;
}
```

Tracking for role tokens should avoid negative letter spacing unless a future visual-doctrine decision explicitly approves it for a role.

### Add Responsive Spacing Roles

Add semantic spacing variables for common page and component rhythms:

1. `--layout-page-x`
2. `--layout-section-y`
3. `--layout-section-y-compact`
4. `--layout-hero-y`
5. `--layout-content-gap`
6. `--layout-panel-padding`
7. `--layout-card-padding`
8. `--layout-cluster-gap`
9. `--layout-grid-gap`

These must respect `--scale-space`, which should be composed instead of overwritten directly:

```css
:root,
[data-theme-scope] {
  --scale-space-density: 1;
  --scale-space-viewport: 1;
  --scale-space: calc(var(--scale-space-density) * var(--scale-space-viewport));
  --unit: calc(4px * var(--scale-space));
}
```

Responsive token overrides should use the Tailwind v4 breakpoint names already emitted by `@unisane/tokens` as the canonical screen taxonomy. Do not invent a parallel breakpoint system.

```css
@media (width < 640px) {
  :root,
  [data-theme-scope] {
    --layout-page-x: calc(var(--unit) * 4);
    --layout-section-y: calc(var(--unit) * 9);
    --layout-hero-y: calc(var(--unit) * 8);
    --layout-content-gap: calc(var(--unit) * 6);
  }
}
```

Use the current Tailwind breakpoints and aliases as the shared vocabulary:

1. `sm`: `640px`
2. `md`: `768px`
3. `lg`: `1024px`
4. `xl`: `1280px`
5. `2xl`: `1536px`
6. `compact`: `0px`
7. `medium`: `600px`
8. `expanded`: `840px`

When authoring components, prefer Tailwind utilities and container-query variants over hand-authored component CSS. Token CSS may contain the minimal generated media queries needed to define global semantic variables, but those queries must align with the Tailwind breakpoint taxonomy.

Do not globally set `data-density="dense"` based on viewport. Mobile density should reduce page whitespace through semantic layout tokens while preserving accessible control sizes.

### Use CSS And Container Queries

Responsive behavior must use:

1. Tailwind v4 responsive utilities for viewport-level component styling
2. Tailwind/container-query variants for component-level adaptation
3. semantic variables for density and scale
4. generated token CSS only when a semantic variable itself must change by breakpoint

Do not use:

1. JavaScript viewport sniffing to switch density
2. hydration-time device detection
3. parallel mobile-only component trees unless a component's interaction model truly changes
4. custom breakpoint names, one-off media-query taxonomies, or app-local breakpoint constants that compete with Tailwind

## UI Library API Direction

### Typography

Extend `Typography` with a neutral `role` prop:

```tsx
<Typography role="heroTitle" component="h1">
  Page title
</Typography>
```

Rules:

1. `variant` keeps primitive meaning.
2. `role` expresses responsive page intent.
3. if both `variant` and `role` are provided, implementation must define one clear precedence. Preferred: type the props as mutually exclusive so callers choose either primitive `variant` or semantic `role`.
4. role classes map to token-backed classes such as `text-role-hero-title`, not hardcoded app utility piles.

### Page And Layout Primitives

Add only neutral primitives or recipes, for example:

1. `PageSection`
2. `PageHeader`
3. `ActionCluster`
4. `CardGrid`
5. `PreviewFrame`

Target behavior:

1. `PageSection` owns semantic vertical rhythm and optional full-width band behavior.
2. `PageHeader` composes title, lead, metadata, and actions without prescribing marketing copy.
3. `ActionCluster` supports horizontal desktop layout and stacked/full-width mobile layout without overflow.
4. `CardGrid` supports container-query-based `minmax()` grids.
5. `PreviewFrame` gives media and product previews a safe aspect-ratio, overflow, and height contract.

These APIs should expose neutral props such as `rhythm`, `tone`, `density`, `collapse`, `minItemWidth`, and `aspectRatio`. They must not expose platform-product props.

## Responsive Capability Checklist

Every responsive system slice should consider:

1. typography roles
2. semantic section/page spacing
3. action wrapping and stacking
4. touch target minimums
5. card/grid minimum widths
6. media aspect ratio and crop behavior
7. desktop-only decorative layers
8. tablet-specific layout thresholds
9. surface border modes
10. overflow and `min-w-0` safety
11. scroll ownership
12. accessible focus, labels, and keyboard behavior

## Surface Rules

### Public And Marketing Pages

Use:

1. responsive type roles
2. compact mobile section rhythm
3. product-revealing imagery
4. action clusters that stack cleanly on narrow screens
5. media frames that cap height and prevent horizontal overflow

Avoid:

1. viewport-filling mobile heroes unless the content is truly compact
2. desktop absolute scene compositions on narrow screens
3. large fixed `min-h-*` visuals without mobile alternatives
4. nested card-heavy sections
5. generic landing-page styling in platform-specific apps

### App Pages

Use:

1. page title and section roles
2. tighter panel/card rhythm than public pages
3. predictable header/action clusters
4. list/detail and management-page recipes

Avoid:

1. hero-scale headings
2. public-page rhythm inside operational app surfaces
3. arbitrary global state for layout decisions

### Admin Pages

Use:

1. compact page titles
2. dense tables/lists with accessible targets
3. predictable toolbar/action wrapping
4. clear filters and status surfaces

Avoid:

1. marketing-page imagery
2. oversized hero composition
3. decorative surfaces that reduce scanning speed

### Workspaces

Use:

1. compact labels and panel titles
2. token-backed pane dimensions
3. controlled scroll zones
4. responsive sheet/drawer behavior for constrained viewports
5. canvas/tool/editor surfaces that preserve task focus

Avoid:

1. page-level scrolling in fixed-height workspaces
2. card-heavy chrome inside editor panes
3. globally shrinking controls below safe touch targets

## True Resume Adoption Path

True Resume is the first proving surface for public-page mobile/tablet responsiveness, but it must consume neutral `@unisane/ui` capabilities instead of shaping the shared package around resume-specific needs.

Adoption order:

1. shared public frame and header spacing
2. home hero
3. home problem, feature, tailor, review, and template sections
4. templates index, category, and detail pages
5. ATS checker
6. pricing
7. resume examples

True Resume keeps:

1. `PublicHeroFrame`
2. `ResumeLandingHeader`
3. `ResumeWorkspacePreview`
4. template preview components
5. public theme variables under `config/ui/**`
6. product copy and route targets

True Resume should replace repeated raw public-page rhythm with system roles and neutral primitives where practical.

## Workstreams

### WS1: Token Foundation

Target:

1. split final type/space scale variables into density, viewport, and user/accessibility inputs
2. add semantic type-role variables
3. add semantic spacing/layout variables
4. map role variables into Tailwind v4 theme utilities
5. update token build tests and snapshots
6. keep generated breakpoint/media behavior aligned with Tailwind v4 `sm` / `md` / `lg` / `xl` / `2xl` plus existing `compact` / `medium` / `expanded` aliases

Verification:

1. `pnpm --filter @unisane/tokens test`
2. `pnpm --filter @unisane/tokens build`

### WS2: UI API

Target:

1. extend `Typography` and `Text` with neutral role support or converge on one canonical typography primitive before role adoption
2. add neutral layout primitives/recipes
3. update `tailwind-merge` class groups for role text utilities
4. add focused component tests
5. update public docs examples

Verification:

1. `pnpm --filter @unisane/ui check-types`
2. `pnpm --filter @unisane/ui validate`

### WS3: Docs And Examples

Target:

1. document type roles, spacing roles, and responsive layout recipes in `apps/docs`
2. add examples for marketing, app, admin, docs, and workspace families
3. clarify that roles are neutral and platform styling remains app-local
4. add visual regression coverage where the docs app already has coverage

Verification:

1. `pnpm --filter @unisane/web test`
2. the registered docs-app visual Action when selected by the current Task

### WS4: True Resume Public Adoption

Target:

1. migrate public page headings to semantic roles
2. migrate section rhythm to semantic spacing
3. replace scattered CTA wrapping with `ActionCluster` or equivalent
4. cap/crop/hide desktop-only visuals on mobile
5. verify mobile/tablet/desktop screenshots

Verification:

1. app typecheck
2. workspace typecheck
3. Playwright screenshots for `/`, `/templates`, representative template detail, `/ats-checker`, `/pricing`, and `/resume-examples`

### WS5: Broader Platform Adoption

Target:

1. identify one operational app surface and one public/docs surface outside True Resume
2. adopt the same neutral responsive roles only where they reduce local utility churn
3. record any missing neutral primitives before widening adoption

Verification:

1. app-specific typecheck
2. screenshot proof for changed surfaces

## Guardrails

Do:

1. keep tokens semantic and app-neutral
2. use CSS media and container queries
3. preserve primitive typography semantics
4. keep product styling in app-local `config/ui/**` and feature/pattern components
5. keep control/tap targets accessible under compact rhythm
6. verify with real screenshots

Do not:

1. globally override `.text-display-large` or similar primitive classes by breakpoint
2. add True Resume naming to `@unisane/ui`
3. use JavaScript viewport detection to switch density
4. shrink all controls globally on mobile
5. encode marketing-page composition inside the base UI package
6. replace platform page patterns with generic UI-library demos
7. introduce parallel mobile-only component families without a real interaction-model reason

## Verification Matrix

Core docs and program routing:

1. `pnpm docs:core:check`
2. `pnpm program:index:check`
3. `pnpm architecture:index:check`

Tokens:

1. `pnpm --filter @unisane/tokens test`
2. `pnpm --filter @unisane/tokens build`

UI package:

1. `pnpm --filter @unisane/ui check-types`
2. `pnpm --filter @unisane/ui validate`

True Resume proving surface:

1. `pnpm --filter @unisane-platforms/true-resume typecheck`
2. `pnpm -w typecheck`
3. screenshot QA at `375x812`, `430x932`, `768x1024`, `1024x768`, and `1440x900`

Primary True Resume pages for visual QA:

1. `/`
2. `/templates`
3. one published `/templates/[slug]`
4. `/ats-checker`
5. `/pricing`
6. `/resume-examples`

## Exit Criteria

This plan can leave the active route when:

1. `@unisane/tokens` exposes responsive semantic role and spacing tokens
2. `@unisane/ui` exposes documented neutral APIs for responsive typography and core layout recipes
3. True Resume public pages prove the system on mobile, tablet, and desktop without product-specific leakage into `@unisane/ui`
4. at least one non-True-Resume surface adopts the neutral system or explicitly confirms no additional primitives are needed
5. durable rules are promoted to `docs/architecture/10-ui-visual-doctrine-and-token-governance.md` and the relevant UI how-to docs
6. completed Task records are archived by Skopos and the Plan is demoted or closed
