'use client';

import { Surface, Typography } from '@unisane/ui';
import { getComponentCount } from '@/lib/docs/registry/selectors';
import { HOME_STATS } from '../model/home.constants';

export function StatsSection() {
  const stats = HOME_STATS.map((stat) =>
    stat.label === 'Components' ? { ...stat, value: `${getComponentCount()}+` } : stat,
  );

  return (
    <section className="medium:px-1.5 medium:pb-1.5 expanded:px-2 expanded:pb-2 px-1 pb-1">
      <Surface
        tone="surfaceContainerLow"
        rounded="sm"
        className="px-6 py-8 @sm:px-8 @sm:py-10 @3xl:px-12 @3xl:py-12"
      >
        <div className="mx-auto grid max-w-6xl grid-cols-2 gap-8 @lg:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <Typography variant="displaySmall" className="text-on-surface mb-1">
                {stat.value}
              </Typography>
              <Typography variant="bodyMedium" className="text-on-surface-variant">
                {stat.label}
              </Typography>
            </div>
          ))}
        </div>
      </Surface>
    </section>
  );
}
