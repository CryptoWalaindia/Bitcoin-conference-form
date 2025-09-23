-- Migration to restructure form fields
-- Remove first_name, last_name, gender columns and add full_name column

-- Add the new full_name column
ALTER TABLE registrations ADD COLUMN full_name TEXT;

-- Migrate existing data by combining first_name and last_name into full_name
UPDATE registrations 
SET full_name = CONCAT(first_name, ' ', last_name) 
WHERE first_name IS NOT NULL AND last_name IS NOT NULL;

-- Drop the old columns
ALTER TABLE registrations DROP COLUMN IF EXISTS first_name;
ALTER TABLE registrations DROP COLUMN IF EXISTS last_name;
ALTER TABLE registrations DROP COLUMN IF EXISTS gender;

-- Make full_name NOT NULL after data migration
ALTER TABLE registrations ALTER COLUMN full_name SET NOT NULL;

-- Add comment for documentation
COMMENT ON COLUMN registrations.full_name IS 'Full name of the registrant (combined from previous first_name and last_name fields)';