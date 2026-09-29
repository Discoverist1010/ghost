# REGULATOR//GHOST Demo Build Contract

Purpose: provide a presenter-led decision theatre for a 30-minute senior financial-services panel on autonomous AI, agentic supervision, runtime governance and human judgement at machine speed.

Audience: senior executives from product, network management, custody, brokerage, asset management/investment, operations, compliance, risk and regulation.

This is a synthetic decision theatre, not a live supervisory system. Use scripted transitions, deterministic scenario data and invented names. No live market, client, transaction or institution data; no real model calls or claim of supervisory capability.

## Governing question

At every major beat, a person at the back of a large conference room must immediately understand:

1. **WHAT JUST CHANGED?**
2. **WHY DOES IT MATTER?**
3. **WHO HAS AUTHORITY NOW?**

The earlier questions—what AI learned, what it wants to do and whether it is authorised—remain the conceptual test. They are not permanent on-screen chrome. These answers outrank dashboard completeness. Reveal one dominant idea at a time; do not bury material meaning in a tooltip, legend, small label or dense table.

## Narrative contract

The main path has eight audience beats: from answers to actions → agents help but humans lose the thread → AI supervises AI and allocates attention → prediction is not permission → one fact changes the case → human judgement and runtime authority → individually correct agents create a systemic problem → closing ghost questions. The Supervisory AI first exposes only one material issue; the causal explanation, source challenge and counterfactual wait until after the predictive no-breach reveal. ESCALATE appears once, after the human decision. Metric gaming remains an optional synthetic red-team scenario, not a main-path claim.

Three real-world arcs frame the synthetic case: capital-markets exception handling, agentic payments/digital assets, and possible correlated decisions in asset management. Public examples have explicit evidence maturity and primary-source links in `PUBLIC_SOURCES.md`. Their existence does not validate the synthetic scores, timings or supervisory logic.

The Human-in-the-Right-Loop sequence is core. One synthetic failed trade opens a related liquidity investigation: 8 agent roles, 27 sub-tasks and 486 interleaved events in a scripted 3.2-second burst. Event `EntityGraph/T-17` changes Entity X from central-bank-related to commercial-counterparty; risk rises 39 → 76. The event exists in the raw trace but is hard to find during the flood. A separate Supervisory AI compresses the trace to one material issue with linked original evidence and a human decision about the reclassification and proposed intervention.

The demo must teach three visibly distinct loops: machine activity, AI supervisory/control, and human authority/judgement. It must then ask who supervises the Supervisory AI and expose provenance, causal trace, independence, uncertainty, disagreement, reproducibility, contestability and authority limits.

The core claim is that putting a human into every machine-speed action loop is neither meaningful nor scalable. Human judgement belongs at deliberately designed boundaries. AI supervision helps find those boundaries, but its own selection and interpretation must be challengeable and reconstructable.

## Projection and presentation contract

- Use a deep navy / near-black field with near-white primary type. Cyan marks observation, amber marks uncertainty and escalation, and red is reserved for genuine denial or danger. The interface should read as a high-end institutional decision theatre.
- Hero numbers and critical state changes: approximately 110–170px.
- Hero verdicts and reveals: approximately 64–90px.
- Major headlines: approximately 54–76px.
- Primary messages and conclusions: approximately 34–48px.
- Supporting text the audience must read: at least approximately 26–30px.
- Presenter controls: approximately 22–26px text or larger, with clear focus states.
- Tiny, fast audit text is permitted only for the intentional log-flood effect; every material conclusion is repeated at audience-readable scale.
- Presentation mode shows one dominant state at a time, without vertical scrolling at 1920×1080. Technical detail is in optional drawers.
- The audience sees an eight-beat counter, not the implementation's internal reveal count. Navigation chrome stays discreet.
- The presenter can pause at the naive review demand, the material-issue reveal, the no-breach reveal and the final questions.

The presenter should never need to say, “You probably can't read this.”

## Success and delivery criteria

- The audience can distinguish public commercial deployment, pilots, regulatory research and the synthetic case; autonomous investigation, AI supervision of AI and authorised intervention remain distinct.
- The audience can explain why deterministic prevention differs from probabilistic pre-emption, and why a score or prediction is not a breach.
- The material `EntityGraph/T-17` event is genuinely present among 486 replayable events, and the displayed causal chain points back to it.
- A human sees the specific judgement required, not an undifferentiated approve/reject prompt over 486 events.
- The Supervisory AI can flag and escalate but cannot edit evidence, expand mandates, approve its own conclusion or execute a restriction.
- The runtime gate applies explicit identity, mandate, materiality, reversibility, evidence and breach checks. The main probabilistic restriction ends in **ESCALATE**.
- Every run yields an event log, agent action trace, evidence packet, score history, gate disposition and human review state; a naive authorise/reject click records an *attempt*, never a substantive decision or execution.

The implementation is a dependency-free single-page presentation app using browser-native JavaScript, CSS and a small Node development server. One deterministic run generates the trace, score history, supervisory finding and gate outcome; no real model or live data service is involved. Event fingerprints in the exported run are demo identifiers, not cryptographic proof.

## Run the presentation

With Node.js 20 or newer:

```sh
npm run dev
```

Open `http://127.0.0.1:4173`. Use the discreet on-screen arrows, Right/Space for next and Left for previous. `R` replays the current animation, `P` pauses it, `F` toggles fullscreen, Esc closes a detail drawer, and Home resets. Contextual detail controls open original events and causal links; the drawer exports the complete synthetic run. Run the scenario and presentation-state checks with `npm test`. No dependency install is required.

The remaining documents specify the scenes, agent boundaries, scenarios, synthetic data, runtime decisions, visual states and evaluation checks. If a detail conflicts, this contract and the causal order in `01_storyboard.md` govern the main demo.
