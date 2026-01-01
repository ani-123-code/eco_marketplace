# Separate Frontend Deployment - Step by Step

Since you're deploying the frontend in a **separate Railway project**, follow these steps:

## Step 1: Create Frontend Railway Project

1. Go to Railway dashboard
2. Click **"New Project"**
3. Select **"Deploy from GitHub repo"**
4. Choose your repository

## Step 2: Configure Root Directory

**IMPORTANT**: Set the root directory to `ecotrade`

1. Go to your frontend service → **Settings**
2. Scroll to **"Root Directory"**
3. Set it to: `ecotrade`
4. Save

## Step 3: Configure Build Settings

In **Settings → Build**:

### Build Command:
```bash
npm install && npm run build
```

### Start Command:
```bash
npx serve -s dist -l $PORT
```

**OR** use the script:
```bash
npm start
```

## Step 4: Set Environment Variables

In **Variables** tab, add:

```env
# Your backend Railway domain (get this from your backend project)
VITE_BACKEND_URL=https://your-backend-project.railway.app

# Node Environment
NODE_ENV=production
```

**Critical**: 
- Replace `your-backend-project.railway.app` with your actual backend Railway domain
- `VITE_BACKEND_URL` must be set **BEFORE** the build runs
- Railway will inject this during the build process

## Step 5: Update Backend CORS

In your **backend Railway project** → **Variables**, add:

```env
FRONTEND_URL=https://your-frontend-project.railway.app
```

Replace with your frontend Railway domain.

## Step 6: Deploy

1. Railway will automatically build and deploy
2. Watch the build logs
3. Get your frontend domain from **Settings → Networking → Generate Domain**

## Step 7: Verify

1. Visit your frontend domain
2. Check browser console for errors
3. Test API connection (should connect to backend)
4. Verify all pages load correctly

---

## Quick Reference

### Frontend Project Settings:
- **Root Directory**: `ecotrade`
- **Build Command**: `npm install && npm run build`
- **Start Command**: `npx serve -s dist -l $PORT`
- **Environment Variable**: `VITE_BACKEND_URL=https://backend-domain.railway.app`

### Backend Project Settings:
- **Root Directory**: `server` (or root if deploying together)
- **Start Command**: `node server.js`
- **Environment Variable**: `FRONTEND_URL=https://frontend-domain.railway.app`

---

## Troubleshooting

### Frontend shows blank page
- Check browser console (F12)
- Verify `VITE_BACKEND_URL` is set correctly
- Check that build completed successfully
- Verify `dist` folder exists

### API calls fail (404 or CORS errors)
- Verify `VITE_BACKEND_URL` matches your backend domain exactly
- Check backend CORS allows your frontend domain
- Verify backend is running
- Check backend logs

### Build fails
- Check Node.js version (needs 18+)
- Verify all dependencies in `package.json`
- Check build logs for specific errors

### "serve: command not found"
- The `serve` package should be in dependencies
- If not, Railway will install it via `npx serve`
- Or add to package.json: `"serve": "^14.2.1"`

---

## Alternative: Use Vite Preview

If `serve` doesn't work, you can use Vite's built-in preview:

**Start Command:**
```bash
npm run preview -- --host 0.0.0.0 --port $PORT
```

But you'll need to update the preview script in `package.json` to accept port from environment.

---

## Recommended: Use Vercel for Frontend

For better frontend hosting, consider using **Vercel**:

1. Go to [vercel.com](https://vercel.com)
2. Import from GitHub
3. **Root Directory**: `ecotrade`
4. **Build Command**: `npm run build`
5. **Output Directory**: `dist`
6. **Environment Variable**: `VITE_BACKEND_URL=https://your-backend.railway.app`

Vercel is optimized for frontend deployments and handles routing automatically.

