'use client'

import { EditSeasonPlanForm } from '@/components/paddy/edit-season-plan-form'

interface EditSeasonPlanPageProps {
  params: { id: string }
}

export default function EditSeasonPlanPage({ params }: EditSeasonPlanPageProps) {
  return <EditSeasonPlanForm planId={params.id} />
}
