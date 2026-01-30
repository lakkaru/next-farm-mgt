const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs').promises;
const axios = require('axios');
const { protect } = require('../middleware/auth');
const { 
  validateImageUpload, 
  handleValidationErrors 
} = require('../middleware/validation');
const DiseaseReference = require('../models/DiseaseReference');
const AnalysisHistory = require('../models/AnalysisHistory');
const openaiService = require('../services/openaiService');

const router = express.Router();

// Configure multer for image uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = path.join(__dirname, '../uploads/disease-detection');
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    // Generate unique filename with timestamp
    const uniqueName = `disease_${Date.now()}_${Math.round(Math.random() * 1E9)}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: function (req, file, cb) {
    // Check file type
    if (!file.mimetype.startsWith('image/')) {
      return cb(new Error('Only image files are allowed!'), false);
    }
    cb(null, true);
  }
});

// Enhanced disease database with more detailed information
const diseaseDatabase = [
  {
    id: 1,
    name: 'Bacterial Leaf Blight',
    scientificName: 'Xanthomonas oryzae pv. oryzae',
    description: 'A serious bacterial disease affecting rice plants, causing yellowing and drying of leaves from tips and margins',
    symptoms: [
      'Yellow stripes along leaf margins starting from tips',
      'Wilting of leaves in severe infections',
      'Progressive drying from leaf tips toward base',
      'Water-soaked lesions that turn yellow then brown',
      'Stunted plant growth and reduced tillering',
      'Bacterial ooze visible in early morning on infected leaves'
    ],
    treatment: [
      'Apply copper-based bactericides (Copper oxychloride 50% WP @ 3g/L)',
      'Use streptomycin sulfate (200-300 ppm) during early infection',
      'Improve field drainage to reduce moisture and humidity',
      'Apply Pseudomonas fluorescens as biological control',
      'Remove and destroy infected plant debris immediately',
      'Apply balanced fertilizers avoiding excessive nitrogen',
      'Spray during early morning or late evening for better efficacy'
    ],
    prevention: [
      'Use certified disease-free seeds from reliable sources',
      'Plant resistant varieties like Improved Samba Mahsuri, IR20, IR36',
      'Maintain proper plant spacing (20×15 cm) for air circulation',
      'Avoid overhead irrigation during flowering and grain filling',
      'Practice 2-year crop rotation with non-host crops like legumes',
      'Apply organic matter and maintain soil pH between 5.5-6.5',
      'Avoid working in wet fields to prevent disease spread'
    ],
    severity: 'high',
    commonRegions: ['All rice growing regions, especially irrigated areas'],
    seasonality: 'Most common during monsoon season and high humidity periods',
    identificationFeatures: [
      'Yellow margin blight starting from leaf tips',
      'Lesions with wavy margins',
      'Bacterial streaming test positive',
      'Affects leaves, leaf sheaths, and panicles'
    ],
    similarDiseases: ['Brown Spot', 'Rice Blast leaf infection'],
    economicImpact: 'Can cause 20-80% yield loss in severe cases'
  },
  {
    id: 2,
    name: 'Brown Spot',
    scientificName: 'Bipolaris oryzae (Helminthosporium oryzae)',
    description: 'A fungal disease causing circular to oval brown spots on leaves, affecting grain quality and yield',
    symptoms: [
      'Circular to oval brown spots with dark brown margins',
      'Yellow to light brown halos around spots',
      'Spots on leaf sheaths, panicles, and grains',
      'Concentric rings visible within larger spots',
      'Premature leaf drying and death',
      'Dark brown to black spots on grains',
      'Reduced grain filling and quality'
    ],
    treatment: [
      'Apply systemic fungicides: Propiconazole 25% EC @ 1ml/L',
      'Use Mancozeb 75% WP @ 2-2.5g/L as protective fungicide',
      'Apply Tricyclazole 75% WP @ 0.6g/L for severe infections',
      'Spray at 10-day intervals starting from tillering stage',
      'Ensure good spray coverage on both sides of leaves',
      'Apply potash fertilizers (MOP) to strengthen plant resistance',
      'Improve field sanitation by removing crop debris'
    ],
    prevention: [
      'Use resistant varieties like MTU 1010, BPT 5204',
      'Maintain balanced NPK fertilization (avoid excess nitrogen)',
      'Ensure adequate potassium supply (K2O @ 40-60 kg/ha)',
      'Practice proper seed treatment with fungicides',
      'Maintain optimal water management avoiding water stress',
      'Remove infected stubble and practice clean cultivation',
      'Apply organic amendments to improve soil health'
    ],
    severity: 'medium',
    commonRegions: ['Upland areas', 'Rainfed rice systems', 'Areas with nutrient deficiency'],
    seasonality: 'Common during dry spells and nutrient stress periods',
    identificationFeatures: [
      'Circular spots with brown centers and darker margins',
      'Target-spot appearance with concentric rings',
      'Spots enlarge and coalesce over time',
      'Affects all above-ground plant parts'
    ],
    similarDiseases: ['Rice Blast', 'Narrow Brown Leaf Spot'],
    economicImpact: 'Can cause 10-45% yield loss depending on severity and growth stage'
  },
  {
    id: 3,
    name: 'Rice Blast',
    scientificName: 'Magnaporthe oryzae (Pyricularia oryzae)',
    description: 'A destructive fungal disease affecting all parts of rice plants, most devastating during reproductive stage',
    symptoms: [
      'Diamond-shaped lesions with gray centers and brown margins',
      'Eye-spot lesions on leaves with distinctive shape',
      'Neck rot causing panicle death above infection point',
      'Node rot leading to stem breaking and lodging',
      'Collar rot at junction of leaf blade and sheath',
      'Complete panicle death in severe neck blast cases',
      'White to gray fungal growth on lesions during humid conditions'
    ],
    treatment: [
      'Apply Tricyclazole 75% WP @ 0.6g/L as preventive measure',
      'Use Carbendazim 50% WP @ 1g/L for curative treatment',
      'Apply Isoprothiolane 40% EC @ 1.5ml/L for neck blast',
      'Spray Tebuconazole 25.9% EC @ 1ml/L during boot leaf stage',
      'Apply systemic fungicides at 7-10 day intervals',
      'Improve silicon availability through silicate fertilizers',
      'Implement alternate wetting and drying (AWD) irrigation'
    ],
    prevention: [
      'Plant blast-resistant varieties like Tetep derivatives',
      'Avoid excessive nitrogen fertilization (split application)',
      'Maintain proper plant spacing for air circulation',
      'Apply silicon-rich amendments (rice husk ash, silicate fertilizers)',
      'Practice field sanitation and remove infected debris',
      'Avoid late planting in blast-prone areas',
      'Use certified seeds and proper seed treatment'
    ],
    severity: 'high',
    commonRegions: ['Temperate and subtropical regions', 'High altitude areas', 'Areas with cool, humid nights'],
    seasonality: 'Cool, humid weather with temperature around 25-28°C and high relative humidity',
    identificationFeatures: [
      'Diamond-shaped lesions with distinct margins',
      'Gray center with brown/reddish-brown borders',
      'Lesions often have yellow halos',
      'Neck infection causes panicle death'
    ],
    similarDiseases: ['Brown Spot', 'Bacterial Leaf Blight neck infection'],
    economicImpact: 'Can cause complete crop loss in susceptible varieties under favorable conditions'
  },
  {
    id: 4,
    name: 'Sheath Blight',
    scientificName: 'Rhizoctonia solani',
    description: 'A soil-borne fungal disease affecting leaf sheaths and stems, favored by high humidity and dense canopy',
    symptoms: [
      'Oval to irregular lesions on leaf sheaths near water line',
      'Gray-white centers with brown margins on lesions',
      'Lesions progress upward from water level to flag leaf',
      'Sclerotia formation on infected tissues (small, dark, round structures)',
      'Premature ripening and poor grain filling',
      'Lodging due to weakened stems',
      'Reduced number of productive tillers'
    ],
    treatment: [
      'Apply Validamycin 3% L @ 2ml/L at tillering and boot leaf stages',
      'Use Hexaconazole 5% SC @ 2ml/L as systemic treatment',
      'Apply Propiconazole 25% EC @ 1ml/L for severe infections',
      'Spray Carbendazim + Mancozeb combination fungicides',
      'Use biological control agents like Trichoderma viride',
      'Apply neem-based products as organic alternative',
      'Ensure good spray coverage at lower plant parts'
    ],
    prevention: [
      'Maintain proper plant spacing to improve air circulation',
      'Avoid excessive nitrogen application, especially late in season',
      'Practice deep summer plowing to bury infected debris',
      'Use certified seeds and avoid seed-borne inoculum',
      'Practice crop rotation with non-host crops',
      'Maintain optimal water levels (avoid prolonged flooding)',
      'Apply silicon fertilizers to strengthen plant tissues'
    ],
    severity: 'medium',
    commonRegions: ['High humidity areas', 'Densely planted fields', 'Areas with poor air circulation'],
    seasonality: 'High temperature (28-32°C) and humidity (>95%) periods',
    identificationFeatures: [
      'Lesions start near water line on leaf sheaths',
      'Characteristic gray centers with brown borders',
      'Presence of sclerotia on infected tissues',
      'Lesions progress upward on the plant'
    ],
    similarDiseases: ['Stem rot', 'Other sheath diseases'],
    economicImpact: 'Can cause 15-25% yield loss, higher in susceptible varieties'
  },
  {
    id: 5,
    name: 'False Smut',
    scientificName: 'Ustilaginoidea virens',
    description: 'A fungal disease that converts individual rice grains into greenish-black masses of fungal tissue',
    symptoms: [
      'Individual grains transformed into greenish masses (smut balls)',
      'Masses later turn black and powdery when mature',
      'Affected grains become enlarged (3-4 times normal size)',
      'Grains filled with dark green to black spores',
      'Reduced grain yield and quality',
      'Smut balls easily detach from panicles',
      'Orange to yellow mycelia visible initially'
    ],
    treatment: [
      'Apply Propiconazole 25% EC @ 1ml/L during flowering initiation',
      'Use Tebuconazole 25.9% EC @ 1ml/L at boot leaf stage',
      'Apply copper-based fungicides as protective measure',
      'Remove and destroy infected panicles before spore release',
      'Improve field sanitation and drainage',
      'Apply balanced fertilizers avoiding excess nitrogen',
      'Practice crop rotation to break disease cycle'
    ],
    prevention: [
      'Use moderately resistant varieties where available',
      'Avoid excessive nitrogen fertilization during reproductive stage',
      'Ensure proper field drainage to prevent waterlogging',
      'Practice clean cultivation and remove volunteer plants',
      'Use certified disease-free seeds',
      'Avoid late planting in false smut-prone areas',
      'Maintain proper plant spacing for air circulation'
    ],
    severity: 'medium',
    commonRegions: ['High humidity coastal areas', 'Areas with prolonged flooding', 'Regions with cool, wet weather during flowering'],
    seasonality: 'During flowering stage under cool, wet, and humid conditions',
    identificationFeatures: [
      'Characteristic green to black smut balls replacing grains',
      'Smut balls much larger than normal grains',
      'Powdery black spores when mature',
      'Usually affects few grains per panicle'
    ],
    similarDiseases: ['Kernel smut', 'Black kernel disease'],
    economicImpact: 'Generally causes 1-5% yield loss but can reduce grain quality significantly'
  },
  {
    id: 6,
    name: 'Leaf Scald',
    scientificName: 'Monographella albescens',
    description: 'A fungal disease causing scalded appearance on leaves, common in humid conditions',
    symptoms: [
      'Large, irregular lesions with scalded appearance',
      'Lesions start as small brown spots and enlarge rapidly',
      'Zonate patterns within lesions',
      'Lesions may have yellow halos',
      'Severe infection can cause leaf death',
      'Affects leaf blades primarily'
    ],
    treatment: [
      'Apply preventive fungicides during early growth stages',
      'Use Mancozeb or Chlorothalonil based fungicides',
      'Improve air circulation in the field',
      'Remove infected plant debris'
    ],
    prevention: [
      'Plant resistant varieties',
      'Maintain proper plant spacing',
      'Avoid overhead irrigation',
      'Practice crop rotation'
    ],
    severity: 'low',
    commonRegions: ['Humid tropical areas'],
    seasonality: 'During high humidity periods',
    identificationFeatures: [
      'Large irregular lesions',
      'Scalded appearance',
      'Zonate patterns'
    ],
    similarDiseases: ['Brown Spot', 'Other leaf blights'],
    economicImpact: 'Usually causes minor yield losses'
  }
];

// Enhanced image analysis with OpenAI Vision API and reference image comparison
async function analyzeImage(imagePath, imageMetadata = {}) {
  try {
    const { size, type, timestamp = Date.now() } = imageMetadata;
    
    // Simulate image quality assessment
    const imageQuality = assessImageQuality(size, type);
    const seasonalFactors = getCurrentSeasonalFactors();
    
    // Try OpenAI Vision API first if available
    if (openaiService.isAvailable()) {
      try {
        console.log('Using OpenAI Vision API for disease detection...');
        const openaiResult = await openaiService.analyzeRicePlantImage(imagePath);
        
        if (openaiResult.success) {
          // Map OpenAI result to our format and enhance with local disease database
          const enhancedDiseases = enhanceOpenAIDiseases(openaiResult.diseases);
          
          return {
            isHealthy: openaiResult.isHealthy,
            healthScore: openaiResult.healthScore,
            diseases: enhancedDiseases,
            nutritionalDeficiencies: openaiResult.nutritionalDeficiencies || [],
            recommendations: [
              ...openaiResult.recommendations,
              ...generateAdvancedRecommendations(enhancedDiseases, openaiResult.healthScore, seasonalFactors)
            ],
            treatment: openaiResult.treatment || [],
            prevention: openaiResult.prevention || [],
            urgency: openaiResult.urgency || 'routine',
            notes: openaiResult.notes || '',
            analysisMetadata: {
              imageQuality: openaiResult.imageQuality,
              processingTime: Date.now() - timestamp,
              modelVersion: 'OpenAI GPT-4 Vision',
              confidenceLevel: calculateOverallConfidence(enhancedDiseases),
              environmentalFactors: seasonalFactors,
              analysisMethod: 'openai_vision',
              aiProvider: 'OpenAI',
              tokensUsed: openaiResult.metadata?.totalTokens || 0
            }
          };
        }
      } catch (openaiError) {
        console.error('OpenAI analysis failed, falling back to traditional method:', openaiError);
        // Fall through to traditional analysis
      }
    }
    
    // Fallback: Traditional analysis with reference image comparison
    console.log('Using traditional disease detection method...');
    
    // NEW: Attempt reference image comparison first
    let referenceBasedResults = null;
    try {
      referenceBasedResults = await performReferenceImageComparison(imagePath);
    } catch (error) {
      console.error('Reference comparison failed, falling back to simulated analysis:', error);
    }
    
    let detectedDiseases = [];
    let analysisMethod = 'traditional_ai';
    
    if (referenceBasedResults && referenceBasedResults.matches.length > 0) {
      // Use reference-based analysis
      detectedDiseases = processReferenceComparisonResults(referenceBasedResults);
      analysisMethod = 'reference_matching';
    } else {
      // Fall back to traditional analysis
      const possibleDiseases = diseaseDatabase.filter(disease => 
        isSeasonallyRelevant(disease, seasonalFactors)
      );
      detectedDiseases = simulateAdvancedDiseaseDetection(possibleDiseases, imageQuality);
      analysisMethod = 'traditional_ai';
    }
    
    // Calculate overall health score with multiple factors
    const healthScore = calculateHealthScore(detectedDiseases, seasonalFactors, imageQuality);
    
    return {
      isHealthy: detectedDiseases.length === 0 && healthScore > 80,
      healthScore,
      diseases: detectedDiseases,
      recommendations: generateAdvancedRecommendations(detectedDiseases, healthScore, seasonalFactors),
      analysisMetadata: {
        imageQuality,
        processingTime: Math.random() * 3000 + 2000, // 2-5 seconds
        modelVersion: '2.1.0',
        confidenceLevel: calculateOverallConfidence(detectedDiseases),
        environmentalFactors: seasonalFactors,
        analysisMethod, // Track which method was used
        referenceMatches: referenceBasedResults ? referenceBasedResults.matches.length : 0
      }
    };
  } catch (error) {
    console.error('Error in image analysis:', error);
    throw error;
  }
}

// Enhance OpenAI diseases with local database information
function enhanceOpenAIDiseases(openaiDiseases) {
  return openaiDiseases.map(disease => {
    // Try to match with local database for additional information
    const localDisease = diseaseDatabase.find(d => 
      d.name.toLowerCase() === disease.name.toLowerCase() ||
      d.scientificName.toLowerCase() === disease.scientificName.toLowerCase()
    );
    
    if (localDisease) {
      // Merge OpenAI detection with local database information
      return {
        ...localDisease,
        id: localDisease.id,
        confidence: disease.confidence,
        severity: disease.severity,
        affectedAreas: disease.affectedAreas || [],
        aiDetectedSymptoms: disease.symptoms || [],
        // Keep both local and AI-detected information
        treatment: [...new Set([...(disease.treatment || []), ...(localDisease.treatment || [])])],
        prevention: [...new Set([...(disease.prevention || []), ...(localDisease.prevention || [])])],
      };
    }
    
    // If not in local database, return OpenAI result as-is with generated ID
    return {
      ...disease,
      id: Math.floor(Math.random() * 10000),
    };
  });
}

// Helper function to convert image quality string to number (0-100)
function convertImageQualityToNumber(qualityString) {
  const qualityMap = {
    'excellent': 95,
    'good': 80,
    'fair': 60,
    'poor': 35,
    'very poor': 20,
    'unknown': 50
  };
  
  const normalized = (qualityString || 'fair').toLowerCase();
  return qualityMap[normalized] || 60;
}

// Helper function to map analysis method to database enum
function mapAnalysisMethodToEnum(analysisMethod) {
  const methodMap = {
    'openai_vision': 'ml_model',
    'reference_matching': 'reference_matching',
    'traditional_ai': 'ml_model',
    'hybrid': 'hybrid'
  };
  
  return methodMap[analysisMethod] || 'ml_model';
}

// NEW: Reference image comparison function
async function performReferenceImageComparison(imagePath) {
  try {
    // This would call our admin disease routes for comparison
    const filename = path.basename(imagePath);
    
    // Simulate API call to reference comparison
    // In production, this might be an internal service call
    const comparisonResponse = await axios.post(`http://localhost:5000/api/admin/diseases/compare-all`, {
      imagePath: filename
    }, {
      headers: {
        'Authorization': 'Bearer internal_service_token' // Would use proper auth
      }
    });
    
    return comparisonResponse.data.data;
  } catch (error) {
    console.error('Reference comparison API call failed:', error);
    return null;
  }
}

