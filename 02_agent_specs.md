# Agent Specifications

All roles below are simulated. The run opens with one synthetic failed-trade exception and a related liquidity signal. The 8-agent headline counts machine-activity roles in the flood: Sentinel, Investigator, Interpreter and five named specialist sub-agents. They share 27 bounded sub-tasks, including liquidity analysis, transaction clustering, provenance, regulatory mapping, confidence calibration and audit writing. The presentation's eight branch labels are **workstreams mapped to task IDs**, not eight additional agent identities. Supervisory AI and Bank Compliance Agent enter after the burst and are not included in the eight.

## Sentinel Agent
Role: continuously monitor synthetic transactions and risk signals.
Inputs: transactions, liquidity movements, exposure summaries, public alerts.
Outputs: anomaly alerts, risk-factor updates.
Allowed actions: read-only monitoring; create alert.
Forbidden actions: contact institution; trigger restriction.

## Investigator Agent
Role: gather evidence after Sentinel alert.
Inputs: entity graph, filings, disclosures, historical transactions.
Outputs: evidence packet with provenance and an attributable risk recalculation when new evidence changes the hypothesis.
Allowed actions: choose and dispatch bounded specialist checks; query internal data; request additional evidence in simulation.
Forbidden actions: classify breach; execute action; change source evidence.

## Specialist Sub-agents

EntityGraph checks entity identity, type and relationships. HistoricalTransactions checks prior flows and clusters. DisclosureReview compares filings and disclosures. CounterpartyCheck checks counterparty context and simulated institution responses. PolicyMapper maps facts to policy categories without making a legal determination. Each may perform multiple concurrent sub-tasks, but may only read sources and submit attributed findings. None may rewrite source records or authorise intervention.

The event `EntityGraph/T-17 CLASSIFICATION_CHANGED Entity X: central-bank-related → commercial-counterparty` is a derived classification change, not a source-record edit. Its basis and uncertainty must be linked. It remains visible in the immutable replay trace even when later challenged.

## Interpreter Agent
Role: map evidence to regulatory or supervisory concern categories.
Inputs: evidence packet, rule catalogue, supervisory taxonomy.
Outputs: risk hypotheses, interpretation of the updated risk coefficient, proposed next action and uncertainty flags.
Allowed actions: recommend next checks or a proposed action for gate review; cannot execute the proposal.
Forbidden actions: determine legal breach; execute a proposed action.

## Supervisory AI

Role: independently supervise the agent system performing the investigation, not conduct the underlying investigation. It consumes the complete action trace and watches mandate boundaries, unusual sequences, conflicting evidence, material state changes, model disagreement, unexpected tool use and correlated behavior.

Output: a small number of material escalation cards, each linked to exact source events, evidence, causal propagation, uncertainty and disagreements. In the main run it reduces 486 events to one issue: the effect of `EntityGraph/T-17` on the risk score and proposed restriction.

Allowed actions: read and analyze trace; flag, challenge and escalate. Forbidden actions: edit source events or evidence; expand its own mandate; approve its own interpretation; execute a restriction. Its identity, separate simulated control boundary and authority limits must be visible and testable. The demo makes no claim of real model independence. It is not merely another Investigator sub-agent.

## Bank Compliance Agent
Role: challenge supervisory inference and provide counter-evidence.
Inputs: institution narrative, supporting documents, synthetic counterfacts.
Outputs: rebuttal, mitigating evidence, alternative explanation.
Allowed actions: submit challenge.
Forbidden actions: change source records.

## Runtime Governance Gate
Role: convert proposed action into disposition.
Inputs: agent identity, mandate, action type, materiality, reversibility, evidence quality, thresholds.
Outputs: Deny, Observe, Escalate, Auto-Execute.
Allowed actions: decide disposition.
Forbidden actions: rewrite evidence or generate regulatory interpretation.

## Human Decision Maker

Role: decide the material question surfaced by the control loop. In the main run: “Is the Entity X reclassification valid, and if so is intervention justified?”

Must receive original evidence, causal trace, uncertainty, disagreement and a way to challenge the Supervisory AI's selection. A generic `AUTHORISE / REJECT` prompt over 486 events is shown only as the deliberately inadequate first design. Human review does not retroactively turn a model prediction into a rule breach.
