# @unisane/ui-cli

UI-owned adopter tooling for Unisane UI. The package owns the independent `unisane-ui`
binary and its `init`, `add`, `diff`, `doctor`, `theme`, and `appearance` command
surface. It is not loaded by the Framework `unisane` executable or the Ops
`unisane-ops` executable.

The UI registry is copied from `packages/ui/registry` during this package's build
and shipped inside `dist/ui-registry`. Runtime commands use only those bundled
assets, unless an explicit `UNISANE_UI_REGISTRY_DIR` is supplied for controlled
tests or development. Runtime `@unisane/ui` consumers do not depend on this package,
the Ops engine, or Node-only CLI dependencies.

```bash
unisane-ui init --theme blue
unisane-ui add button dialog
unisane-ui doctor
```