// NEW: Process reference comparison results into our expected format
function processReferenceComparisonResults(referenceResults) {
  const diseases = [];
  
  // Convert reference matching results to disease format
  referenceResults.results.forEach((result, index) => {
    if (result.bestMatch.similarity.overallScore > 50) { // Minimum threshold
      const diseaseFromDb = diseaseDatabase.find(d => d.id === result.diseaseId);
      
      if (diseaseFromDb) {
        diseases.push({
          ...diseaseFromDb,
          confidence: result.bestMatch.similarity.confidence,
          severity: adjustSeverityByReferenceMatch(diseaseFromDb.severity, result.bestMatch.similarity.overallScore),
          matchingFeatures: result.bestMatch.similarity.strongMatches,
          referenceMatchScore: result.bestMatch.similarity.overallScore,
          matchedReferenceImage: result.bestMatch.referenceImage.filename
        });
      }
    }
  });
  
  return diseases;
}

// NEW: Adjust severity based on reference matching score
function adjustSeverityByReferenceMatch(originalSeverity, matchScore) {
  if (matchScore > 85) return originalSeverity; // High confidence, keep original
  if (matchScore > 70) {
    // Good match, might reduce severity slightly
    if (originalSeverity === 'high') return 'medium';
    return originalSeverity;
  }
  if (matchScore > 50) {
    // Moderate match, reduce severity
    if (originalSeverity === 'high') return 'medium';
    if (originalSeverity === 'medium') return 'low';
    return 'low';
  }
  return 'low'; // Low match confidence
}

