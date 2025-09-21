-- Fix RLS Issue for Bitcoin Conference Registration Form
-- This script will disable RLS to allow anonymous registrations

-- Connect to your Supabase database and run this script

-- 1. Disable Row Level Security on registrations table
ALTER TABLE registrations DISABLE ROW LEVEL SECURITY;

-- 2. Drop any existing policies that might be causing issues
DROP POLICY IF EXISTS "Allow public registration inserts" ON registrations;
DROP POLICY IF EXISTS "Users can view own registration" ON registrations;
DROP POLICY IF EXISTS "Allow anonymous registration" ON registrations;
DROP POLICY IF EXISTS "Allow public read" ON registrations;
DROP POLICY IF EXISTS "Allow authenticated read" ON registrations;
DROP POLICY IF EXISTS "Allow service read" ON registrations;
DROP POLICY IF EXISTS "Allow service update" ON registrations;

-- 3. Ensure proper permissions are granted
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON registrations TO anon, authenticated;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;

-- 4. Verify the table structure is correct
-- Check if phone field is nullable (it should be for optional phone numbers)
ALTER TABLE registrations ALTER COLUMN phone DROP NOT NULL;

-- 5. Test insert to verify it works
-- This should succeed after running the above commands
-- INSERT INTO registrations (first_name, last_name, email, age, gender, state, purpose) 
-- VALUES ('Test', 'User', 'test@example.com', 25, 'Male', 'Test State', 'Testing registration');

-- 6. Optional: If you want to re-enable RLS later with proper policies, use this:
/*
ALTER TABLE registrations ENABLE ROW LEVEL SECURITY;

-- Allow anonymous users to insert registrations
CREATE POLICY "Allow anonymous registration" ON registrations
    FOR INSERT TO anon
    WITH CHECK (true);

-- Allow service role to read/update for email functionality
CREATE POLICY "Allow service operations" ON registrations
    FOR ALL TO service_role
    USING (true)
    WITH CHECK (true);
*/

-- Verification query - this should return the table info
SELECT 
    column_name, 
    data_type, 
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'registrations' 
ORDER BY ordinal_position;