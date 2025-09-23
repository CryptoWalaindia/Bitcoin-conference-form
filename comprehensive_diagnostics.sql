-- Comprehensive Supabase Diagnostics
-- This will check everything that could be causing 401 errors

-- 1. Check table permissions
SELECT 'Table permissions:' as info;
SELECT grantee, privilege_type, is_grantable
FROM information_schema.table_privileges 
WHERE table_name = 'registrations';

-- 2. Check column permissions
SELECT 'Column permissions:' as info;
SELECT grantee, column_name, privilege_type
FROM information_schema.column_privileges 
WHERE table_name = 'registrations';

-- 3. Check current policies
SELECT 'Current policies:' as info;
SELECT policyname, permissive, roles, cmd, qual, with_check
FROM pg_policies 
WHERE tablename = 'registrations';

-- 4. Check RLS status
SELECT 'RLS status:' as info;
SELECT schemaname, tablename, rowsecurity, forcerowsecurity
FROM pg_tables 
WHERE tablename = 'registrations';

-- 5. Check if anon role exists and has proper setup
SELECT 'Anon role info:' as info;
SELECT rolname, rolsuper, rolinherit, rolcreaterole, rolcreatedb, rolcanlogin
FROM pg_roles 
WHERE rolname = 'anon';

-- 6. Test what happens when we try to insert as anon
SELECT 'Testing anon insert:' as info;
SET ROLE anon;
SELECT current_user as current_user_before_insert;

-- This should work if policies are correct
BEGIN;
INSERT INTO registrations (full_name, email, age, phone) 
VALUES ('Diagnostic Test', 'diagnostic@test.com', 30, '+91 1111111111');
ROLLBACK; -- Don't actually save this test

RESET ROLE;

-- 7. Check if there are any conflicting policies on related tables
SELECT 'All policies in database:' as info;
SELECT schemaname, tablename, policyname, roles, cmd
FROM pg_policies 
ORDER BY tablename, policyname;