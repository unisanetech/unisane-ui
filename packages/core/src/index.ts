export { WindowSizeProvider, useWindowSize } from './layout/window-size-provider';
export {
  AppearanceProvider,
  AppearanceScript,
  useAppearance,
  useAppearancePreference,
  useMode,
  useDensity,
  clearStoredAppearance,
  getAppearanceScript,
} from './layout/appearance-provider';
export type {
  AppearanceAxis,
  AppearanceMode,
  AppearancePersistence,
  AppearancePreferences,
  AppearanceProviderProps,
  AppearanceScriptProps,
  Density,
  RadiusTheme,
  ActionShape,
  ContrastLevel,
  Elevation,
} from './layout/appearance-provider';
export { ModeSwitcher } from './components/mode-switcher';
export type { ModeSwitcherProps } from './components/mode-switcher';
export { Container } from './layout/container';
export { AppLayout, AppLayout as Scaffold } from './layout/app-layout';
export { Pane, PaneLayout, PaneDivider } from './layout/pane';
export { PageSection } from './layout/page-section';
export type { PageSectionProps } from './layout/page-section';
export { ActionCluster } from './layout/action-cluster';
export type { ActionClusterProps } from './layout/action-cluster';
export { CardGrid } from './layout/card-grid';
export type { CardGridProps } from './layout/card-grid';
export { PreviewFrame } from './layout/preview-frame';
export type { PreviewFrameProps } from './layout/preview-frame';

export { Text } from './primitives/text';
export type { TextProps } from './primitives/text';
export { Surface } from './primitives/surface';
export { StateLayer } from './primitives/state-layer';
export { FocusRing } from './primitives/focus-ring';
export { Label } from './primitives/label';
export type { LabelProps } from './primitives/label';
export { Input } from './primitives/input';
export type { InputProps } from './primitives/input';
export { Textarea } from './primitives/textarea';
export type { TextareaProps } from './primitives/textarea';
export { Icon, CheckIcon, ChevronRightIcon, CloseIcon, MenuIcon } from './components/icon';
export type { IconProps } from './components/icon';

