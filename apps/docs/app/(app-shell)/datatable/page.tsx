'use client';

import React, { useState, useCallback, useMemo } from 'react';
import {
  type Column,
  type BulkAction,
  type Density,
  type RowContextMenuItemOrSeparator,
} from '@unisane/data-table';
import { DataTableProvider, useSelection, useGrouping } from '@unisane/data-table/context';
import {
  DataTableInner,
  RowContextMenu,
  useRowContextMenu,
  type PrintHandler,
} from '@unisane/data-table/components';
import {
  useInlineEditingWithFeedback,
  useInlineEditingWithHistory,
  useCellSelection,
  useActionDialog,
  useResponsiveDensity,
} from '@unisane/data-table/hooks';
import { exportData, type ExportFormat } from '@unisane/data-table/export';
import { enStrings, hiStrings } from '@unisane/data-table/i18n';
import { usePrint } from '@unisane/data-table/print';
import { getNestedValue } from '@unisane/data-table/utils';
import { Typography } from '@unisane/ui/typography';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@unisane/ui/tabs';
import { Icon } from '@unisane/ui/icon';
import { Sheet } from '@unisane/ui/sheet';
import { Button } from '@unisane/ui/button';
import { Tooltip } from '@unisane/ui/tooltip';
import { cn } from '@unisane/ui/utils';
import { Dialog } from '@unisane/ui/dialog';
import { ConfirmDialog } from '@unisane/ui/confirm-dialog';
import { TextField } from '@unisane/ui/text-field';

// Components
import {
  DemoHeader,
  DemoControls,
  StatCards,
  FeatureCard,
  type LocaleKey,
  type LocaleOption,
} from './components';

// Users Demo
import {
  type User,
  generateUsers,
  userColumns,
  ExpandedRowContent,
  createUserActionsColumn,
  createUserActionItems,
} from './demos/users';

// Products Demo
import {
  type Product,
  generateProducts,
  productColumns,
  ProductExpandedRow,
  createProductActionsColumn,
  createProductActionItems,
} from './demos/products';

// Inventory Demo
import {
  type InventoryItem,
  generateInventory,
  inventoryColumns,
  InventoryExpandedRow,
  createInventoryActionsColumn,
  createInventoryActionItems,
} from './demos/inventory';

// Financial Demo
import {
  type Transaction,
  generateTransactions,
  transactionColumns,
  TransactionExpandedRow,
  createTransactionActionsColumn,
  createTransactionActionItems,
} from './demos/financial';

// ─── LOCALE OPTIONS ──────────────────────────────────────────────────────────

const LOCALE_OPTIONS: Record<LocaleKey, LocaleOption> = {
  en: { label: 'English', locale: { locale: 'en', strings: enStrings } },
  hi: { label: 'हिंदी', locale: { locale: 'hi', strings: hiStrings } },
};

const DEMO_TABLE_CLASS_NAME = 'h-[70vh] min-h-[560px]';

type DemoNotice = {
  title: string;
  description: string;
};

function DemoNoticeDialog({ notice, onClose }: { notice: DemoNotice | null; onClose: () => void }) {
  return (
    <Dialog
      open={Boolean(notice)}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
      title={notice?.title ?? 'Action'}
      description={notice?.description}
      icon={<Icon symbol="info" />}
      actions={
        <Button variant="filled" onClick={onClose}>
          Close
        </Button>
      }
    />
  );
}

function BulkDeleteConfirmDialog({
  ids,
  label,
  onClose,
  onConfirm,
}: {
  ids: readonly string[] | null;
  label: string;
  onClose: () => void;
  onConfirm: (ids: readonly string[]) => void;
}) {
  const count = ids?.length ?? 0;

  return (
    <ConfirmDialog
      open={Boolean(ids)}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
      title={`Delete ${count} ${label}?`}
      description="This removes the selected rows from this demo table."
      confirmLabel="Delete"
      tone="danger"
      onConfirm={() => {
        if (!ids) return false;
        onConfirm(ids);
        return true;
      }}
    />
  );
}

// ─── USERS TABLE ─────────────────────────────────────────────────────────────

interface UsersTableProps {
  data: User[];
  setData: React.Dispatch<React.SetStateAction<User[]>>;
  columns: Column<User>[];
  features: {
    enableSelection: boolean;
    enableExpansion: boolean;
    enableContextMenu: boolean;
    enableCellSelection: boolean;
    enableRowReorder: boolean;
  };
  density: Density;
  onDensityChange: (d: Density) => void;
}

