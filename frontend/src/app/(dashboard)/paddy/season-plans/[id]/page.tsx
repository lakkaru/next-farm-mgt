'use client'

import { SeasonPlanDetailContent } from '@/components/paddy/season-plan-detail-content'

interface SeasonPlanDetailPageProps {
  params: { id: string }
}

export default function SeasonPlanDetailPage({ params }: SeasonPlanDetailPageProps) {
  return <SeasonPlanDetailContent planId={params.id} />
}
