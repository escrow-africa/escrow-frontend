export type DisputeStatus = "ACTIVE_CASE_DETAILS" | "INVESTIGATION_ACTIVE" | "RESOLVED";

export type BreachCategory = 
  | "Quality Issue"
  | "Delayed Delivery / Missed Deadline"
  | "Communication Cessation / Idle Vendor"
  | "Communication Cessation / Idle Vendor"
  | "Out of Scope Demands / Contract Violation"
  | "Other Unresolved Dispute";

export type TimelineStage = "COMPLAINT_RAISED" | "EVIDENCE_LOADED" | "MEDIATION_ACTIVE" | "SETTLEMENT_SETTLED";

export interface DisputeCard {
  id: string;
  issueId: string;
  orderRef: string;
  date: string;
  title: string;
  description: string;
  amount: string;
  status: "INVESTIGATION_ACTIVE" | "ACTIVE_CASE_DETAILS";
}

export interface Dispute extends DisputeCard {
  claimStatement: string;
  breachCategory: BreachCategory;
  relatedContract: string;
  timelineStage: TimelineStage;
  currentStageNumber: number; // e.g., 3 of 4
  totalStages: number; // e.g., 4
}

export interface EvidenceItem {
  id: string;
  type: "message" | "file";
  sender: string;
  senderInitial: string;
  timestamp: string;
  content?: string;
  fileName?: string;
  fileStatus?: "ANCHORED" | "PENDING";
  isUserMessage?: boolean;
}

export interface CompromiseOffer {
  id: string;
  status: "draft" | "proposed" | "accepted";
  amount?: string;
  terms?: string;
}
