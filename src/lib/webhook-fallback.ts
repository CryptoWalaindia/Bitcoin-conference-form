// Webhook fallback for when Supabase direct connection fails
// This can submit to alternative endpoints like Netlify Functions, Vercel, etc.

export interface WebhookRegistrationData {
  full_name: string
  phone?: string  // Optional field
  email: string
  age: number
}

// Alternative submission methods when Supabase is unreachable
export class RegistrationFallback {
  
  // Method 1: Submit to a webhook service (Pipedream - reliable free service)
  static async submitToWebhook(data: WebhookRegistrationData): Promise<boolean> {
    try {
      // Using Pipedream webhook - create one at https://pipedream.com
      const webhookUrl = 'https://eodqhqhqhqhqhqhq.m.pipedream.net' // Replace with your Pipedream webhook URL
      
      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...data,
          timestamp: new Date().toISOString(),
          source: 'bitcoin-conference-form',
          event_type: 'registration_submission'
        })
      })
      
      return response.ok
    } catch (error) {
      console.error('Webhook submission failed:', error)
      return false
    }
  }
  
  // Method 2: Submit to Google Forms (Primary Fallback)
  static async submitToGoogleForm(data: WebhookRegistrationData): Promise<boolean> {
    try {
      // Google Forms submission URL - CONFIGURED
      const formUrl = 'https://docs.google.com/forms/d/e/1FAIpQLSdfwinpF2k68PSsnbZCisJHBdPBXMRNndUpWUdEW_sjps3xXA/formResponse'
      
      // Form field IDs - CONFIGURED
      const formData = new FormData()
      formData.append('entry.1905204977', data.full_name)        // Full Name
      formData.append('entry.1867140863', data.email)            // Email
      formData.append('entry.1889162089', data.phone || '')      // Phone
      formData.append('entry.1207481842', data.age.toString())   // Age
      
      // Add timestamp for tracking (using a text field if available)
      formData.append('entry.timestamp', new Date().toISOString())
      formData.append('entry.source', 'Bitcoin Conference Registration Form')
      
      console.log('Submitting to Google Forms:', {
        url: formUrl,
        data: {
          full_name: data.full_name,
          email: data.email,
          phone: data.phone || 'Not provided',
          age: data.age
        }
      })
      
      const response = await fetch(formUrl, {
        method: 'POST',
        body: formData,
        mode: 'no-cors' // Required for Google Forms - prevents CORS errors
      })
      
      // Google Forms with no-cors mode always appears successful
      // We assume success if no error was thrown
      console.log('Google Forms submission completed (no-cors mode)')
      return true
    } catch (error) {
      console.error('Google Forms submission failed:', error)
      return false
    }
  }
  
  // Method 3: Email submission via EmailJS
  static async submitViaEmail(data: WebhookRegistrationData): Promise<boolean> {
    try {
      // EmailJS configuration (requires EmailJS account)
      const emailData = {
        service_id: 'YOUR_SERVICE_ID',
        template_id: 'YOUR_TEMPLATE_ID',
        user_id: 'YOUR_USER_ID',
        template_params: {
          to_email: 'bitcoinconferenceindia@gmail.com',
          from_name: data.full_name,
          from_email: data.email,
          phone: data.phone || '',
          age: data.age,
          timestamp: new Date().toLocaleString()
        }
      }
      
      const response = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(emailData)
      })
      
      return response.ok
    } catch (error) {
      console.error('Email submission failed:', error)
      return false
    }
  }
  
  // Method 4: Submit via Formspree (reliable email service)
  static async submitToFormspree(data: WebhookRegistrationData): Promise<boolean> {
    try {
      // Create a free form at https://formspree.io and replace with your form ID
      const formspreeUrl = 'https://formspree.io/f/YOUR_FORM_ID' // Replace with your Formspree form ID
      
      const formData = new FormData()
      formData.append('full_name', data.full_name)
      formData.append('email', data.email)
      formData.append('phone', data.phone || '')
      formData.append('age', data.age.toString())
      formData.append('timestamp', new Date().toISOString())
      formData.append('_subject', 'Bitcoin Conference India Registration')
      
      const response = await fetch(formspreeUrl, {
        method: 'POST',
        body: formData,
        headers: {
          'Accept': 'application/json'
        }
      })
      
      return response.ok
    } catch (error) {
      console.error('Formspree submission failed:', error)
      return false
    }
  }

  // Method 5: Submit to multiple fallback services (Google Forms Priority)
  static async submitWithFallbacks(data: WebhookRegistrationData): Promise<{success: boolean, method: string}> {
    
    // Try Google Forms first (Primary fallback - reliable and free)
    console.log('Trying Google Forms submission...')
    if (await this.submitToGoogleForm(data)) {
      return { success: true, method: 'google-forms' }
    }
    
    // Try Formspree second
    console.log('Trying Formspree submission...')
    if (await this.submitToFormspree(data)) {
      return { success: true, method: 'formspree' }
    }
    
    // Try webhook third
    console.log('Trying webhook submission...')
    if (await this.submitToWebhook(data)) {
      return { success: true, method: 'webhook' }
    }
    
    // Try email last
    console.log('Trying email submission...')
    if (await this.submitViaEmail(data)) {
      return { success: true, method: 'email' }
    }
    
    return { success: false, method: 'none' }
  }
}

// Simple test function to verify external connectivity
export async function testExternalConnectivity(): Promise<boolean> {
  try {
    const response = await fetch('https://httpbin.org/get', {
      method: 'GET',
      signal: AbortSignal.timeout(5000)
    })
    return response.ok
  } catch (error) {
    console.error('External connectivity test failed:', error)
    return false
  }
}