// Assess image quality for better analysis
function assessImageQuality(size, type) {
  let qualityScore = 70; // Base score
  
  // Size factors
  if (size > 2 * 1024 * 1024) qualityScore += 15; // >2MB
  else if (size > 1024 * 1024) qualityScore += 10; // >1MB
  else if (size < 500 * 1024) qualityScore -= 10; // <500KB
  
  // Type factors
  if (type === 'image/jpeg') qualityScore += 5;
  else if (type === 'image/png') qualityScore += 8;
  else if (type === 'image/heic') qualityScore += 10;
  
  return Math.min(Math.max(qualityScore, 30), 95);
}

// Get current seasonal factors for analysis
function getCurrentSeasonalFactors() {
  const now = new Date();
  const month = now.getMonth() + 1;
  
  // Sri Lankan seasonal patterns
  let season = 'dry';
  let humidity = 'medium';
  let temperature = 'medium';
  
  if (month >= 5 && month <= 9) { // Southwest monsoon
    season = 'wet';
    humidity = 'high';
    temperature = 'medium';
  } else if (month >= 10 && month <= 12) { // Northeast monsoon
    season = 'wet';
    humidity = 'high';
    temperature = 'low';
  } else if (month >= 1 && month <= 4) { // Dry season
    season = 'dry';
    humidity = 'low';
    temperature = 'high';
  }
  
  return { season, humidity, temperature, month };
}

