# @unisane/ui

React 19 components and runtime styles for Unisane applications.

```bash
pnpm add @unisane/ui @unisane/tokens react react-dom
```

Import the runtime stylesheet once at the application boundary:

```css
@import '@unisane/ui/styles.css';
```

Use only documented package subpaths such as `@unisane/ui/button`. The local-source
registry is generated from this package's own `src/**`; DataTable has a separate package
and is not copied into the UI registry.

See `docs/00-start-here.md` in the repository for maintainer architecture and authoring
standards.
