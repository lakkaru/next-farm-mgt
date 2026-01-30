const Crop = require('../models/Crop');
const Farm = require('../models/Farm');
const asyncHandler = require('../utils/asyncHandler');
const AppError = require('../utils/AppError');

// @desc    Get all crops
// @route   GET /api/crops
// @access  Private
const getCrops = asyncHandler(async (req, res) => {
  const { 
    page = 1, 
    limit = 10, 
    farm, 
    status, 
    category, 
    plantingDateFrom, 
    plantingDateTo 
  } = req.query;
  
  // First get user's farms
  const userFarms = await Farm.find({
    $or: [
      { owner: req.user._id },
      { managers: req.user._id }
    ]
  }).select('_id');
  
  const userFarmIds = userFarms.map(f => f._id);
  
  const query = {
    farm: { $in: userFarmIds }
  };
  
  // Add filters if provided
  if (farm && userFarmIds.includes(farm)) query.farm = farm;
  if (status) query.status = status;
  if (category) query.category = category;
  
  // Date range filter
  if (plantingDateFrom || plantingDateTo) {
    query.plantingDate = {};
    if (plantingDateFrom) query.plantingDate.$gte = new Date(plantingDateFrom);
    if (plantingDateTo) query.plantingDate.$lte = new Date(plantingDateTo);
  }
  
  const crops = await Crop.find(query)
    .populate('farm', 'name location.city location.state')
    .limit(limit * 1)
    .skip((page - 1) * limit)
    .sort({ plantingDate: -1 });
    
  const total = await Crop.countDocuments(query);
  
  res.status(200).json({
    success: true,
    count: crops.length,
    total,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      pages: Math.ceil(total / limit)
    },
    data: crops
  });
});

// @desc    Get single crop
// @route   GET /api/crops/:id
// @access  Private
const getCrop = asyncHandler(async (req, res) => {
  const crop = await Crop.findById(req.params.id)
    .populate('farm', 'name location owner managers');
    
  if (!crop) {
    throw new AppError('Crop not found', 404);
  }
  
  res.status(200).json({
    success: true,
    data: crop
  });
});

// @desc    Create new crop
// @route   POST /api/crops
// @access  Private
const createCrop = asyncHandler(async (req, res) => {
  // Verify farm exists and user has permission
  const farm = await Farm.findById(req.body.farm);
  
  if (!farm) {
    throw new AppError('Farm not found', 404);
  }
  
  // Check if user is owner or manager
  if (farm.owner.toString() !== req.user.id && !farm.managers.includes(req.user.id)) {
    throw new AppError('Not authorized to add crops to this farm', 403);
  }
  
  const crop = await Crop.create(req.body);
  
  // Populate the created crop
  await crop.populate('farm', 'name location.city location.state');
  
  res.status(201).json({
    success: true,
    data: crop
  });
});

// @desc    Update crop
// @route   PUT /api/crops/:id
// @access  Private
const updateCrop = asyncHandler(async (req, res) => {
  let crop = await Crop.findById(req.params.id).populate('farm');
  
  if (!crop) {
    throw new AppError('Crop not found', 404);
  }
  
  // Check if user is owner or manager of the farm
  if (crop.farm.owner.toString() !== req.user.id && !crop.farm.managers.includes(req.user.id)) {
    throw new AppError('Not authorized to update this crop', 403);
  }
  
  crop = await Crop.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  }).populate('farm', 'name location.city location.state');
  
  res.status(200).json({
    success: true,
    data: crop
  });
});

// @desc    Delete crop
// @route   DELETE /api/crops/:id
// @access  Private
const deleteCrop = asyncHandler(async (req, res) => {
  const crop = await Crop.findById(req.params.id).populate('farm');
  
  if (!crop) {
    throw new AppError('Crop not found', 404);
  }
  
  // Check if user is owner or manager of the farm
  if (crop.farm.owner.toString() !== req.user.id && !crop.farm.managers.includes(req.user.id)) {
    throw new AppError('Not authorized to delete this crop', 403);
  }
  
  await crop.deleteOne();
  
  res.status(200).json({
    success: true,
    message: 'Crop deleted successfully'
  });
});

