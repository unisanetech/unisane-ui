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

The founder approved registry-first dual distribution and MIT-licensed public npm
publication for these exact packages at stable version `0.1.1` under the `latest` tag:

- `@unisane/tokens`
- `@unisane/ui`
- `@unisane/ui-cli`
- `@unisane/data-table`
- `@unisane/email-templates`

The approval, license, notices, contributor terms, and asset provenance are recorded in
the root legal files, `docs/release-approval.json`, and `docs/asset-provenance.json`.
`@unisane/ui-cli` is the primary public adopter-tooling pack. It bundles the generated
registry and publishes the standalone `unisane-ui` executable. It has no dependency on
an unscoped CLI host or Unisane runtime package. `@unisane/ui-docs` and the workspace root
remain private and are not part of this release.

Registry consumers invoke `@unisane/ui-cli@latest` through `npx`, `pnpm dlx`,
`yarn dlx`, or `bunx` to write application-owned source. They do not retain the CLI or
runtime UI packages as application runtime dependencies.

`pnpm check:release-readiness` validates the source-side release contract. Packed
producer checks prove the distributable contents and clean external-consumer behavior.
Neither command publishes anything.

The canonical public source repository is
`https://github.com/unisanetech/unisane-ui`. Its manually dispatched
`publish-release.yml` workflow rechecks the release boundary on a GitHub-hosted
runner before publishing the approved package set with npm provenance. It publishes
through pnpm so workspace dependency protocols become concrete registry versions in the
public package manifests. The workflow first verifies the exact standalone CLI and packed
package boundaries. Publication requires the repository secret `NPM_TOKEN`; package
publication remains a separate explicit operation and is not performed by repository
setup or ordinary CI.