function UsersTable({
  data,
  setData,
  columns,
  features,
  density,
  onDensityChange,
}: UsersTableProps) {
  const { selectedRows } = useSelection();
  const selectedIds = Array.from(selectedRows);
  const [notice, setNotice] = useState<DemoNotice | null>(null);
  const [bulkDeleteIds, setBulkDeleteIds] = useState<readonly string[] | null>(null);
  const { isGrouped, groupByArray, expandedGroups, expandAllGroups, collapseAllGroups } =
    useGrouping();
  const { menuState, handleRowContextMenu, closeMenu } = useRowContextMenu<User>();

  const columnKeys = useMemo(() => columns.map((col) => String(col.key)), [columns]);

  const cellSelection = useCellSelection<User>({
    data,
    columnKeys,
    enabled: features.enableCellSelection,
  });

  const handleCopySelectedCells = useCallback(async () => {
    if (cellSelection.state.selectedCells.size === 0) return;
    const values = cellSelection.getSelectedValues((rowId, columnKey) => {
      const row = data.find((r) => r.id === rowId);
      if (!row) return '';
      return String(getNestedValue(row, columnKey) ?? '');
    });
    const tsv = values.map((row) => row.join('\t')).join('\n');
    await navigator.clipboard.writeText(tsv);
  }, [cellSelection, data]);

  const handleCellKeyDown = useCallback(
    (event: React.KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key === 'c') {
        event.preventDefault();
        handleCopySelectedCells();
        return;
      }
      cellSelection.handleCellKeyDown(event);
    },
    [cellSelection, handleCopySelectedCells],
  );

  const { print, printSelected, isPrinting } = usePrint<User>({
    data,
    columns,
    selectedIds: selectedRows,
    defaultOptions: {
      title: 'Users Report',
      orientation: 'landscape',
      includeTimestamp: true,
    },
  });

  const printHandler: PrintHandler = useMemo(
    () => ({
      onPrint: () => print(),
      onPrintSelected: selectedRows.size > 0 ? () => printSelected() : undefined,
      isPrinting,
    }),
    [print, printSelected, isPrinting, selectedRows.size],
  );

  const inlineEditing = useInlineEditingWithFeedback<User>({
    data,
    onCellChange: async (rowId: string, columnKey: string, newValue: unknown) => {
      await new Promise((resolve) => setTimeout(resolve, 300));
      // Convert numeric column values from string to number
      const numericColumns = ['salary'];
      const processedValue = numericColumns.includes(columnKey) ? Number(newValue) : newValue;
      setData((prev) =>
        prev.map((row) => (row.id === rowId ? { ...row, [columnKey]: processedValue } : row)),
      );
    },
    validateCell: (_rowId: string, columnKey: string, value: unknown) => {
      if (columnKey === 'salary') {
        const strValue = String(value).trim();
        const numValue = Number(strValue);
        if (strValue === '' || isNaN(numValue) || numValue < 0) {
          return 'Salary must be a positive number';
        }
      }
      if (columnKey === 'email' && typeof value === 'string' && !value.includes('@')) {
        return 'Invalid email address';
      }
      return null;
    },
  });

  const bulkActions: BulkAction[] = useMemo(
    () => [
      {
        label: 'Export',
        icon: 'download',
        onClick: async (ids) => {
          const selected = data.filter((d) => ids.includes(d.id));
          await exportData({
            format: 'csv',
            data: selected,
            columns,
            filename: 'selected-users',
          });
        },
      },
      {
        label: 'Activate',
        icon: 'check_circle',
        onClick: (ids) =>
          setData((prev) =>
            prev.map((row) => (ids.includes(row.id) ? { ...row, status: 'active' } : row)),
          ),
      },
      {
        label: 'Delete',
        icon: 'delete',
        variant: 'danger',
        onClick: (ids) => setBulkDeleteIds(ids),
      },
    ],
    [columns, data, setData],
  );

  const contextMenuItems: RowContextMenuItemOrSeparator<User>[] = useMemo(
    () =>
      createUserActionItems(
        (user) =>
          setNotice({
            title: user.name,
            description: `${user.email} · ${user.department}`,
          }),
        (user) =>
          setNotice({
            title: 'Edit user',
            description: `${user.name} · ${user.email}`,
          }),
        (user) => setData((prev) => prev.filter((r) => r.id !== user.id)),
      ),
    [setData],
  );

  const groupIds = useMemo(() => {
    if (!isGrouped || groupByArray.length === 0) return [];
    const allGroupIds = new Set<string>();
    const buildGroupIds = (rows: User[], keys: string[], parentId: string | null) => {
      if (keys.length === 0 || rows.length === 0) return;
      const currentKey = keys[0]!;
      const remainingKeys = keys.slice(1);
      const groupMap = new Map<string, User[]>();
      for (const row of rows) {
        const value = row[currentKey as keyof User];
        const valueKey = String(value ?? '__null__');
        if (!groupMap.has(valueKey)) groupMap.set(valueKey, []);
        groupMap.get(valueKey)!.push(row);
      }
      for (const [valueKey, groupRows] of groupMap) {
        const groupId = parentId ? `${parentId}::${valueKey}` : valueKey;
        allGroupIds.add(groupId);
        buildGroupIds(groupRows, remainingKeys, groupId);
      }
    };
    buildGroupIds(data, groupByArray, null);
    return Array.from(allGroupIds);
  }, [data, groupByArray, isGrouped]);

  const allGroupsExpanded =
    isGrouped && groupIds.length > 0 && expandedGroups.size === groupIds.length;
  const handleToggleAllGroups = useCallback(() => {
    if (allGroupsExpanded) collapseAllGroups();
    else expandAllGroups(groupIds);
  }, [allGroupsExpanded, collapseAllGroups, expandAllGroups, groupIds]);

  const handleRowReorder = useCallback(
    (fromIndex: number, toIndex: number) => {
      setData((prev) => {
        const newData = [...prev];
        const [movedItem] = newData.splice(fromIndex, 1);
        if (movedItem) newData.splice(toIndex, 0, movedItem);
        return newData;
      });
    },
    [setData],
  );

  return (
    <>
      <DataTableInner
        toolbarProps={{
          title: 'Users',
          searchable: true,
          bulkActions: features.enableSelection ? bulkActions : [],
          exportHandler: {
            onExport: async (format: ExportFormat) => {
              await exportData({ format, data, columns, filename: 'all-users' });
            },
            formats: ['csv', 'excel', 'pdf', 'json'],
          },
          printHandler,
          density,
          onDensityChange,
          isGrouped,
          allGroupsExpanded,
          onToggleAllGroups: handleToggleAllGroups,
          showGroupingPills: isGrouped,
        }}
        data={data}
        isLoading={false}
        bulkActions={features.enableSelection ? bulkActions : []}
        renderExpandedRow={
          features.enableExpansion ? (row) => <ExpandedRowContent row={row} /> : undefined
        }
        getRowCanExpand={features.enableExpansion ? () => true : undefined}
        onRowContextMenu={features.enableContextMenu ? handleRowContextMenu : undefined}
        density={density}
        virtualize={false}
        className={DEMO_TABLE_CLASS_NAME}
        emptyMessage="No users found"
        emptyIcon="person_off"
        inlineEditing={inlineEditing}
        cellSelectionEnabled={features.enableCellSelection}
        getCellSelectionContext={
          features.enableCellSelection ? cellSelection.getCellSelectionContext : undefined
        }
        onCellClick={features.enableCellSelection ? cellSelection.handleCellClick : undefined}
        onCellKeyDown={features.enableCellSelection ? handleCellKeyDown : undefined}
        reorderableRows={features.enableRowReorder}
        onRowReorder={handleRowReorder}
      />

      {features.enableContextMenu && (
        <RowContextMenu
          state={menuState}
          onClose={closeMenu}
          items={contextMenuItems}
          selectedIds={selectedIds}
        />
      )}
      <DemoNoticeDialog notice={notice} onClose={() => setNotice(null)} />
      <BulkDeleteConfirmDialog
        ids={bulkDeleteIds}
        label="users"
        onClose={() => setBulkDeleteIds(null)}
        onConfirm={(ids) => setData((prev) => prev.filter((row) => !ids.includes(row.id)))}
      />
    </>
  );
}

// ─── PRODUCTS TABLE ──────────────────────────────────────────────────────────

interface ProductsTableProps {
  data: Product[];
  setData: React.Dispatch<React.SetStateAction<Product[]>>;
  columns: Column<Product>[];
  features: {
    enableSelection: boolean;
    enableExpansion: boolean;
    enableContextMenu: boolean;
    enableCellSelection: boolean;
    enableRowReorder: boolean;
  };
  density: Density;
  onDensityChange: (d: Density) => void;
}

