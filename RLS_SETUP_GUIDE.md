# Row Level Security (RLS) Setup Guide

## Overview
This guide will help you enable Row Level Security (RLS) on your registrations table to add an extra layer of security to your Bitcoin Conference registration form.

## What is RLS?
Row Level Security (RLS) allows you to control which users can access which rows in a database table. This adds security by ensuring that:
- Anonymous users can only INSERT new registrations (not read existing ones)
- Service roles have full access for backend operations
- Authenticated users can read data (useful for admin interfaces)

## Step 1: Enable RLS
1. Open your Supabase SQL Editor
2. Copy and paste the contents of `enable_rls_security.sql`
3. Execute the script

## Step 2: Verify Setup
1. Copy and paste the contents of `verify_rls_setup.sql`
2. Execute the script to verify everything is working correctly

## What the RLS Setup Does

### Policies Created:
1. **"Allow public registration submissions"**
   - Allows anonymous users to INSERT new registrations
   - This is what your registration form uses

2. **"Allow service role full access"**
   - Allows backend services full access to the table
   - Used by Edge Functions for email confirmations

3. **"Allow authenticated read access"**
   - Allows authenticated users to read registrations
   - Useful for future admin interfaces

### Permissions Granted:
- `anon` role: INSERT permissions only
- `service_role`: Full permissions (SELECT, INSERT, UPDATE, DELETE)
- `authenticated` role: SELECT permissions only

## Security Benefits
- ✅ **Prevents data leaks**: Anonymous users cannot read existing registrations
- ✅ **Maintains functionality**: Registration form continues to work normally
- ✅ **Enables admin features**: Authenticated users can read data for admin purposes
- ✅ **Protects against attacks**: Adds an extra security layer beyond API keys

## Testing
After enabling RLS, test your registration form to ensure:
1. New registrations can still be submitted
2. Confirmation emails are still sent
3. No errors appear in the browser console

## Rollback (if needed)
If you need to disable RLS for any reason:
```sql
ALTER TABLE registrations DISABLE ROW LEVEL SECURITY;
```

## Important Notes
- Your existing application code doesn't need any changes
- RLS works at the database level, so it's transparent to your app
- The `service_role` key (used by Edge Functions) bypasses RLS restrictions
- The `anon` key (used by your frontend) is subject to RLS policies

## Verification Checklist
- [ ] RLS is enabled on registrations table
- [ ] Three policies are created and active
- [ ] Registration form still works
- [ ] Email confirmations still work
- [ ] No console errors in the application