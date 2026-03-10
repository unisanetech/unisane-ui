'use client';

import React, { forwardRef, useEffect, useId, useRef } from 'react';
import { createPortal } from 'react-dom';
import { cn } from '@/lib/utils';
import { useControllableState } from '@/lib/use-controllable-state';
import { Text } from '@/primitives/text';
import { Surface } from '@/primitives/surface';
import { IconButton } from './icon-button';
import { useScrollLock } from '@/hooks/use-scroll-lock';

export interface DialogProps {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  title?: React.ReactNode;
  description?: React.ReactNode;
  children?: React.ReactNode;
  actions?: React.ReactNode;
  icon?: React.ReactNode;
  contentClassName?: string;
  headerClassName?: string;
  footerClassName?: string;
  className?: string;
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

export const Dialog = forwardRef<HTMLDivElement, DialogProps>(
  (
    {
      open,
      defaultOpen = false,
      onOpenChange,
      title,
      description,
      children,
      actions,
      icon,
      contentClassName,
      headerClassName,
      footerClassName,
      className,
      showCloseButton,
      closeLabel = 'Close dialog',
    },
    ref,
  ) => {
    const dialogRef = useRef<HTMLDivElement>(null);
    const previousActiveElement = useRef<HTMLElement | null>(null);
    const titleId = useId();
    const descriptionId = useId();
    const bodyDescriptionId = useId();
    const [isOpen = false, setIsOpen] = useControllableState<boolean>({
      value: open,
      defaultValue: defaultOpen,
      onChange: onOpenChange,
    });

    const resolvedShowCloseButton = showCloseButton ?? Boolean(title || description || icon);
    const hasHeader = Boolean(title || description || icon || resolvedShowCloseButton);
    const hasBodyContent = children !== undefined && children !== null;
    const describedBy = description ? descriptionId : hasBodyContent ? bodyDescriptionId : undefined;

    const handleOpenChange = React.useCallback(
      (nextOpen: boolean) => {
        setIsOpen(nextOpen);
      },
      [setIsOpen],
    );

    const setRefs = (node: HTMLDivElement | null) => {
      dialogRef.current = node;
      if (typeof ref === 'function') {
        ref(node);
      } else if (ref) {
        ref.current = node;
      }
    };

    useScrollLock(isOpen);

    useEffect(() => {
      if (!isOpen) {
        return;
      }

      const dialogNode = dialogRef.current;
      previousActiveElement.current = document.activeElement as HTMLElement;

      const timer = window.setTimeout(() => {
        const focusableElements = getFocusableElements(dialogNode);
        (focusableElements[0] ?? dialogNode)?.focus();
      }, 0);

      const handleKeyDown = (event: KeyboardEvent) => {
        if (event.key === 'Escape') {
          handleOpenChange(false);
          return;
        }

        if (event.key !== 'Tab') {
          return;
        }

        const focusableElements = getFocusableElements(dialogNode);
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
          if (activeElement === first || activeElement === dialogNode) {
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
    }, [handleOpenChange, isOpen]);

    if (!isOpen || typeof document === 'undefined') {
      return null;
    }

    return createPortal(
      <div
        className="medium:p-10 fixed inset-0 z-[var(--z-modal,3000)] flex items-center justify-center p-6"
        role="presentation"
      >
        <div
          className="bg-scrim animate-in fade-in duration-medium absolute inset-0 backdrop-blur-[calc(var(--unit)/2)] transition-opacity"
          onClick={() => handleOpenChange(false)}
          aria-hidden="true"
        />

        <Surface
          ref={setRefs}
          role="dialog"
          aria-modal="true"
          aria-labelledby={title ? titleId : undefined}
          aria-describedby={describedBy}
          tabIndex={-1}
          tone="surface"
          elevation={5}
          rounded="lg"
          className={cn(
            'relative flex w-full max-w-110 flex-col overflow-hidden border border-outline-variant/20 outline-none',
            'expanded:max-w-150 animate-in fade-in zoom-in-95 duration-medium ease-emphasized',
            className,
          )}
        >
          {hasHeader ? (
            <div
              className={cn(
                'border-outline-variant/20 bg-surface-container-lowest flex items-start gap-3 border-b px-5 py-4',
                headerClassName,
              )}
            >
              {icon ? (
                <div
                  className="bg-surface-container-low text-primary border-outline-variant/20 flex h-10 w-10 shrink-0 items-center justify-center rounded-md border"
                  aria-hidden="true"
                >
                  {icon}
                </div>
              ) : null}

              <div className="min-w-0 flex-1 space-y-1 text-left">
                {title ? (
                  <Text
                    variant="titleLarge"
                    as="div"
                    id={titleId}
                    className="wrap-break-word text-on-surface leading-tight"
                  >
                    {title}
                  </Text>
                ) : null}
                {description ? (
                  <Text
                    variant="bodySmall"
                    as="div"
                    id={descriptionId}
                    className="wrap-break-word text-on-surface-variant leading-relaxed"
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
                  onClick={() => handleOpenChange(false)}
                />
              ) : null}
            </div>
          ) : null}

          {hasBodyContent ? (
            <div className="max-h-[min(78vh,calc(100dvh-var(--spacing-24)))] flex-1 overflow-y-auto">
              <div
                id={!description ? bodyDescriptionId : undefined}
                className={cn(
                  'px-5 pb-5 text-left text-on-surface',
                  hasHeader ? 'pt-4' : 'pt-5',
                  contentClassName,
                )}
              >
                {children}
              </div>
            </div>
          ) : null}

          {actions ? (
            <div
              className={cn(
                'border-outline-variant/20 bg-surface-container-lowest/80 flex flex-col justify-end gap-2 border-t px-5 py-3 medium:flex-row',
                footerClassName,
              )}
            >
              {actions}
            </div>
          ) : null}
        </Surface>
      </div>,
      document.body,
    );
  },
);

Dialog.displayName = 'Dialog';
