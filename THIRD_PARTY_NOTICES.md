# Third-party notices

Unisane UI depends on third-party software that remains governed by its original
license. Package distributions do not relicense those dependencies.

## Public package runtime dependencies

| Package                                     | License    |
| ------------------------------------------- | ---------- |
| `@tanstack/react-virtual`                   | MIT        |
| `class-variance-authority`                  | MIT        |
| `chalk`                                     | MIT        |
| `clsx`                                      | MIT        |
| `cmdk`                                      | MIT        |
| `commander`                                 | MIT        |
| `dequal`                                    | MIT        |
| `fs-extra`                                  | MIT        |
| `jspdf`                                     | MIT        |
| `jspdf-autotable`                           | MIT        |
| `prompts`                                   | MIT        |
| `react` and `react-dom` (peer dependencies) | MIT        |
| `tailwind-merge`                            | MIT        |
| `vaul`                                      | MIT        |
| `xlsx`                                      | Apache-2.0 |

`@unisane/tokens`, `@unisane/ui`, `@unisane/ui-cli`, `@unisane/data-table`, and
`@unisane/email-templates` are Unisane packages covered by this repository's MIT
License. The separately distributed canonical `unisane` CLI host retains its own source
and license authority.

## Documentation-only assets and tooling

- `@material-symbols/font-400` is used only by the private documentation application
  and is distributed under Apache-2.0 by its upstream owner. It is not included in the
  five public package archives.
- The documentation SVG illustrations under `apps/docs/public/images/home/**` are
  Unisane-authored and covered by the repository MIT License.
- Development and build dependencies remain governed by the license metadata and
  license files delivered with their installed packages. The exact resolved inventory
  is reproducible from `pnpm-lock.yaml` with `pnpm licenses list --json`.

This notice is an attribution index, not a replacement for upstream license texts.
