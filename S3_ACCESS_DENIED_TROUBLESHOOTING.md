# S3 Access Denied - Complete Troubleshooting Guide

## Still Getting Access Denied? Follow These Steps

### Step 1: Verify Block Public Access Settings

**This is the #1 cause of Access Denied even with correct policies!**

1. Go to AWS S3 Console
2. Select bucket: `ecodispose-images-bucket-2025`
3. Go to **Permissions** tab
4. Click on **Block public access (bucket settings)**
5. Click **Edit**
6. **Uncheck ALL 4 checkboxes:**
   - ☐ Block all public access
   - ☐ Block public access to buckets and objects granted through new public bucket or access point policies
   - ☐ Block public access to buckets and objects granted through any public bucket or access point policies
   - ☐ Block public access to buckets and objects granted through new access control lists (ACLs)
   - ☐ Block public and cross-account access to buckets and objects through any public bucket or access point policies
7. Click **Save changes**
8. Type `confirm` in the confirmation dialog
9. Click **Confirm**

**⚠️ IMPORTANT:** This step is REQUIRED even if you have the correct bucket policy!

### Step 2: Verify Bucket Policy

1. Go to **Permissions** tab
2. Scroll to **Bucket policy**
3. Click **Edit**
4. Make sure you have this EXACT policy (copy-paste to avoid errors):

```json
{
  "Version": "2012-10-17",
  "Id": "PublicReadForEcoMarket",
  "Statement": [
    {
      "Sid": "PublicReadGetObject",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::ecodispose-images-bucket-2025/eco_market/*"
    },
    {
      "Sid": "AllowCloudFrontServicePrincipal",
      "Effect": "Allow",
      "Principal": {
        "Service": "cloudfront.amazonaws.com"
      },
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::ecodispose-images-bucket-2025/*",
      "Condition": {
        "ArnLike": {
          "AWS:SourceArn": "arn:aws:cloudfront::036983628673:distribution/EHFTP8IL2AWYX"
        }
      }
    }
  ]
}
```

5. Click **Save changes**
6. Wait a few seconds for the policy to propagate

### Step 3: Check Object-Level Permissions (ACLs)

1. Go to **Permissions** tab
2. Scroll to **Object Ownership**
3. Make sure it's set to **Bucket owner preferred** or **ACLs enabled**
4. If it says "ACLs disabled", click **Edit** and change to **Bucket owner preferred**
5. Click **Save changes**

### Step 4: Verify the File Exists

1. Go to **Objects** tab
2. Navigate to `eco_market/industries/`
3. Verify the file `93884132-b948-40b8-baeb-d393121e8b5b.jpg` exists
4. If it doesn't exist, that's why you're getting 404/403

### Step 5: Test with a Simple Public-Only Policy

If the combined policy doesn't work, try this simpler public-only policy first:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicReadGetObject",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::ecodispose-images-bucket-2025/eco_market/*"
    }
  ]
}
```

**Steps:**
1. Replace your current bucket policy with this simpler one
2. Make sure Block Public Access is disabled (Step 1)
3. Save and test

### Step 6: Check IAM Permissions

Make sure your AWS user/role has permission to modify bucket policies:

1. Go to IAM Console
2. Check your user/role permissions
3. Should have: `s3:PutBucketPolicy`, `s3:GetBucketPolicy`, `s3:PutBucketPublicAccessBlock`

### Step 7: Wait for Propagation

AWS changes can take 1-2 minutes to propagate:
- Wait 2-3 minutes after making changes
- Clear browser cache
- Try the URL again in incognito/private mode

### Step 8: Test the URL

After completing all steps, test:
```
https://ecodispose-images-bucket-2025.s3.us-east-1.amazonaws.com/eco_market/industries/93884132-b948-40b8-baeb-d393121e8b5b.jpg
```

**Expected Result:**
- ✅ Image loads = Success!
- ❌ Still "Access Denied" = Continue troubleshooting

## Common Mistakes

1. **Block Public Access still enabled** - Most common issue!
2. **Policy JSON syntax error** - Missing comma, bracket, etc.
3. **Wrong bucket name in policy** - Check ARN matches your bucket
4. **Wrong resource path** - Should be `arn:aws:s3:::bucket-name/eco_market/*`
5. **Policy not saved** - Click "Save changes" button
6. **ACLs disabled** - Need to enable ACLs or use Bucket owner preferred

## Quick Checklist

- [ ] Block Public Access: ALL 4 checkboxes UNCHECKED
- [ ] Bucket Policy: Correct JSON, saved successfully
- [ ] Object Ownership: Bucket owner preferred or ACLs enabled
- [ ] File exists in S3: Check Objects tab
- [ ] Waited 2-3 minutes after changes
- [ ] Tested URL in incognito/private browser

## Still Not Working?

If you've completed all steps and still get Access Denied:

1. **Check AWS CloudTrail** (if you have access):
   - Look for S3 API calls
   - Check for any denied requests

2. **Try uploading a new file:**
   - Upload a test image
   - Check if new files work (might be old file permissions)

3. **Use CloudFront instead:**
   - Set up CloudFront distribution
   - Use CloudFront URL instead of S3 URL
   - CloudFront can access S3 even if public access is blocked

4. **Contact AWS Support:**
   - If nothing works, there might be account-level restrictions

## Alternative: Use CloudFront URL

If S3 public access is too complicated, use CloudFront:

1. Your CloudFront distribution is already set up: `EHFTP8IL2AWYX`
2. Get your CloudFront domain from CloudFront console
3. Set `CLOUDFRONT_URL` in Railway environment variables
4. Images will be served via CloudFront (which can access S3 even without public access)

CloudFront URL format:
```
https://your-distribution-id.cloudfront.net/eco_market/industries/93884132-b948-40b8-baeb-d393121e8b5b.jpg
```

