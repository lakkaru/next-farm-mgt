const mongoose = require('mongoose');
const User = require('../src/models/User');
require('dotenv').config();

async function testRegistrationFinal() {
  try {
    console.log('🔍 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');

    // Clean up existing null/empty emails by removing the field entirely
    console.log('🧹 Cleaning up existing null/empty emails...');
    await User.updateMany(
      { $or: [{ email: null }, { email: '' }] },
      { $unset: { email: 1 } }
    );
    console.log('✅ Cleaned up existing emails');

    // Clean up any test users
    await User.deleteMany({ 'contact.phone': { $in: ['0712345678', '0712345679'] } });

    // Test 1: Create user with no email field
    console.log('\n🧪 Test 1: Creating user with no email...');
    const user1 = await User.create({
      profile: {
        firstName: 'Test1',
        lastName: 'User',
      },
      contact: {
        phone: '0712345678',
      },
      password: 'testpass123',
      role: 'farm_owner'
      // No email field at all
    });
    console.log('✅ User 1 created successfully!');
    console.log('   Email field exists:', 'email' in user1);
    console.log('   Email value:', user1.email);

    // Test 2: Create another user with no email field
    console.log('\n🧪 Test 2: Creating second user with no email...');
    const user2 = await User.create({
      profile: {
        firstName: 'Test2',
        lastName: 'User',
      },
      contact: {
        phone: '0712345679',
      },
      password: 'testpass123',
      role: 'farm_owner'
      // No email field at all
    });
    console.log('✅ User 2 created successfully!');
    console.log('   Email field exists:', 'email' in user2);
    console.log('   Email value:', user2.email);

    console.log('\n✅ All tests passed! Users without email can be created successfully.');

    // Clean up
    await User.deleteMany({ 'contact.phone': { $in: ['0712345678', '0712345679'] } });
    console.log('🧹 Cleaned up test users');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  } finally {
    await mongoose.connection.close();
    console.log('\n🔐 Database connection closed');
  }
}

// Run the script
testRegistrationFinal();