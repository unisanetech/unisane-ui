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

Unisane UI is the design-system product for semantic tokens, React components,
DataTable, provider-neutral email templates, source-installable UI registry artifacts,
and the public documentation application.

The repository is intentionally a focused multi-package workspace. Packages can have
independent public contracts and releases while sharing one design-system change,
quality, documentation, and release-governance boundary. Applications consume package
exports; packages never import application source, sibling-repository source,
infrastructure, or checkout-parent paths.

Use:

- `docs/architecture/design-system.md` for visual-system and token truth
- `docs/architecture/package-and-distribution-boundaries.md` for package ownership,
  dependency direction, registry ownership, and release boundaries
- `docs/standards/component-authoring.md` for component APIs and accessibility rules
- `docs/standards/testing-and-generated-artifacts.md` for proof and generation rules
- `apps/docs` for public adoption, component, pattern, block, and DataTable guidance

Public licensing, publication, deployment, and remote authority remain separate
human-approved gates. Repository readiness never implies permission to publish.
