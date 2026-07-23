'use client';

import type { UsageGuideline } from '@/lib/docs/registry/types';
import { cn } from '@unisane/ui/utils';

interface GuidelinesListProps {
  guidelines: UsageGuideline[];
  className?: string;
}

const GUIDELINE_CONFIG = {
  do: {
    icon: 'check_circle',
    label: 'Do',
    className: 'text-success bg-success-container border-success',
    iconClassName: 'text-success',
  },
  dont: {
    icon: 'cancel',
    label: "Don't",
    className: 'text-error bg-error-container border-error',
    iconClassName: 'text-error',
  },
  caution: {
    icon: 'warning',
    label: 'Caution',
    className: 'text-warning bg-warning-container border-warning',
    iconClassName: 'text-warning',
  },
};

export function GuidelinesList({ guidelines, className }: GuidelinesListProps) {
  if (!guidelines.length) return null;

  // Group guidelines by type
  const grouped = {
    do: guidelines.filter((g) => g.type === 'do'),
    dont: guidelines.filter((g) => g.type === 'dont'),
    caution: guidelines.filter((g) => g.type === 'caution'),
  };

  return (
    <div className={cn('space-y-6', className)}>
      {(['do', 'dont', 'caution'] as const).map((type) => {
        const items = grouped[type];
        if (!items.length) return null;

        const config = GUIDELINE_CONFIG[type];

        return (
          <div key={type} className="space-y-3">
            <div className="flex items-center gap-2">
              <span className={cn('material-symbols-outlined text-[20px]!', config.iconClassName)}>
                {config.icon}
              </span>
              <span className="text-title-small text-on-surface font-semibold">{config.label}</span>
            </div>

            <ul className="space-y-2">
              {items.map((item, index) => (
                <li
                  key={index}
                  className={cn('flex items-start gap-3 rounded-md border p-4', config.className)}
                >
                  <span
                    className={cn(
                      'material-symbols-outlined mt-0.5 shrink-0 text-[18px]!',
                      config.iconClassName,
                    )}
                  >
                    {config.icon}
                  </span>
                  <span className="text-body-medium text-on-surface font-medium">{item.text}</span>
                </li>
              ))}
            </ul>
          </div>
        );
      })}
    </div>
  );
}
