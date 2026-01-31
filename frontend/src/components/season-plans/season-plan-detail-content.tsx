'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { useTranslation } from 'react-i18next'
import { seasonPlanAPI } from '@/lib/api'
import { toast } from 'sonner'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Alert, AlertDescription } from '@/components/ui/alert'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Calendar,
  MapPin,
  Droplets,
  Mountain,
  Sprout,
  Edit,
  Trash2,
  ArrowLeft,
  CheckCircle,
  Clock,
  DollarSign,
  Leaf,
  AlertCircle,
} from 'lucide-react'

interface SeasonPlan {
  _id: string
  farmId: {
    _id: string
    name: string
    district?: string
  }
  season: string
  climateZone: string
  irrigationMethod: string
  plantingMethod: string
  paddyVariety: {
    _id: string
    name: string
  }
  cultivatingArea: number
  areaUnit: string
  cultivationDate: string
  transplantingDate?: string
  status: string
  expectedHarvest?: {
    date: string
    estimatedYield?: number
  }
  actualHarvest?: {
    date: string
    actualYield?: number
  }
  growingStages?: Array<{
    stage: string
    startDate: string
    endDate?: string
    completed: boolean
  }>
  fertilizerSchedule?: Array<{
    applicationDate: string
    fertilizerType: string
    quantity: number
    unit: string
    applied: boolean
  }>
  expenses?: Array<{
    category: string
    description: string
    amount: number
    date: string
  }>
  dailyRemarks?: Array<{
    date: string
    remark: string
  }>
}

interface SeasonPlanDetailContentProps {
  seasonPlanId: string
}

