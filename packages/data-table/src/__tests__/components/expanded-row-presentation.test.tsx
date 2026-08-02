import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import type { Column } from '../../types';
import { DataTableExpandedRow } from '../../components/row';

interface TestRow {
  id: string;
  name: string;
}

const row: TestRow = { id: 'row-1', name: 'Example' };
const columns: Column<TestRow>[] = [{ key: 'name', header: 'Name' }];

function renderExpandedRow(presentation?: 'detail' | 'panel' | 'bare') {
  return render(
    <table>
      <tbody>
        <DataTableExpandedRow
          row={row}
          columns={columns}
          selectable={false}
          showColumnBorders={false}
          enableExpansion={true}
          density="compact"
          renderExpandedRow={(item) => <span>{item.name} details</span>}
          expandedRow={presentation ? { presentation } : undefined}
        />
      </tbody>
    </table>,
  );
}

describe('DataTableExpandedRow presentation', () => {
  it('uses a neutral padded detail region by default without a primary left rail', () => {
    const { container, getByText } = renderExpandedRow();

    const presentation = container.querySelector('[data-expanded-row-presentation="detail"]');
    expect(presentation).toBeTruthy();
    expect(presentation?.className).toContain('px-4');
    expect(presentation?.className).not.toContain('border-l-4');
    expect(getByText('Example details')).toBeTruthy();
  });

  it('provides an inset panel for independently grouped content', () => {
    const { container } = renderExpandedRow('panel');

    const presentation = container.querySelector('[data-expanded-row-presentation="panel"]');
    expect(presentation?.className).toContain('p-3');
    expect(presentation?.firstElementChild?.className).toContain('border');
  });

  it('allows content that owns its surface to render without wrapper spacing', () => {
    const { container } = renderExpandedRow('bare');

    const presentation = container.querySelector('[data-expanded-row-presentation="bare"]');
    expect(presentation?.className).toBe('bg-surface');
    expect(presentation?.firstElementChild?.textContent).toBe('Example details');
  });
});
