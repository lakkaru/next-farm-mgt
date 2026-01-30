const mongoose = require('mongoose');
const Farm = require('../models/Farm');
const { getZoneForDistrict } = require('../constants/districts');
const path = require('path');

// Load environment variables from the correct path
require('dotenv').config({ path: path.join(__dirname, '../../.env') });

const updateFarmsWithDistrictInfo = async () => {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    console.log('Updating farms with district information...');
    
    // Find all farms that don't have district or cultivation zone
    const farmsToUpdate = await Farm.find({
      $or: [
        { 'location.district': { $exists: false } },
        { 'location.district': null },
        { 'location.cultivationZone': { $exists: false } },
        { 'location.cultivationZone': null }
      ]
    });

    console.log(`Found ${farmsToUpdate.length} farms to update`);

    let updatedCount = 0;
    
    for (const farm of farmsToUpdate) {
      let needsUpdate = false;
      const updates = {};

      // If district is missing but city exists, try to map city to district
      if (!farm.location.district && farm.location.city) {
        // For existing farms, set district same as city if it's a valid district
        const zoneCode = getZoneForDistrict(farm.location.city);
        if (zoneCode) {
          updates['location.district'] = farm.location.city;
          needsUpdate = true;
        }
      }

      // If cultivation zone is missing but district exists, auto-populate
      if (!farm.location.cultivationZone && (farm.location.district || updates['location.district'])) {
        const district = updates['location.district'] || farm.location.district;
        const zoneCode = getZoneForDistrict(district);
        if (zoneCode) {
          updates['location.cultivationZone'] = zoneCode;
          needsUpdate = true;
        }
      }

      // Update the farm if there are changes
      if (needsUpdate) {
        await Farm.findByIdAndUpdate(farm._id, { $set: updates });
        updatedCount++;
        console.log(`Updated farm: ${farm.name} - District: ${updates['location.district'] || 'unchanged'}, Zone: ${updates['location.cultivationZone'] || 'unchanged'}`);
      }
    }

    console.log(`Successfully updated ${updatedCount} farms`);
    
  } catch (error) {
    console.error('Error updating farms:', error);
  } finally {
    await mongoose.connection.close();
    console.log('Database connection closed');
  }
};

// Run the update if this file is executed directly
if (require.main === module) {
  updateFarmsWithDistrictInfo();
}

module.exports = updateFarmsWithDistrictInfo;
