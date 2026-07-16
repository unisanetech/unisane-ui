# Unisane UI migration notes

## Data-display API hard cut (`0.1.x`)

Badge, Divider, and List keep their visual richness while using passive or native semantics by default. External source-installed projects import their local files:

```tsx
import { Badge } from '@/components/ui/badge';
import { Divider } from '@/components/ui/divider';
import { List, ListDivider, ListItem, ListSubheader } from '@/components/ui/list';
```

First-party Unisane apps use the matching flat runtime subpaths:

```tsx
import { Badge } from '@unisane/ui/badge';
import { Divider } from '@unisane/ui/divider';
import { List, ListDivider, ListItem, ListSubheader } from '@unisane/ui/list';
```

Badge is passive text by default. Add native live-region attributes only for a dynamic update that must be announced:

```tsx
<Badge role="status" aria-live="polite">
  {pendingCount} pending
</Badge>
```

Divider replaces its spacing `variant` with explicit inset and semantic choices:

```tsx
// Before
<Divider variant="inset" />

// After: decorative and writing-direction aware
<Divider inset="start" />

// Meaningful content boundary
<Divider decorative={false} aria-label="Billing history" />
```

List now owns native `ul`/`li` markup and one structured rich-content model. Use `ListDivider` instead of placing a Divider div directly inside a List. Replace the old icon-specific slots, trailing supporting text, and active state:

```tsx
// Before
<ListItem
  headline="Invoice 1042"
  leadingIcon={<InvoiceIcon />}
  trailingSupportingText="$120.00"
  trailingIcon={<OpenIcon />}
  active
/>

// After
<ListItem
  headline="Invoice 1042"
  leading={<InvoiceIcon />}
  trailingText="$120.00"
  trailing={<OpenIcon />}
  selected
/>
```

`headline` accepts rich content and is required. Static items accept list-item attributes, `onClick` selects a native button mode, and `href` selects a native link mode. Use `renderLink` with `href` for a framework router. `ListItemContent`, `ListItemText`, free-form ListItem children, `asChild`, `leadingIcon`, `trailingIcon`, `trailingSupportingText`, and `active` were removed without aliases.

## Selection-control API hard cut (`0.1.x`)

Checkbox, Radio, Switch, and SegmentedButton now have explicit flat first-party runtime paths. Source-installed projects continue to import the local files they own:

```tsx
import { Checkbox } from '@unisane/ui/checkbox';
import { Radio } from '@unisane/ui/radio';
import { SegmentedButton } from '@unisane/ui/segmented-button';
import { Switch } from '@unisane/ui/switch';

// Source-installed project
import { Checkbox } from '@/components/ui/checkbox';
import { Radio } from '@/components/ui/radio';
import { SegmentedButton } from '@/components/ui/segmented-button';
import { Switch } from '@/components/ui/switch';
```

Replace Checkbox/Radio `error` with `invalid`; the canonical prop now publishes `aria-invalid` as well as visual state. Switch supports the same `invalid` vocabulary. Replace Switch `icons` with `showIcons`. Labels accept React nodes, native input attributes/events and refs remain available, and `className` continues to style the labelled root.

The no-behavior `selection-controls` grouped owner was removed. Install and import the concrete control used by the feature.

SegmentedButton is now one options-array recipe. Remove `SegmentedButtonItem` and children authoring, replace `multiSelect` with `selectionMode="multiple"`, and give every group an `aria-label` or `aria-labelledby`.

```tsx
const [view, setView] = useState<'grid' | 'list'>('grid');

<SegmentedButton
  aria-label="Document view"
  options={[
    { value: 'grid', label: 'Grid' },
    { value: 'list', label: 'List' },
  ]}
  value={view}
  onValueChange={setView}
/>;
```

Use `selectionMode="multiple"` with array values. The discriminated generic contract keeps single and multiple callbacks correctly typed without casts. Single mode uses radiogroup semantics and selection-following roving arrows; multiple mode uses checkbox-group semantics and toggles only on activation.

## Alert and Banner API hard cut (`0.1.x`)

