-- Add ticket system to existing registrations table
-- This script adds ticket-related columns to support QR code generation and email confirmation

-- Add new columns for ticket system
ALTER TABLE registrations 
ADD COLUMN IF NOT EXISTS ticket_id VARCHAR(50) UNIQUE,
ADD COLUMN IF NOT EXISTS ticket_qr_code TEXT,
ADD COLUMN IF NOT EXISTS email_sent BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS email_sent_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS ticket_status VARCHAR(20) DEFAULT 'active' CHECK (ticket_status IN ('active', 'used', 'cancelled'));

-- Create index for ticket_id for fast lookups
CREATE INDEX IF NOT EXISTS idx_registrations_ticket_id ON registrations(ticket_id);
CREATE INDEX IF NOT EXISTS idx_registrations_email_sent ON registrations(email_sent);
CREATE INDEX IF NOT EXISTS idx_registrations_ticket_status ON registrations(ticket_status);

-- Function to generate unique ticket ID
CREATE OR REPLACE FUNCTION generate_ticket_id() 
RETURNS TEXT AS $$
DECLARE
    chars TEXT := 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    result TEXT := 'BTC2025-';
    i INTEGER;
BEGIN
    -- Generate 8 random characters
    FOR i IN 1..8 LOOP
        result := result || substr(chars, floor(random() * length(chars) + 1)::integer, 1);
    END LOOP;
    
    -- Check if ticket ID already exists, if so, regenerate
    WHILE EXISTS (SELECT 1 FROM registrations WHERE ticket_id = result) LOOP
        result := 'BTC2025-';
        FOR i IN 1..8 LOOP
            result := result || substr(chars, floor(random() * length(chars) + 1)::integer, 1);
        END LOOP;
    END LOOP;
    
    RETURN result;
END;
$$ LANGUAGE plpgsql;

-- Function to automatically generate ticket ID on insert
CREATE OR REPLACE FUNCTION auto_generate_ticket_id()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.ticket_id IS NULL THEN
        NEW.ticket_id := generate_ticket_id();
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to auto-generate ticket ID
DROP TRIGGER IF EXISTS trigger_auto_generate_ticket_id ON registrations;
CREATE TRIGGER trigger_auto_generate_ticket_id
    BEFORE INSERT ON registrations
    FOR EACH ROW
    EXECUTE FUNCTION auto_generate_ticket_id();

-- Update existing records to have ticket IDs (if any exist without them)
UPDATE registrations 
SET ticket_id = generate_ticket_id() 
WHERE ticket_id IS NULL;

-- Create a view for ticket verification (useful for event check-in)
CREATE OR REPLACE VIEW ticket_verification AS
SELECT 
    ticket_id,
    first_name,
    last_name,
    email,
    ticket_status,
    created_at,
    CASE 
        WHEN ticket_status = 'active' THEN 'Valid'
        WHEN ticket_status = 'used' THEN 'Already Used'
        WHEN ticket_status = 'cancelled' THEN 'Cancelled'
        ELSE 'Invalid'
    END as verification_status
FROM registrations
WHERE ticket_id IS NOT NULL;

-- Grant permissions for the new columns and functions
GRANT SELECT ON ticket_verification TO anon, authenticated;