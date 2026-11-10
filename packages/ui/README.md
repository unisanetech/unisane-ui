# @unisane/ui

The optional React 19 runtime distribution for Unisane UI components and styles.

The primary public adoption path is the open-code registry delivered by
`@unisane/ui-cli`, which installs application-owned source under
`@/components/ui/*`. This package provides the same component contract as versioned
runtime artifacts for consumers that deliberately prefer package imports.

## Runtime-package installation

```bash
pnpm add @unisane/ui @unisane/tokens react react-dom
```

Import the runtime stylesheet once at the application boundary:

```css
@import '@unisane/ui/styles.css';
```

Use declared component subpaths so bundlers can select the components you import:

```tsx
import { Button } from '@unisane/ui/button';

export function SaveButton() {
  return <Button variant="filled">Save changes</Button>;
}
```

Do not import `src/**`, registry internals, workspace paths, or undeclared subpaths.
DataTable has a separate package and release boundary.

## Registry parity

`packages/ui/src/**` is the one component authoring source. The published registry is
generated and checked against it; registry files are not a second manually maintained
implementation. Public documentation leads with local-source imports, while the
repository workbench also exercises these runtime exports to preserve dual-distribution
parity.

## License

MIT

### Popup row density

Use `PopupDensityProvider` from `@unisane/ui/popup-density-provider` to configure
popup rows independently from the input or trigger size:

```tsx
<PopupDensityProvider density="compact">
  <Application />
</PopupDensityProvider>
```

The setting follows React portals and applies to dropdown/submenu items, select
options and combobox results. Compact rows use body-medium text and the small
32px action frame; comfortable rows use the medium 40px frame. Coarse-pointer
rows have a 44px minimum. These are minimum heights: wrapped text may grow.
Input/search text, trigger dimensions, selection semantics and keyboard behavior
remain owned by their original controls. Icons retain the shared small icon slot.
Omit the provider (or nest one without a density) to retain existing size-dependent
behavior. Combobox positioning uses the configured row estimate and then the
actual popup measurements; changes to results or density reposition the popup.
