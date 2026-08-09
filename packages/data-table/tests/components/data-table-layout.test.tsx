import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { DataTable } from '../../src/components/data-table';
import type { Column } from '../../src/types';

type Row = { id: string; name: string };

const rows: Row[] = [
  { id: '1', name: 'Alpha' },
  { id: '2', name: 'Beta' },
];
const columns: Column<Row>[] = [{ key: 'name', header: 'Name' }];

describe('DataTable layout contract', () => {
  it('defaults to page-owned vertical scrolling without containing wheel overscroll', () => {
    const { container } = render(
      <DataTable
        data={rows}
        columns={columns}
        features={{ search: false, selection: false }}
        pagination={{ mode: 'none' }}
        enableFeedback={false}
      />,
    );

    const root = container.querySelector("[role='region']");
    const scrollContainer = container.querySelector("[data-datatable-scroll='body']");
    const header = container.querySelector('thead');
    const stickyOverlay = document.body.querySelector(
      "[data-datatable-page-sticky-overlay='true']",
    );

    expect(root).toHaveAttribute('data-vertical-scroll-owner', 'page');
    expect(scrollContainer).toHaveAttribute('data-vertical-scroll-owner', 'page');
    expect(scrollContainer).toHaveStyle({ overscrollBehaviorY: 'auto' });
    expect(header).toHaveAttribute('data-page-sticky', 'true');
    expect(header?.querySelector('tr')).toHaveStyle({ height: '48px' });
    expect((header as HTMLElement).style.transform).toBe('');
    expect(stickyOverlay).toHaveAttribute('hidden');
    expect(stickyOverlay).toHaveAttribute('aria-hidden', 'true');
    const stickyOverlayStyles = document.body.querySelector(
      "[data-datatable-page-sticky-scrollbar-style='true']",
    );
    expect(stickyOverlayStyles).toHaveTextContent('scrollbar-width: none');
    expect(stickyOverlayStyles).toHaveTextContent('-ms-overflow-style: none');
    expect(stickyOverlayStyles).toHaveTextContent('::-webkit-scrollbar');
  });

  it('uses contained scrolling and native sticky positioning when the table owns the viewport', () => {
    const { container } = render(
      <DataTable
        data={rows}
        columns={columns}
        layout={{ verticalScroll: 'table', stickyHeader: true, stickyOffset: 12 }}
        features={{ search: false, selection: false }}
        pagination={{ mode: 'none' }}
        enableFeedback={false}
      />,
    );

    const scrollContainer = container.querySelector("[data-datatable-scroll='body']");
    const header = container.querySelector('thead');

    expect(scrollContainer).toHaveAttribute('data-vertical-scroll-owner', 'table');
    expect(scrollContainer).toHaveStyle({ overscrollBehaviorY: 'contain' });
    expect(header).toHaveClass('sticky');
    expect(header).toHaveStyle({ top: '12px' });
    expect(header).not.toHaveAttribute('data-page-sticky');
  });
});
