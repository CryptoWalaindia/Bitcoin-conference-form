-- Quick RLS Status Check
-- Run this to see what's currently configured

-- Check if RLS is enabled
SELECT 
    schemaname,
    tablename,
    rowsecurity as rls_enabled,
    hasrls as has_rls_policies
FROM pg_tables 
WHERE tablename = 'registrations';

-- Check current policies
SELECT 
    'Current Policies:' as info,
    policyname,
    roles,
    cmd,
    permissive
FROM pg_policies 
WHERE tablename = 'registrations';

-- Check current permissions
SELECT 
    'Current Permissions:' as info,
    grantee,
    privilege_type
FROM information_schema.table_privileges 
WHERE table_name = 'registrations'
AND grantee IN ('anon', 'authenticated', 'service_role')
ORDER BY grantee, privilege_type;

-- Check row count
SELECT 'Row Count:' as info, COUNT(*) as total_rows FROM registrations;