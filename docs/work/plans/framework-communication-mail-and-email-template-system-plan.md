---
id: 'PLAN-fde622575b01'
owner: 'unisane'
repository: unisane-ui
scope: workspace
role: plan
lifecycle: active
authority: supporting
provenance: accepted
view: current
status: active
appliesTo:
  - 'communication'
  - 'mail'
  - 'email'
  - 'template'
  - 'system'
---

# Framework Communication Mail And Email Template System Plan

Draft strategy for making Unisane communication a first-class platform capability instead of letting transactional mail, notification fanout, provider delivery, marketing campaigns, and HTML template design collapse into one module.

## Program Routing

This is a peer communication/email-template domain Plan under `unisane-ui`, not a P-7
technical child. It retains mail, notification, and email-template business/design
outcomes. P-7 and accepted Framework Decisions govern any Compiler, runtime, module,
provider-package, or generated-client interface it consumes; remote provider operations
remain Unisane Ops actions.

## Changelog

- `2026-08-15`: Recorded peer routing beside P-7 and retained only the
  communication/mail/email-template domain outcome under this Plan.
- `2026-07-25`: Clarified that this plan remains the email/Mail authority; phone
  normalization, verification challenges, and durable SMS/WhatsApp delivery route to the
  dedicated architecture and convergence plan, with Notify retaining channel/fanout
  orchestration.
- `2026-05-28`: Reframed the greenfield policy as a hard-refactor execution rule: delete old internal mail/template capabilities first, intentionally use resulting TypeScript/check failures as the discovery surface, then fix every affected platform/module without legacy fallbacks or migration shims.
- `2026-05-28`: Added the greenfield implementation policy for the mail/template system: no deprecated runtime paths, no legacy fallback renderers, no parallel template ID schemes, and rollout across every affected platform rather than True Resume-only wiring.
- `2026-05-28`: Linked the plan-local visual reference asset folder and clarified that the saved images are design-pattern references rather than exact template specifications.
- `2026-05-28`: Expanded the draft with email design-system requirements for responsive layouts, typography/type scale, media handling, layout variants, brand assets, preview QA, and polished template acceptance criteria.
- `2026-05-28`: Added the draft communication-stack strategy after the True Resume mail/template review. The draft freezes the proposed ownership split between business modules, `@unisane/mail`, reusable email templates, `@unisane/notify`, provider adapters, and future marketing workflows before implementation starts.

## Hard-Refactor Rule

This work is a greenfield hard refactor, not a migration.

For internal runtime/module/platform flows, implementation must remove the old mail/template capability first, then use the resulting TypeScript, tests, architecture checks, and runtime fixture failures as the discovery surface for every side effect that must be fixed.

Do not preserve speed by adding fallback paths. Preserve speed by making breakage obvious and fixing all affected callsites directly.

Required execution order:

1. identify the old internal runtime/template/delivery path being replaced
2. delete or rename the old internal export/API/registry entry first
3. run focused type/check commands to expose all dependent callsites
4. replace every callsite with the canonical mail/template model
5. remove obsolete queues, template IDs, generic renderers, app-local template registries, and notify-owned mail delivery seams
6. update every affected platform/starter/module in the same workstream
7. run the proportional closure checks only after the graph has no old internal path left

Forbidden during this work:

1. legacy fallback renderers
2. underscore/dotted duplicate template IDs
3. `@deprecated` internal exports
4. temporary internal shims
5. provider registries
6. app-local duplicate template systems
7. keeping old notify-owned mail delivery as a parallel runtime path
8. leaving unfixed side effects for later once the old path has been removed

## Current Planning Status

This is an active P-7 domain child. It records the accepted direction and remaining
multi-Task delivery sequence, but it does not itself admit implementation.

Where implementation exposes a still-unresolved durable choice, that choice must be
promoted into:

1. a decision doc under `docs/decisions/`
2. the relevant architecture or SSOT docs
3. module README and package docs for every introduced package
4. enforcement checks for template coverage and ownership drift

