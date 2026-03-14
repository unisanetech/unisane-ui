# Unisane UI Implementation Checklist

Use this checklist when improving the `@unisane/ui` design system, token system, theming runtime, and quality gates. This is a package-local execution checklist, not the canonical visual-system spec. Permanent rules still live in:

- `DESIGN_SYSTEM.md`
- `COMPONENT_AUTHORING.md`

## Goal

Keep implementation work aligned around two active improvement tracks:

1. tighten component consumption so the system is consumed consistently
2. strengthen quality gates so regressions are caught automatically

## Current Assessment

- Component consumption: mostly disciplined
- Quality system: moderate, not yet strong

## Success Criteria

- [x] token package tests are green
- [x] UI package contract/type/test gates are green
- [x] package and docs runtime utilities are not duplicated without intent
- [ ] field-family behavior is shared instead of reimplemented ad hoc
- [x] status color tokens have an explicit system policy
- [x] `ThemeProvider` has runtime behavior coverage
- [x] high-traffic components have accessibility and interaction coverage
- [x] major theme axes have matrix or visual regression coverage

## Track 1: Component Consumption Cleanup

### Phase 1: Normalize Shared Runtime Styling

- [ ] keep `@unisane/tokens` limited to token CSS, Tailwind `@theme`, and token-derived utilities
- [ ] keep `@unisane/ui` responsible for package runtime styles such as focus, ripple, sidebar variables, and shared component utilities
- [x] remove duplicated public utility definitions from `apps/docs/app/globals.css` when the same utility already exists in `packages/core/src/styles.css`
- [ ] document utility ownership so app-level styles extend package behavior instead of redefining the same public class names

Files to review:

- `unisane-ui/packages/tokens/scripts/tokens-build/css/sections/*.mjs`
- `unisane-ui/packages/core/src/styles.css`
- `unisane-ui/apps/docs/app/globals.css`

Done means:

- [x] no duplicated package-public animation or z-index utility classes remain across package and docs app

### Phase 2: Consolidate Field Behavior

- [x] extract shared field-state behavior from the existing field family
- [x] keep `field-size.ts` as the shared sizing contract
- [x] centralize floating-label, helper/error, icon-padding, and focus-state orchestration into one shared foundation
- [ ] migrate `TextField`, `Input`, `Select`, `Combobox`, `DateInput`, `SearchBar`, `DatePicker`, and `TimePicker` onto that shared foundation where it reduces real duplication

Files to review:

- `unisane-ui/packages/core/src/components/text-field.tsx`
- `unisane-ui/packages/core/src/primitives/input.tsx`
- `unisane-ui/packages/core/src/components/select.tsx`
- `unisane-ui/packages/core/src/components/combobox.tsx`
- `unisane-ui/packages/core/src/components/date-input.tsx`
- `unisane-ui/packages/core/src/components/search-bar.tsx`
- `unisane-ui/packages/core/src/components/date-picker.tsx`
- `unisane-ui/packages/core/src/components/time-picker.tsx`
- `unisane-ui/packages/core/src/lib/field-size.ts`

Done means:

- [ ] field-family components no longer each own separate floating-label and helper-text logic without justification

### Phase 3: Finish Semantic Token Ownership

- [x] decide whether `success`, `warning`, and `info` are generated tonal families or intentionally fixed semantic aliases
- [x] prefer generated tonal families if the goal is full theme-system ownership
- [x] update the token config/schema or docs so the policy is explicit
- [x] avoid leaving status tokens as undocumented magic values

Files to review:

- `unisane-ui/packages/tokens/src/theme-config.json`
- `unisane-ui/packages/tokens/src/theme-config.schema.json`
- `unisane-ui/packages/tokens/scripts/tokens-build/css/sections/core-tokens.mjs`
- `unisane-ui/packages/tokens/scripts/tokens-build/css/sections/dark-mode.mjs`

Done means:

- [x] all major semantic color families follow one clear ownership model

### Phase 4: Reduce Component-Local Drift

- [x] audit repeated token, state-layer, focus, and sizing patterns across action components
- [x] audit repeated token, border, and elevation patterns across surface components
- [x] move repeated behavior into shared primitives only when duplication is real and stable
- [x] avoid over-abstracting simple components that are already clear
- [x] keep global theme axes global; do not add component-local `density` behavior

Files to review:

- `unisane-ui/packages/core/src/components/button.tsx`
- `unisane-ui/packages/core/src/components/icon-button.tsx`
- `unisane-ui/packages/core/src/components/fab.tsx`
- `unisane-ui/packages/core/src/primitives/surface.tsx`
- `unisane-ui/packages/core/src/lib/utils.ts`
- `unisane-ui/packages/core/scripts/check-component-contract.mjs`

Done means:

