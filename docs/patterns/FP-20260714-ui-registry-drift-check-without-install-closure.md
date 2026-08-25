---
id: 'PAT-307ef342bb0f'
owner: 'unisane'
repository: unisane-ui
scope: workspace
role: pattern
lifecycle: durable
authority: supporting
provenance: accepted
view: current
kind: failure-pattern
status: accepted
appliesTo:
  - 'registry'
  - 'check'
  - 'install'
  - 'closure'
---

# FP-20260714 UI Registry Drift Check Without Install Closure

## Wrong Pattern

Treat source-to-registry text equality and referenced-file existence as proof that a source-installed component is consumable.

## Symptom / Failure Mode

Registry validation passes while a clean consumer install fails because helper, hook, or type dependencies were omitted; npm dependencies are empty; nested files are flattened; internal aliases remain unresolved; or the CLI expects `@unisane/ui` inside the consumer project.

## Root Cause

The registry was validated as a copied artifact rather than as a dependency graph and install transaction. File drift checks did not model the final destination paths, package dependencies, canonical aliases, or a project with no Unisane runtime packages.

## Correct Pattern

Generate registry metadata from the complete internal import graph, preserve target-relative paths, distinguish local registry dependencies from npm dependencies, package the registry with the CLI distribution, and prove the output in clean consumer fixtures. Source/registry drift remains useful but is only one assertion inside install-closure proof.

## Detection Rule

- every internal import resolves to an owning registry item or a file included by that item
- every external non-peer import resolves to declared npm dependency metadata
- installed files contain no `@unisane/*` imports and no unresolved internal aliases
- nested component paths survive installation
- the CLI can list and install components when the consumer does not have `@unisane/ui`
- clean Next.js and Vite fixtures typecheck and build after representative installs

## Fix Recipe

1. Build a source-file-to-registry-owner index.
2. Resolve component, primitive, layout, hook, library, and type imports through that index.
3. Record external package dependencies from the authoring package manifest.
4. Compute destination paths relative to each registry root instead of using `basename`.
5. Resolve registry assets from the CLI package, not the consumer's `node_modules/@unisane/ui` path.
6. Add clean fixture, repeated-install, and conflict proof before widening component migration.

## Linked Artifacts

- Decision doc: `docs/decisions/D-20260714-ui-dual-distribution-and-theme-contract.md`
- Workpack/findings: [P114-W1](https://github.com/unisane/unisane/blob/5f6e0b3e3dea915b4267a266571c99150834f88b/docs/work/archive/tasks/P114-W1.md), [archived UI distribution finding](https://github.com/unisane/unisane/blob/5f6e0b3e3dea915b4267a266571c99150834f88b/docs/archive/findings/F-20260713-ui-source-distribution-and-theme-complexity.md)
- Docs updated: `docs/architecture/08-ui-application-architecture.md`, `docs/architecture/10-ui-visual-doctrine-and-token-governance.md`

## Changelog

- `2026-07-14`: Recorded the false-positive registry validation pattern and the required dependency/path/consumer-fixture closure model.
