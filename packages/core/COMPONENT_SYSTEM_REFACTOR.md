# Unisane Component System Refactor Plan

This document is the working source of truth for the Unisane UI component refactor.

The goal is not to turn Unisane into a Material clone or a shadcn clone. The goal is to build a clearer system that takes the best parts of both and makes the result feel like Unisane.

## Product Positioning

- Unisane visual language: token-driven, semantic, product-oriented, Material-inspired where it helps.
- Unisane authoring model: source-first, React-friendly, props-first, predictable, registry-friendly.
- Unisane composition model: simple components stay props-based; structural components may use compound slots.

## Status

- No active blockers remain from this refactor wave.
- New component work should follow the contracts below and preserve the current no-new-drift baseline.

## Non-Negotiable Decisions

1. Unisane is not a clone.
   Keep Material-inspired semantics like surfaces, elevation, state layers, and accessible field behavior.
   Do not copy Material component dimensions, shell assumptions, or literal API vocabulary when it hurts product consistency.

2. The default API style is props-first.
   Most components should expose a predictable props surface instead of deep slot configuration.

3. Compound slots are allowed only when structure matters.
   Good examples: `Card`, `Dialog`, `Sidebar`, `Tabs`, `TopAppBar`, layout primitives.
   Avoid turning every component into a slot-object system.

4. `asChild` stays.
   Use it for interactive roots and triggers where polymorphism is useful.
   Do not use it as a substitute for real structural APIs.

5. Theme axes stay global.
   Density, radius, contrast, scheme, elevation, color theme, and light/dark mode are runtime theme selectors, not per-component reinventions.

6. Size and density are different concepts.
   Density is global theme scale.
   Size is a component API.
   Do not add local `density` props to components when the intent is really `size`.

7. Root shell semantics are fixed.
   `bg-surface` is the canonical app/page canvas.
   `surface-container-*` is for nested surfaces.

8. Semantic tokens come first.
   Use semantic tokens to express meaning.
   Use alpha modifiers like `/8`, `/10`, `/30`, and `/80` only when transparency is the treatment, not the meaning.

## Canonical API Contract

### Shared Props

Most components should prefer these names when relevant:

- `variant`
- `size`
- `className`
- `disabled`
- `children`
- `asChild`

### Controlled and Uncontrolled State

Use one naming family per state type:

- Visibility: `open`, `defaultOpen`, `onOpenChange`
- Binary selection: `checked`, `defaultChecked`, `onCheckedChange`
- Custom non-native value selection: `value`, `defaultValue`, `onValueChange`
- Native input wrappers that still render a real `<input>` or `<textarea>` may keep native `onChange`

Rule:

- If the component is a true native form wrapper, preserve native React event semantics.
- If the component is a custom widget that models a value, prefer `onValueChange`.

### Composition Rules

- Props-first by default
- Compound component API only for multi-region components
- Avoid global `slots` / `slotProps` as the default system pattern
- Avoid child-cloning APIs unless the component is a trigger/wrapper pattern

### Accessibility Rules

- Trigger/wrapper components must keep keyboard and screen-reader behavior aligned with their visual behavior.
- If a tooltip appears on hover, it must also appear on keyboard focus.
- ARIA relationships like `aria-describedby` must be applied to the actual interactive trigger, not only to a wrapper shell.

## Theming Contract

### Global Theme Axes

The runtime theme owns:

- `data-density`
- `data-radius`
- `data-scheme`
- `data-contrast`
- `data-elevation`
- `data-color-theme`
- `data-theme-mode` plus `.dark`

Component rules:

- Components consume semantic tokens and shared size contracts.
- Components must not define alternate local theme systems.
- Components may respond to global density indirectly through tokenized spacing and typography.

### Surface Contract

- App/page canvas: `bg-surface`
- Nested surfaces: `bg-surface-container-lowest`, `bg-surface-container-low`, `bg-surface-container`, `bg-surface-container-high`, `bg-surface-container-highest`
- Light theme: `surface` is white
- Dark theme: `surface-container-lowest` remains slightly darker than `surface` so depth still reads correctly

### Color And Opacity Contract

- Semantic role comes from tokens: `bg-surface`, `bg-primary-container`, `text-on-surface`, `border-outline-variant`
- Transparency is an allowed modulation layer: `bg-scrim/30`, `hover:bg-on-surface/8`, `border-outline-variant/30`
- Do not use `/nn` to fake a semantic role that should already exist as a token
- Repeated interaction-state alpha values should use the shared opacity vocabulary where possible: `opacity-hover`, `opacity-focus`, `opacity-pressed`, `opacity-dragged`, `opacity-38`

### Motion Contract

- Unisane exposes motion values as named tokens
- If a motion class is documented as public, the compiled CSS must emit it
- Do not document aliases that are not available at runtime
- Prefer existing easing tokens (`ease-standard`, `ease-emphasized`, `ease-decelerate`, `ease-accelerate`) over inventing local aliases

### Shared Control Size Contract

Field-like controls use one shared size scale:

- `sm`: `h-8`
- `md`: `h-10`
- `lg`: `h-12`

This family includes:

- `Input`
- `TextField`
- `Select`
- `Combobox`
- `DateInput`
- `SearchBar`
- `DatePicker`
- `TimePicker`

Buttons and icon buttons should align to the same rhythm unless a component is intentionally a special case.

