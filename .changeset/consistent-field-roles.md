---
"@unisane/ui": patch
"@unisane/data-table": patch
---

Honor typography roles in Text, overlay titles, field labels and helpers. Keep
Select values/options consistent through root size, expose menu row size, allow
field frame token customization, and name label-free Combobox controls. Add
getRowLabel for meaningful DataTable selection/expansion context.

Prerelease migration: move size from SelectTrigger to Select. SelectField's size
API is unchanged. Explicit Text weight continues to override the theme role.
