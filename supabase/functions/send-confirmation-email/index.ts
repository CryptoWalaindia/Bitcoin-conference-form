import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    console.log('🚀 Edge Function started')
    
    // Get environment variables
    const resendApiKey = Deno.env.get('RESEND_API_KEY')
    const supabaseUrl = Deno.env.get('SUPABASE_URL')
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')

    console.log('🔑 Environment check:', {
      hasResendKey: !!resendApiKey,
      hasSupabaseUrl: !!supabaseUrl,
      hasServiceKey: !!supabaseServiceKey,
      supabaseUrl: supabaseUrl
    })

    if (!resendApiKey || !supabaseUrl || !supabaseServiceKey) {
      throw new Error('Missing required environment variables')
    }

    // Parse request body
    let body;
    try {
      body = await req.json()
      console.log('📝 Request body:', body)
    } catch (parseError) {
      console.error('❌ JSON parse error:', parseError)
      throw new Error('Invalid JSON in request body')
    }
    
    const { registration_id: registrationId } = body
    
    if (!registrationId) {
      throw new Error('Registration ID is required')
    }

    console.log('🔍 Looking for registration ID:', registrationId)

    // Initialize Supabase client
    const supabase = createClient(supabaseUrl, supabaseServiceKey)
    console.log('✅ Supabase client created')
    
    // Get registration details
    console.log('📊 Fetching registration from database...')
    const { data: registration, error: fetchError } = await supabase
      .from('registrations')
      .select('*')
      .eq('id', registrationId)
      .single()

    console.log('📊 Database response:', { registration, fetchError })

    if (fetchError) {
      console.error('❌ Database fetch error:', fetchError)
      throw new Error(`Failed to fetch registration: ${fetchError.message}`)
    }

    if (!registration) {
      throw new Error('Registration not found')
    }

    console.log('✅ Registration found:', {
      id: registration.id,
      email: registration.email,
      name: registration.full_name
    })

    // Update registration to mark email as sent (but don't fail if it doesn't work)
    try {
      console.log('💾 Updating database with email status...')
      // Try to update email tracking fields if they exist
      const { error: updateError } = await supabase
        .from('registrations')
        .update({ 
          email_sent: true,
          email_sent_at: new Date().toISOString()
        })
        .eq('id', registrationId)
      
      if (updateError) {
        console.log('⚠️ Database update failed (continuing anyway - email tracking columns may not exist):', updateError.message)
      } else {
        console.log('✅ Database updated successfully with email tracking')
      }
    } catch (updateError) {
      console.log('⚠️ Database update failed (continuing anyway - email tracking columns may not exist):', updateError)
    }

    // Send email using Resend
    console.log('📧 Preparing email...')
    const emailData = {
      from: 'Bitcoin Conference India <onboarding@resend.dev>',
      to: [registration.email],
      subject: '✅ Registration Confirmed - Bitcoin Conference India 2025',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Bitcoin Conference India 2025 - Registration Confirmed</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #f7931a 0%, #ff6b35 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 28px;">✅ Registration Confirmed!</h1>
            <p style="color: white; margin: 10px 0 0 0; font-size: 18px;">Bitcoin Conference India 2025</p>
          </div>
          
          <div style="background: white; padding: 30px; border: 1px solid #ddd; border-top: none; border-radius: 0 0 10px 10px;">
            <h2 style="color: #f7931a; margin-top: 0;">Hello ${registration.full_name}! 👋</h2>
            
            <p>Thank you for registering for <strong>Bitcoin Conference India 2025</strong>!</p>
            
            <p>We have received your details and <strong>we will contact you soon</strong>.</p>
            
            <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="margin-top: 0; color: #333;">📋 Your Registration Details</h3>
              <p><strong>Name:</strong> ${registration.full_name}</p>
              <p><strong>Email:</strong> ${registration.email}</p>
              <p><strong>Registration Date:</strong> ${new Date(registration.created_at).toLocaleDateString()}</p>
            </div>
            
            <div style="background: #e8f5e8; padding: 20px; border-radius: 8px; border-left: 4px solid #28a745; margin: 20px 0;">
              <h4 style="margin-top: 0; color: #155724;">🎉 Exciting Opportunity!</h4>
              <p style="margin: 0;">You now have a chance to <strong>win a free ticket</strong> to Bitcoin Conference India 2025! Stay tuned for more details.</p>
            </div>
            
            <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
            
            <p style="text-align: center; color: #666; font-size: 14px;">
              Questions? Contact us at <a href="mailto:support@bitcoinconferenceindia.com" style="color: #f7931a;">support@bitcoinconferenceindia.com</a>
            </p>
            
            <p style="text-align: center; color: #666; font-size: 14px;">
              <strong>Bitcoin Conference India 2025</strong><br>
              Building the Future of Finance in India 🇮🇳
            </p>
          </div>
        </body>
        </html>
      `
    }

    console.log('📧 Sending email to:', registration.email)
    const emailResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${resendApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(emailData),
    })

    const emailResult = await emailResponse.json()
    console.log('📧 Email API response:', { 
      status: emailResponse.status, 
      ok: emailResponse.ok, 
      result: emailResult 
    })

    if (!emailResponse.ok) {
      throw new Error(`Email sending failed: ${emailResult.message || 'Unknown error'}`)
    }

    console.log('✅ Email sent successfully!')

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: `Confirmation email sent successfully to ${registration.email}!`,
        emailId: emailResult.id
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )

  } catch (error) {
    console.error('❌ Function error:', error.message)
    console.error('❌ Full error:', error)
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message,
        details: error.stack
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      },
    )
  }
})