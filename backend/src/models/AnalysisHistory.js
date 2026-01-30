const mongoose = require('mongoose');

const analysisHistorySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  uploadedImage: {
    filename: {
      type: String,
      required: true
    },
    originalName: {
      type: String,
      required: true
    },
    size: Number,
    mimeType: String
  },
  analysisResults: {
    isHealthy: {
      type: Boolean,
      required: true
    },
    healthScore: {
      type: Number,
      min: 0,
      max: 100,
      required: true
    },
    detectedDiseases: [{
      diseaseId: Number,
      name: String,
      scientificName: String,
      confidence: {
        type: Number,
        min: 0,
        max: 100
      },
      severity: {
        type: String,
        enum: ['low', 'medium', 'high']
      },
      matchedReferences: [{
        referenceImageId: mongoose.Schema.Types.ObjectId,
        similarityScore: {
          type: Number,
          min: 0,
          max: 100
        },
        matchingFeatures: [String] // color, pattern, texture, etc.
      }]
    }],
    recommendations: [String]
  },
  analysisMetadata: {
    processingTime: Number, // in milliseconds
    modelVersion: String,
    imageQuality: Number,
    confidenceLevel: Number,
    environmentalFactors: {
      season: String,
      humidity: String,
      temperature: String,
      month: Number
    },
    comparisonMethod: {
      type: String,
      enum: ['reference_matching', 'ml_model', 'hybrid'],
      default: 'reference_matching'
    }
  },
  feedback: {
    userRating: {
      type: Number,
      min: 1,
      max: 5
    },
    isAccurate: Boolean,
    userComments: String,
    expertVerification: {
      verified: Boolean,
      verifiedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      },
      verificationNotes: String,
      verifiedAt: Date
    }
  },
  location: {
    farmId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Farm'
    },
    coordinates: {
      latitude: Number,
      longitude: Number
    },
    region: String
  },
  followUpActions: [{
    action: String,
    completed: {
      type: Boolean,
      default: false
    },
    completedAt: Date,
    notes: String
  }]
}, {
  timestamps: true
});

// Indexes for efficient querying
analysisHistorySchema.index({ userId: 1, createdAt: -1 });
analysisHistorySchema.index({ 'analysisResults.detectedDiseases.diseaseId': 1 });
analysisHistorySchema.index({ 'location.farmId': 1 });
analysisHistorySchema.index({ 'feedback.isAccurate': 1 });

module.exports = mongoose.model('AnalysisHistory', analysisHistorySchema);
