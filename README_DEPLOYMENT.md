# Quick Railway Deployment Checklist

## Before Deployment

- [ ] All code pushed to GitHub
- [ ] MongoDB database ready (Railway or Atlas)
- [ ] Gmail OAuth2 credentials obtained
- [ ] AWS S3 credentials ready (for file uploads)
- [ ] All environment variables documented

## Railway Setup Steps

1. **Create Railway Account** → [railway.app](https://railway.app)
2. **New Project** → Deploy from GitHub
3. **Add MongoDB** → New → Database → MongoDB
4. **Configure Variables** → Add all environment variables
5. **Deploy** → Railway auto-deploys on push
6. **Get Domain** → Settings → Generate Domain
7. **Update Variables** → Add Railway domain to FRONTEND_URL

## Required Environment Variables

See `RAILWAY_DEPLOYMENT.md` for complete list.

Minimum required:
- `MONGODB_URI`
- `JWT_SECRET`
- `ADMIN_EMAIL` & `ADMIN_PASSWORD`
- `GMAIL_CLIENT_ID`, `GMAIL_CLIENT_SECRET`, `GMAIL_REFRESH_TOKEN`
- `VITE_BACKEND_URL` (set during build)

## Build Process

Railway will:
1. Install root dependencies
2. Install server dependencies
3. Install frontend dependencies
4. Build React app (`npm run build` in ecotrade)
5. Start Express server (`npm start`)

## Post-Deployment

1. Test API: `https://your-domain.railway.app/api/health`
2. Test Frontend: `https://your-domain.railway.app`
3. Verify email sending
4. Test file uploads
5. Check admin login

## Common Issues

- **Build fails**: Check Node version (needs 18+)
- **App crashes**: Check environment variables
- **CORS errors**: Update FRONTEND_URL
- **404 on routes**: Verify static file serving in server.js

For detailed instructions, see `RAILWAY_DEPLOYMENT.md`

