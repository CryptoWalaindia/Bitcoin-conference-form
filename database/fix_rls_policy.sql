-- Fix RLS Policy for Public Registration
-- Run this in Supabase SQL Editor if you're still getting "Failed to fetch" errors

-- Drop existing policies
DROP POLICY IF EXISTS "Allow public registration inserts" ON registrations_new;
DROP POLICY IF EXISTS "Users can view own registration" ON registrations_new;

-- Create a simpler policy that allows anyone to insert
CREATE POLICY "Enable insert for everyone" ON registrations_new
    FOR INSERT WITH CHECK (true);

-- Optional: Allow reading for authenticated users only
CREATE POLICY "Enable read for authenticated users only" ON registrations_new
    FOR SELECT USING (auth.role() = 'authenticated');

-- Make sure anon role has the right permissions
GRANT INSERT ON registrations_new TO anon;
GRANT USAGE ON SCHEMA public TO anon;