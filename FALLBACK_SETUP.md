# 🔄 Fallback Services Setup Guide

Your Bitcoin Conference registration form now has multiple fallback methods in case Supabase is unreachable. Here's how to set them up:

## 🎯 Quick Setup (Recommended)

### 1. Formspree (Most Reliable - FREE)
**Best option for immediate setup**

1. Go to [https://formspree.io](https://formspree.io)
2. Sign up with your email
3. Create a new form
4. Copy your form ID (looks like: `xpzgkqyw`)
5. Update `src/lib/webhook-fallback.ts` line 114:
   ```typescript
   const formspreeUrl = 'https://formspree.io/f/xpzgkqyw' // Replace with your form ID
   ```

**Benefits:**
- ✅ Free tier: 50 submissions/month
- ✅ Email notifications to your inbox
- ✅ Spam protection
- ✅ No coding required

---

## 🔧 Alternative Options

### 2. Pipedream Webhook (FREE)
**Good for developers who want to process data**

1. Go to [https://pipedream.com](https://pipedream.com)
2. Sign up and create a new workflow
3. Choose "HTTP / Webhook" as trigger
4. Copy your webhook URL
5. Update `src/lib/webhook-fallback.ts` line 22:
   ```typescript
   const webhookUrl = 'https://your-unique-id.m.pipedream.net'
   ```

### 3. Google Forms (FREE)
**If you want responses in a Google Sheet**

1. Create a Google Form with these fields:
   - First Name (Short answer)
   - Last Name (Short answer)
   - Email (Short answer)
   - Phone (Short answer)
   - Age (Short answer)
   - Gender (Multiple choice: Male, Female, Others)
   - State (Short answer)
   - Purpose (Paragraph)

2. Get the form URL and field IDs
3. Update `src/lib/webhook-fallback.ts` lines 45-55

### 4. EmailJS (FREE)
**Direct email sending**

1. Go to [https://emailjs.com](https://emailjs.com)
2. Create account and email service
3. Update `src/lib/webhook-fallback.ts` lines 75-88

---

## 🚀 Current Status

Your form will now:

1. **Try Supabase first** (with new API key)
2. **If Supabase fails** → Try Formspree
3. **If Formspree fails** → Try Pipedream webhook
4. **If webhook fails** → Try Google Forms
5. **If all fail** → Store locally with sync capability

## 📧 Recommended: Set up Formspree now

**5-minute setup:**
1. Visit [formspree.io](https://formspree.io)
2. Sign up with `bitcoinconferenceindia@gmail.com`
3. Create form → Copy form ID
4. Replace `YOUR_FORM_ID` in the code
5. Test your form!

## 🔍 Testing

Use the test file: `test-new-supabase-connection.html`
- Open in browser
- Test each method
- Verify submissions work

## 📊 Monitoring

All submissions are logged to browser console. Check:
- Which method succeeded
- Any error messages
- Local storage backup status

---

**Need help?** The form works perfectly with local storage backup, but setting up Formspree will give you immediate email notifications of new registrations!