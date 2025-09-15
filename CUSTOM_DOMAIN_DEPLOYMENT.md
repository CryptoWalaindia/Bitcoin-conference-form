# 🌐 Bitcoin Conference India - Custom Domain Deployment Guide

## 🎯 Deployment Target
**Domain**: `bitcoinconferenceindia.com`  
**Platform**: Vercel with GitHub Auto-Deployment

---

## 🚀 Quick Start Deployment

### Step 1: Initial Vercel Deployment
```bash
# Build the project
npm run build

# Deploy to Vercel
vercel --prod
```

When prompted:
- **Project name**: `bitcoinconferenceindia`
- **Link to existing project**: No (create new)

### Step 2: Configure Environment Variables
Go to [Vercel Dashboard](https://vercel.com/dashboard) → Your Project → Settings → Environment Variables

Add these variables:
```
VITE_SUPABASE_URL = https://gadruxbqlirrjgotlcwp.supabase.co
VITE_SUPABASE_ANON_KEY = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdhZHJ1eGJxbGlycmpnb3RsY3dwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc4NDEzMjAsImV4cCI6MjA3MzQxNzMyMH0.t8BWhRzpzDrDtJI-3LK81LIkmRmr8qf11xuXaQ6IyPM
```

### Step 3: Add Custom Domain
In Vercel Dashboard → Domains → Add Domain:
- Enter: `bitcoinconferenceindia.com`
- Also add: `www.bitcoinconferenceindia.com`

---

## 🌍 DNS Configuration (GoDaddy)

### Required DNS Records
Go to [GoDaddy DNS Management](https://dcc.godaddy.com/control/dnsmanagement?domainName=bitcoinconferenceindia.com)

**Add these records:**

#### A Record (Root Domain)
```
Type: A
Name: @
Value: 76.76.19.61
TTL: 1 Hour
```

#### CNAME Record (WWW Subdomain)
```
Type: CNAME
Name: www
Value: cname.vercel-dns.com
TTL: 1 Hour
```

### DNS Propagation
- **Time**: 5-30 minutes typically
- **Check**: Use [DNS Checker](https://dnschecker.org/) to verify propagation

---

## 🔄 Auto-Deployment Setup (GitHub Actions)

### Step 1: Connect GitHub Repository
In Vercel Dashboard:
1. Go to Git → Connect Repository
2. Select your GitHub repository
3. Enable automatic deployments

### Step 2: GitHub Secrets Configuration
Go to GitHub Repository → Settings → Secrets and variables → Actions

**Add these secrets:**

#### Vercel Configuration
```
VERCEL_TOKEN = [Get from Vercel Account Settings → Tokens]
VERCEL_ORG_ID = [Get from Vercel Project Settings → General]
VERCEL_PROJECT_ID = [Get from Vercel Project Settings → General]
```

#### Environment Variables
```
VITE_SUPABASE_URL = https://gadruxbqlirrjgotlcwp.supabase.co
VITE_SUPABASE_ANON_KEY = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdhZHJ1eGJxbGlycmpnb3RsY3dwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc4NDEzMjAsImV4cCI6MjA3MzQxNzMyMH0.t8BWhRzpzDrDtJI-3LK81LIkmRmr8qf11xuXaQ6IyPM
```

### Step 3: How to Get Vercel IDs
1. **VERCEL_TOKEN**: 
   - Go to [Vercel Account Settings](https://vercel.com/account/tokens)
   - Create new token → Copy value

2. **VERCEL_ORG_ID & VERCEL_PROJECT_ID**:
   - Go to Project Settings → General
   - Copy the IDs from the bottom of the page

---

## 🧪 Testing & Verification

### After Deployment
1. **Visit**: https://bitcoinconferenceindia.com
2. **Test Form**: Submit a test registration
3. **Check Database**: Verify data in Supabase
4. **Mobile Test**: Check responsive design

### Auto-Deployment Test
1. Make a small change to your code
2. Push to GitHub: `git push origin main`
3. Check GitHub Actions tab for deployment status
4. Verify changes are live on your domain

---

## 🔧 Troubleshooting

### Domain Not Working
- **Check DNS**: Use DNS checker tools
- **Wait**: DNS propagation can take up to 24 hours
- **Verify Records**: Ensure A and CNAME records are correct

### Build Failures
- **Check Logs**: GitHub Actions → Failed workflow → View logs
- **Environment Variables**: Ensure all secrets are set correctly
- **Local Test**: Run `npm run build` locally first

### Form Not Submitting
- **Check Console**: Browser developer tools for errors
- **Supabase**: Verify database connection and RLS policies
- **Environment Variables**: Ensure they're set in Vercel

---

## 📊 Monitoring & Maintenance

### Performance Monitoring
- **Vercel Analytics**: Enable in project settings
- **Core Web Vitals**: Monitor loading performance
- **Error Tracking**: Check Vercel function logs

### Regular Updates
- **Dependencies**: Keep packages updated
- **Security**: Monitor for vulnerabilities
- **Backups**: Regular database backups

---

## 🎉 Success Checklist

- [ ] Project deployed to Vercel
- [ ] Custom domain configured
- [ ] DNS records updated
- [ ] Environment variables set
- [ ] GitHub auto-deployment working
- [ ] Form submissions working
- [ ] Database connection verified
- [ ] Mobile responsiveness tested
- [ ] SSL certificate active (https)

---

## 🔗 Quick Links

- **Live Site**: https://bitcoinconferenceindia.com
- **Vercel Dashboard**: https://vercel.com/dashboard
- **GoDaddy DNS**: https://dcc.godaddy.com/control/dnsmanagement?domainName=bitcoinconferenceindia.com
- **Supabase Dashboard**: https://supabase.com/dashboard
- **GitHub Repository**: [Your GitHub Repo URL]

---

**🎯 Ready to deploy!** Run the deployment script or follow the steps above to get your Bitcoin Conference India registration form live on your custom domain with automatic deployments from GitHub.