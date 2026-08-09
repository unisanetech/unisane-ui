---
id: 'A-ui-design-system'
owner: 'ui-maintainers'
scope: workspace
role: architecture
lifecycle: durable
authority: canonical
provenance: accepted
view: current
---

# Unisane Design System

Unisane is a token-first product UI system. It borrows useful semantics from Material and useful authoring ergonomics from shadcn-style component patterns, but it is not a clone of either.

System docs:

- `docs/architecture/design-system.md`: tokens, theming, surfaces, motion, and visual-system rules
- `docs/standards/component-authoring.md`: component API, composition, accessibility, and no-drift authoring rules

## Token Architecture

```
@unisane/tokens (single source of truth)
├── src/theme-config.json  → Base config (hue, chroma, etc.)
├── scripts/build.mjs      → Generates CSS tokens
└── dist/unisane.css       → Merged output (tokens + @theme mapping)

@unisane/ui
├── src/styles.css         → Component styles (animations, utilities, focus rings)
└── components/*           → React components
```

**Import in your app:**

```css
@import 'tailwindcss';
@import '@unisane/tokens/unisane.css';
```

### Ownership Boundary

- `@unisane/tokens` is limited to:
  - token generation
  - semantic CSS variables
  - Tailwind `@theme` mapping
  - token-derived utilities that are part of the token contract
- `@unisane/ui` is responsible for:
  - runtime package styles in `packages/ui/src/styles.css`
  - shared component utility classes
  - focus, ripple, shell, and animation behavior
- app stylesheets such as `apps/docs/app/globals.css` should extend package behavior, not redefine package-public utilities

### Token Namespaces

| Prefix           | Description                            | Example                  |
| ---------------- | -------------------------------------- | ------------------------ |
| `--ref-*`        | Reference palette values (OKLCH tones) | `--ref-primary-40`       |
| `--tone-*`       | Tone mapping layer (light/dark mode)   | `--tone-primary`         |
| `--color-*`      | Semantic color tokens                  | `--color-primary`        |
| Tailwind classes | Final utility classes                  | `bg-primary`, `shadow-1` |

### Appearance Axes

Project color themes replace the canonical semantic values in CSS. Runtime attributes exist only for explicitly enabled user preferences.

| Axis         | Attribute           | Controls            | Values                                |
| ------------ | ------------------- | ------------------- | ------------------------------------- |
| Mode         | `data-theme-mode`   | Light/dark behavior | light, dark, system                   |
| Contrast     | `data-contrast`     | Tone darkness       | standard, medium, high                |
| Density      | `data-density`      | Component density   | dense, compact, standard, comfortable |
| Radius       | `data-radius`       | Corner softness     | none, minimal, sharp, standard, soft  |
| Action shape | `data-action-shape` | Action geometry     | standard, full                        |
| Elevation    | `data-elevation`    | Shadow depth        | flat, subtle, standard, pronounced    |

---

## Color Tokens

### Surface Tones

| Token                                   | Usage                               |
| --------------------------------------- | ----------------------------------- |
| `bg-surface`                            | Canonical app/page canvas           |
| `bg-surface-container-lowest`           | Lowest nested surface on the canvas |
| `bg-surface-container-low/high/highest` | Nested and elevated containers      |
| `text-on-surface`                       | Text on surfaces                    |
| `text-on-surface-variant`               | Secondary text                      |

Light theme keeps `bg-surface` white. Dark theme keeps `bg-surface-container-lowest` slightly darker than `bg-surface` so the depth scale still reads correctly.

### Semantic Colors

| Color     | Filled                           | Tonal Container                                      |
| --------- | -------------------------------- | ---------------------------------------------------- |
| Primary   | `bg-primary text-on-primary`     | `bg-primary-container text-on-primary-container`     |
| Secondary | `bg-secondary text-on-secondary` | `bg-secondary-container text-on-secondary-container` |
| Tertiary  | `bg-tertiary text-on-tertiary`   | `bg-tertiary-container text-on-tertiary-container`   |
| Error     | `bg-error text-on-error`         | `bg-error-container text-on-error-container`         |

