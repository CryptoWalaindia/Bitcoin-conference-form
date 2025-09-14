-- Bitcoin Conference India Registration Table
-- Updated schema to match the new form structure

-- Drop existing table if it exists (be careful in production!)
DROP TABLE IF EXISTS registrations;

-- Create the registrations table with updated fields
CREATE TABLE registrations (
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
CREATE INDEX idx_registrations_email ON registrations(email);
CREATE INDEX idx_registrations_created_at ON registrations(created_at);
CREATE INDEX idx_registrations_state ON registrations(state);
CREATE INDEX idx_registrations_gender ON registrations(gender);

-- Create a function to automatically update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_registrations_updated_at 
    BEFORE UPDATE ON registrations 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security (RLS)
ALTER TABLE registrations ENABLE ROW LEVEL SECURITY;

-- Create policy to allow inserts from anyone (for registration)
CREATE POLICY "Allow public registration inserts" ON registrations
    FOR INSERT WITH CHECK (true);

-- Create policy to allow reading own data (optional - for user dashboard)
CREATE POLICY "Users can view own registration" ON registrations
    FOR SELECT USING (auth.uid() IS NOT NULL);

-- Create policy for admin access (optional - update with your admin logic)
-- CREATE POLICY "Admin full access" ON registrations
--     FOR ALL USING (auth.jwt() ->> 'role' = 'admin');

-- Sample data for testing (optional - remove in production)
INSERT INTO registrations (first_name, last_name, phone, email, age, gender, state, purpose) VALUES
('John', 'Doe', '9876543210', 'john.doe@example.com', 28, 'Male', 'Maharashtra', 'Learning about Bitcoin technology'),
('Jane', 'Smith', '9876543211', 'jane.smith@example.com', 32, 'Female', 'Karnataka', 'Networking with Bitcoin enthusiasts'),
('Alex', 'Johnson', '9876543212', 'alex.johnson@example.com', 25, 'Others', 'Delhi', 'Exploring investment opportunities');

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON registrations TO anon, authenticated;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;