# Unisane UI

Unisane UI is the focused workspace for Unisane design tokens, React components,
DataTable, provider-neutral email templates, and the public documentation application.

## Workspace

- `packages/tokens` owns semantic tokens and generated CSS.
- `packages/ui` owns React components, runtime styles, and the UI-local source registry.
- `packages/data-table` owns DataTable runtime code, styles, tests, and its independent
  release boundary.
- `packages/email-templates` owns provider-neutral email presentation.
- `apps/docs` consumes the public package contracts and provides the documentation site.

Package dependencies flow from tokens to UI to DataTable. The docs app may consume all
packages. Runtime packages do not import application source or sibling package internals.

## Local development

```bash
corepack enable
pnpm install --frozen-lockfile
pnpm typecheck
pnpm lint
pnpm test
pnpm build
```

Run the docs application with `pnpm --filter @unisane/ui-docs dev`.

This repository is the standalone public source authority for Unisane UI at
`https://github.com/unisanetech/unisane-ui`. Its history was extracted from the former
umbrella source without retaining a sibling or fallback authority. Package publication
remains a separate explicit operation. Start with `docs/overview.md`, then read
`docs/guides/repository-provenance.md` and `docs/guides/licensing-prerequisites.md`.
