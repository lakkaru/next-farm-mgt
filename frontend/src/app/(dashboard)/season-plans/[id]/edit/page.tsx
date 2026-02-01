'use client'

import EditSeasonPlanContent from '@/components/season-plans/edit-season-plan-content'

interface EditSeasonPlanPageProps {
  params: { id: string }
}

export default function EditSeasonPlanPage({ params }: EditSeasonPlanPageProps) {
  return <EditSeasonPlanContent id={params.id} />
}
