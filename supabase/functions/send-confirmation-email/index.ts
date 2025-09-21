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
    
    const { registrationId } = body
    
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
      name: `${registration.first_name} ${registration.last_name}`,
      hasTicketId: !!registration.ticket_id
    })

    // Generate ticket ID if not exists
    let ticketId = registration.ticket_id
    if (!ticketId) {
      ticketId = `BTC2025-${Math.random().toString(36).substr(2, 8).toUpperCase()}`
      console.log('🎫 Generated new ticket ID:', ticketId)
    } else {
      console.log('🎫 Using existing ticket ID:', ticketId)
    }

    // Generate QR code data
    const qrData = `BTC2025-TICKET:${ticketId}:${registration.email}:${registration.first_name} ${registration.last_name}`
    const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(qrData)}`
    console.log('📱 QR code URL generated:', qrCodeUrl)

    // Try to update registration with ticket info (but don't fail if it doesn't work)
    try {
      console.log('💾 Updating database with ticket info...')
      const { error: updateError } = await supabase
        .from('registrations')
        .update({ 
          ticket_id: ticketId,
          ticket_qr_code: qrCodeUrl,
          email_sent: true,
          email_sent_at: new Date().toISOString()
        })
        .eq('id', registrationId)
      
      if (updateError) {
        console.log('⚠️ Database update failed (continuing anyway):', updateError)
      } else {
        console.log('✅ Database updated successfully')
      }
    } catch (updateError) {
      console.log('⚠️ Database update failed (continuing anyway):', updateError)
    }

    // Send email using Resend
    console.log('📧 Preparing email...')
    const emailData = {
      from: 'Bitcoin Conference India <onboarding@resend.dev>',
      to: [registration.email],
      subject: '🎫 Your Bitcoin Conference India 2025 Ticket - Confirmation & QR Code',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Bitcoin Conference India 2025 - Your Ticket</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #f7931a 0%, #ff6b35 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 28px;">🎫 Your Ticket is Ready!</h1>
            <p style="color: white; margin: 10px 0 0 0; font-size: 18px;">Bitcoin Conference India 2025</p>
          </div>
          
          <div style="background: white; padding: 30px; border: 1px solid #ddd; border-top: none; border-radius: 0 0 10px 10px;">
            <h2 style="color: #f7931a; margin-top: 0;">Hello ${registration.first_name}! 👋</h2>
            
            <p>Thank you for registering for <strong>Bitcoin Conference India 2025</strong>! We're excited to have you join us for this incredible event.</p>
            
            <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="margin-top: 0; color: #333;">📋 Registration Details</h3>
              <p><strong>Name:</strong> ${registration.first_name} ${registration.last_name}</p>
              <p><strong>Email:</strong> ${registration.email}</p>
              <p><strong>Ticket ID:</strong> <code style="background: #e9ecef; padding: 2px 6px; border-radius: 4px;">${ticketId}</code></p>
              <p><strong>Registration Date:</strong> ${new Date(registration.created_at).toLocaleDateString()}</p>
            </div>
            
            <div style="text-align: center; margin: 30px 0;">
              <h3 style="color: #f7931a;">🎫 Your QR Code Ticket</h3>
              <p>Present this QR code at the event entrance:</p>
              <img src="${qrCodeUrl}" alt="QR Code Ticket" style="max-width: 250px; border: 2px solid #f7931a; border-radius: 8px; padding: 10px; background: white;">
              <p style="font-size: 12px; color: #666; margin-top: 10px;">Save this image or take a screenshot for easy access</p>
            </div>
            
            <div style="background: #e8f5e8; padding: 15px; border-radius: 8px; border-left: 4px solid #28a745;">
              <h4 style="margin-top: 0; color: #155724;">✅ What's Next?</h4>
              <ul style="margin: 0; padding-left: 20px;">
                <li>Save this email and QR code</li>
                <li>Bring a valid ID to the event</li>
                <li>Arrive 30 minutes early for check-in</li>
                <li>Follow us on social media for updates</li>
              </ul>
            </div>
            
            <div style="background: #fff3cd; padding: 15px; border-radius: 8px; border-left: 4px solid #ffc107; margin-top: 20px;">
              <h4 style="margin-top: 0; color: #856404;">📅 Event Information</h4>
              <p style="margin: 5px 0;"><strong>Date:</strong> Coming Soon</p>
              <p style="margin: 5px 0;"><strong>Venue:</strong> To be announced</p>
              <p style="margin: 5px 0;"><strong>Time:</strong> Details will be shared soon</p>
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
        message: `Email sent successfully to ${registration.email}!`,
        ticketId: ticketId,
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