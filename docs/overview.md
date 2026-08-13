---
id: 'O-ui-product-overview'
owner: 'ui-maintainers'
scope: workspace
role: overview
lifecycle: durable
authority: canonical
provenance: accepted
view: current
---

# Unisane UI overview

Unisane UI is the independent design-system product for semantic tokens, React
components, DataTable, provider-neutral email templates, source-installable registries,
and the public documentation application.

Its internal dependency direction is one-way: tokens feed UI, UI feeds DataTable, and
the docs application consumes the public contracts. Runtime packages never import
application source, sibling repositories, infrastructure, or checkout-parent paths.

The repository owns its Node and pnpm versions, lockfile, workspace, build graph,
TypeScript, lint, tests, formatting, generated registries, package-content checks,
Changesets intent, CI checks, docs, and Skopos Memory. Ordinary development begins with
`corepack enable`, `pnpm install --frozen-lockfile`, and the root commands documented in
the README.

The standalone public source authority is
`https://github.com/unisanetech/unisane-ui`, with `main` as its canonical branch. The
former umbrella source is retained only in historical extraction evidence and is not a
writable fallback. Public package publication remains a separate explicit transaction
with its own authenticated npm and provenance checks.
