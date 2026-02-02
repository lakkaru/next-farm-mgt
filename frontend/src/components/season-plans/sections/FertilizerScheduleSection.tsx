'use client'

import { AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Beaker, Calendar, CheckCircle, Edit, Trash2, Leaf, FileText } from 'lucide-react'
import { SeasonPlan } from '@/types/SeasonPlan'

interface FertilizerScheduleSectionProps {
  plan: SeasonPlan
  t: (key: string) => string
  formatDate: (date: string) => string
  openFertilizerDialog: (index: number) => void
  deleteFertilizerApplication: (index: number) => void
  setLccDialog: (open: boolean) => void
}

export function FertilizerScheduleSection({
  plan,
  t,
  formatDate,
  openFertilizerDialog,
  deleteFertilizerApplication,
  setLccDialog,
}: FertilizerScheduleSectionProps) {
  if (!plan.fertilizerSchedule || plan.fertilizerSchedule.length === 0) return null

  return (
    <AccordionItem value="fertilizer-schedule" className="border rounded-lg px-6">
      <AccordionTrigger className="hover:no-underline">
        <div className="flex items-center gap-3">
          <Beaker className="h-5 w-5 text-primary" />
          <div className="flex items-center gap-4">
            <span className="font-semibold">{t('seasonPlans.fertilizerSchedule')}</span>
            <Badge variant="secondary">
              {plan.fertilizerSchedule.filter((app) => app.applied).length}/
              {plan.fertilizerSchedule.length} {t('seasonPlans.applied')}
            </Badge>
          </div>
        </div>
      </AccordionTrigger>
      <AccordionContent className="pt-4">
        <div className="flex justify-end mb-3">
          <Button variant="outline" size="sm" className="gap-2" onClick={() => setLccDialog(true)}>
            <Leaf className="h-4 w-4" />
            {t('seasonPlans.lccCalculator')}
          </Button>
        </div>
        <div className="space-y-3">
          {plan.fertilizerSchedule.map((app, index) => (
            <div
              key={index}
              className={`flex items-start gap-4 p-4 rounded-lg border-2 transition-all ${
                app.applied
                  ? 'bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-900'
                  : 'bg-muted/50 border-muted'
              }`}
            >
              <div className="flex-shrink-0 mt-1">
                <Beaker
                  className={`h-6 w-6 ${
                    app.applied ? 'text-green-600' : 'text-muted-foreground'
                  }`}
                />
              </div>
              <div className="flex-1 space-y-2">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <h3 className="font-bold text-lg">{app.stage}</h3>
                    
                    <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                      <Calendar className="h-3.5 w-3.5" />
                      <span className="font-medium">{t('seasonPlans.scheduled')}:</span>
                      <span>{formatDate(app.date)}</span>
                    </div>
                    
                    {app.applied && app.implementedDate && (
                      <div className="flex items-center gap-2 mt-1 text-sm text-green-600">
                        <CheckCircle className="h-3.5 w-3.5" />
                        <span className="font-medium">{t('seasonPlans.implemented')}:</span>
                        <span>{formatDate(app.implementedDate)}</span>
                      </div>
                    )}
                    
                    {app.description && (
                      <p className="mt-2 text-sm text-foreground/80 leading-relaxed">
                        {app.description}
                      </p>
                    )}
                    
                    <div className="mt-3 space-y-1">
                      {app.fertilizers && (
                        <div className='flex justify-between items-center'>
                          <div>
                            <div className="text-sm font-medium">
                              {t('common.perFieldKg')}:
                            </div>
                            {Object.entries(app.fertilizers.perFieldKg || {}).map(
                              ([fertilizer, quantity]) => (
                                <div className="text-sm" key={fertilizer}>
                                  <span className="font-medium">{t(`seasonPlans.${fertilizer}`)}:</span> {quantity}
                                </div>
                              )
                            )}
                          </div>
                          <div>
                            <div className="text-sm font-medium">
                              {t('common.recommendedPerHa')}:
                            </div>
                            {Object.entries(app.fertilizers.recommendedPerHa || {}).map(
                              ([fertilizer, quantity]) => (
                                <div className="text-sm" key={fertilizer}>
                                  <span className="font-medium">{t(`seasonPlans.${fertilizer}`)}:</span> {quantity}
                                </div>
                              )
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                    
                    {app.notes && (
                      <div className="mt-3 p-3 bg-pink-50 dark:bg-pink-950/20 border-l-4 border-pink-400 rounded">
                        <div className="flex items-start gap-2">
                          <FileText className="h-4 w-4 text-pink-600 mt-0.5 flex-shrink-0" />
                          <div>
                            <span className="text-sm font-medium text-pink-700 dark:text-pink-300">
                              {t('seasonPlans.notes')}:
                            </span>
                            <p className="text-sm text-pink-600 dark:text-pink-400 mt-1">
                              {t(app.notes)}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge
                      variant={app.applied ? 'default' : 'secondary'}
                      className={app.applied ? 'bg-green-600' : ''}
                    >
                      {app.applied ? t('seasonPlans.applied') : t('seasonPlans.pending')}
                    </Badge>
                  </div>
                </div>
                <div className="flex items-center gap-2 mt-3">
                  {!app.applied && (
                    <Button
                      variant="default"
                      size="sm"
                      className="gap-2"
                      onClick={() => openFertilizerDialog(index)}
                    >
                      <CheckCircle className="h-4 w-4" />
                      {t('seasonPlans.markApplied')}
                    </Button>
                  )}
                  {app.applied && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="gap-2"
                      onClick={() => openFertilizerDialog(index)}
                    >
                      <Edit className="h-4 w-4" />
                      {t('seasonPlans.editImplementation')}
                    </Button>
                  )}
                  <Button
                    variant="destructive"
                    size="sm"
                    className="gap-2"
                    onClick={() => deleteFertilizerApplication(index)}
                  >
                    <Trash2 className="h-4 w-4" />
                    {t('common.delete')}
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </AccordionContent>
    </AccordionItem>
  )
}