Alert and Banner now share one communication anatomy without becoming the same component. First-party Unisane apps use flat runtime subpaths; registry-installed projects use local files:

```tsx
import { Alert } from '@unisane/ui/alert';
import { Banner } from '@unisane/ui/banner';

// Source-installed project
import { Alert } from '@/components/ui/alert';
import { Banner } from '@/components/ui/banner';
```

Banner content now uses `children`. Replace `onClose` with the optional `onDismiss`; the dismiss button is rendered only when that callback exists. `open` is optional and defaults to visible.

```tsx
// Before
<Banner open={visible} onClose={() => setVisible(false)} message="Update available" />

// After
<Banner open={visible} onDismiss={() => setVisible(false)}>
  Update available
</Banner>
```

Banner actions now require stable ids and accept rich labels plus disabled state. Alert and Banner titles accept React nodes, icon strings select a symbol, and `icon={false}` suppresses the semantic default icon.

Error and warning content defaults to assertive alert semantics. Informational, success, and neutral content defaults to a polite status. Native `role`, `aria-live`, and `aria-atomic` props remain available when application context requires an override.

## Sidebar API hard cut (`0.1.x`)

Sidebar remains the responsive application-shell recipe, but rail and drawer navigation now render from the provider's one `NavigationItem[]` catalog. The manual item/menu/group compounds, compatibility behavior, duplicate callbacks, component-local visual presets/tokens, and deep runtime path were removed.

First-party Unisane apps use the flat runtime path; external projects use the locally installed nested owner:

```tsx
import {
  Sidebar,
  SidebarDrawer,
  SidebarInset,
  SidebarProvider,
  SidebarRail,
} from '@unisane/ui/sidebar';

// Source-installed project
import {
  Sidebar,
  SidebarDrawer,
  SidebarInset,
  SidebarProvider,
  SidebarRail,
} from '@/components/ui/sidebar';
```

Replace `activeId`, `defaultActiveId`, and `onActiveIdChange` with the canonical navigation vocabulary: `value`, `defaultValue`, and `onValueChange`. Replace `onActiveChange` with `onItemSelect` when the callback needs the selected item. Framework routing uses one provider-level `renderLink` function.

```tsx
<SidebarProvider
  items={items}
  value={activeNavigationId}
  onValueChange={setActiveNavigationId}
  renderLink={(_item, props) => <Link {...props} />}
>
  <Sidebar>
    <SidebarRail aria-label="Primary navigation" />
    <SidebarDrawer aria-label="Primary navigation" overlayHeadline="Navigation" />
    <SidebarInset>{children}</SidebarInset>
  </Sidebar>
</SidebarProvider>
```

Remove `SidebarRailItem`, `SidebarNavItem`, `SidebarCollapsibleGroup`, `SidebarMenu*`, `SidebarGroup*`, `SidebarHeader`, `SidebarFooter`, `SidebarContent`, and `SidebarBackdrop`. Use `SidebarRail` and `SidebarDrawer` header/footer/headline slots; nested groups and the modal backdrop are owned by Sidebar.

Remove `behavior="adaptive"`. Omitting `behavior` now directly means overlay on mobile/tablet and inset on desktop. A fixed `"overlay"`/`"inset"` value or a per-viewport object remains available. Replace `activeDescendantDrawerBehavior="closed"` with `openOnChildSelection={false}`.

Remove `visualPreset` and `tokens`. Theme, density, contrast, radius, elevation, and color flexibility remain available through the global semantic theme and appearance axes; structural widths remain explicit Sidebar props and local classes remain app-owned overrides.

## Appearance API hard cut (`0.1.x`)

Unisane UI now has one runtime appearance API. The temporary `ThemeProvider` compatibility surface was removed before `1.0`; no alias, storage translation, or selector fallback remains.

Replace:

- `ThemeProvider` with `AppearanceProvider`
- `useTheme()` with `useMode()`, `useDensity()`, `useAppearancePreference(axis)`, or `useAppearance()`
- `theme` / `setTheme` with `mode` / `setMode`
- `ThemeSwitcher` with `ModeSwitcher`
- `@unisane/ui/theme-provider` or `@unisane/ui/layout/theme-provider` with `@unisane/ui/appearance-provider`

