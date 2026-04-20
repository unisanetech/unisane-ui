// ─── EXPORT MODULE ──────────────────────────────────────────────────────────
// Unified export functionality for DataTable
// Supports: CSV, Excel (.xlsx), PDF, JSON, HTML, and custom plugins

export * from "./types";
export { exportToCSV, toCSVString } from "./csv";
export { exportToExcel, toExcelBlob } from "./excel";
export { exportToPDF, toPDFBlob } from "./pdf";
export { exportToJSON, toJSONString } from "./json";
export { exportToHTML, toHTMLString } from "./html";

export { isXLSXLoaded, preloadXLSX } from "./excel";
export { isPDFLoaded, preloadPDF } from "./pdf";

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
} from "./plugins";

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
} from "./safe-export";

// ─── UNIFIED EXPORT FUNCTION ────────────────────────────────────────────────

import type { ExportConfig, ExportResult } from "./types";
import { exportToCSV } from "./csv";
import { exportToJSON } from "./json";
import { exportToHTML } from "./html";
import { exportToExcel } from "./excel";
import { exportToPDF } from "./pdf";

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
