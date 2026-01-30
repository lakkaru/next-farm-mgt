const mongoose = require('mongoose');
const User = require('../src/models/User');
require('dotenv').config();

// Admin user configuration
const adminConfig = {
  email: 'admin@farm-mgt.com',
  password: 'admin123456', // Change this to a secure password
  profile: {
    firstName: 'System',
    lastName: 'Administrator',
  },
  role: 'admin',
  contact: {
    phone: '+94701234567',
    address: {
      city: 'Colombo',
      state: 'Western Province',
      country: 'Sri Lanka'
    }
  },
  isEmailVerified: true,
  isActive: true
};

// Expert user configuration (for disease management)
const expertConfig = {
  email: 'expert@farm-mgt.com',
  password: 'expert123456', // Change this to a secure password
  profile: {
    firstName: 'Agricultural',
    lastName: 'Expert',
  },
  role: 'expert',
  contact: {
    phone: '+94701234568',
    address: {
      city: 'Peradeniya',
      state: 'Central Province',
      country: 'Sri Lanka'
    }
  },
  isEmailVerified: true,
  isActive: true
};

async function createAdminUsers() {
  try {
    // Connect to MongoDB
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ Connected to MongoDB');

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: adminConfig.email });
    if (existingAdmin) {
      console.log('⚠️  Admin user already exists:', adminConfig.email);
    } else {
      // Create admin user
      const adminUser = await User.create(adminConfig);
      console.log('✅ Admin user created successfully:');
      console.log('   Email:', adminUser.email);
      console.log('   Role:', adminUser.role);
      console.log('   Name:', adminUser.fullName);
    }

    // Check if expert already exists
    const existingExpert = await User.findOne({ email: expertConfig.email });
    if (existingExpert) {
      console.log('⚠️  Expert user already exists:', expertConfig.email);
    } else {
      // Create expert user
      const expertUser = await User.create(expertConfig);
      console.log('✅ Expert user created successfully:');
      console.log('   Email:', expertUser.email);
      console.log('   Role:', expertUser.role);
      console.log('   Name:', expertUser.fullName);
    }

    console.log('\n🎉 Admin setup completed!');
    console.log('\n📝 Login Credentials:');
    console.log('   Admin - Email: admin@farm-mgt.com, Password: admin123456');
    console.log('   Expert - Email: expert@farm-mgt.com, Password: expert123456');
    console.log('\n⚠️  IMPORTANT: Change these passwords after first login!');

  } catch (error) {
    console.error('❌ Error creating admin users:', error);
    
    if (error.name === 'ValidationError') {
      console.error('Validation errors:');
      Object.values(error.errors).forEach(err => {
        console.error('  -', err.message);
      });
    }
  } finally {
    await mongoose.connection.close();
    console.log('📤 Database connection closed');
    process.exit();
  }
}

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.error('Unhandled Promise Rejection:', err.message);
  process.exit(1);
});

// Run the script
if (require.main === module) {
  console.log('🚀 Setting up admin users for Farm Management System...\n');
  createAdminUsers();
}

module.exports = { createAdminUsers };
