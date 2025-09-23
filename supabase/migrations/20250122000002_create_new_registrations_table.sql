-- Create new registrations table with restructured fields
-- This replaces the old table structure with simplified fields

-- Drop the old table if it exists (since you've exported the data)
DROP TABLE IF EXISTS registrations;

-- Create new registrations table with simplified structure
CREATE TABLE registrations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    full_name TEXT NOT NULL,
    phone TEXT, -- Optional field
    email TEXT NOT NULL,
    age INTEGER NOT NULL CHECK (age >= 1 AND age <= 99),
    terms_accepted BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_registrations_email ON registrations(email);
CREATE INDEX idx_registrations_created_at ON registrations(created_at);
CREATE INDEX idx_registrations_full_name ON registrations(full_name);

-- Add unique constraint on email to prevent duplicate registrations
ALTER TABLE registrations ADD CONSTRAINT unique_email UNIQUE (email);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_registrations_updated_at 
    BEFORE UPDATE ON registrations 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Add comments for documentation
COMMENT ON TABLE registrations IS 'Bitcoin Conference India registration data with simplified field structure';
COMMENT ON COLUMN registrations.full_name IS 'Complete name of the registrant (required)';
COMMENT ON COLUMN registrations.phone IS 'Phone number with country code (optional)';
COMMENT ON COLUMN registrations.email IS 'Email address (required, unique)';
COMMENT ON COLUMN registrations.age IS 'Age of registrant (required, 1-99)';
COMMENT ON COLUMN registrations.terms_accepted IS 'Whether user accepted terms and conditions';