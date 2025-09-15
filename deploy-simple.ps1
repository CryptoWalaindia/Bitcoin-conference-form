# Bitcoin Conference India - Simple Deployment Script

Write-Host "Bitcoin Conference India - Custom Domain Deployment Setup" -ForegroundColor Green
Write-Host "Domain: bitcoinconferenceindia.com" -ForegroundColor Cyan
Write-Host ""

# Check if Vercel CLI is installed
Write-Host "Checking Vercel CLI installation..." -ForegroundColor Yellow
$vercelInstalled = Get-Command vercel -ErrorAction SilentlyContinue

if (-not $vercelInstalled) {
    Write-Host "Installing Vercel CLI..." -ForegroundColor Yellow
    npm install -g vercel
    if ($LASTEXITCODE -ne 0) {
        Write-Host "Failed to install Vercel CLI. Please install manually: npm install -g vercel" -ForegroundColor Red
        exit 1
    }
}

Write-Host "Vercel CLI is ready!" -ForegroundColor Green

# Build the project
Write-Host "Building the project..." -ForegroundColor Yellow
npm run build

if ($LASTEXITCODE -ne 0) {
    Write-Host "Build failed! Please fix the errors and try again." -ForegroundColor Red
    exit 1
}

Write-Host "Build successful!" -ForegroundColor Green

# Display deployment instructions
Write-Host ""
Write-Host "DEPLOYMENT STEPS:" -ForegroundColor Yellow
Write-Host ""
Write-Host "1. Deploy to Vercel:" -ForegroundColor Cyan
Write-Host "   Run: vercel --prod" -ForegroundColor White
Write-Host "   Project name: bitcoinconferenceindia" -ForegroundColor Gray
Write-Host ""

Write-Host "2. Set Environment Variables in Vercel Dashboard:" -ForegroundColor Cyan
Write-Host "   Go to: https://vercel.com/dashboard" -ForegroundColor White
Write-Host "   Navigate to: Project Settings -> Environment Variables" -ForegroundColor White
Write-Host ""

Write-Host "3. Configure Custom Domain:" -ForegroundColor Cyan
Write-Host "   In Vercel Dashboard -> Domains -> Add Domain" -ForegroundColor White
Write-Host "   Enter: bitcoinconferenceindia.com" -ForegroundColor Gray
Write-Host ""

Write-Host "4. Update DNS Records in GoDaddy:" -ForegroundColor Cyan
Write-Host "   A Record: Name=@ Value=76.76.19.61" -ForegroundColor Gray
Write-Host "   CNAME Record: Name=www Value=cname.vercel-dns.com" -ForegroundColor Gray
Write-Host ""

Write-Host "READY TO DEPLOY!" -ForegroundColor Green
Write-Host "Run 'vercel --prod' to start deployment" -ForegroundColor White