function ProductsTable({
  data,
  setData,
  columns,
  features,
  density,
  onDensityChange,
}: ProductsTableProps) {
  const { selectedRows } = useSelection();
  const selectedIds = Array.from(selectedRows);
  const [notice, setNotice] = useState<DemoNotice | null>(null);
  const [bulkDeleteIds, setBulkDeleteIds] = useState<readonly string[] | null>(null);
  const { isGrouped, groupByArray, expandedGroups, expandAllGroups, collapseAllGroups } =
    useGrouping();
  const { menuState, handleRowContextMenu, closeMenu } = useRowContextMenu<Product>();

  const columnKeys = useMemo(() => columns.map((col) => String(col.key)), [columns]);

  const cellSelection = useCellSelection<Product>({
    data,
    columnKeys,
    enabled: features.enableCellSelection,
  });

  const handleCopySelectedCells = useCallback(async () => {
    if (cellSelection.state.selectedCells.size === 0) return;
    const values = cellSelection.getSelectedValues((rowId, columnKey) => {
      const row = data.find((r) => r.id === rowId);
      if (!row) return '';
      return String(getNestedValue(row, columnKey) ?? '');
    });
    const tsv = values.map((row) => row.join('\t')).join('\n');
    await navigator.clipboard.writeText(tsv);
  }, [cellSelection, data]);

  const handleCellKeyDown = useCallback(
    (event: React.KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key === 'c') {
        event.preventDefault();
        handleCopySelectedCells();
        return;
      }
      cellSelection.handleCellKeyDown(event);
    },
    [cellSelection, handleCopySelectedCells],
  );

  const { print, printSelected, isPrinting } = usePrint<Product>({
    data,
    columns,
    selectedIds: selectedRows,
    defaultOptions: {
      title: 'Products Report',
      orientation: 'landscape',
      includeTimestamp: true,
    },
  });

  const printHandler: PrintHandler = useMemo(
    () => ({
      onPrint: () => print(),
      onPrintSelected: selectedRows.size > 0 ? () => printSelected() : undefined,
      isPrinting,
    }),
    [print, printSelected, isPrinting, selectedRows.size],
  );

  const inlineEditing = useInlineEditingWithFeedback<Product>({
    data,
    onCellChange: async (rowId: string, columnKey: string, newValue: unknown) => {
      await new Promise((resolve) => setTimeout(resolve, 300));
      // Convert numeric column values from string to number
      const numericColumns = ['price', 'cost', 'quantity', 'weight'];
      const processedValue = numericColumns.includes(columnKey) ? Number(newValue) : newValue;
      setData((prev) =>
        prev.map((row) => (row.id === rowId ? { ...row, [columnKey]: processedValue } : row)),
      );
    },
    validateCell: (_rowId: string, columnKey: string, value: unknown) => {
      if (columnKey === 'price') {
        const strValue = String(value).trim();
        const numValue = Number(strValue);
        if (strValue === '' || isNaN(numValue) || numValue < 0) {
          return 'Price must be a positive number';
        }
      }
      if (columnKey === 'quantity') {
        const strValue = String(value).trim();
        const numValue = Number(strValue);
        if (strValue === '' || isNaN(numValue) || numValue < 0) {
          return 'Quantity must be a positive number';
        }
      }
      return null;
    },
  });

  const bulkActions: BulkAction[] = useMemo(
    () => [
      {
        label: 'Export',
        icon: 'download',
        onClick: async (ids) => {
          const selected = data.filter((d) => ids.includes(d.id));
          await exportData({
            format: 'csv',
            data: selected,
            columns,
            filename: 'selected-products',
          });
        },
      },
      {
        label: 'Activate',
        icon: 'check_circle',
        onClick: (ids) =>
          setData((prev) =>
            prev.map((row) => (ids.includes(row.id) ? { ...row, status: 'active' } : row)),
          ),
      },
      {
        label: 'Archive',
        icon: 'archive',
        onClick: (ids) =>
          setData((prev) =>
            prev.map((row) => (ids.includes(row.id) ? { ...row, status: 'archived' } : row)),
          ),
      },
      {
        label: 'Delete',
        icon: 'delete',
        variant: 'danger',
        onClick: (ids) => setBulkDeleteIds(ids),
      },
    ],
    [columns, data, setData],
  );

  const contextMenuItems: RowContextMenuItemOrSeparator<Product>[] = useMemo(
    () =>
      createProductActionItems(
        (product) =>
          setNotice({
            title: product.name,
            description: `SKU ${product.sku} · $${product.price}`,
          }),
        (product) =>
          setNotice({
            title: 'Edit product',
            description: `${product.name} · SKU ${product.sku}`,
          }),
        (product) => {
          const newProduct = {
            ...product,
            id: `prod-${Date.now()}`,
            sku: `${product.sku}-COPY`,
            name: `${product.name} (Copy)`,
          };
          setData((prev) => [...prev, newProduct]);
        },
        (product) =>
          setData((prev) =>
            prev.map((r) => (r.id === product.id ? { ...r, status: 'archived' } : r)),
          ),
        (product) => setData((prev) => prev.filter((r) => r.id !== product.id)),
      ),
    [setData],
  );

  const groupIds = useMemo(() => {
    if (!isGrouped || groupByArray.length === 0) return [];
    const allGroupIds = new Set<string>();
    const buildGroupIds = (rows: Product[], keys: string[], parentId: string | null) => {
      if (keys.length === 0 || rows.length === 0) return;
      const currentKey = keys[0]!;
      const remainingKeys = keys.slice(1);
      const groupMap = new Map<string, Product[]>();
      for (const row of rows) {
        const value = row[currentKey as keyof Product];
        const valueKey = String(value ?? '__null__');
        if (!groupMap.has(valueKey)) groupMap.set(valueKey, []);
        groupMap.get(valueKey)!.push(row);
      }
      for (const [valueKey, groupRows] of groupMap) {
        const groupId = parentId ? `${parentId}::${valueKey}` : valueKey;
        allGroupIds.add(groupId);
        buildGroupIds(groupRows, remainingKeys, groupId);
      }
    };
    buildGroupIds(data, groupByArray, null);
    return Array.from(allGroupIds);
  }, [data, groupByArray, isGrouped]);

  const allGroupsExpanded =
    isGrouped && groupIds.length > 0 && expandedGroups.size === groupIds.length;
  const handleToggleAllGroups = useCallback(() => {
    if (allGroupsExpanded) collapseAllGroups();
    else expandAllGroups(groupIds);
  }, [allGroupsExpanded, collapseAllGroups, expandAllGroups, groupIds]);

  const handleRowReorder = useCallback(
    (fromIndex: number, toIndex: number) => {
      setData((prev) => {
        const newData = [...prev];
        const [movedItem] = newData.splice(fromIndex, 1);
        if (movedItem) newData.splice(toIndex, 0, movedItem);
        return newData;
      });
    },
    [setData],
  );

  return (
    <>
      <DataTableInner
        toolbarProps={{
          title: 'Products',
          searchable: true,
          bulkActions: features.enableSelection ? bulkActions : [],
          exportHandler: {
            onExport: async (format: ExportFormat) => {
              await exportData({ format, data, columns, filename: 'all-products' });
            },
            formats: ['csv', 'excel', 'pdf', 'json'],
          },
          printHandler,
          density,
          onDensityChange,
          isGrouped,
          allGroupsExpanded,
          onToggleAllGroups: handleToggleAllGroups,
          showGroupingPills: isGrouped,
        }}
        data={data}
        isLoading={false}
        bulkActions={features.enableSelection ? bulkActions : []}
        renderExpandedRow={
          features.enableExpansion ? (row) => <ProductExpandedRow row={row} /> : undefined
        }
        getRowCanExpand={features.enableExpansion ? () => true : undefined}
        onRowContextMenu={features.enableContextMenu ? handleRowContextMenu : undefined}
        density={density}
        virtualize={false}
        className={DEMO_TABLE_CLASS_NAME}
        emptyMessage="No products found"
        emptyIcon="inventory_2"
        inlineEditing={inlineEditing}
        cellSelectionEnabled={features.enableCellSelection}
        getCellSelectionContext={
          features.enableCellSelection ? cellSelection.getCellSelectionContext : undefined
        }
        onCellClick={features.enableCellSelection ? cellSelection.handleCellClick : undefined}
        onCellKeyDown={features.enableCellSelection ? handleCellKeyDown : undefined}
        reorderableRows={features.enableRowReorder}
        onRowReorder={handleRowReorder}
      />

      {features.enableContextMenu && (
        <RowContextMenu
          state={menuState}
          onClose={closeMenu}
          items={contextMenuItems}
          selectedIds={selectedIds}
        />
      )}
      <DemoNoticeDialog notice={notice} onClose={() => setNotice(null)} />
      <BulkDeleteConfirmDialog
        ids={bulkDeleteIds}
        label="products"
        onClose={() => setBulkDeleteIds(null)}
        onConfirm={(ids) => setData((prev) => prev.filter((row) => !ids.includes(row.id)))}
      />
    </>
  );
}

// ─── INVENTORY TABLE ─────────────────────────────────────────────────────────

interface InventoryTableProps {
  data: InventoryItem[];
  setData: React.Dispatch<React.SetStateAction<InventoryItem[]>>;
  columns: Column<InventoryItem>[];
  features: {
    enableSelection: boolean;
    enableExpansion: boolean;
    enableContextMenu: boolean;
    enableCellSelection: boolean;
    enableRowReorder: boolean;
  };
  density: Density;
  onDensityChange: (d: Density) => void;
}

