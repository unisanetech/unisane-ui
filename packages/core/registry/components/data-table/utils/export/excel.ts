import type { ExcelExportOptions, ExportResult } from "@/components/ui/data-table/utils/export/types";
import { prepareExportData, getCellValue, generateFilename } from "@/components/ui/data-table/utils/export/utils";

type XLSXModule = typeof import("xlsx");
type CellStyle = Record<string, unknown>;
type StyledCell = Record<string, unknown> & { s?: CellStyle };

let xlsxModule: XLSXModule | null = null;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function getStyledCell(
  worksheet: import("xlsx").WorkSheet,
  cellRef: string
): StyledCell | null {
  const worksheetRecord = worksheet as Record<string, unknown>;
  const cell = worksheetRecord[cellRef];
  if (!isRecord(cell)) return null;
  return cell as StyledCell;
}

function toArrayBuffer(value: unknown): ArrayBuffer | null {
  return value instanceof ArrayBuffer ? value : null;
}

async function loadXLSX(): Promise<XLSXModule> {
  if (xlsxModule) {
    return xlsxModule;
  }
  xlsxModule = await import("xlsx");
  return xlsxModule;
}

export async function exportToExcel<T extends { id: string }>(
  options: ExcelExportOptions<T>
): Promise<ExportResult> {
  const {
    filename,
    sheetName = "Sheet1",
    autoWidth = true,
    freezeHeader = true,
    styleHeader = true,
    zebraStripes = false,
    includeHeaders = true,
    formatValue,
  } = options;

  try {
    if (!options.data) {
      return { success: false, error: "No data provided for export" };
    }
    if (!options.columns) {
      return { success: false, error: "No columns provided for export" };
    }

    const XLSX = await loadXLSX();
    const { rows, columns } = prepareExportData(options);

    if (rows.length === 0) {
      return { success: false, error: "No data to export" };
    }

    if (columns.length === 0) {
      return { success: false, error: "No columns to export" };
    }

    const data: string[][] = [];

    if (includeHeaders) {
      data.push(columns.map((col) => col.header));
    }

    for (const row of rows) {
      const values = columns.map((col) => getCellValue(row, col, formatValue));
      data.push(values);
    }

    const worksheet = XLSX.utils.aoa_to_sheet(data);

    if (autoWidth) {
      const colWidths = columns.map((col) => {
        const maxLength = Math.max(
          col.header.length,
          ...rows.map((row) => getCellValue(row, col, formatValue).length)
        );
        return { wch: Math.min(maxLength + 2, 50) };
      });
      worksheet["!cols"] = colWidths;
    }

    if (freezeHeader && includeHeaders) {
      worksheet["!freeze"] = { xSplit: 0, ySplit: 1 };
    }

    if (styleHeader && includeHeaders) {
      for (let c = 0; c < columns.length; c++) {
        const cellRef = XLSX.utils.encode_cell({ r: 0, c });
        const cell = getStyledCell(worksheet, cellRef);
        if (cell) {
          cell.s = {
            font: { bold: true },
            fill: { fgColor: { rgb: "E0E0E0" } },
            alignment: { horizontal: "center" },
          };
        }
      }
    }

    if (zebraStripes) {
      const startRow = includeHeaders ? 1 : 0;
      for (let r = startRow; r < data.length; r++) {
        if ((r - startRow) % 2 === 1) {
          for (let c = 0; c < columns.length; c++) {
            const cellRef = XLSX.utils.encode_cell({ r, c });
            const cell = getStyledCell(worksheet, cellRef);
            if (cell) {
              cell.s = {
                ...(cell.s ?? {}),
                fill: { fgColor: { rgb: "F5F5F5" } },
              };
            }
          }
        }
      }
    }

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);

    const buffer = toArrayBuffer(
      XLSX.write(workbook, { type: "array", bookType: "xlsx" }) as unknown
    );
    if (!buffer) {
      return { success: false, error: "Failed to build Excel buffer" };
    }

    const blob = new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    const outputFilename = generateFilename(filename, "xlsx");
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = outputFilename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    return {
      success: true,
      rowCount: rows.length,
      fileSize: buffer.byteLength,
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to export Excel";
    console.error("Excel export failed:", error);
    return { success: false, error: message };
  }
}

export async function toExcelBlob<T extends { id: string }>(
  options: ExcelExportOptions<T>
): Promise<Blob> {
  const { sheetName = "Sheet1", includeHeaders = true, formatValue } = options;
  const XLSX = await loadXLSX();
  const { rows, columns } = prepareExportData(options);

  const data: string[][] = [];

  if (includeHeaders) {
    data.push(columns.map((col) => col.header));
  }

  for (const row of rows) {
    const values = columns.map((col) => getCellValue(row, col, formatValue));
    data.push(values);
  }

  const worksheet = XLSX.utils.aoa_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);

  const buffer = toArrayBuffer(
    XLSX.write(workbook, { type: "array", bookType: "xlsx" }) as unknown
  );
  if (!buffer) {
    throw new Error("Failed to build Excel buffer");
  }

  return new Blob([buffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });
}

export function isXLSXLoaded(): boolean {
  return xlsxModule !== null;
}

export async function preloadXLSX(): Promise<void> {
  await loadXLSX();
}
