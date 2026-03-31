'use client';

import React, { forwardRef, useEffect, useId, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { cn } from '../lib/utils';
import { useControllableState } from '../lib/use-controllable-state';
import { useScrollLock } from '../hooks/use-scroll-lock';
import { Text } from '../primitives/text';
import { IconButton } from './icon-button';

export type SheetSize = 'sm' | 'md' | 'lg' | 'xl' | 'full';
export type SheetPlacement = 'right' | 'bottom';

export interface SheetProps {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  title?: React.ReactNode;
  description?: React.ReactNode;
  children: React.ReactNode;
  icon?: React.ReactNode;
  footer?: React.ReactNode;
  footerLeft?: React.ReactNode;
  footerRight?: React.ReactNode;
  className?: string;
  contentClassName?: string;
  headerClassName?: string;
  footerClassName?: string;
  size?: SheetSize;
  placement?: SheetPlacement;
  showCloseButton?: boolean;
  closeLabel?: string;
}

function getFocusableElements(root: HTMLElement | null) {
  if (!root) {
    return [];
  }

  return Array.from(
    root.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])',
    ),
  ).filter((element) => !element.hasAttribute('disabled') && !element.getAttribute('aria-hidden'));
}

const closeIcon = (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    aria-hidden="true"
  >
    <path d="M18 6L6 18M6 6l12 12" />
  </svg>
);

