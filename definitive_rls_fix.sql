-- DEFINITIVE RLS FIX
-- This will completely reset and fix RLS policies properly

-- Step 1: Disable RLS completely
ALTER TABLE registrations DISABLE ROW LEVEL SECURITY;

-- Step 2: Drop ALL policies (including any hidden ones)
DO $$ 
DECLARE 
    policy_record RECORD;
BEGIN
    FOR policy_record IN 
        SELECT policyname FROM pg_policies WHERE tablename = 'registrations'
    LOOP
        EXECUTE 'DROP POLICY IF EXISTS "' || policy_record.policyname || '" ON registrations';
    END LOOP;
END $$;

-- Step 3: Revoke all permissions and start fresh
REVOKE ALL ON registrations FROM anon;
REVOKE ALL ON registrations FROM authenticated;
REVOKE ALL ON registrations FROM service_role;

-- Step 4: Grant the correct permissions
GRANT INSERT ON registrations TO anon;
GRANT SELECT ON registrations TO authenticated;
GRANT ALL ON registrations TO service_role;

-- Step 5: Re-enable RLS
ALTER TABLE registrations ENABLE ROW LEVEL SECURITY;

-- Step 6: Create working policies with proper syntax
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

-- Step 7: Force refresh by toggling RLS
ALTER TABLE registrations DISABLE ROW LEVEL SECURITY;
ALTER TABLE registrations ENABLE ROW LEVEL SECURITY;

-- Step 8: Test the policies work
SELECT 'Testing policies after fix:' as info;

-- Test as anon user
SET ROLE anon;
INSERT INTO registrations (full_name, email, age, phone) 
VALUES ('Final Test User', 'finaltest' || extract(epoch from now()) || '@example.com', 25, '+91 5555555555');
RESET ROLE;

-- Step 9: Verify everything worked
SELECT 'Final verification:' as info;
SELECT COUNT(*) as total_registrations FROM registrations;

SELECT 'Recent entries:' as info;
SELECT full_name, email, created_at 
FROM registrations 
ORDER BY created_at DESC 
LIMIT 3;

-- Step 10: Show current policy status
SELECT 'Current policies:' as info;
SELECT policyname, roles, cmd, with_check
FROM pg_policies 
WHERE tablename = 'registrations';