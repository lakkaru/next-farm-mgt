const mongoose = require('mongoose');
const { validateDistrict, validateCultivationZone, getZoneForDistrict } = require('../constants/districts');

const farmSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Farm name is required'],
    trim: true,
    maxlength: [100, 'Farm name cannot be more than 100 characters']
  },
  location: {
    address: {
      type: String,
      required: [true, 'Address is required'],
      trim: true
    },
    coordinates: {
      latitude: {
        type: Number,
        min: -90,
        max: 90
      },
      longitude: {
        type: Number,
        min: -180,
        max: 180
      }
    },
    country: {
      type: String,
      required: true,
      trim: true,
      default: 'Sri Lanka'
    },
    zipCode: {
      type: String,
      required: false,
      trim: true
    }
  },
  // Main district and cultivation zone fields
  district: {
    type: String,
    required: [true, 'District is required'],
    trim: true,
    validate: {
      validator: function(value) {
        return validateDistrict(value);
      },
      message: 'Invalid district name. Please select a valid Sri Lankan district.'
    }
  },
  divisionalSecretariat: {
    type: String,
    required: [true, 'Divisional Secretariat is required'],
    trim: true
  },
  gramaNiladhariDivision: {
    type: String,
    required: [true, 'Grama Niladhari Division is required'],
    trim: true
  },
  cultivationZone: {
    type: String,
    required: false,
    trim: true,
    validate: {
      validator: function(value) {
        if (!value) return true; // Allow empty
        return validateCultivationZone(value);
      },
      message: 'Invalid cultivation zone.'
    }
  },
  totalArea: {
    value: {
      type: Number,
      required: [true, 'Total area value is required'],
      min: [0, 'Area cannot be negative']
    },
    unit: {
      type: String,
      required: [true, 'Area unit is required'],
      enum: ['hectares', 'acres', 'perches'],
      default: 'acres'
    }
  },
  cultivatedArea: {
    value: {
      type: Number,
      min: [0, 'Area cannot be negative']
    },
    unit: {
      type: String,
      enum: ['hectares', 'acres', 'perches'],
      default: 'acres'
    }
  },

  farmType: {
    type: String,
    enum: ['crop', 'livestock', 'mixed', 'organic', 'dairy', 'poultry'],
    required: [true, 'Farm type is required']
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  managers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  description: {
    type: String,
    maxlength: [500, 'Description cannot be more than 500 characters']
  },
  establishedDate: {
    type: Date
  },
  isActive: {
    type: Boolean,
    default: true
  },
  certifications: [{
    name: String,
    issuedBy: String,
    issuedDate: Date,
    expiryDate: Date
  }],
  contactInfo: {
    phone: String,
    email: String,
    website: String
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for crops associated with this farm
farmSchema.virtual('crops', {
  ref: 'Crop',
  localField: '_id',
  foreignField: 'farm'
});

// Note: Livestock virtual removed to prevent schema loading issues
// Use populate manually when needed: Farm.findById(id).populate('livestock')

// Index for geospatial queries
farmSchema.index({ 'location.coordinates': '2dsphere' });

// Index for efficient district and zone queries
farmSchema.index({ district: 1 });
farmSchema.index({ cultivationZone: 1 });
farmSchema.index({ district: 1, cultivationZone: 1 });

// Pre-save middleware to auto-populate cultivation zone from district
farmSchema.pre('save', function(next) {
  // Auto-populate cultivation zone from district if not provided
  if (this.district && !this.cultivationZone) {
    const zoneCode = getZoneForDistrict(this.district);
    if (zoneCode) {
      this.cultivationZone = zoneCode;
    }
  }
  
  // Handle coordinates for geospatial indexing
  if (this.location && this.location.coordinates) {
    const { latitude, longitude } = this.location.coordinates;
    if (!latitude || !longitude || isNaN(latitude) || isNaN(longitude)) {
      this.location.coordinates = undefined;
    }
  }
  
  next();
});

// Pre-update middleware to handle coordinates for updates
farmSchema.pre(['findOneAndUpdate', 'updateOne', 'updateMany'], function(next) {
  const update = this.getUpdate();
  if (update && update.location && update.location.coordinates) {
    const { latitude, longitude } = update.location.coordinates;
    if (!latitude || !longitude || isNaN(latitude) || isNaN(longitude) || 
        latitude === null || longitude === null || latitude === '' || longitude === '') {
      delete update.location.coordinates;
    }
  }
  next();
});

// Virtual to get cultivation zone details
farmSchema.virtual('cultivationZoneDetails').get(function() {
  if (this.cultivationZone) {
    const { getCultivationZoneInfo } = require('../constants/districts');
    return getCultivationZoneInfo(this.cultivationZone);
  }
  return null;
});

// Virtual to get district details
farmSchema.virtual('districtDetails').get(function() {
  if (this.district) {
    const { getDistrictByName } = require('../constants/districts');
    return getDistrictByName(this.district);
  }
  return null;
});

module.exports = mongoose.model('Farm', farmSchema);
