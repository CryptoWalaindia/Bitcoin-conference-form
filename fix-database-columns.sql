-- Emergency fix for database column length issues
-- Run this script in your Supabase SQL editor to fix the "value too long" errors

-- Fix phone column to accommodate country code + phone number
-- Example: "+971 123456789012345" can be up to 25 characters
ALTER TABLE registrations ALTER COLUMN phone TYPE VARCHAR(30);

-- Make phone column nullable since it's optional in the form
ALTER TABLE registrations ALTER COLUMN phone DROP NOT NULL;

-- Fix first_name and last_name to accommodate longer names
-- Some users may have longer names or multiple names
ALTER TABLE registrations ALTER COLUMN first_name TYPE VARCHAR(150);
ALTER TABLE registrations ALTER COLUMN last_name TYPE VARCHAR(150);

-- Fix state/country column to accommodate longer country names
-- Example: "Bosnia and Herzegovina" is 22 characters
ALTER TABLE registrations ALTER COLUMN state TYPE VARCHAR(150);

-- Fix email column to accommodate longer email addresses
-- Some corporate or academic emails can be quite long
ALTER TABLE registrations ALTER COLUMN email TYPE VARCHAR(320);

-- Make state and purpose nullable since they might not always be required
ALTER TABLE registrations ALTER COLUMN state DROP NOT NULL;
ALTER TABLE registrations ALTER COLUMN purpose DROP NOT NULL;

-- Add comments for documentation
COMMENT ON COLUMN registrations.phone IS 'Phone number with country code - up to 30 characters, nullable';
COMMENT ON COLUMN registrations.first_name IS 'First name - up to 150 characters';
COMMENT ON COLUMN registrations.last_name IS 'Last name - up to 150 characters';
COMMENT ON COLUMN registrations.state IS 'Country/State - up to 150 characters, nullable';
COMMENT ON COLUMN registrations.email IS 'Email address - up to 320 characters (RFC standard)';
COMMENT ON COLUMN registrations.purpose IS 'Purpose of visit - text field, nullable';

-- Verify the changes
SELECT column_name, data_type, character_maximum_length, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'registrations' 
ORDER BY ordinal_position;