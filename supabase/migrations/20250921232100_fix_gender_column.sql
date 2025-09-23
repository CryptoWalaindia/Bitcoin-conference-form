-- Fix gender column to be nullable since the registration form doesn't collect gender
-- This allows registrations to work without requiring gender information

-- Make gender column nullable
ALTER TABLE registrations ALTER COLUMN gender DROP NOT NULL;

-- Add comment for documentation
COMMENT ON COLUMN registrations.gender IS 'Gender field - nullable since not collected in current registration form';