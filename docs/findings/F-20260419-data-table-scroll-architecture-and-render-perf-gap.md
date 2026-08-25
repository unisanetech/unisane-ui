---
id: 'F-2d6f92e1c4aa'
owner: 'unisane'
repository: unisane-ui
scope: workspace
role: finding
lifecycle: active
authority: supporting
provenance: accepted
view: current
severity: SHOULD
status: open
---

# F-20260419-data-table-scroll-architecture-and-render-perf-gap: Data Table Scroll Architecture, Render Performance, And API Surface Gap

## Changelog

- `2026-04-20`: Closed the bundle and package-surface lane. `@unisane/data-table` now ships explicit `/components`, `/context`, `/hooks`, `/i18n`, `/export`, `/print`, and `/utils` entrypoints, the root `src/index.ts` barrel is trimmed down to `105` LOC and now exposes only `DataTable` plus core types/helpers, the docs app and demos now consume the explicit subpaths, and the Excel/PDF export path now uses one lazy implementation backed by dynamic `xlsx` / `jspdf` imports instead of parallel eager and `lazy-*` APIs. Added export-contract updates to the toolbar types and refreshed the safe-export regression tests. The finding stays open for the remaining file-bloat and fuller keyboard/a11y contract.
- `2026-04-20`: Closed the reducer decomposition and aggregate-surface cleanup lane. `context/reducer.ts` is now a small combiner over dedicated selection/sort/filter/pagination/column/grouping slice owners under `src/context/slices/**`, `DataTableInner` now reads runtime callbacks directly instead of reaching back through a reconstructed aggregate context, and the aggregate `useDataTableContext` / `useOptionalDataTableContext` surface is gone from the package boundary. Added reducer-level regression tests for cross-slice pagination resets, targeted hydrate behavior, and reset-all page-size preservation. The finding stays open for the oversized package surface, bundle cost, and fuller a11y contract.
- `2026-04-20`: Landed the first provider/render-fanout cut on the active table path. `DataTableProvider` now publishes stable runtime callbacks, controlled-state metadata, and mutable table slices through separate contexts instead of one monolithic provider value, and the live selection/sort/filter/pagination/column/grouping hooks now subscribe only to the slice they consume. Added a regression test that proves pagination consumers do not rerender when selection state changes. The finding stays open because the reducer is still monolithic, the aggregate compatibility hook still reconstructs the old broad context surface for package consumers, and the broader bundle/a11y debt is unchanged.
- `2026-04-20`: Closed the active dynamic expanded-row virtualization seam on the live table path. Expanded content now participates in virtualization as its own keyed item instead of being treated as hidden overflow inside the base row height contract, non-virtualized and virtualized rendering now share one expanded-row component, and the hidden docs regression route plus Playwright proof now cover variable-height expanded content, deep scroll, and remount behavior in Chromium plus mobile Chrome. The finding stays open for the broader provider/render-fanout, bundle, and a11y debt.
- `2026-04-20`: Landed the browser-proof virtualization slice. Added a hidden docs regression fixture plus Playwright coverage for internal vertical scroll, sticky header anchoring, pinned-column stability, and custom scrollbar bounds across Chromium and mobile Chrome. The row virtualizer now seeds an initial window when TanStack has not measured yet, recomputes the visible slice on scroll-driven rerenders instead of freezing around the initial window, and shares the real table scroll element through one ref callback. The active browser path stays estimate-based for row heights again; dynamic `<tr>` measurement remains follow-up debt under the broader virtualization/a11y lane.
- `2026-04-20`: Removed the retired split-scroll helpers entirely. `SyncedScrollContainer`, `StickyHeaderScrollContainer`, `HeaderTable`, `BodyTable`, `useScrollSync`, the old scroll-sync context, and the associated split-layout implementation are gone from `@unisane/data-table`; the active package boundary now exposes only the layout primitives still used by `DataTableInner`. The finding stays open because real-browser proof for sticky header + pinning + virtualization is still missing, and the broader provider/bundle/a11y debt is unchanged.
- `2026-04-20`: Moved the active virtualized-row path onto a table-native spacer-row contract. `VirtualizedBody` now renders normal `<tr>` rows between top/bottom spacer rows instead of absolutely positioning table rows inside `<tbody>`, and focused-row navigation now routes through the row virtualizer with `scrollToIndex(..., { align: 'auto' })` when virtualization is active. Added a targeted regression test for the spacer-row contract. The finding stays open because real-browser proof is still missing, the split-scroll helpers still remain exported, and the broader provider/bundle/a11y debt is unchanged.
- `2026-04-20`: Landed the first hard-cut on the active `DataTableInner` render path. The package now renders one real table inside one horizontal scroll container, keeps the sticky header in that same DOM tree, routes column virtualization and pinned-shadow state off that one container, restores touch-scroll container CSS, and makes the custom scrollbar listener passive. The finding stays open because row virtualization still needs a table-native proof, keyboard navigation still does not scroll the focused row into view, and the exported split-scroll helpers remain as compatibility surface.
- `2026-04-19`: Opened the finding after a live code audit of `@unisane/data-table` at `packages/data-table/**`. Two user-visible bugs (header/body horizontal scroll desync and mobile flick-scroll lag) trace to one architectural root cause: a split-table layout whose header and body are kept in sync through React state plus an `element.scrollLeft = value` write, with non-passive scroll listeners and no `-webkit-overflow-scrolling: touch`. The same audit surfaced structural debt (monolithic reducer and provider, 23 files over 400 LOC, oversized public API surface, non-lazy `jspdf`/`xlsx` dependencies, unbounded edit-history memory, role/keyboard gaps versus a11y claims, preset + feature conflicts not validated) that blocks the package from being reliably promoted to enterprise-grade use. The finding stays open with the remediation preserved in the paired plan; the next implementation slice should reopen a bounded execution workpack only when the lane is ready to run again.

