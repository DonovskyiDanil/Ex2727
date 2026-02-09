
INSERT INTO "Users" 
("firstName", "lastName", "displayName", "password", "email", "role", "rating", "balance")
VALUES 
('Artur', 'Design', 'ArtStyle', 'pass123', 'artur_final@test.com', 'creator', 5.0, 0),
('Bohdan', 'Creative', 'BoCreator', 'pass123', 'bo_final@test.com', 'creator', 4.9, 0),
('Svitlana', 'Idea', 'SvetaIdea', 'pass123', 'sveta_final@test.com', 'creator', 4.8, 0),
('Danylo', 'Work', 'DanyaW', 'pass123', 'danya_final@test.com', 'creator', 4.7, 0),
('Olena', 'Pro', 'Olenka', 'pass123', 'olena_final@test.com', 'creator', 4.6, 0),
('Ihor', 'Master', 'MasterIt', 'pass123', 'ihor_final@test.com', 'creator', 4.5, 0),
('Anna', 'Artist', 'Anyuta', 'pass123', 'anna_final@test.com', 'creator', 4.4, 0),
('Viktor', 'Brand', 'VityaB', 'pass123', 'viktor_final@test.com', 'creator', 4.3, 0),
('Yulia', 'Vision', 'Yulyasha', 'pass123', 'yulia_final@test.com', 'creator', 4.2, 0),
('Roman', 'Logo', 'RomaL', 'pass123', 'roman_final@test.com', 'creator', 4.1, 0)
ON CONFLICT (email) DO NOTHING; 


UPDATE "Users"
SET balance = balance + 10
WHERE id IN (
    SELECT id 
    FROM "Users" 
    WHERE role = 'creator' 
    ORDER BY rating DESC 
    LIMIT 3
);


SELECT id, "firstName", "lastName", rating, balance, role
FROM "Users" 
WHERE role = 'creator' 
ORDER BY rating DESC 
LIMIT 3;