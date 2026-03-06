# Unisane UI Docs

This app documents the distributable Unisane UI system:

- `@unisane/ui`
- `@unisane/data-table`
- design tokens and shared styles
- component usage patterns and examples

It is a documentation surface for the public UI layer, not a generic Next.js starter app.

## Run Locally

From the workspace root:

```bash
pnpm --filter @unisane/web dev
```

Then open `http://localhost:3001`.

## Purpose

Use this app to:

- review the UI package surface
- document component APIs and usage examples
- validate registry/component-install flows for external consumers
- keep the distributable UI layer separate from product-specific app UI
