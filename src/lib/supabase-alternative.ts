import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Alternative configuration with network optimizations
export const supabaseAlt = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: false, // Disable session persistence to avoid auth issues
    autoRefreshToken: false,
  },
  global: {
    headers: {
      'x-my-custom-header': 'bitcoin-conference-form',
      'Cache-Control': 'no-cache',
      'Pragma': 'no-cache',
      'User-Agent': 'BitcoinConferenceForm/1.0',
    },
  },
  db: {
    schema: 'public',
  },
  realtime: {
    params: {
      eventsPerSecond: 2,
    },
  }
})

// Alternative submission function with retry logic
export async function submitRegistrationAlt(data: any, maxRetries = 3) {
  console.log('Attempting alternative Supabase submission:', data)
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(`Attempt ${attempt}/${maxRetries}`)
      
      // Try with different timeout strategies
      const timeoutMs = attempt * 10000 // 10s, 20s, 30s
      
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), timeoutMs)
      
      const { data: result, error } = await supabaseAlt
        .from('registrations')
        .insert([data])
        .select()
        .abortSignal(controller.signal)
      
      clearTimeout(timeoutId)
      
      if (error) {
        console.error(`Attempt ${attempt} failed:`, error)
        if (attempt === maxRetries) {
          throw new Error(`All ${maxRetries} attempts failed. Last error: ${error.message}`)
        }
        // Wait before retry
        await new Promise(resolve => setTimeout(resolve, attempt * 2000))
        continue
      }
      
      console.log(`Attempt ${attempt} successful:`, result)
      return { success: true, data: result, method: 'supabase-alt', attempt }
      
    } catch (err: any) {
      console.error(`Attempt ${attempt} error:`, err)
      
      if (attempt === maxRetries) {
        throw err
      }
      
      // Wait before retry with exponential backoff
      await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 1000))
    }
  }
}

// Test connectivity with multiple methods
export async function testAlternativeConnectivity() {
  const tests = []
  
  // Test 1: Basic HEAD request
  try {
    const response = await fetch(supabaseUrl + '/rest/v1/', {
      method: 'HEAD',
      headers: {
        'apikey': supabaseAnonKey,
        'Authorization': `Bearer ${supabaseAnonKey}`,
      },
      signal: AbortSignal.timeout(15000)
    })
    tests.push({ test: 'HEAD request', success: response.ok || response.status === 404, status: response.status })
  } catch (error: any) {
    tests.push({ test: 'HEAD request', success: false, error: error.message })
  }
  
  // Test 2: Simple SELECT query
  try {
    const { data, error } = await supabaseAlt
      .from('registrations')
      .select('count', { count: 'exact', head: true })
    
    tests.push({ test: 'SELECT query', success: !error, error: error?.message })
  } catch (error: any) {
    tests.push({ test: 'SELECT query', success: false, error: error.message })
  }
  
  // Test 3: Ping with different user agent
  try {
    const response = await fetch(supabaseUrl + '/rest/v1/', {
      method: 'HEAD',
      headers: {
        'apikey': supabaseAnonKey,
        'Authorization': `Bearer ${supabaseAnonKey}`,
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      },
      signal: AbortSignal.timeout(15000)
    })
    tests.push({ test: 'Custom User-Agent', success: response.ok || response.status === 404, status: response.status })
  } catch (error: any) {
    tests.push({ test: 'Custom User-Agent', success: false, error: error.message })
  }
  
  return tests
}

// Network diagnostic function
export async function runNetworkDiagnostics() {
  console.log('Running network diagnostics...')
  
  const diagnostics = {
    timestamp: new Date().toISOString(),
    userAgent: navigator.userAgent,
    connection: (navigator as any).connection ? {
      effectiveType: (navigator as any).connection.effectiveType,
      downlink: (navigator as any).connection.downlink,
      rtt: (navigator as any).connection.rtt,
    } : 'Not available',
    tests: [] as any[]
  }
  
  // Test DNS resolution speed
  try {
    const start = performance.now()
    await fetch(supabaseUrl, { method: 'HEAD', signal: AbortSignal.timeout(5000) })
    const end = performance.now()
    diagnostics.tests.push({ test: 'DNS Resolution', time: `${Math.round(end - start)}ms`, success: true })
  } catch (error: any) {
    diagnostics.tests.push({ test: 'DNS Resolution', error: error.message, success: false })
  }
  
  // Test alternative connectivity
  const altTests = await testAlternativeConnectivity()
  diagnostics.tests.push(...altTests)
  
  return diagnostics
}