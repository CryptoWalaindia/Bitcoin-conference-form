-- Check the current table structure
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'registrations' 
ORDER BY ordinal_position;

-- Check if email tracking columns exist
SELECT EXISTS (
    SELECT 1 
    FROM information_schema.columns 
    WHERE table_name = 'registrations' 
    AND column_name = 'email_sent'
) as has_email_sent_column;

SELECT EXISTS (
    SELECT 1 
    FROM information_schema.columns 
    WHERE table_name = 'registrations' 
    AND column_name = 'email_sent_at'
) as has_email_sent_at_column;