// Check if disease is seasonally relevant
function isSeasonallyRelevant(disease, factors) {
  const { season, humidity, temperature } = factors;
  
  // High humidity diseases
  if (humidity === 'high' && ['Rice Blast', 'Sheath Blight', 'False Smut'].includes(disease.name)) {
    return Math.random() > 0.2; // 80% chance
  }
  
  // Dry season diseases
  if (season === 'dry' && ['Brown Spot'].includes(disease.name)) {
    return Math.random() > 0.3; // 70% chance
  }
  
  // Year-round diseases
  if (['Bacterial Leaf Blight'].includes(disease.name)) {
    return Math.random() > 0.4; // 60% chance
  }
  
  return Math.random() > 0.6; // 40% chance for other diseases
}

// Simulate advanced disease detection with realistic patterns
function simulateAdvancedDiseaseDetection(possibleDiseases, imageQuality) {
  const detectedDiseases = [];
  const maxDiseases = Math.random() > 0.7 ? 2 : 1; // Usually 1 disease, sometimes 2
  
  // Select diseases based on weighted probabilities
  const weightedDiseases = possibleDiseases
    .map(disease => ({
      ...disease,
      detectionProbability: calculateDetectionProbability(disease, imageQuality)
    }))
    .sort((a, b) => b.detectionProbability - a.detectionProbability);
  
  for (let i = 0; i < Math.min(maxDiseases, weightedDiseases.length); i++) {
    const disease = weightedDiseases[i];
    if (Math.random() < disease.detectionProbability) {
      const confidence = calculateDiseaseConfidence(disease, imageQuality, i === 0);
      
      detectedDiseases.push({
        ...disease,
        confidence,
        severity: adjustSeverityByConfidence(disease.severity, confidence)
      });
    }
  }
  
  return detectedDiseases;
}

