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
| `@unisane/ui-cli`          | UI-owned adopter commands and a bundled snapshot of UI registry assets                       | Command pack loaded by the canonical `unisane` executable; never a second binary        |
| `@unisane/data-table`      | DataTable behavior, public types, runtime styles, and substantial table-only dependencies    | Independent package; consumes only public `@unisane/ui/*` exports                       |
| `@unisane/email-templates` | Provider-neutral HTML and text presentation                                                  | Independent package; does not own delivery, queues, providers, or application workflows |
| `@unisane/ui-docs`         | Public documentation, examples, registry catalog, workbench, and browser/visual proof        | Private deployable application; never a runtime dependency                              |

The public-intent packages remain private and `UNLICENSED` until legal and release
approval. Package names and manifests express the intended boundary, not current
permission to publish.

## Dependency direction

The allowed first-party direction is:

```text
@unisane/tokens ──> @unisane/ui ──> @unisane/data-table
        │                  │                 │
        └──────────────────┴─────────────────┴──> @unisane/ui-docs

@unisane/email-templates ───────────────────────> @unisane/ui-docs

@unisane/ui registry ──> @unisane/ui-cli ──> canonical unisane executable
```

An arrow means “may be consumed by.” Reverse imports are forbidden. In particular:

- tokens never import UI or application source
- UI never reads or copies DataTable source
- UI CLI may bundle UI-owned generated registry artifacts at build time, but runtime UI
  packages never depend on the command pack
- UI CLI contributes the `unisane ui` command family through its pack manifest and never
  owns another executable or a second command framework
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
  and change record. UI CLI additionally owns its pack manifest and bundled registry
  snapshot.
- Changesets coordinate versions; they do not authorize publication.
- `@unisane/tokens` and `@unisane/ui` are linked where their shared CSS/runtime contract
  changes together. DataTable and email templates can release independently when their
  declared dependencies remain compatible.
- Stable compatibility promises begin only after a real stable public release. Before
  that point, clean cutovers remove obsolete exports, aliases, fallbacks, and dual paths.
- Cross-repository consumers use released or explicitly approved canary artifacts, not
  sibling workspaces, file links, or copied source.
- Signed tags, provenance, SBOM, registry identity, and trusted publishing must be proved
  by the release gate before any public package leaves its fail-closed state.
