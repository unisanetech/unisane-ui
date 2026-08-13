# @unisane/ui-cli

The open-code Unisane UI registry pack for the canonical `unisane` CLI.

This package owns the primary Unisane UI adoption experience. It bundles generated,
dependency-closed component source and contributes the exact `ui ...` command family to
the separately installed `unisane` host. It intentionally publishes no executable of its
own.

## Installation

```bash
pnpm add -D unisane@0.1.0 @unisane/ui-cli@next
```

The host only loads this explicitly installed first-party pack after validating its
package identity, version, structural manifest, command selection, and integrity.

## Add Unisane UI

```bash
pnpm exec unisane ui init --theme blue
pnpm exec unisane ui add button card text-field
```

Installed components use application-owned imports:

```tsx
import { Button } from '@/components/ui/button';
```

Registry-installed applications do not require `@unisane/ui`, `@unisane/tokens`,
`@unisane/ui-cli`, or `unisane` at runtime. The CLI tools may remain development
dependencies for explicit update and diagnostic commands.

## Commands

| Command                         | Purpose                                                                           |
| ------------------------------- | --------------------------------------------------------------------------------- |
| `unisane ui init`               | Install the semantic stylesheet baseline, theme, local utility, and configuration |
| `unisane ui add`                | Add selected components and their complete registry dependency closure            |
| `unisane ui diff`               | Inspect differences without overwriting application source                        |
| `unisane ui doctor`             | Check the local installation contract                                             |
| `unisane ui theme`              | Replace the generated semantic color theme                                        |
| `unisane ui appearance enable`  | Add selected runtime appearance preferences                                       |
| `unisane ui appearance disable` | Remove one runtime appearance preference                                          |
| `unisane ui appearance list`    | Show enabled appearance preferences                                               |

The registry is generated from the canonical `packages/ui/src/**` authoring source and
copied into this package during build. Runtime commands use only the bundled assets;
there is no sibling-checkout, remote-registry, or hidden source fallback.

## License

MIT
