-- Disable the automatic ticket ID generation trigger
-- This is for the simplified email system without QR tickets

-- Drop the trigger that auto-generates ticket IDs
DROP TRIGGER IF EXISTS trigger_auto_generate_ticket_id ON registrations;

-- The trigger function and ticket_id column remain for future use
-- but new registrations won't automatically get ticket IDs