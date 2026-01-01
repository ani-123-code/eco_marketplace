# Email Service Setup

The Eco Marketplace application sends automated emails for:
1. **Quote Requests** - When buyers request quotes for materials
2. **Seller Registration** - When sellers apply to join the platform

## Email Configuration (Using Gmail OAuth2)

The email service uses **Gmail OAuth2** for secure, token-based authentication. This is more secure than app passwords and doesn't require 2-step verification.

### Setting Up Gmail OAuth2

1. **Go to Google Cloud Console**:
   - Visit https://console.cloud.google.com/
   - Create a new project or select an existing one

2. **Enable Gmail API**:
   - Navigate to "APIs & Services" → "Library"
   - Search for "Gmail API" and enable it

3. **Create OAuth 2.0 Credentials**:
   - Go to "APIs & Services" → "Credentials"
   - Click "Create Credentials" → "OAuth client ID"
   - Application type: "Web application"
   - Add authorized redirect URI: `https://developers.google.com/oauthplayground`
   - Save and note your **Client ID** and **Client Secret**

4. **Get Refresh Token**:
   - Go to https://developers.google.com/oauthplayground
   - Click the gear icon (⚙️) in top right
   - Check "Use your own OAuth credentials"
   - Enter your Client ID and Client Secret
   - In the left panel, find "Gmail API v1"
   - Select scope: `https://mail.google.com/`
   - Click "Authorize APIs"
   - Sign in with your Gmail account
   - Click "Exchange authorization code for tokens"
   - Copy the **Refresh Token**

5. **Add to `.env` file** (lines 24-30):
```env
GMAIL_CLIENT_ID=your-client-id.apps.googleusercontent.com
GMAIL_CLIENT_SECRET=your-client-secret
GMAIL_REFRESH_TOKEN=your-refresh-token
GMAIL_USER=your-email@gmail.com
GMAIL_REDIRECT_URI=https://developers.google.com/oauthplayground
EMAIL_SENDER_NAME=Eco Marketplace
```

### Fallback: Using Gmail with App Password

If OAuth2 is not configured, the service will fallback to basic authentication:

```env
EMAIL_SERVICE=gmail
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-16-char-app-password
EMAIL_SECURE=true
EMAIL_SENDER_NAME=Eco Marketplace
```

### Fallback: Using SMTP with HTTPS

For custom SMTP servers with HTTPS (port 465):

```env
EMAIL_HOST=smtp.example.com
EMAIL_PORT=465
EMAIL_USER=your-email@example.com
EMAIL_PASSWORD=your-password
EMAIL_SECURE=true
EMAIL_SENDER_NAME=Eco Marketplace
```

### Environment Variables (Gmail OAuth2 - Recommended)

**Required for OAuth2 (lines 24-30 in .env):**
- `GMAIL_CLIENT_ID` - OAuth2 Client ID from Google Cloud Console
- `GMAIL_CLIENT_SECRET` - OAuth2 Client Secret from Google Cloud Console
- `GMAIL_REFRESH_TOKEN` - Refresh token from OAuth Playground
- `GMAIL_USER` - Gmail address to send emails from
- `GMAIL_REDIRECT_URI` - OAuth redirect URI (default: https://developers.google.com/oauthplayground)
- `EMAIL_SENDER_NAME` - Display name for sender (default: "Eco Marketplace")

**Fallback Variables (if OAuth2 not used):**
- `EMAIL_SERVICE` - Service name (gmail, outlook, etc.)
- `EMAIL_HOST` - SMTP server hostname
- `EMAIL_PORT` - SMTP port (default: 465)
- `EMAIL_USER` - Email address for authentication
- `EMAIL_PASSWORD` or `EMAIL_APP_PASSWORD` - Email password/app password
- `EMAIL_SECURE` - Use HTTPS/secure connection (default: true)
- `EMAIL_REJECT_UNAUTHORIZED` - Reject unauthorized certificates (default: true)

### Priority Order

The email service checks configuration in this order:
1. **Gmail OAuth2** (if `GMAIL_CLIENT_ID`, `GMAIL_CLIENT_SECRET`, `GMAIL_REFRESH_TOKEN` are set)
2. **Service-based auth** (if `EMAIL_SERVICE` is set)
3. **SMTP auth** (if `EMAIL_HOST` is set)

## Email Templates

Email templates are located in `server/utils/emailService.js`:
- `quoteRequest` - Sent to buyers after quote request submission
- `sellerRequest` - Sent to sellers after registration request

Templates include:
- Professional HTML formatting
- Brand colors and styling
- Request/application details
- Next steps information
- Contact information

## Testing

To test email functionality:
1. Ensure environment variables are set
2. Submit a quote request or seller registration
3. Check the recipient's inbox (and spam folder)

## Troubleshooting

- **Emails not sending**: Check that environment variables are set correctly
- **Gmail blocking**: Use App Password instead of regular password
- **SMTP errors**: Verify host, port, and credentials
- **Check server logs**: Email errors are logged but don't fail the request

## Notes

- Email sending is non-blocking - if email fails, the request still succeeds
- Email service gracefully handles missing configuration
- All emails are sent from "Eco Marketplace" <your-email@domain.com>

