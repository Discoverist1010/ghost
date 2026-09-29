# Synthetic Data Model

All IDs and relationships are synthetic. Store the scripted scenario as one reproducible run with stable IDs. Rendered screens derive from the same run; do not maintain a separate decorative log or score sequence.

## Entities
- entity_id
- entity_type: bank, broker, fund, central_bank_related, commercial_counterparty, unknown
- jurisdiction
- relationship_edges
- risk_tags
- source_evidence_ids
- classification_version and classification_basis

Source entity records and derived classifications are separate. `EntityGraph/T-17` changes a derived classification from `central_bank_related` to `commercial_counterparty`; it does not mutate the underlying source documents.

## Transactions
- transaction_id
- timestamp
- origin_entity_id
- destination_entity_id
- amount
- currency
- asset_type
- purpose_code
- settlement_channel
- rule_flags

## Evidence
- evidence_id
- source_type: filing, disclosure, transaction, public_alert, entity_graph, counterparty_response
- summary
- confidence
- provenance_link
- timestamp
- source_hash and related_event_ids

Synthetic evidence must distinguish an original source, an agent-derived interpretation and a later challenge. A challenge appends a record; it never overwrites the original.

## Risk Factors
- liquidity_anomaly
- network_concentration
- disclosure_inconsistency
- historical_pattern_match
- unresolved_evidence
- mitigating_evidence

## Risk History and Predictions

- risk_update_id, event_id, score_before, score_after, factor_contributions, evidence_ids, provisional_flag
- prediction_id, predicted_event, illustrative_probability, model_basis, uncertainty, evidence_ids

The score path is `27 → 42 → provisional 61 → 39 baseline → 76 after T-17 → 39 counterfactual`. The 74% predicted material event is a separate synthetic model output. It is not the risk coefficient, a calibrated probability claim or a breach finding.

## Agent Tasks

- task_id, parent_task_id, objective_id, actor_id, mandate, start/end simulated timestamps, input_event_ids, output_event_ids, status

One objective expands to exactly 27 sub-tasks across eight active machine-activity agent instances during the log-flood burst. Parent references make the branching graph reconstructable. Parallel tasks may interleave their events.

## Audit Events
- event_id
- actor_id
- actor_type: human, agent, supervisory_ai, runtime_gate
- task_id and parent_event_ids
- event_type and action
- simulated_timestamp and sequence_number
- input_hash
- input_evidence_ids and output_evidence_ids
- output_summary and output_hash
- disposition
- wall_clock_timestamp (optional; distinct from simulated time)

The main burst contains exactly 486 ordered, replayable events spanning 3.2 simulated seconds. It includes `EntityGraph/T-17 CLASSIFICATION_CHANGED Entity X: central-bank-related → commercial-counterparty`, the downstream `RISK_UPDATED 39 → 76`, and hundreds of ordinary retrieval, relationship, hashing, confidence, policy, tool, trace and parsing events. The audience may not read the fast log, but the material event must be a real trace record with a stable ID.

## Supervisory Finding

- finding_id, detector_identity, detector_version, independence_declaration
- material_issue, source_event_ids, source_evidence_ids, causal_event_ids
- uncertainty, disagreement, alternative_explanations, omitted_context
- reproduction_inputs, reproduction_result, challenge_status
- permitted_actions: flag, escalate

The main finding refers to T-17 and the specific risk, recommendation and mandate events. It can be reconstructed from the underlying 486 events. The Supervisory AI cannot change the evidence or its own authority.

## Human Review

- review_id, finding_id, question, evidence_seen_ids, reviewer_identity, decision (`pending`, `approve`, `reject`, `challenge`), rationale, timestamp

The meaningful question is whether the reclassification is valid and, if so, whether intervention is justified. The main scripted presentation may end with decision `pending`; any presenter-selected decision or challenge appends an event. Record whether the reviewer opened the underlying source and whether they accepted or challenged the Supervisory AI's interpretation.
