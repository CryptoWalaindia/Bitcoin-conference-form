# PowerShell script to deploy the email confirmation system
# Run this script after setting up your Supabase project and Resend account

Write-Host "🚀 Deploying Bitcoin Conference Email System..." -ForegroundColor Green

# Check if Supabase CLI is installed
try {
    $supabaseVersion = supabase --version
    Write-Host "✅ Supabase CLI found: $supabaseVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Supabase CLI not found. Please install it first:" -ForegroundColor Red
    Write-Host "npm install -g supabase" -ForegroundColor Yellow
    exit 1
}

# Check if user is logged in
try {
    supabase projects list | Out-Null
    Write-Host "✅ Supabase CLI authenticated" -ForegroundColor Green
} catch {
    Write-Host "❌ Please login to Supabase first:" -ForegroundColor Red
    Write-Host "supabase login" -ForegroundColor Yellow
    exit 1
}

# Prompt for project reference
$projectRef = Read-Host "Enter your Supabase project reference ID"
if (-not $projectRef) {
    Write-Host "❌ Project reference is required" -ForegroundColor Red
    exit 1
}

# Link project
Write-Host "🔗 Linking to Supabase project..." -ForegroundColor Blue
try {
    supabase link --project-ref $projectRef
    Write-Host "✅ Project linked successfully" -ForegroundColor Green
} catch {
    Write-Host "❌ Failed to link project. Please check your project reference." -ForegroundColor Red
    exit 1
}

# Deploy Edge Function
Write-Host "📦 Deploying send-confirmation-email function..." -ForegroundColor Blue
try {
    supabase functions deploy send-confirmation-email
    Write-Host "✅ Edge function deployed successfully" -ForegroundColor Green
} catch {
    Write-Host "❌ Failed to deploy Edge function" -ForegroundColor Red
    exit 1
}

# Prompt for environment variables
Write-Host "🔐 Setting up environment variables..." -ForegroundColor Blue

$resendApiKey = Read-Host "Enter your Resend API key" -AsSecureString
$resendApiKeyPlain = [Runtime.InteropServices.Marshal]::PtrToStringAuto([Runtime.InteropServices.Marshal]::SecureStringToBSTR($resendApiKey))

$serviceRoleKey = Read-Host "Enter your Supabase Service Role key" -AsSecureString
$serviceRoleKeyPlain = [Runtime.InteropServices.Marshal]::PtrToStringAuto([Runtime.InteropServices.Marshal]::SecureStringToBSTR($serviceRoleKey))

# Set secrets
try {
    supabase secrets set RESEND_API_KEY=$resendApiKeyPlain
    supabase secrets set SUPABASE_SERVICE_ROLE_KEY=$serviceRoleKeyPlain
    Write-Host "✅ Environment variables set successfully" -ForegroundColor Green
} catch {
    Write-Host "❌ Failed to set environment variables" -ForegroundColor Red
    exit 1
}

# Clear sensitive variables
$resendApiKeyPlain = $null
$serviceRoleKeyPlain = $null

Write-Host ""
Write-Host "🎉 Email system deployed successfully!" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "1. Run the database migration (database/add_ticket_system.sql)" -ForegroundColor White
Write-Host "2. Test the system using test-email-system.html" -ForegroundColor White
Write-Host "3. Update your .env file with the Supabase credentials" -ForegroundColor White
Write-Host ""
Write-Host "Your Edge Function URL:" -ForegroundColor Cyan
Write-Host "https://$projectRef.supabase.co/functions/v1/send-confirmation-email" -ForegroundColor White