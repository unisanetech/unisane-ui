'use client';

import React, {
  cloneElement,
  isValidElement,
  useCallback,
  useEffect,
  useId,
  useMemo as useReactMemo,
  useMemo,
  useRef,
  useState,
} from 'react';
import type { DocsBlock, DocsBlockCanvasHeight, DocsBlockViewport } from '@/lib/docs/blocks/types';
import { cn } from '@unisane/ui/lib/utils';
import { SegmentedButton, Typography } from '@unisane/ui';
import { CodeBlock } from '@/features/docs-page/components/code-block';

interface BlockPreviewShellProps {
  block: DocsBlock;
  className?: string;
}

const DEFAULT_VIEWPORT_WIDTHS: Record<DocsBlockViewport, number> = {
  desktop: 1440,
  tablet: 920,
  mobile: 420,
};

const MIN_VIEWPORT_WIDTH: Record<DocsBlockViewport, number> = {
  desktop: 840,
  tablet: 600,
  mobile: 320,
};

const VIEWPORT_LABELS: Record<DocsBlockViewport, string> = {
  desktop: 'Desktop',
  tablet: 'Tablet',
  mobile: 'Mobile',
};

const BREAKPOINTS = [
  { key: 'mobile', minWidth: 0, label: 'Mobile', widthClass: 'w-[40rem]' },
  { key: 'sm', minWidth: 640, label: 'sm', widthClass: 'w-32' },
  { key: 'md', minWidth: 768, label: 'md', widthClass: 'w-40' },
  { key: 'lg', minWidth: 1024, label: 'lg', widthClass: 'w-40' },
  { key: 'xl', minWidth: 1280, label: 'xl', widthClass: 'w-40' },
] as const;

function getViewportWidth(
  viewport: DocsBlockViewport,
  containerWidth: number,
  previewShell?: DocsBlock['previewShell'],
) {
  const configuredWidth = previewShell?.viewportWidths?.[viewport];
  const targetWidth = configuredWidth ?? DEFAULT_VIEWPORT_WIDTHS[viewport];
  const horizontalBuffer = containerWidth >= 768 ? 64 : 24;
  const maxWidth = Math.max(MIN_VIEWPORT_WIDTH.mobile, containerWidth - horizontalBuffer);

  return Math.min(targetWidth, maxWidth);
}

