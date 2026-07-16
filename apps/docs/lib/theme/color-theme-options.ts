export interface ColorThemeOption {
  value:
    | 'blue'
    | 'purple'
    | 'pink'
    | 'red'
    | 'orange'
    | 'yellow'
    | 'green'
    | 'cyan'
    | 'neutral'
    | 'black';
  label: string;
  hue?: number;
  swatch?: string;
}

export const COLOR_THEME_OPTIONS: ColorThemeOption[] = [
  { value: 'blue', label: 'Blue', hue: 230 },
  { value: 'purple', label: 'Purple', hue: 285 },
  { value: 'pink', label: 'Pink', hue: 340 },
  { value: 'red', label: 'Red', hue: 25 },
  { value: 'orange', label: 'Orange', hue: 55 },
  { value: 'yellow', label: 'Yellow', hue: 85 },
  { value: 'green', label: 'Green', hue: 145 },
  { value: 'cyan', label: 'Cyan', hue: 195 },
  { value: 'neutral', label: 'Neutral', swatch: '#6B7280' },
  { value: 'black', label: 'Black', swatch: '#1A1A1A' },
];

export function getColorThemeSwatch(option: ColorThemeOption): string {
  if (option.swatch) {
    return option.swatch;
  }

  if (typeof option.hue === 'number') {
    return `oklch(0.62 0.16 ${option.hue})`;
  }

  return '#6B7280';
}
