/**
 * Component Documentation Data Index
 *
 * This file aggregates all component documentation and provides
 * helper functions to access them.
 */

import type { ComponentDoc, ComponentCategory, ComponentListItem } from './types';

// ─── DETAILED COMPONENT DOCS ──────────────────────────────────────────────────
// Import detailed docs as they are created
import { buttonDoc } from './components/button.docs';
import { cardDoc } from './components/card.docs';
import { iconButtonDoc } from './components/icon-button.docs';
import { iconDoc } from './components/icon.docs';
import { fabDoc } from './components/fab.docs';
import { fieldDoc } from './components/field.docs';
import { dialogDoc } from './components/dialog.docs';
import { confirmDialogDoc } from './components/confirm-dialog.docs';
import { checkboxDoc } from './components/checkbox.docs';
import { switchDoc } from './components/switch.docs';
import { textFieldDoc } from './components/text-field.docs';
import { tokenFieldDoc } from './components/token-field.docs';
import { selectDoc } from './components/select.docs';
import { selectFieldDoc } from './components/select-field.docs';
import { tabsDoc } from './components/tabs.docs';
import { toastDoc } from './components/toast.docs';
import { chipDoc } from './components/chip.docs';
import { radioDoc } from './components/radio.docs';
import { progressDoc } from './components/progress.docs';
import { badgeDoc } from './components/badge.docs';
import { avatarDoc } from './components/avatar.docs';
import { sliderDoc } from './components/slider.docs';
import { accordionDoc } from './components/accordion.docs';
import { sheetDoc } from './components/sheet.docs';
import { tooltipDoc } from './components/tooltip.docs';
import { alertDoc } from './components/alert.docs';
import { skeletonDoc } from './components/skeleton.docs';
import { bannerDoc } from './components/banner.docs';
import { popoverDoc } from './components/popover.docs';
import { dropdownMenuDoc } from './components/dropdown-menu.docs';
import { listDoc } from './components/list.docs';
import { tableDoc } from './components/table.docs';
import { paginationDoc } from './components/pagination.docs';
import { stepperDoc } from './components/stepper.docs';
import { breadcrumbDoc } from './components/breadcrumb.docs';
import { dividerDoc } from './components/divider.docs';
import { calendarDoc } from './components/calendar.docs';
import { carouselDoc } from './components/carousel.docs';
import { comboboxDoc } from './components/combobox.docs';
import { datePickerDoc } from './components/date-picker.docs';
import { dateInputDoc } from './components/date-input.docs';
import { monthPickerDoc } from './components/month-picker.docs';
import { fabMenuDoc } from './components/fab-menu.docs';
import { navigationBarDoc } from './components/navigation-bar.docs';
import { navigationDrawerDoc } from './components/navigation-drawer.docs';
import { navigationRailDoc } from './components/navigation-rail.docs';
import { ratingDoc } from './components/rating.docs';
import { scrollAreaDoc } from './components/scroll-area.docs';
import { searchBarDoc } from './components/search-bar.docs';
import { segmentedButtonDoc } from './components/segmented-button.docs';
import { timePickerDoc } from './components/time-picker.docs';
import { topAppBarDoc } from './components/top-app-bar.docs';
import { bottomAppBarDoc } from './components/bottom-app-bar.docs';
import { typographyDoc } from './components/typography.docs';
import { canonicalLayoutsDoc } from './components/canonical-layouts.docs';
import { paneGroupDoc } from './components/pane-group.docs';
import { sidebarDoc } from './components/sidebar.docs';

/**
 * Registry of all components with full documentation.
 * Components with detailed docs will override the basic registry entries.
 */
