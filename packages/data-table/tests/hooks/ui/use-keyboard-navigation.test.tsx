import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { useKeyboardNavigation } from '../../../src/hooks/ui/use-keyboard-navigation';

function Fixture({ activate = vi.fn(), select = vi.fn() }) {
  const navigation = useKeyboardNavigation({ rowCount: 3, onActivate: activate, onSelect: select });
  return (
    <div {...navigation.getContainerProps()} aria-label="Records">
      <output aria-label="Focused row">{navigation.focusedIndex ?? 'none'}</output>
      <button type="button"><span>Review record</span></button>
      <a href="/record">Open record</a>
      <input aria-label="Search" />
      <textarea aria-label="Notes" />
      <select aria-label="Status"><option>All</option></select>
      <div contentEditable suppressContentEditableWarning aria-label="Editable note"><span>Note text</span></div>
      <div role="combobox" aria-expanded="false" tabIndex={0} aria-label="Choose party" />
      <div role="slider" tabIndex={0} aria-label="Quantity" aria-valuemin={0} aria-valuemax={10} aria-valuenow={1} />
      <div onKeyDown={event => event.preventDefault()}><span>Handled cell</span></div>
      <span>Ordinary cell</span>
    </div>
  );
}

describe('DataTable keyboard event ownership', () => {
  it.each(['Enter', ' ', 'ArrowDown', 'ArrowUp', 'Home', 'End', 'PageDown', 'PageUp', 'Escape'])(
    'preserves %s on descendant controls without changing the active row', key => {
      const activate = vi.fn(), select = vi.fn();
      render(<Fixture activate={activate} select={select} />);
      fireEvent.keyDown(screen.getByRole('grid'), { key: 'ArrowDown' });
      const controls = [
        screen.getByText('Review record'), screen.getByRole('link', { name: 'Open record' }),
        screen.getByRole('textbox', { name: 'Search' }), screen.getByRole('textbox', { name: 'Notes' }),
        screen.getByRole('combobox', { name: 'Status' }), screen.getByText('Note text'),
        screen.getByRole('combobox', { name: 'Choose party' }), screen.getByRole('slider', { name: 'Quantity' }),
      ];
      for (const control of controls) expect(fireEvent.keyDown(control, { key })).toBe(true);
      expect(screen.getByLabelText('Focused row')).toHaveTextContent('0');
      expect(activate).not.toHaveBeenCalled();
      expect(select).not.toHaveBeenCalled();
    },
  );

  it('retains row activation and selection when the table owns focus', () => {
    const activate = vi.fn(), select = vi.fn();
    render(<Fixture activate={activate} select={select} />);
    const table = screen.getByRole('grid');
    expect(fireEvent.keyDown(table, { key: 'ArrowDown' })).toBe(false);
    fireEvent.keyDown(table, { key: 'End' });
    fireEvent.keyDown(table, { key: 'Enter' });
    expect(activate).toHaveBeenCalledWith(2, expect.anything());
    fireEvent.keyDown(table, { key: ' ' });
    expect(select).toHaveBeenCalledWith(2);
    fireEvent.keyDown(table, { key: 'Home' });
    expect(screen.getByLabelText('Focused row')).toHaveTextContent('0');
    fireEvent.keyDown(table, { key: 'Escape' });
    expect(screen.getByLabelText('Focused row')).toHaveTextContent('none');
  });

  it('does not reinterpret an event already handled by a cell', () => {
    const activate = vi.fn();
    render(<Fixture activate={activate} />);
    fireEvent.keyDown(screen.getByRole('grid'), { key: 'ArrowDown' });
    fireEvent.keyDown(screen.getByText('Handled cell'), { key: 'Enter' });
    expect(activate).not.toHaveBeenCalled();
    fireEvent.keyDown(screen.getByText('Ordinary cell'), { key: 'ArrowDown' });
    expect(screen.getByLabelText('Focused row')).toHaveTextContent('1');
  });
});
