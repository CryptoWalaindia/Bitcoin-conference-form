-- Bitcoin Conference India Registration Table - New Version
-- Run this in your Supabase SQL Editor to create the new table

-- Create the new registrations table with updated fields
CREATE TABLE registrations_new (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  
  -- Personal Information
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  phone VARCHAR(15) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  age INTEGER NOT NULL CHECK (age >= 1 AND age <= 99),
  gender VARCHAR(10) NOT NULL CHECK (gender IN ('Male', 'Female', 'Others')),
  
  -- Location
  state VARCHAR(100) NOT NULL,
  
  -- Purpose
  purpose TEXT NOT NULL,
  
  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX idx_registrations_new_email ON registrations_new(email);
CREATE INDEX idx_registrations_new_created_at ON registrations_new(created_at);
CREATE INDEX idx_registrations_new_state ON registrations_new(state);
CREATE INDEX idx_registrations_new_gender ON registrations_new(gender);

-- Create a function to automatically update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_registrations_new_updated_at 
    BEFORE UPDATE ON registrations_new 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security (RLS)
ALTER TABLE registrations_new ENABLE ROW LEVEL SECURITY;

-- Create policy to allow inserts from anyone (for registration)
CREATE POLICY "Allow public registration inserts" ON registrations_new
    FOR INSERT WITH CHECK (true);

-- Create policy to allow reading own data (optional - for user dashboard)
CREATE POLICY "Users can view own registration" ON registrations_new
    FOR SELECT USING (auth.uid() IS NOT NULL);

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON registrations_new TO anon, authenticated;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;

-- Sample data for testing (optional - remove in production)
INSERT INTO registrations_new (first_name, last_name, phone, email, age, gender, state, purpose) VALUES
('John', 'Doe', '9876543210', 'john.doe@example.com', 28, 'Male', 'Maharashtra', 'Learning about Bitcoin technology'),
('Jane', 'Smith', '9876543211', 'jane.smith@example.com', 32, 'Female', 'Karnataka', 'Networking with Bitcoin enthusiasts'),
('Alex', 'Johnson', '9876543212', 'alex.johnson@example.com', 25, 'Others', 'Delhi', 'Exploring investment opportunities');