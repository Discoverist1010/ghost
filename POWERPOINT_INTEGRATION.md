> Superseded delivery mode: the conference demo now opens directly as one local HTML file in a browser. It will not be embedded in or launched from PowerPoint. See [Standalone delivery](STANDALONE_DELIVERY.md). The earlier handoff instructions below are retained as historical documentation.

# Offline browser demonstration — PowerPoint handoff

The audience-ready file is **`dist/demo.html`**. It contains the styles, application code, deterministic scenarios, animations, presenter controls and evidence text. It has no runtime package, server, CDN, font-download or network dependency. The document uses a neutral browser-tab label; no presentation title is added to the stage. The deck supplies its own title, introduction and context.

## Launch from a desktop PowerPoint deck

1. Copy `demo.html` to the presentation computer, preferably beside the `.pptx` file.
2. In desktop PowerPoint, select the shape, text or picture that will launch the demonstration. Use **Insert → Link** and select the local `demo.html` file. On macOS, use **Web Page or File → Select** where offered. The selected file should open in the operating system's normal browser.
3. Rehearse the link in Slide Show on the actual presentation computer. Moving the deck or HTML may require updating the link; move the linked file with the deck.
4. When the browser opens, press **F** for the application's fullscreen mode and keep focus on that browser window while presenting. Return to PowerPoint using the operating system's window switcher. The browser retains its current reveal while left open; reopening/reloading the file resets to the opening question.

This is a **browser launch**, not native HTML execution inside a PowerPoint slide. No ActiveX control, add-in, webview or embedded-browser integration is installed or certified by this delivery. Microsoft documents hyperlinks to web pages and files, including the need to transfer linked files with a deck: [Add a hyperlink to a slide — Microsoft Support](https://support.microsoft.com/en-us/powerpoint/training/add-a-hyperlink-to-a-slide).

## What is verified and what remains environment-specific

- **Verified:** the single local file runs in desktop Chrome with networking disabled. All eight beats and 51 reveals, 44 evidence views, actual JSON downloads, 16:9 layout, Pause/Play/Replay, Back/Next, fullscreen and Home reset work. No HTTP requests or browser errors occur on the tested path.
- **Not verified:** the handoff from the user's actual `.pptx`, PowerPoint version, installed default browser, trust settings, presenter remote and venue display. No deck was supplied or modified. File links may prompt or be restricted by the presentation computer's Office/security settings; test the actual deck and machine rather than assuming embedded HTML support. PowerPoint for the web is not the offline local-file delivery path validated here.
- **External source links:** evidence descriptions, attribution and qualifications are embedded and available offline. Following links to full third-party publications requires network access or separately obtained offline copies; full external documents are not bundled.
- **Window focus:** the HTML presenter controls respond when the browser has focus. A PowerPoint remote or keyboard that keeps sending commands to PowerPoint will not drive the browser until focus is transferred.

## Presenter controls

Use the existing on-screen Back, Pause, Play, Replay and Next controls. Keyboard: Right/Space advances, Left goes back, P toggles pause/resume, R replays, E opens relevant evidence, F toggles fullscreen, Home deliberately resets. Source and policy checks retain their explicit clickable actions. The final screen holds indefinitely with Next disabled.

The stage remains 16:9 and letterboxes within differently shaped browser windows. The sole general audience disclosure appears on the opening screen: “Public-source research. All demonstration scenarios are synthetic and illustrative.” Detailed source and financial qualifications remain in the evidence drawers; material limitations such as conditional system stress remain part of the narrative.

## Build and maintain the deliverable

Run `npm run build` with Node.js 20 or newer, then `npm test`. No third-party dependencies or network access are required for the build. Ship the generated **`dist/demo.html`**, not the development `index.html`, which deliberately retains its modular local-server workflow. Tests reject a stale distribution file.

Internal repository names, cue identifiers and immutable source evidence IDs are retained. Audience evidence and downloaded JSON use consistent neutral `DEMO-` aliases for branded run IDs and a neutral fund display name. Numbers, dates, event order, policy dispositions and parent relationships remain unchanged. Historical development/review artifacts are not audience handouts and are not part of the standalone distribution.
