-- Cache Busting Test
-- This will force Supabase to refresh its policy cache

-- Step 1: Check current policies
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
FROM pg_policies 
WHERE tablename = 'registrations';

-- Step 2: Temporarily disable and re-enable RLS to force cache refresh
ALTER TABLE registrations DISABLE ROW LEVEL SECURITY;
ALTER TABLE registrations ENABLE ROW LEVEL SECURITY;

-- Step 3: Test insert with explicit role setting
SET ROLE anon;
SELECT current_user, current_setting('role') as current_role;

-- Try a simple insert
INSERT INTO registrations (full_name, email, age, phone) 
VALUES ('Cache Bust Test', 'cachebust@test.com', 28, '+91 9999999999');

RESET ROLE;

-- Step 4: Verify the insert worked
SELECT 'Cache bust test result:' as info;
SELECT full_name, email, created_at 
FROM registrations 
WHERE email = 'cachebust@test.com';