const DETAILED_DOCS: Record<string, ComponentDoc> = {
  button: buttonDoc,
  card: cardDoc,
  'icon-button': iconButtonDoc,
  icon: iconDoc,
  fab: fabDoc,
  field: fieldDoc,
  dialog: dialogDoc,
  'confirm-dialog': confirmDialogDoc,
  checkbox: checkboxDoc,
  switch: switchDoc,
  'text-field': textFieldDoc,
  'token-field': tokenFieldDoc,
  select: selectDoc,
  'select-field': selectFieldDoc,
  tabs: tabsDoc,
  toast: toastDoc,
  chip: chipDoc,
  radio: radioDoc,
  progress: progressDoc,
  badge: badgeDoc,
  avatar: avatarDoc,
  slider: sliderDoc,
  accordion: accordionDoc,
  sheet: sheetDoc,
  tooltip: tooltipDoc,
  alert: alertDoc,
  skeleton: skeletonDoc,
  banner: bannerDoc,
  popover: popoverDoc,
  'dropdown-menu': dropdownMenuDoc,
  list: listDoc,
  table: tableDoc,
  pagination: paginationDoc,
  stepper: stepperDoc,
  breadcrumb: breadcrumbDoc,
  divider: dividerDoc,
  calendar: calendarDoc,
  carousel: carouselDoc,
  combobox: comboboxDoc,
  'date-picker': datePickerDoc,
  'date-input': dateInputDoc,
  'month-picker': monthPickerDoc,
  'fab-menu': fabMenuDoc,
  'navigation-bar': navigationBarDoc,
  'navigation-drawer': navigationDrawerDoc,
  'navigation-rail': navigationRailDoc,
  rating: ratingDoc,
  'scroll-area': scrollAreaDoc,
  'search-bar': searchBarDoc,
  'segmented-button': segmentedButtonDoc,
  'time-picker': timePickerDoc,
  'top-app-bar': topAppBarDoc,
  'bottom-app-bar': bottomAppBarDoc,
  typography: typographyDoc,
  'canonical-layouts': canonicalLayoutsDoc,
  'pane-group': paneGroupDoc,
  sidebar: sidebarDoc,
};

