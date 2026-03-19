'use client';

import React, {
  cloneElement,
  isValidElement,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import type { DocsBlock, DocsBlockCanvasHeight, DocsBlockViewport } from '@/lib/docs/blocks/types';
import { cn } from '@unisane/ui/lib/utils';
import { SegmentedButton, SegmentedButtonItem, useTheme } from '@unisane/ui';
import { BlockCodeExplorer } from './block-code-explorer';
import { PreviewThemeScope } from './preview-theme-scope';

interface BlockPreviewShellProps {
  block: DocsBlock;
  className?: string;
}

const DEFAULT_VIEWPORT_WIDTHS: Record<DocsBlockViewport, number> = {
  desktop: 1280,
  tablet: 820,
  mobile: 390,
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

const VIEWPORT_ICONS: Record<DocsBlockViewport, string> = {
  desktop: 'desktop_windows',
  tablet: 'tablet_mac',
  mobile: 'phone_iphone',
};

const BREAKPOINTS = [
  { key: 'sm', minWidth: 640, label: 'sm', widthClass: 'w-32' },
  { key: 'md', minWidth: 768, label: 'md', widthClass: 'w-40' },
  { key: 'lg', minWidth: 1024, label: 'lg', widthClass: 'w-40' },
  { key: 'xl', minWidth: 1280, label: 'xl', widthClass: 'w-40' },
] as const;

function getPresetViewportWidth(
  viewport: DocsBlockViewport,
  previewShell?: DocsBlock['previewShell'],
) {
  const configuredWidth = previewShell?.viewportWidths?.[viewport];
  return configuredWidth ?? DEFAULT_VIEWPORT_WIDTHS[viewport];
}

function getClampedViewportWidth(
  viewport: DocsBlockViewport,
  containerWidth: number,
  previewShell?: DocsBlock['previewShell'],
) {
  const targetWidth = getPresetViewportWidth(viewport, previewShell);
  const horizontalBuffer = containerWidth >= 768 ? 64 : 24;
  const maxWidth = Math.max(MIN_VIEWPORT_WIDTH.mobile, containerWidth - horizontalBuffer);

  return Math.min(targetWidth, maxWidth);
}

export function BlockPreviewShell({ block, className }: BlockPreviewShellProps) {
  const { resolvedTheme } = useTheme();
  const [activeTab, setActiveTab] = useState<'preview' | 'code'>('preview');
  const [previewTheme, setPreviewTheme] = useState<'light' | 'dark'>(resolvedTheme);
  const previewShell = block.previewShell;
  const canvasHeight = previewShell?.canvasHeight ?? 'screen';
  const defaultViewport = previewShell?.defaultViewport ?? 'desktop';
  const [containerWidth, setContainerWidth] = useState(0);
  const [resizeTrackWidth, setResizeTrackWidth] = useState(0);
  const [viewportWidth, setViewportWidth] = useState<number | null>(null);
  const [selectedViewport, setSelectedViewport] = useState<DocsBlockViewport | null>(
    defaultViewport,
  );
  const [isDragging, setIsDragging] = useState(false);
  const frameRef = useRef<HTMLDivElement | null>(null);
  const resizeTrackRef = useRef<HTMLDivElement | null>(null);
  const resizeRafRef = useRef<number | null>(null);
  const pendingWidthRef = useRef<number | null>(null);

  const viewportOptions = previewShell?.viewportOptions ?? ['desktop', 'tablet', 'mobile'];
  const resizable = previewShell?.resizable ?? true;
  const canvasInset = previewShell?.canvasInset ?? 'sm';
  const canvasInsetClass = {
    none: 'p-0',
    sm: 'p-0 medium:p-3',
    md: 'p-0 medium:p-4',
    lg: 'p-0 medium:p-5',
  } as const;
  const canvasHeightClass: Record<DocsBlockCanvasHeight, string> = {
    md: 'h-[24rem] medium:h-[32rem]',
    lg: 'h-[30rem] medium:h-[40rem]',
    xl: 'h-[36rem] medium:h-[48rem]',
    screen: 'h-[min(70svh,40rem)] medium:h-[calc(100svh-10rem)]',
    'screen-tall': 'h-[min(78svh,48rem)] medium:h-[calc(100svh-7rem)]',
    'screen-max': 'h-[min(82svh,52rem)] medium:h-[calc(100svh-5.5rem)]',
  };
  const codeExample = useMemo(
    () =>
      block.codeExample ?? {
        entryFile: 'example.tsx',
        files: [
          {
            path: 'example.tsx',
            language: 'tsx',
            code: block.code,
          },
        ],
      },
    [block.code, block.codeExample],
  );

  const currentWidth =
    viewportWidth ??
    (selectedViewport
      ? getPresetViewportWidth(selectedViewport, previewShell)
      : getClampedViewportWidth(defaultViewport, containerWidth, previewShell));
  const availablePreviewWidth = resizeTrackWidth > 0 ? resizeTrackWidth : containerWidth;
  const fitScale =
    currentWidth > 0 && availablePreviewWidth > 0
      ? Math.min(1, availablePreviewWidth / currentWidth)
      : 1;
  const scaledViewportWidth = Math.max(1, Math.round(currentWidth * fitScale));
  const scaledViewportHeightPercent = fitScale === 1 ? 100 : 100 / fitScale;
  const widthDerivedViewport: DocsBlockViewport = useMemo(() => {
    if (currentWidth >= MIN_VIEWPORT_WIDTH.desktop) return 'desktop';
    if (currentWidth >= MIN_VIEWPORT_WIDTH.tablet) return 'tablet';
    return 'mobile';
  }, [currentWidth]);
  const effectiveViewport = selectedViewport ?? widthDerivedViewport;
  const activeBreakpoint = useMemo<(typeof BREAKPOINTS)[number]['key'] | null>(() => {
    for (let index = 0; index < BREAKPOINTS.length; index += 1) {
      const current = BREAKPOINTS[index];
      if (!current) continue;
      const next = BREAKPOINTS[index + 1];
      const inRange = next
        ? currentWidth >= current.minWidth && currentWidth < next.minWidth
        : currentWidth >= current.minWidth;
      if (inRange) return current.key;
    }
    return null;
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
        return selectedViewport
          ? getPresetViewportWidth(selectedViewport, previewShell)
          : getClampedViewportWidth(defaultViewport, containerWidth, previewShell);
      }
      if (selectedViewport) {
        return getPresetViewportWidth(selectedViewport, previewShell);
      }
      return Math.min(maxWidth, Math.max(MIN_VIEWPORT_WIDTH.mobile, previous));
    });
  }, [containerWidth, defaultViewport, getMaxViewportWidth, previewShell, selectedViewport]);

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
        setSelectedViewport(null);
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

  const setViewportPreset = useCallback(
    (viewport: DocsBlockViewport) => {
      setSelectedViewport(viewport);
      setViewportWidth(getPresetViewportWidth(viewport, previewShell));
    },
    [previewShell],
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
      <div className="flex flex-col gap-3 pb-4 @3xl:flex-row @3xl:items-center @3xl:justify-between">
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

        {activeTab === 'preview' ? (
          <div className="flex flex-wrap items-center gap-3">
            {viewportOptions.length > 0 ? (
              <SegmentedButton size="sm" className="shrink-0" aria-label="Preview viewport">
                {viewportOptions.map((viewport) => {
                  const isSelected = effectiveViewport === viewport;

                  return (
                    <SegmentedButtonItem
                      key={viewport}
                      active={isSelected}
                      onClick={() => setViewportPreset(viewport)}
                      className="min-w-11"
                      aria-label={VIEWPORT_LABELS[viewport]}
                    >
                      <span className="material-symbols-outlined text-icon-sm" aria-hidden="true">
                        {VIEWPORT_ICONS[viewport]}
                      </span>
                    </SegmentedButtonItem>
                  );
                })}
              </SegmentedButton>
            ) : null}
            <SegmentedButton
              options={[
                { value: 'light', label: 'Light' },
                { value: 'dark', label: 'Dark' },
              ]}
              value={previewTheme}
              onValueChange={(value) => setPreviewTheme(value as 'light' | 'dark')}
              size="sm"
            />
          </div>
        ) : null}
      </div>

      {activeTab === 'preview' ? (
        <div
          ref={frameRef}
          className={cn(
            'border-outline-variant bg-surface-container-low medium:border relative overflow-x-hidden overflow-y-auto rounded-md border-0 [background-image:radial-gradient(circle,rgba(148,163,184,0.3)_1px,transparent_1px)] [background-size:12px_12px] dark:[background-image:radial-gradient(circle,rgba(71,85,105,0.4)_1px,transparent_1px)]',
            canvasHeightClass[canvasHeight],
          )}
        >
          <div
            className={cn(
              'relative box-border flex h-full flex-col',
              canvasInsetClass[canvasInset],
            )}
          >
            <div className="mb-2 hidden h-9 min-w-full overflow-hidden @2xl:flex">
              <div className="border-outline-variant flex h-full min-w-[11rem] items-center justify-between border-l px-6 text-sm">
                <span className="text-on-surface-variant font-mono text-xs">
                  {VIEWPORT_LABELS[effectiveViewport]}
                </span>
                <span className="text-on-surface-variant ml-2 font-mono text-xs opacity-80">
                  {Math.round(currentWidth)}px
                </span>
              </div>
              {BREAKPOINTS.map((breakpoint) => {
                const isActive = activeBreakpoint === breakpoint.key;
                return (
                  <div
                    key={breakpoint.key}
                    className={cn(
                      'border-outline-variant relative flex h-full items-center justify-between border-l px-6 text-sm',
                      breakpoint.widthClass,
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
                  </div>
                );
              })}
              <div className="border-outline-variant flex h-full items-center border-l px-4">
                <span className="text-on-surface-variant font-mono text-xs">x1</span>
              </div>
            </div>

            <div
              ref={resizeTrackRef}
              className="flex min-h-0 min-w-full flex-1 items-start justify-center overflow-hidden"
            >
              <div className="relative h-full shrink-0" style={{ width: scaledViewportWidth }}>
                <div
                  className="h-full origin-top-left"
                  style={{
                    width: currentWidth,
                    height: `${scaledViewportHeightPercent}%`,
                    transform: fitScale === 1 ? undefined : `scale(${fitScale})`,
                  }}
                >
                  <PreviewThemeScope
                    theme={previewTheme}
                    className="bg-surface h-full min-h-0 w-full overflow-hidden rounded-sm"
                  >
                    <div
                      key={`${block.slug}-${effectiveViewport}`}
                      className="h-full w-full overflow-auto"
                    >
                      {previewNode}
                    </div>
                  </PreviewThemeScope>
                </div>

                {resizable && containerWidth > 0 && (
                  <button
                    type="button"
                    aria-label="Resize preview"
                    onPointerDown={startResize}
                    style={{ touchAction: 'none' }}
                    className={cn(
                      'absolute top-0 right-[-11px] hidden h-full w-6 cursor-ew-resize items-center justify-center bg-transparent @3xl:flex',
                    )}
                  >
                    <span
                      className={cn(
                        'bg-secondary-container h-12 w-1.5 rounded-full transition-colors',
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
        <BlockCodeExplorer codeExample={codeExample} className={canvasHeightClass[canvasHeight]} />
      )}
    </div>
  );
}
