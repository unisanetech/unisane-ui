---
id: 'D-34f2b8a19c7e'
owner: 'unisane'
repository: unisane-ui
scope: workspace
role: decision
lifecycle: durable
authority: canonical
provenance: accepted
view: target
status: accepted
relatedDocs:
  - 'D-20260714-ui-dual-distribution-and-theme-contract.md'
  - 'https://github.com/unisane/unisane/blob/5f6e0b3e3dea915b4267a266571c99150834f88b/docs/decisions/D-20260724-unisane-ecosystem-repository-remote-and-visibility-contract.md'
  - 'https://github.com/unisane/unisane/blob/5f6e0b3e3dea915b4267a266571c99150834f88b/docs/work/plans/unisane-ecosystem-repository-separation-and-git-governance-plan.md'
---

# D-20260807 Unisane UI Standalone Repository Structure, Cleanup, And Production-Readiness Contract

## Context

`unisane-ui/**` is the authoritative umbrella source for the future public
`github.com/unisane/unisane-ui` repository. Its product boundary is sound: tokens,
React components, DataTable, provider-neutral email presentation, source registries,
examples, and the UI documentation application evolve together while retaining
independent package release lines.

Before the accepted source-convergence Task, the directory inherited TypeScript,
ESLint, workspace, lockfile, Turbo, and quality commands from the umbrella; used
inconsistent package, application, documentation, and test locations; retained
temporary Plans and historical implementation records beside source; contained
undeclared generated debris; and let the `@unisane/ui` registry generator read
DataTable source across an intended package-release boundary. Task `T-724db9cf`
converged those surfaces in the authoritative umbrella before history extraction.

Extraction must not fossilize those transitional choices. Cleanup also must not happen
only in a non-authoritative shadow, because that would leave the umbrella and filtered
history with conflicting source truth.

## Decision Drivers

- one obvious location for every source, test, document, generator, and artifact
- independent package builds and releases without sibling-repository source
- a simple contributor and adopter experience despite the internal package graph
- deterministic clean installation, generation, testing, packing, and documentation
- package boundaries that match dependency and release direction
- public documentation separated from internal engineering Memory
- preservation of meaningful history without migrating caches or accidental output
- fail-closed legal, security, provenance, asset-rights, and publication readiness
- no permanent parent workspace, metarepository, or shared configuration package

## Considered Options

1. Extract the current directory unchanged and clean the new repository afterward.
   This preserves transitional coupling, makes the first shadow knowingly invalid, and
   creates cleanup commits only in a non-authoritative copy.
2. Flatten UI into one package and one application. This reduces folders but couples
   heavyweight DataTable and email dependencies to every UI consumer and removes useful
   independent release boundaries.
3. Split every UI concern into a separate repository. This multiplies governance,
   release, and local-development cost without an independent security, team, or
   lifecycle boundary.
4. Keep one focused UI monorepo, converge its authoritative source before extraction,
   materialize repo-local foundations, and prove each package and distribution boundary.

## Decision

Select option `4`.

### Sequencing and authority

1. The repository-bootstrap materializer remains the hard predecessor.
2. After that proof closes, a bounded UI convergence stage cleans the authoritative
   umbrella `unisane-ui/**` source. The partial standalone shadow receives no cleanup or
   feature work.
3. Cleanup is behavior-preserving unless a separately accepted product/API Decision
   authorizes a semantic change.
4. A new umbrella commit is frozen only after focused UI validation passes.
5. History filtering and foundation materialization are rerun from that new commit.
6. Commit `96f29c3f60834feea55c75a3994f10d6a207901f` remains the first-shadow audit
   baseline, not the final extraction source.
7. No remote, push, publication, trusted publisher, consumer cutover, or authority flip
   follows from structural readiness alone.

### Target repository layout

