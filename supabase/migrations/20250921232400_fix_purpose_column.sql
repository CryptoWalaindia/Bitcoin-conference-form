-- Fix purpose column to be nullable since the registration form doesn't collect purpose
-- This allows registrations to work without requiring purpose information

-- Make purpose column nullable
ALTER TABLE registrations ALTER COLUMN purpose DROP NOT NULL;

-- Add comment for documentation
COMMENT ON COLUMN registrations.purpose IS 'Purpose field - nullable since not collected in current registration form';