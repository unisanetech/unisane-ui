# Unisane UI

Open-code React 19 components for building product and data-heavy interfaces.

Unisane UI is a token-driven component registry. Add only the components you need,
keep their source in your application, and adapt them without wrapping a black-box UI
dependency. The registry is designed for forms, navigation, workflows, application
shells, and dense operational interfaces.

> The public source repository is ready. The first npm prerelease remains unpublished
> until the compatible canonical `unisane` CLI host is available and the manual
> provenance-enabled release workflow succeeds.

## Quick start

Install the one canonical CLI host and the UI-owned registry pack:

```bash
pnpm add -D unisane@0.1.0 @unisane/ui-cli@next
```

Initialize the generated semantic theme and add components:

```bash
pnpm exec unisane ui init --theme blue
pnpm exec unisane ui add button card text-field
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

Use `pnpm exec unisane ui diff` to inspect upstream changes. Updates never silently
overwrite application-owned source.

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
| `@unisane/ui-cli`          | Primary open-code registry pack for the canonical `unisane` CLI       |
| `@unisane/ui`              | Optional runtime component distribution and registry parity reference |
| `@unisane/tokens`          | Optional semantic token and generated CSS distribution                |
| `@unisane/data-table`      | Versioned DataTable runtime for complex data experiences              |
| `@unisane/email-templates` | Independent provider-neutral email presentation package               |

`@unisane/ui-cli` does not publish another executable. The `unisane` host validates and
loads the explicitly installed first-party pack, while generated applications do not
depend on either CLI package at runtime.

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

## Project links

- [GitHub repository](https://github.com/unisanetech/unisane-ui)
- [Documentation router](docs/00-start-here.md)
- [Design-system architecture](docs/architecture/design-system.md)
- [Component authoring standard](docs/standards/component-authoring.md)
- [Repository provenance](docs/guides/repository-provenance.md)
- [Contributing](CONTRIBUTING.md)
- [Security policy](SECURITY.md)

## License

MIT. See [LICENSE](LICENSE) and [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md).
