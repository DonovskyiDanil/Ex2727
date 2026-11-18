CREATE TABLE IF NOT EXISTS "UserRewards" (
    id SERIAL PRIMARY KEY,
    "userId" INTEGER NOT NULL REFERENCES "Users"(id) ON DELETE CASCADE,
    type VARCHAR(40) NOT NULL,
    reference VARCHAR(80) NOT NULL,
    amount DECIMAL(12, 2) NOT NULL,
    "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "UserRewards_user_type_reference_unique"
        UNIQUE ("userId", type, reference)
);
