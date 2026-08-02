'use client';

import React, { forwardRef, useEffect, useState } from 'react';
import type { CSSProperties, ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { cn } from '@/lib/utils';

interface PageStickyHeaderOverlayProps {
  children: ReactNode;
  enabled: boolean;
  tableStyle?: CSSProperties;
}

const HIDDEN_SCROLLBAR_STYLES = `
  [data-datatable-page-sticky-overlay="true"] {
    scrollbar-width: none;
    -ms-overflow-style: none;
  }
  [data-datatable-page-sticky-overlay="true"]::-webkit-scrollbar {
    display: none;
    width: 0;
    height: 0;
  }
`;

export const PageStickyHeaderOverlay = forwardRef<HTMLDivElement, PageStickyHeaderOverlayProps>(
  ({ children, enabled, tableStyle }, ref) => {
    const [portalHost, setPortalHost] = useState<HTMLElement | null>(null);

    useEffect(() => {
      setPortalHost(document.body);
    }, []);

    if (!enabled || !portalHost) return null;

    return createPortal(
      <>
        <style
          data-datatable-page-sticky-scrollbar-style="true"
          dangerouslySetInnerHTML={{ __html: HIDDEN_SCROLLBAR_STYLES }}
        />
        <div
          ref={ref}
          hidden
          aria-hidden="true"
          data-datatable-page-sticky-overlay="true"
          className={cn('bg-surface @container fixed z-40 overflow-x-auto overflow-y-hidden')}
          style={{
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
            overscrollBehaviorX: 'contain',
            overscrollBehaviorY: 'auto',
            touchAction: 'pan-x pan-y',
          }}
        >
          <table
            role="grid"
            className="w-full table-fixed border-separate border-spacing-0"
            style={tableStyle}
          >
            {children}
          </table>
        </div>
      </>,
      portalHost,
    );
  },
);

PageStickyHeaderOverlay.displayName = 'PageStickyHeaderOverlay';
