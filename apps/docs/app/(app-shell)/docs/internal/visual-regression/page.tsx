'use client';

import { Alert } from '@unisane/ui/alert';
import { Banner } from '@unisane/ui/banner';
import { Badge } from '@unisane/ui/badge';
import { Button } from '@unisane/ui/button';
import { Calendar } from '@unisane/ui/calendar';
import { Checkbox } from '@unisane/ui/checkbox';
import { DateInput } from '@unisane/ui/date-input';
import { DatePicker } from '@unisane/ui/date-picker';
import { Divider } from '@unisane/ui/divider';
import { Field, FieldDescription, FieldError, FieldLabel } from '@unisane/ui/field';
import { Icon } from '@unisane/ui/icon';
import { IconButton } from '@unisane/ui/icon-button';
import { Input } from '@unisane/ui/input';
import { List, ListDivider, ListItem, ListSubheader } from '@unisane/ui/list';
import type { NavigationItem } from '@unisane/ui/navigation';
import { NavigationBar } from '@unisane/ui/navigation-bar';
import { NavigationDrawer } from '@unisane/ui/navigation-drawer';
import { NavigationRail } from '@unisane/ui/navigation-rail';
import { Radio } from '@unisane/ui/radio';
import { SegmentedButton } from '@unisane/ui/segmented-button';
import {
  Sidebar,
  SidebarDrawer,
  SidebarInset,
  SidebarProvider,
  SidebarRail,
} from '@unisane/ui/sidebar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@unisane/ui/select';
import { SelectField } from '@unisane/ui/select-field';
import { Surface } from '@unisane/ui/surface';
import { Switch } from '@unisane/ui/switch';
import { TextField } from '@unisane/ui/text-field';
import { Toast } from '@unisane/ui/toast';
import { Typography } from '@unisane/ui/typography';
import { buttonDoc } from '@/lib/docs/registry/components/button.docs';
import { selectDoc } from '@/lib/docs/registry/components/select.docs';
import { tabsDoc } from '@/lib/docs/registry/components/tabs.docs';
import { textFieldDoc } from '@/lib/docs/registry/components/text-field.docs';

const appearanceAxes = [
  {
    title: 'Standard',
    attrs: {
      'data-contrast': 'standard',
      'data-density': 'standard',
      'data-radius': 'standard',
      'data-elevation': 'subtle',
    },
    className: '',
  },
  {
    title: 'High contrast comfortable',
    attrs: {
      'data-contrast': 'high',
      'data-density': 'comfortable',
      'data-radius': 'soft',
      'data-elevation': 'pronounced',
    },
    className: 'dark',
  },
  {
    title: 'Compact flat',
    attrs: {
      'data-contrast': 'medium',
      'data-density': 'compact',
      'data-radius': 'none',
      'data-elevation': 'flat',
    },
    className: '',
  },
] as const;

const buttonFixtures = [
  ...(buttonDoc.choosing?.rows.slice(0, 4).map((row) => row.component) ?? []),
  <Button key="visual-button-elevated" variant="elevated">
    Elevated
  </Button>,
  <Button key="visual-button-disabled" disabled>
    Disabled
  </Button>,
  <Button
    key="visual-button-icons"
    variant="tonal"
    leadingIcon={<Icon symbol="save" />}
    trailingIcon={<Icon symbol="arrow_forward" />}
  >
    Icon slots
  </Button>,
  <Button key="visual-button-loading" loading>
    Loading
  </Button>,
] as const;

