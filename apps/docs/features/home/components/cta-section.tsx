'use client';

import Link from 'next/link';
import { Button } from '@unisane/ui/button';
import { Icon } from '@unisane/ui/icon';
import { Surface } from '@unisane/ui/surface';
import { Typography } from '@unisane/ui/typography';

export function CtaSection() {
  return (
    <>
      <Surface
        tone="primaryContainer"
        rounded="lg"
        className="border-outline-weak flex flex-col gap-6 border p-7 @4xl:flex-row @4xl:items-center @4xl:justify-between @5xl:p-9"
      >
        <Typography variant="headlineMedium" component="h2" className="text-on-primary-container">
          Start with one component.
        </Typography>
        <div className="flex flex-col gap-3 @3xl:flex-row @5xl:justify-end">
          <Button asChild variant="filled" trailingIcon={<Icon symbol="arrow_forward" />}>
            <Link href="/docs/getting-started">Get started</Link>
          </Button>
          <Button asChild variant="tonal">
            <Link href="/docs/components">Components</Link>
          </Button>
          <Button asChild variant="text">
            <a
              href="https://github.com/unisanetech/unisane-ui"
              target="_blank"
              rel="noopener noreferrer"
            >
              GitHub
            </a>
          </Button>
        </div>
      </Surface>

      <footer className="text-on-surface-variant mt-12 flex flex-wrap items-center justify-between gap-4 text-label-small font-semibold tracking-[0.18em] uppercase">
        <span>Unisane UI</span>
        <span>Registry-first</span>
        <span>MIT licensed</span>
      </footer>
    </>
  );
}
