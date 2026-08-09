# @unisane/tokens

Semantic design tokens and generated CSS for Unisane interfaces.

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

Public licensing is not yet approved. The package remains private and unlicensed until
the repository's legal gate is resolved.