```text
unisane-ui/
├── AGENTS.md
├── README.md
├── CONTRIBUTING.md
├── SECURITY.md
├── LICENSE                         # only after owner/legal approval
├── NOTICE                          # only after owner/legal approval
├── package.json
├── pnpm-workspace.yaml
├── pnpm-lock.yaml
├── turbo.json
├── tsconfig.base.json
├── eslint.config.mjs
├── prettier.config.mjs             # only when a non-default policy is required
├── .changeset/
├── .github/
├── docs/
│   ├── 00-start-here.md
│   ├── architecture/
│   ├── standards/
│   ├── guides/
│   ├── decisions/
│   ├── findings/
│   ├── patterns/
│   └── reference/generated/
├── apps/
│   └── docs/
├── packages/
│   ├── ui/
│   ├── ui-cli/
│   ├── tokens/
│   ├── data-table/
│   └── email-templates/
├── examples/
├── scripts/
│   ├── checks/
│   ├── registry/
│   ├── release/
│   └── tokens/
└── tests/
    ├── consumer/
    ├── integration/
    └── package-content/
```

Empty directories are not scaffolded. `examples/**` appears only when a maintained,
validated example exists. A new package or application requires an independent public
contract, dependency set, release/deploy lifecycle, or substantial ownership boundary;
folder symmetry alone is insufficient.

### Repository-local foundation

The standalone repository owns and can change its own:

- exact package-manager version and Corepack policy
- pinned supported Node line for development and CI, plus compatible package engine
  ranges
- workspace membership and one lockfile
- minimal Turbo task graph
- TypeScript bases and package-specific extensions
- flat ESLint configuration and formatting policy
- Vitest and Playwright entrypoints
- ignore, attributes, editor, package-content, and generated-output rules
- CI, dependency/security/license scanning, Changesets, provenance, and release design
- tracked `skopos.config.yaml`, `AGENTS.md`, owner-local Project Memory,
  Scope/profile/policy/Skill/Action/Guard bindings, and portable target-local Task
  documents after authority cutover

It does not depend on umbrella-only commands, unpublished `@unisane/typescript-config`
or `@unisane/eslint-config`, the parent checkout, `unisane-infrastructure`, or any sibling
repository. Turbo, ESLint, TypeScript, Vitest, Playwright, and Changesets are installed
only where they own real work. The repository root is a private orchestration workspace,
not a publishable package.

The umbrella Skopos Task owns UI cleanup, extraction, and shadow verification while the
umbrella is authoritative. Because the extracted UI target contains existing source and
history, its Skopos lifecycle starts with an existing-project dry-run and non-mutating
adoption assessment. Any Memory or instruction restructuring follows reviewed
assess/propose/approve/verify/activate; strict metadata and local-link checks pass before
the target is agent-ready. Greenfield initialization is reserved for genuinely empty
fixtures and must not bypass review of migrated truth.

During the shadow, UI Skopos proves local context, docs retrieval, tracked Task
reconstruction, Actions, and Guards but admits no ordinary feature work. Action
declarations bind exact target-local commands, working directories, inputs, outputs,
capabilities, effects, concurrency, timeouts, safety/approval, phases/risks, and
`workspaceMode: overlay-safe`; detected or empty generic declarations are not authority.
`.skopos/**`, sessions, handoffs, conversation capsules, indexes, coordination databases,
and run caches are regenerated, not migrated. At authority cutover, umbrella UI Tasks
finish, cancel, or are superseded; a tracked cutover receipt and current immutable
high-impact Task snapshot preserve durable provenance. Unfinished work starts as a new
UI-local Task referring to that receipt. A Skopos fresh-session handoff remains disposable
local state and is not the cutover record. Public contributors can run conventional
install, lint, test, build, package, and docs commands without Skopos.

### Package and application identities

