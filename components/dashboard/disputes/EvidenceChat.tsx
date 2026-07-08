import React, { useState } from "react";
import { Send, Download, Check } from "lucide-react";

export interface EvidenceItemData {
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

interface EvidenceChatProps {
  evidenceItems: EvidenceItemData[];
  onSendMessage?: (message: string) => void;
}

export default function EvidenceChat({
  evidenceItems,
  onSendMessage,
}: EvidenceChatProps) {
  const [messageInput, setMessageInput] = useState("");

  const handleSend = () => {
    if (messageInput.trim()) {
      onSendMessage?.(messageInput);
      setMessageInput("");
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-6 flex flex-col h-[600px]">
      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-4">
        Cryptographic Evidence Chat
      </p>

      {/* Evidence Items */}
      <div className="flex-1 overflow-y-auto space-y-4 mb-4 pr-2">
        {evidenceItems.map((item) => (
          <div
            key={item.id}
            className={`flex gap-3 ${item.isUserMessage ? "flex-row-reverse" : ""}`}
          >
            {/* Avatar */}
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                item.isUserMessage
                  ? "bg-[#0F3D2E] text-white"
                  : "bg-gray-200 text-gray-700"
              }`}
            >
              {item.senderInitial}
            </div>

            {/* Message/File Content */}
            <div className={`flex-1 ${item.isUserMessage ? "text-right" : ""}`}>
              <div className="flex items-center gap-2 mb-1">
                <p className="text-xs font-bold text-gray-900">{item.sender}</p>
                <p className="text-xs text-gray-500">{item.timestamp}</p>
              </div>

              {item.type === "message" ? (
                <div
                  className={`inline-block max-w-xs p-3 rounded-lg ${
                    item.isUserMessage
                      ? "bg-[#0F3D2E] text-white"
                      : "bg-gray-50 text-gray-900"
                  }`}
                >
                  <p className="text-sm">{item.content}</p>
                </div>
              ) : (
                <div className="inline-block bg-gray-50 border border-gray-100 rounded-lg p-3">
                  <p className="text-xs font-medium text-gray-900 mb-2">
                    {item.fileName}
                  </p>
                  {item.fileStatus && (
                    <div className="flex items-center gap-1">
                      <Check size={12} className="text-green-600" />
                      <span className="text-xs font-bold text-green-600">
                        {item.fileStatus}
                      </span>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Input Area */}
      <div className="flex gap-2">
        <input
          type="text"
          placeholder="Type your message or rebuttal"
          value={messageInput}
          onChange={(e) => setMessageInput(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && handleSend()}
          className="flex-1 px-4 py-3 rounded-lg border border-gray-100 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-[#0F3D2E] focus:border-transparent"
        />
        <button
          onClick={handleSend}
          className="w-12 h-12 rounded-lg bg-[#0F3D2E] text-white flex items-center justify-center hover:bg-[#185541] transition-colors"
        >
          <Send size={18} />
        </button>
      </div>
    </div>
  );
}
