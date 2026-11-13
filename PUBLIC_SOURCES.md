# Public source notes

REGULATOR//GHOST uses public examples to frame governance questions. **None of these organisations, projects or regulators supplies data to, validates or endorses the synthetic run.** Evidence status describes the cited activity, not the demo. Checked 29 September 2026.

## Source-led update · verified 13 November 2026

The four primary sources below were checked for this patch. This does not change the verification dates of unrelated entries. Evidence drawers use institution / publication / date → supported finding → status or limitation → descriptive primary-source link. Main-stage references use source · concise finding; detailed qualifications remain here and in the drawers.

### HKMA · Discussion Paper on Agentic A.I. Governance in the Banking Sector · November 2026

**Supported findings:** §7.2 distinguishes formal approval from meaningful oversight: the reviewer needs substantive information, practical challenge capacity and enough time to intervene. Under the proposed materiality assessment in §8.1, a read-only monitoring deployment can be material when a critical operation depends on its accuracy.

Sections 5.2–5.3 connect approved business intent and permitted actions with business accountability, technical implementation and independent control challenge. Sections 6.2 and 7.1 discuss lifecycle testing and an agent harness that translates policy into enforceable boundaries, including deterministic checks, escalation paths and controlled changes to tools and permissions.

**Status / limitation:** Exploratory discussion proposals. Section 2.3 explicitly says this is not a statement of supervisory expectations, creates no new obligations and does not modify or interpret existing ones. Do not present it as binding regulation or conflate it with separate HKMA supervisory guidance.

**Application to the demonstration:** An incomplete cross-domain requirement calls for business-owned scope, enforceable implementation, independent challenge and end-to-end tests. Recommended tests connect entity, jurisdiction, effective date and exposure, reject unauthorised capability expansion and exercise failure/fallback paths. These are practical applications informed by the paper, not claims that the fictional institution assigned named owners, approved these controls or satisfied a regulatory requirement. The scenario illustrates incomplete requirements, not an established coding defect.

