-- Enable RLS Properly for Bitcoin Conference Registration System
-- This script will secure your database while allowing public registration

-- First, let's check what tables we have and their current RLS status
SELECT 
    schemaname, 
    tablename, 
    rowsecurity as rls_enabled,
    (SELECT COUNT(*) FROM pg_policies WHERE tablename = t.tablename) as policy_count
FROM pg_tables t 
WHERE schemaname = 'public' 
AND tablename IN ('registrations', 'ticket_verification');

-- Enable RLS on the registrations table
ALTER TABLE public.registrations ENABLE ROW LEVEL SECURITY;

-- Drop any existing policies to start fresh
DROP POLICY IF EXISTS "Allow anonymous registration" ON public.registrations;
DROP POLICY IF EXISTS "Allow public registration inserts" ON public.registrations;
DROP POLICY IF EXISTS "Allow public read" ON public.registrations;
DROP POLICY IF EXISTS "Users can view own registration" ON public.registrations;

-- Create policy to allow anonymous users to INSERT registrations (for the form)
CREATE POLICY "Enable public registration" ON public.registrations
    FOR INSERT 
    TO anon
    WITH CHECK (true);

-- Create policy to allow authenticated users to read all registrations (for admin)
CREATE POLICY "Enable admin read access" ON public.registrations
    FOR SELECT 
    TO authenticated
    USING (true);

-- Optional: Allow anonymous users to read their own registration by email
-- (Uncomment if you want users to be able to check their registration status)
-- CREATE POLICY "Enable users to read own registration" ON public.registrations
--     FOR SELECT 
--     TO anon
--     USING (email = current_setting('request.jwt.claims', true)::json->>'email');

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT INSERT ON public.registrations TO anon;
GRANT SELECT ON public.registrations TO authenticated;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;

-- Handle the ticket_verification view if it exists
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.views WHERE table_name = 'ticket_verification') THEN
        -- Grant permissions on the view
        GRANT SELECT ON public.ticket_verification TO anon, authenticated;
    END IF;
END $$;

-- Verify the setup
SELECT 
    'RLS Setup Complete' as status,
    (SELECT COUNT(*) FROM pg_policies WHERE tablename = 'registrations') as policies_created,
    (SELECT rowsecurity FROM pg_tables WHERE tablename = 'registrations' AND schemaname = 'public') as rls_enabled;

-- Show all policies for verification
SELECT 
    policyname,
    cmd as operation,
    roles,
    permissive,
    qual as condition
FROM pg_policies 
WHERE tablename = 'registrations'
ORDER BY cmd, policyname;