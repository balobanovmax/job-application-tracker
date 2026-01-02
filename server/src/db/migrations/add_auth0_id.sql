-- Migration: Add auth0_id column to users table
-- This allows us to use Auth0's sub claim as the unique identifier

-- Add auth0_id column (nullable at first to allow existing data)
ALTER TABLE users ADD COLUMN IF NOT EXISTS auth0_id TEXT;

-- For existing users, set auth0_id to email temporarily
-- (In production, you'd need to map these properly)
UPDATE users SET auth0_id = email WHERE auth0_id IS NULL;

-- Now make it NOT NULL and UNIQUE
ALTER TABLE users ALTER COLUMN auth0_id SET NOT NULL;
ALTER TABLE users ADD CONSTRAINT users_auth0_id_unique UNIQUE (auth0_id);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_users_auth0_id ON users(auth0_id);

-- Verify the changes
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'users';

