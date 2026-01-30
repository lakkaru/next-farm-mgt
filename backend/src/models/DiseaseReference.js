const mongoose = require('mongoose');

const diseaseReferenceSchema = new mongoose.Schema({
  diseaseId: {
    type: Number,
    required: true,
    ref: 'Disease'
  },
  diseaseName: {
    type: String,
    required: true
  },
  referenceImages: [{
    filename: {
      type: String,
      required: true
    },
    originalName: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    },
    severity: {
      type: String,
      enum: ['mild', 'moderate', 'severe'],
      required: true
    },
    imageFeatures: {
      dominantColors: [String], // Color analysis
      texturePattern: String,   // Texture description
      affectedArea: String,     // leaf, stem, grain, etc.
      stage: String            // early, middle, late stage
    },
    uploadedAt: {
      type: Date,
      default: Date.now
    },
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    }
  }],
  analysisWeights: {
    colorSimilarity: {
      type: Number,
      default: 0.3 // 30% weight
    },
    patternMatch: {
      type: Number,
      default: 0.25 // 25% weight
    },
    textureAnalysis: {
      type: Number,
      default: 0.2 // 20% weight
    },
    shapeRecognition: {
      type: Number,
      default: 0.15 // 15% weight
    },
    contextualFactors: {
      type: Number,
      default: 0.1 // 10% weight
    }
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  },
  isActive: {
    type: Boolean,
    default: true
  },
  adminNotes: {
    type: String
  }
}, {
  timestamps: true
});

// Index for efficient querying
diseaseReferenceSchema.index({ diseaseId: 1, isActive: 1 });
diseaseReferenceSchema.index({ diseaseName: 1 });

module.exports = mongoose.model('DiseaseReference', diseaseReferenceSchema);