## Summary

- Severity: `MUST`
- Status: `in-progress`
- Owner: `architecture-program`
- Target Pack: `queued-next-data-table-a11y-cut`

## Symptom

The original user-visible scroll bugs were both caused by the same root flaw: `DataTable` rendered separate header and body scroll surfaces and kept them aligned through React state plus imperative `scrollLeft` writes. That design made `<thead>` trail `<tbody>` during horizontal scroll and degraded mobile momentum scrolling.

The active render path now uses one real table inside one horizontal scroll container, expanded content now participates in virtualization as its own keyed item instead of breaking the row-height model, the live hook path no longer routes every table update through one broad provider subscription, the state reducer is now decomposed into dedicated slice owners instead of one monolithic switch, and the package surface now routes export/i18n/print/internal composition consumers through explicit subpaths instead of one oversized root barrel. The primary open symptoms have shifted to the broader structural seams that remain after the hard cut:

1. **File bloat is still too high.** The bundle/package-boundary cut is landed, but `33` non-test source files still exceed `400` LOC and the remaining largest files still span unrelated responsibilities.
2. **The fuller keyboard/a11y contract is still incomplete.** Focused rows now scroll into view on the active virtualized path, but the package still lacks the complete grid contract and focus-restoration behavior expected when virtualized content unmounts and remounts.

The same audit found structural debt that will block later enforcement and performance ratchets:

