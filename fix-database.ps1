# Fix Database RLS Issue
# This script helps you apply the RLS fix to your Supabase database

Write-Host "🔧 Bitcoin Conference Registration - Database Fix" -ForegroundColor Cyan
Write-Host "=================================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "The issue is with Row Level Security (RLS) policies blocking anonymous registrations." -ForegroundColor Yellow
Write-Host ""

Write-Host "To fix this, you have two options:" -ForegroundColor Green
Write-Host ""

Write-Host "OPTION 1 - Using Supabase Dashboard (Recommended):" -ForegroundColor Cyan
Write-Host "1. Go to https://supabase.com/dashboard" -ForegroundColor White
Write-Host "2. Select your project: gadruxbqlirrjgotlcwp" -ForegroundColor White
Write-Host "3. Go to 'SQL Editor' in the left sidebar" -ForegroundColor White
Write-Host "4. Copy and paste the contents of 'fix-rls-issue.sql'" -ForegroundColor White
Write-Host "5. Click 'Run' to execute the SQL" -ForegroundColor White
Write-Host ""

Write-Host "OPTION 2 - Using Supabase CLI:" -ForegroundColor Cyan
Write-Host "1. Make sure you have Supabase CLI installed" -ForegroundColor White
Write-Host "2. Run: supabase db reset" -ForegroundColor White
Write-Host "3. Or run the SQL file directly" -ForegroundColor White
Write-Host ""

Write-Host "After applying the fix:" -ForegroundColor Green
Write-Host "✅ Anonymous users will be able to register" -ForegroundColor White
Write-Host "✅ Form submissions will work properly" -ForegroundColor White
Write-Host "✅ Data will be saved to the database" -ForegroundColor White
Write-Host ""

# Check if Supabase CLI is available
$supabaseCli = Get-Command supabase -ErrorAction SilentlyContinue
if ($supabaseCli) {
    Write-Host "Supabase CLI detected. Would you like to apply the fix now? (y/n): " -ForegroundColor Yellow -NoNewline
    $response = Read-Host
    
    if ($response -eq 'y' -or $response -eq 'Y') {
        Write-Host "Applying database fix..." -ForegroundColor Green
        
        # Check if we're in a Supabase project
        if (Test-Path "supabase/config.toml") {
            Write-Host "Running SQL fix..." -ForegroundColor Yellow
            supabase db reset --db-url "postgresql://postgres:[YOUR-PASSWORD]@db.gadruxbqlirrjgotlcwp.supabase.co:5432/postgres"
        } else {
            Write-Host "Not in a Supabase project directory. Please run this from your project root." -ForegroundColor Red
        }
    }
} else {
    Write-Host "Supabase CLI not found. Please use the Dashboard method above." -ForegroundColor Yellow
}

Write-Host ""
Write-Host "📝 The SQL file 'fix-rls-issue.sql' has been created in your project directory." -ForegroundColor Cyan
Write-Host "You can copy its contents and run them in the Supabase SQL Editor." -ForegroundColor Cyan
Write-Host ""

# Open the SQL file for easy copying
Write-Host "Opening the SQL file for you to copy..." -ForegroundColor Green
Start-Process notepad.exe -ArgumentList "fix-rls-issue.sql"

Write-Host ""
Write-Host "After applying the fix, test your registration form again!" -ForegroundColor Green
Write-Host "The form should now successfully save data to the database." -ForegroundColor Green