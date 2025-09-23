# Database Migration Guide - New Table Structure

## Overview
This guide will help you migrate from the old table structure (with separate first_name, last_name, gender fields) to the new simplified structure (with single full_name field and no gender field).

## Prerequisites
- ✅ You have exported/downloaded existing data from the current table
- ✅ You have access to Supabase dashboard
- ✅ You have admin privileges on the database

## Step-by-Step Migration Process

### Step 1: Backup Verification
Ensure you have your exported data saved safely. The exported data should contain:
- first_name
- last_name  
- phone
- email
- age
- created_at
- Any other existing fields

### Step 2: Run the New Table Creation Script
1. Open your Supabase dashboard
2. Go to the SQL Editor
3. Copy and paste the content from: `supabase/migrations/20250122000002_create_new_registrations_table.sql`
4. Execute the script

This will:
- Drop the old `registrations` table
- Create a new `registrations` table with simplified structure
- Add proper indexes and constraints
- Set up automatic `updated_at` triggers

### Step 3: Import Your Exported Data

#### Option A: If you have CSV export
1. Prepare your CSV file with columns: `full_name, phone, email, age, terms_accepted, created_at`
2. Transform your data:
   - Combine `first_name` and `last_name` into `full_name`
   - Set `terms_accepted` to `true` for all existing records
3. Use Supabase dashboard's "Import data" feature or SQL COPY command

#### Option B: If you have JSON/SQL export
1. Modify the `import_exported_data.sql` script
2. Add your INSERT statements or transformation logic
3. Execute in Supabase SQL Editor

#### Option C: Manual transformation example
```sql
-- If you have a temporary table with old structure
INSERT INTO registrations (full_name, phone, email, age, terms_accepted, created_at)
SELECT 
    CONCAT(TRIM(first_name), ' ', TRIM(last_name)) as full_name,
    phone,
    email,
    age,
    true as terms_accepted,
    created_at
FROM your_old_data_table
WHERE email IS NOT NULL AND email != '';
```

### Step 4: Verify the Migration
Run these queries to verify everything is working:

```sql
-- Check total record count
SELECT COUNT(*) as total_records FROM registrations;

-- Check data structure
SELECT * FROM registrations LIMIT 5;

-- Verify no duplicate emails
SELECT email, COUNT(*) 
FROM registrations 
GROUP BY email 
HAVING COUNT(*) > 1;

-- Check for any null required fields
SELECT COUNT(*) as null_full_names FROM registrations WHERE full_name IS NULL;
SELECT COUNT(*) as null_emails FROM registrations WHERE email IS NULL;
SELECT COUNT(*) as null_ages FROM registrations WHERE age IS NULL;
```

### Step 5: Test the Application
1. Start your development server: `npm run dev`
2. Try submitting a test registration
3. Verify the data appears correctly in Supabase
4. Check that all form validations work properly

## New Table Structure

```sql
CREATE TABLE registrations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    full_name TEXT NOT NULL,           -- Combined first + last name
    phone TEXT,                        -- Optional field
    email TEXT NOT NULL UNIQUE,        -- Required and unique
    age INTEGER NOT NULL CHECK (age >= 1 AND age <= 99),
    terms_accepted BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## Key Changes
- ✅ `first_name` + `last_name` → `full_name` (single field)
- ✅ `gender` field completely removed
- ✅ `phone` remains optional
- ✅ `email` remains required with unique constraint
- ✅ `age` remains required with validation (1-99)
- ✅ Added `terms_accepted` boolean field
- ✅ Added `updated_at` timestamp with auto-update trigger

## Rollback Plan (if needed)
If you need to rollback:
1. Keep your exported data safe
2. You can recreate the old table structure
3. Re-import the original data
4. Revert the application code changes

## Support
If you encounter any issues during migration:
1. Check the Supabase logs in the dashboard
2. Verify your exported data format
3. Test with a small subset of data first
4. Ensure all required environment variables are set

## Post-Migration Checklist
- [ ] New table created successfully
- [ ] Data imported and verified
- [ ] Application connects to new table
- [ ] Form submissions work correctly
- [ ] Email uniqueness constraint working
- [ ] All validations functioning
- [ ] No data loss confirmed