- `context/reducer.ts` is now down to `117` LOC and only composes dedicated slice owners, but `context/provider.tsx` remains `661` LOC and still carries a large shared runtime shell.
- The aggregate `useDataTableContext` compatibility surface is gone from the package boundary; the active code path now reads only the narrower runtime and slice hooks.
- `34` non-test source files still exceed `400` LOC; the largest remaining runtime offenders are `use-compound-filters.ts` `943`, `data-table-inner.tsx` `938`, `export/plugins.ts` `846`, `use-cell-selection.ts` `809`, and `types/config.ts` `787`.
- The root package barrel is now down to `105` LOC and the package now exposes explicit `/components`, `/context`, `/hooks`, `/i18n`, `/export`, `/print`, and `/utils` entrypoints instead of routing all consumers through one oversized root export.
- `jspdf` and `xlsx` remain package dependencies, but the live Excel/PDF export path now loads them through dynamic imports in `src/utils/export/excel.ts` and `src/utils/export/pdf.ts` rather than the default runtime path.
- The package still carries a monolithic `data-table-inner.tsx` render path plus a large shared provider/reducer surface, so the scroll architecture cut does not yet solve broader render fan-out by itself.
- `use-edit-history.ts` stores full row snapshots with no pruning (memory grows unbounded on long edit sessions).
- Keyboard navigation now synchronizes focused rows through the virtualizer on the active path, but the fuller `Ctrl+Home`/`Ctrl+End` and focus-restoration contract expected by the package's accessibility claims is still incomplete.
- Preset + feature conflicts (for example `selection: true` + `cellSelection: true`) are not validated at dev time.
- i18n carries only `en` and `hi` with no completeness gate.
- Triplicate hook variants (`useInlineEditing`, `useInlineEditingWithHistory`, `useInlineEditingWithFeedback`) and duplicated helpers (`getNestedValue`, `safe-execute`, `safe-export`) remain in the public hook inventory.

## Impact

The highest-visibility horizontal scroll defect is now addressed on the active `DataTableInner` path, the active virtualized-row path no longer depends on absolutely positioned table rows, non-grouped expanded rows now virtualize as separate measured items, the browser-proof fixture now verifies both the unified scroll shell and variable-height expanded content in Chromium plus mobile Chrome, the active hook path now subscribes through state slices instead of one broad provider value, the reducer is decomposed into dedicated slice owners, the retired aggregate context surface is gone from the package boundary, and the root package surface no longer drags eager Excel/PDF export code into the default import path. The finding stays open because file bloat and the incomplete a11y contract still remain.

## Fix Plan

