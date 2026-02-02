const express = require('express');
const multer = require('multer');
const {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
  uploadProfileAvatar,
  changePassword,
  getUsers,
} = require('../controllers/userController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// Configure multer to store file in memory (buffer) for R2 upload
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: function (req, file, cb) {
    if (!file.mimetype.startsWith('image/')) {
      return cb(new Error('Only image files are allowed!'), false);
    }
    cb(null, true);
  }
});

// POST /api/users/register - Register user
router.post('/register', registerUser);

// POST /api/users/login - Login user
router.post('/login', loginUser);

// GET /api/users/profile - Get user profile
router.get('/profile', protect, getUserProfile);

// PUT /api/users/profile - Update user profile
router.put('/profile', protect, updateUserProfile);

// PUT /api/users/change-password - Change user password
router.put('/change-password', protect, changePassword);

// POST /api/users/profile/avatar - Upload profile avatar
router.post('/profile/avatar', protect, upload.single('avatar'), uploadProfileAvatar);

// GET /api/users - Get all users (admin only)
router.get('/', protect, authorize('admin'), getUsers);

module.exports = router;