const fieldFixtures = [
  <Field key="visual-field-foundation" className="gap-2" invalid>
    <FieldLabel htmlFor="visual-field-control" required>
      Workspace name
    </FieldLabel>
    <Input
      id="visual-field-control"
      aria-describedby="visual-field-error"
      aria-invalid
      defaultValue=""
    />
    <FieldError id="visual-field-error">Workspace name is required.</FieldError>
  </Field>,
  <Field key="visual-field-description" className="gap-2">
    <FieldLabel htmlFor="visual-field-description-control">Project slug</FieldLabel>
    <Input
      id="visual-field-description-control"
      aria-describedby="visual-field-description-copy"
      defaultValue="northstar"
    />
    <FieldDescription id="visual-field-description-copy">Used in project URLs.</FieldDescription>
  </Field>,
  <TextField
    key="visual-text-field-description"
    description="Visible to collaborators."
    label="Display name"
    placeholder="Northstar"
  />,
  <Select key="visual-select-foundation" defaultValue="weekly">
    <SelectTrigger aria-label="Report frequency">
      <SelectValue placeholder="Choose a frequency" />
    </SelectTrigger>
    <SelectContent portal={false}>
      <SelectItem value="daily">Daily</SelectItem>
      <SelectItem value="weekly">Weekly</SelectItem>
      <SelectItem value="monthly" disabled>
        Monthly
      </SelectItem>
    </SelectContent>
  </Select>,
  <SelectField
    key="visual-select-field"
    defaultValue="northstar"
    description="New records are stored here."
    label="Workspace"
    options={[
      { value: 'northstar', label: 'Northstar' },
      { value: 'atlas', label: 'Atlas' },
    ]}
    portal={false}
  />,
  <SelectField
    key="visual-select-field-invalid"
    errorMessage="Choose an available workspace."
    label="Workspace"
    options={[
      { value: 'northstar', label: 'Northstar' },
      { value: 'atlas', label: 'Atlas' },
    ]}
    portal={false}
  />,
  <TextField
    key="visual-text-field-multiline"
    autoResize
    defaultValue="A multiline field keeps the same semantic and visual contract."
    label="Notes"
    multiline
    rows={3}
  />,
  ...(textFieldDoc.hierarchy?.items.map((item) => item.component) ?? []),
  textFieldDoc.choosing?.rows[3]?.component,
  selectDoc.heroVisual,
  tabsDoc.choosing?.rows[0]?.component,
].filter(Boolean);

const dateFixtures = [
  <DateInput
    key="visual-date-input"
    label="Report date"
    defaultValue={new Date(2026, 2, 13)}
    description="Keyboard-first segmented entry."
  />,
  <DateInput
    key="visual-date-input-invalid"
    label="End date"
    defaultValue={new Date(2026, 2, 10)}
    errorMessage="End date must follow the start date."
  />,
  <Calendar
    key="visual-calendar"
    selectedDate={new Date(2026, 2, 13)}
    min={new Date(2026, 2, 5)}
    max={new Date(2026, 3, 25)}
  />,
  <div key="visual-date-picker" className="min-h-[430px]">
    <DatePicker
      label="Appointment date"
      defaultValue={new Date(2026, 2, 13)}
      defaultOpen
      portal={false}
    />
  </div>,
].filter(Boolean);

const navigationItems: NavigationItem[] = [
  { id: 'home', label: 'Home', icon: 'home', activeIcon: 'home' },
  { id: 'inbox', label: 'Inbox', icon: 'inbox', badge: 3 },
  { id: 'reports', label: 'Reports', icon: 'bar_chart' },
  { id: 'settings', label: 'Settings', icon: 'settings' },
];

const sidebarItems: NavigationItem[] = [
  {
    id: 'workspace',
    label: 'Workspace',
    icon: 'space_dashboard',
    items: [
      { id: 'overview', label: 'Overview', icon: 'dashboard' },
      {
        id: 'operations',
        label: 'Operations',
        items: [
          { id: 'approvals', label: 'Approvals' },
          { id: 'handoffs', label: 'Handoffs' },
        ],
      },
      { id: 'team', label: 'Team', icon: 'group' },
    ],
  },
  { id: 'queue', label: 'Queue', icon: 'inbox', badge: 3 },
  { id: 'settings', label: 'Settings', icon: 'settings' },
];

const confirmationFixtures = [
  {
    title: 'Publish changes?',
    description: 'Your updates will become visible to workspace members.',
    icon: 'publish',
    iconClassName: 'text-primary',
    confirmLabel: 'Publish',
    confirmClassName: '',
  },
  {
    title: 'Replace current version?',
    description: 'Review affected records before continuing.',
    icon: 'warning',
    iconClassName: 'text-warning',
    confirmLabel: 'Replace',
    confirmClassName: 'bg-warning text-on-warning',
  },
  {
    title: 'Delete workspace?',
    description: 'This action permanently removes all workspace data.',
    icon: 'warning',
    iconClassName: 'text-error',
    confirmLabel: 'Delete',
    confirmClassName: 'bg-error text-on-error',
  },
] as const;

