# Bitcoin Conference India - Custom Domain Deployment Script
# This script sets up deployment to bitcoinconferenceindia.com with auto-deployment from GitHub

Write-Host "🚀 Bitcoin Conference India - Custom Domain Deployment Setup" -ForegroundColor Green
Write-Host "Domain: bitcoinconferenceindia.com" -ForegroundColor Cyan
Write-Host ""

# Step 1: Check if Vercel CLI is installed
Write-Host "🔍 Checking Vercel CLI installation..." -ForegroundColor Yellow
$vercelInstalled = Get-Command vercel -ErrorAction SilentlyContinue

if (-not $vercelInstalled) {
    Write-Host "📦 Installing Vercel CLI..." -ForegroundColor Yellow
    npm install -g vercel
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Failed to install Vercel CLI. Please install manually: npm install -g vercel" -ForegroundColor Red
        exit 1
    }
}

Write-Host "✅ Vercel CLI is ready!" -ForegroundColor Green

# Step 2: Build the project
Write-Host "📦 Building the project..." -ForegroundColor Yellow
npm run build

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Build failed! Please fix the errors and try again." -ForegroundColor Red
    exit 1
}

Write-Host "✅ Build successful!" -ForegroundColor Green

# Step 3: Display deployment instructions
Write-Host ""
Write-Host "🎯 DEPLOYMENT STEPS:" -ForegroundColor Yellow
Write-Host ""
Write-Host "1. 🌐 Deploy to Vercel:" -ForegroundColor Cyan
Write-Host "   Run: vercel --prod" -ForegroundColor White
Write-Host "   Project name: bitcoinconferenceindia" -ForegroundColor Gray
Write-Host ""

Write-Host "2. 🔧 Set Environment Variables in Vercel Dashboard:" -ForegroundColor Cyan
Write-Host "   Go to: https://vercel.com/dashboard" -ForegroundColor White
Write-Host "   Navigate to: Project Settings → Environment Variables" -ForegroundColor White
Write-Host ""
Write-Host "   Add these variables:" -ForegroundColor Gray
Write-Host "   VITE_SUPABASE_URL = https://gadruxbqlirrjgotlcwp.supabase.co" -ForegroundColor Gray
Write-Host "   VITE_SUPABASE_ANON_KEY = [Your Supabase Key]" -ForegroundColor Gray
Write-Host ""

Write-Host "3. 🌍 Configure Custom Domain:" -ForegroundColor Cyan
Write-Host "   In Vercel Dashboard → Domains → Add Domain" -ForegroundColor White
Write-Host "   Enter: bitcoinconferenceindia.com" -ForegroundColor Gray
Write-Host ""

Write-Host "4. 📡 Update DNS Records in GoDaddy:" -ForegroundColor Cyan
Write-Host "   Go to your GoDaddy DNS Management" -ForegroundColor White
Write-Host "   Add these records:" -ForegroundColor White
Write-Host ""
Write-Host "   A Record:" -ForegroundColor Gray
Write-Host "   Name: @" -ForegroundColor Gray
Write-Host "   Value: 76.76.19.61" -ForegroundColor Gray
Write-Host ""
Write-Host "   CNAME Record:" -ForegroundColor Gray
Write-Host "   Name: www" -ForegroundColor Gray
Write-Host "   Value: cname.vercel-dns.com" -ForegroundColor Gray
Write-Host ""

Write-Host "5. 🔄 Setup Auto-Deployment from GitHub:" -ForegroundColor Cyan
Write-Host "   In Vercel Dashboard → Git → Connect Repository" -ForegroundColor White
Write-Host "   Select your GitHub repository" -ForegroundColor Gray
Write-Host ""

Write-Host "🎉 READY TO DEPLOY!" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "1. Run 'vercel --prod' to deploy" -ForegroundColor White
Write-Host "2. Follow the configuration steps above" -ForegroundColor White
Write-Host "3. Push changes to GitHub for auto-deployment" -ForegroundColor White
Write-Host ""
Write-Host "🔗 Useful Links:" -ForegroundColor Cyan
Write-Host "Vercel Dashboard: https://vercel.com/dashboard" -ForegroundColor Blue
Write-Host "GoDaddy DNS: https://dcc.godaddy.com/control/dnsmanagement?domainName=bitcoinconferenceindia.com" -ForegroundColor Blue