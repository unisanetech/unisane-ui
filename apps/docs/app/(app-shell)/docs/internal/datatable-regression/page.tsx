'use client';

import { DataTable, type Column } from '@unisane/data-table';
import { Surface, Typography } from '@unisane/ui';

type RegressionRow = {
  id: string;
  sku: string;
  productName: string;
  category: string;
  supplier: string;
  warehouse: string;
  region: string;
  unitsSold: number;
  stockLevel: number;
  unitPrice: number;
  status: 'Active' | 'Pending' | 'Review' | 'Archived';
  updatedAt: string;
};

const STATUS_SEQUENCE: RegressionRow['status'][] = ['Active', 'Pending', 'Review', 'Archived'];
const CATEGORY_SEQUENCE = ['Beverages', 'Electronics', 'Household', 'Sports', 'Stationery'];
const SUPPLIER_SEQUENCE = [
  'Global Supplies Co.',
  'Northwind Imports',
  'Metro Wholesale',
  'Prime Distribution',
];
const WAREHOUSE_SEQUENCE = ['Warehouse A', 'Warehouse B', 'Warehouse C', 'Overflow Hub'];
const REGION_SEQUENCE = ['North', 'South', 'East', 'West'];

const FIXTURE_ROWS: RegressionRow[] = Array.from({ length: 640 }, (_, index) => {
  const rowNumber = index + 1;

  return {
    id: `row-${rowNumber}`,
    sku: `SKU-${String(rowNumber).padStart(4, '0')}`,
    productName: `Fixture Product ${rowNumber}`,
    category: CATEGORY_SEQUENCE[index % CATEGORY_SEQUENCE.length] ?? 'Beverages',
    supplier: SUPPLIER_SEQUENCE[index % SUPPLIER_SEQUENCE.length] ?? 'Global Supplies Co.',
    warehouse: WAREHOUSE_SEQUENCE[index % WAREHOUSE_SEQUENCE.length] ?? 'Warehouse A',
    region: REGION_SEQUENCE[index % REGION_SEQUENCE.length] ?? 'North',
    unitsSold: 1200 + ((index * 37) % 6400),
    stockLevel: 80 + ((index * 17) % 900),
    unitPrice: 19.5 + ((index * 13) % 275),
    status: STATUS_SEQUENCE[index % STATUS_SEQUENCE.length] ?? 'Active',
    updatedAt: `2026-04-${String((index % 28) + 1).padStart(2, '0')}`,
  };
});

const FIXTURE_COLUMNS: Column<RegressionRow>[] = [
  { key: 'sku', header: 'SKU', width: 160, pinned: 'left' },
  { key: 'productName', header: 'Product', width: 220, pinned: 'left' },
  { key: 'category', header: 'Category', width: 180 },
  { key: 'supplier', header: 'Supplier', width: 220 },
  { key: 'warehouse', header: 'Warehouse', width: 180 },
  { key: 'region', header: 'Region', width: 160 },
  {
    key: 'unitsSold',
    header: 'Units Sold',
    width: 150,
    align: 'end',
    render: (row) => row.unitsSold.toLocaleString('en-US'),
  },
  {
    key: 'stockLevel',
    header: 'Stock Level',
    width: 150,
    align: 'end',
    render: (row) => row.stockLevel.toLocaleString('en-US'),
  },
  {
    key: 'unitPrice',
    header: 'Unit Price',
    width: 160,
    align: 'end',
    render: (row) => row.unitPrice.toLocaleString('en-US', { style: 'currency', currency: 'USD' }),
  },
  { key: 'status', header: 'Status', width: 150, pinned: 'right' },
  { key: 'updatedAt', header: 'Updated', width: 160, pinned: 'right' },
];

