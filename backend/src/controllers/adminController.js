const asyncHandler = require('../utils/asyncHandler');
const User = require('../models/User');
const Farm = require('../models/Farm');
const AppError = require('../utils/AppError');

// @desc    Get all farmer users
// @route   GET /api/admin/farmers
// @access  Admin
const getFarmers = asyncHandler(async (req, res) => {
  const { page = 1, limit = 50, search, all } = req.query;
  const skip = (parseInt(page) - 1) * parseInt(limit);

  // If `all=true` is passed, return all users (subject to optional search).
  // Default behavior (no all flag) returns only farmer/farm_owner accounts.
  let filter = {};

  if (String(all) === 'true' || String(all) === '1') {
    // Start with optional search filter
    filter = search
      ? {
          $or: [
            { 'profile.firstName': { $regex: search, $options: 'i' } },
            { 'profile.lastName': { $regex: search, $options: 'i' } },
            { email: { $regex: search, $options: 'i' } },
            { 'contact.phone': { $regex: search, $options: 'i' } },
          ],
        }
      : {};
  } else {
    // Only farmer/farm_owner
    const roleQuery = {
      $or: [
        { role: 'farm_owner' },
        { role: 'farmer' },
        { roles: 'farm_owner' },
        { roles: 'farmer' },
      ],
    };

    filter = search
      ? {
          ...roleQuery,
          $or: [
            { 'profile.firstName': { $regex: search, $options: 'i' } },
            { 'profile.lastName': { $regex: search, $options: 'i' } },
            { email: { $regex: search, $options: 'i' } },
            { 'contact.phone': { $regex: search, $options: 'i' } },
          ],
        }
      : roleQuery;
  }

  const total = await User.countDocuments(filter);
  const users = await User.find(filter)
    .select('-password')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(parseInt(limit));

  res.json({
    success: true,
    count: users.length,
    total,
    page: parseInt(page),
    data: users,
  });
});

// @desc    Delete a farmer account and associated farms
// @route   DELETE /api/admin/farmers/:id
// @access  Admin
const deleteFarmer = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!id) {
    throw new AppError('User ID is required', 400);
  }

  const user = await User.findById(id);
  if (!user) {
    return res.status(404).json({ success: false, message: 'User not found' });
  }

  // Only allow deleting farmer/farm_owner accounts
  const isFarmer = (user.role === 'farm_owner' || user.role === 'farmer') ||
    (Array.isArray(user.roles) && (user.roles.includes('farm_owner') || user.roles.includes('farmer')));

  if (!isFarmer) {
    return res.status(400).json({ success: false, message: 'Can only delete farmer accounts via this endpoint' });
  }

  // Delete farms owned by this user
  await Farm.deleteMany({ owner: user._id });

  // Optionally, remove this user from other references (managers arrays) - left as future work

  await User.deleteOne({ _id: user._id });

  res.json({ success: true, message: 'Farmer account and associated farms deleted successfully' });
});

// @desc    Update a farmer account (admin)
// @route   PUT /api/admin/farmers/:id
// @access  Admin
const updateFarmer = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!id) {
    throw new AppError('User ID is required', 400);
  }

  const user = await User.findById(id);
  if (!user) {
    return res.status(404).json({ success: false, message: 'User not found' });
  }

  const { email, role, profile, contact, isActive } = req.body;

  // If email is being changed, ensure uniqueness
  if (email && email !== user.email) {
    const exists = await User.findOne({ email });
    if (exists) {
      return res.status(400).json({ success: false, message: 'Email already in use' });
    }
    user.email = email;
  }

  if (typeof isActive !== 'undefined') user.isActive = isActive;
  if (role) user.role = role;
  if (profile && typeof profile === 'object') {
    user.profile = { ...user.profile, ...profile };
  }
  if (contact && typeof contact === 'object') {
    user.contact = { ...user.contact, ...contact };
  }

  await user.save();

  const out = user.toObject();
  delete out.password;

  res.json({ success: true, data: out });
});

module.exports = {
  getFarmers,
  deleteFarmer,
  updateFarmer,
};
