'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { useI18n } from '@/contexts/i18n-context'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Skeleton } from '@/components/ui/skeleton'
import { DatePicker } from '@/components/ui/date-picker'
import { seasonPlanAPI, paddyVarietyAPI, farmAPI } from '@/lib/api'
import { ArrowLeft, AlertCircle, Info } from 'lucide-react'
import Link from 'next/link'

interface Farm {
  _id: string
  name: string
  district?: string
  totalArea?: { value: number; unit: string }
}

interface PaddyVariety {
  _id: string
  name: string
  popularName?: string
  duration: string
  durationMonths?: number
  durationDays?: number
  type?: string
  characteristics?: {
    grainQuality?: {
      pericarpColour?: string
      grainShape?: string
    }
    pericarpColour?: string
    grainShape?: string
  }
}

export function CreateSeasonPlanForm() {
  const { t } = useI18n()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [dataLoading, setDataLoading] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  
  const [farms, setFarms] = useState<Farm[]>([])
  const [paddyVarieties, setPaddyVarieties] = useState<PaddyVariety[]>([])
  
  const [formData, setFormData] = useState({
    farmId: '',
    season: '',
    irrigationMethod: '',
    plantingMethod: '',
    paddyVariety: '',
    cultivatingArea: '',
    areaUnit: 'acres',
    cultivationDate: '',
    transplantingDate: '',
    expectedHarvestDate: '',
    soilP: '',
  })
  
  const [selectedFarmInfo, setSelectedFarmInfo] = useState({
    district: '',
    cultivationZone: '',
    totalArea: '',
    areaUnit: '',
  })

  const [calculationMode, setCalculationMode] = useState<'cultivation' | 'harvest'>('cultivation')

  const loadData = useCallback(async () => {
    try {
      setDataLoading(true)
      const [farmsRes, varietiesRes] = await Promise.all([
        farmAPI.getFarms(),
        paddyVarietyAPI.getPaddyVarieties(),
      ])
      
      setFarms(farmsRes.data.data || [])
      
      // Sort varieties by name
      const sorted = (varietiesRes.data.data || []).sort((a: PaddyVariety, b: PaddyVariety) =>
        a.name.localeCompare(b.name)
      )
      setPaddyVarieties(sorted)
    } catch (error) {
      console.error('Error loading data:', error)
      setError(t('seasonPlans.loadDataError'))
    } finally {
      setDataLoading(false)
    }
  }, [t])

  useEffect(() => {
    loadData()
  }, [loadData])

  const handleFarmChange = (farmId: string) => {
    const selectedFarm = farms.find(f => f._id === farmId)
    if (selectedFarm) {
      const farmArea = selectedFarm.totalArea?.value || 0
      const roundedArea = farmArea ? Math.round(farmArea * 100) / 100 : 0
      setSelectedFarmInfo({
        district: selectedFarm.district || '',
        cultivationZone: '',
        totalArea: roundedArea.toString(),
        areaUnit: selectedFarm.totalArea?.unit || 'acres',
      })
    }
    setFormData(prev => ({
      ...prev,
      farmId,
      areaUnit: selectedFarm?.totalArea?.unit || 'acres',
    }))
  }

  const handleVarietyChange = (varietyId: string) => {
    setFormData(prev => ({ ...prev, paddyVariety: varietyId }))
    
    // Recalculate dates based on current calculation mode
    if (calculationMode === 'cultivation' && formData.cultivationDate) {
      const variety = paddyVarieties.find(v => v._id === varietyId)
      if (variety?.duration) {
        const harvestDate = calculateHarvestDate(formData.cultivationDate, varietyId)
        setFormData(prev => ({ ...prev, expectedHarvestDate: harvestDate }))
      }
    } else if (calculationMode === 'harvest' && formData.expectedHarvestDate) {
      const variety = paddyVarieties.find(v => v._id === varietyId)
      if (variety?.duration) {
        const cultivationDate = calculateCultivationDate(formData.expectedHarvestDate, varietyId)
        setFormData(prev => ({ ...prev, cultivationDate: cultivationDate }))
      }
    }
  }

  const handleCultivationDateChange = (date: string) => {
    setFormData(prev => ({ ...prev, cultivationDate: date }))
    
    // Auto-calculate expected harvest date if variety is selected and in cultivation mode
    if (calculationMode === 'cultivation' && formData.paddyVariety) {
      const variety = paddyVarieties.find(v => v._id === formData.paddyVariety)
      if (variety?.duration) {
        const harvestDate = calculateHarvestDate(date, formData.paddyVariety)
        setFormData(prev => ({ ...prev, expectedHarvestDate: harvestDate }))
      }
    }
  }

  const handleHarvestDateChange = (date: string) => {
    setFormData(prev => ({ ...prev, expectedHarvestDate: date }))
    
    // Auto-calculate cultivation date if variety is selected and in harvest mode
    if (calculationMode === 'harvest' && formData.paddyVariety) {
      const variety = paddyVarieties.find(v => v._id === formData.paddyVariety)
      if (variety?.duration) {
        const cultivationDate = calculateCultivationDate(date, formData.paddyVariety)
        setFormData(prev => ({ ...prev, cultivationDate: cultivationDate }))
      }
    }
  }

  const handleCalculationModeChange = (mode: 'cultivation' | 'harvest') => {
    setCalculationMode(mode)
    
    // Recalculate based on new mode
    if (mode === 'cultivation' && formData.cultivationDate && formData.paddyVariety) {
      const harvestDate = calculateHarvestDate(formData.cultivationDate, formData.paddyVariety)
      setFormData(prev => ({ ...prev, expectedHarvestDate: harvestDate }))
    } else if (mode === 'harvest' && formData.expectedHarvestDate && formData.paddyVariety) {
      const cultivationDate = calculateCultivationDate(formData.expectedHarvestDate, formData.paddyVariety)
      setFormData(prev => ({ ...prev, cultivationDate: cultivationDate }))
    }
  }

  const calculateHarvestDate = (cultivationDate: string, varietyId: string) => {
    const selectedVariety = paddyVarieties.find(v => v._id === varietyId)
    if (selectedVariety && selectedVariety.duration) {
      const match = selectedVariety.duration.match(/(\d+)(?:-(\d+))?/)
      if (match) {
        const minDuration = parseInt(match[1])
        const maxDuration = match[2] ? parseInt(match[2]) : minDuration
        const avgDuration = Math.round((minDuration + maxDuration) / 2)
        
        const cultDate = new Date(cultivationDate)
        cultDate.setDate(cultDate.getDate() + avgDuration)
        return cultDate.toISOString().split('T')[0]
      }
    }
    return ''
  }

  const calculateCultivationDate = (harvestDate: string, varietyId: string) => {
    const selectedVariety = paddyVarieties.find(v => v._id === varietyId)
    if (selectedVariety && selectedVariety.duration) {
      const match = selectedVariety.duration.match(/(\d+)(?:-(\d+))?/)
      if (match) {
        const minDuration = parseInt(match[1])
        const maxDuration = match[2] ? parseInt(match[2]) : minDuration
        const avgDuration = Math.round((minDuration + maxDuration) / 2)
        
        const harvestDateObj = new Date(harvestDate)
        harvestDateObj.setDate(harvestDateObj.getDate() - avgDuration)
        return harvestDateObj.toISOString().split('T')[0]
      }
    }
    return ''
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess(false)

    // Validation
    if (!formData.farmId || !formData.season || !formData.irrigationMethod || 
        !formData.paddyVariety || !formData.cultivatingArea || !formData.cultivationDate) {
      setError(t('seasonPlans.requiredFieldsError'))
      return
    }

    if (formData.plantingMethod === 'transplanting' && !formData.transplantingDate) {
      setError(t('seasonPlans.transplantingDateRequired'))
      return
    }

    try {
      setLoading(true)
      
      const payload = {
        farmId: formData.farmId,
        season: formData.season,
        irrigationMethod: formData.irrigationMethod,
        plantingMethod: formData.plantingMethod,
        paddyVariety: formData.paddyVariety,
        cultivatingArea: parseFloat(formData.cultivatingArea),
        areaUnit: formData.areaUnit,
        cultivationDate: formData.cultivationDate,
        ...(formData.plantingMethod === 'transplanting' && formData.transplantingDate 
          ? { transplantingDate: formData.transplantingDate }
          : {}
        ),
        expectedHarvest: formData.expectedHarvestDate ? {
          date: formData.expectedHarvestDate,
        } : undefined,
        status: 'planned',
      }

      console.log('Payload being sent:', payload);
      await seasonPlanAPI.createSeasonPlan(payload)
      setSuccess(true)
      
      // Redirect after 2 seconds
      setTimeout(() => {
        router.push('/season-plans')
      }, 2000)
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to create season plan'
      console.error('Error creating season plan:', error)
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  if (dataLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-64" />
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-48" />
          </CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/season-plans">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <h1 className="text-2xl font-bold">{t('seasonPlans.createPlan')}</h1>
      </div>

      {success && (
        <Alert className="border-green-500 bg-green-50">
          <AlertCircle className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800">
            {t('seasonPlans.createSuccess')}
          </AlertDescription>
        </Alert>
      )}

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>{t('seasonPlans.seasonPlanDetails')}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Farm Selection */}
            <div className="space-y-2">
              <Label htmlFor="farmId">{t('seasonPlans.farm')} *</Label>
              <Select value={formData.farmId} onValueChange={handleFarmChange}>
                <SelectTrigger>
                  <SelectValue placeholder={t('common.select')} />
                </SelectTrigger>
                <SelectContent>
                  {farms.map(farm => (
                    <SelectItem key={farm._id} value={farm._id}>
                      {farm.name} {farm.district && `(${farm.district})`}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Show farm info when farm is selected */}
            {selectedFarmInfo.district && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-muted-foreground">{t('seasonPlans.district')}</Label>
                  <Input value={selectedFarmInfo.district} disabled />
                  <p className="text-xs text-muted-foreground">{t('seasonPlans.fromSelectedFarm')}</p>
                </div>
                
                {selectedFarmInfo.totalArea && (
                  <div className="space-y-2">
                    <Label className="text-muted-foreground">{t('seasonPlans.totalFarmArea')}</Label>
                    <Input value={`${selectedFarmInfo.totalArea} ${selectedFarmInfo.areaUnit}`} disabled />
                    <p className="text-xs text-muted-foreground">{t('seasonPlans.availableForCultivation')}</p>
                  </div>
                )}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Season */}
              <div className="space-y-2">
                <Label htmlFor="season">{t('seasonPlans.season')} *</Label>
                <Select value={formData.season} onValueChange={(value) => setFormData(prev => ({ ...prev, season: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder={t('common.select')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="maha">{t('seasonPlans.seasons.maha')}</SelectItem>
                    <SelectItem value="yala">{t('seasonPlans.seasons.yala')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Irrigation Method */}
              <div className="space-y-2">
                <Label htmlFor="irrigationMethod">{t('seasonPlans.irrigationMethod')} *</Label>
                <Select value={formData.irrigationMethod} onValueChange={(value) => setFormData(prev => ({ ...prev, irrigationMethod: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder={t('common.select')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="rain_fed">{t('common.irrigationMethods.rainFed')}</SelectItem>
                    <SelectItem value="under_irrigation">{t('common.irrigationMethods.irrigated')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Planting Method */}
            <div className="space-y-2">
              <Label htmlFor="plantingMethod">{t('seasonPlans.plantingMethod')} *</Label>
              <Select value={formData.plantingMethod} onValueChange={(value) => setFormData(prev => ({ ...prev, plantingMethod: value, transplantingDate: '' }))}>
                <SelectTrigger>
                    <SelectValue placeholder={t('common.select')} />
                  </SelectTrigger>
                <SelectContent>
                  <SelectItem value="direct_seeding">{t('seasonPlans.plantingMethods.directSeeding')}</SelectItem>
                  <SelectItem value="transplanting">{t('seasonPlans.plantingMethods.transplanting')}</SelectItem>
                  <SelectItem value="parachute_seeding">{t('seasonPlans.plantingMethods.parachuteSeeding')}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Paddy Variety */}
            <div className="space-y-2">
              <Label htmlFor="paddyVariety">{t('seasonPlans.paddyVariety')} *</Label>
              <Select value={formData.paddyVariety} onValueChange={handleVarietyChange}>
                <SelectTrigger>
                  <SelectValue placeholder={t('common.select')} />
                </SelectTrigger>
                <SelectContent>
                  {paddyVarieties.map(variety => {
                    const color = variety.characteristics?.grainQuality?.pericarpColour || 
                                 variety.characteristics?.pericarpColour
                    const shape = variety.characteristics?.grainQuality?.grainShape || 
                                 variety.characteristics?.grainShape
                    const durationDisplay = variety.durationMonths 
                      ? `${variety.durationMonths} ${t('paddyVarieties.monthsUnit')} (${Math.round(variety.durationDays || 0)} ${t('paddyVarieties.daysUnit')})`
                      : variety.duration
                    
                    return (
                      <SelectItem key={variety._id} value={variety._id}>
                        <div className="flex flex-col py-1">
                          <span className="font-medium">
                            {variety.name}
                            {variety.popularName && ` (${variety.popularName})`}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {durationDisplay}
                            {color && ` • ${t('paddyVarieties.grainColorLabel')} ${t(`paddyVarieties.colors.${color.toLowerCase()}`) || color}`}
                            {shape && ` • ${t('paddyVarieties.grainSizeLabel')} ${t(`paddyVarieties.grainSizes.${shape.toLowerCase().replace(/\s+/g, '_')}`) || shape}`}
                          </span>
                        </div>
                      </SelectItem>
                    )
                  })}
                </SelectContent>
              </Select>
              {!dataLoading && paddyVarieties.length === 0 && (
                <p className="text-xs text-red-500">{t('seasonPlans.noPaddyVarietiesFound')}</p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Cultivating Area */}
              <div className="space-y-2">
                <Label htmlFor="cultivatingArea">{t('seasonPlans.cultivatingArea')} *</Label>
                <Input
                  id="cultivatingArea"
                  type="number"
                  step="0.01"
                  placeholder={t('common.enterArea')}
                  value={formData.cultivatingArea}
                  onChange={(e) => setFormData(prev => ({ ...prev, cultivatingArea: e.target.value }))}
                />
                {selectedFarmInfo.totalArea && formData.cultivatingArea && (
                  <p className={`text-xs ${
                    parseFloat(formData.cultivatingArea) > parseFloat(selectedFarmInfo.totalArea) && formData.areaUnit === selectedFarmInfo.areaUnit
                      ? 'text-destructive font-medium'
                      : 'text-muted-foreground'
                  }`}>
                    {parseFloat(formData.cultivatingArea) > parseFloat(selectedFarmInfo.totalArea) && formData.areaUnit === selectedFarmInfo.areaUnit
                      ? t('seasonPlans.exceedsFarmArea', {
                        totalArea: selectedFarmInfo.totalArea,
                        areaUnit: selectedFarmInfo.areaUnit,
                      })
                      : t('seasonPlans.unitFarmArea', {
                        areaUnit: formData.areaUnit,
                        totalArea: selectedFarmInfo.totalArea,
                        farmAreaUnit: selectedFarmInfo.areaUnit,
                      })
                    }
                  </p>
                )}
                {!selectedFarmInfo.totalArea && (
                  <p className="text-xs text-muted-foreground">
                    {t('common.unit')}: {formData.areaUnit}
                  </p>
                )}
              </div>
            </div>

            {/* Date Calculation Mode */}
            <div className="space-y-3 bg-blue-50 p-4 rounded-lg border border-blue-200">
              <Label className="text-sm font-medium">{t('seasonPlans.createForm.datePlanning')}</Label>
              <p className="text-xs text-muted-foreground">{t('seasonPlans.createForm.datePlanningSubtitle')}</p>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant={calculationMode === 'cultivation' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => handleCalculationModeChange('cultivation')}
                  className="flex-1"
                >
                  {t('seasonPlans.createForm.setCultivationDate')}
                </Button>
                <Button
                  type="button"
                  variant={calculationMode === 'harvest' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => handleCalculationModeChange('harvest')}
                  className="flex-1"
                >
                  {t('seasonPlans.createForm.setHarvestDate')}
                </Button>
              </div>
            </div>

            {/* Cultivation & Harvest Dates (Side by side) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Cultivation Date */}
              <div className="space-y-2">
                <Label htmlFor="cultivationDate" className={calculationMode === 'harvest' ? 'text-muted-foreground' : ''}>
                  {t('seasonPlans.cultivationDate')} *
                  {calculationMode === 'harvest' && (
                    <span className="text-xs ml-1 text-muted-foreground">({t('seasonPlans.autoCalculatedHint') || 'Auto-calculated'})</span>
                  )}
                </Label>
                <div className={calculationMode === 'harvest' ? 'opacity-60 pointer-events-none' : ''}>
                  <DatePicker
                    value={formData.cultivationDate}
                    onChange={handleCultivationDateChange}
                    placeholder={t('seasonPlans.cultivationDate')}
                    disabled={calculationMode === 'harvest'}
                  />
                </div>
              </div>

              {/* Expected Harvest Date */}
              <div className="space-y-2">
                <Label htmlFor="expectedHarvestDate" className={calculationMode === 'cultivation' ? 'text-muted-foreground' : ''}>
                  {t('seasonPlans.expectedHarvestDate')}
                  {calculationMode === 'cultivation' && (
                    <span className="text-xs ml-1 text-muted-foreground">({t('seasonPlans.autoCalculatedHint') || 'Auto-calculated'})</span>
                  )}
                </Label>
                <div className={calculationMode === 'cultivation' ? 'opacity-60 pointer-events-none' : ''}>
                  <DatePicker
                    value={formData.expectedHarvestDate}
                    onChange={handleHarvestDateChange}
                    placeholder={t('seasonPlans.expectedHarvestDate')}
                    disabled={calculationMode === 'cultivation'}
                  />
                </div>
              </div>
            </div>

            {/* Transplanting Date (conditional) */}
            {formData.plantingMethod === 'transplanting' && (
              <div className="space-y-2">
                <Label htmlFor="transplantingDate">{t('seasonPlans.transplantingDate')} *</Label>
                <DatePicker
                  value={formData.transplantingDate}
                  onChange={(date) => setFormData(prev => ({ ...prev, transplantingDate: date }))}
                  placeholder={t('seasonPlans.transplantingDate')}
                />
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  <Info className="h-3 w-3" />
                  {t('seasonPlans.transplantingDateHint')}
                </p>
              </div>
            )}

            {/* Submit Buttons */}
            <div className="flex gap-3 pt-4">
              <Button type="submit" disabled={loading}>
                {loading ? t('seasonPlans.creating') : t('seasonPlans.createSeasonPlan')}
              </Button>
              <Link href="/season-plans">
                <Button type="button" variant="outline">{t('common.cancel')}</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  )
}
