import { describe, expect, it } from 'vitest';
import { createInitialState, dataTableReducer } from '../../src/context/reducer';

describe('dataTableReducer', () => {
  it('seeds the initial state from slice creators', () => {
    const state = createInitialState({ pageSize: 50 });

    expect(state.selectedRows.size).toBe(0);
    expect(state.sortState).toEqual([]);
    expect(state.searchText).toBe('');
    expect(state.pagination).toEqual({ page: 1, pageSize: 50 });
    expect(state.hiddenColumns.size).toBe(0);
    expect(state.groupBy).toBeNull();
  });

  it('resets pagination when filtering changes', () => {
    const baseState = {
      ...createInitialState({ pageSize: 25 }),
      pagination: { page: 4, pageSize: 25 },
    };

    const nextState = dataTableReducer(baseState, {
      type: 'SET_FILTER',
      key: 'status',
      value: 'active',
    });

    expect(nextState.columnFilters).toEqual({ status: 'active' });
    expect(nextState.pagination).toEqual({ page: 1, pageSize: 25 });
  });

  it('resets pagination when sort changes', () => {
    const baseState = {
      ...createInitialState({ pageSize: 10 }),
      pagination: { page: 3, pageSize: 10 },
      sortState: [{ key: 'name', direction: 'asc' as const }],
    };

    const nextState = dataTableReducer(baseState, {
      type: 'ADD_SORT',
      key: 'email',
      maxColumns: 3,
    });

    expect(nextState.sortState).toEqual([
      { key: 'name', direction: 'asc' },
      { key: 'email', direction: 'asc' },
    ]);
    expect(nextState.pagination).toEqual({ page: 1, pageSize: 10 });
  });

  it('hydrates only the targeted slices', () => {
    const baseState = {
      ...createInitialState({ pageSize: 25 }),
      selectedRows: new Set(['row-1']),
      expandedRows: new Set(['row-2']),
      columnOrder: ['name', 'status'],
    };

    const nextState = dataTableReducer(baseState, {
      type: 'HYDRATE',
      state: {
        searchText: 'coffee',
        pagination: { page: 2, pageSize: 25 },
      },
    });

    expect(nextState.searchText).toBe('coffee');
    expect(nextState.pagination).toEqual({ page: 2, pageSize: 25 });
    expect(nextState.selectedRows).toBe(baseState.selectedRows);
    expect(nextState.expandedRows).toBe(baseState.expandedRows);
    expect(nextState.columnOrder).toBe(baseState.columnOrder);
  });

  it('resets all state while preserving page size', () => {
    const baseState = {
      ...createInitialState({ pageSize: 100 }),
      selectedRows: new Set(['row-1']),
      searchText: 'coffee',
      pagination: { page: 6, pageSize: 100 },
      hiddenColumns: new Set(['status']),
      groupBy: 'category' as const,
    };

    const nextState = dataTableReducer(baseState, { type: 'RESET_ALL' });

    expect(nextState).toEqual(createInitialState({ pageSize: 100 }));
  });
});
