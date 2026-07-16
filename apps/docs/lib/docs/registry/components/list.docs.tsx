'use client';

import { ComponentDoc } from '../types';
import { HeroBackground } from '../../runtime/hero-background';
import { Avatar, Card } from '@unisane/ui';
import { List, ListItem, ListSubheader } from '@unisane/ui/list';

// ─── HERO VISUAL ─────────────────────────────────────────────────────────────
const ListHeroVisual = () => (
  <HeroBackground tone="surface">
    {/* Mock List */}
    <div className="bg-surface border-outline-variant relative w-72 overflow-hidden rounded-sm border shadow-xl">
      <div className="border-outline-variant border-b px-4 py-2">
        <span className="text-label-medium text-on-surface-variant">Recent</span>
      </div>
      <div className="py-2">
        <div className="hover:bg-state-hover flex items-center gap-4 px-4 py-2">
          <div className="bg-primary-container flex h-10 w-10 items-center justify-center rounded-full">
            <span className="text-title-small text-on-primary-container">JD</span>
          </div>
          <div className="flex-1">
            <div className="text-body-medium text-on-surface">John Doe</div>
            <div className="text-label-small text-on-surface-variant">john@example.com</div>
          </div>
        </div>
        <div className="bg-state-selected flex items-center gap-4 px-4 py-2">
          <div className="bg-tertiary-container flex h-10 w-10 items-center justify-center rounded-full">
            <span className="text-title-small text-on-tertiary-container">AS</span>
          </div>
          <div className="flex-1">
            <div className="text-body-medium text-primary">Alice Smith</div>
            <div className="text-label-small text-on-surface-variant">alice@example.com</div>
          </div>
        </div>
        <div className="hover:bg-state-hover flex items-center gap-4 px-4 py-2">
          <div className="bg-secondary-container flex h-10 w-10 items-center justify-center rounded-full">
            <span className="text-title-small text-on-secondary-container">BJ</span>
          </div>
          <div className="flex-1">
            <div className="text-body-medium text-on-surface">Bob Johnson</div>
            <div className="text-label-small text-on-surface-variant">bob@example.com</div>
          </div>
        </div>
      </div>
    </div>
  </HeroBackground>
);

