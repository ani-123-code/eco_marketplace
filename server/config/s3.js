const { S3Client } = require('@aws-sdk/client-s3');

// Initialize S3 client
const s3Client = new S3Client({
  region: process.env.AWS_REGION || 'us-east-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

// S3 Configuration
const S3_CONFIG = {
  bucket: process.env.AWS_S3_BUCKET_NAME,
  region: process.env.AWS_REGION || 'us-east-1',
  folder: 'eco_market', // Main folder for eco marketplace
  cloudfrontUrl: process.env.CLOUDFRONT_URL, // CloudFront distribution URL
};

module.exports = {
  s3Client,
  S3_CONFIG,
};

