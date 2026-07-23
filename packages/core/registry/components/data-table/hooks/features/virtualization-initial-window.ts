export interface InitialVirtualWindowOptions {
  containerSize: number | undefined;
  estimateSize: number;
  overscan: number;
  fallbackViewportItems?: number;
}

const DEFAULT_FALLBACK_VIEWPORT_ITEMS = 10;

export function getInitialVirtualWindowSize({
  containerSize,
  estimateSize,
  overscan,
  fallbackViewportItems = DEFAULT_FALLBACK_VIEWPORT_ITEMS,
}: InitialVirtualWindowOptions): number {
  const safeEstimateSize = Math.max(1, estimateSize);
  const viewportSize =
    typeof containerSize === 'number' && containerSize > 0
      ? containerSize
      : safeEstimateSize * fallbackViewportItems;

  return Math.max(1, Math.ceil(viewportSize / safeEstimateSize) + overscan * 2);
}
