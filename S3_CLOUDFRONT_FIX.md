# S3 & CloudFront Fix - Image Upload & NaN Error Resolution

## Issues Fixed

### 1. NaN Error in Number Inputs
**Problem:** `parseInt()` and `parseFloat()` were returning `NaN` when input fields were empty, causing browser errors:
```
The specified value "NaN" cannot be parsed, or is out of range.
```

**Solution:** Added validation to handle empty values before parsing:
- Empty string returns empty string (allows clearing the field)
- Invalid values default to sensible defaults (0 for quantities, 1 for min order)

**Files Fixed:**
- `ecotrade/src/pages/admin/AdminEcoMaterials.jsx` - Fixed `availableQuantity` and `minimumOrderQuantity`
- `ecotrade/src/pages/admin/AdminEcoIndustries.jsx` - Fixed `displayOrder`

### 2. S3 Subfolder Organization
**Problem:** All images were being uploaded to the same subfolder regardless of type.

**Solution:** 
- Updated `uploadAPI.js` to accept `subfolder` parameter
- Materials upload to `eco_market/materials/`
- Industries upload to `eco_market/industries/`
- Updated `AdminEcoIndustries.jsx` to use 'industries' subfolder

### 3. CloudFront URL Usage
**Status:** Already configured correctly in `server/utils/uploadToS3.js`
- Returns CloudFront URL when `CLOUDFRONT_URL` is set in environment
- Falls back to S3 URL if CloudFront not configured
- Images stored in organized folder structure: `eco_market/subfolder/filename`

## Changes Made

### 1. AdminEcoMaterials.jsx
```jsx
// Before:
onChange={(e) => setFormData({ ...formData, availableQuantity: parseFloat(e.target.value) })}

// After:
onChange={(e) => {
  const value = e.target.value;
  setFormData({ 
    ...formData, 
    availableQuantity: value === '' ? '' : (parseFloat(value) || 0)
  });
}}
```

### 2. uploadAPI.js
```javascript
// Before:
uploadImage: async (file) => {
  formData.append('subfolder', 'materials');
  // ...
}

// After:
uploadImage: async (file, subfolder = 'materials') => {
  formData.append('subfolder', subfolder);
  // ...
}
```

### 3. AdminEcoIndustries.jsx
```javascript
// Before:
const response = await uploadAPI.uploadImage(file);

// After:
const response = await uploadAPI.uploadImage(file, 'industries');
```

## Environment Variables Required

Make sure these are set in Railway:

```env
# AWS S3 Configuration
AWS_ACCESS_KEY_ID=your-aws-access-key
AWS_SECRET_ACCESS_KEY=your-aws-secret-key
AWS_REGION=us-east-1
AWS_S3_BUCKET_NAME=your-bucket-name

# CloudFront Configuration
CLOUDFRONT_URL=https://your-cloudfront-url.cloudfront.net
```

## Folder Structure

Images are now organized as:
```
S3 Bucket/
└── eco_market/
    ├── materials/
    │   ├── uuid1.jpg
    │   ├── uuid2.png
    │   └── ...
    └── industries/
        ├── uuid3.jpg
        ├── uuid4.png
        └── ...
```

## Testing

After deployment:
1. ✅ No more NaN errors in number input fields
2. ✅ Materials images upload to `eco_market/materials/`
3. ✅ Industry icons upload to `eco_market/industries/`
4. ✅ Images return CloudFront URLs when configured
5. ✅ Images display correctly using CloudFront URLs

## Benefits

- ✅ **No NaN Errors**: Input fields handle empty/invalid values gracefully
- ✅ **Organized Storage**: Images organized by type in subfolders
- ✅ **CloudFront CDN**: Faster image delivery via CloudFront
- ✅ **Flexible API**: Upload functions accept subfolder parameter
- ✅ **Better UX**: Users can clear number fields without errors

