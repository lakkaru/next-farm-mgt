const mongoose = require('mongoose');

const livestockSchema = new mongoose.Schema({
  type: {
    type: String,
    required: [true, 'Livestock type is required'],
    enum: ['cattle', 'sheep', 'goats', 'pigs', 'chickens', 'ducks', 'turkeys', 'horses', 'other']
  },
  breed: {
    type: String,
    required: [true, 'Breed is required'],
    trim: true
  },
  farm: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Farm',
    required: true
  },
  identification: {
    tagNumber: {
      type: String,
      required: [true, 'Tag number is required'],
      unique: true,
      trim: true
    },
    name: {
      type: String,
      trim: true
    },
    microchipId: String,
    tattoo: String
  },
  basicInfo: {
    gender: {
      type: String,
      enum: ['male', 'female'],
      required: [true, 'Gender is required']
    },
    dateOfBirth: Date,
    weight: {
      current: Number,
      unit: {
        type: String,
        enum: ['kg', 'lbs'],
        default: 'kg'
      }
    },
    color: String,
    markings: String
  },
  parentage: {
    sire: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Livestock'
    },
    dam: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Livestock'
    }
  },
  location: {
    pasture: String,
    barn: String,
    pen: String
  },
  healthRecords: [{
    date: {
      type: Date,
      required: true
    },
    type: {
      type: String,
      enum: ['vaccination', 'treatment', 'checkup', 'injury', 'illness'],
      required: true
    },
    description: String,
    veterinarian: String,
    medication: {
      name: String,
      dosage: String,
      duration: String
    },
    cost: Number,
    nextDueDate: Date,
    notes: String
  }],
  reproduction: {
    breedingHistory: [{
      date: Date,
      matedWith: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Livestock'
      },
      successful: Boolean,
      notes: String
    }],
    pregnancies: [{
      matingDate: Date,
      expectedDueDate: Date,
      actualDueDate: Date,
      numberOfOffspring: Number,
      complications: String,
      offspring: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Livestock'
      }]
    }]
  },
  production: {
    milk: [{
      date: Date,
      quantity: Number,
      unit: {
        type: String,
        enum: ['liters', 'gallons'],
        default: 'liters'
      },
      quality: {
        fatContent: Number,
        proteinContent: Number,
        somaticCellCount: Number
      }
    }],
    eggs: [{
      date: Date,
      quantity: Number,
      weight: Number
    }],
    wool: [{
      date: Date,
      weight: Number,
      quality: String
    }]
  },
  feeding: [{
    date: Date,
    feedType: String,
    quantity: {
      value: Number,
      unit: String
    },
    cost: Number,
    notes: String
  }],
  weightHistory: [{
    date: Date,
    weight: Number,
    unit: {
      type: String,
      enum: ['kg', 'lbs'],
      default: 'kg'
    },
    measuredBy: String
  }],
  status: {
    type: String,
    enum: ['active', 'sold', 'deceased', 'quarantine'],
    default: 'active'
  },
  purchaseInfo: {
    purchaseDate: Date,
    purchasePrice: Number,
    seller: String,
    notes: String
  },
  saleInfo: {
    saleDate: Date,
    salePrice: Number,
    buyer: String,
    reason: String,
    notes: String
  },
  images: [String],
  notes: String
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for current age
livestockSchema.virtual('age').get(function() {
  if (!this.basicInfo.dateOfBirth) return null;
  const today = new Date();
  const birthDate = new Date(this.basicInfo.dateOfBirth);
  const diffTime = today - birthDate;
  const ageInDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  return {
    days: ageInDays,
    months: Math.floor(ageInDays / 30.44),
    years: Math.floor(ageInDays / 365.25)
  };
});

// Virtual for total milk production (current month)
livestockSchema.virtual('monthlyMilkProduction').get(function() {
  const today = new Date();
  const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  
  return this.production.milk
    .filter(record => new Date(record.date) >= firstDayOfMonth)
    .reduce((total, record) => total + (record.quantity || 0), 0);
});

// Indexes
livestockSchema.index({ farm: 1, type: 1 });
livestockSchema.index({ 'identification.tagNumber': 1 });
livestockSchema.index({ status: 1 });

module.exports = mongoose.model('Livestock', livestockSchema);
