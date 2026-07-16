const requiredExports = new Map([
  ['@unisane/ui/appearance-provider', ['AppearanceProvider', 'AppearanceScript']],
  ['@unisane/ui/alert', ['Alert']],
  ['@unisane/ui/banner', ['Banner']],
  ['@unisane/ui/badge', ['Badge']],
  ['@unisane/ui/button', ['Button']],
  ['@unisane/ui/calendar', ['Calendar']],
  ['@unisane/ui/checkbox', ['Checkbox']],
  ['@unisane/ui/confirm-dialog', ['ConfirmDialog']],
  ['@unisane/ui/dialog', ['Dialog']],
  ['@unisane/ui/divider', ['Divider']],
  ['@unisane/ui/date-input', ['DateInput']],
  ['@unisane/ui/date-picker', ['DatePicker']],
  ['@unisane/ui/field', ['Field', 'FieldLabel', 'FieldDescription', 'FieldError']],
  ['@unisane/ui/icon', ['Icon']],
  ['@unisane/ui/list', ['List', 'ListDivider', 'ListItem', 'ListSubheader']],
  ['@unisane/ui/navigation-bar', ['NavigationBar']],
  ['@unisane/ui/navigation-drawer', ['NavigationDrawer']],
  ['@unisane/ui/navigation-rail', ['NavigationRail']],
  ['@unisane/ui/radio', ['Radio']],
  ['@unisane/ui/segmented-button', ['SegmentedButton']],
  ['@unisane/ui/select', ['Select', 'SelectTrigger', 'SelectValue', 'SelectContent', 'SelectItem']],
  ['@unisane/ui/select-field', ['SelectField']],
  ['@unisane/ui/sidebar', ['Sidebar', 'SidebarProvider']],
  ['@unisane/ui/surface', ['Surface']],
  ['@unisane/ui/switch', ['Switch']],
  ['@unisane/ui/text-field', ['TextField']],
  ['@unisane/ui/toast', ['Toast', 'Toaster', 'toast']],
]);

for (const [specifier, expectedNames] of requiredExports) {
  const module = await import(specifier);
  for (const name of expectedNames) {
    if (!(name in module)) {
      throw new Error(`${specifier} does not export ${name}`);
    }
  }
}

console.log(`Runtime export check passed for ${requiredExports.size} flat subpaths.`);
