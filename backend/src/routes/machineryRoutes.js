const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const {
  createMachinery,
  getAllMachinery,
  getNearbyMachinery,
  getMachinery,
  updateMachinery,
  deleteMachinery,
  getMyMachinery,
  createMachineryRequest,
  getMachineryRequests,
  getMyRequests,
  updateRequestStatus,
  rateMachineryService,
  searchMachineryByFarm
} = require('../controllers/machineryController');

// Public routes
router.get('/', getAllMachinery);
router.get('/nearby', getNearbyMachinery);
router.get('/:id', getMachinery);

// Protected routes
router.use(protect);

// Machinery owner routes
router.post('/', authorize('machinery_operator', 'admin'), createMachinery);
router.get('/my/listings', authorize('machinery_operator', 'admin'), getMyMachinery);
router.put('/:id', authorize('machinery_operator', 'admin'), updateMachinery);
router.delete('/:id', authorize('machinery_operator', 'admin'), deleteMachinery);
router.get('/:id/requests', authorize('machinery_operator', 'admin'), getMachineryRequests);
router.put('/requests/:id/status', authorize('machinery_operator', 'admin'), updateRequestStatus);

// Farmer routes
router.post('/requests', createMachineryRequest);
router.get('/requests/my', getMyRequests);
router.post('/requests/:id/rate', rateMachineryService);
router.get('/search-by-farm/:farmId', searchMachineryByFarm);

module.exports = router;
