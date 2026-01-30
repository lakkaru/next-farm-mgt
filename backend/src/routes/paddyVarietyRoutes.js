const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const {
  getPaddyVarieties,
  getPaddyVariety,
  createPaddyVariety,
  updatePaddyVariety,
  deletePaddyVariety,
} = require('../controllers/paddyVarietyController');
const { protect, authorize } = require('../middleware/auth');

// Validation rules
const paddyVarietyValidation = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Paddy variety name is required')
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be between 2 and 50 characters'),
  body('duration')
    .isInt({ min: 90, max: 180 })
    .withMessage('Duration must be between 90 and 180 days'),
  body('type')
    .isIn(['Short Duration', 'Medium Duration', 'Long Duration'])
    .withMessage('Invalid type selected'),
  body('characteristics.yield')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Yield must be a positive number'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Description cannot exceed 500 characters'),
];

// Apply protect middleware to all routes
router.use(protect);

// Routes
router
  .route('/')
  .get(getPaddyVarieties)
  .post(authorize('admin'), paddyVarietyValidation, createPaddyVariety);

router
  .route('/:id')
  .get(getPaddyVariety)
  .put(authorize('admin'), paddyVarietyValidation, updatePaddyVariety)
  .delete(authorize('admin'), deletePaddyVariety);

module.exports = router;
