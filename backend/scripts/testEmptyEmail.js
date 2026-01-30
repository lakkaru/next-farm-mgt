const mongoose = require('mongoose');
const User = require('../src/models/User');
require('dotenv').config();

async function testEmptyEmailRegistration() {
  try {
    console.log('🔍 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');

    // Test data with empty email
    const testUserData = {
      profile: {
        firstName: 'Test',
        lastName: 'User',
      },
      contact: {
        phone: '0712345678', // Make sure this phone doesn't exist
      },
      password: 'testpass123',
      role: 'farm_owner',
      // Intentionally not setting email or setting it to empty string
      email: '' // This should be converted to null
    };

    console.log('🧪 Testing user creation with empty email...');
    
    // Check if phone already exists
    const existingUser = await User.findOne({ 'contact.phone': testUserData.contact.phone });
    if (existingUser) {
      console.log('⚠️  User with this phone already exists, deleting for test...');
      await User.deleteOne({ 'contact.phone': testUserData.contact.phone });
    }

    // Create user
    const user = await User.create(testUserData);
    console.log('✅ User created successfully!');
    console.log('   ID:', user._id);
    console.log('   Name:', user.fullName);
    console.log('   Phone:', user.contact.phone);
    console.log('   Email:', user.email === null ? 'null (correct!)' : user.email);

    // Try to create another user with empty email (should work)
    const testUserData2 = {
      profile: {
        firstName: 'Another',
        lastName: 'User',
      },
      contact: {
        phone: '0712345679', // Different phone
      },
      password: 'testpass123',
      role: 'farm_owner',
      email: '' // This should also be converted to null
    };

    console.log('\n🧪 Testing second user creation with empty email...');
    const user2 = await User.create(testUserData2);
    console.log('✅ Second user created successfully!');
    console.log('   ID:', user2._id);
    console.log('   Name:', user2.fullName);
    console.log('   Phone:', user2.contact.phone);
    console.log('   Email:', user2.email === null ? 'null (correct!)' : user2.email);

    console.log('\n✅ Test passed! Empty emails are handled correctly.');

    // Clean up test users
    await User.deleteMany({ 'contact.phone': { $in: ['0712345678', '0712345679'] } });
    console.log('🧹 Cleaned up test users');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    
    if (error.code === 11000) {
      console.log('This is a duplicate key error - the fix might not be working properly');
    }
  } finally {
    await mongoose.connection.close();
    console.log('\n🔐 Database connection closed');
  }
}

// Run the script
testEmptyEmailRegistration();