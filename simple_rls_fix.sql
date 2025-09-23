-- SIMPLE RLS FIX - Nuclear Option
-- This will completely reset RLS and create working policies

-- Step 1: Check current state
SELECT 'Current registrations count:' as info;
SELECT COUNT(*) FROM registrations;

-- Step 2: Completely disable RLS (nuclear option)
ALTER TABLE registrations DISABLE ROW LEVEL SECURITY;

-- Step 3: Test insert without RLS (should work)
INSERT INTO registrations (full_name, email, age, phone) 
VALUES ('No RLS Test', 'norlstest@example.com', 30, '+91 8888888888');

-- Step 4: Check if insert worked
SELECT 'After no-RLS insert:' as info;
SELECT COUNT(*) FROM registrations;

-- Step 5: Drop ALL existing policies completely
DROP POLICY IF EXISTS "allow_anon_insert" ON registrations;
DROP POLICY IF EXISTS "allow_authenticated_select" ON registrations;
DROP POLICY IF EXISTS "allow_service_role_all" ON registrations;
DROP POLICY IF EXISTS "Enable insert for anon users" ON registrations;
DROP POLICY IF EXISTS "Enable read access for authenticated users" ON registrations;
DROP POLICY IF EXISTS "Enable all access for service role" ON registrations;

-- Step 6: Grant permissions directly to roles
GRANT ALL ON registrations TO postgres;
GRANT ALL ON registrations TO service_role;
GRANT INSERT ON registrations TO anon;
GRANT SELECT ON registrations TO authenticated;

-- Step 7: Re-enable RLS
ALTER TABLE registrations ENABLE ROW LEVEL SECURITY;

-- Step 8: Create the simplest possible policies
CREATE POLICY "anon_can_insert" ON registrations
    FOR INSERT 
    TO anon
    WITH CHECK (true);

CREATE POLICY "authenticated_can_select" ON registrations
    FOR SELECT 
    TO authenticated
    USING (true);

CREATE POLICY "service_role_all_access" ON registrations
    FOR ALL 
    TO service_role
    USING (true)
    WITH CHECK (true);

-- Step 9: Test the policies
SELECT 'Testing policies:' as info;

-- Test as anon (this should work now)
SET ROLE anon;
INSERT INTO registrations (full_name, email, age, phone) 
VALUES ('Anon Test Final', 'anontest@final.com', 25, '+91 7777777777');
RESET ROLE;

-- Step 10: Final verification
SELECT 'Final count:' as info;
SELECT COUNT(*) FROM registrations;

SELECT 'Recent entries:' as info;
SELECT full_name, email, created_at 
FROM registrations 
ORDER BY created_at DESC 
LIMIT 3;