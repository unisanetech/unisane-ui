'use client';

import Link from 'next/link';
import { Button } from '@unisane/ui/button';
import { Icon } from '@unisane/ui/icon';
import { Surface } from '@unisane/ui/surface';
import { Typography } from '@unisane/ui/typography';
import { UnisaneLogo, UnisaneWordmark } from '@/features/branding';
import { InstallCommand } from './install-command';

const HOME_NAVIGATION = [
  { label: 'Components', href: '/docs/components' },
  { label: 'Themes', href: '/docs/getting-started/theming' },
  { label: 'Docs', href: '/docs' },
] as const;

export function HeroSection() {
  return (
    <Surface tone="surface" className="border-outline-weak border-b">
      <header className="border-outline-weak border-b">
        <div className="mx-auto flex h-18 w-full max-w-[1440px] items-center justify-between gap-6 px-5 @sm:px-8 @3xl:px-12">
          <Link
            href="/"
            aria-label="Unisane UI home"
            className="focus-visible:ring-focus-ring inline-flex items-center gap-2 rounded-xs outline-none focus-visible:ring-2"
          >
            <UnisaneLogo size={28} />
            <UnisaneWordmark />
          </Link>

          <nav aria-label="Primary navigation" className="flex items-center gap-0.5">
            {HOME_NAVIGATION.map((item) => (
              <Button
                key={item.href}
                asChild
                variant="text"
                className={item.label === 'Docs' ? '' : 'hidden @lg:inline-flex'}
              >
                <Link href={item.href}>{item.label}</Link>
              </Button>
            ))}
            <Button asChild variant="text" className="hidden @lg:inline-flex">
              <a
                href="https://github.com/unisanetech/unisane-ui"
                target="_blank"
                rel="noopener noreferrer"
              >
                GitHub
                <Icon symbol="open_in_new" />
              </a>
            </Button>
          </nav>
        </div>
      </header>

      <section className="mx-auto flex min-h-[32rem] w-full max-w-[1440px] items-center px-5 py-16 @sm:min-h-[35rem] @sm:px-8 @sm:py-20 @3xl:px-12 @5xl:min-h-[36rem]">
        <div className="w-full max-w-[70rem]">
          <h1 className="text-on-surface max-w-[16ch] text-[clamp(3.25rem,7vw,6rem)] leading-[0.94] font-semibold tracking-[-0.06em]">
            Interfaces, built as a system.
          </h1>

          <Typography
            variant="titleLarge"
            className="text-on-surface-variant mt-7 max-w-[42ch] leading-relaxed @sm:mt-9"
          >
            Open-code React components for product teams.
          </Typography>

          <div className="mt-10 flex max-w-[52rem] flex-col gap-3 @lg:flex-row @lg:items-center">
            <InstallCommand className="w-full @lg:max-w-[23rem]" />
            <Button asChild trailingIcon={<Icon symbol="arrow_forward" />}>
              <Link href="/docs/getting-started">Get started</Link>
            </Button>
            <Button asChild variant="text" trailingIcon={<Icon symbol="arrow_forward" />}>
              <Link href="/docs/components">Browse components</Link>
            </Button>
          </div>
        </div>
      </section>
    </Surface>
  );
}
