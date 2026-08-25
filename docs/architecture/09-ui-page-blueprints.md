---
id: 'DOC-4e82c2e7353f'
owner: 'unisane'
repository: unisane-ui
scope: workspace
role: architecture
lifecycle: durable
authority: canonical
provenance: accepted
view: current
---

# UI Page Blueprints (Canonical Companion)

> Purpose: define the reusable page-family blueprints that product apps should apply before inventing one-off page structures.
>
> Precedence: if a blueprint conflicts with `docs/architecture/08-ui-application-architecture.md`, follow `08-ui-application-architecture.md` and update this file in the same change.

## Changelog

- `2026-04-09`: Added the canonical page-family blueprint library for auth, management, details, settings, flow, dashboard, feedback, picker, upload/import, and activity/audit pages.

## 1. How To Use This File

Every non-trivial page should:

1. choose one primary family
2. use the matching blueprint as the structural baseline
3. compose business sections through screens and features instead of inventing a new page grammar by default

Mixed pages may combine more than one family, but one family must remain dominant.

## 2. Blueprint Library

### 2.1 Auth Page

Use when:

1. the user is signing in, recovering access, verifying identity, or completing a narrow auth step

Required regions:

1. clear page title and supporting message
2. one primary credential/action region
3. alternate auth or recovery actions separated from the primary flow
4. legal or security notices only when relevant

State contract:

1. inline field errors
2. submit loading state
3. auth failure message
4. recovery path visibility

Responsive notes:

1. single-column by default
2. side content collapses below the main task

### 2.2 Management Page

Use when:

1. the user manages a collection, table, queue, list, or admin surface

Required regions:

1. page header with primary action
2. filters/search/sort controls
3. table or list region
4. row actions and optional bulk-action zone
5. optional side detail or inspector

State contract:

1. loading
2. empty
3. filtered empty
4. error
5. selection reset rules after bulk actions

URL/state notes:

1. filters, sort, page, and visible view should be URL-owned when shareable

Responsive notes:

1. secondary actions move into overflow
2. dense side detail collapses into drawer or stacked detail

### 2.3 Details Page

Use when:

1. the user inspects one entity and its related sections

Required regions:

1. summary block or hero region
2. primary actions near the summary
3. detail sections grouped by meaning
4. optional activity, attachments, related entities, or timeline

State contract:

1. loading
2. not found
3. denied
4. error

Responsive notes:

1. summary and side content stack predictably
2. section order must still communicate importance on small screens

### 2.4 Settings Page

Use when:

1. the user edits account, workspace, org, or product settings

Required regions:

1. grouped settings sections
2. save/discard or autosave model
3. read-only or locked behavior when capability is limited
4. audit-sensitive treatment for destructive or policy-heavy edits

State contract:

1. dirty state
2. validation mapping
3. save success/failure behavior
4. cancel/discard behavior

Responsive notes:

1. long forms keep one obvious action zone
2. side navigation collapses without hiding section identity

### 2.5 Flow Page

Use when:

1. the user completes onboarding, checkout, setup, request, or another guided multi-step journey

Required regions:

1. progress indicator
2. focused step content region
3. persistent forward/back or continue/cancel actions
4. draft/resume semantics when the flow is recoverable

State contract:

1. step validation boundary
2. draft persistence rules
3. interruption/recovery behavior
4. completion and cleanup behavior

Responsive notes:

1. progress remains understandable without horizontal crowding
2. action footer stays stable and reachable

### 2.6 Dashboard Page

Use when:

1. the user needs summaries, metrics, alerts, recent activity, and quick actions

Required regions:

1. metric or summary cluster
2. alerts/notices region
3. activity or recent items region
4. quick actions or shortcuts

State contract:

1. loading placeholders must preserve layout expectations
2. empty-first-use guidance when no data exists yet

Responsive notes:

1. cards stack in priority order
2. metric density adjusts before information is hidden

### 2.7 Feedback Page

Use when:

1. the whole page primarily communicates a result or blocked condition

Examples:

1. denied
2. not found
3. first-run empty
4. success confirmation
5. fatal recoverable error

Required regions:

1. concise state message
2. one primary recovery or next-step action
3. optional secondary route out

### 2.8 Picker Page Or Panel

Use when:

1. the user needs to search, browse, and select one or more entities

Required regions:

1. search
2. optional filters
3. clear selection state
4. confirm/cancel actions when selection is staged

State contract:

1. async loading behavior
2. empty search results
3. keyboard support

### 2.9 Upload Or Import Page

Use when:

1. the user uploads files or imports structured data

Required regions:

1. file acquisition
2. validation and review
3. progress
4. error recovery
5. completion path

State contract:

1. pre-upload validation
2. in-progress state
3. retry behavior
4. post-processing/result feedback

### 2.10 Activity Or Audit Page

Use when:

1. the user reviews events, audits, system actions, or timeline history

Required regions:

1. event list
2. actor/context metadata
3. filters
4. pagination or load-more model
5. optional export

State contract:

1. loading
2. empty
3. filtered empty
4. error

## 3. Required Page Checklist

Before implementation, every non-trivial page must answer:

1. What route group and shell family own this page?
2. What primary pattern family does it use?
3. Which screen owns composition?
4. Which feature owns each business section?
5. Which platform data surfaces does it use?
6. Which support helpers does it need?
7. What are its loading, empty, filtered empty, error, denied, and not-found states?
8. What local, promoted client, and server state does it use?
9. Which actions require capability checks?
10. What is the responsive collapse strategy?
11. Does it need observability or audit semantics?
12. Does it need URL-owned state, drafts, or resumability?
