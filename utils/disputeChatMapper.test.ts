import { strict as assert } from "node:assert";
import { mapDisputeMessagesToChatItems } from "./disputeChatMapper";

const apiMessages = [
  {
    id: "evt-1",
    createdAt: "2026-07-25T06:30:00.000Z",
    triggeredBy: "user-1",
    payload: { message: "I have uploaded the evidence package." },
  },
  {
    id: "evt-2",
    createdAt: "2026-07-25T06:31:00.000Z",
    triggeredBy: "user-2",
    payload: { message: "Thanks, I will review it shortly." },
  },
];

const mapped = mapDisputeMessagesToChatItems(apiMessages, {
  currentUserId: "user-1",
  userLabel: "You",
  counterpartyLabel: "Other party",
});

assert.equal(mapped.length, 2);
assert.equal(mapped[0].content, "I have uploaded the evidence package.");
assert.equal(mapped[0].isUserMessage, true);
assert.equal(mapped[1].isUserMessage, false);
assert.equal(mapped[1].sender, "Other party");
console.log("disputeChatMapper test passed");
