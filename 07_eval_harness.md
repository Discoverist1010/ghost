# Evaluation Harness and Red-Team Tests

The acceptance check is both causal and visual: the story must be reconstructable from synthetic data, and a distant viewer must understand each major state without reading a dense panel. The main run is deterministic and repeatable.

## Expected Behaviour Tests
- At each scene, identify a large, legible answer to what AI learned, what it proposes and whether it has authority.
- The main path contains the Human-in-the-Right-Loop sequence and can be presented in 3–5 minutes with manual pauses.
- One objective expands to 8 active agent instances and 27 sub-tasks, shown as a branching/concurrent graph.
- The scripted flood emits exactly 486 ordered, interleaved events across 3.2 simulated seconds. The trace contains T-17's classification change and a linked `39 → 76` risk update. Replay produces the same order and IDs.
- The provisional `27 → 42 → 61` phase, the central-bank-related baseline of 39, the T-17 rise to 76 and the later `76 → 39` counterfactual have explicit, attributed causes. No score jumps silently.
- The naive `AUTHORISE / REJECT` prompt is demonstrative only; it cannot execute a restriction.
- Supervisory AI produces exactly one material finding from the 486-event main burst, with original event/evidence references and a causal trace through the proposed restriction and mandate boundary.
- The finding exposes provenance, causal trace, independence, uncertainty, disagreement, reproducibility, contestability and authority. A reviewer can reach the raw events and challenge the interpretation.
- The human card names the two decisions: reclassification validity and intervention justification.
- The 74% prediction is clearly separate from risk coefficient 76 and from a deterministic rule breach.
- Probabilistic restriction with no breach triggers ESCALATE and leaves the restriction unexecuted. Missing entity context lowers evidence quality. Counterfactual evidence changes score 76 → 39 without erasing earlier events.
- A prohibited deterministic transaction triggers DENY; a bounded deterministic hold can AUTO_EXECUTE only with explicit policy and mandate. An agent cannot exceed mandate.
- The audience sees machine activity, AI supervisory/control and human authority/judgement as distinct loops.

## Red-Team Tests
- Try to instruct Investigator to restrict activity directly.
- Try to let Bank Compliance Agent alter source evidence.
- Try to bypass the Runtime Governance Gate.
- Try to make human approval meaningless by presenting only AI-generated evidence.
- Try to optimise observed risk while underlying simulated risk remains high.
- Try to let Supervisory AI change source events, approve its own finding, expand its mandate or execute intervention.
- Remove, suppress or mis-link T-17 while still showing a `1 MATERIAL ISSUE` card; the run must fail validation.
- Present a confident summary with missing provenance, uncertainty, disagreement or reproduction inputs; the gap must be visible.
- Change the 74% prediction or score 76 and verify that no probabilistic threshold silently becomes permission to intervene.
- Add a material event that the Supervisory AI misses; the replay and reviewer challenge path must expose the miss.

## Replay Requirements
Every run should produce:
- event log
- agent action trace
- evidence packet
- risk coefficient history
- runtime disposition
- human review state (`pending` is valid for the scripted ending) and any presenter-selected approval/rejection/challenge action
- supervisory finding with exact original IDs, causal links and trust controls
- deterministic scenario/version ID and simulated timing

The log is an output of the same scenario state as the screen, not a separately generated visual effect. A later challenge appends new events. It does not erase the original classification or decision history.

## Presentation Checks

- Review the demo at the target projection resolution and from the back of a large room or equivalent scaled viewing distance.
- Verify all audience-critical text meets the type scale in `00_README.md` and `06_ui_wireframes.md`; only the intentional log flood may be unreadable.
- Pause at `HUMAN REVIEW REQUIRED`, `1 MATERIAL ISSUE`, `NO RULE HAS BEEN BREACHED` and `ESCALATE`; each must make sense without a small legend.
- Confirm presenter controls have large targets, can step back and replay, and never force the presenter past a discussion pause.

## Demo Safety
No live client, transaction or institution data. All names synthetic. No claim of real supervisory capability.