[HKMA discussion paper · primary PDF](https://www.hkma.gov.hk/media/eng/doc/key-information/press-release/2026/20261102e3a1.pdf)

### HKMA · Project SAGE launch announcement · 2 November 2026

**Supported finding:** Project SAGE (Securing Agentic Finance with Governance and Enablement) explores practical use cases, agent identity and delegated-authority verification, interoperability and legal/regulatory considerations. Its identity work includes Know Your Agent and authentication approaches relevant to interactions across firms.

**Status / limitation:** Launched initiative supported by an Agentic Finance Expert Group; exploration and ecosystem development, not proof of a deployed universal cross-firm identity standard or an obligation introduced by this announcement. Supporting documentation only: no SAGE scene or runtime integration is added.

[HKMA Project SAGE · launch and Expert Group](https://www.hkma.gov.hk/eng/news-and-media/press-releases/2026/11/20261102-4/)

### BIS · Project Logos · project page updated 4 June 2026

**Supported finding:** Simulation research compares heuristic/rules-based and LLM portfolio managers under controlled conditions, including conditions that amplify or dampen correlated allocation decisions.

**Status / limitation:** Ongoing exploratory research. The page describes planned research, not proof of the demonstration's USD-liquidity mechanism or an observed market incident.

[BIS Project Logos · portfolio decisions and correlation](https://www.bis.org/project/logos)

### BIS · Project Agenti · project page updated 14 October 2026

**Supported finding:** Research uses an RTGS-like agent payment simulator to explore payment timing, intraday liquidity, possible delays, gridlock and resilience. The collaboration involves the BIS Innovation Hub Swiss and Toronto Centres, Bank of Canada and Swiss National Bank.

**Status / limitation:** Explicitly marked ongoing. The stated research programme and early payment-policy work do not experimentally establish the demo's particular six-agent scenario.

[BIS Project Agenti · payments and intraday liquidity](https://www.bis.org/node/87745)

**Separate synthetic example:** The demonstration combines market, FX, collateral, funding and settlement transmission across six bounded agents. Neither BIS project validates this exact sequence, demonstrates that it occurred, or supplies its numerical assumptions. No scenario calculation, agent behaviour or presenter state is changed by these references.

## Capital markets / asset servicing

| Status | Primary source | What it supports |
| --- | --- | --- |
| **LIVE PRODUCTION — company-reported** | [Broadridge: agentic AI across capital-markets and wealth operations](https://www.broadridge.com/press-release/2026/broadridge-deploys-agentic-ai) | Broadridge reports production trade-fail management, break resolution and valuation-exception workflows. Its performance and deployment claims are its own. |
| **PUBLIC WORKFLOW EXAMPLE — not a deployment claim** | [Standard Chartered: agentic AI in asset servicing](https://www.sc.com/EN/news/corporate-investment-banking/agentic-ai-in-asset-servicing/) | An illustrative failed-trade query decomposes into specialist tasks under human oversight. It grounds the *pattern*, not this demo's eight agents or 486 events. |

## Agentic payments / digital assets

| Status | Primary source | What it supports |
| --- | --- | --- |
| **LIVE PILOT** | [Sygnum: AI-agent-driven digital-asset transactions](https://www.sygnum.com/news/sygnum-completes-first-live-ai-agent-driven-digital-asset-transactions-by-a-regulated-swiss-bank/) | Controlled live-mainnet pilot; agent planned and prepared steps, while the client signed actions. The agent was not generally available to clients. |
| **LIVE PILOT — company-reported** | [Visa: agentic commerce in Asia Pacific](https://sg.review.visa.com/about-visa/stories/2026/agentic-commerce-gets-real-in-asia-pacific-is-the-ecosystem-ready.html) | Visa describes a Singapore pilot with DBS using issuer-controlled agent-initiated purchases. |
| **COMMERCIAL ROLLOUT — company-reported** | [Mastercard: authenticated agentic transactions in ASEAN](https://www.mastercard.com/news/ap/en/newsroom/press-releases/en/2026/mastercard-powering-asean-s-ai-ambitions-in-the-future-of-payments/) | Mastercard reports authenticated agentic transaction rollout in Singapore and Malaysia. This is payments context, not a basis for any demo score. |

## Programmable compliance / runtime control

| Status | Primary source | What it supports |
| --- | --- | --- |
| **INDUSTRY WHITE PAPER / PROPOSAL** | [MAS: Safeguards for Agentic Finance at Runtime (SAFR)](https://www.mas.gov.sg/publications/monographs-or-information-paper/2026/safeguards-for-agentic-finance-at-runtime) | Public proposed safeguards for financial agents at runtime. The demo gate is an original teaching abstraction, not an implementation of SAFR or a MAS rule. |
| **OFFICIAL PROTOTYPE / ONGOING RESEARCH** | [BIS Innovation Hub: Project Mandala](https://www.bis.org/project/mandala) | Proof-of-concept compliance-by-design and transaction pre-validation across borders. It does not establish that the demo's predictive restriction is legally authorised. |
| **PUBLIC GOVERNANCE FRAMEWORK** | [IMDA: Model AI Governance Framework for Agentic AI](https://www.imda.gov.sg/resources/press-releases-factsheets-and-speeches/press-releases/2026/new-model-ai-governance-framework-for-agentic-ai) | Guidance on bounding agent autonomy and meaningful human checkpoints. It is not an endorsement of REGULATOR//GHOST. |

The demo's stable `AGT-…` identity format is inspired by registered-agent governance thinking; it is **not** a MAS SAFR naming requirement or an implementation of the proposal.

## Asset management / systemic behaviour

| Status | Primary source | What it supports |
| --- | --- | --- |
| **REGULATORY RESEARCH** | [BIS Innovation Hub: Project Logos](https://www.bis.org/project/logos) | Ongoing simulated research into LLM portfolio agents and conditions that may amplify or dampen correlated decisions. The six-agent optimise/feedback/transmit visual is a hypothetical mechanism-of-concern, **not an observed market incident**. |
| **REGULATORY RESEARCH** | [FSB: financial-stability implications of AI](https://www.fsb.org/2024/11/fsb-assesses-the-financial-stability-implications-of-artificial-intelligence/) | Identifies market correlation, common dependencies, cyber and model risk as potential vulnerabilities. |
| **REGULATORY RESEARCH** | [IOSCO: AI in capital markets consultation](https://www.iosco.org/library/pubdocs/pdf/IOSCOPD788.pdf) and [AI/ML use by intermediaries and asset managers](https://www.iosco.org/library/pubdocs/pdf/IOSCOPD684.pdf) | Documents AI uses and risks in securities markets; does not claim that this demo's correlated-agent outcome has happened. |

## SupTech

| Status | Primary source | What it supports |
| --- | --- | --- |
| **SUPERVISORY RESEARCH** | [BIS FSI: SupTech tools for prudential supervision](https://www.bis.org/publications/fsi-insight-37-suptech-tools-prudential-supervision-and-their-use-during-pandemic) | Supervisory tools can extract insights and improve efficiency while supporting—not replacing—human judgement. |

The synthetic case combines a failed-trade opening, a liquidity signal and a disputed entity classification **for teaching**. It is not adapted from a real client, trade, institution, policy text or supervisory incident. The numbers 8, 27, 486, 3.2, 76, 39 and 74% belong only to that deterministic simulation. Its runtime gate is not a statement of law or regulatory threshold.

## V3 Package 1 — primary-source verification, 11 November 2026

The main-stage regulatory lines are concise paraphrases, not quotations or endorsements. These additions supersede the older check date for the following sources only.

| Primary source | Checked support and limits |
| --- | --- |
| [MAS AI Risk Management Guidelines, 7 October 2026](https://www.mas.gov.sg/regulation/guidelines/guidelines-on-artificial-intelligence-risk-management-for-financial-institutions), [guidelines PDF](https://www.mas.gov.sg/-/media/mas-media-library/regulation/guidelines/bd/guidelines-on-artificial-intelligence-risk-management-for-financial-institutions/guidelines-on-artificial-intelligence-risk-management.pdf) | §5.9 calls for lifecycle human oversight proportionate to materiality and consideration of automation bias and decision fatigue; roles, capabilities and system design support meaningful oversight. Publication page states effective date 7 October 2027. Guidelines and supervisory expectations, not proof of Ghost compliance. |
| [FSB June 10 consultation](https://www.fsb.org/2026/06/sound-practices-for-responsible-adoption-of-artificial-intelligence-ai-consultation-report/), [PDF](https://www.fsb.org/uploads/P100626.pdf) | The agentic-risk discussion describes hundreds of intermediate steps and possible AI augmentation of monitoring; human oversight retains accountability. The stage's AI-assisted monitoring paraphrase is grounded here. |
| [FSB October 15 final sound practices](https://www.fsb.org/2026/10/sound-practices-for-responsible-adoption-of-artificial-intelligence-ai-final-report/), [PDF](https://www.fsb.org/uploads/P151026-1.pdf) | SP4 organisational adaptability and capability, SP7 fit-for-purpose data, SP9 performance assessment/testing/monitoring, SP10 effective human oversight. The stage does not label the June consultation wording as an October quotation. |
| [MAS SAFR publication](https://www.mas.gov.sg/publications/monographs-or-information-paper/2026/safeguards-for-agentic-finance-at-runtime), [SAFR V1.1](https://www.mas.gov.sg/-/media/mas-media-library/development/fintech/ai-safr/safr-v1-1.pdf) | V1.1 version history: 9 October 2026. Industry-developed reference approach under BuildFin.ai for runtime authority, human oversight and audit records. Its text distinguishes this reference approach from regulatory guidance and supervisory expectations. Ghost is not an implementation or certification of SAFR. |
| [OWASP Securing Agentic Applications V2, 10 November 2026](https://genai.owasp.org/resource/securing-agentic-applications-v2/) | Technical guidance for secure architectures, identity/access controls, runtime protection and assurance testing. Not binding financial-services regulation. |
| [Anthropic Fable 5.2 / Mythos 5.2 publication](https://www.anthropic.com/claude-fable-and-mythos-5-2), [system card](https://assets.claude.com/27d60918d218125e7504bc7354c4b4626ec56b11.pdf) | UK AI Security Institute findings reproduced in the November 2026 system card; monitorability discussion and Figure AISI.1, printed pp. 181–182. Controlled file-download evaluation: obfuscated bash scripts tested against an action-only monitor. Reported first-attempt evasion 30%, rising to 85% with repeated monitor feedback (scores and explanations). The 85% is conditional on that evaluation; it is not a general AI evasion rate, a finding about Ghost, or evidence that financial supervisory systems are compromised. The report also describes monitoring's continuing defensive value. |

The synthetic Ghost case's incomplete requirement and omitted conflict are distinct from intentional monitor evasion. The external evaluation motivates independent assurance, preserved evidence access and bounded permissions; it does not establish deception by the Ghost supervisor or inevitable deception by capable models. No external organisation supplied the synthetic trace or validated its numbers.

## V3 Package 2 — NAV primary-source verification, 11 November 2026

The NAV arc is a fictional teaching case; no source supplies its prices, endorses its arithmetic or classifies its discrepancy under a regulatory regime. Stage wording is paraphrased. Source limitations are retained in SHOW MORE.

| Primary source | Support and limits |
| --- | --- |
| [IOSCO, Recommendations on Valuing Collective Investment Schemes, June 2026](https://www.iosco.org/library/pubdocs/pdf/IOSCOPD824.pdf) | Final report FR/03/2026 consolidates and updates the earlier valuation principles. Supports documented appropriate methodologies and consistent application, independent valuation oversight/review, testing including back-testing, and documented/proportionately overseen price overrides (Recommendation 4). It does not endorse daily unsupported proxy uplifts or the Ghost example. |
| [CSSF Circular 24/856, paragraph 38](https://www.cssf.lu/wp-content/uploads/CSSF24_856eng.pdf) | Printed p.20/47 includes simultaneous or successive untreated NAV calculation errors that individually fall below the applicable tolerance but reach or exceed it in aggregate. This is a **Luxembourg regulatory example**, not a universal rule; the fictional fund is not assumed to be Luxembourg-regulated. Its regulatory NAV-error tolerances are entirely distinct from Ghost's **fictional 1% daily NAV movement** threshold. The independently reconstructed Ghost discrepancy is not claimed to have already received a formal regulatory classification. |
| [MAS AIRM, 7 October 2026](https://www.mas.gov.sg/regulation/guidelines/guidelines-on-artificial-intelligence-risk-management-for-financial-institutions), [guidelines PDF](https://www.mas.gov.sg/-/media/mas-media-library/regulation/guidelines/bd/guidelines-on-artificial-intelligence-risk-management-for-financial-institutions/guidelines-on-artificial-intelligence-risk-management.pdf) | §5.9: lifecycle human oversight, assigned roles, competent personnel, escalation design, automation bias and decision fatigue. Relevant capabilities support specialist challenge. Effective 7 October 2027. |
| [FSB October 2026 final sound practices](https://www.fsb.org/2026/10/sound-practices-for-responsible-adoption-of-artificial-intelligence-ai-final-report/) | SP4 organisational adaptability; SP7 fit-for-purpose data; SP9 assessment, testing and monitoring; SP10 effective human oversight. These governance practices are not valuation tolerances or a certification of the demonstration. |
| [OWASP Securing Agentic Applications V2](https://genai.owasp.org/resource/securing-agentic-applications-v2/) | Technical guidance on secure architecture, identity/access controls, permissions, runtime protection/monitoring and assurance. It supports distinguishing observation from enforcement authority, and is neither an accounting standard nor a financial regulator. Available in the evidence drawer, not added to the regulatory main screen. |

In this deterministic case an inadequately specified policy/implementation permits reuse of a proxy without adequate revalidation. The monitor warns before release, the human receives an advisory concern without specialist determination, and the workflow permits publication. This does not establish deliberate deception, hallucination or reward hacking. The specialist comparison is established after the week's publications, not known to every reviewer in advance.


## V3 Package 3 — verified 11 November 2026

All five supplied primary pages were retrieved successfully. The following are concise paraphrases, not regulatory quotations or endorsement. Detailed synthetic assumptions and audit data are separate from these sources.

| Status | Primary source | Supported use and limitation |
| --- | --- | --- |
| **ONGOING RESEARCH PROGRAMME** | [BIS Project Logos](https://www.bis.org/project/logos) | Simulated heuristic and LLM portfolio managers; conditions amplifying or dampening correlated allocation. Ongoing research objectives are not established experimental findings. **Ghost’s USD funding, FX, collateral and settlement sequence is a separate original synthetic extension**, not a result demonstrated by Logos. |
| **OFFICIAL SPEECH** | [MAS Chia Der Jiun, 9 October 2026](https://www.mas.gov.sg/news/speeches/2026/building-trusted-foundations-for-digital-finance) | Agents moving money faster for smaller incentives may have liquidity and collateral implications; authority, identity, permissions and accountability matter. Not a claim that this simulation occurred. |
| **INDIVIDUAL OFFICIAL SPEECH** | [Governor Waller, Payments in the Age of AI Agents, 28 September 2026](https://www.federalreserve.gov/newsevents/speech/waller20260928a.htm) | Cross-border payment routing, FX conversion, liquidity optimisation and netting; delegated authentication, liability and fraud. Attributed to Governor Waller, not a binding Federal Reserve policy. |
| **FINANCIAL MECHANISM RESEARCH** | [BIS CGFS Papers 71, 12 March 2026](https://www.bis.org/publications/cgfs-paper-71-foreign-currency-funding-risk-and-cross-border-liquidity) | Foreign-currency liquidity shortages, hedging/rollover risk, cross-border funding and last-resort central-bank facilities. Provides mechanism context, not proof or calibration of Ghost’s outcome. |
| **INTERNATIONAL SOUND PRACTICES** | [FSB final report, 15 October 2026](https://www.fsb.org/2026/10/sound-practices-for-responsible-adoption-of-artificial-intelligence-ai-final-report/) | Organisational adaptability, data governance, performance monitoring, effective human oversight and third-party/concentration risk. Neither regulatory certification nor endorsement of Ghost. |

The visible BIS anchor belongs only to the systemic kicker. Other primary references and qualifications stay in SHOW MORE. Beat 8 is Ghost’s original conceptual synthesis; it does not assign autonomous legal accountability to an AI model or present a new binding regulatory framework.

## Arc 2 revision — system-level assurance, checked 12 November 2026

| Evidence type | Primary source | Supported use and limits |
| --- | --- | --- |
| **SYSTEM-EVALUATION GUIDANCE / RESEARCH** | [Singapore AISI: How should evaluators test AI systems (as opposed to models)?](https://sgaisi.sg/resources/how-should-evaluators-test-ai-systems-as-opposed-to-models/) (8 July 2026) | Deployment-context evaluation, realistic tools and workflows, representative risk coverage and domain expertise. Model benchmark accuracy alone does not establish fitness of a deployed system. No evaluation or endorsement of Ghost is claimed. |
| **AI-CONTROL RESEARCH / TECHNICAL ROADMAP** | [Google DeepMind: Securing internal systems against increasingly capable and imperfectly aligned AI](https://deepmind.google/blog/securing-the-future-of-ai-agents/) | Monitoring coverage (fraction of traffic monitored), recall (misaligned behaviours caught) and time-to-response in DeepMind's internal control setting. Applying the coverage idea to a missing financial-policy check is Ghost's teaching analogy, not a claim that the roadmap evaluates financial regulatory compliance or proves this synthetic failure. |
| **SCIENTIFIC RESEARCH PRIORITIES — not policy** | [2026 Singapore Consensus, requested reference](https://aipriorities.org/) and [verified publication host](https://aisafetypriorities.org/) | Human oversight and AI-assisted oversight are supporting research context. The supplied host and PDF could not be retrieved in this session; the 2026 publication and its scientific/non-policy status were verified at the alternate publication host. Neither is a financial regulation or endorsement of Ghost. |

The UK AISI Mythos 5.2 action-monitor evasion finding remains in the research drawer as a **separate adversarial monitorability concern**, with its existing conditions and repeated-feedback qualification. It is not the cause of the synthetic classification/policy omission and is no longer an Arc 2 headline.

**Original synthetic policy case, not sourced law:** Jurisdiction J-7, entity relationship record REL-X-VERIFIED-01, exposure EXPOSURE-X-USD-01 and institutional policy INST-SAN-07 are fictional teaching records. The approved, verified policy is effective from 1 October 2026 until (exclusive) 1 January 2027. It covers a specified pending new unsecured USD liquidity extension on 2 November 2026, with a matched entity and relationship, jurisdiction and restriction context. It requires protective restriction of this exposure pending its own authorised sanctions/compliance handling. It does not impose a real legal obligation, establish a sanctions violation, cover all central banks or all transactions in a jurisdiction, or authorise the original AI proposal. No protective hold is executed by the demonstration.
