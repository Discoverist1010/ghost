// Explanatory custody responsibilities, not replacements for retained trace actors.
export const SETTLEMENT_WORKFLOW = Object.freeze([
  {role:'Case Orchestrator',tasks:['Register the failed-trade exception','Define the investigation scope','Consolidate the investigation evidence']},
  {role:'Settlement Instructions Agent',tasks:['Compare trade and settlement instructions','Validate security and quantity fields','Check the instructed settlement date','Compare delivery and receipt terms']},
  {role:'Custody Position Agent',tasks:['Confirm the custody holding','Check securities available for delivery','Identify reservations or encumbrances']},
  {role:'Cash & FX Agent',tasks:['Check the required currency balance','Confirm funding requirements','Check FX value-date alignment','Check payment cut-off times']},
  {role:'Counterparty & SSI Agent',tasks:['Confirm counterparty identity','Validate standing settlement instructions','Compare receiving account details','Check the instruction version in force']},
  {role:'Messaging & Network Agent',tasks:['Review settlement-message status','Identify missing acknowledgements','Trace rejection or failure codes']},
  {role:'Reference Data & Market Calendar Agent',tasks:['Validate security reference data','Check relevant market holidays','Check market and custodian deadlines']},
  {role:'Supervisory / Materiality Agent',tasks:['Rank evidence by materiality','Identify the issue requiring attention','Prepare a concise review summary']},
]);
