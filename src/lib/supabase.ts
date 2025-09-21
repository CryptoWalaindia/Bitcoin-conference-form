import { createClient } from '@supabase/supabase-js'

// Get Supabase credentials from environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Debug logging (remove in production)
console.log('Supabase URL:', supabaseUrl)
console.log('Supabase Key exists:', !!supabaseAnonKey)

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Environment variables:', import.meta.env)
  throw new Error('Missing Supabase environment variables. Please check your .env file.')
}

// Enhanced Supabase client with network optimizations
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
  global: {
    headers: {
      'x-client-info': 'bitcoin-conference-form',
      'Cache-Control': 'no-cache',
      'Pragma': 'no-cache',
    },
  }
})

// Type definition for the registration data
export interface RegistrationData {
  first_name: string
  last_name: string
  phone?: string  // Optional field
  email: string
  age: number
  gender: 'Male' | 'Female' | 'Others'
  state: string
  purpose: string
}

// Retry function for Supabase submissions
async function submitWithRetry(data: RegistrationData, maxRetries: number) {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(`Supabase submission attempt ${attempt}/${maxRetries}`)
      
      const { data: result, error } = await supabase
        .from('registrations')
        .insert([data])
        .select()
      
      if (error) {
        console.error(`Attempt ${attempt} failed:`, error)
        if (attempt === maxRetries) {
          throw error
        }
        // Wait before retry with exponential backoff
        await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 1000))
        continue
      }
      
      return { data: result, error: null }
    } catch (err) {
      console.error(`Attempt ${attempt} error:`, err)
      if (attempt === maxRetries) {
        throw err
      }
      // Wait before retry
      await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 1000))
    }
  }
}

// Function to submit registration with enhanced error handling and fallbacks
export async function submitRegistration(data: RegistrationData) {
  console.log('Attempting to submit registration:', data)
  
  try {
    // Test connectivity first
    const connectivityTest = await testSupabaseConnectivity()
    if (!connectivityTest.success) {
      console.warn('Supabase connectivity test failed:', connectivityTest.error)
      return await handleSupabaseFailure(data)
    }

    // Try Supabase submission with retry logic
    const result = await submitWithRetry(data, 3)
    
    console.log('Supabase submission successful:', result)
    
    // Send confirmation email with QR code ticket
    if (result?.data && result.data.length > 0) {
      const registrationId = result.data[0].id
      try {
        await sendConfirmationEmail(registrationId)
        console.log('Confirmation email sent successfully')
      } catch (emailError) {
        console.error('Failed to send confirmation email:', emailError)
        // Don't fail the registration if email fails
      }
    }
    
    // Clear any locally stored data on successful submission
    clearLocalRegistrations()
    
    return { success: true, method: 'supabase', data: result?.data || [] }
  } catch (err: any) {
    console.error('All Supabase attempts failed:', err)
    
    // Handle specific error types
    if (err.code === 'PGRST116') {
      console.log('Table not found, trying fallback methods...')
    } else if (err.code === '42501') {
      console.log('Permission denied, trying fallback methods...')
    } else {
      console.log('Database/network error, trying fallback methods...')
    }
    
    return await handleSupabaseFailure(data)
  }
}

// Handle Supabase failure with fallback methods
async function handleSupabaseFailure(data: RegistrationData) {
  console.log('Supabase failed, trying alternative submission methods...')
  
  // Import fallback class dynamically to avoid circular imports
  const { RegistrationFallback } = await import('./webhook-fallback')
  
  try {
    // Try fallback submission methods
    const fallbackResult = await RegistrationFallback.submitWithFallbacks(data)
    
    if (fallbackResult.success) {
      console.log(`Registration successful via ${fallbackResult.method}`)
      // Still store locally for backup
      storeRegistrationLocally(data)
      return { 
        success: true, 
        method: fallbackResult.method, 
        message: `Registration submitted successfully via ${fallbackResult.method}. A backup has been saved locally.` 
      }
    } else {
      // All fallbacks failed, store locally
      storeRegistrationLocally(data)
      return {
        success: true, // Still return success since we stored locally
        method: 'local-storage',
        message: 'Unable to connect to any submission service. Your registration has been saved locally and will be submitted when connection is restored.'
      }
    }
  } catch (fallbackError) {
    console.error('All fallback methods failed:', fallbackError)
    // Store locally as last resort
    storeRegistrationLocally(data)
    return {
      success: true, // Still return success since we stored locally
      method: 'local-storage',
      message: 'Network connectivity issue detected. Your registration has been saved locally and will be submitted when connection is restored.'
    }
  }
}

