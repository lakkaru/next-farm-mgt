'use client'

import { useState } from 'react'
import { useI18n } from '@/contexts/i18n-context'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  AlertCircle,
  Beaker,
  CheckCircle2,
  Info,
  Leaf,
  Pill,
  Shield,
  Zap,
} from 'lucide-react'

interface Deficiency {
  id: number
  nutrient: string
  severity: 'High Impact' | 'Medium Impact'
  symptoms: string[]
  visualSigns: string[]
  causes: string[]
  treatment: string[]
  prevention: string[]
  timing: string
  criticalStages: string
  imageUrl: string
}

const nutritionalDeficiencies: Deficiency[] = [
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
    imageUrl: '/images/deficiencies/nitrogen.jpg',
  },
  {
    id: 2,
    nutrient: 'Potassium (K)',
    severity: 'High Impact',
    symptoms: [
      'Yellow-orange discoloration starting from older leaf tips',
      'Leaf margins turn yellowish-brown and dry up ("firing")',
      'Poor grain filling and small grains',
      'Weak stems prone to lodging',
      'Dark brown necrotic spots on leaves',
    ],
    visualSigns: [
      'Brown scorched appearance on leaf margins',
      'Symptoms start from tips and edges',
      'Older leaves die prematurely',
      'Stems become weak and break easily',
    ],
    causes: [
      'Low potassium in soil',
      'High nitrogen application without potassium',
      'Sandy or acidic soils',
      'Continuous rice cultivation',
      'Straw removal from fields',
    ],
    treatment: [
      'Apply muriate of potash (KCl) at 15-20 kg/acre',
      'Use potassium sulfate for saline soils',
      'Apply 2% KCl foliar spray',
      'Split application: 50% basal, 50% at panicle initiation',
      'Emergency: Potassium nitrate foliar spray',
    ],
    prevention: [
      'Maintain K:N ratio of 1:1 or higher',
      'Return rice straw to fields',
      'Apply farmyard manure',
      'Use potassium-rich organic fertilizers',
      'Soil testing every season',
      'Avoid excessive nitrogen without potassium',
    ],
    timing: 'Critical at tillering and flowering stages',
    criticalStages: 'Tillering, flowering, and grain filling',
    imageUrl: '/images/deficiencies/potassium.jpg',
  },
  {
    id: 3,
    nutrient: 'Phosphorus (P)',
    severity: 'Medium Impact',
    symptoms: [
      'Dark green, narrow, erect leaves',
      'Severely stunted growth',
      'Very few tillers',
      'Purple coloration may appear on leaves',
      'Delayed maturity',
      'Poor root development',
    ],
    visualSigns: [
      'Plants remain small and compact',
      'Dark bluish-green color',
      'Purplish tint on leaves and stems',
      'Reduced plant height throughout growth',
    ],
    causes: [
      'Acidic or alkaline soils fixing phosphorus',
      'Low organic matter',
      'Iron or aluminum toxicity',
      'Cold soil temperatures',
      'Waterlogged conditions',
    ],
    treatment: [
      'Apply single superphosphate (SSP) at 30-40 kg/acre',
      'Use diammonium phosphate (DAP) 20-25 kg/acre',
      'Apply rock phosphate in acidic soils',
      'Broadcast and incorporate before planting',
      'Use water-soluble phosphorus for quick action',
    ],
    prevention: [
      'Soil pH maintenance (6.0-7.0)',
      'Apply phosphorus at planting time',
      'Incorporate organic matter',
      'Use phosphorus-solubilizing bacteria',
      'Apply lime in acidic soils',
      'Ensure good drainage',
    ],
    timing: 'Best as basal application before transplanting',
    criticalStages: 'Early vegetative growth',
    imageUrl: '/images/deficiencies/phosphorus.jpg',
  },
  {
    id: 4,
    nutrient: 'Zinc (Zn)',
    severity: 'High Impact',
    symptoms: [
      'Dusty brown spots or blotches on older leaves',
      'Chlorosis (whitening) of mid-veins in younger leaves',
      'Reduced plant height',
      'Bronzing of leaves',
      'Stunted growth 2-4 weeks after transplanting',
    ],
    visualSigns: [
      'Brown rusty spots on lower leaves',
      'White or light green mid-ribs',
      'Uneven plant height in field',
      'Plants fail to recover after transplanting shock',
    ],
    causes: [
      'High pH alkaline soils',
      'High phosphorus application',
      'Flooded conditions (anaerobic)',
      'Sandy or calcareous soils',
      'Low organic matter',
    ],
    treatment: [
      'Apply zinc sulfate (ZnSO4) at 10-12 kg/acre',
      'Foliar spray of 0.5% zinc sulfate + 0.25% lime',
      'Soil application before final puddling',
      'Zinc oxide application at 5 kg/acre',
      'Chelated zinc for quick results',
    ],
    prevention: [
      'Apply zinc as basal dose',
      'Maintain optimal soil moisture',
      'Avoid excessive phosphorus',
      'Use zinc-coated urea',
      'Incorporate organic matter',
      'Apply zinc every 2-3 years in deficient areas',
    ],
    timing: 'Apply before transplanting or at first symptoms',
    criticalStages: 'Transplanting to tillering stage',
    imageUrl: '/images/deficiencies/zinc.jpg',
  },
  {
    id: 5,
    nutrient: 'Iron (Fe) - Toxicity',
    severity: 'High Impact',
    symptoms: [
      'Small brown spots on leaves that coalesce',
      'Bronzed or rusty appearance of foliage',
      'Reddish-brown discoloration',
      'Affects older leaves first',
      'Leaf tips and margins turn brown',
    ],
    visualSigns: [
      'Orange to brown speckling',
      'Leaves appear scorched or burnt',
      'Purple or reddish tinge on leaves',
      'Extensive leaf area covered with spots',
    ],
    causes: [
      'Poorly drained acidic soils (pH < 5.5)',
      'Waterlogged anaerobic conditions',
      'High organic matter in acidic soil',
      'Continuous flooding',
      'Reduction of ferric to ferrous iron',
    ],
    treatment: [
      'Improve drainage to oxidize soil',
      'Intermittent irrigation instead of continuous flooding',
      'Apply lime to raise pH to 6.0-6.5',
      'Apply potassium to counteract toxicity',
      'Use iron toxicity-tolerant varieties',
      'Mid-season drainage for aeration',
    ],
    prevention: [
      'Land leveling for proper drainage',
      'Avoid continuous deep flooding',
      'Apply lime before planting in acidic soils',
      'Use raised bed cultivation',
      'Incorporate rice straw to increase pH',
      'Plant tolerant varieties in problem areas',
    ],
    timing: 'Drainage and lime application before symptoms worsen',
    criticalStages: 'Mid-tillering to flowering',
    imageUrl: '/images/deficiencies/iron-toxicity.jpg',
  },
  {
    id: 6,
    nutrient: 'Sulfur (S)',
    severity: 'Medium Impact',
    symptoms: [
      'Uniform light green to yellow color (whole plant)',
      'Younger leaves more affected than old',
      'Stunted growth',
      'Thin stems',
      'Delayed flowering and maturity',
    ],
    visualSigns: [
      'Overall pale appearance',
      'Similar to nitrogen but affects young leaves',
      'No distinct patterns or spots',
      'Uniform chlorosis across plant',
    ],
    causes: [
      'Sandy soils with low sulfur',
      'Low organic matter',
      'High rainfall areas',
      'Use of sulfur-free fertilizers',
      'Reduced sulfur deposition from atmosphere',
    ],
    treatment: [
      'Apply ammonium sulfate (21-0-0-24S) at 25 kg/acre',
      'Use gypsum (calcium sulfate) at 50 kg/acre',
      'Apply elemental sulfur at 10 kg/acre',
      'Use single superphosphate (contains 12% S)',
      'Foliar spray of 2% ammonium sulfate',
    ],
    prevention: [
      'Use sulfur-containing fertilizers',
      'Apply organic manure',
      'Use ammonium sulfate instead of urea',
      'Apply gypsum in sulfur-deficient areas',
      'Regular soil testing for sulfur',
    ],
    timing: 'Apply at first symptoms or as preventive measure',
    criticalStages: 'Early vegetative stage',
    imageUrl: '/images/deficiencies/sulfur.jpg',
  },
]