// Calculate detection probability for each disease
function calculateDetectionProbability(disease, imageQuality) {
  let baseProbability = 0.3;
  
  // Severity affects detection probability
  if (disease.severity === 'high') baseProbability += 0.3;
  else if (disease.severity === 'medium') baseProbability += 0.2;
  else baseProbability += 0.1;
  
  // Image quality affects detection
  if (imageQuality > 80) baseProbability += 0.2;
  else if (imageQuality > 60) baseProbability += 0.1;
  else baseProbability -= 0.1;
  
  return Math.min(baseProbability, 0.8);
}

// Calculate confidence score for detected disease
function calculateDiseaseConfidence(disease, imageQuality, isPrimary) {
  let baseConfidence = isPrimary ? 75 : 60; // Primary disease gets higher confidence
  
  // Image quality impact
  baseConfidence += (imageQuality - 70) * 0.3;
  
  // Disease characteristics impact
  if (disease.severity === 'high') baseConfidence += 5;
  
  // Add some randomness for realism
  baseConfidence += (Math.random() - 0.5) * 15;
  
  return Math.round(Math.min(Math.max(baseConfidence, 45), 95));
}

// Adjust severity based on confidence
function adjustSeverityByConfidence(originalSeverity, confidence) {
  if (confidence > 85) return originalSeverity;
  if (confidence > 70) {
    if (originalSeverity === 'high') return 'medium';
    if (originalSeverity === 'medium') return 'low';
  }
  if (confidence < 60) {
    return 'low';
  }
  return originalSeverity;
}

