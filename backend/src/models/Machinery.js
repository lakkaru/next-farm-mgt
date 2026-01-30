const mongoose = require('mongoose');

const machinerySchema = new mongoose.Schema({
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  machineryType: {
    type: String,
    required: true,
    enum: [
      'Tractor',
      'Harvester',
      'Plough',
      'Rotavator',
      'Cultivator',
      'Seeder',
      'Sprayer',
      'Thresher',
      'Rice Transplanter',
      'Combine Harvester',
      'Water Pump',
      'Weeder',
      'Other'
    ]
  },
  brand: {
    type: String,
    required: true
  },
  model: {
    type: String
  },
  yearOfManufacture: {
    type: Number
  },
  powerRating: {
    type: String, // e.g., "50 HP", "5 HP"
  },
  availability: {
    type: String,
    enum: ['Available', 'Busy', 'Under Maintenance'],
    default: 'Available'
  },
  serviceArea: {
    districts: [{
      type: String,
      required: true
    }],
    radius: {
      type: Number, // in kilometers
      default: 50
    }
  },
  pricing: {
    type: String,
    enum: ['Per Hour', 'Per Day', 'Per Acre', 'Per Service', 'Negotiable'],
    required: true
  },
  priceAmount: {
    type: Number,
    required: true
  },
  contactInfo: {
    phone: {
      type: String,
      required: true
    },
    whatsapp: String,
    email: String
  },
  location: {
    address: String,
    district: {
      type: String,
      required: true
    },
    coordinates: {
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point'
      },
      coordinates: {
        type: [Number], // [longitude, latitude]
        default: [0, 0]
      }
    }
  },
  description: {
    type: String,
    maxlength: 1000
  },
  images: [{
    url: String,
    filename: String
  }],
  specifications: {
    type: Map,
    of: String
  },
  rating: {
    average: {
      type: Number,
      default: 0,
      min: 0,
      max: 5
    },
    count: {
      type: Number,
      default: 0
    }
  },
  totalServices: {
    type: Number,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Index for geospatial queries
machinerySchema.index({ 'location.coordinates': '2dsphere' });
machinerySchema.index({ machineryType: 1, 'serviceArea.districts': 1 });
machinerySchema.index({ owner: 1 });

const Machinery = mongoose.model('Machinery', machinerySchema);

module.exports = Machinery;
