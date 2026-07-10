"use client";

import { useState, useEffect } from "react";
import { EvidenceItemData } from "../components/dashboard/disputes/EvidenceChat";

const MOCK_INITIAL_MESSAGES: EvidenceItemData[] = [
  {
    id: "EV-001",
    type: "message",
    sender: "Louis Client",
    senderInitial: "L",
    timestamp: "2026-06-21 • 05:18",
    content: "Louis Client uploaded verified evidence package: Flaws-ui.png",
    isUserMessage: false,
  },
  {
    id: "EV-003",
    type: "message",
    sender: "Louis Client",
    senderInitial: "L",
    timestamp: "2026-06-21 • 05:18",
    content: "The evidences as regards to this project has been dropped.",
    isUserMessage: false,
  },
  {
    id: "EV-004",
    type: "message",
    sender: "Madeleine Nkiru",
    senderInitial: "M",
    timestamp: "2026-06-21 • 05:20",
    content: "I have received your comment. Please let me know what exact changes",
    isUserMessage: true,
  },
];

export function useDisputeChat(disputeId: string) {
  const [messages, setMessages] = useState<EvidenceItemData[]>(MOCK_INITIAL_MESSAGES);
  const [isLoading, setIsLoading] = useState(false);
  const [isConnected, setIsConnected] = useState(true);

  // Hook handles sending messages
  const sendMessage = async (content: string) => {
    if (!content.trim()) return;

    const timestamp = new Date().toLocaleDateString("en-US", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).replace(/\//g, "-") + " • " + new Date().toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });

    const userMessage: EvidenceItemData = {
      id: `EV-${Date.now()}`,
      type: "message",
      sender: "Madeleine Nkiru",
      senderInitial: "M",
      timestamp,
      content,
      isUserMessage: true,
    };

    // 1. Optimistic Update
    setMessages((prev) => [...prev, userMessage]);

    // Simulating backend / WebSocket roundtrip
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 600));
    setIsLoading(false);

    // 2. Simulated Auto-Reply (For mock mode)
    setTimeout(() => {
      const replyTimestamp = new Date().toLocaleDateString("en-US", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      }).replace(/\//g, "-") + " • " + new Date().toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      });

      const mockReply: EvidenceItemData = {
        id: `EV-${Date.now() + 1}`,
        type: "message",
        sender: "Louis Client",
        senderInitial: "L",
        timestamp: replyTimestamp,
        content: `Thanks for the response. I've noted the request: "${content}". We will align with the arbitrator shortly.`,
        isUserMessage: false,
      };

      setMessages((prev) => [...prev, mockReply]);
    }, 1500);
  };

  return {
    messages,
    sendMessage,
    isLoading,
    isConnected,
  };
}
