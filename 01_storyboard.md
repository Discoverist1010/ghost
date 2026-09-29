# Main Storyboard and Presenter Cues

Target: approximately 4½ minutes of scripted progression inside a 30-minute panel. Presenter controls advance each beat; the timer does not force a scene change. Every scene must visibly answer what the AI learned, what it proposes next and whether it has authority.

| Beat | Dominant audience view | Learned → Proposed → Authorised? | Presenter cue |
| --- | --- | --- | --- |
| 1. Productivity | Calm command centre; synthesis of synthetic filings and transactions | Patterns and questions → Summarise for people → Yes, read-only | “At this stage AI helps people supervise.” |
| 2. Sentinel | Autonomous monitoring; first anomaly; `27 → 42` | Liquidity anomaly → Create alert → Yes, within monitoring mandate | “It can observe without waiting to be prompted.” |
| 3. Investigator | Investigation path selected; `42 → 61` | Alert warrants context → Query evidence sources → Yes, investigation only | “The agent chooses the investigative path.” |
| 4. Expansion | A branching tree from one objective to eight active agents and 27 sub-tasks | Multiple evidence paths → Run bounded parallel checks → Yes for queries; no for restriction | “One task does not mean one agent action.” |
| 5. Naive human loop | `HUMAN OVERSIGHT: ENABLED`, `ALL AGENT ACTIONS: LOGGED`, `ALL ACTIONS: REVIEWABLE`; then `8 AGENTS` → `27 SUB-TASKS` → `486 EVENTS` → `3.2 SECONDS` | `EntityGraph/T-17` changes Entity X classification; risk `39 → 76` → Generic `AUTHORISE / REJECT` over 486 events → No meaningful basis yet | “Everything is logged. But what exactly is the human reviewing?” Pause on `HUMAN REVIEW REQUIRED / 486 EVENTS`. |
| 6. Human in the Right Loop | `486 EVENTS` transforms into `1 ISSUE REQUIRES HUMAN JUDGEMENT`; causal trace and specific decision card | Reclassification drove the proposed restriction → Escalate the fact and consequence → Supervisory AI may flag only; human decides | “A human can be inside the operational loop and outside it cognitively.” |
| 7. Bank Compliance Agent | Institution-side AI challenges the classification and submits counter-evidence | Reclassification may be wrong → Submit rebuttal → Yes, challenge only | “The institution's AI can challenge the supervisor's AI; neither gets to rewrite the source.” |
| 8. Predictive boundary | `RISK 76`, `74% PREDICTED MATERIAL EVENT`, then `NO RULE HAS BEEN BREACHED` | Pattern suggests possible future risk → Enhanced liquidity restriction recommended → No autonomous authority | “A prediction is not a breach.” |
| 9. Counterfactual | Validating Entity X as central-bank-related yields `76 → 39` | One material fact changes the inference → Reassess recommendation → Yes for analysis; no for unilateral intervention | “A persuasive explanation can depend on a brittle fact.” |
| 10. Runtime authority | Gate checks identity, mandate, materiality, reversibility, evidence and action; hero `ESCALATE` | The original 76-based restriction proposal now has disputed evidence and exceeds autonomous mandate → Human review of fact and intervention → Restriction remains unexecuted | “Runtime authority is deliberately bounded.” |
| 11. Closing | `WHO IS THE SUPERVISOR?` → `WHERE IS THE RIGHT LOOP?` → `WHO SUPERVISES THE SUPERVISORY AI?` | The system selects what reaches human attention → Demand trust controls and contestability → Accountability stays with authorised humans/institution | “Where should human judgement sit in a machine-speed financial system?” |

## Human-in-the-Right-Loop choreography

1. **Reassurance:** Show the three oversight assurances at audience-readable size before the workflow starts.
2. **Branching:** Draw Sentinel → Investigator → EntityGraph, HistoricalTransactions, DisclosureReview, CounterpartyCheck and PolicyMapper, with parallel analysis and control tasks. The 8-agent count refers to active instances in this burst; each may execute multiple sub-tasks. Supervisory AI and Bank Compliance Agent enter later.
3. **Flood:** Replay exactly 486 timestamped events over a simulated 3.2-second interval. Mix ordinary retrieval, relationship, hash, confidence, policy, tool, trace and parsing events. Insert the real `EntityGraph/T-17 CLASSIFICATION_CHANGED Entity X: central-bank-related → commercial-counterparty` event in sequence. Its downstream score change `39 → 76` must also be logged. The fast, small text conveys volume; the counts and conclusions stay large.
4. **Naive review pause:** Show `ALL ACTIONS WERE LOGGED`, `THE MATERIAL EVENT WAS PRESENT`, `THE HUMAN COULD THEORETICALLY REVIEW IT`, then `BUT COULD THEY REALISTICALLY FIND IT?` Do not offer a meaningful approval action until the specific issue is surfaced.
5. **Compression:** Activate a separate Supervisory AI. Transition from `486 EVENTS` to `1 MATERIAL ISSUE`, then show `EntityGraph/T-17` → Investigator score `39 → 76` → Interpreter restriction recommendation → runtime mandate boundary.
6. **Right-loop decision:** Show the human task in large type: “Determine whether Entity X was correctly reclassified and whether that evidence justifies intervention.” Provide the original event and evidence as drill-down, uncertainty, disagreement and a challenge path.
7. **Second-order question:** Show `486 raw events → Supervisory AI → 1 material escalation → Human`. Ask `WHO SUPERVISES THE SUPERVISORY AI?` Reveal its trust controls and its flag/escalate-only authority. This moment leads into the Bank Compliance challenge and the later counterfactual.

Score continuity: `27 → 42 → provisional 61` while entity context is unknown; source checking resolves a central-bank-related baseline of 39 before T-17; the derived reclassification raises it `39 → 76`; the later counterfactual restores 39. The baseline resolution is an attributed event, even if shown only briefly during the branching beat. The human decision card introduces the question in beat 6; the presentation leaves its answer pending while the challenge, prediction and gate are revealed.

## Three loops the audience must distinguish

- **Machine activity loop:** queries, retrieval, tool calls, scoring, evidence processing and agent-to-agent work at machine speed. Humans do not approve each routine action.
- **Supervisory/control loop:** independent AI monitors behavior, mandate crossings, conflicting evidence, material state changes, unexpected tools, disagreement and correlated patterns. It compresses activity into linked issues.
- **Authority/judgement loop:** humans handle material intervention, irreversible action, legal/regulatory determination, mandate expansion, conflicting strong evidence, low confidence with high consequence, exceptional override, policy change and systemic-risk decisions.

The final message is not that another AI solves every oversight problem. The human must be able to trust, challenge and reconstruct the system that selected what deserved attention.