const toastFixtures = [
  { tone: 'neutral', message: 'Draft autosaved', description: 'Just now' },
  { tone: 'success', message: 'Changes published', description: 'Visible to workspace members.' },
  { tone: 'warning', message: 'Session ending soon', description: 'Save any unfinished work.' },
  { tone: 'danger', message: 'Publish failed', description: 'Check the connection and retry.' },
] as const;

function ConfirmationFixture({ fixture }: { fixture: (typeof confirmationFixtures)[number] }) {
  return (
    <Surface
      tone="surface"
      elevation={5}
      rounded="lg"
      className="border-outline-soft overflow-hidden border"
    >
      <div className="border-outline-subtle flex items-start gap-3 border-b px-5 py-4">
        <div className="bg-surface-container-low border-outline-subtle flex size-10 shrink-0 items-center justify-center rounded-md border">
          <Icon symbol={fixture.icon} className={fixture.iconClassName} />
        </div>
        <div className="min-w-0 space-y-1">
          <Typography variant="titleLarge" className="text-on-surface">
            {fixture.title}
          </Typography>
          <Typography variant="bodySmall" className="text-on-surface-variant">
            {fixture.description}
          </Typography>
        </div>
      </div>
      <div className="border-outline-subtle flex justify-end gap-2 border-t px-5 py-3">
        <Button variant="text" size="sm">
          Cancel
        </Button>
        <Button variant="filled" size="sm" className={fixture.confirmClassName}>
          {fixture.confirmLabel}
        </Button>
      </div>
    </Surface>
  );
}

function FixtureSection({
  title,
  description,
  testId,
  children,
}: {
  title: string;
  description: string;
  testId: string;
  children: React.ReactNode;
}) {
  return (
    <section className="space-y-4" data-testid={testId}>
      <div className="space-y-1">
        <Typography variant="titleLarge" component="h2" className="text-on-surface">
          {title}
        </Typography>
        <Typography variant="bodyMedium" component="p" className="text-on-surface-variant">
          {description}
        </Typography>
      </div>
      {children}
    </section>
  );
}

