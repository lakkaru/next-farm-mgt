const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  profile: {
    firstName: {
      type: String,
      required: [true, 'First name is required'],
      trim: true,
      maxlength: [50, 'First name cannot be more than 50 characters']
    },
    lastName: {
      type: String,
      required: [true, 'Last name is required'],
      trim: true,
      maxlength: [50, 'Last name cannot be more than 50 characters']
    },
    avatar: {
      type: String,
      default: ''
    },
    bio: {
      type: String,
      maxlength: [500, 'Bio cannot be more than 500 characters'],
      trim: true
    },
    dateOfBirth: Date,
    gender: {
      type: String,
      enum: ['male', 'female', 'other', 'prefer_not_to_say']
    }
  },
  email: {
    type: String,
    required: false,
    unique: true,
    sparse: true, // This allows multiple null values while maintaining uniqueness for non-null values
    lowercase: true,
    trim: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters'],
    select: false
  },
  role: {
    type: String,
    enum: ['admin', 'expert', 'farm_owner', 'farm_manager', 'worker', 'viewer', 'machinery_operator'],
    default: 'farm_owner'
  },
  roles: [{
    type: String,
    enum: ['admin', 'expert', 'farm_owner', 'farm_manager', 'worker', 'viewer', 'machinery_operator']
  }],
  permissions: [{
    farm: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Farm'
    },
    role: {
      type: String,
      enum: ['owner', 'manager', 'worker', 'viewer']
    },
    permissions: [{
      type: String,
      enum: [
        'create_crops', 'edit_crops', 'delete_crops', 'view_crops',
        'create_livestock', 'edit_livestock', 'delete_livestock', 'view_livestock',
        'create_inventory', 'edit_inventory', 'delete_inventory', 'view_inventory',
        'manage_workers', 'view_reports', 'manage_farm_settings'
      ]
    }]
  }],
  contact: {
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      unique: true,
      trim: true,
      match: [/^07[0-9]{8}$/, 'Please enter a valid Sri Lankan phone number (e.g., 0715316597)']
    },
    address: {
      street: String,
      city: String,
      state: String,
      country: String,
      zipCode: String
    }
  },
  preferences: {
    language: {
      type: String,
      default: 'en',
      enum: ['en', 'si', 'es', 'fr', 'de', 'zh']
    },
    timezone: {
      type: String,
      default: 'UTC'
    },
    notifications: {
      email: {
        type: Boolean,
        default: true
      },
      sms: {
        type: Boolean,
        default: false
      },
      push: {
        type: Boolean,
        default: true
      }
    }
  },
  isEmailVerified: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: true
  },
  lastLogin: Date,
  loginAttempts: {
    type: Number,
    default: 0
  },
  lockUntil: Date,
  resetPasswordToken: String,
  resetPasswordExpire: Date,
  emailVerificationToken: String,
  emailVerificationExpire: Date
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for full name
userSchema.virtual('fullName').get(function() {
  return `${this.profile.firstName} ${this.profile.lastName}`;
});

// Virtual for account lock status
userSchema.virtual('isLocked').get(function() {
  return !!(this.lockUntil && this.lockUntil > Date.now());
});

// Pre-save middleware to hash password and handle empty email
userSchema.pre('save', async function(next) {
  // Convert empty email strings to undefined for proper sparse indexing
  if (this.email === '' || this.email === null) {
    this.email = undefined;
  }
  
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare password
userSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Method to increment login attempts
userSchema.methods.incLoginAttempts = function() {
  // If we have a previous lock that has expired, restart at 1
  if (this.lockUntil && this.lockUntil < Date.now()) {
    return this.updateOne({
      $unset: { lockUntil: 1 },
      $set: { loginAttempts: 1 }
    });
  }

  const updates = { $inc: { loginAttempts: 1 } };
  
  // Lock the account after 5 failed attempts for 2 hours
  if (this.loginAttempts + 1 >= 5 && !this.isLocked) {
    updates.$set = {
      lockUntil: Date.now() + 2 * 60 * 60 * 1000 // 2 hours
    };
  }

  return this.updateOne(updates);
};

// Method to reset login attempts
userSchema.methods.resetLoginAttempts = function() {
  return this.updateOne({
    $unset: {
      loginAttempts: 1,
      lockUntil: 1
    }
  });
};

// Indexes
userSchema.index({ email: 1 }, { sparse: true }); // Sparse index for optional email
userSchema.index({ 'contact.phone': 1 }); // Index for phone numbers
userSchema.index({ 'permissions.farm': 1 });
userSchema.index({ role: 1 });

module.exports = mongoose.model('User', userSchema);
