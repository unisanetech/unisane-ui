---
id: 'PLAN-7b181d255f35'
owner: 'unisane'
repository: unisane-ui
scope: workspace
role: plan
lifecycle: durable
authority: supporting
provenance: accepted
view: current
status: active
appliesTo:
  - 'data'
  - 'table'
  - 'scroll'
  - 'architecture'
  - 'perf'
---

# Data Table Scroll Architecture And Performance Plan

Converge `@unisane/data-table` on one scroll architecture, one provider/reducer shape, and one public API surface so the package is honestly product-grade across desktop and mobile, across small and large tables, and across consumer apps that embed it.

## Changelog

- `2026-04-19`: Opened the plan after the live audit of `packages/data-table/**`. The plan freezes one scroll architecture (single sticky-header table, native passive scroll, momentum-scroll enabled on mobile), one sliced provider/reducer, one subpath-split public API, and one enforcement ratchet for file size, public export size, bundle size, edit-history memory, a11y, and i18n.
- `2026-04-19`: The temporary `P76-W1` and `P76-W1b` execution artifacts were
  intentionally removed after the attempted implementation was reverted. The Plan
  remains the durable source for the next restart; open bounded Skopos Tasks only when
  the lane is ready to execute again.

## Goal

Make `@unisane/data-table` honestly product-grade:

1. Horizontal scroll is pixel-aligned across header and body on every platform.
2. Mobile flick-scroll produces native momentum.
3. Render work stays proportional to visible rows, not total rows.
4. Public API surface is small, subpath-split, and stable.
5. Heavy export dependencies (`xlsx`, `jspdf`) are truly lazy and do not enter the default bundle.
6. Edit history is bounded and safe under long editing sessions.
7. A11y matches the documented claim (`role="grid"`, roving tabindex, `aria-live` announcements, full keyboard surface).
8. Preset and feature combinations are validated at dev time.
9. i18n has a completeness gate, not a silent fallthrough.
10. Living docs and property-based tests keep the component honest as it evolves.

## Why This Plan Exists

`@unisane/data-table` is the default grid across starter and platform apps (notably `data-entry-lm` review tables, datasets, documents, templates). A live audit found:

- Two user-visible bugs rooted in one architectural choice: two scroll containers kept in sync through React state at `packages/data-table/src/components/layout.tsx:125,130-134,377-382`, with a JS-driven custom scrollbar at `packages/data-table/src/components/custom-scrollbar.tsx` that blocks native momentum.
- Structural drift that blocks later enforcement: monolithic reducer at `packages/data-table/src/context/reducer.ts`, oversized provider at `packages/data-table/src/context/provider.tsx`, `23` files over `400` LOC, public API of ~174 exports through a single `src/index.ts`, `jspdf`/`xlsx` as root runtime dependencies, row component not memoized, TanStack Virtual `measureElement` wired but never called, unbounded edit-history memory, implicit `<table>` role instead of `role="grid"`, preset/feature conflicts not validated, i18n carrying only `en` and `hi`.

Because Unisane is unreleased, `@unisane/data-table` moves directly to the canonical
surface. Replaced exports and behavior are deleted in the same bounded Task; no
deprecated aliases, compatibility layer, or parallel API is retained.

## Non-Goals

- Do not rewrite the grid on TanStack Table, AG Grid, or another vendor. The current headed component is the baseline.
- Do not rebuild the visual-doctrine token layer inside this plan; token work belongs in `docs/architecture/10-ui-visual-doctrine-and-token-governance.md`.
- Do not widen scope into starter/platform UI architecture convergence; that is tracked separately under `F-20260409-ui-application-architecture-convergence-gap`.
- Do not introduce a mobile-only code path; one component, one scroll model, one render model.
- Do not preserve legacy compatibility in internal or distributable package surfaces.

## Principles

1. One scroll container. `<thead>` stays visible through `position: sticky`, not through a second scroll container synced by React state.
2. Native scroll is the default. Custom JS scrollbars are out unless a proven UX gap demands them, and even then they must not replace the underlying native scroll.
3. Scroll listeners are `{ passive: true }` and never call `setState` inside the event.
4. React state holds domain state; DOM position is DOM state. Do not store `scrollLeft`, `scrollTop`, or measured pixel values in React unless the component needs to react to them.
5. Context is sliced. Stable callbacks and mutable state live in separate contexts; rows subscribe only to what they render against.
6. Row rendering is pay-for-what-you-see. Virtualization handles culling; `React.memo` with a custom comparator stops spurious re-renders on the visible set.
7. Heavy dependencies are dynamically imported. `xlsx` and `jspdf` never land in the default chunk.
8. Public API is subpath-split. The root import is small; advanced surfaces live under `@unisane/data-table/hooks`, `/primitives`, and `/export`.
9. A11y is implemented, not claimed. `role="grid"`, roving tabindex, and `aria-live` announcements are load-bearing, not aspirational.
10. Everything testable has a test. Visual regression for scroll alignment; E2E for mobile momentum; property-based tests for sort/selection/filter/pagination invariants.

## Contract

- Public package compatibility class: `public-package-semver`. Root-level exports that move under a subpath are deprecated for one minor version with migration notes before a major-version hard break.
- File size budget: no source file over `400` LOC; no hook over `300` LOC.
- Public export size budget: `src/index.ts` exports no more than ~25 symbols after the subpath split; advanced surfaces live at `@unisane/data-table/hooks`, `/primitives`, `/export`.
- Default bundle budget: `DataTable` default import resolves to under `80 KB` gzip, excluding peer dependencies.
- Dependency budget: `jspdf` and `xlsx` are not present in any chunk that does not import an export feature.
- Edit-history memory budget: the edit-history ring buffer defaults to `200` entries and stores diffs past a configurable row-size threshold.
- Scroll alignment budget: header and body are pixel-aligned across the entire horizontal scroll range (`<= 1 px` tolerance in visual regression).
- Mobile momentum budget: flick-scroll on iOS Safari continues to scroll for at least `500 ms` after `touchend`.
- A11y budget: `axe` audit passes on the default and every preset; manual VoiceOver
  proof is recorded on the owning Task.
