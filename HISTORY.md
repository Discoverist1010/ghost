# Historical material and maintenance index

Updated 13 November 2026. The current accepted implementation is `bf34d11`; both `main` and `feature/ghost-v3` were verified at that revision during housekeeping. The executive producer confirmed submission of the final HTML. This is documentation maintenance, not a new delivery or narrative revision.

## How to read the repository

[README](README.md) and the current sections of numbered documents describe the accepted 51-state, eight-beat show. Each refreshed document retains its earlier text verbatim in a collapsed historical section. Words such as “current”, old reveal counts and review instructions inside those sections describe the document's original point in time.

| Material | Status and purpose |
| --- | --- |
| [Package1 review](PACKAGE1_REVIEW.md) | Historical settlement/initial presentation review |
| [Package2 review](PACKAGE2_REVIEW.md) | Historical NAV package review, superseded by later approved NAV revisions |
| [Package3 review](PACKAGE3_REVIEW.md) | Historical systemic/finale package review, superseded by the final finale |
| `artifacts/` | Dated browser screenshots, audit outputs, test fixtures and review evidence; preserve original files |
| `artifacts/final-finale/` | Final-finale local review evidence |
| `artifacts/offline-integration/` | Offline delivery and integration review evidence |
| [Legacy demo folder](demo/README.md) | Earlier HTML retained as history; not the submitted delivery |
| [Public sources](PUBLIC_SOURCES.md) | Detailed research provenance and qualifications; unchanged by this refresh |
| `papers/ghost-in-the-harness/` | Supporting argument and research history, not a competing current UI specification |
| [PowerPoint integration notes](POWERPOINT_INTEGRATION.md) | Existing delivery guidance, left unchanged |

## Preserve history rather than rewriting it

Old test totals, state counts, branch snapshots and “no commit or push performed” statements in review reports are review-time facts. They are not claims about today's Git status. Later removals and refinements do not erase the original review evidence.

In particular, retain `artifacts/offline-integration/baseline/contracts.json` and `artifacts/nav-correction/baseline-nav-audit.json`; automated tests reference them. Do not delete old auditJSON or screenshots solely because a stage was later removed. Do not relabel historical screenshots as current acceptance evidence.

The current runtime gate still exists despite removal of its standalone stage. Source-conflict evidence remains despite removal of its stage. The old baseline-error NAV scene, standalone funding/transmission scenes and earlier multi-ending finale are historical, not restoration tasks.

No app source, HTML, CSS, calculations, source ledger, historical artifact or submitted bundle was modified in this housekeeping pass. No licence, tag, release, new CI workflow or delivery task is introduced.
