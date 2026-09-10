---
id: 'A-ui-package-and-distribution-boundaries'
owner: 'ui-maintainers'
scope: workspace
role: architecture
lifecycle: durable
authority: canonical
provenance: accepted
view: current
status: accepted
---

# Package and distribution boundaries

Unisane UI is one repository with five publishable-intent packages and one private
documentation application. A package exists only for an independently useful public
contract, dependency set, or release boundary; shared location alone does not justify a
new package.

## Owners

| Owner                      | Responsibility                                                                               | Distribution boundary                                                                   |
| -------------------------- | -------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------- |
| `@unisane/tokens`          | Semantic token inputs, validation, generated CSS, and Tailwind theme exposure                | CSS package; linked with UI when a change alters their shared contract                  |
| `@unisane/ui`              | React components, runtime styles, public subpath exports, and source-installable UI registry | Runtime package plus UI-owned registry artifacts                                        |
| `@unisane/ui-cli`          | UI-owned adopter commands and a bundled snapshot of UI registry assets                       | Independent `unisane-ui` executable; never loaded by Framework or Ops                   |
| `@unisane/data-table`      | DataTable behavior, public types, runtime styles, and substantial table-only dependencies    | Independent package; consumes only public `@unisane/ui/*` exports                       |
| `@unisane/email-templates` | Provider-neutral HTML and text presentation                                                  | Independent package; does not own delivery, queues, providers, or application workflows |
| `@unisane/ui-docs`         | Public documentation, examples, registry catalog, workbench, and browser/visual proof        | Private deployable application; never a runtime dependency                              |

`@unisane/tokens`, `@unisane/ui`, `@unisane/data-table`, and
`@unisane/email-templates` are approved MIT-licensed public prerelease packages. Their
initial integration line is `0.1.0-next.b67ebfd0` under the npm `next` tag.
`@unisane/ui-cli` remains private and `UNLICENSED` until separately approved.

## Dependency direction

The allowed first-party direction is:

```text
@unisane/tokens ──> @unisane/ui ──> @unisane/data-table
        │                  │                 │
        └──────────────────┴─────────────────┴──> @unisane/ui-docs

@unisane/email-templates ───────────────────────> @unisane/ui-docs

@unisane/ui registry ──> @unisane/ui-cli ──> unisane-ui executable
```

An arrow means “may be consumed by.” Reverse imports are forbidden. In particular:

- tokens never import UI or application source
- UI never reads or copies DataTable source
- UI CLI may bundle UI-owned generated registry artifacts at build time, but runtime UI
  packages never depend on the CLI
- UI CLI owns the `unisane-ui` executable and its command framework directly. It exposes
  no pack manifest, host handler, alias, proxy, or forwarding path to Framework or Ops.
- DataTable uses declared `@unisane/ui/*` exports, never UI `src/**` or registry files
- email templates do not depend on Framework notification or provider implementations
- runtime packages never import from `apps/docs/**`
- no package imports infrastructure, another repository checkout, or the parent folder

The root workspace and lockfile support local development only. They do not turn sibling
source into a public dependency contract. Clean packed-consumer proof is required before
release or cross-repository cutover.

## Registry ownership

`packages/ui/src/**` is the only authored source for the UI registry.
`packages/ui/scripts/build-registry.mjs` materializes `packages/ui/registry/**`; generated
registry files are never edited directly. `@unisane/ui` registry generation cannot scan
DataTable or any other package source.

DataTable remains a package-consumption boundary. If it later offers source-installable
distribution, DataTable must own that generator and artifact or a repository-level
catalog may index independently generated package artifacts. The UI generator must not
become a cross-package source copier.

The docs application may aggregate read-only package metadata for discovery. It is not
the authoring source or release owner for any package.

## Release and compatibility

- Each publishable package owns its manifest, exports, build, tests, package contents,
  and change record. UI CLI additionally owns its executable and bundled registry
  snapshot.
- Changesets coordinate versions; they do not authorize publication.
- `@unisane/tokens` and `@unisane/ui` are linked where their shared CSS/runtime contract
  changes together. DataTable and email templates can release independently when their
  declared dependencies remain compatible.
- Stable compatibility promises begin only after a real stable public release. Before
  that point, clean cutovers remove obsolete exports, aliases, fallbacks, and dual paths.
- Cross-repository consumers use released or explicitly approved canary artifacts, not
  sibling workspaces, file links, or copied source.
- Public packages require provenance and the `next` tag. Registry authentication and
  the actual publish transaction remain independently verified external effects.

`pnpm check:packed-producer-certificate` reads the approved release set from
`docs/release-approval.json`, packs those packages, and verifies an isolated consumer
without reading sibling repositories or historical umbrella revisions. It checks
manifest identity, licenses, exports, exact internal dependencies, TypeScript imports,
React server rendering, email exports, and stylesheets. The resulting archives and
integrity certificate live in ignored `.tmp/release/`. This is artifact verification,
not evidence of successful registry publication.

The publishing workflow verifies each archive's integrity immediately before uploading
that same archive. Its `NPM_TOKEN` secret is exposed only to the publish step; the
temporary bootstrap credential is removed after the approved release operation.
