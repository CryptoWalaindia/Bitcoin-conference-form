-- Fix phone column length to accommodate longer phone numbers
-- The current VARCHAR(15) is too restrictive for international phone numbers
-- and phone numbers with formatting (spaces, dashes, etc.)

-- Increase phone column length to 25 characters to accommodate:
-- - International phone numbers with country codes
-- - Phone numbers with formatting (spaces, dashes, parentheses)
-- - Extra characters users might enter
ALTER TABLE registrations ALTER COLUMN phone TYPE VARCHAR(25);

-- Also make phone column nullable since it's optional in the form
ALTER TABLE registrations ALTER COLUMN phone DROP NOT NULL;

-- Add comment for documentation
COMMENT ON COLUMN registrations.phone IS 'Phone number field - up to 25 characters to accommodate international numbers and formatting';