import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import { DataTable } from '../../src/components/data-table';

afterEach(cleanup);

describe('DataTable externally paginated announcements', () => {
  it('announces displayed rows without claiming they are the remote total', () => {
    render(
      <DataTable
        data={[{ id: 'one', name: 'First' }, { id: 'two', name: 'Second' }]}
        columns={[{ key: 'name', header: 'Name' }]}
        preset="simple"
        pagination={{ mode: 'none' }}
        enableFeedback={false}
      />,
    );
    expect(screen.getByRole('status').textContent).toBe('2 items');
  });
});
