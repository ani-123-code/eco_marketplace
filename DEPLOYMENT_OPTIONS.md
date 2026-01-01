# Deployment Options - Eco Marketplace

You have **two options** for deploying the Eco Marketplace:

## Option 1: Deploy Together (Monorepo) - Recommended

Deploy both frontend and backend in **one Railway project**.

### Setup:
1. Create **one Railway project**
2. Deploy from your GitHub repository
3. Railway will build frontend and start backend
4. Backend serves both API and static frontend files

### Advantages:
- ✅ Single deployment
- ✅ Single domain
- ✅ Easier to manage
- ✅ No CORS issues
- ✅ Lower cost

### Configuration:
- Use root `package.json`, `.nixpacks.toml`, and `railway.json`
- Backend serves static files from `ecotrade/dist`

---

## Option 2: Deploy Separately

Deploy frontend and backend as **separate Railway projects**.

### Backend Setup:
1. Create Railway project for backend
2. **Root Directory**: Set to `server` in Railway settings
3. **Build Command**: `npm install`
4. **Start Command**: `node server.js`

### Frontend Setup:
1. Create **new** Railway project for frontend
2. **Root Directory**: Set to `ecotrade` in Railway settings
3. **Build Command**: `npm install && npm run build`
4. **Start Command**: `npx serve -s dist -l $PORT`
5. **Environment Variable**: `VITE_BACKEND_URL=https://your-backend-domain.railway.app`

### Advantages:
- ✅ Can scale independently
- ✅ Separate domains
- ✅ Frontend can use Vercel/Netlify

### Configuration:
- Backend: Use `server/` directory files
- Frontend: Use `ecotrade/` directory files (has its own `.nixpacks.toml`)

---

## Quick Setup Guide

### For Option 1 (Together):

1. **One Railway Project**
2. **Root Directory**: Leave as root (default)
3. **Build Command**: (Auto-detected from `.nixpacks.toml`)
4. **Start Command**: (Auto-detected)
5. **Environment Variables**: Set all variables in one place

### For Option 2 (Separate):

#### Backend Project:
1. **Root Directory**: `server`
2. **Build Command**: `npm install`
3. **Start Command**: `node server.js`
4. **Environment Variables**: All backend variables

#### Frontend Project:
1. **Root Directory**: `ecotrade`
2. **Build Command**: `npm install && npm run build`
3. **Start Command**: `npx serve -s dist -l $PORT`
4. **Environment Variables**: 
   - `VITE_BACKEND_URL=https://your-backend.railway.app`
   - `NODE_ENV=production`

---

## Which Should You Choose?

### Choose Option 1 (Together) if:
- You want simpler deployment
- You want one domain
- You're just getting started
- Cost is a concern

### Choose Option 2 (Separate) if:
- You need to scale frontend/backend independently
- You want to use Vercel for frontend
- You have different teams managing frontend/backend
- You need separate domains

---

## Troubleshooting

### Option 1 Issues:

**Error**: `cd: server: No such file or directory`
- **Solution**: Check Railway root directory is set correctly (should be root)
- Verify `.nixpacks.toml` paths are correct

**Frontend not loading**:
- Check build logs - frontend should build successfully
- Verify `ecotrade/dist` exists after build
- Check server logs for static file serving

### Option 2 Issues:

**Frontend can't connect to backend**:
- Verify `VITE_BACKEND_URL` is set correctly
- Check backend CORS allows frontend domain
- Verify backend is running

**Backend not starting**:
- Check root directory is set to `server`
- Verify all environment variables are set
- Check build logs for errors

---

## Recommended: Option 1

For most use cases, **Option 1 (deploy together)** is recommended because:
- Simpler setup
- One domain to manage
- No CORS configuration needed
- Lower deployment complexity

Use Option 2 only if you have specific requirements for separate deployments.

