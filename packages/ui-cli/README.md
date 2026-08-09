# @unisane/ui-cli

UI-owned adopter tooling for Unisane UI. The package contributes the `unisane ui`
command family to the canonical `unisane` executable; it does not publish a second
binary.

The UI registry is copied from `packages/ui/registry` during this package's build
and shipped inside `dist/ui-registry`. Runtime commands use only those bundled
assets, unless an explicit `UNISANE_UI_REGISTRY_DIR` is supplied for controlled
tests or development. Runtime `@unisane/ui` consumers do not depend on this package,
the Ops engine, or Node-only CLI dependencies.
