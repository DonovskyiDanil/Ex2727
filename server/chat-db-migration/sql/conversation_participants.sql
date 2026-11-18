CREATE TABLE IF NOT EXISTS "ConversationParticipants" (
    "conversationId" INTEGER NOT NULL REFERENCES "Conversations"(id) ON DELETE CASCADE,
    "userId" INTEGER NOT NULL REFERENCES "Users"(id) ON DELETE CASCADE,
    "favoriteList" BOOLEAN NOT NULL DEFAULT FALSE,
    "blackList" BOOLEAN NOT NULL DEFAULT FALSE,
    PRIMARY KEY ("conversationId", "userId")
);