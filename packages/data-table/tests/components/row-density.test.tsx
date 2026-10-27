import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { DataTable } from '../../src/components/data-table';
import { DENSITY_CONFIG, ROW_HEIGHT_BASE, type Density } from '../../src/constants';

describe('DataTable body density', () => {
  it.each(Object.keys(DENSITY_CONFIG) as Density[])(
    'applies the %s baseline without constraining multi-line content',
    (density) => {
      const { container, unmount } = render(
        <DataTable
          data={[{ id: 'example', name: 'Example item' }]}
          columns={[{ key: 'name', header: 'Item', render: (value) => (
            <span>{String(value)}<br />Additional detail</span>
          ) }]}
          preset="simple"
          styling={{ density }}
          enableFeedback={false}
        />,
      );
      const row = container.querySelector<HTMLTableRowElement>('tbody tr');
      expect(container.querySelector('table')?.style.borderSpacing).toBe('0');
      expect(row?.style.height).toBe(ROW_HEIGHT_BASE[density]);
      expect(row?.style.maxHeight).toBe('');
      expect(row?.style.overflow).toBe('');
      expect(row?.textContent).toContain('Additional detail');
      unmount();
    },
  );
});
