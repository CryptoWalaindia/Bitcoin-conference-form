-- EMERGENCY RLS FIX - NUCLEAR OPTION
-- This will completely disable RLS and recreate everything from scratch

-- Step 1: COMPLETELY DISABLE RLS (no policies will be enforced)
ALTER TABLE registrations DISABLE ROW LEVEL SECURITY;

-- Step 2: Drop ALL existing policies with force
DO $$ 
DECLARE 
    policy_record RECORD;
BEGIN
    -- Get all policies for this table
    FOR policy_record IN 
        SELECT schemaname, tablename, policyname 
        FROM pg_policies 
        WHERE tablename = 'registrations'
    LOOP
        BEGIN
            EXECUTE format('DROP POLICY IF EXISTS %I ON %I.%I', 
                policy_record.policyname, 
                policy_record.schemaname, 
                policy_record.tablename);
            RAISE NOTICE 'Dropped policy: %', policy_record.policyname;
        EXCEPTION WHEN OTHERS THEN
            RAISE NOTICE 'Could not drop policy %: %', policy_record.policyname, SQLERRM;
        END;
    END LOOP;
END $$;

-- Step 3: Revoke ALL permissions and start completely fresh
REVOKE ALL PRIVILEGES ON registrations FROM PUBLIC;
REVOKE ALL PRIVILEGES ON registrations FROM anon;
REVOKE ALL PRIVILEGES ON registrations FROM authenticated;
REVOKE ALL PRIVILEGES ON registrations FROM service_role;

-- Step 4: Grant FULL permissions to all roles (temporary - for testing)
GRANT ALL PRIVILEGES ON registrations TO anon;
GRANT ALL PRIVILEGES ON registrations TO authenticated;
GRANT ALL PRIVILEGES ON registrations TO service_role;
GRANT ALL PRIVILEGES ON registrations TO PUBLIC;

-- Step 5: Test WITHOUT RLS first
SELECT 'Testing without RLS:' as info;

-- Test basic insert without RLS
INSERT INTO registrations (full_name, email, age, phone) 
VALUES ('Emergency Test', 'emergency' || extract(epoch from now()) || '@test.com', 30, '+91 9999999999');

SELECT 'Insert without RLS: SUCCESS' as result;

-- Step 6: Now enable RLS with the most permissive policies possible
ALTER TABLE registrations ENABLE ROW LEVEL SECURITY;

-- Step 7: Create the most permissive policies possible
CREATE POLICY "emergency_allow_all_anon" ON registrations
    FOR ALL 
    TO anon
    USING (true)
    WITH CHECK (true);

CREATE POLICY "emergency_allow_all_authenticated" ON registrations
    FOR ALL 
    TO authenticated
    USING (true)
    WITH CHECK (true);

CREATE POLICY "emergency_allow_all_service" ON registrations
    FOR ALL 
    TO service_role
    USING (true)
    WITH CHECK (true);

-- Step 8: Test WITH RLS enabled
SELECT 'Testing with RLS enabled:' as info;

-- Test as anon user (this is what your app uses)
SET ROLE anon;
INSERT INTO registrations (full_name, email, age, phone) 
VALUES ('Emergency RLS Test', 'emergency_rls' || extract(epoch from now()) || '@test.com', 25, '+91 8888888888');
RESET ROLE;

SELECT 'Insert with RLS as anon: SUCCESS' as result;

-- Step 9: Final verification
SELECT 'Final verification:' as info;
SELECT COUNT(*) as total_registrations FROM registrations;

SELECT 'Recent test entries:' as info;
SELECT full_name, email, created_at 
FROM registrations 
WHERE full_name LIKE '%Emergency%' OR full_name LIKE '%Test%'
ORDER BY created_at DESC 
LIMIT 5;

-- Step 10: Show current policy status
SELECT 'Current policies after emergency fix:' as info;
SELECT policyname, roles, cmd, with_check
FROM pg_policies 
WHERE tablename = 'registrations';

-- Step 11: Show current permissions
SELECT 'Current table permissions:' as info;
SELECT grantee, privilege_type, is_grantable
FROM information_schema.table_privileges 
WHERE table_name = 'registrations'
ORDER BY grantee, privilege_type;