### Token And Alpha Usage

- Use semantic tokens when the role is semantic: `bg-surface`, `bg-surface-container`, `text-on-surface`, `border-control-outline`
- Use semantic border tokens for structural chrome:
  - `border-control-outline` for persistent boundaries on required value-entry controls, binary controls, and grouped selectors, including connected-segment separators
  - `border-outline-soft` for floating surfaces, card shells, and quiet component frames that should read after surface hierarchy, not before it
  - `border-outline-weak` for repeated table/grid dividers
  - `border-outline-muted` for passive affordances such as scrollbar thumbs and drag handles
  - `border-outline-subtle` for optional outlined actions and non-structural internal seams
  - `border-outline-medium` for hover emphasis and intentionally emphasized separators
  - `border-primary`, `border-error`, and similar semantic colors only for selected or status states
- Border strength ladder, quiet to strong:
  - `outline-weak` for repeated dividers and barely-there structure
  - `outline-soft` for quiet outer frames
  - `outline-muted` for passive affordances like scrollbar thumbs and drag handles
  - `outline-subtle` for optional action boundaries and non-structural internal seams
  - `control-outline` for persistent required-control and grouped-control boundaries, including connected-segment separators
  - `outline-medium` for hover and separator emphasis
  - `outline-strong` for exceptional emphasis
- Use `/nn` alpha modifiers when transparency is the treatment: `bg-scrim/30`, `hover:bg-on-surface/8`, `bg-surface/80`
- Do not invent alpha-based classes to replace tokens that already exist semantically
- Do not use `/nn` alpha border classes as the default site or component border pattern
- Do not create new token variants only to express a simple alpha treatment
- For selected rows/items in navigation and option lists, use `bg-state-selected text-on-surface` as the canonical selected treatment

---

## Spacing System

### Unit-Based Spacing

Base unit: `4px * var(--scale-space)`

```css
/* Usage: p-4u → 16px at standard, 14px at compact */
gap-2u   /* 8px */
p-4u     /* 16px */
m-6u     /* 24px */
```

### Density Presets

| Preset        | Space Scale | Type Scale | Radius Scale |
| ------------- | ----------- | ---------- | ------------ |
| `dense`       | 0.75        | 0.85       | 0.85         |
| `compact`     | 0.875       | 0.9        | 0.9          |
| `standard`    | 1.0         | 1.0        | 1.0          |
| `comfortable` | 1.1         | 1.0        | 1.0          |

Density is owned by the theme axis only. Runtime viewport state may drive responsive layout, but it must not overwrite `--scale-space`, `--scale-type`, or `--scale-radius`.

---

## Elevation (Shadows)

| Token   | Class      | Usage                        |
| ------- | ---------- | ---------------------------- |
| Level 0 | `shadow-0` | Flat surfaces                |
| Level 1 | `shadow-1` | Elevated cards, resting FABs |
| Level 2 | `shadow-2` | Hover/raised states          |
| Level 3 | `shadow-3` | Menus, popovers              |
| Level 4 | `shadow-4` | Dialogs, navigation drawer   |
| Level 5 | `shadow-5` | Sheets, modal overlays       |

Default components (buttons, alerts, switches) stay flat and rely on state layers; elevation is reserved for floating surfaces.

---

## Motion Tokens

### Durations

| Token      | Utility               | Value | Usage                     |
| ---------- | --------------------- | ----- | ------------------------- |
| Short      | `duration-short`      | 100ms | Micro-interactions        |
| Snappy     | `duration-snappy`     | 150ms | Button clicks, hovers     |
| Medium     | `duration-medium`     | 250ms | Transitions               |
| Emphasized | `duration-emphasized` | 300ms | Significant state changes |
| Long       | `duration-long`       | 500ms | Page/layout transitions   |

### Easing

| Token      | Utility           | Usage                        |
| ---------- | ----------------- | ---------------------------- |
| Standard   | `ease-standard`   | Default for all              |
| Emphasized | `ease-emphasized` | Important transitions        |
| Decelerate | `ease-decelerate` | Entering and settling motion |
| Accelerate | `ease-accelerate` | Exiting motion               |
| In         | `ease-in`         | Exiting elements             |
| Out        | `ease-out`        | Entering elements            |

