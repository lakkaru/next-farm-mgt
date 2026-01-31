'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useTranslation } from 'react-i18next'
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
import { Spinner } from '@/components/ui/spinner'
import { ArrowLeft, AlertCircle } from 'lucide-react'
import { farmAPI, locationAPI } from '@/lib/api'
import { toast } from 'sonner'

// District data
const SRI_LANKAN_DISTRICTS = [
  { name: 'Colombo', zone: 'WL1', province: 'Western' },
  { name: 'Gampaha', zone: 'WL1', province: 'Western' },
  { name: 'Kalutara', zone: 'WL2', province: 'Western' },
  { name: 'Kandy', zone: 'WM1', province: 'Central' },
  { name: 'Matale', zone: 'WM2', province: 'Central' },
  { name: 'Nuwara Eliya', zone: 'WU1', province: 'Central' },
  { name: 'Galle', zone: 'WL3', province: 'Southern' },
  { name: 'Matara', zone: 'WL3', province: 'Southern' },
  { name: 'Hambantota', zone: 'DL1', province: 'Southern' },
  { name: 'Jaffna', zone: 'DL2', province: 'Northern' },
  { name: 'Kilinochchi', zone: 'DL2', province: 'Northern' },
  { name: 'Mannar', zone: 'DL2', province: 'Northern' },
  { name: 'Vavuniya', zone: 'DL3', province: 'Northern' },
  { name: 'Mullaitivu', zone: 'DL2', province: 'Northern' },
  { name: 'Batticaloa', zone: 'DL1', province: 'Eastern' },
  { name: 'Ampara', zone: 'DL1', province: 'Eastern' },
  { name: 'Trincomalee', zone: 'DL1', province: 'Eastern' },
  { name: 'Kurunegala', zone: 'WM3', province: 'North Western' },
  { name: 'Puttalam', zone: 'DL1', province: 'North Western' },
  { name: 'Anuradhapura', zone: 'DL1', province: 'North Central' },
  { name: 'Polonnaruwa', zone: 'DL1', province: 'North Central' },
  { name: 'Badulla', zone: 'WM2', province: 'Uva' },
  { name: 'Moneragala', zone: 'DL3', province: 'Uva' },
  { name: 'Ratnapura', zone: 'WM3', province: 'Sabaragamuwa' },
  { name: 'Kegalle', zone: 'WM2', province: 'Sabaragamuwa' },
]

const ZONE_DESCRIPTIONS = {
  WL1: 'Wet Zone Low Country 1',
  WL2: 'Wet Zone Low Country 2',
  WL3: 'Wet Zone Low Country 3',
  WM1: 'Wet Zone Mid Country 1',
  WM2: 'Wet Zone Mid Country 2',
  WM3: 'Wet Zone Mid Country 3',
  WU1: 'Wet Zone Up Country 1',
  DL1: 'Dry Zone Low Country 1',
  DL2: 'Dry Zone Low Country 2',
  DL3: 'Dry Zone Low Country 3',
}

