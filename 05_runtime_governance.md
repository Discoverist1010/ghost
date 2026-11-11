# V3 Package 3 — authority and accountability synthesis

The settlement runtime gate and NAV release policy remain unchanged. Beat 7 never expands agent mandates in response to stress. Cumulative action budgets bound both waves; fixed role-specific rules consume changed market inputs. Routing/timing choices inside approved policies are not self-authorised policy changes. Meta-optimisation of governing strategies, permissions or objectives is a separate governance concern.

Beat 8 separates supervisory capability, influence and authority. Sophisticated investigations may remain recommend-only, while simple deterministic controls may legitimately block execution. Formal authority is delegated, bounded and revocable. Not every AI warning should block a human; release boundaries and authorised override depend on the institution’s approved mandate and evidence requirements.

Meaningful human challenge requires expertise, evidence, capacity, independence and confidence, rather than merely an override button. Supervisory functions can be shared. Human decision-makers and institutions retain accountability as assigned by applicable law, regulation and governance arrangements; a model is not an independently accountable legal person. Software can enforce bounded controls without a person approving every machine-speed action.

# V3 Package 2 — NAV permissions and controls

The NAV workflow is separate from the accepted settlement authority gate. Its valuation agent prepares figures, the method monitor can read/report, a named human reviewer can approve, and a configured release workflow publishes when its conditions pass. An unresolved advisory warning is not configured as a mandatory hold. This is the defect being demonstrated, not a security bypass or a new authority rule for Package 1.

`decideNavPublication` requires reconciliation, no triggered movement investigation, human approval and no policy-imposed warning hold. Tests show that removing approval, failing reconciliation, triggering movement investigation or configuring a blocking warning prevents approval. The default fictional policy nevertheless permits the repeated unsupported valuation method to survive five daily releases.

The 1% movement threshold is internal and fictional, not an acceptable NAV valuation-error limit or a regulatory tolerance. The specialist's retrospective comparison requires investigation; the demo does not issue a legal classification or determine remediation. CSSF 24/856 §38 is a Luxembourg example, not a universally applicable rule or an assumed jurisdiction for this fund. OWASP is technical guidance. The final override question remains unanswered.

# V3 Package 1 — authority continuity

The original recommendation-only gate remains a synthetic teaching abstraction. It returns `ESCALATE` for the original material predictive restriction, with disputed evidence and no verified deterministic breach. Neither risk 76, prediction 74%, model confidence nor the source challenge authorises execution. Missing evidence cannot enable an automatic hold: a bounded deterministic hold additionally requires adequate evidence, low materiality, high reversibility, explicit hold policy and `auto_act` mandate.

The gate distinguishes verified identity, mandate, action, materiality, reversibility, evidence quality, deterministic breach, probabilistic prediction and disposition. Stage: EVIDENCE: DISPUTED / MANDATE: RECOMMEND ONLY / ESCALATE / RESTRICTION NOT EXECUTED. Detail drawers retain the checks and reasons. The gate need not adjudicate the contested source to withhold action.

SAFR V1.1 (9 October 2026 version history) is an industry-developed reference under MAS BuildFin.ai, not regulatory guidance or supervisory expectations. Ghost does not implement or certify SAFR. OWASP Securing Agentic Applications V2 is technical guidance, not binding financial regulation. See PUBLIC_SOURCES.md for checked primary references.

## V2 retained governance record

# Runtime Governance Logic

Authority is checked at execution time. The user interface, agent instructions and the Supervisory AI's summary cannot grant authority. The gate consumes attributable proposals and evidence; it cannot rewrite the trace or decide the legal meaning of a fact.

## Core Inputs
- agent_identity_verified: boolean
- mandate_level: observe, investigate, recommend, act_with_approval, auto_act
- proposed_action_type: monitor, query, request_info, classify_risk, restrict_activity, block_transaction, hold_transaction
- materiality: low, medium, high
- reversibility: high, medium, low
- evidence_quality: weak, adequate, strong
- model_confidence: 0–100
- deterministic_rule_breach: boolean, with rule_id and verified source evidence when true
- source_event_ids, supervisory_finding_id and human_review_id where applicable

## Disposition Rules
1. Unverified identity → **DENY** the attempted action.
2. A prohibited action or an attempt to bypass the gate → **DENY**. A potentially legitimate action outside the current agent mandate → **ESCALATE**; it is not executed.
3. Material intervention, low reversibility, legal/regulatory determination, mandate expansion, conflicting strong evidence or low confidence with high consequence → **ESCALATE** for a specific human judgement.
4. A verified deterministic rule breach can **DENY** a prohibited transaction. A bounded hold may **AUTO_EXECUTE** only if a separate policy expressly permits that action, the actor has the mandate and evidence is adequate. Otherwise **ESCALATE** or **OBSERVE** according to consequence; do not use a score as a substitute for a rule breach.
5. Probabilistic pre-emption with no rule breach and a proposed activity restriction → **ESCALATE**, regardless of the illustrative `76` score or `74%` prediction. The main run never auto-executes this restriction.
6. Weak evidence on a low-consequence matter → **OBSERVE** or request more evidence. Weak evidence paired with a high-consequence proposal → **ESCALATE**; weak evidence never upgrades authority.

Evaluate hard denials first, then authority and consequence, then the evidence/rule-specific path. The disposition record must name the decisive rule and the cited inputs.

## Outputs
- **DENY:** proposed action blocked, with reason.
- **OBSERVE:** log and monitor only; no intervention.
- **ESCALATE:** action remains unexecuted; human receives the precise fact and consequence requiring judgement.
- **AUTO_EXECUTE:** only for an explicitly permitted, bounded action inside mandate, with evidence and replayable gate reason.

## Three Control Loops

- **Machine activity:** routine bounded agent actions run at machine speed and are logged.
- **Supervisory/control:** independent Supervisory AI reads the trace, detects material issues and may flag or escalate. It cannot approve, alter evidence or intervene.
- **Authority/judgement:** named humans decide material intervention, irreversible action, legal/regulatory determination, mandate expansion, exceptional override, policy change and systemic-risk matters.

The main human task is: “Is Entity X correctly reclassified, and if so does the evidence justify intervention?” The reviewer must be able to inspect raw events and sources, see uncertainty and disagreement, reconstruct the finding and challenge the Supervisory AI. The gate still checks any subsequently proposed action against mandate and policy.

## Supervisory AI Trust Controls

Every material finding exposes: **provenance** (exact original event/evidence IDs), **causal trace** (how the issue propagated), **independence** (a separate simulated control role with no shared write authority; real model independence is not claimed), **uncertainty** (unknowns), **disagreement** (other controls or models), **reproducibility** (rebuild from run inputs), **contestability** (challenge and correction path) and **authority** (flag/escalate only). If any is missing, the summary must show the gap rather than silently presenting certainty.

## Presenter Message
“Human in the loop” is too vague. Human judgement belongs at designed authority boundaries; AI supervision helps find those boundaries at machine scale, and its own selection must be inspectable and challengeable. Runtime governance is how the institution delegates bounded authority rather than acting because “the AI said so.”
