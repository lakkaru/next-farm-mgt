const jwt = require('jsonwebtoken');
const User = require('../models/User');
const asyncHandler = require('../utils/asyncHandler');
const AppError = require('../utils/AppError');

// Protect routes - authenticate user
const protect = asyncHandler(async (req, res, next) => {
  let token;
  
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }
  
  if (!token) {
    throw new AppError('Not authorized to access this route', 401);
  }
  
  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Get user from token
    const user = await User.findById(decoded.id);
    
    if (!user) {
      throw new AppError('No user found with this token', 401);
    }
    
    // Check if user account is active
    if (user.isActive === false) {
      throw new AppError('User account is deactivated', 401);
    }
    
    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      throw new AppError('Invalid token', 401);
    } else if (error.name === 'TokenExpiredError') {
      throw new AppError('Token expired', 401);
    } else {
      throw error;
    }
  }
});

// Authorize specific roles
const authorize = (...roles) => {
  return (req, res, next) => {
    // Support multi-role system (user.roles array) and backward compatibility (user.role)
    let userHasRole = false;
    let userRoles = [];
    
    // Check if user has roles array (new multi-role system)
    if (req.user.roles && Array.isArray(req.user.roles) && req.user.roles.length > 0) {
      userRoles = req.user.roles;
      userHasRole = req.user.roles.some(role => roles.includes(role));
    } 
    // Fallback to single role (backward compatibility)
    else if (req.user.role) {
      userRoles = [req.user.role];
      userHasRole = roles.includes(req.user.role);
    }
    
    if (!userHasRole) {
      const userRoleDisplay = userRoles.length > 0 
        ? userRoles.join(', ') 
        : 'no role assigned';
      const requiredRoles = roles.join(', ');
      throw new AppError(`User role(s) [${userRoleDisplay}] is not authorized to access this route. Required: [${requiredRoles}]`, 403);
    }
    next();
  };
};

// Check farm permissions
const checkFarmPermission = (permission) => {
  return asyncHandler(async (req, res, next) => {
    const { farmId } = req.params;
    
    if (!farmId) {
      throw new AppError('Farm ID is required', 400);
    }
    
    // Admin can access all farms - check both roles array and single role
    const isAdmin = (req.user.roles && Array.isArray(req.user.roles) && req.user.roles.includes('admin')) 
      || req.user.role === 'admin';
    
    if (isAdmin) {
      return next();
    }
    
    // Check if user has permission for this farm
    const userPermission = req.user.permissions.find(
      p => p.farm.toString() === farmId
    );
    
    if (!userPermission) {
      throw new AppError('Not authorized to access this farm', 403);
    }
    
    // Check specific permission
    if (!userPermission.permissions.includes(permission)) {
      throw new AppError(`Not authorized to ${permission} on this farm`, 403);
    }
    
    next();
  });
};

// Generate JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d'
  });
};

// Send token response
const sendTokenResponse = (user, statusCode, res) => {
  const token = generateToken(user._id);
  
  const options = {
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    httpOnly: true
  };
  
  if (process.env.NODE_ENV === 'production') {
    options.secure = true;
  }
  
  // Remove password from output
  user.password = undefined;
  
  res
    .status(statusCode)
    .cookie('token', token, options)
    .json({
      success: true,
      token,
      user
    });
};

// Helper function to check if user is admin (supports multi-role)
const isAdmin = (user) => {
  if (!user) return false;
  // Check roles array first (new multi-role system)
  if (user.roles && Array.isArray(user.roles)) {
    return user.roles.includes('admin');
  }
  // Fallback to single role (backward compatibility)
  return user.role === 'admin';
};

module.exports = {
  protect,
  authorize,
  checkFarmPermission,
  generateToken,
  sendTokenResponse,
  isAdmin
};