// Calculate overall health score
function calculateHealthScore(diseases, seasonalFactors, imageQuality) {
  let healthScore = 90; // Start with healthy assumption
  
  // Deduct points for each disease
  diseases.forEach(disease => {
    let impact = 0;
    if (disease.severity === 'high') impact = 30;
    else if (disease.severity === 'medium') impact = 20;
    else impact = 10;
    
    // Adjust impact by confidence
    impact = impact * (disease.confidence / 100);
    healthScore -= impact;
  });
  
  // Environmental stress factors
  if (seasonalFactors.season === 'dry') healthScore -= 5;
  if (seasonalFactors.humidity === 'high') healthScore -= 3;
  
  // Image quality affects confidence in health assessment
  if (imageQuality < 60) healthScore += Math.random() * 20 - 10; // Add uncertainty
  
  return Math.round(Math.max(Math.min(healthScore, 95), 15));
}

// Calculate overall confidence in the analysis
function calculateOverallConfidence(diseases) {
  if (diseases.length === 0) return 85; // High confidence in healthy plants
  
  const avgConfidence = diseases.reduce((sum, d) => sum + d.confidence, 0) / diseases.length;
  return Math.round(avgConfidence);
}

// Generate advanced recommendations
function generateAdvancedRecommendations(diseases, healthScore, seasonalFactors) {
  const recommendations = [];
  
  if (diseases.length === 0) {
    recommendations.push('🌱 Your plant appears healthy! Continue with regular care and monitoring.');
    recommendations.push('📅 Perform weekly health checks to catch any issues early.');
    recommendations.push('💧 Maintain optimal water management based on current season.');
    
    if (seasonalFactors.humidity === 'high') {
      recommendations.push('🌧️ High humidity detected - monitor for fungal diseases.');
    }
    
    return recommendations;
  }
  
  // Priority recommendations based on disease severity
  const highSeverityDiseases = diseases.filter(d => d.severity === 'high');
  const mediumSeverityDiseases = diseases.filter(d => d.severity === 'medium');
  
  if (highSeverityDiseases.length > 0) {
    recommendations.push(`🚨 URGENT: Immediate treatment required for ${highSeverityDiseases[0].name}`);
    recommendations.push('👨‍🌾 Consult agricultural extension officer or plant pathologist immediately');
    recommendations.push('🚫 Isolate affected plants if possible to prevent spread');
  }
  
  if (healthScore < 40) {
    recommendations.push('⚠️ CRITICAL: Plant health is severely compromised - aggressive treatment needed');
  } else if (healthScore < 60) {
    recommendations.push('📊 Plant health is declining - monitor closely and apply treatments promptly');
  } else if (healthScore < 80) {
    recommendations.push('📈 Plant health is fair - preventive measures recommended');
  }
  
  // Treatment timing recommendations
  const currentHour = new Date().getHours();
  if (currentHour >= 6 && currentHour <= 10) {
    recommendations.push('⏰ OPTIMAL TIME: Apply treatments now (early morning) for best results');
  } else if (currentHour >= 16 && currentHour <= 18) {
    recommendations.push('⏰ GOOD TIME: Evening application recommended for fungicides');
  } else {
    recommendations.push('⏰ Apply treatments during early morning (6-10 AM) or evening (4-6 PM)');
  }
  
  // Seasonal recommendations
  if (seasonalFactors.season === 'wet') {
    recommendations.push('🌧️ Rainy season: Focus on drainage and fungal disease prevention');
  } else {
    recommendations.push('☀️ Dry season: Ensure adequate irrigation and watch for stress-related diseases');
  }
  
  // Follow-up recommendations
  recommendations.push('📸 Take follow-up photos in 7-10 days to track treatment progress');
  recommendations.push('📚 Keep treatment records for future reference and pattern analysis');
  
  // Additional specific recommendations based on detected diseases
  diseases.forEach(disease => {
    if (disease.name === 'Bacterial Leaf Blight' && disease.confidence > 80) {
      recommendations.push('💧 Reduce water levels temporarily and improve field drainage');
    }
    if (disease.name === 'Rice Blast' && seasonalFactors.temperature === 'low') {
      recommendations.push('🌡️ Cool weather detected - apply silicon fertilizers to strengthen plants');
    }
  });
  
  return recommendations;
}

