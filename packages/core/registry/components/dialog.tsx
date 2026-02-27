'use client';

import React, { useEffect, useRef, useId, forwardRef } from 'react';
import { createPortal } from 'react-dom';
import { cn } from '@/lib/utils';
import { Text } from '@/primitives/text';
import { Surface } from '@/primitives/surface';
import { Ripple } from './ripple';
import { useScrollLock } from '@/hooks/use-scroll-lock';

export interface DialogProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  actions?: React.ReactNode;
  icon?: React.ReactNode;
  contentClassName?: string;
  className?: string;
}

export const Dialog = forwardRef<HTMLDivElement, DialogProps>(
  ({ open, onClose, title, children, actions, icon, contentClassName, className }, ref) => {
    const dialogRef = useRef<HTMLDivElement>(null);
    const previousActiveElement = useRef<HTMLElement | null>(null);
    const titleId = useId();
    const descId = useId();
    const setRefs = (node: HTMLDivElement | null) => {
      dialogRef.current = node;
      if (typeof ref === 'function') {
        ref(node);
      } else if (ref) {
        ref.current = node;
      }
    };

    // Lock body scroll while preventing layout shift
    useScrollLock(open);

    useEffect(() => {
      if (open) {
        const dialogNode = dialogRef.current;
        previousActiveElement.current = document.activeElement as HTMLElement;

        const getFocusableElements = () => {
          if (!dialogNode) return [];
          return Array.from(
            dialogNode.querySelectorAll<HTMLElement>(
              'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])',
            ),
          ).filter((el) => !el.hasAttribute('disabled') && !el.getAttribute('aria-hidden'));
        };

        const focusFirstElement = () => {
          const focusables = getFocusableElements();
          (focusables[0] ?? dialogNode)?.focus();
        };

        const timer = setTimeout(focusFirstElement, 0);

        const handleKeyDown = (e: KeyboardEvent) => {
          if (e.key === 'Escape') {
            onClose();
          }
          if (e.key === 'Tab') {
            const focusables = getFocusableElements();
            if (focusables.length === 0) {
              e.preventDefault();
              return;
            }

            const first = focusables[0];
            const last = focusables[focusables.length - 1];
            const activeElement = document.activeElement as HTMLElement | null;
            if (!first || !last) {
              e.preventDefault();
              return;
            }

            if (e.shiftKey) {
              if (activeElement === first || activeElement === dialogNode) {
                e.preventDefault();
                last.focus();
              }
            } else if (activeElement === last) {
              e.preventDefault();
              first.focus();
            }
          }
        };

        document.addEventListener('keydown', handleKeyDown);

        return () => {
          clearTimeout(timer);
          document.removeEventListener('keydown', handleKeyDown);
          previousActiveElement.current?.focus();
        };
      }
    }, [open, onClose]);

    if (!open) return null;
    if (typeof document === 'undefined') return null;

    return createPortal(
      <div
        className="medium:p-10 fixed inset-0 z-[var(--z-modal,3000)] flex items-center justify-center p-6"
        role="presentation"
      >
        <div
          className="bg-scrim animate-in fade-in duration-medium absolute inset-0 backdrop-blur-[calc(var(--unit)/2)] transition-opacity"
          onClick={onClose}
          aria-hidden="true"
        />

        <Surface
          ref={setRefs}
          role="dialog"
          aria-modal="true"
          aria-labelledby={titleId}
          aria-describedby={descId}
          tabIndex={-1}
          tone="surface"
          elevation={4}
          rounded="sm"
          className={cn(
            'expanded:max-w-170 border-outline-variant relative flex w-full max-w-78 min-w-70 flex-col overflow-hidden border outline-none',
            'animate-in fade-in zoom-in-95 duration-medium ease-emphasized',
            className,
          )}
        >
          <div className="border-outline-variant/10 bg-surface-container-low/50 flex shrink-0 items-center justify-between border-b px-6 py-6">
            <div className="flex items-center gap-4 text-left">
              {icon && (
                <div
                  className="text-primary flex shrink-0 items-center justify-center"
                  aria-hidden="true"
                >
                  {icon}
                </div>
              )}
              <div className="flex flex-col gap-1">
                {title && (
                  <Text variant="titleMedium" id={titleId} className="text-on-surface leading-none">
                    {title}
                  </Text>
                )}
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-on-surface-variant hover:text-on-surface hover:bg-surface-variant relative flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full transition-all"
              aria-label="Close dialog"
            >
              <Ripple />
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                className="relative z-10"
              >
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className={cn('max-h-[75vh] flex-1 overflow-y-auto', contentClassName)}>
            <div className="text-on-surface p-6 text-left">
              <Text
                variant="bodyMedium"
                id={descId}
                as="div"
                className="font-medium wrap-break-word text-inherit"
              >
                {children}
              </Text>
            </div>
          </div>

          {actions && (
            <div className="medium:flex-row border-outline-variant/10 bg-surface-container-low/30 flex w-full flex-col justify-end gap-3 border-t p-6">
              {actions}
            </div>
          )}
        </Surface>
      </div>,
      document.body,
    );
  },
);

Dialog.displayName = 'Dialog';
