import React from 'react';
import { cn } from '@/lib/utils';

export interface PaneGroupProps {
  sidebar: React.ReactNode;
  detail: React.ReactNode;
  showDetail?: boolean;
  className?: string;
}

export const PaneGroup: React.FC<PaneGroupProps> = ({
  sidebar,
  detail,
  showDetail = false,
  className,
}) => {
  return (
    <div className={cn('bg-surface flex h-full w-full overflow-hidden', className)}>
      <div
        className={cn(
          'medium:w-(--width-pane-list,var(--spacing-90)) border-outline-subtle duration-long ease-emphasized h-full w-full shrink-0 overflow-y-auto border-r transition-transform',
          showDetail ? 'medium:block hidden' : 'block',
        )}
      >
        {sidebar}
      </div>

      <div
        className={cn(
          'bg-surface medium:bg-surface-container duration-long ease-standard h-full flex-1 overflow-y-auto transition-opacity',
          !showDetail ? 'medium:block hidden' : 'block',
        )}
      >
        {detail}
      </div>
    </div>
  );
};
