const mongoose = require('mongoose');

const seasonPlanSchema = new mongoose.Schema({
  farmId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Farm',
    required: [true, 'Farm ID is required'],
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required'],
  },
  season: {
    type: String,
    required: [true, 'Season is required'],
    enum: ['maha', 'yala'],
  },
  // climateZone will be derived from the farm on create; not required on updates
  climateZone: {
    type: String,
  },
  irrigationMethod: {
    type: String,
    required: [true, 'Irrigation method is required'],
    enum: ['Rain fed', 'Under irrigation'],
  },
  plantingMethod: {
    type: String,
    // Added 'parachute_seeding' as a valid planting method (treated similarly to direct seeding
    // for fertilizer recommendation anchoring). Keep existing default.
    enum: ['direct_seeding', 'transplanting', 'parachute_seeding'],
    default: 'direct_seeding'
  },
  paddyVariety: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'PaddyVariety',
    required: [true, 'Paddy variety is required'],
  },
  cultivatingArea: {
    type: Number,
    required: [true, 'Cultivating area is required'],
    min: [0.01, 'Cultivating area must be at least 0.01'],
  },
  areaUnit: {
    type: String,
    enum: ['acres', 'hectares', 'sq meters', 'sq feet'],
    default: 'acres',
    required: true
  },
  cultivationDate: {
    type: Date,
    required: [true, 'Cultivation date is required'],
  },
  transplantingDate: {
    type: Date,
  },
  soilP: {
    type: Number,
    min: [0, 'Soil P value must be positive'],
    max: [100, 'Soil P value seems too high']
  },
  growingStages: [{
    stage: String,
    startDate: Date,
    endDate: Date,
    description: String,
    completed: {
      type: Boolean,
      default: false,
    },
    actualStartDate: Date,
    actualEndDate: Date,
    implementedDate: Date, // Single date for when the stage was actually implemented
    notes: String,
  }],
  fertilizerSchedule: [{
    stage: String,
    date: Date,
    fertilizers: {
      // Legacy simple structure (still supported for backward compatibility)
      urea: Number,
      tsp: Number,
      mop: Number,
      zincSulphate: Number,
      // New detailed structure with per-ha and per-field amounts
      recommendedPerHa: {
        urea: { type: Number, default: 0 },
        tsp: { type: Number, default: 0 },
        mop: { type: Number, default: 0 },
        zincSulphate: { type: Number, default: 0 }
      },
      perFieldKg: {
        urea: { type: Number, default: 0 },
        tsp: { type: Number, default: 0 },
        mop: { type: Number, default: 0 },
        zincSulphate: { type: Number, default: 0 }
      }
    },
    description: String,
    applied: {
      type: Boolean,
      default: false,
    },
    applicationDate: Date, // Planned date
    implementedDate: Date, // Actual date when applied
    notes: String,
    // Additional fields for tracking
    recommendations: {
      zone: String,
      condition: String,
      ageGroup: String,
      totalRecommended: {
        urea: Number,
        tsp: Number,
        mop: Number,
        zinc: Number
      }
    },
    // LCC-based fertilizer application data
    lccData: {
      plantAge: Number,
      leafColorIndex: Number,
      recommendedPerAcre: Number,
      totalArea: Number
    },
    isLCCBased: {
      type: Boolean,
      default: false
    },
    // Actual fertilizers used (for implementation tracking)
    actualFertilizers: {
      urea: Number,
      tsp: Number,
      mop: Number,
      zincSulphate: Number
    }
  }],
  status: {
    type: String,
    enum: ['planned', 'active', 'completed', 'cancelled'],
    default: 'planned',
  },
  expectedHarvest: {
    date: Date,
    estimatedYield: Number,
  },
  // Note: seed recommendation and tray counts are computed on the client for display
  // and are intentionally NOT persisted on the SeasonPlan document.
  actualHarvest: {
    date: Date,
    actualYield: Number,
    quality: String,
    notes: String,
  },
  dailyRemarks: [{
    date: {
      type: Date,
      required: true,
    },
    category: {
      type: String,
      enum: [
        'general', 'weather', 'pest', 'disease', 'fertilizer', 'irrigation', 'growth', 'field_preparation',
        'plowing', 'seeds_preparation', 'seeding_sowing', 'transplanting', 'harvesting', 'other'
      ],
      default: 'general',
    },
    title: {
      type: String,
      required: true,
      maxlength: 100,
    },
    description: {
      type: String,
      required: true,
      maxlength: 2000,
    },
    images: [{
      filename: String,
      originalName: String,
      mimetype: String,
      size: Number,
      url: String, // R2 public URL for new images
      uploadDate: {
        type: Date,
        default: Date.now,
      },
      // Processing metadata for R2 uploaded images
      processed: {
        originalSize: Number,
        compressionRatio: Number,
        dimensions: String
      }
    }],
    createdAt: {
      type: Date,
      default: Date.now,
    },
  }],
  expenses: [{
    date: {
      type: Date,
      required: true,
    },
    category: {
      type: String,
      required: true,
      enum: [
        'seeds', 'fertilizer', 'pesticide', 'herbicide', 'fungicide',
        'labor', 'machinery', 'fuel', 'irrigation', 'transportation',
        'equipment', 'land_preparation', 'harvesting', 'storage',
        'certification', 'insurance', 'utilities', 'other'
      ],
    },
    subcategory: {
      type: String,
      maxlength: 50,
    },
    description: {
      type: String,
      required: true,
      maxlength: 200,
    },
    amount: {
      type: Number,
      required: true,
      min: [0, 'Amount must be positive'],
    },
    quantity: {
      type: Number,
      min: [0, 'Quantity must be positive'],
    },
    unit: {
      type: String,
      enum: ['kg', 'g', 'L', 'ml', 'units', 'hours', 'days', 'acres', 'meters', 'other'],
    },
    unitPrice: {
      type: Number,
      min: [0, 'Unit price must be positive'],
    },
    vendor: {
      type: String,
      maxlength: 100,
    },
    receiptNumber: {
      type: String,
      maxlength: 50,
    },
    paymentMethod: {
      type: String,
      enum: ['cash', 'bank_transfer', 'check', 'card', 'credit', 'other'],
      default: 'cash',
    },
    remarks: {
      type: String,
      maxlength: 500,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  }],
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
});

