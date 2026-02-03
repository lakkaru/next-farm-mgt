/**
 * Migration Script: Export existing disease data to Sanity format
 * 
 * This script helps migrate existing hardcoded disease data to Sanity.io
 * Run this to generate JSON files that can be imported into Sanity
 */

const fs = require('fs');
const path = require('path');

// Existing nutrition deficiencies data
const nutritionalDeficiencies = [
    {
        id: 1,
        nutrient: 'Nitrogen (N)',
        severity: 'High Impact',
        symptoms: [
            'Uniform yellowing (chlorosis) starting from older leaf tips',
            'Stunted growth and reduced tillering',
            'Light green to yellow older leaves',
            'Younger leaves relatively greener',
            'Reduced plant vigor',
        ],
        visualSigns: [
            'Pale yellow-green coloration of entire plant',
            'V-shaped yellowing pattern from leaf tips',
            'Lower leaves affected first',
            'Symptoms progress upward',
        ],
        causes: [
            'Low soil nitrogen content',
            'Poor organic matter in soil',
            'Heavy rains washing away nitrogen',
            'Sandy soils with low retention',
            'Late or insufficient fertilizer application',
        ],
        treatment: [
            'Apply urea (46-0-0) at 20-25 kg/acre',
            'Split application: 50% basal, 25% tillering, 25% panicle initiation',
            'Use ammonium sulfate (21-0-0) for quick results',
            'Apply calcium ammonium nitrate (CAN) 15-20 kg/acre',
            'Foliar spray of 2% urea solution for quick greening',
        ],
        prevention: [
            'Regular soil testing before planting',
            'Incorporate green manure crops',
            'Apply compost or FYM at 5-10 tons/acre',
            'Use slow-release nitrogen fertilizers',
            'Practice balanced fertilization',
            'Avoid over-irrigation that causes nitrogen leaching',
        ],
        timing: 'Apply immediately at first signs. Response visible in 7-10 days',
        criticalStages: 'Tillering and panicle initiation stages',
    },
    // Add more deficiencies here...
];

// Transform to Sanity format
function transformToSanityFormat(deficiencies, categoryId) {
    return deficiencies.map((def, index) => ({
        _type: 'diseaseInfo',
        name: def.nutrient || def.name,
        scientificName: def.scientificName || '',
        category: {
            _type: 'reference',
            _ref: categoryId, // You'll need to create categories first and get their IDs
        },
        severity: def.severity === 'High Impact' ? 'high' : def.severity === 'Medium Impact' ? 'medium' : 'low',
        description: `Information about ${def.nutrient || def.name} deficiency in rice farming.`,
        symptoms: def.symptoms,
        visualSigns: def.visualSigns || [],
        causes: def.causes || [],
        treatment: def.treatment,
        prevention: def.prevention || [],
        timing: def.timing || '',
        criticalStages: def.criticalStages || '',
        commonRegions: def.commonRegions || [],
        seasonality: def.seasonality || '',
        economicImpact: def.economicImpact || '',
        order: index,
        isActive: true,
    }));
}

// Create category data
const categories = [
    {
        _type: 'diseaseCategory',
        name: 'Nutrition Deficiencies',
        slug: { _type: 'slug', current: 'nutrition-deficiencies' },
        description: 'Nutrient deficiencies and toxicities affecting rice plants',
        icon: 'Leaf',
        order: 1,
        isActive: true,
    },
    {
        _type: 'diseaseCategory',
        name: 'Insect Damage',
        slug: { _type: 'slug', current: 'insect-damage' },
        description: 'Damage caused by various insects and pests',
        icon: 'Bug',
        order: 2,
        isActive: true,
    },
    {
        _type: 'diseaseCategory',
        name: 'Fungal Diseases',
        slug: { _type: 'slug', current: 'fungal-diseases' },
        description: 'Diseases caused by fungal pathogens',
        icon: 'Droplets',
        order: 3,
        isActive: true,
    },
    {
        _type: 'diseaseCategory',
        name: 'Bacterial Diseases',
        slug: { _type: 'slug', current: 'bacterial-diseases' },
        description: 'Diseases caused by bacterial pathogens',
        icon: 'AlertCircle',
        order: 4,
        isActive: true,
    },
    {
        _type: 'diseaseCategory',
        name: 'Viral Diseases',
        slug: { _type: 'slug', current: 'viral-diseases' },
        description: 'Diseases caused by viral pathogens',
        icon: 'Shield',
        order: 5,
        isActive: true,
    },
    {
        _type: 'diseaseCategory',
        name: 'Environmental Stress',
        slug: { _type: 'slug', current: 'environmental-stress' },
        description: 'Stress conditions from environmental factors',
        icon: 'Zap',
        order: 6,
        isActive: true,
    },
];

// Generate output files
const outputDir = path.join(__dirname, 'sanity-migration-data');

if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
}

// Write categories
fs.writeFileSync(
    path.join(outputDir, 'categories.ndjson'),
    categories.map(cat => JSON.stringify(cat)).join('\n')
);

// Write nutrition deficiencies (you'll need the category ID after creating it in Sanity)
const nutritionDeficienciesData = transformToSanityFormat(
    nutritionalDeficiencies,
    'REPLACE_WITH_NUTRITION_CATEGORY_ID'
);

fs.writeFileSync(
    path.join(outputDir, 'nutrition-deficiencies.ndjson'),
    nutritionDeficienciesData.map(item => JSON.stringify(item)).join('\n')
);

console.log('✅ Migration files generated in:', outputDir);
console.log('\nNext steps:');
console.log('1. Create categories in Sanity Studio manually or import categories.ndjson');
console.log('2. Note the category IDs');
console.log('3. Update the category references in the disease data files');
console.log('4. Import using: sanity dataset import <file.ndjson> production');
console.log('\nOr manually copy-paste the data into Sanity Studio.');
