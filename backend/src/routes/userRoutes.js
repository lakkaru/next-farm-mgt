const express = require('express');
const multer = require('multer');
const path = require('path');
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

// Configure multer for avatar uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = path.join(__dirname, '../uploads/avatars');
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    const uniqueName = `avatar_${req.user._id}_${Date.now()}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  }
});

const upload = multer({
  storage: storage,
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

// GET /api/users/avatar/:filename - Serve avatar images
router.get('/avatar/:filename', (req, res) => {
  try {
    const filename = req.params.filename;
    const imagePath = path.join(__dirname, '../uploads/avatars', filename);
    
    res.sendFile(imagePath, (err) => {
      if (err) {
        res.status(404).json({
          success: false,
          message: 'Avatar not found',
        });
      }
    });
  } catch (error) {
    console.error('Error serving avatar:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to serve avatar',
    });
  }
});

// GET /api/users - Get all users (admin only)
router.get('/', protect, authorize('admin'), getUsers);

module.exports = router;
