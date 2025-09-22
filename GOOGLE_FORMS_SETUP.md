# 📝 Google Forms Fallback Setup Guide

Your Bitcoin Conference registration form is now configured to use Google Forms as the primary fallback method when Supabase is unavailable.

## 🚀 Quick Setup Steps

### Step 1: Create Your Google Form

1. Go to [https://forms.google.com](https://forms.google.com)
2. Click **"Create a new form"** or use the **"+"** button
3. Give your form a title: **"Bitcoin Conference India Registration"**
4. Add a description: **"Registration submissions from the Bitcoin Conference India website"**

### Step 2: Add Required Fields

Add these fields **in this exact order**:

#### Field 1: Full Name
- **Type**: Short answer
- **Question**: "Full Name"
- **Required**: ✅ Yes

#### Field 2: Email
- **Type**: Short answer  
- **Question**: "Email"
- **Required**: ✅ Yes
- **Response validation**: Email address

#### Field 3: Phone
- **Type**: Short answer
- **Question**: "Phone Number"
- **Required**: ❌ No (Optional)

#### Field 4: Age
- **Type**: Short answer
- **Question**: "Age"
- **Required**: ✅ Yes
- **Response validation**: Number, between 1 and 99

#### Field 5: Timestamp (Optional but recommended)
- **Type**: Short answer
- **Question**: "Submission Time"
- **Required**: ❌ No

#### Field 6: Source (Optional but recommended)
- **Type**: Short answer
- **Question**: "Source"
- **Required**: ❌ No

### Step 3: Get Your Form URL and Field IDs

1. **Get Form URL**:
   - Click the **"Send"** button in your form
   - Copy the form URL (it looks like: `https://docs.google.com/forms/d/e/1FAIpQLSc...`)

2. **Get Field IDs**:
   - Click the **"Preview"** button (eye icon) in your form
   - Right-click on the preview page and select **"View Page Source"**
   - Press `Ctrl+F` and search for `"entry."`
   - You'll find field IDs like `entry.123456789`, `entry.987654321`, etc.
   - Note down the field IDs in order:
     - Full Name field ID: `entry.XXXXXXXXX`
     - Email field ID: `entry.XXXXXXXXX`
     - Phone field ID: `entry.XXXXXXXXX`
     - Age field ID: `entry.XXXXXXXXX`
     - Timestamp field ID: `entry.XXXXXXXXX` (if added)
     - Source field ID: `entry.XXXXXXXXX` (if added)

### Step 4: Update the Code

Once you have your form URL and field IDs, you need to update the code:

1. Open `src/lib/webhook-fallback.ts`
2. Find line 52 and replace `YOUR_FORM_ID` with your actual form ID
3. Replace the field IDs on lines 57-64:

```typescript
// Replace these with your actual field IDs:
formData.append('entry.YOUR_FULL_NAME_FIELD_ID', data.full_name)
formData.append('entry.YOUR_EMAIL_FIELD_ID', data.email)
formData.append('entry.YOUR_PHONE_FIELD_ID', data.phone || '')
formData.append('entry.YOUR_AGE_FIELD_ID', data.age.toString())

// Optional fields (if you added them):
formData.append('entry.YOUR_TIMESTAMP_FIELD_ID', new Date().toISOString())
formData.append('entry.YOUR_SOURCE_FIELD_ID', 'Bitcoin Conference Registration Form')
```

### Step 5: Test Your Setup

1. **Build and run your application**:
   ```bash
   npm run build
   npm run preview
   ```

2. **Test the fallback**:
   - Temporarily disable your internet or Supabase connection
   - Fill out and submit the registration form
   - Check your Google Form responses to see if the data was received

## 📊 How It Works

Your registration form now follows this priority:

1. **Primary**: Supabase database (when available)
2. **Fallback 1**: Google Forms (your new primary fallback)
3. **Fallback 2**: Formspree (if configured)
4. **Fallback 3**: Webhook services (if configured)
5. **Fallback 4**: Email services (if configured)
6. **Final Fallback**: Local storage (always works)

## 🔍 Monitoring Submissions

### Google Forms Dashboard
- Go to your Google Form
- Click the **"Responses"** tab
- View all submissions in real-time
- Export to Google Sheets for analysis

### Browser Console
- Open Developer Tools (F12)
- Check the Console tab for submission logs
- Look for messages like: "Google Forms submission completed"

## 📋 Example Form Configuration

Here's what your Google Form should look like:

```
Title: Bitcoin Conference India Registration
Description: Registration submissions from the Bitcoin Conference India website

Questions:
1. Full Name* (Short answer)
2. Email* (Short answer, Email validation)
3. Phone Number (Short answer, Optional)
4. Age* (Short answer, Number 1-99)
5. Submission Time (Short answer, Optional)
6. Source (Short answer, Optional)
```

## 🛠️ Troubleshooting

### Common Issues:

1. **Form not receiving data**:
   - Check that field IDs are correct
   - Ensure form URL is the `/formResponse` version
   - Verify CORS mode is set to 'no-cors'

2. **Field IDs not found**:
   - Make sure you're viewing the form preview, not the edit page
   - Search for `entry.` in the page source
   - Field IDs are usually 9-10 digit numbers

3. **Form URL format**:
   - Correct: `https://docs.google.com/forms/d/e/FORM_ID/formResponse`
   - Incorrect: `https://docs.google.com/forms/d/FORM_ID/edit`

## 🎯 Next Steps

1. **Create your Google Form** following the steps above
2. **Get your form URL and field IDs**
3. **Update the code** with your specific details
4. **Test the integration**
5. **Monitor submissions** in your Google Form responses

## 📧 Need Help?

If you encounter any issues:
1. Check the browser console for error messages
2. Verify your Google Form is publicly accessible
3. Test the form manually by visiting the URL
4. Ensure all required fields are properly configured

Your fallback system is now ready! Google Forms will automatically collect all registration data when your primary database is unavailable.