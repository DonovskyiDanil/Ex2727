BEGIN;

WITH eligible AS (
    SELECT c."userId", ROUND(SUM(c.prize) * 0.10, 2) AS cashback
    FROM "Contests" c
    JOIN "Users" u ON u.id = c."userId"
    WHERE u.role = 'customer'
      AND c."createdAt" >= TIMESTAMP '2024-12-25 00:00:00'
      AND c."createdAt" < TIMESTAMP '2025-01-15 00:00:00'
    GROUP BY c."userId"
    HAVING SUM(c.prize) > 0
),
rewarded AS (
    INSERT INTO "UserRewards" ("userId", type, reference, amount, "createdAt")
    SELECT "userId", 'holiday_cashback', '2024-12-25:2025-01-14', cashback, CURRENT_TIMESTAMP
    FROM eligible
    ON CONFLICT ("userId", type, reference) DO NOTHING
    RETURNING "userId", amount
)
UPDATE "Users" u
SET balance = u.balance + rewarded.amount
FROM rewarded
WHERE u.id = rewarded."userId"
RETURNING u.id, u.email, rewarded.amount AS cashback;

COMMIT;
