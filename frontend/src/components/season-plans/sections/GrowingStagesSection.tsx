'use client'

import { AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Activity, CheckCircle, Clock, Calendar, FileText, Edit, Youtube } from 'lucide-react'
import { SeasonPlan } from '@/types/SeasonPlan'

interface GrowingStagesSectionProps {
  plan: SeasonPlan
  t: (key: string) => string
  formatDate: (date: string) => string
  getCompletedStages: () => number
  openStageDialog: (index: number) => void
  generateYouTubeSearchLink: (stageName: string) => string
}

export function GrowingStagesSection({
  plan,
  t,
  formatDate,
  getCompletedStages,
  openStageDialog,
  generateYouTubeSearchLink,
}: GrowingStagesSectionProps) {
  if (!plan.growingStages || plan.growingStages.length === 0) return null

  return (
    <AccordionItem value="growing-stages" className="border rounded-lg px-6">
      <AccordionTrigger className="hover:no-underline">
        <div className="flex items-center gap-3">
          <Activity className="h-5 w-5 text-primary" />
          <div className="flex items-center gap-4">
            <span className="font-semibold">{t('seasonPlans.growingStages')}</span>
            <Badge variant="secondary">
              {getCompletedStages()}/{plan.growingStages.length} {t('seasonPlans.completed')}
            </Badge>
          </div>
        </div>
      </AccordionTrigger>
      <AccordionContent className="pt-4">
        <div className="space-y-4">
          {plan.growingStages.map((stage, index) => (
            <div
              key={index}
              className={`rounded-lg border-2 transition-all overflow-hidden ${
                stage.isCompleted
                  ? 'bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-900'
                  : 'bg-muted/50 border-muted'
              }`}
            >
              <div className="flex items-start gap-4 p-4">
                <div className="flex-shrink-0 mt-1">
                  {stage.isCompleted ? (
                    <CheckCircle className="h-7 w-7 text-green-600" />
                  ) : (
                    <Clock className="h-7 w-7 text-muted-foreground" />
                  )}
                </div>
                <div className="flex-1 space-y-3">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <h3 className="font-bold text-lg mb-2">
                        {t(`seasonPlans.stages.${stage.stage}`)}
                      </h3>
                      
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Calendar className="h-4 w-4" />
                          <span className="font-medium">{t('seasonPlans.planned')}:</span>
                          <span>
                            {formatDate(stage.startDate)}
                            {stage.endDate && ` - ${formatDate(stage.endDate)}`}
                          </span>
                        </div>
                        
                        {stage.isCompleted && stage.implementedDate && (
                          <div className="flex items-center gap-2 text-sm">
                            <CheckCircle className="h-4 w-4 text-green-600" />
                            <span className="font-medium text-green-600">{t('seasonPlans.actual')}:</span>
                            <span className="text-green-600 font-medium">
                              {formatDate(stage.implementedDate)}
                              {stage.implementedEndDate && stage.implementedEndDate !== stage.implementedDate
                                ? ` - ${formatDate(stage.implementedEndDate)}`
                                : ''}
                            </span>
                          </div>
                        )}
                      </div>
                      
                      {stage.description && (
                        <p className="mt-2 text-sm text-foreground/80">
                          {stage.description}
                        </p>
                      )}
                    </div>
                    <Badge
                      variant={stage.isCompleted ? 'default' : 'secondary'}
                      className={stage.isCompleted ? 'bg-green-600' : ''}
                    >
                      {stage.isCompleted ? t('seasonPlans.completed') : t('seasonPlans.pending')}
                    </Badge>
                  </div>
                  
                  {stage.isCompleted && stage.implementationNotes && (
                    <div className="mt-4 p-4 bg-blue-100/50 dark:bg-blue-900/30 border-2 border-blue-300 dark:border-blue-700 rounded-lg shadow-sm">
                      <div className="flex items-start gap-2 mb-2">
                        <FileText className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                        <span className="text-base font-semibold text-blue-700 dark:text-blue-300">
                          {t('seasonPlans.implementationNotes')}:
                        </span>
                      </div>
                      <p className="text-sm text-gray-800 dark:text-gray-200 whitespace-pre-wrap leading-relaxed pl-7">
                        {stage.implementationNotes}
                      </p>
                    </div>
                  )}
                  
                  <div className="flex items-center gap-2 mt-3 pt-2 border-t">
                    <Button
                      variant="outline"
                      size="sm"
                      className="gap-2"
                      onClick={() => window.open(generateYouTubeSearchLink(stage.stage), '_blank')}
                    >
                      <Youtube className="h-4 w-4 text-red-600" />
                      {t('seasonPlans.learnMore')}
                    </Button>
                    {!stage.isCompleted && (
                      <Button
                        variant="default"
                        size="sm"
                        className="gap-2"
                        onClick={() => openStageDialog(index)}
                      >
                        <CheckCircle className="h-4 w-4" />
                        {t('seasonPlans.markComplete')}
                      </Button>
                    )}
                    {stage.isCompleted && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="gap-2"
                        onClick={() => openStageDialog(index)}
                      >
                        <Edit className="h-4 w-4" />
                        {t('seasonPlans.editImplementation')}
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </AccordionContent>
    </AccordionItem>
  )
}
