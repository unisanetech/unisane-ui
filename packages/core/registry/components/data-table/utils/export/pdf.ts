import type { PDFExportOptions, ExportResult } from "@/components/ui/data-table/utils/export/types";
import { prepareExportData, getCellValue, generateFilename } from "@/components/ui/data-table/utils/export/utils";

type JsPDFModule = typeof import("jspdf");
type AutoTableModule = typeof import("jspdf-autotable");

let jspdfModule: JsPDFModule | null = null;
let autoTableModule: AutoTableModule | null = null;

async function loadPDFLibraries(): Promise<{
  jsPDF: JsPDFModule["jsPDF"];
  autoTable: AutoTableModule["default"];
}> {
  if (!jspdfModule || !autoTableModule) {
    const [jspdf, autotable] = await Promise.all([
      import("jspdf"),
      import("jspdf-autotable"),
    ]);
    jspdfModule = jspdf;
    autoTableModule = autotable;
  }

  return {
    jsPDF: jspdfModule.jsPDF,
    autoTable: autoTableModule.default,
  };
}

export async function exportToPDF<T extends { id: string }>(
  options: PDFExportOptions<T>
): Promise<ExportResult> {
  const {
    filename,
    orientation = "portrait",
    pageSize = "a4",
    title,
    showPageNumbers = true,
    headerColor = "#6750A4",
    alternateRowColor = "#F5F5F5",
    fontSize = 10,
    includeTimestamp = true,
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

    const { jsPDF, autoTable } = await loadPDFLibraries();
    const { rows, columns } = prepareExportData(options);

    if (rows.length === 0) {
      return { success: false, error: "No data to export" };
    }

    if (columns.length === 0) {
      return { success: false, error: "No columns to export" };
    }

    const doc = new jsPDF({
      orientation,
      unit: "mm",
      format: pageSize,
    });

    let startY = 15;
    if (title) {
      doc.setFontSize(16);
      doc.setFont("helvetica", "bold");
      doc.text(title, 14, startY);
      startY += 10;
    }

    const headers = includeHeaders ? [columns.map((col) => col.header)] : [];
    const body = rows.map((row) =>
      columns.map((col) => getCellValue(row, col, formatValue))
    );

    const parseColor = (hex: string): [number, number, number] => {
      const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
      if (result) {
        return [
          parseInt(result[1]!, 16),
          parseInt(result[2]!, 16),
          parseInt(result[3]!, 16),
        ];
      }
      return [103, 80, 164];
    };

    autoTable(doc, {
      head: headers,
      body,
      startY,
      styles: {
        fontSize,
        cellPadding: 3,
        overflow: "linebreak",
        halign: "left",
      },
      headStyles: {
        fillColor: parseColor(headerColor),
        textColor: [255, 255, 255],
        fontStyle: "bold",
      },
      alternateRowStyles: {
        fillColor: parseColor(alternateRowColor),
      },
      margin: { top: 15, right: 14, bottom: 20, left: 14 },
      didDrawPage: (data) => {
        if (showPageNumbers) {
          const pageCount = doc.getNumberOfPages();
          doc.setFontSize(8);
          doc.setFont("helvetica", "normal");
          const pageText = `Page ${data.pageNumber} of ${pageCount}`;
          const pageWidth = doc.internal.pageSize.getWidth();
          doc.text(pageText, pageWidth - 25, doc.internal.pageSize.getHeight() - 10);
        }

        if (includeTimestamp && data.pageNumber === 1) {
          doc.setFontSize(8);
          doc.setFont("helvetica", "normal");
          const timestamp = `Generated: ${new Date().toLocaleString()}`;
          doc.text(timestamp, 14, doc.internal.pageSize.getHeight() - 10);
        }
      },
    });

    const outputFilename = generateFilename(filename, "pdf");
    doc.save(outputFilename);

    return {
      success: true,
      rowCount: rows.length,
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to export PDF";
    console.error("PDF export failed:", error);
    return { success: false, error: message };
  }
}

export async function toPDFBlob<T extends { id: string }>(
  options: PDFExportOptions<T>
): Promise<Blob> {
  const {
    orientation = "portrait",
    pageSize = "a4",
    title,
    headerColor = "#6750A4",
    alternateRowColor = "#F5F5F5",
    fontSize = 10,
    includeHeaders = true,
    formatValue,
  } = options;

  const { jsPDF, autoTable } = await loadPDFLibraries();
  const { rows, columns } = prepareExportData(options);

  const doc = new jsPDF({
    orientation,
    unit: "mm",
    format: pageSize,
  });

  let startY = 15;
  if (title) {
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.text(title, 14, startY);
    startY += 10;
  }

  const headers = includeHeaders ? [columns.map((col) => col.header)] : [];
  const body = rows.map((row) =>
    columns.map((col) => getCellValue(row, col, formatValue))
  );

  const parseColor = (hex: string): [number, number, number] => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    if (result) {
      return [
        parseInt(result[1]!, 16),
        parseInt(result[2]!, 16),
        parseInt(result[3]!, 16),
      ];
    }
    return [103, 80, 164];
  };

  autoTable(doc, {
    head: headers,
    body,
    startY,
    styles: { fontSize, cellPadding: 3, overflow: "linebreak", halign: "left" },
    headStyles: {
      fillColor: parseColor(headerColor),
      textColor: [255, 255, 255],
      fontStyle: "bold",
    },
    alternateRowStyles: { fillColor: parseColor(alternateRowColor) },
    margin: { top: 15, right: 14, bottom: 20, left: 14 },
  });

  return doc.output("blob");
}

export function isPDFLoaded(): boolean {
  return jspdfModule !== null && autoTableModule !== null;
}

export async function preloadPDF(): Promise<void> {
  await loadPDFLibraries();
}
