<<<<<<< HEAD
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
=======

SELECT u.id, u.email, SUM(c.prize) as total_spent, SUM(c.prize) * 0.1 as cashback
FROM "Users" u
JOIN "Contests" c ON u.id = c."userId"
WHERE u.role = 'customer' 
  AND c."createdAt" BETWEEN '2024-12-25 00:00:00' AND '2025-01-14 23:59:59'
GROUP BY u.id;


INSERT INTO "Contests" 
("title", "createdAt", "userId", "prize", "status", "orderId", "priority")
VALUES 
('Holiday Logo', '2025-01-05 12:00:00', 1, 1000, 'finished', 'order-xyz-1', 1),
('New Year Brand', '2024-12-30 15:00:00', 2, 500, 'finished', 'order-xyz-2', 1);


UPDATE "Users"
SET balance = balance + subquery.cashback
FROM (
    SELECT u.id, SUM(c.prize) * 0.1 as cashback
    FROM "Users" u
    JOIN "Contests" c ON u.id = c."userId"
    WHERE u.role = 'customer'
      AND c."createdAt" >= '2024-12-25 00:00:00'
      AND c."createdAt" <= '2025-01-14 23:59:59'
    GROUP BY u.id
) AS subquery
WHERE "Users".id = subquery.id;


SELECT id, email, balance FROM "Users" WHERE id IN (1, 2);
>>>>>>> f7c8c07f8e0c3520ffe12f011633a5a3b1b17bf8
