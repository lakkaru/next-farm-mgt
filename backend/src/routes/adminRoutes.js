const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const { getFarmers, deleteFarmer, updateFarmer } = require('../controllers/adminController');

// All admin routes require authentication and admin role
router.use(protect);
router.use(authorize('admin'));

// GET /api/admin/farmers
router.get('/farmers', getFarmers);

// PUT /api/admin/farmers/:id - update farmer
// PUT /api/admin/farmers/:id - update farmer
router.put('/farmers/:id', updateFarmer);

// DELETE /api/admin/farmers/:id
router.delete('/farmers/:id', deleteFarmer);

module.exports = router;