// ─── BASIC COMPONENT REGISTRY ─────────────────────────────────────────────────
// Sorted alphabetically by name for consistent navigation (prev/next)
export const COMPONENT_REGISTRY: ComponentListItem[] = [
  {
    slug: 'accordion',
    name: 'Accordion',
    description:
      'Accordions display collapsible content panels for presenting information in a limited amount of space.',
    category: 'containment',
    status: 'stable',
    icon: 'expand_more',
  },
  {
    slug: 'alert',
    name: 'Alert',
    description: 'Alerts display brief messages with different severity levels.',
    category: 'communication',
    status: 'stable',
    icon: 'error',
  },
  {
    slug: 'avatar',
    name: 'Avatar',
    description: 'Avatars display user profile images, initials, or icons.',
    category: 'data-display',
    status: 'stable',
    icon: 'account_circle',
  },
  {
    slug: 'badge',
    name: 'Badge',
    description: 'Badges convey dynamic information, such as counts or status indicators.',
    category: 'communication',
    status: 'stable',
    icon: 'new_releases',
  },
  {
    slug: 'banner',
    name: 'Banner',
    description: 'Banners display important, succinct messages with optional actions.',
    category: 'communication',
    status: 'stable',
    icon: 'campaign',
  },
  {
    slug: 'bottom-app-bar',
    name: 'Bottom App Bar',
    description:
      'Bottom app bars display navigation and key actions at the bottom of mobile screens.',
    category: 'navigation',
    status: 'stable',
    icon: 'call_to_action',
  },
  {
    slug: 'breadcrumb',
    name: 'Breadcrumb',
    description:
      "Breadcrumbs indicate the current page's location within a navigational hierarchy.",
    category: 'navigation',
    status: 'stable',
    icon: 'chevron_right',
  },
  {
    slug: 'button',
    name: 'Button',
    description:
      'Buttons help people take action, such as sending an email, sharing a document, or liking a comment.',
    category: 'actions',
    status: 'stable',
    icon: 'smart_button',
  },
  {
    slug: 'calendar',
    name: 'Calendar',
    description: 'Calendars display dates for scheduling and viewing events.',
    category: 'data-display',
    status: 'stable',
    icon: 'calendar_month',
  },
  {
    slug: 'canonical-layouts',
    name: 'Canonical Layouts',
    description: 'Pre-built responsive layouts for common app patterns.',
    category: 'layout',
    status: 'stable',
    icon: 'grid_view',
  },
  {
    slug: 'card',
    name: 'Card',
    description: 'Cards contain content and actions about a single subject.',
    category: 'containment',
    status: 'stable',
    icon: 'dashboard',
  },
  {
    slug: 'carousel',
    name: 'Carousel',
    description: 'Carousels display a collection of items that can be scrolled horizontally.',
    category: 'data-display',
    status: 'stable',
    icon: 'view_carousel',
  },
  {
    slug: 'checkbox',
    name: 'Checkbox',
    description:
      'Checkboxes let users select one or more items from a list, or turn an item on or off.',
    category: 'selection',
    status: 'stable',
    icon: 'check_box',
  },
  {
    slug: 'chip',
    name: 'Chip',
    description:
      'Chips help people enter information, make selections, filter content, or trigger actions.',
    category: 'selection',
    status: 'stable',
    icon: 'label',
  },
  {
    slug: 'combobox',
    name: 'Combobox',
    description:
      'Comboboxes combine a text input with a listbox, allowing users to filter a list of options.',
    category: 'text-inputs',
    status: 'stable',
    icon: 'search',
  },
  {
    slug: 'confirm-dialog',
    name: 'Confirm Dialog',
    description: 'Confirm dialogs own the accessible lifecycle for consequential user decisions.',
    category: 'containment',
    status: 'stable',
    icon: 'warning',
  },
  {
    slug: 'date-picker',
    name: 'Date Picker',
    description: 'Date pickers let users select dates or date ranges from a calendar.',
    category: 'text-inputs',
    status: 'stable',
    icon: 'calendar_today',
  },
  {
    slug: 'date-input',
    name: 'Date Input',
    description:
      'A segment-based date input where each part (month, day, year) is individually editable with keyboard support.',
    category: 'text-inputs',
    status: 'stable',
    icon: 'edit_calendar',
  },
  {
    slug: 'month-picker',
    name: 'Month Picker',
    description: 'Month pickers let users select month-level values without day-level precision.',
    category: 'text-inputs',
    status: 'stable',
    icon: 'calendar_month',
  },
  {
    slug: 'dialog',
    name: 'Dialog',
    description:
      'Dialogs provide important prompts in a user flow, requiring user input or confirmation.',
    category: 'containment',
    status: 'stable',
    icon: 'chat_bubble',
  },
  {
    slug: 'divider',
    name: 'Divider',
    description: 'Dividers separate content into clear groups or sections.',
    category: 'layout',
    status: 'stable',
    icon: 'horizontal_rule',
  },
  {
    slug: 'dropdown-menu',
    name: 'Dropdown Menu',
    description: 'Dropdown menus display a list of choices on a temporary surface.',
    category: 'containment',
    status: 'stable',
    icon: 'menu',
  },
  {
    slug: 'fab',
    name: 'FAB',
    description: 'Floating action buttons represent the primary action of a screen.',
    category: 'actions',
    status: 'stable',
    icon: 'add_circle',
  },
  {
    slug: 'fab-menu',
    name: 'FAB Menu',
    description: 'Extended FAB with a menu of related actions that expand on interaction.',
    category: 'actions',
    status: 'stable',
    icon: 'more_vert',
  },
  {
    slug: 'field',
    name: 'Field',
    description: 'Fields compose labels, controls, descriptions, and errors.',
    category: 'foundations',
    status: 'stable',
    icon: 'forms_add_on',
  },
  {
    slug: 'icon',
    name: 'Icon',
    description: 'Icons render symbols or custom SVG content through one accessible leaf API.',
    category: 'foundations',
    status: 'stable',
    icon: 'symbols',
  },
  {
    slug: 'icon-button',
    name: 'Icon Button',
    description:
      'Icon buttons display actions in a compact form, often used in toolbars and app bars.',
    category: 'actions',
    status: 'stable',
    icon: 'touch_app',
  },
  {
    slug: 'list',
    name: 'List',
    description: 'Lists are continuous, vertical indexes of text or images.',
    category: 'data-display',
    status: 'stable',
    icon: 'list',
  },
  {
    slug: 'navigation-bar',
    name: 'Navigation Bar',
    description:
      'Navigation bars display three to five destinations at the bottom of mobile screens.',
    category: 'navigation',
    status: 'stable',
    icon: 'bottom_navigation',
  },
  {
    slug: 'navigation-drawer',
    name: 'Navigation Drawer',
    description: 'Navigation drawers provide access to destinations and app functionality.',
    category: 'navigation',
    status: 'stable',
    icon: 'menu_open',
  },
  {
    slug: 'navigation-rail',
    name: 'Navigation Rail',
    description:
      'Navigation rails provide access to primary destinations in an app on tablet and desktop screens.',
    category: 'navigation',
    status: 'stable',
    icon: 'view_sidebar',
  },
  {
    slug: 'pagination',
    name: 'Pagination',
    description: 'Pagination lets users navigate through pages of content.',
    category: 'navigation',
    status: 'stable',
    icon: 'last_page',
  },
  {
    slug: 'pane-group',
    name: 'Pane Group',
    description: 'Pane groups create resizable panel layouts for complex interfaces.',
    category: 'layout',
    status: 'stable',
    icon: 'view_column',
  },
  {
    slug: 'popover',
    name: 'Popover',
    description: 'Popovers display rich content in a portal that appears above other content.',
    category: 'containment',
    status: 'stable',
    icon: 'info',
  },
  {
    slug: 'progress',
    name: 'Progress',
    description:
      'Progress indicators express an unspecified wait time or display the length of a process.',
    category: 'communication',
    status: 'stable',
    icon: 'autorenew',
  },
  {
    slug: 'radio',
    name: 'Radio',
    description:
      'Radio buttons let users select one option from a set of mutually exclusive choices.',
    category: 'selection',
    status: 'stable',
    icon: 'radio_button_checked',
  },
  {
    slug: 'rating',
    name: 'Rating',
    description: 'Ratings let users provide feedback on content using a star-based scale.',
    category: 'selection',
    status: 'stable',
    icon: 'star',
  },
  {
    slug: 'scroll-area',
    name: 'Scroll Area',
    description: 'Scroll areas provide a scrollable container with custom scrollbars.',
    category: 'layout',
    status: 'stable',
    icon: 'unfold_more',
  },
  {
    slug: 'search-bar',
    name: 'Search Bar',
    description: 'Search bars let users enter a query to search for content.',
    category: 'text-inputs',
    status: 'stable',
    icon: 'search',
  },
  {
    slug: 'segmented-button',
    name: 'Segmented Button',
    description: 'Segmented buttons help people select options, switch views, or sort elements.',
    category: 'actions',
    status: 'stable',
    icon: 'view_column',
  },
  {
    slug: 'select',
    name: 'Select',
    description: 'Composable single-value selection for custom item content and structure.',
    category: 'selection',
    status: 'stable',
    icon: 'arrow_drop_down',
  },
  {
    slug: 'select-field',
    name: 'Select Field',
    description: 'A labeled and validated options-array recipe built on Select.',
    category: 'text-inputs',
    status: 'stable',
    icon: 'forms_add_on',
  },
  {
    slug: 'sheet',
    name: 'Sheet',
    description:
      'Sheets are surfaces containing supplementary content anchored to the edge of the screen.',
    category: 'containment',
    status: 'stable',
    icon: 'view_sidebar',
  },
  {
    slug: 'sidebar',
    name: 'Sidebar',
    description: 'App-level navigation with a collapsible rail and expandable drawer.',
    category: 'navigation',
    status: 'stable',
    icon: 'dock_to_left',
  },
  {
    slug: 'skeleton',
    name: 'Skeleton',
    description: 'Skeleton loaders provide a placeholder preview of content before it loads.',
    category: 'communication',
    status: 'stable',
    icon: 'rectangle',
  },
  {
    slug: 'slider',
    name: 'Slider',
    description: 'Sliders let users make selections from a range of values.',
    category: 'selection',
    status: 'stable',
    icon: 'tune',
  },
  {
    slug: 'stepper',
    name: 'Stepper',
    description: 'Steppers display progress through a sequence of logical and numbered steps.',
    category: 'navigation',
    status: 'stable',
    icon: 'format_list_numbered',
  },
  {
    slug: 'switch',
    name: 'Switch',
    description: 'Switches toggle the state of a single item on or off.',
    category: 'selection',
    status: 'stable',
    icon: 'toggle_on',
  },
  {
    slug: 'table',
    name: 'Table',
    description: 'Tables display sets of data organized in rows and columns.',
    category: 'data-display',
    status: 'stable',
    icon: 'table_chart',
  },
  {
    slug: 'tabs',
    name: 'Tabs',
    description: 'Tabs organize content across different screens, data sets, or interactions.',
    category: 'navigation',
    status: 'stable',
    icon: 'tab',
  },
  {
    slug: 'text-field',
    name: 'Text Field',
    description: 'Text fields let users enter and edit text.',
    category: 'text-inputs',
    status: 'stable',
    icon: 'edit',
  },
  {
    slug: 'token-field',
    name: 'Token Field',
    description:
      'Token fields let users enter multiple short text values such as tags, skills, keywords, recipients, or labels.',
    category: 'text-inputs',
    status: 'beta',
    icon: 'label',
  },
  {
    slug: 'time-picker',
    name: 'Time Picker',
    description: 'Time pickers let users select times using a clock or input.',
    category: 'text-inputs',
    status: 'stable',
    icon: 'schedule',
  },
  {
    slug: 'toast',
    name: 'Toast',
    description: 'Toasts display brief, temporary notifications that stack and auto-dismiss.',
    category: 'communication',
    status: 'stable',
    icon: 'notifications',
  },
  {
    slug: 'tooltip',
    name: 'Tooltip',
    description:
      'Tooltips display informative text when users hover over, focus on, or tap an element.',
    category: 'containment',
    status: 'stable',
    icon: 'help',
  },
  {
    slug: 'top-app-bar',
    name: 'Top App Bar',
    description: 'Top app bars display information and actions at the top of a screen.',
    category: 'navigation',
    status: 'stable',
    icon: 'web_asset',
  },
  {
    slug: 'typography',
    name: 'Typography',
    description: 'Typography component provides semantic text styles with a complete type scale.',
    category: 'foundations',
    status: 'stable',
    icon: 'text_fields',
  },
];

