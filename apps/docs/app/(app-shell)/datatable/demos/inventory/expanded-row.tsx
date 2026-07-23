'use client';

import { Icon } from '@unisane/ui/icon';
import { Button } from '@unisane/ui/button';
import { Divider } from '@unisane/ui/divider';
import type { InventoryItem } from './types';

// ─── STAT CARD ────────────────────────────────────────────────────────────────

function StatCard({
  label,
  value,
  icon,
  trend,
}: {
  label: string;
  value: string;
  icon: string;
  trend?: { value: number; isPositive: boolean };
}) {
  return (
    <div className="bg-surface-container flex items-center gap-3 rounded-md p-3">
      <div className="bg-state-selected flex h-10 w-10 items-center justify-center rounded-full">
        <Icon symbol={icon} className="text-primary text-[20px]" />
      </div>
      <div className="flex flex-col">
        <span className="text-label-small text-on-surface-variant">{label}</span>
        <div className="flex items-center gap-2">
          <span className="text-title-medium text-on-surface font-medium">{value}</span>
          {trend && (
            <span
              className={`text-label-small flex items-center ${trend.isPositive ? 'text-primary' : 'text-error'}`}
            >
              <Icon
                symbol={trend.isPositive ? 'trending_up' : 'trending_down'}
                className="text-[14px]"
              />
              {trend.value}%
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── INFO ROW ─────────────────────────────────────────────────────────────────

function InfoRow({
  label,
  value,
  icon,
}: {
  label: string;
  value: string | React.ReactNode;
  icon?: string;
}) {
  return (
    <div className="flex items-center justify-between py-2">
      <div className="text-on-surface-variant flex items-center gap-2">
        {icon && <Icon symbol={icon} className="text-[18px]" />}
        <span className="text-label-medium">{label}</span>
      </div>
      <span className="text-body-medium text-on-surface font-medium">{value}</span>
    </div>
  );
}

// ─── EXPANDED ROW CONTENT ─────────────────────────────────────────────────────

export function InventoryExpandedRow({ row }: { row: InventoryItem }) {
  const profitMargin = (((row.sellingPrice - row.costPrice) / row.costPrice) * 100).toFixed(1);
  const daysOfStock =
    row.avgMonthlySales > 0 ? Math.round((row.currentStock / row.avgMonthlySales) * 30) : 0;

  return (
    <div className="bg-surface-container-low p-4">
      {/* Stats Row */}
      <div className="mb-4 grid grid-cols-2 gap-3 md:grid-cols-4">
        <StatCard
          label="Total Revenue"
          value={`₹${row.totalRevenue.toLocaleString()}`}
          icon="payments"
          trend={{ value: 12, isPositive: true }}
        />
        <StatCard
          label="Units Sold"
          value={row.totalSold.toLocaleString()}
          icon="shopping_cart"
          trend={{ value: 8, isPositive: true }}
        />
        <StatCard label="Profit Margin" value={`${profitMargin}%`} icon="trending_up" />
        <StatCard
          label="Days of Stock"
          value={daysOfStock.toString()}
          icon="inventory"
          trend={daysOfStock < 15 ? { value: daysOfStock, isPositive: false } : undefined}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {/* Product Details */}
        <div className="bg-surface border-outline-variant rounded-md border p-4">
          <h4 className="text-title-small text-on-surface mb-3 flex items-center gap-2 font-medium">
            <Icon symbol="info" className="text-primary text-[18px]" />
            Product Details
          </h4>
          <div className="space-y-1">
            <InfoRow label="SKU" value={row.sku} />
            <InfoRow
              label="Barcode"
              value={<span className="text-label-medium font-mono">{row.barcode}</span>}
            />
            <InfoRow label="HSN Code" value={row.hsnCode} />
            <InfoRow label="Brand" value={row.brand} />
            <InfoRow label="Unit" value={row.unit} />
            {row.expiryDate && (
              <InfoRow
                label="Expiry Date"
                value={new Date(row.expiryDate).toLocaleDateString('en-IN', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric',
                })}
              />
            )}
          </div>
        </div>

        {/* Pricing & Tax */}
        <div className="bg-surface border-outline-variant rounded-md border p-4">
          <h4 className="text-title-small text-on-surface mb-3 flex items-center gap-2 font-medium">
            <Icon symbol="currency_rupee" className="text-primary text-[18px]" />
            Pricing & Tax
          </h4>
          <div className="space-y-1">
            <InfoRow label="Cost Price" value={`₹${row.costPrice.toLocaleString()}`} />
            <InfoRow label="Selling Price" value={`₹${row.sellingPrice.toLocaleString()}`} />
            <InfoRow label="MRP" value={`₹${row.mrp.toLocaleString()}`} />
            <Divider className="my-2" />
            <InfoRow label="Discount" value={`${row.discount}%`} />
            <InfoRow label="Tax Rate (GST)" value={`${row.taxRate}%`} />
            <InfoRow
              label="Tax Amount"
              value={`₹${((row.sellingPrice * row.taxRate) / 100).toFixed(2)}`}
            />
          </div>
        </div>

        {/* Stock & Supplier */}
        <div className="bg-surface border-outline-variant rounded-md border p-4">
          <h4 className="text-title-small text-on-surface mb-3 flex items-center gap-2 font-medium">
            <Icon symbol="inventory_2" className="text-primary text-[18px]" />
            Stock & Supplier
          </h4>
          <div className="space-y-1">
            <InfoRow label="Current Stock" value={`${row.currentStock} ${row.unit}`} />
            <InfoRow label="Min Level" value={`${row.minStockLevel} ${row.unit}`} />
            <InfoRow label="Max Level" value={`${row.maxStockLevel} ${row.unit}`} />
            <InfoRow label="Reorder Point" value={`${row.reorderPoint} ${row.unit}`} />
            <Divider className="my-2" />
            <InfoRow label="Supplier" value={row.supplierName} />
            <InfoRow label="Lead Time" value={`${row.leadTimeDays} days`} />
            <InfoRow label="Location" value={`${row.warehouseLocation}`} />
            <InfoRow label="Shelf" value={row.shelfNumber} />
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="border-outline-variant mt-4 flex items-center justify-end gap-2 border-t pt-4">
        <Button variant="text" leadingIcon={<Icon symbol="history" />}>
          Stock History
        </Button>
        <Button variant="text" leadingIcon={<Icon symbol="print" />}>
          Print Label
        </Button>
        <Button variant="tonal" leadingIcon={<Icon symbol="edit" />}>
          Edit Item
        </Button>
        {row.currentStock <= row.reorderPoint && (
          <Button variant="filled" leadingIcon={<Icon symbol="add_shopping_cart" />}>
            Create Purchase Order
          </Button>
        )}
      </div>
    </div>
  );
}
