import { renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useVirtualizedRows } from '../../../hooks/features/use-virtualized-rows';

const mockUseVirtualizer = vi.fn();

vi.mock('@tanstack/react-virtual', () => ({
  useVirtualizer: (...args: unknown[]) => mockUseVirtualizer(...args),
}));

type TestRow = {
  id: string;
};

describe('useVirtualizedRows', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    mockUseVirtualizer.mockReturnValue({
      getVirtualItems: () => [],
      getTotalSize: () => 4_800,
      scrollToIndex: vi.fn(),
      measureElement: vi.fn(),
    });
  });

  it('returns an initial visible window instead of an empty body when the virtualizer has not measured yet', () => {
    const rows: TestRow[] = Array.from({ length: 120 }, (_, index) => ({ id: `row-${index + 1}` }));

    const { result } = renderHook(() =>
      useVirtualizedRows({
        data: rows,
        estimateRowHeight: 40,
        enabled: true,
        threshold: 10,
        overscan: 5,
      }),
    );

    expect(result.current.isVirtualized).toBe(true);
    expect(result.current.totalHeight).toBe(4_800);
    expect(result.current.virtualRows.length).toBeGreaterThan(0);
    expect(result.current.virtualRows.length).toBeLessThan(rows.length);
    expect(result.current.virtualRows[0]).toMatchObject({
      index: 0,
      start: 0,
      size: 40,
      key: 'row-1',
    });
  });
});