## Audit Outcome

- Every exported core component family in this checklist has been reviewed against the props-first, token-first contract.
- Controlled and uncontrolled APIs now use the shared naming families: `open/defaultOpen/onOpenChange`, `value/defaultValue/onValueChange`, and native `onChange` only for true native wrappers.
- App-shell layout, standalone navigation, and interactive roots now use clearer boundaries and native semantics where appropriate.
- Docs and examples were synced to the current runtime API, including theming, motion, layout, and accessibility behavior.
- Primitive reuse is now a guideline rather than an inconsistency:
  build on primitives when they reduce repeated semantics; inline token utilities are acceptable when extra indirection would not improve the component contract.

## Refactor Rules By Family

### 1. Actions

Target pattern:

- props-based
- `variant`, `size`, `disabled`, `loading`, `className`
- `asChild` where polymorphism is useful

Components to align:

- [x] `Button`
- [x] `IconButton`
- [x] `Fab`
- [x] `FabMenu`
- [x] `Chip`
- [x] `SegmentedButton`
- [x] `ThemeSwitcher`

### 2. Field and Value Controls

Target pattern:

- shared field size contract
- shared label/helper/error behavior where relevant
- native wrappers keep native `onChange`
- custom widgets move toward `onValueChange`

Components to align:

- [x] `Input`
- [x] `Textarea`
- [x] `TextField`
- [x] `Select`
- [x] `Combobox`
- [x] `SearchBar`
- [x] `Checkbox`
- [x] `Radio`
- [x] `Switch`
- [x] `Slider`
- [x] `Rating`
- [x] `DateInput`
- [x] `DatePicker`
- [x] `TimePicker`
- [x] `SelectionControls`

### 3. Overlays and Menus

Target pattern:

- structural components may use compound parts
- visibility state should use `open`, `defaultOpen`, `onOpenChange`
- trigger composition should use `asChild` only where justified

Components to align:

- [x] `Dialog`
- [x] `ConfirmDialog`
- [x] `Sheet`
- [x] `Popover`
- [x] `Tooltip`
- [x] `DropdownMenu`
- [x] `Command`
- [x] `Toast`

### 4. Navigation and Layout

Target pattern:

- one clear distinction between app-shell navigation and standalone navigation widgets
- viewport-height shell primitives for app layouts
- no duplicated app-shell patterns without explicit boundaries

Boundary:

- `NavigationRail` and `NavigationDrawer` are standalone presentational navigation widgets
- `Sidebar*` components are app-shell primitives that coordinate responsive rail, drawer, backdrop, and content inset behavior
- Sidebar item visuals should reuse the standalone navigation patterns instead of reimplementing them independently

Components to align:

- [x] `AppLayout`
- [x] `Container`
- [x] `Pane`
- [x] `TopAppBar`
- [x] `BottomAppBar`
- [x] `Breadcrumb`
- [x] `Tabs`
- [x] `Pagination`
- [x] `ScrollArea`
- [x] `Nav`
- [x] `NavigationBar`
- [x] `NavigationDrawer`
- [x] `NavigationRail`
- [x] `Sidebar`
- [x] `canonical-layouts`

### 5. Content, Surfaces, and Feedback

Target pattern:

- token-first, semantic, predictable
- compound API only when it materially improves structure
- prefer shared primitives when they reduce drift

Components to align:

- [x] `Surface`
- [x] `Text`
- [x] `Typography`
- [x] `Card`
- [x] `List`
- [x] `Accordion`
- [x] `Divider`
- [x] `Alert`
- [x] `Banner`
- [x] `Badge`
- [x] `Avatar`
- [x] `Skeleton`
- [x] `Progress`
- [x] `Stepper`
- [x] `Carousel`
- [x] `Calendar`
- [x] `Table`
- [x] `StatCard`
- [x] `Ripple`
- [x] `FocusRing`
- [x] `Label`
- [x] `Menu`
- [x] `StateLayer`

## Execution Order

1. Lock the API and theming rules in this document.
2. Finish size-system cleanup across action and field families.
3. Remove local theme-axis reinventions like component-level density props.
4. Clarify navigation boundaries:
   - app-shell navigation
   - standalone navigation widgets
5. Standardize overlay and custom-widget state naming.
6. Audit every exported component family against this checklist.
7. Sync docs after each family lands so examples do not drift again.

## Immediate Priority List

- [x] Replace `SegmentedButton.density` with `size`
- [x] Move `ThemeSwitcher` to the shared size helper
- [x] Standardize refactored custom widgets on `value/defaultValue/onValueChange` and `open/defaultOpen/onOpenChange`
- [x] Decide the long-term boundary between standalone navigation widgets and app-shell sidebar primitives
- [x] Fix `ConfirmDialog` so all close paths respect the loading guard
- [x] Make `Tooltip` keyboard-correct and move ARIA wiring onto the real trigger
- [x] Unify `ToastProvider` and `Toaster` host registration so `toast.*` works with either public host
- [x] Align the documented motion utility contract with emitted CSS
- [x] Complete the docs metadata audit for the remaining component families

## Done Means Done

The refactor is not complete until:

- every exported component family above has been reviewed
- duplicated patterns are either merged or explicitly justified
- theming axes are applied globally, not reinvented locally
- sizing is predictable across related families
- docs and examples match the actual runtime API
