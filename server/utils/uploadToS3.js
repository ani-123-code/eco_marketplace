const { PutObjectCommand } = require('@aws-sdk/client-s3');
const { s3Client, S3_CONFIG } = require('../config/s3');
const { v4: uuidv4 } = require('uuid');
const path = require('path');

/**
 * Upload file to S3 in eco_market folder
 * @param {Buffer} fileBuffer - File buffer
 * @param {String} originalName - Original filename
 * @param {String} mimeType - File MIME type
 * @param {String} subfolder - Optional subfolder (e.g., 'materials', 'industries')
 * @returns {Promise<String>} - CloudFront URL of uploaded file
 */
const uploadToS3 = async (fileBuffer, originalName, mimeType, subfolder = 'materials') => {
  try {
    if (!S3_CONFIG.bucket) {
      throw new Error('AWS S3 bucket name is not configured');
    }

    // Generate unique filename
    const fileExtension = path.extname(originalName);
    const uniqueFileName = `${uuidv4()}${fileExtension}`;
    
    // Create S3 key (path) in eco_market folder
    const s3Key = `${S3_CONFIG.folder}/${subfolder}/${uniqueFileName}`;

    // Upload to S3
    const uploadParams = {
      Bucket: S3_CONFIG.bucket,
      Key: s3Key,
      Body: fileBuffer,
      ContentType: mimeType,
      // Set Cache-Control for better CloudFront caching
      CacheControl: 'max-age=31536000, public',
      // Note: ACL is deprecated for newer S3 buckets. 
      // Ensure bucket has public read policy or remove ACL if bucket ACLs are disabled
      // ACL: 'public-read', // Uncomment if your bucket supports ACLs
    };

    await s3Client.send(new PutObjectCommand(uploadParams));
    console.log(`📤 Uploaded file to S3: ${s3Key} (${(fileBuffer.length / 1024).toFixed(2)} KB)`);

    // Return CloudFront URL if configured, otherwise S3 URL
    if (S3_CONFIG.cloudfrontUrl) {
      // Remove trailing slash from CloudFront URL if present
      const cloudfrontBase = S3_CONFIG.cloudfrontUrl.replace(/\/$/, '');
      const cloudfrontUrl = `${cloudfrontBase}/${s3Key}`;
      console.log(`✅ Uploaded to S3: ${s3Key}, CloudFront URL: ${cloudfrontUrl}`);
      return cloudfrontUrl;
    } else {
      // Fallback to S3 URL (public read required)
      const s3Url = `https://${S3_CONFIG.bucket}.s3.${S3_CONFIG.region}.amazonaws.com/${s3Key}`;
      console.log(`✅ Uploaded to S3: ${s3Key}, S3 URL: ${s3Url}`);
      return s3Url;
    }
  } catch (error) {
    console.error('Error uploading to S3:', error);
    throw new Error(`Failed to upload file to S3: ${error.message}`);
  }
};

/**
 * Upload base64 image to S3
 * @param {String} base64String - Base64 encoded image string
 * @param {String} subfolder - Optional subfolder
 * @returns {Promise<String>} - CloudFront URL of uploaded file
 */
const uploadBase64ToS3 = async (base64String, subfolder = 'materials') => {
  try {
    // Extract MIME type and data from base64 string
    const matches = base64String.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
    if (!matches || matches.length !== 3) {
      throw new Error('Invalid base64 string format');
    }

    const mimeType = matches[1];
    const base64Data = matches[2];
    const fileBuffer = Buffer.from(base64Data, 'base64');

    // Determine file extension from MIME type
    const extensions = {
      'image/jpeg': '.jpg',
      'image/jpg': '.jpg',
      'image/png': '.png',
      'image/gif': '.gif',
      'image/webp': '.webp',
    };
    const extension = extensions[mimeType] || '.jpg';
    const originalName = `image${extension}`;

    return await uploadToS3(fileBuffer, originalName, mimeType, subfolder);
  } catch (error) {
    console.error('Error uploading base64 to S3:', error);
    throw new Error(`Failed to upload base64 image: ${error.message}`);
  }
};

module.exports = {
  uploadToS3,
  uploadBase64ToS3,
};

