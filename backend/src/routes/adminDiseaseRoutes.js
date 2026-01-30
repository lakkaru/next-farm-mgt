const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs').promises;
const sharp = require('sharp'); // For image processing
const { protect, authorize } = require('../middleware/auth');
const DiseaseReference = require('../models/DiseaseReference');

const router = express.Router();

// Configure multer for reference image uploads
const referenceStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = path.join(__dirname, '../uploads/disease-references');
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    const diseaseId = req.body.diseaseId || 'unknown';
    const timestamp = Date.now();
    const random = Math.round(Math.random() * 1E9);
    const uniqueName = `ref_${diseaseId}_${timestamp}_${random}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  }
});

const referenceUpload = multer({
  storage: referenceStorage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit for reference images
    files: 10 // Maximum 10 files at once
  },
  fileFilter: function (req, file, cb) {
    if (!file.mimetype.startsWith('image/')) {
      return cb(new Error('Only image files are allowed!'), false);
    }
    cb(null, true);
  }
});

// Enhanced image comparison algorithms
class ImageComparisonEngine {
  constructor() {
    this.comparisonWeights = {
      colorSimilarity: 0.3,
      patternMatch: 0.25,
      textureAnalysis: 0.2,
      shapeRecognition: 0.15,
      contextualFactors: 0.1
    };
  }

  // Main comparison method
  async compareWithReferences(uploadedImagePath, referenceImages) {
    const results = [];
    
    try {
      // Process uploaded image
      const uploadedFeatures = await this.extractImageFeatures(uploadedImagePath);
      
      // Compare with each reference image
      for (const refImage of referenceImages) {
        const refImagePath = path.join(__dirname, '../uploads/disease-references', refImage.filename);
        
        try {
          const refFeatures = await this.extractImageFeatures(refImagePath);
          const similarity = this.calculateSimilarity(uploadedFeatures, refFeatures, refImage);
          
          if (similarity.overallScore > 40) { // Minimum threshold
            results.push({
              referenceImage: refImage,
              similarity: similarity,
              matchingFeatures: similarity.strongMatches
            });
          }
        } catch (error) {
          console.error(`Error processing reference image ${refImage.filename}:`, error);
        }
      }
      
      // Sort by similarity score
      return results.sort((a, b) => b.similarity.overallScore - a.similarity.overallScore);
      
    } catch (error) {
      console.error('Error in image comparison:', error);
      return [];
    }
  }

  // Extract features from image using Sharp
  async extractImageFeatures(imagePath) {
    try {
      const image = sharp(imagePath);
      const metadata = await image.metadata();
      
      // Color analysis - get dominant colors
      const { dominant } = await image.stats();
      const dominantColors = this.analyzeDominantColors(dominant);
      
      // Histogram analysis for texture
      const histogramData = await this.analyzeHistogram(image);
      
      // Edge detection for pattern analysis
      const edgeData = await this.analyzeEdges(image);
      
      // Brightness and contrast analysis
      const tonalData = await this.analyzeTonalRange(image);
      
      return {
        dimensions: { width: metadata.width, height: metadata.height },
        dominantColors,
        histogram: histogramData,
        edges: edgeData,
        tonal: tonalData,
        aspectRatio: metadata.width / metadata.height
      };
    } catch (error) {
      console.error('Error extracting image features:', error);
      throw error;
    }
  }

  // Analyze dominant colors
  analyzeDominantColors(dominant) {
    return {
      red: Math.round(dominant.r),
      green: Math.round(dominant.g),
      blue: Math.round(dominant.b),
      brightness: Math.round((dominant.r + dominant.g + dominant.b) / 3),
      colorProfile: this.categorizeColor(dominant.r, dominant.g, dominant.b)
    };
  }

  // Categorize color into disease-relevant categories
  categorizeColor(r, g, b) {
    if (g > r && g > b) return 'green'; // Healthy vegetation
    if (r > g && r > b && r > 150) return 'red'; // Reddish diseases
    if (r > 100 && g > 100 && b < 80) return 'yellow'; // Yellowing diseases
    if (r > 80 && g > 60 && b < 60) return 'brown'; // Brown diseases
    if (r < 80 && g < 80 && b < 80) return 'dark'; // Dark diseases
    return 'mixed';
  }

  // Analyze histogram for texture patterns
  async analyzeHistogram(image) {
    try {
      // Convert to grayscale and get histogram-like data through stats
      const grayscale = image.grayscale();
      const stats = await grayscale.stats();
      
      return {
        mean: Math.round(stats.mean),
        stdDev: Math.round(stats.stdev),
        min: stats.min,
        max: stats.max,
        contrast: stats.max - stats.min
      };
    } catch (error) {
      console.error('Error analyzing histogram:', error);
      return null;
    }
  }

  // Analyze edges for pattern detection
  async analyzeEdges(image) {
    try {
      // Simple edge detection approximation
      const edgeBuffer = await image
        .grayscale()
        .convolve({
          width: 3,
          height: 3,
          kernel: [-1, -1, -1, -1, 8, -1, -1, -1, -1] // Edge detection kernel
        })
        .raw()
        .toBuffer();
      
      // Calculate edge intensity
      let edgeIntensity = 0;
      for (let i = 0; i < edgeBuffer.length; i++) {
        edgeIntensity += edgeBuffer[i];
      }
      edgeIntensity = edgeIntensity / edgeBuffer.length;
      
      return {
        intensity: Math.round(edgeIntensity),
        pattern: this.categorizeEdgePattern(edgeIntensity)
      };
    } catch (error) {
      console.error('Error analyzing edges:', error);
      return { intensity: 0, pattern: 'unknown' };
    }
  }

  // Categorize edge patterns
  categorizeEdgePattern(intensity) {
    if (intensity > 150) return 'high_detail'; // Detailed patterns like blast lesions
    if (intensity > 100) return 'medium_detail'; // Moderate patterns
    if (intensity > 50) return 'low_detail'; // Simple patterns
    return 'smooth'; // Healthy or uniform areas
  }

  // Analyze tonal range
  async analyzeTonalRange(image) {
    try {
      const stats = await image.grayscale().stats();
      
      return {
        brightness: Math.round(stats.mean),
        contrast: Math.round(stats.max - stats.min),
        dynamicRange: stats.max - stats.min,
        tonalCategory: this.categorizeTonalRange(stats.mean, stats.max - stats.min)
      };
    } catch (error) {
      console.error('Error analyzing tonal range:', error);
      return null;
    }
  }

  // Categorize tonal characteristics
  categorizeTonalRange(brightness, contrast) {
    if (brightness > 180 && contrast < 50) return 'overexposed';
    if (brightness < 50 && contrast < 50) return 'underexposed';
    if (contrast > 150) return 'high_contrast'; // Good for disease detection
    if (contrast > 100) return 'medium_contrast';
    return 'low_contrast';
  }

  // Calculate overall similarity between images
  calculateSimilarity(uploadedFeatures, refFeatures, refImage) {
    const scores = {
      colorSimilarity: this.calculateColorSimilarity(uploadedFeatures.dominantColors, refFeatures.dominantColors),
      patternMatch: this.calculatePatternSimilarity(uploadedFeatures.edges, refFeatures.edges),
      textureAnalysis: this.calculateTextureSimilarity(uploadedFeatures.histogram, refFeatures.histogram),
      shapeRecognition: this.calculateShapeSimilarity(uploadedFeatures.aspectRatio, refFeatures.aspectRatio),
      contextualFactors: this.calculateContextualSimilarity(uploadedFeatures, refFeatures, refImage)
    };

    // Calculate weighted overall score
    const overallScore = Object.keys(scores).reduce((total, key) => {
      return total + (scores[key] * this.comparisonWeights[key]);
    }, 0);

    // Determine strong matching features
    const strongMatches = Object.keys(scores).filter(key => scores[key] > 70);

    return {
      overallScore: Math.round(overallScore),
      detailedScores: scores,
      strongMatches,
      confidence: this.calculateConfidence(overallScore, strongMatches.length)
    };
  }

  // Individual similarity calculations
  calculateColorSimilarity(uploaded, reference) {
    const colorDiff = Math.abs(uploaded.red - reference.red) +
                      Math.abs(uploaded.green - reference.green) +
                      Math.abs(uploaded.blue - reference.blue);
    
    const maxDiff = 255 * 3;
    const similarity = (1 - (colorDiff / maxDiff)) * 100;
    
    // Bonus for matching color profiles
    if (uploaded.colorProfile === reference.colorProfile) {
      return Math.min(similarity + 20, 100);
    }
    
    return Math.max(similarity, 0);
  }

  calculatePatternSimilarity(uploadedEdges, refEdges) {
    if (!uploadedEdges || !refEdges) return 50; // Default if analysis failed
    
    const intensityDiff = Math.abs(uploadedEdges.intensity - refEdges.intensity);
    const maxIntensityDiff = 255;
    const intensitySimilarity = (1 - (intensityDiff / maxIntensityDiff)) * 100;
    
    // Bonus for matching patterns
    let patternBonus = 0;
    if (uploadedEdges.pattern === refEdges.pattern) {
      patternBonus = 30;
    }
    
    return Math.min(intensitySimilarity + patternBonus, 100);
  }

  calculateTextureSimilarity(uploadedHist, refHist) {
    if (!uploadedHist || !refHist) return 50;
    
    const meanDiff = Math.abs(uploadedHist.mean - refHist.mean);
    const contrastDiff = Math.abs(uploadedHist.contrast - refHist.contrast);
    
    const meanSimilarity = Math.max(0, 100 - (meanDiff / 255 * 100));
    const contrastSimilarity = Math.max(0, 100 - (contrastDiff / 255 * 100));
    
    return (meanSimilarity + contrastSimilarity) / 2;
  }

  calculateShapeSimilarity(uploadedRatio, refRatio) {
    const ratioDiff = Math.abs(uploadedRatio - refRatio);
    const maxDiff = 2; // Reasonable max difference for aspect ratios
    
    return Math.max(0, (1 - (ratioDiff / maxDiff)) * 100);
  }

  calculateContextualSimilarity(uploadedFeatures, refFeatures, refImage) {
    let score = 50; // Base score
    
    // Image quality factors
    if (uploadedFeatures.tonal && refFeatures.tonal) {
      if (uploadedFeatures.tonal.tonalCategory === refFeatures.tonal.tonalCategory) {
        score += 20;
      }
    }
    
    // Reference image metadata bonus
    if (refImage.severity && refImage.stage) {
      score += 10; // Well-documented reference
    }
    
    return Math.min(score, 100);
  }

  calculateConfidence(overallScore, strongMatchCount) {
    let confidence = overallScore;
    
    // Adjust confidence based on strong matches
    if (strongMatchCount >= 3) confidence += 10;
    else if (strongMatchCount >= 2) confidence += 5;
    else if (strongMatchCount === 0) confidence -= 15;
    
    return Math.min(Math.max(confidence, 20), 95);
  }
}

// Initialize comparison engine
const comparisonEngine = new ImageComparisonEngine();

// Routes

// Get all disease references (Admin only)
router.get('/references', protect, authorize('admin', 'expert'), async (req, res) => {
  try {
    const references = await DiseaseReference.find({ isActive: true })
      .sort({ diseaseName: 1, lastUpdated: -1 });
    
    res.json({
      success: true,
      data: references
    });
  } catch (error) {
    console.error('Error fetching disease references:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch disease references'
    });
  }
});

// Get references for specific disease
router.get('/references/:diseaseId', protect, async (req, res) => {
  try {
    const diseaseId = parseInt(req.params.diseaseId);
    const reference = await DiseaseReference.findOne({ 
      diseaseId: diseaseId, 
      isActive: true 
    });
    
    if (!reference) {
      return res.status(404).json({
        success: false,
        message: 'No references found for this disease'
      });
    }
    
    res.json({
      success: true,
      data: reference
    });
  } catch (error) {
    console.error('Error fetching disease reference:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch disease reference'
    });
  }
});

// Upload reference images (Admin only)
router.post('/references', protect, authorize('admin', 'expert'), 
  referenceUpload.array('images', 10), async (req, res) => {
  try {
    const { diseaseId, diseaseName, descriptions, severities, stages, affectedAreas } = req.body;
    
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No images uploaded'
      });
    }

    // Parse arrays from form data
    const descriptionsArray = JSON.parse(descriptions || '[]');
    const severitiesArray = JSON.parse(severities || '[]');
    const stagesArray = JSON.parse(stages || '[]');
    const affectedAreasArray = JSON.parse(affectedAreas || '[]');

    // Find or create disease reference document
    let diseaseRef = await DiseaseReference.findOne({ diseaseId: parseInt(diseaseId) });
    
    if (!diseaseRef) {
      diseaseRef = new DiseaseReference({
        diseaseId: parseInt(diseaseId),
        diseaseName,
        referenceImages: []
      });
    }

    // Process each uploaded image
    const newImages = [];
    for (let i = 0; i < req.files.length; i++) {
      const file = req.files[i];
      
      // Extract image features for better comparison
      const features = await comparisonEngine.extractImageFeatures(file.path);
      
      const imageData = {
        filename: file.filename,
        originalName: file.originalname,
        description: descriptionsArray[i] || `Reference image ${i + 1}`,
        severity: severitiesArray[i] || 'moderate',
        imageFeatures: {
          dominantColors: [features.dominantColors.colorProfile],
          texturePattern: features.edges?.pattern || 'unknown',
          affectedArea: affectedAreasArray[i] || 'leaf',
          stage: stagesArray[i] || 'middle'
        },
        uploadedBy: req.user.id
      };
      
      newImages.push(imageData);
      diseaseRef.referenceImages.push(imageData);
    }

    diseaseRef.lastUpdated = new Date();
    await diseaseRef.save();

    res.json({
      success: true,
      message: `Successfully uploaded ${newImages.length} reference images`,
      data: {
        diseaseId: diseaseRef.diseaseId,
        newImagesCount: newImages.length,
        totalImagesCount: diseaseRef.referenceImages.length
      }
    });

  } catch (error) {
    console.error('Error uploading reference images:', error);
    
    // Clean up uploaded files on error
    if (req.files) {
      for (const file of req.files) {
        try {
          await fs.unlink(file.path);
        } catch (unlinkError) {
          console.error('Error deleting uploaded file:', unlinkError);
        }
      }
    }

    res.status(500).json({
      success: false,
      message: 'Failed to upload reference images'
    });
  }
});

// Delete reference image (Admin only)
router.delete('/references/:diseaseId/images/:imageId', protect, authorize('admin'), async (req, res) => {
  try {
    const { diseaseId, imageId } = req.params;
    
    const diseaseRef = await DiseaseReference.findOne({ diseaseId: parseInt(diseaseId) });
    if (!diseaseRef) {
      return res.status(404).json({
        success: false,
        message: 'Disease reference not found'
      });
    }

    // Find and remove the image
    const imageIndex = diseaseRef.referenceImages.findIndex(
      img => img._id.toString() === imageId
    );
    
    if (imageIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Reference image not found'
      });
    }

    const removedImage = diseaseRef.referenceImages[imageIndex];
    diseaseRef.referenceImages.splice(imageIndex, 1);
    diseaseRef.lastUpdated = new Date();
    
    await diseaseRef.save();

    // Delete the actual file
    try {
      const imagePath = path.join(__dirname, '../uploads/disease-references', removedImage.filename);
      await fs.unlink(imagePath);
    } catch (unlinkError) {
      console.error('Error deleting image file:', unlinkError);
    }

    res.json({
      success: true,
      message: 'Reference image deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting reference image:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete reference image'
    });
  }
});

// Get reference image file
router.get('/reference-image/:filename', (req, res) => {
  try {
    const filename = req.params.filename;
    const imagePath = path.join(__dirname, '../uploads/disease-references', filename);
    
    res.sendFile(imagePath, (err) => {
      if (err) {
        res.status(404).json({
          success: false,
          message: 'Reference image not found'
        });
      }
    });
  } catch (error) {
    console.error('Error serving reference image:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to serve reference image'
    });
  }
});

// Compare uploaded image with reference images
router.post('/compare/:diseaseId', protect, async (req, res) => {
  try {
    const diseaseId = parseInt(req.params.diseaseId);
    const { imagePath } = req.body;
    
    if (!imagePath) {
      return res.status(400).json({
        success: false,
        message: 'Image path is required'
      });
    }

    // Get reference images for the disease
    const diseaseRef = await DiseaseReference.findOne({ 
      diseaseId: diseaseId, 
      isActive: true 
    });
    
    if (!diseaseRef || diseaseRef.referenceImages.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No reference images found for this disease'
      });
    }

    // Perform comparison
    const fullImagePath = path.join(__dirname, '../uploads/disease-detection', imagePath);
    const comparisonResults = await comparisonEngine.compareWithReferences(
      fullImagePath, 
      diseaseRef.referenceImages
    );

    res.json({
      success: true,
      data: {
        diseaseId,
        diseaseName: diseaseRef.diseaseName,
        referenceCount: diseaseRef.referenceImages.length,
        matches: comparisonResults,
        overallMatchScore: comparisonResults.length > 0 ? comparisonResults[0].similarity.overallScore : 0
      }
    });

  } catch (error) {
    console.error('Error comparing images:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to compare images'
    });
  }
});

// Bulk comparison with all diseases
router.post('/compare-all', protect, async (req, res) => {
  try {
    const { imagePath } = req.body;
    
    if (!imagePath) {
      return res.status(400).json({
        success: false,
        message: 'Image path is required'
      });
    }

    // Get all active disease references
    const diseaseRefs = await DiseaseReference.find({ isActive: true });
    
    const allResults = [];
    const fullImagePath = path.join(__dirname, '../uploads/disease-detection', imagePath);

    // Compare with each disease's reference images
    for (const diseaseRef of diseaseRefs) {
      if (diseaseRef.referenceImages.length > 0) {
        const comparisonResults = await comparisonEngine.compareWithReferences(
          fullImagePath, 
          diseaseRef.referenceImages
        );
        
        if (comparisonResults.length > 0) {
          allResults.push({
            diseaseId: diseaseRef.diseaseId,
            diseaseName: diseaseRef.diseaseName,
            bestMatch: comparisonResults[0],
            matchCount: comparisonResults.length
          });
        }
      }
    }

    // Sort by best match score
    allResults.sort((a, b) => b.bestMatch.similarity.overallScore - a.bestMatch.similarity.overallScore);

    res.json({
      success: true,
      data: {
        totalDiseasesChecked: diseaseRefs.length,
        matchingDiseases: allResults.length,
        results: allResults.slice(0, 5) // Return top 5 matches
      }
    });

  } catch (error) {
    console.error('Error in bulk comparison:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to perform bulk comparison'
    });
  }
});

module.exports = router;
