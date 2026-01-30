const express = require('express');
const router = express.Router();
const {
  getDistrictNames,
  getDivisionalSecretariats,
  getGNDivisions,
  getProvince
} = require('../constants/administrativeDivisions');

// @desc    Get all districts
// @route   GET /api/locations/districts
// @access  Public
router.get('/districts', (req, res) => {
  try {
    const districts = getDistrictNames();
    res.status(200).json({
      success: true,
      data: districts
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching districts'
    });
  }
});

// @desc    Get divisional secretariats for a district
// @route   GET /api/locations/divisional-secretariats/:district
// @access  Public
router.get('/divisional-secretariats/:district', (req, res) => {
  try {
    const { district } = req.params;
    const divisionalSecretariats = getDivisionalSecretariats(district);
    
    res.status(200).json({
      success: true,
      data: divisionalSecretariats
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching divisional secretariats'
    });
  }
});

// @desc    Get GN divisions for a divisional secretariat
// @route   GET /api/locations/gn-divisions/:district/:ds
// @access  Public
router.get('/gn-divisions/:district/:ds', (req, res) => {
  try {
    const { district, ds } = req.params;
    const gnDivisions = getGNDivisions(district, ds);
    
    res.status(200).json({
      success: true,
      data: gnDivisions
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching GN divisions'
    });
  }
});

// @desc    Get province for a district
// @route   GET /api/locations/province/:district
// @access  Public
router.get('/province/:district', (req, res) => {
  try {
    const { district } = req.params;
    const province = getProvince(district);
    
    if (!province) {
      return res.status(404).json({
        success: false,
        message: 'District not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: province
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching province'
    });
  }
});

module.exports = router;
