const mongoose = require('mongoose');
const User = require('../src/models/User');
require('dotenv').config();

async function fixEmailIndex() {
  try {
    console.log('🔍 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');

    console.log('📊 Checking current email index...');
    const indexes = await User.collection.getIndexes();
    console.log('Current indexes:', Object.keys(indexes));

    // Check users with null emails
    const nullEmailUsers = await User.find({ email: null }).countDocuments();
    const emptyEmailUsers = await User.find({ email: '' }).countDocuments();
    
    console.log(`Users with null email: ${nullEmailUsers}`);
    console.log(`Users with empty string email: ${emptyEmailUsers}`);

    // Drop the email index if it exists and is not sparse
    console.log('\n🔧 Dropping existing email index...');
    try {
      await User.collection.dropIndex('email_1');
      console.log('✅ Email index dropped');
    } catch (error) {
      if (error.message.includes('index not found')) {
        console.log('ℹ️  Email index not found (already dropped or doesn\'t exist)');
      } else {
        throw error;
      }
    }

    // Create sparse unique index for email
    console.log('🔧 Creating new sparse unique index for email...');
    await User.collection.createIndex(
      { email: 1 }, 
      { 
        unique: true, 
        sparse: true,
        background: true
      }
    );
    console.log('✅ New sparse email index created');

    // Convert any empty string emails to null
    console.log('\n🔧 Converting empty string emails to null...');
    const updateResult = await User.updateMany(
      { email: '' },
      { $unset: { email: 1 } }
    );
    console.log(`✅ Updated ${updateResult.modifiedCount} users with empty emails`);

    console.log('\n✅ Email index fix completed!');

  } catch (error) {
    console.error('❌ Error fixing email index:', error.message);
  } finally {
    await mongoose.connection.close();
    console.log('\n🔐 Database connection closed');
  }
}

// Run the script
fixEmailIndex();