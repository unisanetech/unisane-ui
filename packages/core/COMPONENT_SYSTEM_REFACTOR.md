# Unisane Component System Refactor Record

The component-system refactor is complete.

Canonical docs now live in:

- `DESIGN_SYSTEM.md`
- `COMPONENT_AUTHORING.md`
- `IMPLEMENTATION_CHECKLIST.md`

## Final Outcome

- The UI system is now explicitly Unisane-owned: Material-inspired where semantics help, source-first and props-first where authoring clarity matters.
- Component APIs were normalized around shared naming families such as `open/defaultOpen/onOpenChange`, `value/defaultValue/onValueChange`, and native input `onChange` where appropriate.
- Root shell and surface semantics were clarified around `bg-surface` for the page canvas and `surface-container-*` for nested depth.
- Shared field sizing, motion utilities, overlay contracts, navigation boundaries, and accessibility behavior were aligned across the exported component families.
- Docs, registry outputs, and direct consumers were updated in the same refactor wave.

## Historical Audit Summary

- Every exported core component family in the original checklist was reviewed against the props-first, token-first contract.
- The main drift areas resolved during the refactor were action sizing, field sizing, overlay state contracts, navigation duplication, tooltip accessibility, toast host registration, and motion utility parity.
- New component work should follow the permanent contracts in the canonical docs above instead of using this record as a working plan.

- every exported component family above has been reviewed
- duplicated patterns are either merged or explicitly justified
- theming axes are applied globally, not reinvented locally
- sizing is predictable across related families
- docs and examples match the actual runtime API

## Active Follow-Up

The refactor record above is historical. Ongoing implementation follow-up now lives in:

- `IMPLEMENTATION_CHECKLIST.md`
