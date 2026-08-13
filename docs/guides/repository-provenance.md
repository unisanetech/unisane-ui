---
id: 'G-ui-repository-provenance'
owner: 'ui-maintainers'
scope: workspace
role: guide
lifecycle: active
authority: canonical
provenance: accepted
view: current
---

# Repository provenance and source authority

The standalone public source authority for Unisane UI is
`https://github.com/unisanetech/unisane-ui`. The canonical branch is `main`. Normal
development, review, and CI now operate from this repository; the former umbrella is
historical source provenance, not a writable authority or fallback checkout.

The repository was extracted from the umbrella with its UI-owned history preserved. The
extraction-time receipt remains in `docs/repository-provenance.json`, the complete
old-to-new commit map is `docs/repository-history-map.txt`, and the audited filter is
`scripts/repository-migration/filter-repo.args`. The generated shadow audit records the
conditions observed at extraction time and must not be interpreted as current authority.

Source authority does not itself publish packages. npm publication is a separate,
manually initiated, provenance-enabled transaction governed by
`docs/guides/licensing-prerequisites.md` and the release approval record.
