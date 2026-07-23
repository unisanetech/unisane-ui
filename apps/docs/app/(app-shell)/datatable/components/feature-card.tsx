'use client';

import { Icon } from '@unisane/ui/icon';
import { Typography } from '@unisane/ui/typography';

interface FeatureCardProps {
  icon: string;
  title: string;
  description: string;
}

export function FeatureCard({ icon, title, description }: FeatureCardProps) {
  return (
    <div className="border-outline-variant flex gap-4 rounded-lg border p-4">
      <div className="bg-state-selected flex h-10 w-10 shrink-0 items-center justify-center rounded-lg">
        <Icon symbol={icon} className="text-primary h-5 w-5" />
      </div>
      <div>
        <Typography variant="titleSmall" className="text-on-surface mb-1">
          {title}
        </Typography>
        <Typography variant="bodySmall" className="text-on-surface-variant">
          {description}
        </Typography>
      </div>
    </div>
  );
}
