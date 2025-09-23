-- Fix state column to be nullable since the registration form doesn't collect state
-- This allows registrations to work without requiring state information

-- Make state column nullable
ALTER TABLE registrations ALTER COLUMN state DROP NOT NULL;

-- Add comment for documentation
COMMENT ON COLUMN registrations.state IS 'State field - nullable since not collected in current registration form';