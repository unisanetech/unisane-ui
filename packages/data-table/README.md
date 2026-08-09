# @unisane/data-table

A typed React 19 DataTable with virtualization, grouped configuration, remote-data
support, editing, selection, export, accessibility, and package-owned runtime styles.

## Installation

The package is not yet publicly released. After release approval, consumers install:

```bash
pnpm add @unisane/data-table @unisane/ui react react-dom
```

Import package styles once at the application boundary:

```css
@import '@unisane/ui/styles.css';
@import '@unisane/data-table/styles.css';
```

## Quick start

```tsx
import { DataTable, defineColumns } from '@unisane/data-table';

type User = {
  id: string;
  name: string;
  email: string;
};

const columns = defineColumns<User>([
  { key: 'name', header: 'Name' },
  { key: 'email', header: 'Email' },
]);

export function UsersTable({ users }: { users: User[] }) {
  return (
    <DataTable
      data={users}
      columns={columns}
      preset="interactive"
      features={{ selection: true, search: true }}
      pagination={{ mode: 'offset', pageSize: 25 }}
    />
  );
}
```

Rows require one stable string `id`. Keep `data` and `columns` references stable for
large tables.

## Configuration

Use one grouped configuration path:

- `features` enables selection, search, export, grouping, and other capabilities.
- `layout` owns scroll and sticky behavior.
- `virtualization` owns row and column virtualization.
- `pagination` owns offset, cursor, or unpaginated modes.
- `editing` owns inline-edit behavior and validation.
- `styling` owns density, variant, and presentation.
- `controlled` supplies externally owned table state.
- `callbacks` receives state and interaction changes.

Presets (`simple`, `interactive`, `editable`, `spreadsheet`, `server`, and `dashboard`)
provide defaults; explicit grouped configuration overrides them.

```tsx
<DataTable
  data={users}
  columns={columns}
  preset="server"
  controlled={{ searchValue, filters, sortState }}
  callbacks={{
    onSearchChange: setSearchValue,
    onFilterChange: setFilters,
    onSortChange: setSortState,
  }}
  pagination={{ mode: 'cursor', cursor }}
/>
```

## Bulk actions

```tsx
import { DataTable, defineBulkActions } from '@unisane/data-table';

const bulkActions = defineBulkActions([
  {
    label: 'Archive',
    icon: 'archive',
    onClick: async (ids) => archiveUsers(ids),
  },
]);

<DataTable data={users} columns={columns} bulkActions={bulkActions} />;
```

## Public imports

Use only declared package exports. Do not import `src/**`, workspace paths, or
`@unisane/ui` internals. The package peers on public `@unisane/ui/*` subpaths and owns its
own tests, build, CSS, and release boundary.

## Maintainer checks

```bash
pnpm --filter @unisane/data-table lint
pnpm --filter @unisane/data-table check-types
pnpm --filter @unisane/data-table test
pnpm --filter @unisane/data-table build
```

Public licensing is not yet approved. The package remains private and unlicensed until
the repository's legal gate is resolved.
