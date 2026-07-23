'use client';

import type { ComponentDoc } from '../types';
import { HeroBackground } from '../../runtime/hero-background';
import { StatCard, StatGrid } from '@unisane/ui/stat-card';

const StatCardPreview = () => (
  <StatGrid columns={2} className="w-full max-w-xl">
    <StatCard
      label="Revenue"
      value="$24.8k"
      icon="payments"
      trend={{ value: 12, direction: 'up' }}
    />
    <StatCard label="Conversion" value="7.4%" icon="trending_up" description="Last 30 days" />
  </StatGrid>
);

export const statCardDoc: ComponentDoc = {
  slug: 'stat-card',
  name: 'Stat Card',
  description: 'A compact semantic summary of one metric, its context, and optional trend.',
  category: 'data-display',
  status: 'stable',
  icon: 'monitoring',
  importPath: '@/components/ui/stat-card',
  exports: ['StatCard', 'StatCardProps', 'StatGrid', 'StatGridProps'],
  heroVisual: (
    <HeroBackground tone="tertiary">
      <StatCardPreview />
    </HeroBackground>
  ),
  props: [
    { name: 'label', type: 'string', required: true, description: 'Short metric label.' },
    {
      name: 'value',
      type: 'ReactNode',
      required: true,
      description: 'Primary formatted metric value.',
    },
    {
      name: 'description',
      type: 'string',
      description: 'Optional time range or supporting context.',
    },
    {
      name: 'trend',
      type: '{ value: number; direction: "up" | "down" | "neutral" }',
      description: 'Optional directional change.',
    },
  ],
  guidelines: [
    {
      type: 'do',
      text: 'Format values before passing them to keep domain formatting outside the component.',
    },
    {
      type: 'dont',
      text: 'Do not use color or arrow direction as the only explanation of a critical change.',
    },
  ],
  accessibility: {
    screenReader: [
      'Metric label, value, description, and trend remain text content in reading order.',
    ],
  },
  implementation: {
    code: `import { StatCard, StatGrid } from "@/components/ui/stat-card";`,
  },
  related: [
    { slug: 'card', reason: 'Use Card when the content is not specifically a metric summary.' },
  ],
};
