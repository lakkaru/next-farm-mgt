const asyncHandler = require('../utils/asyncHandler');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

// @desc    Register new user
// @route   POST /api/users/register
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
  const { email, password, profile, roles } = req.body;

  // Validation - password is still required
  if (!password) {
    return res.status(400).json({
      success: false,
      message: 'Please provide password',
    });
  }

  if (!profile || !profile.firstName || !profile.lastName || !profile.phone) {
    return res.status(400).json({
      success: false,
      message: 'Please provide first name, last name, and phone number',
    });
  }

  // Check if user exists by phone number
  const phoneExists = await User.findOne({ 'contact.phone': profile.phone });
  if (phoneExists) {
    return res.status(400).json({
      success: false,
      message: 'User with this phone number already exists',
    });
  }

  // Check if email exists (only if email is provided and not empty)
  if (email && email.trim()) {
    const emailExists = await User.findOne({ email: email.trim() });
    if (emailExists) {
      return res.status(400).json({
        success: false,
        message: 'User with this email already exists',
      });
    }
  }

  // Create user data object
  const userData = {
    password, // Let the pre-save hook handle hashing
    profile: {
      firstName: profile.firstName,
      lastName: profile.lastName,
    },
    contact: {
      phone: profile.phone,
    },
    role: profile.role || 'farm_owner',
    roles: roles || [],
  };

  // Only add email if provided and not empty
  if (email && email.trim()) {
    userData.email = email.trim();
  }
  // If no email provided, don't set the field at all (undefined)

  // Create user
  const user = await User.create(userData);

  if (user) {
    res.status(201).json({
      success: true,
      data: {
        _id: user._id,
        email: user.email,
        profile: user.profile,
        contact: user.contact,
        roles: user.roles,
        token: generateToken(user._id),
      },
      message: 'User registered successfully',
    });
  } else {
    return res.status(400).json({
      success: false,
      message: 'Invalid user data',
    });
  }
});

// @desc    Login user
// @route   POST /api/users/login
// @access  Public
const loginUser = asyncHandler(async (req, res) => {
  const { phone, email, password } = req.body;

  // Validation
  if ((!phone && !email) || !password) {
    return res.status(400).json({
      success: false,
      message: 'Please provide phone (or email) and password',
    });
  }

  // Helper to normalize phone input into base digits (no leading 0 or country code)
  const normalizePhoneBase = (input) => {
    if (!input) return '';
    const digits = String(input).replace(/\D/g, '');
    let base = digits;
    if (base.startsWith('94')) base = base.slice(2);
    if (base.startsWith('0')) base = base.slice(1);
    return base; // e.g. '712345678'
  };

  let user;

  // Try email login first if provided (backwards compatibility)
  if (email) {
    user = await User.findOne({ email }).select('+password');
  } else if (phone) {
    const rawDigits = String(phone).replace(/\D/g, '');
    const base = normalizePhoneBase(phone);

    // Candidate representations that may be stored in DB
    const candidates = new Set();
    if (rawDigits) candidates.add(rawDigits);
    if (base) candidates.add(base);
    if (base) candidates.add('0' + base);
    if (base) candidates.add('94' + base);

    // Query for any matching contact.phone
    const orQueries = Array.from(candidates).map((p) => ({ 'contact.phone': p }));
    if (orQueries.length) {
      user = await User.findOne({ $or: orQueries }).select('+password');
    }
  }

  if (!user) {
    return res.status(401).json({
      success: false,
      message: 'Invalid credentials',
    });
  }

  // Check password using the User model's method
  const isMatch = await user.matchPassword(password);

  if (!isMatch) {
    return res.status(401).json({
      success: false,
      message: 'Invalid credentials',
    });
  }

  // Update last login
  user.lastLogin = new Date();
  user.resetLoginAttempts();
  await user.save();

  res.status(200).json({
    success: true,
    data: {
      _id: user._id,
      email: user.email,
      profile: user.profile,
      contact: user.contact,
      role: user.role,
      token: generateToken(user._id),
    },
    message: 'Login successful',
  });
});

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'User not found',
    });
  }

  res.status(200).json({
    success: true,
    data: {
      _id: user._id,
      email: user.email,
      profile: user.profile,
      contact: user.contact,
      preferences: user.preferences,
      role: user.role,
      isEmailVerified: user.isEmailVerified,
      lastLogin: user.lastLogin,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    },
  });
});

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
const updateUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'User not found',
    });
  }

  // Update basic profile information
  if (req.body.email && req.body.email !== user.email) {
    // Check if email is already taken by another user
    const existingUser = await User.findOne({ email: req.body.email });
    if (existingUser && existingUser._id.toString() !== user._id.toString()) {
      return res.status(400).json({
        success: false,
        message: 'Email is already in use by another account',
      });
    }
    user.email = req.body.email;
  }

  // Update profile fields
  if (req.body.profile) {
    const { profile } = req.body;
    user.profile.firstName = profile.firstName || user.profile.firstName;
    user.profile.lastName = profile.lastName || user.profile.lastName;
    user.profile.avatar = profile.avatar || user.profile.avatar;
    user.profile.bio = profile.bio !== undefined ? profile.bio : user.profile.bio;
    
    if (profile.dateOfBirth) {
      user.profile.dateOfBirth = new Date(profile.dateOfBirth);
    }
    
    if (profile.gender) {
      user.profile.gender = profile.gender;
    }
  }

  // Update contact information
  if (req.body.contact) {
    const { contact } = req.body;
    user.contact.phone = contact.phone || user.contact.phone;
    
    if (contact.address) {
      user.contact.address = {
        street: contact.address.street || user.contact.address?.street || '',
        city: contact.address.city || user.contact.address?.city || '',
        state: contact.address.state || user.contact.address?.state || '',
        country: contact.address.country || user.contact.address?.country || '',
        zipCode: contact.address.zipCode || user.contact.address?.zipCode || '',
      };
    }
  }

  // Update preferences
  if (req.body.preferences) {
    const { preferences } = req.body;
    user.preferences.language = preferences.language || user.preferences.language;
    user.preferences.timezone = preferences.timezone || user.preferences.timezone;
    
    if (preferences.notifications) {
      user.preferences.notifications = {
        email: preferences.notifications.email !== undefined ? preferences.notifications.email : user.preferences.notifications?.email ?? true,
        sms: preferences.notifications.sms !== undefined ? preferences.notifications.sms : user.preferences.notifications?.sms ?? false,
        push: preferences.notifications.push !== undefined ? preferences.notifications.push : user.preferences.notifications?.push ?? true,
        // Extended notification preferences
        farmAlerts: preferences.notifications.farmAlerts !== undefined ? preferences.notifications.farmAlerts : user.preferences.notifications?.farmAlerts ?? true,
        weatherUpdates: preferences.notifications.weatherUpdates !== undefined ? preferences.notifications.weatherUpdates : user.preferences.notifications?.weatherUpdates ?? true,
        taskReminders: preferences.notifications.taskReminders !== undefined ? preferences.notifications.taskReminders : user.preferences.notifications?.taskReminders ?? true,
        inventoryAlerts: preferences.notifications.inventoryAlerts !== undefined ? preferences.notifications.inventoryAlerts : user.preferences.notifications?.inventoryAlerts ?? true,
        systemUpdates: preferences.notifications.systemUpdates !== undefined ? preferences.notifications.systemUpdates : user.preferences.notifications?.systemUpdates ?? false,
        marketingEmails: preferences.notifications.marketingEmails !== undefined ? preferences.notifications.marketingEmails : user.preferences.notifications?.marketingEmails ?? false,
      };
    }
  }

  // Update password if provided (requires current password verification)
  if (req.body.password) {
    if (!req.body.currentPassword) {
      return res.status(400).json({
        success: false,
        message: 'Current password is required to update password',
      });
    }

    // Verify current password
    const currentUser = await User.findById(req.user._id).select('+password');
    const isCurrentPasswordValid = await currentUser.matchPassword(req.body.currentPassword);
    
    if (!isCurrentPasswordValid) {
      return res.status(400).json({
        success: false,
        message: 'Current password is incorrect',
      });
    }

    // Hash new password (pre-save hook will handle this)
    user.password = req.body.password;
  }

  const updatedUser = await user.save();

  // Return updated user data (excluding sensitive information)
  res.status(200).json({
    success: true,
    data: {
      _id: updatedUser._id,
      email: updatedUser.email,
      profile: updatedUser.profile,
      contact: updatedUser.contact,
      preferences: updatedUser.preferences,
      role: updatedUser.role,
      isEmailVerified: updatedUser.isEmailVerified,
      createdAt: updatedUser.createdAt,
      updatedAt: updatedUser.updatedAt,
    },
    message: 'Profile updated successfully',
  });
});