function InventoryTable({
  data,
  setData,
  columns,
  features,
  density,
  onDensityChange,
}: InventoryTableProps) {
  const { selectedRows } = useSelection();
  const selectedIds = Array.from(selectedRows);
  const [notice, setNotice] = useState<DemoNotice | null>(null);
  const [bulkDeleteIds, setBulkDeleteIds] = useState<readonly string[] | null>(null);
  const { isGrouped, groupByArray, expandedGroups, expandAllGroups, collapseAllGroups } =
    useGrouping();
  const { menuState, handleRowContextMenu, closeMenu } = useRowContextMenu<InventoryItem>();

  const columnKeys = useMemo(() => columns.map((col) => String(col.key)), [columns]);

  const cellSelection = useCellSelection<InventoryItem>({
    data,
    columnKeys,
    enabled: features.enableCellSelection,
  });

  const handleCopySelectedCells = useCallback(async () => {
    if (cellSelection.state.selectedCells.size === 0) return;
    const values = cellSelection.getSelectedValues((rowId, columnKey) => {
      const row = data.find((r) => r.id === rowId);
      if (!row) return '';
      return String(getNestedValue(row, columnKey) ?? '');
    });
    const tsv = values.map((row) => row.join('\t')).join('\n');
    await navigator.clipboard.writeText(tsv);
  }, [cellSelection, data]);

  const handleCellKeyDown = useCallback(
    (event: React.KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key === 'c') {
        event.preventDefault();
        handleCopySelectedCells();
        return;
      }
      cellSelection.handleCellKeyDown(event);
    },
    [cellSelection, handleCopySelectedCells],
  );

  const { print, printSelected, isPrinting } = usePrint<InventoryItem>({
    data,
    columns,
    selectedIds: selectedRows,
    defaultOptions: {
      title: 'Inventory Report',
      orientation: 'landscape',
      includeTimestamp: true,
    },
  });

  const printHandler: PrintHandler = useMemo(
    () => ({
      onPrint: () => print(),
      onPrintSelected: selectedRows.size > 0 ? () => printSelected() : undefined,
      isPrinting,
    }),
    [print, printSelected, isPrinting, selectedRows.size],
  );

  const inlineEditing = useInlineEditingWithFeedback<InventoryItem>({
    data,
    onCellChange: async (rowId: string, columnKey: string, newValue: unknown) => {
      await new Promise((resolve) => setTimeout(resolve, 300));
      // Convert numeric column values from string to number
      const numericColumns = [
        'costPrice',
        'sellingPrice',
        'currentStock',
        'reorderLevel',
        'weight',
      ];
      const processedValue = numericColumns.includes(columnKey) ? Number(newValue) : newValue;
      setData((prev) =>
        prev.map((row) => (row.id === rowId ? { ...row, [columnKey]: processedValue } : row)),
      );
    },
    validateCell: (_rowId: string, columnKey: string, value: unknown) => {
      if (columnKey === 'costPrice') {
        const strValue = String(value).trim();
        const numValue = Number(strValue);
        if (strValue === '' || isNaN(numValue) || numValue < 0) {
          return 'Cost price must be a positive number';
        }
      }
      if (columnKey === 'sellingPrice') {
        const strValue = String(value).trim();
        const numValue = Number(strValue);
        if (strValue === '' || isNaN(numValue) || numValue < 0) {
          return 'Selling price must be a positive number';
        }
      }
      return null;
    },
  });

  const bulkActions: BulkAction[] = useMemo(
    () => [
      {
        label: 'Export',
        icon: 'download',
        onClick: async (ids) => {
          const selected = data.filter((d) => ids.includes(d.id));
          await exportData({
            format: 'csv',
            data: selected,
            columns,
            filename: 'selected-inventory',
          });
        },
      },
      {
        label: 'Mark Low Stock',
        icon: 'warning',
        onClick: (ids) =>
          setData((prev) =>
            prev.map((row) =>
              ids.includes(row.id) ? { ...row, status: 'low_stock' as const } : row,
            ),
          ),
      },
      {
        label: 'Create PO',
        icon: 'add_shopping_cart',
        onClick: (ids) =>
          setNotice({
            title: 'Create purchase order',
            description: `Creating a purchase order for ${ids.length} selected items.`,
          }),
      },
      {
        label: 'Delete',
        icon: 'delete',
        variant: 'danger',
        onClick: (ids) => setBulkDeleteIds(ids),
      },
    ],
    [data, setData, columns],
  );

  const contextMenuItems: RowContextMenuItemOrSeparator<InventoryItem>[] = useMemo(
    () =>
      createInventoryActionItems(
        (item) =>
          setNotice({
            title: item.name,
            description: `SKU ${item.sku} · ${item.currentStock} ${item.unit} · ₹${item.sellingPrice}`,
          }),
        (item) =>
          setNotice({
            title: 'Edit item',
            description: `${item.name} · SKU ${item.sku}`,
          }),
        (item) =>
          setNotice({
            title: 'Create restock order',
            description: `Preparing a restock order for ${item.name}.`,
          }),
        (item) =>
          setNotice({
            title: 'Adjust stock',
            description: `Adjusting current stock for ${item.name}.`,
          }),
        (item) =>
          setNotice({
            title: 'Stock history',
            description: `${item.name} currently has ${item.currentStock} ${item.unit}.`,
          }),
        (item) => setData((prev) => prev.filter((r) => r.id !== item.id)),
      ),
    [setData],
  );

  const groupIds = useMemo(() => {
    if (!isGrouped || groupByArray.length === 0) return [];
    const allGroupIds = new Set<string>();
    const buildGroupIds = (rows: InventoryItem[], keys: string[], parentId: string | null) => {
      if (keys.length === 0 || rows.length === 0) return;
      const currentKey = keys[0]!;
      const remainingKeys = keys.slice(1);
      const groupMap = new Map<string, InventoryItem[]>();
      for (const row of rows) {
        const value = row[currentKey as keyof InventoryItem];
        const valueKey = String(value ?? '__null__');
        if (!groupMap.has(valueKey)) groupMap.set(valueKey, []);
        groupMap.get(valueKey)!.push(row);
      }
      for (const [valueKey, groupRows] of groupMap) {
        const groupId = parentId ? `${parentId}::${valueKey}` : valueKey;
        allGroupIds.add(groupId);
        buildGroupIds(groupRows, remainingKeys, groupId);
      }
    };
    buildGroupIds(data, groupByArray, null);
    return Array.from(allGroupIds);
  }, [data, groupByArray, isGrouped]);

  const allGroupsExpanded =
    isGrouped && groupIds.length > 0 && expandedGroups.size === groupIds.length;
  const handleToggleAllGroups = useCallback(() => {
    if (allGroupsExpanded) collapseAllGroups();
    else expandAllGroups(groupIds);
  }, [allGroupsExpanded, collapseAllGroups, expandAllGroups, groupIds]);

  const handleRowReorder = useCallback(
    (fromIndex: number, toIndex: number) => {
      setData((prev) => {
        const newData = [...prev];
        const [movedItem] = newData.splice(fromIndex, 1);
        if (movedItem) newData.splice(toIndex, 0, movedItem);
        return newData;
      });
    },
    [setData],
  );

  return (
    <>
      <DataTableInner
        toolbarProps={{
          title: 'Inventory',
          searchable: true,
          bulkActions: features.enableSelection ? bulkActions : [],
          exportHandler: {
            onExport: async (format: ExportFormat) => {
              await exportData({
                format,
                data,
                columns,
                filename: 'inventory-export',
              });
            },
            formats: ['csv', 'excel', 'pdf', 'json'],
          },
          printHandler,
          density,
          onDensityChange,
          isGrouped,
          allGroupsExpanded,
          onToggleAllGroups: handleToggleAllGroups,
          showGroupingPills: isGrouped,
        }}
        data={data}
        isLoading={false}
        bulkActions={features.enableSelection ? bulkActions : []}
        renderExpandedRow={
          features.enableExpansion ? (row) => <InventoryExpandedRow row={row} /> : undefined
        }
        getRowCanExpand={features.enableExpansion ? () => true : undefined}
        onRowContextMenu={features.enableContextMenu ? handleRowContextMenu : undefined}
        density={density}
        virtualize={false}
        className={DEMO_TABLE_CLASS_NAME}
        emptyMessage="No inventory items found"
        emptyIcon="inventory_2"
        inlineEditing={inlineEditing}
        cellSelectionEnabled={features.enableCellSelection}
        getCellSelectionContext={
          features.enableCellSelection ? cellSelection.getCellSelectionContext : undefined
        }
        onCellClick={features.enableCellSelection ? cellSelection.handleCellClick : undefined}
        onCellKeyDown={features.enableCellSelection ? handleCellKeyDown : undefined}
        reorderableRows={features.enableRowReorder}
        onRowReorder={handleRowReorder}
      />

      {features.enableContextMenu && (
        <RowContextMenu
          state={menuState}
          onClose={closeMenu}
          items={contextMenuItems}
          selectedIds={selectedIds}
        />
      )}
      <DemoNoticeDialog notice={notice} onClose={() => setNotice(null)} />
      <BulkDeleteConfirmDialog
        ids={bulkDeleteIds}
        label="inventory items"
        onClose={() => setBulkDeleteIds(null)}
        onConfirm={(ids) => setData((prev) => prev.filter((row) => !ids.includes(row.id)))}
      />
    </>
  );
}

// ─── FINANCIAL TABLE (WITH UNDO/REDO) ─────────────────────────────────────────

interface FinancialTableProps {
  data: Transaction[];
  setData: React.Dispatch<React.SetStateAction<Transaction[]>>;
  columns: Column<Transaction>[];
  features: {
    enableSelection: boolean;
    enableExpansion: boolean;
    enableContextMenu: boolean;
    enableCellSelection: boolean;
    enableRowReorder: boolean;
  };
  density: Density;
  onDensityChange: (d: Density) => void;
}

