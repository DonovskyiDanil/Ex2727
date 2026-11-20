DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'enum_Users_role') THEN
        CREATE TYPE "enum_Users_role" AS ENUM ('customer', 'creator', 'admin', 'moderator');
    ELSE
        BEGIN
            ALTER TYPE "enum_Users_role" ADD VALUE 'admin';
        EXCEPTION WHEN duplicate_object THEN NULL;
        END;
        BEGIN
            ALTER TYPE "enum_Users_role" ADD VALUE 'moderator';
        EXCEPTION WHEN duplicate_object THEN NULL;
        END;
    END IF;
END
$$;

CREATE TABLE IF NOT EXISTS "Users" (
    id SERIAL PRIMARY KEY,
    "firstName" VARCHAR(255) NOT NULL,
    "lastName" VARCHAR(255) NOT NULL,
    "displayName" VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    avatar VARCHAR(255) NOT NULL DEFAULT 'anon.png',
    role "enum_Users_role" NOT NULL,
    balance DECIMAL(12, 2) NOT NULL DEFAULT 0 CHECK (balance >= 0),
    "accessToken" TEXT,
    rating DOUBLE PRECISION NOT NULL DEFAULT 0
);
