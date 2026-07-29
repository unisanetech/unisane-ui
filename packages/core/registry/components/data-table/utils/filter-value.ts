import type { FilterValue } from '@/components/ui/data-table/types';

export function formatFilterValue(filter: FilterValue): string {
  switch (filter.type) {
    case 'text':
    case 'number':
    case 'date':
    case 'select':
    case 'boolean':
      return String(filter.value);
    case 'number-range':
      return formatRange(filter.min, filter.max);
    case 'date-range':
      return formatRange(filter.start, filter.end);
    case 'multi-select':
      return filter.values.join(', ');
  }
}

function formatRange(
  start: string | number | Date | undefined,
  end: string | number | Date | undefined,
): string {
  return `${start === undefined ? '…' : String(start)} – ${end === undefined ? '…' : String(end)}`;
}