## Greenfield Implementation Policy

This work follows the repo greenfield policy.

When implementation starts:

1. hard-replace current internal mail/template runtime paths with the canonical model
2. delete weak generic fallback renderers as part of the refactor, not after a later migration period
3. use one canonical dotted template ID grammar across modules, template packs, runtime queues, fixtures, previews, docs, and platform configs
4. update every affected platform and starter in the same workstream, not only True Resume
5. keep any unavoidable public package compatibility alias at the package boundary only, never inside internal runtime/module flows
6. do not add `@deprecated` internal exports, shadow registries, provider registries, or second ways to send/render mail
7. intentionally let TypeScript and checks expose breakage after removing old exports, then fix all callsites and side effects directly

The target outcome is one mail runtime, one template registry model, one template ID grammar, one provider-adapter seam, and platform-specific brand/override composition only.

## Visual Reference Assets

Plan-local visual references live in:

```txt
docs/reference/assets/communication-mail-email-template-system.md
```

These images are design-pattern references only. They define quality-bar ideas such as responsive desktop/mobile presentation, polished hierarchy, branded headers, CTA treatment, billing/security/OTP patterns, key-value table readability, and preview-gallery framing.

They are not exact templates to copy, not canonical Unisane branding, and not implementation specs.

## Goal

Build an enterprise-grade communication stack for Unisane that supports:

1. transactional emails for auth, billing, workspaces, platform workflows, and product lifecycle events
2. reusable branded email templates across platforms
3. provider-neutral delivery through SES, Resend, Postmark, SMTP, or future adapters
4. delivery tracking, retries, suppression, unsubscribe, and provider-event ingestion
5. notification fanout without making `@unisane/notify` own the complete mail system
6. future marketing workflows without mixing campaigns into transactional mail runtime
7. a clear SSOT for template IDs, template prop schemas, rendering, branding, and delivery lifecycle

The core design objective is one stable model:

```txt
business modules declare communication intent
@unisane/mail owns transactional mail runtime
email design package owns reusable HTML/text templates
@unisane/notify owns notification orchestration and in-app notifications
@unisane/marketing owns campaigns and audiences later
provider adapters own provider-specific delivery
platform apps choose brand, packs, overrides, and provider config
```

## Why This Plan Exists

The True Resume review surfaced the current drift:

1. True Resume wires email rendering app-locally through `src/email/templates.ts`.
2. The app config selects a mail provider, but delivery currently flows through notify-owned email delivery.
3. Auth has concrete runtime template IDs such as `auth_otp_code`, while generated capability metadata uses dotted IDs such as `auth.magic-link`.
4. Several enqueued templates have no real renderer and fall back to weak generic output.
5. `@unisane/notify` currently owns too much of the email delivery path for a future platform-grade mail system.
6. There is no shared reusable email template library comparable to a UI component library.

This is not only a True Resume issue. Future Unisane platforms will need auth/security emails, billing emails, workspace invites, lifecycle emails, admin-triggered emails, newsletters, campaigns, digests, branded templates, previews, delivery records, and compliance controls.

The framework needs a communication architecture, not an email helper.

