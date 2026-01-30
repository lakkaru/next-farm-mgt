const Machinery = require('../models/Machinery');
const MachineryRequest = require('../models/MachineryRequest');
const Farm = require('../models/Farm');
const asyncHandler = require('../utils/asyncHandler');
const AppError = require('../utils/AppError');
const { isAdmin } = require('../middleware/auth');

// @desc    Create new machinery
// @route   POST /api/machinery
// @access  Private (machinery_operator)
exports.createMachinery = asyncHandler(async (req, res) => {
  const machineryData = {
    ...req.body,
    owner: req.user._id
  };

  const machinery = await Machinery.create(machineryData);
  
  res.status(201).json({
    success: true,
    data: machinery
  });
});

// @desc    Get all machinery (with filters)
// @route   GET /api/machinery
// @access  Public
exports.getAllMachinery = asyncHandler(async (req, res) => {
  const { 
    machineryType, 
    district, 
    availability, 
    minPrice, 
    maxPrice,
    search 
  } = req.query;

  let query = { isActive: true };

  if (machineryType) {
    query.machineryType = machineryType;
  }

  if (district) {
    query['serviceArea.districts'] = district;
  }

  if (availability) {
    query.availability = availability;
  }

  if (minPrice || maxPrice) {
    query.priceAmount = {};
    if (minPrice) query.priceAmount.$gte = Number(minPrice);
    if (maxPrice) query.priceAmount.$lte = Number(maxPrice);
  }

  if (search) {
    query.$or = [
      { brand: { $regex: search, $options: 'i' } },
      { model: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } }
    ];
  }

  const machinery = await Machinery.find(query)
    .populate('owner', 'profile.firstName profile.lastName contact.phone')
    .sort('-createdAt');

  res.status(200).json({
    success: true,
    count: machinery.length,
    data: machinery
  });
});

// @desc    Get machinery by location
// @route   GET /api/machinery/nearby
// @access  Public
exports.getNearbyMachinery = asyncHandler(async (req, res) => {
  const { longitude, latitude, maxDistance = 50000, machineryType } = req.query; // maxDistance in meters

  if (!longitude || !latitude) {
    throw new AppError('Please provide longitude and latitude', 400);
  }

  let query = {
    isActive: true,
    'location.coordinates': {
      $near: {
        $geometry: {
          type: 'Point',
          coordinates: [parseFloat(longitude), parseFloat(latitude)]
        },
        $maxDistance: parseInt(maxDistance)
      }
    }
  };

  if (machineryType) {
    query.machineryType = machineryType;
  }

  const machinery = await Machinery.find(query)
    .populate('owner', 'profile.firstName profile.lastName contact.phone');

  res.status(200).json({
    success: true,
    count: machinery.length,
    data: machinery
  });
});

// @desc    Get single machinery
// @route   GET /api/machinery/:id
// @access  Public
exports.getMachinery = asyncHandler(async (req, res) => {
  const machinery = await Machinery.findById(req.params.id)
    .populate('owner', 'profile.firstName profile.lastName contact.phone contact.address');

  if (!machinery) {
    throw new AppError('Machinery not found', 404);
  }

  res.status(200).json({
    success: true,
    data: machinery
  });
});

// @desc    Update machinery
// @route   PUT /api/machinery/:id
// @access  Private (Owner only)
exports.updateMachinery = asyncHandler(async (req, res) => {
  let machinery = await Machinery.findById(req.params.id);

  if (!machinery) {
    throw new AppError('Machinery not found', 404);
  }

  // Check ownership
  if (machinery.owner.toString() !== req.user._id.toString() && !isAdmin(req.user)) {
    throw new AppError('Not authorized to update this machinery', 403);
  }

  machinery = await Machinery.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true, runValidators: true }
  );

  res.status(200).json({
    success: true,
    data: machinery
  });
});

// @desc    Delete machinery
// @route   DELETE /api/machinery/:id
// @access  Private (Owner only)
exports.deleteMachinery = asyncHandler(async (req, res) => {
  const machinery = await Machinery.findById(req.params.id);

  if (!machinery) {
    throw new AppError('Machinery not found', 404);
  }

  // Check ownership
  if (machinery.owner.toString() !== req.user._id.toString() && !isAdmin(req.user)) {
    throw new AppError('Not authorized to delete this machinery', 403);
  }

  await machinery.deleteOne();

  res.status(200).json({
    success: true,
    data: {}
  });
});

// @desc    Get machinery owned by logged in user
// @route   GET /api/machinery/my/listings
// @access  Private
exports.getMyMachinery = asyncHandler(async (req, res) => {
  const machinery = await Machinery.find({ owner: req.user._id })
    .sort('-createdAt');

  res.status(200).json({
    success: true,
    count: machinery.length,
    data: machinery
  });
});

