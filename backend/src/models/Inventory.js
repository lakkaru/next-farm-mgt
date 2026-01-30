const mongoose = require('mongoose');

const inventorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Item name is required'],
    trim: true
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: [
      'seeds', 'fertilizers', 'pesticides', 'tools', 'equipment', 
      'feed', 'medicine', 'supplies', 'fuel', 'other'
    ]
  },
  farm: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Farm',
    required: true
  },
  description: {
    type: String,
    maxlength: [500, 'Description cannot be more than 500 characters']
  },
  sku: {
    type: String,
    unique: true,
    trim: true
  },
  quantity: {
    current: {
      type: Number,
      required: [true, 'Current quantity is required'],
      min: [0, 'Quantity cannot be negative']
    },
    unit: {
      type: String,
      required: [true, 'Unit is required'],
      enum: ['kg', 'lbs', 'tons', 'liters', 'gallons', 'pieces', 'boxes', 'bags']
    },
    reorderPoint: {
      type: Number,
      default: 0
    },
    maxStock: Number
  },
  pricing: {
    costPerUnit: {
      type: Number,
      required: [true, 'Cost per unit is required'],
      min: [0, 'Cost cannot be negative']
    },
    currency: {
      type: String,
      default: 'USD'
    },
    supplier: {
      name: String,
      contact: {
        phone: String,
        email: String,
        address: String
      }
    }
  },
  storage: {
    location: {
      type: String,
      required: [true, 'Storage location is required']
    },
    conditions: {
      temperature: {
        min: Number,
        max: Number,
        unit: {
          type: String,
          enum: ['celsius', 'fahrenheit'],
          default: 'celsius'
        }
      },
      humidity: {
        min: Number,
        max: Number
      },
      specialRequirements: String
    }
  },
  dates: {
    purchaseDate: Date,
    expiryDate: Date,
    lastUpdated: {
      type: Date,
      default: Date.now
    }
  },
  transactions: [{
    type: {
      type: String,
      enum: ['purchase', 'usage', 'sale', 'adjustment', 'waste'],
      required: true
    },
    quantity: {
      type: Number,
      required: true
    },
    unitPrice: Number,
    totalCost: Number,
    date: {
      type: Date,
      default: Date.now
    },
    reference: {
      type: String, // Could be crop ID, livestock ID, etc.
      refModel: {
        type: String,
        enum: ['Crop', 'Livestock', 'Equipment']
      }
    },
    notes: String,
    performedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  }],
  status: {
    type: String,
    enum: ['active', 'low_stock', 'out_of_stock', 'expired', 'discontinued'],
    default: 'active'
  },
  alerts: {
    lowStock: {
      type: Boolean,
      default: true
    },
    expiry: {
      type: Boolean,
      default: true
    },
    expiryDays: {
      type: Number,
      default: 30 // Alert 30 days before expiry
    }
  },
  images: [String],
  tags: [String],
  notes: String
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for total value
inventorySchema.virtual('totalValue').get(function() {
  return this.quantity.current * this.pricing.costPerUnit;
});

// Virtual for days until expiry
inventorySchema.virtual('daysUntilExpiry').get(function() {
  if (!this.dates.expiryDate) return null;
  const today = new Date();
  const expiryDate = new Date(this.dates.expiryDate);
  const diffTime = expiryDate - today;
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
});

// Virtual for stock status
inventorySchema.virtual('stockStatus').get(function() {
  if (this.quantity.current <= 0) return 'out_of_stock';
  if (this.quantity.current <= this.quantity.reorderPoint) return 'low_stock';
  return 'in_stock';
});

// Pre-save middleware to update status based on quantity and expiry
inventorySchema.pre('save', function(next) {
  // Update status based on quantity
  if (this.quantity.current <= 0) {
    this.status = 'out_of_stock';
  } else if (this.quantity.current <= this.quantity.reorderPoint) {
    this.status = 'low_stock';
  } else if (this.dates.expiryDate && new Date(this.dates.expiryDate) < new Date()) {
    this.status = 'expired';
  } else {
    this.status = 'active';
  }
  
  this.dates.lastUpdated = new Date();
  next();
});

// Method to add transaction and update quantity
inventorySchema.methods.addTransaction = function(transactionData) {
  this.transactions.push(transactionData);
  
  // Update current quantity based on transaction type
  if (transactionData.type === 'purchase' || transactionData.type === 'adjustment') {
    this.quantity.current += transactionData.quantity;
  } else if (transactionData.type === 'usage' || transactionData.type === 'sale' || transactionData.type === 'waste') {
    this.quantity.current -= transactionData.quantity;
  }
  
  // Ensure quantity doesn't go below 0
  this.quantity.current = Math.max(0, this.quantity.current);
  
  return this.save();
};

// Indexes
inventorySchema.index({ farm: 1, category: 1 });
inventorySchema.index({ sku: 1 });
inventorySchema.index({ status: 1 });
inventorySchema.index({ 'dates.expiryDate': 1 });

module.exports = mongoose.model('Inventory', inventorySchema);
