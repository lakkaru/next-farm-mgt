const mongoose = require('mongoose');

const cropSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Crop name is required'],
    trim: true
  },
  variety: {
    type: String,
    required: [true, 'Crop variety is required'],
    trim: true
  },
  category: {
    type: String,
    enum: ['grains', 'vegetables', 'fruits', 'legumes', 'herbs', 'flowers', 'other'],
    required: [true, 'Crop category is required']
  },
  farm: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Farm',
    required: true
  },
  field: {
    name: {
      type: String,
      required: [true, 'Field name is required'],
      trim: true
    },
    area: {
      value: {
        type: Number,
        required: [true, 'Field area is required'],
        min: [0, 'Area cannot be negative']
      },
      unit: {
        type: String,
        enum: ['acres', 'hectares', 'square_feet', 'square_meters'],
        default: 'acres'
      }
    },
    soilType: {
      type: String,
      enum: ['clay', 'sandy', 'loamy', 'silty', 'peaty', 'chalky']
    }
  },
  plantingDate: {
    type: Date,
    required: [true, 'Planting date is required']
  },
  expectedHarvestDate: {
    type: Date,
    required: [true, 'Expected harvest date is required']
  },
  actualHarvestDate: {
    type: Date
  },
  quantity: {
    planted: {
      value: Number,
      unit: String // seeds, plants, etc.
    },
    harvested: {
      value: Number,
      unit: String // kg, tons, bushels, etc.
    }
  },
  status: {
    type: String,
    enum: ['planned', 'planted', 'growing', 'harvested', 'failed'],
    default: 'planned'
  },
  growthStages: [{
    stage: {
      type: String,
      enum: ['germination', 'seedling', 'vegetative', 'flowering', 'fruiting', 'maturity']
    },
    date: Date,
    notes: String,
    images: [String]
  }],
  irrigation: {
    method: {
      type: String,
      enum: ['drip', 'sprinkler', 'flood', 'furrow', 'manual']
    },
    schedule: [{
      date: Date,
      duration: Number, // in minutes
      amount: Number // in liters or gallons
    }]
  },
  fertilization: [{
    type: {
      type: String,
      enum: ['organic', 'inorganic', 'compost', 'manure']
    },
    name: String,
    applicationDate: Date,
    quantity: {
      value: Number,
      unit: String
    },
    notes: String
  }],
  pestControl: [{
    type: {
      type: String,
      enum: ['pesticide', 'herbicide', 'fungicide', 'organic', 'biological']
    },
    name: String,
    applicationDate: Date,
    quantity: {
      value: Number,
      unit: String
    },
    targetPest: String,
    notes: String
  }],
  weather: [{
    date: Date,
    temperature: {
      min: Number,
      max: Number
    },
    rainfall: Number,
    humidity: Number,
    notes: String
  }],
  costs: {
    seeds: Number,
    fertilizers: Number,
    pesticides: Number,
    irrigation: Number,
    labor: Number,
    equipment: Number,
    other: Number
  },
  revenue: {
    totalSales: Number,
    pricePerUnit: Number,
    buyer: String
  },
  notes: String,
  images: [String]
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for profit calculation
cropSchema.virtual('profit').get(function() {
  const totalCosts = Object.values(this.costs || {}).reduce((sum, cost) => sum + (cost || 0), 0);
  const revenue = this.revenue?.totalSales || 0;
  return revenue - totalCosts;
});

// Virtual for days to harvest
cropSchema.virtual('daysToHarvest').get(function() {
  if (this.status === 'harvested' || !this.expectedHarvestDate) return 0;
  const today = new Date();
  const harvestDate = new Date(this.expectedHarvestDate);
  const diffTime = harvestDate - today;
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
});

// Index for efficient queries
cropSchema.index({ farm: 1, status: 1 });
cropSchema.index({ plantingDate: 1 });
cropSchema.index({ expectedHarvestDate: 1 });

module.exports = mongoose.model('Crop', cropSchema);
