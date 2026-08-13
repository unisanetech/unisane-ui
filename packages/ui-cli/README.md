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

The CLI detects `pnpm`, npm, Yarn, or Bun from the project lockfile or
`packageManager` field. It installs exact registry dependencies automatically and
restores source, configuration, manifest, and lock files if installation fails.

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
| `unisane-ui list`               | List the generated registry catalog                                               |
| `unisane-ui search`             | Search catalog names, descriptions, and item types                                |
| `unisane-ui view`               | Inspect one item, its files, packages, and registry dependencies                  |
| `unisane-ui diff`               | Inspect differences without overwriting application source                        |
| `unisane-ui doctor`             | Check the local installation contract                                             |
| `unisane-ui theme`              | Replace the generated semantic color theme                                        |
| `unisane-ui appearance enable`  | Add selected runtime appearance preferences                                       |
| `unisane-ui appearance disable` | Remove one runtime appearance preference                                          |
| `unisane-ui appearance list`    | Show enabled appearance preferences                                               |

`components.json` is the only project routing and appearance configuration. The CLI
does not read `unisane.json`, `unisane-ui.json`, or `package.json.unisane`. Use
`--no-install` on `init`, `add`, or `appearance enable` only when dependency
installation is intentionally owned elsewhere.

The Shadcn-compatible registry catalog is generated from the canonical
`packages/ui/src/**` authoring source and copied into this package during build. Every
item declares target files, exact npm packages, and its complete local dependency
closure. Runtime commands use only the bundled catalog.

The same catalog is projected to `https://ui.unisane.com/r/registry.json` with one
content-bearing item at `/r/{name}.json`. `components.json` registers the `@unisane`
namespace against those item URLs. The hosted projection is compatible with the
official Shadcn registry-item contract; the bundled catalog remains available for
offline Unisane CLI operation.

## License

MIT
