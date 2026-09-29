# Presentation UI and Wireframes

Design for projection in a large conference room: a supervisory command centre / decision theatre, not a dense financial dashboard. The audience should track one narrative beat without searching the screen. Every major beat answers, in plain audience-readable language: **What did AI learn? What does it want to do? Is it authorised?** These may sit in a consistent three-part footer or appear as three sequential large statements, but none may depend on a tiny label.

## Type and interaction scale

- Hero numbers and state changes: approximately 80–140px.
- Major headlines: approximately 52–76px.
- Primary conclusions: approximately 34–48px.
- Supporting text that must be read: at least approximately 26–30px.
- Presenter button text: 24px or larger, with large targets and clear focus states.
- The intentionally illegible, fast audit stream is the sole exception for information the audience is not expected to parse. Its material event appears later at full scale.

Use dark navy as the field, cyan for observation, gold for investigation, amber for escalation and red only for a hard stop or high-risk state. Pair color with words and shape; color alone must not carry the meaning. Keep motion deliberate and allow pause, replay and step-through.

## Presentation states

1. **Productivity:** a calm summary and human-owned next question; minimal command-centre framing.
2. **Sentinel:** an oversized `27 → 42` and a single monitoring alert.
3. **Investigator:** an oversized `42 → 61` marked provisional, with the chosen evidence path.
4. **Expansion:** a graph, not a list: Sentinel → Investigator → EntityGraph, HistoricalTransactions, DisclosureReview, CounterpartyCheck and PolicyMapper. Show Interpreter and parallel function lanes. The graph resolves to `8 AGENTS / 27 SUB-TASKS`.
5. **Naive assurance and flood:** first `HUMAN OVERSIGHT: ENABLED / ALL AGENT ACTIONS: LOGGED / ALL ACTIONS: REVIEWABLE`; then animate `8 AGENTS` → `27 SUB-TASKS` → `486 EVENTS` → `3.2 SECONDS`. The log panel contains the actual T-17 change among ordinary events. Do not visually isolate it during the flood.
6. **Naive review pause:** oversized `HUMAN REVIEW REQUIRED`, `486 EVENTS`, `AUTHORISE / REJECT`; then `BUT COULD THEY REALISTICALLY FIND IT?` The two buttons demonstrate the inadequate prompt and do not approve an actual intervention.
7. **Supervisory AI reveal:** dramatic `486 EVENTS` → `1 MATERIAL ISSUE`. Expand one readable causal chain: `EntityGraph/T-17` reclassification → Investigator risk recalculation `39 → 76` → Interpreter restriction recommendation → runtime mandate boundary. Show the three loops as distinct bands: machine activity, AI control and human authority.
8. **Right-loop card:** `HUMAN DECISION REQUIRED`; ask “Is the entity reclassification valid?” and “If valid, is intervention justified?” Link to original events, evidence, uncertainty, disagreement and a challenge action. Show the complete human task, not only a summary score.
9. **Trust question and Bank challenge:** `WHO SUPERVISES THE SUPERVISORY AI?` then reveal provenance, causal trace, independence, uncertainty, disagreement, reproducibility, contestability and authority. Bank Compliance submits attributed counter-evidence.
10. **Predictive boundary:** `RISK 76` and `74% PREDICTED MATERIAL EVENT`, followed by the dominant reveal `NO RULE HAS BEEN BREACHED`. The proposal is an enhanced liquidity restriction, not an executed action.
11. **Counterfactual and gate:** `76 → 39` dominates after Entity X's original classification is tested. Then show the runtime checks and a full-screen `ESCALATE`; state clearly that the restriction was not executed.
12. **Closing:** sequential full-screen questions: `WHO IS THE SUPERVISOR?`, `WHERE IS THE RIGHT LOOP?`, `WHO SUPERVISES THE SUPERVISORY AI?`, ending on “Where should human judgement sit in a machine-speed financial system?”

## Secondary views

Use the original command-centre layout only when the presenter opens detail: agent/status rail at left, evidence and causal links at right, trace at bottom. Collapse it for the hero states. Evidence cards show source, confidence, missing information and exact trace links. The gate can display its four possible dispositions—DENY, OBSERVE, ESCALATE, AUTO_EXECUTE—but only the current disposition dominates.

Presenter controls include Next, Back, Pause/Resume, Replay Flood, Reveal Source Event and Open Evidence. The scripted 3.2-second burst can always be replayed or stepped through after the dramatic reveal. Do not autoplay across a human discussion pause.
