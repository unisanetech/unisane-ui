'use client';

import React, { useEffect } from 'react';
import { cn } from '@/lib/utils';
import { useControllableState } from '@/lib/use-controllable-state';
import { IconButton } from '@/components/ui/icon-button';
import { Pane, PaneLayout } from '@/layout/pane';

export interface ListDetailLayoutProps {
  list: React.ReactNode;
  detail: React.ReactNode;
  showDetailMobile?: boolean;
  onBackClick?: () => void;
  className?: string;
  isRoot?: boolean;
}

export const ListDetailLayout: React.FC<ListDetailLayoutProps> = ({
  list,
  detail,
  showDetailMobile = false,
  onBackClick,
  className,
  isRoot = false,
}) => {
  return (
    <PaneLayout className={cn(!isRoot && 'border-outline-subtle rounded-sm border', className)}>
      <Pane
        role="list"
        isActive={!showDetailMobile}
        className="duration-long ease-emphasized transition-transform"
      >
        {list}
      </Pane>

      <Pane
        role="main"
        isActive={showDetailMobile}
        className="bg-surface-container-low duration-long ease-standard relative transition-opacity"
      >
        {showDetailMobile && (
          <div className="medium:hidden absolute top-4 left-4 z-20">
            <IconButton
              onClick={onBackClick}
              variant="standard"
              className="bg-surface-container-low border-outline-subtle border backdrop-blur-md"
              aria-label="Back"
              icon={<span className="material-symbols-outlined">arrow_back</span>}
            />
          </div>
        )}
        {detail}
      </Pane>
    </PaneLayout>
  );
};

export { ListDetailLayout as PaneGroup };

export interface SupportingPaneLayoutProps {
  main: React.ReactNode;
  supporting: React.ReactNode;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  className?: string;
  isRoot?: boolean;
  mainRef?: React.RefObject<HTMLDivElement | null>;
  title?: string;
  mainScrollable?: boolean;
  supportingScrollable?: boolean;
}

export const SupportingPaneLayout: React.FC<SupportingPaneLayoutProps> = ({
  main,
  supporting,
  open,
  defaultOpen = false,
  onOpenChange,
  className,
  isRoot = false,
  mainRef,
  title = 'Audit Protocol',
  mainScrollable = true,
  supportingScrollable = true,
}) => {
  const [resolvedOpen = false, setOpen] = useControllableState<boolean>({
    value: open,
    defaultValue: defaultOpen,
    onChange: onOpenChange,
  });
  const isOpen = resolvedOpen;

  const handleClose = () => {
    setOpen(false);
  };

  const handleToggle = () => {
    setOpen(!isOpen);
  };

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, setOpen]);

  return (
    <div
      className={cn(
        'bg-surface duration-long ease-emphasized relative isolate grid h-full w-full overflow-hidden transition-[grid-template-columns]',
        !isRoot && 'border-outline-subtle rounded-sm border',
        isOpen
          ? 'expanded:grid-cols-[1fr_var(--width-pane-supporting)]'
          : 'expanded:grid-cols-[1fr_var(--width-rail-collapsed)]',
        className,
      )}
    >
      <div
        ref={mainRef as React.RefObject<HTMLDivElement>}
        className="bg-surface relative h-full min-w-0 flex-1 overflow-hidden"
      >
        <div
          className={cn(
            'h-full',
            mainScrollable
              ? 'overflow-y-auto scroll-smooth [scrollbar-gutter:stable]'
              : 'overflow-hidden',
          )}
        >
          {main}
        </div>
      </div>

      <aside
        className={cn(
          'bg-surface duration-long ease-emphasized z-20 shrink-0 overflow-hidden transition-all',
          'medium:w-[min(100%,var(--width-pane-supporting))] absolute inset-y-0 right-0 h-full w-full',
          isOpen ? 'shadow-3 translate-x-0' : 'translate-x-full shadow-none',
          'expanded:static expanded:shadow-none expanded:translate-x-0 expanded:border-l expanded:border-outline-subtle expanded:w-full',
        )}
      >
        {isOpen ? (
          <div className="flex h-full flex-col">
            <header className="border-outline-subtle flex shrink-0 items-center justify-between border-b px-6 py-4">
              <div className="text-primary text-label-medium font-medium">{title}</div>
              <IconButton
                onClick={handleClose}
                variant="standard"
                icon={
                  <span className="material-symbols-outlined text-(length:--size-icon-sm)">
                    close
                  </span>
                }
                aria-label="Close pane"
                className="expanded:hidden"
              />
            </header>
            <div
              className={cn(
                'min-h-0 flex-1',
                supportingScrollable
                  ? 'overflow-y-auto pt-2 [scrollbar-gutter:stable]'
                  : 'overflow-hidden',
              )}
            >
              {supporting}
            </div>
          </div>
        ) : (
          <div className="expanded:flex no-scrollbar hidden h-full flex-col items-center gap-4 overflow-y-auto py-6">
            <IconButton
              onClick={handleToggle}
              variant="standard"
              className="border-outline-subtle bg-surface hover:border-primary group shrink-0 rounded-sm border transition-all"
              aria-label="Expand pane"
              icon={
                <span className="material-symbols-outlined group-hover:text-primary transition-colors">
                  chevron_left
                </span>
              }
            />
            <div className="bg-outline-subtle min-h-10 w-[calc(var(--unit)/4)] flex-1" />
            <div className="text-label-small text-on-surface-variant mt-12 mb-6 shrink-0 origin-center rotate-90 font-medium tracking-wide whitespace-nowrap">
              {title}
            </div>
          </div>
        )}
      </aside>

      <div
        className={cn(
          'expanded:hidden bg-scrim duration-emphasized absolute inset-0 z-10 backdrop-blur-[calc(var(--unit)/4)] transition-opacity',
          isOpen ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0',
        )}
        onClick={handleClose}
      />
    </div>
  );
};

export interface FeedLayoutProps {
  children: React.ReactNode;
  className?: string;
  isRoot?: boolean;
}

export const FeedLayout: React.FC<FeedLayoutProps> = ({ children, className, isRoot = false }) => {
  return (
    <div
      className={cn(
        'bg-surface-container-low expanded:p-6 no-scrollbar h-full w-full overflow-y-auto scroll-smooth p-4',
        !isRoot && 'border-outline-subtle rounded-sm border',
        className,
      )}
    >
      <div className="max-w-large mx-auto">
        <div className="expanded:grid-cols-2 large:grid-cols-3 expanded:gap-6 grid grid-cols-1 items-start gap-4">
          {children}
        </div>
      </div>
    </div>
  );
};
