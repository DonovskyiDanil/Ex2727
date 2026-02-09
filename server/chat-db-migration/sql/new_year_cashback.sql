
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