export const listDoc: ComponentDoc = {
  // ─── BASIC INFO ─────────────────────────────────────────────────────────────
  slug: 'list',
  name: 'List',
  description: 'Lists are continuous, vertical indexes of text and images.',
  category: 'containment',
  status: 'stable',
  icon: 'list',

  // ─── IMPORT INFO ────────────────────────────────────────────────────────────
  importPath: '@/components/ui/list',
  exports: ['List', 'ListItem', 'ListSubheader', 'ListDivider'],

  // ─── HERO VISUAL ───────────────────────────────────────────────────────────
  heroVisual: <ListHeroVisual />,

  // ─── CHOOSING SECTION ──────────────────────────────────────────────────────
  choosing: {
    description: 'List items can include various content configurations.',
    columns: {
      emphasis: 'Type',
      component: 'Example',
      rationale: 'When to use',
      examples: 'Common uses',
    },
    rows: [
      {
        emphasis: 'One-line',
        component: (
          <Card variant="outlined" padding="none" className="w-56 overflow-hidden">
            <List>
              <ListItem headline="Simple item" />
            </List>
          </Card>
        ),
        rationale: 'For simple text-only items.',
        examples: 'Menu items, Simple options',
      },
      {
        emphasis: 'Two-line',
        component: (
          <Card variant="outlined" padding="none" className="w-56 overflow-hidden">
            <List>
              <ListItem headline="Primary text" supportingText="Secondary text" />
            </List>
          </Card>
        ),
        rationale: 'For items with supporting text.',
        examples: 'Contact lists, Email previews',
      },
      {
        emphasis: 'With icons',
        component: (
          <Card variant="outlined" padding="none" className="w-56 overflow-hidden">
            <List>
              <ListItem
                headline="With leading icon"
                leading={<span className="material-symbols-outlined">person</span>}
              />
            </List>
          </Card>
        ),
        rationale: 'For visual identification.',
        examples: 'Settings, Navigation',
      },
    ],
  },

  // ─── HIERARCHY SECTION ─────────────────────────────────────────────────────
  hierarchy: {
    description: 'List items support various content slots for flexible layouts.',
    items: [
      {
        component: (
          <Card variant="outlined" padding="none" className="w-56 overflow-hidden">
            <List>
              <ListItem headline="Headline only" />
            </List>
          </Card>
        ),
        title: 'Single line',
        subtitle: 'Text only',
      },
      {
        component: (
          <Card variant="outlined" padding="none" className="w-56 overflow-hidden">
            <List>
              <ListItem headline="With support" supportingText="Helper text" />
            </List>
          </Card>
        ),
        title: 'Two-line',
        subtitle: 'With description',
      },
      {
        component: (
          <Card variant="outlined" padding="none" className="w-56 overflow-hidden">
            <List>
              <ListItem headline="With trailing" trailingText="100+" />
            </List>
          </Card>
        ),
        title: 'With metadata',
        subtitle: 'Trailing text',
      },
    ],
  },

  // ─── PLACEMENT SECTION ─────────────────────────────────────────────────────
  placement: {
    description: 'Lists are used for navigation, selection, and displaying grouped content.',
    previewDefaults: {
      tone: 'surfaceContainerLow',
      minHeight: 'lg',
      padding: 'sm',
      align: 'start',
      justify: 'start',
    },
    examples: [
      {
        title: 'Navigation list',
        visual: (
          <Card variant="outlined" padding="none" className="w-full overflow-hidden">
            <List>
              <ListItem
                headline="Dashboard"
                leading={<span className="material-symbols-outlined">dashboard</span>}
                selected
              />
              <ListItem
                headline="Settings"
                leading={<span className="material-symbols-outlined">settings</span>}
              />
              <ListItem
                headline="Profile"
                leading={<span className="material-symbols-outlined">person</span>}
              />
            </List>
          </Card>
        ),
        caption: 'Navigation with rich leading content and selected state',
      },
      {
        title: 'Contact list',
        visual: (
          <Card variant="outlined" padding="none" className="w-full overflow-hidden">
            <List>
              <ListSubheader>Contacts</ListSubheader>
              <ListItem
                headline="John Doe"
                supportingText="john@example.com"
                leading={<Avatar size="sm" fallback="JD" />}
              />
              <ListItem
                headline="Jane Smith"
                supportingText="jane@example.com"
                leading={<Avatar size="sm" fallback="JS" />}
              />
            </List>
          </Card>
        ),
        caption: 'List with avatars and subheader',
      },
    ],
  },

  // ─── PROPS ──────────────────────────────────────────────────────────────────
  props: [
    {
      name: 'children',
      type: 'ReactNode',
      required: true,
      description: 'List items to display.',
    },
    {
      name: 'className',
      type: 'string',
      description: 'Additional CSS classes.',
    },
  ],

  // ─── SUB-COMPONENTS ─────────────────────────────────────────────────────────
  subComponents: [
    {
      name: 'ListItem',
      description: 'Individual list item with flexible content slots.',
      props: [
        { name: 'headline', type: 'ReactNode', required: true, description: 'Primary content.' },
        {
          name: 'supportingText',
          type: 'ReactNode',
          description: 'Secondary text below headline.',
        },
        { name: 'leading', type: 'ReactNode', description: 'Content at the start.' },
        { name: 'trailing', type: 'ReactNode', description: 'Content at the end.' },
        {
          name: 'trailingText',
          type: 'ReactNode',
          description: 'Supporting text at the end.',
        },
        { name: 'selected', type: 'boolean', description: 'Whether item uses selected styling.' },
        { name: 'disabled', type: 'boolean', description: 'Whether item is disabled.' },
        { name: 'onClick', type: '() => void', description: 'Click handler.' },
        { name: 'href', type: 'string', description: 'Link URL for navigation items.' },
        {
          name: 'renderLink',
          type: '(props) => ReactElement',
          description: 'Optional framework-router link renderer used with href.',
        },
      ],
    },
    {
      name: 'ListSubheader',
      description: 'Section header for grouping list items.',
      props: [{ name: 'children', type: 'ReactNode', required: true, description: 'Header text.' }],
    },
    {
      name: 'ListDivider',
      description: 'Valid presentational list child for inset row separation.',
      props: [
        {
          name: 'inset',
          type: '"none" | "start" | "both"',
          description: 'Divider inset inside the list.',
        },
        {
          name: 'decorative',
          type: 'boolean',
          description: 'Whether the divider is hidden from assistive technology.',
        },
      ],
    },
  ],

  // ─── ACCESSIBILITY ──────────────────────────────────────────────────────────
  accessibility: {
    screenReader: [
      'List and ListItem use native ul and li semantics.',
      'Interactive items render as semantic buttons or links.',
      'Non-interactive items remain plain list items.',
    ],
    keyboard: [
      { key: 'Tab', description: 'Moves focus to next interactive item' },
      { key: 'Enter / Space', description: 'Activates the focused item' },
    ],
    focus: [
      'Interactive items have visible focus ring.',
      'Focus follows tab order through list items.',
    ],
  },

  // ─── IMPLEMENTATION ────────────────────────────────────────────────────────
  implementation: {
    description: 'Compose lists with ListItem and optional subheaders.',
    code: `import { List, ListItem, ListSubheader } from "@/components/ui/list";
import { Avatar } from "@/components/ui/avatar";

function ContactList({ contacts }) {
  return (
    <List>
      <ListSubheader>Contacts</ListSubheader>
      {contacts.map((contact) => (
        <ListItem
          key={contact.id}
          headline={contact.name}
          supportingText={contact.email}
          leading={
            <Avatar
              src={contact.avatar}
              fallback={contact.initials}
              size="sm"
            />
          }
          trailingText={contact.lastSeen}
          onClick={() => selectContact(contact)}
        />
      ))}
    </List>
  );
}

function NavigationList({ items, activeItem }) {
  return (
    <List>
      {items.map((item) => (
        <ListItem
          key={item.id}
          headline={item.label}
          leading={<Icon symbol={item.icon} />}
          selected={item.id === activeItem}
          href={item.href}
        />
      ))}
    </List>
  );
}`,
  },

  // ─── RELATED COMPONENTS ─────────────────────────────────────────────────────
  related: [
    {
      slug: 'navigation-drawer',
      reason: 'Use for app-wide navigation in a drawer.',
    },
    {
      slug: 'dropdown-menu',
      reason: 'Use for action menus in popovers.',
    },
    {
      slug: 'table',
      reason: 'Use for tabular data with columns.',
    },
  ],
};
