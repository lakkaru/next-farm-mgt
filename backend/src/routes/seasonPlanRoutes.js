const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const multer = require('multer');
const path = require('path');
const {
  getSeasonPlans,
  getSeasonPlan,
  createSeasonPlan,
  updateSeasonPlan,
  deleteSeasonPlan,
  updateFertilizerImplementation,
  updateStageImplementation,
  updateHarvest,
  addLCCFertilizerApplication,
  deleteFertilizerApplication,
  addDailyRemark,
  updateDailyRemark,
  deleteDailyRemark,
  removeRemarkImage,
  addExpense,
  updateExpense,
  deleteExpense,
  getExpenseSummary,
} = require('../controllers/seasonPlanController');
const { protect } = require('../middleware/auth');

// Configure multer for daily remark images (memory storage for R2 upload)
const remarkUpload = multer({
  storage: multer.memoryStorage(), // Use memory storage for R2 uploads
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit per image (increased for HEIC files)
    files: 5 // Maximum 5 images per remark
  },
  fileFilter: function (req, file, cb) {
    // Log the file details for debugging
    // console.log('File upload attempt:', {
    //   originalname: file.originalname,
    //   mimetype: file.mimetype,
    //   size: file.size,
    //   fieldname: file.fieldname
    // });

    // Supported image types including HEIC/HEIF with various MIME types
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
      // Additional HEIC MIME types that might be used by different browsers/devices
      'image/x-heic',
      'image/x-heif',
      'image/avif',
      // Some mobile browsers/devices might send HEIC as generic types
      'application/octet-stream',
      'image/unknown',
      'application/unknown'
    ];
    
    const mimeType = file.mimetype.toLowerCase();
    const fileName = file.originalname.toLowerCase();
    
    // Define image extensions for validation
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.heic', '.heif', '.bmp', '.tiff', '.avif'];
    const hasImageExtension = imageExtensions.some(ext => fileName.endsWith(ext));
    
    // Check by MIME type first
    if (supportedTypes.includes(mimeType)) {
      // console.log('✅ File accepted by MIME type:', mimeType);
      return cb(null, true);
    }
    
    // Mobile devices often send HEIC files with generic MIME types, so check by extension
    if (hasImageExtension) {
      // console.log('✅ File accepted by extension:', fileName, 'with MIME type:', mimeType);
      return cb(null, true);
    }
    
    // Fallback: if MIME type starts with 'image/' accept it
    if (mimeType.startsWith('image/')) {
      // console.log('✅ File accepted as generic image type:', mimeType);
      return cb(null, true);
    }
    
    // console.log('❌ File rejected:', {
    //   originalname: file.originalname,
    //   mimetype: file.mimetype,
    //   hasImageExtension,
    //   reason: 'Unsupported format - not recognized as image'
    // });
    
    return cb(new Error(`Unsupported image format! File: ${file.originalname}, MIME: ${file.mimetype}. Supported formats: JPEG, PNG, GIF, WebP, HEIC, HEIF, BMP, TIFF`), false);
  }
});

// Validation rules
const seasonPlanValidation = [
  body('farmId')
    .isMongoId()
    .withMessage('Valid farm ID is required'),
  body('season')
    .isIn(['maha', 'yala'])
    .withMessage('Season must be either maha or yala'),
  // climateZone will be auto-populated from farm
  body('irrigationMethod')
    .isIn(['Rain fed', 'Under irrigation'])
    .withMessage('Invalid irrigation method'),
  body('paddyVariety')
    .isMongoId()
    .withMessage('Valid paddy variety ID is required'),
  body('cultivatingArea')
    .isFloat({ min: 0.1 })
    .withMessage('Cultivating area must be at least 0.1 acres'),
  body('cultivationDate')
    .isISO8601()
    .withMessage('Valid cultivation date is required'),
];