export const Sheet = forwardRef<HTMLDivElement, SheetProps>(
  (
    {
      open,
      defaultOpen = false,
      onOpenChange,
      title,
      description,
      children,
      icon,
      footer,
      footerLeft,
      footerRight,
      className,
      contentClassName,
      headerClassName,
      footerClassName,
      size = 'md',
      placement = 'right',
      showCloseButton,
      closeLabel = 'Close sheet',
    },
    ref,
  ) => {
    const panelRef = useRef<HTMLDivElement>(null);
    const previousActiveElement = useRef<HTMLElement | null>(null);
    const timerRef = useRef<number | null>(null);
    const [isOpen = false, setIsOpen] = useControllableState<boolean>({
      value: open,
      defaultValue: defaultOpen,
      onChange: onOpenChange,
    });
    const [shouldRender, setShouldRender] = useState(isOpen);
    const [isVisible, setIsVisible] = useState(false);
    const titleId = useId();
    const descriptionId = useId();
    const bodyDescriptionId = useId();
    const isBottom = placement === 'bottom';
    const resolvedShowCloseButton = showCloseButton ?? Boolean(title || description || icon);
    const hasHeader = Boolean(title || description || icon || resolvedShowCloseButton);
    const describedBy = description ? descriptionId : bodyDescriptionId;

    const OPEN_DURATION = 320;
    const CLOSE_DURATION = 220;

    useScrollLock(isOpen);

    useEffect(() => {
      if (isOpen) {
        if (timerRef.current) {
          window.clearTimeout(timerRef.current);
        }
        setShouldRender(true);
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            setIsVisible(true);
          });
        });
        return;
      }

      setIsVisible(false);
      timerRef.current = window.setTimeout(() => {
        setShouldRender(false);
      }, CLOSE_DURATION);

      return () => {
        if (timerRef.current) {
          window.clearTimeout(timerRef.current);
        }
      };
    }, [isOpen]);

    useEffect(() => {
      if (!isOpen) {
        return;
      }

      const panelNode = panelRef.current;
      previousActiveElement.current = document.activeElement as HTMLElement;

      const timer = window.setTimeout(() => {
        const focusableElements = getFocusableElements(panelNode);
        (focusableElements[0] ?? panelNode)?.focus();
      }, 0);

      const handleKeyDown = (event: KeyboardEvent) => {
        if (event.key === 'Escape') {
          event.preventDefault();
          setIsOpen(false);
          return;
        }

        if (event.key !== 'Tab') {
          return;
        }

        const focusableElements = getFocusableElements(panelNode);
        if (focusableElements.length === 0) {
          event.preventDefault();
          return;
        }

        const first = focusableElements[0];
        const last = focusableElements[focusableElements.length - 1];
        const activeElement = document.activeElement as HTMLElement | null;

        if (!first || !last) {
          event.preventDefault();
          return;
        }

        if (event.shiftKey) {
          if (activeElement === first || activeElement === panelNode) {
            event.preventDefault();
            last.focus();
          }
          return;
        }

        if (activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      };

      document.addEventListener('keydown', handleKeyDown);

      return () => {
        window.clearTimeout(timer);
        document.removeEventListener('keydown', handleKeyDown);
        previousActiveElement.current?.focus();
      };
    }, [isOpen, setIsOpen]);

    if (!shouldRender || typeof document === 'undefined') {
      return null;
    }

    const rightSizeClasses: Record<SheetSize, string> = {
      sm: 'max-w-96',
      md: 'max-w-120',
      lg: 'max-w-170',
      xl: 'max-w-220',
      full: 'max-w-[calc(100vw-var(--spacing-8))]',
    };
    const bottomSizeClasses: Record<SheetSize, string> = {
      sm: 'max-h-[58dvh]',
      md: 'max-h-[72dvh]',
      lg: 'max-h-[82dvh]',
      xl: 'max-h-[90dvh]',
      full: 'h-[calc(100dvh-var(--spacing-6))]',
    };

    const resolvedFooter =
      footer ??
      (footerLeft || footerRight ? (
        <div className="medium:flex-row flex flex-col items-start justify-between gap-4">
          <div className="medium:w-auto w-full min-w-0 flex-1">{footerLeft}</div>
          <div className="medium:w-auto flex w-full shrink-0 items-center justify-end gap-2">
            {footerRight}
          </div>
        </div>
      ) : null);

    return createPortal(
      <div
        className={cn(
          'fixed inset-0 z-[var(--z-modal,3000)] flex overflow-hidden',
          isBottom ? 'items-end justify-center p-0' : 'items-stretch justify-end p-0',
        )}
        role="presentation"
      >
        <div
          className={cn(
            'bg-scrim absolute inset-0 backdrop-blur-[calc(var(--unit)/2)] transition-opacity',
            isVisible ? 'opacity-100' : 'opacity-0',
          )}
          style={{
            transitionDuration: `${isVisible ? OPEN_DURATION : CLOSE_DURATION}ms`,
            transitionTimingFunction: isVisible
              ? 'cubic-bezier(0.2, 0.8, 0.2, 1)'
              : 'cubic-bezier(0.4, 0, 1, 1)',
          }}
          onClick={() => setIsOpen(false)}
          aria-hidden="true"
        />

        <div
          ref={(node) => {
            panelRef.current = node;
            if (typeof ref === 'function') {
              ref(node);
            } else if (ref) {
              ref.current = node;
            }
          }}
          className={cn(
            'bg-surface shadow-5 border-outline-variant relative flex max-h-full w-full transform-gpu flex-col overflow-hidden border',
            isBottom ? 'rounded-t-lg rounded-b-none border-b-0' : 'h-full rounded-none border-r-0',
            isBottom ? bottomSizeClasses[size] : rightSizeClasses[size],
            isBottom
              ? isVisible
                ? 'translate-y-0 opacity-100'
                : 'translate-y-6 opacity-0'
              : isVisible
                ? 'translate-x-0 opacity-100'
                : 'translate-x-6 opacity-0',
            className,
          )}
          style={{
            transitionDuration: `${isVisible ? OPEN_DURATION : CLOSE_DURATION}ms`,
            transitionTimingFunction: isVisible
              ? 'cubic-bezier(0.2, 0.8, 0.2, 1)'
              : 'cubic-bezier(0.4, 0, 1, 1)',
          }}
          role="dialog"
          aria-modal="true"
          aria-labelledby={title ? titleId : undefined}
          aria-describedby={describedBy}
          tabIndex={-1}
        >
          {hasHeader ? (
            <div
              className={cn(
                'border-outline-variant bg-surface-container-lowest flex items-start gap-3 border-b px-5 py-4',
                headerClassName,
              )}
            >
              {icon ? (
                <div
                  className="bg-surface-container-low text-primary border-outline-variant flex h-10 w-10 shrink-0 items-center justify-center rounded-md border"
                  aria-hidden="true"
                >
                  {icon}
                </div>
              ) : null}

              <div className="min-w-0 flex-1 space-y-1 text-left">
                {title ? (
                  <Text
                    as="div"
                    variant="titleLarge"
                    id={titleId}
                    className="text-on-surface leading-tight wrap-break-word"
                  >
                    {title}
                  </Text>
                ) : null}
                {description ? (
                  <Text
                    as="div"
                    variant="bodySmall"
                    id={descriptionId}
                    className="text-on-surface-variant leading-relaxed wrap-break-word"
                  >
                    {description}
                  </Text>
                ) : null}
              </div>

              {resolvedShowCloseButton ? (
                <IconButton
                  aria-label={closeLabel}
                  icon={closeIcon}
                  variant="standard"
                  size="md"
                  className="bg-surface-container-low text-on-surface-variant hover:bg-surface-container hover:text-on-surface"
                  onClick={() => setIsOpen(false)}
                />
              ) : null}
            </div>
          ) : null}

          <div className="no-scrollbar relative z-10 flex-1 overflow-y-auto">
            <div
              id={!description ? bodyDescriptionId : undefined}
              className={cn(
                'text-on-surface px-5 pb-5',
                hasHeader ? 'pt-4' : 'pt-5',
                contentClassName,
              )}
            >
              {children}
            </div>
          </div>

          {resolvedFooter ? (
            <div
              className={cn(
                'border-outline-variant bg-surface-container-lowest shrink-0 border-t px-5 py-3',
                footerClassName,
              )}
            >
              {resolvedFooter}
            </div>
          ) : null}
        </div>
      </div>,
      document.body,
    );
  },
);

Sheet.displayName = 'Sheet';
