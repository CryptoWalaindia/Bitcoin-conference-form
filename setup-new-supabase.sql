-- Bitcoin Conference Registration Table Setup
-- Run this in your new Supabase project's SQL Editor

-- Create the registrations table
CREATE TABLE IF NOT EXISTS public.registrations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    age INTEGER NOT NULL CHECK (age >= 16 AND age <= 100),
    gender VARCHAR(10) NOT NULL CHECK (gender IN ('Male', 'Female', 'Others')),
    state VARCHAR(100) NOT NULL,
    purpose TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create an index on email for faster lookups
CREATE INDEX IF NOT EXISTS idx_registrations_email ON public.registrations(email);

-- Create an index on created_at for sorting
CREATE INDEX IF NOT EXISTS idx_registrations_created_at ON public.registrations(created_at);

-- Enable Row Level Security (RLS)
ALTER TABLE public.registrations ENABLE ROW LEVEL SECURITY;

-- Create policy to allow public inserts (for form submissions)
CREATE POLICY "Allow public registration inserts" ON public.registrations
    FOR INSERT WITH CHECK (true);

-- Create policy to allow public reads (optional - for viewing registrations)
CREATE POLICY "Allow public registration reads" ON public.registrations
    FOR SELECT USING (true);

-- Create a function to automatically update the updated_at timestamp
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc'::text, NOW());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update updated_at
CREATE TRIGGER handle_registrations_updated_at
    BEFORE UPDATE ON public.registrations
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

-- Insert some sample data for testing
INSERT INTO public.registrations (first_name, last_name, phone, email, age, gender, state, purpose) VALUES
('John', 'Doe', '9876543210', 'john.doe@example.com', 28, 'Male', 'Maharashtra', 'Learning about Bitcoin technology'),
('Jane', 'Smith', '9876543211', 'jane.smith@example.com', 32, 'Female', 'Karnataka', 'Networking with Bitcoin enthusiasts'),
('Alex', 'Johnson', '9876543212', 'alex.johnson@example.com', 25, 'Others', 'Delhi', 'Investment opportunities in cryptocurrency');

-- Verify the setup
SELECT 
    'Table created successfully' as status,
    COUNT(*) as sample_records
FROM public.registrations;