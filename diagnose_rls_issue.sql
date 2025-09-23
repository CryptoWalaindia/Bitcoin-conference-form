-- ADVANCED RLS DIAGNOSTICS
-- This script will help us understand exactly what's happening

-- Step 1: Check if RLS is enabled
SELECT 'RLS Status:' as step;
SELECT 
    schemaname,
    tablename,
    rowsecurity as rls_enabled
FROM pg_tables 
WHERE tablename = 'registrations';

-- Step 2: Check all current policies
SELECT 'Current Policies:' as step;
SELECT 
    policyname,
    roles,
    cmd,
    permissive,
    qual,
    with_check
FROM pg_policies 
WHERE tablename = 'registrations';

-- Step 3: Check table permissions
SELECT 'Table Permissions:' as step;
SELECT 
    grantee,
    privilege_type,
    is_grantable
FROM information_schema.table_privileges 
WHERE table_name = 'registrations'
ORDER BY grantee, privilege_type;

-- Step 4: Check role permissions
SELECT 'Role Information:' as step;
SELECT 
    rolname,
    rolsuper,
    rolinherit,
    rolcreaterole,
    rolcreatedb,
    rolcanlogin,
    rolbypassrls
FROM pg_roles 
WHERE rolname IN ('anon', 'authenticated', 'service_role', 'postgres');

-- Step 5: Test direct insert as different roles
SELECT 'Testing as postgres (should work):' as step;
INSERT INTO registrations (full_name, email, age, phone) 
VALUES ('Postgres Test', 'postgres@test.com', 35, '+91 9999999999');

-- Step 6: Check if the insert worked
SELECT 'Row count after postgres insert:' as step;
SELECT COUNT(*) FROM registrations;

-- Step 7: Try to understand why anon role fails
SELECT 'Checking anon role specifically:' as step;
SELECT current_user, session_user;

-- Step 8: Check if there are any conflicting policies
SELECT 'All policies on registrations table:' as step;
SELECT 
    n.nspname as schema_name,
    c.relname as table_name,
    pol.polname as policy_name,
    pol.polcmd as policy_command,
    pol.polpermissive as is_permissive,
    pol.polroles as policy_roles,
    pg_get_expr(pol.polqual, pol.polrelid) as policy_expression,
    pg_get_expr(pol.polwithcheck, pol.polrelid) as with_check_expression
FROM pg_policy pol
JOIN pg_class c ON pol.polrelid = c.oid
JOIN pg_namespace n ON c.relnamespace = n.oid
WHERE c.relname = 'registrations';