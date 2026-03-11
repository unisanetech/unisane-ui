"use client";

import { Typography } from "@unisane/ui";
import { HOME_FEATURES } from "../model/home.constants";

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: string;
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-lg border border-outline-weak bg-surface-container p-6 transition-colors hover:border-outline-muted">
      <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-md bg-state-selected">
        <span className="material-symbols-outlined text-[22px] text-primary">
          {icon}
        </span>
      </div>
      <Typography variant="titleMedium" className="mb-2 text-on-surface">
        {title}
      </Typography>
      <Typography variant="bodyMedium" className="leading-relaxed text-on-surface-variant">
        {description}
      </Typography>
    </div>
  );
}

export function FeaturesSection() {
  return (
    <>
      <Typography
        variant="headlineMedium"
        className="mb-4 text-on-surface @3xl:text-headline-large"
      >
        Built for developers
      </Typography>
      <Typography
        variant="titleMedium"
        className="mb-12 max-w-2xl text-on-surface-variant"
      >
        Modern tools and practices for exceptional developer experience
      </Typography>

      <div className="grid gap-6 @lg:grid-cols-2 @3xl:grid-cols-3">
        {HOME_FEATURES.map((feature) => (
          <FeatureCard key={feature.title} {...feature} />
        ))}
      </div>
    </>
  );
}
