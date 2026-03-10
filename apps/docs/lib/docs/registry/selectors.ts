import {
  CATEGORY_META,
  type CategoryMeta,
  type ComponentCategory,
  type ComponentDoc,
  type ComponentListItem,
} from "./types";
import { CATEGORY_ORDER } from "./constants";
import { COMPONENT_REGISTRY, getComponentBySlug as getComponentDocBySlug } from "./component-docs";

export { COMPONENT_REGISTRY } from "./component-docs";
export { CATEGORY_META } from "./types";
export { CATEGORY_ORDER } from "./constants";
export type {
  CategoryMeta,
  ComponentCategory,
  ComponentDoc,
  ComponentListItem,
} from "./types";

export const CATEGORY_META_BY_ID: Record<ComponentCategory, CategoryMeta> =
  CATEGORY_META.reduce(
    (acc, category) => {
      acc[category.id] = category;
      return acc;
    },
    {} as Record<ComponentCategory, CategoryMeta>
  );

export function getCategoryMetaById(
  categoryId: ComponentCategory
): CategoryMeta {
  return CATEGORY_META_BY_ID[categoryId];
}

export function getAllComponents(): ComponentListItem[] {
  return COMPONENT_REGISTRY;
}

export function getComponentCount(): number {
  return COMPONENT_REGISTRY.length;
}

export function getComponentBySlug(slug: string): ComponentDoc | undefined {
  return getComponentDocBySlug(slug);
}

export function getComponentsByCategory(): Record<
  ComponentCategory,
  ComponentListItem[]
> {
  const grouped = CATEGORY_ORDER.reduce(
    (acc, categoryId) => {
      acc[categoryId] = [];
      return acc;
    },
    {} as Record<ComponentCategory, ComponentListItem[]>
  );

  for (const component of COMPONENT_REGISTRY) {
    grouped[component.category].push(component);
  }

  return grouped;
}

export function searchComponents(query: string): ComponentListItem[] {
  const normalizedQuery = query.toLowerCase().trim();
  if (!normalizedQuery) {
    return COMPONENT_REGISTRY;
  }

  return COMPONENT_REGISTRY.filter(
    (component) =>
      component.name.toLowerCase().includes(normalizedQuery) ||
      component.description.toLowerCase().includes(normalizedQuery)
  );
}

export function getAdjacentComponents(slug: string): {
  previous?: { slug: string; name: string };
  next?: { slug: string; name: string };
} {
  const index = COMPONENT_REGISTRY.findIndex((component) => component.slug === slug);

  if (index === -1) {
    return {};
  }

  const previous = index > 0 ? COMPONENT_REGISTRY[index - 1] : undefined;
  const next =
    index < COMPONENT_REGISTRY.length - 1
      ? COMPONENT_REGISTRY[index + 1]
      : undefined;

  return {
    previous: previous
      ? { slug: previous.slug, name: previous.name }
      : undefined,
    next: next ? { slug: next.slug, name: next.name } : undefined,
  };
}