// @desc    Update crop status
// @route   PATCH /api/crops/:id/status
// @access  Private
const updateCropStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  
  if (!status) {
    throw new AppError('Status is required', 400);
  }
  
  const crop = await Crop.findById(req.params.id).populate('farm');
  
  if (!crop) {
    throw new AppError('Crop not found', 404);
  }
  
  // Check if user is owner or manager of the farm
  if (crop.farm.owner.toString() !== req.user.id && !crop.farm.managers.includes(req.user.id)) {
    throw new AppError('Not authorized to update this crop', 403);
  }
  
  crop.status = status;
  
  // If status is harvested, set actual harvest date
  if (status === 'harvested' && !crop.actualHarvestDate) {
    crop.actualHarvestDate = new Date();
  }
  
  await crop.save();
  
  res.status(200).json({
    success: true,
    data: crop
  });
});

// @desc    Add growth stage to crop
// @route   POST /api/crops/:id/growth-stages
// @access  Private
const addGrowthStage = asyncHandler(async (req, res) => {
  const crop = await Crop.findById(req.params.id).populate('farm');
  
  if (!crop) {
    throw new AppError('Crop not found', 404);
  }
  
  // Check if user is owner or manager of the farm
  if (crop.farm.owner.toString() !== req.user.id && !crop.farm.managers.includes(req.user.id)) {
    throw new AppError('Not authorized to update this crop', 403);
  }
  
  const { stage, notes, images } = req.body;
  
  crop.growthStages.push({
    stage,
    date: new Date(),
    notes,
    images
  });
  
  await crop.save();
  
  res.status(200).json({
    success: true,
    data: crop
  });
});

// @desc    Add irrigation record
// @route   POST /api/crops/:id/irrigation
// @access  Private
const addIrrigationRecord = asyncHandler(async (req, res) => {
  const crop = await Crop.findById(req.params.id).populate('farm');
  
  if (!crop) {
    throw new AppError('Crop not found', 404);
  }
  
  // Check if user is owner or manager of the farm
  if (crop.farm.owner.toString() !== req.user.id && !crop.farm.managers.includes(req.user.id)) {
    throw new AppError('Not authorized to update this crop', 403);
  }
  
  const { date, duration, amount } = req.body;
  
  crop.irrigation.schedule.push({
    date: date || new Date(),
    duration,
    amount
  });
  
  await crop.save();
  
  res.status(200).json({
    success: true,
    data: crop
  });
});

// @desc    Get crop statistics
// @route   GET /api/crops/stats
// @access  Private
const getCropStats = asyncHandler(async (req, res) => {
  const { farm } = req.query;
  
  const matchStage = {};
  if (farm) matchStage.farm = mongoose.Types.ObjectId(farm);
  
  const stats = await Crop.aggregate([
    { $match: matchStage },
    {
      $group: {
        _id: null,
        totalCrops: { $sum: 1 },
        totalArea: { $sum: '$field.area.value' },
        cropsByStatus: {
          $push: {
            status: '$status',
            count: 1
          }
        },
        cropsByCategory: {
          $push: {
            category: '$category',
            count: 1
          }
        },
        totalRevenue: { $sum: '$revenue.totalSales' },
        totalCosts: {
          $sum: {
            $add: [
              '$costs.seeds',
              '$costs.fertilizers',
              '$costs.pesticides',
              '$costs.irrigation',
              '$costs.labor',
              '$costs.equipment',
              '$costs.other'
            ]
          }
        }
      }
    }
  ]);
  
  // Get upcoming harvests (next 30 days)
  const upcomingHarvests = await Crop.find({
    ...(farm && { farm }),
    status: { $in: ['planted', 'growing'] },
    expectedHarvestDate: {
      $gte: new Date(),
      $lte: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
    }
  }).populate('farm', 'name').limit(10);
  
  res.status(200).json({
    success: true,
    data: {
      statistics: stats[0] || {},
      upcomingHarvests
    }
  });
});

module.exports = {
  getCrops,
  getCrop,
  createCrop,
  updateCrop,
  deleteCrop,
  updateCropStatus,
  addGrowthStage,
  addIrrigationRecord,
  getCropStats
};