1. `P76-W1` — Scroll architecture code cut. The main `DataTableInner` path now renders one `<table>` inside one horizontal scroll container with sticky header cells in the same DOM tree, touch-scroll container CSS, and a passive custom-scrollbar listener. The active virtualized-row hook now seeds a first window before TanStack has measured, recomputes visible rows on scroll rerenders, and shares the live table scroll element through one ref callback.
2. `P76-W1b` — Playwright harness and baseline E2E proof. Landed a hidden docs regression route plus `datatable-regression.spec.ts`, verified internal Y scroll, sticky header anchoring, pinned-column stability, and custom scrollbar bounds in Chromium plus mobile Chrome, and extended that proof to variable-height expanded content plus remount behavior. This lane is now closed; the next open work is provider/render fan-out rather than baseline browser proof.
3. `P76-W2` — Render performance. Landed the first provider cut: the package now separates stable runtime callbacks, controlled-state metadata, and mutable selection/sort/filter/pagination/column/grouping slices into distinct contexts, and the live `useSelection`/`useSorting`/`useFiltering`/`usePagination`/`useColumns`/`useGrouping` path no longer fans broad rerenders by default. A focused regression test now proves pagination consumers stay stable during selection updates.
4. `P76-W3` — Reducer decomposition and aggregate-surface cleanup. Landed the reducer split under `src/context/slices/**`, reduced `context/reducer.ts` to a small combiner, rewired `DataTableInner` to the narrow runtime context, and removed the aggregate `useDataTableContext` / `useOptionalDataTableContext` boundary entirely.
5. `P76-W4` — Bundle surgery and package-surface trim. Landed. `@unisane/data-table` now publishes explicit subpath exports, the docs surface consumes those subpaths, the root barrel is trimmed to `DataTable` plus core types/helpers, and the Excel/PDF export path now uses dynamic imports with the duplicate eager vs `lazy-*` split removed.
6. `P76-W5` — File bloat cleanup. No file over `400` LOC and no hook over `300` LOC. Split the five offenders (`use-compound-filters.ts`, `export/plugins.ts`, `data-table-inner.tsx`, `use-cell-selection.ts`, `types/config.ts`) into responsibility-scoped modules.
7. `P76-W6` — Memory and correctness. Add a configurable ring buffer (default `200`) to `use-edit-history.ts`; store diffs rather than full row snapshots when row size crosses a threshold. Consolidate the three `useInlineEditing*` variants into one options-driven hook. Auto-wire `errors/recovery.ts` strategies to `ErrorHub` with default retry-with-backoff on transient errors. Deduplicate `getNestedValue`, `safe-execute`, and `safe-export` to one canonical home.
8. `P76-W7` — A11y upgrade. Add `role="grid"`, `role="row"`, `role="gridcell"`, `role="columnheader"`, `aria-rowcount`, `aria-colcount`, `aria-rowindex`, `aria-colindex`. Implement roving tabindex. Add an `aria-live="polite"` region for sort/filter/selection changes tied to i18n strings. Extend `use-keyboard-navigation.ts` with `Home`, `End`, `Ctrl+Home`, `Ctrl+End`, and viewport-sized `PageUp`/`PageDown`. Restore focus when a virtualized cell scrolls back into view.
9. `P76-W8` — Dev-time validation. Add a `validateConfig()` helper called from the provider in development to warn on preset/feature conflicts (`selection + cellSelection`, `preset: 'server'` + empty `data` + no fetcher, controlled state without `onChange`, `virtualization + offset pagination`). Strip in production builds.
10. `P76-W9` — i18n completeness gate. Add an `extractStrings` script; fail CI if any locale omits a key. Fix the `hi.ts` vs `en.ts` size asymmetry. Seed `es`, `fr`, `de` with English fallbacks marked `@todo translate`.
11. `P76-W10` — Tests and living docs. Bring hot-path files to `70%` line coverage. Add property-based tests (`fast-check` per the [Framework property-based testing guide](https://github.com/unisanetech/unisane/blob/main/docs/guides/property-based-testing.md)) for sort determinism, selection set-theory invariants, filter composition (AND/OR), and pagination math. Stand up Storybook (or equivalent) covering every preset and feature flag; document each preset in `README.md` with an explicit "use when" block.

Archive each `P76-W*` workpack after its closure checks verify cleanly once that lane is reopened. `P76-W1` through `P76-W4` are now landed on the active path; the remaining queued follow-ons are file-bloat cleanup plus the fuller a11y, i18n, and docs lanes.

## Verification

- `pnpm --filter @unisane/data-table check-types`
- `pnpm --filter @unisane/data-table test`
- `pnpm --filter @unisane/data-table build`
- `pnpm --filter @unisane/web check-types`
- `pnpm --filter @unisane/web exec playwright test --config playwright.config.ts e2e/datatable-regression.spec.ts`
- `pnpm docs:core:check`
- `pnpm program:index:check`
- `pnpm agent:instructions:check`

## Linked Docs

- `docs/findings/README.md`
- `docs/work/plans/data-table-scroll-architecture-and-perf-plan.md`
- `docs/architecture/08-ui-application-architecture.md`
- `docs/architecture/10-ui-visual-doctrine-and-token-governance.md`
- [Framework change-execution guide](https://github.com/unisanetech/unisane/blob/main/docs/guides/execute-key-changes-with-llm.md)
- [Framework command-workflow contract](https://github.com/unisanetech/unisane/blob/main/docs/guides/command-workflow-contract.md)
- `packages/data-table/src/components/layout.tsx`
- `packages/data-table/src/components/custom-scrollbar.tsx`
- `packages/data-table/src/context/reducer.ts`
- `packages/data-table/src/context/provider.tsx`
