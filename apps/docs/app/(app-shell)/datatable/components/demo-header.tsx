'use client';

import { Typography } from '@unisane/ui/typography';

interface DemoHeaderProps {
  title: string;
  description: string;
}

export function DemoHeader({ title, description }: DemoHeaderProps) {
  return (
    <div className="border-outline-variant medium:-mx-6 expanded:-mx-12 medium:px-6 expanded:px-12 -mx-4 border-b px-4 py-8">
      <Typography variant="headlineLarge" className="text-on-surface mb-2">
        {title}
      </Typography>
      <Typography variant="bodyLarge" className="text-on-surface-variant">
        {description}
      </Typography>
    </div>
  );
}