// @desc    Upload profile avatar
// @route   POST /api/users/profile/avatar
// @access  Private
const uploadProfileAvatar = asyncHandler(async (req, res) => {
  if (!req.file) {
    return res.status(400).json({
      success: false,
      message: 'No avatar file uploaded',
    });
  }

  const user = await User.findById(req.user._id);

  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'User not found',
    });
  }

  // Update user avatar path
  const avatarUrl = `/api/users/avatar/${req.file.filename}`;
  user.profile.avatar = avatarUrl;
  await user.save();

  res.status(200).json({
    success: true,
    data: {
      avatar: avatarUrl,
    },
    message: 'Avatar uploaded successfully',
  });
});

// @desc    Change user password
// @route   PUT /api/users/change-password
// @access  Private
const changePassword = asyncHandler(async (req, res) => {
  // console.log('Change password request received:', { 
  //   userId: req.user._id, 
  //   hasCurrentPassword: !!req.body.currentPassword, 
  //   hasNewPassword: !!req.body.newPassword 
  // });

  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    // console.log('Missing password fields');
    return res.status(400).json({
      success: false,
      message: 'Current password and new password are required',
    });
  }

  // Get user with password field
  const user = await User.findById(req.user._id).select('+password');

  if (!user) {
    // console.log('User not found:', req.user._id);
    return res.status(404).json({
      success: false,
      message: 'User not found',
    });
  }

  // console.log('User found, verifying current password');
  // Verify current password
  const isCurrentPasswordValid = await user.matchPassword(currentPassword);
  // console.log('Current password valid:', isCurrentPasswordValid);
  
  if (!isCurrentPasswordValid) {
    return res.status(400).json({
      success: false,
      message: 'Current password is incorrect',
    });
  }

  // Check if new password is different from current password
  const isSamePassword = await user.matchPassword(newPassword);
  // console.log('New password same as current:', isSamePassword);
  
  if (isSamePassword) {
    return res.status(400).json({
      success: false,
      message: 'New password must be different from current password',
    });
  }

  // console.log('Updating password for user:', user._id);
  // Update password (pre-save hook will hash it)
  user.password = newPassword;
  await user.save();

  // console.log('Password updated successfully');
  res.status(200).json({
    success: true,
    message: 'Password changed successfully',
  });
});

// @desc    Get all users
// @route   GET /api/users
// @access  Private/Admin
const getUsers = asyncHandler(async (req, res) => {
  const users = await User.find({});

  res.status(200).json({
    success: true,
    count: users.length,
    data: users,
  });
});

module.exports = {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
  uploadProfileAvatar,
  changePassword,
  getUsers,
};
