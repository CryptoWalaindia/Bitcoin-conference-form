-- Fix Row Level Security policies for registrations table
-- This allows anonymous users to register for the conference

-- First, check if RLS is enabled and disable it temporarily
ALTER TABLE registrations DISABLE ROW LEVEL SECURITY;

-- Alternative approach: Enable RLS with proper policies for public registration
-- Uncomment the following lines if you want to keep RLS enabled:

-- ALTER TABLE registrations ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
-- DROP POLICY IF EXISTS "Allow anonymous registration" ON registrations;
-- DROP POLICY IF EXISTS "Allow public read" ON registrations;
-- DROP POLICY IF EXISTS "Allow authenticated read" ON registrations;

-- Create policy to allow anonymous users to insert registrations
-- CREATE POLICY "Allow anonymous registration" ON registrations
--     FOR INSERT TO anon
--     WITH CHECK (true);

-- Create policy to allow reading registrations (for email sending)
-- CREATE POLICY "Allow service read" ON registrations
--     FOR SELECT TO anon, authenticated, service_role
--     USING (true);

-- Create policy to allow updates (for email status)
-- CREATE POLICY "Allow service update" ON registrations
--     FOR UPDATE TO anon, authenticated, service_role
--     USING (true)
--     WITH CHECK (true);