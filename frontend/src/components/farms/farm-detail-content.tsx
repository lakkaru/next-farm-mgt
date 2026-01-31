'use client'

import { useEffect, useState, useCallback } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { ArrowLeft, Pencil, AlertCircle } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { farmAPI } from '@/lib/api'
import { formatArea } from '@/lib/utils'
import { toast } from 'sonner'

interface Farm {
  _id: string
  name: string
  farmType?: string
  type?: string
  description?: string
  district?: string
  cultivationZone?: string
  divisionalSecretariat?: string
  gramaNiladhariDivision?: string
  address?: string
  totalArea?: number | { value: number; unit: string }
  area?: number | { value: number; unit: string }
  cultivatedArea?: number | { value: number; unit: string }
  owner?: {
    _id: string
    email: string
    profile?: {
      firstName: string
      lastName: string
    }
    contact?: {
      phone: string
    }
  }
  managers?: Array<{
    _id: string
    email: string
    profile?: {
      firstName: string
      lastName: string
    }
  }>
  createdAt?: string
  updatedAt?: string
}

interface FarmDetailContentProps {
  farmId: string
}

const farmTypeColors: Record<string, string> = {
  crop: 'bg-green-100 text-green-800',
  livestock: 'bg-yellow-100 text-yellow-800',
  mixed: 'bg-blue-100 text-blue-800',
  aquaculture: 'bg-cyan-100 text-cyan-800',
  poultry: 'bg-purple-100 text-purple-800',
}

export function FarmDetailContent({ farmId }: FarmDetailContentProps) {
  const router = useRouter()
  const [farm, setFarm] = useState<Farm | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const loadFarm = useCallback(async () => {
    try {
      setLoading(true)
      setError('')
      const response = await farmAPI.getFarm(farmId)
      setFarm(response.data.data || response.data)
    } catch (err) {
      console.error('Error loading farm:', err)
      setError('Failed to load farm details')
      toast.error('Failed to load farm details')
    } finally {
      setLoading(false)
    }
  }, [farmId])

  useEffect(() => {
    if (farmId) {
      loadFarm()
    }
  }, [farmId, loadFarm])

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-48" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-64" />
          ))}
        </div>
      </div>
    )
  }

  if (error || !farm) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-2xl font-bold">Farm Details</h1>
        </div>
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-6 flex items-center gap-3">
            <AlertCircle className="h-5 w-5 text-red-600" />
            <div>
              <p className="font-medium text-red-900">{error || 'Farm not found'}</p>
              <p className="text-sm text-red-700">Please go back and try again</p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold">{farm.name}</h1>
            <p className="text-muted-foreground mt-1">
              {farm.district && farm.cultivationZone
                ? `${farm.district}, ${farm.cultivationZone}`
                : farm.district || 'Location not specified'}
            </p>
          </div>
        </div>
        <Button onClick={() => router.push(`/farms/${farmId}/edit`)} className="gap-2">
          <Pencil className="h-4 w-4" />
          Edit Farm
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Farm Type</p>
              <Badge className={`mt-2 ${farmTypeColors[farm.farmType || farm.type || ''] || 'bg-gray-100 text-gray-800'}`}>
                {farm.farmType || farm.type || 'Not specified'}
              </Badge>
            </div>

            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Area</p>
              <p className="mt-1 text-base">{formatArea(farm.totalArea || farm.area)}</p>
            </div>

            {farm.cultivatedArea && (
              <div>
                <p className="text-sm font-medium text-muted-foreground">Cultivated Area</p>
                <p className="mt-1 text-base">{formatArea(farm.cultivatedArea)}</p>
              </div>
            )}

            {farm.description && (
              <div>
                <p className="text-sm font-medium text-muted-foreground">Description</p>
                <p className="mt-1 text-sm text-foreground whitespace-pre-wrap">{farm.description}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Location Information */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Location Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {farm.district && (
              <div>
                <p className="text-sm font-medium text-muted-foreground">District</p>
                <p className="mt-1 text-base">{farm.district}</p>
              </div>
            )}

            {farm.cultivationZone && (
              <div>
                <p className="text-sm font-medium text-muted-foreground">Cultivation Zone</p>
                <p className="mt-1 text-base">{farm.cultivationZone}</p>
              </div>
            )}

            {farm.divisionalSecretariat && (
              <div>
                <p className="text-sm font-medium text-muted-foreground">Divisional Secretariat</p>
                <p className="mt-1 text-base">{farm.divisionalSecretariat}</p>
              </div>
            )}

            {farm.gramaNiladhariDivision && (
              <div>
                <p className="text-sm font-medium text-muted-foreground">Grama Niladhari Division</p>
                <p className="mt-1 text-base">{farm.gramaNiladhariDivision}</p>
              </div>
            )}

            {farm.address && (
              <div>
                <p className="text-sm font-medium text-muted-foreground">Address</p>
                <p className="mt-1 text-base">{farm.address}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Owner Information */}
        {farm.owner && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Owner Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Name</p>
                <p className="mt-1 text-base">
                  {farm.owner.profile?.firstName} {farm.owner.profile?.lastName}
                </p>
              </div>

              <div>
                <p className="text-sm font-medium text-muted-foreground">Email</p>
                <p className="mt-1 text-base">{farm.owner.email}</p>
              </div>

              {farm.owner.contact?.phone && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Phone</p>
                  <p className="mt-1 text-base">{farm.owner.contact.phone}</p>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Managers Information */}
        {farm.managers && farm.managers.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Farm Managers</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {farm.managers.map((manager, idx) => (
                <div key={manager._id} className={idx > 0 ? 'border-t pt-4' : ''}>
                  <p className="text-sm font-medium text-muted-foreground">Manager {idx + 1}</p>
                  <p className="mt-1 text-base">
                    {manager.profile?.firstName} {manager.profile?.lastName}
                  </p>
                  <p className="text-sm text-muted-foreground">{manager.email}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {/* Additional Information */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Additional Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {farm.createdAt && (
              <div>
                <p className="text-sm font-medium text-muted-foreground">Created On</p>
                <p className="mt-1 text-base">{new Date(farm.createdAt).toLocaleDateString()}</p>
              </div>
            )}

            {farm.updatedAt && (
              <div>
                <p className="text-sm font-medium text-muted-foreground">Last Updated</p>
                <p className="mt-1 text-base">{new Date(farm.updatedAt).toLocaleDateString()}</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