function FinancialTable({
  data,
  setData,
  columns,
  features,
  density,
  onDensityChange,
}: FinancialTableProps) {
  const { selectedRows } = useSelection();
  const selectedIds = Array.from(selectedRows);
  const [notice, setNotice] = useState<DemoNotice | null>(null);
  const [bulkDeleteIds, setBulkDeleteIds] = useState<readonly string[] | null>(null);
  const { isGrouped, groupByArray, expandedGroups, expandAllGroups, collapseAllGroups } =
    useGrouping();
  const { menuState, handleRowContextMenu, closeMenu } = useRowContextMenu<Transaction>();

  const columnKeys = useMemo(() => columns.map((col) => String(col.key)), [columns]);

  const cellSelection = useCellSelection<Transaction>({
    data,
    columnKeys,
    enabled: features.enableCellSelection,
  });

  const handleCopySelectedCells = useCallback(async () => {
    if (cellSelection.state.selectedCells.size === 0) return;
    const values = cellSelection.getSelectedValues((rowId, columnKey) => {
      const row = data.find((r) => r.id === rowId);
      if (!row) return '';
      return String(getNestedValue(row, columnKey) ?? '');
    });
    const tsv = values.map((row) => row.join('\t')).join('\n');
    await navigator.clipboard.writeText(tsv);
  }, [cellSelection, data]);

  const handleCellKeyDown = useCallback(
    (event: React.KeyboardEvent) => {
      // Let undo/redo pass through to inlineEditing handler
      if ((event.ctrlKey || event.metaKey) && (event.key === 'z' || event.key === 'y')) {
        return;
      }
      if ((event.ctrlKey || event.metaKey) && event.key === 'c') {
        event.preventDefault();
        handleCopySelectedCells();
        return;
      }
      cellSelection.handleCellKeyDown(event);
    },
    [cellSelection, handleCopySelectedCells],
  );

  const { print, printSelected, isPrinting } = usePrint<Transaction>({
    data,
    columns,
    selectedIds: selectedRows,
    defaultOptions: {
      title: 'Financial Report',
      orientation: 'landscape',
      includeTimestamp: true,
    },
  });

  const printHandler: PrintHandler = useMemo(
    () => ({
      onPrint: () => print(),
      onPrintSelected: selectedRows.size > 0 ? () => printSelected() : undefined,
      isPrinting,
    }),
    [print, printSelected, isPrinting, selectedRows.size],
  );

  // ─── INLINE EDITING WITH UNDO/REDO ───────────────────────────────────────────
  const inlineEditing = useInlineEditingWithHistory<Transaction>({
    data,
    onCellChange: async (rowId, columnKey, newValue) => {
      await new Promise((resolve) => setTimeout(resolve, 200));
      // Convert numeric column values from string to number
      const numericColumns = ['amount'];
      const processedValue = numericColumns.includes(columnKey) ? Number(newValue) : newValue;
      setData((prev) =>
        prev.map((row) => (row.id === rowId ? { ...row, [columnKey]: processedValue } : row)),
      );
    },
    validateCell: (_rowId, columnKey, value) => {
      if (columnKey === 'amount') {
        const strValue = String(value).trim();
        if (strValue === '' || isNaN(Number(strValue))) {
          return 'Amount must be a valid number';
        }
      }
      if (columnKey === 'description' && typeof value === 'string' && value.length < 3) {
        return 'Description must be at least 3 characters';
      }
      return null;
    },
    maxHistorySize: 50,
  });

  const bulkActions: BulkAction[] = useMemo(
    () => [
      {
        label: 'Export',
        icon: 'download',
        onClick: async (ids) => {
          const selected = data.filter((d) => ids.includes(d.id));
          await exportData({
            format: 'csv',
            data: selected,
            columns,
            filename: 'selected-transactions',
          });
        },
      },
      {
        label: 'Mark Completed',
        icon: 'check_circle',
        onClick: (ids) =>
          setData((prev) =>
            prev.map((row) =>
              ids.includes(row.id) ? { ...row, status: 'completed' as const } : row,
            ),
          ),
      },
      {
        label: 'Mark Refunded',
        icon: 'undo',
        onClick: (ids) =>
          setData((prev) =>
            prev.map((row) =>
              ids.includes(row.id) ? { ...row, status: 'refunded' as const } : row,
            ),
          ),
      },
      {
        label: 'Delete',
        icon: 'delete',
        variant: 'danger',
        onClick: (ids) => setBulkDeleteIds(ids),
      },
    ],
    [data, setData, columns],
  );

  const contextMenuItems: RowContextMenuItemOrSeparator<Transaction>[] = useMemo(
    () =>
      createTransactionActionItems(
        (txn) =>
          setNotice({
            title: txn.reference,
            description: `${txn.description} · ${txn.status}`,
          }),
        (txn) => {
          const newTxn = {
            ...txn,
            id: `txn-${Date.now()}`,
            reference: `${txn.reference}-COPY`,
          };
          setData((prev) => [newTxn, ...prev]);
        },
        (txn) =>
          setData((prev) =>
            prev.map((r) => (r.id === txn.id ? { ...r, status: 'refunded' as const } : r)),
          ),
        (txn) => setData((prev) => prev.filter((r) => r.id !== txn.id)),
      ),
    [setData],
  );

  const groupIds = useMemo(() => {
    if (!isGrouped || groupByArray.length === 0) return [];
    const allGroupIds = new Set<string>();
    const buildGroupIds = (rows: Transaction[], keys: string[], parentId: string | null) => {
      if (keys.length === 0 || rows.length === 0) return;
      const currentKey = keys[0]!;
      const remainingKeys = keys.slice(1);
      const groupMap = new Map<string, Transaction[]>();
      for (const row of rows) {
        const value = row[currentKey as keyof Transaction];
        const valueKey = String(value ?? '__null__');
        if (!groupMap.has(valueKey)) groupMap.set(valueKey, []);
        groupMap.get(valueKey)!.push(row);
      }
      for (const [valueKey, groupRows] of groupMap) {
        const groupId = parentId ? `${parentId}::${valueKey}` : valueKey;
        allGroupIds.add(groupId);
        buildGroupIds(groupRows, remainingKeys, groupId);
      }
    };
    buildGroupIds(data, groupByArray, null);
    return Array.from(allGroupIds);
  }, [data, groupByArray, isGrouped]);

  const allGroupsExpanded =
    isGrouped && groupIds.length > 0 && expandedGroups.size === groupIds.length;
  const handleToggleAllGroups = useCallback(() => {
    if (allGroupsExpanded) collapseAllGroups();
    else expandAllGroups(groupIds);
  }, [allGroupsExpanded, collapseAllGroups, expandAllGroups, groupIds]);

  const handleRowReorder = useCallback(
    (fromIndex: number, toIndex: number) => {
      setData((prev) => {
        const newData = [...prev];
        const [movedItem] = newData.splice(fromIndex, 1);
        if (movedItem) newData.splice(toIndex, 0, movedItem);
        return newData;
      });
    },
    [setData],
  );

  // Undo/Redo controls for toolbar left section
  const undoRedoContent = (
    <div className="flex items-center gap-1">
      <Tooltip label={`Undo${inlineEditing.undoCount > 0 ? ` (${inlineEditing.undoCount})` : ''}`}>
        <button
          type="button"
          onClick={() => inlineEditing.undo()}
          disabled={!inlineEditing.canUndo}
          className={cn(
            'inline-flex h-8 w-8 items-center justify-center rounded-full transition-colors',
            'text-on-surface-variant hover:bg-state-hover active:bg-state-pressed',
            'disabled:pointer-events-none disabled:opacity-40',
          )}
          aria-label="Undo"
        >
          <Icon symbol="undo" className="h-5 w-5" />
        </button>
      </Tooltip>
      <Tooltip label={`Redo${inlineEditing.redoCount > 0 ? ` (${inlineEditing.redoCount})` : ''}`}>
        <button
          type="button"
          onClick={() => inlineEditing.redo()}
          disabled={!inlineEditing.canRedo}
          className={cn(
            'inline-flex h-8 w-8 items-center justify-center rounded-full transition-colors',
            'text-on-surface-variant hover:bg-state-hover active:bg-state-pressed',
            'disabled:pointer-events-none disabled:opacity-40',
          )}
          aria-label="Redo"
        >
          <Icon symbol="redo" className="h-5 w-5" />
        </button>
      </Tooltip>
    </div>
  );

  return (
    <>
      <DataTableInner
        toolbarProps={{
          title: 'Financial Transactions',
          searchable: true,
          bulkActions: features.enableSelection ? bulkActions : [],
          exportHandler: {
            onExport: async (format: ExportFormat) => {
              await exportData({
                format,
                data,
                columns,
                filename: 'financial-transactions',
              });
            },
            formats: ['csv', 'excel', 'pdf', 'json'],
          },
          printHandler,
          density,
          onDensityChange,
          isGrouped,
          allGroupsExpanded,
          onToggleAllGroups: handleToggleAllGroups,
          showGroupingPills: isGrouped,
          leftContent: undoRedoContent,
        }}
        data={data}
        isLoading={false}
        bulkActions={features.enableSelection ? bulkActions : []}
        renderExpandedRow={
          features.enableExpansion ? (row) => <TransactionExpandedRow row={row} /> : undefined
        }
        getRowCanExpand={features.enableExpansion ? () => true : undefined}
        onRowContextMenu={features.enableContextMenu ? handleRowContextMenu : undefined}
        density={density}
        virtualize={false}
        className={DEMO_TABLE_CLASS_NAME}
        emptyMessage="No transactions found"
        emptyIcon="receipt_long"
        inlineEditing={inlineEditing}
        cellSelectionEnabled={features.enableCellSelection}
        getCellSelectionContext={
          features.enableCellSelection ? cellSelection.getCellSelectionContext : undefined
        }
        onCellClick={features.enableCellSelection ? cellSelection.handleCellClick : undefined}
        onCellKeyDown={features.enableCellSelection ? handleCellKeyDown : undefined}
        reorderableRows={features.enableRowReorder}
        onRowReorder={handleRowReorder}
      />

      {features.enableContextMenu && (
        <RowContextMenu
          state={menuState}
          onClose={closeMenu}
          items={contextMenuItems}
          selectedIds={selectedIds}
        />
      )}
      <DemoNoticeDialog notice={notice} onClose={() => setNotice(null)} />
      <BulkDeleteConfirmDialog
        ids={bulkDeleteIds}
        label="transactions"
        onClose={() => setBulkDeleteIds(null)}
        onConfirm={(ids) => setData((prev) => prev.filter((row) => !ids.includes(row.id)))}
      />
    </>
  );
}

