'use client';

import React, { useCallback } from 'react';
import { cn } from '@unisane/ui/utils';
import { Icon } from '@unisane/ui/icon';
import { IconButton } from '@unisane/ui/icon-button';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@unisane/ui/dropdown-menu';
import type { ExportFormat, ExportResult } from '../../utils/export';
import type { ExportHandler } from './types';
import { ToolbarDropdownButton, SegmentedDropdownButton } from './buttons';
import { useI18n } from '../../i18n';
import { useFeedback } from '../../feedback';

// ─── EXPORT FORMAT CONFIG ───────────────────────────────────────────────────

interface FormatConfig {
  labelKey: 'exportCsv' | 'exportExcel' | 'exportPdf' | 'exportJson' | 'exportHtml';
  icon: string;
  descriptionKey:
    | 'exportCsvDesc'
    | 'exportExcelDesc'
    | 'exportPdfDesc'
    | 'exportJsonDesc'
    | 'exportHtmlDesc';
}

const FORMAT_CONFIG: Record<ExportFormat, FormatConfig> = {
  csv: {
    labelKey: 'exportCsv',
    icon: 'csv',
    descriptionKey: 'exportCsvDesc',
  },
  excel: {
    labelKey: 'exportExcel',
    icon: 'table_chart',
    descriptionKey: 'exportExcelDesc',
  },
  pdf: {
    labelKey: 'exportPdf',
    icon: 'picture_as_pdf',
    descriptionKey: 'exportPdfDesc',
  },
  json: {
    labelKey: 'exportJson',
    icon: 'data_object',
    descriptionKey: 'exportJsonDesc',
  },
  html: {
    labelKey: 'exportHtml',
    icon: 'code',
    descriptionKey: 'exportHtmlDesc',
  },
};

const DEFAULT_FORMATS: ExportFormat[] = ['csv', 'excel', 'pdf', 'json'];

function isExportResult(value: unknown): value is ExportResult {
  return typeof value === 'object' && value !== null && 'success' in value;
}

// ─── EXPORT DROPDOWN ────────────────────────────────────────────────────────

export interface ExportDropdownProps {
  handler: ExportHandler;
  segmented?: boolean;
  /** Icon-only mode for mobile */
  compact?: boolean;
  isFirst?: boolean;
  isLast?: boolean;
}

export function ExportDropdown({
  handler,
  segmented = false,
  compact = false,
  isFirst = false,
  isLast = false,
}: ExportDropdownProps) {
  const { t } = useI18n();
  const { feedback } = useFeedback();
  const { onExport, formats = DEFAULT_FORMATS, exporting } = handler;

  const isExporting = exporting !== null && exporting !== undefined;
  const iconSymbol = isExporting ? 'hourglass_empty' : 'download';

  // Wrap onExport to add feedback
  const handleExport = useCallback(
    async (format: ExportFormat) => {
      try {
        feedback('exportStarted', { format: format.toUpperCase() });
        const result = await onExport(format);
        if (isExportResult(result) && !result.success) {
          feedback('exportFailed');
          return;
        }
        feedback('exportSuccess', { format: format.toUpperCase() });
      } catch {
        feedback('exportFailed');
      }
    },
    [onExport, feedback],
  );

  const trigger = segmented ? (
    <SegmentedDropdownButton icon={iconSymbol} isFirst={isFirst} isLast={isLast} />
  ) : compact ? (
    <IconButton
      variant="standard"
      size="md"
      aria-label={t('export')}
      className={cn(isExporting && 'animate-pulse')}
      icon={<Icon symbol={iconSymbol} />}
    />
  ) : (
    <ToolbarDropdownButton label={t('export')} icon={iconSymbol} />
  );

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>{trigger}</DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-56">
        {formats.map((format) => {
          const config = FORMAT_CONFIG[format];
          const isCurrentExporting = exporting === format;

          return (
            <DropdownMenuItem
              key={format}
              onClick={() => handleExport(format)}
              disabled={isExporting}
              icon={
                isCurrentExporting ? (
                  <Icon symbol="hourglass_empty" className="h-5 w-5 animate-spin" />
                ) : (
                  <Icon symbol={config.icon} className="h-5 w-5" />
                )
              }
            >
              <div className="flex flex-col">
                <span>{t(config.labelKey)}</span>
                <span className="text-label-small text-on-surface-variant">
                  {t(config.descriptionKey)}
                </span>
              </div>
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
