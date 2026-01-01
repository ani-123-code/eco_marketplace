# Railway Build Fix - Missing Dependencies

## Problem
The error `Cannot find module 'dotenv'` occurs because server dependencies aren't being installed during the build process.

## Solution Applied

Updated build configuration files to ensure all dependencies are installed:

1. **`.nixpacks.toml`** - Updated to install server dependencies in both install and build phases
2. **`package.json`** - Updated build script to install server dependencies
3. **`railway.json`** - Simplified to let Nixpacks handle the build automatically

## What Changed

### Before:
- Server dependencies were only installed in install phase
- Build phase didn't ensure server dependencies were present

### After:
- Server dependencies installed in both install and build phases
- Build script explicitly installs server dependencies
- Nixpacks configuration ensures proper dependency installation

## Next Steps

1. **Commit and push changes:**
   ```bash
   git add .
   git commit -m "Fix Railway build - ensure server dependencies installed"
   git push origin main
   ```

2. **Redeploy on Railway:**
   - Railway will automatically detect the changes
   - The build will now install all server dependencies
   - The application should start successfully

3. **Verify:**
   - Check Railway build logs
   - Should see "npm install" running in server directory
   - Application should start without module errors

## Alternative: Manual Build Command

If the automatic detection doesn't work, you can set a custom build command in Railway:

**Settings → Build → Build Command:**
```bash
npm install && cd server && npm install && cd ../ecotrade && npm install && cd ../ecotrade && npm run build && cd ../server && npm install
```

**Settings → Deploy → Start Command:**
```bash
cd server && node server.js
```

## Verification

After deployment, check logs for:
- ✅ "npm install" in server directory
- ✅ "npm install" in ecotrade directory  
- ✅ "npm run build" completing successfully
- ✅ Server starting without module errors