// ─── HELPER FUNCTIONS ─────────────────────────────────────────────────────────

/**
 * Get a component by its slug.
 * Returns detailed doc if available, otherwise basic info.
 */
export function getComponentBySlug(slug: string): ComponentDoc | undefined {
  // Check if we have detailed docs
  if (DETAILED_DOCS[slug]) {
    return DETAILED_DOCS[slug];
  }

  // Fall back to basic registry
  const basicInfo = COMPONENT_REGISTRY.find((c) => c.slug === slug);
  if (basicInfo) {
    return basicInfo as ComponentDoc;
  }

  return undefined;
}

/**
 * Check if a component has detailed documentation.
 */
export function hasDetailedDocs(slug: string): boolean {
  return slug in DETAILED_DOCS;
}

/**
 * Get components grouped by category.
 */
export function getComponentsByCategory(): Record<ComponentCategory, ComponentListItem[]> {
  const grouped: Record<ComponentCategory, ComponentListItem[]> = {
    actions: [],
    containment: [],
    communication: [],
    selection: [],
    navigation: [],
    'text-inputs': [],
    'data-display': [],
    layout: [],
    foundations: [],
  };

  for (const component of COMPONENT_REGISTRY) {
    grouped[component.category].push(component);
  }

  return grouped;
}

