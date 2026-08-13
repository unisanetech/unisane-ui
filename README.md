# Unisane UI

Open-code React 19 components for building product and data-heavy interfaces.

Unisane UI is a token-driven component registry. Add only the components you need,
keep their source in your application, and adapt them without wrapping a black-box UI
dependency. The registry is designed for forms, navigation, workflows, application
shells, and dense operational interfaces.

Browse the component gallery and documentation at [ui.unisane.com](https://ui.unisane.com).

## Quick start

Run the UI-owned registry CLI directly:

```bash
pnpm dlx @unisane/ui-cli@next init --theme blue
```

`init` detects Next.js or Vite, detects your package manager, creates the standard
`components.json` project contract, installs the semantic CSS baseline, and installs
the exact dependencies it needs.

Then add the components you need:

```bash
pnpm dlx @unisane/ui-cli@next add button card text-field
```

The installed files belong to your application:

```tsx
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

export function SavePanel() {
  return (
    <Card className="p-6">
      <Button variant="filled">Save changes</Button>
    </Card>
  );
}
```

Use `pnpm dlx @unisane/ui-cli@next diff` to inspect upstream changes. Updates never silently
overwrite application-owned source.

Browse the catalog before adding source:

```bash
pnpm dlx @unisane/ui-cli@next list
pnpm dlx @unisane/ui-cli@next search "date picker"
pnpm dlx @unisane/ui-cli@next view button
```

The public catalog is served at `https://ui.unisane.com/r/registry.json`. Each item
also has a stable Shadcn-compatible URL, for example:

```bash
pnpm dlx shadcn@4.17.0 add https://ui.unisane.com/r/button.json
```

`components.json` registers `@unisane` as
`https://ui.unisane.com/r/{name}.json`, so registry-aware tools and future MCP
clients resolve the same item JSON used by the Unisane CLI.

Use `--no-install` when another tool owns dependency installation. The CLI prints the exact
commands instead.

## Why a registry?

- **Own the code:** components live in your repository after installation.
- **Change the right layer:** edit component behavior directly instead of stacking
  wrappers and override APIs.
- **Keep a coherent system:** generated semantic tokens, themes, components, and local
  utilities share one contract.
- **Adopt incrementally:** install one component, a dependency-closed group, or the
  complete registry.
- **Work well with code agents:** local, typed, consistently structured source is easy to
  inspect and modify with normal engineering review.

## Distribution

Registry installation is the primary adoption path. Runtime packages remain available
for boundaries that benefit from shared versioned artifacts.

| Package                    | Role                                                                  |
| -------------------------- | --------------------------------------------------------------------- |
| `@unisane/ui-cli`          | Primary open-code registry CLI                                        |
| `@unisane/ui`              | Optional runtime component distribution and registry parity reference |
| `@unisane/tokens`          | Optional semantic token and generated CSS distribution                |
| `@unisane/data-table`      | Versioned DataTable runtime for complex data experiences              |
| `@unisane/email-templates` | Independent provider-neutral email presentation package               |

`@unisane/ui-cli` publishes the `unisane-ui` executable and can be run directly with
`pnpm dlx`. Generated applications do not depend on the CLI, `@unisane/ui`,
`@unisane/tokens`, or Unisane Core at runtime.

## Requirements

- React 19
- TypeScript
- Tailwind CSS 4
- Node.js 22 or newer for published packages

## Repository development

```bash
corepack enable
pnpm install --frozen-lockfile
pnpm typecheck
pnpm lint
pnpm test
pnpm build
```

Run the documentation workbench with `pnpm --filter @unisane/ui-docs dev`.
Build the complete deployable website and registry with `pnpm check:ui-site`.

## Project links

- [GitHub repository](https://github.com/unisanetech/unisane-ui)
- [Component gallery and documentation](https://ui.unisane.com)
- [Public registry catalog](https://ui.unisane.com/r/registry.json)
- [Documentation router](docs/00-start-here.md)
- [Design-system architecture](docs/architecture/design-system.md)
- [Component authoring standard](docs/standards/component-authoring.md)
- [Repository provenance](docs/guides/repository-provenance.md)
- [Contributing](CONTRIBUTING.md)
- [Security policy](SECURITY.md)

## License

MIT. See [LICENSE](LICENSE) and [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md).
