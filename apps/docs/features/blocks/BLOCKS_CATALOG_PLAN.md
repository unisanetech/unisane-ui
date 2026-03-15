# Blocks Catalog Plan

This document defines the implementation plan for evolving the current `/docs/blocks` surface into a real block library and gallery.

It is a package-local product and implementation plan for the docs app. It is not a repo-wide architecture SSOT.

## Objective

Turn `Blocks` into a first-class discovery surface for reusable UI blocks that sit between:

- low-level `Components`
- future page-level `Templates`

The target experience is closer to a block gallery or builder library than a simple examples page:

- browse by real use case
- preview visually first
- understand where a block fits
- copy and adapt it quickly
- keep the IA stable when free/pro access is introduced later

## Current State

The current blocks surface already has a good foundation:

- a block registry
- a catalog page
- detail pages
- live previews
- example code

Current limitations:

- category model is too narrow
- discovery metadata is too thin
- gallery IA is too simple
- all blocks are treated as one flat class of content
- there is no future-ready access model in the data

## Product Direction

`Blocks` should become a reusable patterns library for:

- SaaS surfaces
- commerce surfaces
- application layouts
- forms
- auth flows
- hero sections
- headers
- footers
- feature grids
- dashboard sections
- navigation shells
- content sections
- supporting panes

Near term:

- all blocks are free
- no pro advertisement
- no locked states in the UI

Later:

- some blocks can move to pro access
- the catalog and data model should already support that without an IA rewrite

## Content Model

The blocks surface should eventually support three content layers:

1. Components

- low-level reusable UI pieces

2. Blocks

- compositional sections or app regions
- reusable, but not full pages

3. Templates

- larger page or flow compositions
- not part of this scope yet

Rule:

- if it is mostly a single component API example, it belongs in `Components`
- if it is a reusable page region or app section, it belongs in `Blocks`
- if it is a full multi-section page, it should eventually become a `Template`

## Information Architecture

The blocks catalog should not remain a flat list of examples.

Recommended IA:

1. Page hero

- title
- short value proposition
- search
- lightweight filter controls

2. Featured strip

- strongest blocks only
- curated, not algorithmic

3. Grouped catalog sections

- broader groups first
- categories nested within groups

4. Detail pages

- richer preview
- usage guidance
- components used
- related blocks

## Group Model

Use broad segments at the top level so the page stays manageable as the library grows.

Recommended segments:

- `marketing`
- `commerce`
- `application`
- navigation

### Marketing group

Use for site and landing content:

- hero
- headers
- footers
- grids
- pricing
- cta
- social-proof
- content

### Commerce group

Use for store and conversion-oriented flows:

- catalog
- product
- cart
- checkout
- account
- order-management
- pricing
- promotional sections

### Application group

Use for generic product building blocks that are not strongly vertical:

- layouts
- supporting panes
- review queues
- workspaces
- admin
- data-display

## Category Model

Current categories:

- `layout`
- `auth`
- `workflow`

That is too small for the planned library.

Recommended v1 category set:

- `layout`
- `navigation`
- `dashboard`
- `workflow`
- `forms`
- `auth`
- `hero`
- `header`
- `footer`
- `grids`

Recommended future additions:

- `pricing`
- `cta`
- `content`
- `social-proof`
- `catalog`
- `product`
- `cart`
- `checkout`
- `account`

Rule:

- category is the primary home for a block
- tags handle cross-cutting discoverability

Do not overload categories with every possible use case.

## Tag Model

Tags should be a second discovery layer, not a replacement for categories.

Example tags:

- `landing-page`
- `dashboard`
- `admin`
- `commerce`
- `application`
- `mobile`
- `desktop`
- `with-sidebar`
- `multi-step`
- `table-heavy`
- `onboarding`
- `settings`
- `marketing`
- `bento`

Rule:

- category answers "what kind of block is this?"
- tags answer "where can I use this?"

## Taxonomy Governance

