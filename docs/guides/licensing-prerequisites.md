---
id: 'G-ui-licensing-prerequisites'
owner: 'ui-maintainers'
scope: workspace
role: guide
lifecycle: active
authority: canonical
provenance: accepted
view: current
---

# Licensing and public-release prerequisites

This local migration shadow is not licensed for public distribution. The root workspace
and every intended public package remain `private: true` and `UNLICENSED` until an
authorized legal owner completes all of the following:

- approve the legal entity and exact license text
- install the approved root `LICENSE` and `NOTICE`
- generate and review third-party notices
- approve employee, contractor, and external-contributor terms
- record redistribution rights for fonts, icons, screenshots, examples, fixtures,
  generated registries, visual baselines, and other distributed assets
- approve package contents, provenance, SBOM, registry ownership, and trusted publishing
- record the approval in `docs/release-approval.json`

`pnpm check:release-policy` proves that the current shadow remains safely blocked.
`pnpm check:release-readiness` intentionally fails until every prerequisite is present.
Neither command publishes anything.
