# @unisane/ui-cli

UI-owned adopter tooling for Unisane UI. The package owns the independent `unisane-ui`
binary and is not loaded by the Framework `unisane` executable or the Ops
`unisane-ops` executable.

The UI registry is copied from `packages/ui/registry` during this package's build
and shipped inside `dist/ui-registry`. Runtime commands use only those bundled
assets, unless an explicit `UNISANE_UI_REGISTRY_DIR` is supplied for controlled tests or
development. Runtime `@unisane/ui` consumers do not depend on this package, the Ops
engine, or Node-only CLI dependencies.

The CLI detects pnpm, npm, Yarn, or Bun from the project lockfile or `packageManager`
field. It installs exact registry dependencies automatically and restores source,
configuration, manifest, and lock files if installation fails. Use `--no-install` when
dependency installation is intentionally owned elsewhere.

```bash
unisane-ui init --theme blue
unisane-ui add button dialog
unisane-ui list
unisane-ui search navigation
unisane-ui view button
unisane-ui doctor
```

| Command                         | Purpose                                                        |
| ------------------------------- | -------------------------------------------------------------- |
| `unisane-ui init`               | Initialize local source, semantic CSS, theme, and configuration |
| `unisane-ui add`                | Add items and their complete registry dependency closure       |
| `unisane-ui list`               | List the generated registry catalog                            |
| `unisane-ui search`             | Search catalog names, descriptions, and item types             |
| `unisane-ui view`               | Inspect one item and its dependency closure                    |
| `unisane-ui diff`               | Inspect differences without overwriting local source           |
| `unisane-ui doctor`             | Check the local installation contract                          |
| `unisane-ui theme`              | Replace the generated semantic color theme                     |
| `unisane-ui appearance enable`  | Add selected runtime appearance preferences                    |
| `unisane-ui appearance disable` | Remove one runtime appearance preference                       |
| `unisane-ui appearance list`    | Show enabled appearance preferences                            |

`components.json` is the project routing and appearance configuration. Registry-installed
applications own the emitted source and do not require a Unisane runtime package.

This package remains private and `UNLICENSED` until separately approved. Repository
readiness does not authorize package publication.
