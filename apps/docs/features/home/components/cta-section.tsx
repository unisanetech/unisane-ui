"use client";

import Link from "next/link";
import { Button, Typography } from "@unisane/ui";
import { UnisaneLogo } from "@/features/branding";

export function CtaSection() {
  return (
    <div className="max-w-2xl">
      <UnisaneLogo size={48} className="mb-6" />
      <Typography
        variant="headlineMedium"
        className="mb-4 text-on-surface @3xl:text-headline-large"
      >
        Ready to get started?
      </Typography>
      <Typography variant="titleMedium" className="mb-8 text-on-surface-variant">
        Add Unisane UI to your project in seconds
      </Typography>
      <div className="flex flex-wrap gap-4">
        <Button asChild variant="filled" size="lg">
          <Link href="/docs/getting-started">Read the docs</Link>
        </Button>
        <Button asChild variant="outlined" size="lg">
          <a
            href="https://github.com/anthropics/unisane-ui"
            target="_blank"
            rel="noopener noreferrer"
          >
            GitHub
          </a>
        </Button>
      </div>
    </div>
  );
}
