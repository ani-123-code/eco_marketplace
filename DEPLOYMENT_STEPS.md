# 🚀 Railway Deployment - Step by Step Guide

## Quick Start (5 Minutes)

### Step 1: Push to GitHub
```bash
git add .
git commit -m "Ready for Railway deployment"
git push origin main
```

### Step 2: Create Railway Project
1. Go to [railway.app](https://railway.app) → Sign up/Login
2. Click **"New Project"**
3. Select **"Deploy from GitHub repo"**
4. Choose your repository
5. Railway auto-detects the project

### Step 3: Add MongoDB Database
1. In Railway project → Click **"+ New"**
2. Select **"Database"** → **"Add MongoDB"**
3. Wait for MongoDB to provision
4. Click on MongoDB service → **"Variables"** tab
5. Copy the `MONGO_URL` (you'll need this)

### Step 4: Configure Environment Variables
1. Click on your main service (the one with your code)
2. Go to **"Variables"** tab
3. Click **"Raw Editor"** and paste all variables at once:

```env
# Database (from MongoDB service)
MONGODB_URI=${{MongoDB.MONGO_URL}}

# Server Configuration
NODE_ENV=production
PORT=5000

# JWT Secret (generate a random 32+ character string)
JWT_SECRET=your-super-secret-jwt-key-change-this-to-random-string

# Admin Credentials
ADMIN_EMAIL=admin@yourdomain.com
ADMIN_PASSWORD=your-secure-password
ADMIN_SECRET=your-admin-secret-key

# Gmail OAuth2 (for email sending)
GMAIL_CLIENT_ID=your-gmail-client-id.apps.googleusercontent.com
GMAIL_CLIENT_SECRET=your-gmail-client-secret
GMAIL_REFRESH_TOKEN=your-refresh-token
GMAIL_USER=your-email@gmail.com
GMAIL_REDIRECT_URI=https://developers.google.com/oauthplayground
EMAIL_SENDER_NAME=Eco Marketplace

# AWS S3 (for file uploads)
AWS_ACCESS_KEY_ID=your-aws-access-key
AWS_SECRET_ACCESS_KEY=your-aws-secret-key
AWS_REGION=us-east-1
AWS_S3_BUCKET_NAME=your-bucket-name
CLOUDFRONT_URL=https://your-cloudfront-url.cloudfront.net

# Supabase (if using)
SUPABASE_URL=your-supabase-url
SUPABASE_ANON_KEY=your-supabase-key
```

4. **Important**: After Railway generates your domain, add:
```env
FRONTEND_URL=https://your-app-name.railway.app
VITE_BACKEND_URL=https://your-app-name.railway.app
```

### Step 5: Get Your Domain
1. Go to **"Settings"** → **"Networking"**
2. Click **"Generate Domain"**
3. Copy the domain (e.g., `your-app-name.railway.app`)
4. Go back to **"Variables"** and update:
   - `FRONTEND_URL` = your Railway domain
   - `VITE_BACKEND_URL` = your Railway domain

### Step 6: Deploy
Railway automatically deploys when you:
- Push to GitHub (if connected)
- Or click **"Deploy"** button

Watch the build logs in **"Deployments"** tab.

### Step 7: Verify
1. Visit: `https://your-app-name.railway.app`
2. Test API: `https://your-app-name.railway.app/api/health`
3. Should see: `{"status":"OK","message":"Eco Marketplace API is running"}`

### Step 8: Access Admin Panel
1. Go to: `https://your-app-name.railway.app/asse3432/12ww3ed-xx`
2. Login with:
   - **Email:** (value of `ADMIN_EMAIL` from Step 4)
   - **Password:** (value of `ADMIN_PASSWORD` from Step 4)
3. See `ADMIN_ACCESS_GUIDE.md` for detailed admin access instructions

---

## Detailed Steps

### Prerequisites Checklist

Before starting, ensure you have:

- [ ] **GitHub Repository**: Code pushed to GitHub
- [ ] **MongoDB**: Either Railway MongoDB or MongoDB Atlas
- [ ] **Gmail OAuth2**: Client ID, Secret, and Refresh Token
- [ ] **AWS S3**: Access keys and bucket name (for file uploads)
- [ ] **Environment Variables**: All values ready

### Step-by-Step Instructions

#### 1. Prepare Your Code

```bash
# Make sure all changes are committed
git status

# Add all files
git add .

# Commit
git commit -m "Prepare for Railway deployment"

# Push to GitHub
git push origin main
```

#### 2. Create Railway Account

1. Visit [railway.app](https://railway.app)
2. Click **"Start a New Project"**
3. Sign up with GitHub (recommended) or email
4. Verify your email if needed

#### 3. Create New Project

1. Click **"New Project"** in Railway dashboard
2. Select **"Deploy from GitHub repo"**
3. Authorize Railway to access your GitHub
4. Select your repository
5. Railway will create a new service

#### 4. Add MongoDB Database

**Option A: Railway MongoDB (Easiest)**
1. In your project, click **"+ New"**
2. Select **"Database"**
3. Choose **"Add MongoDB"**
4. Wait 1-2 minutes for provisioning
5. Click on the MongoDB service
6. Go to **"Variables"** tab
7. Note the `MONGO_URL` value

**Option B: MongoDB Atlas (External)**
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create free cluster
3. Get connection string
4. Use it as `MONGODB_URI` in Railway

#### 5. Configure Environment Variables

1. Click on your main service (not MongoDB)
2. Go to **"Variables"** tab
3. Click **"Raw Editor"** (easier for bulk entry)
4. Paste all environment variables
5. Click **"Update Variables"**

**Important Variables to Set:**

```env
# Database
MONGODB_URI=${{MongoDB.MONGO_URL}}
# OR if using Atlas:
# MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/dbname

# Server
NODE_ENV=production
PORT=5000

# Security
JWT_SECRET=generate-random-32-char-string-here
ADMIN_SECRET=another-random-secret-key

# Admin
ADMIN_EMAIL=your-admin@email.com
ADMIN_PASSWORD=secure-password-here

# Gmail OAuth2
GMAIL_CLIENT_ID=your-client-id
GMAIL_CLIENT_SECRET=your-secret
GMAIL_REFRESH_TOKEN=your-refresh-token
GMAIL_USER=your-email@gmail.com

# AWS S3
AWS_ACCESS_KEY_ID=your-key
AWS_SECRET_ACCESS_KEY=your-secret
AWS_REGION=us-east-1
AWS_S3_BUCKET_NAME=your-bucket
CLOUDFRONT_URL=your-cloudfront-url

# Frontend URL (update after getting domain)
FRONTEND_URL=https://your-app.railway.app
VITE_BACKEND_URL=https://your-app.railway.app
```

#### 6. Configure Build Settings

Railway auto-detects from `railway.json` and `.nixpacks.toml`, but verify:

1. Go to **"Settings"** → **"Build"**
2. Build Command: `npm run build` (should be auto-detected)
3. Start Command: `npm start` (should be auto-detected)

#### 7. Get Your Domain

1. Go to **"Settings"** → **"Networking"**
2. Under **"Public Networking"**, click **"Generate Domain"**
3. Copy the domain (e.g., `eco-marketplace-production.up.railway.app`)
4. Update environment variables:
   - `FRONTEND_URL` = your domain
   - `VITE_BACKEND_URL` = your domain
5. Railway will auto-redeploy

#### 8. Monitor Deployment

1. Go to **"Deployments"** tab
2. Watch build logs in real-time
3. Wait for "Deploy Succeeded" status
4. Check logs for any errors

#### 9. Test Your Application

1. **API Health Check:**
   ```
   https://your-domain.railway.app/api/health
   ```
   Should return: `{"status":"OK"}`

2. **Frontend:**
   ```
   https://your-domain.railway.app
   ```
   Should show your React app

3. **Admin Login:**
   ```
   https://your-domain.railway.app/admin/login
   ```
   Use your `ADMIN_EMAIL` and `ADMIN_PASSWORD`

#### 10. Set Up Custom Domain (Optional)

1. Go to **"Settings"** → **"Networking"**
2. Click **"Custom Domain"**
3. Enter your domain (e.g., `app.yourdomain.com`)
4. Add DNS records as instructed:
   - Type: `CNAME`
   - Name: `app` (or subdomain)
   - Value: Railway-provided value
5. Wait for DNS propagation (5-30 minutes)
6. Update `FRONTEND_URL` to your custom domain

---

## Troubleshooting

### Build Fails

**Error**: `npm: command not found`
- **Solution**: Railway uses Node 18+, should work automatically

**Error**: `Build command failed`
- **Solution**: Check build logs, verify all dependencies in package.json

**Error**: `Frontend build fails`
- **Solution**: Ensure `VITE_BACKEND_URL` is set before build

### Application Crashes

**Error**: `Cannot connect to MongoDB`
- **Solution**: 
  - Verify `MONGODB_URI` is correct
  - Check MongoDB allows connections from Railway IPs
  - For Atlas: Add `0.0.0.0/0` to IP whitelist

**Error**: `Port already in use`
- **Solution**: Railway sets `PORT` automatically, don't hardcode it

**Error**: `JWT_SECRET not set`
- **Solution**: Add `JWT_SECRET` environment variable

### Frontend Issues

**Error**: `404 on all routes`
- **Solution**: Verify static files are being served (check server.js)

**Error**: `API calls fail`
- **Solution**: 
  - Check `VITE_BACKEND_URL` is set correctly
  - Verify CORS settings in server.js
  - Check Railway domain matches `FRONTEND_URL`

**Error**: `CORS errors`
- **Solution**: Update `FRONTEND_URL` in environment variables

### Email Issues

**Error**: `Email not sending`
- **Solution**:
  - Verify Gmail OAuth2 credentials
  - Check refresh token is valid
  - Check email service logs

---

## Environment Variables Reference

### Required Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `MONGODB_URI` | MongoDB connection string | `mongodb+srv://...` |
| `JWT_SECRET` | Secret for JWT tokens | Random 32+ char string |
| `ADMIN_EMAIL` | Admin login email | `admin@example.com` |
| `ADMIN_PASSWORD` | Admin login password | Secure password |
| `ADMIN_SECRET` | Admin secret key | Random string |
| `NODE_ENV` | Environment | `production` |
| `PORT` | Server port | `5000` (Railway sets this) |

### Gmail OAuth2 Variables

| Variable | Description |
|----------|-------------|
| `GMAIL_CLIENT_ID` | From Google Cloud Console |
| `GMAIL_CLIENT_SECRET` | From Google Cloud Console |
| `GMAIL_REFRESH_TOKEN` | From OAuth Playground |
| `GMAIL_USER` | Your Gmail address |
| `GMAIL_REDIRECT_URI` | OAuth redirect URI |

### Frontend Variables

| Variable | Description |
|----------|-------------|
| `FRONTEND_URL` | Your Railway domain |
| `VITE_BACKEND_URL` | Your Railway domain (for API calls) |

### AWS S3 Variables

| Variable | Description |
|----------|-------------|
| `AWS_ACCESS_KEY_ID` | AWS access key |
| `AWS_SECRET_ACCESS_KEY` | AWS secret key |
| `AWS_REGION` | AWS region |
| `AWS_S3_BUCKET_NAME` | S3 bucket name |
| `CLOUDFRONT_URL` | CloudFront distribution URL |

---

## Post-Deployment Checklist

- [ ] API health check works
- [ ] Frontend loads correctly
- [ ] Admin login works
- [ ] Email sending works (test quote request)
- [ ] File uploads work (test material image upload)
- [ ] All API endpoints respond
- [ ] Database connections work
- [ ] Static files load (images, CSS, JS)

---

## Updating Your Application

1. Make changes to your code
2. Commit and push to GitHub:
   ```bash
   git add .
   git commit -m "Update feature"
   git push origin main
   ```
3. Railway automatically detects and deploys
4. Monitor deployment in Railway dashboard

---

## Cost Information

- **Free Tier**: $5 credit monthly
- **Usage**: Pay for what you use
- **MongoDB**: Included in Railway or use free Atlas tier
- **Domain**: Free Railway domain included

---

## Support Resources

- **Railway Docs**: [docs.railway.app](https://docs.railway.app)
- **Railway Discord**: [discord.gg/railway](https://discord.gg/railway)
- **Railway Status**: [status.railway.app](https://status.railway.app)

---

**Need Help?** Check the logs in Railway dashboard → Deployments → View Logs

