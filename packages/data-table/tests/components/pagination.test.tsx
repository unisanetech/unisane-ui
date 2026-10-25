import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { DataTable } from '../../src/components/data-table';
import { getPresetConfig, type Column } from '../../src/types';

type Row = { id: string; name: string };

const columns: Column<Row>[] = [
  { key: 'name', header: 'Name', sortable: false, filterable: false },
];

const rows: Row[] = [
  { id: '126', name: 'Current page row' },
  { id: '127', name: 'Second current page row' },
];

describe('DataTable pagination', () => {
  it('renders numbered remote offset pagination and emits controlled page changes', () => {
    const onPaginationChange = vi.fn();

    render(
      <DataTable
        data={rows}
        columns={columns}
        preset="simple"
        pagination={{ mode: 'offset', remote: true, pageSize: 25 }}
        controlled={{ pagination: { page: 6, pageSize: 25 } }}
        callbacks={{ onPaginationChange }}
        totalCount={286}
        enableFeedback={false}
      />,
    );

    expect(screen.getByText('126-150 of 286')).toBeInTheDocument();
    expect(screen.getByText('Current page row')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Page 6 of 12' })).toHaveAttribute(
      'aria-current',
      'page',
    );

    fireEvent.click(screen.getByRole('button', { name: 'Page 7 of 12' }));
    expect(onPaginationChange).toHaveBeenCalledWith(7, 25);
  });

  it('resets to the first page when the controlled page size changes', () => {
    const onPaginationChange = vi.fn();

    render(
      <DataTable
        data={rows}
        columns={columns}
        preset="simple"
        pagination={{
          mode: 'offset',
          remote: true,
          pageSize: 25,
          pageSizeOptions: [25, 50, 100],
        }}
        controlled={{ pagination: { page: 6, pageSize: 25 } }}
        callbacks={{ onPaginationChange }}
        totalCount={286}
        enableFeedback={false}
      />,
    );

    fireEvent.change(screen.getByRole('combobox', { name: 'Rows per page:' }), {
      target: { value: '50' },
    });
    expect(onPaginationChange).toHaveBeenCalledWith(1, 50);
  });

  it('clamps an out-of-range controlled page through the pagination callback', async () => {
    const onPaginationChange = vi.fn();

    render(
      <DataTable
        data={rows}
        columns={columns}
        preset="simple"
        pagination={{ mode: 'offset', remote: true, pageSize: 25 }}
        controlled={{ pagination: { page: 9, pageSize: 25 } }}
        callbacks={{ onPaginationChange }}
        totalCount={30}
        enableFeedback={false}
      />,
    );

    await waitFor(() => expect(onPaginationChange).toHaveBeenCalledWith(2, 25));
  });

  it('does not present the current cursor page as the complete result total', () => {
    render(
      <DataTable
        data={rows}
        columns={columns}
        preset="simple"
        pagination={{
          mode: 'cursor',
          cursor: {
            pageIndex: 6,
            limit: 25,
            prevCursor: 'previous',
            nextCursor: 'next',
            onPrev: vi.fn(),
            onNext: vi.fn(),
            onLimitChange: vi.fn(),
          },
          showPageSizeSelector: false,
        }}
        enableFeedback={false}
      />,
    );

    expect(screen.getAllByText('126–127')).toHaveLength(2);
    expect(screen.getAllByText('6')).toHaveLength(2);
    expect(screen.queryByText('126-127 of 2')).not.toBeInTheDocument();
  });

  it('keeps column customization off in read-only presets', () => {
    expect(getPresetConfig('simple').features.columnVisibility).toBe(false);
    expect(getPresetConfig('simple').features.columnResize).toBe(false);
    expect(getPresetConfig('simple').features.columnReorder).toBe(false);
    expect(getPresetConfig('simple').features.columnPinning).toBe(false);

    expect(getPresetConfig('dashboard').features.columnVisibility).toBe(false);
    expect(getPresetConfig('dashboard').features.columnResize).toBe(false);
    expect(getPresetConfig('dashboard').features.columnReorder).toBe(false);
    expect(getPresetConfig('dashboard').features.columnPinning).toBe(false);
  });
});