Configure the provider explicitly:

```tsx
import {
  AppearanceProvider,
  AppearanceScript,
  type AppearanceAxis,
  type AppearancePreferences,
} from '@unisane/ui/appearance-provider';

const axes = [
  'mode',
  'density',
  'contrast',
  'radius',
  'actionShape',
  'elevation',
] as const satisfies readonly AppearanceAxis[];

const defaults = {
  mode: 'system',
  density: 'standard',
  contrast: 'standard',
  radius: 'standard',
  actionShape: 'standard',
  elevation: 'standard',
} satisfies AppearancePreferences;

export function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html suppressHydrationWarning>
      <head>
        <AppearanceScript
          enabledAxes={axes}
          defaults={defaults}
          persistence="localStorage"
          persistenceKey="app-appearance"
        />
      </head>
      <body>
        <AppearanceProvider
          enabledAxes={axes}
          defaults={defaults}
          persistence="localStorage"
          persistenceKey="app-appearance"
        >
          {children}
        </AppearanceProvider>
      </body>
    </html>
  );
}
```

Project color themes are no longer provider state. Select or replace them through generated semantic CSS (`unisane ui init --theme <name>` or `unisane ui theme <name>`). Remove application-root `data-color-theme` and `data-scheme` attributes and any code that mutates them.

Old stored theme objects are intentionally not migrated. Use a new appearance persistence key so retired color/scheme fields cannot survive the cut.

## Leaf component API hard cut (`0.1.x`)

The first evidence-backed leaf family now has one source path and one vocabulary. These pre-`1.0` changes intentionally have no aliases or fallback exports.

Replace first-party runtime Icon imports:

```tsx
// Before
import { Icon } from '@unisane/ui/primitives/icon';
import { Icon } from '@unisane/ui/components/icon';

// After
import { Icon } from '@unisane/ui/icon';
```

Registry-installed projects continue to import their local source:

```tsx
import { Icon } from '@/components/ui/icon';
```

Replace the Button leading slot:

```tsx
// Before
<Button icon={<Icon symbol="save" />}>Save</Button>

// After
<Button leadingIcon={<Icon symbol="save" />}>Save</Button>
```

`IconButton` has one icon role, so normal usage supplies `icon` and a required accessible name:

```tsx
<IconButton aria-label="Settings" icon={<Icon symbol="settings" />} />
```

Replace Typography's second selector prop with the canonical `variant` prop:

```tsx
// Before
<Typography typeRole="pageTitle">Invoices</Typography>

// After
<Typography variant="pageTitle">Invoices</Typography>
```

Scale values such as `bodyLarge` and semantic roles such as `pageTitle` now share the same typed `variant` API. `Text` no longer accepts `typeRole`; use `Typography` for semantic document hierarchy.

## Field and TextField API hard cut (`0.1.x`)

TextField now composes the shared Field foundation and has one validation and value vocabulary. The retired props have no aliases.

For external source-installed projects, import local files:

```tsx
import { Field, FieldDescription, FieldError, FieldLabel } from '@/components/ui/field';
import { TextField } from '@/components/ui/text-field';
```

First-party Unisane apps use flat runtime subpaths:

```tsx
import { Field } from '@unisane/ui/field';
import { TextField } from '@unisane/ui/text-field';
```

Replace validation and guidance props:

```tsx
// Before
<TextField error={Boolean(error)} helperText={error || 'Use your work email.'} />

// After
<TextField
  errorMessage={error || undefined}
  description={error ? undefined : 'Use your work email.'}
/>
```

Use `invalid` when the control is invalid without error content. Supplying `errorMessage` also marks the control invalid and links the error with `aria-describedby`.

Replace the native event value API:

```tsx
// Before
<TextField value={name} onChange={(event) => setName(event.currentTarget.value)} />

// After
<TextField value={name} onValueChange={setName} />
```

