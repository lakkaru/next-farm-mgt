const { PutObjectCommand, DeleteObjectCommand, GetObjectCommand } = require('@aws-sdk/client-s3');
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');
const { r2Client, R2_BUCKET_NAME, R2_PUBLIC_URL } = require('../config/r2Config');
const crypto = require('crypto');
const path = require('path');

class R2Service {
  /**
   * Upload file to Cloudflare R2
   * @param {Buffer} fileBuffer - File buffer
   * @param {string} fileName - Original filename
   * @param {string} mimeType - File MIME type
   * @param {string} folder - Folder path (e.g., 'daily-remarks', 'season-plans')
   * @returns {Promise<Object>} Upload result with key and URL
   */
  async uploadFile(fileBuffer, fileName, mimeType, folder = 'uploads') {
    try {
      // Generate unique filename to avoid conflicts
      const fileExtension = path.extname(fileName);
      const uniqueId = crypto.randomUUID();
      const timestamp = Date.now();
      const key = `${folder}/${timestamp}-${uniqueId}${fileExtension}`;

      const uploadParams = {
        Bucket: R2_BUCKET_NAME,
        Key: key,
        Body: fileBuffer,
        ContentType: mimeType,
        Metadata: {
          originalName: fileName,
          uploadDate: new Date().toISOString(),
        },
      };

      const command = new PutObjectCommand(uploadParams);
      await r2Client.send(command);

      // Generate public URL
      const publicUrl = this.getPublicUrl(key);

      return {
        success: true,
        key,
        url: publicUrl,
        originalName: fileName,
        size: fileBuffer.length,
        mimeType,
      };
    } catch (error) {
      console.error('R2 Upload Error:', error);
      throw new Error(`Failed to upload to R2: ${error.message}`);
    }
  }

  /**
   * Delete file from Cloudflare R2
   * @param {string} key - File key in R2
   * @returns {Promise<boolean>} Success status
   */
  async deleteFile(key) {
    try {
      const deleteParams = {
        Bucket: R2_BUCKET_NAME,
        Key: key,
      };

      const command = new DeleteObjectCommand(deleteParams);
      await r2Client.send(command);

      return true;
    } catch (error) {
      console.error('R2 Delete Error:', error);
      throw new Error(`Failed to delete from R2: ${error.message}`);
    }
  }

  /**
   * Get signed URL for private access (if needed)
   * @param {string} key - File key in R2
   * @param {number} expiresIn - URL expiration time in seconds (default: 1 hour)
   * @returns {Promise<string>} Signed URL
   */
  async getSignedUrl(key, expiresIn = 3600) {
    try {
      const command = new GetObjectCommand({
        Bucket: R2_BUCKET_NAME,
        Key: key,
      });

      const signedUrl = await getSignedUrl(r2Client, command, { expiresIn });
      return signedUrl;
    } catch (error) {
      console.error('R2 Signed URL Error:', error);
      throw new Error(`Failed to generate signed URL: ${error.message}`);
    }
  }

  /**
   * Get file stream from R2 (for private bucket access)
   * @param {string} key - File key in R2
   * @returns {Promise<Object>} Stream and metadata
   */
  async getFileStream(key) {
    try {
      const command = new GetObjectCommand({
        Bucket: R2_BUCKET_NAME,
        Key: key,
      });

      const response = await r2Client.send(command);
      
      return {
        stream: response.Body,
        contentType: response.ContentType,
        contentLength: response.ContentLength,
        lastModified: response.LastModified,
        etag: response.ETag
      };
    } catch (error) {
      console.error('R2 Get File Error:', error);
      throw new Error(`Failed to get file from R2: ${error.message}`);
    }
  }

  /**
   * Get public URL for file
   * @param {string} key - File key in R2
   * @returns {string} Public URL
   */
  getPublicUrl(key) {
    if (R2_PUBLIC_URL) {
      // Use custom domain if configured
      return `${R2_PUBLIC_URL}/${key}`;
    } else {
      // Use default R2 public URL format
      const accountId = process.env.R2_ACCOUNT_ID;
      return `https://pub-${accountId}.r2.dev/${key}`;
    }
  }

  /**
   * Upload multiple files
   * @param {Array} files - Array of file objects with buffer, name, mimeType
   * @param {string} folder - Folder path
   * @returns {Promise<Array>} Array of upload results
   */
  async uploadMultipleFiles(files, folder = 'uploads') {
    try {
      const uploadPromises = files.map(file => 
        this.uploadFile(file.buffer, file.name, file.mimeType, folder)
      );

      const results = await Promise.all(uploadPromises);
      return results;
    } catch (error) {
      console.error('R2 Multiple Upload Error:', error);
      throw new Error(`Failed to upload multiple files: ${error.message}`);
    }
  }

  /**
   * Check if R2 service is properly configured
   * @returns {boolean} Configuration status
   */
  isConfigured() {
    const requiredEnvVars = [
      'R2_ENDPOINT',
      'R2_ACCESS_KEY_ID',
      'R2_SECRET_ACCESS_KEY',
      'R2_BUCKET_NAME'
    ];

    return requiredEnvVars.every(envVar => {
      const value = process.env[envVar];
      return value && value.trim() !== '' && !value.includes('your_') && !value.includes('YOUR_');
    });
  }
}

module.exports = new R2Service();
