import { act, fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { DataTable } from '../../src/components/data-table';

describe('DataTable cell overflow', () => {
  it('keeps long linked values contained on hover and focus with the full value available', () => {
    const reference = 'SO-ord_01M4K62VPAHKD0X9FC7QYDNFZM';
    render(
      <DataTable
        data={[{ id: 'order', reference, customer: 'Jaya Stores' }]}
        columns={[
          { key: 'reference', header: 'Order', width: 170,
            render: (row) => <a href={`/orders/${row.id}`}>{row.reference}</a> },
          { key: 'customer', header: 'Customer' },
        ]}
        preset="simple"
        enableFeedback={false}
      />,
    );
    const link = screen.getByRole('link', { name: reference });
    const cell = link.closest('td')!;
    fireEvent.mouseEnter(cell.closest('tr')!);
    act(() => link.focus());
    expect(link).toHaveFocus();
    expect(cell).toHaveClass('overflow-hidden', 'text-ellipsis');
    expect(cell.className).not.toMatch(/(?:hover|focus)[^ ]*:overflow-visible/);
    expect(cell).toHaveAttribute('title', reference);
    expect(screen.getByRole('cell', { name: 'Jaya Stores' })).toHaveClass('overflow-hidden');
  });
});
