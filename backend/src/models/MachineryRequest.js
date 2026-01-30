const mongoose = require('mongoose');

const machineryRequestSchema = new mongoose.Schema({
  farmer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  farm: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Farm',
    required: true
  },
  machinery: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Machinery'
  },
  machineryType: {
    type: String,
    required: true
  },
  serviceDate: {
    type: Date,
    required: true
  },
  duration: {
    value: Number,
    unit: {
      type: String,
      enum: ['Hours', 'Days', 'Acres']
    }
  },
  status: {
    type: String,
    enum: ['Pending', 'Accepted', 'In Progress', 'Completed', 'Cancelled', 'Rejected'],
    default: 'Pending'
  },
  description: {
    type: String,
    maxlength: 500
  },
  estimatedCost: {
    type: Number
  },
  finalCost: {
    type: Number
  },
  rating: {
    score: {
      type: Number,
      min: 1,
      max: 5
    },
    review: String,
    createdAt: Date
  },
  notes: [{
    text: String,
    by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }]
}, {
  timestamps: true
});

machineryRequestSchema.index({ farmer: 1, status: 1 });
machineryRequestSchema.index({ machinery: 1, status: 1 });
machineryRequestSchema.index({ serviceDate: 1 });

const MachineryRequest = mongoose.model('MachineryRequest', machineryRequestSchema);

module.exports = MachineryRequest;
