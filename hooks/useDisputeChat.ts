"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { disputeApi } from "../api/dispute";
import { EvidenceItemData } from "../components/dashboard/disputes/EvidenceChat";
import { mapDisputeMessagesToChatItems } from "../utils/disputeChatMapper";

const PAGE_SIZE = 30;

export function useDisputeChat(disputeId: string, currentUserId?: string | null, counterpartyLabel = "Other Party") {
  const [messages, setMessages] = useState<EvidenceItemData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isConnected, setIsConnected] = useState(true);
  const [hasMore, setHasMore] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  // Raw message records keyed by id - the backend returns newest-first pages, but polling for
  // new messages and "load earlier" both merge into this map so neither loses what the other
  // already fetched, regardless of how the newest-30 window drifts between polls.
  const recordsRef = useRef<Map<string, any>>(new Map());
  const highestLoadedPageRef = useRef(0);

  const applyRecords = useCallback(() => {
    const all = Array.from(recordsRef.current.values());
    all.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
    setMessages(
      mapDisputeMessagesToChatItems(all, {
        currentUserId: currentUserId || undefined,
        userLabel: "You",
        counterpartyLabel,
      })
    );
  }, [currentUserId, counterpartyLabel]);

  const loadLatest = useCallback(async () => {
    if (!disputeId) return;

    try {
      const response: any = await disputeApi.getMessages(disputeId, 1, PAGE_SIZE);
      const data: any[] = Array.isArray(response) ? response : response?.data || [];
      data.forEach((m) => recordsRef.current.set(m.id, m));

      const total = typeof response?.total === "number" ? response.total : data.length;
      highestLoadedPageRef.current = Math.max(highestLoadedPageRef.current, 1);
      setHasMore(recordsRef.current.size < total);
      applyRecords();
      setIsConnected(true);
    } catch (error) {
      console.error("Failed to load dispute messages", error);
      setIsConnected(false);
    }
  }, [disputeId, applyRecords]);

  const loadOlder = useCallback(async () => {
    if (!disputeId) return;

    setIsLoadingMore(true);
    try {
      const nextPage = highestLoadedPageRef.current + 1;
      const response: any = await disputeApi.getMessages(disputeId, nextPage, PAGE_SIZE);
      const data: any[] = Array.isArray(response) ? response : response?.data || [];
      data.forEach((m) => recordsRef.current.set(m.id, m));

      const total = typeof response?.total === "number" ? response.total : recordsRef.current.size;
      highestLoadedPageRef.current = nextPage;
      setHasMore(recordsRef.current.size < total);
      applyRecords();
    } catch (error) {
      console.error("Failed to load earlier dispute messages", error);
    } finally {
      setIsLoadingMore(false);
    }
  }, [disputeId, applyRecords]);

  useEffect(() => {
    let isMounted = true;
    let pollTimer: ReturnType<typeof setInterval> | undefined;

    recordsRef.current = new Map();
    highestLoadedPageRef.current = 0;
    setMessages([]);
    setHasMore(false);

    const refreshMessages = async () => {
      if (!isMounted) return;
      setIsLoading(true);
      try {
        await loadLatest();
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    void refreshMessages();
    pollTimer = setInterval(() => {
      void loadLatest();
    }, 10000);

    return () => {
      isMounted = false;
      if (pollTimer) clearInterval(pollTimer);
    };
  }, [disputeId, loadLatest]);

  const sendMessage = async (content: string) => {
    if (!content.trim() || !disputeId) return;

    setIsLoading(true);
    try {
      await disputeApi.sendMessage(disputeId, content);
      await loadLatest();
      setIsConnected(true);
    } catch (error) {
      console.error("Failed to send dispute message", error);
      setIsConnected(false);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    messages,
    setMessages,
    sendMessage,
    isLoading,
    isConnected,
    hasMore,
    isLoadingMore,
    loadOlder,
  };
}