export default function DataTableRegressionPage() {
  return (
    <div className="mx-auto flex w-full max-w-[1680px] flex-col gap-6 px-6 py-10 lg:px-10">
      <div className="space-y-2">
        <Typography variant="headlineMedium" component="h1" className="text-on-surface">
          Data Table Regression Fixtures
        </Typography>
        <Typography variant="bodyLarge" component="p" className="max-w-4xl text-on-surface-variant">
          Hidden browser-proof surface for sticky header, pinned columns, virtualization, and the
          custom horizontal scrollbar. Keep this route deterministic so Playwright can verify the
          active unified table shell instead of the public demo page.
        </Typography>
      </div>

      <Surface
        tone="surfaceContainerLow"
        rounded="xl"
        className="border border-outline-subtle p-5"
      >
        <div className="mb-4 flex flex-wrap items-center gap-4 text-on-surface-variant">
          <Typography variant="titleMedium" component="h2" className="text-on-surface">
            Virtualized Inventory Fixture
          </Typography>
          <Typography variant="bodySmall" data-testid="datatable-regression-row-count">
            640 rows
          </Typography>
          <Typography variant="bodySmall">Pinned: SKU, Product, Status, Updated</Typography>
        </div>

        <div
          data-testid="datatable-regression-fixture"
          className="h-[680px] min-h-0 overflow-hidden rounded-xl border border-outline-subtle bg-surface"
        >
          <DataTable
            data={FIXTURE_ROWS}
            columns={FIXTURE_COLUMNS}
            title="Virtualized inventory dataset"
            className="h-full min-h-0"
            preset="interactive"
            pagination={{ mode: 'none' }}
            virtualization={{ rows: true, rowThreshold: 10, overscan: 8 }}
            features={{ selection: true, search: false, columnPinning: true }}
            styling={{ variant: 'grid', density: 'compact', stickyHeader: true, stickyOffset: 0 }}
          />
        </div>
      </Surface>

      <Surface
        tone="surfaceContainerLow"
        rounded="xl"
        className="border border-outline-subtle p-5"
      >
        <div className="mb-4 flex flex-wrap items-center gap-4 text-on-surface-variant">
          <Typography variant="titleMedium" component="h2" className="text-on-surface">
            Expanded Row Virtualization Fixture
          </Typography>
          <Typography variant="bodySmall">Variable-height expansion content</Typography>
          <Typography variant="bodySmall">Verifies measured virtual items remount cleanly</Typography>
        </div>

        <div
          data-testid="datatable-regression-expanded-fixture"
          className="h-[680px] min-h-0 overflow-hidden rounded-xl border border-outline-subtle bg-surface"
        >
          <DataTable
            data={FIXTURE_ROWS}
            columns={FIXTURE_COLUMNS}
            title="Expanded virtualization dataset"
            className="h-full min-h-0"
            preset="interactive"
            pagination={{ mode: 'none' }}
            virtualization={{ rows: true, rowThreshold: 10, overscan: 8 }}
            features={{ selection: true, search: false, columnPinning: true }}
            styling={{ variant: 'grid', density: 'compact', stickyHeader: true, stickyOffset: 0 }}
            renderExpandedRow={(row) => (
              <div
                data-testid={`datatable-regression-expanded-panel-${row.id}`}
                className="grid gap-3 lg:grid-cols-2"
              >
                <div className="space-y-2">
                  <Typography variant="titleSmall" component="h3" className="text-on-surface">
                    {row.productName}
                  </Typography>
                  <Typography variant="bodySmall" component="p" className="text-on-surface-variant">
                    Supplier {row.supplier} ships this SKU through {row.warehouse} for the {row.region}{' '}
                    region. This block intentionally wraps across multiple lines so virtualization has
                    to measure a taller expanded item instead of assuming a fixed row height.
                  </Typography>
                </div>
                <div className="space-y-2">
                  <Typography variant="bodySmall" component="p" className="text-on-surface-variant">
                    Stock: {row.stockLevel.toLocaleString('en-US')} units
                  </Typography>
                  <Typography variant="bodySmall" component="p" className="text-on-surface-variant">
                    Units sold: {row.unitsSold.toLocaleString('en-US')}
                  </Typography>
                  <Typography variant="bodySmall" component="p" className="text-on-surface-variant">
                    Unit price:{' '}
                    {row.unitPrice.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
                  </Typography>
                </div>
              </div>
            )}
          />
        </div>
      </Surface>
    </div>
  );
}
