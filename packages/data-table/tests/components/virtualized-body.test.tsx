import { describe, expect, it } from 'vitest';
import { render } from '@testing-library/react';
import { VirtualizedBody } from '../../src/components/virtualized-body';
import type { Column, ColumnMetaMap } from '../../src/types';

type TestRow = {
  id: string;
  name: string;
};

const columns: Column<TestRow>[] = [{ key: 'name', header: 'Name' }];
const columnMeta: ColumnMetaMap = {};

describe('VirtualizedBody', () => {
  it('renders spacer rows around visible rows instead of absolutely positioned table rows', () => {
    const rows: TestRow[] = [
      { id: 'row-4', name: 'Row 4' },
      { id: 'row-5', name: 'Row 5' },
    ];

    const { container } = render(
      <table>
        <VirtualizedBody
          isLoading={false}
          isEmpty={false}
          totalHeight={400}
          virtualRows={[
            {
              index: 3,
              start: 120,
              size: 40,
              key: rows[0].id,
              data: {
                id: rows[0].id,
                kind: 'row',
                row: rows[0],
                rowIndex: 3,
              },
            },
            {
              index: 4,
              start: 160,
              size: 40,
              key: rows[1].id,
              data: {
                id: rows[1].id,
                kind: 'row',
                row: rows[1],
                rowIndex: 4,
              },
            },
          ]}
          columns={columns}
          columnMeta={columnMeta}
          getEffectivePinPosition={() => 'none'}
          selectedRows={new Set()}
          expandedRows={new Set()}
          focusedIndex={null}
          selectable={false}
          showColumnBorders={false}
          zebra={false}
          enableExpansion={false}
          onSelect={() => {}}
          onToggleExpand={() => {}}
          getRowStyle={() => ({
            position: 'absolute',
            transform: 'translateY(120px)',
          })}
        />
      </table>,
    );

    const spacerRows = container.querySelectorAll('tbody tr[aria-hidden="true"]');
    expect(spacerRows).toHaveLength(2);
    expect(spacerRows[0]?.querySelector('td')?.style.height).toBe('120px');
    expect(spacerRows[1]?.querySelector('td')?.style.height).toBe('200px');

    const renderedRow = container.querySelector<HTMLTableRowElement>('#data-table-row-row-4');
    expect(renderedRow).not.toBeNull();
    expect(renderedRow?.style.position).toBe('');
    expect(renderedRow?.style.transform).toBe('');
  });

  it('renders expanded content as its own virtualized table row', () => {
    const row: TestRow = { id: 'row-1', name: 'Row 1' };

    const { container, getByText } = render(
      <table>
        <VirtualizedBody
          isLoading={false}
          isEmpty={false}
          totalHeight={240}
          virtualRows={[
            {
              index: 0,
              start: 0,
              size: 40,
              key: row.id,
              data: {
                id: row.id,
                kind: 'row',
                row,
                rowIndex: 0,
              },
            },
            {
              index: 1,
              start: 40,
              size: 120,
              key: `${row.id}__expanded`,
              data: {
                id: `${row.id}__expanded`,
                kind: 'expanded',
                row,
                rowIndex: 0,
              },
            },
          ]}
          columns={columns}
          columnMeta={columnMeta}
          getEffectivePinPosition={() => 'none'}
          selectedRows={new Set()}
          expandedRows={new Set([row.id])}
          focusedIndex={null}
          selectable={false}
          showColumnBorders={false}
          zebra={false}
          enableExpansion={true}
          renderExpandedRow={(expandedRow) => <div>Expanded {expandedRow.name}</div>}
          onSelect={() => {}}
          onToggleExpand={() => {}}
        />
      </table>,
    );

    expect(getByText('Expanded Row 1')).toBeTruthy();

    const dataRows = container.querySelectorAll('tbody tr[data-index]');
    expect(dataRows).toHaveLength(2);
    expect(dataRows[1]?.getAttribute('data-index')).toBe('1');
  });
});
