---
id: 'S-ui-testing-and-generated-artifacts'
owner: 'ui-maintainers'
scope: workspace
role: standard
lifecycle: durable
authority: canonical
provenance: accepted
view: current
status: accepted
---

# Testing and generated artifacts

Tests and generated output stay with the owner whose public or distributable behavior
they prove. New directories are created only when populated; folder symmetry is not a
reason to add placeholders.

## Test ownership

- `packages/ui/tests/**` proves component behavior, accessibility, public exports,
  component contracts, and UI registry parity.
- `packages/data-table/tests/**` proves DataTable behavior through public UI imports.
- `packages/email-templates/tests/**` proves deterministic HTML/text output, escaping,
  and presentation accessibility.
- `packages/tokens/scripts/tokens-build/__tests__/**` stays beside the private generator
  because implementation, snapshot, and generator move together.
- `apps/docs/e2e/**` owns browser flows, test-only fixtures, and visual regression.
- Root `tests/consumer`, `tests/integration`, and `tests/package-content` are created only
  when a real cross-package proof cannot be owned by a package or application. Current
  repository scripts may provide those checks without requiring empty test folders.

Use `*.test.ts(x)` or `*.spec.ts(x)`. Package-wide `src/__tests__` trees and production
source colocated with broad integration tests are forbidden. Tests may import public
sibling package exports but never sibling `src/**` or checkout-relative internals.

Accessibility is part of normal behavior proof, not a separate late checklist. Direct
tests cover semantics, names and relationships, keyboard operation, focus movement and
restoration, disabled behavior, and supported responsive states. Browser proof covers
interactions that DOM-level tests cannot establish reliably.

The docs visual suite builds with test fixtures enabled and serves the production
static export through its test-only loopback launcher. `next start` cannot serve
`output: 'export'`. Do not change production export settings or use a development
rendering path to work around a fixture-launch failure. Public export preparation
continues to remove test fixtures before deployment.

Visual comparisons collect every section mismatch with soft assertions; any mismatch
still fails the suite. A baseline refresh must identify and inspect each changed
section, preserve thresholds and then pass a separate comparison run without an
update flag. The 22 October launcher repair exposed six field images predating the
committed Select sizing fix `87adacf` (correct trailing padding/icon size), and seven
images with only 1–8 changed glyph-edge pixels. Their current locked-browser captures
were reviewed before regeneration; this does not authorize unrelated UI restyling.
Repeated comparison also exposed initial multiline auto-resize before font readiness.
Automatic fields remeasure when fonts settle or visible width changes, and remove
observers/listeners on teardown. Keep this actual component behavior in browser proof;
do not hide the race with looser image dimensions or a manually fixed fixture height.

## Generated-artifact declaration

Every committed generated artifact has five facts:

1. authored inputs
2. one owning generator
3. deterministic generate and drift-check commands
4. owning package, documentation, or test boundary
5. whether the output is committed, packed, deployed, or CI-only

Current committed owners are:

| Output                                                        | Authored input and generator                                                          | Proof                                                                                 |
| ------------------------------------------------------------- | ------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------- |
| `packages/ui/registry/**`                                     | `packages/ui/src/**` through `packages/ui/scripts/build-registry.mjs`                 | `pnpm --filter @unisane/ui validate:registry` and registry contract tests             |
| token snapshot                                                | token theme inputs and token build pipeline                                           | `pnpm --filter @unisane/tokens test`                                                  |
| `apps/docs/e2e/**/*-snapshots/**`                             | public/test-only docs routes through Playwright                                       | `pnpm --filter @unisane/ui-docs test:visual`; updates require reviewer-visible intent |
| `docs/reference/generated/repository-convergence-report.json` | current non-output repository files through `scripts/check-repository-boundaries.mjs` | `pnpm check:boundaries`; refresh only with `pnpm report:convergence`                  |

Generated files are never hand-edited. Change the authored input or generator, regenerate
once, review the diff, and run the declared drift check. A generator may read only its
declared owner inputs; it cannot silently copy sibling package source.

Build output such as `dist`, `.next`, `.turbo`, coverage, Playwright reports, and test
results remains ignored unless an accepted distribution or deterministic-review contract
explicitly says otherwise. Generated source does not live under `src/**` unless that path
is itself the accepted distributable authoring contract.

Keep `apps/docs/out` excluded from project scanning as well as the app's Git ignore
rules. Action directory fingerprints do not apply nested Git/scan exclusions, so quality
and visual Actions explicitly list the complete authored package/docs source and configs
instead of `.` or the whole docs app. The disposable export is not a source input.
Tracking generated chunks makes unrelated evidence stale after every build. Authored
fixtures and reviewed comparison baselines remain tracked; baseline generation excludes
its own expected-image output, and the independent comparison includes it. Commands,
coverage, screenshot thresholds and build behavior remain unchanged.

## Proportional proof

Before treating unresolved framework imports as application type errors, verify the
installed package targets. A package-only producer preparation may leave other
workspace importers uninstalled. Restore the complete workspace with
`pnpm install --frozen-lockfile --prefer-offline` before repository-wide docs checks;
the lockfile remains authoritative. Missing Next/MDX installations must not be hidden
with casts, lint suppressions, aliases or weaker unsafe-type rules. Offline-only
installation is appropriate only when every locked artifact is already cached.

Run the narrowest owner command first:

- package change: the package's lint, type, test, and build commands
- registry change: `pnpm --filter @unisane/ui validate:registry`
- token change: token test/build plus affected UI checks
- docs behavior change: docs typecheck/build and focused browser proof when rendering or
  interaction changed
- package or dependency-boundary change: `pnpm check:boundaries` and
  `pnpm check:package-content`

`pnpm check:quality` is the repository confidence lane when a change crosses tokens, UI
runtime styles, registry ownership, package boundaries, or public documentation. It does
not replace release readiness, licensing approval, clean external-consumer proof, or
human authorization to publish.