// ─── MAIN DEMO PAGE ──────────────────────────────────────────────────────────

export default function DataTableDemoPage() {
  const [activeTab, setActiveTab] = useState<'users' | 'products' | 'inventory' | 'financial'>(
    'users',
  );

  // Users data
  const [usersData, setUsersData] = useState<User[]>(() => generateUsers(150));

  // Products data
  const [productsData, setProductsData] = useState<Product[]>(() => generateProducts(200));

  // Inventory data
  const [inventoryData, setInventoryData] = useState<InventoryItem[]>(() => generateInventory(300));

  // Financial data
  const [financialData, setFinancialData] = useState<Transaction[]>(() =>
    generateTransactions(200),
  );
  const [demoNotice, setDemoNotice] = useState<DemoNotice | null>(null);

  // ─── Action Dialog State (Best Practice Pattern) ────────────────────────────
  // Using useActionDialog hook to manage edit/delete dialogs with type safety
  const userActions = useActionDialog<User>();
  const productActions = useActionDialog<Product>();

  // Edit form state for users
  const [editUserName, setEditUserName] = useState('');
  const [editUserEmail, setEditUserEmail] = useState('');

  // Handlers for user actions
  const handleEditUser = useCallback(
    (user: User) => {
      setEditUserName(user.name);
      setEditUserEmail(user.email);
      userActions.openDialog('edit', user);
    },
    [userActions],
  );

  const handleViewUser = useCallback((user: User) => {
    setDemoNotice({
      title: user.name,
      description: `${user.email} · ${user.department}`,
    });
  }, []);

  const handleSaveUser = useCallback(() => {
    if (userActions.selectedRow) {
      setUsersData((prev) =>
        prev.map((u) =>
          u.id === userActions.selectedRow!.id
            ? { ...u, name: editUserName, email: editUserEmail }
            : u,
        ),
      );
      userActions.closeDialog();
    }
  }, [userActions, editUserName, editUserEmail]);

  const handleDeleteUser = useCallback(() => {
    if (userActions.selectedRow) {
      setUsersData((prev) => prev.filter((u) => u.id !== userActions.selectedRow!.id));
      userActions.closeDialog();
    }
  }, [userActions]);

  // Create columns with actions for Users
  const usersColumnsWithActions = useMemo(() => {
    const actionsColumn = createUserActionsColumn(handleViewUser, handleEditUser, (user) =>
      userActions.openDialog('delete', user),
    );
    return [...userColumns, actionsColumn];
  }, [handleEditUser, handleViewUser, userActions]);

  // Create columns with actions for Products
  const productsColumnsWithActions = useMemo(() => {
    const actionsColumn = createProductActionsColumn(
      (product) =>
        setDemoNotice({
          title: product.name,
          description: `SKU ${product.sku} · $${product.price}`,
        }),
      (product) => productActions.openDialog('edit', product),
      (product) => {
        const newProduct = {
          ...product,
          id: `prod-${Date.now()}`,
          sku: `${product.sku}-COPY`,
          name: `${product.name} (Copy)`,
        };
        setProductsData((prev) => [...prev, newProduct]);
      },
      (product) =>
        setProductsData((prev) =>
          prev.map((r) => (r.id === product.id ? { ...r, status: 'archived' } : r)),
        ),
      (product) => productActions.openDialog('delete', product),
    );
    return [...productColumns, actionsColumn];
  }, [productActions]);

  // Create columns with actions for Inventory
  const inventoryColumnsWithActions = useMemo(() => {
    const actionsColumn = createInventoryActionsColumn(
      (item) =>
        setDemoNotice({
          title: item.name,
          description: `SKU ${item.sku} · ${item.currentStock} ${item.unit} · ₹${item.sellingPrice}`,
        }),
      (item) =>
        setDemoNotice({
          title: 'Edit item',
          description: `${item.name} · SKU ${item.sku}`,
        }),
      (item) =>
        setDemoNotice({
          title: 'Create restock order',
          description: `Preparing a restock order for ${item.name}.`,
        }),
      (item) =>
        setDemoNotice({
          title: 'Adjust stock',
          description: `Adjusting current stock for ${item.name}.`,
        }),
      (item) =>
        setDemoNotice({
          title: 'Stock history',
          description: `${item.name} currently has ${item.currentStock} ${item.unit}.`,
        }),
      (item) => setInventoryData((prev) => prev.filter((r) => r.id !== item.id)),
    );
    return [...inventoryColumns, actionsColumn];
  }, []);

  // Create columns with actions for Financial
  const financialColumnsWithActions = useMemo(() => {
    const actionsColumn = createTransactionActionsColumn(
      (txn) =>
        setDemoNotice({
          title: txn.reference,
          description: `${txn.description} · ${txn.status}`,
        }),
      (txn) => {
        const newTxn = {
          ...txn,
          id: `txn-${Date.now()}`,
          reference: `${txn.reference}-COPY`,
        };
        setFinancialData((prev) => [newTxn, ...prev]);
      },
      (txn) =>
        setFinancialData((prev) =>
          prev.map((r) => (r.id === txn.id ? { ...r, status: 'refunded' as const } : r)),
        ),
      (txn) => setFinancialData((prev) => prev.filter((r) => r.id !== txn.id)),
    );
    return [...transactionColumns, actionsColumn];
  }, []);

  // Feature toggles
  const [enableSelection, setEnableSelection] = useState(true);
  const [enableExpansion, setEnableExpansion] = useState(true);
  const [enableZebra, setEnableZebra] = useState(false);
  const [enableColumnBorders, setEnableColumnBorders] = useState(false);
  const [enableResizable, setEnableResizable] = useState(true);
  const [enablePinnable, setEnablePinnable] = useState(true);
  const [enableMultiSort, setEnableMultiSort] = useState(true);
  const [enableReorderable, setEnableReorderable] = useState(true);
  const [enableGrouping, setEnableGrouping] = useState(true);
  const [enableSummary, setEnableSummary] = useState(true);
  const [enableContextMenu, setEnableContextMenu] = useState(true);
  const [enableCellSelection, setEnableCellSelection] = useState(true);
  const [enableRowReorder, setEnableRowReorder] = useState(true);
  const { density, setDensity } = useResponsiveDensity({
    defaultDensity: 'standard',
    mobileDensity: 'compact',
  });
  const [localeKey, setLocaleKey] = useState<LocaleKey>('en');

  const features = useMemo(
    () => [
      {
        label: 'Selection',
        checked: enableSelection,
        onChange: setEnableSelection,
      },
      {
        label: 'Expansion',
        checked: enableExpansion,
        onChange: setEnableExpansion,
      },
      {
        label: 'Zebra Stripes',
        checked: enableZebra,
        onChange: setEnableZebra,
      },
      {
        label: 'Column Borders',
        checked: enableColumnBorders,
        onChange: setEnableColumnBorders,
      },
      {
        label: 'Resizable Columns',
        checked: enableResizable,
        onChange: setEnableResizable,
      },
      {
        label: 'Pinnable Columns',
        checked: enablePinnable,
        onChange: setEnablePinnable,
      },
      {
        label: 'Multi-Sort',
        checked: enableMultiSort,
        onChange: setEnableMultiSort,
      },
      {
        label: 'Column Reorder',
        checked: enableReorderable,
        onChange: setEnableReorderable,
      },
      {
        label: 'Row Grouping',
        checked: enableGrouping,
        onChange: setEnableGrouping,
      },
      {
        label: 'Summary Row',
        checked: enableSummary,
        onChange: setEnableSummary,
      },
      {
        label: 'Context Menu',
        checked: enableContextMenu,
        onChange: setEnableContextMenu,
      },
      {
        label: 'Cell Selection',
        checked: enableCellSelection,
        onChange: setEnableCellSelection,
      },
      {
        label: 'Row Reorder',
        checked: enableRowReorder,
        onChange: setEnableRowReorder,
      },
    ],
    [
      enableSelection,
      enableExpansion,
      enableZebra,
      enableColumnBorders,
      enableResizable,
      enablePinnable,
      enableMultiSort,
      enableReorderable,
      enableGrouping,
      enableSummary,
      enableContextMenu,
      enableCellSelection,
      enableRowReorder,
    ],
  );

  const tableFeatures = {
    enableSelection,
    enableExpansion,
    enableContextMenu,
    enableCellSelection,
    enableRowReorder,
  };

  // Stats for current tab
  const usersStats = useMemo(
    () => [
      { title: 'Total Users', value: usersData.length },
      {
        title: 'Active Users',
        value: usersData.filter((d) => d.status === 'active').length,
      },
      {
        title: 'Total Salary',
        value: (usersData.reduce((sum, d) => sum + d.salary, 0) / 1000000).toFixed(1),
        prefix: '$',
        suffix: 'M',
      },
    ],
    [usersData],
  );

  const productsStats = useMemo(
    () => [
      { title: 'Total Products', value: productsData.length },
      {
        title: 'Active Products',
        value: productsData.filter((d) => d.status === 'active').length,
      },
      {
        title: 'Total Inventory',
        value: productsData.reduce((sum, d) => sum + d.quantity, 0).toLocaleString(),
        suffix: ' units',
      },
    ],
    [productsData],
  );

  const inventoryStats = useMemo(
    () => [
      { title: 'Total Items', value: inventoryData.length },
      {
        title: 'Low Stock',
        value: inventoryData.filter((d) => d.status === 'low_stock').length,
      },
      {
        title: 'Out of Stock',
        value: inventoryData.filter((d) => d.status === 'out_of_stock').length,
      },
      {
        title: 'Total Value',
        value: (
          inventoryData.reduce((sum, d) => sum + d.currentStock * d.costPrice, 0) / 1000000
        ).toFixed(2),
        prefix: '₹',
        suffix: 'M',
      },
    ],
    [inventoryData],
  );

  const financialStats = useMemo(() => {
    const revenue = financialData.filter((t) => t.amount > 0).reduce((sum, t) => sum + t.amount, 0);
    const expenses = financialData
      .filter((t) => t.amount < 0)
      .reduce((sum, t) => sum + Math.abs(t.amount), 0);
    return [
      { title: 'Transactions', value: financialData.length },
      {
        title: 'Revenue',
        value: (revenue / 1000).toFixed(1),
        prefix: '$',
        suffix: 'K',
      },
      {
        title: 'Expenses',
        value: (expenses / 1000).toFixed(1),
        prefix: '$',
        suffix: 'K',
      },
      {
        title: 'Net',
        value: ((revenue - expenses) / 1000).toFixed(1),
        prefix: '$',
        suffix: 'K',
      },
    ];
  }, [financialData]);

  return (
    <div className="min-h-screen">
      <DemoHeader
        title="DataTable Demo"
        description="A comprehensive demonstration of all DataTable features. Switch between Users and Products demos to see the component in different contexts."
      />

      <DemoControls
        features={features}
        density={density}
        onDensityChange={setDensity}
        localeKey={localeKey}
        onLocaleChange={setLocaleKey}
        localeOptions={LOCALE_OPTIONS}
      />

      {/* Demo Tabs */}
      <div className="pt-6">
        <Tabs
          value={activeTab}
          onValueChange={(v) => setActiveTab(v as 'users' | 'products' | 'inventory' | 'financial')}
        >
          <TabsList className="mb-6">
            <TabsTrigger value="users" className="flex items-center gap-2">
              <Icon symbol="group" className="h-5 w-5" />
              Users Management
            </TabsTrigger>
            <TabsTrigger value="products" className="flex items-center gap-2">
              <Icon symbol="inventory_2" className="h-5 w-5" />
              Products Catalog
            </TabsTrigger>
            <TabsTrigger value="inventory" className="flex items-center gap-2">
              <Icon symbol="warehouse" className="h-5 w-5" />
              Inventory & Billing
            </TabsTrigger>
            <TabsTrigger value="financial" className="flex items-center gap-2">
              <Icon symbol="account_balance" className="h-5 w-5" />
              Financial (Undo/Redo)
            </TabsTrigger>
          </TabsList>

          <TabsContent value="users">
            <div className="medium:-mx-6 expanded:-mx-12 -mx-4">
              <DataTableProvider
                tableId="users-demo-table"
                columns={usersColumnsWithActions}
                mode="local"
                paginationMode="offset"
                variant={enableColumnBorders ? 'grid' : 'list'}
                rowSelectionEnabled={enableSelection}
                showColumnDividers={enableColumnBorders}
                zebra={enableZebra}
                stickyHeader
                resizable={enableResizable}
                pinnable={enablePinnable}
                reorderable={enableReorderable}
                groupingEnabled={enableGrouping}
                showSummary={enableSummary}
                summaryLabel="Totals"
                maxSortColumns={enableMultiSort ? 3 : 1}
                initialPageSize={25}
                locale={LOCALE_OPTIONS[localeKey].locale}
              >
                <UsersTable
                  data={usersData}
                  setData={setUsersData}
                  columns={usersColumnsWithActions}
                  features={tableFeatures}
                  density={density}
                  onDensityChange={setDensity}
                />
              </DataTableProvider>
            </div>
            <StatCards stats={usersStats} />
          </TabsContent>

          <TabsContent value="products">
            <div className="medium:-mx-6 expanded:-mx-12 -mx-4">
              <DataTableProvider
                tableId="products-demo-table"
                columns={productsColumnsWithActions}
                mode="local"
                paginationMode="offset"
                variant={enableColumnBorders ? 'grid' : 'list'}
                rowSelectionEnabled={enableSelection}
                showColumnDividers={enableColumnBorders}
                zebra={enableZebra}
                stickyHeader
                resizable={enableResizable}
                pinnable={enablePinnable}
                reorderable={enableReorderable}
                groupingEnabled={enableGrouping}
                showSummary={enableSummary}
                summaryLabel="Summary"
                maxSortColumns={enableMultiSort ? 3 : 1}
                initialPageSize={25}
                locale={LOCALE_OPTIONS[localeKey].locale}
              >
                <ProductsTable
                  data={productsData}
                  setData={setProductsData}
                  columns={productsColumnsWithActions}
                  features={tableFeatures}
                  density={density}
                  onDensityChange={setDensity}
                />
              </DataTableProvider>
            </div>
            <StatCards stats={productsStats} />
          </TabsContent>

          <TabsContent value="inventory">
            <div className="medium:-mx-6 expanded:-mx-12 -mx-4">
              <DataTableProvider
                tableId="inventory-demo-table"
                columns={inventoryColumnsWithActions}
                mode="local"
                paginationMode="offset"
                variant={enableColumnBorders ? 'grid' : 'list'}
                rowSelectionEnabled={enableSelection}
                showColumnDividers={enableColumnBorders}
                zebra={enableZebra}
                stickyHeader
                resizable={enableResizable}
                pinnable={enablePinnable}
                reorderable={enableReorderable}
                groupingEnabled={enableGrouping}
                showSummary={enableSummary}
                summaryLabel="Totals"
                maxSortColumns={enableMultiSort ? 3 : 1}
                initialPageSize={25}
                locale={LOCALE_OPTIONS[localeKey].locale}
              >
                <InventoryTable
                  data={inventoryData}
                  setData={setInventoryData}
                  columns={inventoryColumnsWithActions}
                  features={tableFeatures}
                  density={density}
                  onDensityChange={setDensity}
                />
              </DataTableProvider>
            </div>
            <StatCards stats={inventoryStats} />
          </TabsContent>

          <TabsContent value="financial">
            <div className="medium:-mx-6 expanded:-mx-12 -mx-4">
              <DataTableProvider
                tableId="financial-demo-table"
                columns={financialColumnsWithActions}
                mode="local"
                paginationMode="offset"
                variant={enableColumnBorders ? 'grid' : 'list'}
                rowSelectionEnabled={enableSelection}
                showColumnDividers={enableColumnBorders}
                zebra={enableZebra}
                stickyHeader
                resizable={enableResizable}
                pinnable={enablePinnable}
                reorderable={enableReorderable}
                groupingEnabled={enableGrouping}
                showSummary={enableSummary}
                summaryLabel="Totals"
                maxSortColumns={enableMultiSort ? 3 : 1}
                initialPageSize={25}
                locale={LOCALE_OPTIONS[localeKey].locale}
              >
                <FinancialTable
                  data={financialData}
                  setData={setFinancialData}
                  columns={financialColumnsWithActions}
                  features={tableFeatures}
                  density={density}
                  onDensityChange={setDensity}
                />
              </DataTableProvider>
            </div>
            <StatCards stats={financialStats} />
          </TabsContent>
        </Tabs>

        {/* Features Documentation */}
        <div className="mt-8 space-y-6">
          <Typography variant="headlineSmall" className="text-on-surface">
            Features Demonstrated
          </Typography>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            <FeatureCard
              icon="search"
              title="Search & Filter"
              description="Use the search bar in the toolbar. Click filter icons on column headers for column-specific filtering."
            />
            <FeatureCard
              icon="view_column"
              title="Column Visibility"
              description="Click 'Columns' button in toolbar to show/hide columns. Settings persist to localStorage."
            />
            <FeatureCard
              icon="table_rows"
              title="Density Toggle"
              description="Click 'Density' button in toolbar to switch between compact, dense, standard, and comfortable modes."
            />
            <FeatureCard
              icon="download"
              title="Export"
              description="Click 'Export' button in toolbar to download data as CSV, Excel, PDF, or JSON."
            />
            <FeatureCard
              icon="sort"
              title="Multi-Sort"
              description="Click column headers to sort. Shift+Click to add secondary/tertiary sort columns."
            />
            <FeatureCard
              icon="check_box"
              title="Selection & Bulk Actions"
              description="Select rows with checkboxes. Bulk actions appear in toolbar when items are selected."
            />
            <FeatureCard
              icon="expand_more"
              title="Row Expansion"
              description="Click the expand icon to reveal additional row details."
            />
            <FeatureCard
              icon="edit"
              title="Inline Editing"
              description="Double-click editable cells. Enter to save, Escape to cancel."
            />
            <FeatureCard
              icon="width"
              title="Column Resizing"
              description="Drag column borders to resize. Widths persist to localStorage."
            />
            <FeatureCard
              icon="push_pin"
              title="Column Pinning"
              description="Right-click column header to pin left/right. Pinned columns stay visible during scroll."
            />
            <FeatureCard
              icon="drag_indicator"
              title="Column Reordering"
              description="Drag column headers to reorder. Non-pinned columns can be dragged to change position."
            />
            <FeatureCard
              icon="swap_vert"
              title="Row Drag-to-Reorder"
              description="Drag the handle on the left of each row to reorder. Alt+Arrow for keyboard reordering."
            />
            <FeatureCard
              icon="workspaces"
              title="Multi-level Grouping"
              description="Right-click column header → 'Group by' for hierarchical groups with aggregations."
            />
            <FeatureCard
              icon="functions"
              title="Summary Row"
              description="Shows aggregated values (sum, average) in a footer row."
            />
            <FeatureCard
              icon="menu"
              title="Context Menu"
              description="Right-click any row for context actions: View, Edit, Duplicate, Delete."
            />
            <FeatureCard
              icon="more_vert"
              title="Actions Column"
              description="Click the vertical ellipsis button in the last column for quick row actions in a dropdown menu."
            />
            <FeatureCard
              icon="select_all"
              title="Cell Selection"
              description="Click cells to select, Shift+Click for range, Ctrl+C to copy."
            />
            <FeatureCard
              icon="print"
              title="Print View"
              description="Click Print for a printer-friendly view with optimized layout."
            />
            <FeatureCard
              icon="translate"
              title="Internationalization"
              description="Built-in support for multiple languages. Toggle between English and Hindi."
            />
          </div>
        </div>
      </div>

      {/* ─── Action Dialogs (Best Practice Pattern) ─────────────────────────── */}
      {/* Using ConfirmDialog for delete confirmations */}
      <ConfirmDialog
        {...userActions.getDialogProps('delete')}
        title="Delete user?"
        description={`This will permanently delete ${userActions.selectedRow?.name ?? 'this user'}. This action cannot be undone.`}
        confirmLabel="Delete"
        tone="danger"
        onConfirm={handleDeleteUser}
      />

      {/* Using Sheet for edit forms */}
      <Sheet
        open={userActions.isDialogOpen('edit')}
        onOpenChange={(nextOpen) => {
          if (!nextOpen) {
            userActions.closeDialog();
          }
        }}
        title={`Edit ${userActions.selectedRow?.name ?? 'User'}`}
        size="sm"
      >
        <div className="flex flex-col gap-4 p-4">
          <TextField label="Name" value={editUserName} onValueChange={(e) => setEditUserName(e)} />
          <TextField
            label="Email"
            type="email"
            value={editUserEmail}
            onValueChange={(e) => setEditUserEmail(e)}
          />
          <div className="mt-4 flex justify-end gap-2">
            <Button variant="text" onClick={userActions.closeDialog}>
              Cancel
            </Button>
            <Button variant="filled" onClick={handleSaveUser}>
              Save Changes
            </Button>
          </div>
        </div>
      </Sheet>

      {/* Product delete confirmation */}
      <ConfirmDialog
        {...productActions.getDialogProps('delete')}
        title="Delete product?"
        description={`This will permanently delete ${productActions.selectedRow?.name ?? 'this product'}. This action cannot be undone.`}
        confirmLabel="Delete"
        tone="danger"
        onConfirm={() => {
          if (productActions.selectedRow) {
            setProductsData((prev) => prev.filter((p) => p.id !== productActions.selectedRow!.id));
            productActions.closeDialog();
          }
        }}
      />
      <DemoNoticeDialog notice={demoNotice} onClose={() => setDemoNotice(null)} />
    </div>
  );
}
