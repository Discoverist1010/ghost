# REGULATOR//GHOST Demo Build Contract

Purpose: build a 3–5 minute, presenter-led teaching simulation for a 30-minute senior financial-services panel on autonomous AI, agentic supervision, runtime governance and human judgement at machine speed.

Audience: senior executives from product, network management, custody, brokerage, asset management/investment, operations, compliance, risk and regulation.

This is a synthetic decision theatre, not a live supervisory system. Use scripted transitions, deterministic scenario data and invented names. No live market, client, transaction or institution data; no real model calls or claim of supervisory capability.

## Governing question

At every major scene, a person at the back of a large conference room must immediately understand:

1. **WHAT DID THE AI JUST LEARN?**
2. **WHAT DOES IT NOW WANT TO DO?**
3. **IS IT AUTHORISED TO DO IT?**

These answers outrank dashboard completeness. Reveal one dominant idea per scene. Do not bury material meaning in a tooltip, legend, small label or dense table.

## Narrative contract

The main path is: Productivity → Sentinel → Investigator → agent/sub-agent expansion → naive human-in-the-loop stress test → Supervisory AI and Human in the Right Loop → Bank Compliance challenge → predictive intervention without breach → counterfactual → runtime authority gate → closing questions. Metric gaming and Agent Swarm are optional advanced scenarios.

The Human-in-the-Right-Loop sequence is core. One objective creates 8 active agent instances, 27 sub-tasks and 486 interleaved events in a scripted 3.2-second burst. Event `EntityGraph/T-17` changes Entity X from central-bank-related to commercial-counterparty; risk rises 39 → 76. The event exists in the raw trace but is hard to find during the flood. A separate Supervisory AI compresses the trace to one material issue with linked original evidence and a human decision about the reclassification and proposed intervention.

The demo must teach three visibly distinct loops: machine activity, AI supervisory/control, and human authority/judgement. It must then ask who supervises the Supervisory AI and expose provenance, causal trace, independence, uncertainty, disagreement, reproducibility, contestability and authority limits.

The core claim is that putting a human into every machine-speed action loop is neither meaningful nor scalable. Human judgement belongs at deliberately designed boundaries. AI supervision helps find those boundaries, but its own selection and interpretation must be challengeable and reconstructable.

## Projection and presentation contract

- Use a white background with dark, high-contrast type and restrained accent colors. The interface should read as a supervisory decision theatre, not a dense dashboard.
- Hero numbers and critical state changes: approximately 80–140px.
- Major headlines: approximately 52–76px.
- Primary messages and conclusions: approximately 34–48px.
- Supporting text the audience must read: at least approximately 26–30px.
- Presenter controls: 24px+ text and large targets.
- Tiny, fast audit text is permitted only for the intentional log-flood effect; every material conclusion is repeated at audience-readable scale.
- Presentation mode shows one dominant state at a time. Technical detail may be revealed in secondary panels without competing with the main message.
- The presenter can pause at the naive review demand, the material-issue reveal, the no-breach reveal and the final questions.

The presenter should never need to say, “You probably can't read this.”

## Success and delivery criteria

- The audience can distinguish productivity support, autonomous investigation, AI supervision of AI and authorised intervention.
- The audience can explain why deterministic prevention differs from probabilistic pre-emption, and why a score or prediction is not a breach.
- The material `EntityGraph/T-17` event is genuinely present among 486 replayable events, and the displayed causal chain points back to it.
- A human sees the specific judgement required, not an undifferentiated approve/reject prompt over 486 events.
- The Supervisory AI can flag and escalate but cannot edit evidence, expand mandates, approve its own conclusion or execute a restriction.
- The runtime gate applies explicit identity, mandate, materiality, reversibility, evidence and breach checks. The main probabilistic restriction ends in **ESCALATE**.
- Every run yields an event log, agent action trace, evidence packet, score history, gate disposition and human review state; any presenter-selected approval, rejection or challenge is recorded as an action.

The implementation is a dependency-free single-page presentation app using browser-native JavaScript, CSS and a small Node development server. One deterministic run generates the trace, score history, supervisory finding and gate outcome; no real model or live data service is involved. Event fingerprints in the exported run are demo identifiers, not cryptographic proof.

## Run the presentation

With Node.js 20 or newer:

```sh
npm run dev
```

Open `http://127.0.0.1:4173`. Use the on-screen Back and Next buttons, or the left/right arrow keys. On the log-flood scene, use Pause or Replay (keyboard `P` / `R`). Press `F` for fullscreen. Evidence opens the original event and causal links; Export replay evidence downloads the complete synthetic run. Run the scenario checks with `npm test`. No dependency install is required.

The remaining documents specify the scenes, agent boundaries, scenarios, synthetic data, runtime decisions, visual states and evaluation checks. If a detail conflicts, this contract and the causal order in `01_storyboard.md` govern the main demo.
