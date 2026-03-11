"use client";

import Link from "next/link";
import {
  Avatar,
  Badge,
  Button,
  Card,
  Checkbox,
  Chip,
  Fab,
  Progress,
  Slider,
  Surface,
  Switch,
  TextField,
  Typography,
} from "@unisane/ui";
import { HeroBackground } from "@/lib/docs/runtime/hero-background";

function BentoCard({
  title,
  href,
  children,
}: {
  title: string;
  href: string;
  children: React.ReactNode;
}) {
  return (
    <Link href={href} className="group block">
      <div className="h-full overflow-hidden rounded-lg border border-outline-weak bg-surface-container-low transition-colors hover:border-outline-muted">
        <div className="h-[180px]">{children}</div>
        <div className="flex items-center justify-between border-t border-outline-weak p-4">
          <Typography
            variant="titleMedium"
            className="text-on-surface transition-colors group-hover:text-primary"
          >
            {title}
          </Typography>
          <span className="material-symbols-outlined text-[18px] text-on-surface-variant transition-all group-hover:translate-x-0.5 group-hover:text-primary">
            arrow_forward
          </span>
        </div>
      </div>
    </Link>
  );
}

function ComponentBentoGrid() {
  return (
    <div className="grid grid-cols-1 gap-4 @lg:grid-cols-2 @3xl:grid-cols-3">
      <BentoCard title="Buttons" href="/docs/components/button">
        <HeroBackground tone="primary" className="rounded-md">
          <div className="flex flex-wrap justify-center gap-3">
            <Button variant="filled">Filled</Button>
            <Button variant="tonal">Tonal</Button>
            <Button variant="outlined">Outlined</Button>
            <Button variant="elevated">Elevated</Button>
            <Button variant="text">Text</Button>
          </div>
        </HeroBackground>
      </BentoCard>

      <BentoCard title="Cards" href="/docs/components/card">
        <HeroBackground tone="secondary" className="rounded-md">
          <Card variant="elevated" className="max-w-[200px] p-4">
            <div className="flex items-center gap-3">
              <Avatar size="md" fallback="JD" className="bg-primary text-on-primary" />
              <div>
                <Typography variant="titleSmall">John Doe</Typography>
                <Typography variant="bodySmall" className="text-on-surface-variant">
                  Designer
                </Typography>
              </div>
            </div>
          </Card>
        </HeroBackground>
      </BentoCard>

      <BentoCard title="Chips" href="/docs/components/chip">
        <HeroBackground tone="tertiary" className="rounded-md">
          <div className="flex flex-wrap justify-center gap-2">
            <Chip variant="filter" label="React" selected />
            <Chip variant="filter" label="TypeScript" />
            <Chip variant="filter" label="Tailwind" />
            <Chip
              variant="assist"
              label="Add filter"
              icon={<span className="material-symbols-outlined text-[18px]">add</span>}
            />
          </div>
        </HeroBackground>
      </BentoCard>

      <BentoCard title="Text Fields" href="/docs/components/text-field">
        <HeroBackground tone="surface" className="rounded-md">
          <div className="w-full max-w-[280px] space-y-3">
            <TextField
              id="home-bento-email"
              label="Email"
              placeholder="Enter your email"
              variant="outlined"
            />
            <TextField
              id="home-bento-password"
              label="Password"
              placeholder="Enter password"
              variant="filled"
              type="password"
            />
          </div>
        </HeroBackground>
      </BentoCard>

      <BentoCard title="Selection Controls" href="/docs/components/switch">
        <HeroBackground tone="primary" className="rounded-md">
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <Switch id="home-bento-switch-enabled" defaultChecked />
              <Switch id="home-bento-switch-disabled" />
            </div>
            <div className="flex items-center gap-4">
              <Checkbox id="home-bento-checkbox-checked" defaultChecked />
              <Checkbox id="home-bento-checkbox-unchecked" />
              <Checkbox id="home-bento-checkbox-indeterminate" indeterminate />
            </div>
          </div>
        </HeroBackground>
      </BentoCard>

      <BentoCard title="Progress" href="/docs/components/progress">
        <HeroBackground tone="secondary" className="rounded-md">
          <div className="w-full max-w-[280px] space-y-4">
            <Progress value={65} />
            <Progress value={40} variant="circular" className="mx-auto" />
          </div>
        </HeroBackground>
      </BentoCard>

      <BentoCard title="Avatars" href="/docs/components/avatar">
        <HeroBackground tone="tertiary" className="rounded-md">
          <div className="flex items-center gap-3">
            <Avatar size="lg" fallback="A" className="bg-primary text-on-primary" />
            <Avatar size="lg" fallback="B" className="bg-secondary text-on-secondary" />
            <Avatar size="lg" fallback="C" className="bg-tertiary text-on-tertiary" />
            <Badge content="3" color="error">
              <Avatar size="lg" fallback="D" className="bg-error text-on-error" />
            </Badge>
          </div>
        </HeroBackground>
      </BentoCard>

      <BentoCard title="Sliders" href="/docs/components/slider">
        <HeroBackground tone="surface" className="rounded-md">
          <div className="w-full max-w-[280px] space-y-6">
            <Slider defaultValue={30} />
            <Slider defaultValue={70} />
          </div>
        </HeroBackground>
      </BentoCard>

      <BentoCard title="FAB" href="/docs/components/fab">
        <HeroBackground tone="primary" className="rounded-md">
          <div className="flex items-center gap-4">
            <Fab
              icon={<span className="material-symbols-outlined">add</span>}
              aria-label="Add"
              size="sm"
            />
            <Fab
              icon={<span className="material-symbols-outlined">edit</span>}
              aria-label="Edit"
            />
            <Fab
              icon={<span className="material-symbols-outlined">navigation</span>}
              aria-label="Navigate"
              size="lg"
              variant="secondary"
            />
          </div>
        </HeroBackground>
      </BentoCard>
    </div>
  );
}

export function ComponentGridSection() {
  return (
    <>
      <Typography
        variant="headlineMedium"
        className="mb-4 text-on-surface @3xl:text-headline-large"
      >
        Components for every need
      </Typography>
      <Typography
        variant="titleMedium"
        className="mb-12 max-w-2xl text-on-surface-variant"
      >
        From buttons to complex layouts, everything you need to build
      </Typography>

      <ComponentBentoGrid />

      <div className="mt-12">
        <Button asChild variant="tonal" size="lg">
          <Link href="/docs/components">View all components</Link>
        </Button>
      </div>
    </>
  );
}