| Location                   | Identity                   | Publication/deployment contract                                                 |
| -------------------------- | -------------------------- | ------------------------------------------------------------------------------- |
| repository root            | `unisane-ui`               | private workspace; never published                                              |
| `apps/docs`                | `@unisane/ui-docs`         | private Next application; deployed UI documentation/workbench                   |
| `packages/ui`              | `@unisane/ui`              | public runtime component package and UI-owned local-source registry             |
| `packages/ui-cli`          | `@unisane/ui-cli`          | public UI adopter-tooling CLI package; owns the independent `unisane-ui` binary |
| `packages/tokens`          | `@unisane/tokens`          | public token/CSS package and generated token artifacts                          |
| `packages/data-table`      | `@unisane/data-table`      | independent public package; peers on public `@unisane/ui` exports               |
| `packages/email-templates` | `@unisane/email-templates` | independent public provider-neutral email presentation package                  |

`packages/core` is renamed to `packages/ui`; “core” is too ambiguous and does not match
the package identity. The existing private `@unisane/web` workspace is renamed to
`@unisane/ui-docs`; `web` is reserved for an application's real identity and must not be
confused with the separate `unisane-site` product.

`@unisane/tailwind-config` is retired. It currently wraps one PostCSS plugin object and a
redundant token stylesheet import, so it does not justify a package or release boundary.
The docs app owns its PostCSS file and imports the public token/UI CSS entrypoints.
Reusable styling truth remains in `@unisane/tokens` and `@unisane/ui`, not in a generic
configuration package.

The email package keeps the explicit `@unisane/email-templates` name. It owns HTML/text
presentation and brand inputs, not delivery, provider adapters, notification rules, or
Framework messaging workflows. It publishes compiled output, declarations, metadata,
and necessary assets; authored `src/**` is not published unless a later accepted source-
distribution contract requires it.

### Dependency direction

The package graph is acyclic:

```text
@unisane/tokens
      ↓
@unisane/ui
      ↓
@unisane/data-table

@unisane/ui authored registry ──> @unisane/ui-cli bundled build asset

@unisane/email-templates ──> @unisane/tokens (only if token mapping is explicit)

apps/docs ──> all documented local packages
examples  ──> public package exports only
```

- Tokens import no UI component or application source.
- UI imports tokens but not DataTable, email templates, docs, examples, or consumers.
- `@unisane/ui-cli` is a Node-only adopter-tooling package. It owns the independent
  `unisane-ui` binary and its command schemas, validation, effects, results, and terminal
  presentation. It may use Commander, prompts, and filesystem utilities internally but
  imports no Framework, Ops, or runtime UI package. Framework `unisane` and Ops
  `unisane-ops` never discover, load, validate, or execute a UI command pack, so product
  ownership and repository release direction stay acyclic.
- DataTable uses only declared public `@unisane/ui/*` exports. Tests do not alias into
  `packages/ui/src/**` or other package internals.
- Email templates remain provider- and Framework-runtime-neutral.
- Docs and examples are consumers and never become package build inputs.
- Cross-repository consumers use released semver, immutable canary/prerelease versions,
  or exact packed artifacts in disposable local fixtures; they never use sibling source.
- `workspace:*` is allowed only between packages in this repository and is converted by
  the release process into valid published dependency ranges.
- UI CLI has no cross-repository workspace, source, file-link, runtime, or development
  dependency. `@unisane/ui-cli` versions and proves its own `unisane-ui` command
  contract; it exposes no command-pack API and depends on no host contract.

### Registry ownership and dual distribution

The one-authoring-source and runtime/local-source parity contract remains accepted, with
these package boundaries:

- `packages/ui/src/**` is the canonical UI component authoring source.
- `packages/ui/registry/**` is generated only from UI-owned source and token inputs.
- `packages/ui-cli` copies that generated registry during its own build and publishes it
  inside the CLI pack. Runtime commands read only their bundled assets; an explicit
  registry-directory override is test/development injection, never an automatic sibling
  or umbrella fallback.
- `packages/data-table/src/**` is the canonical DataTable source.
- If DataTable supports local-source installation, `packages/data-table/registry/**` is
  generated and released by DataTable; the UI package generator does not copy DataTable
  source.