function CoreFixtures() {
  return (
    <div className="space-y-8">
      <FixtureSection
        title="Surface hierarchy"
        description="Surface containers and semantic status tones should remain visually distinct."
        testId="surface-hierarchy"
      >
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <Surface
            tone="surface"
            rounded="lg"
            className="border-outline-subtle space-y-2 border p-5"
            data-testid="surface-card-base"
          >
            <Typography variant="titleMedium">Surface</Typography>
            <Typography variant="bodySmall" className="text-on-surface-variant">
              Base canvas with outline subtle border.
            </Typography>
          </Surface>
          <Surface
            tone="surfaceContainerLow"
            rounded="lg"
            className="space-y-2 p-5"
            data-testid="surface-card-low"
          >
            <Typography variant="titleMedium">Container low</Typography>
            <Typography variant="bodySmall" className="text-on-surface-variant">
              Lower emphasis nested container.
            </Typography>
          </Surface>
          <Surface
            tone="primaryContainer"
            rounded="lg"
            className="space-y-2 p-5"
            data-testid="surface-card-primary"
          >
            <Typography variant="titleMedium" className="text-on-primary-container">
              Primary container
            </Typography>
            <Typography variant="bodySmall" className="text-on-primary-container opacity-80">
              Status and action emphasis sample.
            </Typography>
          </Surface>
          <Surface
            tone="errorContainer"
            rounded="lg"
            className="space-y-2 p-5"
            data-testid="surface-card-error"
          >
            <Typography variant="titleMedium" className="text-on-error-container">
              Error container
            </Typography>
            <Typography variant="bodySmall" className="text-on-error-container opacity-80">
              Error tone baseline.
            </Typography>
          </Surface>
        </div>
      </FixtureSection>

      <FixtureSection
        title="Leaf icon and typography contracts"
        description="Icon scale, icon-button state, type scale, and semantic roles share the same mode and appearance-axis proof."
        testId="leaf-icon-typography"
      >
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="flex flex-wrap items-center gap-4" data-testid="icon-leaf-row">
            <Icon symbol="favorite" size="sm" />
            <Icon symbol="favorite" size="md" filled className="text-primary" />
            <Icon symbol="check_circle" size="lg" className="text-success" />
            <IconButton aria-label="Favorite" selected icon={<Icon symbol="favorite" />} />
            <IconButton
              aria-label="Settings"
              variant="outlined"
              icon={<Icon symbol="settings" />}
            />
          </div>
          <div className="space-y-2" data-testid="typography-leaf-stack">
            <Typography variant="pageTitle" component="p">
              Page title role
            </Typography>
            <Typography variant="sectionTitle" component="p">
              Section title role
            </Typography>
            <Typography variant="bodyLarge">Body scale</Typography>
            <Typography variant="labelMedium">Label scale</Typography>
          </div>
        </div>
      </FixtureSection>

      <FixtureSection
        title="Border semantics"
        description="Outline utilities should preserve clear hierarchy from subtle to strong."
        testId="border-semantics"
      >
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <Surface
            tone="surface"
            rounded="lg"
            className="border-outline-weak border p-5"
            data-testid="border-weak"
          >
            <Typography variant="titleMedium">Outline weak</Typography>
            <Typography variant="bodySmall" className="text-on-surface-variant">
              Lowest edge emphasis.
            </Typography>
          </Surface>
          <Surface
            tone="surface"
            rounded="lg"
            className="border-outline-subtle border p-5"
            data-testid="border-subtle"
          >
            <Typography variant="titleMedium">Outline subtle</Typography>
            <Typography variant="bodySmall" className="text-on-surface-variant">
              Default contained border.
            </Typography>
          </Surface>
          <Surface
            tone="surface"
            rounded="lg"
            className="border-outline-medium border p-5"
            data-testid="border-medium"
          >
            <Typography variant="titleMedium">Outline medium</Typography>
            <Typography variant="bodySmall" className="text-on-surface-variant">
              Stronger structural edge.
            </Typography>
          </Surface>
          <Surface
            tone="surface"
            rounded="lg"
            className="border-outline-strong border-2 p-5"
            data-testid="border-strong"
          >
            <Typography variant="titleMedium">Outline strong</Typography>
            <Typography variant="bodySmall" className="text-on-surface-variant">
              Highest non-error border contrast.
            </Typography>
          </Surface>
        </div>
      </FixtureSection>

      <FixtureSection
        title="Buttons"
        description="Button variants, disabled state, and hierarchy should stay aligned across themes."
        testId="button-variants"
      >
        <div className="flex flex-wrap gap-3" data-testid="button-row">
          {buttonFixtures.map((fixture, index) => (
            <div key={`button-fixture-${index}`} className="shrink-0">
              {fixture}
            </div>
          ))}
        </div>
      </FixtureSection>

      <FixtureSection
        title="Fields"
        description="Field semantics and rich TextField states share the same token, mode, density, contrast, radius, and elevation contract."
        testId="field-variants"
      >
        <div className="grid gap-4 lg:grid-cols-2" data-testid="field-grid">
          {fieldFixtures.map((fixture, index) => (
            <div
              key={`field-fixture-${index}`}
              className="min-w-0"
              data-testid={`field-fixture-${index + 1}`}
            >
              {fixture}
            </div>
          ))}
        </div>
      </FixtureSection>

      <FixtureSection
        title="Date foundations and recipe"
        description="Actual DateInput, Calendar, and DatePicker surfaces prove field semantics, date-grid states, and composed overlay presentation across every appearance axis."
        testId="date-family"
      >
        <div className="grid items-start gap-6 lg:grid-cols-2" data-testid="date-family-grid">
          {dateFixtures.map((fixture, index) => (
            <div key={`date-fixture-${index}`} className="min-w-0">
              {fixture}
            </div>
          ))}
        </div>
      </FixtureSection>

      <FixtureSection
        title="Navigation presentations"
        description="One destination collection and selected id render as actual Bar, Rail, and persistent Drawer presentations across every appearance axis."
        testId="navigation-presentations"
      >
        <div
          className="grid items-start gap-6 xl:grid-cols-3"
          data-testid="navigation-presentation-grid"
        >
          <div className="bg-surface-container-low border-outline-variant relative h-44 overflow-hidden rounded-sm border">
            <NavigationBar
              aria-label="Primary navigation"
              items={navigationItems}
              defaultValue="home"
            />
          </div>
          <div className="bg-surface border-outline-variant flex h-80 overflow-hidden rounded-sm border">
            <NavigationRail
              aria-label="Primary navigation"
              items={navigationItems}
              defaultValue="home"
              className="h-full"
            />
            <div className="bg-surface-container-low flex-1" />
          </div>
          <div className="bg-surface border-outline-variant flex h-80 overflow-hidden rounded-sm border">
            <NavigationDrawer
              aria-label="Primary navigation"
              items={navigationItems}
              defaultValue="home"
              headline="Workspace"
              className="w-64 max-w-64"
            />
            <div className="bg-surface-container-low flex-1" />
          </div>
        </div>
      </FixtureSection>

      <FixtureSection
        title="Responsive Sidebar recipe"
        description="One nested catalog drives the actual rail, contextual drawer, selected descendant, inset geometry, and semantic appearance axes."
        testId="sidebar-recipe"
      >
        <div className="border-outline-variant h-96 overflow-hidden rounded-sm border">
          <SidebarProvider
            items={sidebarItems}
            defaultValue="approvals"
            defaultExpanded
            forceViewport="desktop"
            containerMode="contained"
            railWidth={80}
            drawerWidth={208}
          >
            <Sidebar className="h-full">
              <SidebarRail aria-label="Workspace navigation" />
              <SidebarDrawer aria-label="Workspace navigation" />
              <SidebarInset className="bg-surface-container-low p-4">
                <div className="bg-surface border-outline-variant h-full rounded-sm border" />
              </SidebarInset>
            </Sidebar>
          </SidebarProvider>
        </div>
      </FixtureSection>

      <FixtureSection
        title="Selection controls"
        description="Native selection leaves and the options-driven segmented recipe retain semantic state, compact sizing, rich labels, and single/multiple behavior across every appearance axis."
        testId="selection-controls"
      >
        <div className="grid items-start gap-6 lg:grid-cols-2" data-testid="selection-control-grid">
          <div className="bg-surface border-outline-variant grid gap-3 rounded-sm border p-4">
            <Checkbox label="Email notifications" defaultChecked />
            <Checkbox label="Partially selected" indeterminate size="sm" />
            <Checkbox label="Required agreement" invalid />
            <div className="grid gap-2">
              <Radio name="visual-plan" value="basic" label="Basic plan" defaultChecked />
              <Radio name="visual-plan" value="pro" label="Pro plan" />
              <Radio name="visual-plan" value="team" label="Team plan" disabled />
            </div>
            <Switch label="Auto save" defaultChecked showIcons />
            <Switch label="Unavailable setting" invalid />
          </div>
          <div className="bg-surface border-outline-variant grid gap-4 rounded-sm border p-4">
            <SegmentedButton
              aria-label="Document view"
              defaultValue="grid"
              options={[
                { value: 'grid', label: 'Grid', icon: <Icon symbol="grid_view" /> },
                { value: 'list', label: 'List', icon: <Icon symbol="view_list" /> },
                { value: 'table', label: 'Table', disabled: true },
              ]}
            />
            <SegmentedButton
              selectionMode="multiple"
              aria-label="Formatting"
              defaultValue={['bold']}
              options={[
                { value: 'bold', label: 'Bold' },
                { value: 'italic', label: 'Italic' },
                { value: 'underline', label: 'Underline' },
              ]}
              size="sm"
            />
          </div>
        </div>
      </FixtureSection>

      <FixtureSection
        title="Data display"
        description="Badges retain semantic color and emphasis, dividers expose explicit inset behavior, and native lists keep rich structured rows across every appearance axis."
        testId="data-display"
      >
        <div className="grid items-start gap-6 lg:grid-cols-2" data-testid="data-display-grid">
          <div className="bg-surface border-outline-variant grid gap-4 rounded-sm border p-4">
            <div className="flex flex-wrap gap-2">
              <Badge>Primary</Badge>
              <Badge variant="tonal" color="success">
                Healthy
              </Badge>
              <Badge variant="outlined" color="warning" size="sm">
                Review
              </Badge>
              <Badge variant="tonal" color="error" size="lg">
                Blocked
              </Badge>
            </div>
            <Divider />
            <Divider inset="start" />
            <Divider inset="both" />
          </div>
          <List className="border-outline-variant overflow-hidden rounded-sm border py-0">
            <ListSubheader>Deployments</ListSubheader>
            <ListItem
              headline="Production API"
              supportingText="Healthy"
              leading={<Icon symbol="cloud_done" />}
              trailingText="2m"
              selected
            />
            <ListDivider inset="start" />
            <ListItem
              headline="Worker queue"
              supportingText="Needs attention"
              leading={<Icon symbol="dns" />}
              trailing={<Icon symbol="arrow_forward" />}
              href="#data-display"
            />
          </List>
        </div>
      </FixtureSection>

      <FixtureSection
        title="Persistent communication"
        description="Alert and Banner prove inline versus page-level anatomy, semantic variants, rich actions, optional dismissal, and live-region visual hierarchy."
        testId="persistent-communication"
      >
        <div className="grid items-start gap-4 lg:grid-cols-2" data-testid="communication-grid">
          <div className="space-y-3">
            <Alert variant="info" title="Sync in progress">
              Changes will appear when processing completes.
            </Alert>
            <Alert variant="success" title="Changes published" icon="task_alt">
              Workspace members can now see the update.
            </Alert>
            <Alert variant="warning" title="Review required">
              Resolve two validation issues before publishing.
            </Alert>
          </div>
          <div className="space-y-3">
            <Banner
              title="Update available"
              onDismiss={() => undefined}
              actions={[
                { id: 'update', label: 'Update now', onClick: () => undefined },
                { id: 'later', label: 'Later', onClick: () => undefined },
              ]}
            >
              A new workspace version is ready to install.
            </Banner>
            <Banner variant="error" title="Connection lost" icon="cloud_off">
              Reconnect before continuing with this workflow.
            </Banner>
          </div>
        </div>
      </FixtureSection>

      <FixtureSection
        title="Toast feedback"
        description="Actual Toast recipes prove semantic tone, description, action, dismissal, and responsive width across every appearance axis."
        testId="toast-feedback"
      >
        <div className="grid items-start gap-4 lg:grid-cols-2" data-testid="toast-feedback-grid">
          {toastFixtures.map((fixture) => (
            <Toast
              key={fixture.tone}
              {...fixture}
              action={
                fixture.tone === 'warning'
                  ? { label: 'Review', onClick: () => undefined }
                  : undefined
              }
              duration={0}
              onDismiss={() => undefined}
            />
          ))}
        </div>
      </FixtureSection>

      <FixtureSection
        title="Dialog decisions"
        description="Neutral, warning, and danger confirmation surfaces preserve role hierarchy, action emphasis, and semantic tone across every appearance axis."
        testId="dialog-decisions"
      >
        <div className="grid gap-4 lg:grid-cols-3" data-testid="dialog-decision-grid">
          {confirmationFixtures.map((fixture) => (
            <ConfirmationFixture key={fixture.title} fixture={fixture} />
          ))}
        </div>
      </FixtureSection>
    </div>
  );
}

