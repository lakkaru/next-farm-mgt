'use client'

import { FarmDetailContent } from '@/components/farms/farm-detail-content'

interface FarmDetailPageProps {
  params: { id: string }
}

export default function FarmDetailPage({ params }: FarmDetailPageProps) {
  return <FarmDetailContent farmId={params.id} />
}
