'use client';

import { Icon } from '@unisane/ui/icon';
import type { Column, RowContextMenuItemOrSeparator } from '@unisane/data-table';
import { createActionsColumn } from '@unisane/data-table/components';
import type { Product, ProductStatus, ProductVisibility, ProductCategory } from './types';
import { categories, statuses, visibilities, brands } from './types';

// ─── PRODUCT ACTION ITEMS ─────────────────────────────────────────────────────

export function createProductActionItems(
  onView: (product: Product) => void,
  onEdit: (product: Product) => void,
  onDuplicate: (product: Product) => void,
  onArchive: (product: Product) => void,
  onDelete: (product: Product) => void,
): RowContextMenuItemOrSeparator<Product>[] {
  return [
    {
      key: 'view',
      label: 'View details',
      icon: 'visibility',
      onClick: onView,
    },
    {
      key: 'edit',
      label: 'Edit product',
      icon: 'edit',
      onClick: onEdit,
    },
    {
      key: 'duplicate',
      label: 'Duplicate',
      icon: 'content_copy',
      onClick: onDuplicate,
    },
    { type: 'separator' },
    {
      key: 'archive',
      label: 'Archive',
      icon: 'archive',
      onClick: onArchive,
      visible: (row) => row.status !== 'archived',
    },
    {
      key: 'delete',
      label: 'Delete',
      icon: 'delete',
      variant: 'danger',
      onClick: onDelete,
    },
  ];
}

// ─── CREATE ACTIONS COLUMN ────────────────────────────────────────────────────

export function createProductActionsColumn(
  onView: (product: Product) => void,
  onEdit: (product: Product) => void,
  onDuplicate: (product: Product) => void,
  onArchive: (product: Product) => void,
  onDelete: (product: Product) => void,
): Column<Product> {
  return createActionsColumn<Product>({
    items: createProductActionItems(onView, onEdit, onDuplicate, onArchive, onDelete),
    pinned: 'right',
  });
}

// ─── STATUS BADGE ────────────────────────────────────────────────────────────

function ProductStatusBadge({ status }: { status: ProductStatus }) {
  const config: Record<ProductStatus, { bg: string; text: string; icon: string }> = {
    active: { bg: 'bg-state-selected', text: 'text-primary', icon: 'check_circle' },
    draft: { bg: 'bg-tertiary-container', text: 'text-tertiary', icon: 'edit_note' },
    archived: { bg: 'bg-outline-weak', text: 'text-outline', icon: 'archive' },
    out_of_stock: { bg: 'bg-error-container', text: 'text-error', icon: 'inventory_2' },
  };

  const { bg, text, icon } = config[status];
  const label = status.replace(/_/g, ' ');

  return (
    <span
      className={`text-label-small inline-flex items-center gap-1 rounded-full px-2 py-0.5 capitalize ${bg} ${text}`}
    >
      <Icon symbol={icon} className="h-3.5 w-3.5" />
      {label}
    </span>
  );
}

// ─── VISIBILITY BADGE ────────────────────────────────────────────────────────

function VisibilityBadge({ visibility }: { visibility: ProductVisibility }) {
  const config: Record<ProductVisibility, { icon: string; label: string }> = {
    visible: { icon: 'visibility', label: 'Visible' },
    hidden: { icon: 'visibility_off', label: 'Hidden' },
    catalog_only: { icon: 'menu_book', label: 'Catalog' },
    search_only: { icon: 'search', label: 'Search' },
  };

  const { icon, label } = config[visibility];

  return (
    <span className="text-on-surface-variant text-label-small inline-flex items-center gap-1">
      <Icon symbol={icon} className="h-3.5 w-3.5" />
      {label}
    </span>
  );
}

// ─── CATEGORY BADGE ──────────────────────────────────────────────────────────

function CategoryBadge({ category }: { category: ProductCategory }) {
  const config: Record<ProductCategory, { bg: string; icon: string }> = {
    electronics: { bg: 'bg-secondary-container text-secondary', icon: 'devices' },
    clothing: { bg: 'bg-tertiary-container text-tertiary', icon: 'checkroom' },
    home: { bg: 'bg-warning-container text-warning', icon: 'home' },
    sports: { bg: 'bg-success-container text-success', icon: 'sports_soccer' },
    beauty: { bg: 'bg-primary-container text-primary', icon: 'spa' },
    toys: { bg: 'bg-info-container text-info', icon: 'toys' },
  };

  const { bg, icon } = config[category];

  return (
    <span
      className={`text-label-small inline-flex items-center gap-1 rounded-md px-2 py-0.5 capitalize ${bg}`}
    >
      <Icon symbol={icon} className="h-3.5 w-3.5" />
      {category}
    </span>
  );
}

