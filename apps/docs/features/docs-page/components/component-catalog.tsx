'use client';

import Link from 'next/link';
import { HeroBackground } from '@/lib/docs/runtime/hero-background';
import { COMPONENT_REGISTRY } from '@/lib/docs/registry/selectors';
import {
  Avatar,
  Button,
  Card,
  Chip,
  Fab,
  IconButton,
  Pagination,
  Progress,
  SearchBar,
  Slider,
  Surface,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Typography,
} from '@unisane/ui';
import { Badge } from '@unisane/ui/badge';
import { Checkbox } from '@unisane/ui/checkbox';
import { Switch } from '@unisane/ui/switch';
import { Alert } from '@unisane/ui/alert';
import { SelectField } from '@unisane/ui/select-field';
import { TextField } from '@unisane/ui/text-field';

function CatalogCard({
  title,
  href,
  children,
}: {
  title: string;
  href: string;
  children: React.ReactNode;
}) {
  return (
    <Link href={href} className="group block h-full">
      <div className="bg-surface-container-low group-hover:bg-surface-container h-full overflow-hidden rounded-lg transition-colors">
        <div className="h-[200px] overflow-hidden">{children}</div>
        <div className="border-outline-weak flex items-center justify-between gap-3 border-t p-4">
          <Typography
            variant="titleMedium"
            component="h3"
            className="text-on-surface group-hover:text-primary truncate transition-colors"
          >
            {title}
          </Typography>
          <span className="material-symbols-outlined text-on-surface-variant group-hover:text-primary text-[18px] transition-all group-hover:translate-x-0.5">
            arrow_forward
          </span>
        </div>
      </div>
    </Link>
  );
}

