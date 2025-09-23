-- Fix age column to be nullable since the registration form doesn't collect age
-- This allows registrations to work without requiring age information

-- Make age column nullable
ALTER TABLE registrations ALTER COLUMN age DROP NOT NULL;

-- Add comment for documentation
COMMENT ON COLUMN registrations.age IS 'Age field - nullable since not collected in current registration form';