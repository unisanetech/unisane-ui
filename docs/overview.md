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

Unisane UI is an open-code, registry-first React 19 design-system product. Its primary
adoption path installs token-driven components into the consumer's own application
source through the UI-owned `@unisane/ui-cli` pack and the one canonical `unisane`
executable. Consumers own and adapt that installed source; public examples import
`@/components/ui/*` and do not require `@unisane/ui` or `@unisane/tokens` at runtime.

Dual distribution remains deliberate. `@unisane/ui` is an optional runtime component
distribution and parity reference, `@unisane/tokens` provides optional generated token
artifacts, DataTable remains a separately versioned runtime package, and provider-neutral
email templates remain an independent companion package. Those packages do not replace
the registry as the primary UI adoption model.

Its internal dependency direction is one-way: tokens feed UI, UI feeds DataTable, and
the docs application consumes the public contracts. Runtime packages never import
application source, sibling repositories, infrastructure, or checkout-parent paths.

The repository owns its Node and pnpm versions, lockfile, workspace, build graph,
TypeScript, lint, tests, formatting, generated registry, adopter-tooling pack,
package-content checks, Changesets intent, CI checks, docs, and Skopos Memory. There is
one component authoring source under `packages/ui/src/**`; registry output is generated
and validated against it rather than maintained as a second implementation.

The standalone public source authority is
`https://github.com/unisanetech/unisane-ui`, with `main` as its canonical branch. The
UI prerelease cannot run until the compatible public `unisane` host exists, and its
workflow must complete authenticated npm provenance checks without changing the
registry-first runtime contract. Public package publication remains a separate explicit
transaction.
