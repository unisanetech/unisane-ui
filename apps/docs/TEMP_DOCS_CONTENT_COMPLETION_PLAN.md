# Temporary Docs Content Completion Plan

Status: Temporary execution doc  
Owner: Docs app refactor/completion work  
Removal rule: Delete this file in the same change that completes the foundations/patterns content system and wires all missing pages to the final SSOT.

## Purpose

This document tracks the remaining work needed to make the Unisane UI docs app complete without introducing a second ad hoc content system.

This is not a permanent architecture document. It is an execution plan for the remaining missing docs surfaces:

- foundations child pages
- patterns child pages
- data table placement/discoverability

## Current Gap

These child pages are linked from navigation but do not exist yet.

### Foundations

- `/docs/foundations/design-tokens`
- `/docs/foundations/typography`
- `/docs/foundations/colors`
- `/docs/foundations/spacing`
- `/docs/foundations/elevation`
- `/docs/foundations/motion`

### Patterns

- `/docs/patterns/layouts`
- `/docs/patterns/forms`
- `/docs/patterns/navigation`
- `/docs/patterns/data`

### Information Architecture Gap

- `/datatable` exists, but it is not integrated clearly into the main docs IA

## Decision

Do not implement these as ten unrelated hardcoded `page.tsx` files.

Instead:

- keep component docs under `lib/docs/registry/components/*.docs.tsx`
- add a second SSOT for non-component docs content
- render foundations and patterns through one shared static-doc page system

## Target Structure

```text
apps/docs
├── app
│   └── (app-shell)
│       └── docs
│           ├── foundations
│           │   ├── page.tsx
│           │   └── [slug]
│           │       └── page.tsx
│           └── patterns
│               ├── page.tsx
│               └── [slug]
│                   └── page.tsx
├── features
│   └── docs-page
│       └── components
│           ├── static-doc-page-layout.tsx
│           ├── static-doc-section.tsx
│           ├── static-doc-hero.tsx
│           ├── static-doc-callout.tsx
│           ├── token-grid-section.tsx
│           ├── pattern-grid-section.tsx
│           └── ...
└── lib
    └── docs
        ├── registry
        │   └── components
        └── content
            ├── foundations
            │   ├── colors.content.tsx
            │   ├── design-tokens.content.tsx
            │   ├── elevation.content.tsx
            │   ├── motion.content.tsx
            │   ├── spacing.content.tsx
            │   ├── typography.content.tsx
            │   ├── foundation-pages.ts
            │   ├── selectors.ts
            │   └── types.ts
            └── patterns
                ├── data.content.tsx
                ├── forms.content.tsx
                ├── layouts.content.tsx
                ├── navigation.content.tsx
                ├── pattern-pages.ts
                ├── selectors.ts
                └── types.ts
```

## SSOT Rules

### Component docs

- Source of truth: `lib/docs/registry/components/*.docs.tsx`
- Used for:
  - `/docs/components`
  - `/docs/components/[slug]`
  - component navigation
  - component search
  - component counts and component-related homepage surfaces

### Foundations docs

- Source of truth: `lib/docs/content/foundations/*.content.tsx`
- Used for:
  - foundations child routes
  - foundations landing cards
  - foundations navigation children

### Pattern docs

- Source of truth: `lib/docs/content/patterns/*.content.tsx`
- Used for:
  - patterns child routes
  - patterns landing cards
  - patterns navigation children

### Shared rule

- Route files stay thin
- Titles, descriptions, icons, section content, and related links must not be duplicated across route files and landing pages

## Shared Content Model

Add a shared static-doc content shape for foundations and patterns.

Suggested top-level record shape:

- `slug`
- `title`
- `description`
- `icon`
- `hero`
- `sections`
- `related`
- optional `toc`

Suggested section families:

- `prose`
- `token-grid`
- `example-grid`
- `do-dont`
- `checklist`
- `callout`
- `code-block`
- `anatomy`

## Phases

### Phase 1: Static Doc Runtime

Goal:

- create the shared static-doc rendering system and content types

Checklist:

- [x] add shared static-doc content types
- [x] add shared selectors for static-doc pages
- [x] add shared rendering components in `features/docs-page/components`
- [x] keep route files thin

Done when:

- one shared static-doc renderer exists
- foundations and patterns can both consume it

### Phase 2: Foundations SSOT

Goal:

- implement all foundations pages from a single content system

Checklist:

- [x] add `design-tokens.content.tsx`
- [x] add `colors.content.tsx`
- [x] add `typography.content.tsx`
- [x] add `spacing.content.tsx`
- [x] add `elevation.content.tsx`
- [x] add `motion.content.tsx`
- [x] add foundations selectors and aggregation file
- [x] add `[slug]/page.tsx` under foundations
- [x] wire foundations landing page to derive from SSOT

Done when:

- all six foundations child routes exist
- landing cards derive from foundations content records

### Phase 3: Patterns SSOT

Goal:

- implement all patterns pages from a single content system

Checklist:

- [x] add `layouts.content.tsx`
- [x] add `forms.content.tsx`
- [x] add `navigation.content.tsx`
- [x] add `data.content.tsx`
- [x] add patterns selectors and aggregation file
- [x] add `[slug]/page.tsx` under patterns
- [x] wire patterns landing page to derive from SSOT

Done when:

- all four patterns child routes exist
- landing cards derive from pattern content records

### Phase 4: Navigation and IA Completion

Goal:

- remove IA drift and make the remaining docs surfaces discoverable

Checklist:

- [x] derive foundations nav children from content selectors
- [x] derive patterns nav children from content selectors
- [x] decide `datatable` placement
- [x] either move or link `datatable` in the main docs IA

Done when:

- no nav item points to a missing route
- `datatable` has an intentional place in the docs hierarchy

### Phase 5: Cleanup

Goal:

- finalize and remove temporary planning artifacts

Checklist:

- [x] verify route coverage
- [x] verify navigation coverage
- [x] verify docs page consistency
- [ ] remove this temporary doc

Done when:

- this file is deleted
- the final structure is reflected in durable docs if needed

## Validation Checklist

Run after each implementation phase:

- [x] `pnpm --dir /Users/bhaskarbarma/Desktop/TOP/Unisane/unisane-ui --filter @unisane/web check-types`
- [ ] navigate all new child routes manually
- [ ] confirm no linked route returns 404
- [ ] confirm landing pages derive from SSOT, not duplicated arrays

## Final Done Criteria

The docs app is complete when all of the following are true:

- all linked foundations child pages exist
- all linked patterns child pages exist
- foundations and patterns content are both SSOT-backed
- route files are thin
- navigation does not hardcode stale child lists where selectors should be used
- `datatable` has a clear place in the docs IA
- this temporary file is deleted
