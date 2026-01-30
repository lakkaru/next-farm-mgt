const express = require('express');
// Inventory routes
const router = express.Router();

const { protect, authorize } = require('../middleware/auth');

router.use(protect);

// GET /api/inventory - Get all inventory items
router.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Get all inventory items - To be implemented'
  });
});

// POST /api/inventory - Create inventory item
router.post('/', authorize('farm_owner', 'farm_manager', 'admin'), (req, res) => {
  res.status(201).json({
    success: true,
    message: 'Create inventory item - To be implemented'
  });
});

// GET /api/inventory/:id - Get single inventory item
router.get('/:id', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Get single inventory item - To be implemented'
  });
});

// PUT /api/inventory/:id - Update inventory item
router.put('/:id', authorize('farm_owner', 'farm_manager', 'admin'), (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Update inventory item - To be implemented'
  });
});

// DELETE /api/inventory/:id - Delete inventory item
router.delete('/:id', authorize('farm_owner', 'farm_manager', 'admin'), (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Delete inventory item - To be implemented'
  });
});

// POST /api/inventory/:id/transactions - Add transaction
router.post('/:id/transactions', authorize('farm_owner', 'farm_manager', 'worker', 'admin'), (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Add inventory transaction - To be implemented'
  });
});

module.exports = router;
