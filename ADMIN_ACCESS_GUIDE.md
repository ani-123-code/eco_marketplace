# 🔐 Admin Panel Access Guide

## How to Access Admin Panel After Hosting

### Admin Login URL

After hosting on Railway, access the admin panel at:

```
https://your-railway-domain.railway.app/asse3432/12ww3ed-xx
```

**Example:**
```
https://eco-marketplace-production.up.railway.app/asse3432/12ww3ed-xx
```

---

## Admin Credentials

### How Admin Credentials Work

The admin account is **automatically created** when the server starts, using environment variables you set in Railway.

### Required Environment Variables

In your Railway project → **Variables** tab, you must set:

```env
ADMIN_EMAIL=your-admin@email.com
ADMIN_PASSWORD=your-secure-password
ADMIN_SECRET=your-admin-secret-key
```

### Login Credentials

**Email:** The value you set for `ADMIN_EMAIL` in Railway environment variables

**Password:** The value you set for `ADMIN_PASSWORD` in Railway environment variables

**Example:**
- If you set `ADMIN_EMAIL=admin@ecodispose.com` in Railway
- And `ADMIN_PASSWORD=SecurePass123!` in Railway
- Then use:
  - **Email:** `admin@ecodispose.com`
  - **Password:** `SecurePass123!`

---

## Step-by-Step: Setting Up Admin Access

### Step 1: Set Environment Variables in Railway

1. Go to your Railway project dashboard
2. Click on your service
3. Go to **"Variables"** tab
4. Add these variables:

```env
ADMIN_EMAIL=admin@yourdomain.com
ADMIN_PASSWORD=YourSecurePassword123!
ADMIN_SECRET=your-random-secret-key-here
```

**Important Notes:**
- Use a **strong password** for `ADMIN_PASSWORD`
- `ADMIN_EMAIL` should be a valid email address
- `ADMIN_SECRET` is an additional security layer (can be any random string)

### Step 2: Deploy/Redeploy

After setting the variables:
- Railway will automatically redeploy
- The admin user will be created on first deployment
- If admin already exists, password will be updated if changed

### Step 3: Access Admin Panel

1. Go to: `https://your-domain.railway.app/asse3432/12ww3ed-xx`
2. Enter your credentials:
   - **Email:** (value of `ADMIN_EMAIL`)
   - **Password:** (value of `ADMIN_PASSWORD`)
3. Click **"Sign In"**

---

## Admin Secret Code

The admin panel uses an additional security layer with a hardcoded secret code. This is already configured in the code and you don't need to set it manually.

**Secret Code:** `12#$#WDDFF#$%%%####diuefcb`

This is automatically handled by the frontend, so you don't need to enter it manually.

---

## Admin Dashboard Features

Once logged in, you'll have access to:

- **Dashboard Overview** - Analytics and statistics
- **Materials Management** - Add, edit, delete materials
- **Industries Management** - Manage industry categories
- **Buyer Requests** - View and manage quote requests
- **Seller Requests** - Review seller registration applications
- **Contact Messages** - View customer inquiries
- **Analytics** - View platform statistics

---

## Troubleshooting

### Can't Access Admin Panel

**Issue:** Getting 404 error on admin login page
- **Solution:** Verify the URL is correct: `/asse3432/12ww3ed-xx`
- Check that the frontend is deployed correctly

**Issue:** "Invalid credentials" error
- **Solution:** 
  - Verify `ADMIN_EMAIL` and `ADMIN_PASSWORD` are set in Railway
  - Check that values match exactly (case-sensitive)
  - Redeploy after changing variables

**Issue:** "Admin secret code required" error
- **Solution:** This should be automatic. If you see this, check server logs

**Issue:** Admin user not created
- **Solution:**
  - Check Railway logs for errors
  - Verify `ADMIN_EMAIL` and `ADMIN_PASSWORD` are set
  - Check MongoDB connection is working
  - Look for "Admin user created successfully" in logs

### Forgot Admin Password

If you forgot your admin password:

1. Go to Railway → **Variables** tab
2. Update `ADMIN_PASSWORD` with a new password
3. Railway will auto-redeploy
4. The admin password will be updated automatically
5. Use the new password to login

### Change Admin Email

To change the admin email:

1. Go to Railway → **Variables** tab
2. Update `ADMIN_EMAIL` with new email
3. Railway will auto-redeploy
4. The admin account email will be updated
5. Use the new email to login

---

## Security Best Practices

1. **Use Strong Password:**
   - Minimum 12 characters
   - Mix of uppercase, lowercase, numbers, and symbols
   - Example: `MySecure@Admin123!`

2. **Keep Credentials Secret:**
   - Never share admin credentials
   - Don't commit credentials to Git
   - Use Railway's secure environment variables

3. **Regular Updates:**
   - Change password periodically
   - Use unique `ADMIN_SECRET` value
   - Monitor admin access logs

4. **Access Control:**
   - Only authorized personnel should have admin access
   - Use the hidden admin URL path
   - Monitor who has access

---

## Quick Reference

| Item | Value |
|------|-------|
| **Admin Login URL** | `/asse3432/12ww3ed-xx` |
| **Full URL** | `https://your-domain.railway.app/asse3432/12ww3ed-xx` |
| **Email** | Value of `ADMIN_EMAIL` env variable |
| **Password** | Value of `ADMIN_PASSWORD` env variable |
| **Admin Secret** | `12#$#WDDFF#$%%%####diuefcb` (automatic) |
| **Dashboard URL** | `/1sd3-hash` (after login) |

---

## Example Setup

Here's a complete example of setting up admin access:

### 1. In Railway Variables:

```env
ADMIN_EMAIL=admin@ecodispose.com
ADMIN_PASSWORD=SecureAdmin@2024!
ADMIN_SECRET=my-super-secret-admin-key-12345
```

### 2. After Deployment:

1. Visit: `https://eco-marketplace.up.railway.app/asse3432/12ww3ed-xx`
2. Login with:
   - Email: `admin@ecodispose.com`
   - Password: `SecureAdmin@2024!`
3. You'll be redirected to the admin dashboard

---

## Need Help?

- Check Railway logs for errors
- Verify all environment variables are set
- Ensure MongoDB is connected
- Check that the frontend build completed successfully

For more deployment help, see `DEPLOYMENT_STEPS.md`

