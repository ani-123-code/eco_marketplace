# CloudFront Image Loading Fix

## Common Issues & Solutions

### Issue 1: CloudFront Distribution Not Configured Correctly

**Problem:** CloudFront URL returns but images don't load.

**Solution:** Verify CloudFront distribution settings:

1. **Origin Settings:**
   - Origin Domain: Your S3 bucket domain (e.g., `your-bucket.s3.us-east-1.amazonaws.com`)
   - Origin Path: Leave empty (or set to `/eco_market` if using subfolder)
   - Origin Access: Use "Origin Access Control" (recommended) or "Public"

2. **Behaviors:**
   - Default Cache Behavior should allow GET, HEAD, OPTIONS
   - Viewer Protocol Policy: Redirect HTTP to HTTPS
   - Allowed HTTP Methods: GET, HEAD, OPTIONS
   - Cache Policy: CachingOptimized (or custom)

3. **Origin Access Control (if using):**
   - Create OAC in CloudFront
   - Update S3 bucket policy to allow CloudFront OAC
   - Update CloudFront distribution to use OAC

### Issue 2: S3 Bucket Permissions

**Problem:** Images uploaded but not accessible.

**Solution:** Ensure S3 bucket has correct permissions:

**Option A: Public Read (Simple)**
```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicReadGetObject",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::your-bucket-name/eco_market/*"
    }
  ]
}
```

**Option B: CloudFront OAC (Recommended)**
```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "AllowCloudFrontServicePrincipal",
      "Effect": "Allow",
      "Principal": {
        "Service": "cloudfront.amazonaws.com"
      },
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::your-bucket-name/eco_market/*",
      "Condition": {
        "StringEquals": {
          "AWS:SourceArn": "arn:aws:cloudfront::ACCOUNT_ID:distribution/DISTRIBUTION_ID"
        }
      }
    }
  ]
}
```

### Issue 3: CloudFront URL Format

**Problem:** URL format might be incorrect.

**Current Format:**
```
https://your-cloudfront-url.cloudfront.net/eco_market/materials/uuid.jpg
```

**Verify:**
- CloudFront URL should NOT have trailing slash
- Path should match S3 key exactly
- Check CloudFront distribution domain name

### Issue 4: CORS Configuration

**Problem:** Browser blocks images due to CORS.

**Solution:** Add CORS configuration to S3 bucket:

```json
[
  {
    "AllowedHeaders": ["*"],
    "AllowedMethods": ["GET", "HEAD"],
    "AllowedOrigins": ["*"],
    "ExposeHeaders": [],
    "MaxAgeSeconds": 3000
  }
]
```

### Issue 5: Cache Issues

**Problem:** Old URLs cached, new images not showing.

**Solution:**
1. Clear browser cache
2. Invalidate CloudFront cache:
   - Go to CloudFront console
   - Select distribution
   - Create invalidation: `/eco_market/*`
3. Wait for invalidation to complete (usually 1-5 minutes)

## Environment Variables Check

Verify these are set correctly in Railway:

```env
AWS_ACCESS_KEY_ID=your-access-key
AWS_SECRET_ACCESS_KEY=your-secret-key
AWS_REGION=us-east-1
AWS_S3_BUCKET_NAME=your-bucket-name
CLOUDFRONT_URL=https://your-distribution-id.cloudfront.net
```

**Important:**
- `CLOUDFRONT_URL` should NOT have trailing slash
- Should be the full CloudFront domain (e.g., `https://d1234567890.cloudfront.net`)
- Not the S3 URL

## Testing

1. **Check S3 Upload:**
   - Verify files are uploaded to `s3://your-bucket/eco_market/materials/`
   - Check file permissions in S3 console

2. **Check CloudFront:**
   - Test CloudFront URL directly in browser
   - Should return image, not error
   - Check CloudFront distribution status (Deployed)

3. **Check Browser Console:**
   - Open browser DevTools → Network tab
   - Check image requests
   - Look for CORS errors or 403/404 errors

## Debugging Steps

1. **Check Server Logs:**
   - Look for upload success messages
   - Verify CloudFront URL is being generated

2. **Test Direct S3 URL:**
   - Temporarily disable CloudFront
   - Use S3 URL directly
   - If S3 works, issue is with CloudFront config

3. **Test CloudFront URL:**
   - Copy CloudFront URL from database/logs
   - Paste in browser address bar
   - Should load image directly

4. **Check Network Tab:**
   - Open browser DevTools
   - Check failed image requests
   - Look at response headers and status codes

## Quick Fix: Use S3 URL Temporarily

If CloudFront isn't working, you can temporarily use S3 URLs:

1. Remove or comment out `CLOUDFRONT_URL` in Railway environment variables
2. Redeploy
3. New uploads will use S3 URLs directly
4. Fix CloudFront configuration
5. Re-enable CloudFront URL

## Common Error Codes

- **403 Forbidden:** S3 bucket permissions or CloudFront OAC issue
- **404 Not Found:** Wrong path or file doesn't exist
- **CORS Error:** Missing CORS configuration on S3
- **503 Service Unavailable:** CloudFront distribution not deployed

