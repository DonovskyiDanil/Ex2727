BEGIN;

WITH top_creatives AS (
    SELECT id
    FROM "Users"
    WHERE role = 'creator'
    ORDER BY rating DESC, id ASC
    LIMIT 3
),
rewarded AS (
    INSERT INTO "UserRewards" ("userId", type, reference, amount, "createdAt")
    SELECT id, 'top_creative_bonus', 'exam-top-creative-bonus', 10.00, CURRENT_TIMESTAMP
    FROM top_creatives
    ON CONFLICT ("userId", type, reference) DO NOTHING
    RETURNING "userId", amount
)
UPDATE "Users" u
SET balance = u.balance + rewarded.amount
FROM rewarded
WHERE u.id = rewarded."userId"
RETURNING u.id, u.email, u.rating, rewarded.amount AS bonus;

COMMIT;
