# Tokens Build Pipeline

This directory contains the modular build pipeline for `@unisane/tokens`.

## Entry Flow

1. `scripts/build.mjs`
2. `tokens-build/build-pipeline.mjs`
3. `tokens-build/theme-config.mjs` + `tokens-build/theme-validation.mjs`
4. `tokens-build/palette.mjs`
5. `tokens-build/css/compose.mjs`
6. `dist/unisane.css` + `src/ref.json`

## File Responsibilities

- `build-pipeline.mjs`: CLI orchestration, watch mode, output writes
- `paths.mjs`: shared paths and directory preparation
- `theme-config.mjs`: load and merge base/override theme JSON
- `theme-validation.mjs`: strict runtime validation with clear path-based errors
- `constants.mjs`: shared tonal/chroma constants and fallback defaults
- `palette.mjs`: color conversion and palette generation
- `css/compose.mjs`: assembles final CSS from sections
- `css/sections/core-tokens.mjs`: root tokens, semantic mappings, typography, scales
- `css/sections/dark-mode.mjs`: dark mode tone remapping
- `css/sections/color-themes-and-axes.mjs`: color theme presets, scheme/contrast/density/radius/elevation axes
- `css/sections/scrollbar.mjs`: scrollbar styles
- `css/sections/tailwind-theme.mjs`: Tailwind v4 `@theme` variable mapping
- `css/sections/runtime-utilities.mjs`: shared runtime utility classes

## Commands

- `pnpm --filter @unisane/tokens build`
- `pnpm --filter @unisane/tokens dev`
- `pnpm --filter @unisane/tokens test`
- `pnpm --filter @unisane/tokens test:update-snapshots`

## Regression Safety

Snapshot tests live in:

- `scripts/tokens-build/__tests__/build-output.test.mjs`
- `scripts/tokens-build/__snapshots__/blue.unisane.css`

They protect generated output structure and prevent accidental token drift.
