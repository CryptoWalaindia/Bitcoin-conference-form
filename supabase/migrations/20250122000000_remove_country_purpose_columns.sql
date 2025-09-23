-- Remove country (state) and purpose columns from registrations table
-- This migration removes fields that are no longer needed in the form

-- Drop the columns
ALTER TABLE registrations 
DROP COLUMN IF EXISTS state,
DROP COLUMN IF EXISTS purpose;

-- Update any existing policies or constraints if needed
-- (No additional changes needed as we're just removing columns)