export {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from './components/accordion';
export type { AccordionProps, AccordionItemProps } from './components/accordion';
export { Avatar, AvatarGroup } from './components/avatar';
export type { AvatarProps } from './components/avatar';
export { BottomAppBar, BottomAppBarAction } from './components/bottom-app-bar';
export type { BottomAppBarProps, BottomAppBarActionProps } from './components/bottom-app-bar';
export {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
  BreadcrumbEllipsis,
} from './components/breadcrumb';
export { Calendar } from './components/calendar';
export type { CalendarProps } from './components/calendar';
export { Carousel, CarouselSlide } from './components/carousel';
export type { CarouselProps, CarouselSlideProps } from './components/carousel';
export { DateInput } from './components/date-input';
export type { DateInputProps } from './components/date-input';
export { DatePicker } from './components/date-picker';
export type { DatePickerProps } from './components/date-picker';
export { MonthPicker } from './components/month-picker';
export type { MonthPickerProps } from './components/month-picker';
export {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
} from './components/dropdown-menu';
export { List, ListDivider, ListItem, ListSubheader } from './components/list';
export type {
  ListProps,
  ListSubheaderProps,
  ListDividerProps,
  ListItemProps,
  ListItemStaticProps,
  ListItemButtonProps,
  ListItemLinkProps,
  ListItemRenderLink,
  ListItemRenderLinkProps,
} from './components/list';
export { Pagination } from './components/pagination';
export type { PaginationProps } from './components/pagination';
export { Progress } from './components/progress';
export type { ProgressProps } from './components/progress';
export { Rating } from './components/rating';
export type { RatingProps } from './components/rating';
export { Ripple } from './components/ripple';
export { SegmentedButton } from './components/segmented-button';
export type {
  SegmentedButtonMultipleProps,
  SegmentedButtonOption,
  SegmentedButtonProps,
  SegmentedButtonSingleProps,
  SegmentedButtonSize,
} from './components/segmented-button';
export { Skeleton, SkeletonText, SkeletonAvatar, SkeletonCard } from './components/skeleton';
export type { SkeletonProps } from './components/skeleton';
export { Slider } from './components/slider';
export type { SliderProps } from './components/slider';
export { Stepper, Step, StepLabel, StepDescription } from './components/stepper';
export type { StepperProps, StepProps, StepLabelProps } from './components/stepper';
export { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from './components/table';
export { Button, buttonVariants } from './components/button';
export type { ButtonProps } from './components/button';
export { IconButton } from './components/icon-button';
export type { IconButtonProps } from './components/icon-button';
export { TextField } from './components/text-field';
export type { TextFieldProps } from './components/text-field';
export { Field, FieldDescription, FieldError, FieldLabel } from './components/field';
export type {
  FieldDescriptionProps,
  FieldErrorProps,
  FieldLabelProps,
  FieldProps,
} from './components/field';
export {
  TokenField,
  normalizeTokenFieldToken,
  splitTokenFieldInput,
} from './components/token-field';
export type { TokenFieldProps } from './components/token-field';
export { Checkbox } from './components/checkbox';
export type { CheckboxProps } from './components/checkbox';
export { Radio } from './components/radio';
export type { RadioProps } from './components/radio';
export { Switch } from './components/switch';
export type { SwitchProps } from './components/switch';
export type { SelectionControlSize } from './lib/selection-control-size';
export { Card } from './components/card';
export type { CardProps } from './components/card';
export {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from './components/select';
export type {
  SelectContentProps,
  SelectGroupProps,
  SelectItemProps,
  SelectLabelProps,
  SelectProps,
  SelectSeparatorProps,
  SelectTriggerProps,
  SelectValueProps,
} from './components/select';
export { SelectField } from './components/select-field';
export type { SelectFieldOption, SelectFieldProps } from './components/select-field';
export { Sheet } from './components/sheet';
export { Drawer } from './components/drawer';
export type { DrawerProps, DrawerSize } from './components/drawer';
export { Chip } from './components/chip';
export type { ChipProps } from './components/chip';
export { Badge } from './components/badge';
export type { BadgeProps } from './components/badge';
export { Alert } from './components/alert';
export type { AlertProps, AlertVariant } from './components/alert';
export { Banner } from './components/banner';
export type { BannerAction, BannerProps, BannerVariant } from './components/banner';
export { toast, Toast, Toaster } from './components/toast';
export type {
  ToastAction,
  ToastOptions,
  ToastPosition,
  ToastPriority,
  ToastProps,
  ToastTone,
  ToasterProps,
} from './components/toast';
export { Tabs, TabsList, TabsTrigger, TabsContent } from './components/tabs';
export type { TabsProps, TabsTriggerProps, TabsSize } from './components/tabs';
export { Divider } from './components/divider';
export type { DividerProps } from './components/divider';
export { Typography } from './components/typography';
export type {
  TypographyProps,
  TypographyRole,
  TypographyScale,
  TypographyVariant,
} from './components/typography';

export type {
  NavigationItem,
  NavigationLinkProps,
  NavigationLinkRenderer,
  NavigationPresentationProps,
} from './types/navigation';

export { NavigationBar } from './components/navigation-bar';
export type { NavigationBarProps } from './components/navigation-bar';
export { NavigationDrawer } from './components/navigation-drawer';
export type {
  NavigationDrawerProps,
  NavigationDrawerSide,
  NavigationDrawerVariant,
} from './components/navigation-drawer';
export { NavigationRail } from './components/navigation-rail';
export type {
  NavigationRailProps,
  NavigationRailLabelVisibility,
} from './components/navigation-rail';
export { TopAppBar } from './components/top-app-bar';
export type { TopAppBarProps } from './components/top-app-bar';
export { SearchBar } from './components/search-bar';
export type { SearchBarProps } from './components/search-bar';
export { Fab } from './components/fab';
export type { FabProps } from './components/fab';
export { FabMenu } from './components/fab-menu';
export type { FabMenuProps } from './components/fab-menu';
export { ScrollArea } from './components/scroll-area';
export type { ScrollAreaProps } from './components/scroll-area';
export { TimePicker } from './components/time-picker';
export type { TimePickerProps } from './components/time-picker';
export { Popover } from './components/popover';
export type { PopoverProps } from './components/popover';
export { Tooltip } from './components/tooltip';
export type { TooltipProps } from './components/tooltip';
export { Dialog } from './components/dialog';
export type { DialogProps, DialogTitle } from './components/dialog';
export { ConfirmDialog } from './components/confirm-dialog';
export type { ConfirmDialogProps } from './components/confirm-dialog';
export { Combobox } from './components/combobox';
export type { ComboboxProps, ComboboxOption } from './components/combobox';
export {
  SupportingPaneLayout,
  ListDetailLayout,
  FeedLayout,
  PaneGroup,
} from './components/canonical-layouts';

// Sidebar - Rail + Drawer navigation system
export {
  SidebarProvider,
  useSidebar,
  Sidebar,
  SidebarRail,
  SidebarDrawer,
  SidebarTrigger,
  SidebarInset,
} from './components/sidebar';
export type {
  SidebarContextValue,
  SidebarProviderProps,
  SidebarSide,
  SidebarMode,
  SidebarBehavior,
  SidebarBehaviorConfig,
  SidebarResponsiveBehavior,
  SidebarContainerMode,
  SidebarTriggerVisibility,
  SidebarViewport,
  SidebarBreakpoints,
  SidebarProps,
  SidebarRailProps,
  SidebarDrawerProps,
  SidebarTriggerProps,
  SidebarInsetProps,
} from './components/sidebar';

export { cn } from './lib/utils';

// Hooks
export { useScrollLock } from './hooks/use-scroll-lock';
