'use client';

import Link from 'next/link';
import React from 'react';
import { Alert } from '@unisane/ui/alert';
import {
  type ActionShape,
  type Density,
  type RadiusTheme,
  useAppearance,
} from '@unisane/ui/appearance-provider';
import { Avatar } from '@unisane/ui/avatar';
import { Badge } from '@unisane/ui/badge';
import { Button } from '@unisane/ui/button';
import { Checkbox } from '@unisane/ui/checkbox';
import { Chip } from '@unisane/ui/chip';
import { Icon } from '@unisane/ui/icon';
import { IconButton } from '@unisane/ui/icon-button';
import { Popover } from '@unisane/ui/popover';
import { Progress } from '@unisane/ui/progress';
import { SearchBar } from '@unisane/ui/search-bar';
import { SelectField } from '@unisane/ui/select-field';
import { SegmentedButton } from '@unisane/ui/segmented-button';
import { Slider } from '@unisane/ui/slider';
import { Surface } from '@unisane/ui/surface';
import { Switch } from '@unisane/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@unisane/ui/tabs';
import { TextField } from '@unisane/ui/text-field';
import { Typography } from '@unisane/ui/typography';
import {
  COLOR_THEME_OPTIONS,
  getColorThemeSwatch,
  type ColorThemeOption,
} from '@/lib/theme/color-theme-options';

interface ShowcaseCellProps {
  label: string;
  href: string;
  className?: string;
  children: React.ReactNode;
}

function ShowcaseCell({ label, href, className = '', children }: ShowcaseCellProps) {
  return (
    <article
      className={`border-outline-weak bg-surface flex min-h-[17rem] min-w-0 flex-col border-r border-b p-5 @sm:p-6 ${className}`}
    >
      <div className="mb-8 flex items-center justify-between gap-4">
        <Typography
          variant="labelMedium"
          className="text-on-surface tracking-[0.08em] uppercase"
        >
          {label}
        </Typography>
        <IconButton
          asChild
          variant="standard"
          aria-label={`Open ${label} documentation`}
        >
          <Link href={href}>
            <Icon symbol="arrow_outward" />
          </Link>
        </IconButton>
      </div>
      <div className="flex min-h-0 flex-1 items-center">{children}</div>
    </article>
  );
}

const DENSITY_OPTIONS: readonly { value: Density; label: string }[] = [
  { value: 'compact', label: 'Compact' },
  { value: 'standard', label: 'Standard' },
  { value: 'comfortable', label: 'Comfortable' },
];

const RADIUS_OPTIONS: readonly { value: RadiusTheme; label: string }[] = [
  { value: 'sharp', label: 'Sharp' },
  { value: 'standard', label: 'Standard' },
  { value: 'soft', label: 'Soft' },
];

const ACTION_SHAPE_OPTIONS: readonly { value: ActionShape; label: string }[] = [
  { value: 'standard', label: 'Standard' },
  { value: 'full', label: 'Pill' },
];

function AxisControl<Value extends string>({
  label,
  options,
  value,
  onValueChange,
}: {
  label: string;
  options: readonly { value: Value; label: string }[];
  value: Value;
  onValueChange: (value: Value) => void;
}) {
  return (
    <div className="min-w-0">
      <Typography
        variant="labelMedium"
        className="text-on-surface-variant mb-3 block tracking-[0.08em] uppercase"
      >
        {label}
      </Typography>
      <SegmentedButton
        aria-label={`${label} preview`}
        options={options}
        value={value}
        onValueChange={onValueChange}
        className="w-full"
      />
    </div>
  );
}

