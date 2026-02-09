
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'offer_status') THEN
        CREATE TYPE "offer_status" AS ENUM ('pending', 'approved', 'rejected');
    END IF;
END $$;


ALTER TABLE "Offers" 
ADD COLUMN IF NOT EXISTS "status" "offer_status" DEFAULT 'pending';


DO $$ 
BEGIN
    IF EXISTS (SELECT 1 FROM pg_type WHERE typname = 'role') THEN
        ALTER TYPE "role" ADD VALUE IF NOT EXISTS 'moderator';
    END IF;
END $$;


INSERT INTO "Users" ("firstName", "lastName", "displayName", "password", "email", "role", "accessToken")
VALUES (
    'System', 
    'Moderator', 
    'Moder', 
    '$2b$10$7v.Gf1fL6.O8vBvU7Q.O.eO8W6Gf1fL6.O8vBvU7Q.O.e', -
    'moderator@gmail.com', 
    'moderator', 
    'init_token'
)
ON CONFLICT (email) DO NOTHING;