// Virtual for calculating plan duration
seasonPlanSchema.virtual('planDuration').get(function() {
  if (this.expectedHarvest?.date && this.cultivationDate) {
    const diffTime = Math.abs(this.expectedHarvest.date - this.cultivationDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  }
  return null;
});

// Virtual for calculating total expenses
seasonPlanSchema.virtual('totalExpenses').get(function() {
  if (!this.expenses || this.expenses.length === 0) return 0;
  return this.expenses.reduce((total, expense) => total + expense.amount, 0);
});

// Virtual for calculating expenses by category
seasonPlanSchema.virtual('expensesByCategory').get(function() {
  if (!this.expenses || this.expenses.length === 0) return {};
  
  const categoryTotals = {};
  this.expenses.forEach(expense => {
    if (!categoryTotals[expense.category]) {
      categoryTotals[expense.category] = 0;
    }
    categoryTotals[expense.category] += expense.amount;
  });
  
  return categoryTotals;
});

// Virtual for calculating cost per acre
seasonPlanSchema.virtual('costPerAcre').get(function() {
  const total = this.totalExpenses;
  if (total === 0 || !this.cultivatingArea) return 0;
  
  // Convert area to acres for consistent calculation
  const conversionFactors = {
    'acres': 1,
    'hectares': 2.47105,
    'sq meters': 0.000247105,
    'sq feet': 0.0000229568
  };
  
  const areaUnit = this.areaUnit || 'acres';
  const factor = conversionFactors[areaUnit] || 1;
  const areaInAcres = this.cultivatingArea * factor;
  
  return total / areaInAcres;
});

// Virtual for getting farm district
seasonPlanSchema.virtual('district').get(function() {
  return this.farmId?.district;
});

// Indexes for better query performance
seasonPlanSchema.index({ farmId: 1, userId: 1 });
seasonPlanSchema.index({ season: 1, cultivationDate: 1 });
seasonPlanSchema.index({ status: 1 });
seasonPlanSchema.index({ 'expenses.date': 1 });
seasonPlanSchema.index({ 'expenses.category': 1 });

const SeasonPlan = mongoose.model('SeasonPlan', seasonPlanSchema);

module.exports = SeasonPlan;