- The docs application may assemble a read-only catalog from versioned package registry
  manifests. It does not become an authoring source.
- Repository-level integration tests prove catalog consistency, dependency closure, and
  runtime/local-source parity across package releases.

The convergence removed the former relationship in which the `@unisane/ui` registry
builder read `../data-table/src`. This does not supersede the dual-distribution semantics
of `D-20260714`; it supersedes only its transitional `packages/core` path and
cross-package generator placement.

### Documentation authority

Root `docs/**` owns internal, durable repository knowledge:

- architecture and package/distribution boundaries
- contributor, test, accessibility, generated-artifact, and release standards
- Decisions, Findings, Patterns, and generated reference material
- maintainer and release guides

The minimum target-local baseline is deliberately compact:

- `docs/overview.md`
- `docs/architecture/design-system.md`
- `docs/architecture/design-system.md#distribution-architecture`
- `docs/standards/component-authoring.md`
- `docs/decisions/D-20260807-unisane-ui-standalone-repository-structure-cleanup-and-production-readiness-contract.md#generated-artifacts`
- populated Findings and generated reference material

Accessibility stays within the design-system and component-authoring contracts unless a
distinct cross-package standard becomes necessary. Documentation routing stays in
`docs/00-start-here.md`; contribution policy stays in root `CONTRIBUTING.md`. A real
release guide is added only when the legal, registry, signing, and publishing workflow
is approved. These consolidations avoid placeholder documents without leaving package,
distribution, testing, or generator truth in the umbrella after cutover.

`apps/docs/**` owns the public UI website:

- installation and adoption journeys
- component, token, pattern, block, and DataTable reference
- interactive examples and accessibility behavior
- public migration guidance after a real stable release
- the read-only registry catalog and workbench

Package `README.md` files remain beside publishable packages and contain only concise
consumer-facing installation, API, compatibility, and support information. They link to
the public docs website instead of duplicating its full content.

Current documentation is disposed as follows:

| Current document                                    | Disposition                                                                                                                 |
| --------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------- |
| former `packages/core/DESIGN_SYSTEM.md`             | converged into `docs/architecture/design-system.md`; absolute local paths removed                                           |
| former `packages/core/COMPONENT_AUTHORING.md`       | converged into `docs/standards/component-authoring.md`                                                                      |
| former `packages/data-table/docs/RESPONSIVENESS.md` | converged into the public `/docs/data-table/responsiveness` page; stale cross-product, future, and checklist claims removed |
| token build README                                  | retain beside its generator while it is the sole maintainer guide                                                           |
| package READMEs                                     | retain and make package-consumer focused                                                                                    |
| former `TEMP_DOCS_CONTENT_COMPLETION_PLAN.md`       | implemented missing pattern routes, then deleted                                                                            |
| former `BLOCKS_CATALOG_PLAN.md`                     | durable unresolved product truth moved to a target-local Finding, then deleted                                              |
| former `IMPLEMENTATION_CHECKLIST.md`                | deleted after completed outcomes were verified                                                                              |
| former `COMPONENT_SYSTEM_REFACTOR.md`               | deleted after unique durable outcomes were captured; Git retains history                                                    |
| former DataTable `ROADMAP.md`                       | deleted; future product work belongs in governed planning                                                                   |
| former DataTable `USAGE.md`                         | unique consumer guidance merged into README; duplicate deleted                                                              |
| root `MIGRATION.md`                                 | retain only through current internal convergence; delete before pre-1.0 public release after consumers are updated          |

Temporary Plans, checklists, roadmaps, and completed refactor narratives do not remain
active beside product source. Dead duplication is deleted rather than moved into a new
archive. A historical file is retained only when its unique rationale is likely to be
needed and cannot be reconstructed from an accepted Decision or Git history.

### Documentation application

