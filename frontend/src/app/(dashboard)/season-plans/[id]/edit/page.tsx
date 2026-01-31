import { EditSeasonPlanContent } from '@/components/season-plans/edit-season-plan-content'

interface PageProps {
  params: {
    id: string
  }
}

export default function EditSeasonPlanPage({ params }: PageProps) {
  return <EditSeasonPlanContent seasonPlanId={params.id} />
}
