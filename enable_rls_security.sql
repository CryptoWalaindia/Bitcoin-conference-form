-- Enable Row Level Security (RLS) for the registrations table
-- This adds an extra layer of security to protect registration data

-- Enable RLS on the registrations table
ALTER TABLE registrations ENABLE ROW LEVEL SECURITY;

-- Drop any existing policies to start fresh
DROP POLICY IF EXISTS "Allow public registration submissions" ON registrations;
DROP POLICY IF EXISTS "Allow service role full access" ON registrations;
DROP POLICY IF EXISTS "Allow authenticated read access" ON registrations;
DROP POLICY IF EXISTS "Allow authenticated full read access" ON registrations;

-- Policy 1: Allow anonymous users to INSERT new registrations
-- This allows the public form to submit new registrations
CREATE POLICY "Allow public registration submissions" ON registrations
    FOR INSERT 
    TO anon
    WITH CHECK (true);

-- Policy 2: Allow service role full access for admin operations
-- This allows backend services and admin operations to work
CREATE POLICY "Allow service role full access" ON registrations
    FOR ALL 
    TO service_role
    USING (true)
    WITH CHECK (true);

-- Policy 3: Allow authenticated users to read ALL registrations (for admin dashboard)
-- This allows viewing all registrations regardless of who created them
CREATE POLICY "Allow authenticated read access" ON registrations
    FOR SELECT 
    TO authenticated
    USING (true);

-- Grant necessary permissions to anon role for INSERT operations
GRANT INSERT ON registrations TO anon;

-- Grant full permissions to service_role (for Edge Functions and admin operations)
GRANT ALL ON registrations TO service_role;

-- Grant SELECT permissions to authenticated role (for potential admin interface)
GRANT SELECT ON registrations TO authenticated;

-- Verify RLS is enabled and policies are created
SELECT 
    schemaname,
    tablename,
    rowsecurity
FROM pg_tables 
WHERE tablename = 'registrations';

-- List all policies on the registrations table
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies 
WHERE tablename = 'registrations';

-- Test the policies by checking what the anon role can do
-- (This is just for verification - the actual test will be done through the application)
COMMENT ON TABLE registrations IS 'Bitcoin Conference India registration data - RLS enabled for security';

-- Quick test query to verify data visibility
SELECT COUNT(*) as total_registrations FROM registrations;

-- Test query to see actual data (should work with proper RLS policies)
SELECT id, full_name, email, phone, created_at FROM registrations ORDER BY created_at DESC LIMIT 5;