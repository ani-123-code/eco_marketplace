# Railway Deployment Guide - Eco Marketplace

This guide will walk you through deploying the Eco Marketplace application on Railway.

## Prerequisites

1. **Railway Account**: Sign up at [railway.app](https://railway.app)
2. **GitHub Account**: Your code should be in a GitHub repository
3. **MongoDB Database**: You'll need a MongoDB connection string (Railway provides MongoDB or use MongoDB Atlas)
4. **Environment Variables**: All required environment variables ready

## Step-by-Step Deployment

### Step 1: Prepare Your Repository

1. **Push your code to GitHub** (if not already done):
   ```bash
   git add .
   git commit -m "Prepare for Railway deployment"
   git push origin main
   ```

### Step 2: Create Railway Project

1. Go to [railway.app](https://railway.app) and sign in
2. Click **"New Project"**
3. Select **"Deploy from GitHub repo"**
4. Choose your repository
5. Railway will automatically detect your project

### Step 3: Configure Build Settings

Railway will automatically detect the configuration from `railway.json` and `.nixpacks.toml`. The build process will:
- Install dependencies for root, server, and frontend
- Build the React frontend
- Start the Express server

### Step 4: Set Up MongoDB Database

**Option A: Use Railway MongoDB (Recommended)**
1. In your Railway project, click **"+ New"**
2. Select **"Database"** → **"Add MongoDB"**
3. Railway will create a MongoDB instance
4. Click on the MongoDB service
5. Go to **"Variables"** tab
6. Copy the `MONGO_URL` value

**Option B: Use MongoDB Atlas**
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free cluster
3. Get your connection string
4. Use it as `MONGODB_URI` in Railway

### Step 5: Configure Environment Variables

In your Railway project, go to your service → **"Variables"** tab and add:

#### Required Variables:

```env
# Database
MONGODB_URI=your-mongodb-connection-string

# Server
NODE_ENV=production
PORT=5000

# JWT
JWT_SECRET=your-super-secret-jwt-key-min-32-characters

# Admin
ADMIN_EMAIL=your-admin@email.com
ADMIN_PASSWORD=your-secure-admin-password
ADMIN_SECRET=your-admin-secret-key

# Frontend URL (will be your Railway domain)
FRONTEND_URL=https://your-app-name.railway.app

# Gmail OAuth2 (for email sending)
GMAIL_CLIENT_ID=your-gmail-client-id
GMAIL_CLIENT_SECRET=your-gmail-client-secret
GMAIL_REFRESH_TOKEN=your-gmail-refresh-token
GMAIL_USER=your-email@gmail.com
GMAIL_REDIRECT_URI=https://developers.google.com/oauthplayground
EMAIL_SENDER_NAME=Eco Marketplace

# AWS S3 (for file uploads)
AWS_ACCESS_KEY_ID=your-aws-access-key
AWS_SECRET_ACCESS_KEY=your-aws-secret-key
AWS_REGION=your-aws-region
AWS_S3_BUCKET_NAME=your-s3-bucket-name
CLOUDFRONT_URL=your-cloudfront-url

# Supabase (if using)
SUPABASE_URL=your-supabase-url
SUPABASE_ANON_KEY=your-supabase-anon-key
```

#### Frontend Environment Variables:

Create a `.env.production` file in the `ecotrade` folder or add to Railway:

```env
VITE_BACKEND_URL=https://your-app-name.railway.app
```

**Important**: In Railway, you need to add `VITE_` prefixed variables. Railway will make them available during build.

### Step 6: Configure Build Command

Railway should automatically detect the build process, but you can verify:

1. Go to your service → **"Settings"**
2. Under **"Build Command"**, it should be: `npm run build`
3. Under **"Start Command"**, it should be: `npm start`

### Step 7: Deploy

1. Railway will automatically start building and deploying
2. Watch the build logs in the **"Deployments"** tab
3. Wait for the build to complete (usually 3-5 minutes)

### Step 8: Get Your Domain

1. Once deployed, go to **"Settings"** → **"Networking"**
2. Click **"Generate Domain"** to get a Railway domain
3. Or add your custom domain

### Step 9: Update Frontend Environment Variable

After getting your Railway domain:

1. Go to **"Variables"** tab
2. Update `FRONTEND_URL` to your Railway domain
3. Add `VITE_BACKEND_URL` with your Railway domain
4. Redeploy the service (Railway will auto-redeploy when variables change)

### Step 10: Verify Deployment

1. Visit your Railway domain
2. Check the API health endpoint: `https://your-domain.railway.app/api/health`
3. Test the frontend: `https://your-domain.railway.app`

## Troubleshooting

### Build Fails

**Issue**: Build command fails
- **Solution**: Check build logs, ensure all dependencies are in package.json
- Verify Node.js version (should be 18+)

**Issue**: Frontend build fails
- **Solution**: Check if `VITE_BACKEND_URL` is set during build
- Verify all environment variables are set

### Application Crashes

**Issue**: Application crashes on start
- **Solution**: Check logs in Railway dashboard
- Verify all required environment variables are set
- Check MongoDB connection string

**Issue**: Database connection fails
- **Solution**: Verify `MONGODB_URI` is correct
- Check if MongoDB allows connections from Railway IPs
- For MongoDB Atlas, add `0.0.0.0/0` to IP whitelist

### CORS Errors

**Issue**: CORS errors in browser
- **Solution**: Update `FRONTEND_URL` in environment variables
- Verify CORS configuration in `server.js`

### Static Files Not Loading

**Issue**: Frontend assets return 404
- **Solution**: Verify build completed successfully
- Check that `ecotrade/dist` folder exists after build
- Verify server.js is serving static files correctly

### Email Not Sending

**Issue**: Emails not being sent
- **Solution**: Verify Gmail OAuth2 credentials are set
- Check email service logs
- Verify refresh token is valid

## Monitoring

1. **Logs**: View real-time logs in Railway dashboard
2. **Metrics**: Check CPU, Memory, and Network usage
3. **Deployments**: View deployment history and rollback if needed

## Custom Domain Setup

1. Go to **"Settings"** → **"Networking"**
2. Click **"Custom Domain"**
3. Add your domain
4. Update DNS records as instructed
5. Update `FRONTEND_URL` environment variable

## Updating Your Application

1. Push changes to GitHub
2. Railway will automatically detect and deploy
3. Or manually trigger deployment from Railway dashboard

## Cost Optimization

- Railway offers a free tier with $5 credit monthly
- Monitor usage in the dashboard
- Consider upgrading if you exceed free tier limits

## Support

- Railway Docs: [docs.railway.app](https://docs.railway.app)
- Railway Discord: [discord.gg/railway](https://discord.gg/railway)

---

**Note**: Keep your environment variables secure. Never commit `.env` files to Git.

