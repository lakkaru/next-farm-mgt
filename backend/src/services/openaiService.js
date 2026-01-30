const OpenAI = require('openai');
const fs = require('fs').promises;
const sharp = require('sharp');
const path = require('path');

class OpenAIService {
  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
    this.isEnabled = !!process.env.OPENAI_API_KEY;
  }

  /**
   * Preprocess image for better analysis
   * @param {string} imagePath - Path to the image file
   * @returns {Promise<Buffer>} Processed image buffer
   */
  async preprocessImage(imagePath) {
    try {
      const image = sharp(imagePath);
      const metadata = await image.metadata();

      console.log(`Original image: ${metadata.width}x${metadata.height}, format: ${metadata.format}`);

      // Resize if image is too large or too small
      let processedImage = image;
      
      if (metadata.width > 2048 || metadata.height > 2048) {
        // Resize large images while maintaining aspect ratio
        processedImage = processedImage.resize(2048, 2048, {
          fit: 'inside',
          withoutEnlargement: true
        });
        console.log('Resizing large image to max 2048px');
      } else if (metadata.width < 800 && metadata.height < 800) {
        // Enhance small images
        processedImage = processedImage.resize(800, 800, {
          fit: 'inside',
          kernel: 'lanczos3' // High quality upscaling
        });
        console.log('Upscaling small image to min 800px');
      }

      // Enhance image quality
      processedImage = processedImage
        .normalize() // Normalize contrast
        .sharpen() // Slight sharpening for better detail
        .jpeg({ quality: 95 }); // High quality JPEG

      const buffer = await processedImage.toBuffer();
      console.log(`Processed image size: ${buffer.length} bytes`);

      return buffer;
    } catch (error) {
      console.error('Error preprocessing image:', error);
      // If preprocessing fails, return original image
      return await fs.readFile(imagePath);
    }
  }

  /**
   * Analyze rice plant image for diseases using GPT-4 Vision
   * @param {string} imagePath - Path to the image file
   * @returns {Promise<Object>} Analysis results
   */
  async analyzeRicePlantImage(imagePath) {
    if (!this.isEnabled) {
      throw new Error('OpenAI API key is not configured');
    }

    try {
      // Preprocess image for better analysis
      const imageBuffer = await this.preprocessImage(imagePath);
      const base64Image = imageBuffer.toString('base64');
      const dataUrl = `data:image/jpeg;base64,${base64Image}`;

      // Create a detailed prompt for disease detection
      const prompt = this.createDiseaseDetectionPrompt();

      console.log('Sending image to OpenAI for analysis...');
      console.log('Processed image size:', imageBuffer.length, 'bytes');

      // Call OpenAI Vision API with improved parameters
      const response = await this.openai.chat.completions.create({
        model: "gpt-4o", // Best model for vision tasks
        messages: [
          {
            role: "system",
            content: "You are an expert rice pathologist. Always respond with valid JSON only, no markdown formatting."
          },
          {
            role: "user",
            content: [
              {
                type: "text",
                text: prompt
              },
              {
                type: "image_url",
                image_url: {
                  url: dataUrl,
                  detail: "high" // Use "high" for detailed analysis
                }
              }
            ]
          }
        ],
        max_tokens: 3000, // Increased for more detailed response
        temperature: 0.1, // Very low temperature for consistent, focused results
        top_p: 0.9,
        response_format: { type: "json_object" } // Force JSON response
      });

      console.log('OpenAI response received');
      console.log('Tokens used:', response.usage.total_tokens);

      // Parse the response
      const analysis = this.parseOpenAIResponse(response.choices[0].message.content);
      
      return {
        success: true,
        ...analysis,
        metadata: {
          model: response.model,
          promptTokens: response.usage.prompt_tokens,
          completionTokens: response.usage.completion_tokens,
          totalTokens: response.usage.total_tokens,
          finishReason: response.choices[0].finish_reason
        }
      };

    } catch (error) {
      console.error('OpenAI Vision API error:', error);
      
      // Better error messages
      if (error.code === 'insufficient_quota') {
        throw new Error('OpenAI API quota exceeded. Please check your billing.');
      } else if (error.code === 'invalid_api_key') {
        throw new Error('Invalid OpenAI API key. Please check your configuration.');
      } else if (error.status === 429) {
        throw new Error('Rate limit exceeded. Please try again in a moment.');
      }
      
      throw new Error(`Failed to analyze image: ${error.message}`);
    }
  }

  /**
   * Create a comprehensive prompt for rice disease detection
   */
  createDiseaseDetectionPrompt() {
    return `You are Dr. Sarah Chen, a world-renowned rice pathologist with 25 years of field experience diagnosing rice diseases across Asia. You've personally examined over 100,000 rice plants and published 50+ research papers on rice pathology.

CRITICAL INSTRUCTIONS:
1. Examine this rice plant image VERY CAREFULLY with extreme attention to detail
2. Look at EVERY visible part: leaves, stems, nodes, leaf sheaths, panicles, grain, roots if visible
3. Note EXACT colors, patterns, shapes, and locations of any abnormalities
4. Compare against your extensive mental database of rice disease symptoms
5. Be CONSERVATIVE with confidence scores - only give high confidence when symptoms are crystal clear
6. If you're unsure, say so and provide differential diagnoses
7. Consider the ENTIRE context: plant stage, environmental factors visible in image

WHAT TO LOOK FOR:

**FUNGAL DISEASES - Key Visual Markers:**

Rice Blast (Pyricularia oryzae):
- LEAF BLAST: Diamond/spindle-shaped lesions, gray-white centers with dark brown borders
- NECK BLAST: Dark brown/black lesions at panicle base, "broken neck" appearance
- NODE BLAST: Dark spots on nodes causing lodging
- Look for: Progressive lesion development, white to gray centers with distinct margins

Sheath Blight (Rhizoctonia solani):
- Elliptical/oval lesions on leaf sheaths near water line
- Greenish-gray initially → white centers → brown borders
- "Snake skin" or "banding" pattern, sclerotia (small dark bodies) may be visible
- Spreads upward from lower leaves

Brown Spot (Bipolaris oryzae):
- Circular to oval brown spots (2-10mm)
- Yellow halos around spots
- Dark brown margins, lighter centers
- On leaves, glumes, and grains
- Often indicates poor soil health/potassium deficiency

False Smut (Ustilaginoidea virens):
- Individual grains transformed into large (0.5-1cm) orange-yellow → greenish-black "smut balls"
- Velvety appearance, powdery spores
- Usually on individual grains within panicle

Bakanae (Gibberella fujikuroi):
- Abnormally tall, slender, pale yellowish-green seedlings
- "Foolish seedling" appearance
- Thin stems, excessive height compared to healthy plants

Sheath Rot (Sarocladium oryzae):
- Lesions on flag leaf sheath during booting stage
- Reddish-brown discoloration, rotting of sheath
- May see white-pink fungal growth

**BACTERIAL DISEASES:**

Bacterial Leaf Blight (Xanthomonas oryzae pv. oryzae):
- Yellow to white lesions starting from leaf tips/margins
- Wavy margins (distinct from blast which has straight margins)
- "Kresek" phase: Sudden wilting of whole plants (seedling stage)
- Bacterial ooze: Milky/cloudy droplets on lesions (morning, high humidity)
- Progresses from tips downward along leaf margins

Bacterial Panicle Blight:
- Water-soaked lesions on panicles
- Brown discoloration of grains
- Panicle base rot

**VIRAL DISEASES:**

Rice Tungro (transmitted by green leafhoppers):
- Stunting (most obvious symptom)
- Yellow-orange discoloration of leaves
- Reduced tillering
- Delayed flowering or no flowering

Grassy Stunt:
- Severe stunting, rosette appearance
- Excessive tillering (many small tillers)
- Dark green narrow leaves

Ragged Stunt:
- Twisted, ragged leaf blades
- Short, bunchy growth
- Leaves with jagged/torn edges

**NUTRITIONAL DEFICIENCIES:**

Nitrogen (N):
- Uniform yellowing (chlorosis) starting from older leaf tips
- Stunted growth, reduced tillering
- Light green to yellow older leaves
- Younger leaves relatively greener

Potassium (K):
- Yellow-orange discoloration starting from older leaf tips
- Margins turn brown and dry ("firing")
- Poor grain filling, small grains
- Weak stems (lodging)

Phosphorus (P):
- Dark green, narrow, erect leaves
- Severely stunted growth, very few tillers
- Purple coloration may appear
- Delayed maturity

Zinc (Zn):
- Chlorosis (whitening) of mid-vein on younger leaves
- Brown dusty spots on older leaves
- Reduced plant height
- Symptoms appear 2-4 weeks after transplanting

Iron (Fe) Deficiency:
- Interveinal chlorosis on youngest leaves
- Yellow to white new growth
- Growth severely stunted

Iron (Fe) Toxicity (Bronzing):
- Small brown spots coalescing into larger areas
- "Bronzed" or rusty appearance
- Affects older leaves first
- Common in poorly drained acidic soils

Sulfur (S):
- Uniform light green to yellow color (whole plant)
- Similar to N but affects younger leaves more

**ENVIRONMENTAL/PHYSIOLOGICAL:**

Heat Stress:
- Whitehead/unfilled panicles
- Bleached/white spikelets
- Occurs after high temp (>33-35°C) during flowering

Cold Damage:
- White/yellow discoloration
- Tip burn
- Poor germination

**ANALYSIS PROTOCOL:**

Step 1: Image Quality Assessment
- Lighting: Good/poor
- Focus: Sharp/blurry
- Coverage: Full plant/partial/close-up
- Angle: Top/side/multiple parts visible

Step 2: Plant Assessment
- Growth stage: Seedling/vegetative/reproductive/maturity
- Overall appearance: Healthy/stressed/diseased
- Uniformity: Even/patchy symptoms

Step 3: Symptom Detection
- Location: Which plant parts affected?
- Pattern: Localized/spreading/systemic?
- Color: Exact shades (yellow/brown/white/gray/black)?
- Shape: Round/oval/spindle/irregular?
- Size: Small spots/large lesions/entire leaf?
- Progression: Early/mid/late stage?

Step 4: Differential Diagnosis
- List all possible causes
- Rank by likelihood based on symptoms
- Note distinguishing features

Step 5: Confidence Assessment
- High (90-100%): Textbook symptoms, no doubt
- Medium (70-89%): Strong match but some atypical features
- Low (50-69%): Possible match but needs confirmation
- Very Low (<50%): Multiple possibilities, unclear

**OUTPUT FORMAT (MUST BE VALID JSON, NO MARKDOWN):**

{
  "isHealthy": boolean,
  "healthScore": number (0-100),
  "imageQuality": "excellent/good/fair/poor",
  "imageAnalysis": {
    "lighting": "good/poor/moderate",
    "focus": "sharp/acceptable/blurry",
    "plantParts": ["leaf", "stem", "panicle", etc],
    "growthStage": "seedling/vegetative/reproductive/mature"
  },
  "diseases": [
    {
      "name": "Common Name",
      "scientificName": "Scientific name (Genus species)",
      "confidence": number (50-100, be conservative!),
      "severity": "high/medium/low",
      "affectedAreas": ["specific locations"],
      "symptoms": ["exact symptoms observed in THIS image"],
      "description": "Detailed explanation of what you see and why you diagnosed this",
      "evidenceScore": number (0-100, how strong is visual evidence),
      "differentialDiagnosis": ["other possible diseases if any"]
    }
  ],
  "nutritionalDeficiencies": [
    {
      "nutrient": "Element name",
      "severity": "high/medium/low",
      "confidence": number,
      "symptoms": ["exact symptoms visible"],
      "affectedArea": "which leaves/parts"
    }
  ],
  "treatment": [
    "Specific actionable treatment (product names, dosages, timing)",
    "Alternative treatment if first-line unavailable"
  ],
  "prevention": [
    "Specific preventive measures"
  ],
  "recommendations": [
    "Immediate actions ranked by priority",
    "Monitoring advice",
    "When to seek expert help"
  ],
  "urgency": "immediate/soon/routine/none",
  "confidence": "high/medium/low",
  "notes": "Any uncertainties, alternative diagnoses, or important caveats",
  "followUp": "What additional information would help (different angle, close-up, etc)"
}

**IMPORTANT RULES:**
1. If image is unclear → set imageQuality to "poor" and lower all confidence scores
2. If no disease visible → return empty diseases array, isHealthy: true
3. Only list diseases you can actually see evidence for
4. Be honest about uncertainty - better to say "possible X or Y" than guess wrong
5. Never make up symptoms not visible in the image
6. If plant looks healthy but farmer concerned → suggest preventive monitoring
7. Consider that multiple issues can occur simultaneously
8. Provide practical, actionable advice farmers can actually implement

RESPOND WITH JSON ONLY - NO MARKDOWN, NO EXPLANATORY TEXT BEFORE OR AFTER.`;
  }

  /**
   * Parse OpenAI response and structure it properly
   */
  parseOpenAIResponse(responseText) {
    try {
      // Try to extract JSON from markdown code blocks if present
      let jsonText = responseText.trim();
      
      // Remove markdown code blocks if present
      if (jsonText.startsWith('```json')) {
        jsonText = jsonText.replace(/^```json\s*/, '').replace(/\s*```$/, '');
      } else if (jsonText.startsWith('```')) {
        jsonText = jsonText.replace(/^```\s*/, '').replace(/\s*```$/, '');
      }

      const parsed = JSON.parse(jsonText);

      // Validate and structure the response
      const result = {
        isHealthy: parsed.isHealthy !== false, // Default to healthy if not specified
        healthScore: this.validateScore(parsed.healthScore || 70),
        imageQuality: parsed.imageQuality || 'fair',
        imageAnalysis: parsed.imageAnalysis || {},
        diseases: this.formatDiseases(parsed.diseases || []),
        nutritionalDeficiencies: this.formatNutritionalDeficiencies(parsed.nutritionalDeficiencies || []),
        treatment: Array.isArray(parsed.treatment) ? parsed.treatment : [],
        prevention: Array.isArray(parsed.prevention) ? parsed.prevention : [],
        recommendations: Array.isArray(parsed.recommendations) ? parsed.recommendations : [],
        urgency: this.validateUrgency(parsed.urgency),
        confidence: parsed.confidence || 'medium',
        notes: parsed.notes || '',
        followUp: parsed.followUp || '',
        analysisMethod: 'OpenAI GPT-4 Vision',
        aiGenerated: true
      };

      // Add warning if image quality is poor
      if (result.imageQuality === 'poor') {
        result.recommendations.unshift('⚠️ Image quality is poor. For more accurate diagnosis, please upload a clearer, well-lit image.');
      }

      // Adjust health score based on diseases
      if (result.diseases.length > 0 && result.healthScore > 80) {
        const maxSeverity = Math.max(...result.diseases.map(d => 
          d.severity === 'high' ? 70 : d.severity === 'medium' ? 50 : 30
        ));
        result.healthScore = Math.max(30, result.healthScore - maxSeverity);
      }

      return result;
    } catch (error) {
      console.error('Error parsing OpenAI response:', error);
      console.error('Raw response:', responseText);
      
      // Return a structured error response
      return {
        isHealthy: false,
        healthScore: 50,
        imageQuality: 'unknown',
        imageAnalysis: {},
        diseases: [],
        nutritionalDeficiencies: [],
        treatment: ['Unable to complete analysis. Please try with a clearer image.'],
        prevention: [],
        recommendations: [
          'The AI analysis encountered an error. Please try again.',
          'Ensure the image is clear, well-lit, and shows the affected plant parts.',
          'Consult with a local agricultural expert for accurate diagnosis.'
        ],
        urgency: 'routine',
        confidence: 'low',
        notes: 'Analysis failed to parse properly. The AI response may need manual review.',
        followUp: 'Please upload a clearer image showing the symptoms',
        analysisMethod: 'OpenAI GPT-4 Vision (parsing error)',
        aiGenerated: true,
        error: error.message,
        rawResponse: responseText.substring(0, 500) // First 500 chars for debugging
      };
    }
  }

  /**
   * Format diseases with proper structure
   */
  formatDiseases(diseases) {
    if (!Array.isArray(diseases)) return [];
    
    return diseases.map((disease, index) => ({
      id: index + 1,
      name: disease.name || 'Unknown Disease',
      scientificName: disease.scientificName || '',
      confidence: this.validateScore(disease.confidence || 50),
      severity: this.validateSeverity(disease.severity),
      affectedAreas: Array.isArray(disease.affectedAreas) ? disease.affectedAreas : [],
      symptoms: Array.isArray(disease.symptoms) ? disease.symptoms : [],
      description: disease.description || '',
      evidenceScore: disease.evidenceScore || disease.confidence || 50,
      differentialDiagnosis: Array.isArray(disease.differentialDiagnosis) ? disease.differentialDiagnosis : [],
      // Add default treatment and prevention if not in disease object
      treatment: Array.isArray(disease.treatment) ? disease.treatment : [],
      prevention: Array.isArray(disease.prevention) ? disease.prevention : []
    }));
  }

  /**
   * Format nutritional deficiencies
   */
  formatNutritionalDeficiencies(deficiencies) {
    if (!Array.isArray(deficiencies)) return [];
    
    return deficiencies.map(def => ({
      nutrient: def.nutrient || 'Unknown',
      severity: this.validateSeverity(def.severity),
      confidence: this.validateScore(def.confidence || 50),
      symptoms: Array.isArray(def.symptoms) ? def.symptoms : [],
      affectedArea: def.affectedArea || 'Not specified'
    }));
  }

  /**
   * Validate confidence/health score (0-100)
   */
  validateScore(score) {
    const num = parseInt(score);
    if (isNaN(num)) return 50;
    return Math.max(0, Math.min(100, num));
  }

  /**
   * Validate severity level
   */
  validateSeverity(severity) {
    const validSeverities = ['high', 'medium', 'low'];
    const normalized = (severity || '').toLowerCase();
    return validSeverities.includes(normalized) ? normalized : 'medium';
  }

  /**
   * Validate urgency level
   */
  validateUrgency(urgency) {
    const validUrgencies = ['immediate', 'soon', 'routine', 'none'];
    const normalized = (urgency || '').toLowerCase();
    return validUrgencies.includes(normalized) ? normalized : 'routine';
  }

  /**
   * Get MIME type from file path
   */
  getMimeType(filePath) {
    const ext = filePath.toLowerCase().split('.').pop();
    const mimeTypes = {
      'jpg': 'image/jpeg',
      'jpeg': 'image/jpeg',
      'png': 'image/png',
      'gif': 'image/gif',
      'webp': 'image/webp',
      'heic': 'image/heic'
    };
    return mimeTypes[ext] || 'image/jpeg';
  }

  /**
   * Check if OpenAI service is available
   */
  isAvailable() {
    return this.isEnabled;
  }
}

// Create singleton instance
const openaiService = new OpenAIService();

module.exports = openaiService;