Replace `labelClassName="sr-only"` with `hideLabel`. Arbitrary `labelBg` and `labelClassName` recipe props were removed; the field shell uses semantic surface tokens and `className` remains available for project-owned layout. Multiline, auto-resize, sizes, variants, icon slots, native form attributes, controlled/uncontrolled values, and forwarded refs remain supported.

## Date family API hard cut (`0.1.x`)

DateInput and DatePicker now use the same field vocabulary as TextField. The old props have no aliases:

```tsx
// Before
<DatePicker error={hasError} helperText={hasError ? 'Choose a valid date.' : 'Required'} />

// After
<DatePicker
  label="Booking date"
  errorMessage={hasError ? 'Choose a valid date.' : undefined}
  description={hasError ? undefined : 'Required'}
/>
```

Use `invalid` for invalid styling without error content. `label` is required, `hideLabel` preserves an accessible hidden label, and arbitrary `labelBg` styling is removed. Locale, explicit format, min/max bounds, size, variant, segmented entry, controlled state, and optional trailing content remain available.

External source-installed projects import their local owners:

```tsx
import { Calendar } from '@/components/ui/calendar';
import { DateInput } from '@/components/ui/date-input';
import { DatePicker } from '@/components/ui/date-picker';
```

First-party Unisane apps use flat runtime subpaths:

```tsx
import { Calendar } from '@unisane/ui/calendar';
import { DateInput } from '@unisane/ui/date-input';
import { DatePicker } from '@unisane/ui/date-picker';
```

DatePicker is a non-modal popover recipe composed from DateInput and Calendar. Its calendar button is keyboard reachable, `Alt+ArrowDown` opens the calendar from a date segment, Escape/outside interaction uses the shared overlay behavior, and dismissal restores focus. Calendar is now a localized date grid with roving focus, cross-month arrow movement, Home/End, Page Up/Page Down, truthful selected/today state, and navigation bounded by min/max. Use `portal={false}` only when a containing surface must own clipping and stacking.

## Dialog and ConfirmDialog hard cut (`0.1.x`)

Install and import each local component from its project-owned file:

```tsx
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import { Dialog } from '@/components/ui/dialog';
```

First-party Unisane apps use the matching flat runtime subpaths. The deep component paths are blocked:

```tsx
import { ConfirmDialog } from '@unisane/ui/confirm-dialog';
import { Dialog } from '@unisane/ui/dialog';
```

Dialog now requires a visible `title` or an explicit `aria-label`. Its `description` is linked to `aria-describedby`; arbitrary interactive children are no longer flattened into a screen-reader description. Use `role="alertdialog"` only for interruptive decision recipes.

ConfirmDialog now owns one complete controlled/uncontrolled lifecycle. Replace semantic `variant` with `tone`, and replace ambiguous `disabled` with `confirmDisabled`:

```tsx
<ConfirmDialog
  defaultOpen
  tone="danger"
  confirmDisabled={!canDelete}
  title="Delete workspace?"
  description="This action cannot be undone."
  onConfirm={() => deleteWorkspace()}
  onConfirmError={(error) => reportError(error)}
/>
```

Return the mutation promise from `onConfirm`. The dialog blocks dismissal while it is pending and closes after success. Return `false` when the callback handles a failure and the dialog should remain open; rejected promises also remain open and are forwarded to `onConfirmError`. Cancellation always closes after calling `onCancel`. Do not close the dialog again inside successful confirm handlers.

## Select and SelectField hard cut (`0.1.x`)

The old options-array `Select` recipe was removed. Use the compound `Select` foundation for custom item structure, or use `SelectField` for the standard labeled options-array field. No compatibility props or aliases remain.

External source-installed projects import their local files:

```tsx
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { SelectField } from '@/components/ui/select-field';
```

First-party Unisane apps use the matching flat runtime subpaths:

```tsx
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@unisane/ui/select';
import { SelectField } from '@unisane/ui/select-field';
```

Move retired options-array field usage to `SelectField`:

