import type { NavigationItem } from "@unisane/ui";
import { getAllComponents } from "../registry/selectors";

export type { NavigationItem };

const componentNavItems: NavigationItem[] = [
  { id: "components-overview", label: "Overview", href: "/docs/components" },
  ...getAllComponents().map((component) => ({
    id: component.slug,
    label: component.name,
    href: `/docs/components/${component.slug}`,
  })),
];

export const DOCS_NAVIGATION: NavigationItem[] = [
  {
    id: "home",
    label: "Home",
    icon: "home",
    href: "/",
    items: [],
  },
  {
    id: "getting-started",
    label: "Get Started",
    icon: "rocket_launch",
    href: "/docs/getting-started",
    items: [
      {
        id: "installation",
        label: "Installation",
        href: "/docs/getting-started/installation",
      },
      {
        id: "quick-start",
        label: "Quick Start",
        href: "/docs/getting-started/quick-start",
      },
      {
        id: "styling",
        label: "Styling",
        href: "/docs/getting-started/styling",
      },
      {
        id: "theming",
        label: "Building Themes",
        href: "/docs/getting-started/theming",
      },
    ],
  },
  {
    id: "foundations",
    label: "Foundations",
    icon: "palette",
    href: "/docs/foundations",
    items: [
      {
        id: "design-tokens",
        label: "Design Tokens",
        href: "/docs/foundations/design-tokens",
      },
      {
        id: "typography",
        label: "Typography",
        href: "/docs/foundations/typography",
      },
      { id: "colors", label: "Colors", href: "/docs/foundations/colors" },
      { id: "spacing", label: "Spacing", href: "/docs/foundations/spacing" },
      {
        id: "elevation",
        label: "Elevation",
        href: "/docs/foundations/elevation",
      },
      { id: "motion", label: "Motion", href: "/docs/foundations/motion" },
    ],
  },
  {
    id: "components",
    label: "Components",
    icon: "widgets",
    href: "/docs/components",
    items: componentNavItems,
  },
  {
    id: "patterns",
    label: "Patterns",
    icon: "dashboard",
    href: "/docs/patterns",
    items: [
      { id: "layouts", label: "App Layouts", href: "/docs/patterns/layouts" },
      { id: "forms", label: "Forms", href: "/docs/patterns/forms" },
      {
        id: "navigation",
        label: "Navigation",
        href: "/docs/patterns/navigation",
      },
      { id: "data-display", label: "Data Display", href: "/docs/patterns/data" },
    ],
  },
];

export function getActiveCategoryId(pathname: string): string {
  if (pathname === "/") return "home";
  if (pathname.startsWith("/docs/getting-started")) return "getting-started";
  if (pathname.startsWith("/docs/foundations")) return "foundations";
  if (pathname.startsWith("/docs/components")) return "components";
  if (pathname.startsWith("/docs/patterns")) return "patterns";
  return "home";
}

export function findNavigationCategory(id: string): NavigationItem | undefined {
  return DOCS_NAVIGATION.find((category) => category.id === id);
}
