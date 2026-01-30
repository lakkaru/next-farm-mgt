const mongoose = require('mongoose');
const PaddyVariety = require('../models/PaddyVariety');
require('dotenv').config();

const seedPaddyVarieties = async () => {
  try {
    // Connect to database
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('Connected to MongoDB...');

    // Clear existing varieties
    await PaddyVariety.deleteMany({});
    console.log('Cleared existing paddy varieties');

    // Default paddy varieties data
    const defaultVarieties = [
      {
        name: 'BG 300',
        duration: 105,
        type: 'Short Duration',
        characteristics: {
          yield: 5.5,
          resistance: ['Brown Plant Hopper', 'Blast'],
          suitableZones: ['Wet Zone', 'Intermediate Zone']
        },
        description: 'High yielding short duration variety suitable for both seasons'
      },
      {
        name: 'BG 350',
        duration: 110,
        type: 'Short Duration',
        characteristics: {
          yield: 6.0,
          resistance: ['Blast', 'Bacterial Leaf Blight'],
          suitableZones: ['Wet Zone', 'Intermediate Zone']
        },
        description: 'Popular variety with good grain quality and disease resistance'
      },
      {
        name: 'BG 360',
        duration: 115,
        type: 'Medium Duration',
        characteristics: {
          yield: 6.5,
          resistance: ['Brown Plant Hopper', 'Blast', 'Bacterial Leaf Blight'],
          suitableZones: ['All Zones']
        },
        description: 'Widely adapted variety with excellent eating quality'
      },
      {
        name: 'BG 380',
        duration: 120,
        type: 'Medium Duration',
        characteristics: {
          yield: 7.0,
          resistance: ['Blast', 'Sheath Blight'],
          suitableZones: ['Wet Zone', 'Intermediate Zone']
        },
        description: 'High yielding variety with good milling quality'
      },
      {
        name: 'BG 400-1',
        duration: 125,
        type: 'Medium Duration',
        characteristics: {
          yield: 7.2,
          resistance: ['Brown Plant Hopper', 'Blast'],
          suitableZones: ['Intermediate Zone', 'Dry Zone']
        },
        description: 'Drought tolerant variety suitable for rainfed conditions'
      },
      {
        name: 'AT 362',
        duration: 110,
        type: 'Short Duration',
        characteristics: {
          yield: 5.8,
          resistance: ['Blast', 'Brown Plant Hopper'],
          suitableZones: ['Wet Zone', 'Intermediate Zone']
        },
        description: 'Early maturing variety with good grain quality'
      },
      {
        name: 'AT 405',
        duration: 120,
        type: 'Medium Duration',
        characteristics: {
          yield: 6.8,
          resistance: ['Blast', 'Bacterial Leaf Blight', 'Sheath Blight'],
          suitableZones: ['All Zones']
        },
        description: 'Multi-resistant variety with stable yield'
      },
      {
        name: 'BW 272-6B',
        duration: 105,
        type: 'Short Duration',
        characteristics: {
          yield: 5.2,
          resistance: ['Blast', 'Brown Plant Hopper'],
          suitableZones: ['Wet Zone']
        },
        description: 'Traditional variety with excellent taste'
      },
      {
        name: 'BW 351',
        duration: 115,
        type: 'Medium Duration',
        characteristics: {
          yield: 6.2,
          resistance: ['Blast', 'Bacterial Leaf Blight'],
          suitableZones: ['Wet Zone', 'Intermediate Zone']
        },
        description: 'Good quality rice with market preference'
      },
      {
        name: 'H 4',
        duration: 100,
        type: 'Short Duration',
        characteristics: {
          yield: 5.0,
          resistance: ['Blast'],
          suitableZones: ['Wet Zone']
        },
        description: 'Very early variety suitable for sequential cropping'
      },
      {
        name: 'BG 94-1',
        duration: 135,
        type: 'Medium Duration',
        characteristics: {
          yield: 7.5,
          resistance: ['Brown Plant Hopper', 'Blast', 'Bacterial Leaf Blight'],
          suitableZones: ['All Zones']
        },
        description: 'High yielding variety with excellent grain quality'
      },
      {
        name: 'BG 403',
        duration: 130,
        type: 'Medium Duration',
        characteristics: {
          yield: 7.8,
          resistance: ['Brown Plant Hopper', 'Blast'],
          suitableZones: ['Intermediate Zone', 'Dry Zone']
        },
        description: 'Latest high yielding variety with drought tolerance'
      }
    ];

    // Insert varieties
    const result = await PaddyVariety.insertMany(defaultVarieties);
    console.log(`Successfully seeded ${result.length} paddy varieties`);

    // Close database connection
    await mongoose.connection.close();
    console.log('Database connection closed');

  } catch (error) {
    console.error('Error seeding paddy varieties:', error);
    process.exit(1);
  }
};

// Run the seed function if this file is executed directly
if (require.main === module) {
  seedPaddyVarieties();
}

module.exports = seedPaddyVarieties;
