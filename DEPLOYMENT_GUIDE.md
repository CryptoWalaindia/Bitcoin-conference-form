# 🚀 Bitcoin Conference India - Deployment Guide

## ✅ Pre-Deployment Checklist

- [x] Build successful (`npm run build` works)
- [x] Environment variables configured
- [x] Unique project name chosen
- [x] Supabase database ready

## 🎯 Deployment Options

### Option 1: Vercel (Recommended)

#### Step 1: Install Vercel CLI
```bash
npm install -g vercel
```

#### Step 2: Deploy
```bash
npx vercel --prod
```

#### Step 3: Configure Project
When prompted, use one of these unique names:
- `btc-conference-registration-2024`
- `bitcoin-india-conference-form`
- `btc-india-registration`
- `bitcoin-conference-form-2024`
- `india-bitcoin-conference-reg`

#### Step 4: Set Environment Variables
In Vercel Dashboard → Settings → Environment Variables:

```
VITE_SUPABASE_URL = https://gadruxbqlirrjgotlcwp.supabase.co
VITE_SUPABASE_ANON_KEY = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdhZHJ1eGJxbGlycmpnb3RsY3dwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc4NDEzMjAsImV4cCI6MjA3MzQxNzMyMH0.t8BWhRzpzDrDtJI-3LK81LIkmRmr8qf11xuXaQ6IyPM
```

### Option 2: Netlify

#### Step 1: Drag & Drop Deployment
1. Build the project: `npm run build`
2. Go to [netlify.com](https://netlify.com)
3. Drag the `dist` folder to the deployment area
4. Set environment variables in Site Settings

#### Step 2: Or Use Netlify CLI
```bash
npm install -g netlify-cli
netlify deploy --prod --dir=dist
```

### Option 3: GitHub Pages

#### Step 1: Push to GitHub
```bash
git add .
git commit -m "Ready for deployment"
git push origin main
```

#### Step 2: Enable GitHub Pages
1. Go to repository Settings
2. Pages → Source: GitHub Actions
3. Create `.github/workflows/deploy.yml`

## 🔧 Troubleshooting

### Environment Variables Not Working
- Ensure variables start with `VITE_`
- Redeploy after setting variables
- Check browser console for errors

### Build Failures
- Run `npm run build` locally first
- Check TypeScript errors
- Verify all dependencies are installed

### Database Connection Issues
- Verify Supabase URL and key
- Check RLS policies
- Test connection with debug tools

## 🌐 Expected URLs

After deployment, your form will be available at:
- Vercel: `https://[project-name].vercel.app`
- Netlify: `https://[site-name].netlify.app`
- GitHub Pages: `https://[username].github.io/[repo-name]`

## 📊 Post-Deployment Testing

1. **Form Submission**: Test registration form
2. **Database**: Verify data reaches Supabase
3. **Responsive**: Test on mobile devices
4. **Performance**: Check loading speed
5. **Fallbacks**: Test offline functionality

## 🔒 Security Checklist

- [x] Environment variables properly set
- [x] Supabase RLS policies enabled
- [x] HTTPS enforced
- [x] No sensitive data in client code

## 📞 Support

If deployment fails:
1. Check the build logs
2. Verify environment variables
3. Test locally first
4. Contact support with error details

---

**Ready to deploy!** 🎉 Choose your preferred option above and follow the steps.