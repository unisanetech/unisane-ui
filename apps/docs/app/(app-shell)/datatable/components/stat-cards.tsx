'use client';

import { Card } from '@unisane/ui/card';
import { Typography } from '@unisane/ui/typography';

interface StatCardProps {
  title: string;
  value: string | number;
  prefix?: string;
  suffix?: string;
}

export function StatCard({ title, value, prefix = '', suffix = '' }: StatCardProps) {
  return (
    <Card variant="filled" className="p-4">
      <Typography variant="titleMedium" className="text-on-surface mb-2">
        {title}
      </Typography>
      <Typography variant="displaySmall" className="text-primary">
        {prefix}
        {value}
        {suffix}
      </Typography>
    </Card>
  );
}

interface StatCardsProps {
  stats: StatCardProps[];
}

export function StatCards({ stats }: StatCardsProps) {
  return (
    <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">
      {stats.map((stat, index) => (
        <StatCard key={index} {...stat} />
      ))}
    </div>
  );
}
