# Image Fetch Debugging Guide

## Problem
Images are uploaded to S3 successfully but cannot be fetched and displayed on the website.

## Enhanced Debugging Features Added

### 1. Enhanced Server Logging
- ✅ Detailed upload logs with S3 key, CloudFront URL, bucket, and region
- ✅ Image test endpoint for debugging
- ✅ Better error messages

### 2. Frontend Image Error Handling
- ✅ Console logging for successful image loads
- ✅ Detailed error logging with image URL and material ID
- ✅ Better placeholder handling

### 3. Test Endpoint
Added `/api/upload/test-image/:url` endpoint to test image accessibility:
```
GET /api/upload/test-image/https://your-cloudfront-url.cloudfront.net/eco_market/materials/image.jpg
```

## Debugging Steps

### Step 1: Check Server Logs
After uploading an image, check Railway logs for:
```
📤 Uploaded file to S3: eco_market/materials/uuid.jpg (123.45 KB)
✅ Uploaded to S3: eco_market/materials/uuid.jpg
🌐 CloudFront URL: https://your-cloudfront-url.cloudfront.net/eco_market/materials/uuid.jpg
📋 S3 Key: eco_market/materials/uuid.jpg
📦 Bucket: your-bucket-name
🌍 Region: us-east-1
```

### Step 2: Test Image URL Directly
1. Copy the CloudFront URL from server logs
2. Paste it directly in your browser address bar
3. Check what happens:
   - ✅ **200 OK**: Image loads - issue is with frontend
   - ❌ **403 Forbidden**: S3/CloudFront permissions issue
   - ❌ **404 Not Found**: Wrong path or file doesn't exist
   - ❌ **CORS Error**: Missing CORS configuration

### Step 3: Use Test Endpoint
Test image accessibility via API:
```bash
curl "https://your-backend-url/api/upload/test-image/https://your-cloudfront-url.cloudfront.net/eco_market/materials/image.jpg"
```

Response will show:
- Status code
- Content type
- Headers
- Success/failure

### Step 4: Check Browser Console
Open browser DevTools → Console:
- Look for `✅ Image loaded successfully: [URL]` (success)
- Look for `❌ Image load error: [URL]` (failure)
- Check Network tab for failed image requests

### Step 5: Verify CloudFront Configuration

#### Check CloudFront Distribution:
1. Go to AWS CloudFront Console
2. Select your distribution
3. Check **Status**: Should be "Deployed"
4. Check **Origin**: Should point to your S3 bucket
5. Check **Origin Path**: Should be empty (or `/eco_market` if configured)

#### Check S3 Bucket Policy:
Your S3 bucket needs one of these policies:

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

#### Check CORS Configuration:
Add CORS to your S3 bucket:
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

### Step 6: Verify Environment Variables
Check Railway environment variables:
```env
AWS_ACCESS_KEY_ID=your-access-key
AWS_SECRET_ACCESS_KEY=your-secret-key
AWS_REGION=us-east-1
AWS_S3_BUCKET_NAME=your-bucket-name
CLOUDFRONT_URL=https://your-distribution-id.cloudfront.net
```

**Important:**
- `CLOUDFRONT_URL` should NOT have trailing slash
- Should be full CloudFront domain (e.g., `https://d1234567890.cloudfront.net`)
- Not the S3 URL

### Step 7: Test with S3 URL Directly
Temporarily disable CloudFront to test S3 directly:
1. Remove `CLOUDFRONT_URL` from Railway environment variables
2. Redeploy
3. Upload a new image
4. Check if S3 URL works
5. If S3 works, issue is with CloudFront configuration

## Common Issues & Solutions

### Issue 1: 403 Forbidden
**Cause:** S3 bucket permissions or CloudFront OAC not configured
**Solution:** 
- Add public read policy to S3 bucket
- Or configure CloudFront OAC and update S3 bucket policy

### Issue 2: 404 Not Found
**Cause:** Wrong path or file doesn't exist
**Solution:**
- Verify S3 key format: `eco_market/materials/uuid.jpg`
- Check CloudFront origin path
- Verify file exists in S3 console

### Issue 3: CORS Error
**Cause:** Missing CORS configuration on S3
**Solution:** Add CORS configuration to S3 bucket (see Step 5)

### Issue 4: CloudFront Not Deployed
**Cause:** CloudFront distribution not fully deployed
**Solution:**
- Wait for deployment to complete (usually 5-15 minutes)
- Check CloudFront console for status

### Issue 5: Wrong CloudFront URL Format
**Cause:** Incorrect `CLOUDFRONT_URL` environment variable
**Solution:**
- Should be: `https://d1234567890.cloudfront.net` (no trailing slash)
- Not: `https://d1234567890.cloudfront.net/` (with slash)
- Not: `https://your-bucket.s3.amazonaws.com` (S3 URL)

## Quick Fix Checklist

- [ ] Check server logs for upload success
- [ ] Test CloudFront URL directly in browser
- [ ] Verify S3 bucket has public read policy or CloudFront OAC
- [ ] Check CORS configuration on S3 bucket
- [ ] Verify CloudFront distribution is deployed
- [ ] Check `CLOUDFRONT_URL` environment variable format
- [ ] Check browser console for errors
- [ ] Test with S3 URL directly (disable CloudFront temporarily)

## Next Steps After Fixing

1. Clear browser cache
2. Invalidate CloudFront cache: `/eco_market/*`
3. Test image upload and display
4. Monitor server logs for any errors

