# Quick deployment script for Bitcoin Conference Form
# Usage: .\deploy.ps1 "Your commit message"

param(
    [Parameter(Mandatory=$true)]
    [string]$CommitMessage
)

Write-Host "Building project..." -ForegroundColor Green
npm run build

if ($LASTEXITCODE -eq 0) {
    Write-Host "Build successful! Committing and pushing..." -ForegroundColor Green
    
    git add .
    git commit -m $CommitMessage
    git push
    
    Write-Host "Deployment initiated! Check Vercel dashboard for status." -ForegroundColor Green
    Write-Host "Your site will be live at: https://your-project-name.vercel.app" -ForegroundColor Yellow
} else {
    Write-Host "Build failed! Please fix errors before deploying." -ForegroundColor Red
}