- [x] high-traffic component families share the right primitives without introducing abstraction noise

## Track 2: Quality System Upgrade

### Phase 0: Stabilize The Red Gate

- [x] fix the failing token snapshot test
- [x] determine whether the current diff is intended output change or accidental generator drift
- [x] update the snapshot only if the output change is intentional
- [x] keep the snapshot strict after the fix

Current blocker:

- [x] `pnpm --filter @unisane/tokens test` is green

Files to review:

- `unisane-ui/packages/tokens/scripts/tokens-build/__tests__/build-output.test.mjs`
- `unisane-ui/packages/tokens/scripts/tokens-build/__snapshots__/blue.unisane.css`
- `unisane-ui/packages/tokens/scripts/tokens-build/css/sections/*.mjs`

### Phase 1: Add ThemeProvider Behavior Tests

- [x] verify HTML attribute bootstrap behavior
- [x] verify localStorage override behavior
- [x] verify `storageKey={false}` disables persistence
- [x] verify `.dark` class and `color-scheme` application
- [x] verify `system` mode reacts to `matchMedia` changes
- [x] verify invalid stored values are ignored safely

Files to review:

- `unisane-ui/packages/core/src/layout/theme-provider.tsx`
- `unisane-ui/packages/core/tests`

Done means:

- [x] `ThemeProvider` has dedicated runtime tests with DOM assertions

### Phase 2: Add Token-Axis Matrix Tests

- [x] cover representative `data-color-theme` values such as `blue`, `green`, `neutral`, and `black`
- [x] cover `data-scheme` values `tonal`, `neutral`, and `monochrome`
- [x] cover `data-contrast` values `standard`, `medium`, and `high`
- [x] cover light and dark mode
- [x] smoke-test density, radius, and elevation axis behavior
- [x] assert that key CSS variables differ where expected and remain stable where expected

Files to review:

- `unisane-ui/packages/tokens/scripts/tokens-build/__tests__`
- `unisane-ui/packages/tokens/dist/unisane.css`

Done means:

- [x] theme-axis regressions are caught before release

### Phase 3: Add Accessibility And Interaction Tests

Priority components:

- [x] Button
- [x] TextField
- [x] Dialog
- [x] Tooltip
- [x] DropdownMenu
- [x] Select
- [x] Tabs
- [x] Toast
- [x] TimePicker

For each component, cover:

- [ ] keyboard behavior
- [ ] focus-visible behavior
- [ ] ARIA wiring
- [ ] controlled and uncontrolled state contracts where applicable
- [ ] disabled and loading semantics where applicable
- [ ] escape and close behavior for overlays where applicable

Done means:

- [x] the highest-traffic component families have behavior coverage, not just source-pattern checks

### Phase 4: Add Visual Regression Coverage

- [x] create stable fixtures for surface hierarchy
- [x] create stable fixtures for border semantics
- [x] create stable fixtures for button variants
- [x] create stable fixtures for field variants and sizes
- [x] create stable fixtures for dark mode and contrast modes
- [x] create stable fixtures for density and radius presets
- [x] use docs examples as fixtures where that keeps maintenance low

Files to review:

- `unisane-ui/apps/docs/app/(app-shell)/docs/getting-started/theming/page.tsx`
- `unisane-ui/apps/docs/lib/docs/content/foundations/*.tsx`

Done means:

- [x] major visual regressions are detectable without manual review

### Phase 5: Tighten Package Gates

- [ ] keep token tests mandatory
- [ ] keep UI contract check mandatory
- [ ] keep UI package tests and typechecks mandatory
- [ ] validate registry freshness and import rewriting
- [ ] add a duplication check for package-public utility class names if drift keeps recurring
- [ ] consider a grep-style guard against raw hard-coded colors in `packages/core/src`

Primary commands:

- [ ] `pnpm --filter @unisane/tokens test`
- [ ] `pnpm --filter @unisane/ui check:contract`
- [ ] `pnpm --filter @unisane/ui test`
- [ ] `pnpm --filter @unisane/ui check-types`
- [ ] `pnpm -w architecture:check`
- [ ] `pnpm -w typecheck`

## Recommended Execution Order

- [x] fix token snapshot failure
- [x] remove package and docs runtime utility duplication
- [x] add `ThemeProvider` behavior tests
- [x] add token-axis matrix tests
- [ ] extract shared field foundation
- [x] add accessibility tests for the top-priority components
- [x] finish status-token ownership policy
- [ ] add visual regression coverage

## Working Notes

- Keep this checklist current as work lands.
- When a phase is completed, update the relevant permanent docs:
  - `DESIGN_SYSTEM.md`
  - `COMPONENT_AUTHORING.md`
- If a fix reveals a broader repo-level issue, record it in the core findings system instead of leaving the problem only in this package-local checklist.