function FoundationsShowcase() {
  const { preferences, setPreference } = useAppearance();

  return (
    <div className="grid w-full gap-10 @4xl:grid-cols-12 @7xl:gap-14">
      <div className="@4xl:col-span-5">
        <Typography variant="displaySmall" className="block max-w-[12ch] tracking-[-0.04em]">
          A type scale with a job for every level.
        </Typography>
        <Typography
          variant="bodyLarge"
          className="text-on-surface-variant mt-5 block max-w-[36rem]"
        >
          Display, title, body, and label roles stay readable as density changes.
        </Typography>
        <div className="border-outline-weak mt-8 flex flex-wrap items-center gap-x-5 gap-y-3 border-t pt-5">
          <Typography variant="titleMedium">Title</Typography>
          <Typography variant="bodyMedium" className="text-on-surface-variant">
            Body copy
          </Typography>
          <Typography variant="labelMedium" className="tracking-[0.08em] uppercase">
            Interface label
          </Typography>
        </div>
      </div>

      <div className="grid min-w-0 gap-7 @4xl:col-span-7 @7xl:grid-cols-2">
        <AxisControl
          label="Density"
          options={DENSITY_OPTIONS}
          value={preferences.density}
          onValueChange={(value) => setPreference('density', value)}
        />
        <AxisControl
          label="Action shape"
          options={ACTION_SHAPE_OPTIONS}
          value={preferences.actionShape}
          onValueChange={(value) => setPreference('actionShape', value)}
        />
        <div className="@7xl:col-span-2">
          <AxisControl
            label="Radius"
            options={RADIUS_OPTIONS}
            value={preferences.radius}
            onValueChange={(value) => setPreference('radius', value)}
          />
        </div>
        <Surface
          tone="surfaceContainerLow"
          className="border-outline-weak flex flex-wrap items-center gap-3 border p-5 @7xl:col-span-2"
        >
          <Button>Continue</Button>
          <Button variant="outlined">Review</Button>
          <Badge variant="tonal" color="success">
            Live system
          </Badge>
          <Typography variant="bodySmall" className="text-on-surface-variant ml-auto">
            Every control above updates this page.
          </Typography>
        </Surface>
      </div>
    </div>
  );
}

function ActionsShowcase() {
  const [selected, setSelected] = React.useState(true);

  return (
    <div className="w-full space-y-5">
      <div className="flex flex-wrap items-center gap-3">
        <Button>Primary</Button>
        <Button variant="tonal">Tonal</Button>
        <Button variant="outlined">Outlined</Button>
        <Button variant="text">Text</Button>
        <IconButton
          variant="outlined"
          aria-label="Tune component"
          icon={<Icon symbol="tune" />}
        />
      </div>
      <div className="border-outline-weak flex flex-wrap gap-2 border-t pt-5">
        <Chip
          label="Assigned to me"
          variant="filter"
          selected={selected}
          onClick={() => setSelected((current) => !current)}
        />
        <Chip label="Due this week" variant="filter" onClick={() => undefined} />
        <Chip label="Add filter" variant="assist" icon={<Icon symbol="add" />} />
      </div>
    </div>
  );
}

function InputShowcase() {
  return (
    <div className="w-full space-y-5">
      <div className="grid gap-4 @lg:grid-cols-2">
        <TextField
          id="home-showcase-email"
          label="Work email"
          defaultValue="team@northstar.dev"
        />
        <SelectField
          label="Role"
          defaultValue="designer"
          options={[
            { value: 'designer', label: 'Designer' },
            { value: 'engineer', label: 'Engineer' },
            { value: 'product', label: 'Product' },
          ]}
        />
      </div>
      <div className="flex flex-wrap items-center gap-x-6 gap-y-4">
        <Checkbox id="home-showcase-remember" label="Remember settings" defaultChecked />
        <Switch id="home-showcase-notify" label="Notify owners" defaultChecked />
      </div>
    </div>
  );
}

function NavigationShowcase() {
  return (
    <div className="w-full space-y-4">
      <Tabs defaultValue="home">
        <TabsList aria-label="Workspace navigation preview">
          <TabsTrigger value="home" icon={<Icon symbol="home" />}>
            Home
          </TabsTrigger>
          <TabsTrigger value="projects">Projects</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
        </TabsList>
        <TabsContent value="home">
          <Typography variant="bodySmall" className="text-on-surface-variant">
            Overview selected. Arrow keys move between tabs.
          </Typography>
        </TabsContent>
        <TabsContent value="projects">
          <Typography variant="bodySmall" className="text-on-surface-variant">
            Projects selected. Content follows the active tab.
          </Typography>
        </TabsContent>
        <TabsContent value="activity">
          <Typography variant="bodySmall" className="text-on-surface-variant">
            Activity selected. Keyboard focus remains visible.
          </Typography>
        </TabsContent>
      </Tabs>
      <SearchBar placeholder="Search projects…" aria-label="Search project preview" />
    </div>
  );
}

