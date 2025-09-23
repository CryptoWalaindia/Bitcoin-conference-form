-- Fix RLS INSERT Issue for Bitcoin Conference Registration
-- This script addresses the "new row violates row-level security policy" error

-- First, let's check the current table structure
SELECT column_name, data_type, is_nullable, column_default 
FROM information_schema.columns 
WHERE table_name = 'registrations' 
ORDER BY ordinal_position;

-- Disable RLS temporarily to check if there are any constraints
ALTER TABLE registrations DISABLE ROW LEVEL SECURITY;

-- Test insert without RLS to verify table structure
INSERT INTO registrations (full_name, email, age, phone) 
VALUES ('RLS Test User', 'rlstest@example.com', 25, '+91 1234567890');

-- Check if the insert worked
SELECT COUNT(*) as total_after_test_insert FROM registrations;

-- Re-enable RLS
ALTER TABLE registrations ENABLE ROW LEVEL SECURITY;

-- Drop ALL existing policies to start completely fresh
DROP POLICY IF EXISTS "Allow public registration submissions" ON registrations;
DROP POLICY IF EXISTS "Allow service role full access" ON registrations;
DROP POLICY IF EXISTS "Allow authenticated read access" ON registrations;
DROP POLICY IF EXISTS "Allow authenticated full read access" ON registrations;
DROP POLICY IF EXISTS "Enable insert for anon users" ON registrations;
DROP POLICY IF EXISTS "Enable read access for all users" ON registrations;

-- Revoke all permissions first
REVOKE ALL ON registrations FROM anon;
REVOKE ALL ON registrations FROM authenticated;
REVOKE ALL ON registrations FROM service_role;

-- Grant basic permissions
GRANT USAGE ON SCHEMA public TO anon;
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT ALL ON SCHEMA public TO service_role;

-- Grant table permissions
GRANT INSERT ON registrations TO anon;
GRANT SELECT ON registrations TO authenticated;
GRANT ALL ON registrations TO service_role;

-- Create simple, permissive policies
CREATE POLICY "anon_insert_policy" ON registrations
    FOR INSERT 
    TO anon
    WITH CHECK (true);

CREATE POLICY "authenticated_select_policy" ON registrations
    FOR SELECT 
    TO authenticated
    USING (true);

CREATE POLICY "service_role_all_policy" ON registrations
    FOR ALL 
    TO service_role
    USING (true)
    WITH CHECK (true);

-- Verify the policies are created
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies 
WHERE tablename = 'registrations';

-- Test the new policies
SELECT COUNT(*) as total_registrations FROM registrations;

-- Final test: Try to insert as anon user (this should work now)
SET ROLE anon;
INSERT INTO registrations (full_name, email, age, phone) 
VALUES ('Final Test User', 'finaltest@example.com', 30, '+91 9876543210');
RESET ROLE;

-- Verify the final insert worked
SELECT COUNT(*) as final_count FROM registrations;
SELECT full_name, email, created_at FROM registrations ORDER BY created_at DESC LIMIT 3;