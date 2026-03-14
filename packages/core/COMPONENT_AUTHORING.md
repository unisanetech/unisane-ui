# Unisane Component Authoring

Unisane components follow a props-first, token-first authoring model. The system borrows useful semantics from Material and useful ergonomics from shadcn-style patterns, but it is not a clone of either.

Use this document for component API, composition, theming-integration, and no-drift rules. Use `DESIGN_SYSTEM.md` for tokens, surfaces, motion, and visual-system guidance.

## Positioning

- Unisane visual language: semantic, token-driven, product-oriented
- Unisane authoring model: source-first, registry-friendly, predictable
- Unisane composition model: props-first by default, compound slots only when structure matters

## Non-Negotiable Rules

1. Unisane is not a clone.
   Keep semantic surfaces, elevation, state layers, and accessible field behavior.
   Do not copy Material component sizing drift or MUI-style configuration weight.

2. The default API style is props-first.
   Most components should expose a small, predictable prop surface.

3. Compound slots are allowed only when structure matters.
   Use them for components like `Card`, `Dialog`, `Sidebar`, `Tabs`, `TopAppBar`, and layout primitives.

4. `asChild` stays.
   Use it for interactive roots and trigger composition when polymorphism materially helps.

5. Theme axes stay global.
   Density, radius, scheme, contrast, elevation, color theme, and light/dark mode belong to the theme system, not per-component reinventions.

6. Size and density are different concepts.
   Density is global theme scale.
   Size is a component API.

## Canonical API Contract

### Shared Props

Prefer these names when relevant:

- `variant`
- `size`
- `className`
- `disabled`
- `children`
- `asChild`

### Controlled And Uncontrolled State

Use one naming family per state type:

- visibility: `open`, `defaultOpen`, `onOpenChange`
- binary selection: `checked`, `defaultChecked`, `onCheckedChange`
- custom widget values: `value`, `defaultValue`, `onValueChange`
- native input wrappers may keep native `onChange`

Rule:

- If the component renders a real native field, preserve native event semantics.
- If the component models a custom widget value, prefer `onValueChange`.

### Composition Rules

- Use props-first APIs by default.
- Use compound components for multi-region structure.
- Do not use `slots` / `slotProps` as the default system pattern.
- Avoid child-cloning APIs unless the component is explicitly a trigger/wrapper pattern.

### Accessibility Rules

- Visual trigger behavior and keyboard behavior must match.
- Hover-only behavior must also work on focus when the component is interactive.
- ARIA relationships must be attached to the actual trigger, not only to a wrapper shell.
- Prefer native button, link, input, and header semantics over role recreation.

## Theming Integration Contract

- Consume semantic tokens instead of local theme objects.
- Use the shared control-size contract for field-like controls.
- Do not add component-local theme axes such as local `density` props.
- Root app/page canvas uses `bg-surface`.
- Nested surfaces use the `surface-container-*` ladder.
- Use semantic border tokens for component and page chrome:
  - `border-outline-variant` for default surface, card, table, and section borders
  - `border-outline` for stronger hover or emphasis borders
  - semantic color borders like `border-primary` only for selected or status-driven states
- Do not use `/nn` alpha modifiers as the default border pattern for product surfaces.
- `/nn` alpha remains acceptable for background and scrim treatments where transparency itself is the effect.

## Shared Size Contract

Field-like controls use one shared scale:

- `sm`: `h-8`
- `md`: `h-10`
- `lg`: `h-12`

This contract applies to:

- `Input`
- `TextField`
- `Select`
- `Combobox`
- `DateInput`
- `SearchBar`
- `DatePicker`
- `TimePicker`

Buttons and icon buttons should align to the same height rhythm unless the component is intentionally a special case.

## Family Patterns

### Actions

- props-based
- `variant`, `size`, `disabled`, `loading`, `className`
- `asChild` when polymorphism is useful

### Fields And Value Controls

- shared field sizing
- shared label/helper/error behavior where relevant
- `Input` stays a low-level primitive and should not reintroduce floating-label or helper-text orchestration
- native wrappers keep native `onChange`
- custom widgets prefer `onValueChange`

### Overlays And Menus

- structural APIs may use compound parts
- visibility state uses `open`, `defaultOpen`, `onOpenChange`
- trigger composition uses `asChild` only when justified

### Navigation And Layout

- standalone navigation widgets stay distinct from app-shell sidebar primitives
- app-shell layout primitives use viewport-height shells
- do not duplicate app-shell patterns without a clear boundary

### Content, Surfaces, And Feedback

- token-first and semantic
- compound APIs only when structure materially improves authoring
- reuse primitives when they reduce drift; inline token utilities are acceptable when extra indirection does not help

## No-Drift Checks

`@unisane/ui` package lint includes a component-contract check. It currently blocks:

- local component `density` props
- MUI-style `slots` and `slotProps` prop APIs
- legacy supporting-pane prop names that were removed during the refactor
- undocumented `duration-*` and `ease-*` utility aliases in component source

Run:

```bash
pnpm --dir unisane-ui --filter @unisane/ui lint
```

## Done Means Done

A component change is only complete when:

- the public API follows the contract above
- the runtime implementation matches the docs
- the docs app examples use the real API
- package lint, package typecheck, and workspace architecture/type checks pass
