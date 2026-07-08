"use client";

import React, { useState } from "react";
import Link from "next/link";
import DisputesList from "../../../components/dashboard/disputes/DisputesList";
import { DisputeCard as DisputeCardType } from "../../../types/disputes";

const MOCK_DISPUTES: DisputeCardType[] = [
  {
    id: "DSP-001",
    issueId: "DIS-593",
    orderRef: "BUY-883",
    date: "2026-06-21",
    title: "Buggy Deliverables",
    description: "Figma grids are broken when imported into production tailwind components.",
    amount: "₦79,000",
    status: "INVESTIGATION_ACTIVE",
  },
  {
    id: "DSP-002",
    issueId: "DIS-594",
    orderRef: "BUY-711",
    date: "2026-06-21",
    title: "Out of Scope",
    description: "Figma grids are broken when imported into production tailwind components.",
    amount: "₦102,000",
    status: "INVESTIGATION_ACTIVE",
  },
];

export default function DisputesPage() {
  const [disputes, setDisputes] = useState<DisputeCardType[]>(MOCK_DISPUTES);

  return (
    <div className="space-y-8">
      <DisputesList
        disputes={disputes}
        onRaiseDispute={() => {}} // Removed - using Link now
      />
    </div>
  );
}
