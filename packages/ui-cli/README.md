# @unisane/ui-cli

The open-code Unisane UI registry CLI.

This package owns the primary Unisane UI adoption experience. It bundles generated,
dependency-closed component source and publishes the `unisane-ui` executable. It does
not depend on an unscoped CLI host or any Unisane runtime package.

## Installation

```bash
pnpm dlx @unisane/ui-cli@next init --theme blue
```

For repeated use, install it as a development tool and run `pnpm exec unisane-ui`.

## Add Unisane UI

```bash
pnpm dlx @unisane/ui-cli@next init --theme blue
pnpm dlx @unisane/ui-cli@next add button card text-field
```

Installed components use application-owned imports:

```tsx
import { Button } from '@/components/ui/button';
```

Registry-installed applications do not require `@unisane/ui`, `@unisane/tokens`,
`@unisane/ui-cli` at runtime. The CLI may remain a development dependency for explicit
update and diagnostic commands.

## Commands

| Command                         | Purpose                                                                           |
| ------------------------------- | --------------------------------------------------------------------------------- |
| `unisane-ui init`               | Install the semantic stylesheet baseline, theme, local utility, and configuration |
| `unisane-ui add`                | Add selected components and their complete registry dependency closure            |
| `unisane-ui diff`               | Inspect differences without overwriting application source                        |
| `unisane-ui doctor`             | Check the local installation contract                                             |
| `unisane-ui theme`              | Replace the generated semantic color theme                                        |
| `unisane-ui appearance enable`  | Add selected runtime appearance preferences                                       |
| `unisane-ui appearance disable` | Remove one runtime appearance preference                                          |
| `unisane-ui appearance list`    | Show enabled appearance preferences                                               |

The registry is generated from the canonical `packages/ui/src/**` authoring source and
copied into this package during build. Runtime commands use only the bundled assets;
there is no sibling-checkout, remote-registry, or hidden source fallback.

## License

MIT
