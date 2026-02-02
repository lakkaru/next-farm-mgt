'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { 
  ArrowLeft, 
  Edit, 
  Trash2, 
  MapPin, 
  Mountain, 
  Droplets, 
  Sprout, 
  Leaf, 
  TrendingUp,
  CalendarDays,
  Calendar,
  CheckCircle
} from 'lucide-react'
import { SeasonPlan } from '@/types/SeasonPlan'

interface SeasonPlanHeaderProps {
  plan: SeasonPlan
  t: (key: string) => string
  formatDate: (date: string) => string
  getStatusColor: (status: string) => 'default' | 'secondary' | 'destructive' | 'outline'
  getCompletedStages: () => number
  getProgressPercentage: () => number
  openHarvestDialog: () => void
  onEdit: () => void
  onDelete: () => void
  onBack: () => void
}

export function SeasonPlanHeader({
  plan,
  t,
  formatDate,
  getStatusColor,
  getCompletedStages,
  getProgressPercentage,
  openHarvestDialog,
  onEdit,
  onDelete,
  onBack,
}: SeasonPlanHeaderProps) {
  return (
    <>
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button onClick={onBack} variant="outline" size="icon">
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
          <Button onClick={onEdit} variant="outline">
            <Edit className="mr-2 h-4 w-4" />
            {t('seasonPlans.editPlan')}
          </Button>
          <Button onClick={onDelete} variant="destructive">
            <Trash2 className="mr-2 h-4 w-4" />
            {t('seasonPlans.deletePlan')}
          </Button>
        </div>
      </div>

      {/* Status Badge and Progress */}
      <div className="flex items-center gap-4">
        <Badge variant={getStatusColor(plan.status || 'planned')} className="text-sm px-3 py-1">
          {t(`seasonPlans.statuses.${plan.status}`)}
        </Badge>
        {plan.growingStages && plan.growingStages.length > 0 && (
          <div className="flex items-center gap-2 flex-1 max-w-md">
            <Progress value={getProgressPercentage()} className="h-2" />
            <span className="text-sm text-muted-foreground whitespace-nowrap">
              {getCompletedStages()}/{plan.growingStages.length}
            </span>
          </div>
        )}
      </div>

      {/* Basic Information & Timeline */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              {t('seasonPlans.basicInfo')}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 gap-4">
              <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                <MapPin className="h-5 w-5 text-primary" />
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground">{t('seasonPlans.farm')}</p>
                  <p className="font-medium">{plan.farmId?.name}</p>
                  {plan.farmId?.district && (
                    <p className="text-xs text-muted-foreground">{plan.farmId.district}</p>
                  )}
                </div>
              </div>
            
              <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                <Mountain className="h-5 w-5 text-primary" />
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground">{t('seasonPlans.climateZone')}</p>
                  <p className="font-medium">{plan.climateZone}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                <Droplets className="h-5 w-5 text-primary" />
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground">{t('seasonPlans.irrigationMethod')}</p>
                  <p className="font-medium">
                    {t(`common.irrigationMethods.${plan.irrigationMethod}`)}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                <Sprout className="h-5 w-5 text-primary" />
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground">{t('seasonPlans.plantingMethod')}</p>
                  <p className="font-medium">
                    {t(`common.plantingMethods.${plan.plantingMethod}`)}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                <Leaf className="h-5 w-5 text-primary" />
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground">{t('seasonPlans.paddyVariety')}</p>
                  <p className="font-medium">{plan.paddyVariety?.name}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                <TrendingUp className="h-5 w-5 text-primary" />
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground">{t('seasonPlans.cultivatingArea')}</p>
                  <p className="font-medium">
                    {plan.cultivatingArea} {t(`seasonPlans.units.${plan.areaUnit}`)}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CalendarDays className="h-5 w-5" />
              {t('seasonPlans.timeline')}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-4">
              <div className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                <Calendar className="h-5 w-5 text-primary mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground">{t('seasonPlans.cultivationDate')}</p>
                  <p className="font-medium">{formatDate(plan.cultivationDate || '')}</p>
                </div>
              </div>

              {plan.transplantingDate && (
                <div className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                  <Sprout className="h-5 w-5 text-primary mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm text-muted-foreground">{t('seasonPlans.transplantingDate')}</p>
                    <p className="font-medium">{formatDate(plan.transplantingDate)}</p>
                  </div>
                </div>
              )}

              {plan.expectedHarvestDate && (
                <div className="flex items-start gap-3 p-3 bg-green-50 dark:bg-green-950/20 rounded-lg border border-green-200 dark:border-green-900">
                  <TrendingUp className="h-5 w-5 text-green-600 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm text-muted-foreground">{t('seasonPlans.expectedHarvest')}</p>
                    <p className="font-medium">{formatDate(plan.expectedHarvestDate)}</p>
                    {plan.estimatedYield && (
                      <p className="text-sm text-green-600 font-medium mt-1">
                        {t('seasonPlans.estimatedYield')}: {plan.estimatedYield} kg
                      </p>
                    )}
                  </div>
                </div>
              )}

              {plan.actualHarvestDate && (
                <div className="flex items-start gap-3 p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-900">
                  <CheckCircle className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm text-muted-foreground">{t('seasonPlans.actualHarvest')}</p>
                    <p className="font-medium">{formatDate(plan.actualHarvestDate)}</p>
                    {plan.actualYield && (
                      <p className="text-sm text-blue-600 font-medium mt-1">
                        {t('seasonPlans.actualYield')}: {plan.actualYield} kg
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>

            {!plan.actualHarvestDate && (
              <div className="pt-2">
                <Button variant="default" className="w-full gap-2" onClick={openHarvestDialog}>
                  <TrendingUp className="h-4 w-4" />
                  {t('seasonPlans.recordHarvest')}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  )
}
