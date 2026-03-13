# Sidebar Contract

Canonical runtime model:

- `side`: `left | right`
- `mode`: `rail-drawer | drawer-only | rail-only`
- `behavior`: `overlay | inset`
- `containerMode`: `viewport | contained`

Public compatibility model:

- `behavior` also accepts `adaptive` at the provider boundary.
- `adaptive` is normalized to:
  - `overlay` on mobile/tablet
  - `inset` on desktop

State ownership contract:

- Controlled props: `activeId`, `expanded`, `mobileOpen`
- Uncontrolled defaults: `defaultActiveId`, `defaultExpanded`, `defaultMobileOpen`
- Change events: `onActiveIdChange`, `onExpandedChange`, `onMobileOpenChange`
- Compatibility callback: `onActiveChange`

Responsive contract:

- Default breakpoints: `mobile=600`, `desktop=840`
- Configurable via `breakpoints`
- `containerMode="contained"` derives viewport from container width using `ResizeObserver`

Trigger contract:

- Provider default: `triggerVisibility`
- Per-trigger override: `SidebarTrigger visibility`
- Trigger renders only when `drawerEnabled`
