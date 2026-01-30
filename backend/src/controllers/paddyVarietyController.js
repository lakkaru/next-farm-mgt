const PaddyVariety = require('../models/PaddyVariety');
const { validationResult } = require('express-validator');

// @desc    Get all paddy varieties
// @route   GET /api/paddy-varieties
// @access  Private
const getPaddyVarieties = async (req, res) => {
  try {
    // console.log('=== getPaddyVarieties API called ===');
    // console.log('User:', req.user.id);
    // console.log('Query params:', req.query);
    
    const { type, zone, active, search, yearFrom, yearTo } = req.query;
    
    const filter = {};
    
    // Only add isActive filter if explicitly set to false
    if (active === 'false') {
      filter.isActive = false;
    } else {
      // Default to active varieties only
      filter.isActive = true;
    }
    
    if (type) {
      filter.type = type;
    }
    
    if (zone) {
      filter['characteristics.suitableZones'] = { $in: [zone] };
    }

    // Search by name or popular name
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { popularName: { $regex: search, $options: 'i' } }
      ];
    }

    // Filter by year range
    if (yearFrom) {
      filter.yearOfRelease = { ...filter.yearOfRelease, $gte: parseInt(yearFrom) };
    }
    if (yearTo) {
      filter.yearOfRelease = { ...filter.yearOfRelease, $lte: parseInt(yearTo) };
    }

    const varieties = await PaddyVariety.find(filter).sort({ name: 1 });
    
    // console.log('Total varieties found (no filter):', await PaddyVariety.countDocuments({ isActive: true }));
    // console.log('Filtered varieties count:', varieties.length);
    // if (varieties.length > 0) {
    //   console.log('First variety:', 
    //     { 
    //     name: varieties[0].name, 
    //     type: varieties[0].type, 
    //     isActive: varieties[0].isActive,
    //     duration: varieties[0].duration
    //   });
    // }
    // console.log('=== End getPaddyVarieties ===');
    
    res.json({
      success: true,
      count: varieties.length,
      data: varieties,
    });
  } catch (error) {
    console.error('Get paddy varieties error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching paddy varieties',
      error: error.message,
    });
  }
};

// @desc    Get single paddy variety
// @route   GET /api/paddy-varieties/:id
// @access  Private
const getPaddyVariety = async (req, res) => {
  try {
    const variety = await PaddyVariety.findById(req.params.id);
    
    if (!variety) {
      return res.status(404).json({
        success: false,
        message: 'Paddy variety not found',
      });
    }

    res.json({
      success: true,
      data: variety,
    });
  } catch (error) {
    console.error('Get paddy variety error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching paddy variety',
      error: error.message,
    });
  }
};

// @desc    Create new paddy variety
// @route   POST /api/paddy-varieties
// @access  Private (Admin only)
const createPaddyVariety = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array(),
      });
    }

    const variety = await PaddyVariety.create(req.body);
    
    res.status(201).json({
      success: true,
      data: variety,
      message: 'Paddy variety created successfully',
    });
  } catch (error) {
    console.error('Create paddy variety error:', error);
    
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Paddy variety with this name already exists',
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Error creating paddy variety',
      error: error.message,
    });
  }
};

// @desc    Update paddy variety
// @route   PUT /api/paddy-varieties/:id
// @access  Private (Admin only)
const updatePaddyVariety = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array(),
      });
    }

    const variety = await PaddyVariety.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!variety) {
      return res.status(404).json({
        success: false,
        message: 'Paddy variety not found',
      });
    }

    res.json({
      success: true,
      data: variety,
      message: 'Paddy variety updated successfully',
    });
  } catch (error) {
    console.error('Update paddy variety error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating paddy variety',
      error: error.message,
    });
  }
};

// @desc    Delete paddy variety (soft delete)
// @route   DELETE /api/paddy-varieties/:id
// @access  Private (Admin only)
const deletePaddyVariety = async (req, res) => {
  try {
    const variety = await PaddyVariety.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );
    
    if (!variety) {
      return res.status(404).json({
        success: false,
        message: 'Paddy variety not found',
      });
    }

    res.json({
      success: true,
      message: 'Paddy variety deactivated successfully',
    });
  } catch (error) {
    console.error('Delete paddy variety error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting paddy variety',
      error: error.message,
    });
  }
};

module.exports = {
  getPaddyVarieties,
  getPaddyVariety,
  createPaddyVariety,
  updatePaddyVariety,
  deletePaddyVariety,
};
