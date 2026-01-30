const { S3Client } = require('@aws-sdk/client-s3');

// Cloudflare R2 Configuration
const r2Config = {
  region: 'auto', // Cloudflare R2 uses 'auto' region
  endpoint: process.env.R2_ENDPOINT, // Your R2 endpoint URL
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
  },
  forcePathStyle: true, // Required for R2 compatibility
};

// Create S3 client configured for Cloudflare R2
const r2Client = new S3Client(r2Config);

// R2 Bucket configuration
const R2_BUCKET_NAME = process.env.R2_BUCKET_NAME || 'farm-management-images';
const R2_PUBLIC_URL = process.env.R2_PUBLIC_URL; // Your R2 public URL if using custom domain

module.exports = {
  r2Client,
  R2_BUCKET_NAME,
  R2_PUBLIC_URL,
  r2Config,
};
