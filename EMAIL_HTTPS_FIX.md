# Email Service Fix - Using HTTPS (Gmail API) Instead of SMTP

## Problem
Email sending was timing out with SMTP connection errors:
```
Error: Connection timeout
code: 'ETIMEDOUT'
command: 'CONN'
```

## Solution
Updated email service to use **Gmail API via HTTPS** instead of SMTP connections. This eliminates connection timeouts and is more reliable.

## What Changed

### Before:
- Used `nodemailer` with SMTP connection (port 587/465)
- Connection timeouts on Railway
- Required direct SMTP server connection

### After:
- **Primary**: Uses Gmail API directly via HTTPS (no SMTP connection needed)
- **Fallback**: SMTP with timeout settings (if Gmail API not configured)
- More reliable, no connection timeouts

## How It Works

1. **Gmail API (HTTPS)** - Primary method
   - Uses `googleapis` Gmail API
   - Sends emails via HTTPS REST API
   - No SMTP connection required
   - More secure and reliable

2. **SMTP Fallback** - If Gmail API fails or not configured
   - Uses `nodemailer` with timeout settings
   - Connection timeout: 10 seconds
   - Socket timeout: 10 seconds

## Required Environment Variables

For Gmail API (HTTPS) - **Recommended**:
```env
GMAIL_CLIENT_ID=your-client-id
GMAIL_CLIENT_SECRET=your-client-secret
GMAIL_REFRESH_TOKEN=your-refresh-token
GMAIL_USER=your-email@gmail.com
GMAIL_REDIRECT_URI=https://developers.google.com/oauthplayground
EMAIL_SENDER_NAME=Eco Marketplace
```

## Gmail API Setup

1. **Enable Gmail API** in Google Cloud Console:
   - Go to [Google Cloud Console](https://console.cloud.google.com)
   - Enable "Gmail API" for your project

2. **OAuth2 Credentials**:
   - Create OAuth2 credentials
   - Get Client ID and Client Secret
   - Use OAuth Playground to get Refresh Token

3. **Required Scopes**:
   - `https://www.googleapis.com/auth/gmail.send`

## Testing

After deployment, test email sending:
1. Submit a quote request form
2. Submit a seller registration form
3. Check server logs for:
   - ✅ "Email sent successfully via Gmail API (HTTPS)"
   - ❌ If you see "Gmail API failed, trying SMTP fallback", check OAuth2 credentials

## Benefits

✅ **No Connection Timeouts** - Uses HTTPS API, not SMTP
✅ **More Reliable** - Gmail API is more stable
✅ **Better Security** - OAuth2 authentication
✅ **Faster** - Direct API calls, no connection overhead
✅ **Works on Railway** - No firewall/port issues

## Troubleshooting

### "Gmail API failed"
- Check OAuth2 credentials are correct
- Verify Gmail API is enabled in Google Cloud Console
- Check refresh token is valid
- Ensure `GMAIL_USER` matches the OAuth2 account

### Still getting timeouts
- Verify all Gmail OAuth2 variables are set
- Check Railway environment variables
- Review server logs for specific errors

---

**Status**: ✅ Updated to use Gmail API (HTTPS)
**File**: `server/utils/emailService.js`

