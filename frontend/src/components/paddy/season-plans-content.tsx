'use client'

import { useCallback, useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { useI18n } from '@/contexts/i18n-context'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Skeleton } from '@/components/ui/skeleton'
import { seasonPlanAPI } from '@/lib/api'
import {
  Plus,
  Calendar,
  MapPin,
  Droplets,
  Sprout,
  TrendingUp,
  AlertCircle,
  X,
} from 'lucide-react'

interface SeasonPlan {
  _id: string
  farmId: {
    _id: string
    name: string
    district?: string
  }
  season: string
  status: string
  cultivatingArea: number
  areaUnit: string
  irrigationMethod: string
  plantingMethod: string
  cultivationDate: string
  transplantingDate?: string
  paddyVariety?: {
    name: string
  }
  expectedHarvest?: {
    date: string
    estimatedYield?: number
  }
  actualHarvest?: {
    date: string
    actualYield?: number
  }
  growingStages?: Array<{ completed: boolean }>
}

export function SeasonPlansContent() {
  const { t } = useI18n()
  const router = useRouter()
  const searchParams = useSearchParams()
  const statusFilter = searchParams?.get('status') || ''
  
  const [plans, setPlans] = useState<SeasonPlan[]>([])
  const [loading, setLoading] = useState(true)

  const loadSeasonPlans = useCallback(async () => {
    try {
      setLoading(true)
      const response = await seasonPlanAPI.getSeasonPlans({})
      const allPlans = response.data.data || []
      
      // Apply status filter client-side
      const filteredPlans = statusFilter 
        ? allPlans.filter((plan: SeasonPlan) => plan.status === statusFilter)
        : allPlans
      
      setPlans(filteredPlans)
    } catch (error) {
      console.error('Error loading season plans:', error)
      setPlans([])
    } finally {
      setLoading(false)
    }
  }, [statusFilter])

  useEffect(() => {
    loadSeasonPlans()
  }, [loadSeasonPlans])

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      planned: 'secondary',
      active: 'default',
      completed: 'success',
      cancelled: 'destructive',
    }
    return colors[status] || 'secondary'
  }

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  const calculatePlantAge = (seedingDate: string) => {
    const now = new Date()
    const seeding = new Date(seedingDate)
    const diffTime = Math.abs(now.getTime() - seeding.getTime())
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  const calculateDaysToHarvest = (harvestDate: string) => {
    const now = new Date()
    const harvest = new Date(harvestDate)
    const diffTime = harvest.getTime() - now.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  const getSeedingDate = (plan: SeasonPlan) => {
    if (plan.plantingMethod === 'transplanting' && plan.transplantingDate) {
      return plan.transplantingDate
    }
    return plan.cultivationDate
  }

  const clearFilter = () => {
    router.push('/paddy/season-plans')
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-64" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-64" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">{t('seasonPlans.title')}</h1>
        </div>
        <Link href="/paddy/season-plans/create">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            {t('seasonPlans.createPlan')}
          </Button>
        </Link>
      </div>

      {/* Status Filter Alert */}
      {statusFilter && (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="flex items-center justify-between">
            <span>
              Filtering by status: <strong>{statusFilter}</strong>
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilter}
              className="h-6 px-2"
            >
              <X className="h-3 w-3 mr-1" />
              Clear filter
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {/* Plans Grid */}
      {plans.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Sprout className="h-16 w-16 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">
              {statusFilter
                ? `No ${statusFilter} season plans found`
                : t('seasonPlans.noSeasonPlansFound')}
            </h3>
            <p className="text-muted-foreground mb-4">
              {statusFilter
                ? 'Try removing the filter to see all plans'
                : 'Get started by creating your first season plan'}
            </p>
            {!statusFilter && (
              <Link href="/paddy/season-plans/create">
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  {t('seasonPlans.createFirstSeasonPlan')}
                </Button>
              </Link>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {plans.map((plan) => {
            const seedingDate = getSeedingDate(plan)
            const plantAge = plan.status === 'active' ? calculatePlantAge(seedingDate) : null
            const daysToHarvest =
              plan.status === 'active' && plan.expectedHarvest?.date
                ? calculateDaysToHarvest(plan.expectedHarvest.date)
                : null

            return (
              <Link key={plan._id} href={`/paddy/season-plans/${plan._id}`}>
                <Card className="h-full hover:shadow-lg transition-all cursor-pointer border-l-4" style={{
                  borderLeftColor:
                    plan.status === 'completed' ? '#22c55e' :
                    plan.status === 'active' ? '#3b82f6' :
                    plan.status === 'cancelled' ? '#ef4444' : '#eab308'
                }}>
                  <CardHeader>
                    <div className="space-y-2">
                      <CardTitle className="text-lg">
                        {plan.farmId?.name || 'Unknown Farm'}
                      </CardTitle>
                      <div className="flex gap-2">
                        <Badge
                          variant={plan.season === 'maha' ? 'default' : 'secondary'}
                        >
                          {plan.season.toUpperCase()}
                        </Badge>
                        <Badge variant={getStatusColor(plan.status) as any}>
                          {plan.status.toUpperCase()}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="space-y-2 text-sm">
                      {plan.farmId?.district && (
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <MapPin className="h-4 w-4" />
                          <span>{plan.farmId.district}</span>
                        </div>
                      )}
                      
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Droplets className="h-4 w-4" />
                        <span>{plan.irrigationMethod}</span>
                      </div>
                      
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        <span>
                          {plan.plantingMethod === 'transplanting' && plan.transplantingDate
                            ? `Transplanting: ${formatDate(plan.transplantingDate)}`
                            : `Seeding: ${formatDate(plan.cultivationDate)}`}
                        </span>
                      </div>

                      {plantAge !== null && (
                        <div className="flex items-center gap-2 text-primary font-medium">
                          <Sprout className="h-4 w-4" />
                          <span>Plant age: {plantAge} days</span>
                        </div>
                      )}

                      {daysToHarvest !== null && (
                        <div className="flex items-center gap-2 text-green-600 font-medium">
                          <Calendar className="h-4 w-4" />
                          <span>
                            {daysToHarvest > 0
                              ? `Harvest in ${daysToHarvest} days`
                              : 'Harvest due'}
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="pt-2 border-t space-y-1 text-sm">
                      <div>
                        <strong>Area:</strong> {plan.cultivatingArea} {plan.areaUnit}
                      </div>
                      <div>
                        <strong>Variety:</strong> {plan.paddyVariety?.name || 'Not specified'}
                      </div>
                      {plan.expectedHarvest?.date && (
                        <div className="text-primary">
                          <strong>Expected:</strong> {formatDate(plan.expectedHarvest.date)}
                          {plan.expectedHarvest.estimatedYield && (
                            <span> ({plan.expectedHarvest.estimatedYield} tons)</span>
                          )}
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}