function SelectionShowcase() {
  const [priority, setPriority] = React.useState(68);

  return (
    <div className="w-full space-y-6">
      <div className="flex flex-wrap items-center gap-x-6 gap-y-4">
        <Checkbox id="home-showcase-selected" label="Selected row" defaultChecked />
        <Switch id="home-showcase-live" label="Live updates" defaultChecked />
      </div>
      <div>
        <div className="mb-2 flex items-center justify-between gap-4">
          <Typography variant="labelMedium">Priority</Typography>
          <Badge variant="tonal">{priority}%</Badge>
        </div>
        <Slider
          aria-label="Priority preview"
          value={priority}
          onValueChange={setPriority}
          withTicks
          step={25}
        />
      </div>
    </div>
  );
}

const PROJECTS = [
  { initials: 'AK', name: 'Dashboard redesign', status: 'In progress', progress: 64 },
  { initials: 'ML', name: 'Billing migration', status: 'Ready', progress: 92 },
] as const;

function DataShowcase() {
  return (
    <div className="border-outline-weak w-full border-t">
      {PROJECTS.map((project) => (
        <div
          key={project.name}
          className="border-outline-weak grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 border-b py-4"
        >
          <div className="flex min-w-0 items-center gap-3">
            <Avatar fallback={project.initials} className="bg-primary-container" />
            <Typography variant="labelMedium" className="truncate">
              {project.name}
            </Typography>
          </div>
          <div className="flex items-center gap-3">
            <Badge variant="tonal" color={project.status === 'Ready' ? 'success' : 'primary'}>
              {project.status}
            </Badge>
            <Progress value={project.progress} className="hidden w-24 @sm:block" />
          </div>
        </div>
      ))}
    </div>
  );
}

function FeedbackShowcase() {
  const [message, setMessage] = React.useState('Project created successfully');

  return (
    <div className="w-full space-y-4">
      <Alert variant="success">{message}</Alert>
      <div className="flex flex-wrap gap-2">
        <Button onClick={() => setMessage('Changes saved')}>Save changes</Button>
        <Button variant="outlined" onClick={() => setMessage('Draft restored')}>
          Restore draft
        </Button>
      </div>
    </div>
  );
}

type ColorTheme = ColorThemeOption['value'];

function ThemeShowcase() {
  const [theme, setTheme] = React.useState<ColorTheme>('blue');

  React.useEffect(() => {
    document.documentElement.setAttribute('data-color-theme', theme);
    document.documentElement.setAttribute('data-scheme', 'tonal');
  }, [theme]);

  return (
    <div className="w-full">
      <div className="flex flex-wrap gap-2" role="radiogroup" aria-label="Color theme preview">
        {COLOR_THEME_OPTIONS.slice(0, 8).map((option) => {
          const selected = option.value === theme;
          return (
            <IconButton
              key={option.value}
              variant={selected ? 'outlined' : 'standard'}
              selected={selected}
              role="radio"
              aria-checked={selected}
              aria-label={`${option.label} color theme`}
              onClick={() => setTheme(option.value)}
              icon={
                <span
                  className="border-outline-soft h-5 w-5 rounded-full border"
                  style={{ backgroundColor: getColorThemeSwatch(option) }}
                />
              }
            />
          );
        })}
      </div>
      <div className="border-outline-weak mt-5 flex items-center justify-between gap-4 border-t pt-5">
        <div>
          <Typography variant="labelLarge" className="block">
            One semantic contract
          </Typography>
          <Typography variant="bodySmall" className="text-on-surface-variant mt-1 block">
            Every component updates together.
          </Typography>
        </div>
        <Badge variant="tonal">{theme}</Badge>
      </div>
    </div>
  );
}

