'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface FarmDetailContentProps {
  farmId: string
}

export function FarmDetailContent({ farmId }: FarmDetailContentProps) {
  const router = useRouter()

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-2xl font-bold">Farm Details</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Farm Information</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Viewing farm ID: {farmId}
          </p>
          {/* TODO: Implement full farm detail view */}
        </CardContent>
      </Card>
    </div>
  )
}