The UI website remains at `apps/docs`; this is the conventional and accurate role name.
It may deploy to a UI-owned domain such as `ui.unisane.dev` only after deployment and DNS
authority are approved. The separate `unisane-site` repository owns the company and
product marketing website, not the UI documentation source.

Next routes remain thin. One application feature/content boundary owns documentation
registry and rendering behavior; parallel `lib/docs` and `features/docs-page` ownership
is converged only where actual duplication exists. Internal visual, outline, and
DataTable regression fixtures move from public `/docs/internal/**` routes to an explicit
test-only route boundary, are excluded or fail closed in production, and never appear in
public navigation.

### Test taxonomy and placement

Package tests use package-level `tests/**`, not mixed `src/__tests__`, root tests, and
colocated production files:

```text
packages/<package>/tests/
├── unit/
├── contract/
├── integration/       # only when internal package integration is owned here
├── accessibility/     # applicable UI packages
├── snapshots/         # applicable deterministic serializer/output snapshots
└── setup.ts
```

The exact subdirectories are created only when populated. Test files keep
`*.test.ts(x)` or `*.spec.ts(x)` names. `__tests__` is allowed only beside a private
generator whose test and implementation must move together; it is not the package-wide
convention.

- `packages/ui/tests/**` owns component, accessibility, public-export, registry parity,
  and UI package contract tests.
- `packages/ui-cli/tests/**` owns adopter commands, dry-run behavior, registry packaging,
  human/JSON host presentation, and exact pack-manifest routing.
- `packages/data-table/tests/**` owns DataTable behavior without importing UI internals.
- `packages/email-templates/tests/**` owns HTML/text contract, escaping, accessibility,
  and deterministic snapshots.
- `packages/tokens/tests/**` owns schema, semantic-role, generated-output, and snapshot
  tests.
- `apps/docs/e2e/**` owns Playwright browser and visual regression tests.
- root `tests/consumer/**` installs packed artifacts in clean disposable fixtures.
- root `tests/integration/**` proves supported cross-package flows.
- root `tests/package-content/**` proves exports, tarball contents, licenses/notices,
  provenance inputs, and absence of source/caches/secrets.

Visual baselines and meaningful generator snapshots are test artifacts, not junk. Their
browser/OS policy, update command, reviewer expectation, and CI owner must be explicit.
Coverage, Playwright reports, test results, `.turbo`, `.next`, and `dist` are local/CI
outputs and remain ignored.

### Generated artifacts

Every committed generated artifact declares:

- authored inputs and owning generator
- deterministic generation and drift-check commands
- owning package and release artifact
- whether it is committed, packed, deployed, or CI-only
- review and compatibility expectations

Registry output, token CSS/JSON, package metadata, schemas, and supported visual/token
snapshots may remain committed when consumers or deterministic review require them.
They are never hand-edited. Generation runs once from authored inputs and CI proves a
clean diff. Generated files do not live under `src/**` unless they are explicit authored
module inputs; distributable output prefers `dist/**`, `registry/**`, or
`docs/reference/generated/**` according to its owner.

### Cleanup contract

The `unisane-ui/**` filter boundary is candidate input, not an automatic keep list.
Before the new source freeze, every tracked UI file and package receives an explicit
`retain`, `move`, `rewrite`, `regenerate`, `delete`, or `block` disposition under the
ecosystem migration-cleanliness gate. Retention requires a current production,
documentation, test, example, generator, provenance, or distribution purpose and one
declared owner; “might be useful,” historical familiarity, and extraction convenience
are not sufficient.

The convergence stage performs reference, history, asset-rights, and generator checks
before removal. Its default dispositions are:

- delete the undeclared `packages/data-table/export-2026-07-09.pdf`
- delete unreferenced starter assets `next.svg`, `vercel.svg`, `turborepo.svg`, and
  `circles.svg`
- remove generated local caches/output before extraction without treating them as
  authored history
- remove machine-absolute paths and umbrella-root assumptions
- replace umbrella-only quality commands and hard-coded `unisane-ui/...` paths with
  repository-relative owners