/**
 * Get all components as a flat list.
 */
export function getAllComponents(): ComponentListItem[] {
  return COMPONENT_REGISTRY;
}

/**
 * Get total component count.
 */
export function getComponentCount(): number {
  return COMPONENT_REGISTRY.length;
}

/**
 * Search components by name or description.
 */
export function searchComponents(query: string): ComponentListItem[] {
  const q = query.toLowerCase().trim();
  if (!q) return COMPONENT_REGISTRY;

  return COMPONENT_REGISTRY.filter(
    (c) => c.name.toLowerCase().includes(q) || c.description.toLowerCase().includes(q),
  );
}

// ─── CATEGORY UTILITIES ───────────────────────────────────────────────────────

export const CATEGORY_LABELS: Record<ComponentCategory, string> = {
  actions: 'Actions',
  containment: 'Containment',
  communication: 'Communication',
  selection: 'Selection',
  navigation: 'Navigation',
  'text-inputs': 'Text Inputs',
  'data-display': 'Data Display',
  layout: 'Layout',
  foundations: 'Foundations',
};

export const CATEGORY_ICONS: Record<ComponentCategory, string> = {
  actions: 'touch_app',
  containment: 'crop_square',
  communication: 'chat',
  selection: 'check_circle',
  navigation: 'menu',
  'text-inputs': 'edit_note',
  'data-display': 'table_chart',
  layout: 'grid_view',
  foundations: 'layers',
};

/**
 * Get previous and next components for navigation.
 */
export function getAdjacentComponents(slug: string): {
  previous?: { slug: string; name: string };
  next?: { slug: string; name: string };
} {
  const index = COMPONENT_REGISTRY.findIndex((c) => c.slug === slug);

  if (index === -1) {
    return {};
  }

  const prevComponent = index > 0 ? COMPONENT_REGISTRY[index - 1] : undefined;
  const nextComponent =
    index < COMPONENT_REGISTRY.length - 1 ? COMPONENT_REGISTRY[index + 1] : undefined;

  return {
    previous: prevComponent ? { slug: prevComponent.slug, name: prevComponent.name } : undefined,
    next: nextComponent ? { slug: nextComponent.slug, name: nextComponent.name } : undefined,
  };
}
