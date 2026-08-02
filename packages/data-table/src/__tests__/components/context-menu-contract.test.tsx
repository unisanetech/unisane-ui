import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { useState } from 'react';
import { describe, expect, it, vi } from 'vitest';
import {
  DataTableContextMenu,
  type DataTableContextMenuState,
} from '../../components/context-menu';
import type { DataTableContextMenuContext } from '../../types';

type Row = { id: string; name: string };

const context: DataTableContextMenuContext<Row> = {
  target: 'row',
  position: { x: 16, y: 16 },
  row: { id: '1', name: 'Alpha' },
  rowIndex: 0,
  selectedRowIds: [],
  selectedCells: [],
  activeCell: null,
};

function ContextMenuFixture({ onDelete }: { onDelete: () => void }) {
  const [open, setOpen] = useState(false);
  const state: DataTableContextMenuState<Row> = {
    open,
    context: open ? context : null,
    actions: [
      { key: 'open', label: 'Open', onSelect: vi.fn() },
      { key: 'delete', label: 'Delete', tone: 'danger', onSelect: onDelete },
    ],
  };

  return (
    <>
      <button type="button" onClick={() => setOpen(true)}>
        Show actions
      </button>
      <DataTableContextMenu state={state} onClose={() => setOpen(false)} />
    </>
  );
}

describe('DataTable context menu contract', () => {
  it('owns focus, supports roving keys, exposes danger tone, and restores focus', async () => {
    const onDelete = vi.fn();
    render(<ContextMenuFixture onDelete={onDelete} />);

    const trigger = screen.getByRole('button', { name: 'Show actions' });
    trigger.focus();
    fireEvent.click(trigger);

    const openAction = await screen.findByRole('menuitem', { name: 'Open' });
    const deleteAction = screen.getByRole('menuitem', { name: 'Delete' });
    await waitFor(() => expect(openAction).toHaveFocus());
    expect(deleteAction).toHaveClass('text-error');

    fireEvent.keyDown(openAction, { key: 'ArrowDown' });
    expect(deleteAction).toHaveFocus();

    fireEvent.keyDown(deleteAction, { key: 'Home' });
    expect(openAction).toHaveFocus();

    fireEvent.keyDown(openAction, { key: 'Escape' });
    await waitFor(() => expect(screen.queryByRole('menu')).not.toBeInTheDocument());
    expect(trigger).toHaveFocus();
  });
});