export function SeasonPlanDetailContent({ seasonPlanId }: SeasonPlanDetailContentProps) {
  const { t } = useTranslation()
  const router = useRouter()
  const [plan, setPlan] = useState<SeasonPlan | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [deleting, setDeleting] = useState(false)

  const loadSeasonPlan = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await seasonPlanAPI.getSeasonPlan(seasonPlanId)
      console.log('Season plan response:', response.data)
      const planData = response.data.data || response.data
      console.log('Plan data:', planData)
      setPlan(planData)
    } catch (err) {
      console.error('Error loading season plan:', err)
      setError(t('seasonPlans.errors.loadFailed'))
      toast.error(t('seasonPlans.errors.loadFailed'))
    } finally {
      setLoading(false)
    }
  }, [seasonPlanId, t])

  useEffect(() => {
    if (seasonPlanId) {
      loadSeasonPlan()
    }
  }, [seasonPlanId, loadSeasonPlan])

  const handleDelete = async () => {
    try {
      setDeleting(true)
      await seasonPlanAPI.deleteSeasonPlan(seasonPlanId)
      toast.success(t('seasonPlans.success.deleted'))
      router.push('/season-plans')
    } catch (err) {
      console.error('Error deleting season plan:', err)
      toast.error(t('seasonPlans.errors.deleteFailed'))
    } finally {
      setDeleting(false)
      setDeleteDialogOpen(false)
    }
  }

  const formatDate = (date: string) => {
    if (!date) return t('common.notSpecified')
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  const getStatusColor = (status: string) => {
    const colors: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
      planned: 'secondary',
      active: 'default',
      completed: 'default',
      cancelled: 'destructive',
    }
    return colors[status] || 'default'
  }

  const calculateTotalExpenses = () => {
    if (!plan?.expenses) return 0
    return plan.expenses.reduce((sum, expense) => sum + expense.amount, 0)
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-12 w-full" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Skeleton className="h-64 w-full" />
          <Skeleton className="h-64 w-full" />
        </div>
        <Skeleton className="h-64 w-full" />
      </div>
    )
  }

  if (error || !plan) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button
            onClick={() => router.push('/season-plans')}
            variant="outline"
            size="icon"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-2xl font-bold">{t('seasonPlans.seasonPlanDetails')}</h1>
        </div>
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error || t('seasonPlans.errors.notFound')}</AlertDescription>
        </Alert>
        <Button onClick={() => router.push('/season-plans')} variant="outline">
          <ArrowLeft className="mr-2 h-4 w-4" />
          {t('seasonPlans.backToList')}
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button
            onClick={() => router.push('/season-plans')}
            variant="outline"
            size="icon"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{plan.farmId?.name}</h1>
            <p className="text-muted-foreground">
              {t(`seasonPlans.seasons.${plan.season}`)} {t('seasonPlans.season')}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={() => router.push(`/season-plans/${seasonPlanId}/edit`)}
            variant="outline"
          >
            <Edit className="mr-2 h-4 w-4" />
            {t('seasonPlans.editPlan')}
          </Button>
          <Button onClick={() => setDeleteDialogOpen(true)} variant="destructive">
            <Trash2 className="mr-2 h-4 w-4" />
            {t('seasonPlans.deletePlan')}
          </Button>
        </div>
      </div>

      {/* Basic Information & Timeline */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>{t('seasonPlans.basicInfo')}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start gap-3">
              <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div className="flex-1">
                <p className="text-sm text-muted-foreground">{t('seasonPlans.farm')}</p>
                <p className="font-medium">{plan.farmId?.name}</p>
                {plan.farmId?.district && (
                  <p className="text-sm text-muted-foreground">{plan.farmId.district}</p>
                )}
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <Mountain className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div className="flex-1">
                <p className="text-sm text-muted-foreground">{t('seasonPlans.climateZone')}</p>
                <p className="font-medium">{plan.climateZone}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Droplets className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div className="flex-1">
                <p className="text-sm text-muted-foreground">{t('seasonPlans.irrigationMethod')}</p>
                <p className="font-medium">
                  {t(`seasonPlans.irrigationMethods.${plan.irrigationMethod}`)}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Sprout className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div className="flex-1">
                <p className="text-sm text-muted-foreground">{t('seasonPlans.plantingMethod')}</p>
                <p className="font-medium">
                  {t(`seasonPlans.plantingMethods.${plan.plantingMethod}`)}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Leaf className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div className="flex-1">
                <p className="text-sm text-muted-foreground">{t('seasonPlans.paddyVariety')}</p>
                <p className="font-medium">{plan.paddyVariety?.name || t('common.notSpecified')}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Mountain className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div className="flex-1">
                <p className="text-sm text-muted-foreground">{t('seasonPlans.cultivatingArea')}</p>
                <p className="font-medium">
                  {plan.cultivatingArea} {t(`seasonPlans.units.${plan.areaUnit}`)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Timeline */}
        <Card>
          <CardHeader>
            <CardTitle>{t('seasonPlans.timeline')}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start gap-3">
              <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div className="flex-1">
                <p className="text-sm text-muted-foreground">{t('seasonPlans.cultivationDate')}</p>
                <p className="font-medium">{formatDate(plan.cultivationDate)}</p>
              </div>
            </div>

            {plan.plantingMethod === 'transplanting' && plan.transplantingDate && (
              <div className="flex items-start gap-3">
                <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground">{t('seasonPlans.transplantingDate')}</p>
                  <p className="font-medium">{formatDate(plan.transplantingDate)}</p>
                </div>
              </div>
            )}

            {plan.expectedHarvest?.date && (
              <div className="flex items-start gap-3">
                <Clock className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground">{t('seasonPlans.expectedHarvest')}</p>
                  <p className="font-medium">{formatDate(plan.expectedHarvest.date)}</p>
                  {plan.expectedHarvest.estimatedYield && (
                    <p className="text-sm text-muted-foreground">
                      {t('seasonPlans.estimatedYield')}: {plan.expectedHarvest.estimatedYield} {t('seasonPlans.units.kg')}
                    </p>
                  )}
                </div>
              </div>
            )}

            {plan.actualHarvest?.date && (
              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground">{t('seasonPlans.actualHarvest')}</p>
                  <p className="font-medium">{formatDate(plan.actualHarvest.date)}</p>
                  {plan.actualHarvest.actualYield && (
                    <p className="text-sm text-muted-foreground">
                      {t('seasonPlans.actualYield')}: {plan.actualHarvest.actualYield} {t('seasonPlans.units.kg')}
                    </p>
                  )}
                </div>
              </div>
            )}

            <div className="flex items-center justify-between pt-4 border-t">
              <span className="text-sm font-medium">{t('seasonPlans.status')}</span>
              <Badge variant={getStatusColor(plan.status)}>
                {t(`seasonPlans.statuses.${plan.status}`)}
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Growing Stages */}
      {plan.growingStages && plan.growingStages.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>{t('seasonPlans.growingStages')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {plan.growingStages.map((stage, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    {stage.completed ? (
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    ) : (
                      <Clock className="h-5 w-5 text-muted-foreground" />
                    )}
                    <div>
                      <p className="font-medium">{t(`seasonPlans.stages.${stage.stage}`)}</p>
                      <p className="text-sm text-muted-foreground">
                        {formatDate(stage.startDate)}
                        {stage.endDate && ` - ${formatDate(stage.endDate)}`}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Fertilizer Schedule */}
      {plan.fertilizerSchedule && plan.fertilizerSchedule.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>{t('seasonPlans.fertilizerSchedule')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {plan.fertilizerSchedule.map((fertilizer, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <div>
                    <p className="font-medium">{fertilizer.fertilizerType}</p>
                    <p className="text-sm text-muted-foreground">
                      {formatDate(fertilizer.applicationDate)} • {fertilizer.quantity} {fertilizer.unit}
                    </p>
                  </div>
                  <Badge variant={fertilizer.applied ? 'default' : 'secondary'}>
                    {fertilizer.applied ? t('seasonPlans.applied') : t('seasonPlans.pending')}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Expenses */}
      {plan.expenses && plan.expenses.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>{t('seasonPlans.expenses')}</span>
              <span className="text-lg font-bold">
                {t('seasonPlans.total')}: Rs. {calculateTotalExpenses().toLocaleString()}
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {plan.expenses.map((expense, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <DollarSign className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">{expense.description}</p>
                      <p className="text-sm text-muted-foreground">
                        {t(`seasonPlans.expenseCategories.${expense.category}`)} • {formatDate(expense.date)}
                      </p>
                    </div>
                  </div>
                  <p className="font-semibold">Rs. {expense.amount.toLocaleString()}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Daily Remarks */}
      {plan.dailyRemarks && plan.dailyRemarks.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>{t('seasonPlans.dailyRemarks')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {plan.dailyRemarks.map((remark, index) => (
                <div key={index} className="p-3 border rounded-lg">
                  <p className="text-sm text-muted-foreground mb-1">{formatDate(remark.date)}</p>
                  <p>{remark.remark}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('seasonPlans.confirmDelete')}</DialogTitle>
            <DialogDescription>
              {t('seasonPlans.deleteWarning')}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
              disabled={deleting}
            >
              {t('common.cancel')}
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={deleting}
            >
              {deleting ? t('common.deleting') : t('common.delete')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
