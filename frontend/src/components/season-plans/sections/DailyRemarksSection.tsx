'use client'

import { AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { FileText, Plus, Calendar, Edit, Trash2 } from 'lucide-react'
import Image from 'next/image'
import { SeasonPlan } from '@/types/SeasonPlan'

interface DailyRemarksSectionProps {
  plan: SeasonPlan
  t: (key: string) => string
  formatDate: (date: string) => string
  openRemarkDialog: (index?: number) => void
  deleteRemark: (index: number) => void
}

export function DailyRemarksSection({
  plan,
  t,
  formatDate,
  openRemarkDialog,
  deleteRemark,
}: DailyRemarksSectionProps) {
  return (
    <AccordionItem value="daily-remarks" className="border rounded-lg px-6">
      <AccordionTrigger className="hover:no-underline">
        <div className="flex items-center gap-3">
          <FileText className="h-5 w-5 text-primary" />
          <div className="flex items-center gap-4">
            <span className="font-semibold">{t('seasonPlans.dailyRemarks')}</span>
            {plan.dailyRemarks && plan.dailyRemarks.length > 0 && (
              <Badge variant="secondary">{plan.dailyRemarks.length} {t('seasonPlans.remarks')}</Badge>
            )}
          </div>
        </div>
      </AccordionTrigger>
      <AccordionContent className="pt-4">
        <div className="flex justify-end mb-3">
          <Button variant="outline" size="sm" className="gap-2" onClick={() => openRemarkDialog()}>
            <Plus className="h-4 w-4" />
            {t('seasonPlans.addRemark')}
          </Button>
        </div>
        {plan.dailyRemarks && plan.dailyRemarks.length > 0 ? (
          <div className="space-y-3">
            {plan.dailyRemarks
              .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
              .map((remark, index) => (
                <div
                  key={index}
                  className="relative pl-6 py-4 pr-4 border-l-4 border-primary/50 bg-muted/30 rounded-r-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="absolute left-0 top-4 w-3 h-3 bg-primary rounded-full -translate-x-[8.5px]"></div>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <p className="text-sm font-semibold text-muted-foreground">
                          {formatDate(remark.date)}
                        </p>
                        {remark.category && (
                          <Badge variant="outline" className="text-xs">
                            {remark.category}
                          </Badge>
                        )}
                      </div>
                      {remark.title && (
                        <p className="font-semibold text-base mb-1">{remark.title}</p>
                      )}
                      <p className="text-base leading-relaxed">{remark.description || remark.remark}</p>
                      {remark.images && remark.images.length > 0 && (
                        <div className="flex gap-2 mt-3 flex-wrap">
                          {remark.images.map((img, imgIndex) => {
                            // Use backend proxy route like avatar images do
                            // Backend will stream from R2 using r2Service
                            let imageUrl;

                            if (typeof img === 'string') {
                              // Legacy: direct URL string
                              imageUrl = img;
                            } else if (img.filename) {
                              // R2 images: use backend proxy endpoint (like avatar images)
                              // Backend proxy route: /season-plans/remark-image/{filename}
                              const backendUrl = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api').replace(/\/+$/, '');
                              // console.log('backend url, ', backendUrl )
                              // Encode filename to handle slashes and special characters (e.g. daily-remarks/...)
                              imageUrl = `${backendUrl}/season-plans/remark-image/${encodeURIComponent(img.filename)}`;
                              // console.log('imageUrl, ', imageUrl)
                            } else if (img.url) {
                              // Last fallback: try direct R2 URL
                              imageUrl = img.url;
                            }

                            // Skip if no valid URL
                            if (!imageUrl) {
                              console.warn('No valid image URL found:', img);
                              return null;
                            }

                            return (
                              <div
                                key={imgIndex}
                                className="relative rounded-lg overflow-hidden border cursor-pointer hover:border-primary transition-colors"
                                onClick={() => window.open(imageUrl, '_blank')}
                                title={img.originalName || img.filename || `Image ${imgIndex + 1}`}
                              >
                                <img
                                  src={imageUrl}
                                  alt={img.originalName || `Remark ${imgIndex + 1}`}
                                  className="w-[200px] h-[150px] object-cover bg-gray-100"
                                  onLoad={() => {
                                    console.log('✅ Image loaded successfully:', imageUrl);
                                  }}
                                  onError={(e) => {
                                    console.error('❌ Image failed to load:', imageUrl);
                                    console.error('Image filename:', img.filename);
                                    console.error('Image object:', img);
                                    // Replace with a simple gray placeholder
                                    const target = e.currentTarget as HTMLImageElement;
                                    target.style.display = 'none';
                                    const parent = target.parentElement;
                                    if (parent) {
                                      parent.classList.add('bg-gray-200', 'flex', 'items-center', 'justify-center');
                                      parent.innerHTML = '<span class="text-gray-400 text-xs">Image unavailable</span>';
                                    }
                                  }}
                                />
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                    <div className="flex gap-1">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openRemarkDialog(index)}
                      >
                        <Edit className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => deleteRemark(index)}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            <FileText className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p className="text-sm">{t('seasonPlans.noRemarks')}</p>
            <p className="text-xs mt-1">{t('seasonPlans.clickAddToStart')}</p>
          </div>
        )}
      </AccordionContent>
    </AccordionItem>
  )
}
