---
id: 'DOC-6d9e715dbbcf'
owner: 'unisane'
repository: unisane-ui
scope: workspace
role: architecture
lifecycle: durable
authority: canonical
provenance: accepted
view: current
---

# UI Visual Doctrine And Token Governance

> Purpose: define how Unisane product apps stay visually coherent without turning design-system usage into per-feature improvisation.
>
> Precedence: if this conflicts with `docs/architecture/08-ui-application-architecture.md`, follow `08-ui-application-architecture.md` for ownership and update this file in the same change.

## Changelog

- `2026-08-15`: Assigned UI adopter commands to the independent UI-owned
  `unisane-ui` CLI. Framework `unisane` and Ops `unisane-ops` host no UI command pack.
- `2026-08-02`: Converged focus contrast, overlay ownership, connected-control seams, density-owned action frames, disabled/micro-type roles, and independent action presentation/tone contracts.
- `2026-07-28`: Defined the semantic border-strength hierarchy, prohibited direct component consumption of palette outline primitives, and required quiet repeated dividers.
- `2026-07-21`: Closed the component-fleet evidence floor, private-support boundary, application-chrome proof, and single grouped DataTable runtime/local delivery contract.
- `2026-07-18`: Required Stepper to use one stable-ID controlled catalog, ordered-list/current-step semantics, explicit passive or button interaction, true sequence orientation, localizable progress status, canonical delivery, and direct evidence.
- `2026-07-18`: Required Pagination to use one deterministic normalized range and one explicit button-or-native-link mode, with complete framework-link props, localizable semantics, native nav ownership, canonical delivery, and direct evidence.
- `2026-07-18`: Required ScrollArea to expose one native scrolling viewport for layout, overflow, focus, native props/events, refs, and programmatic scroll state while shared CSS remains the sole scrollbar-theme owner.
- `2026-07-18`: Required Carousel composition to align controlled state, complete slide/tab semantics, inert hidden content, explicit motion control, orientation/RTL, pointer input, reduced motion, and canonical dual-distribution proof.
- `2026-07-15`: Required Sidebar to consume the canonical navigation item/state/link contract, render rail and nested drawer presentations from one catalog, use shared state/overlay foundations, and rely on global semantic theming instead of public item compounds or component-local visual presets/tokens.
- `2026-07-15`: Required navigation bar, rail, and drawer presentations to share one item, selection, activation, and framework-link contract while Sidebar retains application-shell state and responsive orchestration.
- `2026-07-14`: Required transient feedback to use one private notification store, one Toaster host, a renderable Toast recipe, canonical semantic tone, and interaction-aware auto-dismiss timing.
- `2026-07-14`: Required single-selection foundations and field recipes to use distinct names: compound `Select` owns collection behavior while `SelectField` owns labels, validation, and options-array convenience.
- `2026-07-14`: Hard-deleted the legacy theme-provider vocabulary, made `appearance.ts` the sole runtime-preference configuration owner, and clarified that color themes replace CSS values rather than provider state.
- `2026-07-14`: Established one source owner, one local import path, and one public prop vocabulary for leaf components, with explicit leading/trailing slots and a single typography variant selector.
- `2026-07-14`: Required source-installed private component mechanics to remain vendor-neutral: use module-private state and refs instead of branded DOM coordination attributes.
- `2026-07-14`: Added the behavior-ownership rule: visual components retain their APIs and styling while shared focus, dismissal, portal, nesting, modal-isolation, and keyboard mechanics use private tested foundations.
- `2026-07-14`: Made runtime appearance an explicit enabled-axis capability with generated project color/scheme outside provider state, local/runtime provider parity, explicit persistence, reset, and pre-hydration application.
- `2026-07-14`: Replaced the direct token-package layering recipe with the governed runtime/local-source stylesheet contract, stable semantic values, replace-in-place color themes, and opt-in runtime appearance axes.
- `2026-04-09`: Added the canonical visual-doctrine and token-governance contract covering token layering, app-level overrides, spacing, typography, density, color semantics, motion, and drift prevention.

