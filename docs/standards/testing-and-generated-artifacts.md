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

## Proportional proof

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
