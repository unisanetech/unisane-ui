---
id: 'G-ui-licensing-prerequisites'
owner: 'ui-maintainers'
scope: workspace
role: guide
lifecycle: active
authority: canonical
provenance: accepted
view: current
---

# Licensing and public-release readiness

The founder approved MIT licensing and public npm prerelease distribution for these
exact packages at `0.1.0-next.b67ebfd0` under the `next` tag:

- `@unisane/tokens`
- `@unisane/ui`
- `@unisane/data-table`
- `@unisane/email-templates`

The approval, license, notices, contributor terms, and asset provenance are recorded in
the root legal files, `docs/release-approval.json`, and `docs/asset-provenance.json`.
`@unisane/ui-cli`, `@unisane/ui-docs`, and the workspace root remain private and are not
part of this release.

`pnpm check:release-readiness` validates the source-side release contract. Packed
producer checks prove the distributable contents and clean external-consumer behavior.
Neither command publishes anything.

The remaining external step is an authenticated, provenance-enabled npm publish by an
authorized `@unisane` publisher. This local repository still has no remote and does not
become authoritative merely because package publication is approved.