function SourceShowcase() {
  return (
    <div className="grid w-full gap-4 @7xl:grid-cols-[minmax(0,1fr)_auto] @7xl:items-center">
      <Surface tone="surfaceContainerHigh" className="min-w-0 overflow-hidden p-5">
        <pre className="text-on-surface overflow-x-auto font-mono text-label-small leading-relaxed">
          <code>{`import { Button } from '@unisane/ui/button';\n\n<Button>Save changes</Button>`}</code>
        </pre>
      </Surface>
      <Popover
        trigger={<Button variant="outlined">Open actions</Button>}
        content={
          <div className="w-56 p-2">
            {['Create project', 'Invite member', 'View activity'].map((action) => (
              <Button key={action} variant="text" className="w-full justify-start">
                {action}
              </Button>
            ))}
          </div>
        }
        side="top"
        align="end"
      />
    </div>
  );
}

export function ComponentGridSection() {
  return (
    <Surface tone="surfaceContainerLow" className="border-outline-weak border-b">
      <section
        aria-labelledby="component-system-title"
        className="mx-auto w-full max-w-[1440px] px-5 py-16 @sm:px-8 @sm:py-20 @3xl:px-12 @5xl:py-24"
      >
        <div className="mb-10 flex flex-col gap-5 @lg:flex-row @lg:items-end @lg:justify-between">
          <h2
            id="component-system-title"
            className="text-on-surface max-w-[18ch] text-[clamp(2.25rem,4.4vw,4.75rem)] leading-[1] font-semibold tracking-[-0.05em]"
          >
            Built to work together.
          </h2>
          <Button asChild variant="text" trailingIcon={<Icon symbol="arrow_forward" />}>
            <Link href="/docs/components">All components</Link>
          </Button>
        </div>

        <div className="border-outline-weak grid border-t border-l @4xl:grid-cols-2 @7xl:grid-cols-12">
          <ShowcaseCell
            label="System foundations"
            href="/docs/foundations/design-tokens"
            className="min-h-[28rem] @4xl:col-span-2 @7xl:col-span-12"
          >
            <FoundationsShowcase />
          </ShowcaseCell>
          <ShowcaseCell
            label="Actions"
            href="/docs/components/button"
            className="@7xl:col-span-4"
          >
            <ActionsShowcase />
          </ShowcaseCell>
          <ShowcaseCell
            label="Accessible input"
            href="/docs/components/text-field"
            className="@7xl:col-span-4"
          >
            <InputShowcase />
          </ShowcaseCell>
          <ShowcaseCell
            label="Navigation"
            href="/docs/components/tabs"
            className="@4xl:col-span-2 @7xl:col-span-4"
          >
            <NavigationShowcase />
          </ShowcaseCell>
          <ShowcaseCell
            label="Selection and range"
            href="/docs/components/slider"
            className="@7xl:col-span-5"
          >
            <SelectionShowcase />
          </ShowcaseCell>
          <ShowcaseCell
            label="Product data"
            href="/docs/components/data-table"
            className="@7xl:col-span-7"
          >
            <DataShowcase />
          </ShowcaseCell>
          <ShowcaseCell
            label="Feedback"
            href="/docs/components/alert"
            className="@7xl:col-span-5"
          >
            <FeedbackShowcase />
          </ShowcaseCell>
          <ShowcaseCell
            label="Semantic themes"
            href="/docs/getting-started/theming"
            className="@7xl:col-span-5"
          >
            <ThemeShowcase />
          </ShowcaseCell>
          <ShowcaseCell
            label="Open code"
            href="/docs/getting-started"
            className="@7xl:col-span-7"
          >
            <SourceShowcase />
          </ShowcaseCell>
        </div>

        <footer className="text-on-surface-variant mt-10 flex flex-wrap items-center justify-between gap-4 text-label-small font-semibold tracking-[0.14em] uppercase">
          <span>62+ components</span>
          <span>React 19</span>
          <span>10 themes</span>
          <span>MIT licensed</span>
        </footer>
      </section>
    </Surface>
  );
}
