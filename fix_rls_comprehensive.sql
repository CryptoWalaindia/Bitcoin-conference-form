-- COMPREHENSIVE RLS FIX for Bitcoin Conference Registration
-- This script will completely reset and fix all RLS issues

-- Step 1: Check current state
SELECT 'Current table info:' as step;
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'registrations' 
ORDER BY ordinal_position;

-- Step 2: Check current row count
SELECT 'Current row count:' as step;
SELECT COUNT(*) as current_count FROM registrations;

-- Step 3: Completely disable RLS temporarily
ALTER TABLE registrations DISABLE ROW LEVEL SECURITY;

-- Step 4: Test basic insert without RLS
INSERT INTO registrations (full_name, email, age, phone) 
VALUES ('Comprehensive Test', 'comprehensive@test.com', 28, '+91 1111111111');

-- Step 5: Check if insert worked
SELECT 'After test insert:' as step;
SELECT COUNT(*) as count_after_test FROM registrations;

-- Step 6: Drop ALL existing policies (comprehensive cleanup)
DO $$ 
DECLARE 
    policy_record RECORD;
BEGIN
    FOR policy_record IN 
        SELECT policyname 
        FROM pg_policies 
        WHERE tablename = 'registrations'
    LOOP
        EXECUTE 'DROP POLICY IF EXISTS "' || policy_record.policyname || '" ON registrations';
    END LOOP;
END $$;

-- Step 7: Revoke ALL permissions and start fresh
REVOKE ALL ON registrations FROM anon;
REVOKE ALL ON registrations FROM authenticated;
REVOKE ALL ON registrations FROM service_role;
REVOKE ALL ON registrations FROM public;

-- Step 8: Grant schema permissions
GRANT USAGE ON SCHEMA public TO anon;
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT ALL ON SCHEMA public TO service_role;

-- Step 9: Grant specific table permissions
GRANT INSERT ON registrations TO anon;
GRANT SELECT ON registrations TO authenticated;
GRANT ALL ON registrations TO service_role;

-- Step 10: Re-enable RLS
ALTER TABLE registrations ENABLE ROW LEVEL SECURITY;

-- Step 11: Create simple, working policies
CREATE POLICY "allow_anon_insert" ON registrations
    FOR INSERT 
    TO anon
    WITH CHECK (true);

CREATE POLICY "allow_authenticated_select" ON registrations
    FOR SELECT 
    TO authenticated
    USING (true);

CREATE POLICY "allow_service_role_all" ON registrations
    FOR ALL 
    TO service_role
    USING (true)
    WITH CHECK (true);

-- Step 12: Verify policies are created
SELECT 'Created policies:' as step;
SELECT 
    policyname,
    roles,
    cmd,
    permissive
FROM pg_policies 
WHERE tablename = 'registrations';

-- Step 13: Test the new policies work
SELECT 'Testing new policies:' as step;

-- Test as anon user
SET ROLE anon;
INSERT INTO registrations (full_name, email, age, phone) 
VALUES ('Anon Policy Test', 'anontest@example.com', 32, '+91 2222222222');
RESET ROLE;

-- Step 14: Final verification
SELECT 'Final verification:' as step;
SELECT COUNT(*) as final_count FROM registrations;
SELECT full_name, email, created_at 
FROM registrations 
ORDER BY created_at DESC 
LIMIT 5;

-- Step 15: Test permissions summary
SELECT 'Permission summary:' as step;
SELECT 
    grantee,
    privilege_type,
    is_grantable
FROM information_schema.table_privileges 
WHERE table_name = 'registrations'
ORDER BY grantee, privilege_type;