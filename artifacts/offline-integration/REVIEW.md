# Branding, disclosure and offline integration review

## Delivered

- Single self-contained audience file: [`dist/demo.html`](../../dist/demo.html).
- [PowerPoint launch instructions and limitations](../../POWERPOINT_INTEGRATION.md).
- [Actual offline opening at 1920×1080](opening-offline-1920x1080.png).
- [Offline evidence view](evidence-offline.png) and [final screen](final-offline.png).

All product branding is removed from rendered audience views, headers, evidence text, exported JSON and download filenames. The opening supervisory question is unchanged and remains the first reveal. No presentation-title screen was added. A generic browser-tab label identifies the document, and the only general disclosure appears on the opening screen. One repeated generic first-wave disclaimer was replaced by its causal description; the underlying illustrative-metric qualification remains in the drawer. Source attribution and material financial/governance qualifications are retained.

The approximately 240 KB HTML includes twelve isolated application modules and all styles. It runs directly from a `file://` URL without the development server. No new framework, backend, external AI call or network dependency was introduced. The restricted local-module bundler rejects unsupported or external imports rather than silently producing a partial build.

## Verification

- [Baseline unit suite](baseline/tests.txt); [final suite](test-results.txt).
- [Offline all-beat browser traversal](browser-results.json): 51 states reached; 44 evidence views checked; no audience branding, repeated opening disclosure, HTTP requests or browser errors. The application remains 16:9.
- [Offline normal-motion controls](motion-results.json): Pause freezes animations, Play resumes, Replay restarts, Home resets, fullscreen enters/exits, no automatic narrative progression.
- Actual offline downloads: [source-review-evidence.json](source-review-evidence.json), [nav-five-day-audit.json](nav-five-day-audit.json). Filenames and displayed run IDs are neutral; exported NAV matches the public projection exactly. Original internal records and all numerical calculations remain unchanged, including Friday NAV 102.0322570256384 and Tuesday triage priority 35.
- Preservation tests compare every approved rendered reveal after only the authorised branding/caption normalisation. Scenario modules, including the accepted finale, are unchanged from the start of this integration task.
- Reproducible [offline browser script](offline-review.js) and [motion script](motion-review.js).

## PowerPoint boundary

The validated delivery opens in a normal browser. It is not a native executable HTML object in a PowerPoint slide. A desktop PowerPoint hyperlink to the local file is the documented handoff; the actual deck, target Office/browser configuration, security prompts, remote-control focus and venue machine still require rehearsal. External primary-source links need connectivity; embedded evidence text remains offline. No `.pptx` or add-in was supplied, changed or claimed as tested.

This work preserves the previously implemented final finale, its seven reveals and five compositions. The subsequent user instruction authorises committing, merging and pushing the completed changes after verification; earlier no-commit statements remain historical review checkpoints.