The taxonomy needs one canonical operational source, not just TypeScript unions.

Recommended ownership:

- `types.ts`
  - schema-level unions and interfaces
- `block-taxonomy.ts`
  - display labels
  - descriptions
  - icons
  - sort order
  - filter presentation metadata

Rule:

- groups, categories, and tags should not be redefined ad hoc in page components
- filter chips, labels, and section headings should consume the same taxonomy source

Tag governance rules:

- keep a canonical tag list
- do not create near-duplicate tags
- keep different tag meanings distinct

Suggested tag families:

- vertical
  - `commerce`
  - `marketing`
  - `application`
- context
  - `dashboard`
  - `settings`
  - `onboarding`
  - `catalog`
- behavior
  - `multi-step`
  - `with-sidebar`
  - `responsive`
- style
  - `bento`

Rule:

- `bento` stays a style tag, not a top-level category

## Metadata Model

The current block metadata is too thin for a real gallery.

Current fields:

- `slug`
- `title`
- `description`
- `category`
- `icon`

Recommended expanded model:

```ts
type DocsBlockSegment = 'marketing' | 'commerce' | 'application';

type DocsBlockCategory =
  | 'hero'
  | 'header'
  | 'footer'
  | 'grids'
  | 'pricing'
  | 'cta'
  | 'social-proof'
  | 'product'
  | 'catalog'
  | 'cart'
  | 'checkout'
  | 'account'
  | 'layout'
  | 'navigation'
  | 'dashboard'
  | 'workflow'
  | 'forms'
  | 'auth'
  | 'onboarding'
  | 'settings'
  | 'billing';

type DocsBlockComplexity = 'simple' | 'medium' | 'advanced';
type DocsBlockAccess = 'free' | 'pro';

interface DocsBlockMeta {
  slug: string;
  title: string;
  summary: string;
  description: string;
  primarySegment: DocsBlockSegment;
  primaryCategory: DocsBlockCategory;
  categories: DocsBlockCategory[];
  segments: DocsBlockSegment[];
  icon: string;
  tags: string[];
  useCases: string[];
  complexity: DocsBlockComplexity;
  viewportSupport: Array<'desktop' | 'tablet' | 'mobile'>;
  featured?: boolean;
  status?: 'stable' | 'beta';
  access: DocsBlockAccess;
}
```

Additional optional metadata if needed later:

- `new`
- `updatedAt`
- `copyReady`
- `themingReady`
- `related`

## Source Of Truth Model

The blocks system should not be owned by one giant registry object.

Use separate source-of-truth layers with clear ownership.

### 1. Block source

This is the actual React implementation for a block.

Current recommended location:

- `apps/docs/features/blocks/examples/**`

Rule:

- one block should have one canonical implementation
- do not keep separate preview-only and detail-only implementations unless the preview genuinely needs a different rendering strategy
- do not hand-maintain duplicate JSX for the same block in multiple places

### 2. Block metadata

This is the discovery and catalog SSOT.

Recommended location:

- `apps/docs/lib/docs/blocks/block-meta.ts`

This layer owns:

- slug
- title
- summary
- description
- group
- category
- tags
- use cases
- complexity
- viewport support
- featured
- status
- access
- related block ids

Rule:

- discovery data belongs in metadata, not inside implementation components

### 3. Block registry

This is the docs runtime wiring layer.

Recommended location:

- `apps/docs/lib/docs/blocks/block-registry.tsx`

This layer should map:

- block id or slug
- implementation component
- preview renderer
- optional detail-page helpers
- code-display source reference

Rule:

- the registry should consume metadata
- the registry should not become a second metadata database

### 4. Type definitions

This is the schema and contract SSOT.

Recommended location:

- `apps/docs/lib/docs/blocks/types.ts`

This layer defines:

- group union
- category union
- metadata interface
- registry item contract

Rule:

- change the schema here first
- then update metadata and registry to match

## Ownership Boundaries

Use this ownership split consistently:

- `types.ts`
  - canonical schema contract
- `block-meta.ts`
  - catalog and discovery SSOT
- `block-registry.tsx`
  - docs runtime wiring SSOT
- `features/blocks/examples/**`
  - canonical implementation source

This keeps:

- discovery concerns out of implementation files
- runtime wiring out of metadata
- visual source code out of hand-maintained snippet strings

## Code And Snippet Strategy

Code shown on block detail pages should come from the real source whenever possible.

Best practice:

- derive code snippets from the actual block implementation source
- avoid keeping one JSX example for rendering and a second handwritten JSX example for display

Allowed exception:

- if a displayed snippet must be simplified for teaching clarity, keep that exception explicit and limited

Rule:

- source code is the implementation SSOT
- docs snippets should follow source, not diverge from it

## Data Flow

The intended dependency direction should be:

1. `types.ts`
2. `block-meta.ts`
3. `block-registry.tsx`
4. catalog and detail pages

Separately:

1. `features/blocks/examples/**`
2. registry render mapping
3. preview/detail rendering and code extraction

Rule:

- metadata should not import page components
- page components should consume registry output

## Source And Preview Rules

The preview system must stay tightly coupled to the real block source.

Preferred rule:

- preview rendering should use the real block implementation directly

Allowed exception:

- use a thin preview wrapper only when:
  - content must be shortened
  - viewport must be constrained
  - interactive data must be mocked

Do not allow:

- one implementation for preview
- another unrelated implementation for detail pages
- a third handwritten version for displayed code

Rule:

- one real implementation
- zero or one thin preview wrapper
- code display should follow source ownership explicitly

If displayed code is simplified for teaching clarity:

- mark it as example source intentionally
- do not pretend it is the exact runtime implementation

## Free And Pro Readiness

The system should be future-ready for access control without changing the information architecture.

Do now:

- include `access: "free" | "pro"` in metadata
- default all current blocks to `free`

Do not do yet:

- create separate free and pro registries
- create `/docs/pro-blocks`
- add pro badges or upsell UI
- fork page structure around access tiers

Rule:

- one catalog
- one metadata model
- one routing model
- later access control should be data-driven, not route-driven

## Free And Pro Strategy

Do not advertise pro yet.

Do add `access` to the metadata now.

Why:

- avoids future route churn
- avoids future registry rewrites
- keeps filtering and entitlement logic data-driven

Current rule:

- all blocks start as `access: "free"`

Future rule:

- the same catalog can filter or gate pro blocks without changing URLs or taxonomy

Do not create:

- `/docs/pro-blocks`
- separate registries for free vs pro
- pro badges now

## File And Folder Strategy

Do not keep the entire system in one large registry file forever.

Recommended practical structure for now:

- `apps/docs/lib/docs/blocks/types.ts`
- `apps/docs/lib/docs/blocks/block-meta.ts`
- `apps/docs/lib/docs/blocks/block-registry.tsx`
- `apps/docs/features/blocks/examples/**`

Recommended block-level structure later when the library grows:

- `apps/docs/features/blocks/examples/<group>/<slug>/`
  - implementation file
  - optional preview-specific file
  - optional source-extraction helper if needed

Rule:

- only introduce per-block folders when the catalog size justifies the added structure
- until then, keep metadata centralized

## Quality Bar

Every block should meet a fixed quality bar before it enters the catalog.

Minimum bar:

- responsive across supported viewports
- dark mode verified
- theme-safe with current token system
- keyboard and focus behavior intact
- accessible enough for docs publication
- preview renders without layout breakage
- source is copyable and understandable
- no broken empty, loading, or dense states in the preview context

Recommended metadata flags for later:

- `themingReady`
- `copyReady`
- `a11yReviewed`
- `responsiveReviewed`

Rule:

- the catalog should not become a dumping ground for unfinished examples
- if a block does not meet the bar, keep it out of the registry until it does

## Quality Gates And Validation

As the catalog grows, add lightweight validation around the block data model.