// Routes

// Upload and analyze image
router.post('/analyze', protect, upload.single('image'), validateImageUpload, handleValidationErrors, async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No image file uploaded'
      });
    }

    const imagePath = req.file.path;
    
    // Prepare image metadata for enhanced analysis
    const imageMetadata = {
      size: req.file.size,
      type: req.file.mimetype,
      originalName: req.file.originalname,
      timestamp: Date.now()
    };
    
    // Analyze the image with enhanced logic (now includes reference comparison)
    const analysis = await analyzeImage(imagePath, imageMetadata);
    
    // Prepare analysis metadata for database (convert types as needed)
    const dbMetadata = {
      processingTime: analysis.analysisMetadata.processingTime || Date.now() - imageMetadata.timestamp,
      modelVersion: analysis.analysisMetadata.modelVersion || 'Unknown',
      imageQuality: convertImageQualityToNumber(analysis.imageQuality || analysis.analysisMetadata.imageQuality),
      confidenceLevel: analysis.analysisMetadata.confidenceLevel || 70,
      environmentalFactors: analysis.analysisMetadata.environmentalFactors || {},
      comparisonMethod: mapAnalysisMethodToEnum(analysis.analysisMetadata.analysisMethod)
    };
    
    // Save analysis to database for history tracking
    const detectionRecord = new AnalysisHistory({
      userId: req.user.id,
      uploadedImage: {
        filename: req.file.filename,
        originalName: req.file.originalname,
        size: req.file.size,
        mimeType: req.file.mimetype
      },
      analysisResults: {
        isHealthy: analysis.isHealthy,
        healthScore: analysis.healthScore,
        detectedDiseases: analysis.diseases.map(disease => ({
          diseaseId: disease.id,
          name: disease.name,
          scientificName: disease.scientificName,
          confidence: disease.confidence,
          severity: disease.severity,
          matchedReferences: disease.matchedReferenceImage ? [{
            referenceImageId: disease.matchedReferenceImage,
            similarityScore: disease.referenceMatchScore,
            matchingFeatures: disease.matchingFeatures || []
          }] : []
        })),
        recommendations: analysis.recommendations || []
      },
      analysisMetadata: dbMetadata,
      location: {
        farmId: req.body.farmId || null
      }
    });

    // Save to database
    try {
      await detectionRecord.save();
    } catch (dbError) {
      console.error('Error saving analysis history:', dbError);
      // Don't fail the request if history save fails
    }

    res.json({
      success: true,
      data: {
        ...analysis,
        imageUrl: `/api/disease-detection/image/${req.file.filename}`,
        analysisId: detectionRecord._id || `analysis_${Date.now()}`
      }
    });

  } catch (error) {
    console.error('Error analyzing image:', error);
    
    // Clean up uploaded file on error
    if (req.file) {
      try {
        await fs.unlink(req.file.path);
      } catch (unlinkError) {
        console.error('Error deleting uploaded file:', unlinkError);
      }
    }

    res.status(500).json({
      success: false,
      message: 'Failed to analyze image'
    });
  }
});

