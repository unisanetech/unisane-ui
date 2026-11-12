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

## Release follow-through requested by the owner

### Installed-consumer stylesheet correction

The owner approved the staged `.1` cohort and all four packages were published.
Trade's registry install matched the hosted archive integrities and provenance;
its 866 component tests and application types passed. Live DOM inspection
confirmed the new ungrouped row markup. It also exposed a distribution defect:
DataTable compiles utilities without a Tailwind theme, so the named semantic
color classes were omitted from its shipped stylesheet. The docs compiler had
the UI theme and source scanning, masking that omission in browser proof.

Correction `.2` uses the same public semantic color variable through Tailwind's
arbitrary-variable utility and gives immediate hovered cells `background-color:
inherit`. Both selectors are emitted by DataTable's own theme-free build;
consumers do not scan producer source or add private CSS patches. Persistent
row-state precedence and independent control feedback are unchanged.

The canonical package-content check now rejects archives whose stylesheet lacks
the direct-cell hover selector, inherited cell background or token-variable row
background. Its selected Action passed after building the `.2` packages. This
is distribution proof in addition to, not replaced by, the docs browser check.
The existing aligned staging route and npm owner approval are retained.
The `.2` build, lint, types, unit tests, UI contract validation, canonical packed
consumer certificate and package-content check pass. The unchanged independent
browser suite passes 32 tests with four intentional skips. Final Trade adoption
must still compare the actual published archive integrities and inspect the live
consumer's emitted stylesheet and hover state; producer docs alone are insufficient.

The owner subsequently requested "ok so make it live", authorizing the existing
public package release and local Trade adoption route. The canonical workflow
requires the four public package versions to align, so tokens, UI and email
templates receive version-only changes to `0.1.2-next.20261112.1`; DataTable is
the only changed runtime source. `docs/release-approval.json` records that scope.

Review of all 36 comparison diff images found differences confined to text in
six sections at three appearance axes and two viewports. The baseline images
predate committed typography correction `23c0232`: it removed forced normal
weight in the Text primitive, corrected checkbox/radio labels and field text
roles. This explains the affected label glyphs; the earlier tentative Select
inset diagnosis above was not an established cause. No new field or typography
runtime changes were made for this release. Reviewed baselines were regenerated
through their existing Action, with unchanged tests and thresholds.

Independent comparison run
`run-20261112T103128Z-ui-capture-responsive-proof-66c9392e` passed: **32 tests
passed, 4 intentionally skipped**. The row-only hover browser case passes.
Release archives still require their canonical clean-consumer certificate and
successful staged publication before Trade can adopt the registry coordinates.

### Earlier local candidate

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
