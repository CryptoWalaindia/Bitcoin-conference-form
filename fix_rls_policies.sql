-- Check current RLS policies
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
FROM pg_policies 
WHERE tablename = 'registrations';

-- Disable RLS temporarily to allow public registration
ALTER TABLE registrations DISABLE ROW LEVEL SECURITY;

-- Or create a policy to allow anonymous inserts (better approach)
-- ALTER TABLE registrations ENABLE ROW LEVEL SECURITY;
-- 
-- DROP POLICY IF EXISTS "Allow anonymous registration" ON registrations;
-- CREATE POLICY "Allow anonymous registration" ON registrations
--     FOR INSERT TO anon
--     WITH CHECK (true);
-- 
-- DROP POLICY IF EXISTS "Allow public read" ON registrations;
-- CREATE POLICY "Allow public read" ON registrations
--     FOR SELECT TO anon, authenticated
--     USING (true);