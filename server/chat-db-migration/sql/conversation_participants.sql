CREATE TABLE IF NOT EXISTS "ConversationParticipants" (
    "conversationId" INTEGER REFERENCES "Conversations"(id) ON DELETE CASCADE,
    "userId" INTEGER REFERENCES "Users"(id) ON DELETE CASCADE,
    PRIMARY KEY ("conversationId", "userId")
);