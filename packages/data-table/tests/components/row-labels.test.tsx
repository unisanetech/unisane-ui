import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { DataTable } from '../../src/components/data-table';

const row = { id: 'opaque-001', name: 'Jaya Café', code: 'INV-1042' };
const columns = [{ key: 'name' as const, header: 'Customer' }];
describe('human-readable row controls', () => {
  it('names selection and expansion without changing stable row identity', () => {
    const view = (suffix: string) => (
      <DataTable
        data={[row]}
        columns={columns}
        features={{ selection: true }}
        pagination={{ mode: 'none' }}
        enableFeedback={false}
        getRowLabel={(item) => `${item.name} · ${item.code}${suffix}`}
        renderExpandedRow={(item) => <p>{item.code} details</p>}
      />
    );
    const { rerender } = render(view(''));
    expect(screen.getByRole('checkbox', { name: /Jaya Café · INV-1042/ })).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: /Expand.*Jaya Café · INV-1042/i }));
    expect(screen.getByText('INV-1042 details')).toBeVisible();
    expect(
      screen.getByRole('button', { name: /Collapse.*Jaya Café · INV-1042/i }),
    ).toBeInTheDocument();
    rerender(view(' updated'));
    expect(
      screen.getByRole('checkbox', { name: /Jaya Café · INV-1042 updated/ }),
    ).toBeInTheDocument();
  });
});