Recommended checks:

1. every metadata entry must have a registry entry
2. every registry entry must resolve to existing metadata
3. every `related` block id must resolve
4. every slug must be unique
5. every block must have exactly one primary group and one primary category
6. every block must declare an access level
7. every preview and implementation import used by the registry must resolve

Rule:

- treat metadata and registry consistency as a first-class quality concern, not a best-effort docs concern

## Search And Discovery Rules

Search behavior should be predictable before the catalog grows.

Recommended search priority:

1. title
2. summary
3. category
4. group
5. tags
6. use cases

Rule:

- search should rank semantic identity above incidental tags
- tags should improve recall, not override the primary catalog structure

Featured behavior should also be explicit:

- featured blocks are curated manually
- featured should be limited to the strongest examples
- featured is not a proxy for newest or most complex

Rule:

- do not auto-promote blocks to featured based only on recency

## Package Boundary Guidance

Some blocks may later become package-owned assets instead of docs-only examples.

If that happens:

- docs should still own catalog metadata and discovery
- package code should own the implementation
- the registry should import the implementation from the package

Do not move discovery metadata into a package unless the package truly owns the catalog as well.

Rule:

- docs owns discovery
- package owns reusable implementation

## Ecosystem Alignment

The blocks system should stay compatible with the wider Unisane ecosystem, not just the current docs website.

That means the plan must remain compatible with future:

- auth flows
- billing and plan-aware access
- workspace and account surfaces
- admin surfaces
- starter extraction
- package-owned block implementations

### Product-area alignment

The highest-value block families for Unisane are not only marketing surfaces.

The catalog should stay ready for:

- auth
- billing
- settings
- onboarding
- workspace shells
- account areas
- admin and review surfaces
- dashboards
- data-heavy application regions

Rule:

- do not optimize the catalog only for hero, footer, and landing-page content
- keep SaaS and commerce surfaces as first-class content domains

### Entitlement alignment

Future pro access should be an entitlement concern, not an information-architecture concern.

Recommended future behavior:

- previews remain discoverable
- detail pages remain routable
- access checks gate higher-value actions later

Examples of later-gated actions:

- copy source
- download source
- starter import
- premium implementation variants

Rule:

- do not split the catalog into free and pro route trees
- do not duplicate metadata or registry structures for access tiers

### Starter and package portability

Some blocks may later graduate from docs-only examples into:

- starter assets
- package-level reusable examples
- paid distributions

The plan should support that without changing catalog ownership.

Rule:

- docs should continue owning discovery metadata
- implementation ownership can move to starters or packages when needed
- the registry should be able to import implementations from outside the docs feature folder without changing the catalog model

### Operational implication

When the catalog expands, the roadmap should prioritize blocks that matter to the Unisane ecosystem directly:

- SaaS
- commerce
- auth
- billing
- settings
- onboarding
- workspace/product shells

That will make the docs website more aligned with the actual platform direction instead of becoming a generic inspiration gallery.

## Block Versus Template Boundary

The catalog needs a strict boundary so blocks do not become a hidden templates library.

`Block` means:

- reusable section
- reusable app region
- reusable page slice
- can stand alone inside other pages

`Template` means:

- multi-section full page
- full flow composition
- large end-to-end page shell

Rule:

- if the artifact is mostly a complete page, it should not enter the blocks catalog
- templates should become a separate content layer later instead of stretching the meaning of blocks

## Catalog Page Design

The catalog page should behave more like a gallery and less like a plain grouped list.

Recommended structure:

### 1. Hero

Include:

- title
- short description
- search input
- category chips or group chips

Suggested copy direction:

- "Production-ready blocks for SaaS, commerce, marketing, and application surfaces."

### 2. Featured section

Show:

- 4 to 8 curated blocks
- strongest previews only

Use for:

- app shell
- auth split
- review queue
- hero split
- feature grids

### 3. Group sections

For each primary category:

- heading
- short one-line explanation
- "View all" link
- responsive card grid