export function BlockPreviewShell({ block, className }: BlockPreviewShellProps) {
  const [activeTab, setActiveTab] = useState<'preview' | 'code'>('preview');
  const previewShell = block.previewShell;
  const canvasHeight = previewShell?.canvasHeight ?? 'screen';
  const defaultViewport = previewShell?.defaultViewport ?? 'desktop';
  const [containerWidth, setContainerWidth] = useState(0);
  const [resizeTrackWidth, setResizeTrackWidth] = useState(0);
  const [viewportWidth, setViewportWidth] = useState<number | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const frameRef = useRef<HTMLDivElement | null>(null);
  const resizeTrackRef = useRef<HTMLDivElement | null>(null);
  const resizeRafRef = useRef<number | null>(null);
  const pendingWidthRef = useRef<number | null>(null);
  const rawPatternId = useId();
  const dotPatternId = useReactMemo(
    () => `block-preview-dot-${rawPatternId.replace(/[^a-zA-Z0-9_-]/g, '')}`,
    [rawPatternId],
  );

  const viewportOptions = previewShell?.viewportOptions ?? ['desktop', 'tablet', 'mobile'];
  const resizable = previewShell?.resizable ?? true;
  const canvasInset = previewShell?.canvasInset ?? 'sm';
  const canvasInsetClass = {
    none: 'p-0',
    sm: 'p-3',
    md: 'p-4',
    lg: 'p-5',
  } as const;
  const canvasHeightClass: Record<DocsBlockCanvasHeight, string> = {
    md: 'h-[32rem]',
    lg: 'h-[40rem]',
    xl: 'h-[48rem]',
    screen: 'h-[calc(100svh-10rem)]',
    'screen-tall': 'h-[calc(100svh-7rem)]',
    'screen-max': 'h-[calc(100svh-5.5rem)]',
  };

  const currentWidth = viewportWidth ?? getViewportWidth(defaultViewport, containerWidth, previewShell);
  const effectiveViewport: DocsBlockViewport = useMemo(() => {
    if (currentWidth >= MIN_VIEWPORT_WIDTH.desktop) return 'desktop';
    if (currentWidth >= MIN_VIEWPORT_WIDTH.tablet) return 'tablet';
    return 'mobile';
  }, [currentWidth]);
  const activeBreakpoint = useMemo(() => {
    for (let index = 0; index < BREAKPOINTS.length; index += 1) {
      const current = BREAKPOINTS[index];
      if (!current) continue;
      const next = BREAKPOINTS[index + 1];
      const inRange = next
        ? currentWidth >= current.minWidth && currentWidth < next.minWidth
        : currentWidth >= current.minWidth;
      if (inRange) return current.key;
    }
    return 'mobile';
  }, [currentWidth]);

  const getMaxViewportWidth = useCallback(() => {
    const fallbackWidth = Math.max(MIN_VIEWPORT_WIDTH.mobile, containerWidth - 24);
    const trackWidth = resizeTrackWidth > 0 ? resizeTrackWidth : fallbackWidth;
    return Math.max(MIN_VIEWPORT_WIDTH.mobile, trackWidth - 2);
  }, [containerWidth, resizeTrackWidth]);

  useEffect(() => {
    if (activeTab !== 'preview') return;

    const frameNode = frameRef.current;
    const trackNode = resizeTrackRef.current;
    if (!frameNode || !trackNode) return;

    const update = () => {
      setContainerWidth(frameNode.clientWidth);
      setResizeTrackWidth(trackNode.clientWidth);
    };

    update();

    const observer = new ResizeObserver(() => update());
    observer.observe(frameNode);
    observer.observe(trackNode);

    return () => observer.disconnect();
  }, [activeTab]);

  useEffect(() => {
    return () => {
      if (resizeRafRef.current !== null) {
        window.cancelAnimationFrame(resizeRafRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (containerWidth === 0) return;
    const maxWidth = getMaxViewportWidth();
    setViewportWidth((previous) => {
      if (previous === null) {
        return getViewportWidth(defaultViewport, containerWidth, previewShell);
      }
      return Math.min(maxWidth, Math.max(MIN_VIEWPORT_WIDTH.mobile, previous));
    });
  }, [containerWidth, defaultViewport, getMaxViewportWidth, previewShell]);

  const startResize = useCallback(
    (event: React.PointerEvent<HTMLButtonElement>) => {
      if (!resizable || containerWidth === 0) return;
      const trackNode = resizeTrackRef.current;
      if (!trackNode) return;

      event.preventDefault();
      event.stopPropagation();
      event.currentTarget.setPointerCapture?.(event.pointerId);
      const startX = event.clientX;
      const startWidth = currentWidth;
      const maxWidth = getMaxViewportWidth();
      const minWidth = MIN_VIEWPORT_WIDTH.mobile;
      const previousCursor = document.body.style.cursor;
      const previousUserSelect = document.body.style.userSelect;

      const scheduleWidthUpdate = (nextWidth: number) => {
        pendingWidthRef.current = nextWidth;
        if (resizeRafRef.current !== null) return;
        resizeRafRef.current = window.requestAnimationFrame(() => {
          resizeRafRef.current = null;
          if (pendingWidthRef.current !== null) {
            setViewportWidth(pendingWidthRef.current);
          }
        });
      };

      const updateWidthFromPointer = (clientX: number) => {
        const nextWidth = startWidth + (clientX - startX);
        const clampedWidth = Math.max(minWidth, Math.min(maxWidth, nextWidth));
        scheduleWidthUpdate(clampedWidth);
      };

      const handleMove = (moveEvent: PointerEvent) => {
        updateWidthFromPointer(moveEvent.clientX);
      };

      const endResize = () => {
        setIsDragging(false);
        document.body.style.cursor = previousCursor;
        document.body.style.userSelect = previousUserSelect;
        pendingWidthRef.current = null;
        if (resizeRafRef.current !== null) {
          window.cancelAnimationFrame(resizeRafRef.current);
          resizeRafRef.current = null;
        }
        window.removeEventListener('pointermove', handleMove);
        window.removeEventListener('pointerup', endResize);
        window.removeEventListener('pointercancel', endResize);
      };

      setIsDragging(true);
      document.body.style.cursor = 'ew-resize';
      document.body.style.userSelect = 'none';
      updateWidthFromPointer(event.clientX);
      window.addEventListener('pointermove', handleMove, { passive: true });
      window.addEventListener('pointerup', endResize);
      window.addEventListener('pointercancel', endResize);
    },
    [containerWidth, currentWidth, getMaxViewportWidth, resizable],
  );

  const previewNode = useMemo(() => {
    if (!isValidElement(block.preview)) {
      return block.preview;
    }

    return cloneElement(block.preview as React.ReactElement<Record<string, unknown>>, {
      viewport: effectiveViewport,
    });
  }, [block.preview, effectiveViewport]);

  return (
    <div className={cn('space-y-4', className)}>
      <div className="border-outline-variant flex flex-col gap-3 border-b pb-4 @3xl:flex-row @3xl:items-center @3xl:justify-between">
        <div className="flex items-center">
          <SegmentedButton
            options={[
              { value: 'preview', label: 'Preview' },
              { value: 'code', label: 'Code' },
            ]}
            value={activeTab}
            onValueChange={(value) => setActiveTab(value as 'preview' | 'code')}
            size="sm"
          />
        </div>

        {activeTab === 'preview' && viewportOptions.length > 0 && (
          <Typography variant="labelMedium" className="text-on-surface-variant font-mono">
            Drag to resize · {VIEWPORT_LABELS[effectiveViewport]}
          </Typography>
        )}
      </div>

      {activeTab === 'preview' ? (
        <div
          ref={frameRef}
          className={cn(
            'border-outline-muted bg-surface-container-low relative overflow-auto rounded-sm border',
            canvasHeightClass[canvasHeight],
          )}
        >
            <div className="text-outline-medium absolute inset-0 opacity-45">
              <svg className="h-full w-full" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <pattern
                    id={dotPatternId}
                    x="5"
                    y="5"
                    width="12"
                    height="12"
                    patternUnits="userSpaceOnUse"
                  >
                    <circle
                      cx="2"
                      cy="2"
                      r="1"
                      fill="currentColor"
                    />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill={`url(#${dotPatternId})`} />
              </svg>
            </div>
            <div className={cn('relative box-border flex h-full flex-col', canvasInsetClass[canvasInset])}>
              <div className="mb-2 hidden h-9 w-full overflow-hidden @2xl:flex">
                {BREAKPOINTS.map((breakpoint, index) => {
                  const isActive = activeBreakpoint === breakpoint.key;
                  return (
                    <div
                      key={breakpoint.key}
                      className={cn(
                        'border-outline-variant relative flex h-full items-center justify-between border-l px-6 text-sm',
                        breakpoint.widthClass,
                        index === 0 && 'border-l',
                      )}
                    >
                      <span
                        className={cn(
                          'font-mono text-xs transition-colors',
                          isActive ? 'text-primary font-semibold' : 'text-on-surface-variant',
                        )}
                      >
                        {breakpoint.label}
                      </span>
                      <span
                        className={cn(
                          'ml-2 font-mono text-xs transition-opacity',
                          isActive ? 'text-primary opacity-80' : 'pointer-events-none opacity-0',
                        )}
                      >
                        {Math.round(currentWidth)}px
                      </span>
                    </div>
                  );
                })}
                <div className="border-outline-variant flex h-full items-center border-l px-4">
                  <span className="font-mono text-xs text-on-surface-variant">x1</span>
                </div>
              </div>

              <div ref={resizeTrackRef} className="flex min-h-0 flex-1 items-start justify-start">
                <div
                  className="relative flex h-full max-w-full items-stretch justify-center"
                  style={{ width: currentWidth }}
                >
                  <div className="border-outline-variant bg-surface h-full min-h-0 w-full overflow-hidden rounded-sm border">
                    <div className="h-full w-full overflow-auto">{previewNode}</div>
                  </div>

                  {resizable && containerWidth > 0 && (
                    <button
                      type="button"
                      aria-label="Resize preview"
                      onPointerDown={startResize}
                      style={{ touchAction: 'none' }}
                      className={cn(
                        'absolute right-[-11px] top-0 hidden h-full w-6 cursor-ew-resize items-center justify-center bg-transparent @3xl:flex',
                      )}
                    >
                      <span
                        className={cn(
                          'bg-outline-medium h-12 w-1.5 rounded-full transition-colors',
                          isDragging && 'bg-primary',
                        )}
                      />
                    </button>
                  )}
                </div>
              </div>
            </div>
        </div>
      ) : (
        <CodeBlock code={block.code} language="tsx" />
      )}
    </div>
  );
}
