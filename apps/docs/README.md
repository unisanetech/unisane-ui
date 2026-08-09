# Unisane UI Docs

This app documents the distributable Unisane UI system:

- `@unisane/ui`
- `@unisane/data-table`
- design tokens and shared styles
- component usage patterns and examples

It is a documentation surface for the public UI layer, not a generic Next.js starter app.

The workbench itself is a first-party app and may consume flat `@unisane/ui/<component>` runtime subpaths plus `@unisane/ui/styles.css`. Public examples must teach external consumers the registry-installed local-source path (`@/components/ui/*`) and must not require Unisane UI or token packages at application runtime.

The workbench also imports `@unisane/tokens/preview-themes.css` so documentation fixtures can preview every theme, scheme, contrast, and mode combination. That generated preview asset is documentation-only and must never be included in `@unisane/ui/styles.css`, registry `globals.css`, or external application guidance.

The workbench owns preview-only color and scheme controls for documentation fixtures.
Public examples use the canonical local `AppearanceProvider`; project color and scheme
remain generated CSS rather than runtime application state.

## Run Locally

From the workspace root:

```bash
pnpm --filter @unisane/ui-docs dev
```

Then open `http://localhost:3001`.

## Purpose

Use this app to:

- review the UI package surface
- document component APIs and usage examples
- validate registry/component-install flows for external consumers
- keep the distributable UI layer separate from product-specific app UI

## Local Architecture

This app is organized with clear boundaries:

- `app/` for routing only
- `features/` for render logic by product area
- `lib/docs/registry/` for docs metadata SSOT
- `lib/docs/runtime/` for shared docs runtime helpers

Route files should stay thin. Docs metadata should be added under `lib/docs/registry/components/*.docs.tsx`.