export function CreateFarmForm() {
  const { t } = useTranslation()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    farmType: 'crop',
    district: '',
    divisionalSecretariat: '',
    gramaNiladhariDivision: '',
    cultivationZone: '',
    location: {
      address: '',
      country: 'Sri Lanka',
      zipCode: '',
      coordinates: {
        latitude: '',
        longitude: '',
      },
    },
    totalArea: {
      value: '',
      unit: 'acres',
    },
    cultivatedArea: {
      value: '',
      unit: 'acres',
    },
  })

  const [divisionalSecretariats, setDivisionalSecretariats] = useState<string[]>([])
  const [gnDivisions, setGnDivisions] = useState<string[]>([])
  const [loadingLocations, setLoadingLocations] = useState(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target

    if (name.includes('.')) {
      const keys = name.split('.')
      setFormData((prev) => {
        const newData = { ...prev }
        let current: any = newData
        for (let i = 0; i < keys.length - 1; i++) {
          current = current[keys[i]]
        }
        current[keys[keys.length - 1]] = value
        return newData
      })
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }))
    }
    setError('')
  }

  const handleSelectChange = (name: string, value: string) => {
    if (name === 'district') {
      const selectedDistrict = SRI_LANKAN_DISTRICTS.find((d) => d.name === value)
      if (selectedDistrict) {
        setFormData((prev) => ({
          ...prev,
          district: value,
          cultivationZone: selectedDistrict.zone,
        }))
      }
      handleDistrictChange(value)
    } else if (name === 'divisionalSecretariat') {
      setFormData((prev) => ({
        ...prev,
        divisionalSecretariat: value,
        gramaNiladhariDivision: '',
      }))
      handleDSChange(value)
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }))
    }
    setError('')
  }

  const handleDistrictChange = async (district: string) => {
    if (!district) {
      setDivisionalSecretariats([])
      setGnDivisions([])
      return
    }

    try {
      setLoadingLocations(true)
      const response = await locationAPI.getDivisionalSecretariats(district)
      setDivisionalSecretariats(response.data?.data || [])
      setGnDivisions([])
    } catch (error) {
      console.error('Error loading divisional secretariats:', error)
      toast.error(t('farms.errors.loadingDS') || 'Failed to load divisional secretariats')
      setDivisionalSecretariats([])
    } finally {
      setLoadingLocations(false)
    }
  }

  const handleDSChange = async (ds: string) => {
    if (!ds || !formData.district) {
      setGnDivisions([])
      return
    }

    try {
      setLoadingLocations(true)
      const response = await locationAPI.getGramaNiladariDivisions(formData.district, ds)
      setGnDivisions(response.data?.data || [])
    } catch (error) {
      console.error('Error loading GN divisions:', error)
      toast.error(t('farms.errors.loadingGN') || 'Failed to load GN divisions')
      setGnDivisions([])
    } finally {
      setLoadingLocations(false)
    }
  }

  const isFormValid = () => {
    if (!formData.name || !String(formData.name).trim()) return false
    if (!formData.farmType) return false
    if (!formData.district) return false
    if (!formData.divisionalSecretariat) return false
    if (!formData.gramaNiladhariDivision) return false
    const totalAreaVal = Number(formData.totalArea?.value)
    if (!totalAreaVal || Number.isNaN(totalAreaVal) || totalAreaVal <= 0) return false
    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      if (!isFormValid()) {
        setError(t('farms.errors.fillRequired') || 'Please fill in all required fields')
        return
      }

      const farmData = {
        name: formData.name,
        description: formData.description,
        farmType: formData.farmType,
        district: formData.district,
        divisionalSecretariat: formData.divisionalSecretariat,
        gramaNiladhariDivision: formData.gramaNiladhariDivision,
        cultivationZone: formData.cultivationZone,
        location: {
          address: formData.location.address || formData.district,
          country: formData.location.country,
          zipCode: formData.location.zipCode || '00000',
          coordinates:
            formData.location.coordinates.latitude && formData.location.coordinates.longitude
              ? {
                  latitude: parseFloat(formData.location.coordinates.latitude),
                  longitude: parseFloat(formData.location.coordinates.longitude),
                }
              : undefined,
        },
        totalArea: {
          value: formData.totalArea.value ? parseFloat(formData.totalArea.value) : 0,
          unit: formData.totalArea.unit,
        },
        cultivatedArea: {
          value: formData.cultivatedArea.value ? parseFloat(formData.cultivatedArea.value) : undefined,
          unit: formData.cultivatedArea.unit,
        },
      }

      if (!farmData.location.coordinates) {
        delete farmData.location.coordinates
      }

      await farmAPI.createFarm(farmData)
      toast.success(t('farms.success.created') || 'Farm created successfully!')
      router.push('/dashboard')
    } catch (err: any) {
      console.error('Farm creation error:', err)

      let message = t('farms.errors.createFailed') || 'Failed to create farm'

      if (err.response) {
        if (err.response.status === 401) {
          message = t('farms.errors.sessionExpired') || 'Please log in again.'
        } else if (err.response.status === 403) {
          message = t('farms.errors.noPermission') || 'You do not have permission to create farms.'
        } else if (err.response.data?.message) {
          message = err.response.data.message
        }
      } else if (err.request) {
        message = t('farms.errors.networkError') || 'Network error. Please check your connection.'
      }

      setError(message)
      toast.error(message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-3xl font-bold">{t('farms.addNewFarm') || 'Add New Farm'}</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t('farms.basicInformation') || 'Basic Information'}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Info Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">
                  {t('farms.name') || 'Paddy Field Name'} <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder={t('farms.namePlaceholder') || 'e.g., Green Valley Farm'}
                  required
                />
              </div>
{/* 
              <div className="space-y-2">
                <Label htmlFor="farmType">
                  {t('farms.farmType') || 'Farm Type'} <span className="text-red-500">*</span>
                </Label>
                <Select value={formData.farmType} disabled>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="crop">{t('farms.farmTypes.crop') || 'Crop'}</SelectItem>
                  </SelectContent>
                </Select>
              </div> */}
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">{t('farms.description') || 'Description'}</Label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder={t('farms.descriptionPlaceholder') || 'Provide details about your farm...'}
                className="w-full h-24 px-3 py-2 border border-input rounded-md bg-background text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
              />
              <p className="text-xs text-muted-foreground">{t('farms.descriptionHelper') || 'Optional information'}</p>
            </div>

            {/* Location Section */}
            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold mb-4">{t('farms.locationInformation') || 'Location Information'}</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="district">
                    {t('farms.district') || 'District'} <span className="text-red-500">*</span>
                  </Label>
                  <Select value={formData.district} onValueChange={(value) => handleSelectChange('district', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder={t('farms.selectDistrict') || 'Select a district'} />
                    </SelectTrigger>
                    <SelectContent>
                      {SRI_LANKAN_DISTRICTS.sort((a, b) => a.name.localeCompare(b.name)).map((district) => (
                        <SelectItem key={district.name} value={district.name}>
                          {district.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="cultivationZone">{t('farms.cultivationZone') || 'Cultivation Zone'}</Label>
                  <Input
                    id="cultivationZone"
                    value={
                      formData.cultivationZone
                        ? `${formData.cultivationZone} - ${ZONE_DESCRIPTIONS[formData.cultivationZone as keyof typeof ZONE_DESCRIPTIONS]}`
                        : ''
                    }
                    readOnly
                    disabled
                  />
                  {!formData.cultivationZone && (
                    <p className="text-xs text-muted-foreground">{t('farms.selectDistrictFirst') || 'Select district first'}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="divisionalSecretariat">
                    {t('auth.divisionalSecretariat') || 'Divisional Secretariat'} <span className="text-red-500">*</span>
                  </Label>
                  <Select 
                    value={formData.divisionalSecretariat} 
                    onValueChange={(value) => handleSelectChange('divisionalSecretariat', value)}
                    disabled={!formData.district || loadingLocations}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={t('auth.selectDivisionalSecretariat') || 'Select DS'} />
                    </SelectTrigger>
                    <SelectContent>
                      {divisionalSecretariats.map((ds) => (
                        <SelectItem key={ds} value={ds}>
                          {ds}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {!formData.district && (
                    <p className="text-xs text-muted-foreground">{t('farms.selectDistrictFirst') || 'Select district first'}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="gramaNiladhariDivision">
                    {t('auth.gramaNiladhariDivision') || 'GN Division'} <span className="text-red-500">*</span>
                  </Label>
                  <Select 
                    value={formData.gramaNiladhariDivision} 
                    onValueChange={(value) => handleSelectChange('gramaNiladhariDivision', value)}
                    disabled={!formData.divisionalSecretariat || loadingLocations}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={t('auth.selectGNDivision') || 'Select GN'} />
                    </SelectTrigger>
                    <SelectContent>
                      {gnDivisions.map((gn) => (
                        <SelectItem key={gn} value={gn}>
                          {gn}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {!formData.divisionalSecretariat && (
                    <p className="text-xs text-muted-foreground">{t('farms.selectDivisionalSecretariatFirst') || 'Select DS first'}</p>
                  )}
                </div>
              </div>

              <div className="space-y-2 mt-4">
                <Label htmlFor="address">{t('farms.address') || 'Address'}</Label>
                <Input
                  id="address"
                  name="location.address"
                  value={formData.location.address}
                  onChange={handleInputChange}
                  placeholder={t('farms.addressPlaceholder') || 'Street address...'}
                />
                <p className="text-xs text-muted-foreground">{t('farms.addressHelper') || 'Optional: Provide specific address'}</p>
              </div>
            </div>

            {/* Area Information Section */}
            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold mb-4">{t('farms.areaInformation') || 'Area Information'}</h3>
              
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="totalAreaValue">
                      {t('farms.totalAreaValue') || 'Total Area'} <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="totalAreaValue"
                      name="totalArea.value"
                      type="number"
                      value={formData.totalArea.value}
                      onChange={handleInputChange}
                      placeholder="0.00"
                      min="0"
                      step="0.01"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="totalAreaUnit">
                      {t('farms.unit') || 'Unit'} <span className="text-red-500">*</span>
                    </Label>
                    <Select value={formData.totalArea.unit} onValueChange={(value) => handleSelectChange('totalArea.unit', value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="hectares">{t('farms.units.hectares') || 'Hectares'}</SelectItem>
                        <SelectItem value="acres">{t('farms.units.acres') || 'Acres'}</SelectItem>
                        <SelectItem value="perches">{t('farms.units.perches') || 'Perches'}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="cultivatedAreaValue">{t('farms.cultivatedAreaValue') || 'Cultivated Area'}</Label>
                    <Input
                      id="cultivatedAreaValue"
                      name="cultivatedArea.value"
                      type="number"
                      value={formData.cultivatedArea.value}
                      onChange={handleInputChange}
                      placeholder="0.00"
                      min="0"
                      step="0.01"
                    />
                    <p className="text-xs text-muted-foreground">{t('farms.cultivatedAreaHelper') || 'Optional'}</p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="cultivatedAreaUnit">{t('farms.unit') || 'Unit'}</Label>
                    <Select value={formData.cultivatedArea.unit} onValueChange={(value) => {
                      setFormData(prev => ({
                        ...prev,
                        cultivatedArea: {
                          ...prev.cultivatedArea,
                          unit: value
                        }
                      }))
                    }}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="hectares">{t('farms.units.hectares') || 'Hectares'}</SelectItem>
                        <SelectItem value="acres">{t('farms.units.acres') || 'Acres'}</SelectItem>
                        <SelectItem value="perches">{t('farms.units.perches') || 'Perches'}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="border-t pt-6 flex gap-3 flex-col sm:flex-row">
              <Button variant="outline" onClick={() => router.back()} disabled={loading} className="w-full sm:w-auto">
                {t('farms.cancel') || 'Cancel'}
              </Button>
              <Button type="submit" disabled={loading || !isFormValid()} className="w-full sm:w-auto">
                {loading && <Spinner className="mr-2 h-4 w-4" />}
                {loading ? t('farms.creating') || 'Creating...' : t('farms.createFarmButton') || 'Create Farm'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