// @desc    Create machinery request
// @route   POST /api/machinery/requests
// @access  Private (farmer)
exports.createMachineryRequest = asyncHandler(async (req, res) => {
  const { farmId, machineryId, machineryType, serviceDate, duration, description } = req.body;

  // Verify farm belongs to user
  const farm = await Farm.findOne({ _id: farmId, owner: req.user._id });
  if (!farm) {
    throw new AppError('Farm not found or you do not have access', 404);
  }

  // Verify machinery exists and is available
  if (machineryId) {
    const machinery = await Machinery.findById(machineryId);
    if (!machinery) {
      throw new AppError('Machinery not found', 404);
    }
    if (machinery.availability !== 'Available') {
      throw new AppError('Machinery is not currently available', 400);
    }
  }

  const request = await MachineryRequest.create({
    farmer: req.user._id,
    farm: farmId,
    machinery: machineryId,
    machineryType,
    serviceDate,
    duration,
    description
  });

  await request.populate([
    { path: 'farmer', select: 'profile.firstName profile.lastName contact.phone' },
    { path: 'farm', select: 'name location' },
    { path: 'machinery' }
  ]);

  res.status(201).json({
    success: true,
    data: request
  });
});

// @desc    Get machinery requests (for machinery owner)
// @route   GET /api/machinery/:id/requests
// @access  Private (machinery owner)
exports.getMachineryRequests = asyncHandler(async (req, res) => {
  const machinery = await Machinery.findById(req.params.id);

  if (!machinery) {
    throw new AppError('Machinery not found', 404);
  }

  // Check ownership
  if (machinery.owner.toString() !== req.user._id.toString() && !isAdmin(req.user)) {
    throw new AppError('Not authorized to view these requests', 403);
  }

  const requests = await MachineryRequest.find({ machinery: req.params.id })
    .populate('farmer', 'profile.firstName profile.lastName contact.phone')
    .populate('farm', 'name location')
    .sort('-createdAt');

  res.status(200).json({
    success: true,
    count: requests.length,
    data: requests
  });
});

// @desc    Get my machinery requests (for farmer)
// @route   GET /api/machinery/requests/my
// @access  Private (farmer)
exports.getMyRequests = asyncHandler(async (req, res) => {
  const requests = await MachineryRequest.find({ farmer: req.user._id })
    .populate('machinery')
    .populate('farm', 'name location')
    .sort('-createdAt');

  res.status(200).json({
    success: true,
    count: requests.length,
    data: requests
  });
});

// @desc    Update machinery request status
// @route   PUT /api/machinery/requests/:id/status
// @access  Private (machinery owner)
exports.updateRequestStatus = asyncHandler(async (req, res) => {
  const { status, estimatedCost, notes } = req.body;

  const request = await MachineryRequest.findById(req.params.id).populate('machinery');

  if (!request) {
    throw new AppError('Request not found', 404);
  }

  // Check if user is the machinery owner
  if (request.machinery.owner.toString() !== req.user._id.toString() && !isAdmin(req.user)) {
    throw new AppError('Not authorized to update this request', 403);
  }

  request.status = status;
  if (estimatedCost) request.estimatedCost = estimatedCost;
  if (notes) {
    request.notes.push({
      text: notes,
      by: req.user._id
    });
  }

  await request.save();

  await request.populate([
    { path: 'farmer', select: 'profile.firstName profile.lastName contact.phone' },
    { path: 'farm', select: 'name location' }
  ]);

  res.status(200).json({
    success: true,
    data: request
  });
});

// @desc    Rate machinery service
// @route   POST /api/machinery/requests/:id/rate
// @access  Private (farmer who made the request)
exports.rateMachineryService = asyncHandler(async (req, res) => {
  const { score, review } = req.body;

  const request = await MachineryRequest.findById(req.params.id);

  if (!request) {
    throw new AppError('Request not found', 404);
  }

  // Check if user is the farmer who made the request
  if (request.farmer.toString() !== req.user._id.toString()) {
    throw new AppError('Not authorized to rate this service', 403);
  }

  // Check if service is completed
  if (request.status !== 'Completed') {
    throw new AppError('Can only rate completed services', 400);
  }

  // Check if already rated
  if (request.rating && request.rating.score) {
    throw new AppError('Service already rated', 400);
  }

  request.rating = {
    score,
    review,
    createdAt: new Date()
  };

  await request.save();

  // Update machinery rating
  const machinery = await Machinery.findById(request.machinery);
  if (machinery) {
    const totalRating = (machinery.rating.average * machinery.rating.count) + score;
    machinery.rating.count += 1;
    machinery.rating.average = totalRating / machinery.rating.count;
    machinery.totalServices += 1;
    await machinery.save();
  }

  res.status(200).json({
    success: true,
    data: request
  });
});

// @desc    Search for service areas matching farmer's district
// @route   GET /api/machinery/search-by-farm/:farmId
// @access  Private
exports.searchMachineryByFarm = asyncHandler(async (req, res) => {
  const farm = await Farm.findOne({ _id: req.params.farmId, owner: req.user._id });

  if (!farm) {
    throw new AppError('Farm not found or you do not have access', 404);
  }

  const machinery = await Machinery.find({
    isActive: true,
    'serviceArea.districts': farm.location.district,
    availability: 'Available'
  })
    .populate('owner', 'profile.firstName profile.lastName contact.phone')
    .sort('-rating.average');

  res.status(200).json({
    success: true,
    count: machinery.length,
    data: machinery
  });
});
