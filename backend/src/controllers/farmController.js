const Farm = require('../models/Farm');
const asyncHandler = require('../utils/asyncHandler');
const AppError = require('../utils/AppError');
const { 
  validateDistrict, 
  getZoneForDistrict, 
  getCultivationZoneInfo,
  SRI_LANKAN_DISTRICTS 
} = require('../constants/districts');

// @desc    Get all farms
// @route   GET /api/farms
// @access  Private
const getFarms = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, farmType, city, state, district, cultivationZone } = req.query;
  
  const query = {};
  
  // Filter by user's farms (owned or managed)
  query.$or = [
    { owner: req.user._id },
    { managers: req.user._id }
  ];
  
  // Add filters if provided
  if (farmType) query.farmType = farmType;
  if (district) query.district = new RegExp(district, 'i');
  if (cultivationZone) query.cultivationZone = cultivationZone;
  
  const farms = await Farm.find(query)
    .populate('owner', 'profile.firstName profile.lastName email')
    .populate('managers', 'profile.firstName profile.lastName email')
    .limit(limit * 1)
    .skip((page - 1) * limit)
    .sort({ createdAt: -1 });
    
  const total = await Farm.countDocuments(query);
  
  res.status(200).json({
    success: true,
    count: farms.length,
    total,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      pages: Math.ceil(total / limit)
    },
    data: farms
  });
});

// @desc    Get single farm
// @route   GET /api/farms/:id
// @access  Private
const getFarm = asyncHandler(async (req, res) => {
  const farm = await Farm.findById(req.params.id)
    .populate('owner', 'profile.firstName profile.lastName email contact')
    .populate('managers', 'profile.firstName profile.lastName email contact')
    .populate('crops');
    
  if (!farm) {
    throw new AppError('Farm not found', 404);
  }
  
  res.status(200).json({
    success: true,
    data: farm
  });
});

// @desc    Create new farm
// @route   POST /api/farms
// @access  Private
const createFarm = asyncHandler(async (req, res) => {
  // Add user as farm owner
  req.body.owner = req.user.id;
  
  // Validate district if provided
  if (req.body.district && !validateDistrict(req.body.district)) {
    throw new AppError('Invalid district name. Please select a valid Sri Lankan district.', 400);
  }
  
  // Handle coordinates - remove if empty to avoid geospatial index issues
  if (req.body.location && req.body.location.coordinates) {
    const { latitude, longitude } = req.body.location.coordinates;
    if (!latitude || !longitude || latitude === '' || longitude === '' || latitude === null || longitude === null) {
      delete req.body.location.coordinates;
    } else {
      req.body.location.coordinates = {
        latitude: Number(latitude),
        longitude: Number(longitude)
      };
    }
  }
  
  const farm = await Farm.create(req.body);
  
  // Populate the created farm
  await farm.populate('owner', 'profile.firstName profile.lastName email');
  
  res.status(201).json({
    success: true,
    data: farm
  });
});

// @desc    Update farm
// @route   PUT /api/farms/:id
// @access  Private
const updateFarm = asyncHandler(async (req, res) => {
  let farm = await Farm.findById(req.params.id);
  
  if (!farm) {
    throw new AppError('Farm not found', 404);
  }
  
  // Check if user is owner or has manager permissions
  if (farm.owner.toString() !== req.user.id && !farm.managers.includes(req.user.id)) {
    throw new AppError('Not authorized to update this farm', 403);
  }
  
  // Validate district if provided
  if (req.body.district && !validateDistrict(req.body.district)) {
    throw new AppError('Invalid district name. Please select a valid Sri Lankan district.', 400);
  }
  
  // Handle coordinates - remove if empty to avoid geospatial index issues
  if (req.body.location && req.body.location.coordinates) {
    const { latitude, longitude } = req.body.location.coordinates;
    if (!latitude || !longitude || latitude === '' || longitude === '' || latitude === null || longitude === null) {
      delete req.body.location.coordinates;
    } else {
      req.body.location.coordinates = {
        latitude: Number(latitude),
        longitude: Number(longitude)
      };
    }
  }
  
  farm = await Farm.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  }).populate('owner', 'profile.firstName profile.lastName email')
   .populate('managers', 'profile.firstName profile.lastName email');
  
  res.status(200).json({
    success: true,
    data: farm
  });
});

// @desc    Delete farm
// @route   DELETE /api/farms/:id
// @access  Private
const deleteFarm = asyncHandler(async (req, res) => {
  const farm = await Farm.findById(req.params.id);
  
  if (!farm) {
    throw new AppError('Farm not found', 404);
  }
  
  // Check if user is owner
  if (farm.owner.toString() !== req.user.id) {
    throw new AppError('Not authorized to delete this farm', 403);
  }
  
  await farm.deleteOne();
  
  res.status(200).json({
    success: true,
    message: 'Farm deleted successfully'
  });
});

// @desc    Add manager to farm
// @route   POST /api/farms/:id/managers
// @access  Private
const addManager = asyncHandler(async (req, res) => {
  const farm = await Farm.findById(req.params.id);
  
  if (!farm) {
    throw new AppError('Farm not found', 404);
  }
  
  // Check if user is owner
  if (farm.owner.toString() !== req.user.id) {
    throw new AppError('Not authorized to add managers to this farm', 403);
  }
  
  const { managerId } = req.body;
  
  if (!managerId) {
    throw new AppError('Manager ID is required', 400);
  }
  
  // Check if user is already a manager
  if (farm.managers.includes(managerId)) {
    throw new AppError('User is already a manager of this farm', 400);
  }
  
  farm.managers.push(managerId);
  await farm.save();
  
  await farm.populate('managers', 'profile.firstName profile.lastName email');
  
  res.status(200).json({
    success: true,
    data: farm
  });
});