export function DiseaseDetectionContent() {
  const { t } = useI18n()
  const [selectedDeficiency, setSelectedDeficiency] = useState<Deficiency | null>(null)

  const getSeverityColor = (severity: string) => {
    if (severity === 'High Impact') return 'destructive'
    return 'secondary'
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Rice Plant Nutritional Deficiencies
        </h1>
        <p className="text-muted-foreground mt-2">
          Learn to identify and treat common nutritional deficiencies in rice plants
        </p>
      </div>

      {/* Info Alert */}
      <Alert>
        <Beaker className="h-4 w-4" />
        <AlertDescription>
          <strong>Note:</strong> Below you'll find comprehensive information about common
          nutritional deficiencies and their treatments. AI-powered disease detection coming soon.
        </AlertDescription>
      </Alert>

      {/* Deficiencies Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {nutritionalDeficiencies.map((deficiency) => (
          <Card
            key={deficiency.id}
            className="h-full hover:shadow-lg transition-all hover:-translate-y-1 cursor-pointer overflow-hidden"
            onClick={() => setSelectedDeficiency(deficiency)}
          >
            {/* Image */}
            <div className="relative w-full h-40 bg-gradient-to-br from-slate-200 to-slate-300 flex items-center justify-center overflow-hidden">
              <img
                src={deficiency.imageUrl}
                alt={deficiency.nutrient}
                className="w-full h-full object-cover"
                onError={(e) => {
                  // Fallback to placeholder if image fails to load
                  e.currentTarget.style.display = 'none'
                }}
              />
              <Leaf className="h-12 w-12 text-slate-400 absolute" style={{ display: 'none' }} />
              <Badge
                variant={getSeverityColor(deficiency.severity) as any}
                className="absolute top-2 right-2"
              >
                {deficiency.severity}
              </Badge>
            </div>

            <CardHeader>
              <CardTitle className="text-lg">{deficiency.nutrient} Deficiency</CardTitle>
            </CardHeader>

            <CardContent className="space-y-3">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-2">
                  <strong>Key Symptoms:</strong>
                </p>
                <ul className="space-y-1">
                  {deficiency.symptoms.slice(0, 2).map((symptom, idx) => (
                    <li key={idx} className="text-sm text-muted-foreground flex gap-2">
                      <span>•</span>
                      <span>{symptom}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-2">
                <p className="text-xs text-primary font-semibold">
                  Critical Stage: {deficiency.criticalStages}
                </p>
              </div>

              <Button
                variant="outline"
                size="sm"
                className="w-full"
                onClick={(e) => {
                  e.stopPropagation()
                  setSelectedDeficiency(deficiency)
                }}
              >
                <Info className="h-4 w-4 mr-2" />
                View Complete Guide
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Detail Dialog */}
      <Dialog open={!!selectedDeficiency} onOpenChange={(open) => !open && setSelectedDeficiency(null)}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          {selectedDeficiency && (
            <>
              <DialogHeader>
                <div className="space-y-2">
                  <DialogTitle className="text-xl">
                    {selectedDeficiency.nutrient} Deficiency - Complete Guide
                  </DialogTitle>
                  <Badge variant={getSeverityColor(selectedDeficiency.severity) as any}>
                    {selectedDeficiency.severity}
                  </Badge>
                </div>
              </DialogHeader>

              <div className="space-y-6">
                {/* Deficiency Image */}
                <div className="w-full bg-slate-100 rounded-lg overflow-hidden flex items-center justify-center">
                  <img
                    src={selectedDeficiency.imageUrl}
                    alt={selectedDeficiency.nutrient}
                    className="w-full h-auto max-h-96 object-cover"
                  />
                </div>

                {/* Visual Signs */}
                <div className="bg-slate-50 rounded-lg p-4 space-y-3">
                  <h3 className="font-semibold flex items-center gap-2 text-primary">
                    <Zap className="h-4 w-4" />
                    Visual Signs
                  </h3>
                  <ul className="space-y-2">
                    {selectedDeficiency.visualSigns.map((sign, idx) => (
                      <li key={idx} className="text-sm flex gap-2">
                        <span className="text-muted-foreground">•</span>
                        <span>{sign}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* All Symptoms */}
                <div className="space-y-3">
                  <h3 className="font-semibold flex items-center gap-2">
                    <AlertCircle className="h-4 w-4 text-yellow-600" />
                    All Symptoms
                  </h3>
                  <ul className="space-y-2">
                    {selectedDeficiency.symptoms.map((symptom, idx) => (
                      <li key={idx} className="text-sm flex gap-2">
                        <span className="text-yellow-600">•</span>
                        <span>{symptom}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Common Causes */}
                <div className="space-y-3">
                  <h3 className="font-semibold flex items-center gap-2">
                    <Info className="h-4 w-4" />
                    Common Causes
                  </h3>
                  <ul className="space-y-2">
                    {selectedDeficiency.causes.map((cause, idx) => (
                      <li key={idx} className="text-sm flex gap-2">
                        <span>•</span>
                        <span>{cause}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Treatment */}
                <div className="space-y-3 bg-green-50 rounded-lg p-4">
                  <h3 className="font-semibold flex items-center gap-2 text-green-700">
                    <Pill className="h-4 w-4" />
                    Treatment Protocol
                  </h3>
                  <Alert variant="default" className="bg-green-100 border-green-300">
                    <AlertDescription className="text-sm">
                      <strong>Timing:</strong> {selectedDeficiency.timing}
                    </AlertDescription>
                  </Alert>
                  <ul className="space-y-2">
                    {selectedDeficiency.treatment.map((treatment, idx) => (
                      <li key={idx} className="text-sm flex gap-2">
                        <span className="text-green-700">•</span>
                        <span>{treatment}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Prevention */}
                <div className="space-y-3">
                  <h3 className="font-semibold flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-blue-600" />
                    Prevention Measures
                  </h3>
                  <ul className="space-y-2">
                    {selectedDeficiency.prevention.map((prevention, idx) => (
                      <li key={idx} className="text-sm flex gap-2">
                        <span className="text-blue-600">•</span>
                        <span>{prevention}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Critical Stages Alert */}
                <Alert variant="default">
                  <Shield className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Critical Growth Stages:</strong> {selectedDeficiency.criticalStages}
                  </AlertDescription>
                </Alert>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