This plan's executable scope remains email and `@unisane/mail`. The canonical phone
value, Identity contact trust, generic verification challenge, and durable SMS/WhatsApp
delivery boundary now lives in
the [Framework phone, contact, verification, and messaging architecture](https://github.com/unisane/unisane/blob/main/docs/architecture/12-phone-contact-verification-and-messaging-architecture.md).
That channel family is a sibling delivery capability behind Notify's existing
fanout/intent boundary; it must not absorb Mail's email lifecycle or create a second
notification-intent owner.

## Non-Goals For The First Implementation

The first implementation should not build the entire marketing platform.

Deferred until the transactional mail foundation is stable:

1. campaign builders
2. audience segmentation
3. experiments
4. marketing analytics dashboards
5. scheduled newsletter orchestration
6. drag-and-drop template editing

The first implementation should create the boundaries that make those features possible later.

## Target Ownership Model

### Business Modules

Business modules declare communication intent and template contracts.

Examples:

1. `@unisane/auth` declares security and account lifecycle mail intents.
2. `@unisane/billing` declares invoice, payment, trial, and subscription mail intents.
3. `@unisane/workspaces` declares invite and membership mail intents.
4. Platform modules such as True Resume declare product-specific mail intents.

Business modules must not own:

1. HTML email templates
2. CSS or email layout details
3. provider delivery logic
4. provider webhook handling
5. unsubscribe or bounce processing
6. app-specific brand copy

Business modules may own:

1. canonical template intent IDs
2. required prop schemas
3. category and policy metadata
4. idempotency key requirements
5. audit or event publication requirements

### `@unisane/mail`

`@unisane/mail` is the canonical transactional mail runtime.

It owns:

1. `MAIL_PORT`
2. mail send/enqueue APIs
3. mail delivery lifecycle
4. mail outbox records
5. retries and failure classification
6. idempotency
7. suppression lists
8. unsubscribe records
9. bounce and complaint ingestion
10. provider message ID tracking
11. template registry consumption
12. provider delivery through a provider port
13. admin inspection contracts
14. mail-specific audit events

It does not own:

1. in-app notification state
2. campaign audience logic
3. HTML component implementation
4. provider SDK code directly inside module runtime

### Email Design Package

A reusable email design package should behave like an email-specific UI component library.

Preferred location for discussion:

```txt
packages/email/
```

Alternative naming can be decided later, but the package must remain presentation/template focused.

It owns:

1. email-safe components
2. layouts
3. shared template packs
4. HTML rendering
5. plain-text rendering
6. inline-style handling
7. preview fixtures
8. template gallery tooling
9. brand token mapping
10. template pack manifests
11. render validation helpers
12. email typography roles
13. email-specific type scale
14. responsive email layout primitives
15. email media policy and image variants
16. polished template variants for transactional, security, billing, workspace, marketing, digest, and product emails

It does not own:

1. mail delivery
2. provider selection
3. outbox records
4. suppression or unsubscribe state
5. campaign scheduling

## Email Design System Requirements

The email template package must be a real design system for email, not a folder of one-off HTML snippets.

Email design has different constraints from web UI:

1. inconsistent CSS support across clients
2. Outlook and legacy table-layout constraints
3. image blocking by default in some inboxes
4. limited custom-font support
5. inline-style and media-query constraints
6. dark-mode color rewriting
7. mobile inbox widths that differ from browser viewports

Therefore the package should expose tested email-safe primitives and variants instead of allowing every template to hand-write raw layout, typography, and media CSS.

### Responsive Layout

Email responsiveness means email-safe responsiveness, not normal web responsiveness.

Required behavior:

1. mobile-first content readability
2. desktop max-width shells, usually around `600px`
3. single-column mobile fallbacks
4. safe two-column sections only where supported
5. stacked panel and card-like content blocks
6. responsive buttons with reliable tap targets
7. safe image scaling
8. mobile-safe header and footer variants
9. plain-text fallback for every template
10. image-blocked fallback for image-dependent templates

Target layout primitives:

```txt
EmailShell
EmailHeader
EmailFooter
EmailSection
EmailStack
EmailColumns
EmailPanel
EmailButton
EmailImage
EmailText
EmailHeading
EmailKeyValueTable
```

### Typography And Type Scale

Email templates should use role-based typography, not arbitrary font sizes inside individual templates.

Canonical typography roles:

```txt
eyebrow
title
subtitle
body
body-muted
caption
code
button-label
footer
```

Each role should resolve through the email theme to:

1. font family and fallback stack
2. font size
3. line height
4. font weight
5. color role
6. spacing and margin rules

Templates should express intent:

```txt
<EmailHeading role="title" />
<EmailText role="body" />
```

They should not set raw sizes in every template.

### Media And Brand Assets

Email media needs explicit policy because images may be blocked, rewritten, proxied, or displayed in dark mode.

Supported media roles:

```txt
logo
hero
thumbnail
avatar
icon
receipt
product-screenshot
```

Each media role should define:

1. max width
2. height behavior
3. aspect-ratio guidance
4. retina asset strategy
5. required alt text
6. dark-mode variant support where useful
7. remote URL policy
8. CID or attachment policy for future provider support
9. fallback behavior when images are blocked

Examples:

```txt
logo:
  maxWidth: 140
  alt required
  dark variant optional

hero:
  maxWidth: 600
  aspectRatio recommended
  alt required
  must degrade when blocked
```

### Layout Variants

Reusable layouts should support controlled variants so platforms can create polished emails without forking templates.

Target layouts:

```txt
TransactionalLayout
SecurityLayout
BillingLayout
WorkspaceInviteLayout
MarketingLayout
DigestLayout
ProductUpdateLayout
```

Target variant axes:

```txt
tone: neutral | security | success | warning | critical | billing | product
density: compact | comfortable
header: logo-only | logo-title | product
footer: minimal | legal | unsubscribe | workspace
media: none | logo | hero | thumbnail | receipt
cta: primary | secondary | split
```

The design-system default should be:

1. well laid out by default
2. responsive by default
3. brandable by platform
4. variant-driven instead of copied
5. HTML and text rendered together
6. previewed before shipping

### Token And Style SSOT

`@unisane/tokens` can remain the source for broad brand/design tokens, but `@unisane-ui/email` should map those tokens into email-safe roles.

Ownership:

```txt
@unisane/tokens
  -> source brand/design tokens

@unisane-ui/email
  -> email-safe typography, spacing, media, layout, button, divider, and table rules

platform app
  -> logo, colors, font preference, product assets, copy tone, selected overrides
```

Core rule:

1. web UI components should not be reused directly inside email templates
2. email templates should use email-safe primitives
3. raw template-level CSS should be exceptional and reviewed
4. template style decisions should flow from email theme roles

### `@unisane/notify`

`@unisane/notify` owns notification orchestration and in-app notifications.

It owns:

1. in-app notification creation
2. read/unread state
3. notification preferences
4. notification fanout policy
5. notification events
6. channel selection

It should not own the complete mail system.

When notification fanout selects email, notify should delegate to `MAIL_PORT`.

```txt
notify decides channel=email
  -> MAIL_PORT.sendTransactional(...)
```

Notify must not own:

1. email provider delivery
2. email HTML rendering
3. mail provider webhooks
4. mail suppression
5. mail unsubscribe lifecycle
6. mail delivery retry state

### Provider Adapters

Provider adapters own external delivery implementation.

Examples:

1. `@unisane/email-ses`
2. `@unisane/email-resend`
3. `@unisane/email-postmark`
4. `@unisane/email-smtp`
5. `@unisane/email-dev`

Provider adapters must be registered only in starters or starter-owned adapter wiring, consistent with Unisane's adapter boundary.

### Future `@unisane/marketing`

Marketing should be separate from transactional mail.

It should own:

1. campaigns
2. audiences
3. segments
4. lists
5. consent
6. scheduling
7. bulk sends
8. experiments
9. campaign analytics
10. marketing unsubscribe/list preferences

It should still use `@unisane/mail` for actual delivery.

## Target Package Shape

### Mail Runtime Module

In the [Unisane Framework repository](https://github.com/unisane/unisane):

```txt
packages/modules/mail/
  package.json
  README.md
  src/
    index.ts
    module.ts
    tokens.ts
    contracts/
      mail.contract.ts
      admin-mail.contract.ts
    domain/
      mail-category.ts
      mail-delivery-status.ts
      mail-message.ts
      mail-policy.ts
      mail-recipient.ts
      mail-template-ref.ts
    service/
      mail-service.ts
      mail-outbox-service.ts
      mail-delivery-service.ts
      mail-suppression-service.ts
      mail-unsubscribe-service.ts
      mail-provider-event-service.ts
    data/
      mail-repository.ts
      mail-delivery-repository.ts
      mail-suppression-repository.ts
      mail-unsubscribe-repository.ts
    events.ts
```

### Shared Ports

Likely shared token placement in the [Unisane Framework repository](https://github.com/unisane/unisane):

```txt
packages/foundation/ports/src/mail.ts
```

Candidate ports:

```txt
MAIL_PORT
MAIL_PROVIDER_PORT
MAIL_TEMPLATE_REGISTRY_PORT
MAIL_RENDERER_PORT
```

Open design point:

1. decide which tokens are cross-module business tokens in `@unisane/ports`
2. decide which infrastructure-only tokens belong in `@unisane/kernel`
3. avoid provider registries and runtime singleton access

### Email Design Package

```txt
packages/email/
  package.json
  README.md
  src/
    index.ts
    components/
      Button.tsx
      CodeBlock.tsx
      Divider.tsx
      EmailColumns.tsx
      EmailHeading.tsx
      EmailImage.tsx
      EmailSection.tsx
      EmailShell.tsx
      EmailStack.tsx
      EmailText.tsx
      Footer.tsx
      Header.tsx
      KeyValueTable.tsx
      Logo.tsx
      Panel.tsx
      Unsubscribe.tsx
    layouts/
      BillingLayout.tsx
      DigestLayout.tsx
      MarketingLayout.tsx
      ProductUpdateLayout.tsx
      SecurityLayout.tsx
      TransactionalLayout.tsx
      WorkspaceInviteLayout.tsx
    theme/
      createEmailTheme.ts
      emailColorRoles.ts
      emailMedia.ts
      emailRadii.ts
      emailSpacing.ts
      emailTypography.ts
      emailTypeScale.ts
    registry/
      createEmailTemplateRegistry.ts
      defineEmailPack.ts
      defineEmailTemplate.ts
    render/
      inlineEmailStyles.ts
      renderEmailHtml.ts
      renderEmailText.ts
      validateEmailOutput.ts
      validateEmailMedia.ts
    packs/
      auth/
      billing/
      system/
      workspaces/
    preview/
      fixtures.ts
      renderPreview.ts
```

### Platform Composition

True Resume should compose templates and brand, not hand-roll the whole email system.
In the [Unisane Platforms repository](https://github.com/unisane/unisane-platforms):

```txt
apps/true-resume/src/email/
  brand.ts
  registry.ts
  overrides/
    auth.ts
    billing.ts
    product.ts
```

The platform should be able to express:

1. use default auth templates
2. use default billing templates
3. use True Resume brand tokens
4. override selected copy or layout slots
5. add product-specific templates
6. use SES as provider in starter config

## Canonical Template IDs

Template IDs should use one dotted canonical grammar across modules, docs, template packs, and runtime.

Examples:

```txt
auth.magic-link
auth.otp-code
auth.verify-email
auth.password-reset
auth.welcome
billing.subscription-created
billing.invoice-paid
billing.payment-failed
billing.trial-ending
workspaces.invite
workspaces.member-added
workspaces.role-changed
true-resume.resume-ready
true-resume.export-ready
```

Avoid parallel runtime IDs such as:

```txt
auth_magic_link
billing_invoice_paid
```

Internal runtime must not keep underscore aliases or fallback IDs. If public package compatibility requires a temporary alias, keep it at the package boundary only and document the migration.

## Template Contract Shape

Each template contract should define:

1. template ID
2. owning module or platform module
3. category
4. required props schema
5. optional props schema
6. default priority
7. unsubscribe policy
8. suppression policy
9. idempotency key shape
10. audit/event policy
11. whether the template is transactional, security, billing, product, digest, or marketing

Illustrative shape:

```txt
templateId: auth.password-reset
owner: modules/auth
category: security
props:
  resetUrl: url
  expiresAt: datetime
  requesterIp: optional string
unsubscribePolicy: not-unsubscribable
idempotencyKey: auth.password-reset:<userId>:<requestId>
```

## Mail Runtime API Draft

Candidate mail port shape:

```txt
MAIL_PORT.sendTransactional({
  scopeId,
  to,
  templateId,
  props,
  category,
  idempotencyKey,
  metadata
})
```

Candidate delivery behavior:

1. validate request shape
2. validate template contract
3. validate template props
4. enforce suppression/unsubscribe policy
5. persist mail message and delivery attempt
6. render HTML and text through the template registry
7. call provider adapter
8. store provider message ID
9. publish mail lifecycle events
10. retry according to failure classification

## Data Model Draft

Candidate collections or tables:

```txt
mail_messages
mail_deliveries
mail_suppressions
mail_unsubscribes
mail_provider_events
mail_template_versions
```

Minimum fields:

1. `scopeId`
2. recipient address or normalized recipient ref
3. template ID
4. category
5. idempotency key
6. delivery status
7. provider name
8. provider message ID
9. last error code
10. attempt count
11. suppression reason
12. unsubscribe category or list
13. timestamps

## Delivery Lifecycle

Canonical statuses:

```txt
queued
rendered
sent
deferred
failed
bounced
complained
suppressed
cancelled
```

Failure classification:

1. retryable provider failure
2. permanent provider failure
3. invalid recipient
4. suppressed recipient
5. missing template
6. invalid template props
7. render failure
8. provider configuration failure

Development and test should fail fast on missing templates and invalid props. Production should fail the delivery record explicitly and surface it through admin diagnostics, not silently send fallback content.

## Template Coverage Checks

Add a checker that proves:

1. every module-declared template ID has a registered renderer
2. every renderer emits HTML and text
3. every renderer has fixture props
4. every renderer validates props
5. platform overrides do not remove required templates
6. no runtime underscore ID exists when dotted ID is canonical
7. no core module imports email HTML components
8. no app-local fallback sends empty production email
9. every rendered template uses known email typography roles
10. every rendered template uses known email media roles for images
11. every image has alt text
12. every layout renders at mobile and desktop preview widths
13. long-copy fixtures do not overflow buttons, headings, panels, or key-value rows
14. image-blocked previews preserve the message meaning

Candidate command:

```txt
pnpm mail:templates:check
```

Or as part of an existing reference/check family after the command workflow is finalized.

## Preview And Gallery

The email design package should expose preview tooling for:

1. all default template packs
2. platform-specific brand overrides
3. mobile and desktop email widths
4. dark-mode previews where supported
5. text-only output
6. missing-token diagnostics
7. provider-safe HTML validation
8. image-blocked rendering
9. logo and hero media variants
10. compact and comfortable density variants
11. legal, unsubscribe, workspace, and minimal footer variants
12. security, billing, warning, success, critical, product, and neutral tone variants
13. long subject/copy fixtures that prove text does not break the layout
14. client-safe max-width and stacked mobile behavior

The gallery is a product-quality review surface, not runtime delivery.

## Migration Plan

### Phase 0: Decision And SSOT Freeze

Checklist:

- [ ] promote the accepted ownership split to a decision doc
- [ ] update architecture/SSOT docs with communication-stack ownership
- [ ] classify current notify-owned email delivery as transitional
- [ ] define canonical template ID grammar
- [ ] define the first token placement plan
- [ ] define command checks required for template coverage

### Phase 1: Email Design Package Base

Checklist:

- [ ] create the shared email design package
- [ ] add base email components
- [ ] add email shell, stack, section, columns, panel, heading, text, image, and button primitives
- [ ] add transactional, security, billing, workspace, marketing, and digest layouts
- [ ] add product-update layout
- [ ] add email typography roles
- [ ] add email-specific type scale
- [ ] add email spacing, color-role, radius, and media-role theme helpers
- [ ] add responsive layout variants
- [ ] add media roles for logo, hero, thumbnail, avatar, icon, receipt, and product screenshot
- [ ] add required alt-text validation for media
- [ ] add template registry helpers
- [ ] add HTML renderer
- [ ] add plain-text renderer
- [ ] add inline-style handling
- [ ] add fixture support
- [ ] add preview/gallery support
- [ ] add image-blocked and text-only preview states
- [ ] add compact and comfortable density previews
- [ ] add tone variants for security, billing, success, warning, critical, product, and neutral emails
- [ ] add default auth template pack
- [ ] add default billing template pack
- [ ] add default workspace template pack

### Phase 2: Mail Module Foundation

Checklist:

- [ ] create `@unisane/mail`
- [ ] define `MAIL_PORT`
- [ ] define provider and template registry ports
- [ ] author `src/module.ts` and emit the installed `./compiler` descriptor through the canonical compiler
- [ ] add send transactional service
- [ ] add mail repository shape
- [ ] add delivery lifecycle model
- [ ] add idempotency handling
- [ ] add mail lifecycle events
- [ ] add admin inspection contracts
- [ ] add README and package docs

### Phase 3: Provider Adapter Boundary

Checklist:

- [ ] move SES delivery behind the canonical mail provider adapter
- [ ] keep dev-null or local provider for development
- [ ] define provider message ID mapping
- [ ] define provider error classification
- [ ] define bounce and complaint webhook contract shape
- [ ] keep provider SDK usage out of module runtime

### Phase 4: Current Runtime Migration

Checklist:

- [ ] migrate auth email sends to `MAIL_PORT`
- [ ] migrate billing email sends to `MAIL_PORT`
- [ ] migrate workspace invite emails to `MAIL_PORT`
- [ ] make notify delegate email channel fanout to `MAIL_PORT`
- [ ] remove notify-owned email delivery as a canonical runtime path
- [ ] map current underscore template IDs to dotted IDs through an explicit migration path if needed
- [ ] eliminate generic empty fallback templates from True Resume

### Phase 5: True Resume Adoption

Checklist:

- [ ] create True Resume email brand definition
- [ ] create True Resume email registry composition
- [ ] register default auth pack
- [ ] register default billing pack
- [ ] add True Resume product templates
- [ ] override selected copy or layout slots only where product-specific
- [ ] prove all current True Resume template IDs render HTML and text
- [ ] keep SES selection in starter/app adapter config

### Phase 6: Hardening

Checklist:

- [ ] add suppression handling
- [ ] add unsubscribe category handling
- [ ] add bounce ingestion
- [ ] add complaint ingestion
- [ ] add retry policy
- [ ] add delivery admin diagnostics
- [ ] add template coverage gate
- [ ] add render snapshot tests where useful
- [ ] add lifecycle event tests
- [ ] add docs and reference checks

### Phase 7: Marketing Foundation Later

Checklist:

- [ ] create marketing plan or decision only after transactional mail is stable
- [ ] define audiences and segments
- [ ] define campaign sends
- [ ] define consent and list subscriptions
- [ ] define campaign analytics
- [ ] reuse `@unisane/mail` for delivery
- [ ] reuse the email design package for campaign templates

## Enterprise Acceptance Checklist

The transactional mail stack is not done until:

- [ ] every declared template has HTML output
- [ ] every declared template has text output
- [ ] every template has fixture props
- [ ] every template uses email-safe typography roles instead of arbitrary raw font sizes
- [ ] every template uses email layout primitives instead of ad hoc raw layout tables
- [ ] every template renders correctly at mobile and desktop email widths
- [ ] every image has alt text
- [ ] logo, hero, thumbnail, avatar, icon, receipt, and product-screenshot media roles have defined size and fallback rules
- [ ] image-blocked previews remain understandable
- [ ] layout variants cover transactional, security, billing, workspace, marketing, digest, and product-update needs
- [ ] tone variants cover neutral, security, success, warning, critical, billing, and product use cases
- [ ] density variants cover compact and comfortable templates
- [ ] footer variants cover minimal, legal, unsubscribe, and workspace contexts
- [ ] template preview proves long copy does not break buttons, headings, panels, or mobile layout
- [ ] web UI components are not imported directly into email templates
- [ ] missing templates fail checks before production
- [ ] invalid props fail before provider delivery
- [ ] every send has an idempotency key
- [ ] every delivery has queryable status
- [ ] provider message IDs are stored
- [ ] provider errors are classified
- [ ] retries are bounded and observable
- [ ] bounces suppress future sends where appropriate
- [ ] complaints suppress future sends where appropriate
- [ ] unsubscribe works by category or list
- [ ] security emails cannot be globally unsubscribed by marketing preference
- [ ] marketing email cannot bypass consent when marketing exists
- [ ] notify can fan out to email without owning mail delivery
- [ ] business modules do not import email HTML components
- [ ] provider SDKs remain outside module runtime
- [ ] platform apps own brand and overrides, not provider delivery internals
- [ ] template gallery shows platform-branded output
- [ ] docs explain owner boundaries and migration path

## Estimated Delivery

### Correct Foundation

Estimate: 5 to 8 focused working days.

Includes:

1. decision and SSOT updates
2. `@unisane/mail` skeleton
3. canonical mail ports
4. template registry port
5. initial email design package shape
6. notify-to-mail delegation seam
7. True Resume template coverage correction
8. basic checks and docs

### Enterprise Transactional V1

Estimate: 10 to 15 focused working days.

Includes:

1. full mail lifecycle
2. outbox/delivery status
3. idempotency
4. retries
5. suppressions
6. unsubscribe categories
7. SES adapter cleanup
8. dev provider
9. provider webhook shape
10. reusable template packs
11. preview/gallery
12. auth/billing/workspaces migration
13. True Resume brand registry
14. coverage checks

### Full Communication Platform

Estimate: 4 to 6+ weeks.

Includes:

1. marketing module
2. campaigns
3. audiences
4. segments
5. consent
6. scheduled and bulk sends
7. analytics
8. experiments
9. admin/product UI surfaces

Recommended sequencing: implement Enterprise Transactional V1 first, then marketing.

## Risks And Guardrails

Risks:

1. creating two mail paths during migration
2. leaving notify as a hidden email delivery owner
3. letting core modules import email presentation code
4. building marketing too early
5. accepting missing-template fallbacks in production
6. duplicating template IDs between docs, modules, and apps

Guardrails:

1. one canonical template ID grammar
2. one mail runtime owner
3. one reusable email design package
4. provider adapters only in starter wiring
5. coverage checks before production
6. explicit migration from notify-owned delivery to mail-owned delivery

## Open Questions

These must be answered before implementation:

1. Should the email design package name be `@unisane/email`, `@unisane-ui/email`, or another scoped name?
2. Which mail tokens belong in `@unisane/ports` versus `@unisane/kernel`?
3. Does `@unisane/mail` use the existing outbox package directly or own a mail-specific delivery table that references outbox records?
4. What is the exact compatibility policy for current underscore template IDs?
5. Which provider adapter should be the first canonical implementation: SES only, or SES plus a dev/local provider?
6. Which admin inspection endpoints are required for V1?
7. Should template preview live in `unisane-ui` docs, devtools, or both?

## Recommended Next Step

Discuss and freeze the ownership split first.

If accepted, create a decision doc for:

```txt
business modules declare mail intent
@unisane/mail owns transactional mail runtime
email design package owns HTML/text templates
@unisane/notify delegates email channel delivery to mail
marketing stays separate until later
```

Only after that should bounded implementation Tasks be opened.
