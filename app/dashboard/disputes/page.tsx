"use client";

import React, { useEffect, useState } from "react";
import DisputesList from "../../../components/dashboard/disputes/DisputesList";
import { disputeApi } from "../../../api/dispute";
import { DisputeCard as DisputeCardType } from "../../../types/disputes";

const DISPUTES_PER_PAGE = 10;

export default function DisputesPage() {
  const [disputes, setDisputes] = useState<DisputeCardType[]>([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    const fetchDisputes = async () => {
      setLoading(true);
      setError(null);

      try {
        const response: any = await disputeApi.getMine(page, DISPUTES_PER_PAGE);
        const data: any[] = Array.isArray(response) ? response : response?.data || [];
        const mapped: DisputeCardType[] = data.map((item: any): DisputeCardType => ({
          id: item.id,
          issueId: item.id,
          orderRef: item.relatedContractId || item.contract || "N/A",
          date: item.createdAt ? new Date(item.createdAt).toLocaleDateString() : "",
          title: item.claimDescription || "Dispute case",
          description: item.claimDescription || item.description || "",
          amount: item.disputedAmount ? `₦${Number(item.disputedAmount).toLocaleString()}` : "",
          status: item.status === "UNDER_REVIEW" ? "INVESTIGATION_ACTIVE" : "ACTIVE_CASE_DETAILS",
        }));

        if (mounted) {
          setDisputes(mapped);
          setTotal(typeof response?.total === 'number' ? response.total : mapped.length);
        }
      } catch (err: any) {
        if (mounted) setError(err?.response?.data?.message || "Failed to load disputes");
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchDisputes();
    return () => {
      mounted = false;
    };
  }, [page]);

  return (
    <div className="space-y-8">
      {error ? <p className="text-sm text-red-600">{error}</p> : null}
      {loading ? <p className="text-sm text-gray-500">Loading disputes…</p> : null}
      <DisputesList
        disputes={disputes}
        page={page}
        limit={DISPUTES_PER_PAGE}
        total={total}
        onPageChange={setPage}
        onRaiseDispute={() => {}}
      />
    </div>
  );
}
