import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { Button } from '@unisane/ui/button';
import { DataTable } from '../../src/components/data-table';
import { Table, TableBody, TableCell, TableRow } from '../../src/components/table';

describe('table row interaction boundary', () => {
  it('keeps nested control hover groups local while selection and expansion remain independent', () => {
    const collect = vi.fn();
    const { container } = render(
      <DataTable
        data={[{ id: 'buyer', name: 'Example buyer' }]}
        columns={[
          { key: 'name', header: 'Buyer' },
          { key: 'action', header: 'Action', render: () => <Button variant="text" onClick={collect}>Collect</Button> },
        ]}
        features={{ selection: true }}
        pagination={{ mode: 'none' }}
        getRowLabel={(row) => row.name}
        renderExpandedRow={() => <p>Source details</p>}
        enableFeedback={false}
      />,
    );
    const control = screen.getByRole('button', { name: 'Collect' });
    // Unisane action layers use their control's hover group; a row ancestor
    // must never activate that same group from a different cell.
    expect(control.parentElement?.closest('.group, [class~="group/row"]')).toBeNull();
    fireEvent.mouseEnter(container.querySelector('tbody tr')!);
    expect(collect).not.toHaveBeenCalled();
    fireEvent.click(control);
    expect(collect).toHaveBeenCalledTimes(1);
    fireEvent.click(screen.getByRole('checkbox', { name: /Select row Example buyer/ }));
    expect(container.querySelector('tbody tr')).toHaveAttribute('aria-selected', 'true');
    expect(collect).toHaveBeenCalledTimes(1);
    fireEvent.click(screen.getByRole('button', { name: /Expand.*Example buyer/ }));
    expect(screen.getByText('Source details')).toBeVisible();
    expect(collect).toHaveBeenCalledTimes(1);
  });

  it.each([false, true])('keeps primitive table rows independent with selected=%s', (selected) => {
    render(<Table><TableBody><TableRow selected={selected}><TableCell><Button>Inspect</Button></TableCell></TableRow></TableBody></Table>);
    const control = screen.getByRole('button', { name: 'Inspect' });
    expect(control.parentElement?.closest('.group, [class~="group/row"]')).toBeNull();
    expect(control.closest('tr')).toHaveAttribute('aria-selected', String(selected));
  });
});
