export { Nav } from '@/components/ui/navigation/nav';
export type { NavProps } from '@/components/ui/navigation/nav';

export { NavItem } from '@/components/ui/navigation/nav-item';
export type { NavItemProps } from '@/components/ui/navigation/nav-item';

export { NavGroup } from '@/components/ui/navigation/nav-group';
export type { NavGroupProps } from '@/components/ui/navigation/nav-group';

export { useNavigationState } from '@/hooks/use-navigation-state';
export { useNavigationHover } from '@/hooks/use-navigation-hover';
export { useNavigationItems } from '@/hooks/use-navigation-items';
export { useNavigationBreakpoint } from '@/hooks/use-navigation-breakpoint';

export type {
  NavigationItem,
  NavigationGroup,
  NavigationState,
  NavigationHoverState,
  UseNavigationStateConfig,
  UseNavigationHoverConfig,
  ProcessedNavigationItems,
  NavigationBreakpoint,
  NavigationVariant,
  NavigationDensity,
  NavigationDrawerMode,
  NavigationDrawerSide,
  NavigationBarVariant,
  NavigationScrollBehavior,
} from '@/types/navigation';
