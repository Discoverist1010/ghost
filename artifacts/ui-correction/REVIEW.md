> Historical review record: the local-only status below describes the review checkpoint. The user subsequently instructed Codex to commit and push this work.

# Surgical UI correction — local creative review

This report supersedes the earlier opening/control screenshots. Branch: `feature/ghost-v3`. No commit or push.

## Cause and correction

The previous `.app-shell` independently used `width: 100%` and `height: 100svh`; it had no 16:9 containment or centering policy. Its stage and several controls were anchored to that full viewport. Earlier automation also left a forced viewport in a visible browser window. No grey background is defined by Ghost itself; unused browser rendering area must not be mistaken for intended letterboxing.

The page now centers an aspect-ratio container whose width is the smaller of the available viewport width and the width fitting its available height. The browser viewport is never fixed by application code. Letterbox areas use a near-black background. Stage-relative CSS units and container breakpoints keep sizing tied to the composition, including in differently shaped windows. The live review window uses native browser sizing (`viewport: null`), with no device-metrics override. The supplied review screenshots are from Chrome’s headless native-window renderer. A native desktop capture service was unavailable; the headed high-DPI capture was inconsistent and is retained only as a diagnostic, not visual acceptance evidence.

## Opening and controls

The opening now reads exactly **WHEN AI STARTS ACTING, / WHO IS THE SUPERVISOR?**, with the second line dominant in cyan. Its branding, quiet upper-right session title, question eyebrow, restrained separator and domain line follow the supplied reference. The oversized START button is removed. The retained answers-to-actions message is the next controlled reveal; the final Ghost question is absent from the opening.

One outlined bar contains **Back | Pause | Play | Replay | Beat 1/8 | Next**. Play starts from the opening, then resumes paused motion. Pause freezes motion. Unavailable actions are disabled. Replay redraws the active reveal deterministically. Generic duplicated animation/reset controls were removed from the stage; named narrative decisions such as CHECK SOURCE remain. Keyboard navigation, F fullscreen, Home reset and evidence-drawer reset remain.

The requested short opening copy differs from the longer text pictured in the visual reference by instruction. Pause is disabled on the static opening by instruction. No other material difference identified.

## Actual local captures

| Required check | Image |
| --- | --- |
| 1920×1080 fullscreen | [Opening fullscreen](opening-fullscreen.png) |
| Different-aspect normal window | [1440×1000 window](opening-windowed.png) |
| Horizontal letterboxing | [2000×900 window](opening-windowed-wide.png) |
| First reveal after the question | [Answers to actions, fullscreen](first-reveal-fullscreen.png) · [windowed](first-reveal-windowed.png) |
| Existing Package 1 scene | [Settlement and workstreams](settlement-fullscreen.png) |
| Animation-control verification | [Flood paused](flood-paused.png) |

URL: **http://127.0.0.1:4173/**

## Verification

- `npm test`: **31 passed, 0 failed**. [Log](tests.txt).
- Fullscreen: Chrome native window state and document Fullscreen API both active; inner/outer/screen 1920×1080, viewport emulation disabled. Stage bounds: x=0, y=0, 1920×1080. Checked using Chrome's headless native-window implementation on a configured 1920×1080 screen; this is browser verification, not physical projector acceptance.
- Windowed 1440×1000: stage 1440×810, equal 95px bands above and below.
- Windowed 2000×900: stage 1600×900, equal 200px bands left and right.
- Opening, first reveal and settlement screenshot checks: no out-of-frame text or controls; no document scrollbars.
- Opening Play/Next, Back, Pause/Play (CSS animation and actual trace counter), Replay to the same 486 events, unavailable-control disabling, Home reset and F enter/exit: passed. No page errors in the interaction run.
- `src/scenario.mjs` is byte-for-byte unchanged from the start of this correction. The source/evidence drawer implementation, regulatory details and gate details are also unchanged. No financial, risk, authority or source-challenge logic was modified.
- `git diff --check`: passed. No framework, animation library or other Package 1 feature added.

[Interaction evidence](VERIFICATION.md) · [Final screenshot measurements](SCREENSHOT_METRICS.md) · [Native live-window measurements](LIVE_WINDOW.md).

Changes remain local and uncommitted for creative and executive review.
