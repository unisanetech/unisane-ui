import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import {
  DataTableExpandedContent,
  DataTableExpandedField,
  DataTableExpandedFields,
  DataTableExpandedGrid,
  DataTableExpandedSection,
} from '../../components/expanded-row-content';

describe('expanded row content primitives', () => {
  it('composes a responsive header with badges and actions', () => {
    render(
      <DataTableExpandedContent
        title="Order 1042"
        description="Placed by Priya Shah"
        metadata={<span>Paid</span>}
        actions={<button type="button">Refund</button>}
      >
        <span>Order details</span>
      </DataTableExpandedContent>,
    );

    expect(screen.getByRole('heading', { name: 'Order 1042', level: 3 })).toBeVisible();
    expect(screen.getByText('Paid')).toBeVisible();
    expect(screen.getByRole('button', { name: 'Refund' })).toBeVisible();
    expect(screen.getByText('Order details')).toBeVisible();
  });

  it('provides responsive grids and semantic definition fields', () => {
    const { container } = render(
      <DataTableExpandedGrid columns={3} data-testid="content-grid">
        <DataTableExpandedSection title="Customer">
          <DataTableExpandedFields columns={2}>
            <DataTableExpandedField label="Email" value="priya@example.com" />
            <DataTableExpandedField label="Segment" value="Enterprise" />
          </DataTableExpandedFields>
        </DataTableExpandedSection>
      </DataTableExpandedGrid>,
    );

    expect(screen.getByTestId('content-grid')).toHaveClass('@2xl:grid-cols-3');
    expect(container.querySelector('dl')).toBeInTheDocument();
    expect(container.querySelector('dt')).toHaveTextContent('Email');
    expect(container.querySelector('dd')).toHaveTextContent('priya@example.com');
  });
});
