# Separate Frontend & Backend Deployment Setup

This guide will help you deploy the frontend and backend as **two separate Railway projects**.

## Repository Structure

Your repository structure:
```
eco_marketplace/
├── ecotrade/          # Frontend (React + Vite)
├── server/            # Backend (Express + Node.js)
├── package.json       # Root package.json
└── ...config files
```

## Deployment Strategy

### Backend Project (Railway Project 1)
- **Root Directory**: `server`
- **Build**: Install dependencies
- **Start**: `node server.js`

### Frontend Project (Railway Project 2)
- **Root Directory**: `ecotrade`
- **Build**: Build React app
- **Start**: Serve static files

---

## Step 1: Push Code to GitHub

```bash
# Initialize git if not already done
git init

# Add remote (if not already added)
git remote add origin https://github.com/ani-123-code/eco_marketplace.git

# Add all files
git add .

# Commit
git commit -m "Setup for separate frontend and backend deployment"

# Push to main branch
git push -u origin main
```

---

## Step 2: Deploy Backend

### Create Backend Railway Project

1. Go to [railway.app](https://railway.app)
2. Click **"New Project"**
3. Select **"Deploy from GitHub repo"**
4. Choose `ani-123-code/eco_marketplace`
5. Railway will create a service

### Configure Backend Service

1. **Set Root Directory**:
   - Go to **Settings** → **Source**
   - Set **Root Directory** to: `server`
   - Save

2. **Build Settings** (should auto-detect):
   - **Build Command**: `npm install`
   - **Start Command**: `node server.js`

3. **Add MongoDB Database**:
   - Click **"+ New"** → **"Database"** → **"Add MongoDB"**
   - Copy the `MONGO_URL` from MongoDB service variables

4. **Set Environment Variables**:
   Go to **Variables** tab and add:

```env
# Database
MONGODB_URI=${{MongoDB.MONGO_URL}}

# Server
NODE_ENV=production
PORT=5000

# JWT
JWT_SECRET=your-random-32-character-secret-key-here

# Admin
ADMIN_EMAIL=admin@ecodispose.com
ADMIN_PASSWORD=YourSecurePassword123!
ADMIN_SECRET=your-admin-secret-key

# Gmail OAuth2
GMAIL_CLIENT_ID=your-gmail-client-id
GMAIL_CLIENT_SECRET=your-gmail-client-secret
GMAIL_REFRESH_TOKEN=your-gmail-refresh-token
GMAIL_USER=your-email@gmail.com
GMAIL_REDIRECT_URI=https://developers.google.com/oauthplayground
EMAIL_SENDER_NAME=Eco Marketplace

# AWS S3
AWS_ACCESS_KEY_ID=your-aws-key
AWS_SECRET_ACCESS_KEY=your-aws-secret
AWS_REGION=us-east-1
AWS_S3_BUCKET_NAME=your-bucket-name
CLOUDFRONT_URL=your-cloudfront-url

# Supabase (if using)
SUPABASE_URL=your-supabase-url
SUPABASE_ANON_KEY=your-supabase-key

# Frontend URL (will update after frontend deployment)
FRONTEND_URL=https://your-frontend-domain.railway.app
```

5. **Get Backend Domain**:
   - Go to **Settings** → **Networking**
   - Click **"Generate Domain"**
   - Copy the domain (e.g., `eco-marketplace-backend.up.railway.app`)
   - **Save this** - you'll need it for frontend

---

## Step 3: Deploy Frontend

### Create Frontend Railway Project

1. In Railway dashboard, click **"New Project"** (or go back to projects list)
2. Select **"Deploy from GitHub repo"**
3. Choose the **same repository**: `ani-123-code/eco_marketplace`
4. Railway will create a new service

### Configure Frontend Service

1. **Set Root Directory**:
   - Go to **Settings** → **Source**
   - Set **Root Directory** to: `ecotrade`
   - Save

2. **Build Settings**:
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npx serve -s dist -l $PORT`

3. **Set Environment Variables**:
   Go to **Variables** tab and add:

```env
# Backend API URL (use your backend Railway domain from Step 2)
VITE_BACKEND_URL=https://your-backend-domain.railway.app

# Node Environment
NODE_ENV=production
```

**Important**: Replace `your-backend-domain.railway.app` with the actual backend domain you got in Step 2.

4. **Get Frontend Domain**:
   - Go to **Settings** → **Networking**
   - Click **"Generate Domain"**
   - Copy the domain (e.g., `eco-marketplace-frontend.up.railway.app`)

---

## Step 4: Update CORS Configuration

### Update Backend Environment Variables

1. Go back to your **Backend Railway Project**
2. Go to **Variables** tab
3. Update `FRONTEND_URL` with your frontend domain:

```env
FRONTEND_URL=https://your-frontend-domain.railway.app
```

4. Railway will auto-redeploy

---

## Step 5: Verify Deployment

### Test Backend:
```
https://your-backend-domain.railway.app/api/health
```
Should return: `{"status":"OK","message":"Eco Marketplace API is running"}`

### Test Frontend:
```
https://your-frontend-domain.railway.app
```
Should show your React application

### Test Admin Panel:
```
https://your-frontend-domain.railway.app/asse3432/12ww3ed-xx
```
Login with:
- **Email**: (value of `ADMIN_EMAIL`)
- **Password**: (value of `ADMIN_PASSWORD`)

---

## Quick Reference

### Backend Project:
- **Root Directory**: `server`
- **Build Command**: `npm install`
- **Start Command**: `node server.js`
- **Domain**: `https://your-backend.railway.app`
- **Environment Variables**: All backend variables + `FRONTEND_URL`

### Frontend Project:
- **Root Directory**: `ecotrade`
- **Build Command**: `npm install && npm run build`
- **Start Command**: `npx serve -s dist -l $PORT`
- **Domain**: `https://your-frontend.railway.app`
- **Environment Variables**: `VITE_BACKEND_URL` + `NODE_ENV`

---

## Troubleshooting

### Backend Issues:

**"cd: server: No such file or directory"**
- **Solution**: Set Root Directory to `server` in Railway Settings

**"Cannot find module 'dotenv'"**
- **Solution**: Verify `npm install` runs in build phase
- Check that server/package.json has all dependencies

### Frontend Issues:

**Frontend shows blank page**
- Check browser console (F12) for errors
- Verify `VITE_BACKEND_URL` is set correctly
- Check that build completed successfully

**API calls fail (CORS errors)**
- Verify `FRONTEND_URL` in backend matches frontend domain exactly
- Check backend CORS configuration
- Ensure backend is running

**"serve: command not found"**
- Railway will use `npx serve` which doesn't require installation
- Or the package is already in dependencies

---

## Next Steps After Deployment

1. ✅ Test all frontend pages
2. ✅ Test API endpoints
3. ✅ Test admin login
4. ✅ Test email sending
5. ✅ Test file uploads
6. ✅ Set up custom domains (optional)

---

## Cost Note

- Railway free tier: $5 credit monthly
- Two separate projects = two services
- Monitor usage in Railway dashboard
- Consider deploying together if cost is a concern

---

For detailed troubleshooting, see:
- `SEPARATE_FRONTEND_DEPLOYMENT.md` - Frontend-specific guide
- `DEPLOYMENT_STEPS.md` - General deployment guide
- `ADMIN_ACCESS_GUIDE.md` - Admin panel access