- delete the private Tailwind-config package after the docs app owns its small local
  configuration
- remove unused aliases, exports, dependencies, scripts, configs, and empty directories
- retain SVG illustrations, fonts, screenshots, fixtures, registries, and snapshots only
  when referenced, licensed, owned, and covered by package/deployment manifests

No file is removed solely because its name looks old or generated. Unresolved ownership,
consumer use, provenance, or asset rights becomes a blocking Finding rather than an
assumption.

The target applies **brownfield evidence, clean-cut convergence, greenfield current
quality**. Imported Git history remains intact as provenance, but current authoritative
source contains no known deprecated alias, compatibility shim, old/new dual mechanism,
legacy fallback, retired command/config/environment flag, dead package/file/test/doc,
stale generated surface, accidental export, umbrella-only resolver, dummy content, or
accepted architecture violation. Before local-shadow admission, UI records a zero-residue
report for these classes plus consumer references and sibling-source dependencies. No
pre-stable compatibility layer is retained; compatibility may begin only after a real
stable release and an explicit Decision.

This cleanup does not misclassify legitimate resilience as legacy. Required retries,
idempotency, provider failover, outage degradation, recovery paths, safe defaults, and
persisted-data rollback remain when they have a named contract, owner, test, and
operational purpose. Data/schema transitions use bounded reversible migration steps when
deployed state requires them; a clean target architecture does not authorize unsafe data
loss.

### Package and release readiness

Each public package independently proves:

- exact package name, description, repository, directory, exports, files, side effects,
  peer dependencies, engines, support state, and release owner
- build and declarations from a clean checkout
- public imports resolve without TypeScript path aliases or sibling source
- `pnpm pack` contents install and execute in supported clean consumer fixtures
- workspace versions become valid registry dependency ranges
- no undeclared dependency is supplied accidentally by another workspace package
- no tests, caches, reports, secrets, internal Plans, or unrelated source enter tarballs
- changeset/release-group intent matches actual package coupling
- provenance, SBOM, dependency/license/secret scans, and package-content checks are ready

Linked UI/tokens changes may use coordinated Changesets without forcing every package to
share one version. DataTable and email templates retain independent releases. Stable
publication occurs only for a durable consumer contract; local development uses
workspace links, packed fixtures, and approved canaries rather than repeated stable
publishing.

The canonical technical producer certificate is
`pnpm --dir unisane-ui check:packed-producer-certificate`. It builds and packs the
exact `0.1.0` `@unisane/tokens`, `@unisane/ui`, and `@unisane/data-table` candidates,
verifies their complete manifests, exports, declarations, CSS, runtime dependencies,
dynamic export loaders, and archive boundaries, then installs only those three
first-party tarballs in a disposable external consumer. The consumer compiles and
loads every UI/DataTable import currently used by Saaskit and the Ops console, renders
both Button and DataTable through React server rendering, resolves all three package
stylesheets, and loads the XLSX and PDF dependencies. DataTable applies the same
extension-complete ESM rewrite as UI so strict NodeNext consumers can resolve its
runtime and declaration graph.

Tarball hashes are recorded as run artifacts because archive metadata may vary across
runs. The certificate's reproducible identity is the normalized archive-content and
consumer-import digest. It binds the consumer paths to their immutable umbrella
baseline and separately records the exact producer Git revision, tree, package paths,
and content digest. Emitted module loading is parsed structurally and fails closed on
nonliteral loaders; archive contents are limited to exact metadata, generated registry
assets, export-reachable files, and their owned declaration/source-map sidecars. This
technical certificate preserves `private: true`,
`UNLICENSED`, and the exact publication gates. It does not approve a license, registry,
remote, publication, consumer conversion, public release, or authority cutover.

### Repository, CI, and security readiness

