
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'enum_Users_role') THEN
        CREATE TYPE "enum_Users_role" AS ENUM('customer', 'creator', 'admin', 'moderator');
    ELSE
        BEGIN
            ALTER TYPE "enum_Users_role" ADD VALUE 'admin';
        EXCEPTION
            WHEN duplicate_object THEN null;
        END;
        BEGIN
            ALTER TYPE "enum_Users_role" ADD VALUE 'moderator';
        EXCEPTION
            WHEN duplicate_object THEN null;
        END;
    END IF;
END $$;


CREATE TABLE IF NOT EXISTS "Users" (
    id SERIAL PRIMARY KEY,
    "firstName" VARCHAR(255) NOT NULL,
    "lastName" VARCHAR(255) NOT NULL,
    "displayName" VARCHAR(255) NOT NULL,
    "password" VARCHAR(255) NOT NULL,
    "email" VARCHAR(255) UNIQUE NOT NULL,
    "avatar" VARCHAR(255) DEFAULT 'anon.png',
    "role" "enum_Users_role" NOT NULL,
    "balance" DECIMAL DEFAULT 0 CHECK ("balance" >= 0),
    "accessToken" TEXT,
    "rating" FLOAT DEFAULT 0
);


INSERT INTO "Users" ("firstName", "lastName", "displayName", "password", "email", "role", "balance")
SELECT 
    'Admin_Name_' || i, 
    'Admin_Last', 
    'Admin_Hero_' || i, 
    '$2b$10$hashed_password_placeholder', 
    'admin' || i || '@test.com', 
    'admin',
    0
FROM generate_series(1, 40) AS i
ON CONFLICT (email) DO NOTHING;

INSERT INTO "Users" ("firstName", "lastName", "displayName", "password", "email", "role", "balance")
SELECT 
    'Customer_Name_' || i, 
    'User_Last', 
    'User_Nick_' || i, 
    '$2b$10$hashed_password_placeholder',
    'customer' || i || '@test.com', 
    'customer',
    100
FROM generate_series(1, 25) AS i
ON CONFLICT (email) DO NOTHING;

INSERT INTO "Users" ("firstName", "lastName", "displayName", "password", "email", "role", "balance")
VALUES ('Mod', 'One', 'Official_Moderator', 'pass123', 'mod@test.com', 'moderator', 0)
ON CONFLICT (email) DO NOTHING;