# @unisane/tokens

Semantic design tokens and generated CSS for Unisane interfaces.

The primary component registry installs its semantic stylesheet baseline directly into
the consumer application. This package is the optional versioned token distribution for
runtime-package consumers and tooling that needs the generated CSS artifact.

```bash
pnpm add @unisane/tokens
```

Import the generated semantic token contract once:

```css
@import '@unisane/tokens/unisane.css';
```

Files under `dist/**` are generated from `src/theme-config.json` and the package-owned
generator. Run `pnpm --filter @unisane/tokens build` to regenerate and
`pnpm --filter @unisane/tokens test` to prove deterministic output. Do not edit generated
CSS directly.

This package is MIT licensed. The packed archive includes the exact license text.
