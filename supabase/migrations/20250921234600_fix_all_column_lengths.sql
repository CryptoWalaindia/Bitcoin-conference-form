-- Fix all column lengths to accommodate real-world data
-- Based on the form validation and user input patterns

-- Fix phone column to accommodate country code + phone number
-- Example: "+971 123456789012345" can be up to 25 characters
ALTER TABLE registrations ALTER COLUMN phone TYPE VARCHAR(30);

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

-- Purpose is already TEXT, so it's fine

-- Add comments for documentation
COMMENT ON COLUMN registrations.phone IS 'Phone number with country code - up to 30 characters';
COMMENT ON COLUMN registrations.first_name IS 'First name - up to 150 characters';
COMMENT ON COLUMN registrations.last_name IS 'Last name - up to 150 characters';
COMMENT ON COLUMN registrations.state IS 'Country/State - up to 150 characters';
COMMENT ON COLUMN registrations.email IS 'Email address - up to 320 characters (RFC standard)';