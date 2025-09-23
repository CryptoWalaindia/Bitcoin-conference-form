-- Verification script to test RLS setup
-- Run this after enabling RLS to ensure everything works correctly

-- 1. Check if RLS is enabled
SELECT 
    schemaname,
    tablename,
    rowsecurity as "RLS Enabled",
    hasrls as "Has RLS"
FROM pg_tables 
WHERE tablename = 'registrations';

-- 2. List all policies
SELECT 
    policyname as "Policy Name",
    cmd as "Command",
    roles as "Roles",
    permissive as "Permissive"
FROM pg_policies 
WHERE tablename = 'registrations'
ORDER BY policyname;

-- 3. Check table permissions
SELECT 
    grantee,
    privilege_type,
    is_grantable
FROM information_schema.role_table_grants 
WHERE table_name = 'registrations'
ORDER BY grantee, privilege_type;

-- 4. Test INSERT as anon role (simulating form submission)
-- This should work with RLS enabled
SET ROLE anon;
INSERT INTO registrations (full_name, email, age, terms_accepted) 
VALUES ('RLS Test User', 'rls-test@example.com', 30, true);

-- 5. Test SELECT as anon role (should be restricted)
-- This should return no results due to RLS
SELECT COUNT(*) as "Records visible to anon role" FROM registrations;

-- 6. Reset to default role
RESET ROLE;

-- 7. Test SELECT as service_role (should see all records)
SET ROLE service_role;
SELECT COUNT(*) as "Records visible to service_role" FROM registrations;

-- 8. Clean up test data
DELETE FROM registrations WHERE email = 'rls-test@example.com';

-- Reset to default role
RESET ROLE;

-- 9. Final verification - show current RLS status
SELECT 
    'RLS Setup Complete' as status,
    COUNT(*) as total_policies
FROM pg_policies 
WHERE tablename = 'registrations';