const mongoose = require('mongoose');
const User = require('../src/models/User');
require('dotenv').config();

async function checkDuplicateUsers() {
  try {
    console.log('🔍 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');

    // Get all users
    const users = await User.find({}, 'email contact.phone profile.firstName profile.lastName role');
    
    console.log(`📊 Total users in database: ${users.length}\n`);
    
    if (users.length === 0) {
      console.log('No users found in database.');
      return;
    }

    // Check for duplicate emails
    const emails = users.filter(u => u.email).map(u => u.email);
    const emailDuplicates = emails.filter((email, index) => emails.indexOf(email) !== index);
    
    // Check for duplicate phones
    const phones = users.map(u => u.contact?.phone).filter(p => p);
    const phoneDuplicates = phones.filter((phone, index) => phones.indexOf(phone) !== index);

    console.log('👥 Existing users:');
    users.forEach((user, index) => {
      console.log(`   ${index + 1}. ${user.profile.firstName} ${user.profile.lastName} (${user.role})`);
      console.log(`      Email: ${user.email || 'Not provided'}`);
      console.log(`      Phone: ${user.contact?.phone || 'Not provided'}\n`);
    });

    if (emailDuplicates.length > 0) {
      console.log('⚠️  Duplicate emails found:', emailDuplicates);
    }

    if (phoneDuplicates.length > 0) {
      console.log('⚠️  Duplicate phones found:', phoneDuplicates);
    }

    if (emailDuplicates.length === 0 && phoneDuplicates.length === 0) {
      console.log('✅ No duplicates found');
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await mongoose.connection.close();
    console.log('\n🔐 Database connection closed');
  }
}

// Run the script
checkDuplicateUsers();