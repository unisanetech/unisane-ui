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
prerelease publication for these exact packages at `0.1.0-next.b67ebfd0` under the
`next` tag:

- `@unisane/tokens`
- `@unisane/ui`
- `@unisane/ui-cli`
- `@unisane/data-table`
- `@unisane/email-templates`

The approval, license, notices, contributor terms, and asset provenance are recorded in
the root legal files, `docs/release-approval.json`, and `docs/asset-provenance.json`.
`@unisane/ui-cli` is the primary public adopter-tooling pack. It bundles the generated
registry and contributes commands to the separate canonical `unisane` host; it does not
publish another executable. `@unisane/ui-docs` and the workspace root remain private and
are not part of this release.

The public `unisane@0.1.0` host must exist before this repository's workflow can publish
the UI pack. Registry consumers install both development tools, use `unisane ui ...` to
write application-owned source, and do not retain either CLI package or the runtime UI
packages as an application runtime dependency.

`pnpm check:release-readiness` validates the source-side release contract. Packed
producer checks prove the distributable contents and clean external-consumer behavior.
Neither command publishes anything.

The canonical public source repository is
`https://github.com/unisanetech/unisane-ui`. Its manually dispatched
`publish-prerelease.yml` workflow rechecks the release boundary on a GitHub-hosted
runner before publishing the approved package set with npm provenance. It first verifies
that the exact compatible canonical CLI host is already public. The first npm publication
requires the repository secret `NPM_TOKEN`; package publication remains a separate
explicit operation and is not performed by repository setup or ordinary CI.
