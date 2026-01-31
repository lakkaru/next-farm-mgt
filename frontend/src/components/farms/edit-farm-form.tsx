'use client'

import { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { ArrowLeft, AlertCircle, Loader2 } from 'lucide-react'
import { farmAPI, locationAPI } from '@/lib/api'
import { toast } from 'sonner'
import { SRI_LANKAN_DISTRICTS, ZONE_DESCRIPTIONS } from '@/constants/districts'

interface Farm {
  _id: string
  name: string
  farmType?: string
  description?: string
  district?: string
  cultivationZone?: string
  divisionalSecretariat?: string
  gramaNiladhariDivision?: string
  address?: string
  totalArea?: { value: number; unit: string }
  cultivatedArea?: { value: number; unit: string }
}

interface FormData {
  name: string
  farmType: string
  description: string
  district: string
  cultivationZone: string
  divisionalSecretariat: string
  gramaNiladhariDivision: string
  address: string
  totalAreaValue: string
  totalAreaUnit: string
  cultivatedAreaValue: string
  cultivatedAreaUnit: string
}

interface EditFarmFormProps {
  farmId: string
}

export function EditFarmForm({ farmId }: EditFarmFormProps) {
  const router = useRouter()
  const [farm, setFarm] = useState<Farm | null>(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [divisionalSecretariats, setDivisionalSecretariats] = useState<string[]>([])
  const [gnDivisions, setGnDivisions] = useState<string[]>([])
  const [formData, setFormData] = useState<FormData>({
    name: '',
    farmType: 'crop',
    description: '',
    district: '',
    cultivationZone: '',
    divisionalSecretariat: '',
    gramaNiladhariDivision: '',
    address: '',
    totalAreaValue: '',
    totalAreaUnit: 'hectares',
    cultivatedAreaValue: '',
    cultivatedAreaUnit: 'hectares',
  })

  const loadFarm = useCallback(async () => {
    try {
      setLoading(true)
      setError('')
      const response = await farmAPI.getFarm(farmId)
      const farmData = response.data.data || response.data
      setFarm(farmData)

      // Pre-populate form
      setFormData({
        name: farmData.name || '',
        farmType: farmData.farmType || 'crop',
        description: farmData.description || '',
        district: farmData.district || '',
        cultivationZone: farmData.cultivationZone || '',
        divisionalSecretariat: farmData.divisionalSecretariat || '',
        gramaNiladhariDivision: farmData.gramaNiladhariDivision || '',
        address: farmData.address || '',
        totalAreaValue: farmData.totalArea?.value?.toString() || '',
        totalAreaUnit: farmData.totalArea?.unit || 'hectares',
        cultivatedAreaValue: farmData.cultivatedArea?.value?.toString() || '',
        cultivatedAreaUnit: farmData.cultivatedArea?.unit || 'hectares',
      })

      // Load location data if district is set
      if (farmData.district) {
        await loadDivisionalSecretariats(farmData.district)
        if (farmData.divisionalSecretariat) {
          await loadGnDivisions(farmData.district, farmData.divisionalSecretariat)
        }
      }
    } catch (err) {
      console.error('Error loading farm:', err)
      setError('Failed to load farm details')
      toast.error('Failed to load farm details')
    } finally {
      setLoading(false)
    }
  }, [farmId])

  const loadDivisionalSecretariats = async (district: string) => {
    try {
      const response = await locationAPI.getDivisionalSecretariats(district)
      setDivisionalSecretariats(response.data?.data || [])
    } catch (err) {
      console.error('Error loading divisional secretariats:', err)
      toast.error('Failed to load divisional secretariats')
    }
  }

  const loadGnDivisions = async (district: string, ds: string) => {
    try {
      const response = await locationAPI.getGramaNiladariDivisions(district, ds)
      setGnDivisions(response.data?.data || [])
    } catch (err) {
      console.error('Error loading GN divisions:', err)
      toast.error('Failed to load GN divisions')
    }
  }

  useEffect(() => {
    loadFarm()
  }, [loadFarm])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = async (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))

    if (name === 'district') {
      setFormData((prev) => ({
        ...prev,
        cultivationZone: ZONE_DESCRIPTIONS[value] || '',
        divisionalSecretariat: '',
        gramaNiladhariDivision: '',
      }))
      setGnDivisions([])
      await loadDivisionalSecretariats(value)
    } else if (name === 'divisionalSecretariat') {
      setFormData((prev) => ({ ...prev, gramaNiladhariDivision: '' }))
      await loadGnDivisions(formData.district, value)
    }
  }

  const isFormValid = () => {
    return (
      formData.name.trim() &&
      formData.farmType &&
      formData.district &&
      formData.divisionalSecretariat &&
      formData.gramaNiladhariDivision &&
      formData.totalAreaValue
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!isFormValid()) {
      setError('Please fill in all required fields')
      return
    }

    try {
      setSubmitting(true)
      setError('')

      const updateData = {
        name: formData.name,
        farmType: formData.farmType,
        description: formData.description,
        district: formData.district,
        cultivationZone: formData.cultivationZone,
        divisionalSecretariat: formData.divisionalSecretariat,
        gramaNiladhariDivision: formData.gramaNiladhariDivision,
        address: formData.address,
        totalArea: {
          value: parseFloat(formData.totalAreaValue),
          unit: formData.totalAreaUnit,
        },
        ...(formData.cultivatedAreaValue && {
          cultivatedArea: {
            value: parseFloat(formData.cultivatedAreaValue),
            unit: formData.cultivatedAreaUnit,
          },
        }),
      }

      await farmAPI.updateFarm(farmId, updateData)
      toast.success('Farm updated successfully!')
      router.push(`/farms/${farmId}`)
    } catch (err) {
      console.error('Error updating farm:', err)
      setError('Failed to update farm. Please try again.')
      toast.error('Failed to update farm')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-48" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Skeleton key={i} className="h-12" />
          ))}
        </div>
      </div>
    )
  }

  if (error && !farm) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-2xl font-bold">Edit Farm</h1>
        </div>
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-2xl font-bold">Edit Farm</h1>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <form onSubmit={handleSubmit}>
        {/* Basic Information */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="name">Paddy Field Name *</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="e.g., Green Valley Farm"
                required
              />
            </div>

            <div>
              <Label htmlFor="farmType">Farm Type *</Label>
              <Select value={formData.farmType} onValueChange={(value) => handleSelectChange('farmType', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select farm type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="crop">Crop</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Provide details about your farm..."
                rows={4}
              />
              <p className="text-xs text-muted-foreground mt-1">Optional information</p>
            </div>
          </CardContent>
        </Card>

        {/* Location Information */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Location Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="district">District *</Label>
              <Select value={formData.district} onValueChange={(value) => handleSelectChange('district', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a district" />
                </SelectTrigger>
                <SelectContent>
                  {SRI_LANKAN_DISTRICTS.map((district) => (
                    <SelectItem key={district.name} value={district.name}>
                      {district.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="cultivationZone">Cultivation Zone</Label>
              <Input
                id="cultivationZone"
                name="cultivationZone"
                value={formData.cultivationZone}
                readOnly
                placeholder="Auto-populated based on district"
              />
            </div>

            <div>
              <Label htmlFor="divisionalSecretariat">Divisional Secretariat *</Label>
              <Select
                value={formData.divisionalSecretariat}
                onValueChange={(value) => handleSelectChange('divisionalSecretariat', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder={formData.district ? 'Select DS' : 'Select district first'} />
                </SelectTrigger>
                <SelectContent>
                  {divisionalSecretariats.map((ds) => (
                    <SelectItem key={ds} value={ds}>
                      {ds}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="gramaNiladhariDivision">Grama Niladhari Division *</Label>
              <Select
                value={formData.gramaNiladhariDivision}
                onValueChange={(value) => handleSelectChange('gramaNiladhariDivision', value)}
              >
                <SelectTrigger>
                  <SelectValue
                    placeholder={formData.divisionalSecretariat ? 'Select GN Division' : 'Select DS first'}
                  />
                </SelectTrigger>
                <SelectContent>
                  {gnDivisions.map((gn) => (
                    <SelectItem key={gn} value={gn}>
                      {gn}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="address">Address</Label>
              <Input
                id="address"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                placeholder="Street address..."
              />
              <p className="text-xs text-muted-foreground mt-1">Optional: Provide specific address</p>
            </div>
          </CardContent>
        </Card>

        {/* Area Information */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Area Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="totalAreaValue">Total Area *</Label>
                <Input
                  id="totalAreaValue"
                  name="totalAreaValue"
                  type="number"
                  step="0.01"
                  value={formData.totalAreaValue}
                  onChange={handleInputChange}
                  placeholder="Enter value"
                  required
                />
              </div>

              <div>
                <Label htmlFor="totalAreaUnit">Unit *</Label>
                <Select value={formData.totalAreaUnit} onValueChange={(value) => setFormData((prev) => ({ ...prev, totalAreaUnit: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Unit" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="hectares">Hectares</SelectItem>
                    <SelectItem value="acres">Acres</SelectItem>
                    <SelectItem value="perches">Perches</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="cultivatedAreaValue">Cultivated Area</Label>
                <Input
                  id="cultivatedAreaValue"
                  name="cultivatedAreaValue"
                  type="number"
                  step="0.01"
                  value={formData.cultivatedAreaValue}
                  onChange={handleInputChange}
                  placeholder="Enter value"
                />
                <p className="text-xs text-muted-foreground mt-1">Optional</p>
              </div>

              <div>
                <Label htmlFor="cultivatedAreaUnit">Unit</Label>
                <Select value={formData.cultivatedAreaUnit} onValueChange={(value) => setFormData((prev) => ({ ...prev, cultivatedAreaUnit: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Unit" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="hectares">Hectares</SelectItem>
                    <SelectItem value="acres">Acres</SelectItem>
                    <SelectItem value="perches">Perches</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex gap-4">
          <Button type="button" variant="outline" onClick={() => router.back()}>
            Cancel
          </Button>
          <Button type="submit" disabled={submitting}>
            {submitting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
            {submitting ? 'Updating...' : 'Update Farm'}
          </Button>
        </div>
      </form>
    </div>
  )
}