- i18n completeness: every locale file has every key; CI fails otherwise.

## Architecture

One DOM tree:

```
<div data-datatable-scroll="body" class="overflow-x-auto">
  <table>
    <thead class="sticky top-[var(--data-table-header-offset,0px)]">
      <tr>
        <th class="sticky left-0 ...">…</th> <!-- pinned via sticky -->
        <th>…</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td class="sticky left-0 ...">…</td>
        <td>…</td>
      </tr>
    </tbody>
  </table>
</div>
```

Scroll model:

- One `overflow-x-auto` container with `-webkit-overflow-scrolling: touch`, `overscroll-behavior: contain`, and `touch-action: pan-x pan-y`.
- One native scroll listener, registered through a `useEffect` with `{ passive: true }`, used only to feed TanStack Virtual.
- No `scrollLeft` React state. No `element.scrollLeft = value` writes in response to React state.

Provider model:

- One stable-callback context, ref-backed, whose identity never changes.
- One mutable-state context exposed through `use-context-selector`; slice hooks subscribe only to their slice.
- Seven slice reducers under `src/context/slices/**` (selection, sort, filter, pagination, column, grouping, ui) composed by a 10-line combiner.

Row model:

- `row.tsx` is wrapped in `React.memo` with a custom comparator on `rowId`, `isSelected`, `isExpanded`, `isEditing`, `isFocused`, and `dataVersion`.
- Every handler passed to a row is stabilized through the callback context.
- TanStack Virtual `measureElement` is called so dynamic row heights resolve correctly.

Bundle model:

- `xlsx` and `jspdf` live behind `await import(...)` inside `utils/export/plugins.ts`.
- `package.json` `exports` publishes four subpaths: `.`, `./hooks`, `./primitives`, `./export`.

## Planned Tasks

1. `P76-W1` — Scroll architecture code cut. Single-table layout, sticky header, native passive scroll, mobile CSS, removal of `custom-scrollbar.tsx`, vitest unit proof of the new single-container contract. Visual regression and mobile-momentum E2E are deferred to `P76-W1b` because the package does not yet have a Playwright harness; standing that up is its own bounded slice and must not delay the code cut that fixes the user-visible bugs.
2. `P76-W1b` — Playwright harness and baseline E2E proof. Stand up Playwright with `hasTouch: true`; add `scroll-alignment.visual.test.ts`, `mobile-momentum.e2e.test.ts`, and `virtualization-sticky-header.test.ts`; record before/after evidence for the scroll architecture cut.
3. `P76-W2` — Render performance. Split provider context, memoize `row.tsx`, stabilize row props, wire TanStack Virtual `measureElement`.
4. `P76-W3` — Reducer and provider slice split. Seven slice reducers, one slice per context.
5. `P76-W4` — Bundle subpaths and lazy export. True `await import` for `xlsx`/`jspdf`; `package.json` `exports`; public-package deprecation notes and migration guide.
6. `P76-W5` — File bloat cleanup. No file over `400` LOC; no hook over `300` LOC.
7. `P76-W6` — Memory and correctness. Edit-history ring buffer, `useInlineEditing*` consolidation, automatic error recovery wiring, helper deduplication.
8. `P76-W7` — A11y upgrade. `role="grid"`, roving tabindex, `aria-live`, full keyboard surface, focus restore across virtualization.
9. `P76-W8` — Dev-time config validation. `validateConfig()` with preset/feature conflict warnings.
10. `P76-W9` — i18n completeness gate. Locale parity script; `es`/`fr`/`de` seeded with English fallbacks.
11. `P76-W10` — Tests and living docs. Property-based tests, Storybook (or equivalent), `README.md` preset guidance.

When execution resumes, admit each slice as a bounded Skopos Task with explicit owned
paths, acceptance criteria, retired-pattern Guards, replacement Evidence, and Readiness.
Do not recreate the archived convergence-contract system.

## Verification

The owning Task selects registered data-table behavior/build, docs, architecture, and
instruction Actions from its changed paths. Run the narrowest reliable Action first and
record manual mobile, VoiceOver, and visual observations directly against acceptance.

## Risks And Mitigations

- Sticky positioning with `border-collapse`. The current table already uses `border-separate` at `packages/data-table/src/components/table.tsx`, so sticky columns and header coexist cleanly. Add a regression test that exercises pinned columns under horizontal scroll.
- Virtualization plus sticky header. TanStack Virtual measures against the scroll container, not the viewport; confirm the scroll container is the same element that owns the sticky header. Add a test that scrolls deep into a 10k-row table and asserts header alignment.
- Public-package churn. Every subpath move is a deprecation, not a rename. Ship a migration-notes file in the same release and keep the old root exports alive for one minor version.
- Mobile UX regressions from removing `custom-scrollbar.tsx`. Add a mobile E2E test that
  proves momentum scroll and attach before/after visual Evidence to the Task.
- Reducer slicing subtly changing behavior. Port the existing action tests first; only then split the reducer; keep coverage green across the split.

## Execution Status

- No `P76` execution Task is active right now.
- `P76-W1` and `P76-W1b` remain the intended restart slices when the lane is reopened.
- `P76-W2` through `P76-W10` stay queued behind that restart.
