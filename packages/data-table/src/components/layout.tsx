'use client';

import React, { forwardRef, useEffect, useRef } from 'react';
import { cn } from '@unisane/ui/utils';
import { useOptionalDataTableRuntime } from '../context/provider';
import type { VerticalScrollOwner } from '../types';

// ─── DATA TABLE LAYOUT ───────────────────────────────────────────────────────
// Root container for the active DataTable surface.

interface DataTableLayoutProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  verticalScroll: VerticalScrollOwner;
}

export const DataTableLayout = forwardRef<HTMLDivElement, DataTableLayoutProps>(
  ({ children, className, verticalScroll, ...props }, ref) => (
    <>
      {/* SSR-safe scrollbar hiding styles */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
          /* Body scroll container: hide scrollbar on tablet+ (custom horizontal scrollbar used instead) */
          @media (min-width: 768px) {
            [data-datatable-scroll="body"] {
              scrollbar-width: none;
              -ms-overflow-style: none;
            }
            [data-datatable-scroll="body"]::-webkit-scrollbar {
              display: none;
            }
          }
        `,
        }}
      />
      <div
        ref={ref}
        className={cn(
          'bg-surface border-outline-soft @container relative flex min-h-0 flex-col',
          verticalScroll === 'table' ? 'h-full' : 'h-auto',
          className,
        )}
        data-vertical-scroll-owner={verticalScroll}
        {...props}
      >
        {children}
      </div>
    </>
  ),
);
DataTableLayout.displayName = 'DataTableLayout';

// ─── STICKY ZONE ─────────────────────────────────────────────────────────────
// Contains toolbar, filters, grouping pills - all sticky together at top.
// Automatically measures its height and sets --data-table-header-offset CSS variable
// on the parent DataTableLayout so the table header can position correctly.

interface StickyZoneProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  /** Offset from the top for sticky positioning (e.g., to account for fixed headers) */
  stickyOffset?: string;
}

export const StickyZone = forwardRef<HTMLDivElement, StickyZoneProps>(
  ({ children, className, style, stickyOffset: stickyOffsetProp, ...props }, ref) => {
    const internalRef = useRef<HTMLDivElement>(null);

    // Get stickyOffset from context if available, otherwise use prop or default
    const context = useOptionalDataTableRuntime();
    const stickyOffset =
      stickyOffsetProp ?? context?.config.stickyOffset ?? 'var(--app-header-height, 0px)';
    const pageOwnedScroll = context?.config.verticalScroll !== 'table';
    const parentRef = useRef<HTMLElement | null>(null);

    // Measure height and update parent's CSS variable
    useEffect(() => {
      const element = internalRef.current;
      if (!element) return;

      parentRef.current = element.parentElement;

      const updateHeight = () => {
        const height = element.offsetHeight;
        if (parentRef.current) {
          parentRef.current.style.setProperty('--data-table-header-offset', `${height}px`);
        }
      };

      updateHeight();

      const observer = new ResizeObserver(updateHeight);
      observer.observe(element);

      return () => {
        observer.disconnect();
        if (parentRef.current) {
          parentRef.current.style.removeProperty('--data-table-header-offset');
        }
      };
    }, []);

    return (
      <div
        ref={(node) => {
          internalRef.current = node;
          if (typeof ref === 'function') {
            ref(node);
          } else if (ref) {
            ref.current = node;
          }
        }}
        className={cn(
          // z-20: Below sidebar drawer (z-30) so drawer overlays table when open
          'bg-surface z-20',
          pageOwnedScroll && 'sticky',
          className,
        )}
        data-datatable-sticky-zone="true"
        style={{
          top: pageOwnedScroll ? stickyOffset : undefined,
          ...style,
        }}
        {...props}
      >
        {children}
      </div>
    );
  },
);
StickyZone.displayName = 'StickyZone';
