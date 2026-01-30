const express = require('express');
const {
  getCrops,
  getCrop,
  createCrop,
  updateCrop,
  deleteCrop,
  updateCropStatus,
  addGrowthStage,
  addIrrigationRecord,
  getCropStats
} = require('../controllers/cropController');

const { protect, authorize } = require('../middleware/auth');
const { validateCrop } = require('../middleware/validation');

const router = express.Router();

router.use(protect);

router
  .route('/')
  .get(getCrops)
  .post(authorize('farm_owner', 'farm_manager', 'admin'), validateCrop, createCrop);

router
  .route('/stats')
  .get(getCropStats);

router
  .route('/:id')
  .get(getCrop)
  .put(authorize('farm_owner', 'farm_manager', 'admin'), updateCrop)
  .delete(authorize('farm_owner', 'farm_manager', 'admin'), deleteCrop);

router
  .route('/:id/status')
  .patch(authorize('farm_owner', 'farm_manager', 'worker', 'admin'), updateCropStatus);

router
  .route('/:id/growth-stages')
  .post(authorize('farm_owner', 'farm_manager', 'worker', 'admin'), addGrowthStage);

router
  .route('/:id/irrigation')
  .post(authorize('farm_owner', 'farm_manager', 'worker', 'admin'), addIrrigationRecord);

module.exports = router;
