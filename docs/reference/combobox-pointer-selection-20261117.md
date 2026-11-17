---
id: DOC-ui-combobox-pointer-selection-20261117
owner: ui-maintainers
repository: unisane-ui
scope: workspace
role: reference
lifecycle: durable
authority: canonical
provenance: observed
view: current
---

# Combobox option presses — 17 November 2026

Producer Task T-296b9633; Trade adoption Task T-242a6980 in unisane-platforms.

## Confirmed defect and fix

Trade’s invoice Add an item picker accepts a quick click but silently loses a220ms held click on the same option. Its native Combobox uses non-focusable option divs and selects on click. Primary mousedown transfers input focus to body; its100ms outside-blur dismissal removes the option before release/click. Nothing reaches the item-insertion handler. The same QA Cross Screen Item adds with a quick click, so price, stock and item eligibility do not explain this reproduced failure.

The authored native Combobox now prevents the default focus transfer for primary mousedown on an option, keeping focus in the input. Selection still happens on click, not on press. No timeout enlargement, API change, Trade wrapper or installed-package patch. Keyboard, disabled, right-button, paging, outside-dismiss and touch-scroll handlers retain their existing paths. Registry output regenerated through its owning build-registry command.

Held220ms component regressions cover both portal and inline modes: input focus is retained, option remains connected, no early selection occurs and releasing/clicking selects once. Existing keyboard, disabled and overlay tests remain.

## Consumer UI evidence

- Original Trade new invoice in QA UX Batches14Nov: quick Notebook adds1piece/100; held220ms Cross Screen option closes without adding or error; quick click on that same item adds a second line. Both unsaved reproduction lines were then removed, restoring the originally empty editor. No save, issue, stock, money or tax-profile mutations. Cedar untouched; original₹21 correction pending actual openings.
- Corrected native production fixture at `/test-fixtures/modal-pickers`, built and served through the existing test-only static-export launcher: desktop220ms held click selects invoice-3 in1click/440ms; phone390×844300ms held click selects invoice-4 in1click/517ms. Input focus remains on the combobox. Open→ArrowDown→Enter selects invoice-1. Times are automation interaction-to-state observations, not human performance benchmarks.
- Evidence directory: the session-local `item-selection-20261117` evidence bundle (screenshots and timings, retained outside the public repository). Captures01 show the Trade failure;02/03 show corrected native desktop/phone selection; timings.json records conditions. Viewport reset; temporary fixture server stopped.

Native source lint, types, tests, build, focused UI validation and responsive comparison passed before version-only preparation. Responsive run `run-20261116T234135Z-ui-capture-responsive-proof-9f22f84a`:32passed/4intentional skips. Initial build failed only because sandbox blocked the CSS worker’s local port; unchanged command succeeds with process permission. Playwright1.62.1 and cached Chromium verified before declaring browser availability.

## Prepared immutable release — not published

Existing aligned family: @unisane/tokens, @unisane/ui, @unisane/data-table and @unisane/email-templates, all **0.1.2-next.20261117.1**, public npm next with provenance. UI is the only runtime source change; the other three receive version-only changes because the guarded staging workflow requires aligned versions. Previous row-hover approval remains historical and does not approve this new change. Release metadata is explicitly **prepared**, not approved.

Prepared certificate Action `run-20261116T234437Z-ui-security-prepared-certificate-ebcbf720` builds and packs the family, installs an isolated consumer and checks manifests/exports, TypeScript, SSR, email exports and stylesheets. Exact run ID/integrities are confirmed in the final preparation update below. RegistryPublicationVerified:false; preparationOnly:true. No npm staging/publication or provider secret read occurred.

The existing GitHub staging workflow requires approved metadata and npm owner2FA. Trade must consume a newly published immutable coordinate before its final UI retest/deployment. Current Trade still uses0.1.2-next.20261112.2; this document does not claim the running app is fixed. Registry and hosted effects require the exact owner authorization under AGENTS.md. No sibling source imports or copied controls are admitted.


## Exact prepared-version checks

- `quality.run-proof-phase`: `run-20261116T234703Z-quality-run-proof-phase-576c3a2c` succeeded.
- `quality.lint`: `run-20261116T234714Z-quality-lint-b4009b7e` succeeded.
- `quality.typecheck`: `run-20261116T234725Z-quality-typecheck-8a398296` succeeded.
- `quality.test`: `run-20261116T234731Z-quality-test-a1387837` succeeded.
- `quality.build`: `run-20261116T234742Z-quality-build-d9163bfe` succeeded.
- `ui.capture-responsive-proof`: `run-20261116T234832Z-ui-capture-responsive-proof-6e3b99fb` succeeded.
- `ui.data-table.prepare-candidate`: `run-20261116T234905Z-ui-data-table-prepare-candidate-e6205fef` succeeded.
- `ui.security.prepared-certificate`: `run-20261116T234437Z-ui-security-prepared-certificate-ebcbf720` succeeded.

Focused native UI validation:276tests/53files, plus4registry contract tests; Combobox suite11tests, including the two held-press regressions. Final responsive comparison32passed/4intentional skips, unchanged baselines.

Prepared archive integrities:

- `@unisane/tokens@0.1.2-next.20261117.1`: `sha512-1ZqvZN/IH3o5ib4f7SuZ5nbGi1IGhORwtrQlCc558wqoefT/bHPIVSnkwqon074IkKeA9bkP/b2ZiurbX/A9Sw==`.
- `@unisane/ui@0.1.2-next.20261117.1`: `sha512-k5i4m3uBCGjKdTA62vdiRHBZllzOcc8GSk41j69VKxlU6g6DDcBHufKD8+CI3RxH2+8ZjnD1Aew1y25NvCW4Mw==`.
- `@unisane/data-table@0.1.2-next.20261117.1`: `sha512-zS/Cn0/B6LM1TVjaoaa8si0ZR0oFG0NB/TVX57R5B+hcz64NIAUHenEloJJ7Ku4el9PjupIfRfzDtyUHOGVapQ==`.
- `@unisane/email-templates@0.1.2-next.20261117.1`: `sha512-ywldMkvdpc1//sjBKVmTOZxp5ulUUKEn+SUlkLY64/LKzDzrFsdomsYW2iKSrbSlbrxmVAXGKM8RA5yUwTwfjw==`.

These archives are locally prepared and verified, not staged or published. Approved-source release gates and Trade installed-consumer checks remain pending exact human authorization and registry availability. No publication authority is inferred from passing tests.


## Owner approval — 17 November

The owner explicitly answered **Approve package release and Trade rollout** to publication of the exact four-package0.1.2-next.20261117.1 public npm next cohort, installation in Trade, item-selection UI retest and Trade publication. Release metadata is now approved. Prior preparation-only statements above are historical checkpoints; registry staging/publication and live consumer acceptance will be recorded when observed. Cedar21 remains deferred actual openings.