### 4. Filters

Keep v1 minimal.

Recommended v1 filters:

- search
- segment
- category
- viewport support

Recommended later:

- complexity
- use case
- access

## Card Design

A block card should be preview-first.

Recommended card contents:

- preview stage
- title
- one-line summary
- category label
- 2 to 4 tags or use-case chips
- viewport support indicators

Avoid:

- too much body copy
- long component lists
- heavy metadata stacks

The preview should carry most of the value.

## Detail Page Design

The detail page should feel like a reusable pattern page, not just a code dump.

Recommended sections:

1. large preview
2. summary
3. best for
4. responsive behavior
5. components used
6. copyable code
7. related blocks

Optional later:

- variants
- implementation notes
- accessibility notes

## Routing Strategy

Recommended route shape:

- `/docs/blocks`
- `/docs/blocks/[segment]`
- `/docs/blocks/[segment]/[category]`
- `/docs/blocks/[slug]`

Use segments as the primary browse routes and segment/category pages as the canonical category routes.

Keep block detail pages stable at `/docs/blocks/[slug]`.

## Navigation Strategy

Blocks should remain a primary left-nav section separate from Components.

Inside the blocks page itself:

- use page-local grouping and filtering
- do not explode the global sidebar with every category immediately

Recommendation:

- keep top-level nav as `Blocks`
- add segment-level left-nav entries under `Blocks`
- nest category links under each segment entry

This keeps the browse IA close to Tailwind Plus while still allowing blocks to appear in multiple categories.

## Initial v1 Scope

Do not try to launch with all possible block types.

Recommended v1 categories:

- `hero`
- `header`
- `footer`
- `grids`
- `pricing`
- `cta`
- `social-proof`
- `product`
- `catalog`
- `cart`
- `checkout`
- `account`
- `layout`
- `navigation`
- `dashboard`
- `workflow`
- `forms`
- `auth`
- `onboarding`
- `settings`
- `billing`

Recommended initial block roadmap:

### SaaS

- app shell
- supporting pane
- review queue
- settings form
- analytics summary
- inbox workspace

### Auth

- auth centered
- auth split
- forgot password
- magic link

### Commerce

- product detail
- category grid
- cart summary
- checkout split
- account orders

### Marketing

- hero centered
- hero split
- site header
- site footer
- feature grids
- CTA band

## Implementation Plan

Build in this order:

### Phase 1: Data model

- expand `types.ts`
- expand `block-meta.ts`
- add `primaryCategory`, `categories`, and `segments`
- seed existing blocks with the new metadata

### Phase 2: Registry adoption

- update `block-registry.tsx`
- ensure all current blocks use the richer metadata
- keep previews and code examples working unchanged

### Phase 3: Catalog IA

- redesign `blocks-catalog.tsx`
- add category overview sections
- add category routes
- add basic search and filter controls

### Phase 4: Detail-page enrichment

- add richer metadata presentation
- add use-case cues
- add related blocks

### Phase 5: Content expansion

- add the v1 category set
- add the next wave of block examples

## Non-Goals

Not in this phase:

- pro upsell UI
- entitlements or gated downloads
- template-level full page library
- marketplace/vendor model
- user-generated block submissions

## Design Principles

Use these rules while implementing:

1. blocks are compositional, not atomic
2. previews should sell the block faster than text
3. categories should stay legible at scale
4. tags should support discovery, not replace taxonomy
5. access strategy should be data-ready now, not user-visible yet
6. do not rebuild routing just to expand metadata
7. do not tune the token system to make one showcase card look better
8. top-level discovery should prioritize SaaS and commerce because those are the current product focus areas

## Immediate Next Step

The next implementation step should be:

1. widen the block metadata model in:
   - `apps/docs/lib/docs/blocks/types.ts`
   - `apps/docs/lib/docs/blocks/block-meta.ts`
2. refactor the current block registry onto that richer model
3. only then redesign the catalog page
