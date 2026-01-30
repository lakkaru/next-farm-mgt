const express = require('express');
const {
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
} = require('../controllers/farmController');

const { protect, authorize } = require('../middleware/auth');
const { validateFarm } = require('../middleware/validation');

const router = express.Router();

// Public routes (no auth required for basic data)
router.get('/districts', getDistricts);
router.get('/cultivation-zones/:zoneCode', getCultivationZoneDetails);

// Protected routes
router.use(protect);

router
  .route('/')
  .get(getFarms)
  .post(authorize('farm_owner', 'admin'), validateFarm, createFarm);

router
  .route('/by-district/:district')
  .get(getFarmsByDistrict);

router
  .route('/by-zone/:zoneCode')
  .get(getFarmsByZone);

router
  .route('/radius/:zipcode/:distance')
  .get(getFarmsInRadius);

router
  .route('/:id')
  .get(getFarm)
  .put(authorize('farm_owner', 'farm_manager', 'admin'), updateFarm)
  .delete(authorize('farm_owner', 'admin'), deleteFarm);

router
  .route('/:id/managers')
  .post(authorize('farm_owner', 'admin'), addManager);

router
  .route('/:id/managers/:managerId')
  .delete(authorize('farm_owner', 'admin'), removeManager);

module.exports = router;
