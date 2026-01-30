const heicConvert = require('heic-convert');
const sharp = require('sharp');

class ImageProcessingService {
  /**
   * Convert HEIC image to JPEG format
   * @param {Buffer} heicBuffer - HEIC image buffer
   * @param {number} quality - JPEG quality (1-100, default: 85)
   * @returns {Promise<Buffer>} JPEG buffer
   */
  async convertHeicToJpeg(heicBuffer, quality = 85) {
    try {
      console.log(`[HEIC DEBUG] Starting HEIC conversion - Buffer size: ${heicBuffer.length} bytes`);
      
      // Add timeout for HEIC conversion (mobile files can sometimes hang)
      const conversionPromise = heicConvert({
        buffer: heicBuffer,
        format: 'JPEG',
        quality: quality / 100, // heic-convert expects 0-1 range
      });
      
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => {
          reject(new Error('HEIC conversion timeout - file may be corrupted or too large'));
        }, 30000); // 30 second timeout
      });
      
      const jpegBuffer = await Promise.race([conversionPromise, timeoutPromise]);
      console.log(`[HEIC DEBUG] HEIC conversion successful - Output size: ${jpegBuffer.length} bytes`);
      
      return jpegBuffer;
    } catch (error) {
      console.error('[HEIC DEBUG] HEIC conversion error:', error);
      console.error('[HEIC DEBUG] Input buffer info:', {
        length: heicBuffer.length,
        isBuffer: Buffer.isBuffer(heicBuffer),
        firstBytes: heicBuffer.length > 0 ? heicBuffer.slice(0, 16).toString('hex') : 'empty'
      });
      throw new Error(`Failed to convert HEIC to JPEG: ${error.message}`);
    }
  }

  /**
   * Process and optimize image
   * @param {Buffer} imageBuffer - Original image buffer
   * @param {string} mimeType - Original MIME type
   * @param {Object} options - Processing options
   * @param {string} filename - Optional filename for better detection
   * @returns {Promise<Object>} Processed image info
   */
  async processImage(imageBuffer, mimeType, options = {}, filename = '') {
    try {
      const {
        maxWidth = 1920,
        maxHeight = 1080,
        quality = 85,
        format = 'jpeg', // Default output format
      } = options;

      let processedBuffer = imageBuffer;
      let outputMimeType = mimeType;
      let fileExtension = this.getFileExtension(mimeType);

      // Enhanced HEIC detection for mobile devices
      const normalizedMimeType = mimeType.toLowerCase();
      const lowerFilename = filename.toLowerCase();
      
      const isHeicType = normalizedMimeType.includes('heic') || 
                        normalizedMimeType.includes('heif') ||
                        lowerFilename.endsWith('.heic') ||
                        lowerFilename.endsWith('.heif') ||
                        // Mobile devices often send HEIC with generic MIME types
                        (lowerFilename.endsWith('.heic') && (
                          normalizedMimeType === 'application/octet-stream' ||
                          normalizedMimeType === 'image/unknown' ||
                          normalizedMimeType === 'application/unknown'
                        ));

      // Convert HEIC to JPEG
      if (isHeicType) {
        console.log('Converting HEIC/HEIF to JPEG...');
        processedBuffer = await this.convertHeicToJpeg(imageBuffer, quality);
        outputMimeType = 'image/jpeg';
        fileExtension = '.jpg';
      }

      // Optimize and resize image using Sharp
      const sharpInstance = sharp(processedBuffer);
      const metadata = await sharpInstance.metadata();

      // Only resize if image is larger than max dimensions
      if (metadata.width > maxWidth || metadata.height > maxHeight) {
        console.log(`Resizing image from ${metadata.width}x${metadata.height} to max ${maxWidth}x${maxHeight}`);
        sharpInstance.resize(maxWidth, maxHeight, {
          fit: 'inside',
          withoutEnlargement: true,
        });
      }

      // Convert to specified format and optimize
      if (format === 'jpeg' && outputMimeType !== 'image/jpeg') {
        processedBuffer = await sharpInstance
          .jpeg({ quality, progressive: true })
          .toBuffer();
        outputMimeType = 'image/jpeg';
        fileExtension = '.jpg';
      } else if (format === 'webp') {
        processedBuffer = await sharpInstance
          .webp({ quality })
          .toBuffer();
        outputMimeType = 'image/webp';
        fileExtension = '.webp';
      } else if (outputMimeType === 'image/jpeg') {
        // Re-compress JPEG for optimization
        processedBuffer = await sharpInstance
          .jpeg({ quality, progressive: true })
          .toBuffer();
      } else if (outputMimeType === 'image/png') {
        // Optimize PNG
        processedBuffer = await sharpInstance
          .png({ compressionLevel: 9 })
          .toBuffer();
      }

      const finalMetadata = await sharp(processedBuffer).metadata();

      return {
        buffer: processedBuffer,
        mimeType: outputMimeType,
        fileExtension,
        originalSize: imageBuffer.length,
        processedSize: processedBuffer.length,
        width: finalMetadata.width,
        height: finalMetadata.height,
        compressionRatio: ((imageBuffer.length - processedBuffer.length) / imageBuffer.length * 100).toFixed(2),
      };
    } catch (error) {
      console.error('Image processing error:', error);
      throw new Error(`Failed to process image: ${error.message}`);
    }
  }

  /**
   * Get file extension from MIME type
   * @param {string} mimeType - MIME type
   * @returns {string} File extension with dot
   */
  getFileExtension(mimeType) {
    const mimeMap = {
      'image/jpeg': '.jpg',
      'image/jpg': '.jpg',
      'image/png': '.png',
      'image/gif': '.gif',
      'image/webp': '.webp',
      'image/heic': '.heic',
      'image/heif': '.heif',
      'image/bmp': '.bmp',
      'image/tiff': '.tiff',
    };

    return mimeMap[mimeType.toLowerCase()] || '.jpg';
  }

  /**
   * Check if file is a supported image format
   * @param {string} mimeType - MIME type to check
   * @param {string} filename - Optional filename for extension-based detection
   * @returns {boolean} True if supported
   */
  isSupportedImageType(mimeType, filename = '') {
    const supportedTypes = [
      'image/jpeg',
      'image/jpg',
      'image/png',
      'image/gif',
      'image/webp',
      'image/heic',
      'image/heif',
      'image/bmp',
      'image/tiff',
      'image/avif',
      // Additional HEIC MIME types used by different devices/browsers
      'image/x-heic',
      'image/x-heif',
      // Generic types that mobile devices might use for HEIC
      'image/unknown',
      'application/unknown'
    ];

    const normalizedMimeType = mimeType.toLowerCase();
    const lowerFilename = filename.toLowerCase();
    const supportedExtensions = ['.heic', '.heif', '.jpg', '.jpeg', '.png', '.gif', '.webp', '.bmp', '.tiff', '.avif'];
    
    // Check by MIME type first
    if (supportedTypes.includes(normalizedMimeType)) {
      return true;
    }
    
    // For octet-stream or unknown types, check by file extension (common for HEIC files from mobile)
    if ((normalizedMimeType === 'application/octet-stream' || 
         normalizedMimeType === 'application/unknown' ||
         normalizedMimeType === 'image/unknown') && filename) {
      return supportedExtensions.some(ext => lowerFilename.endsWith(ext));
    }
    
    // Fallback: check if it's any image MIME type with supported extension
    if (normalizedMimeType.startsWith('image/') && filename) {
      return supportedExtensions.some(ext => lowerFilename.endsWith(ext));
    }
    
    // Final fallback: if file has a supported extension, consider it valid
    if (filename && supportedExtensions.some(ext => lowerFilename.endsWith(ext))) {
      console.log(`Accepting file by extension fallback: ${filename} with MIME: ${mimeType}`);
      return true;
    }

    return false;
  }

  /**
   * Validate image file
   * @param {Buffer} fileBuffer - File buffer
   * @param {string} mimeType - MIME type
   * @param {string} filename - Original filename
   * @returns {Promise<Object>} Validation result
   */
  async validateImage(fileBuffer, mimeType, filename) {
    try {
      if (!this.isSupportedImageType(mimeType, filename)) {
        return {
          isValid: false,
          error: `Unsupported image format: ${mimeType}. Supported formats: JPEG, PNG, GIF, WebP, HEIC, HEIF, BMP, TIFF`,
        };
      }

      // For HEIC files, we can't use Sharp directly, so we'll validate after conversion
      const normalizedMimeType = mimeType.toLowerCase();
      const lowerFilename = filename.toLowerCase();
      
      const isHeicType = normalizedMimeType.includes('heic') || 
                        normalizedMimeType.includes('heif') ||
                        lowerFilename.endsWith('.heic') ||
                        lowerFilename.endsWith('.heif') ||
                        // Handle mobile devices that send HEIC with generic MIME types
                        (lowerFilename.endsWith('.heic') && (
                          normalizedMimeType === 'application/octet-stream' ||
                          normalizedMimeType === 'image/unknown' ||
                          normalizedMimeType === 'application/unknown'
                        ));
                        
      if (isHeicType) {
        try {
          console.log(`[HEIC DEBUG] Validating HEIC file: ${filename} - Size: ${fileBuffer.length} bytes`);
          await this.convertHeicToJpeg(fileBuffer);
          console.log(`[HEIC DEBUG] HEIC validation successful for: ${filename}`);
          return { isValid: true };
        } catch (error) {
          console.error(`[HEIC DEBUG] HEIC validation failed for ${filename}:`, error.message);
          return {
            isValid: false,
            error: `Invalid HEIC/HEIF file: ${error.message}`,
          };
        }
      }

      // Validate other image types with Sharp
      const metadata = await sharp(fileBuffer).metadata();
      
      if (!metadata.width || !metadata.height) {
        return {
          isValid: false,
          error: 'Invalid image: Unable to determine image dimensions',
        };
      }

      return { isValid: true, metadata };
    } catch (error) {
      return {
        isValid: false,
        error: `Image validation failed: ${error.message}`,
      };
    }
  }
}

module.exports = new ImageProcessingService();
