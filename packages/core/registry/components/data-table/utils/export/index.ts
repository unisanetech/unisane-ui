// ─── EXPORT MODULE ──────────────────────────────────────────────────────────
// Unified export functionality for DataTable
// Supports: CSV, Excel (.xlsx), PDF, JSON, HTML, and custom plugins

export * from "@/components/ui/data-table/utils/export/types";
export { exportToCSV, toCSVString } from "@/components/ui/data-table/utils/export/csv";
export { exportToExcel, toExcelBlob } from "@/components/ui/data-table/utils/export/excel";
export { exportToPDF, toPDFBlob } from "@/components/ui/data-table/utils/export/pdf";
export { exportToJSON, toJSONString } from "@/components/ui/data-table/utils/export/json";
export { exportToHTML, toHTMLString } from "@/components/ui/data-table/utils/export/html";

export { isXLSXLoaded, preloadXLSX } from "@/components/ui/data-table/utils/export/excel";
export { isPDFLoaded, preloadPDF } from "@/components/ui/data-table/utils/export/pdf";

// ─── PLUGIN SYSTEM ─────────────────────────────────────────────────────────
export {
  // Registry
  getExportPluginRegistry,
  createExportPluginRegistry,
  ExportPluginRegistry,
  // Data preparation
  preparePluginExportData,
  // Export functions
  exportWithPlugin,
  pluginToString,
  // Hook
  useExportPlugins,
  // Plugin creators
  createTextPlugin,
  createBinaryPlugin,
  // Types
  type ExportCellValue,
  type ExportData,
  type ExportMetadata,
  type ExportPlugin,
  type ExportPluginBaseOptions,
  type ExportPluginResult,
  type ValidationResult,
  type PluginRegistryConfig,
  type ExportWithPluginOptions,
  type ExportWithPluginResult,
  type UseExportPluginsOptions,
  type UseExportPluginsReturn,
} from "@/components/ui/data-table/utils/export/plugins";

// ─── SAFE EXPORT (with error handling) ─────────────────────────────────────
export {
  safeExport,
  safeExportCSV,
  safeExportJSON,
  safeExportExcel,
  safeExportWithRetry,
  safeBatchExport,
  type SafeExportResult,
  type SafeExportOptions,
} from "@/components/ui/data-table/utils/export/safe-export";

// ─── UNIFIED EXPORT FUNCTION ────────────────────────────────────────────────

import type { ExportConfig, ExportResult } from "@/components/ui/data-table/utils/export/types";
import { exportToCSV } from "@/components/ui/data-table/utils/export/csv";
import { exportToJSON } from "@/components/ui/data-table/utils/export/json";
import { exportToHTML } from "@/components/ui/data-table/utils/export/html";
import { exportToExcel } from "@/components/ui/data-table/utils/export/excel";
import { exportToPDF } from "@/components/ui/data-table/utils/export/pdf";

/**
 * Unified export function that handles all formats
 *
 * @example
 * ```tsx
 * // Export to CSV
 * exportData({ format: "csv", data, columns, filename: "users" });
 *
 * // Export to Excel with options
 * exportData({
 *   format: "excel",
 *   data,
 *   columns,
 *   filename: "report",
 *   autoWidth: true,
 *   freezeHeader: true,
 * });
 *
 * // Export to PDF with title
 * exportData({
 *   format: "pdf",
 *   data,
 *   columns,
 *   title: "Monthly Report",
 *   orientation: "landscape",
 * });
 *
 * // Export selected rows only
 * exportData({
 *   format: "csv",
 *   data,
 *   columns,
 *   selectedOnly: true,
 *   selectedIds: new Set(["1", "2", "3"]),
 * });
 * ```
 */
export async function exportData<T extends { id: string }>(
  config: ExportConfig<T>
): Promise<ExportResult> {
  switch (config.format) {
    case "csv":
      return exportToCSV(config);
    case "excel":
      return exportToExcel(config);
    case "pdf":
      return exportToPDF(config);
    case "json":
      return exportToJSON(config);
    case "html":
      return exportToHTML(config);
    default: {
      const exhaustiveCheck: never = config;
      return { success: false, error: `Unknown format: ${exhaustiveCheck}` };
    }
  }
}
