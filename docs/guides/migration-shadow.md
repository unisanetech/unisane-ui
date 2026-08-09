---
id: 'G-ui-local-migration-shadow'
owner: 'ui-maintainers'
scope: workspace
role: guide
lifecycle: active
authority: canonical
provenance: accepted
view: current
---

# Local migration shadow

This repository is a local, non-authoritative migration shadow extracted from the
Unisane umbrella. It proves preserved history, repository-local tooling, standalone
installation, package boundaries, and dependency direction. It does not establish a
GitHub remote, public visibility, package publication, deployment, or source cutover.

The umbrella `dev` branch remains the sole writable source authority. Ordinary feature
development must continue there until a separately approved authority-cutover Task
establishes protected remote governance and one writable target authority.

The immutable extraction receipt is `docs/repository-provenance.json`. The complete
old-to-new commit map is `docs/repository-history-map.txt`; the audited filter is
`scripts/repository-migration/filter-repo.args`. Repository-system materialization proof
is stored under `docs/reference/generated/`.

The superseded shadow from freeze `96f29c3f6` is retained only as local comparison
evidence outside this repository. It is not a source or fallback.