function renderCatalogPreview(slug: string, icon?: string) {
  switch (slug) {
    case 'button':
    case 'icon-button':
    case 'fab':
    case 'fab-menu':
    case 'segmented-button':
      return (
        <HeroBackground tone="primary" className="rounded-md">
          <div className="flex flex-wrap justify-center gap-3">
            <Button variant="filled">Filled</Button>
            <Button variant="tonal">Tonal</Button>
            <Button variant="outlined">Outlined</Button>
            <Button variant="text">Text</Button>
          </div>
        </HeroBackground>
      );

    case 'card':
      return (
        <HeroBackground tone="secondary" className="rounded-md">
          <Card variant="elevated" className="max-w-[220px] p-4">
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
      );

    case 'chip':
      return (
        <HeroBackground tone="tertiary" className="rounded-md">
          <div className="flex flex-wrap justify-center gap-2">
            <Chip variant="filter" label="React" selected />
            <Chip variant="filter" label="TypeScript" />
            <Chip
              variant="assist"
              label="Add filter"
              icon={<span className="material-symbols-outlined text-[18px]">add</span>}
            />
          </div>
        </HeroBackground>
      );

    case 'text-field':
    case 'select':
    case 'combobox':
    case 'date-input':
    case 'search-bar':
      return (
        <HeroBackground tone="surface" className="rounded-md">
          <div className="w-full max-w-[300px] space-y-3">
            <TextField
              id={`catalog-${slug}-email`}
              label="Email"
              placeholder="Enter your email"
              size="sm"
            />
            {slug === 'search-bar' ? (
              <SearchBar
                value=""
                onChange={() => {}}
                placeholder="Search components"
                size="sm"
                className="pointer-events-none"
              />
            ) : (
              <SelectField
                id={`catalog-${slug}-select`}
                label="Plan"
                size="sm"
                value="growth"
                options={[
                  { value: 'starter', label: 'Starter' },
                  { value: 'growth', label: 'Growth' },
                ]}
                portal={false}
                className="pointer-events-none"
              />
            )}
          </div>
        </HeroBackground>
      );

    case 'checkbox':
    case 'radio':
    case 'switch':
    case 'slider':
    case 'rating':
      return (
        <HeroBackground tone="primary" className="rounded-md">
          <div className="space-y-5">
            <div className="flex items-center justify-center gap-4">
              <Switch id={`catalog-${slug}-switch-on`} defaultChecked />
              <Switch id={`catalog-${slug}-switch-off`} />
            </div>
            <div className="flex items-center justify-center gap-4">
              <Checkbox id={`catalog-${slug}-checked`} defaultChecked />
              <Checkbox id={`catalog-${slug}-unchecked`} />
              <Checkbox id={`catalog-${slug}-indeterminate`} indeterminate />
            </div>
          </div>
        </HeroBackground>
      );

    case 'progress':
      return (
        <HeroBackground tone="secondary" className="rounded-md">
          <div className="w-full max-w-[280px] space-y-5">
            <Progress value={72} />
            <Progress value={38} variant="circular" className="mx-auto" />
          </div>
        </HeroBackground>
      );

    case 'avatar':
    case 'badge':
      return (
        <HeroBackground tone="tertiary" className="rounded-md">
          <div className="flex items-center gap-3">
            <Avatar size="lg" fallback="A" className="bg-primary text-on-primary" />
            <Avatar size="lg" fallback="B" className="bg-secondary text-on-secondary" />
            <Badge content="3" color="error">
              <Avatar size="lg" fallback="C" className="bg-tertiary text-on-tertiary" />
            </Badge>
          </div>
        </HeroBackground>
      );

    case 'tabs':
      return (
        <HeroBackground tone="surface" className="rounded-md">
          <div className="w-full max-w-[320px]">
            <Tabs id="catalog-tabs" defaultValue="overview" className="pointer-events-none">
              <TabsList className="w-full">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="team">Team</TabsTrigger>
                <TabsTrigger value="billing">Billing</TabsTrigger>
              </TabsList>
              <TabsContent value="overview" className="mt-3">
                <Surface tone="surfaceContainerLow" rounded="sm" className="p-4">
                  <Typography variant="bodySmall" className="text-on-surface-variant">
                    A compact overview panel for tabbed content.
                  </Typography>
                </Surface>
              </TabsContent>
            </Tabs>
          </div>
        </HeroBackground>
      );

    case 'pagination':
      return (
        <HeroBackground tone="surface" className="rounded-md">
          <Pagination currentPage={3} totalPages={8} onPageChange={() => {}} />
        </HeroBackground>
      );

    case 'breadcrumb':
      return (
        <HeroBackground tone="surface" className="rounded-md">
          <Surface tone="surface" rounded="sm" className="shadow-1 px-5 py-3">
            <div className="text-label-medium text-on-surface-variant flex items-center gap-2 font-medium">
              <span>Home</span>
              <span className="material-symbols-outlined text-[14px]">chevron_right</span>
              <span>Products</span>
              <span className="material-symbols-outlined text-[14px]">chevron_right</span>
              <span className="text-on-surface">Headphones</span>
            </div>
          </Surface>
        </HeroBackground>
      );

    case 'top-app-bar':
    case 'bottom-app-bar':
    case 'navigation-bar':
    case 'navigation-rail':
    case 'navigation-drawer':
    case 'sidebar':
      return (
        <HeroBackground tone="surface" className="rounded-md">
          <div className="border-outline-variant bg-surface flex h-full w-full max-w-[320px] overflow-hidden rounded-sm border">
            <div className="border-outline-variant bg-surface-container-low w-20 space-y-2 border-r p-3">
              <div className="bg-primary-container h-8 rounded-sm" />
              <div className="bg-surface-container-high h-8 rounded-sm" />
              <div className="bg-surface-container-high h-8 rounded-sm" />
            </div>
            <div className="flex-1 p-4">
              <div className="bg-surface-container-high mb-3 h-10 rounded-sm" />
              <div className="space-y-2">
                <div className="bg-outline-muted h-3 rounded-sm" />
                <div className="bg-outline-muted h-3 rounded-sm" />
                <div className="bg-outline-muted h-3 w-3/4 rounded-sm" />
              </div>
            </div>
          </div>
        </HeroBackground>
      );

    case 'calendar':
    case 'date-picker':
    case 'time-picker':
      return (
        <HeroBackground tone="secondary" className="rounded-md">
          <div className="bg-surface shadow-1 rounded-sm p-4">
            <div className="text-label-small text-on-surface-variant mb-2 grid grid-cols-7 gap-1 text-center">
              {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, index) => (
                <div key={`${day}-${index}`}>{day}</div>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-1">
              {Array.from({ length: 31 }).map((_, index) => (
                <div
                  key={index}
                  className={`text-body-small flex aspect-square items-center justify-center rounded-full ${
                    index === 14 ? 'bg-primary text-on-primary' : 'text-on-surface'
                  }`}
                >
                  {index + 1}
                </div>
              ))}
            </div>
          </div>
        </HeroBackground>
      );

    case 'carousel':
      return (
        <HeroBackground tone="tertiary" className="rounded-md">
          <div className="bg-surface-container-high relative w-full max-w-[320px] rounded-sm p-6">
            <IconButton
              variant="filled"
              size="sm"
              aria-label="Previous slide"
              className="bg-surface pointer-events-none absolute top-1/2 left-4 -translate-y-1/2"
              icon={<span className="material-symbols-outlined">chevron_left</span>}
            />
            <div className="bg-surface-container-low flex h-28 items-center justify-center rounded-sm">
              <span className="material-symbols-outlined text-on-surface-variant text-[36px]">
                image
              </span>
            </div>
            <IconButton
              variant="filled"
              size="sm"
              aria-label="Next slide"
              className="bg-surface pointer-events-none absolute top-1/2 right-4 -translate-y-1/2"
              icon={<span className="material-symbols-outlined">chevron_right</span>}
            />
          </div>
        </HeroBackground>
      );

    case 'canonical-layouts':
    case 'pane-group':
      return (
        <HeroBackground tone="surface" className="rounded-md">
          <div className="border-outline-variant bg-surface flex h-full w-full max-w-[320px] overflow-hidden rounded-sm border">
            <div className="border-outline-variant bg-surface w-24 space-y-2 border-r p-3">
              <div className="bg-primary-container h-3 rounded-sm" />
              <div className="bg-secondary-container h-8 rounded-sm" />
              <div className="bg-surface-container-high h-8 rounded-sm" />
              <div className="bg-surface-container-high h-8 rounded-sm" />
            </div>
            <div className="bg-surface-container-low flex-1 p-4">
              <div className="mb-3 flex items-center gap-3">
                <div className="bg-primary-container h-10 w-10 rounded-full" />
                <div className="flex-1 space-y-1">
                  <div className="bg-outline-muted h-3 w-3/4 rounded-sm" />
                  <div className="bg-outline-muted h-2 w-1/2 rounded-sm" />
                </div>
              </div>
              <div className="space-y-2">
                <div className="bg-surface-container-high h-2 rounded-sm" />
                <div className="bg-surface-container-high h-2 rounded-sm" />
                <div className="bg-surface-container-high h-2 w-3/4 rounded-sm" />
              </div>
            </div>
          </div>
        </HeroBackground>
      );

    case 'alert':
    case 'banner':
    case 'toast':
      return (
        <HeroBackground tone="secondary" className="rounded-md">
          <div className="w-full max-w-[300px] space-y-3">
            <Alert variant="info" title="Changes published">
              Your settings are now live for all members.
            </Alert>
            <Surface tone="surface" rounded="sm" className="shadow-1 flex items-center gap-3 p-3">
              <span className="material-symbols-outlined text-primary">check_circle</span>
              <Typography variant="bodySmall" className="text-on-surface">
                Draft shared successfully
              </Typography>
            </Surface>
          </div>
        </HeroBackground>
      );

    default:
      return (
        <HeroBackground tone="surface" className="rounded-md">
          <div className="flex flex-col items-center justify-center gap-3 text-center">
            <div className="bg-surface text-on-surface-variant shadow-1 flex h-12 w-12 items-center justify-center rounded-sm">
              <span className="material-symbols-outlined text-[24px]">{icon || 'widgets'}</span>
            </div>
            <Typography
              variant="bodySmall"
              component="p"
              className="text-on-surface-variant max-w-[18ch]"
            >
              Production-ready component preview
            </Typography>
          </div>
        </HeroBackground>
      );
  }
}

export function ComponentCatalog() {
  return (
    <div className="grid grid-cols-1 gap-4 @lg:grid-cols-2 @4xl:grid-cols-3">
      {COMPONENT_REGISTRY.map((component) => (
        <CatalogCard
          key={component.slug}
          title={component.name}
          href={`/docs/components/${component.slug}`}
        >
          {renderCatalogPreview(component.slug, component.icon)}
        </CatalogCard>
      ))}
    </div>
  );
}

export function ComponentCatalogHeader() {
  return (
    <div className="mb-10 @3xl:mb-12">
      <Typography
        variant="headlineLarge"
        component="h1"
        className="text-on-surface @3xl:text-display-small"
      >
        Components for every need
      </Typography>
      <Typography
        variant="titleMedium"
        component="p"
        className="text-on-surface-variant @3xl:text-title-large mt-4 max-w-3xl"
      >
        From buttons to complex layouts, everything you need to build product interfaces with one
        consistent system.
      </Typography>
    </div>
  );
}
