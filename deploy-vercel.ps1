# Bitcoin Conference India - Vercel Deployment Script
# This script handles the complete deployment process

Write-Host "🚀 Starting Bitcoin Conference India Form Deployment..." -ForegroundColor Green

# Step 1: Build the project
Write-Host "📦 Building the project..." -ForegroundColor Yellow
npm run build

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Build failed! Please fix the errors and try again." -ForegroundColor Red
    exit 1
}

Write-Host "✅ Build successful!" -ForegroundColor Green

# Step 2: Deploy to Vercel
Write-Host "🌐 Deploying to Vercel..." -ForegroundColor Yellow

# Set environment variables for Vercel
$env:VITE_SUPABASE_URL = "https://gadruxbqlirrjgotlcwp.supabase.co"
$env:VITE_SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdhZHJ1eGJxbGlycmpnb3RsY3dwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc4NDEzMjAsImV4cCI6MjA3MzQxNzMyMH0.t8BWhRzpzDrDtJI-3LK81LIkmRmr8qf11xuXaQ6IyPM"

# Deploy with unique project name suggestions
$projectNames = @(
    "btc-conference-registration-2024",
    "bitcoin-india-conference-form",
    "btc-india-registration",
    "bitcoin-conference-form-2024",
    "india-bitcoin-conference-reg"
)

Write-Host "🎯 Suggested project names:" -ForegroundColor Cyan
for ($i = 0; $i -lt $projectNames.Length; $i++) {
    Write-Host "  $($i + 1). $($projectNames[$i])" -ForegroundColor White
}

Write-Host ""
Write-Host "📝 Manual Deployment Steps:" -ForegroundColor Yellow
Write-Host "1. Run: npx vercel --prod" -ForegroundColor White
Write-Host "2. Choose one of the suggested project names above" -ForegroundColor White
Write-Host "3. Set environment variables in Vercel dashboard:" -ForegroundColor White
Write-Host "   - VITE_SUPABASE_URL: https://gadruxbqlirrjgotlcwp.supabase.co" -ForegroundColor Gray
Write-Host "   - VITE_SUPABASE_ANON_KEY: [your-anon-key]" -ForegroundColor Gray
Write-Host ""
Write-Host "🔗 After deployment, your form will be available at:" -ForegroundColor Green
Write-Host "   https://[your-project-name].vercel.app" -ForegroundColor Cyan

Write-Host ""
Write-Host "✨ Deployment preparation complete!" -ForegroundColor Green