// @desc    Remove manager from farm
// @route   DELETE /api/farms/:id/managers/:managerId
// @access  Private
const removeManager = asyncHandler(async (req, res) => {
  const farm = await Farm.findById(req.params.id);
  
  if (!farm) {
    throw new AppError('Farm not found', 404);
  }
  
  // Check if user is owner
  if (farm.owner.toString() !== req.user.id) {
    throw new AppError('Not authorized to remove managers from this farm', 403);
  }
  
  const { managerId } = req.params;
  
  // Remove manager from array
  farm.managers = farm.managers.filter(id => id.toString() !== managerId);
  await farm.save();
  
  await farm.populate('managers', 'profile.firstName profile.lastName email');
  
  res.status(200).json({
    success: true,
    data: farm
  });
});

// @desc    Get farms within radius
// @route   GET /api/farms/radius/:zipcode/:distance
// @access  Private
const getFarmsInRadius = asyncHandler(async (req, res) => {
  const { zipcode, distance } = req.params;
  const unit = req.query.unit || 'miles';
  
  // Get lat/lng from geocoder for zipcode (would need a geocoding service)
  // For now, we'll use coordinates from query params
  const { lat, lng } = req.query;
  
  if (!lat || !lng) {
    throw new AppError('Latitude and longitude are required', 400);
  }
  
  // Calc radius using radians
  // Divide dist by radius of Earth
  // Earth Radius = 3,963 mi / 6,378 km
  const radius = unit === 'km' ? distance / 6378 : distance / 3963;
  
  const farms = await Farm.find({
    'location.coordinates': {
      $geoWithin: {
        $centerSphere: [[lng, lat], radius]
      }
    }
  }).populate('owner', 'profile.firstName profile.lastName email');
  
  res.status(200).json({
    success: true,
    count: farms.length,
    data: farms
  });
});

// @desc    Get all Sri Lankan districts
// @route   GET /api/farms/districts
// @access  Public
const getDistricts = asyncHandler(async (req, res) => {
  res.status(200).json({
    success: true,
    count: SRI_LANKAN_DISTRICTS.length,
    data: SRI_LANKAN_DISTRICTS
  });
});

// @desc    Get cultivation zone info
// @route   GET /api/farms/cultivation-zones/:zoneCode
// @access  Public
const getCultivationZoneDetails = asyncHandler(async (req, res) => {
  const { zoneCode } = req.params;
  const zoneInfo = getCultivationZoneInfo(zoneCode);
  
  if (!zoneInfo) {
    throw new AppError('Cultivation zone not found', 404);
  }
  
  res.status(200).json({
    success: true,
    data: zoneInfo
  });
});

// @desc    Get farms by district
// @route   GET /api/farms/by-district/:district
// @access  Private
const getFarmsByDistrict = asyncHandler(async (req, res) => {
  const { district } = req.params;
  const { page = 1, limit = 10 } = req.query;
  
  // Validate district
  if (!validateDistrict(district)) {
    throw new AppError('Invalid district name', 400);
  }
  
  const query = {
    district: district,
    $or: [
      { owner: req.user._id },
      { managers: req.user._id }
    ]
  };
  
  const farms = await Farm.find(query)
    .populate('owner', 'profile.firstName profile.lastName email')
    .populate('managers', 'profile.firstName profile.lastName email')
    .limit(limit * 1)
    .skip((page - 1) * limit)
    .sort({ createdAt: -1 });
    
  const total = await Farm.countDocuments(query);
  
  res.status(200).json({
    success: true,
    count: farms.length,
    total,
    pagination: {
      page: Number(page),
      pages: Math.ceil(total / limit)
    },
    data: farms
  });
});

// @desc    Get farms by cultivation zone
// @route   GET /api/farms/by-zone/:zoneCode
// @access  Private
const getFarmsByZone = asyncHandler(async (req, res) => {
  const { zoneCode } = req.params;
  const { page = 1, limit = 10 } = req.query;
  
  const query = {
    cultivationZone: zoneCode,
    $or: [
      { owner: req.user._id },
      { managers: req.user._id }
    ]
  };
  
  const farms = await Farm.find(query)
    .populate('owner', 'profile.firstName profile.lastName email')
    .populate('managers', 'profile.firstName profile.lastName email')
    .limit(limit * 1)
    .skip((page - 1) * limit)
    .sort({ createdAt: -1 });
    
  const total = await Farm.countDocuments(query);
  
  res.status(200).json({
    success: true,
    count: farms.length,
    total,
    pagination: {
      page: Number(page),
      pages: Math.ceil(total / limit)
    },
    data: farms
  });
});

module.exports = {
  getFarms,
  getFarm,
  createFarm,
  updateFarm,
  deleteFarm,
  addManager,
  removeManager,
  getFarmsInRadius,
  getDistricts,
  getCultivationZoneDetails,
  getFarmsByDistrict,
  getFarmsByZone
};