// ─── RATING STARS ────────────────────────────────────────────────────────────

function RatingDisplay({ rating, reviewCount }: { rating: number; reviewCount: number }) {
  return (
    <div className="flex items-center gap-1">
      <Icon symbol="star" className="text-warning h-4 w-4" />
      <span className="text-body-small font-medium">{rating.toFixed(1)}</span>
      <span className="text-label-small text-on-surface-variant">({reviewCount})</span>
    </div>
  );
}

// ─── STOCK INDICATOR ─────────────────────────────────────────────────────────

function StockIndicator({ quantity }: { quantity: number }) {
  if (quantity === 0) {
    return <span className="text-error text-label-small font-medium">Out of stock</span>;
  }
  if (quantity < 10) {
    return <span className="text-tertiary text-label-small font-medium">Low: {quantity}</span>;
  }
  return <span className="text-primary text-label-small">{quantity} in stock</span>;
}

// ─── COLUMN DEFINITIONS ──────────────────────────────────────────────────────

export const productColumns: Column<Product>[] = [
  {
    key: 'name',
    header: 'Product',
    sortable: true,
    filterable: true,
    pinnable: true,
    editable: true,
    width: 300,
    minWidth: 250,
    render: (row) => (
      <div className="flex items-center gap-3">
        <div className="bg-surface-container h-10 w-10 shrink-0 overflow-hidden rounded-lg">
          <img src={row.imageUrl} alt={row.name} className="h-full w-full object-cover" />
        </div>
        <div className="flex min-w-0 flex-col">
          <span className="text-body-medium text-on-surface truncate font-medium">{row.name}</span>
          <span className="text-label-small text-on-surface-variant font-mono">{row.sku}</span>
        </div>
      </div>
    ),
  },
  {
    key: 'category',
    header: 'Category',
    sortable: true,
    filterable: true,
    filterType: 'select',
    filterOptions: categories.map((c) => ({
      label: c.charAt(0).toUpperCase() + c.slice(1),
      value: c,
    })),
    width: 140,
    align: 'center',
    groupable: true,
    render: (row) => <CategoryBadge category={row.category} />,
  },
  {
    key: 'brand',
    header: 'Brand',
    sortable: true,
    filterable: true,
    filterType: 'select',
    filterOptions: brands.map((b) => ({ label: b, value: b })),
    width: 130,
    hideable: true,
    groupable: true,
  },
  {
    key: 'price',
    header: 'Price',
    sortable: true,
    editable: true,
    inputType: 'number',
    width: 130,
    align: 'end',
    pinnable: true,
    summary: 'average',
    render: (row) => (
      <div className="flex flex-col items-end">
        <span className="text-on-surface font-mono font-medium">${row.price.toFixed(2)}</span>
        {row.compareAtPrice && (
          <span className="text-label-small text-on-surface-variant line-through">
            ${row.compareAtPrice.toFixed(2)}
          </span>
        )}
      </div>
    ),
  },
  {
    key: 'cost',
    header: 'Cost',
    sortable: true,
    editable: true,
    inputType: 'number',
    width: 100,
    align: 'end',
    hideable: true,
    summary: 'average',
    render: (row) => (
      <span className="text-on-surface-variant font-mono">${row.cost.toFixed(2)}</span>
    ),
  },
  {
    key: 'quantity',
    header: 'Stock',
    sortable: true,
    editable: true,
    inputType: 'number',
    width: 120,
    align: 'center',
    summary: 'sum',
    render: (row) => <StockIndicator quantity={row.quantity} />,
  },
  {
    key: 'status',
    header: 'Status',
    sortable: true,
    filterable: true,
    filterType: 'select',
    filterOptions: statuses.map((s) => ({
      label: s.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase()),
      value: s,
    })),
    width: 140,
    align: 'center',
    groupable: true,
    render: (row) => <ProductStatusBadge status={row.status} />,
  },
  {
    key: 'visibility',
    header: 'Visibility',
    sortable: true,
    filterable: true,
    filterType: 'select',
    filterOptions: visibilities.map((v) => ({
      label: v.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase()),
      value: v,
    })),
    width: 110,
    align: 'center',
    hideable: true,
    render: (row) => <VisibilityBadge visibility={row.visibility} />,
  },
  {
    key: 'rating',
    header: 'Rating',
    sortable: true,
    width: 130,
    align: 'center',
    hideable: true,
    summary: 'average',
    render: (row) => <RatingDisplay rating={row.rating} reviewCount={row.reviewCount} />,
  },
  {
    key: 'updatedAt',
    header: 'Updated',
    sortable: true,
    width: 120,
    hideable: true,
    render: (row) => (
      <span className="text-on-surface-variant text-body-small">
        {new Date(row.updatedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
      </span>
    ),
  },
];
