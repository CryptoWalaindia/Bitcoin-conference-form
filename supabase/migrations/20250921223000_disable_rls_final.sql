-- Final fix for RLS issues - disable RLS completely for registrations table
-- This migration ensures anonymous users can submit registration forms

-- Disable Row Level Security on registrations table
ALTER TABLE registrations DISABLE ROW LEVEL SECURITY;

-- Grant necessary permissions to anonymous and authenticated users
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON registrations TO anon, authenticated;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;

-- Make phone field nullable to match form requirements
ALTER TABLE registrations ALTER COLUMN phone DROP NOT NULL;

-- Add comment for documentation
COMMENT ON TABLE registrations IS 'Registration table with RLS disabled to allow anonymous form submissions';