// Serve remark images (no authentication required)
router.get('/remark-image/*', async (req, res) => {
  // Extract the full path after /remark-image/
  const filename = req.params[0]; // This captures everything after the asterisk
  // console.log('=== IMAGE SERVING DEBUG ===');
  // console.log('Serving remark image:', filename);
  // console.log('Full URL path:', req.originalUrl);
  
  // Set CORS headers for images
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  
  try {
    // First, try to find the image in the database to check if it has an R2 URL
    const SeasonPlan = require('../models/SeasonPlan');
    
    // console.log('Searching for image in database...');
    // Search for the image in all season plans
    const seasonPlan = await SeasonPlan.findOne({
      'dailyRemarks.images.filename': filename
    });
    
    // console.log('Season plan found:', !!seasonPlan);
    
    if (seasonPlan) {
      // console.log('Season plan ID:', seasonPlan._id);
      // Find the specific image in the remarks
      let targetImage = null;
      for (const remark of seasonPlan.dailyRemarks) {
        const image = remark.images.find(img => img.filename === filename);
        if (image) {
          targetImage = image;
          // console.log('Found target image:', {
          //   filename: image.filename,
          //   hasUrl: !!image.url,
          //   url: image.url
          // });
          break;
        }
      }
      
      // If image has R2 URL, stream it using R2 service (since R2 bucket is private)
      if (targetImage && targetImage.url) {
        // console.log('Streaming R2 image using R2 service for:', targetImage.filename);
        
        try {
          const r2Service = require('../services/r2Service');
          
          // Use the filename as the R2 key since that's what's stored
          const r2Key = targetImage.filename;
          // console.log('R2 key:', r2Key);
          
          // Get file stream from R2
          const fileData = await r2Service.getFileStream(r2Key);
          
          // Set appropriate headers
          res.set({
            'Content-Type': fileData.contentType || 'image/jpeg',
            'Content-Length': fileData.contentLength,
            'Cache-Control': 'public, max-age=31536000', // Cache for 1 year
            'ETag': fileData.etag,
            'Last-Modified': fileData.lastModified
          });
          
          // Stream the image
          fileData.stream.pipe(res);
          // console.log('✅ Successfully streamed R2 image via R2 service');
          return;
          
        } catch (error) {
          console.error('❌ Error streaming R2 image:', error.message);
          // Continue to local filesystem fallback
        }
      } else {
        // console.log('Target image found but no R2 URL available');
      }
    } else {
      // console.log('No season plan found with this image filename');
    }
    
    // Function to check local filesystem as fallback
    function checkLocalFilesystem() {
      const fs = require('fs');
      const imagePath = path.join(__dirname, '../../uploads/remarks', filename);
      // console.log('Trying local filesystem:', imagePath);
      
      if (fs.existsSync(imagePath)) {
        // console.log('Serving legacy image from filesystem');
        return res.sendFile(imagePath);
      }
      
      // Image not found anywhere
      // console.log('Image not found anywhere - filename:', filename);
      // console.log('===========================');
      return res.status(404).json({ 
        error: 'Image not found',
        message: `Image "${filename}" is no longer available`
      });
    }
    
    // If we reach here, no R2 URL was found, try local filesystem
    checkLocalFilesystem();
    
  } catch (error) {
    console.error('Error serving remark image:', error);
    console.log('===========================');
    return res.status(500).json({ 
      error: 'Server error',
      message: 'Failed to serve image'
    });
  }
});

// Apply protect middleware to all other routes
router.use(protect);

// Routes
router
  .route('/')
  .get(getSeasonPlans)
  .post(seasonPlanValidation, createSeasonPlan);

router
  .route('/:id')
  .get(getSeasonPlan)
  .put(seasonPlanValidation, updateSeasonPlan)
  .delete(deleteSeasonPlan);

// Implementation tracking routes
router
  .route('/:id/fertilizer/:applicationIndex')
  .put(updateFertilizerImplementation);

router
  .route('/:id/stage/:stageIndex')
  .put(updateStageImplementation);

// Harvest tracking route
router
  .route('/:id/harvest')
  .put(updateHarvest);

// LCC-based fertilizer application route
router
  .route('/:id/lcc-fertilizer')
  .post([
    body('plantAge').isInt({ min: 2, max: 8 }).withMessage('Plant age must be between 2-8 weeks'),
    body('leafColorIndex').isInt({ min: 2, max: 4 }).withMessage('Leaf color index must be between 2-4'),
    body('recommendedUrea').isFloat({ min: 0 }).withMessage('Recommended urea must be a positive number'),
  ], addLCCFertilizerApplication);

// Delete fertilizer application route
router
  .route('/:id/fertilizer/:applicationIndex')
  .delete(deleteFertilizerApplication);

// Middleware to handle multer errors specifically for daily remarks
const handleRemarkUploadErrors = (error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    console.error('Multer error:', error);
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        message: 'Image file is too large. Maximum size is 10MB per image.',
        error: 'FILE_TOO_LARGE'
      });
    }
    if (error.code === 'LIMIT_FILE_COUNT') {
      return res.status(400).json({
        success: false,
        message: 'Too many files. Maximum 5 images allowed per remark.',
        error: 'TOO_MANY_FILES'
      });
    }
    return res.status(400).json({
      success: false,
      message: `Upload error: ${error.message}`,
      error: error.code
    });
  }
  
  if (error.message && error.message.includes('Unsupported image format')) {
    return res.status(400).json({
      success: false,
      message: 'Unsupported image format. Please use JPEG, PNG, GIF, WebP, HEIC, or HEIF images.',
      error: 'UNSUPPORTED_FORMAT'
    });
  }
  
  next(error);
};

// Middleware to log daily remarks requests
const logDailyRemarksRequest = (req, res, next) => {
  // console.log('\n=== DAILY REMARKS REQUEST DEBUG ===');
  // console.log('Method:', req.method);
  // console.log('URL:', req.originalUrl);
  // console.log('Headers:', {
  //   'content-type': req.headers['content-type'],
  //   'content-length': req.headers['content-length'],
  //   'user-agent': req.headers['user-agent']
  // });
  // console.log('Body fields:', Object.keys(req.body || {}));
  // console.log('Files:', req.files ? req.files.length : 'no files yet');
  // console.log('Params:', req.params);
  // console.log('=====================================\n');
  next();
};

