---
id: 'F-599e88a220ff'
owner: 'unisane'
repository: unisane-ui
scope: workspace
role: finding
lifecycle: active
authority: supporting
provenance: accepted
view: current
severity: SHOULD
status: open
---

# F-20260528 Communication Mail Template Runtime Drift

## Changelog

- `2026-07-15`: Updated the Mail convergence evidence link after P113-W19 moved to the historical execution archive.
- `2026-07-14`: P113-W19 hardened the completed Mail runtime boundary with atomic idempotency, monotonic provider events, correct global suppression behavior, deterministic pagination, persisted cleanup, strict dual-provider mapping, and reliable provider ingress without changing the remaining admin UI/dashboard closure tail.
- `2026-05-28`: Implemented `P106-W9` to move suppression ownership fully into `@unisane/mail` and add mail admin/ops APIs for messages, suppressions, and resend.
- `2026-05-28`: Implemented `P106-W8` to route SES/Resend provider webhooks through mail-owned provider events, ledger updates, and suppression requests.
- `2026-05-28`: Implemented `P106-W3` to add the first `@unisane/mail` module runtime skeleton and `MAIL_PORT`.
- `2026-05-28`: Implemented `P106-W4` to route notify email fanout through `MAIL_PORT`.
- `2026-05-28`: Implemented `P106-W5` to refresh create-unisane packaged starter snapshots and align scaffold smoke coverage with package-first CLI behavior.
- `2026-05-28`: Implemented `P106-W6` to order module-provided required tokens before consumers, fixing True Resume mail/notify startup.
- `2026-05-28`: Implemented `P106-W7` to add the first `@unisane/mail` provider-neutral delivery ledger.
- `2026-05-28`: Implemented `P106-W2` to introduce `MAIL_DELIVERY_PORT` and remove notify's direct dependency on raw email provider/template ports.
- `2026-05-28`: Implemented the first shared package slice and left the finding active for create-unisane packaged snapshot refresh plus later mail-module separation routing.
- `2026-05-28`: Opened the active hard-refactor finding for shared email template runtime drift across platforms, starters, and notify-adjacent mail flows.

## Finding

Unisane currently has multiple app-local and starter-local email template renderers while `@unisane/notify` still owns email enqueue/delivery workflow shape. That is workable for isolated apps, but it is not scalable for platform-grade transactional, lifecycle, billing, security, and marketing email surfaces.

The gap is architectural, not visual only:

1. email HTML and plain-text templates are duplicated across deployables
2. brand/layout decisions do not have one reusable typed package
3. template data contracts are not centrally typed
4. quality gates cannot preview/test all email variants through one surface
5. adding marketing or product-lifecycle emails would increase app-local drift
6. notify can become a hidden owner of the complete mailing system unless the mail/template boundary is made explicit

## Required Direction

Implement the communication/mail template system as a greenfield hard refactor:

1. create a shared template package outside core module runtime internals
2. centralize reusable layouts, typography, media rules, sections, buttons, footers, and plain-text rendering
3. move app/starter template rendering to the shared package
4. keep notify focused on notification/business enqueue semantics until the dedicated mail module boundary is implemented
5. do not keep legacy app-local template renderers or fallback paths
6. use TypeScript/check failures as the discovery surface after deleting or replacing old internal exports

## Non-Goals

1. do not build a full marketing campaign product in the first workpack
2. do not change SES/Resend provider behavior in the template package slice
3. do not copy the reference screenshots exactly; use them only as quality/style direction
4. do not introduce a second notify-owned complete mailing system
5. do not add compatibility shims for old internal template APIs

## Closure Signal

This finding can close after the shared template package is the SSOT for current app/starter email templates, duplicate local renderers are removed or reduced to platform-specific data assembly only, focused tests cover HTML/text output, mail delivery owns durable lifecycle state, and admin/ops surfaces make provider-event and suppression state operationally inspectable.

`P106-W1` implements the shared package and app/starter rewiring. `P106-W2` introduces the canonical `MAIL_DELIVERY_PORT` boundary so notify no longer owns raw provider/template dispatch. `P106-W3` adds the first `@unisane/mail` module runtime skeleton and `MAIL_PORT`. `P106-W4` routes notify email fanout through `MAIL_PORT`. `P106-W5` refreshes create-unisane packaged starter snapshots and closes the scaffold packaging residual. `P106-W6` fixes startup ordering for module-provided required tokens so `mail` registers `MAIL_PORT` before `notify` resolves it. `P106-W7` adds a provider-neutral `mail_messages` ledger and idempotency handling around transactional delivery. `P106-W8` moves provider webhook ingestion into mail-owned events. `P106-W9` moves suppression state out of notify and adds mail-owned admin/ops APIs for message inspection, suppression management, and resend/replay. Keep this finding active until starter admin UI and provider-event dashboards adopt the new APIs.
