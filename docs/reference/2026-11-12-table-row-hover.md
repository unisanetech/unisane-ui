---
id: REF-ui-table-row-hover-20261112
owner: ui-maintainers
scope: workspace
role: reference
lifecycle: durable
authority: supporting
provenance: observed
view: current
---

# Table row hover boundary

Source preparation for Task `T-1d69a775`, based on
`d5679c7f5cbb8f81bce2ca89ef148e547887d20f`. This is not a release or Trade
deployment receipt.

The Customer dues screenshot showed both Expand and Collect highlighted when the
pointer was elsewhere in their row. DataTable body rows supplied a generic `group`
ancestor, which activated Unisane Button's descendant `group-hover` action layers.

Body rows and primitive TableRow no longer create hover groups. Following the
owner's clarification, they retain a subtle `surface-container-low` hover
background, applied to the row and its direct cells only. This covers pinned
cells without affecting nested action layers or nested tables. Tailwind's hover
variant limits this behavior to hover-capable devices. Selected, active, focused
and drop-target rows keep their existing background owner. Keyboard focus,
expansion and control-local feedback remain. Header sorting behavior is unchanged.
Three regression cases cover the ancestor boundary and independent nested actions,
selection and expansion.

## Verification

The selected build, lint, typecheck, unit tests and UI contract validation Actions
passed on the final source. DataTable reports 1,231 passing tests across 47 files.
The initial build could not bind a Turbopack worker port inside the sandbox; the
same Action passed outside it without changing production build settings.

The user explicitly approved running the existing Playwright visual suite. Initial
preflight could not resolve Playwright from PATH and had no browser availability
declaration. The project-local Playwright executable and installed Chromium binary
were verified before supplying their actual availability to the unchanged Action.

Run `run-20261112T101353Z-ui-capture-responsive-proof-ffd55cef` executed the complete
desktop/mobile suite: **25 passed, 6 failed, 3 skipped**. All six failures are the
three visual axes at both viewports. Differences occur in field variants, completed
public fleet, date family, stepper boundary, selection controls and persistent
communication. The inspected compact mobile field comparison shows Select text
inset differences. This inspection does not establish when those differences were
introduced. DataTable scrolling, virtualization and expanded-height browser checks
passed; the mobile pinned-column case is skipped by the existing suite.

No baselines, thresholds or tests were changed to turn these failures green.
Visual readiness remains blocked and needs investigation before release.

After restoring the row-only background, final run
`run-20261112T102253Z-ui-capture-responsive-proof-b401c10d` reports **26 passed,
6 failed, 4 skipped**. The new desktop browser regression passes: normal and
pinned cells highlight together; Expand's action layer remains at zero opacity
while another cell is hovered, responds to its own hover, and returns to zero
when the pointer moves away; keyboard selection retains its background on hover.
The added pointer test is intentionally skipped on mobile. The same six visual
axis comparisons remain failing. Tests wait for actual CSS transitions before
sampling colors. The fixture consumes built package exports, so producer build
must precede browser proof when those exports change; mismatched old JavaScript
and newly scanned CSS are not valid evidence.

Final build, tests, lint and types pass; unchanged UI-contract evidence was
reused. Parallel Action attempts passed their commands but detected changes to
the generated Task projection from concurrent runner finalization. Sequential
reruns passed with clean effects; the invalid parallel receipts are not proof.

## Local candidate and adoption boundary

The selected `ui.data-table.prepare-candidate` Action prepared:

`@unisane/data-table@0.1.2-next.20261112.1`

Archive: `.tmp/data-table-candidate/unisane-data-table-0.1.2-next.20261112.1.tgz`

SHA-512 integrity:
`sha512-1uRu61Nn75bOyee0/gX9PAFTRT9vQ7Ul6xDKRAYZSoMoQYdM8In6Qt2KSjhoADeodj72lgknPLpnsLnb7gbGfw==`

The initial archive inspection found 681 entries and no private source, tests,
credentials or dependency directories. The replacement local candidate retains
the public UI peer coordinate `0.1.2-next.20261111.1`; inspection confirms the
direct-cell hover selector in emitted row-state and no row hover group in the
emitted row module. It supersedes the initial local archive; neither has been
published. This inspection is not clean external-consumer certification.

Trade still consumes `0.1.2-next.20261111.1`; its live behavior is unchanged.
The existing approved release manifest authorizes the older cohort only. The new
candidate requires successful required proof, clean consumer verification and
explicit approval for public npm publication before immutable registry adoption
in Trade. Do not substitute sibling source, node_modules edits or a local tarball
dependency in Trade.
