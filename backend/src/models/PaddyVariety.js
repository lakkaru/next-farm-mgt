const mongoose = require('mongoose');

const paddyVarietySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Paddy variety name is required'],
    trim: true,
    unique: true,
  },
  popularName: {
    type: String,
    trim: true,
  },
  yearOfRelease: {
    type: Number,
    min: 1900,
    max: new Date().getFullYear(),
  },
  parentage: {
    type: String,
    trim: true,
  },
  duration: {
    type: String, // Changed to String to accommodate ranges like "125-130 days"
    required: [true, 'Duration is required'],
  },
  type: {
    type: String,
    required: [true, 'Type is required'],
    enum: ['Short Duration', 'Medium Duration', 'Long Duration', 'Long Duration (Photoperiod sensitive)'],
  },
  culmHeight: {
    type: String, // e.g., "93 cm"
  },
  basalLeafSheathColour: {
    type: String,
    trim: true,
  },
  recommendation: {
    type: String,
    trim: true,
  },
  specialAttributes: {
    type: String,
    trim: true,
  },
  pestDiseaseReaction: {
    BPH: String, // Brown Plant Hopper
    RGM: String, // Rice Gall Midge
    BL: String,  // Blast
    BLB: String, // Bacterial Leaf Blight
  },
  characteristics: {
    averageYield: String, // e.g., "3.5 t/ha"
    resistance: [String], // Disease/pest resistance
    suitableZones: [String], // Climate zones suitable for this variety
    grainQuality: {
      brownRiceRecovery: String,
      millingRecovery: String,
      headRiceRecovery: String,
      amyloseContent: String,
      gelatinizationTemperature: String,
      '1000GrainWeight': String,
      grainShape: String,
      pericarpColour: String,
      bushelWeight: String,
    },
  },
  description: {
    type: String,
    trim: true,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
});

// Virtual for harvest date calculation
paddyVarietySchema.virtual('harvestDate').get(function() {
  if (this.plantingDate && this.duration) {
    // Extract numeric duration from string (e.g., "125-130 days" -> 127.5)
    const durationMatch = this.duration.match(/(\d+)(?:-(\d+))?/);
    if (durationMatch) {
      const minDuration = parseInt(durationMatch[1]);
      const maxDuration = durationMatch[2] ? parseInt(durationMatch[2]) : minDuration;
      const avgDuration = (minDuration + maxDuration) / 2;
      
      const harvest = new Date(this.plantingDate);
      harvest.setDate(harvest.getDate() + avgDuration);
      return harvest;
    }
  }
  return null;
});

// Virtual for numeric duration (for calculations)
paddyVarietySchema.virtual('durationDays').get(function() {
  if (this.duration) {
    const durationMatch = this.duration.match(/(\d+)(?:-(\d+))?/);
    if (durationMatch) {
      const minDuration = parseInt(durationMatch[1]);
      const maxDuration = durationMatch[2] ? parseInt(durationMatch[2]) : minDuration;
      return (minDuration + maxDuration) / 2;
    }
  }
  return null;
});

// Virtual for duration in months (rounded to nearest 0.5)
paddyVarietySchema.virtual('durationMonths').get(function() {
  const days = this.durationDays;
  if (!days) return null;
  const months = days / 30;
  // Round to nearest 0.5
  return Math.round(months * 2) / 2;
});

// Virtual for display name with popular name
paddyVarietySchema.virtual('displayName').get(function() {
  if (this.popularName) {
    return `${this.name} (${this.popularName})`;
  }
  return this.name;
});

// Index for better search performance
paddyVarietySchema.index({ name: 1, type: 1 });
paddyVarietySchema.index({ type: 1 });
paddyVarietySchema.index({ yearOfRelease: 1 });
paddyVarietySchema.index({ isActive: 1 });
paddyVarietySchema.index({ recommendation: 1 });

const PaddyVariety = mongoose.model('PaddyVariety', paddyVarietySchema);

module.exports = PaddyVariety;