Motion rule:

- if a motion utility is documented here, it must exist in the compiled CSS contract
- do not use undocumented local aliases in components

---

## Border Radius

| Token             | Class          | Value (at scale 1) |
| ----------------- | -------------- | ------------------ |
| Extra Small       | `rounded-xs`   | 4px                |
| Small             | `rounded-sm`   | 8px                |
| Medium            | `rounded-md`   | 12px               |
| Large             | `rounded-lg`   | 20px               |
| Extra Large       | `rounded-xl`   | 32px               |
| Extra Extra Large | `rounded-2xl`  | 48px               |
| Full              | `rounded-full` | 9999px             |

### Radius Themes

Use `data-radius` to switch corner softness without changing components:

- `data-radius="none"` → `--scale-radius-theme: 0`
- `data-radius="minimal"` → `--scale-radius-theme: 0.25`
- `data-radius="sharp"` → `--scale-radius-theme: 0.5`
- `data-radius="standard"` → `--scale-radius-theme: 1.0` (default)
- `data-radius="soft"` → `--scale-radius-theme: 1.25`

---

## Control Sizes

Field-like controls (`Input`, `TextField`, `Select`, `DateInput`, `Combobox`, `SearchBar`) use one shared size scale:

| Size | Height token       | Usage                            |
| ---- | ------------------ | -------------------------------- |
| `sm` | `--size-action-sm` | Dense forms, inline filters      |
| `md` | `--size-action-md` | Default field size               |
| `lg` | `--size-action-lg` | Prominent inputs, larger layouts |

Buttons, icon buttons, FABs, avatars, and pagination controls should use the shared component-size tokens so density remains global instead of being reimplemented with fixed utility heights.

Density-owned composite families must scale row height, typography, icon size, action frame, and action inset together. Header and row actions must fit within the declared row height at every density.

---

## Component Variant Guidelines

### Button Variants

| Variant    | Usage                 |
| ---------- | --------------------- |
| `filled`   | Primary actions, CTAs |
| `tonal`    | Secondary actions     |
| `outlined` | Tertiary actions      |
| `text`     | Low-emphasis actions  |
| `elevated` | Special emphasis      |

Visual presentation and semantic emphasis are separate contracts. Use `variant` for presentation and `tone` for meaning; destructive actions use `tone="danger"` instead of adding danger to a presentation-only variant union.

### State Layer Opacity

| State    | Opacity | Token             |
| -------- | ------- | ----------------- |
| Hover    | 8%      | `opacity-hover`   |
| Focus    | 10%     | `opacity-focus`   |
| Pressed  | 10%     | `opacity-pressed` |
| Dragged  | 16%     | `opacity-dragged` |
| Disabled | 38%     | `opacity-38`      |

---

## Typography Scale

All 15 M3 typography roles are available:

| Role     | Class                              |
| -------- | ---------------------------------- |
| Display  | `text-display-large/medium/small`  |
| Headline | `text-headline-large/medium/small` |
| Title    | `text-title-large/medium/small`    |
| Body     | `text-body-large/medium/small`     |
| Label    | `text-label-large/medium/small`    |

---

## Component Patterns

### CVA Structure (shadcn style)

```tsx
import { cva, type VariantProps } from 'class-variance-authority';

const buttonVariants = cva('base-classes...', {
  variants: {
    variant: { filled: '...', outlined: '...' },
    size: { sm: '...', md: '...', lg: '...' },
  },
  defaultVariants: { variant: 'filled', size: 'md' },
});

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => (
    <button ref={ref} className={cn(buttonVariants({ variant, size }), className)} {...props} />
  ),
);
```

### forwardRef Usage

All interactive components should use `forwardRef` for accessibility and ref attachment.

### Ripple Effect

Use the `<Ripple />` component inside interactive elements for M3-compliant touch feedback.

### Authoring Boundary

- Token and utility choices belong here in the design-system contract.
- Component API naming, composition rules, and authoring constraints belong in
  `docs/standards/component-authoring.md`.
