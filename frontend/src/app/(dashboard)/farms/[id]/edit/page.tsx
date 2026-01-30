'use client'

import { EditFarmForm } from '@/components/farms/edit-farm-form'

interface EditFarmPageProps {
  params: { id: string }
}

export default function EditFarmPage({ params }: EditFarmPageProps) {
  return <EditFarmForm farmId={params.id} />
}
