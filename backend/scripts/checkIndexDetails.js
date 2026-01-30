const mongoose = require('mongoose');
const User = require('../src/models/User');
require('dotenv').config();

async function checkIndexDetails() {
  try {
    console.log('🔍 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');

    console.log('📊 Checking detailed index information...');
    const indexes = await User.collection.listIndexes().toArray();
    
    const emailIndex = indexes.find(idx => idx.name === 'email_1');
    console.log('Email index details:', JSON.stringify(emailIndex, null, 2));

    if (emailIndex && !emailIndex.sparse) {
      console.log('❌ Index is not sparse! Recreating...');
      
      // Drop and recreate
      await User.collection.dropIndex('email_1');
      await User.collection.createIndex(
        { email: 1 }, 
        { 
          unique: true, 
          sparse: true,
          background: true,
          name: 'email_1'
        }
      );
      console.log('✅ Recreated sparse index');
      
      // Verify
      const newIndexes = await User.collection.listIndexes().toArray();
      const newEmailIndex = newIndexes.find(idx => idx.name === 'email_1');
      console.log('New email index details:', JSON.stringify(newEmailIndex, null, 2));
    }

    // Clean up any test users first
    await User.deleteMany({ 'contact.phone': { $in: ['0712345678', '0712345679'] } });

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await mongoose.connection.close();
    console.log('\n🔐 Database connection closed');
  }
}

// Run the script
checkIndexDetails();