"use client";

import { Typography } from "@unisane/ui";
import { getComponentCount } from "@/lib/docs/registry/selectors";
import { HOME_STATS } from "../model/home.constants";

export function StatsSection() {
  const stats = HOME_STATS.map((stat) =>
    stat.label === "Components"
      ? { ...stat, value: `${getComponentCount()}+` }
      : stat
  );

  return (
    <section className="border-y border-outline-weak bg-surface-container-low px-4 py-8 medium:px-6 @3xl:px-8 @3xl:py-10">
      <div className="mx-auto grid max-w-6xl grid-cols-2 gap-8 @lg:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.label} className="text-center">
            <Typography variant="displaySmall" className="mb-1 text-on-surface">
              {stat.value}
            </Typography>
            <Typography variant="bodyMedium" className="text-on-surface-variant">
              {stat.label}
            </Typography>
          </div>
        ))}
      </div>
    </section>
  );
}
