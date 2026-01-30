const mongoose = require('mongoose');

const serviceAreaSchema = new mongoose.Schema({
  operator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Operator is required']
  },
  district: {
    type: String,
    required: [true, 'District is required'],
    trim: true
  },
  divisionalSecretariat: {
    type: String,
    required: [true, 'Divisional Secretariat is required'],
    trim: true
  },
  gramaNiladhariDivisions: [{
    type: String,
    trim: true
  }],
  servicesOffered: [{
    type: String,
    enum: [
      'plowing',
      'harrowing',
      'planting',
      'harvesting',
      'irrigation',
      'spraying',
      'transportation',
      'other'
    ]
  }],
  machineryTypes: [{
    type: String,
    trim: true
  }],
  availability: {
    type: String,
    enum: ['full-time', 'part-time', 'seasonal', 'on-demand'],
    default: 'on-demand'
  },
  pricing: {
    type: {
      type: String,
      enum: ['per-hour', 'per-acre', 'per-day', 'fixed', 'negotiable'],
      default: 'negotiable'
    },
    amount: {
      type: Number,
      min: 0
    },
    currency: {
      type: String,
      default: 'LKR'
    }
  },
  contactPreference: {
    type: String,
    enum: ['phone', 'whatsapp', 'email', 'any'],
    default: 'any'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  notes: {
    type: String,
    maxlength: [500, 'Notes cannot be more than 500 characters']
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for efficient queries
serviceAreaSchema.index({ operator: 1 });
serviceAreaSchema.index({ district: 1 });
serviceAreaSchema.index({ divisionalSecretariat: 1 });
serviceAreaSchema.index({ district: 1, divisionalSecretariat: 1 });
serviceAreaSchema.index({ isActive: 1 });
serviceAreaSchema.index({ servicesOffered: 1 });

// Compound index for location-based service search
serviceAreaSchema.index({ 
  district: 1, 
  divisionalSecretariat: 1, 
  isActive: 1,
  servicesOffered: 1 
});

module.exports = mongoose.model('ServiceArea', serviceAreaSchema);
