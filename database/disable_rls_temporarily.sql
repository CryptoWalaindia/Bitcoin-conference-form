-- Temporarily disable RLS to test the connection
-- Run this in Supabase SQL Editor

-- Disable RLS temporarily for testing
ALTER TABLE registrations_new DISABLE ROW LEVEL SECURITY;

-- Grant full permissions to anon for testing
GRANT ALL PRIVILEGES ON registrations_new TO anon;
GRANT USAGE ON SCHEMA public TO anon;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon;