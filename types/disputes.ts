export type DisputeStatus = "OPEN" | "UNDER_REVIEW" | "RESOLVED" | "REJECTED" | "ACTIVE_CASE_DETAILS" | "INVESTIGATION_ACTIVE";

export type BreachCategory =
  | "Quality Issue"
  | "Delayed Delivery / Missed Deadline"
  | "Communication Cessation / Idle Vendor"
  | "Out of Scope Demands / Contract Violation"
  | "Other Unresolved Dispute";

export type TimelineStage = "COMPLAINT_RAISED" | "EVIDENCE_LOADED" | "MEDIATION_ACTIVE" | "SETTLEMENT_SETTLED";

export interface DisputeCard {
  id: string;
  issueId?: string;
  orderRef?: string;
  date?: string;
  title: string;
  description?: string;
  amount?: string;
  status: DisputeStatus;
}

export interface Dispute extends DisputeCard {
  claimStatement?: string;
  breachCategory?: BreachCategory;
  relatedContract?: string;
  relatedContractId?: string;
  timelineStage?: TimelineStage;
  currentStageNumber?: number;
  totalStages?: number;
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

export interface DisputeMessageRecord {
  id: string;
  createdAt?: string;
  triggeredBy?: string;
  payload?: {
    message?: string;
    [key: string]: unknown;
  };
}

export interface CompromiseOffer {
  id: string;
  status: "draft" | "proposed" | "accepted";
  amount?: string;
  terms?: string;
}

export interface CreateDisputePayload {
  relatedContractId?: string;
  contract?: string;
  breachCategory?: string;
  disputedAmount?: number;
  amount?: number;
  claimDescription?: string;
  description?: string;
}

