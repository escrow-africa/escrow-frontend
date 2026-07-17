import React, { useState } from "react";
import { Send, Sliders, Check } from "lucide-react";

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
  onProposeSettlement?: () => void;
}

export default function EvidenceChat({
  evidenceItems,
  onSendMessage,
  onProposeSettlement,
}: EvidenceChatProps) {
  const [messageInput, setMessageInput] = useState("");

  const handleSend = () => {
    if (messageInput.trim()) {
      onSendMessage?.(messageInput);
      setMessageInput("");
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-6 flex flex-col h-[550px] shadow-[0_2px_10px_-4px_rgba(0,0,0,0.02)]">
      {/* Chat Header */}
      <div className="flex justify-between items-start border-b border-gray-50 pb-4 mb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
            <p className="text-xs font-bold text-gray-900 uppercase tracking-wider">
              Cryptographic Evidence Chat
            </p>
          </div>
          <p className="text-xs text-gray-400 mt-1">
            Decentralized logs are signed, immutable, and broker-accessible.
          </p>
        </div>
        <button 
          onClick={onProposeSettlement}
          className="px-4 py-2 bg-[#0F3D2E] hover:bg-[#185541] text-white rounded-xl font-bold text-xs transition-colors flex items-center gap-2 shadow-sm"
        >
          <Sliders size={14} className="text-white" />
          <span>Propose Settlement</span>
        </button>
      </div>

      {/* Evidence Items (Chat History) */}
      <div className="flex-1 overflow-y-auto space-y-5 mb-4 pr-1 scrollbar-thin">
        {evidenceItems.map((item) => {
          const isUser = item.isUserMessage;
          let avatarBg = isUser ? "bg-[#0F3D2E] text-white" : "bg-[#FFF0F0] text-[#E53E3E] border border-[#FFE3E3]";
          if (item.sender === "EscrowAfrica Ledger") {
            avatarBg = "bg-[#F3E8FF] text-[#7E22CE] border border-[#E5E7EB]";
          }

          return (
            <div
              key={item.id}
              className={`flex gap-3 items-start ${isUser ? "flex-row-reverse" : ""}`}
            >
              {/* Avatar */}
              <div
                className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 shadow-sm ${avatarBg}`}
              >
                {item.senderInitial}
              </div>

              {/* Message Block */}
              <div className={`flex flex-col max-w-[70%] ${isUser ? "items-end" : "items-start"}`}>
                {/* Meta details ABOVE bubble */}
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[11px] font-bold text-gray-800">
                    {item.sender}
                  </span>
                  <span className="text-[10px] text-gray-400">
                    {item.timestamp}
                  </span>
                </div>

                {/* Bubble content */}
                {item.type === "message" ? (
                  <div
                    className={`px-4 py-3 rounded-2xl text-xs leading-relaxed shadow-[0_1px_3px_rgba(0,0,0,0.01)] ${
                      isUser
                        ? "bg-[#0F3D2E] text-white rounded-tr-none"
                        : item.sender === "EscrowAfrica Ledger"
                        ? "bg-[#FAF5FF] text-[#6B21A8] border border-[#F3E8FF] rounded-tl-none"
                        : "bg-[#F3F4F6] text-gray-800 rounded-tl-none border border-gray-50"
                    }`}
                  >
                    <p>{item.content}</p>
                  </div>
                ) : (
                  <div className="bg-[#FAFBFA] border border-gray-100 rounded-2xl p-3 shadow-sm rounded-tl-none">
                    <p className="text-xs font-bold text-gray-800 mb-1.5 flex items-center gap-1.5">
                      📄 {item.fileName}
                    </p>
                    {item.fileStatus && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-green-50 border border-green-200 text-green-700 rounded-md text-[9px] font-bold">
                        <Check size={10} />
                        {item.fileStatus}
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Input Area */}
      <div className="flex items-center gap-2 bg-white border border-gray-100 rounded-2xl p-1.5 shadow-[0_2px_8px_-3px_rgba(0,0,0,0.05)]">
        <input
          type="text"
          placeholder="Type your message or rebuttal"
          value={messageInput}
          onChange={(e) => setMessageInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          className="flex-1 px-4 py-2 bg-transparent text-xs text-gray-900 focus:outline-none placeholder:text-gray-400"
        />
        <button
          onClick={handleSend}
          className="w-9 h-9 rounded-xl bg-[#0F3D2E] text-white flex items-center justify-center hover:bg-[#185541] transition-colors shadow-sm flex-shrink-0"
        >
          <Send size={14} className="text-white" />
        </button>
      </div>
    </div>
  );
}
