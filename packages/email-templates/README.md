# @unisane/email-templates

Shared HTML and plain-text email template rendering for Unisane platforms and starters.
This is an independent companion package, not part of the React component registry.

This package owns reusable transactional email layout primitives, brand inputs, template names, HTML output, and text output. Platforms pass brand and runtime URLs as data; they do not fork template HTML for ordinary auth, workspace, billing, welcome, and generic notification emails.

## Scope

- reusable responsive table-based email layouts
- typed template names and render input
- brand-aware HTML and text rendering
- provider-neutral output for SES, Resend, and future mail adapters

This package does not send mail and does not own notification business rules.
