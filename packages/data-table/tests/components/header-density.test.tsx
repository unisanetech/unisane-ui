import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { SortControl } from '../../src/components/header/sort-control';
import {
  DENSITY_CONFIG,
  DENSITY_HEADER_ACTION_FRAME_STYLES,
  DensityLevel,
} from '../../src/constants';

describe('DataTable header density contract', () => {
  it.each([
    [DensityLevel.DENSE, 'h-7', 28],
    [DensityLevel.COMPACT, 'h-8', 32],
    [DensityLevel.STANDARD, 'h-8', 32],
    [DensityLevel.COMFORTABLE, 'h-9', 36],
  ] as const)('keeps the %s action frame inside its row', (density, heightClass, pixels) => {
    const { unmount } = render(
      <SortControl
        isSorted={false}
        sortDirection="asc"
        variant="action"
        density={density}
        ariaLabel={`Sort ${density}`}
      />,
    );

    expect(screen.getByRole('button', { name: `Sort ${density}` })).toHaveClass(heightClass);
    expect(DENSITY_HEADER_ACTION_FRAME_STYLES[density]).toContain(heightClass);
    expect(pixels).toBeLessThanOrEqual(DENSITY_CONFIG[density].rowHeight);
    unmount();
  });
});
