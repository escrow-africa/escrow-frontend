import type { EvidenceItemData } from "../components/dashboard/disputes/EvidenceChat";

interface DisputeMessageApiItem {
  id: string;
  createdAt?: string;
  triggeredBy?: string;
  payload?: {
    message?: string;
    [key: string]: unknown;
  };
}

interface ChatMapperOptions {
  currentUserId?: string;
  userLabel?: string;
  counterpartyLabel?: string;
}

export function mapDisputeMessagesToChatItems(
  messages: DisputeMessageApiItem[],
  options: ChatMapperOptions = {}
): EvidenceItemData[] {
  const {
    currentUserId,
    userLabel = "You",
    counterpartyLabel = "Other party",
  } = options;

  return messages.map((message, index) => {
    const content = typeof message.payload?.message === "string"
      ? message.payload.message
      : "Shared a dispute update";

    const isUserMessage = Boolean(currentUserId && message.triggeredBy === currentUserId);

    return {
      id: message.id || `chat-${index}`,
      type: "message",
      sender: isUserMessage ? userLabel : counterpartyLabel,
      senderInitial: isUserMessage ? userLabel.charAt(0).toUpperCase() : counterpartyLabel.charAt(0).toUpperCase(),
      timestamp: formatTimestamp(message.createdAt),
      content,
      isUserMessage,
    };
  });
}

function formatTimestamp(value?: string) {
  if (!value) return "Recently updated";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Recently updated";

  return `${date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).replace(/\//g, "-")} • ${date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  })}`;
}