// Get disease information
router.get('/diseases', protect, (req, res) => {
  try {
    res.json({
      success: true,
      data: diseaseDatabase
    });
  } catch (error) {
    console.error('Error fetching diseases:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch disease information'
    });
  }
});

// Get specific disease details
router.get('/diseases/:id', protect, (req, res) => {
  try {
    const diseaseId = parseInt(req.params.id);
    const disease = diseaseDatabase.find(d => d.id === diseaseId);
    
    if (!disease) {
      return res.status(404).json({
        success: false,
        message: 'Disease not found'
      });
    }

    res.json({
      success: true,
      data: disease
    });
  } catch (error) {
    console.error('Error fetching disease details:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch disease details'
    });
  }
});

// Serve uploaded images
router.get('/image/:filename', (req, res) => {
  try {
    const filename = req.params.filename;
    const imagePath = path.join(__dirname, '../uploads/disease-detection', filename);
    
    res.sendFile(imagePath, (err) => {
      if (err) {
        res.status(404).json({
          success: false,
          message: 'Image not found'
        });
      }
    });
  } catch (error) {
    console.error('Error serving image:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to serve image'
    });
  }
});

// Get analysis history (optional feature)
router.get('/history', protect, async (req, res) => {
  try {
    // Mock history data - in real app, fetch from database
    const history = [
      {
        id: 1,
        date: new Date().toISOString(),
        imageName: 'plant_sample_1.jpg',
        result: 'Bacterial Leaf Blight detected',
        healthScore: 65
      }
    ];

    res.json({
      success: true,
      data: history
    });
  } catch (error) {
    console.error('Error fetching analysis history:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch analysis history'
    });
  }
});

module.exports = router;
