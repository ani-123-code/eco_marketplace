# Frontend Deployment Guide - Separate Frontend Project

If you're deploying the frontend as a **separate Railway project**, follow this guide.

## Step 1: Create New Railway Project for Frontend

1. Go to Railway dashboard
2. Click **"New Project"**
3. Select **"Deploy from GitHub repo"**
4. Choose your repository
5. Railway will detect the project

## Step 2: Configure Build Settings

In Railway → Your Frontend Service → **Settings**:

### Build Command:
```bash
cd ecotrade && npm install && npm run build
```

### Start Command:
```bash
cd ecotrade && npm run preview
```

**OR** if using a static file server:

### Start Command:
```bash
cd ecotrade && npx serve -s dist -l 3000
```

## Step 3: Set Environment Variables

In Railway → **Variables** tab, add:

```env
# Backend API URL (your backend Railway domain)
VITE_BACKEND_URL=https://your-backend-domain.railway.app

# Node Environment
NODE_ENV=production
```

**Important**: 
- Replace `your-backend-domain.railway.app` with your actual backend Railway domain
- `VITE_BACKEND_URL` must be set **before** the build runs
- Railway will make this available during the build process

## Step 4: Install Serve Package (if needed)

If using `serve`, add to `ecotrade/package.json`:

```json
{
  "scripts": {
    "preview": "vite preview",
    "serve": "serve -s dist -l 3000"
  },
  "dependencies": {
    "serve": "^14.2.1"
  }
}
```

## Step 5: Update Vite Config for Production

The `vite.config.js` should have `base: '/'` which is correct for Railway.

## Step 6: Deploy

1. Railway will automatically build and deploy
2. Watch the build logs
3. Get your frontend domain from **Settings → Networking**

## Step 7: Update Backend CORS

In your **backend Railway project**, update environment variables:

```env
FRONTEND_URL=https://your-frontend-domain.railway.app
```

This allows your backend to accept requests from the frontend.

## Alternative: Using Vercel/Netlify for Frontend

If Railway frontend deployment is problematic, you can use:

### Vercel (Recommended for Frontend)

1. Go to [vercel.com](https://vercel.com)
2. Import your GitHub repository
3. **Root Directory**: Set to `ecotrade`
4. **Build Command**: `npm run build`
5. **Output Directory**: `dist`
6. **Environment Variables**:
   - `VITE_BACKEND_URL` = your backend Railway URL

### Netlify

1. Go to [netlify.com](https://netlify.com)
2. Import from GitHub
3. **Base directory**: `ecotrade`
4. **Build command**: `npm run build`
5. **Publish directory**: `ecotrade/dist`
6. **Environment Variables**:
   - `VITE_BACKEND_URL` = your backend Railway URL

## Troubleshooting

### Frontend shows blank page
- Check browser console for errors
- Verify `VITE_BACKEND_URL` is set correctly
- Check that backend CORS allows your frontend domain

### API calls fail
- Verify `VITE_BACKEND_URL` matches your backend domain
- Check backend CORS configuration
- Verify backend is running and accessible

### Build fails
- Check that all dependencies are in `package.json`
- Verify Node.js version (18+)
- Check build logs for specific errors

