# Email Confirmation System Setup Guide

This guide will help you set up the email confirmation system with QR code tickets for your Bitcoin Conference registration form.

## Overview

The system automatically sends confirmation emails with QR code tickets when users register. Here's what happens:

1. User submits registration form
2. Data is saved to Supabase database with auto-generated ticket ID
3. Supabase Edge Function is triggered to send confirmation email
4. Email includes QR code attachment with unique ticket ID
5. Registration is marked as email sent

## Prerequisites

- Supabase project with database access
- Resend account for email sending (recommended)
- Supabase CLI installed (for deploying Edge Functions)

## Step 1: Database Setup

1. Run the database migration to add ticket system:

```sql
-- Execute this in your Supabase SQL editor
-- File: database/add_ticket_system.sql
```

This adds:
- `ticket_id` column with unique ticket IDs (format: BTC2025-XXXXXXXX)
- `ticket_qr_code` column to store QR code data
- `email_sent` and `email_sent_at` columns to track email status
- `ticket_status` column for ticket management
- Auto-generation functions and triggers

## Step 2: Get Resend API Key

1. Sign up at [Resend.com](https://resend.com)
2. Verify your domain (or use their test domain for development)
3. Create an API key in the dashboard
4. Copy the API key for later use

## Step 3: Environment Variables

Update your `.env` file with the following variables:

```env
# Existing Supabase config
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# New email service config (for Edge Functions)
RESEND_API_KEY=re_xxxxxxxxxx
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

**Important**: The `SUPABASE_SERVICE_ROLE_KEY` is different from the anon key. Get it from:
Supabase Dashboard → Settings → API → service_role key

## Step 4: Deploy Supabase Edge Function

1. Install Supabase CLI if you haven't:
```bash
npm install -g supabase
```

2. Login to Supabase:
```bash
supabase login
```

3. Link your project:
```bash
supabase link --project-ref your-project-ref
```

4. Deploy the Edge Function:
```bash
supabase functions deploy send-confirmation-email
```

5. Set environment variables for the Edge Function:
```bash
supabase secrets set RESEND_API_KEY=your_resend_api_key
supabase secrets set SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

## Step 5: Test the System

1. Start your development server:
```bash
npm run dev
```

2. Fill out and submit the registration form
3. Check the browser console for logs
4. Check your email for the confirmation with QR code attachment
5. Verify in Supabase dashboard that:
   - Registration has a `ticket_id`
   - `email_sent` is set to `true`
   - `email_sent_at` has a timestamp

## Step 6: Customize Email Template (Optional)

To customize the email content, edit the `sendConfirmationEmail` function in:
`supabase/functions/send-confirmation-email/index.ts`

You can modify:
- Email subject line
- Email body text
- Sender name and email
- QR code styling

## Troubleshooting

### Common Issues:

1. **Edge Function not found**
   - Make sure you deployed the function: `supabase functions deploy send-confirmation-email`
   - Check function logs: `supabase functions logs send-confirmation-email`

2. **Email not sending**
   - Verify Resend API key is correct
   - Check if your domain is verified in Resend
   - Look at Edge Function logs for errors

3. **QR code not generating**
   - Check if the QR code library is loading properly
   - Verify ticket ID is being generated correctly

4. **Database errors**
   - Make sure you ran the database migration
   - Check if the service role key has proper permissions

### Debug Commands:

```bash
# View Edge Function logs
supabase functions logs send-confirmation-email

# Test Edge Function locally
supabase functions serve send-confirmation-email

# Check database schema
supabase db diff
```

## Production Considerations

1. **Email Domain**: Set up a custom domain in Resend for professional emails
2. **Rate Limiting**: Implement rate limiting to prevent spam
3. **Error Handling**: Set up monitoring for failed email sends
4. **Backup**: Consider fallback email services
5. **Security**: Regularly rotate API keys

## QR Code Verification

The QR codes contain just the ticket ID (e.g., "BTC2025-ABC12345"). For event check-in:

1. Scan QR code to get ticket ID
2. Query database: `SELECT * FROM ticket_verification WHERE ticket_id = 'scanned_id'`
3. Check if ticket is valid and not already used
4. Mark as used: `UPDATE registrations SET ticket_status = 'used' WHERE ticket_id = 'scanned_id'`

## Support

If you encounter issues:
1. Check the browser console for frontend errors
2. Check Supabase Edge Function logs
3. Verify all environment variables are set correctly
4. Test with a simple registration first

The system is designed to be resilient - if email sending fails, the registration still succeeds and is stored in the database.