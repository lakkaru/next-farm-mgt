// import { SeasonPlanDetailContent } from '@/components/season-plans/season-plan-detail-content'
import { SeasonPlanDetailContent } from '@/components/season-plans/season-plan-detail-content'

interface PageProps {
  params: {
    id: string
  }
}

export default function SeasonPlanDetailPage({ params }: PageProps) {
  return <SeasonPlanDetailContent planId={params.id} />
}