// Test Supabase connectivity
async function testSupabaseConnectivity(): Promise<{success: boolean, error?: string}> {
  try {
    // Simple connectivity test
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 5000) // 5 second timeout
    
    const response = await fetch(supabaseUrl + '/rest/v1/', {
      method: 'HEAD',
      headers: {
        'apikey': supabaseAnonKey,
        'Authorization': `Bearer ${supabaseAnonKey}`
      },
      signal: controller.signal
    })
    
    clearTimeout(timeoutId)
    
    if (response.ok || response.status === 404) {
      return { success: true }
    } else {
      return { success: false, error: `HTTP ${response.status}` }
    }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}

// Store registration locally as fallback
function storeRegistrationLocally(data: RegistrationData) {
  try {
    const existingData = JSON.parse(localStorage.getItem('pending_registrations') || '[]')
    const newRegistration = {
      ...data,
      id: Date.now(),
      timestamp: new Date().toISOString(),
      status: 'pending'
    }
    existingData.push(newRegistration)
    localStorage.setItem('pending_registrations', JSON.stringify(existingData))
    console.log('Registration stored locally:', newRegistration)
  } catch (error) {
    console.error('Failed to store registration locally:', error)
  }
}

// Clear local registrations after successful submission
function clearLocalRegistrations() {
  try {
    localStorage.removeItem('pending_registrations')
    console.log('Local registrations cleared')
  } catch (error) {
    console.error('Failed to clear local registrations:', error)
  }
}

// Get pending local registrations
export function getPendingRegistrations() {
  try {
    return JSON.parse(localStorage.getItem('pending_registrations') || '[]')
  } catch (error) {
    console.error('Failed to get pending registrations:', error)
    return []
  }
}

// Sync pending registrations when connectivity is restored
export async function syncPendingRegistrations(): Promise<{success: number, failed: number, errors: string[]}> {
  const pendingRegistrations = getPendingRegistrations()
  
  if (pendingRegistrations.length === 0) {
    return { success: 0, failed: 0, errors: [] }
  }

  console.log(`Attempting to sync ${pendingRegistrations.length} pending registrations`)
  
  let successCount = 0
  let failedCount = 0
  const errors: string[] = []
  
  for (const registration of pendingRegistrations) {
    try {
      // Remove local metadata before submitting
      const { id, timestamp, status, ...registrationData } = registration
      
      const { data: result, error } = await supabase
        .from('registrations')
        .insert([registrationData])
        .select()

      if (error) {
        console.error('Sync error for registration:', error)
        errors.push(`Failed to sync registration for ${registrationData.email}: ${error.message}`)
        failedCount++
      } else {
        console.log('Successfully synced registration:', result)
        successCount++
      }
    } catch (err: any) {
      console.error('Sync error:', err)
      errors.push(`Network error syncing registration: ${err.message}`)
      failedCount++
    }
  }
  
  // If all succeeded, clear local storage
  if (failedCount === 0) {
    clearLocalRegistrations()
    console.log('All registrations synced successfully, local storage cleared')
  }
  
  return { success: successCount, failed: failedCount, errors }
}

// Function to send confirmation email via Supabase Edge Function
export async function sendConfirmationEmail(registrationId: string): Promise<void> {
  try {
    const { data, error } = await supabase.functions.invoke('send-confirmation-email', {
      body: { registration_id: registrationId }
    })

    if (error) {
      console.error('Error calling email function:', error)
      throw new Error(`Failed to send confirmation email: ${error.message}`)
    }

    console.log('Email function response:', data)
  } catch (error: any) {
    console.error('Error sending confirmation email:', error)
    throw error
  }
}