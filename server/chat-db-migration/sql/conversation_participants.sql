CREATE TABLE IF NOT EXISTS "ConversationParticipants" (
<<<<<<< HEAD
    "conversationId" INTEGER NOT NULL REFERENCES "Conversations"(id) ON DELETE CASCADE,
    "userId" INTEGER NOT NULL REFERENCES "Users"(id) ON DELETE CASCADE,
    "favoriteList" BOOLEAN NOT NULL DEFAULT FALSE,
    "blackList" BOOLEAN NOT NULL DEFAULT FALSE,
=======
    "conversationId" INTEGER REFERENCES "Conversations"(id) ON DELETE CASCADE,
    "userId" INTEGER REFERENCES "Users"(id) ON DELETE CASCADE,
>>>>>>> f7c8c07f8e0c3520ffe12f011633a5a3b1b17bf8
    PRIMARY KEY ("conversationId", "userId")
);