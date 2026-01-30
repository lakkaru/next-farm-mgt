'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface SeasonPlanDetailContentProps {
  planId: string
}

export function SeasonPlanDetailContent({ planId }: SeasonPlanDetailContentProps) {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Season Plan Details</h1>
      <Card>
        <CardHeader>
          <CardTitle>Plan Information</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Viewing plan ID: {planId}
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