The repository is structurally ready only when a fresh machine can run the documented
install and focused validation flow using repo-local files. CI is target-specific and
separates fast pull-request checks from release/publication checks. Required checks cover
at least formatting/lint, types, package tests, generated drift, docs build, supported
browser/visual proof, package contents, consumer fixtures, dependency/license/secret
scanning, and repository policy.

Public authority remains blocked until the repository manifest resolves owner/team,
recovery owner, CODEOWNERS, security contact and response policy, protected `main`, no
direct/force human push, required reviews/checks, signed release tags, GitHub App/OIDC
automation, provenance/SBOM, and rollback/deprecation ownership. No PAT, credential,
provider identity, or copied secret enters the repository or migration evidence.

### Legal and public-content readiness

Current package `MIT` strings express intent, not approval. The repository-bootstrap
system must fail closed while legal entity, license, NOTICE, contributor terms,
third-party notices, and redistribution rights remain unresolved. It never invents
license text.

The public audit covers source, registry output, token output, examples, documentation,
Material Symbols usage, SVG illustrations, screenshots, fonts, fixtures, copied snippets,
and every packed/deployed asset. Missing or ambiguous rights block public visibility or
the affected artifact; they are not waived because the code is intended to be open.

### Applicable migration gates

UI uses the ecosystem's single source-authority progression and five gates; it does not
create another persisted readiness vocabulary:

1. foundation/materialize — deterministic UI-owned repository foundation
2. local shadow — converged source, filtered history, standalone checks, and local
   docs/Skopos proof
3. remote authority cutover — approved public remote governance and one writable source
4. package/public release — package contents, external consumers, licensing,
   provenance, registry, compatibility, and support proof
5. production deployment — applies to `apps/docs`, not automatically to library packages

Passing an earlier gate never implies a later gate. Explicit unresolved legal or asset
rights may be reported by a local shadow but block public authority and publication.

### Source-convergence implementation evidence

Task `T-724db9cf` implemented this Decision in the authoritative umbrella source before
history extraction:

- `packages/core` became `packages/ui`; `@unisane/tailwind-config` was retired and the
  docs application now owns its PostCSS configuration
- the UI boundary now owns its Node/pnpm policy, workspace, lockfile, Turbo graph,
  TypeScript bases, flat ESLint configuration, editor/attributes/ignore rules, and
  deterministic commands
- UI, DataTable, email-template, and token tests have explicit owners; test-only docs
  routes fail closed in production
- the UI registry contains UI-owned items only; DataTable owns its runtime stylesheet
  and depends only on public `@unisane/ui/*` exports
- public-intent packages remain private and `UNLICENSED` until legal approval; no
  `LICENSE` text was invented
- every distributable package performs an atomic clean build, and the package-content
  check proves every non-wildcard export exists while excluding source, tests, internal
  docs, migration residue, and unrelated roots from dry-run tarballs
- `docs/reference/generated/repository-convergence-report.json` records the digest,
  owner, and disposition of every current non-output UI file and reports unresolved
  legal, asset, remote-authority, and publication blockers without treating them as
  source-convergence failures
- target-local package/distribution and testing/generated-artifact contracts now carry
  the durable rules previously visible only in this umbrella Decision
- the DataTable responsiveness guide now has one public docs-application owner; the
  stale package-local guide and its cross-product references are removed

Focused source-convergence proof does not establish a filtered-history shadow, public
history safety, independent clean-clone install, target-local Skopos activation, remote
authority, publication, or deployment. Those remain later gates.

## Consequences

- Positive: contributors can infer ownership from location and run all checks without
  the umbrella or sibling repositories.
- Positive: public docs, internal Memory, package guidance, tests, and generated output
  have distinct authorities.
- Positive: independent package releases no longer hide a DataTable-to-UI registry
  source cycle or undeclared workspace dependency.
- Positive: cleanup becomes part of preserved history rather than an untracked shadow
  repair.
- Positive: adopter workflows remain simple even though maintainers retain a focused
  multi-package repository.
