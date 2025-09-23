# Bitcoin Conference India - Domain Fix Deployment Script
# This script will rebuild and redeploy with proper domain configuration

Write-Host "🚀 Bitcoin Conference India - Domain Fix Deployment" -ForegroundColor Yellow
Write-Host "=================================================" -ForegroundColor Yellow

# Navigate to project directory
Set-Location "c:\Users\ummeh\OneDrive\Desktop\Projects\bitconferenceform"

Write-Host "📁 Current directory: $(Get-Location)" -ForegroundColor Green

# Clean previous build
Write-Host "🧹 Cleaning previous build..." -ForegroundColor Cyan
if (Test-Path "dist") {
    Remove-Item -Recurse -Force "dist"
    Write-Host "✅ Previous build cleaned" -ForegroundColor Green
}

# Install dependencies (if needed)
Write-Host "📦 Checking dependencies..." -ForegroundColor Cyan
npm install

# Build the project
Write-Host "🔨 Building project..." -ForegroundColor Cyan
npm run build

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Build successful!" -ForegroundColor Green
} else {
    Write-Host "❌ Build failed!" -ForegroundColor Red
    exit 1
}

# Deploy to Vercel
Write-Host "🚀 Deploying to Vercel..." -ForegroundColor Cyan
vercel --prod --force

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Deployment successful!" -ForegroundColor Green
} else {
    Write-Host "❌ Deployment failed!" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "🎉 Deployment Complete!" -ForegroundColor Yellow
Write-Host "=================================================" -ForegroundColor Yellow
Write-Host "📋 Next Steps:" -ForegroundColor Cyan
Write-Host "1. Add custom domains in Vercel dashboard:" -ForegroundColor White
Write-Host "   - bitcoinconferenceindia.com" -ForegroundColor Gray
Write-Host "   - www.bitcoinconferenceindia.com" -ForegroundColor Gray
Write-Host ""
Write-Host "2. Update DNS records as shown in Vercel" -ForegroundColor White
Write-Host ""
Write-Host "3. Wait 5-30 minutes for DNS propagation" -ForegroundColor White
Write-Host ""
Write-Host "4. Test your domains:" -ForegroundColor White
Write-Host "   - https://bitcoinconferenceindia.com" -ForegroundColor Gray
Write-Host "   - https://www.bitcoinconferenceindia.com" -ForegroundColor Gray
Write-Host ""
Write-Host "🔗 Vercel Dashboard: https://vercel.com/dashboard" -ForegroundColor Blue