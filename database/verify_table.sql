-- Verify the table exists and check its structure
-- Run this in Supabase SQL Editor

-- Check if table exists
SELECT table_name, column_name, data_type, is_nullable
FROM information_schema.columns 
WHERE table_name = 'registrations_new'
ORDER BY ordinal_position;

-- Check current policies
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual
FROM pg_policies 
WHERE tablename = 'registrations_new';

-- Check table permissions
SELECT grantee, privilege_type 
FROM information_schema.role_table_grants 
WHERE table_name = 'registrations_new';