// Daily remarks routes
router
  .route('/:id/daily-remarks')
  .post(logDailyRemarksRequest, remarkUpload.array('images', 5), handleRemarkUploadErrors, [
    body('date').isISO8601().withMessage('Valid date is required'),
    body('category').optional().isIn([
      'general', 'weather', 'field_preparation', 'pest', 'disease', 'fertilizer', 'irrigation', 'growth',
      'plowing', 'seeds_preparation', 'seeding_sowing', 'transplanting', 'harvesting', 'other'
    ]).withMessage('Invalid category'),
    body('title').optional().isLength({ min: 1, max: 100 }).withMessage('Title must be between 1-100 characters'),
    body('description').isLength({ min: 1, max: 1000 }).withMessage('Description must be between 1-1000 characters'),
  ], addDailyRemark);

router
  .route('/:id/daily-remarks/:remarkId')
  .put(logDailyRemarksRequest, remarkUpload.array('images', 5), handleRemarkUploadErrors, [
    body('date').optional().isISO8601().withMessage('Valid date is required'),
    body('category').optional().isIn([
      'general', 'weather', 'field_preparation', 'pest', 'disease', 'fertilizer', 'irrigation', 'growth',
      'plowing', 'seeds_preparation', 'seeding_sowing', 'transplanting', 'harvesting', 'other'
    ]).withMessage('Invalid category'),
    body('title').optional().isLength({ min: 1, max: 100 }).withMessage('Title must be between 1-100 characters'),
    body('description').optional().isLength({ min: 1, max: 1000 }).withMessage('Description must be between 1-1000 characters'),
  ], updateDailyRemark)
  .delete(deleteDailyRemark);

// Route to remove specific image from daily remark
router.delete('/:id/daily-remarks/:remarkId/remove-image', removeRemarkImage);

// Expense management routes
router
  .route('/:id/expenses')
  .post([
    body('date').isISO8601().withMessage('Valid date is required'),
    body('category').isIn([
      'seeds', 'fertilizer', 'pesticide', 'herbicide', 'fungicide',
      'labor', 'machinery', 'fuel', 'irrigation', 'transportation',
      'equipment', 'land_preparation', 'harvesting', 'storage',
      'certification', 'insurance', 'utilities', 'other'
    ]).withMessage('Invalid expense category'),
    body('description').isLength({ min: 1, max: 200 }).withMessage('Description must be between 1-200 characters'),
    body('amount').isFloat({ min: 0 }).withMessage('Amount must be a positive number'),
    body('quantity').optional().isFloat({ min: 0 }).withMessage('Quantity must be a positive number'),
    body('unitPrice').optional().isFloat({ min: 0 }).withMessage('Unit price must be a positive number'),
    body('subcategory').optional().isLength({ max: 50 }).withMessage('Subcategory must be 50 characters or less'),
    body('vendor').optional().isLength({ max: 100 }).withMessage('Vendor must be 100 characters or less'),
    body('receiptNumber').optional().isLength({ max: 50 }).withMessage('Receipt number must be 50 characters or less'),
    body('paymentMethod').optional().isIn(['cash', 'bank_transfer', 'check', 'card', 'credit', 'other']).withMessage('Invalid payment method'),
    body('remarks').optional().isLength({ max: 500 }).withMessage('Remarks must be 500 characters or less'),
  ], addExpense);

router
  .route('/:id/expenses/summary')
  .get(getExpenseSummary);

router
  .route('/:id/expenses/:expenseId')
  .put([
    body('date').optional().isISO8601().withMessage('Valid date is required'),
    body('category').optional().isIn([
      'seeds', 'fertilizer', 'pesticide', 'herbicide', 'fungicide',
      'labor', 'machinery', 'fuel', 'irrigation', 'transportation',
      'equipment', 'land_preparation', 'harvesting', 'storage',
      'certification', 'insurance', 'utilities', 'other'
    ]).withMessage('Invalid expense category'),
    body('description').optional().isLength({ min: 1, max: 200 }).withMessage('Description must be between 1-200 characters'),
    body('amount').optional().isFloat({ min: 0 }).withMessage('Amount must be a positive number'),
    body('quantity').optional().isFloat({ min: 0 }).withMessage('Quantity must be a positive number'),
    body('unitPrice').optional().isFloat({ min: 0 }).withMessage('Unit price must be a positive number'),
    body('subcategory').optional().isLength({ max: 50 }).withMessage('Subcategory must be 50 characters or less'),
    body('vendor').optional().isLength({ max: 100 }).withMessage('Vendor must be 100 characters or less'),
    body('receiptNumber').optional().isLength({ max: 50 }).withMessage('Receipt number must be 50 characters or less'),
    body('paymentMethod').optional().isIn(['cash', 'bank_transfer', 'check', 'card', 'credit', 'other']).withMessage('Invalid payment method'),
    body('remarks').optional().isLength({ max: 500 }).withMessage('Remarks must be 500 characters or less'),
  ], updateExpense)
  .delete(deleteExpense);

module.exports = router;