## 1. Scope

This document governs the visual layer for starters and platform apps. It defines:

1. where tokens come from
2. where app-specific visual choices may live
3. how layout rhythm, typography, color, density, and motion stay consistent

## 2. Token And Stylesheet Model

The generator may derive palettes, tones, and contrast internally, but applications consume one stable semantic contract.

First-party runtime apps use:

1. `@import '@unisane/ui/styles.css'`
2. `@import 'tailwindcss'`
3. generated app semantic values and app-owned overrides in the same `globals.css`

External projects use one locally owned `globals.css` containing the generated baseline, semantic Tailwind mappings, selected light/dark values, and app-owned overrides. They do not import Unisane packages or scan Unisane source.

Ownership:

1. the internal token generator owns palette derivation and validation
2. the UI authoring source owns component styles and the stable semantic vocabulary
3. selected color themes replace `:root` and `.dark` semantic values rather than adding runtime color-theme selector layers
4. root `config/ui/**` owns authored app policy; `globals.css` is the single CSS entrypoint
5. mode, density, and contrast are runtime preferences only when explicitly enabled
6. app code consumes semantic roles; it does not create a second theme system

Runtime appearance rules:

1. external projects install local `AppearanceProvider` source with `unisane-ui appearance enable --axes <axes>`
2. first-party apps consume the equivalent `@unisane/ui/appearance-provider` subpath
3. `enabledAxes` is explicit; mounting the provider must not write disabled-axis attributes
4. persistence is an explicit `none`, `localStorage`, or `cookie` policy
5. `AppearanceScript` applies enabled stored preferences before visible paint
6. project color theme and generated scheme never enter `AppearanceProvider` state
7. legacy theme-provider names, aliases, selector state, and storage fallbacks are prohibited; migration uses the canonical appearance API directly

## 3. Canonical App Token Files

Use root `config/ui/**` for authored UI declarations:

1. `config/ui/appearance.ts`
2. `config/ui/tokens.ts`
3. `config/ui/navigation.ts`
4. `config/ui/metadata.ts`
5. `config/ui/density.ts`
6. `src/app/globals.css` or the framework-equivalent single global stylesheet

Rules:

1. app-specific token extensions live in `config/ui/tokens.ts`
2. enabled runtime axes, defaults, and persistence policy live in `config/ui/appearance.ts`
3. app typography, surface, and semantic token extensions live in `config/ui/tokens.ts`
4. feature code must not redefine app-level color, spacing, or typography constants
5. color-theme changes regenerate the semantic values region instead of adding another CSS layer

## 4. Spacing And Layout Rhythm

Rules:

1. use semantic spacing tokens, not ad hoc pixel values in feature code
2. page patterns own page-shell, section, and action-zone spacing
3. shells own navigation chrome spacing
4. sections inside the same pattern family should share one vertical rhythm
5. density changes must affect whole families or shells, not isolated widgets

Do not:

1. invent one-off spacing scales inside a feature
2. mix multiple unrelated padding systems on one page
3. compress mobile layouts by removing hierarchy instead of restacking structure

## 5. Typography

Typography must communicate hierarchy first.

Rules:

1. define one app typography stack through `config/ui/tokens.ts` and the root layout font configuration
2. page title, section title, card title, body, helper, and caption roles must remain stable
3. use typography roles, not arbitrary local font-size escalation
4. emphasis should come from hierarchy and spacing before decorative weight shifts

## 6. Color And Semantic Surfaces

Rules:

1. use semantic roles for success, warning, danger, info, muted, accent, and interactive states
2. background and surface layering must communicate hierarchy
3. component code should consume semantic color tokens, not feature-local hex values
4. status color meaning must stay stable across apps

Allowed app-specific customization:

1. brand accents
2. product surface tone
3. chart/data-visualization palette extensions
4. route-family chrome adjustments

Forbidden drift:

1. feature-local color systems
2. duplicate near-identical semantic tokens
3. raw color literals used as default app policy

## 7. Density, Radius, Borders, And Elevation

Rules:

1. density modes must be app-level policy or an explicitly enabled user preference, not per-feature experimentation
2. comfortable is the default unless compact delivers clear product value
3. radius, border, and elevation must come from shared token families
4. visual hierarchy should not depend on arbitrary shadow escalation
5. density changes component/control variables and must not replace Tailwind's standard application spacing scale
6. `outline` and `outline-variant` are color-theme primitives; components must consume purpose-based border roles instead of those primitives directly
7. `control-outline` owns the persistent boundary of required value-entry controls, binary controls, and grouped selectors, including the separators that connect segments into one control; every generated color theme and contrast mode must keep it at or above `3:1` against the canonical surface
8. `outline-weak` owns repeated dividers and data grids, `outline-soft` owns ordinary container and overlay boundaries, `outline-muted` owns passive affordances, and `outline-subtle` owns optional outlined actions and non-structural internal seams
9. `outline-medium` owns hover emphasis and intentionally emphasized separators; `outline-strong` is exceptional and must not be a default component border
10. focus, selected, invalid, and status indication is independent of resting border strength and uses the canonical focus-ring or semantic color contract
11. color themes replace semantic boundary values while preserving purpose and hierarchy; apps must not repair individual component borders with global overrides
12. connected controls use the same `control-outline` role for their outer boundary and internal separators; selected fills and state layers create hierarchy without weakening the seam contract
13. density-owned families must size row height, typography, icons, action frames, and action insets together; header and row actions must fit inside the declared density row without overflow

## 8. CTA And Content Hierarchy

Rules:

1. each page has one clear primary action hierarchy
2. destructive actions must not visually compete with positive primary actions
3. helper text must support the decision, not duplicate headings
4. empty-state and validation copy should be concise and directive

## 9. Motion And Interaction Feedback

Rules:

1. motion must be purposeful, not decorative noise
2. durations and easing should come from shared tokens
3. long-running tasks need visible progress semantics
4. reduced-motion support is mandatory where animation changes comprehension or comfort

## 10. Responsive Behavior

Rules:

1. responsiveness follows page-family and shell rules before local overrides
2. small-screen behavior should restack structure, not hide critical controls by surprise
3. action relocation must stay predictable
4. typography and spacing may compress, but information hierarchy must remain obvious

## 11. Accessibility And Brand Overrides

Rules:

1. app branding must not break semantic contrast, focus visibility, or readable density
2. token overrides must still satisfy accessibility baselines
3. focus, status, and disabled states must remain visually distinguishable
4. semantic foreground/background pairs meet `4.5:1` for ordinary text, and the canonical focus ring meets `3:1` against supported surfaces in every generated theme and contrast mode
5. disabled interactive content uses the shared `38%` state contract; arbitrary component-local disabled opacity is prohibited
6. microcopy uses the smallest named typography role that remains readable; arbitrary sub-role pixel text is prohibited

## 12. Component Behavior Ownership

Visual components retain Unisane styling, semantic tokens, motion, and task-focused public APIs. Shared browser mechanics are private tested foundations rather than independently implemented component features.

Rules:

1. modal and non-modal semantics must match actual focus, dismissal, scroll, and background behavior
2. focus entry, containment, restoration, Escape, outside interaction, portal layering, and nested-layer coordination have one behavior owner per foundation family
3. only the topmost open layer responds to layer-level dismissal
4. local registry installation must include private behavior dependencies without exposing them as competing public imports
5. component-specific styling must compose the foundation instead of forking its browser behavior
6. source-installed private mechanics use module state and refs; vendor-prefixed coordination attributes are not a consumer DOM contract
7. each public leaf component has one source owner and installs under `@/components/ui/**`; duplicate primitive/component owners and re-export-only aliases are prohibited
8. action components use `leadingIcon` and `trailingIcon` when both positions exist; a single-purpose icon action uses the singular `icon` prop
9. Typography uses one `variant` selector for scale values and semantic roles; parallel selectors for the same hierarchy are prohibited
10. registry generation must reject duplicate component keys instead of selecting a preferred source owner
11. compound `Select` owns collection, keyboard, selection, and popup behavior; options-array, label, description, validation, and field-shell convenience belong to the distinctly named `SelectField` recipe
12. transient feedback uses one private notification store and one `Toaster` host; the public `Toast` recipe and imperative API share canonical tone, announcement priority, dismissal, and interaction-aware timing behavior
13. `NavigationBar`, `NavigationRail`, and `NavigationDrawer` are presentations over one `NavigationItem` identity, selection, activation, and framework-link contract; generic presentation components and presentation-owned shell state are prohibited, while Sidebar is an array-driven application-shell recipe over the same contract and owns responsive rail/drawer orchestration, persistence, expansion, hover disclosure, nested groups, overlay behavior, and content inset. Sidebar must not publish manual item/menu/group compounds or a second visual token/preset layer; global semantic theme and appearance axes remain the visual owner.
14. `Carousel` remains a focused high-level composition over rich slides; it must share controlled-state vocabulary, use complete carousel plus tab/slide semantics, make inactive content inert, provide explicit autoplay control with focus/hover/reduced-motion behavior, and keep orientation, writing direction, pointer input, keyboard input, runtime delivery, and local-source delivery behaviorally equivalent.
15. `ScrollArea` remains a focused native overflow boundary: one ref-forwarding element owns layout, overflow, focus, native props/events, and programmatic scroll state; orientation is its only direction API, `className` is its only local style channel, shared CSS owns scrollbar theming, and the viewport participates in sequential keyboard navigation by default without forcing landmark semantics.
16. `Pagination` remains a focused page-number navigation boundary: one normalized controlled range owns first/last pages, sibling density, and semantic ellipses; button mode owns actions while link mode preserves real hyperlinks for page, previous, and next destinations; framework renderers receive complete anchor props; the nav boundary forwards native props/ref and localizable names; shared semantic action, icon, focus, color, density, radius, and motion tokens own presentation.
17. `Stepper` remains a focused process-progress boundary: one stable-ID steps catalog and controlled value derive a non-conflicting current/completed state; optional change handling selects native button interaction while passive progress has no false action affordance; one ordered list owns sequence semantics and horizontal/vertical connector layout; native root props/ref and localizable positional/completion status remain available; shared icon, focus, typography, color, density, radius, and motion tokens own presentation.
18. Every public component owner has one explicit flat runtime module, one local registry owner, public docs, behavior/accessibility tests proportional to risk, and appearance-axis visual proof; private support is not advertised as a component.
19. `DataTableProps` is owned by the rendered grouped DataTable contract. External installation copies one complete local composite and its local/npm dependencies rather than retaining a UI runtime dependency.
20. trigger composition attaches refs, ARIA, and handlers to the actual interactive element; interactive wrappers and nested native controls are prohibited
21. menus, comboboxes, popovers, pickers, and table context menus compose the shared overlay behavior owner for focus entry/restoration, topmost Escape dismissal, outside interaction, and nested-layer coordination
22. keyboard-driven composite widgets use native interactive elements where available and implement the corresponding roving-focus or option-selection pattern rather than recreating buttons with generic elements
23. `variant` selects visual presentation while `tone` communicates semantic action emphasis; danger is a tone and must not become a parallel button-variant vocabulary in action configuration APIs

## 13. Drift Prevention

Use this review test before adding a new token or visual pattern:

1. Is this an app-wide concern or just a local workaround?
2. Does an existing semantic token already cover it?
3. Should this live in `config/ui/**` instead of a feature file?
4. Will this create a second visual language inside the app?
5. Does the change preserve page-family and shell consistency?
6. Does it keep one `globals.css` and avoid direct token-package, source-scan, or runtime color-preset layers?
