// Webhook fallback for when Supabase direct connection fails
// This can submit to alternative endpoints like Netlify Functions, Vercel, etc.

export interface WebhookRegistrationData {
  first_name: string
  last_name: string
  phone: string
  email: string
  age: number
  gender: 'Male' | 'Female' | 'Others'
  state: string
  purpose: string
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
  
  // Method 2: Submit to Google Forms (if you have one set up)
  static async submitToGoogleForm(data: WebhookRegistrationData): Promise<boolean> {
    try {
      // Google Forms submission URL format
      // Replace with your actual Google Form URL and field IDs
      const formUrl = 'https://docs.google.com/forms/d/e/YOUR_FORM_ID/formResponse'
      
      const formData = new FormData()
      formData.append('entry.FIELD_ID_1', data.first_name)
      formData.append('entry.FIELD_ID_2', data.last_name)
      formData.append('entry.FIELD_ID_3', data.email)
      formData.append('entry.FIELD_ID_4', data.phone)
      formData.append('entry.FIELD_ID_5', data.age.toString())
      formData.append('entry.FIELD_ID_6', data.gender)
      formData.append('entry.FIELD_ID_7', data.state)
      formData.append('entry.FIELD_ID_8', data.purpose)
      
      const response = await fetch(formUrl, {
        method: 'POST',
        body: formData,
        mode: 'no-cors' // Required for Google Forms
      })
      
      return true // no-cors mode doesn't return response status
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
          from_name: `${data.first_name} ${data.last_name}`,
          from_email: data.email,
          phone: data.phone,
          age: data.age,
          gender: data.gender,
          state: data.state,
          purpose: data.purpose,
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
      formData.append('first_name', data.first_name)
      formData.append('last_name', data.last_name)
      formData.append('email', data.email)
      formData.append('phone', data.phone)
      formData.append('age', data.age.toString())
      formData.append('gender', data.gender)
      formData.append('state', data.state)
      formData.append('purpose', data.purpose)
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

  // Method 5: Submit to multiple fallback services
  static async submitWithFallbacks(data: WebhookRegistrationData): Promise<{success: boolean, method: string}> {
    
    // Try Formspree first (most reliable)
    console.log('Trying Formspree submission...')
    if (await this.submitToFormspree(data)) {
      return { success: true, method: 'formspree' }
    }
    
    // Try webhook second
    console.log('Trying webhook submission...')
    if (await this.submitToWebhook(data)) {
      return { success: true, method: 'webhook' }
    }
    
    // Try Google Forms
    console.log('Trying Google Forms submission...')
    if (await this.submitToGoogleForm(data)) {
      return { success: true, method: 'google-forms' }
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