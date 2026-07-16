export function generateRuntimeAxesSection() {
  return `
/* Optional runtime preference axes. Add attributes only when the application exposes them. */
[data-density="compact"] {
  --scale-space-density: 0.875;
  --scale-type-density: 0.9;
  --scale-radius-density: 0.9;
}

[data-density="dense"] {
  --scale-space-density: 0.75;
  --scale-type-density: 0.85;
  --scale-radius-density: 0.85;
}

[data-density="comfortable"] {
  --scale-space-density: 1.1;
  --scale-type-density: 1;
  --scale-radius-density: 1;
}

[data-radius="none"] { --scale-radius-theme: 0; }
[data-radius="minimal"] { --scale-radius-theme: 0.25; }
[data-radius="sharp"] { --scale-radius-theme: 0.5; }
[data-radius="standard"] { --scale-radius-theme: 1; }
[data-radius="soft"] { --scale-radius-theme: 1.25; }

[data-action-shape="standard"] { --radius-button-family: var(--radius-button-default); }
[data-action-shape="full"] { --radius-button-family: var(--radius-button-full); }

[data-elevation="flat"] { --shadow-opacity: 0; }
[data-elevation="subtle"] { --shadow-opacity: 0.25; }
[data-elevation="standard"] { --shadow-opacity: 0.5; }
[data-elevation="pronounced"] { --shadow-opacity: 1; }
`;
}