- Positive: `unisane-ui ...` gives UI one user-facing executable without forcing CLI,
  prompt, filesystem, or Ops dependencies into `@unisane/ui` applications.
- Tradeoff: the first UI extraction is delayed until source convergence and a new frozen
  commit are proved.
- Tradeoff: moving tests and documentation creates a large mechanical diff that must be
  separated from behavioral changes and validated incrementally.
- Tradeoff: package-owned registry generation requires coordinated catalog integration
  instead of one generator copying every source tree.

## Supersession And Follow-Up

This Decision refines the UI target defined by the ecosystem repository Decision. It
supersedes only the `packages/core` physical path and cross-package registry-generator
placement in `D-20260714`; its one-authoring-source, runtime/local-source parity, token,
appearance, and accessibility contracts remain accepted.

Implementation requires bounded Skopos work after the repository-bootstrap predecessor.
The source-convergence proof must finish before the UI history filter is frozen again.
Any semantic public API change, email ownership change, new package/repository, or split
between docs and playground applications requires its own evidence and Decision.

## Changelog

- `2026-08-15`: Replaced the combined Framework-hosted UI pack with an independent
  UI-owned `unisane-ui` executable from `@unisane/ui-cli`. Framework `unisane` and Ops
  `unisane-ops` discover or execute no UI command surface; earlier pack/single-host
  entries below are historical implementation chronology only.
- `2026-08-11`: Corrected the packed producer certificate after independent consumer
  review: consumer and producer identities are now distinct, nonliteral emitted module
  loaders fail closed through AST inspection, and arbitrary unowned archive files are
  rejected by exact export/registry reachability.
- `2026-08-11`: Added the source-bound packed producer certificate for tokens, UI, and
  DataTable, including the strict NodeNext declaration correction and disposable
  Saaskit/Ops consumer proof. The certificate is technical evidence only; legal,
  publication, registry, consumer-conversion, and authority gates remain fail-closed.
- `2026-08-09`: Added the independent `@unisane/ui-cli` package boundary for the eight
  UI adopter commands. Runtime `@unisane/ui` remains tooling-free; the CLI pack bundles
  the UI-owned registry, implements the versioned structural pack protocol without a
  cross-repository dependency, contributes exact descriptors to the single `unisane`
  executable, and has no runtime
  sibling-source fallback or independent binary.
- `2026-08-09`: Closed the target-local documentation authority gap with a compact
  overview, package/distribution architecture, testing/generated-artifact standard, and
  public DataTable responsiveness page. Recorded intentional consolidation so missing
  symmetry-only documents cannot be mistaken for missing authority.
- `2026-08-09`: Recorded authoritative source-convergence implementation: repo-local
  tooling and lockfile, final package/application identities, package-owned tests/docs/
  generation, UI-only registry ownership, DataTable public dependency direction,
  fail-closed legal metadata, atomic clean builds, automated package-content proof, and
  the generated all-file disposition/digest report. Later shadow, public, release, and
  deployment gates remain explicitly unproved.
- `2026-08-09`: Aligned UI with the ecosystem's five gates and single authority
  progression; corrected target Skopos bootstrap to existing-project adoption with
  strict activation, tracked config/Tasks/snapshots/cutover receipt, reviewed
  target-local Actions/Guards, regenerated local runtime state, and conventional
  contributor commands without Skopos. Added the brownfield-evidence/greenfield-current
  zero-residue contract while preserving legitimate resilience and safe data migration.
- `2026-08-07`: Made file/package disposition and the ecosystem migration-cleanliness
  gate explicit so the UI filter cannot carry obsolete, dummy, accidental, or unowned
  content into the production repository by default.
- `2026-08-07`: Accepted the standalone UI repository layout, package/application
  identities, repo-local foundation, dependency and registry direction, docs/test/
  generated-artifact taxonomy, cleanup dispositions, staged readiness, and corrected
  pre-extraction source-convergence sequence.
