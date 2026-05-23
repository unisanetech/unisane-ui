'use client';

import React, { forwardRef } from 'react';
import { Drawer as VaulDrawer } from 'vaul';
import { cn } from '@/lib/utils';
import { IconButton, type IconButtonProps } from '@/components/ui/icon-button';

export type DrawerSize = 'sm' | 'md' | 'lg' | 'xl' | 'full';

export interface DrawerProps {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  title?: React.ReactNode;
  description?: React.ReactNode;
  children: React.ReactNode;
  footer?: React.ReactNode;
  footerLeft?: React.ReactNode;
  footerRight?: React.ReactNode;
  className?: string;
  contentClassName?: string;
  headerClassName?: string;
  footerClassName?: string;
  handleClassName?: string;
  size?: DrawerSize;
  showCloseButton?: boolean;
  showHandle?: boolean;
  closeButtonSize?: IconButtonProps['size'];
  closeButtonIconSize?: IconButtonProps['iconSize'];
  closeLabel?: string;
  dismissible?: boolean;
  swipeToClose?: boolean;
  onExitComplete?: () => void;
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

export const Drawer = forwardRef<HTMLDivElement, DrawerProps>(
  (
    {
      open,
      defaultOpen = false,
      onOpenChange,
      title,
      description,
      children,
      footer,
      footerLeft,
      footerRight,
      className,
      contentClassName,
      headerClassName,
      footerClassName,
      handleClassName,
      size = 'md',
      showCloseButton,
      showHandle = true,
      closeButtonSize = 'sm',
      closeButtonIconSize = 'sm',
      closeLabel = 'Close drawer',
      dismissible = true,
      swipeToClose = true,
      onExitComplete,
    },
    ref,
  ) => {
    const resolvedShowCloseButton = showCloseButton ?? false;
    const hasHeader = Boolean(title || description || resolvedShowCloseButton);

    const sizeClasses: Record<DrawerSize, string> = {
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

    return (
      <VaulDrawer.Root
        open={open}
        defaultOpen={defaultOpen}
        direction="bottom"
        dismissible={dismissible}
        handleOnly={!swipeToClose}
        modal
        shouldScaleBackground={false}
        setBackgroundColorOnScale={false}
        onOpenChange={onOpenChange}
        onAnimationEnd={(isOpen) => {
          if (!isOpen) {
            onExitComplete?.();
          }
        }}
      >
        <VaulDrawer.Portal>
          <VaulDrawer.Overlay
            className="bg-scrim fixed inset-0 z-[var(--z-modal,3000)]"
            aria-hidden="true"
          />

          <VaulDrawer.Content
            ref={ref}
            className={cn(
              'bg-surface text-on-surface border-outline-soft fixed inset-x-0 bottom-0 z-[var(--z-modal,3000)] mx-auto flex w-full flex-col overflow-hidden rounded-t-lg rounded-b-none border border-b-0 shadow-5 outline-none',
              'medium:max-w-[min(640px,calc(100vw-var(--spacing-8)))]',
              sizeClasses[size],
              className,
            )}
          >
            {showHandle ? (
              <div
                className={cn(
                  'bg-surface flex shrink-0 justify-center px-5 pt-3',
                  hasHeader ? 'pb-1' : 'pb-3',
                )}
              >
                <VaulDrawer.Handle
                  className={cn(
                    '!bg-outline-muted !h-1 !w-8 !rounded-full !opacity-100',
                    handleClassName,
                  )}
                />
              </div>
            ) : null}

            {hasHeader ? (
              <div
                className={cn(
                  'border-outline-subtle bg-surface flex items-center gap-3 border-b px-5 py-3',
                  headerClassName,
                )}
              >
                <div className="min-w-0 flex-1 space-y-1 text-left">
                  {title ? (
                    <VaulDrawer.Title
                      className="font-sans text-title-large text-on-surface text-left font-normal leading-tight wrap-break-word"
                    >
                      {title}
                    </VaulDrawer.Title>
                  ) : null}
                  {description ? (
                    <VaulDrawer.Description
                      className="font-sans text-body-small text-on-surface-variant text-left font-normal leading-relaxed wrap-break-word"
                    >
                      {description}
                    </VaulDrawer.Description>
                  ) : null}
                </div>

                {resolvedShowCloseButton ? (
                  <VaulDrawer.Close asChild>
                    <IconButton
                      aria-label={closeLabel}
                      icon={closeIcon}
                      variant="standard"
                      size={closeButtonSize}
                      iconSize={closeButtonIconSize}
                      className="bg-surface-container-low text-on-surface-variant hover:bg-surface-container hover:text-on-surface"
                    />
                  </VaulDrawer.Close>
                ) : null}
              </div>
            ) : null}

            {!description ? (
              <VaulDrawer.Description className="sr-only">
                Drawer content
              </VaulDrawer.Description>
            ) : null}

            <div className="no-scrollbar relative z-10 flex-1 overflow-y-auto">
              <div
                className={cn(
                  'text-on-surface px-5 pb-[max(var(--spacing-5),env(safe-area-inset-bottom))]',
                  hasHeader || showHandle ? 'pt-4' : 'pt-5',
                  contentClassName,
                )}
              >
                {children}
              </div>
            </div>

            {resolvedFooter ? (
              <div
                className={cn(
                  'border-outline-subtle bg-surface shrink-0 border-t px-5 py-3 pb-[max(var(--spacing-3),env(safe-area-inset-bottom))]',
                  footerClassName,
                )}
              >
                {resolvedFooter}
              </div>
            ) : null}
          </VaulDrawer.Content>
        </VaulDrawer.Portal>
      </VaulDrawer.Root>
    );
  },
);

Drawer.displayName = 'Drawer';