export default function VisualRegressionFixturesPage() {
  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-6 py-10 lg:px-10">
      <div className="space-y-2">
        <Typography variant="headlineMedium" component="h1" className="text-on-surface">
          Visual Regression Fixtures
        </Typography>
        <Typography variant="bodyLarge" component="p" className="text-on-surface-variant max-w-3xl">
          Hidden fixture page for stable screenshot baselines. Use these sections to compare theme
          axes, surface hierarchy, button variants, field-family chrome, and dialog decision tones
          without relying on docs prose layouts.
        </Typography>
      </div>

      <div className="grid gap-8">
        {appearanceAxes.map((axis) => (
          <div
            key={axis.title}
            className={axis.className}
            data-testid={`axis-${axis.title.toLowerCase().replace(/\s+/g, '-')}`}
            {...axis.attrs}
          >
            <Surface
              tone="surfaceContainerLow"
              rounded="xl"
              className="border-outline-subtle space-y-6 border p-6"
            >
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="space-y-1">
                  <Typography variant="titleLarge" component="h2" className="text-on-surface">
                    {axis.title}
                  </Typography>
                  <Typography variant="bodySmall" component="p" className="text-on-surface-variant">
                    {Object.entries(axis.attrs)
                      .map(([key, value]) => `${key}=${value}`)
                      .join(' · ')}
                    {axis.className ? ` · class=${axis.className}` : ''}
                  </Typography>
                </div>
              </div>
              <CoreFixtures />
            </Surface>
          </div>
        ))}
      </div>
    </div>
  );
}
