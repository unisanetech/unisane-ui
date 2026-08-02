import type { Density } from '../constants';
import type { ExpandedRowPresentation } from '../types/config';

interface ExpandedRowPresentationClasses {
  container: string;
  content?: string;
}

const DETAIL_PADDING: Record<Density, string> = {
  dense: 'px-3 py-2',
  compact: 'px-4 py-3',
  standard: 'px-5 py-4',
  comfortable: 'px-6 py-5',
};

const PANEL_INSET: Record<Density, string> = {
  dense: 'p-2',
  compact: 'p-3',
  standard: 'p-4',
  comfortable: 'p-5',
};

const PANEL_PADDING: Record<Density, string> = {
  dense: 'p-3',
  compact: 'p-4',
  standard: 'p-5',
  comfortable: 'p-6',
};

export function getExpandedRowPresentationClasses(
  presentation: ExpandedRowPresentation,
  density: Density,
): ExpandedRowPresentationClasses {
  if (presentation === 'bare') {
    return { container: 'bg-surface' };
  }

  if (presentation === 'panel') {
    return {
      container: `bg-surface-container-lowest ${PANEL_INSET[density]}`,
      content: `border-outline-weak bg-surface rounded-md border ${PANEL_PADDING[density]}`,
    };
  }

  return {
    container: `bg-surface ${DETAIL_PADDING[density]}`,
  };
}