```tsx
// Before
<Select label="Workspace" options={workspaceOptions} value={workspaceId} />

// After
<SelectField label="Workspace" options={workspaceOptions} value={workspaceId} />
```

Every `SelectField` requires either a visible `label` or an explicit `aria-label`. Use `description`, `errorMessage`, and `invalid` for field semantics. Controlled/uncontrolled value and open state, disabled options, sizes, filled/outlined visuals, portal control, form names, and forwarded refs remain supported.

Use the foundation when items require grouping or custom content:

```tsx
<Select defaultValue="active" name="status">
  <SelectTrigger aria-label="Status">
    <SelectValue placeholder="Choose a status" />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="active">Active</SelectItem>
    <SelectItem value="paused">Paused</SelectItem>
  </SelectContent>
</Select>
```

## Toast host, recipe, and tone hard cut (`0.1.x`)

Toast now has one private notification store and one application host. Remove `ToastProvider`, `useToast`, and `setToastFunctions`; mount one `Toaster` in the application layout and use the imperative API or the renderable `Toast` recipe.

External source-installed projects import their local file:

```tsx
import { Toast, Toaster, toast } from '@/components/ui/toast';
```

First-party Unisane apps use the flat runtime subpath:

```tsx
import { Toast, Toaster, toast } from '@unisane/ui/toast';
```

Replace the retired semantic `variant` vocabulary with `tone`:

```tsx
// Before
toast.show({ message: 'Could not publish', variant: 'error' });

// After
toast.show({ message: 'Could not publish', tone: 'danger' });
```

The canonical tones are `neutral`, `info`, `success`, `warning`, and `danger`. `toast.error(...)` remains the concise danger helper. Calls made before `Toaster` mounts are queued rather than dropped, IDs are deterministic within the running process, and `toast.dismiss(id)` plus `toast.dismissAll()` remain available.

Auto-dismiss pauses while the pointer is over a notification, focus is inside it, or the page is hidden. Use `duration={0}` for persistent feedback. Notifications are polite by default and assertive for danger; use `priority` only when the message urgency truly differs from its tone.

## Navigation presentation API hard cut (`0.1.x`)

NavigationBar, NavigationRail, and NavigationDrawer now render the same `NavigationItem[]` contract and share `value`, `defaultValue`, `onValueChange`, `onItemSelect`, and `renderLink`. Generic `Nav`, `NavItem`, `NavGroup`, `RailItem`, presentation item subcomponents, and generic navigation state/hover/items/breakpoint hooks were removed without aliases.

First-party Unisane apps use flat runtime subpaths:

```tsx
import type { NavigationItem } from '@unisane/ui/navigation';
import { NavigationBar } from '@unisane/ui/navigation-bar';
import { NavigationDrawer } from '@unisane/ui/navigation-drawer';
import { NavigationRail } from '@unisane/ui/navigation-rail';
```

Registry-installed projects use their local source:

```tsx
import type { NavigationItem } from '@/types/navigation';
import { NavigationBar } from '@/components/ui/navigation-bar';
```

Replace compound or presentation-specific items with one collection:

```tsx
// Before
<NavigationBar>
  <NavigationBar.Item icon={homeIcon} label="Home" active />
</NavigationBar>;

// After
const items: NavigationItem[] = [{ id: 'home', label: 'Home', icon: 'home', href: '/' }];

<NavigationBar aria-label="Primary navigation" items={items} value="home" />;
```

Rail items use `id`, not `value`. Drawer uses `variant="persistent" | "modal"`, an `items` collection, and `headline`/`header`/`footer` slots; `modal`, `NavigationDrawerItem`, `NavigationDrawerHeadline`, and `NavigationDrawerDivider` were removed. Modal Drawer now portals, locks scroll, contains focus, inerts background content, dismisses on Escape/outside interaction, and restores focus through `triggerRef`.

Use `renderLink(item, props)` for framework router links. Do not add a second `asChild` or `linkElement` path. Sidebar remains the application-shell recipe for responsive rail/drawer orchestration, persistence, expansion, hover disclosure, and content inset behavior.
